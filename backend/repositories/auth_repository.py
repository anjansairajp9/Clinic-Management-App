# REGISTER 
def create_clinic(db, name: str, phone: str, email: str, hashed_password: str, address: str | None):
    with db.cursor() as cursor:
        cursor.execute("""INSERT INTO clinics (name, phone, email, password_hash, address) 
                        VALUES (%s, %s, %s, %s, %s)
                        RETURNING id, name, phone, email, address""",
                        (name, phone, email, hashed_password, address))
        
        return cursor.fetchone()

    
# LOGIN, FORGOT PASSWORD
def get_clinic_by_email(db, email: str):
    with db.cursor() as cursor:
        cursor.execute("SELECT id, email, password_hash, is_super_admin FROM clinics WHERE email = %s", (email,))

        return cursor.fetchone()
    

def store_refresh_token(db, clinic_id: int ,refresh_token: str):
    with db.cursor() as cursor:
        cursor.execute("""INSERT INTO refresh_tokens (clinic_id, token, expires_at) 
                        VALUES (%s, %s, NOW() + INTERVAL '10 days')""",
                        (clinic_id, refresh_token))
     

# LOGOUT
def delete_refresh_token(db, refresh_token: str):
    with db.cursor() as cursor:
        cursor.execute("DELETE FROM refresh_tokens WHERE token = %s", (refresh_token,))


# REFRESH(NEW ACCESS TOKEN)
def get_clinic_by_refresh_token(db, refresh_token: str):
    with db.cursor() as cursor:
        cursor.execute(
             """SELECT
                    refresh_tokens.clinic_id,
                    clinics.email,
                    clinics.is_super_admin
                FROM refresh_tokens
                JOIN clinics
                    ON clinics.id = refresh_tokens.clinic_id
                WHERE refresh_tokens.token = %s
                AND refresh_tokens.expires_at > NOW()
            """, (refresh_token,))
        
        return cursor.fetchone()


# FORGOT PASSWORD
def store_password_reset_token(db, clinic_id: int, reset_token: str, expires_at):
    with db.cursor() as cursor:
        cursor.execute("INSERT INTO password_reset_tokens (clinic_id, token, expires_at) VALUES (%s, %s, %s)",
                       (clinic_id, reset_token, expires_at))
        

def delete_existing_password_reset_tokens(db, clinic_id: int):
    with db.cursor() as cursor:
        cursor.execute("DELETE FROM password_reset_tokens WHERE clinic_id = %s AND used = FALSE", (clinic_id,))


# RESET PASSWORD
def get_clinic_by_password_reset_tokens(db, reset_token: str):
    with db.cursor() as cursor:
        cursor.execute("""SELECT clinic_id 
                       FROM password_reset_tokens 
                       WHERE token = %s 
                       AND used = FALSE 
                       AND expires_at > NOW()""",
                       (reset_token,))

        return cursor.fetchone()


def set_new_clinic_password(db, clinic_id: int, hashed_password: str):
    with db.cursor() as cursor:
        cursor.execute("UPDATE clinics SET password_hash = %s WHERE id = %s", (hashed_password, clinic_id))


def mark_password_reset_token_used(db, reset_token: str):
    with db.cursor() as cursor:
        cursor.execute("UPDATE password_reset_tokens SET used = TRUE WHERE token = %s", (reset_token,))


def delete_refresh_token_by_id_after_password_reset(db, clinic_id: int):
    with db.cursor() as cursor:
        cursor.execute("DELETE FROM refresh_tokens WHERE clinic_id = %s", (clinic_id,))
