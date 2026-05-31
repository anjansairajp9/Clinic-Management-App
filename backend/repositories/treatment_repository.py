from datetime import date

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


# GET TREATMENT BY ID, UPDATE TREATMENT
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


# SEARCH TREATMENTS
def search_treatments(db, clinic_id: int, query: str, appointment_date: date, limit: int, offset: int):
    conditions = [
        "treatments.clinic_id = %s",
        "treatments.is_active = TRUE"
    ]

    values = [clinic_id]

    if query:
        conditions.append(
            """
            (
                patients.name ILIKE %s
                OR patients.phone ILIKE %s
                OR doctors.name ILIKE %s
                OR treatments.diagnosis ILIKE %s
            )
            """
        )

        search_term = f"%{query}%"

        values.extend([
            search_term,
            search_term,
            search_term,
            search_term
        ])

    if appointment_date:
        conditions.append(
            "DATE(appointments.appointment_time) = %s"
        )

        values.append(appointment_date)

    values.extend([limit, offset])

    query_sql = f"""
        SELECT
            treatments.id AS id,

            patients.name AS patient_name,
            patients.dob AS patient_dob,
            patients.phone AS patient_phone,

            doctors.name AS doctor_name,

            treatments.diagnosis AS diagnosis,

            appointments.appointment_time AS appointment_time

        FROM treatments

        JOIN patients
            ON treatments.patient_id = patients.id

        JOIN doctors
            ON treatments.doctor_id = doctors.id

        JOIN appointments
            ON treatments.appointment_id = appointments.id

        WHERE {" AND ".join(conditions)}

        ORDER BY appointments.appointment_time DESC

        LIMIT %s
        OFFSET %s
    """

    with db.cursor() as cursor:
        cursor.execute(query_sql, tuple(values))

        return cursor.fetchall()


# UPDATE TREATMENT DETAILS
def update_treatment_details(db, clinic_id: int, treatment_id: int, update_data: dict):
    fields = []
    values = []

    for key, value in update_data.items():
        fields.append(f"{key} = %s")
        values.append(value)

    fields.append("updated_at = NOW()")

    values.extend([clinic_id, treatment_id])

    query = f"""
        UPDATE treatments
        SET {", ".join(fields)}

        WHERE clinic_id = %s
        AND id = %s
        AND is_active = TRUE

        RETURNING
            id, patient_id, doctor_id, appointment_id, diagnosis, treatment_performed, medicines_prescribed, procedure_notes,
            follow_up_instructions, created_at, updated_at
    """

    with db.cursor() as cursor:
        cursor.execute(query, tuple(values))

        return cursor.fetchone()


# SOFT DELETE TREATMENT
def delete_treatment(db, clinic_id: int, treatment_id: int):
    with db.cursor() as cursor:
        cursor.execute("""UPDATE treatments
                          SET is_active = FALSE,
                              updated_at = NOW()
                          WHERE clinic_id = %s
                          AND id = %s
                          AND is_active = TRUE
                          RETURNING id
                        """, (clinic_id, treatment_id))
        
        return cursor.fetchone()


# PATIENT TREATMENT HISTORY
def get_patient_treatment_history(
    db, clinic_id: int, patient_id: int, appointment_date: date | None, limit: int, offset: int
):
    conditions = [
        "treatments.clinic_id = %s",
        "treatments.patient_id = %s",
        "treatments.is_active = TRUE"
    ]

    values = [clinic_id, patient_id]

    if appointment_date:
        conditions.append(
            "DATE(appointments.appointment_time) = %s"
        )

        values.append(appointment_date)

    values.extend([limit, offset])
    
    query = f""" 
        SELECT
            treatments.id AS id,

            patients.name AS patient_name,
            patients.dob AS patient_dob,

            doctors.name AS doctor_name,
            doctors.specialization AS doctor_specialization,

            treatments.diagnosis AS diagnosis,
            treatments.treatment_performed AS treatment_performed,
            treatments.medicines_prescribed AS medicines_prescribed,

            appointments.appointment_time AS appointment_time,

            treatments.created_at AS created_at,
            treatments.updated_at AS updated_at

        FROM treatments

        JOIN patients
            ON treatments.patient_id = patients.id

        JOIN doctors
            ON treatments.doctor_id = doctors.id

        JOIN appointments
            ON treatments.appointment_id = appointments.id

        WHERE {" AND ".join(conditions)}

        ORDER BY appointments.appointment_time DESC

        LIMIT %s
        OFFSET %s
    """

    with db.cursor() as cursor:
        cursor.execute(query, tuple(values))

        return cursor.fetchall()
