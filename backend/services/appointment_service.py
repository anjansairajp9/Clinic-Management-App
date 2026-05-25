from fastapi import HTTPException

from datetime import datetime, timezone, date
from zoneinfo import ZoneInfo

from backend.repositories.patient_repository import get_patient_by_id
from backend.repositories.doctor_repository import get_doctor_by_id

from backend.schemas.appointment_schema import (
    CreateAppointment,
    AppointmentUpdate,
    AppointmentStatusUpdate
)

from backend.repositories.appointment_repository import (
    create_appointment,
    get_existing_appointment,
    get_patient_existing_appointment,
    get_appointment_by_id,
    search_appointments,
    update_appointment_details,
    soft_delete_appointment,
    get_patient_appointment_history,
    get_doctor_appointments,
    get_appointment_schedule,
    update_appointment_status
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


def search_appointments_service(
        db, clinic_id: int, query: str|None, status: str|None, appointment_date: date|None, page: int, limit: int
):
    try:
        if query:
            query = query.strip()
        
        offset = (page - 1) * limit

        appointments = search_appointments(db, clinic_id, query, status, appointment_date, limit, offset)
        if not appointments:
            return []
        
        for appointment in appointments:
            appointment["appointment_time"] = appointment["appointment_time"].astimezone(IST)
        
        return appointments
    except Exception:
        raise


def update_appointment_service(db, clinic_id: int, appointment_id: int, data: AppointmentUpdate):
    try:
        existing_appointment = get_appointment_by_id(db, clinic_id, appointment_id)
        if not existing_appointment:
            raise HTTPException(
                status_code=404,
                detail="Appointment Not Found"
            )
        
        if existing_appointment["status"] != "scheduled":
            raise HTTPException(
                status_code=409,
                detail="Only Scheduled Appointments Can Be Modified"
            )
        
        update_data = data.model_dump(exclude_unset=True)
        if not update_data:
            raise HTTPException(
                status_code=400,
                detail="No Fields Provided For Update"
            )
        
        if "doctor_id" in update_data:
            doctor = get_doctor_by_id(db, clinic_id, update_data["doctor_id"])
            if not doctor:
                raise HTTPException(
                    status_code=404,
                    detail="Doctor Not Found"
                )
            
        scheduling_changed = any([
            "doctor_id" in update_data,
            "appointment_date" in update_data,
            "appointment_time" in update_data
        ])

        if scheduling_changed:
            doctor_id = update_data.get("doctor_id", existing_appointment["doctor_id"])

            existing_time = existing_appointment["appointment_time"].astimezone(IST)

            appointment_date = update_data.get("appointment_date", existing_time.date())

            appointment_time = update_data.get("appointment_time", existing_time.time())

            local_datetime = datetime.combine(appointment_date, appointment_time, tzinfo=IST)

            appointment_datetime_utc = local_datetime.astimezone(timezone.utc)

            if appointment_datetime_utc <= datetime.now(timezone.utc):
                raise HTTPException(
                    status_code=400,
                    detail="Enter a valid appointment time"
                )
            
            doctor_conflict = get_existing_appointment(db, clinic_id, doctor_id, appointment_datetime_utc)
            if doctor_conflict and doctor_conflict["id"] != appointment_id:
                raise HTTPException(
                    status_code=409,
                    detail="Doctor Already Booked"
                )
            
            patient_conflict = get_patient_existing_appointment(
                db, clinic_id, existing_appointment["patient_id"], appointment_datetime_utc
            )
            if patient_conflict and patient_conflict["id"] != appointment_id:
                raise HTTPException(
                    status_code=409,
                    detail="Patient Already Has Appointment At This Time"
                )
            
            update_data["doctor_id"] = doctor_id
            update_data["appointment_time"] = appointment_datetime_utc

            update_data.pop("appointment_date", None)

        updated_appointment = update_appointment_details(db, clinic_id, appointment_id, update_data)
        if not updated_appointment:
            raise HTTPException(
                status_code=400,
                detail="Appointment Update Failed"
            )
        
        db.commit()

        updated_appointment = get_appointment_by_id(db, clinic_id, appointment_id)

        updated_appointment["appointment_time"] = updated_appointment["appointment_time"].astimezone(IST)

        return updated_appointment
    except HTTPException:
        db.rollback()
        raise
    except Exception:
        db.rollback()
        raise


def delete_appointment_service(db, clinic_id: int, appointment_id: int):
    try:
        appointment = get_appointment_by_id(db, clinic_id, appointment_id)
        if not appointment:
            raise HTTPException(
                status_code=404,
                detail="Appointment Not Found"
            )
        
        if appointment["status"] != "scheduled":
            raise HTTPException(
                status_code=409,
                detail="Only Scheduled Appointments Can Be Deleted"
            )
        
        deleted_appointment = soft_delete_appointment(db, clinic_id, appointment_id)
        if not deleted_appointment:
            raise HTTPException(
                status_code=404,
                detail="Appointment Not Found"
            )
        
        db.commit()

        return {
            "message": "Appointment Deleted Successfully"
        }
    except HTTPException:
        db.rollback()
        raise
    except Exception:
        db.rollback()
        raise


def get_patient_appointment_history_service(
        db, clinic_id: int, patient_id: int, appointment_date: date | None, page: int, limit: int
):
    try:
        patient = get_patient_by_id(db, clinic_id, patient_id)
        if not patient:
            raise HTTPException(
                status_code=404,
                detail="Patient Not Found"
            )
        
        offset = (page - 1) * limit

        appointments = get_patient_appointment_history(db, clinic_id, patient_id, appointment_date, limit, offset)
        if not appointments:
            return []
        
        for appointment in appointments:
            appointment["appointment_time"] = appointment["appointment_time"].astimezone(IST)

        return appointments
    except Exception:
        raise


def get_doctor_appointments_service(
        db, clinic_id: int, doctor_id: int, appointment_date: date | None, page: int, limit: int
):
    try:
        doctor = get_doctor_by_id(db, clinic_id, doctor_id)
        if not doctor:
            raise HTTPException(
                status_code=404,
                detail="Doctor Not Found"
            )
        
        offset = (page - 1) * limit

        appointments = get_doctor_appointments(db, clinic_id, doctor_id, appointment_date, limit, offset)
        if not appointments:
            return []
        
        for appointment in appointments:
            appointment["appointment_time"] = appointment["appointment_time"].astimezone(IST)

        return appointments
    except Exception:
        raise


def get_appointment_schedule_service(
        db, clinic_id: int, appointment_date: date | None, doctor_id: int | None, status: str | None, page: int, limit: int
):
    try:
        if not appointment_date:
            appointment_date = datetime.now(IST).date()

        if not status:
            status = "scheduled"

        if doctor_id:
            doctor = get_doctor_by_id(db, clinic_id, doctor_id)

            if not doctor:
                raise HTTPException(
                    status_code=404,
                    detail="Doctor Not Found"
                )
            
        offset = (page - 1) * limit

        appointments = get_appointment_schedule(db, clinic_id, appointment_date, doctor_id, status, limit, offset)
        if not appointments:
            return []
        
        for appointment in appointments:
            appointment["appointment_time"] = appointment["appointment_time"].astimezone(IST)

        return appointments
    except Exception:
        raise


def update_appointment_status_service(db, clinic_id: int, appointment_id: int, data: AppointmentStatusUpdate):
    try:
        appointment = get_appointment_by_id(db, clinic_id, appointment_id)
        if not appointment:
            raise HTTPException(
                status_code=404,
                detail="Appointment Not Found"
            )
        
        if appointment["status"] == data.status:
            raise HTTPException(
                status_code=409,
                detail=f"Appointment Already {data.status.replace('_', ' ').title()}"
            )
        
        updated_record = update_appointment_status(db, clinic_id, appointment_id, data.status)
        if not updated_record:
            raise HTTPException(
                status_code=400,
                detail="Failed To Update Appointment Status"
            )
        
        db.commit()

        updated_appointment = get_appointment_by_id(db, clinic_id, appointment_id)

        updated_appointment["appointment_time"] = updated_appointment["appointment_time"].astimezone(IST)

        return updated_appointment
    except HTTPException:
        db.rollback()
        raise
    except Exception:
        db.rollback()
        raise
