from fastapi import APIRouter, Depends, status

from backend.database.db import get_db
from backend.core.security import get_current_clinic

from backend.schemas.payment_schema import (
    CreatePayment,
    CreatePaymentResponse,
    PaymentDetailResponse
)

from backend.services.payment_service import (
    create_payment_service,
    get_payment_by_id_service,
    get_payment_by_appointment_id_service
)


router = APIRouter()

@router.post("/payments", response_model=CreatePaymentResponse, status_code=status.HTTP_201_CREATED)
def create_payment(data: CreatePayment, current_clinic=Depends(get_current_clinic), db=Depends(get_db)):
    return create_payment_service(db, current_clinic["clinic_id"], data)


@router.get("/payments/{payment_id}", response_model=PaymentDetailResponse, status_code=status.HTTP_200_OK)
def get_payment_by_id(payment_id: int, current_clinic=Depends(get_current_clinic), db=Depends(get_db)):
    return get_payment_by_id_service(db, current_clinic["clinic_id"], payment_id)


@router.get("/appointments/{appointment_id}/payments", response_model=PaymentDetailResponse, status_code=status.HTTP_200_OK)
def get_payment_by_appointment_id(appointment_id: int, current_clinic=Depends(get_current_clinic), db=Depends(get_db)):
    return get_payment_by_appointment_id_service(db, current_clinic["clinic_id"], appointment_id)
