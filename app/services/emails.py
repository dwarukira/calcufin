import logging
from typing import Any, Dict
from pathlib import Path
from app.config import config
import emails
from emails.template import JinjaTemplate


def send_email(
    email_to: str,
    subject_template: str = "",
    html_template: str = "",
    environment: Dict[str, Any] = {},
) -> None:
    assert config.EMAILS_ENABLED, "no provided configuration for email variables"
    message = emails.Message(
        subject=JinjaTemplate(subject_template),
        html=JinjaTemplate(html_template),
        mail_from=(config.EMAILS_FROM_NAME, config.EMAILS_FROM_EMAIL),
    )
    smtp_options = {"host": config.SMTP_HOST, "port": config.SMTP_PORT}
    if config.SMTP_TLS:
        smtp_options["tls"] = True
    if config.SMTP_USER:
        smtp_options["user"] = config.SMTP_USER
    if config.SMTP_PASSWORD:
        smtp_options["password"] = config.SMTP_PASSWORD
    smtp_options["ssl"] = False
    try:
        response = message.send(to=email_to, render=environment, smtp=smtp_options)
    except Exception as e:
        logging.error(f"send email error: {e}")
        return
    logging.info(f"send email result: {response} message: {message}")
  