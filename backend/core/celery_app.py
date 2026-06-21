from celery import Celery
from celery.schedules import crontab
from dotenv import load_dotenv
import os
import ssl

load_dotenv()

redis_url=os.getenv("CELERY_BROKER_URL")

celery = Celery(
    "clinic_management_system",
    broker=redis_url,
    backend=redis_url
)

celery.conf.update(
    broker_connection_retry_on_startup=True,

    task_serializer="json",
    result_serializer="json",
    accept_content=["json"],

    timezone="Asia/Kolkata",
    enable_utc=True,

    task_track_started=True,
    task_time_limit=300,
    task_soft_time_limit=240,

    broker_use_ssl={
        "ssl_cert_reqs": ssl.CERT_NONE
    },

    redis_backend_use_ssl={
        "ssl_cert_reqs": ssl.CERT_NONE
    },

    beat_schedule={
        "process-appointment-reminders": {
            "task": (
                "backend.tasks.reminder_task."
                "process_appointment_reminders_task"
            ),

            "schedule": crontab(minute="*/1")
        }
    }
)

celery.conf.imports = (
    "backend.tasks.whatsapp_task",
    "backend.tasks.reminder_task",
    "backend.tasks.email_task"
)
