import secrets
from pydantic import AnyHttpUrl, BaseSettings, EmailStr, PostgresDsn, validator
from typing import Any, Dict, Optional


class Settings(BaseSettings):
    API_PREFIX: str = "/api"
    PROJECT_NAME: str = "CALCUFIN"
    SQLALCHEMY_DATABASE_URI: Optional[PostgresDsn] = None
    # 60 minutes * 24 hours * 8 days = 8 days
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 8
    ALGORITHM: str = "HS256"
    SECRET_KEY: str = secrets.token_urlsafe(32)
    SERVER_NAME: str
    SERVER_HOST: AnyHttpUrl
    CLIENT_HOST: Optional[AnyHttpUrl] = "http://localhost:3000"


    SMTP_TLS: bool = True
    SMTP_PORT: Optional[int] = None
    SMTP_HOST: Optional[str] = None
    SMTP_USER: Optional[str] = None
    SMTP_PASSWORD: Optional[str] = None
    EMAILS_FROM_EMAIL: Optional[EmailStr] = None
    EMAILS_FROM_NAME: Optional[str] = None

    EMAIL_RESET_TOKEN_EXPIRE_HOURS: int = 48
    EMAIL_TEMPLATES_DIR: str = "app/email-templates/build"
    EMAILS_ENABLED: bool = True

    @validator("EMAILS_ENABLED", pre=True)
    def get_emails_enabled(cls, v: bool, values: Dict[str, Any]) -> bool:
        return bool(
            values.get("SMTP_HOST")
            and values.get("SMTP_PORT")
            and values.get("EMAILS_FROM_EMAIL")
        )

    class Config:
        case_sensitive = True
        env_file = ".env"


config = Settings()
