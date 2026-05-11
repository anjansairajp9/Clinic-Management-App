from fastapi import FastAPI

from backend.routes import (
    auth_route,
    patient_route,
    doctor_route
)


app = FastAPI()

@app.get("/")
def health_check():
    return {
        "message": "Clinic Management System API Running"
    }


app.include_router(auth_route.router)

app.include_router(patient_route.router)

app.include_router(doctor_route.router)
