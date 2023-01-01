from typing import Any
from sqlalchemy.ext.declarative import as_declarative, declared_attr

from app.database.session import SessionLocal


@as_declarative()
class Base:
    id: Any
    __name__: str

    @declared_attr
    def __tablename__(cls) -> str:
        return cls.__name__.lower()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
