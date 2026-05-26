import os
import httpx
import json

from dotenv import load_dotenv

load_dotenv()

GUPSHUP_API_KEY = os.getenv("GUPSHUP_API_KEY")
GUPSHUP_SOURCE_NUMBER = os.getenv("GUPSHUP_SOURCE_NUMBER")
GUPSHUP_APP_NAME = os.getenv("GUPSHUP_APP_NAME")

GUPSHUP_API_URL = "https://api.gupshup.io/wa/api/v1/msg"


async def send_message(
    phone: str,
    message: str,
    template_name: str | None = None,
    template_variables: dict | None = None
):
    try:
        phone = phone.replace("+", "").replace(" ", "").replace("-", "").strip()

        headers = {
            "apikey": GUPSHUP_API_KEY,
            "Content-Type": "application/x-www-form-urlencoded"
        }

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
            f"Gupshup API Error: {e.response.text}"
        )

    except Exception as e:
        raise Exception(
            f"Failed To Send WhatsApp Message: {str(e)}"
        )
