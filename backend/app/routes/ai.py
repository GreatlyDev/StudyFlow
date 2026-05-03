from fastapi import APIRouter

from app.schemas.dashboard import AiExplanationPlaceholderResponse, AiPlaceholderResponse
from app.services.ai_service import (
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
