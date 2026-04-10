from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.course import Course
from app.schemas.course import CourseCreate


def list_courses_for_user(db: Session, user_id: int) -> list[Course]:
    statement = select(Course).where(Course.user_id == user_id).order_by(Course.name)
    return list(db.scalars(statement).all())


def create_course(db: Session, user_id: int, payload: CourseCreate) -> Course:
    course = Course(user_id=user_id, **payload.model_dump())
    db.add(course)
    db.commit()
    db.refresh(course)
    return course
