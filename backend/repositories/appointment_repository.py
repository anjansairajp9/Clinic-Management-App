from datetime import datetime, date

# CREATE APPOINTMENT
def create_appointment(
        db, 
        clinic_id: int, 
        patient_id: int, 
        doctor_id: int, 
        appointment_type: str,
        appointment_time: datetime,
        complaint: str | None,
        notes: str | None,
        total_amount
        ):
    with db.cursor() as cursor:
        cursor.execute("""INSERT INTO 
                            appointments (
                                clinic_id, patient_id, doctor_id, appointment_type, appointment_time, status, complaint, notes, total_amount 
                            )
                            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
                       RETURNING 
                            id, patient_id, doctor_id, appointment_type, appointment_time, status, complaint, notes, total_amount, created_at
                    """, 
                    (clinic_id, patient_id, doctor_id, appointment_type, appointment_time, "scheduled", complaint, notes, total_amount)
                    )
        
        return cursor.fetchone()


# CREATE APPOINTMENT, UPDATE APPOINTMENT DETAILS
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
    
# CREATE APPOINTMENT, UPDATE APPOINTMENT DETAILS
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


# GET APPOINTMENT BY ID, UPDATE APPOINTMENT DETAILS, SOFT DELETE APPOINTMENT
def get_appointment_by_id(db, clinic_id: int, appointment_id: int):
    with db.cursor() as cursor:
        cursor.execute(
             """SELECT

                    appointments.id AS id,

                    patients.id AS patient_id,
                    patients.name AS patient_name,
                    patients.dob AS patient_dob,
                    patients.phone AS patient_phone,

                    doctors.id AS doctor_id,
                    doctors.name AS doctor_name,
                    doctors.phone AS doctor_phone,
                    doctors.specialization AS doctor_specialization,

                    appointments.appointment_type AS appointment_type,
                    appointments.appointment_time AS appointment_time,
                    appointments.status AS status,
                    appointments.complaint AS complaint,
                    appointments.notes AS notes,
                    appointments.total_amount AS total_amount,
                    appointments.created_at AS created_at,
                    appointments.updated_at AS updated_at
                
                FROM appointments

                JOIN patients
                    ON appointments.patient_id = patients.id

                JOIN doctors 
                    ON appointments.doctor_id = doctors.id

                WHERE appointments.clinic_id = %s
                AND appointments.id = %s
                AND appointments.is_active = TRUE
            """, (clinic_id, appointment_id))
        
        return cursor.fetchone()


