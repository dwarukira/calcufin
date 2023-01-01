from sqlalchemy import Boolean, Column, DateTime, Integer, String

from passlib.context import CryptContext
from app.database.base import Base, generate_uuid


pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)


def get_password_hash(password):
    return pwd_context.hash(password)


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    uuid = Column(String, default=generate_uuid, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    is_active = Column(Boolean, default=True)
    is_superuser = Column(Boolean, default=False)
    first_name = Column(String)
    last_name = Column(String)
    phone = Column(String)
    email_verified_at = Column(
        DateTime(
            timezone=True,
        ),
        nullable=True,
    )

    @property
    def full_name(self):
        return f"{self.first_name} {self.last_name}"

    def set_password(self, password):
        self.hashed_password = get_password_hash(password)

    @property
    def is_verified(self):
        return self.email_verified_at is not None

    def verify_password(self, password):
        return verify_password(password, self.hashed_password)

    def __str__(self):
        return self.full_name

    def __repr__(self):
        return f"{self.full_name} ({self.email})"
