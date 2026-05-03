from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import ALLOWED_ORIGINS
from app.db.base import Base
from app.db.session import engine
from app.models import assignment, course, flashcard, schedule, study_material, user  # noqa: F401
from app.routes.assignments import router as assignments_router
from app.routes.ai import router as ai_router
from app.routes.auth import router as auth_router
from app.routes.courses import router as courses_router
from app.routes.dashboard import router as dashboard_router
from app.routes.flashcards import router as flashcards_router
from app.routes.health import router as health_router
from app.routes.schedules import router as schedules_router
from app.routes.study_materials import router as study_materials_router

app = FastAPI(
    title="StudyFlow API",
    description="Backend API for the StudyFlow prototype.",
    version="0.1.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_origin_regex=r"http://(localhost|127\.0\.0\.1):\d+",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
def on_startup() -> None:
    # For the first prototype, auto-create tables on startup to keep setup simple.
    Base.metadata.create_all(bind=engine)


app.include_router(health_router, prefix="/api")
app.include_router(auth_router, prefix="/api")
app.include_router(ai_router, prefix="/api")
app.include_router(assignments_router, prefix="/api")
app.include_router(courses_router, prefix="/api")
app.include_router(dashboard_router, prefix="/api")
app.include_router(flashcards_router, prefix="/api")
app.include_router(schedules_router, prefix="/api")
app.include_router(study_materials_router, prefix="/api")
