# from database import create_tables

# if __name__ == "__main__":
#     create_tables()
#     print("Tables created.")

from database import engine, Base
from models.chunk import SiteChunk

def init_db():
    Base.metadata.drop_all(bind=engine)   # Drop all tables
    Base.metadata.create_all(bind=engine)

if __name__ == "__main__":
    init_db()
    print("DB initialized with required tables.")
