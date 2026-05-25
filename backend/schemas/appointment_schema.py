from pydantic import BaseModel, Field
from datetime import date, time, datetime
from decimal import Decimal
from enum import Enum

class AppointmentStatusEnum(str, Enum):
    scheduled = "scheduled"
    completed = "completed"
    cancelled = "cancelled"
    no_show = "no_show"

class AppointmentTypeEnum(str, Enum):
    scheduled = "scheduled"
    walk_in = "walk_in"


class CreateAppointment(BaseModel):
    patient_id: int
    doctor_id: int
    appointment_type: AppointmentTypeEnum = AppointmentTypeEnum.scheduled
    appointment_date: date
    appointment_time: time
    complaint: str | None = None
    notes: str | None = None
    total_amount: Decimal = Field(default=Decimal("0.00"), ge=0)

class CreateAppointmentResponse(BaseModel):
    id: int
    patient_id: int
    doctor_id: int
    appointment_type: AppointmentTypeEnum
    appointment_time: datetime
    status: AppointmentStatusEnum
    complaint: str | None = None
    notes: str | None = None
    total_amount: Decimal 
    created_at: datetime


class AppointmentDetailResponse(BaseModel):
    id: int

    patient_id: int
    patient_name: str
    patient_phone: str

    doctor_id: int
    doctor_name: str
    doctor_phone: str
    doctor_specialization: str

    appointment_type: AppointmentTypeEnum
    appointment_time: datetime
    status: AppointmentStatusEnum
    complaint: str | None = None
    notes: str | None = None
    total_amount: Decimal
    created_at: datetime
    updated_at: datetime


class AppointmentSearchResponse(BaseModel):
    id: int

    patient_name: str
    patient_phone: str

    doctor_name: str
    doctor_phone: str

    appointment_type: AppointmentTypeEnum
    appointment_time: datetime
    status: AppointmentStatusEnum
    complaint: str | None = None
    notes: str | None = None
    total_amount: Decimal


class AppointmentUpdate(BaseModel):
    doctor_id: int | None = None

    appointment_type: AppointmentTypeEnum | None = None
    appointment_date: date | None = None
    appointment_time: time | None = None
    status: AppointmentStatusEnum | None = None
    complaint: str | None = None
    notes: str | None = None
    total_amount: Decimal | None = Field(default=None, ge=0)

class AppointmentUpdateResponse(BaseModel):
    id: int

    patient_id: int
    patient_name: str
    patient_phone: str

    doctor_id: int
    doctor_name: str
    doctor_phone: str
    doctor_specialization: str

    appointment_type: AppointmentTypeEnum
    appointment_time: datetime
    status: AppointmentStatusEnum
    complaint: str | None = None
    notes: str | None = None
    total_amount: Decimal
    created_at: datetime
    updated_at: datetime


class AppointmentDeleteResponse(BaseModel):
    message: str


class PatientAppointmentHistoryResponse(BaseModel):
    id: int

    patient_name: str
    patient_phone: str

    doctor_name: str
    doctor_phone: str
    doctor_specialization: str

    appointment_type: AppointmentTypeEnum
    appointment_time: datetime
    status: AppointmentStatusEnum
    complaint: str | None = None
    notes: str | None = None
    total_amount: Decimal
    created_at: datetime
    updated_at: datetime


class DoctorAppointmentResponse(BaseModel):
    id: int

    patient_name: str
    patient_phone: str

    doctor_name: str
    doctor_phone: str
    doctor_specialization: str

    appointment_type: AppointmentTypeEnum
    appointment_time: datetime
    status: AppointmentStatusEnum
    complaint: str | None = None
    notes: str | None = None
    total_amount: Decimal
    created_at: datetime
    updated_at: datetime


class AppointmentStatusUpdate(BaseModel):
    status: AppointmentStatusEnum


class AppointmentAnalyticsResponse(BaseModel):
    analytics_date: date

    total_appointments: int

    scheduled_appointments: int
    walk_in_appointments: int

    completed_appointments: int
    cancelled_appointments: int
    no_show_appointments: int
    pending_appointments: int

    total_revenue: Decimal


class AppointmentSummaryCardResponse(BaseModel):
    id: int

    patient_name: str
    patient_phone: str

    doctor_name: str
    doctor_phone: str

    appointment_time: datetime
    appointment_type: AppointmentTypeEnum
    status: AppointmentStatusEnum

class AppointmentDashboardSummaryResponse(BaseModel):
    summary_date: date

    pending_queue: int
    completed_today: int
    walk_ins_today: int

    next_appointment: AppointmentSummaryCardResponse | None = None

    upcoming_appointments: list[AppointmentSummaryCardResponse]


class AppointmentAvailabilitySlotResponse(BaseModel):
    time: time
    available: bool

class AppointmentAvailabilityResponse(BaseModel):
    appointment_date: date
    doctor_id: int | None = None
    available_slots: list[AppointmentAvailabilitySlotResponse]
