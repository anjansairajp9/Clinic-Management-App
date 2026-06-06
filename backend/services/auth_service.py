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
from backend.core.config import FRONTEND_URL

from backend.tasks.email_task import send_password_reset_email_task

from backend.schemas.auth_schema import (
    RegisterClinic,
    LoginClinic,
    ForgotPassword,
    ResetPassword,
    ClinicUpdate
)

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
    delete_refresh_token_by_id_after_password_reset,
    get_current_clinic_details,
    update_clinic_details
)

def create_clinic_service(db, data: RegisterClinic):
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


def login_clinic_service(db, data: LoginClinic):
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


def forgot_password_service(db, data: ForgotPassword):
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

        try:
            reset_link = (
                f"{FRONTEND_URL}"
                f"/reset-password"
                f"?token={reset_token}"
            )

            send_password_reset_email_task.delay(
                email=clinic["email"],
                reset_link=reset_link
            )
        except Exception as e:
            print(f"Failed To Queue Password Reset: {str(e)}")

        return {
            "message": "If account exists, reset link has been sent",
        }
    except Exception:
        db.rollback()
        raise


def reset_password_service(db, data: ResetPassword):
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


def get_current_clinic_details_service(db, clinic_id: int):
    try:
        clinic = get_current_clinic_details(db, clinic_id)
        if not clinic:
            raise HTTPException(
                status_code=404,
                detail="Clinic Not Found"
            )
        
        return clinic
    except Exception:
        raise


def update_clinic_service(db, clinic_id: int, data: ClinicUpdate):
    try:
        clinic = get_current_clinic_details(db, clinic_id)
        if not clinic:
            raise HTTPException(
                status_code=404,
                detail="Clinic Not Found"
            )
        
        update_data = data.model_dump(exclude_unset=True)
        if not update_data:
            raise HTTPException(
                status_code=400,
                detail="No Fields Provided For Update"
            )
        
        if "phone" in update_data:
            update_data["phone"] = format_phn_number(update_data["phone"])

        updated_clinic = update_clinic_details(db, clinic_id, update_data)
        if not updated_clinic:
            raise HTTPException(
                status_code=400,
                detail="Failed To Update Clinic Details"
            )
        
        db.commit()

        return updated_clinic
    except errors.UniqueViolation:
        db.rollback()
        raise HTTPException(
            status_code=409,
            detail="Email or Phone already exists"
        )
    except HTTPException:
        db.rollback()
        raise
    except Exception:
        db.rollback()
        raise
