from backend.core.celery_app import celery
from backend.database.db import get_db
from backend.services.appointment_service import process_appointment_reminders_service


@celery.task(
    autoretry_for=(Exception,),
    retry_kwargs={"max_retries": 3},
    retry_backoff=True
)
def process_appointment_reminders_task():
    db = next(get_db())

    return process_appointment_reminders_service(db)
