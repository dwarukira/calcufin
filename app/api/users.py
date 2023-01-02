from typing import Optional

from app.database import get_db
from app.models.user import User
from app.services import get_password_hash
from fastapi import APIRouter, BackgroundTasks, Depends
from fastapi.encoders import jsonable_encoder
from pydantic import BaseModel
from app.schemas import users as users_schemas
from app.services import users as users_service
from app.services import auth as auth_service

users_api_router = APIRouter()


@users_api_router.post("/signup", operation_id="signup_user")
def sign_up_user(
    sign_up_user_schema: users_schemas.SignupUserSchema,
    background_tasks: BackgroundTasks,
    db=Depends(get_db),
) -> User:
    user = users_service.create_user(db, sign_up_user_schema)
    background_tasks.add_task(users_service.send_new_account_email, user.email)
    verification_token = auth_service.generate_verification_token(user.email)
    background_tasks.add_task(
        users_service.send_verify_account_email,
        user.email,
        user.email,
        verification_token,
    )
    return user


@users_api_router.get("/me", response_model=users_schemas.User)
def get_current_user(user: User = Depends(auth_service.get_current_user)) -> User:
    return user
