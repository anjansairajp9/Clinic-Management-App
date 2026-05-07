from fastapi import APIRouter, Depends, status, Request, Response

from backend.schemas.auth_schema import (
    RegisterClinic, 
    RegisterClinicResponse, 
    LoginClinic, 
    LoginClinicResponse
)
from backend.services.auth_service import (
    create_clinic_service, 
    login_clinic_service,
    logout_clinic_service
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


@router.post("/logout", status_code=status.HTTP_200_OK)
def clinic_logout(request: Request, response: Response, db=Depends(get_db)):
    refresh_token = request.cookies.get("refresh_token")

    if refresh_token:
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
