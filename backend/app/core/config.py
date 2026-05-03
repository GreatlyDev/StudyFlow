import os
from pathlib import Path

BACKEND_DIR = Path(__file__).resolve().parents[2]


def _load_local_env() -> None:
    """
    Load backend/.env for local development without requiring extra setup.
    Existing real environment variables still win.
    """

    env_path = BACKEND_DIR / ".env"
    if not env_path.exists():
        return

    for line in env_path.read_text(encoding="utf-8").splitlines():
        clean_line = line.strip()
        if not clean_line or clean_line.startswith("#") or "=" not in clean_line:
            continue

        key, value = clean_line.split("=", 1)
        os.environ.setdefault(key.strip(), value.strip().strip('"').strip("'"))


_load_local_env()

DATABASE_URL = os.getenv("DATABASE_URL", f"sqlite:///{BACKEND_DIR / 'studyflow.db'}")
SECRET_KEY = os.getenv("SECRET_KEY", "studyflow-dev-secret-key-change-me-12345")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24
FRONTEND_URL = os.getenv("FRONTEND_URL", "http://127.0.0.1:5173")
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY", "")
OPENAI_MODEL = os.getenv("OPENAI_MODEL", "gpt-5.4-mini")

ALLOWED_ORIGINS = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    FRONTEND_URL,
]
