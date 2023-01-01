import secrets
from pydantic import BaseSettings, PostgresDsn
from typing import Optional


class Settings(BaseSettings):
    API_PREFIX: str = "/api"
    PROJECT_NAME: str = "CALCUFIN"
    SQLALCHEMY_DATABASE_URI: Optional[PostgresDsn] = None
    # 60 minutes * 24 hours * 8 days = 8 days
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 8
    ALGORITHM: str = "HS256"
    SECRET_KEY: str = secrets.token_urlsafe(32)

    class Config:
        case_sensitive = True
        env_file = ".env"


config = Settings()
