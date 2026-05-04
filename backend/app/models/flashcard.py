from datetime import datetime

from sqlalchemy import DateTime, ForeignKey, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base


class Flashcard(Base):
    __tablename__ = "flashcards"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"), nullable=False, index=True)
    study_material_id: Mapped[int | None] = mapped_column(
        ForeignKey("study_materials.id"),
        nullable=True,
        index=True,
    )
    question: Mapped[str] = mapped_column(String(255), nullable=False)
    answer: Mapped[str] = mapped_column(Text, nullable=False)
    status: Mapped[str] = mapped_column(String(30), default="new", nullable=False)
    difficulty: Mapped[int] = mapped_column(Integer, default=2, nullable=False)
    source_type: Mapped[str] = mapped_column(String(30), default="manual", nullable=False)
    set_title: Mapped[str] = mapped_column(String(120), default="General flashcards", nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at: Mapped[datetime] = mapped_column(
        DateTime,
        default=datetime.utcnow,
        onupdate=datetime.utcnow,
        nullable=False,
    )

    owner = relationship("User", back_populates="flashcards")
    study_material = relationship("StudyMaterial", back_populates="flashcards")
