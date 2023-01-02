import logging
from fastapi import FastAPI

from app.config import config
from app.api import api_router
from app.database.session import SessionLocal

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


app = FastAPI(
    title=config.PROJECT_NAME,
    description="CALCUFIN calcufin is an expense tracker build of the kenya market. It helps users stay organisied with their finances.",
    version="0.0.1",
    openapi_url=f"{config.API_PREFIX}/openapi.json",
)

db = SessionLocal()


app.include_router(api_router, prefix=config.API_PREFIX)
