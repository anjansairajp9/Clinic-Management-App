from pydantic import BaseModel, Field, EmailStr

class RegisterClinic(BaseModel):
    name: str
    phone: str = Field(..., min_length=10, max_length=15)
    email: EmailStr
    password: str = Field(..., min_length=8)
    address: str | None = None

class RegisterClinicResponse(BaseModel):
    id: int
    name: str
    phone: str = Field(min_length=10, max_length=15)
    email: EmailStr
    address: str
