from pydantic import BaseModel, EmailStr
from decimal import Decimal
from datetime import datetime, date

class RecentClinicResponse(BaseModel):
    id: int
    name: str
    phone: str
    email: EmailStr
    address: str | None = None
    created_at: datetime
    updated_at: datetime


class SuperAdminDashboardResponse(BaseModel):
    total_clinics: int
    total_doctors: int
    total_patients: int
    total_appointments: int
    total_treatments: int
    total_revenue: Decimal

    analytics_date: date
    selected_date_appointments: int

    pending_payments: int

    recent_clinics: list[RecentClinicResponse]
