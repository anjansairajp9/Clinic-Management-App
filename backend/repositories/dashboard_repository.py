# CLINIC DASHBOARD OVERVIEW
def get_clinic_dashboard_overview(db, clinic_id: int):
    with db.cursor() as cursor:
        cursor.execute(
             """SELECT
                    (
                        SELECT COUNT(*)
                        FROM patients
                        WHERE is_active = TRUE
                        AND clinic_id = %s
                    ) AS total_patients,

                    (
                        SELECT COUNT(*)
                        FROM doctors
                        WHERE is_active = TRUE
                        AND clinic_id = %s
                    ) AS total_doctors,

                    (
                        SELECT COUNT(*)
                        FROM appointments
                        WHERE is_active = TRUE
                        AND clinic_id = %s
                    ) AS total_appointments,

                    (
                        SELECT COUNT(*)
                        FROM treatments
                        WHERE is_active = TRUE
                        AND clinic_id = %s
                    ) AS total_treatments,

                    (
                        SELECT COALESCE(
                            SUM(amount_paid),
                            0
                        )
                        FROM payments
                        WHERE is_active = TRUE
                        AND clinic_id = %s
                    ) AS total_revenue
            """, (clinic_id, clinic_id, clinic_id, clinic_id, clinic_id))
        
        return cursor.fetchone()
