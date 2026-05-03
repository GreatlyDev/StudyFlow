from fastapi import APIRouter, Depends, HTTPException, Response, status
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.dependencies import get_current_user
from app.models.flashcard import Flashcard
from app.models.study_material import StudyMaterial
from app.models.user import User
from app.schemas.flashcard import FlashcardCreate, FlashcardResponse, FlashcardUpdate
from app.services.flashcard_service import (
    create_flashcard,
    delete_flashcard,
    get_flashcard_for_user,
    list_flashcards_for_user,
    update_flashcard,
)

router = APIRouter(prefix="/flashcards", tags=["Flashcards"])


def validate_optional_material_ownership(
    db: Session,
    study_material_id: int | None,
    user_id: int,
) -> None:
    if study_material_id is None:
        return

    material = db.get(StudyMaterial, study_material_id)
    if not material or material.user_id != user_id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Please choose one of your own study materials.",
        )


def get_user_flashcard_or_404(
    db: Session,
    flashcard_id: int,
    user_id: int,
) -> Flashcard:
    flashcard = get_flashcard_for_user(db, flashcard_id, user_id)
    if flashcard is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Flashcard not found.",
        )
    return flashcard


@router.post("", response_model=FlashcardResponse, status_code=status.HTTP_201_CREATED)
def add_flashcard(
    payload: FlashcardCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> FlashcardResponse:
    validate_optional_material_ownership(db, payload.study_material_id, current_user.id)
    return create_flashcard(db, current_user.id, payload)


@router.get("", response_model=list[FlashcardResponse])
def list_flashcards(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> list[FlashcardResponse]:
    return list_flashcards_for_user(db, current_user.id)


@router.put("/{flashcard_id}", response_model=FlashcardResponse)
def edit_flashcard(
    flashcard_id: int,
    payload: FlashcardUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> FlashcardResponse:
    flashcard = get_user_flashcard_or_404(db, flashcard_id, current_user.id)
    updates = payload.model_dump(exclude_unset=True)

    if "study_material_id" in updates:
        validate_optional_material_ownership(
            db,
            updates["study_material_id"],
            current_user.id,
        )

    return update_flashcard(db, flashcard, payload)


@router.delete("/{flashcard_id}", status_code=status.HTTP_204_NO_CONTENT)
def remove_flashcard(
    flashcard_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> Response:
    flashcard = get_user_flashcard_or_404(db, flashcard_id, current_user.id)
    delete_flashcard(db, flashcard)
    return Response(status_code=status.HTTP_204_NO_CONTENT)
