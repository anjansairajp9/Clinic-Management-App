from backend.core.celery_app import celery
import asyncio

from backend.services.whatsapp_service import (
    send_appointment_confirmation_message,
    send_appointment_reminder_message,
    send_appointment_cancelled_message
)

@celery.task(
    autoretry_for=(Exception,),
    retry_kwargs={"max_retries": 3},
    retry_backoff=True
)
def send_appointment_confirmation_task(
    phone: str, clinic_name: str, patient_name: str, doctor_name: str, appointment_time: str | None
):
    return asyncio.run(
        send_appointment_confirmation_message(phone, clinic_name, patient_name, doctor_name, appointment_time)
    )


@celery.task(
    autoretry_for=(Exception,),
    retry_kwargs={"max_retries": 3},
    retry_backoff=True
)
def send_appointment_reminder_task(
    phone: str, clinic_name: str, patient_name: str, doctor_name: str, appointment_time: str | None
):
    return asyncio.run(
        send_appointment_reminder_message(phone, clinic_name, patient_name, doctor_name, appointment_time)
    )


@celery.task(
    autoretry_for=(Exception,),
    retry_kwargs={"max_retries": 3},
    retry_backoff=True
)
def send_appointment_cancelled_task(phone: str, clinic_name: str, patient_name: str, appointment_time: str | None):
    return asyncio.run(
        send_appointment_cancelled_message(phone, clinic_name, patient_name, appointment_time)
    )
