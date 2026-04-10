from datetime import date, datetime, time

from pydantic import BaseModel, ConfigDict, Field


class AssignmentBase(BaseModel):
    course_id: int
    title: str = Field(min_length=1, max_length=150)
    description: str | None = None
    due_date: date
    due_time: time | None = None
    status: str = Field(default="pending", max_length=30)
    priority: int = Field(default=2, ge=1, le=3)
    notes: str | None = None


class AssignmentCreate(AssignmentBase):
    pass


class AssignmentUpdate(BaseModel):
    course_id: int | None = None
    title: str | None = Field(default=None, min_length=1, max_length=150)
    description: str | None = None
    due_date: date | None = None
    due_time: time | None = None
    status: str | None = Field(default=None, max_length=30)
    priority: int | None = Field(default=None, ge=1, le=3)
    notes: str | None = None


class AssignmentResponse(AssignmentBase):
    id: int
    user_id: int
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)
