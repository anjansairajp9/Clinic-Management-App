from fastapi import HTTPException
from psycopg2 import errors

import secrets
from datetime import datetime, timedelta, timezone

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
    get_clinic_by_refresh_token,
    store_password_reset_token,
    delete_existing_password_reset_tokens,
    get_clinic_by_password_reset_tokens,
    set_new_clinic_password,
    mark_password_reset_token_used,
    delete_refresh_token_by_id_after_password_reset
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
        is_super_admin = clinic["is_super_admin"]

        if not verify_password(data.password, hashed_password):
            raise HTTPException(
                status_code=401,
                detail="Invalid Credentials"
            )
        
        access_token = create_access_token({
            "clinic_id": clinic_id,
            "email": email,
            "is_super_admin": is_super_admin,
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
        is_super_admin = clinic["is_super_admin"]

        access_token = create_access_token({
            "clinic_id": clinic_id,
            "email": email,
            "is_super_admin": is_super_admin,
            "token_type": "access"
        })

        return {
            "access_token": access_token,
            "token_type": "bearer"
        }
    except Exception:
        raise


def forgot_password_service(db, data):
    try:
        clinic = get_clinic_by_email(db, data.email)
        if not clinic:
            return {"message": "If account exists, reset link has been sent"}
        
        clinic_id = clinic["id"]

        delete_existing_password_reset_tokens(db, clinic_id)

        reset_token = secrets.token_urlsafe(32)
        expires_at = datetime.now(timezone.utc) + timedelta(minutes=15)

        store_password_reset_token(db, clinic_id, reset_token, expires_at)

        db.commit()

        return {
            "message": "If account exists, reset link has been sent",
            "reset_token": reset_token
        }
    except Exception:
        db.rollback()
        raise


def reset_password_service(db, data):
    try:
        clinic = get_clinic_by_password_reset_tokens(db, data.token)
        if not clinic:
            raise HTTPException(
                status_code=400,
                detail="Invalid or Expired Token"
            )
        
        clinic_id = clinic["clinic_id"]

        hashed_password = hash_password(data.new_password)

        set_new_clinic_password(db, clinic_id, hashed_password)

        mark_password_reset_token_used(db, data.token)

        delete_refresh_token_by_id_after_password_reset(db, clinic_id)

        db.commit()

        return {
            "message": "Password Reset Successful"
        }
    except Exception:
        db.rollback()
        raise
