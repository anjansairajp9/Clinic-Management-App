from datetime import datetime
from zoneinfo import ZoneInfo

from backend.integrations.gupshup_client import send_message


IST = ZoneInfo("Asia/Kolkata")


async def send_appointment_confirmation_message(
    phone: str,
    clinic_name: str,
    patient_name: str,
    appointment_time: str | datetime,
    clinic_phone: str
):
    if isinstance(appointment_time, str):
        appointment_time = datetime.fromisoformat(appointment_time)

    appointment_time = appointment_time.astimezone(IST)

    appointment_date = appointment_time.strftime("%d-%m-%Y")

    appointment_clock_time = appointment_time.strftime("%I:%M %p")

    return await send_message(
        phone=phone,
        template_name="appointment_confirmed",
        template_variables=[
            patient_name,
            clinic_name,
            appointment_date,
            appointment_clock_time,
            clinic_phone
        ]
)


async def send_appointment_reminder_message(
    phone: str,
    clinic_name: str,
    patient_name: str,
    appointment_time: str | datetime,
    clinic_phone: str
):
    if isinstance(appointment_time, str):
        appointment_time = datetime.fromisoformat(appointment_time)

    appointment_time = appointment_time.astimezone(IST)

    appointment_date = appointment_time.strftime("%d-%m-%Y")

    appointment_clock_time = appointment_time.strftime("%I:%M %p")

    return await send_message(
        phone=phone,
        template_name="appointment_reminder",
        template_variables=[
            patient_name,
            clinic_name,
            appointment_date,
            appointment_clock_time,
            clinic_phone
        ]
    )


async def send_appointment_cancelled_message(
    phone: str,
    clinic_name: str,
    patient_name: str,
    appointment_time: str | datetime,
    clinic_phone: str
):
    if isinstance(appointment_time, str):
        appointment_time = datetime.fromisoformat(appointment_time)

    appointment_time = appointment_time.astimezone(IST)

    appointment_date = appointment_time.strftime("%d-%m-%Y")

    appointment_clock_time = appointment_time.strftime("%I:%M %p")

    return await send_message(
        phone=phone,
        template_name="appointment_cancellation",
        template_variables=[
            patient_name,
            clinic_name,
            appointment_date,
            appointment_clock_time,
            clinic_phone
        ]
    )
