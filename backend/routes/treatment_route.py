from fastapi import APIRouter, Depends, status, Query, UploadFile, File
from typing import Annotated
from datetime import date

from backend.database.db import get_db
from backend.core.security import get_current_clinic

from backend.schemas.treatment_schema import (
    CreateTreatment,
    CreateTreatmentResponse,
    TreatmentDetailResponse,
    TreatmentSearchResponse,
    TreatmentUpdate,
    TreatmentUpdateResponse,
    TreatmentDeleteResponse,
    PatientTreatmentHistoryResponse,
    TreatmentFileResponse
)

from backend.services.treatment_service import (
    create_treatment_service,
    get_treatment_by_id_service,
    search_treatments_service,
    update_treatment_service,
    delete_treatment_service,
    get_patient_treatment_history_service,
    get_treatment_by_appointment_id_service,
    upload_treatment_files_service,
    get_treatment_files_service
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


@router.patch("/treatments/{treatment_id}", response_model=TreatmentUpdateResponse, status_code=status.HTTP_200_OK)
def update_treatment(
    treatment_id: int, data: TreatmentUpdate, current_clinic=Depends(get_current_clinic), db=Depends(get_db)
):
    return update_treatment_service(db, current_clinic["clinic_id"], treatment_id, data)


@router.delete("/treatments/{treatment_id}", response_model=TreatmentDeleteResponse, status_code=status.HTTP_200_OK)
def delete_treatment(treatment_id: int, current_clinic=Depends(get_current_clinic), db=Depends(get_db)):
    return delete_treatment_service(db, current_clinic["clinic_id"], treatment_id)


@router.get(
    "/patients/{patient_id}/treatments", 
    response_model=list[PatientTreatmentHistoryResponse], 
    status_code=status.HTTP_200_OK
)
def patient_treatment_history(
    patient_id: int,
    appointment_date: date | None = None,
    page: int = Query(1, ge=1),
    limit: int = Query(10, ge=1, le=50),
    current_clinic=Depends(get_current_clinic),
    db=Depends(get_db)
):
    return get_patient_treatment_history_service(db, current_clinic["clinic_id"], patient_id, appointment_date, page, limit)


@router.get(
    "/appointments/{appointment_id}/treatments", response_model=TreatmentDetailResponse, status_code=status.HTTP_200_OK
)
def get_treatment_by_appointment_id(appointment_id: int, current_clinic=Depends(get_current_clinic), db=Depends(get_db)):
    return get_treatment_by_appointment_id_service(db, current_clinic["clinic_id"], appointment_id)


@router.post(
    "/treatments/{treatment_id}/files",
    response_model=list[TreatmentFileResponse],
    status_code=status.HTTP_201_CREATED
)
def upload_treatment_files(
    treatment_id: int, 
    files: Annotated[list[UploadFile], File(..., description="Upload Treatment File")], 
    current_clinic=Depends(get_current_clinic),
    db=Depends(get_db)
):
    return upload_treatment_files_service(db, current_clinic["clinic_id"], treatment_id, files)


@router.get(
    "/treatments/{treatment_id}/files",
    response_model=list[TreatmentFileResponse],
    status_code=status.HTTP_200_OK
)
def get_treatment_files(treatment_id: int, current_clinic=Depends(get_current_clinic), db=Depends(get_db)):
    return get_treatment_files_service(db, current_clinic["clinic_id"], treatment_id)
