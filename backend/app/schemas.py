from pydantic import BaseModel, Field, EmailStr, field_validator
from typing import List, Optional
from datetime import datetime


class UserCreate(BaseModel):
    email: EmailStr
    username: str = Field(..., min_length=3, max_length=50)
    password: str = Field(..., min_length=6, max_length=50)

    @field_validator('password')
    @classmethod
    def validate_password(cls, v):
        if len(v.encode('utf-8')) > 72:
            raise ValueError('Password too long (max 72 bytes)')
        return v


class User(BaseModel):
    id: int
    email: str
    username: str
    created_at: datetime

    class Config:
        from_attributes = True


class Token(BaseModel):
    access_token: str
    token_type: str


class TokenData(BaseModel):
    username: Optional[str] = None


class RecipeCreate(BaseModel):
    title: str = Field(..., min_length=1, max_length=200)
    ingredients: List[str] = Field(..., min_length=1)
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
    owner_id: int

    class Config:
        from_attributes = True
