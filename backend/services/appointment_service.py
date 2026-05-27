from fastapi import HTTPException

from datetime import datetime, timezone, date, time, timedelta
from zoneinfo import ZoneInfo

from backend.repositories.patient_repository import get_patient_by_id
from backend.repositories.doctor_repository import get_doctor_by_id

from backend.tasks.whatsapp_task import (
    send_appointment_confirmation_task,
    send_appointment_cancelled_task,
    send_appointment_reminder_task
)

from backend.schemas.appointment_schema import (
    CreateAppointment,
    AppointmentUpdate,
    AppointmentTypeEnum,
    AppointmentStatusUpdate
)

from backend.repositories.appointment_repository import (
    create_appointment,
    get_existing_appointment,
    get_patient_existing_appointment,
    get_appointment_by_id,
    search_appointments,
    update_appointment_details,
    soft_delete_appointment,
    get_patient_appointment_history,
    get_doctor_appointments,
    get_appointment_schedule,
    update_appointment_status,
    get_appointment_analytics,
    get_appointment_summary_stats,
    get_next_appointment,
    get_upcoming_appointments,
    get_doctor_booked_appointments,
    get_all_doctors_booked_appointments,
    get_all_active_doctors,
    get_appointment_whatsapp_details,
    get_appointments_for_reminder,
    mark_reminder_sent
)

IST = ZoneInfo("Asia/Kolkata")

def create_appointment_service(db, clinic_id: int, data: CreateAppointment):
    try:
        patient = get_patient_by_id(db, clinic_id, data.patient_id)
        if not patient:
            raise HTTPException(
                status_code=404,
                detail="Patient Not Found"
            )
        
        doctor = get_doctor_by_id(db, clinic_id, data.doctor_id)
        if not doctor:
            raise HTTPException(
                status_code=404,
                detail="Doctor Not Found"
            )
        
        local_datetime = datetime.combine(data.appointment_date, data.appointment_time, tzinfo=IST)

        appointment_datetime_utc = local_datetime.astimezone(timezone.utc)

        if appointment_datetime_utc <= datetime.now(timezone.utc):
            raise HTTPException(
                status_code=400,
                detail="Enter a valid appointment time"
            )
        
        if data.appointment_type == AppointmentTypeEnum.scheduled:
            existing_appointment = get_existing_appointment(db, clinic_id, data.doctor_id, appointment_datetime_utc)

            if existing_appointment:
                raise HTTPException(
                    status_code=409,
                    detail="Doctor already booked for this slot"
                )

        patient_conflict = get_patient_existing_appointment(db, clinic_id, data.patient_id, appointment_datetime_utc)
        if patient_conflict:
            raise HTTPException(
                status_code=409,
                detail="Patient already has appointment at this time"
            )

        appointment = create_appointment(
            db, 
            clinic_id, 
            data.patient_id, 
            data.doctor_id,
            data.appointment_type,
            appointment_datetime_utc, 
            data.complaint, 
            data.notes, 
            data.total_amount
        )

        if not appointment:
            raise HTTPException(
                status_code=400,
                detail="Appointment Creation Failed"
            )
        
        db.commit()

        try:
            whatsapp_details = get_appointment_whatsapp_details(db, clinic_id, appointment["id"])
            if whatsapp_details:
                send_appointment_confirmation_task.delay(
                    phone=whatsapp_details["patient_phone"],
                    clinic_name=whatsapp_details["clinic_name"],
                    patient_name=whatsapp_details["patient_name"],
                    doctor_name=whatsapp_details["doctor_name"],
                    appointment_time=whatsapp_details["appointment_time"].isoformat()
                )
        except Exception as e:
            print(f"Failed to Queue Appointment Confirmation: {str(e)}")

        return appointment
    except HTTPException:
        db.rollback()
        raise
    except Exception:
        db.rollback()
        raise


def get_appointment_by_id_service(db, clinic_id: int, appointment_id: int):
    try:
        appointment = get_appointment_by_id(db, clinic_id, appointment_id)

        if not appointment:
            raise HTTPException(
                status_code=404,
                detail="Appointment Not Found"
            )
        
        appointment["appointment_time"] = appointment["appointment_time"].astimezone(IST)
        
        return appointment
    except Exception:
        raise


