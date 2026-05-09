from fastapi import HTTPException
from psycopg2 import errors

from backend.schemas.patient_schema import PatientCreate

from backend.core.utils import format_phn_number

from backend.repositories.patient_repository import (
    create_patient,
    create_patient_medical_history,
    get_patient_by_phone,
    get_patient_by_id,
    search_patients
)

def create_patient_service(db, clinic_id: int, data: PatientCreate):
    try:
        formatted_phone = format_phn_number(data.phone)

        existing_patient = get_patient_by_phone(db, clinic_id, formatted_phone)
        if existing_patient:
            raise HTTPException(
                status_code=409,
                detail={
                    "message": "Patient Already Exists",
                    "id": existing_patient["id"]
                }
            )

        patient = create_patient(db, clinic_id, data.name, formatted_phone, data.gender, data.dob, data.notes)
        if not patient:
            raise HTTPException(
                status_code=400,
                detail="Patient Registration Failed"
            )
        
        patient_id = patient["id"]

        create_patient_medical_history(db, patient_id)

        db.commit()

        return patient
    except HTTPException:
        db.rollback()
        raise
    except errors.UniqueViolation:
        db.rollback()
        raise HTTPException(
            status_code=409,
            detail="Patient Already Exists"
        )
    except Exception:
        db.rollback()
        raise


def get_patient_by_id_service(db, clinic_id: int, patient_id: int):
    try:
        patient = get_patient_by_id(db, clinic_id, patient_id)
        if not patient:
            raise HTTPException(
                status_code=404,
                detail="Patient Not Found"
            )
        
        return patient
    except Exception:
        raise


def search_patients_service(db, clinic_id: int, query: str, page: int, limit: int):
    try:
        query = query.strip()
        if not query:
            raise HTTPException(
                status_code=400,
                detail="Search Query is Required"
            )
        
        offset = (page - 1) * limit

        patients = search_patients(db, clinic_id, query, limit, offset)
        if not patients:
            return []
        
        return patients
    except Exception:
        raise
