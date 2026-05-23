from fastapi import APIRouter, Depends, status

from backend.database.db import get_db
from backend.core.security import get_current_clinic

from backend.schemas.appointment_schema import (
    CreateAppointment,
    CreateAppointmentResponse,
    AppointmentDetailResponse
)

from backend.services.appointment_service import (
    create_appointment_service,
    get_appointment_by_id_service
)


router = APIRouter()

@router.post("/appointments", response_model=CreateAppointmentResponse, status_code=status.HTTP_201_CREATED)
def create_appointment(data: CreateAppointment, current_clinic=Depends(get_current_clinic), db=Depends(get_db)):
    return create_appointment_service(db, current_clinic["clinic_id"], data)


@router.get(
    "/appointments/{appointment_id}", response_model=AppointmentDetailResponse, status_code=status.HTTP_200_OK
)
def get_appointment_by_id(appointment_id: int, current_clinic=Depends(get_current_clinic), db=Depends(get_db)):
    return get_appointment_by_id_service(db, current_clinic["clinic_id"], appointment_id)
