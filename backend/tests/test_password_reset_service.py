import unittest

from sqlalchemy import create_engine, select
from sqlalchemy.orm import sessionmaker

from app.core.security import verify_password
from app.db.base import Base
from app.models.password_reset import PasswordResetToken
from app.models.user import User
from app.services.auth_service import authenticate_user
from app.services.password_reset_service import (
    create_password_reset_token,
    reset_password_with_token,
)


class PasswordResetServiceTest(unittest.TestCase):
    def setUp(self):
        engine = create_engine("sqlite:///:memory:", connect_args={"check_same_thread": False})
        Base.metadata.create_all(bind=engine)
        TestingSession = sessionmaker(bind=engine, autoflush=False, autocommit=False)
        self.db = TestingSession()

        self.user = User(
            full_name="Alex Learner",
            email="alex@example.com",
            password_hash="$2b$12$4h4gdJlEavcu2xdkavGwTuE3DEshxdwXw8aJ7.p/zW.NEfm8Fe7zS",
        )
        self.db.add(self.user)
        self.db.commit()
        self.db.refresh(self.user)

    def tearDown(self):
        self.db.close()

    def test_reset_token_changes_password_once(self):
        raw_token = create_password_reset_token(self.db, self.user)
        saved_token = self.db.scalar(select(PasswordResetToken))

        self.assertIsNotNone(saved_token)
        self.assertEqual(saved_token.user_id, self.user.id)
        self.assertNotEqual(saved_token.token_hash, raw_token)

        was_reset = reset_password_with_token(self.db, raw_token, "new-password-123")

        self.assertTrue(was_reset)
        self.assertIsNone(authenticate_user(self.db, self.user.email, "old-password-123"))
        self.assertIsNotNone(authenticate_user(self.db, self.user.email, "new-password-123"))
        self.assertTrue(verify_password("new-password-123", self.user.password_hash))

        reused_token = reset_password_with_token(self.db, raw_token, "another-password-123")

        self.assertFalse(reused_token)
        self.assertIsNotNone(authenticate_user(self.db, self.user.email, "new-password-123"))


if __name__ == "__main__":
    unittest.main()
