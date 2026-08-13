from sqlalchemy import Column, String, Text
from app.database.connection import Base
import uuid

class Query(Base):
    __tablename__ = "queries"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String)
    question = Column(String)
    answer = Column(Text)   