def search_appointments_service(
        db, clinic_id: int, query: str|None, status: str|None, appointment_date: date|None, page: int, limit: int
):
    try:
        if query:
            query = query.strip()
        
        offset = (page - 1) * limit

        appointments = search_appointments(db, clinic_id, query, status, appointment_date, limit, offset)
        if not appointments:
            return []
        
        for appointment in appointments:
            appointment["appointment_time"] = appointment["appointment_time"].astimezone(IST)
        
        return appointments
    except Exception:
        raise


def update_appointment_service(db, clinic_id: int, appointment_id: int, data: AppointmentUpdate):
    try:
        existing_appointment = get_appointment_by_id(db, clinic_id, appointment_id)
        if not existing_appointment:
            raise HTTPException(
                status_code=404,
                detail="Appointment Not Found"
            )
        
        if existing_appointment["status"] != "scheduled":
            raise HTTPException(
                status_code=409,
                detail="Only Scheduled Appointments Can Be Modified"
            )
        
        update_data = data.model_dump(exclude_unset=True)
        if not update_data:
            raise HTTPException(
                status_code=400,
                detail="No Fields Provided For Update"
            )
        
        if "doctor_id" in update_data:
            doctor = get_doctor_by_id(db, clinic_id, update_data["doctor_id"])
            if not doctor:
                raise HTTPException(
                    status_code=404,
                    detail="Doctor Not Found"
                )
            
        scheduling_changed = any([
            "doctor_id" in update_data,
            "appointment_date" in update_data,
            "appointment_time" in update_data,
            "appointment_type" in update_data
        ])

        if scheduling_changed:
            doctor_id = update_data.get("doctor_id", existing_appointment["doctor_id"])

            existing_time = existing_appointment["appointment_time"].astimezone(IST)

            appointment_date = update_data.get("appointment_date", existing_time.date())

            appointment_time = update_data.get("appointment_time", existing_time.time())

            local_datetime = datetime.combine(appointment_date, appointment_time, tzinfo=IST)

            appointment_datetime_utc = local_datetime.astimezone(timezone.utc)

            if appointment_datetime_utc <= datetime.now(timezone.utc):
                raise HTTPException(
                    status_code=400,
                    detail="Enter a valid appointment time"
                )
            
            appointment_type = AppointmentTypeEnum(update_data.get("appointment_type", existing_appointment["appointment_type"]))

            if appointment_type == AppointmentTypeEnum.scheduled:

                doctor_conflict = get_existing_appointment(db, clinic_id, doctor_id, appointment_datetime_utc)
                if doctor_conflict and doctor_conflict["id"] != appointment_id:
                    raise HTTPException(
                        status_code=409,
                        detail="Doctor Already Booked"
                    )

            patient_conflict = get_patient_existing_appointment(db, clinic_id, existing_appointment["patient_id"], appointment_datetime_utc)
            if patient_conflict and patient_conflict["id"] != appointment_id:
                raise HTTPException(
                    status_code=409,
                    detail="Patient Already Has Appointment At This Time"
                )
            
            update_data["doctor_id"] = doctor_id
            update_data["appointment_type"] = appointment_type
            update_data["appointment_time"] = appointment_datetime_utc
            update_data["reminder_sent"] = False

            update_data.pop("appointment_date", None)

        updated_appointment = update_appointment_details(db, clinic_id, appointment_id, update_data)
        if not updated_appointment:
            raise HTTPException(
                status_code=400,
                detail="Appointment Update Failed"
            )
        
        db.commit()

        updated_appointment = get_appointment_by_id(db, clinic_id, appointment_id)

        updated_appointment["appointment_time"] = updated_appointment["appointment_time"].astimezone(IST)

        return updated_appointment
    except HTTPException:
        db.rollback()
        raise
    except Exception:
        db.rollback()
        raise


def delete_appointment_service(db, clinic_id: int, appointment_id: int):
    try:
        appointment = get_appointment_by_id(db, clinic_id, appointment_id)
        if not appointment:
            raise HTTPException(
                status_code=404,
                detail="Appointment Not Found"
            )
        
        if appointment["status"] != "scheduled":
            raise HTTPException(
                status_code=409,
                detail="Only Scheduled Appointments Can Be Deleted"
            )
        
        deleted_appointment = soft_delete_appointment(db, clinic_id, appointment_id)
        if not deleted_appointment:
            raise HTTPException(
                status_code=404,
                detail="Appointment Not Found"
            )
        
        db.commit()

        return {
            "message": "Appointment Deleted Successfully"
        }
    except HTTPException:
        db.rollback()
        raise
    except Exception:
        db.rollback()
        raise


