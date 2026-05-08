from fastapi import APIRouter, Depends, status, Request, Response, HTTPException

from backend.schemas.auth_schema import (
    RegisterClinic, 
    RegisterClinicResponse, 
    LoginClinic, 
    LoginClinicResponse,
    LogoutResponse,
    ForgotPassword,
    ForgotPasswordResponse,
    ResetPassword,
    ResetPasswordResponse
)
from backend.services.auth_service import (
    create_clinic_service, 
    login_clinic_service,
    logout_clinic_service,
    create_new_access_token_service,
    forgot_password_service,
    reset_password_service
)
from backend.database.db import get_db

router = APIRouter()

@router.post("/register", response_model=RegisterClinicResponse, status_code=status.HTTP_201_CREATED)
def clinic_register(data: RegisterClinic, db=Depends(get_db)):
    return create_clinic_service(db, data)


@router.post("/login", response_model=LoginClinicResponse, status_code=status.HTTP_200_OK)
def clinic_login(response: Response, data: LoginClinic, db=Depends(get_db)):
    token_data = login_clinic_service(db, data)

    response.set_cookie(
        key="refresh_token",
        value=token_data["refresh_token"],
        httponly=True,
        secure=False,
        samesite="lax",
        max_age=10*24*60*60
    )

    return {
        "access_token": token_data["access_token"],
        "token_type": "bearer"
    }


@router.post("/logout", response_model=LogoutResponse, status_code=status.HTTP_200_OK)
def clinic_logout(request: Request, response: Response, db=Depends(get_db)):
    refresh_token = request.cookies.get("refresh_token")
    if not refresh_token:
        raise HTTPException(
            status_code=401,
            detail="Refresh Token Missing"
        )
    
    logout_clinic_service(db, refresh_token)

    response.delete_cookie(
        key="refresh_token",
        httponly=True,
        secure=False,
        samesite="lax"
    )

    return {
        "message": "Logged out successfully"
    }


@router.post("/refresh", response_model=LoginClinicResponse, status_code=status.HTTP_200_OK)
def create_new_access_token(request: Request, db=Depends(get_db)):
    refresh_token = request.cookies.get("refresh_token")
    if not refresh_token:
        raise HTTPException(
            status_code=401,
            detail="Refresh Token Missing"
        )
    
    return create_new_access_token_service(db, refresh_token)


@router.post("/forgot-password", response_model=ForgotPasswordResponse, status_code=status.HTTP_200_OK)
def forgot_password(data: ForgotPassword, db=Depends(get_db)):
    return forgot_password_service(db, data)


@router.post("/reset-password", response_model=ResetPasswordResponse, status_code=status.HTTP_200_OK)
def reset_password(data: ResetPassword, db=Depends(get_db)):
    return reset_password_service(db, data)
