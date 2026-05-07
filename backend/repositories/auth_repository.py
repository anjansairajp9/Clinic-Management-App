from psycopg2 import errors

def create_clinic(db, name: str, phone: str, email: str, hashed_password: str, address: str | None):
    with db.cursor() as cursor:
        cursor.execute("""INSERT INTO clinics (name, phone, email, password_hash, address) 
                        VALUES (%s, %s, %s, %s, %s)
                        RETURNING id, name, phone, email, address""",
                        (name, phone, email, hashed_password, address))
        
        return cursor.fetchone()
    

def get_clinic_by_email(db, email: str):
    with db.cursor() as cursor:
        cursor.execute("SELECT id, email, password_hash FROM clinics WHERE email = %s", (email,))

        return cursor.fetchone()
    

def store_refresh_token(db, clinic_id: int ,refresh_token: str):
    with db.cursor() as cursor:
        cursor.execute("""INSERT INTO refresh_tokens (clinic_id, token, expires_at) 
                        VALUES (%s, %s, NOW() + INTERVAL '10 days')""",
                        (clinic_id, refresh_token))


def delete_refresh_token(db, refresh_token: str):
    with db.cursor() as cursor:
        cursor.execute("DELETE FROM refresh_tokens WHERE token = %s", (refresh_token,))
        