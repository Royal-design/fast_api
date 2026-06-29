from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
db_url = "postgresql+psycopg://postgres:Emmanuel123*@localhost:5432/fast_api"
engine =create_engine(db_url)
Session = sessionmaker(autocommit=False, autoflush=False, bind=engine)