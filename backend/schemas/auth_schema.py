from pydantic import BaseModel, Field, EmailStr
from datetime import datetime

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
    address: str | None = None


class LoginClinic(BaseModel):
    email: EmailStr
    password: str

class LoginClinicResponse(BaseModel):
    access_token: str
    token_type: str


class LogoutResponse(BaseModel):
    message: str


class ForgotPassword(BaseModel):
    email: EmailStr

class ForgotPasswordResponse(BaseModel):
    message: str
    reset_token: str | None = None


class ResetPassword(BaseModel):
    token: str
    new_password: str = Field(..., min_length=8)

class ResetPasswordResponse(BaseModel):
    message: str


class ClinicDetailResponse(BaseModel):
    id: int
    name: str
    phone: str
    email: EmailStr
    address: str | None = None
    created_at: datetime
    updated_at: datetime


class ClinicUpdate(BaseModel):
    name: str | None = None
    phone: str | None = Field(default=None, min_length=10, max_length=15)
    email: EmailStr | None = None
    address: str | None = None
