from fastapi import APIRouter, Depends, status

from backend.database.db import get_db
from backend.core.security import get_current_clinic

from backend.schemas.treatment_schema import (
    CreateTreatment,
    CreateTreatmentResponse
)

from backend.services.treatment_service import (
    create_treatment_service
)

router = APIRouter()

@router.post("/treatments", response_model=CreateTreatmentResponse, status_code=status.HTTP_201_CREATED)
def create_treatment(data: CreateTreatment, current_clinic=Depends(get_current_clinic), db=Depends(get_db)):
    return create_treatment_service(db, current_clinic["clinic_id"], data)
