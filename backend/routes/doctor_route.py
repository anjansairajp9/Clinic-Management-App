from fastapi import APIRouter, Depends, status, Query

from backend.schemas.doctor_schema import (
    DoctorCreate,
    DoctorCreateResponse
)

from backend.services.doctor_service import (
    create_doctor_service
)

from backend.database.db import get_db
from backend.core.security import get_current_clinic

router = APIRouter()

@router.post("/doctors", response_model=DoctorCreateResponse, status_code=status.HTTP_201_CREATED)
def create_doctor(data: DoctorCreate, current_clinic=Depends(get_current_clinic), db=Depends(get_db)):
    return create_doctor_service(db, current_clinic["clinic_id"], data)
