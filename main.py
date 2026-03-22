from datetime import datetime, timezone
from contextlib import asynccontextmanager
from bson import ObjectId

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, HttpUrl
import numpy as np
import os

from dotenv import load_dotenv
load_dotenv()

from api.request.chatRequest import ChatRequestModel
from crawler import SimpleCrawler
from database_mongo import (
    close_db, get_client,
    crawl_sessions_col, crawled_data_col, site_chunks_col,
    DB_NAME
)
from service.embedding import embed_and_store_chunks, get_hf_embedding
from service.gemini_call import call_gemini_api

# ─── Startup / Shutdown ──────────────────────────────────────────────────────

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Verify MongoDB connection on startup
    try:
        await get_client().admin.command("ping")
        print("✅ MongoDB connection verified.")
    except Exception as e:
        print(f"❌ MongoDB connection failed: {e}")
    yield
    await close_db()
    print("MongoDB client closed.")

app = FastAPI(title="ThinkAI Crawler", version="2.0.0", lifespan=lifespan)

# ─── CORS ────────────────────────────────────────────────────────────────────

allowed_origins_raw = os.getenv("ALLOWED_ORIGINS", "*")
allowed_origins = [o.strip() for o in allowed_origins_raw.split(",")] if allowed_origins_raw != "*" else ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ─── Request Models ───────────────────────────────────────────────────────────

class CrawlRequest(BaseModel):
    url: HttpUrl
    max_depth: int = 2

# ─── Routes ───────────────────────────────────────────────────────────────────

@app.post("/crawl")
async def crawl_site(request: CrawlRequest):
    try:
        url_str = str(request.url)
        crawler = SimpleCrawler(url_str, max_depth=request.max_depth)
        crawler.crawl()

        # Save crawl session to MongoDB
        session_doc = {
            "base_url": url_str,
            "crawl_time": datetime.now(timezone.utc),
        }
        sessions_col = crawl_sessions_col()
        result = await sessions_col.insert_one(session_doc)
        session_id = str(result.inserted_id)

        # Save crawled pages
        data_col = crawled_data_col()
        pages_to_insert = []
        for page_url, content in crawler.data.items():
            if not page_url or not content:
                continue
            clean = content.replace('\x00', '').encode('utf-8', errors='ignore').decode('utf-8', errors='ignore')
            clean = clean[:1_000_000]
            pages_to_insert.append({
                "session_id": session_id,
                "url": page_url,
                "content": clean,
            })

        if pages_to_insert:
            await data_col.insert_many(pages_to_insert)

        # Generate and store embeddings (synchronous — HuggingFace calls are blocking)
        embed_and_store_chunks(session_id)

        return {
            "crawl_session_id": session_id,
            "crawled_urls_count": len(crawler.data),
        }
    except Exception as e:
        print(f"[/crawl] Exception: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/chat")
async def chat_with_crawler(request: ChatRequestModel):
    try:
        prompt_embedding = get_hf_embedding(request.prompt)
        if not prompt_embedding:
            raise HTTPException(status_code=503, detail="Embedding service unavailable. Please try again.")

        chunks_col = site_chunks_col()
        all_chunks = await chunks_col.find({"session_id": request.session_id}).to_list(length=None)

        if not all_chunks:
            raise HTTPException(status_code=404, detail="No data found for this session. Please crawl a website first.")

        prompt_vec = np.array(prompt_embedding)
        similarities = []
        for chunk in all_chunks:
            chunk_vec = np.array(chunk["embedding"])
            norm = np.linalg.norm(chunk_vec) * np.linalg.norm(prompt_vec)
            if norm == 0:
                continue
            sim = np.dot(chunk_vec, prompt_vec) / norm
            similarities.append((sim, chunk))

        top_chunks = [c for _, c in sorted(similarities, key=lambda x: x[0], reverse=True)[:5]]
        context = "\n\n".join([c["chunk_text"] for c in top_chunks])

        answer = call_gemini_api(context, request.prompt)
        return {"answer": answer}

    except HTTPException:
        raise
    except Exception as e:
        print(f"[/chat] Exception: {e}")
        raise HTTPException(status_code=500, detail=str(e))