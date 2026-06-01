from fastapi import HTTPException, UploadFile

from datetime import date
from zoneinfo import ZoneInfo

import os
import uuid
from pathlib import Path

from backend.repositories.patient_repository import get_patient_by_id
from backend.repositories.appointment_repository import get_appointment_by_id

from backend.schemas.treatment_schema import (
    CreateTreatment,
    TreatmentUpdate
)

from backend.repositories.treatment_repository import (
    create_treatment,
    get_treatment_by_appointment_id,
    get_treatment_by_id,
    search_treatments,
    update_treatment_details,
    delete_treatment,
    get_patient_treatment_history,
    get_treatment_by_appointment_id_full,
    create_treatment_file
)

IST = ZoneInfo("Asia/Kolkata")

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


def get_treatment_by_id_service(db, clinic_id: int, treatment_id: int):
    try:
        treatment = get_treatment_by_id(db, clinic_id, treatment_id)
        if not treatment:
            raise HTTPException(
                status_code=404,
                detail="Treatment Not Found"
            )
        
        treatment["appointment_time"] = treatment["appointment_time"].astimezone(IST)

        today = date.today()
        dob = treatment["patient_dob"]
        age = (today.year - dob.year - ((today.month, today.day) < (dob.month, dob.day)))

        treatment["patient_age"] = age

        treatment.pop("patient_dob")

        return treatment
    except Exception:
        raise


def search_treatments_service(
    db, clinic_id: int, query: str | None, appointment_date: date | None, page: int, limit: int
):
    try:
        if query:
            query = query.strip()

        offset = (page - 1) * limit

        treatments = search_treatments(db, clinic_id, query, appointment_date, limit, offset)
        if not treatments:
            return []
        
        today = date.today()

        for treatment in treatments:
            treatment["appointment_time"] = treatment["appointment_time"].astimezone(IST)

            dob = treatment["patient_dob"]
            age = (today.year - dob.year - ((today.month, today.day) < (dob.month, dob.day)))
            treatment["patient_age"] = age

            treatment.pop("patient_dob")

        return treatments
    except Exception:
        raise


def update_treatment_service(db, clinic_id: int, treatment_id: int, data: TreatmentUpdate):
    try:
        existing_treatment = get_treatment_by_id(db, clinic_id, treatment_id)
        if not existing_treatment:
            raise HTTPException(
                status_code=404,
                detail="Treatment Not Found"
            )
        
        update_data = data.model_dump(exclude_unset=True)
        if not update_data:
            raise HTTPException(
                status_code=400,
                detail="No Fields Provided For Update"
            )
        
        updated_treatment = update_treatment_details(db, clinic_id, treatment_id, update_data)
        if not updated_treatment:
            raise HTTPException(
                status_code=400,
                detail="Failed To Update Treatment"
            )
        
        db.commit()

        updated_treatment = get_treatment_by_id(db, clinic_id, treatment_id)

        updated_treatment["appointment_time"] = updated_treatment["appointment_time"].astimezone(IST)

        today = date.today()
        dob = updated_treatment["patient_dob"]
        age = (today.year - dob.year - ((today.month, today.day) < (dob.month, dob.day)))

        updated_treatment["patient_age"] = age

        updated_treatment.pop("patient_dob")

        return updated_treatment
    except HTTPException:
        db.rollback()
        raise
    except Exception:
        db.rollback()
        raise


def delete_treatment_service(db, clinic_id: int, treatment_id: int):
    try:
        treatment = get_treatment_by_id(db, clinic_id, treatment_id)
        if not treatment:
            raise HTTPException(
                status_code=404,
                detail="Treatment Not Found"
            )
        
        deleted_treatment = delete_treatment(db, clinic_id, treatment_id)
        if not deleted_treatment:
            raise HTTPException(
                status_code=400,
                detail="Failed To Delete Treatment"
            )
        
        db.commit()

        return {
            "message": "Treatment Deleted Successfully"
        }
    except HTTPException:
        db.rollback()
        raise
    except Exception:
        db.rollback()
        raise


