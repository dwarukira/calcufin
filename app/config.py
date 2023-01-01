from pydantic import BaseSettings


class Settings(BaseSettings):
    API_PREFIX: str = "/api"
    PROJECT_NAME: str = "CALCUFIN"

    class Config:
        case_sensitive = True
        env_file = ".env"


config = Settings()
