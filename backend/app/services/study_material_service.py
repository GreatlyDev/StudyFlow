from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.study_material import StudyMaterial
from app.schemas.study_material import StudyMaterialCreate, StudyMaterialUpdate


def list_study_materials_for_user(db: Session, user_id: int) -> list[StudyMaterial]:
    statement = (
        select(StudyMaterial)
        .where(StudyMaterial.user_id == user_id)
        .order_by(StudyMaterial.updated_at.desc(), StudyMaterial.title)
    )
    return list(db.scalars(statement).all())


def create_study_material(
    db: Session,
    user_id: int,
    payload: StudyMaterialCreate,
) -> StudyMaterial:
    material = StudyMaterial(user_id=user_id, **payload.model_dump())
    db.add(material)
    db.commit()
    db.refresh(material)
    return material


def get_study_material_for_user(
    db: Session,
    material_id: int,
    user_id: int,
) -> StudyMaterial | None:
    material = db.get(StudyMaterial, material_id)
    if not material or material.user_id != user_id:
        return None
    return material


def update_study_material(
    db: Session,
    material: StudyMaterial,
    payload: StudyMaterialUpdate,
) -> StudyMaterial:
    for field_name, value in payload.model_dump(exclude_unset=True).items():
        setattr(material, field_name, value)

    db.commit()
    db.refresh(material)
    return material


def delete_study_material(db: Session, material: StudyMaterial) -> None:
    db.delete(material)
    db.commit()
