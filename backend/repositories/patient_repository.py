from psycopg2.extras import Json

def create_patient(db, clinic_id: int, name: str, phone: str, gender: str, dob, notes: str | None):
    with db.cursor() as cursor:
        cursor.execute("""INSERT INTO patients (clinic_id, name, phone, gender, dob, notes) 
                       VALUES (%s, %s, %s, %s, %s, %s)
                       RETURNING id, name, phone, gender, dob, notes, created_at""",
                       (clinic_id, name, phone, gender, dob, notes))
        
        return cursor.fetchone()


def create_patient_medical_history(db, patient_id: int):
    with db.cursor() as cursor:
        cursor.execute("""INSERT INTO patient_medical_history (patient_id, data) 
                       VALUES (%s, %s)""", 
                       (patient_id, Json({})))


def get_patient_by_phone(db, clinic_id: int, phone: str):
    with db.cursor() as cursor:
        cursor.execute("""SELECT id, name, phone 
                       FROM patients
                       WHERE clinic_id = %s
                       AND phone = %s
                       AND is_active = TRUE""",
                       (clinic_id, phone))
        
        return cursor.fetchone()


def get_patient_by_id(db, clinic_id: int, patient_id: int):
    with db.cursor() as cursor:
        cursor.execute(
             """SELECT
                    patients.id,
                    patients.name,
                    patients.phone,
                    patients.gender,
                    patients.dob,
                    patients.notes,
                    patient_medical_history.data AS medical_history,
                    patients.created_at,
                    patients.updated_at
                FROM patients
                JOIN patient_medical_history
                    ON patients.id = patient_medical_history.patient_id
                WHERE patients.clinic_id = %s
                AND patients.id = %s
                AND patients.is_active = TRUE
            """, (clinic_id, patient_id))
        
        return cursor.fetchone()
