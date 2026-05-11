# REGISTER DOCTOR
def create_doctor(db, clinic_id: int, name: str, phone: str, specialization: str, notes: str | None):
    with db.cursor() as cursor:
        cursor.execute("""INSERT INTO doctors (clinic_id, name, phone, specialization, notes)
                       VALUES (%s, %s, %s, %s, %s)
                       RETURNING id, name, phone, specialization, notes, created_at
                       """, (clinic_id, name, phone, specialization, notes))
        
        return cursor.fetchone()
    

# REGISTER DOCTOR, UPDATE DOCTOR
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


# GET DOCTOR BY ID, UPDATE DOCTOR
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


# SEARCH DOCTORS
def search_doctors(db, clinic_id: int, query: str, limit: int, offset: int):
    with db.cursor() as cursor:
        cursor.execute(
             """SELECT
                    id, name, phone, specialization
                FROM doctors
                WHERE clinic_id = %s
                AND is_active = TRUE
                AND (
                    name ILIKE %s
                    OR phone ILIKE %s
                    OR specialization ILIKE %s
                )
                ORDER BY created_at DESC
                LIMIT %s
                OFFSET %s
            """, (clinic_id, f"%{query}%", f"%{query}%", f"%{query}%", limit, offset))
        
        return cursor.fetchall()


# UPDATE DOCTOR DETAILS
def update_doctor_details(db, clinic_id: int, doctor_id: int, update_data: dict):
    fields = []
    values = []

    for key, value in update_data.items():
        fields.append(f"{key} = %s")
        values.append(value)

    fields.append("updated_at = NOW()")

    values.extend([clinic_id, doctor_id])

    query = f"""
        UPDATE doctors
        SET {", ".join(fields)}
        WHERE clinic_id = %s
        AND id = %s
        AND is_active = TRUE
        RETURNING id, name, phone, specialization, notes, created_at, updated_at
    """

    with db.cursor() as cursor:
        cursor.execute(query, tuple(values))

        return cursor.fetchone()


# SOFT DELETE DOCTOR
def soft_delete_doctor(db, clinic_id: int, doctor_id: int):
    with db.cursor() as cursor:
        cursor.execute(
             """UPDATE doctors
                SET is_active = FALSE,
                    updated_at = NOW()
                WHERE clinic_id = %s
                AND id = %s
                AND is_active = TRUE
                RETURNING id
            """, (clinic_id, doctor_id))
        
        return cursor.fetchone()
