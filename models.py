from sqlalchemy import Column, Integer, String, Text, DateTime, Float, ARRAY
from sqlalchemy.sql import func
from database import Base

class RecipeModel(Base):
    __tablename__ = "recipes"
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(200), nullable=False)
    ingredients = Column(ARRAY(String), nullable=False)
    instructions = Column(Text, nullable=False)
    prep_time_minutes = Column(Integer, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    rating = Column(Float, nullable=True)