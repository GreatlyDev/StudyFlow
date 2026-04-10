from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.assignment import Assignment
from app.models.course import Course
from app.models.schedule import Schedule
from app.schemas.dashboard import (
    DashboardAssignmentItem,
    DashboardScheduleItem,
    DashboardSummaryResponse,
)


def build_dashboard_summary(db: Session, user_id: int) -> DashboardSummaryResponse:
    courses = list(db.scalars(select(Course).where(Course.user_id == user_id)).all())
    assignments = list(
        db.scalars(
            select(Assignment)
            .where(Assignment.user_id == user_id)
            .order_by(Assignment.due_date, Assignment.due_time, Assignment.priority)
        ).all()
    )
    schedules = list(
        db.scalars(
            select(Schedule)
            .where(Schedule.user_id == user_id)
            .order_by(Schedule.schedule_date, Schedule.start_time)
        ).all()
    )

    course_name_map = {course.id: course.name for course in courses}
    upcoming_deadlines = [
        DashboardAssignmentItem(
            id=assignment.id,
            title=assignment.title,
            course_name=course_name_map.get(assignment.course_id, "Unknown course"),
            due_date=assignment.due_date,
            due_time=assignment.due_time,
            status=assignment.status,
            priority=assignment.priority,
        )
        for assignment in assignments
        if assignment.status != "completed"
    ][:3]

    upcoming_schedule_items = [
        DashboardScheduleItem(
            id=schedule.id,
            title=schedule.title,
            schedule_date=schedule.schedule_date,
            start_time=schedule.start_time,
            end_time=schedule.end_time,
            location=schedule.location,
        )
        for schedule in schedules[:3]
    ]

    return DashboardSummaryResponse(
        course_count=len(courses),
        assignment_count=len(assignments),
        schedule_count=len(schedules),
        pending_assignment_count=len([item for item in assignments if item.status != "completed"]),
        upcoming_deadlines=upcoming_deadlines,
        upcoming_schedule_items=upcoming_schedule_items,
    )
