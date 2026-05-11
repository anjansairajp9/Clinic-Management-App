from fastapi import APIRouter, Depends, status, Query

from backend.schemas.doctor_schema import (
    DoctorCreate,
    DoctorCreateResponse,
    DoctorDetailResponse,
    DoctorSearchResponse,
    DoctorUpdate
)

from backend.services.doctor_service import (
    create_doctor_service,
    get_doctor_by_id_service,
    search_doctors_service,
    update_doctor_details_service
)

from backend.database.db import get_db
from backend.core.security import get_current_clinic

router = APIRouter()

@router.post("/doctors", response_model=DoctorCreateResponse, status_code=status.HTTP_201_CREATED)
def create_doctor(data: DoctorCreate, current_clinic=Depends(get_current_clinic), db=Depends(get_db)):
    return create_doctor_service(db, current_clinic["clinic_id"], data)


@router.get("/doctors/search", response_model=list[DoctorSearchResponse], status_code=status.HTTP_200_OK)
def search_doctors(
    query: str, 
    page: int = Query(1, ge=1), 
    limit: int = Query(10, ge=1, le=50), 
    current_clinic=Depends(get_current_clinic), 
    db=Depends(get_db)
):
    return search_doctors_service(db, current_clinic["clinic_id"], query, page, limit)


@router.get("/doctors/{doctor_id}", response_model=DoctorDetailResponse, status_code=status.HTTP_200_OK)
def get_doctor_by_id(doctor_id: int, current_clinic=Depends(get_current_clinic), db=Depends(get_db)):
    return get_doctor_by_id_service(db, current_clinic["clinic_id"], doctor_id)


@router.patch("/doctors/{doctor_id}", response_model=DoctorDetailResponse, status_code=status.HTTP_200_OK)
def update_doctor(doctor_id: int, data: DoctorUpdate, current_clinic=Depends(get_current_clinic), db=Depends(get_db)):
    return update_doctor_details_service(db, current_clinic["clinic_id"], doctor_id, data)
