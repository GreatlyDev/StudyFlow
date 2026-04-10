from datetime import date, datetime, time

from pydantic import BaseModel, ConfigDict, Field


class ScheduleBase(BaseModel):
    title: str = Field(min_length=1, max_length=150)
    description: str | None = None
    schedule_date: date
    start_time: time
    end_time: time
    location: str | None = Field(default=None, max_length=150)
    notes: str | None = None


class ScheduleCreate(ScheduleBase):
    pass


class ScheduleUpdate(BaseModel):
    title: str | None = Field(default=None, min_length=1, max_length=150)
    description: str | None = None
    schedule_date: date | None = None
    start_time: time | None = None
    end_time: time | None = None
    location: str | None = Field(default=None, max_length=150)
    notes: str | None = None


class ScheduleResponse(ScheduleBase):
    id: int
    user_id: int
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)
