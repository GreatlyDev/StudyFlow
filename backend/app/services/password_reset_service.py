from datetime import UTC, datetime, timedelta
from secrets import token_urlsafe

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.core.security import hash_password, hash_reset_token
from app.models.password_reset import PasswordResetToken
from app.models.user import User


def create_password_reset_token(
    db: Session,
    user: User,
    expires_minutes: int = 30,
) -> str:
    raw_token = token_urlsafe(32)
    reset_token = PasswordResetToken(
        user_id=user.id,
        token_hash=hash_reset_token(raw_token),
        expires_at=datetime.now(UTC).replace(tzinfo=None) + timedelta(minutes=expires_minutes),
    )

    db.add(reset_token)
    db.commit()
    return raw_token


def get_valid_password_reset_token(
    db: Session,
    raw_token: str,
) -> PasswordResetToken | None:
    statement = select(PasswordResetToken).where(
        PasswordResetToken.token_hash == hash_reset_token(raw_token),
        PasswordResetToken.used_at.is_(None),
        PasswordResetToken.expires_at > datetime.now(UTC).replace(tzinfo=None),
    )
    return db.scalar(statement)


def reset_password_with_token(db: Session, raw_token: str, new_password: str) -> bool:
    reset_token = get_valid_password_reset_token(db, raw_token)
    if reset_token is None:
        return False

    user = db.get(User, reset_token.user_id)
    if user is None:
        return False

    user.password_hash = hash_password(new_password)
    reset_token.used_at = datetime.now(UTC).replace(tzinfo=None)
    db.commit()
    db.refresh(user)
    return True
