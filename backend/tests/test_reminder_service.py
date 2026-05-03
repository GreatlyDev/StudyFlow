from datetime import date, time
import unittest

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from app.db.base import Base
from app.models.reminder import Reminder
from app.models.user import User
from app.schemas.reminder import ReminderCreate, ReminderUpdate
from app.services.reminder_service import (
    create_reminder,
    delete_reminder,
    get_reminder_for_user,
    list_reminders_for_user,
    update_reminder,
)


class ReminderServiceTest(unittest.TestCase):
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

    def tearDown(self):
        self.db.close()

    def test_create_list_update_and_delete_reminder(self):
        payload = ReminderCreate(
            title="Review biology flashcards",
            message="Spend 20 minutes on cellular respiration cards.",
            reminder_type="study",
            reminder_date=date(2026, 5, 4),
            reminder_time=time(18, 30),
            assignment_id=None,
            schedule_id=None,
        )

        created = create_reminder(self.db, self.user.id, payload)

        self.assertIsInstance(created, Reminder)
        self.assertEqual(created.user_id, self.user.id)
        self.assertEqual(created.title, payload.title)
        self.assertFalse(created.is_done)

        saved_reminders = list_reminders_for_user(self.db, self.user.id)
        self.assertEqual(len(saved_reminders), 1)
        self.assertEqual(saved_reminders[0].reminder_type, "study")

        updated = update_reminder(
            self.db,
            created,
            ReminderUpdate(is_done=True, message="Updated reminder message."),
        )
        self.assertTrue(updated.is_done)
        self.assertEqual(updated.message, "Updated reminder message.")

        found = get_reminder_for_user(self.db, created.id, self.user.id)
        self.assertEqual(found.id, created.id)

        delete_reminder(self.db, created)
        self.assertEqual(list_reminders_for_user(self.db, self.user.id), [])


if __name__ == "__main__":
    unittest.main()
