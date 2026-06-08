from datetime import date

# SUPER ADMIN DASHBOARD STATS
def get_super_admin_dashboard_stats(db, appointment_date: date):
    with db.cursor() as cursor:
        cursor.execute(
             """SELECT
                    (
                        SELECT COUNT(*)
                        FROM clinics
                        WHERE is_active = TRUE
                        AND is_super_admin = FALSE
                    ) AS total_clinics,

                    (
                        SELECT COUNT(*)
                        FROM doctors
                        WHERE is_active = TRUE
                    ) AS total_doctors,

                    (
                        SELECT COUNT(*)
                        FROM patients
                        WHERE is_active = TRUE
                    ) AS total_patients,

                    (
                        SELECT COUNT(*)
                        FROM appointments
                        WHERE is_active = TRUE
                    ) AS total_appointments,

                    (
                        SELECT COUNT(*)
                        FROM treatments
                        WHERE is_active = TRUE
                    ) AS total_treatments,

                    (
                        SELECT COALESCE(
                            SUM(amount_paid),
                            0
                        )
                        FROM payments
                        WHERE is_active = TRUE
                    ) AS total_revenue,

                    (
                        SELECT COUNT(*)
                        FROM appointments
                        WHERE is_active = TRUE
                        AND DATE(
                                appointment_time
                                AT TIME ZONE
                                'Asia/Kolkata'
                            ) = %s
                    ) AS selected_date_appointments,

                    (
                        SELECT COUNT(*)
                        FROM payments
                        WHERE is_active = TRUE
                        AND payment_status
                            = 'pending'
                    ) AS pending_payments
             """, (appointment_date,))

        return cursor.fetchone()


# GET RECENT CLINICS
def get_recent_clinics(db, limit: int = 5):
    with db.cursor() as cursor:
        cursor.execute(
             """SELECT
                    id, name, phone, email, address, created_at, updated_at
                FROM clinics

                WHERE is_active = TRUE
                AND is_super_admin = FALSE

                ORDER BY created_at DESC

                LIMIT %s
             """, (limit,))

        return cursor.fetchall()