def get_patient_appointment_history_service(
        db, clinic_id: int, patient_id: int, appointment_date: date | None, page: int, limit: int
):
    try:
        patient = get_patient_by_id(db, clinic_id, patient_id)
        if not patient:
            raise HTTPException(
                status_code=404,
                detail="Patient Not Found"
            )
        
        offset = (page - 1) * limit

        appointments = get_patient_appointment_history(db, clinic_id, patient_id, appointment_date, limit, offset)
        if not appointments:
            return []
        
        for appointment in appointments:
            appointment["appointment_time"] = appointment["appointment_time"].astimezone(IST)

        return appointments
    except Exception:
        raise


def get_doctor_appointments_service(
        db, clinic_id: int, doctor_id: int, appointment_date: date | None, page: int, limit: int
):
    try:
        doctor = get_doctor_by_id(db, clinic_id, doctor_id)
        if not doctor:
            raise HTTPException(
                status_code=404,
                detail="Doctor Not Found"
            )
        
        offset = (page - 1) * limit

        appointments = get_doctor_appointments(db, clinic_id, doctor_id, appointment_date, limit, offset)
        if not appointments:
            return []
        
        for appointment in appointments:
            appointment["appointment_time"] = appointment["appointment_time"].astimezone(IST)

        return appointments
    except Exception:
        raise


def get_appointment_schedule_service(
        db, clinic_id: int, appointment_date: date | None, doctor_id: int | None, status: str | None, page: int, limit: int
):
    try:
        if not appointment_date:
            appointment_date = datetime.now(IST).date()

        if not status:
            status = "scheduled"

        if doctor_id:
            doctor = get_doctor_by_id(db, clinic_id, doctor_id)

            if not doctor:
                raise HTTPException(
                    status_code=404,
                    detail="Doctor Not Found"
                )
            
        offset = (page - 1) * limit

        appointments = get_appointment_schedule(db, clinic_id, appointment_date, doctor_id, status, limit, offset)
        if not appointments:
            return []
        
        for appointment in appointments:
            appointment["appointment_time"] = appointment["appointment_time"].astimezone(IST)

        return appointments
    except Exception:
        raise


def update_appointment_status_service(db, clinic_id: int, appointment_id: int, data: AppointmentStatusUpdate):
    try:
        appointment = get_appointment_by_id(db, clinic_id, appointment_id)
        if not appointment:
            raise HTTPException(
                status_code=404,
                detail="Appointment Not Found"
            )
        
        if appointment["status"] == data.status:
            raise HTTPException(
                status_code=409,
                detail=f"Appointment Already {data.status.replace('_', ' ').title()}"
            )
        
        updated_record = update_appointment_status(db, clinic_id, appointment_id, data.status)
        if not updated_record:
            raise HTTPException(
                status_code=400,
                detail="Failed To Update Appointment Status"
            )
        
        db.commit()

        try:
            if data.status == "cancelled":
                whatsapp_details = get_appointment_whatsapp_details(db, clinic_id, appointment_id)
                if whatsapp_details:
                    send_appointment_cancelled_task.delay(
                        phone=whatsapp_details["patient_phone"],
                        clinic_name=whatsapp_details["clinic_name"],
                        patient_name=whatsapp_details["patient_name"],
                        appointment_time=whatsapp_details["appointment_time"].isoformat()
                    )
        except Exception as e:
            print(f"Failed To Queue Cancellation: {str(e)}")

        updated_appointment = get_appointment_by_id(db, clinic_id, appointment_id)

        updated_appointment["appointment_time"] = updated_appointment["appointment_time"].astimezone(IST)

        return updated_appointment
    except HTTPException:
        db.rollback()
        raise
    except Exception:
        db.rollback()
        raise


def get_appointment_analytics_service(db, clinic_id: int, appointment_date: date | None):
    try:
        if not appointment_date:
            appointment_date = datetime.now(IST).date()

        analytics = get_appointment_analytics(db, clinic_id, appointment_date)

        return {
            "analytics_date": appointment_date,
            **analytics
        }
    except Exception:
        raise


