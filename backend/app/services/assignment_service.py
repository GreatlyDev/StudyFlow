from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.assignment import Assignment
from app.schemas.assignment import AssignmentCreate


def list_assignments_for_user(db: Session, user_id: int) -> list[Assignment]:
    statement = (
        select(Assignment)
        .where(Assignment.user_id == user_id)
        .order_by(Assignment.due_date, Assignment.due_time, Assignment.priority)
    )
    return list(db.scalars(statement).all())


def create_assignment(db: Session, user_id: int, payload: AssignmentCreate) -> Assignment:
    assignment = Assignment(user_id=user_id, **payload.model_dump())
    db.add(assignment)
    db.commit()
    db.refresh(assignment)
    return assignment
