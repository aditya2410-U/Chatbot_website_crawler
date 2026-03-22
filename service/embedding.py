import requests
import time
from pymongo import MongoClient
from chunk_text import chunk_text
from dotenv import load_dotenv
import os

load_dotenv()

HF_TOKEN = os.getenv("HF_TOKEN")
MONGODB_URI = os.getenv("MONGODB_URI", "mongodb://localhost:27017")
DB_NAME = os.getenv("MONGODB_DB", "thinkai_crawler")

API_URL = "https://router.huggingface.co/hf-inference/models/sentence-transformers/all-mpnet-base-v2/pipeline/feature-extraction"
HF_HEADERS = {"Authorization": f"Bearer {HF_TOKEN}"}

MAX_RETRIES = 3
RETRY_BACKOFF = 2.0  # seconds

# Synchronous pymongo client (used only in this module for blocking HF embed work)
_sync_client: MongoClient = None

def _get_sync_db():
    global _sync_client
    if _sync_client is None:
        _sync_client = MongoClient(MONGODB_URI)
    return _sync_client[DB_NAME]


def get_hf_embedding(text: str) -> list:
    """Fetch embedding vector from HuggingFace with retry logic."""
    for attempt in range(1, MAX_RETRIES + 1):
        try:
            response = requests.post(
                API_URL,
                headers=HF_HEADERS,
                json={"inputs": text},
                timeout=30,
            )
            response.raise_for_status()
            return response.json()[0]
        except requests.exceptions.RequestException as e:
            print(f"[Embedding] Attempt {attempt}/{MAX_RETRIES} failed: {e}")
            if attempt < MAX_RETRIES:
                time.sleep(RETRY_BACKOFF * attempt)
    print("[Embedding] All retries exhausted — returning empty vector.")
    return []


def embed_and_store_chunks(session_id: str):
    """
    Fetch all crawled pages for a session (sync pymongo), chunk text,
    generate HuggingFace embeddings, and store results back in MongoDB.
    """
    db = _get_sync_db()
    crawled_col = db["crawled_data"]
    chunks_col = db["site_chunks"]

    pages = list(crawled_col.find({"session_id": session_id}))
    print(f"[Embedding] Processing {len(pages)} pages for session {session_id}")

    docs_to_insert = []
    for page in pages:
        chunks = chunk_text(page["content"])
        for chunk in chunks:
            embedding_vector = get_hf_embedding(chunk)
            if embedding_vector:
                docs_to_insert.append(
                    {
                        "session_id": session_id,
                        "url": page["url"],
                        "chunk_text": chunk,
                        "embedding": embedding_vector,
                    }
                )
                time.sleep(0.4)  # HuggingFace rate limiting

    if docs_to_insert:
        chunks_col.insert_many(docs_to_insert)
        print(f"[Embedding] Stored {len(docs_to_insert)} chunks for session {session_id}")
    else:
        print("[Embedding] No chunks embedded — check HF_TOKEN and crawled content.")
