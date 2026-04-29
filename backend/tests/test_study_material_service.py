import unittest

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from app.db.base import Base
from app.models.study_material import StudyMaterial
from app.models.user import User
from app.schemas.study_material import StudyMaterialCreate, StudyMaterialUpdate
from app.services.study_material_service import (
    create_study_material,
    delete_study_material,
    get_study_material_for_user,
    list_study_materials_for_user,
    update_study_material,
)


class StudyMaterialServiceTest(unittest.TestCase):
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

    def test_create_list_update_and_delete_study_material(self):
        payload = StudyMaterialCreate(
            title="Biology respiration notes",
            content="Glycolysis starts glucose breakdown before the Krebs cycle.",
            source_type="typed",
            course_id=None,
        )

        created = create_study_material(self.db, self.user.id, payload)

        self.assertIsInstance(created, StudyMaterial)
        self.assertEqual(created.user_id, self.user.id)
        self.assertEqual(created.title, "Biology respiration notes")
        self.assertEqual(created.source_type, "typed")

        saved_items = list_study_materials_for_user(self.db, self.user.id)
        self.assertEqual(len(saved_items), 1)
        self.assertEqual(saved_items[0].content, payload.content)

        updated = update_study_material(
            self.db,
            created,
            StudyMaterialUpdate(title="Updated biology notes", source_type="paste"),
        )
        self.assertEqual(updated.title, "Updated biology notes")
        self.assertEqual(updated.source_type, "paste")

        found = get_study_material_for_user(self.db, created.id, self.user.id)
        self.assertEqual(found.id, created.id)

        delete_study_material(self.db, created)
        self.assertEqual(list_study_materials_for_user(self.db, self.user.id), [])


if __name__ == "__main__":
    unittest.main()
