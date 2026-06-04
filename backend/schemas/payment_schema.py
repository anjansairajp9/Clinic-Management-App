from pydantic import BaseModel, Field
from enum import Enum
from decimal import Decimal
from datetime import datetime

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
