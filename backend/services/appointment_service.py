from fastapi import HTTPException

from datetime import datetime, timezone
from zoneinfo import ZoneInfo

from backend.repositories.patient_repository import get_patient_by_id
from backend.repositories.doctor_repository import get_doctor_by_id

from backend.schemas.appointment_schema import (
    CreateAppointment
)

from backend.repositories.appointment_repository import (
    create_appointment,
    get_existing_appointment,
    get_patient_existing_appointment,
    get_appointment_by_id
)

IST = ZoneInfo("Asia/Kolkata")

def create_appointment_service(db, clinic_id: int, data: CreateAppointment):
    try:
        patient = get_patient_by_id(db, clinic_id, data.patient_id)
        if not patient:
            raise HTTPException(
                status_code=404,
                detail="Patient Not Found"
            )
        
        doctor = get_doctor_by_id(db, clinic_id, data.doctor_id)
        if not doctor:
            raise HTTPException(
                status_code=404,
                detail="Doctor Not Found"
            )
        
        local_datetime = datetime.combine(data.appointment_date, data.appointment_time, tzinfo=IST)

        appointment_datetime_utc = local_datetime.astimezone(timezone.utc)

        if appointment_datetime_utc <= datetime.now(timezone.utc):
            raise HTTPException(
                status_code=400,
                detail="Enter a valid appointment time"
            )
        
        existing_appointment = get_existing_appointment(db, clinic_id, data.doctor_id, appointment_datetime_utc)
        if existing_appointment:
            raise HTTPException(
                status_code=409,
                detail="Doctor already booked for this slot"
            )
        
        existing_patient_appointment = get_patient_existing_appointment(
            db, clinic_id, data.patient_id, appointment_datetime_utc
        )
        if existing_patient_appointment:
            raise HTTPException(
                status_code=409,
                detail="Patient already has an appointment for this slot"
            )

        appointment = create_appointment(
            db, 
            clinic_id, 
            data.patient_id, 
            data.doctor_id, 
            appointment_datetime_utc, 
            data.complaint, 
            data.notes, 
            data.total_amount
        )

        if not appointment:
            raise HTTPException(
                status_code=400,
                detail="Appointment Creation Failed"
            )
        
        db.commit()

        return appointment
    except HTTPException:
        db.rollback()
        raise
    except Exception:
        db.rollback()
        raise


def get_appointment_by_id_service(db, clinic_id: int, appointment_id: int):
    try:
        appointment = get_appointment_by_id(db, clinic_id, appointment_id)

        if not appointment:
            raise HTTPException(
                status_code=404,
                detail="Appointment Not Found"
            )
        
        appointment["appointment_time"] = appointment["appointment_time"].astimezone(IST)
        
        return appointment
    except Exception:
        raise
