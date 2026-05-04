from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field


class FlashcardBase(BaseModel):
    question: str = Field(min_length=1, max_length=255)
    answer: str = Field(min_length=1)
    status: str = Field(default="new", max_length=30)
    difficulty: int = Field(default=2, ge=1, le=3)
    study_material_id: int | None = None
    source_type: str = Field(default="manual", max_length=30)
    set_title: str = Field(default="General flashcards", max_length=120)


class FlashcardCreate(FlashcardBase):
    pass


class FlashcardUpdate(BaseModel):
    question: str | None = Field(default=None, min_length=1, max_length=255)
    answer: str | None = Field(default=None, min_length=1)
    status: str | None = Field(default=None, max_length=30)
    difficulty: int | None = Field(default=None, ge=1, le=3)
    study_material_id: int | None = None


class FlashcardGenerationRequest(BaseModel):
    source_type: str = Field(default="starter_topic", pattern="^(starter_topic|study_material)$")
    topic: str | None = Field(default=None, max_length=120)
    study_material_id: int | None = None
    count: int = Field(default=5, ge=1, le=8)


class FlashcardResponse(FlashcardBase):
    id: int
    user_id: int
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)
