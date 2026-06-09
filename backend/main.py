from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from backend.routes import (
    auth_route,
    patient_route,
    doctor_route,
    appointment_route,
    treatment_route,
    payment_route,
    super_admin_route
)


app = FastAPI()


app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


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

app.include_router(payment_route.router)

app.include_router(super_admin_route.router)
