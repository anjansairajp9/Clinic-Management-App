from fastapi import APIRouter, Depends, status, Query

from datetime import date

from backend.database.db import get_db
from backend.core.security import get_current_clinic

from backend.schemas.payment_schema import (
    CreatePayment,
    CreatePaymentResponse,
    PaymentDetailResponse,
    PaymentSearchResponse,
    PaymentStatusEnum,
    PaymentUpdate,
    PaymentUpdateResponse
)

from backend.services.payment_service import (
    create_payment_service,
    get_payment_by_id_service,
    get_payment_by_appointment_id_service,
    search_payments_service,
    update_payment_service
)


router = APIRouter()

@router.post("/payments", response_model=CreatePaymentResponse, status_code=status.HTTP_201_CREATED)
def create_payment(data: CreatePayment, current_clinic=Depends(get_current_clinic), db=Depends(get_db)):
    return create_payment_service(db, current_clinic["clinic_id"], data)


@router.get("/payments/search", response_model=list[PaymentSearchResponse], status_code=status.HTTP_200_OK)
def search_payments(
    query: str | None = None,
    payment_status: PaymentStatusEnum | None = Query(default=None),
    appointment_date: date | None = None,
    page: int = Query(1, ge=1),
    limit: int = Query(10, ge=1, le=50),
    current_clinic=Depends(get_current_clinic),
    db=Depends(get_db)
):
    return search_payments_service(
        db, current_clinic["clinic_id"], query, payment_status, appointment_date, page, limit
    )


@router.get("/payments/{payment_id}", response_model=PaymentDetailResponse, status_code=status.HTTP_200_OK)
def get_payment_by_id(payment_id: int, current_clinic=Depends(get_current_clinic), db=Depends(get_db)):
    return get_payment_by_id_service(db, current_clinic["clinic_id"], payment_id)


@router.get("/appointments/{appointment_id}/payments", response_model=PaymentDetailResponse, status_code=status.HTTP_200_OK)
def get_payment_by_appointment_id(appointment_id: int, current_clinic=Depends(get_current_clinic), db=Depends(get_db)):
    return get_payment_by_appointment_id_service(db, current_clinic["clinic_id"], appointment_id)


@router.patch("/payments/{payment_id}", response_model=PaymentUpdateResponse, status_code=status.HTTP_200_OK)
def update_payment(payment_id: int, data: PaymentUpdate, current_clinic=Depends(get_current_clinic), db=Depends(get_db)):
    return update_payment_service(db, current_clinic["clinic_id"], payment_id, data)
