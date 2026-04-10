from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field


class CourseBase(BaseModel):
    name: str = Field(min_length=1, max_length=150)
    code: str | None = Field(default=None, max_length=50)
    instructor: str | None = Field(default=None, max_length=120)
    term: str | None = Field(default=None, max_length=80)
    description: str | None = None


class CourseCreate(CourseBase):
    pass


class CourseUpdate(BaseModel):
    name: str | None = Field(default=None, min_length=1, max_length=150)
    code: str | None = Field(default=None, max_length=50)
    instructor: str | None = Field(default=None, max_length=120)
    term: str | None = Field(default=None, max_length=80)
    description: str | None = None


class CourseResponse(CourseBase):
    id: int
    user_id: int
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)
