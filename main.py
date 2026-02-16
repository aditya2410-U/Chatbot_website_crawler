from datetime import datetime, timezone
from api.request.chatRequest import ChatRequestModel
from database import CrawlSession, SessionLocal, save_crawled_data
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, HttpUrl
from crawler import SimpleCrawler
from models.chunk import SiteChunk
from service.embedding import embed_and_store_chunks, get_hf_embedding  
import numpy as np

from service.gemini_call import call_gemini_api

from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

class CrawlRequest(BaseModel):
    url: HttpUrl
    max_depth: int = 2

@app.post("/crawl")
def crawl_site(request: CrawlRequest):
    try:
        crawler = SimpleCrawler(str(request.url), max_depth=request.max_depth)
        crawler.crawl()
        db = SessionLocal()
        crawl_session = CrawlSession(base_url=str(request.url), crawl_time=datetime.now(timezone.utc))
        db.add(crawl_session)
        db.commit()
        db.refresh(crawl_session)
        save_crawled_data(crawler.data, crawl_session.id)
        embed_and_store_chunks(crawl_session.id)
        return {"crawl_session_id": crawl_session.id, "crawled_urls_count": len(crawler.data)}
    except Exception as e:
        print(f"Exception in /crawl: {e}")  
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/chat")
def chat_with_crawler(request: ChatRequestModel):
    try:
        prompt_embedding = get_hf_embedding(request.prompt)
        db = SessionLocal()
        all_chunks = db.query(SiteChunk).filter(SiteChunk.session_id == request.session_id).all()
        similarities = []
        for chunk in all_chunks:
            chunk_emb = np.array(chunk.embedding)
            sim = np.dot(chunk_emb, prompt_embedding) / (np.linalg.norm(chunk_emb) * np.linalg.norm(prompt_embedding))
            similarities.append((sim, chunk))
        top_chunks = [chunk for _, chunk in sorted(similarities, key=lambda x: x[0], reverse=True)[:5]]
        context = "\n".join([c.chunk_text for c in top_chunks]) # need to optimize this 

        answer = call_gemini_api(context, request.prompt)
        return {"answer": answer, "context": context}
    except Exception as e:
        print(f"Exception in /chat: {e}")  
        raise HTTPException(status_code=500, detail=str(e))