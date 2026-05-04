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
from app.models.study_material import StudyMaterial
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

    def test_uses_openai_provider_when_it_returns_recommendations(self):
        def fake_openai_provider(foundation_data):
            return {
                "summary": "OpenAI reviewed the study data and suggested a focused biology review.",
                "recommendations": [
                    {
                        "category": "AI Plan",
                        "title": "Start with biology flashcards",
                        "reason": "Active recall will help before the quiz.",
                        "action": "Spend 20 minutes in Test Yourself mode.",
                        "priority": "high",
                    }
                ],
            }

        result = build_study_recommendations(
            self.db,
            self.user.id,
            ai_provider=fake_openai_provider,
        )

        self.assertEqual(result["status"], "openai")
        self.assertEqual(result["recommendation_count"], 1)
        self.assertEqual(result["recommendations"][0]["category"], "AI Plan")

    def test_sends_saved_study_materials_to_openai_provider(self):
        material = StudyMaterial(
            user_id=self.user.id,
            course_id=self.course.id,
            title="Respiration lecture notes",
            content=(
                "Cellular respiration includes glycolysis, the Krebs cycle, "
                "and the electron transport chain."
            ),
            source_type="lecture notes",
        )
        self.db.add(material)
        self.db.commit()

        captured_context = {}

        def fake_openai_provider(foundation_data):
            captured_context.update(foundation_data)
            return None

        result = build_study_recommendations(
            self.db,
            self.user.id,
            ai_provider=fake_openai_provider,
        )

        self.assertEqual(result["status"], "foundation")
        self.assertIn("1 study material", result["summary"])
        self.assertEqual(captured_context["study_materials"][0]["title"], material.title)
        self.assertEqual(captured_context["study_materials"][0]["course_name"], self.course.name)
        self.assertIn("glycolysis", captured_context["study_materials"][0]["content_preview"])

    def test_falls_back_to_foundation_when_openai_provider_fails(self):
        def failing_openai_provider(_foundation_data):
            raise RuntimeError("OpenAI unavailable")

        result = build_study_recommendations(
            self.db,
            self.user.id,
            ai_provider=failing_openai_provider,
        )

        self.assertEqual(result["status"], "foundation")
        self.assertGreaterEqual(result["recommendation_count"], 1)


if __name__ == "__main__":
    unittest.main()
