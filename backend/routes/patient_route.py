from fastapi import APIRouter, Depends, status

from backend.schemas.patient_schema import (
    PatientCreate,
    PatientCreateResponse
)

from backend.services.patient_service import (
    create_patient_service
)

from backend.database.db import get_db
from backend.core.security import get_current_clinic

router = APIRouter()

@router.post("/patients", response_model=PatientCreateResponse, status_code=status.HTTP_201_CREATED)
def create_patient(data: PatientCreate, current_clinic=Depends(get_current_clinic), db=Depends(get_db)):
    clinic_id = current_clinic["clinic_id"]

    return create_patient_service(db, clinic_id, data)
