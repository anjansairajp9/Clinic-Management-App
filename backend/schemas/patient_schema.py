from pydantic import BaseModel, Field, field_validator
from enum import Enum
from datetime import date, datetime

class GenderEnum(str, Enum):
    male = "male"
    female = "female"
    other = "other"

class PatientCreate(BaseModel):
    name: str
    phone: str = Field(..., min_length=10, max_length=15)
    gender: GenderEnum
    dob: date
    notes: str | None = None

    @field_validator("gender", mode="before")
    @classmethod
    def normalize_gender(cls, value):
        if isinstance(value, str):
            return value.lower()
        return value

class PatientCreateResponse(BaseModel):
    id: int
    name: str
    phone: str
    gender: GenderEnum
    dob: date
    notes: str | None = None
    created_at: datetime


class PatientDetailResponse(BaseModel):
    id: int
    name: str
    phone: str
    gender: GenderEnum
    dob: date
    notes: str | None = None
    medical_history: dict | None = None
    created_at: datetime
    updated_at: datetime


class PatientSearchResponse(BaseModel):
    id: int
    name: str
    phone: str
    gender: GenderEnum
    dob: date


class PatientUpdate(BaseModel):
    name: str | None = None
    phone: str | None = Field(default=None, min_length=10, max_length=15)
    gender: GenderEnum | None = None
    dob: date | None = None
    notes: str | None = None

class PatientUpdateResponse(BaseModel):
    id: int
    name: str
    phone: str
    gender: GenderEnum
    dob: date
    notes: str | None = None
    created_at: datetime
    updated_at: datetime


class PatientDeleteResponse(BaseModel):
    message: str


class PatientMedicalHistory(BaseModel):
    data: dict

class PatientMedicalHistoryResponse(BaseModel):
    patient_id: int
    medical_history: dict
    updated_at: datetime
