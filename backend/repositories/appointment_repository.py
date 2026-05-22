from datetime import datetime

# CREATE APPOINTMENT
def create_appointment(
        db, 
        clinic_id: int, 
        patient_id: int, 
        doctor_id: int, 
        appointment_time: datetime, 
        complaint: str | None,
        notes: str | None,
        total_amount
        ):
    with db.cursor() as cursor:
        cursor.execute("""INSERT INTO 
                            appointments (clinic_id, patient_id, doctor_id, appointment_time, status, complaint, notes, total_amount)
                            VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
                       RETURNING 
                            id, patient_id, doctor_id, appointment_time, status, complaint, notes, total_amount, created_at
                    """, 
                    (clinic_id, patient_id, doctor_id, appointment_time, "scheduled", complaint, notes, total_amount)
                    )
        
        return cursor.fetchone()


def get_existing_appointment(db, clinic_id: int, doctor_id: int, appointment_time: datetime):
    with db.cursor() as cursor:
        cursor.execute("""SELECT id
                          FROM appointments
                          WHERE clinic_id = %s
                          AND doctor_id = %s
                          AND appointment_time = %s
                          AND status = 'scheduled'
                          AND is_active = TRUE
                    """, (clinic_id, doctor_id, appointment_time))
        
        return cursor.fetchone()
    

def get_patient_existing_appointment(db, clinic_id: int, patient_id: int, appointment_time: datetime):
    with db.cursor() as cursor:
        cursor.execute("""SELECT id
                          FROM appointments
                          WHERE clinic_id = %s
                          AND patient_id = %s
                          AND appointment_time = %s
                          AND status = 'scheduled'
                          AND is_active = TRUE
                        """,(clinic_id, patient_id, appointment_time))

        return cursor.fetchone()
