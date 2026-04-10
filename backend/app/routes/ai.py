from fastapi import APIRouter

from app.schemas.dashboard import AiPlaceholderResponse
from app.services.ai_service import get_ai_recommendation_placeholder

router = APIRouter(prefix="/ai", tags=["AI Placeholder"])


@router.get("/placeholder", response_model=AiPlaceholderResponse)
def get_ai_placeholder() -> AiPlaceholderResponse:
    return AiPlaceholderResponse(**get_ai_recommendation_placeholder())
