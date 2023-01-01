from sqlalchemy import Boolean, Column, Integer, String
from app.database.base import Base, generate_uuid


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

    @property
    def full_name(self):
        return f"{self.first_name} {self.last_name}"

    def __str__(self):
        return self.full_name

    def __repr__(self):
        return f"{self.full_name} ({self.email})"
