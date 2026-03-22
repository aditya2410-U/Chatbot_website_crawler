from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv
import os

load_dotenv()

MONGODB_URI = os.getenv("MONGODB_URI", "mongodb://localhost:27017")
DB_NAME = os.getenv("MONGODB_DB", "thinkai_crawler")

_client: AsyncIOMotorClient = None

def get_client() -> AsyncIOMotorClient:
    global _client
    if _client is None:
        _client = AsyncIOMotorClient(MONGODB_URI)
    return _client

def get_db():
    return get_client()[DB_NAME]

async def close_db():
    global _client
    if _client:
        _client.close()
        _client = None

# Collection helpers
def crawl_sessions_col():
    return get_db()["crawl_sessions"]

def crawled_data_col():
    return get_db()["crawled_data"]

def site_chunks_col():
    return get_db()["site_chunks"]
