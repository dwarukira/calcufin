from pathlib import Path

from app.database import session
from app.models.user import User
from app.schemas import users as users_schemas
from fastapi.encoders import jsonable_encoder

from app.services.emails import send_email
from app.config import config


def create_user(db: session, user: users_schemas.SignupUserSchema) -> User:
    user_data = jsonable_encoder(user)
    del user_data["password"]
    db_user = User(**user_data)
    db_user.set_password(user.password)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user


def send_new_account_email(email: str) -> None:
    print(f"Sending new account email to {email}")


def send_verify_account_email(email_to: str, email: str, token: str) -> None:
    subject = f"Please verify your email address"
    with open(Path(config.EMAIL_TEMPLATES_DIR) / "confirm_account.html") as f:
        template_str = f.read()
    server_host = config.CLIENT_HOST
    link = f"{server_host}/auth/verify?token={token}"
    send_email(
        email_to=email_to,
        subject_template=subject,
        html_template=template_str,
        environment={
            "project_name": config.PROJECT_NAME,
            "username": email,
            "email": email_to,
            "valid_hours": config.EMAIL_RESET_TOKEN_EXPIRE_HOURS,
            "link": link,
        },
    )


def get_user_by_email(db: session, email: str) -> User:
    return db.query(User).filter(User.email == email).first()


def get_user_by_uuid(db: session, uuid: str) -> User:
    return db.query(User).filter(User.uuid == uuid).first()
