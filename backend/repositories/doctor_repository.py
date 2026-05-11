# REGISTER DOCTOR
def create_doctor(db, clinic_id: int, name: str, phone: str, specialization: str, notes: str | None):
    with db.cursor() as cursor:
        cursor.execute("""INSERT INTO doctors (clinic_id, name, phone, specialization, notes)
                       VALUES (%s, %s, %s, %s, %s)
                       RETURNING id, name, phone, specialization, notes, created_at
                       """, (clinic_id, name, phone, specialization, notes))
        
        return cursor.fetchone()
    

def get_doctor_by_phone(db, clinic_id: int, phone: str):
    with db.cursor() as cursor:
        cursor.execute(
             """SELECT
                    id, name, phone
                FROM doctors
                WHERE clinic_id = %s
                AND phone = %s
                AND is_active = TRUE
            """, (clinic_id, phone))
        
        return cursor.fetchone()


# GET DOCTOR BY ID
def get_doctor_by_id(db, clinic_id: int, doctor_id: int):
    with db.cursor() as cursor:
        cursor.execute(
             """SELECT
                    id,
                    name,
                    phone,
                    specialization,
                    notes,
                    created_at,
                    updated_at
                FROM doctors
                WHERE clinic_id = %s
                AND id = %s
                AND is_active = TRUE
            """, (clinic_id, doctor_id))
        
        return cursor.fetchone()
