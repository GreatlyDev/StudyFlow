from typing import Any, Callable

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.flashcard import Flashcard
from app.models.study_material import StudyMaterial
from app.schemas.flashcard import FlashcardCreate, FlashcardUpdate

FlashcardProvider = Callable[[dict[str, Any]], list[dict[str, Any]] | None]


def list_flashcards_for_user(db: Session, user_id: int) -> list[Flashcard]:
    statement = (
        select(Flashcard)
        .where(Flashcard.user_id == user_id)
        .order_by(Flashcard.updated_at.desc(), Flashcard.id.desc())
    )
    return list(db.scalars(statement).all())


def create_flashcard(db: Session, user_id: int, payload: FlashcardCreate) -> Flashcard:
    flashcard = Flashcard(user_id=user_id, **payload.model_dump())
    db.add(flashcard)
    db.commit()
    db.refresh(flashcard)
    return flashcard


def _starter_topic_content(topic: str) -> str:
    starter_topics = {
        "Biology: Cellular Respiration": (
            "Cellular respiration breaks down glucose to produce ATP. Key stages include "
            "glycolysis, the Krebs cycle, and the electron transport chain."
        ),
        "Computer Science: Data Structures": (
            "Data structures organize information so programs can store, search, and update "
            "data efficiently. Common examples include arrays, stacks, queues, linked lists, "
            "trees, and hash tables."
        ),
        "Math: Algebra Review": (
            "Algebra uses variables, expressions, equations, and functions to represent "
            "relationships and solve unknown values."
        ),
    }
    return starter_topics.get(topic, f"Study topic: {topic}. Focus on definitions, examples, and key steps.")


def _fallback_generated_cards(context: dict[str, Any], count: int) -> list[dict[str, Any]]:
    title = context["topic"]
    content = context["content"]
    templates = [
        {
            "question": f"What is the main idea of {title}?",
            "answer": content[:220],
            "difficulty": 2,
        },
        {
            "question": f"Why is {title} important to review?",
            "answer": "It contains key terms and relationships that can be turned into active recall practice.",
            "difficulty": 2,
        },
        {
            "question": f"What should you explain first when studying {title}?",
            "answer": "Start with the core definition, then connect it to an example or process.",
            "difficulty": 1,
        },
        {
            "question": f"How can you test yourself on {title}?",
            "answer": "Cover the notes, answer from memory, then compare your answer to the saved material.",
            "difficulty": 2,
        },
        {
            "question": f"What is one follow-up step after reviewing {title}?",
            "answer": "Create a study block or quiz question for the part that still feels unclear.",
            "difficulty": 1,
        },
    ]
    return templates[:count]


def _normalize_generated_cards(cards: list[dict[str, Any]] | None, count: int) -> list[dict[str, Any]]:
    if not cards:
        return []

    normalized_cards: list[dict[str, Any]] = []
    for card in cards[:count]:
        question = str(card.get("question", "")).strip()
        answer = str(card.get("answer", "")).strip()
        if not question or not answer:
            continue

        difficulty = card.get("difficulty", 2)
        try:
            difficulty = int(difficulty)
        except (TypeError, ValueError):
            difficulty = 2
        difficulty = min(3, max(1, difficulty))

        normalized_cards.append(
            {
                "question": question[:255],
                "answer": answer,
                "difficulty": difficulty,
            }
        )

    return normalized_cards


def generate_flashcards_for_user(
    db: Session,
    user_id: int,
    source_type: str,
    count: int = 5,
    topic: str | None = None,
    study_material_id: int | None = None,
    ai_provider: FlashcardProvider | None = None,
) -> list[Flashcard]:
    count = min(8, max(1, count))
    material: StudyMaterial | None = None

    if source_type == "study_material":
        if study_material_id is None:
            raise ValueError("study_material_id is required when source_type is study_material.")

        material = db.get(StudyMaterial, study_material_id)
        if not material or material.user_id != user_id:
            raise ValueError("Study material not found.")

        context = {
            "source_type": source_type,
            "topic": material.title,
            "content": material.content,
            "source_label": material.source_type,
        }
    else:
        selected_topic = topic or "Computer Science: Data Structures"
        context = {
            "source_type": "starter_topic",
            "topic": selected_topic,
            "content": _starter_topic_content(selected_topic),
            "source_label": "starter topic",
        }

    generated_cards: list[dict[str, Any]] = []
    if ai_provider:
        try:
            generated_cards = _normalize_generated_cards(ai_provider(context), count)
        except Exception:
            generated_cards = []

    if not generated_cards:
        generated_cards = _normalize_generated_cards(_fallback_generated_cards(context, count), count)

    created_cards = [
        Flashcard(
            user_id=user_id,
            study_material_id=material.id if material else None,
            question=card["question"],
            answer=card["answer"],
            status="new",
            difficulty=card["difficulty"],
        )
        for card in generated_cards
    ]

    db.add_all(created_cards)
    db.commit()
    for card in created_cards:
        db.refresh(card)

    return created_cards


def get_flashcard_for_user(db: Session, flashcard_id: int, user_id: int) -> Flashcard | None:
    flashcard = db.get(Flashcard, flashcard_id)
    if not flashcard or flashcard.user_id != user_id:
        return None
    return flashcard


def update_flashcard(
    db: Session,
    flashcard: Flashcard,
    payload: FlashcardUpdate,
) -> Flashcard:
    for field_name, value in payload.model_dump(exclude_unset=True).items():
        setattr(flashcard, field_name, value)

    db.commit()
    db.refresh(flashcard)
    return flashcard


def delete_flashcard(db: Session, flashcard: Flashcard) -> None:
    db.delete(flashcard)
    db.commit()
