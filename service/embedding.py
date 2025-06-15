import requests
import time
from chunk_text import chunk_text  # Your custom chunking logic
from database import CrawledData, SessionLocal  # SQLAlchemy setup
from models.chunk import SiteChunk  # Your ORM model for storing embeddings

from dotenv import load_dotenv
import os

load_dotenv()
HF_TOKEN = os.getenv("HF_TOKEN")

# 🌐 Updated API endpoint for embeddings
API_URL = "https://router.huggingface.co/hf-inference/models/sentence-transformers/all-mpnet-base-v2/pipeline/feature-extraction"
headers = {"Authorization": f"Bearer {HF_TOKEN}"}

# 🔧 Function to get embedding from Hugging Face
def get_hf_embedding(text: str) -> list:
    try:
        payload = {"inputs": text}
        response = requests.post(API_URL, headers=headers, json=payload)
        response.raise_for_status()
        return response.json()[0]  # Return the embedding vector
    except requests.exceptions.RequestException as e:
        print(f"Error fetching embedding: {e}")
        return []

# 🧠 Main function to embed and store chunks in DB
def embed_and_store_chunks(session_id: int):
    db = SessionLocal()
    try:
        crawled_pages = db.query(CrawledData).filter(CrawledData.session_id == session_id).all()
        for page in crawled_pages:
            chunks = chunk_text(page.content)
            print(f"Chunks for {page.url}: {chunks}")
            for chunk in chunks:
                embedding_vector = get_hf_embedding(chunk)
                if embedding_vector:  # Only store if embedding succeeded
                    chunk_record = SiteChunk(
                        url=page.url,
                        chunk_text=chunk,
                        embedding=embedding_vector,
                        session_id=session_id
                    )
                    db.add(chunk_record)
                    time.sleep(0.5)  # Avoid hitting rate limits
        db.commit()
    except Exception as e:
        db.rollback()
        print(f"Error embedding and storing chunks: {e}")
    finally:
        db.close()
        print("Database session closed.")
