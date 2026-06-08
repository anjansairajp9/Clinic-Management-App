from fastapi import APIRouter, Depends, status
from datetime import date

from backend.database.db import get_db

from backend.core.security import require_super_admin

from backend.schemas.super_admin_schema import (
    SuperAdminDashboardResponse
)

from backend.services.super_admin_service import (
    get_super_admin_dashboard_service
)


router = APIRouter()


@router.get(
    "/super-admin/dashboard",
    response_model=SuperAdminDashboardResponse,
    status_code=status.HTTP_200_OK
)
def get_super_admin_dashboard(
    appointment_date: date | None = None, current_clinic=Depends(require_super_admin), db=Depends(get_db)
):
    return get_super_admin_dashboard_service(db, appointment_date)
