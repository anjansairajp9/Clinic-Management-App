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
