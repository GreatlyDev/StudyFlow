import json
from typing import Any

from app.core.config import OPENAI_API_KEY, OPENAI_MODEL


class OpenAiRecommendationProvider:
    def __init__(self, api_key: str, model: str) -> None:
        from openai import OpenAI

        self.client = OpenAI(api_key=api_key)
        self.model = model

    def __call__(self, foundation_data: dict[str, Any]) -> dict[str, Any] | None:
        prompt = (
            "You are helping build StudyFlow, a student study planning app. "
            "Use the existing study context below to create helpful study recommendations. "
            "Return only valid JSON with this shape: "
            '{"summary":"short summary","recommendations":[{"category":"string",'
            '"title":"string","reason":"string","action":"string","priority":"high|medium|low"}]}. '
            "Keep it practical, student-friendly, and no more than three recommendations.\n\n"
            f"Study context:\n{json.dumps(foundation_data, default=str)}"
        )

        response = self.client.responses.create(
            model=self.model,
            input=prompt,
            store=False,
        )

        try:
            return json.loads(response.output_text)
        except (json.JSONDecodeError, TypeError):
            return None


class OpenAiFlashcardProvider:
    def __init__(self, api_key: str, model: str) -> None:
        from openai import OpenAI

        self.client = OpenAI(api_key=api_key)
        self.model = model

    def __call__(self, context: dict[str, Any]) -> list[dict[str, Any]] | None:
        prompt = (
            "You are generating flashcards for StudyFlow. "
            "Create clear active-recall flashcards from the provided context. "
            "Return only valid JSON with this shape: "
            '{"flashcards":[{"question":"string","answer":"string","difficulty":1|2|3}]}. '
            "Keep answers concise, accurate, and useful for a student presentation demo.\n\n"
            f"Context:\n{json.dumps(context, default=str)}"
        )

        response = self.client.responses.create(
            model=self.model,
            input=prompt,
            store=False,
        )

        try:
            parsed = json.loads(response.output_text)
        except (json.JSONDecodeError, TypeError):
            return None

        flashcards = parsed.get("flashcards")
        return flashcards if isinstance(flashcards, list) else None


def build_openai_recommendation_provider() -> OpenAiRecommendationProvider | None:
    if not OPENAI_API_KEY:
        return None

    try:
        return OpenAiRecommendationProvider(api_key=OPENAI_API_KEY, model=OPENAI_MODEL)
    except Exception:
        return None


def build_openai_flashcard_provider() -> OpenAiFlashcardProvider | None:
    if not OPENAI_API_KEY:
        return None

    try:
        return OpenAiFlashcardProvider(api_key=OPENAI_API_KEY, model=OPENAI_MODEL)
    except Exception:
        return None
