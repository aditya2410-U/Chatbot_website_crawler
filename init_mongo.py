"""
Initialize MongoDB indexes for ThinkAI Crawler.
Run this once before starting the server:
    python init_mongo.py
"""
import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv
import os

load_dotenv()

MONGODB_URI = os.getenv("MONGODB_URI", "mongodb://localhost:27017")
DB_NAME = os.getenv("MONGODB_DB", "thinkai_crawler")

async def create_indexes():
    client = AsyncIOMotorClient(MONGODB_URI)
    db = client[DB_NAME]

    # crawled_data: unique index on (url, session_id)
    await db["crawled_data"].create_index(
        [("url", 1), ("session_id", 1)],
        unique=True,
        name="uix_url_session"
    )

    # site_chunks: index on session_id for fast lookup
    await db["site_chunks"].create_index("session_id", name="idx_chunks_session")

    # crawl_sessions: index on base_url
    await db["crawl_sessions"].create_index("base_url", name="idx_session_url")

    client.close()
    print("✅ MongoDB indexes created successfully.")
    print(f"   Database: {DB_NAME}")
    print("   Collections: crawl_sessions, crawled_data, site_chunks")

if __name__ == "__main__":
    asyncio.run(create_indexes())
