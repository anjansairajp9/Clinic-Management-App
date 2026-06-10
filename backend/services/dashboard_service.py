from fastapi import HTTPException

from backend.repositories.dashboard_repository import (
    get_clinic_dashboard_overview
)

def get_clinic_dashboard_overview_service(db, clinic_id: int):
    try:
        dashboard_overview = get_clinic_dashboard_overview(db, clinic_id)
        if not dashboard_overview:
            raise HTTPException(
                status_code=400,
                detail="Failed To Get Dashboard Overview Stats"
            )
        
        return dashboard_overview
    except Exception:
        raise
