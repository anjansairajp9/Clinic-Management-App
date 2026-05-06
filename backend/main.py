from fastapi import FastAPI, Depends
from backend.database.db import get_db

app = FastAPI()

@app.get("/")
def health_check():
    return {
        "message": "Clinic Management System API Running"
    }


@app.get("/test-db")
def test_db(db=Depends(get_db)):
    with db.cursor() as cursor:
        cursor.execute(
            "SELECT 1 AS test"
        )

        result = cursor.fetchall()

    return {
        "database_connected": True,
        "result": result
    }