# SEARCH APPOINTMENTS
def search_appointments(
        db, clinic_id: int, query: str | None, status: str | None, appointment_date: date | None, limit: int, offset: int
):
    conditions = [
        "appointments.clinic_id = %s",
        "appointments.is_active = TRUE"
    ]

    values = [clinic_id]

    if query:
        conditions.append(
            """
            (
                patients.name ILIKE %s
                OR patients.phone ILIKE %s
                OR doctors.name ILIKE %s
                OR doctors.phone ILIKE %s
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

    if status:
        conditions.append(
            "appointments.status = %s"
        )

        values.append(status)

    if appointment_date:
        conditions.append(
            "DATE(appointments.appointment_time) = %s"
        )

        values.append(appointment_date)

    values.extend([limit, offset])

    query_sql = f"""
        SELECT
            appointments.id AS id,

            patients.name AS patient_name,
            patients.dob AS patient_dob,
            patients.phone AS patient_phone,

            doctors.name AS doctor_name,
            doctors.phone AS doctor_phone,

            appointments.appointment_type AS appointment_type,
            appointments.appointment_time AS appointment_time,
            appointments.status AS status,
            appointments.complaint AS complaint,
            appointments.notes AS notes,
            appointments.total_amount AS total_amount

        FROM appointments

        JOIN patients
            ON appointments.patient_id = patients.id

        JOIN doctors
            ON appointments.doctor_id = doctors.id

        WHERE {" AND ".join(conditions)}

        ORDER BY appointments.appointment_time DESC

        LIMIT %s
        OFFSET %s
    """

    with db.cursor() as cursor:
        cursor.execute(query_sql, tuple(values))

        return cursor.fetchall()    


# UPDATE APPOINTMENT DETAILS
def update_appointment_details(db, clinic_id: int, appointment_id: int, update_data: dict):
    fields = []
    values = []

    for key, value in update_data.items():
        fields.append(f"{key} = %s")
        values.append(value)
    
    fields.append("updated_at = NOW()")

    values.extend([clinic_id, appointment_id])

    query = f"""
        UPDATE appointments
        SET {", ".join(fields)}

        WHERE clinic_id = %s
        AND id = %s
        AND is_active = TRUE

        RETURNING 
            id, patient_id, doctor_id, appointment_time, appointment_type, status, complaint, notes, total_amount, created_at, updated_at
    """

    with db.cursor() as cursor:
        cursor.execute(query, tuple(values))

        return cursor.fetchone()


# SOFT DELETE APPOINTMENT
def soft_delete_appointment(db, clinic_id: int, appointment_id: int):
    with db.cursor() as cursor:
        cursor.execute("""UPDATE appointments
                          SET is_active = FALSE,
                              updated_at = NOW()
                          WHERE clinic_id = %s
                          AND id = %s
                          AND status = 'scheduled'
                          AND is_active = TRUE
                          RETURNING id
                    """, (clinic_id, appointment_id))
        
        return cursor.fetchone()


# PATIENT APPOINTMENT HISTORY
def get_patient_appointment_history(
    db, clinic_id: int, patient_id: int, appointment_date: date | None, limit: int, offset: int
):
    conditions = [
        "appointments.clinic_id = %s",
        "appointments.patient_id = %s",
        "appointments.is_active = TRUE"
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
            appointments.id AS id,

            patients.name AS patient_name,
            patients.dob AS patient_dob,
            patients.phone AS patient_phone,

            doctors.name AS doctor_name,
            doctors.phone AS doctor_phone,
            doctors.specialization AS doctor_specialization,

            appointments.appointment_type AS appointment_type,
            appointments.appointment_time AS appointment_time,
            appointments.status AS status,
            appointments.complaint AS complaint,
            appointments.notes AS notes,
            appointments.total_amount AS total_amount,
            appointments.created_at AS created_at,
            appointments.updated_at AS updated_at

        FROM appointments

        JOIN patients
            ON appointments.patient_id = patients.id

        JOIN doctors
            ON appointments.doctor_id = doctors.id

        WHERE {" AND ".join(conditions)}

        ORDER BY appointments.appointment_time DESC

        LIMIT %s
        OFFSET %s
    """

    with db.cursor() as cursor:
        cursor.execute(query, tuple(values))

        return cursor.fetchall()


# DOCTOR APPOINTMENTS
def get_doctor_appointments(
        db, clinic_id: int, doctor_id: int, appointment_date: date | None, limit: int, offset: int
):
    conditions = [
        "appointments.clinic_id = %s",
        "appointments.doctor_id = %s",
        "appointments.is_active = TRUE"
    ]

    values = [clinic_id, doctor_id]

    if appointment_date:
        conditions.append(
            "DATE(appointments.appointment_time) = %s"
        )

        values.append(appointment_date)

    values.extend([limit, offset])

    query = f"""
        SELECT
            appointments.id AS id,

            patients.name AS patient_name,
            patients.phone AS patient_phone,

            doctors.name AS doctor_name,
            doctors.phone AS doctor_phone,
            doctors.specialization AS doctor_specialization,

            appointments.appointment_type AS appointment_type,
            appointments.appointment_time AS appointment_time,
            appointments.status AS status,
            appointments.complaint AS complaint,
            appointments.notes AS notes,
            appointments.total_amount AS total_amount,
            appointments.created_at AS created_at,
            appointments.updated_at AS updated_at

        FROM appointments

        JOIN patients
            ON appointments.patient_id = patients.id

        JOIN doctors
            ON appointments.doctor_id = doctors.id

        WHERE {" AND ".join(conditions)}

        ORDER BY appointments.appointment_time ASC

        LIMIT %s
        OFFSET %s
    """

    with db.cursor() as cursor:
        cursor.execute(query, tuple(values))

        return cursor.fetchall()


# APPOINTMENT SCHEDULE DASHBOARD
def get_appointment_schedule(
    db, 
    clinic_id: int, 
    appointment_date: date, 
    doctor_id: int | None, 
    status: str | None,
    limit: int,
    offset: int
):
    conditions = [
        "appointments.clinic_id = %s",
        "appointments.is_active = TRUE",
        "DATE(appointments.appointment_time) = %s"
    ]

    values = [clinic_id, appointment_date]

    if doctor_id:
        conditions.append(
            "appointments.doctor_id = %s"
        )

        values.append(doctor_id)

    if status:
        conditions.append(
            "appointments.status = %s"
        )

        values.append(status)

    values.extend([limit, offset])

    query = f"""
        SELECT
            appointments.id AS id,

            patients.name AS patient_name,
            patients.phone AS patient_phone,

            doctors.name AS doctor_name,
            doctors.phone AS doctor_phone,
            doctors.specialization AS doctor_specialization,

            appointments.appointment_type AS appointment_type,
            appointments.appointment_time AS appointment_time,
            appointments.status AS status,
            appointments.complaint AS complaint,
            appointments.notes AS notes,
            appointments.total_amount AS total_amount,
            appointments.created_at AS created_at,
            appointments.updated_at AS updated_at

        FROM appointments

        JOIN patients
            ON appointments.patient_id = patients.id

        JOIN doctors
            ON appointments.doctor_id = doctors.id

        WHERE {" AND ".join(conditions)}

        ORDER BY appointments.appointment_time ASC

        LIMIT %s
        OFFSET %s
    """

    with db.cursor() as cursor:
        cursor.execute(query, tuple(values))

        return cursor.fetchall()


# UPDATE APPOINTMENT STATUS
def update_appointment_status(db, clinic_id: int, appointment_id: int, status: str):
    with db.cursor() as cursor:
        cursor.execute("""UPDATE appointments
                          SET status = %s,
                              updated_at = NOW()
                          WHERE clinic_id = %s
                          AND id = %s
                          AND is_active = TRUE
                          RETURNING id
                    """,(status, clinic_id, appointment_id))
        
        return cursor.fetchone()


# APPOINTMENT ANALYTICS
def get_appointment_analytics(db, clinic_id: int, appointment_date: date):
    with db.cursor() as cursor:
        cursor.execute(
             """SELECT
                    COUNT(*) AS total_appointments,

                    COUNT(*) FILTER (
                        WHERE appointment_type = 'scheduled'
                    ) AS scheduled_appointments,

                    COUNT(*) FILTER (
                        WHERE appointment_type = 'walk_in'
                    ) AS walk_in_appointments,

                    COUNT(*) FILTER (
                        WHERE status = 'completed'
                    ) AS completed_appointments,

                    COUNT(*) FILTER (
                        WHERE status = 'cancelled'
                    ) AS cancelled_appointments,

                    COUNT(*) FILTER (
                        WHERE status = 'no_show'
                    ) AS no_show_appointments,

                    COUNT(*) FILTER (
                        WHERE status = 'scheduled'
                    ) AS pending_appointments,

                    COALESCE(
                        SUM(payments.amount_paid)
                        FILTER (
                            WHERE payments.is_active = TRUE
                        ),
                        0
                    ) AS total_revenue

                FROM appointments

                LEFT JOIN payments
                    ON payments.appointment_id = appointments.id

                WHERE appointments.clinic_id = %s
                AND appointments.is_active = TRUE
                AND DATE(appointments.appointment_time) = %s
            """,(clinic_id, appointment_date))
        
        return cursor.fetchone()


# APPOINTMENT DASHBOARD SUMMARY
def get_appointment_summary_stats(db, clinic_id: int, appointment_date: date):
    with db.cursor() as cursor:
        cursor.execute(
            """SELECT
                    COUNT(*) FILTER (
                        WHERE status = 'scheduled'
                    ) AS pending_queue,

                    COUNT(*) FILTER (
                        WHERE status = 'completed'
                    ) AS completed_today,

                    COUNT(*) FILTER (
                        WHERE appointment_type = 'walk_in'
                    ) AS walk_ins_today

                FROM appointments

                WHERE clinic_id = %s
                AND is_active = TRUE
                AND DATE(appointment_time) = %s
            """, (clinic_id, appointment_date))

        return cursor.fetchone()


def get_next_appointment(db, clinic_id: int, current_time: datetime):
    with db.cursor() as cursor:
        cursor.execute(
             """SELECT
                    appointments.id AS id,

                    patients.name AS patient_name,
                    patients.phone AS patient_phone,

                    doctors.name AS doctor_name,
                    doctors.phone AS doctor_phone,

                    appointments.appointment_time AS appointment_time,
                    appointments.appointment_type AS appointment_type,
                    appointments.status AS status

                FROM appointments

                JOIN patients
                    ON appointments.patient_id = patients.id

                JOIN doctors
                    ON appointments.doctor_id = doctors.id

                WHERE appointments.clinic_id = %s
                AND appointments.is_active = TRUE
                AND appointments.status = 'scheduled'
                AND appointments.appointment_time > %s

                ORDER BY appointments.appointment_time ASC

                LIMIT 1
            """, (clinic_id, current_time))

        return cursor.fetchone()


def get_upcoming_appointments(db, clinic_id: int, current_time: datetime):
    with db.cursor() as cursor:
        cursor.execute(
             """SELECT
                    appointments.id AS id,

                    patients.name AS patient_name,
                    patients.phone AS patient_phone,

                    doctors.name AS doctor_name,
                    doctors.phone AS doctor_phone,

                    appointments.appointment_time AS appointment_time,
                    appointments.appointment_type AS appointment_type,
                    appointments.status AS status

                FROM appointments

                JOIN patients
                    ON appointments.patient_id = patients.id

                JOIN doctors
                    ON appointments.doctor_id = doctors.id

                WHERE appointments.clinic_id = %s
                AND appointments.is_active = TRUE
                AND appointments.status = 'scheduled'
                AND appointments.appointment_time > %s

                ORDER BY appointments.appointment_time ASC

                LIMIT 5
            """, (clinic_id, current_time))

        return cursor.fetchall()


# APPOINTMENT AVAILABILITY SLOTS
def get_doctor_booked_appointments(
    db, clinic_id: int, doctor_id: int, appointment_date: date, appointment_id: int | None = None
):
    conditions = [
        "clinic_id = %s",
        "doctor_id = %s",
        "is_active = TRUE",
        "status = 'scheduled'",
        "DATE(appointment_time) = %s"
    ]

    values = [clinic_id, doctor_id, appointment_date]

    if appointment_id:
        conditions.append(
            "id != %s"
        )

        values.append(appointment_id)

    query = f"""
        SELECT
            appointment_time
        FROM appointments
        WHERE {" AND ".join(conditions)}
    """

    with db.cursor() as cursor:
        cursor.execute(query, tuple(values))

        return cursor.fetchall()


def get_all_doctors_booked_appointments(
    db, clinic_id: int, appointment_date: date, appointment_id: int | None = None
):
    conditions = [
        "clinic_id = %s",
        "is_active = TRUE",
        "status = 'scheduled'",
        "DATE(appointment_time) = %s"
    ]

    values = [clinic_id, appointment_date]

    if appointment_id:
        conditions.append(
            "id != %s"
        )

        values.append(appointment_id)

    query = f"""
        SELECT
            doctor_id,
            appointment_time
        FROM appointments
        WHERE {" AND ".join(conditions)}
    """

    with db.cursor() as cursor:
        cursor.execute(query, tuple(values))

        return cursor.fetchall()


def get_all_active_doctors(db, clinic_id: int):
    with db.cursor() as cursor:
        cursor.execute(
             """SELECT id
                FROM doctors
                WHERE clinic_id = %s
                AND is_active = TRUE
            """, (clinic_id,))
        
        return cursor.fetchall()



# --- WHATSAPP DATA QUERIES --- #

# WHATSAPP APPOINTMENT DETAILS
def get_appointment_whatsapp_details(db, clinic_id: int, appointment_id: int):
    with db.cursor() as cursor:
        cursor.execute(
             """SELECT
                    appointments.id AS id,
                    appointments.appointment_time AS appointment_time,

                    patients.name AS patient_name,
                    patients.phone AS patient_phone,

                    doctors.name AS doctor_name,

                    clinics.name AS clinic_name,
                    clinics.phone AS clinic_phone

                FROM appointments

                JOIN patients
                    ON appointments.patient_id = patients.id

                JOIN doctors
                    ON appointments.doctor_id = doctors.id

                JOIN clinics
                    ON appointments.clinic_id = clinics.id

                WHERE appointments.clinic_id = %s
                AND appointments.id = %s
                AND appointments.is_active = TRUE
            """,(clinic_id, appointment_id)
        )

        return cursor.fetchone()


# APPOINTMENT REMINDER 
def get_appointments_for_reminder(db):
    with db.cursor() as cursor:
        cursor.execute(
             """SELECT
                    appointments.id AS id,
                    appointments.appointment_time AS appointment_time,

                    patients.name AS patient_name,
                    patients.phone AS patient_phone,

                    doctors.name AS doctor_name,

                    clinics.name AS clinic_name,
                    clinics.phone AS clinic_phone

                FROM appointments

                JOIN patients
                    ON appointments.patient_id = patients.id

                JOIN doctors
                    ON appointments.doctor_id = doctors.id

                JOIN clinics
                    ON appointments.clinic_id = clinics.id

                WHERE appointments.is_active = TRUE
                AND appointments.status = 'scheduled'
                AND appointments.reminder_sent = FALSE
                AND appointments.appointment_time BETWEEN
                    NOW() + INTERVAL '4 hours'
                AND
                    NOW() + INTERVAL '4 hours 15 minutes'
            """)
        
        return cursor.fetchall()


# UPDATE REMINDER SENT TO TRUE, APPOINTMENT REMINDER
def mark_reminder_sent(db, appointment_id: int):
    with db.cursor() as cursor:
        cursor.execute("""UPDATE appointments 
                          SET reminder_sent = TRUE,
                              updated_at = NOW()
                          WHERE id = %s
                       """, (appointment_id,))
