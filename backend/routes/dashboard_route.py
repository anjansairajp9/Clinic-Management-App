from fastapi import APIRouter, Depends, status

from backend.database.db import get_db
from backend.core.security import get_current_clinic

from backend.schemas.dashboard_schema import (
    ClinicDashboardOverviewResponse
)

from backend.services.dashboard_service import (
    get_clinic_dashboard_overview_service
)


router = APIRouter()


@router.get("/overview", response_model=ClinicDashboardOverviewResponse, status_code=status.HTTP_200_OK)
def clinic_dashboard_overview_stats(current_clinic=Depends(get_current_clinic), db=Depends(get_db)):
    return get_clinic_dashboard_overview_service(db, current_clinic["clinic_id"])
