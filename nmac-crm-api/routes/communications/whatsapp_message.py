from fastapi import APIRouter
from twilio.rest import Client



router = APIRouter()





account_sid = "AC6720e0ab3392d259d6355020c3362fe2"
auth_token = "1ec28d10a1ed68db5b5e7899fd63b5cd"




# @router.get("/message")
def whatsapp_message(phone: str, message: str):
    client = Client(account_sid, auth_token)
    phone = "01521796083"

    message = client.messages.create(
        from_="whatsapp:+14155238886", 
        body=message,
        to=f"whatsapp:+88{phone}"
    )

    print(message)
    return "success"