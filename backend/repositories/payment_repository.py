from decimal import Decimal
from datetime import date

# CREATE PAYMENT
def create_payment(
    db, 
    clinic_id: int, 
    appointment_id: int, 
    total_amount: Decimal | None, 
    amount_paid: Decimal | None, 
    payment_method: str | None,
    payment_status: str | None,
    notes: str | None
):
    with db.cursor() as cursor:
        cursor.execute("""INSERT INTO 
                            payments (clinic_id, appointment_id, total_amount, amount_paid, payment_method, payment_status, notes)
                            VALUES (%s, %s, %s, %s, %s, %s, %s)
                            RETURNING 
                                id, appointment_id, total_amount, amount_paid, payment_method, payment_status, notes, created_at
                       """, (clinic_id, appointment_id, total_amount, amount_paid, payment_method, payment_status, notes))
        
        return cursor.fetchone()


# GET PAYMENT BY APPOINTMENT ID (TO VALIDATE CREATE PAYMENT), CREATE PAYMENT
def get_payment_by_appointment_id_to_validate_create_payment(db, clinic_id: int, appointment_id: int):
    with db.cursor() as cursor:
        cursor.execute(
             """SELECT id
                FROM payments
                WHERE clinic_id = %s
                AND appointment_id = %s
                AND is_active = TRUE
            """, (clinic_id, appointment_id))
        
        return cursor.fetchone()


# GET PAYMENT BY ID
def get_payment_by_id(db, clinic_id: int, payment_id: int):
    with db.cursor() as cursor:
        cursor.execute(
             """SELECT
                    payments.id AS id,

                    patients.id AS patient_id,
                    patients.name AS patient_name,
                    patients.phone AS patient_phone,

                    doctors.id AS doctor_id,
                    doctors.name AS doctor_name,

                    appointments.id AS appointment_id,
                    appointments.appointment_time AS appointment_time,
                    appointments.status AS appointment_status,
                    appointments.complaint AS appointment_complaint,

                    treatments.id AS treatment_id,
                    treatments.diagnosis AS treatment_diagnosis,
                    treatments.treatment_performed AS treatment_performed,
                    treatments.medicines_prescribed AS treatment_medicines_prescribed,

                    payments.total_amount AS total_amount,
                    payments.amount_paid AS amount_paid,
                    payments.payment_method AS payment_method,
                    payments.payment_status AS payment_status,
                    payments.notes AS notes,
                    payments.created_at AS created_at,
                    payments.updated_at AS updated_at

                FROM payments

                JOIN appointments
                    ON payments.appointment_id = appointments.id

                JOIN patients
                    ON appointments.patient_id = patients.id

                JOIN doctors
                    ON appointments.doctor_id = doctors.id

                LEFT JOIN treatments
                    ON treatments.appointment_id = appointments.id
                    AND treatments.is_active = TRUE

                WHERE payments.clinic_id = %s
                AND payments.id = %s
                AND payments.is_active = TRUE
                AND appointments.is_active = TRUE
            """, (clinic_id, payment_id))
        
        return cursor.fetchone()


# GET PAYMENT BY APPOINTMENT ID
def get_payment_by_appointment_id(db, clinic_id: int, appointment_id: int):
    with db.cursor() as cursor:
        cursor.execute(
             """SELECT
                    payments.id AS id,

                    patients.id AS patient_id,
                    patients.name AS patient_name,
                    patients.phone AS patient_phone,

                    doctors.id AS doctor_id,
                    doctors.name AS doctor_name,

                    appointments.id AS appointment_id,
                    appointments.appointment_time AS appointment_time,
                    appointments.status AS appointment_status,
                    appointments.complaint AS appointment_complaint,

                    treatments.id AS treatment_id,
                    treatments.diagnosis AS treatment_diagnosis,
                    treatments.treatment_performed AS treatment_performed,
                    treatments.medicines_prescribed AS treatment_medicines_prescribed,

                    payments.total_amount AS total_amount,
                    payments.amount_paid AS amount_paid,
                    payments.payment_method AS payment_method,
                    payments.payment_status AS payment_status,
                    payments.notes AS notes,
                    payments.created_at AS created_at,
                    payments.updated_at AS updated_at

                FROM payments

                JOIN appointments
                    ON payments.appointment_id = appointments.id

                JOIN patients
                    ON appointments.patient_id = patients.id

                JOIN doctors
                    ON appointments.doctor_id = doctors.id

                LEFT JOIN treatments
                    ON treatments.appointment_id = appointments.id
                    AND treatments.is_active = TRUE

                WHERE payments.clinic_id = %s
                AND appointments.id = %s
                AND payments.is_active = TRUE
                AND appointments.is_active = TRUE
            """, (clinic_id, appointment_id))
        
        return cursor.fetchone()


# SEARCH PAYMENTS
def search_payments(
    db, 
    clinic_id: int, 
    query: str | None, 
    payment_status: str | None, 
    appointment_date: date | None, 
    limit: int, 
    offset: int
):
    conditions = [
        "payments.clinic_id = %s",
        "payments.is_active = TRUE",
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
            )
            """
        )

        search_term = f"%{query}%"

        values.extend([
            search_term,
            search_term,
            search_term
        ])

    if payment_status:
        conditions.append(
            "payments.payment_status = %s"
        )

        values.append(payment_status)

    if appointment_date:
        conditions.append(
            "DATE(appointments.appointment_time) = %s"
        )

        values.append(appointment_date)

    values.extend([limit, offset])

    query_sql = f"""
        SELECT
            payments.id AS id,

            patients.id AS patient_id,
            patients.name AS patient_name,
            patients.phone AS patient_phone,

            doctors.id AS doctor_id,
            doctors.name AS doctor_name,

            appointments.id AS appointment_id,
            appointments.appointment_time AS appointment_time,
            appointments.status AS appointment_status,

            treatments.id AS treatment_id,
            treatments.diagnosis AS treatment_diagnosis,

            payments.total_amount AS total_amount,
            payments.amount_paid AS amount_paid,
            payments.payment_method AS payment_method,
            payments.payment_status AS payment_status

        FROM payments

        JOIN appointments
            ON payments.appointment_id = appointments.id

        JOIN patients
            ON appointments.patient_id = patients.id

        JOIN doctors
            ON appointments.doctor_id = doctors.id

        LEFT JOIN treatments    
            ON treatments.appointment_id = appointments.id
            AND treatments.is_active = TRUE

        WHERE {" AND ".join(conditions)}

        ORDER BY appointments.appointment_time DESC

        LIMIT %s
        OFFSET %s
    """

    with db.cursor() as cursor:
        cursor.execute(query_sql, tuple(values))

        return cursor.fetchall()


# UPDATE PAYMENT DETAILS
def update_payment_details(db, clinic_id: int, payment_id: int, update_data: dict):
    fields = []
    values = []

    for key, value in update_data.items():
        fields.append(f"{key} = %s")
        values.append(value)

    fields.append("updated_at = NOW()")

    values.extend([clinic_id, payment_id])

    query = f"""
        UPDATE payments
        SET {", ".join(fields)}

        WHERE clinic_id = %s
        AND id = %s
        AND is_active = TRUE

        RETURNING
            id, appointment_id, total_amount, amount_paid, payment_method, payment_status, notes, created_at, updated_at
    """

    with db.cursor() as cursor:
        cursor.execute(query, tuple(values))

        return cursor.fetchone()
