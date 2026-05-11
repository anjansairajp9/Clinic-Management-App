from fastapi import HTTPException
from psycopg2 import errors

from backend.core.utils import format_phn_number

from backend.schemas.doctor_schema import DoctorCreate

from backend.repositories.doctor_repository import (
    create_doctor,
    get_doctor_by_phone
)

def create_doctor_service(db, clinic_id: int, data: DoctorCreate):
    try:
        formatted_phone = format_phn_number(data.phone)

        existing_doctor = get_doctor_by_phone(db, clinic_id, formatted_phone)
        if existing_doctor:
            raise HTTPException(
                status_code=409,
                detail={
                    "message": "Doctor Already Exists",
                    "id": existing_doctor["id"]
                }
            )
        
        doctor = create_doctor(db, clinic_id, data.name, formatted_phone, data.specialization, data.notes)
        if not doctor:
            raise HTTPException(
                status_code=400,
                detail="Doctor Registration Failed"
            )
        
        db.commit()

        return doctor
    except HTTPException:
        db.rollback()
        raise
    except errors.UniqueViolation:
        db.rollback()
        raise HTTPException(
            status_code=409,
            detail="Doctor Already Exists"
        )
    except Exception:
        db.rollback()
        raise
