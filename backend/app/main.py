from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .database import engine, Base
from .routers import auth, recipes

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Recipe API", version="3.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(recipes.router)


@app.get("/")
def read_root():
    return {"message": "Recipe API with Authentication!", "status": "running"}
