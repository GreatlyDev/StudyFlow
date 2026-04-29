from fastapi import APIRouter, Depends, HTTPException, Response, status
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.dependencies import get_current_user
from app.models.course import Course
from app.models.study_material import StudyMaterial
from app.models.user import User
from app.schemas.study_material import (
    StudyMaterialCreate,
    StudyMaterialResponse,
    StudyMaterialUpdate,
)
from app.services.study_material_service import (
    create_study_material,
    delete_study_material,
    get_study_material_for_user,
    list_study_materials_for_user,
    update_study_material,
)

router = APIRouter(prefix="/study-materials", tags=["Study Materials"])


def validate_optional_course_ownership(
    db: Session,
    course_id: int | None,
    user_id: int,
) -> None:
    if course_id is None:
        return

    course = db.get(Course, course_id)
    if not course or course.user_id != user_id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Please choose one of your own courses.",
        )


def get_user_material_or_404(db: Session, material_id: int, user_id: int) -> StudyMaterial:
    material = get_study_material_for_user(db, material_id, user_id)
    if material is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Study material not found.",
        )
    return material


@router.post("", response_model=StudyMaterialResponse, status_code=status.HTTP_201_CREATED)
def add_study_material(
    payload: StudyMaterialCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> StudyMaterialResponse:
    validate_optional_course_ownership(db, payload.course_id, current_user.id)
    return create_study_material(db, current_user.id, payload)


@router.get("", response_model=list[StudyMaterialResponse])
def list_study_materials(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> list[StudyMaterialResponse]:
    return list_study_materials_for_user(db, current_user.id)


@router.put("/{material_id}", response_model=StudyMaterialResponse)
def edit_study_material(
    material_id: int,
    payload: StudyMaterialUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> StudyMaterialResponse:
    material = get_user_material_or_404(db, material_id, current_user.id)
    updates = payload.model_dump(exclude_unset=True)

    if "course_id" in updates:
        validate_optional_course_ownership(db, updates["course_id"], current_user.id)

    return update_study_material(db, material, payload)


@router.delete("/{material_id}", status_code=status.HTTP_204_NO_CONTENT)
def remove_study_material(
    material_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> Response:
    material = get_user_material_or_404(db, material_id, current_user.id)
    delete_study_material(db, material)
    return Response(status_code=status.HTTP_204_NO_CONTENT)
