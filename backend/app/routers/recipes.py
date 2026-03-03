from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from typing import List

from ..database import get_db
from ..models import RecipeModel, UserModel
from ..schemas import Recipe, RecipeCreate
from ..auth import get_current_user

router = APIRouter(prefix="/recipes")


@router.post("", response_model=Recipe, status_code=201)
def create_recipe(
    recipe: RecipeCreate,
    db: Session = Depends(get_db),
    current_user: UserModel = Depends(get_current_user),
):
    db_recipe = RecipeModel(
        title=recipe.title,
        ingredients=recipe.ingredients,
        instructions=recipe.instructions,
        prep_time_minutes=recipe.prep_time_minutes,
        owner_id=current_user.id,
    )
    db.add(db_recipe)
    db.commit()
    db.refresh(db_recipe)
    return db_recipe


@router.get("", response_model=List[Recipe])
def get_all_recipes(
    db: Session = Depends(get_db),
    current_user: UserModel = Depends(get_current_user),
):
    return db.query(RecipeModel).filter(RecipeModel.owner_id == current_user.id).all()


@router.get("/{recipe_id}", response_model=Recipe)
def get_recipe(
    recipe_id: int,
    db: Session = Depends(get_db),
    current_user: UserModel = Depends(get_current_user),
):
    recipe = db.query(RecipeModel).filter(
        RecipeModel.id == recipe_id,
        RecipeModel.owner_id == current_user.id,
    ).first()
    if not recipe:
        raise HTTPException(status_code=404, detail="Recipe not found")
    return recipe


@router.delete("/{recipe_id}")
def delete_recipe(
    recipe_id: int,
    db: Session = Depends(get_db),
    current_user: UserModel = Depends(get_current_user),
):
    recipe = db.query(RecipeModel).filter(
        RecipeModel.id == recipe_id,
        RecipeModel.owner_id == current_user.id,
    ).first()
    if not recipe:
        raise HTTPException(status_code=404, detail="Recipe not found")

    db.delete(recipe)
    db.commit()
    return {"message": "Recipe deleted successfully"}
