from fastapi import FastAPI

app = FastAPI(title="Recipe API", version="1.0.0")

@app.get("/")
def read_root():
    return {"message": "Welcome to Recipe API", "status": "running"}

@app.get("/health")
def health_check():
    return {"status": "healthy"}