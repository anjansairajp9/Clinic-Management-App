import os
import httpx
import json

from dotenv import load_dotenv

load_dotenv()

GUPSHUP_API_KEY = os.getenv("GUPSHUP_API_KEY")
GUPSHUP_SOURCE_NUMBER = os.getenv("GUPSHUP_SOURCE_NUMBER")
GUPSHUP_APP_NAME = os.getenv("GUPSHUP_APP_NAME")

GUPSHUP_API_URL = (
    "https://api.gupshup.io/wa/api/v1/template/msg"
)

TEMPLATE_IDS = {
    "appointment_confirmed": os.getenv("APPOINTMENT_CONFIRMED_TEMPLATE_ID"),

    "appointment_reminder": os.getenv("APPOINTMENT_REMINDER_TEMPLATE_ID"),

    "appointment_cancellation": os.getenv("APPOINTMENT_CANCELLATION_TEMPLATE_ID")
}


async def send_message(
    phone: str,
    message: str | None = None,
    template_name: str | None = None,
    template_variables: list | None = None
):
    try:
        phone = phone.replace("+", "").replace(" ", "").replace("-", "").strip()

        headers = {
            "apikey": GUPSHUP_API_KEY,
            "Content-Type": "application/x-www-form-urlencoded",
            "Accept": "application/json"
        }

        if template_name:
            template_id = TEMPLATE_IDS.get(template_name)

            if not template_id:
                raise Exception(
                    f"Template ID not found "
                    f"for {template_name}"
                )

            payload = {
                "channel": "whatsapp",
                "source": GUPSHUP_SOURCE_NUMBER,
                "destination": phone,
                "src.name": GUPSHUP_APP_NAME,
                "template": json.dumps({
                    "id": template_id,
                    "params": [str(v) for v in template_variables]
                })
            }

        else:
            payload = {
                "channel": "whatsapp",
                "source": GUPSHUP_SOURCE_NUMBER,
                "destination": phone,
                "src.name": GUPSHUP_APP_NAME,
                "message": json.dumps({
                    "type": "text",
                    "text": message
                })
            }

        async with httpx.AsyncClient(timeout=15.0) as client:
            response = await client.post(
                GUPSHUP_API_URL,
                headers=headers,
                data=payload
            )

        response.raise_for_status()

        return response.json()

    except httpx.TimeoutException:
        raise Exception(
            "Gupshup request timed out"
        )

    except httpx.HTTPStatusError as e:
        raise Exception(
            f"Gupshup API Error: "
            f"{e.response.text}"
        )

    except Exception as e:
        raise Exception(
            f"Failed To Send WhatsApp "
            f"Message: {str(e)}"
        )
