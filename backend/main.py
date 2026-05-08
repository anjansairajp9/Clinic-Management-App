from fastapi import FastAPI, Depends

from backend.routes import (
    auth_route,
    patient_route
)

from backend.database.db import get_db

app = FastAPI()

@app.get("/")
def health_check():
    return {
        "message": "Clinic Management System API Running"
    }


app.include_router(auth_route.router)

app.include_router(patient_route.router)
