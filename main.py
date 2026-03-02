from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime

app = FastAPI(title="Recipe API", version="1.0.0")

# Pydantic models for request/response validation
class RecipeCreate(BaseModel):
    title: str = Field(..., min_length=1, max_length=200)
    ingredients: List[str] = Field(..., min_items=1)
    instructions: str = Field(..., min_length=10)
    prep_time_minutes: int = Field(..., gt=0)
    
    class Config:
        json_schema_extra = {
            "example": {
                "title": "Pasta Carbonara",
                "ingredients": ["pasta", "eggs", "bacon", "parmesan"],
                "instructions": "Boil pasta. Fry bacon. Mix eggs and cheese. Combine.",
                "prep_time_minutes": 20
            }
        }

class Recipe(BaseModel):
    id: int
    title: str
    ingredients: List[str]
    instructions: str
    prep_time_minutes: int
    created_at: datetime
    rating: Optional[float] = None

# In-memory "database" (temporary)
recipes_db = []
recipe_id_counter = 1

@app.get("/")
def read_root():
    return {"message": "Welcome to Recipe API", "status": "running"}

@app.post("/recipes", response_model=Recipe, status_code=201)
def create_recipe(recipe: RecipeCreate):
    global recipe_id_counter
    
    new_recipe = Recipe(
        id=recipe_id_counter,
        title=recipe.title,
        ingredients=recipe.ingredients,
        instructions=recipe.instructions,
        prep_time_minutes=recipe.prep_time_minutes,
        created_at=datetime.now()
    )
    
    recipes_db.append(new_recipe)
    recipe_id_counter += 1
    
    return new_recipe

@app.get("/recipes", response_model=List[Recipe])
def get_all_recipes():
    return recipes_db

@app.get("/recipes/{recipe_id}", response_model=Recipe)
def get_recipe(recipe_id: int):
    for recipe in recipes_db:
        if recipe.id == recipe_id:
            return recipe
    raise HTTPException(status_code=404, detail="Recipe not found")

@app.delete("/recipes/{recipe_id}")
def delete_recipe(recipe_id: int):
    global recipes_db
    original_length = len(recipes_db)
    recipes_db = [r for r in recipes_db if r.id != recipe_id]
    
    if len(recipes_db) == original_length:
        raise HTTPException(status_code=404, detail="Recipe not found")
    
    return {"message": "Recipe deleted successfully"}