from psycopg2.extras import Json

# REGISTER PATIENT
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

# REGISTER PATIENT, UPDATE PATIENT
def get_patient_by_phone(db, clinic_id: int, phone: str):
    with db.cursor() as cursor:
        cursor.execute("""SELECT id, name, phone 
                       FROM patients
                       WHERE clinic_id = %s
                       AND phone = %s
                       AND is_active = TRUE""",
                       (clinic_id, phone))
        
        return cursor.fetchone()


# GET PATIENT BY ID, UPDATE PATIENT
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


# SEARCH PATIENTS
def search_patients(db, clinic_id: int, query: str, limit: int, offset: int):
    with db.cursor() as cursor:
        cursor.execute(
             """SELECT 
                    id, name, phone, gender, dob
                FROM patients
                WHERE clinic_id = %s
                AND is_active = TRUE
                AND (
                    name ILIKE %s
                    OR phone ILIKE %s
                )
                ORDER BY created_at DESC
                LIMIT %s
                OFFSET %s
            """, (clinic_id, f"%{query}%", f"%{query}%", limit, offset))
        
        return cursor.fetchall()


# UPDATE PATIENT DETAILS
def update_patient_details(db, clinic_id: int, patient_id: int, update_data: dict):
    fields = []
    values = []

    for key, value in update_data.items():
        fields.append(f"{key} = %s")
        values.append(value)

    fields.append("updated_at = NOW()")

    values.extend([clinic_id, patient_id])

    query = f"""
        UPDATE patients
        SET {", ".join(fields)}
        WHERE clinic_id = %s
        AND id = %s
        AND is_active = TRUE
        RETURNING
            id,
            name,
            phone,
            gender,
            dob,
            notes,
            created_at,
            updated_at
    """

    with db.cursor() as cursor:
        cursor.execute(query, tuple(values))

        return cursor.fetchone()


# SOFT DELETE PATIENT
def soft_delete_patient(db, clinic_id: int, patient_id: int):
    with db.cursor() as cursor:
        cursor.execute(
             """UPDATE patients 
             SET is_active = FALSE,
                 updated_at = NOW() 
             WHERE clinic_id = %s 
             AND id = %s
             AND is_active = TRUE
             RETURNING id
             """, (clinic_id, patient_id))
        
        return cursor.fetchone()
