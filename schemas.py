from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime
# (move Pydantic models here)

class RecipeCreate(BaseModel):
    title: str = Field(..., min_length=1, max_length=200)
    ingredients: List[str] = Field(..., min_items=1)
    instructions: str = Field(..., min_length=10)
    prep_time_minutes: int = Field(..., gt=0)

class Recipe(BaseModel):
    id: int
    title: str
    ingredients: List[str]
    instructions: str
    prep_time_minutes: int
    created_at: datetime
    rating: Optional[float] = None
    
    class Config:
        from_attributes = True  # Allows SQLAlchemy models to work