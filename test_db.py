from sqlalchemy import create_engine, text
from dotenv import load_dotenv
import os

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")
print(f"Trying to connect to: {DATABASE_URL}")

try:
    engine = create_engine(DATABASE_URL)
    with engine.connect() as conn:
        result = conn.execute(text("SELECT 1"))
        print("✅ Connection successful!")
        print(f"Result: {result.fetchone()}")
except Exception as e:
    print(f"❌ Connection failed!")
    print(f"Error: {e}")