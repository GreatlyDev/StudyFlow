from datetime import date, datetime, time

from sqlalchemy import Boolean, Date, DateTime, ForeignKey, String, Text, Time
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base


class Reminder(Base):
    __tablename__ = "reminders"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"), nullable=False, index=True)
    assignment_id: Mapped[int | None] = mapped_column(
        ForeignKey("assignments.id"),
        nullable=True,
        index=True,
    )
    schedule_id: Mapped[int | None] = mapped_column(
        ForeignKey("schedules.id"),
        nullable=True,
        index=True,
    )
    title: Mapped[str] = mapped_column(String(150), nullable=False)
    message: Mapped[str | None] = mapped_column(Text, nullable=True)
    reminder_type: Mapped[str] = mapped_column(String(30), default="general", nullable=False)
    reminder_date: Mapped[date] = mapped_column(Date, nullable=False)
    reminder_time: Mapped[time | None] = mapped_column(Time, nullable=True)
    is_done: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at: Mapped[datetime] = mapped_column(
        DateTime,
        default=datetime.utcnow,
        onupdate=datetime.utcnow,
        nullable=False,
    )

    owner = relationship("User", back_populates="reminders")
    assignment = relationship("Assignment", back_populates="reminders")
    schedule = relationship("Schedule", back_populates="reminders")
