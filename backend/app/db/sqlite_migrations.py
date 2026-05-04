from sqlalchemy import Engine, text


def ensure_sqlite_flashcard_columns(engine: Engine) -> None:
    """Keep existing prototype SQLite databases compatible with new flashcard fields."""
    if engine.dialect.name != "sqlite":
        return

    with engine.begin() as connection:
        existing_columns = {
            row[1] for row in connection.execute(text("PRAGMA table_info(flashcards)")).fetchall()
        }

        if "source_type" not in existing_columns:
            connection.execute(
                text(
                    "ALTER TABLE flashcards "
                    "ADD COLUMN source_type VARCHAR(30) NOT NULL DEFAULT 'manual'"
                )
            )

        if "set_title" not in existing_columns:
            connection.execute(
                text(
                    "ALTER TABLE flashcards "
                    "ADD COLUMN set_title VARCHAR(120) NOT NULL DEFAULT 'General flashcards'"
                )
            )
