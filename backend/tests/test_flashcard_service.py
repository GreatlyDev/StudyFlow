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


if __name__ == "__main__":
    unittest.main()
