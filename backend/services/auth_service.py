from fastapi import HTTPException
from psycopg2 import errors

from backend.core.security import hash_password
from backend.core.utils import format_phn_number

from backend.repositories.auth_repository import create_clinic

def create_clinic_service(db, data):
    hashed_password = hash_password(data.password)
    formatted_phone = format_phn_number(data.phone)

    try:
        clinic = create_clinic(db, data.name, formatted_phone, data.email, hashed_password, data.address)

        if not clinic:
            raise HTTPException(
                status_code=400,
                detail="Clinic Registration Failed"
            )
        
        return clinic
    except errors.UniqueViolation:
        raise HTTPException(
            status_code=409,
            detail="Email or Phone already exists"
        )
    except Exception:
        raise 
