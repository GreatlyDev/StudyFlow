from datetime import date, datetime, time
import unittest

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from app.db.base import Base
from app.models.assignment import Assignment
from app.models.course import Course
from app.models.schedule import Schedule
from app.models.user import User
from app.services.dashboard_service import build_dashboard_summary


class DashboardServiceTest(unittest.TestCase):
    def setUp(self):
        engine = create_engine("sqlite:///:memory:", connect_args={"check_same_thread": False})
        Base.metadata.create_all(bind=engine)
        TestingSession = sessionmaker(bind=engine, autoflush=False, autocommit=False)
        self.db = TestingSession()

        self.user = User(
            full_name="Alex Learner",
            email="alex-dashboard@example.com",
            password_hash="hashed-password",
        )
        self.db.add(self.user)
        self.db.commit()
        self.db.refresh(self.user)

        self.course = Course(
            user_id=self.user.id,
            name="Computer Science",
            code="CS 101",
            term="Spring 2026",
        )
        self.db.add(self.course)
        self.db.commit()
        self.db.refresh(self.course)

    def tearDown(self):
        self.db.close()

    def test_dashboard_only_returns_future_plan_items(self):
        past_assignment = Assignment(
            user_id=self.user.id,
            course_id=self.course.id,
            title="Old quiz",
            due_date=date(2026, 5, 3),
            due_time=time(9, 0),
            status="pending",
            priority=1,
        )
        future_assignment = Assignment(
            user_id=self.user.id,
            course_id=self.course.id,
            title="Upcoming project",
            due_date=date(2026, 5, 4),
            due_time=time(18, 0),
            status="pending",
            priority=1,
        )
        past_schedule = Schedule(
            user_id=self.user.id,
            title="Past study block",
            schedule_date=date(2026, 5, 4),
            start_time=time(8, 0),
            end_time=time(9, 0),
        )
        future_schedule = Schedule(
            user_id=self.user.id,
            title="Future study block",
            schedule_date=date(2026, 5, 4),
            start_time=time(17, 0),
            end_time=time(18, 0),
        )
        self.db.add_all([past_assignment, future_assignment, past_schedule, future_schedule])
        self.db.commit()

        summary = build_dashboard_summary(
            self.db,
            self.user.id,
            now=datetime(2026, 5, 4, 12, 0),
        )

        self.assertEqual(summary.assignment_count, 2)
        self.assertEqual(summary.schedule_count, 2)
        self.assertEqual([item.title for item in summary.upcoming_deadlines], ["Upcoming project"])
        self.assertEqual(
            [item.title for item in summary.upcoming_schedule_items],
            ["Future study block"],
        )


if __name__ == "__main__":
    unittest.main()
