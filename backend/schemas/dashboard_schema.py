from pydantic import BaseModel
from decimal import Decimal

class ClinicDashboardOverviewResponse(BaseModel):
    total_patients: int
    total_doctors: int
    total_appointments: int
    total_treatments: int
    total_revenue: Decimal
