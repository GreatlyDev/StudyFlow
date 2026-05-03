from datetime import date, time
import unittest

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from app.db.base import Base
from app.models.assignment import Assignment
from app.models.course import Course
from app.models.flashcard import Flashcard
from app.models.reminder import Reminder
from app.models.schedule import Schedule
from app.models.user import User
from app.services.ai_service import build_study_recommendations


class AiRecommendationServiceTest(unittest.TestCase):
    def setUp(self):
        engine = create_engine("sqlite:///:memory:", connect_args={"check_same_thread": False})
        Base.metadata.create_all(bind=engine)
        TestingSession = sessionmaker(bind=engine, autoflush=False, autocommit=False)
        self.db = TestingSession()

        self.user = User(
            full_name="Alex Learner",
            email="alex@example.com",
            password_hash="hashed-password",
        )
        self.db.add(self.user)
        self.db.commit()
        self.db.refresh(self.user)

        self.course = Course(
            user_id=self.user.id,
            name="Biology",
            code="BIO 204",
            term="Spring 2026",
        )
        self.db.add(self.course)
        self.db.commit()
        self.db.refresh(self.course)

    def tearDown(self):
        self.db.close()

    def test_builds_recommendations_from_deadlines_study_blocks_reminders_and_flashcards(self):
        assignment = Assignment(
            user_id=self.user.id,
            course_id=self.course.id,
            title="Cellular Respiration Quiz",
            due_date=date(2026, 5, 4),
            due_time=time(17, 0),
            status="pending",
            priority=1,
        )
        schedule = Schedule(
            user_id=self.user.id,
            title="Biology review block",
            schedule_date=date(2026, 5, 3),
            start_time=time(18, 0),
            end_time=time(19, 0),
        )
        reminder = Reminder(
            user_id=self.user.id,
            title="Review quiz notes",
            reminder_type="assignment",
            reminder_date=date(2026, 5, 3),
            reminder_time=time(16, 45),
        )
        flashcard = Flashcard(
            user_id=self.user.id,
            question="What is ATP?",
            answer="Cell energy currency.",
            difficulty=3,
        )
        self.db.add_all([assignment, schedule, reminder, flashcard])
        self.db.commit()

        result = build_study_recommendations(self.db, self.user.id)

        self.assertEqual(result["status"], "foundation")
        self.assertEqual(result["recommendation_count"], 4)
        self.assertIn("Cellular Respiration Quiz", result["recommendations"][0]["title"])
        self.assertTrue(any(item["category"] == "Flashcards" for item in result["recommendations"]))


if __name__ == "__main__":
    unittest.main()
