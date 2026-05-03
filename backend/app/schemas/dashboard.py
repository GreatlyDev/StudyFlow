from datetime import date, time

from pydantic import BaseModel


class DashboardAssignmentItem(BaseModel):
    id: int
    title: str
    course_name: str
    due_date: date
    due_time: time | None = None
    status: str
    priority: int


class DashboardScheduleItem(BaseModel):
    id: int
    title: str
    schedule_date: date
    start_time: time
    end_time: time
    location: str | None = None


class DashboardSummaryResponse(BaseModel):
    course_count: int
    assignment_count: int
    schedule_count: int
    pending_assignment_count: int
    upcoming_deadlines: list[DashboardAssignmentItem]
    upcoming_schedule_items: list[DashboardScheduleItem]


class AiPlaceholderResponse(BaseModel):
    title: str
    status: str
    message: str
    next_step: str


class AiExplanationPlaceholderResponse(BaseModel):
    title: str
    status: str
    sample_topic: str
    sample_explanation: str
    next_step: str
