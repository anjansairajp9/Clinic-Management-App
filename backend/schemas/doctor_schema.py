from pydantic import BaseModel, Field
from datetime import datetime

class DoctorCreate(BaseModel):
    name: str
    phone: str = Field(..., min_length=10, max_length=15)
    specialization: str
    notes: str | None = None

class DoctorCreateResponse(BaseModel):
    id: int
    name: str
    phone: str
    specialization: str
    notes: str | None = None
    created_at: datetime


class DoctorDetailResponse(BaseModel):
    id: int
    name: str
    phone: str
    specialization: str
    notes: str | None = None
    created_at: datetime
    updated_at: datetime
