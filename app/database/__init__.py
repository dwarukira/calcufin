from app.database.base import Base
from app.database.session import SessionLocal
from app.models.user import User  # noqa


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
