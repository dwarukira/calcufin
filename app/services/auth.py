import base64
from datetime import datetime, timedelta
from functools import wraps
from typing import Optional

from app.config import config
from app.database import get_db
from app.database.session import SessionLocal
from app.models.user import User
from app.models.verifications import Verification
from app.schemas.auth import Token, TokenData
from app.services.users import get_user_by_email, get_user_by_uuid
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from jose import JWTError, jwt

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="{}/auth/token".format(config.API_PREFIX))


def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(
            minutes=config.ACCESS_TOKEN_EXPIRE_MINUTES
        )
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, config.SECRET_KEY, algorithm=config.ALGORITHM)
    return encoded_jwt


async def get_current_user(
    token: str = Depends(oauth2_scheme), db=Depends(get_db)
) -> User:
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, config.SECRET_KEY, algorithms=[config.ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise credentials_exception
        token_data = TokenData(uuid=username)
    except JWTError:
        raise credentials_exception
    user = get_user_by_uuid(db, uuid=token_data.uuid)
    if user is None:
        raise credentials_exception
    return user


def authenticate_user(db, email: str, password: str):
    user = get_user_by_email(db, email=email)
    if not user:
        return False
    if not user.verify_password(password):
        return False
    return user


def generate_verification_token(email: str):
    token = create_access_token(
        data={"sub": email},
        expires_delta=timedelta(hours=config.EMAIL_RESET_TOKEN_EXPIRE_HOURS),
    )
    token = base64.b64encode(token.encode("utf-8")).decode("utf-8")
    return token


def verify_verification_token(token: str):
    try:
        token = base64.b64decode(token.encode("utf-8")).decode("utf-8")
        payload = jwt.decode(token, config.SECRET_KEY, algorithms=[config.ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            return False
        return token
    except JWTError:
        return False


def get_verification_token(db: SessionLocal, token: str):
    return db.query(Verification).filter(Verification.token == token).first()


def delete_verification_token(db: SessionLocal, token: str):
    db.query(Verification).filter(Verification.token == token).delete()
    db.commit()


def verify_verification_token(db: SessionLocal, current_user: User, token: str):
    try:
        token = base64.b64decode(token.encode("utf-8")).decode("utf-8")
        payload = jwt.decode(token, config.SECRET_KEY, algorithms=[config.ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            return False
        db_token = get_verification_token(db, token)
        if db_token is None:
            return False
        if db_token.email != email:
            return False
        if current_user.email != email:
            return False
        return db_token
    except JWTError:
        return False


def verify_current_user(db: SessionLocal, current_user: User, token: str) -> bool:
    token = verify_verification_token(db, current_user, token)
    if token is False:
        return False
    delete_verification_token(db, token.token)
    user = get_user_by_email(db, email=token.email)
    if user is None:
        return False
    user.email_verified_at = datetime.utcnow()
    db.commit()
    return True
