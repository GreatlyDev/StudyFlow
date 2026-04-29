from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field


class StudyMaterialBase(BaseModel):
    title: str = Field(min_length=1, max_length=150)
    content: str = Field(min_length=1)
    source_type: str = Field(default="typed", max_length=30)
    course_id: int | None = None


class StudyMaterialCreate(StudyMaterialBase):
    pass


class StudyMaterialUpdate(BaseModel):
    title: str | None = Field(default=None, min_length=1, max_length=150)
    content: str | None = Field(default=None, min_length=1)
    source_type: str | None = Field(default=None, max_length=30)
    course_id: int | None = None


class StudyMaterialResponse(StudyMaterialBase):
    id: int
    user_id: int
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)
