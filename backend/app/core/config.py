import os
from pathlib import Path

BACKEND_DIR = Path(__file__).resolve().parents[2]

DATABASE_URL = os.getenv("DATABASE_URL", f"sqlite:///{BACKEND_DIR / 'studyflow.db'}")
SECRET_KEY = os.getenv("SECRET_KEY", "studyflow-dev-secret-key-change-me-12345")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24
FRONTEND_URL = os.getenv("FRONTEND_URL", "http://127.0.0.1:5173")

ALLOWED_ORIGINS = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    FRONTEND_URL,
]
