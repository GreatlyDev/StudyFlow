from fastapi import APIRouter

from fastapi import Depends
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.dependencies import get_current_user
from app.models.user import User
from app.schemas.dashboard import (
    AiExplanationPlaceholderResponse,
    AiPlaceholderResponse,
    AiStudyRecommendationResponse,
)
from app.services.ai_service import (
    build_study_recommendations,
    get_ai_explanation_placeholder,
    get_ai_recommendation_placeholder,
)

router = APIRouter(prefix="/ai", tags=["AI Placeholder"])


@router.get("/placeholder", response_model=AiPlaceholderResponse)
def get_ai_placeholder() -> AiPlaceholderResponse:
    return AiPlaceholderResponse(**get_ai_recommendation_placeholder())


@router.get("/explanation-placeholder", response_model=AiExplanationPlaceholderResponse)
def get_explanation_placeholder() -> AiExplanationPlaceholderResponse:
    return AiExplanationPlaceholderResponse(**get_ai_explanation_placeholder())


@router.get("/recommendations", response_model=AiStudyRecommendationResponse)
def get_study_recommendations(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> AiStudyRecommendationResponse:
    return AiStudyRecommendationResponse(**build_study_recommendations(db, current_user.id))
