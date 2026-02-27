from fastapi import APIRouter
from twilio.rest import Client

from app.config import settings

router = APIRouter()


# @router.get("/message")
def whatsapp_message(phone: str, message: str):
    if not settings.TWILIO_ACCOUNT_SID or not settings.TWILIO_AUTH_TOKEN:
        raise ValueError("TWILIO_ACCOUNT_SID and TWILIO_AUTH_TOKEN must be set in .env")
    client = Client(settings.TWILIO_ACCOUNT_SID, settings.TWILIO_AUTH_TOKEN)
    phone = "01521796083"

    message = client.messages.create(
        from_="whatsapp:+14155238886", 
        body=message,
        to=f"whatsapp:+88{phone}"
    )

    print(message)
    return "success"