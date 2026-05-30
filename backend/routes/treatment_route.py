from fastapi import APIRouter, Depends, status, Query
from datetime import date

from backend.database.db import get_db
from backend.core.security import get_current_clinic

from backend.schemas.treatment_schema import (
    CreateTreatment,
    CreateTreatmentResponse,
    TreatmentDetailResponse,
    TreatmentSearchResponse
)

from backend.services.treatment_service import (
    create_treatment_service,
    get_treatment_by_id_service,
    search_treatments_service
)

router = APIRouter()

@router.post("/treatments", response_model=CreateTreatmentResponse, status_code=status.HTTP_201_CREATED)
def create_treatment(data: CreateTreatment, current_clinic=Depends(get_current_clinic), db=Depends(get_db)):
    return create_treatment_service(db, current_clinic["clinic_id"], data)


@router.get("/treatments/search", response_model=list[TreatmentSearchResponse], status_code=status.HTTP_200_OK)
def search_treatments(
    query: str | None = None,
    appointment_date: date | None = None,
    page: int = Query(1, ge=1),
    limit: int = Query(10, ge=1, le=50),
    current_clinic=Depends(get_current_clinic),
    db=Depends(get_db)
):
    return search_treatments_service(db, current_clinic["clinic_id"], query, appointment_date, page, limit)


@router.get("/treatments/{treatment_id}", response_model=TreatmentDetailResponse, status_code=status.HTTP_200_OK)
def get_treatment_by_id(treatment_id: int, current_clinic=Depends(get_current_clinic), db=Depends(get_db)):
    return get_treatment_by_id_service(db, current_clinic["clinic_id"], treatment_id)
