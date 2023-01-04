import base64
from datetime import datetime, timedelta
from typing import Optional

from app.config import config
from app.database.session import SessionLocal
from app.models.user import User
from app.models.verifications import Verification
from app.services.users import get_user_by_email
from jose import JWTError, jwt


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
