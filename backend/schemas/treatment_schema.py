from pydantic import BaseModel, Field
from datetime import datetime

from backend.schemas.appointment_schema import AppointmentStatusEnum

class CreateTreatment(BaseModel):
    appointment_id: int
    diagnosis: str = Field(min_length=1, max_length=500)
    treatment_performed: str = Field(min_length=1, max_length=2000)
    medicines_prescribed: str | None = Field(default=None, max_length=3000)
    procedure_notes: str | None = Field(default=None, max_length=5000)
    follow_up_instructions: str | None = Field(default=None, max_length=3000)

class CreateTreatmentResponse(BaseModel):
    id: int
    patient_id: int
    doctor_id: int
    appointment_id: int
    diagnosis: str
    treatment_performed: str
    medicines_prescribed: str | None = None
    procedure_notes: str | None = None
    follow_up_instructions: str | None = None
    created_at: datetime
    updated_at: datetime


class TreatmentDetailResponse(BaseModel):
    id: int 

    patient_id: int
    patient_name: str
    patient_age: int
    patient_phone: str

    doctor_id: int
    doctor_name: str
    doctor_specialization: str

    appointment_id: int
    appointment_time: datetime
    appointment_status: AppointmentStatusEnum
    appointment_complaint: str | None = None

    diagnosis: str
    treatment_performed: str
    medicines_prescribed: str | None = None
    procedure_notes: str | None = None
    follow_up_instructions: str | None = None

    created_at: datetime
    updated_at: datetime


class TreatmentSearchResponse(BaseModel):
    id: int

    patient_id: int
    patient_name: str
    patient_age: int
    patient_phone: str

    doctor_id: int
    doctor_name: str

    diagnosis: str

    appointment_id: int
    appointment_time: datetime


class TreatmentUpdate(BaseModel):
    diagnosis: str | None = Field(default=None, max_length=500)
    treatment_performed: str | None = Field(default=None, max_length=2000)
    medicines_prescribed: str | None = Field(default=None, max_length=3000)
    procedure_notes: str | None = Field(default=None, max_length=5000)
    follow_up_instructions: str | None = Field(default=None, max_length=3000)

class TreatmentUpdateResponse(BaseModel):
    id: int

    patient_id: int
    patient_name: str
    patient_age: int
    patient_phone: str

    doctor_id: int
    doctor_name: str
    doctor_specialization: str

    appointment_id: int
    appointment_time: datetime
    appointment_status: AppointmentStatusEnum
    appointment_complaint: str | None = None

    diagnosis: str
    treatment_performed: str
    medicines_prescribed: str | None = None
    procedure_notes: str | None = None
    follow_up_instructions: str | None = None

    created_at: datetime
    updated_at: datetime


class TreatmentDeleteResponse(BaseModel):
    message: str


class PatientTreatmentHistoryResponse(BaseModel):
    id: int

    patient_name: str
    patient_age: int

    doctor_name: str
    doctor_specialization: str

    diagnosis: str
    treatment_performed: str
    medicines_prescribed: str | None = None

    appointment_time: datetime

    created_at: datetime
    updated_at: datetime


class TreatmentFileResponse(BaseModel):
    id: int
    treatment_id: int
    original_file_name: str
    file_type: str
    file_size: int
    file_url: str
    created_at: datetime
