from fastapi import APIRouter, Depends, status

from backend.schemas.patient_schema import (
    PatientCreate,
    PatientCreateResponse,
    PatientDetailResponse
)

from backend.services.patient_service import (
    create_patient_service,
    get_patient_by_id_service
)

from backend.database.db import get_db
from backend.core.security import get_current_clinic

router = APIRouter()

@router.post("/patients", response_model=PatientCreateResponse, status_code=status.HTTP_201_CREATED)
def create_patient(data: PatientCreate, current_clinic=Depends(get_current_clinic), db=Depends(get_db)):
    return create_patient_service(db, current_clinic["clinic_id"], data)


@router.get("/patients/{patient_id}", response_model=PatientDetailResponse, status_code=status.HTTP_200_OK)
def get_patient_by_id(patient_id: int, current_clinic=Depends(get_current_clinic), db=Depends(get_db)):
    return get_patient_by_id_service(db, current_clinic["clinic_id"], patient_id)
