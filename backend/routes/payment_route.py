from fastapi import APIRouter, Depends, status

from backend.database.db import get_db
from backend.core.security import get_current_clinic

from backend.schemas.payment_schema import (
    CreatePayment,
    CreatePaymentResponse
)

from backend.services.payment_service import (
    create_payment_service
)


router = APIRouter()

@router.post("/payments", response_model=CreatePaymentResponse, status_code=status.HTTP_201_CREATED)
def create_payment(data: CreatePayment, current_clinic=Depends(get_current_clinic), db=Depends(get_db)):
    return create_payment_service(db, current_clinic["clinic_id"], data)
