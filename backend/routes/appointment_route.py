from fastapi import APIRouter, Depends, status, Query
from datetime import date

from backend.database.db import get_db
from backend.core.security import get_current_clinic

from backend.schemas.appointment_schema import (
    CreateAppointment,
    CreateAppointmentResponse,
    AppointmentDetailResponse,
    AppointmentSearchResponse,
    AppointmentStatusEnum,
    AppointmentUpdate,
    AppointmentUpdateResponse,
    AppointmentDeleteResponse,
    PatientAppointmentHistoryResponse,
    DoctorAppointmentResponse,
    AppointmentStatusUpdate
)

from backend.services.appointment_service import (
    create_appointment_service,
    get_appointment_by_id_service,
    search_appointments_service,
    update_appointment_service,
    delete_appointment_service,
    get_patient_appointment_history_service,
    get_doctor_appointments_service,
    get_appointment_schedule_service,
    update_appointment_status_service
)


router = APIRouter()

@router.post("/appointments", response_model=CreateAppointmentResponse, status_code=status.HTTP_201_CREATED)
def create_appointment(data: CreateAppointment, current_clinic=Depends(get_current_clinic), db=Depends(get_db)):
    return create_appointment_service(db, current_clinic["clinic_id"], data)


@router.get("/appointments/search", response_model=list[AppointmentSearchResponse], status_code=status.HTTP_200_OK)
def search_appointments(
    query: str | None = None,
    status: AppointmentStatusEnum | None = Query(default=None),
    appointment_date: date | None = None,
    page: int = Query(1, ge=1),
    limit: int = Query(10, ge=1, le=50),
    current_clinic=Depends(get_current_clinic),
    db=Depends(get_db)
):
    return search_appointments_service(
        db, current_clinic["clinic_id"], query, status, appointment_date, page, limit
    )


@router.get(
    "/appointments/{appointment_id}", response_model=AppointmentDetailResponse, status_code=status.HTTP_200_OK
)
def get_appointment_by_id(appointment_id: int, current_clinic=Depends(get_current_clinic), db=Depends(get_db)):
    return get_appointment_by_id_service(db, current_clinic["clinic_id"], appointment_id)


@router.patch(
    "/appointments/{appointment_id}", response_model=AppointmentUpdateResponse, status_code=status.HTTP_200_OK
)
def update_appointment(
    appointment_id: int, data: AppointmentUpdate, current_clinic=Depends(get_current_clinic), db=Depends(get_db)
):
    return update_appointment_service(db, current_clinic["clinic_id"], appointment_id, data)


@router.delete(
    "/appointments/{appointment_id}", response_model=AppointmentDeleteResponse, status_code=status.HTTP_200_OK
)
def delete_appointment(appointment_id: int, current_clinic=Depends(get_current_clinic), db=Depends(get_db)):
    return delete_appointment_service(db, current_clinic["clinic_id"], appointment_id)


@router.get(
    "/patients/{patient_id}/appointments", 
    response_model=list[PatientAppointmentHistoryResponse], 
    status_code=status.HTTP_200_OK
)
def patient_appointment_history(
    patient_id: int,
    appointment_date: date | None = None,
    page: int = Query(1, ge=1),
    limit: int = Query(10, ge=1, le=50),
    current_clinic=Depends(get_current_clinic), 
    db=Depends(get_db)
):
    return get_patient_appointment_history_service(
        db, current_clinic["clinic_id"], patient_id, appointment_date, page, limit
    )


@router.get(
    "/doctors/{doctor_id}/appointments",
    response_model=list[DoctorAppointmentResponse],
    status_code=status.HTTP_200_OK
)
def doctor_appointments(
    doctor_id: int,
    appointment_date: date | None = None,
    page: int = Query(1, ge=1),
    limit: int = Query(10, ge=1, le=50),
    current_clinic=Depends(get_current_clinic),
    db=Depends(get_db)
):
    return get_doctor_appointments_service(
        db, current_clinic["clinic_id"], doctor_id, appointment_date, page, limit
    )


@router.get(
    "/appointments",
    response_model=list[PatientAppointmentHistoryResponse],
    status_code=status.HTTP_200_OK
)
def appointment_schedule_dashboard(
    appointment_date: date | None = None,
    doctor_id: int | None = None,
    status: AppointmentStatusEnum | None = Query(default=None), 
    page: int = Query(1, ge=1),
    limit: int = Query(10, ge=1, le=50),
    current_clinic=Depends(get_current_clinic),
    db=Depends(get_db)
):
    return get_appointment_schedule_service(db, current_clinic["clinic_id"], appointment_date, doctor_id, status, page, limit)


@router.patch(
    "/appointments/{appointment_id}/status", response_model=AppointmentUpdateResponse, status_code=status.HTTP_200_OK
)
def update_appointment_status(
    appointment_id: int, data: AppointmentStatusUpdate, current_clinic=Depends(get_current_clinic), db=Depends(get_db)
):
    return update_appointment_status_service(db, current_clinic["clinic_id"], appointment_id, data)
