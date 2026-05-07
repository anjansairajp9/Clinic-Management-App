from fastapi import APIRouter, Depends, status

from backend.schemas.auth_schema import RegisterClinic, RegisterClinicResponse
from backend.services.auth_service import create_clinic_service
from backend.database.db import get_db

router = APIRouter()

@router.post("/register", response_model=RegisterClinicResponse, status_code=status.HTTP_201_CREATED)
def register_clinic(data: RegisterClinic, db=Depends(get_db)):
    return create_clinic_service(db, data)
