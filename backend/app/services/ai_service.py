from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.models.assignment import Assignment
from app.models.course import Course
from app.models.flashcard import Flashcard
from app.models.reminder import Reminder
from app.models.schedule import Schedule


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


def build_study_recommendations(db: Session, user_id: int) -> dict:
    """
    Rule-based recommendation foundation.
    This gives the UI real study guidance now and leaves a clean seam for OpenAI later.
    """

    recommendations: list[dict[str, str]] = []

    assignments = list(
        db.scalars(
            select(Assignment)
            .where(Assignment.user_id == user_id, Assignment.status != "completed")
            .order_by(Assignment.priority, Assignment.due_date, Assignment.due_time)
            .limit(3)
        ).all()
    )

    schedules = list(
        db.scalars(
            select(Schedule)
            .where(Schedule.user_id == user_id)
            .order_by(Schedule.schedule_date, Schedule.start_time)
            .limit(2)
        ).all()
    )

    reminders = list(
        db.scalars(
            select(Reminder)
            .where(Reminder.user_id == user_id, Reminder.is_done.is_(False))
            .order_by(Reminder.reminder_date, Reminder.reminder_time)
            .limit(2)
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

    return {
        "title": "AI Study Recommendations",
        "status": "foundation",
        "summary": (
            f"StudyFlow reviewed {course_count or 0} course(s), {len(assignments)} active assignment(s), "
            f"{len(schedules)} study block(s), {len(reminders)} reminder(s), and "
            f"{difficult_flashcard_count or 0} difficult flashcard(s)."
        ),
        "recommendation_count": len(visible_recommendations),
        "recommendations": visible_recommendations,
    }