def get_appointment_dashboard_summary_service(db, clinic_id: int):
    try:
        today = datetime.now(IST).date()

        current_time_utc = datetime.now(timezone.utc)

        summary_stats = get_appointment_summary_stats(db, clinic_id, today)

        next_appointment = get_next_appointment(db, clinic_id, current_time_utc)

        upcoming_appointments = get_upcoming_appointments(db, clinic_id, current_time_utc)

        if next_appointment:
            next_appointment["appointment_time"] = next_appointment["appointment_time"].astimezone(IST)
            
        for appointment in upcoming_appointments:
            appointment["appointment_time"] = appointment["appointment_time"].astimezone(IST)

        return {
            "summary_date": today,

            "pending_queue": summary_stats["pending_queue"],
            "completed_today": summary_stats["completed_today"],
            "walk_ins_today":summary_stats["walk_ins_today"],

            "next_appointment": next_appointment,

            "upcoming_appointments": upcoming_appointments
        }
    except Exception:
        raise


def get_appointment_availability_service(
    db, clinic_id: int, appointment_date: date, doctor_id: int | None, appointment_id: int | None
):
    try:
        today = datetime.now(IST).date()

        if appointment_date < today:
            raise HTTPException(
                status_code=400,
                detail="Past Dates Are Not Allowed"
            )
        
        if doctor_id:
            doctor = get_doctor_by_id(db,clinic_id, doctor_id)

            if not doctor:
                raise HTTPException(
                    status_code=404,
                    detail="Doctor Not Found"
                )
            
        start_datetime = datetime.combine(appointment_date, time(6, 0), tzinfo=IST)

        end_datetime = datetime.combine(appointment_date, time(22, 0), tzinfo=IST)

        generated_slots = []

        current_slot = start_datetime

        while current_slot <= end_datetime:
            if appointment_date == today and current_slot <= datetime.now(IST):
                current_slot += timedelta(minutes=15)
                continue

            generated_slots.append(current_slot)

            current_slot += timedelta(minutes=15)

        available_slots = []

        if doctor_id:
            booked_appointments = get_doctor_booked_appointments(db, clinic_id, doctor_id, appointment_date, appointment_id)

            booked_times = [
                appointment["appointment_time"].astimezone(IST)
                for appointment in booked_appointments
            ]

            for slot in generated_slots:
                is_available = True

                for booked_time in booked_times:
                    difference = abs((slot - booked_time).total_seconds()) / 60

                    if difference < 30:
                        is_available = False
                        break

                available_slots.append({
                    "time": slot.time(),
                    "available": is_available
                })
        else:
            doctors = get_all_active_doctors(db, clinic_id)

            doctor_ids = [
                doctor["id"]
                for doctor in doctors
            ]

            if not doctor_ids:
                raise HTTPException(
                    status_code=404,
                    detail="No Active Doctors Found"
                )

            booked_appointments = get_all_doctors_booked_appointments(db, clinic_id, appointment_date, appointment_id)

            doctor_bookings = {}

            for doctor_id_key in doctor_ids:
                doctor_bookings[doctor_id_key] = []

            for appointment in booked_appointments:
                if appointment["doctor_id"] in doctor_bookings:
                    doctor_bookings[appointment["doctor_id"]].append(appointment["appointment_time"].astimezone(IST))

            for slot in generated_slots:
                is_available = False

                for doctor_id_key in doctor_ids:
                    doctor_busy = False

                    for booked_time in doctor_bookings[doctor_id_key]:
                        difference = abs((slot - booked_time).total_seconds()) / 60

                        if difference < 30:
                            doctor_busy = True
                            break

                    if not doctor_busy:
                        is_available = True
                        break

                available_slots.append({
                    "time": slot.time(),
                    "available": is_available
                })
        
        return {
            "appointment_date": appointment_date,
            "doctor_id": doctor_id,
            "available_slots": available_slots
        }
    except HTTPException:
        raise
    except Exception:
        raise


def process_appointment_reminders_service(db):
    try:
        appointments = get_appointments_for_reminder(db)
        if not appointments:
            return {
                "message": "No Appointments For Reminder"
            }
        
        reminders_sent = 0

        for appointment in appointments:
            try:
                send_appointment_reminder_task.delay(
                    phone=appointment["patient_phone"],
                    clinic_name=appointment["clinic_name"],
                    patient_name=appointment["patient_name"],
                    doctor_name=appointment["doctor_name"],
                    appointment_time=appointment["appointment_time"].isoformat()
                )

                mark_reminder_sent(db, appointment["id"])

                reminders_sent += 1
            except Exception as e:
                print(
                    f"Failed Reminder For Appointment "
                    f"{appointment['id']}: "
                    f"{str(e)}"
                )
                
        db.commit()

        return {
            "message": f"{reminders_sent} Appointment Reminders Queued"
        }
    except Exception:
        db.rollback()
        raise
