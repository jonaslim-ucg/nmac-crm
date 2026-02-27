from typing import Union, List
from pydantic import EmailStr
from app.utils.send_email import send_email


async def email_notify(
    subject: str,
    message: str,
    to: Union[EmailStr, List[EmailStr]],
):
    await send_email(
        subject=subject,
        to=to,
        message=message,
        html_message=message,
    )