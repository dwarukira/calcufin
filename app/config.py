from pydantic import BaseSettings, PostgresDsn
from typing import Optional


class Settings(BaseSettings):
    API_PREFIX: str = "/api"
    PROJECT_NAME: str = "CALCUFIN"

    SQLALCHEMY_DATABASE_URI: Optional[PostgresDsn] = None

    class Config:
        case_sensitive = True
        env_file = ".env"


config = Settings()
