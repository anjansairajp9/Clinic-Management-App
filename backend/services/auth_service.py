from fastapi import HTTPException
from psycopg2 import errors

from backend.core.security import ( 
    hash_password, 
    verify_password, 
    create_access_token, 
    generate_refresh_token
)

from backend.core.utils import format_phn_number

from backend.repositories.auth_repository import (
    create_clinic, 
    get_clinic_by_email, 
    store_refresh_token, 
    delete_refresh_token,
    get_clinic_by_refresh_token
)

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
        
        db.commit()
        
        return clinic
    except errors.UniqueViolation:
        db.rollback()
        raise HTTPException(
            status_code=409,
            detail="Email or Phone already exists"
        )
    except Exception:
        db.rollback()
        raise 


def login_clinic_service(db, data):
    try:
        clinic = get_clinic_by_email(db, data.email)

        if not clinic:
            raise HTTPException(
                status_code=401,
                detail="Invalid Credentials"
            )
        
        clinic_id = clinic["id"]
        email = clinic["email"]
        hashed_password = clinic["password_hash"]

        if not verify_password(data.password, hashed_password):
            raise HTTPException(
                status_code=401,
                detail="Invalid Credentials"
            )
        
        access_token = create_access_token({
            "clinic_id": clinic_id,
            "email": email,
            "token_type": "access"
        })

        refresh_token = generate_refresh_token()

        store_refresh_token(db, clinic_id, refresh_token)

        db.commit()

        return {
            "access_token": access_token,
            "refresh_token": refresh_token,
            "token_type": "bearer"
        }
    except Exception:
        db.rollback()
        raise


def logout_clinic_service(db, refresh_token: str):
    try:
        delete_refresh_token(db, refresh_token)

        db.commit()
    except Exception:
        db.rollback()
        raise


def create_new_access_token_service(db, refresh_token: str):
    try:
        clinic = get_clinic_by_refresh_token(db, refresh_token)
        if not clinic:
            raise HTTPException(
                status_code=401,
                detail="Invalid or Expired Refresh Token"
            )
        
        clinic_id = clinic["clinic_id"]
        email = clinic["email"]

        access_token = create_access_token({
            "clinic_id": clinic_id,
            "email": email,
            "token_type": "access"
        })

        return {
            "access_token": access_token,
            "token_type": "bearer"
        }
    except Exception:
        raise
