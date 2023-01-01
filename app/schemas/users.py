from typing import Optional

from pydantic import BaseModel


class SignupUserSchema(BaseModel):
    email: str
    password: str
    first_name: Optional[str] = None
    last_name: Optional[str] = None


class User(BaseModel):
    uuid: str
    email: str
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    phone: Optional[str] = None
    email_verified_at: Optional[str] = None

    class Config:
        orm_mode = True
