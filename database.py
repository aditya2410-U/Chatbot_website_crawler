from datetime import datetime
from sqlalchemy import UniqueConstraint, create_engine, Column, Integer, Text, DateTime, ForeignKey
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from sqlalchemy.orm import relationship
import os
DATABASE_URL = os.getenv("DATABASE_URL")

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

class CrawlSession(Base):
    __tablename__ = "crawl_sessions"
    id = Column(Integer, primary_key=True, index=True)
    crawl_time = Column(DateTime, default=datetime.utcnow)
    base_url = Column(Text, nullable=False)
    description = Column(Text, nullable=True)  

    crawled_data = relationship("CrawledData", back_populates="session")
    chunks = relationship("SiteChunk", back_populates="session")

class CrawledData(Base):
    __tablename__ = "crawled_data"
    id = Column(Integer, primary_key=True, index=True)
    url = Column(Text, index=True, nullable=False)
    content = Column(Text, nullable=False)
    session_id = Column(Integer, ForeignKey("crawl_sessions.id"))

    session = relationship("CrawlSession", back_populates="crawled_data")

    __table_args__ = (
        UniqueConstraint('url', 'session_id', name='uix_url_session'),
    )

def create_tables():
    Base.metadata.create_all(bind=engine)


def save_crawled_data(data: dict, session_id: int):
    session = SessionLocal()
    try:
        for url, content in data.items():
            if not url or not content:
                continue
            clean_content = content.replace('\x00', '')
            clean_content = clean_content.encode('utf-8', errors='ignore').decode('utf-8', errors='ignore')
            MAX_CONTENT_SIZE = 1000000  
            clean_content = clean_content[:MAX_CONTENT_SIZE]

            obj = session.query(CrawledData).filter_by(url=url, session_id=session_id).first()
            if obj:
                obj.content = clean_content
            else:
                obj = CrawledData(url=url, content=clean_content, session_id=session_id)
                session.add(obj)
        session.commit()
    finally:
        session.close()
