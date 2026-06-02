from backend.core.celery_app import celery
import asyncio

from backend.services.email_service import send_password_reset_email

@celery.task(
    autoretry_for=(Exception,),
    retry_kwargs={"max_retries": 3},
    retry_backoff=True
)
def send_password_reset_email_task(email: str, reset_link: str):
    return asyncio.run(
        send_password_reset_email(
            email=email,
            reset_link=reset_link
        )
    )
