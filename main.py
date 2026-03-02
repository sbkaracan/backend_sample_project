from fastapi import FastAPI, HTTPException, Depends
from sqlalchemy.orm import Session
from typing import List

from database import engine, get_db, Base
from models import RecipeModel
from schemas import Recipe, RecipeCreate

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Recipe API", version="2.0.0")

@app.get("/")
def read_root():
    return {"message": "Welcome to Recipe API with Database!", "status": "running"}

@app.post("/recipes", response_model=Recipe, status_code=201)
def create_recipe(recipe: RecipeCreate, db: Session = Depends(get_db)):
    db_recipe = RecipeModel(
        title=recipe.title,
        ingredients=recipe.ingredients,
        instructions=recipe.instructions,
        prep_time_minutes=recipe.prep_time_minutes
    )
    db.add(db_recipe)
    db.commit()
    db.refresh(db_recipe)
    return db_recipe

@app.get("/recipes", response_model=List[Recipe])
def get_all_recipes(db: Session = Depends(get_db)):
    return db.query(RecipeModel).all()

@app.get("/recipes/{recipe_id}", response_model=Recipe)
def get_recipe(recipe_id: int, db: Session = Depends(get_db)):
    recipe = db.query(RecipeModel).filter(RecipeModel.id == recipe_id).first()
    if not recipe:
        raise HTTPException(status_code=404, detail="Recipe not found")
    return recipe

@app.delete("/recipes/{recipe_id}")
def delete_recipe(recipe_id: int, db: Session = Depends(get_db)):
    recipe = db.query(RecipeModel).filter(RecipeModel.id == recipe_id).first()
    if not recipe:
        raise HTTPException(status_code=404, detail="Recipe not found")
    
    db.delete(recipe)
    db.commit()
    return {"message": "Recipe deleted successfully"}