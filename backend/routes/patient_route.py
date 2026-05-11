from fastapi import APIRouter, Depends, status, Query

from backend.schemas.patient_schema import (
    PatientCreate,
    PatientCreateResponse,
    PatientDetailResponse,
    PatientSearchResponse,
    PatientUpdate,
    PatientUpdateResponse,
    PatientDeleteResponse,
    PatientMedicalHistory,
    PatientMedicalHistoryResponse
)

from backend.services.patient_service import (
    create_patient_service,
    get_patient_by_id_service,
    search_patients_service,
    update_patient_service,
    delete_patient_service,
    update_medical_history_service
)

from backend.database.db import get_db
from backend.core.security import get_current_clinic

router = APIRouter()

@router.post("/patients", response_model=PatientCreateResponse, status_code=status.HTTP_201_CREATED)
def create_patient(data: PatientCreate, current_clinic=Depends(get_current_clinic), db=Depends(get_db)):
    return create_patient_service(db, current_clinic["clinic_id"], data)


@router.get("/patients/search", response_model=list[PatientSearchResponse], status_code=status.HTTP_200_OK)
def search_patients(
    query: str, 
    page: int = Query(1, ge=1), 
    limit: int = Query(10, ge=1, le=50), 
    current_clinic=Depends(get_current_clinic), 
    db=Depends(get_db)
):
    return search_patients_service(db, current_clinic["clinic_id"], query, page, limit)


@router.get("/patients/{patient_id}", response_model=PatientDetailResponse, status_code=status.HTTP_200_OK)
def get_patient_by_id(patient_id: int, current_clinic=Depends(get_current_clinic), db=Depends(get_db)):
    return get_patient_by_id_service(db, current_clinic["clinic_id"], patient_id)


@router.patch("/patients/{patient_id}", response_model=PatientUpdateResponse, status_code=status.HTTP_200_OK)
def update_patient_details(
    patient_id: int, 
    data: PatientUpdate, 
    current_clinic=Depends(get_current_clinic), 
    db=Depends(get_db)
):
    return update_patient_service(db, current_clinic["clinic_id"], patient_id, data)


@router.delete("/patients/{patient_id}", response_model=PatientDeleteResponse, status_code=status.HTTP_200_OK)
def delete_patient(patient_id: int, current_clinic=Depends(get_current_clinic), db=Depends(get_db)):
    return delete_patient_service(db, current_clinic["clinic_id"], patient_id)


@router.patch(
    "/patients/{patient_id}/medical-history", 
    response_model=PatientMedicalHistoryResponse, 
    status_code=status.HTTP_200_OK
)
def update_medical_history(
    patient_id: int, 
    data: PatientMedicalHistory, 
    current_clinic=Depends(get_current_clinic),
    db=Depends(get_db)
):
    return update_medical_history_service(db, current_clinic["clinic_id"], patient_id, data)
