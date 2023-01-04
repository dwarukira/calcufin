from datetime import timedelta

from app.api.deps import get_current_user
from app.config import config
from app.database import get_db
from app.schemas import Message
from app.schemas.auth import Token, VerifyEmail
from app.services.auth import (authenticate_user, create_access_token,
                               verify_current_user)
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm

auth_api_router = APIRouter()


@auth_api_router.post("/token", response_model=Token)
async def login_for_access_token(
    form_data: OAuth2PasswordRequestForm = Depends(), db=Depends(get_db)
):
    user = authenticate_user(db, form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=config.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.uuid}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}


@auth_api_router.get("/verify/email", response_model=Message)
async def verify_email_for_access_token(
    db=Depends(get_db), current_user=Depends(get_current_user), verify_email=VerifyEmail
):
    valid = verify_current_user(db, current_user, verify_email.code)
    if not valid:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="Invalid verification code",
        )
    return {"message": "Email verified successfully"}
