from sqlalchemy import Column, ForeignKey, Integer, Text
from sqlalchemy.dialects.postgresql import JSONB
from database import Base
from sqlalchemy.orm import relationship

class SiteChunk(Base):
    __tablename__ = "site_chunks"

    id = Column(Integer, primary_key=True, index=True)
    url = Column(Text, index=True)
    chunk_text = Column(Text, nullable=False)
    embedding = Column(JSONB, nullable=False)
    session_id = Column(Integer, ForeignKey("crawl_sessions.id"), nullable=True) #matlab simple hai bhai if session table mai id hogi tabhi ismei bhi hogi
    session = relationship("CrawlSession", back_populates="chunks")

