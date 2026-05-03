from fastapi import APIRouter

from app.schemas.quiz import PracticeQuizPlaceholderResponse
from app.services.quiz_service import get_practice_quiz_placeholder

router = APIRouter(prefix="/quizzes", tags=["Practice Quizzes"])


@router.get("/placeholder", response_model=PracticeQuizPlaceholderResponse)
def get_quiz_placeholder() -> PracticeQuizPlaceholderResponse:
    return PracticeQuizPlaceholderResponse(**get_practice_quiz_placeholder())
