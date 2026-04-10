from fastapi import APIRouter, Depends, HTTPException, Response, status
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.dependencies import get_current_user
from app.models.course import Course
from app.models.user import User
from app.schemas.course import CourseCreate, CourseResponse, CourseUpdate
from app.services.course_service import create_course, list_courses_for_user

router = APIRouter(prefix="/courses", tags=["Courses"])


def get_user_course_or_404(db: Session, course_id: int, user_id: int) -> Course:
    course = db.get(Course, course_id)
    if not course or course.user_id != user_id:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Course not found.",
        )
    return course


@router.post("", response_model=CourseResponse, status_code=status.HTTP_201_CREATED)
def add_course(
    payload: CourseCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> CourseResponse:
    return create_course(db, current_user.id, payload)


@router.get("", response_model=list[CourseResponse])
def list_courses(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> list[CourseResponse]:
    return list_courses_for_user(db, current_user.id)


@router.put("/{course_id}", response_model=CourseResponse)
def update_course(
    course_id: int,
    payload: CourseUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> CourseResponse:
    course = get_user_course_or_404(db, course_id, current_user.id)

    for field_name, value in payload.model_dump(exclude_unset=True).items():
        setattr(course, field_name, value)

    db.commit()
    db.refresh(course)
    return course


@router.delete("/{course_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_course(
    course_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> Response:
    course = get_user_course_or_404(db, course_id, current_user.id)
    db.delete(course)
    db.commit()
    return Response(status_code=status.HTTP_204_NO_CONTENT)
