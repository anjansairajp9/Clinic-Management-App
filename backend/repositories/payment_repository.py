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


# GET PAYMENT BY APPOINTMENT ID, CREATE PAYMENT
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
