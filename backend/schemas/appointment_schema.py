from pydantic import BaseModel, Field
from datetime import date, time, datetime
from decimal import Decimal

class CreateAppointment(BaseModel):
    patient_id: int
    doctor_id: int
    appointment_date: date
    appointment_time: time
    complaint: str | None = None
    notes: str | None = None
    total_amount: Decimal = Field(default=Decimal("0.00"), ge=0)

class CreateAppointmentResponse(BaseModel):
    id: int
    patient_id: int
    doctor_id: int
    appointment_time: datetime
    status: str
    complaint: str | None = None
    notes: str | None = None
    total_amount: Decimal 
    created_at: datetime
