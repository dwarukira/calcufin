from fastapi import APIRouter

from app.api.users import users_api_router
from app.api.auth import auth_api_router

api_router = APIRouter()
api_router.include_router(users_api_router, prefix="/users", tags=["users"])
api_router.include_router(auth_api_router, prefix="/auth", tags=["auth"])
