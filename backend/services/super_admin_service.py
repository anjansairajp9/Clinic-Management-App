from fastapi import HTTPException
from datetime import datetime,date
from zoneinfo import ZoneInfo

from backend.repositories.super_admin_repository import (
    get_super_admin_dashboard_stats,
    get_recent_clinics
)

IST = ZoneInfo("Asia/Kolkata")

def get_super_admin_dashboard_service(db, appointment_date: date | None):
    try:
        if not appointment_date:
            appointment_date = datetime.now(IST).date()

        dashboard_stats = get_super_admin_dashboard_stats(db, appointment_date)
        if not dashboard_stats:
            raise HTTPException(
                status_code=400,
                detail="Failed To Get Dashboard Stats"
            )

        recent_clinics = get_recent_clinics(db)
        
        return {
            **dashboard_stats,
            "analytics_date": appointment_date,
            "recent_clinics": recent_clinics
        }
    except Exception:
        raise
