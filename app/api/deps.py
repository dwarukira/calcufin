from app.config import config
from app.database import get_db
from app.models.user import User
from app.schemas.auth import TokenData
from app.services.users import get_user_by_uuid
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="{}/auth/token".format(config.API_PREFIX))


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
