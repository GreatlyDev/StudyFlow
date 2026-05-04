import unittest

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from app.db.base import Base
from app.models.course import Course
from app.models.flashcard import Flashcard
from app.models.study_material import StudyMaterial
from app.models.user import User
from app.schemas.flashcard import FlashcardCreate, FlashcardUpdate
from app.services.flashcard_service import (
    create_flashcard,
    delete_flashcard,
    generate_flashcards_for_user,
    get_flashcard_for_user,
    list_flashcards_for_user,
    update_flashcard,
)


class FlashcardServiceTest(unittest.TestCase):
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
            name="Biology 204",
            code="BIO 204",
            instructor="Dr. Rivera",
            term="Spring 2026",
        )
        self.db.add(self.course)
        self.db.commit()
        self.db.refresh(self.course)

        self.material = StudyMaterial(
            user_id=self.user.id,
            course_id=self.course.id,
            title="Cellular respiration notes",
            content="Cellular respiration converts glucose into ATP.",
            source_type="typed",
        )
        self.db.add(self.material)
        self.db.commit()
        self.db.refresh(self.material)

    def tearDown(self):
        self.db.close()

    def test_create_list_update_and_delete_flashcard(self):
        payload = FlashcardCreate(
            study_material_id=self.material.id,
            question="What molecule stores usable energy for the cell?",
            answer="ATP stores usable energy for the cell.",
            status="new",
            difficulty=2,
        )

        created = create_flashcard(self.db, self.user.id, payload)

        self.assertIsInstance(created, Flashcard)
        self.assertEqual(created.user_id, self.user.id)
        self.assertEqual(created.study_material_id, self.material.id)
        self.assertEqual(created.status, "new")
        self.assertEqual(created.source_type, "study_material")
        self.assertEqual(created.set_title, "Cellular respiration notes")

        saved_cards = list_flashcards_for_user(self.db, self.user.id)
        self.assertEqual(len(saved_cards), 1)
        self.assertEqual(saved_cards[0].question, payload.question)

        updated = update_flashcard(
            self.db,
            created,
            FlashcardUpdate(status="mastered", difficulty=1),
        )
        self.assertEqual(updated.status, "mastered")
        self.assertEqual(updated.difficulty, 1)

        found = get_flashcard_for_user(self.db, created.id, self.user.id)
        self.assertEqual(found.id, created.id)

        delete_flashcard(self.db, created)
        self.assertEqual(list_flashcards_for_user(self.db, self.user.id), [])

    def test_generate_flashcards_from_starter_topic_with_fallback(self):
        created_cards = generate_flashcards_for_user(
            self.db,
            self.user.id,
            source_type="starter_topic",
            topic="Computer Science: Data Structures",
            count=3,
        )

        self.assertEqual(len(created_cards), 3)
        self.assertTrue(all(card.user_id == self.user.id for card in created_cards))
        self.assertTrue(all(card.source_type == "starter_topic" for card in created_cards))
        self.assertTrue(all(card.set_title == "Computer Science: Data Structures" for card in created_cards))
        self.assertTrue(any("Data Structures" in card.question for card in created_cards))

        saved_cards = list_flashcards_for_user(self.db, self.user.id)
        self.assertEqual(len(saved_cards), 3)

    def test_generate_flashcards_from_study_material_with_provider(self):
        def fake_provider(context):
            self.assertEqual(context["source_type"], "study_material")
            self.assertIn("Cellular respiration", context["content"])
            self.assertEqual(context["count"], 2)
            return [
                {
                    "question": "What does cellular respiration produce?",
                    "answer": "Cellular respiration produces ATP from glucose.",
                    "difficulty": 2,
                },
                {
                    "question": "What molecule is broken down during respiration?",
                    "answer": "Glucose is broken down during cellular respiration.",
                    "difficulty": 1,
                },
            ]

        created_cards = generate_flashcards_for_user(
            self.db,
            self.user.id,
            source_type="study_material",
            study_material_id=self.material.id,
            count=2,
            ai_provider=fake_provider,
        )

        self.assertEqual(len(created_cards), 2)
        self.assertEqual(created_cards[0].study_material_id, self.material.id)
        self.assertEqual(created_cards[0].source_type, "study_material")
        self.assertEqual(created_cards[0].set_title, "Cellular respiration notes")
        self.assertEqual(created_cards[0].question, "What does cellular respiration produce?")

    def test_generate_flashcards_tops_up_when_provider_returns_too_few_cards(self):
        def short_provider(context):
            self.assertEqual(context["count"], 5)
            return [
                {
                    "question": "What does cellular respiration produce?",
                    "answer": "It produces ATP.",
                    "difficulty": 2,
                },
                {
                    "question": "Where does glycolysis happen?",
                    "answer": "Glycolysis happens in the cytoplasm.",
                    "difficulty": 2,
                },
                {
                    "question": "What starts cellular respiration?",
                    "answer": "Glucose starts the process.",
                    "difficulty": 1,
                },
            ]

        created_cards = generate_flashcards_for_user(
            self.db,
            self.user.id,
            source_type="starter_topic",
            topic="Biology: Cellular Respiration",
            count=5,
            ai_provider=short_provider,
        )

        self.assertEqual(len(created_cards), 5)
        self.assertEqual(created_cards[0].question, "What does cellular respiration produce?")
        self.assertIn("Biology: Cellular Respiration", created_cards[-1].question)

    def test_generate_flashcards_supports_eight_card_sessions(self):
        created_cards = generate_flashcards_for_user(
            self.db,
            self.user.id,
            source_type="starter_topic",
            topic="Math: Algebra Review",
            count=8,
        )

        self.assertEqual(len(created_cards), 8)


if __name__ == "__main__":
    unittest.main()
