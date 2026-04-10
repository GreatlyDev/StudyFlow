from datetime import time

from fastapi import APIRouter, Depends, HTTPException, Response, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.dependencies import get_current_user
from app.models.schedule import Schedule
from app.models.user import User
from app.schemas.schedule import ScheduleCreate, ScheduleResponse, ScheduleUpdate

router = APIRouter(prefix="/schedules", tags=["Schedules"])


def validate_times(start_time: time, end_time: time) -> None:
    if end_time <= start_time:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="End time must be later than start time.",
        )


def get_user_schedule_or_404(db: Session, schedule_id: int, user_id: int) -> Schedule:
    schedule = db.get(Schedule, schedule_id)
    if not schedule or schedule.user_id != user_id:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Schedule item not found.",
        )
    return schedule


@router.post("", response_model=ScheduleResponse, status_code=status.HTTP_201_CREATED)
def create_schedule(
    payload: ScheduleCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> ScheduleResponse:
    validate_times(payload.start_time, payload.end_time)

    schedule = Schedule(user_id=current_user.id, **payload.model_dump())
    db.add(schedule)
    db.commit()
    db.refresh(schedule)
    return schedule


@router.get("", response_model=list[ScheduleResponse])
def list_schedules(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> list[ScheduleResponse]:
    statement = (
        select(Schedule)
        .where(Schedule.user_id == current_user.id)
        .order_by(Schedule.schedule_date, Schedule.start_time)
    )
    return list(db.scalars(statement).all())


@router.put("/{schedule_id}", response_model=ScheduleResponse)
def update_schedule(
    schedule_id: int,
    payload: ScheduleUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> ScheduleResponse:
    schedule = get_user_schedule_or_404(db, schedule_id, current_user.id)
    updates = payload.model_dump(exclude_unset=True)

    start_time = updates.get("start_time", schedule.start_time)
    end_time = updates.get("end_time", schedule.end_time)
    validate_times(start_time, end_time)

    for field_name, value in updates.items():
        setattr(schedule, field_name, value)

    db.commit()
    db.refresh(schedule)
    return schedule


@router.delete("/{schedule_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_schedule(
    schedule_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> Response:
    schedule = get_user_schedule_or_404(db, schedule_id, current_user.id)
    db.delete(schedule)
    db.commit()
    return Response(status_code=status.HTTP_204_NO_CONTENT)
