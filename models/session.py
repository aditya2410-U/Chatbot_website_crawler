from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class CrawlSessionModel(BaseModel):
    base_url: str
    crawl_time: datetime
    description: Optional[str] = None
