from datetime import date, datetime, time

from pydantic import BaseModel, ConfigDict, Field


class ReminderBase(BaseModel):
    title: str = Field(min_length=1, max_length=150)
    message: str | None = None
    reminder_type: str = Field(default="general", max_length=30)
    reminder_date: date
    reminder_time: time | None = None
    assignment_id: int | None = None
    schedule_id: int | None = None


class ReminderCreate(ReminderBase):
    pass


class ReminderUpdate(BaseModel):
    title: str | None = Field(default=None, min_length=1, max_length=150)
    message: str | None = None
    reminder_type: str | None = Field(default=None, max_length=30)
    reminder_date: date | None = None
    reminder_time: time | None = None
    assignment_id: int | None = None
    schedule_id: int | None = None
    is_done: bool | None = None


class ReminderResponse(ReminderBase):
    id: int
    user_id: int
    is_done: bool
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)
