from fastapi import APIRouter, Depends, HTTPException, Response, status
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.dependencies import get_current_user
from app.models.assignment import Assignment
from app.models.reminder import Reminder
from app.models.schedule import Schedule
from app.models.user import User
from app.schemas.reminder import ReminderCreate, ReminderResponse, ReminderUpdate
from app.services.reminder_service import (
    create_reminder,
    delete_reminder,
    get_reminder_for_user,
    list_reminders_for_user,
    update_reminder,
)

router = APIRouter(prefix="/reminders", tags=["Reminders"])


def validate_optional_assignment_ownership(
    db: Session,
    assignment_id: int | None,
    user_id: int,
) -> None:
    if assignment_id is None:
        return

    assignment = db.get(Assignment, assignment_id)
    if not assignment or assignment.user_id != user_id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Please choose one of your own assignments.",
        )


def validate_optional_schedule_ownership(
    db: Session,
    schedule_id: int | None,
    user_id: int,
) -> None:
    if schedule_id is None:
        return

    schedule = db.get(Schedule, schedule_id)
    if not schedule or schedule.user_id != user_id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Please choose one of your own schedule items.",
        )


def validate_reminder_links(db: Session, payload: ReminderCreate | ReminderUpdate, user_id: int) -> None:
    validate_optional_assignment_ownership(db, payload.assignment_id, user_id)
    validate_optional_schedule_ownership(db, payload.schedule_id, user_id)


def get_user_reminder_or_404(db: Session, reminder_id: int, user_id: int) -> Reminder:
    reminder = get_reminder_for_user(db, reminder_id, user_id)
    if reminder is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Reminder not found.",
        )
    return reminder


@router.post("", response_model=ReminderResponse, status_code=status.HTTP_201_CREATED)
def add_reminder(
    payload: ReminderCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> ReminderResponse:
    validate_reminder_links(db, payload, current_user.id)
    return create_reminder(db, current_user.id, payload)


@router.get("", response_model=list[ReminderResponse])
def list_reminders(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> list[ReminderResponse]:
    return list_reminders_for_user(db, current_user.id)


@router.put("/{reminder_id}", response_model=ReminderResponse)
def edit_reminder(
    reminder_id: int,
    payload: ReminderUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> ReminderResponse:
    reminder = get_user_reminder_or_404(db, reminder_id, current_user.id)
    updates = payload.model_dump(exclude_unset=True)

    if "assignment_id" in updates:
        validate_optional_assignment_ownership(db, updates["assignment_id"], current_user.id)

    if "schedule_id" in updates:
        validate_optional_schedule_ownership(db, updates["schedule_id"], current_user.id)

    return update_reminder(db, reminder, payload)


@router.delete("/{reminder_id}", status_code=status.HTTP_204_NO_CONTENT)
def remove_reminder(
    reminder_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> Response:
    reminder = get_user_reminder_or_404(db, reminder_id, current_user.id)
    delete_reminder(db, reminder)
    return Response(status_code=status.HTTP_204_NO_CONTENT)
