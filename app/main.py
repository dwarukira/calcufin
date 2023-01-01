from fastapi import FastAPI

from app.config import config

app = FastAPI(
    title=config.PROJECT_NAME,
    description="CALCUFIN calcufin is an expense tracker build of the kenya market. It helps users stay organisied with their finances.",
    version="0.0.1",
    openapi_url=f"{config.API_PREFIX}/openapi.json",
)
