from datetime import datetime

from backend.integrations.gupshup_client import send_message

async def send_appointment_confirmation_message(
    phone: str, clinic_name: str, patient_name: str, doctor_name: str, appointment_time: str | datetime
):
    if isinstance(appointment_time, str):
        appointment_time = datetime.fromisoformat(appointment_time)

    formatted_time = (
        appointment_time.strftime("%d %b %Y, %I:%M %p")
        if appointment_time
        else "Not Available"
    )

    message = f"""
✅ {clinic_name}

Appointment Confirmed

Hello {patient_name},

Your appointment has been successfully booked.

👨‍⚕️ Doctor: {doctor_name}
🕒 Time: {formatted_time}

Please arrive 10-15 minutes early.

Thank you for choosing {clinic_name}.
    """.strip()

    return await send_message(
        phone=phone,
        message=message
    )


async def send_appointment_reminder_message(
    phone: str, clinic_name: str, patient_name: str, doctor_name: str, appointment_time: str | datetime
):
    if isinstance(appointment_time, str):
        appointment_time = datetime.fromisoformat(appointment_time)

    formatted_time = (
        appointment_time.strftime("%d %b %Y, %I:%M %p")
        if appointment_time
        else "Not Available"
    )

    message = f"""
📅 {clinic_name}

Appointment Reminder

Hello {patient_name},

This is a reminder for your appointment.

👨‍⚕️ Doctor: {doctor_name}
🕒 Time: {formatted_time}

Please arrive 10-15 minutes early.

Thank you.
    """.strip()

    return await send_message(
        phone=phone,
        message=message
    )


async def send_appointment_cancelled_message(
    phone: str, clinic_name: str, patient_name: str, appointment_time: str | datetime
):
    if isinstance(appointment_time, str):
        appointment_time = datetime.fromisoformat(appointment_time)

    formatted_time = (
        appointment_time.strftime("%d %b %Y, %I:%M %p")
        if appointment_time
        else "Not Available"
    )

    message = f"""
❌ {clinic_name}

Appointment Cancelled

Hello {patient_name},

Your appointment scheduled for:

🕒 {formatted_time}

has been cancelled.

Please contact the clinic to reschedule if needed.
    """.strip()

    return await send_message(
        phone=phone,
        message=message
    )
