from fastapi import HTTPException
from psycopg2 import errors

from backend.core.utils import format_phn_number

from backend.schemas.doctor_schema import DoctorCreate, DoctorUpdate

from backend.repositories.doctor_repository import (
    create_doctor,
    get_doctor_by_phone,
    get_doctor_by_id,
    search_doctors,
    update_doctor_details,
    soft_delete_doctor
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


def get_doctor_by_id_service(db, clinic_id: int, doctor_id: int):
    try:
        doctor = get_doctor_by_id(db, clinic_id, doctor_id)
        if not doctor:
            raise HTTPException(
                status_code=404,
                detail="Doctor Not Found"
            )
        
        return doctor
    except Exception:
        raise


def search_doctors_service(db, clinic_id: int, query: str, page: int, limit: int):
    try:
        query = query.strip()
        if not query:
            raise HTTPException(
                status_code=400,
                detail="Search Query is Required"
            )
        
        offset = (page - 1) * limit

        doctors = search_doctors(db, clinic_id, query, limit, offset)
        if not doctors:
            return []
        
        return doctors
    except Exception:
        raise


def update_doctor_details_service(db, clinic_id: int, doctor_id: int, data: DoctorUpdate):
    try:
        existing_doctor = get_doctor_by_id(db, clinic_id, doctor_id)
        if not existing_doctor:
            raise HTTPException(
                status_code=404,
                detail="Doctor Not Found"
            )
        
        update_data = data.model_dump(exclude_unset=True)
        if not update_data:
            raise HTTPException(
                status_code=400,
                detail="No fields provided for update"
            )
        
        if "phone" in update_data:
            formatted_phone = format_phn_number(update_data["phone"])

            duplicate_doctor = get_doctor_by_phone(db, clinic_id, formatted_phone)

            if duplicate_doctor and duplicate_doctor["id"] != doctor_id:
                raise HTTPException(
                    status_code=409,
                    detail="Phone Number Already Exists"
                )
            
            update_data["phone"] = formatted_phone

        updated_doctor = update_doctor_details(db, clinic_id, doctor_id, update_data)
        if not updated_doctor:
            raise HTTPException(
                status_code=400,
                detail="Doctor Update Failed"
            )
        
        db.commit()

        return updated_doctor
    except HTTPException:
        db.rollback()
        raise
    except errors.UniqueViolation:
        db.rollback()
        raise HTTPException(
            status_code=409,
            detail="Phone Number Already Exists"
        )
    except Exception:
        db.rollback()
        raise


def delete_doctor_service(db, clinic_id: int, doctor_id: int):
    try:
        doctor = soft_delete_doctor(db, clinic_id, doctor_id)
        if not doctor:
            raise HTTPException(
                status_code=404,
                detail="Doctor Not Found"
            )
        
        db.commit()

        return {
            "message": "Doctor Deleted Successfully"
        }
    except HTTPException:
        db.rollback()
        raise
    except Exception:
        db.rollback()
        raise
