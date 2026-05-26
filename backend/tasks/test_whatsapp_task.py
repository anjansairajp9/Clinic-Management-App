# DEVELOPMENT WHATSAPP TESTING TASK
from backend.core.celery_app import celery
from backend.integrations.gupshup_client import send_message

import asyncio

@celery.task(
    bind=True,
    autoretry_for=(Exception,),
    retry_kwargs={"max_retries": 3},
    retry_backoff=True
)
def test_whatsapp_message(self):
    asyncio.run(
        send_message(
            phone="916381193766",
            message="Hello from Clinic Management System 🚀 Celery + Gupshup is working!"
        )
    )

    return {
        "message": "WhatsApp Test Message Sent"
    }
