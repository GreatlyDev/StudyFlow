from typing import Any, Callable
from datetime import datetime, time

from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.models.assignment import Assignment
from app.models.course import Course
from app.models.flashcard import Flashcard
from app.models.reminder import Reminder
from app.models.schedule import Schedule
from app.models.study_material import StudyMaterial

AiProvider = Callable[[dict[str, Any]], dict[str, Any] | None]


def get_ai_recommendation_placeholder() -> dict[str, str]:
    """
    Placeholder for future AI integration.
    This keeps the project structure ready without implementing AI too early.
    """

    return {
        "title": "AI Study Recommendations",
        "message": "AI recommendation engine will be added in a future sprint.",
        "status": "placeholder",
        "next_step": "Connect study habits, deadlines, and course data to a future recommendation service.",
    }


def get_ai_explanation_placeholder() -> dict[str, str]:
    """
    Placeholder for future AI concept explanations.
    This keeps the demo honest while showing where AI support will live.
    """

    return {
        "title": "AI Concept Explanation",
        "status": "placeholder",
        "sample_topic": "Cellular Respiration",
        "sample_explanation": (
            "Cellular respiration is how cells turn glucose into usable energy. "
            "Think of it like converting food into a battery the cell can spend."
        ),
        "next_step": "Connect this endpoint to selected flashcards, notes, and future AI responses.",
    }


def _as_text(value: Any, fallback: str) -> str:
    if isinstance(value, str) and value.strip():
        return value.strip()
    return fallback


def _build_openai_response(
    foundation_response: dict[str, Any],
    provider_response: dict[str, Any] | None,
) -> dict[str, Any] | None:
    if not provider_response or not isinstance(provider_response, dict):
        return None

    provider_items = provider_response.get("recommendations")
    if not isinstance(provider_items, list) or not provider_items:
        return None

    recommendations: list[dict[str, str]] = []
    for item in provider_items[:5]:
        if not isinstance(item, dict):
            continue

        priority = _as_text(item.get("priority"), "medium").lower()
        if priority not in {"high", "medium", "low"}:
            priority = "medium"

        recommendations.append(
            {
                "category": _as_text(item.get("category"), "AI Plan"),
                "title": _as_text(item.get("title"), "Review today's study priorities"),
                "reason": _as_text(
                    item.get("reason"),
                    "StudyFlow used your current study data to shape this suggestion.",
                ),
                "action": _as_text(item.get("action"), "Pick one task and study for 20 minutes."),
                "priority": priority,
            }
        )

    if not recommendations:
        return None

    return {
        "title": "AI Study Recommendations",
        "status": "openai",
        "summary": _as_text(
            provider_response.get("summary"),
            foundation_response["summary"],
        ),
        "recommendation_count": len(recommendations),
        "recommendations": recommendations,
    }


def _combine_date_time(day, clock_value, fallback: time) -> datetime:
    return datetime.combine(day, clock_value or fallback)


