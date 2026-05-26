# DEVELOPMENT CELERY TESTING TASK
from backend.core.celery_app import celery

@celery.task(
    bind=True,
    autoretry_for=(Exception,),
    retry_kwargs={"max_retries": 3},
    retry_backoff=True
)
def test_celery(self):
    print("Celery Is Working")

    return {
        "message": "Celery Connected Successfully"
    }
