# CREATE TREATMENT
def create_treatment(
    db, 
    clinic_id: int, 
    patient_id: int, 
    doctor_id: int, 
    appointment_id: int,
    diagnosis: str,
    treatment_performed: str,
    medicines_prescribed: str | None,
    procedure_notes: str | None,
    follow_up_instructions: str | None
):
    with db.cursor() as cursor:
        cursor.execute("""INSERT INTO treatments 
                            (clinic_id, 
                             patient_id, 
                             doctor_id, 
                             appointment_id, 
                             diagnosis, 
                             treatment_performed, 
                             medicines_prescribed, 
                             procedure_notes,
                             follow_up_instructions)
                         
                         VALUES
                            (%s, %s, %s, %s, %s, %s, %s, %s, %s)
                       
                         RETURNING
                            id,
                            patient_id,
                            doctor_id,
                            appointment_id,
                            diagnosis,
                            treatment_performed,
                            medicines_prescribed,
                            procedure_notes,
                            follow_up_instructions,
                            created_at,
                            updated_at
                """, (clinic_id, 
                      patient_id, 
                      doctor_id, 
                      appointment_id, 
                      diagnosis, 
                      treatment_performed, 
                      medicines_prescribed, 
                      procedure_notes,
                      follow_up_instructions)
                )
        
        return cursor.fetchone()


# GET TREATMENT BY APPOINTMENT ID, CREATE TREATMENT
def get_treatment_by_appointment_id(db, clinic_id: int, appointment_id: int):
    with db.cursor() as cursor:
        cursor.execute(
             """SELECT *
                FROM treatments
                WHERE clinic_id = %s
                AND appointment_id = %s
                AND is_active = TRUE
            """, (clinic_id, appointment_id))
        
        return cursor.fetchone()
