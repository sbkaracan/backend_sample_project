from sqlalchemy import Column, Integer, String, Text, DateTime, Float, ARRAY, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from .database import Base


class UserModel(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    username = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    recipes = relationship("RecipeModel", back_populates="owner")


class RecipeModel(Base):
    __tablename__ = "recipes"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(200), nullable=False)
    ingredients = Column(ARRAY(String), nullable=False)
    instructions = Column(Text, nullable=False)
    prep_time_minutes = Column(Integer, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    rating = Column(Float, nullable=True)

    owner_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    owner = relationship("UserModel", back_populates="recipes")
