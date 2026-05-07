from psycopg2 import errors

def create_clinic(db, name: str, phone: str, email: str, hashed_password: str, address: str | None):
    try:
        with db.cursor() as cursor:
            cursor.execute("""INSERT INTO clinics (name, phone, email, password_hash, address) 
                           VALUES (%s, %s, %s, %s, %s)
                           RETURNING id, name, phone, email, address""",
                           (name, phone, email, hashed_password, address))
            
            result = cursor.fetchone()

            db.commit()

            return result
    except errors.UniqueViolation:
        db.rollback()
        raise
    except Exception:
        db.rollback()
        raise
    