def get_patient_treatment_history_service(
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

        treatments = get_patient_treatment_history(db, clinic_id, patient_id, appointment_date, limit, offset)
        if not treatments:
            return []
        
        today = date.today()

        for treatment in treatments:
            treatment["appointment_time"] = treatment["appointment_time"].astimezone(IST)

            dob = treatment["patient_dob"]
            age = (today.year - dob.year - ((today.month, today.day) < (dob.month, dob.day)))
            treatment["patient_age"] = age

            treatment.pop("patient_dob")

        return treatments
    except Exception:
        raise


def get_treatment_by_appointment_id_service(db, clinic_id: int, appointment_id: int):
    try:
        appointment = get_appointment_by_id(db, clinic_id, appointment_id)
        if not appointment:
            raise HTTPException(
                status_code=404,
                detail="Appointment Not Found"
            )
        
        treatment = get_treatment_by_appointment_id_full(db, clinic_id, appointment_id)
        if not treatment:
            raise HTTPException(
                status_code=404,
                detail="Treatment Not Found For This Appointment"
            )
        
        treatment["appointment_time"] = treatment["appointment_time"].astimezone(IST)

        today = date.today()
        dob = treatment["patient_dob"]
        age = (today.year - dob.year - ((today.month, today.day) < (dob.month, dob.day)))

        treatment["patient_age"] = age

        treatment.pop("patient_dob")

        return treatment
    except Exception:
        raise


def upload_treatment_files_service(db, clinic_id: int, treatment_id: int, files: list[UploadFile]):
    saved_file_paths = []
    try:
        treatment = get_treatment_by_id(db, clinic_id,treatment_id)
        if not treatment:
            raise HTTPException(
                status_code=404,
                detail="Treatment Not Found"
            )

        if not files:
            raise HTTPException(
                status_code=400,
                detail="No Files Uploaded"
            )

        if len(files) > 5:
            raise HTTPException(
                status_code=400,
                detail="Maximum 5 Files Allowed"
            )

        allowed_extensions = {".jpg", ".jpeg", ".png", ".webp", ".pdf"}

        validated_files = []

        for file in files:
            extension = (Path(file.filename).suffix.lower())

            if extension not in allowed_extensions:
                raise HTTPException(
                    status_code=400,
                    detail=(
                        "Only JPG, JPEG, "
                        "PNG, WEBP and PDF "
                        "Files Are Allowed"
                    )
                )

            file_content = file.file.read()

            file_size = len(file_content)

            if file_size > 10 * 1024 * 1024:
                raise HTTPException(
                    status_code=400,
                    detail=(
                        f"{file.filename} "
                        "Exceeds 10MB Limit"
                    )
                )

            validated_files.append({
                "file": file,
                "content": file_content,
                "size": file_size,
                "extension": extension
            })

        uploaded_files = []

        upload_folder = (
            Path("backend")
            / "uploads"
            / "clinics"
            / str(clinic_id)
            / "treatments"
        )

        upload_folder.mkdir(
            parents=True,
            exist_ok=True
        )

        for item in validated_files:
            file = item["file"]
            file_content = item["content"]
            file_size = item["size"]
            extension = item["extension"]

            unique_file_name = (
                f"{uuid.uuid4()}"
                f"{extension}"
            )

            file_path = (
                upload_folder
                / unique_file_name
            )

            with open(file_path,"wb") as buffer:
                buffer.write(file_content)

            saved_file_paths.append(file_path)

            file_url = (
                f"/uploads/clinics/"
                f"{clinic_id}/"
                f"treatments/"
                f"{unique_file_name}"
            )

            uploaded_file = create_treatment_file(
                db, clinic_id, treatment_id, unique_file_name, file.filename, file_url, file.content_type, file_size
            )

            uploaded_files.append(uploaded_file)

        db.commit()

        return uploaded_files
    except HTTPException:
        db.rollback()

        for path in saved_file_paths:
            if path.exists():
                path.unlink()

        raise
    except Exception:
        db.rollback()

        for path in saved_file_paths:
            if path.exists():
                path.unlink()

        raise
