from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.reminder import Reminder
from app.schemas.reminder import ReminderCreate, ReminderUpdate


def list_reminders_for_user(db: Session, user_id: int) -> list[Reminder]:
    statement = (
        select(Reminder)
        .where(Reminder.user_id == user_id)
        .order_by(Reminder.is_done, Reminder.reminder_date, Reminder.reminder_time, Reminder.title)
    )
    return list(db.scalars(statement).all())


def create_reminder(db: Session, user_id: int, payload: ReminderCreate) -> Reminder:
    reminder = Reminder(user_id=user_id, **payload.model_dump())
    db.add(reminder)
    db.commit()
    db.refresh(reminder)
    return reminder


def get_reminder_for_user(db: Session, reminder_id: int, user_id: int) -> Reminder | None:
    reminder = db.get(Reminder, reminder_id)
    if not reminder or reminder.user_id != user_id:
        return None
    return reminder


def update_reminder(db: Session, reminder: Reminder, payload: ReminderUpdate) -> Reminder:
    for field_name, value in payload.model_dump(exclude_unset=True).items():
        setattr(reminder, field_name, value)

    db.commit()
    db.refresh(reminder)
    return reminder


def delete_reminder(db: Session, reminder: Reminder) -> None:
    db.delete(reminder)
    db.commit()
