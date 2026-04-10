from fastapi import APIRouter, Depends, HTTPException, Response, status
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.dependencies import get_current_user
from app.models.assignment import Assignment
from app.models.course import Course
from app.models.user import User
from app.schemas.assignment import AssignmentCreate, AssignmentResponse, AssignmentUpdate
from app.services.assignment_service import create_assignment, list_assignments_for_user

router = APIRouter(prefix="/assignments", tags=["Assignments"])


def validate_course_ownership(db: Session, course_id: int, user_id: int) -> None:
    course = db.get(Course, course_id)
    if not course or course.user_id != user_id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Please choose one of your own courses.",
        )


def get_user_assignment_or_404(db: Session, assignment_id: int, user_id: int) -> Assignment:
    assignment = db.get(Assignment, assignment_id)
    if not assignment or assignment.user_id != user_id:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Assignment not found.",
        )
    return assignment


@router.post("", response_model=AssignmentResponse, status_code=status.HTTP_201_CREATED)
def add_assignment(
    payload: AssignmentCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> AssignmentResponse:
    validate_course_ownership(db, payload.course_id, current_user.id)
    return create_assignment(db, current_user.id, payload)


@router.get("", response_model=list[AssignmentResponse])
def list_assignments(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> list[AssignmentResponse]:
    return list_assignments_for_user(db, current_user.id)


@router.put("/{assignment_id}", response_model=AssignmentResponse)
def update_assignment(
    assignment_id: int,
    payload: AssignmentUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> AssignmentResponse:
    assignment = get_user_assignment_or_404(db, assignment_id, current_user.id)
    updates = payload.model_dump(exclude_unset=True)

    if "course_id" in updates:
        validate_course_ownership(db, updates["course_id"], current_user.id)

    for field_name, value in updates.items():
        setattr(assignment, field_name, value)

    db.commit()
    db.refresh(assignment)
    return assignment


@router.delete("/{assignment_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_assignment(
    assignment_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> Response:
    assignment = get_user_assignment_or_404(db, assignment_id, current_user.id)
    db.delete(assignment)
    db.commit()
    return Response(status_code=status.HTTP_204_NO_CONTENT)
