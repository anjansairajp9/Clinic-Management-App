from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles

from backend.routes import (
    auth_route,
    patient_route,
    doctor_route,
    appointment_route,
    treatment_route
)


app = FastAPI()

@app.get("/")
def health_check():
    return {
        "message": "Clinic Management System API Running"
    }


app.mount("/uploads", StaticFiles(directory="backend/uploads"), name="uploads")


app.include_router(auth_route.router)

app.include_router(patient_route.router)

app.include_router(doctor_route.router)

app.include_router(appointment_route.router)

app.include_router(treatment_route.router)
