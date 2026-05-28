from fastapi import HTTPException

from backend.repositories.appointment_repository import get_appointment_by_id

from backend.schemas.treatment_schema import (
    CreateTreatment
)

from backend.repositories.treatment_repository import (
    create_treatment,
    get_treatment_by_appointment_id
)

def create_treatment_service(db, clinic_id: int, data: CreateTreatment):
    try:
        appointment = get_appointment_by_id(db, clinic_id, data.appointment_id)
        if not appointment:
            raise HTTPException(
                status_code=404,
                detail="Appointment Not Found"
            )
        
        if appointment["status"] not in ["scheduled", "completed"]:
            raise HTTPException(
                status_code=409,
                detail="Only Scheduled And Completed Appointments Can Have Treatments"
            )
        
        existing_treatment = get_treatment_by_appointment_id(db, clinic_id, data.appointment_id)
        if existing_treatment:
            raise HTTPException(
                status_code=409,
                detail="Treatment Already Exists For This Appointment"
            )
        
        treatment = create_treatment(
                            db,
                            clinic_id,
                            appointment["patient_id"],
                            appointment["doctor_id"],
                            data.appointment_id,
                            data.diagnosis,
                            data.treatment_performed,
                            data.medicines_prescribed,
                            data.procedure_notes,
                            data.follow_up_instructions
                        )
        if not treatment:
            raise HTTPException(
                status_code=400,
                detail="Failed To Create Treatment"
            )
        
        db.commit()

        return treatment
    except HTTPException:
        db.rollback()
        raise
    except Exception:
        db.rollback()
        raise