def build_study_recommendations(
    db: Session,
    user_id: int,
    ai_provider: AiProvider | None = None,
    now: datetime | None = None,
) -> dict:
    """
    Rule-based recommendation foundation.
    This gives the UI real study guidance now and leaves a clean seam for OpenAI later.
    """

    now = now or datetime.now()
    recommendations: list[dict[str, str]] = []

    assignments = [
        assignment
        for assignment in list(
            db.scalars(
                select(Assignment)
                .where(Assignment.user_id == user_id, Assignment.status != "completed")
                .order_by(Assignment.priority, Assignment.due_date, Assignment.due_time)
            ).all()
        )
        if _combine_date_time(assignment.due_date, assignment.due_time, time(23, 59)) >= now
    ][:3]

    schedules = [
        schedule
        for schedule in list(
            db.scalars(
                select(Schedule)
                .where(Schedule.user_id == user_id)
                .order_by(Schedule.schedule_date, Schedule.start_time)
            ).all()
        )
        if _combine_date_time(schedule.schedule_date, schedule.end_time, schedule.start_time) >= now
    ][:2]

    reminders = [
        reminder
        for reminder in list(
            db.scalars(
                select(Reminder)
                .where(Reminder.user_id == user_id, Reminder.is_done.is_(False))
                .order_by(Reminder.reminder_date, Reminder.reminder_time)
            ).all()
        )
        if _combine_date_time(reminder.reminder_date, reminder.reminder_time, time(23, 59)) >= now
    ][:2]

    study_materials = list(
        db.scalars(
            select(StudyMaterial)
            .where(StudyMaterial.user_id == user_id)
            .order_by(StudyMaterial.updated_at.desc(), StudyMaterial.title)
            .limit(3)
        ).all()
    )

    difficult_flashcard_count = db.scalar(
        select(func.count())
        .select_from(Flashcard)
        .where(Flashcard.user_id == user_id, Flashcard.difficulty >= 3)
    )
    course_count = db.scalar(
        select(func.count()).select_from(Course).where(Course.user_id == user_id)
    )
    course_rows = list(db.scalars(select(Course).where(Course.user_id == user_id)).all())
    course_name_map = {course.id: course.name for course in course_rows}

    for assignment in assignments:
        priority = "high" if assignment.priority == 1 else "medium"
        recommendations.append(
            {
                "category": "Deadline",
                "title": f"Focus on {assignment.title}",
                "reason": f"This assignment is due on {assignment.due_date} and is still {assignment.status}.",
                "action": "Create or review a study block before the due date.",
                "priority": priority,
            }
        )

    for schedule in schedules:
        recommendations.append(
            {
                "category": "Schedule",
                "title": f"Protect your {schedule.title} study block",
                "reason": f"You already planned this for {schedule.schedule_date}.",
                "action": "Use this block for your highest-priority assignment or flashcards.",
                "priority": "medium",
            }
        )

    for reminder in reminders:
        recommendations.append(
            {
                "category": "Reminder",
                "title": f"Do not miss: {reminder.title}",
                "reason": f"StudyFlow will alert you on {reminder.reminder_date}.",
                "action": "Open the Reminders page if this alert needs to be adjusted.",
                "priority": "medium",
            }
        )

    if difficult_flashcard_count:
        recommendations.append(
            {
                "category": "Flashcards",
                "title": "Review your hardest flashcards",
                "reason": f"{difficult_flashcard_count} flashcard(s) are marked as difficult.",
                "action": "Use Test Yourself mode for a quick active-recall session.",
                "priority": "high",
            }
        )

    for material in study_materials:
        recommendations.append(
            {
                "category": "Study Material",
                "title": f"Turn {material.title} into active recall",
                "reason": "You saved this material, so it is ready to become flashcards, quiz questions, or a focused review block.",
                "action": "Review the notes, then create flashcards for the hardest ideas.",
                "priority": "medium",
            }
        )

    if not recommendations:
        recommendations.append(
            {
                "category": "Setup",
                "title": "Add study data to unlock recommendations",
                "reason": "Recommendations improve after you add courses, assignments, schedules, or flashcards.",
                "action": "Start by adding one course and one upcoming assignment.",
                "priority": "low",
            }
        )

    visible_recommendations = recommendations[:5]

    foundation_response = {
        "title": "AI Study Recommendations",
        "status": "foundation",
        "summary": (
            f"StudyFlow reviewed {course_count or 0} course(s), {len(assignments)} active assignment(s), "
            f"{len(schedules)} study block(s), {len(reminders)} reminder(s), and "
            f"{difficult_flashcard_count or 0} difficult flashcard(s), plus "
            f"{len(study_materials)} study material(s)."
        ),
        "recommendation_count": len(visible_recommendations),
        "recommendations": visible_recommendations,
        "study_materials": [
            {
                "title": material.title,
                "source_type": material.source_type,
                "course_name": course_name_map.get(material.course_id, "General study material"),
                "content_preview": material.content[:600],
                "updated_at": material.updated_at,
            }
            for material in study_materials
        ],
    }

    if ai_provider:
        try:
            openai_response = _build_openai_response(
                foundation_response,
                ai_provider(foundation_response),
            )
            if openai_response:
                return openai_response
        except Exception:
            # Presentation safety: never let AI availability break the app.
            pass

    return foundation_response
