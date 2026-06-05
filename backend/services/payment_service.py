from fastapi import HTTPException

from datetime import date
from zoneinfo import ZoneInfo

from backend.repositories.appointment_repository import get_appointment_by_id

from backend.schemas.payment_schema import (
    CreatePayment,
    PaymentStatusEnum
)

from backend.repositories.payment_repository import (
    create_payment,
    get_payment_by_appointment_id_to_validate_create_payment,
    get_payment_by_id,
    get_payment_by_appointment_id,
    search_payments
)

IST = ZoneInfo("Asia/Kolkata")

def create_payment_service(db, clinic_id: int, data: CreatePayment):
    try:
        appointment = get_appointment_by_id(db, clinic_id, data.appointment_id)
        if not appointment:
            raise HTTPException(
                status_code=404,
                detail="Appointment Not Found"
            )
        
        existing_payment = get_payment_by_appointment_id_to_validate_create_payment(db, clinic_id, data.appointment_id)
        if existing_payment:
            raise HTTPException(
                status_code=409,
                detail="Payment Already Exists For This Appointment"
            )
        
        if data.amount_paid > data.total_amount:
            raise HTTPException(
                status_code=400,
                detail="Amount Paid Cannot Be Greater Than Total Amount"
            )
        
        payment_status = data.payment_status
        if not payment_status:
            if data.amount_paid >= data.total_amount:
                payment_status = PaymentStatusEnum.paid.value
            else:
                payment_status = PaymentStatusEnum.pending.value

        payment = create_payment(
            db, clinic_id, data.appointment_id, data.total_amount, data.amount_paid, data.payment_method, payment_status, data.notes
        )
        if not payment:
            raise HTTPException(
                status_code=400,
                detail="Failed To Create Payment"
            )
        
        db.commit()

        return payment
    except HTTPException:
        db.rollback()
        raise
    except Exception:
        db.rollback()
        raise


def get_payment_by_id_service(db, clinic_id: int, payment_id: int):
    try:
        payment = get_payment_by_id(db, clinic_id, payment_id)
        if not payment:
            raise HTTPException(
                status_code=404,
                detail="Payment Not Found"
            )
        
        payment["appointment_time"] = payment["appointment_time"].astimezone(IST)

        return payment
    except Exception:
        raise


def get_payment_by_appointment_id_service(db, clinic_id: int, appointment_id: int):
    try:
        appointment = get_appointment_by_id(db, clinic_id, appointment_id)
        if not appointment:
            raise HTTPException(
                status_code=404,
                detail="Appointment Not Found"
            )
        
        payment = get_payment_by_appointment_id(db, clinic_id, appointment_id)
        if not payment:
            raise HTTPException(
                status_code=404,
                detail="Payment Not Found For This Appointment"
            )
        
        payment["appointment_time"] = payment["appointment_time"].astimezone(IST)

        return payment
    except Exception:
        raise


def search_payments_service(
    db, 
    clinic_id: int,
    query: str | None,
    payment_status: str | None,
    appointment_date: date | None,
    page: int,
    limit: int
):
    try:
        if query:
            query = query.strip()

        offset = (page - 1) * limit

        payments = search_payments(db, clinic_id, query, payment_status, appointment_date, limit, offset)
        if not payments:
            return []
        
        for payment in payments:
            payment["appointment_time"] = payment["appointment_time"].astimezone(IST)

        return payments
    except Exception:
        raise
