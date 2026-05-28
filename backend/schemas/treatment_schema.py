from pydantic import BaseModel, Field
from datetime import datetime

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
