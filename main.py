from fastapi import FastAPI, HTTPException, Depends, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from typing import List
from datetime import timedelta

from database import engine, get_db, Base
from models import RecipeModel, UserModel
from schemas import Recipe, RecipeCreate, User, UserCreate, Token
from auth import (
    get_password_hash, 
    verify_password, 
    create_access_token, 
    get_current_user,
    ACCESS_TOKEN_EXPIRE_MINUTES
)

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Recipe API", version="3.0.0")

@app.get("/")
def read_root():
    return {"message": "Recipe API with Authentication!", "status": "running"}

# ============ AUTH ENDPOINTS ============

@app.post("/register", response_model=User, status_code=201)
def register(user: UserCreate, db: Session = Depends(get_db)):
    # Check if user exists
    db_user = db.query(UserModel).filter(
        (UserModel.email == user.email) | (UserModel.username == user.username)
    ).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Email or username already registered")
    
    # Create new user
    hashed_password = get_password_hash(user.password)
    new_user = UserModel(
        email=user.email,
        username=user.username,
        hashed_password=hashed_password
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user

@app.post("/token", response_model=Token)
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = db.query(UserModel).filter(UserModel.username == form_data.username).first()
    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.username}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

@app.get("/users/me", response_model=User)
def read_users_me(current_user: UserModel = Depends(get_current_user)):
    return current_user

# ============ RECIPE ENDPOINTS (PROTECTED) ============

@app.post("/recipes", response_model=Recipe, status_code=201)
def create_recipe(
    recipe: RecipeCreate, 
    db: Session = Depends(get_db),
    current_user: UserModel = Depends(get_current_user)
):
    db_recipe = RecipeModel(
        title=recipe.title,
        ingredients=recipe.ingredients,
        instructions=recipe.instructions,
        prep_time_minutes=recipe.prep_time_minutes,
        owner_id=current_user.id
    )
    db.add(db_recipe)
    db.commit()
    db.refresh(db_recipe)
    return db_recipe

@app.get("/recipes", response_model=List[Recipe])
def get_all_recipes(
    db: Session = Depends(get_db),
    current_user: UserModel = Depends(get_current_user)
):
    return db.query(RecipeModel).filter(RecipeModel.owner_id == current_user.id).all()

@app.get("/recipes/{recipe_id}", response_model=Recipe)
def get_recipe(
    recipe_id: int, 
    db: Session = Depends(get_db),
    current_user: UserModel = Depends(get_current_user)
):
    recipe = db.query(RecipeModel).filter(
        RecipeModel.id == recipe_id,
        RecipeModel.owner_id == current_user.id
    ).first()
    if not recipe:
        raise HTTPException(status_code=404, detail="Recipe not found")
    return recipe

@app.delete("/recipes/{recipe_id}")
def delete_recipe(
    recipe_id: int, 
    db: Session = Depends(get_db),
    current_user: UserModel = Depends(get_current_user)
):
    recipe = db.query(RecipeModel).filter(
        RecipeModel.id == recipe_id,
        RecipeModel.owner_id == current_user.id
    ).first()
    if not recipe:
        raise HTTPException(status_code=404, detail="Recipe not found")
    
    db.delete(recipe)
    db.commit()
    return {"message": "Recipe deleted successfully"}