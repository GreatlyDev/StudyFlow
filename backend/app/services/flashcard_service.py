from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.flashcard import Flashcard
from app.schemas.flashcard import FlashcardCreate, FlashcardUpdate


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
