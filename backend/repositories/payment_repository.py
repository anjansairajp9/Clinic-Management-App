from decimal import Decimal

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
