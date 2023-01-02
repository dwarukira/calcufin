from datetime import datetime
from app.database import Base

from sqlalchemy import Boolean, Column, DateTime, ForeignKey, Integer, String


class Verification(Base):
    __tablename__ = "verifications"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, nullable=False)
    token = Column(String, nullable=False)
    used = Column(Boolean, nullable=False)
    expires_at = Column(DateTime, nullable=False)

    def __repr__(self):
        return f"<Verification email={self.email}>"

    def validate_token(self, token: str) -> bool:
        return self.token == token and self.expires_at > datetime.now()

