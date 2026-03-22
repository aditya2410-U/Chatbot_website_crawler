from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime

class SiteChunkModel(BaseModel):
    session_id: str
    url: str
    chunk_text: str
    embedding: List[float]
