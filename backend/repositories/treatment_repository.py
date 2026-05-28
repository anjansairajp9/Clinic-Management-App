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


# GET TREATMENT BY ID
def get_treatment_by_id(db, clinic_id: int, treatment_id: int):
    with db.cursor() as cursor:
        cursor.execute(
             """SELECT
                    treatments.id AS id,

                    patients.id AS patient_id,
                    patients.name AS patient_name,
                    patients.dob AS patient_dob,
                    patients.phone AS patient_phone,

                    doctors.id AS doctor_id,
                    doctors.name AS doctor_name,
                    doctors.specialization AS doctor_specialization,

                    appointments.id AS appointment_id,
                    appointments.appointment_time AS appointment_time,
                    appointments.status AS appointment_status,
                    appointments.complaint AS appointment_complaint,

                    treatments.diagnosis AS diagnosis,
                    treatments.treatment_performed AS treatment_performed,
                    treatments.medicines_prescribed AS medicines_prescribed,
                    treatments.procedure_notes AS procedure_notes,
                    treatments.follow_up_instructions AS follow_up_instructions,

                    treatments.created_at AS created_at,
                    treatments.updated_at AS updated_at

                FROM treatments

                JOIN patients
                    ON treatments.patient_id = patients.id

                JOIN doctors
                    ON treatments.doctor_id = doctors.id

                JOIN appointments
                    ON treatments.appointment_id = appointments.id

                WHERE treatments.clinic_id = %s
                AND treatments.id = %s
                AND treatments.is_active = TRUE
            """, (clinic_id, treatment_id))
        
        return cursor.fetchone()
