from pydantic import BaseModel, Field
from enum import Enum
from decimal import Decimal
from datetime import datetime
from backend.schemas.appointment_schema import AppointmentStatusEnum

class PaymentMethodEnum(str, Enum):
    cash = "cash"
    upi = "upi"
    card = "card"
    bank_transfer = "bank_transfer"

class PaymentStatusEnum(str, Enum):
    pending = "pending"
    paid = "paid"


class CreatePayment(BaseModel):
    appointment_id: int
    total_amount: Decimal = Field(default=Decimal("0.00"), ge=0)
    amount_paid: Decimal = Field(default=Decimal("0.00"), ge=0)
    payment_method: PaymentMethodEnum | None = None
    payment_status: PaymentStatusEnum | None = None
    notes: str | None = None

class CreatePaymentResponse(BaseModel):
    id: int
    appointment_id: int
    total_amount: Decimal
    amount_paid: Decimal
    payment_method: PaymentMethodEnum | None
    payment_status: PaymentStatusEnum | None
    notes: str | None = None
    created_at: datetime


class PaymentDetailResponse(BaseModel):
    id: int

    patient_id: int
    patient_name: str
    patient_phone: str

    doctor_id: int
    doctor_name: str

    appointment_id: int
    appointment_time: datetime
    appointment_status: AppointmentStatusEnum
    appointment_complaint: str | None

    treatment_id: int | None
    treatment_diagnosis: str | None
    treatment_performed: str | None
    treatment_medicines_prescribed: str | None

    total_amount: Decimal
    amount_paid: Decimal
    payment_method: PaymentMethodEnum | None
    payment_status: PaymentStatusEnum | None
    notes: str | None
    created_at: datetime
    updated_at: datetime


class PaymentSearchResponse(BaseModel):
    id: int

    patient_id: int
    patient_name: str
    patient_phone: str

    doctor_id: int
    doctor_name: str

    appointment_id: int
    appointment_time: datetime
    appointment_status: AppointmentStatusEnum
    
    treatment_id: int | None
    treatment_diagnosis: str | None

    total_amount: Decimal
    amount_paid: Decimal
    payment_method: PaymentMethodEnum | None
    payment_status: PaymentStatusEnum | None


class PaymentUpdate(BaseModel):
    total_amount: Decimal | None = Field(default=None, ge=0)
    amount_paid: Decimal | None = Field(default=None, ge=0)
    payment_method: PaymentMethodEnum | None = None
    payment_status: PaymentStatusEnum | None = None
    notes: str | None = None

class PaymentUpdateResponse(BaseModel):
    id: int
    appointment_id: int
    total_amount: Decimal
    amount_paid: Decimal
    payment_method: PaymentMethodEnum | None
    payment_status: PaymentStatusEnum | None
    notes: str | None = None
    created_at: datetime
    updated_at: datetime
