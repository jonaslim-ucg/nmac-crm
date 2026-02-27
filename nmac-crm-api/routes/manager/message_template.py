from __future__ import annotations

from fastapi import FastAPI, APIRouter, Form, HTTPException, Query, Depends
from applications.communication.message_template  import MessageTemplate , Message 
from applications.patient.models import Patient, PatientContact
from routes.communications.whatsapp_message import whatsapp_message
from routes.communications.send_email import send_dynamic_email, EmailPayload
import re
from enum import Enum
from typing import Optional
from tortoise.functions import Count
from applications.user.models import User
from app.token import get_current_user




router = APIRouter()





class CommunicationType(str, Enum):
    whatsapp = "whatsapp"
    email = "email"
    both = "both"

class TemplateStatus(str, Enum):
    active = "active"
    draft = "draft"

# tweak per your needs — you can store these in DB as well
ALLOWED_PLACEHOLDERS = {
    "whatsapp": {"FirstName", "VisitType"},
    "email": {"FirstName", "VisitType"},
    "both": {"FirstName", "VisitType"},
}

PLACEHOLDER_RE = re.compile(r"\{\{\s*(\w+)\s*\}\}")

def extract_placeholders(text: str) -> set:
    return set(PLACEHOLDER_RE.findall(text))


def render_template(content: str, context: dict[str, str]) -> str:
    """
    Replaces {{Placeholder}} with values from context.
    Raises error if any placeholder value is missing.
    """
    placeholders = extract_placeholders(content)
    missing = placeholders - context.keys()

    if missing:
        raise ValueError(f"Missing values for placeholders: {', '.join(missing)}")

    def replacer(match):
        key = match.group(1)
        return str(context[key])

    return PLACEHOLDER_RE.sub(replacer, content)






@router.post("/message-template")
async def create_message_template(
    name: str = Form(...),
    communication_type: CommunicationType = Form(...),   
    category: str = Form(...),
    status: TemplateStatus = Form(...),
    subject: Optional[str] = Form(None),                
    content: str = Form(...),   
    user: User = Depends(get_current_user)                       
):
    # 1) extract placeholders and validate
    placeholders = extract_placeholders(content)
    allowed = ALLOWED_PLACEHOLDERS.get(communication_type.value, set())
    unknown = placeholders - allowed
    if unknown:
        raise HTTPException(
            status_code=400,
            detail=f"Unknown placeholders for {communication_type.value}: {', '.join(sorted(unknown))}"
        )

    # 2) use get_or_create with defaults (Tortoise)
    template, created = await MessageTemplate.get_or_create(
        name=name,
        defaults={
            "communication_type": communication_type,
            "category": category,
            "status": status,
            "subject": subject,
            "message": content,
        }
    )

    # 3) if existed, update content (optional behavior)
    if not created:
        template.message = content
        await template.save()


    return template



@router.put("/message-template/{template_id}")
async def update_message_template(template_id: int, message: str = Form(...), user: User = Depends(get_current_user) ):
    try:
        template = await MessageTemplate.filter(id=template_id).get()
    except MessageTemplate.DoesNotExist:
        raise HTTPException(status_code=404, detail="Message template not found")
    await template.update_from_dict({"message": message})
    await template.save()
    return template



@router.delete("/message-template/{template_id}")
async def delete_message_template(template_id: int, user: User = Depends(get_current_user) ):
    try:
        template = await MessageTemplate.filter(id=template_id).get()
    except MessageTemplate.DoesNotExist:
        raise HTTPException(status_code=404, detail="Message template not found")
    await template.delete()
    return {"detail": "Message template deleted"}






@router.get("/message-templates")
async def list_message_templates(
    communication_type: CommunicationType | None = Query(default=None),
    category: str | None = Query(default=None),
    status: TemplateStatus | None = Query(default=None),
    search_query: str | None = Query(default=None),
    limit: int = Query(20, ge=1, le=100),
    skip: int = Query(0, ge=0),
    user: User = Depends(get_current_user) 
):
    # ---------- base queryset with filters ----------
    qs = MessageTemplate.all()

    total_count = await qs.count()

    if communication_type:
        qs = qs.filter(communication_type=communication_type)
    if category:
        qs = qs.filter(category=category)
    if status:
        qs = qs.filter(status=status)
    if search_query:
        qs = qs.filter(name__icontains=search_query)

    # filtered total
    filtered_total_count = await qs.count()

    # pagination
    data = await qs.offset(skip).limit(limit)

    # ---------- counts per communication_type under same filters ----------
    counts_qs = MessageTemplate.all()

    if category:
        counts_qs = counts_qs.filter(category=category)
    if status:
        counts_qs = counts_qs.filter(status=status)
    if search_query:
        counts_qs = counts_qs.filter(name__icontains=search_query)

    counts = (
        await counts_qs
        .annotate(total=Count("id"))
        .group_by("communication_type")
        .values("communication_type", "total")
    )
    status_counts = (
        await counts_qs
        .annotate(total=Count("id"))
        .group_by("status")
        .values("status", "total")
    )

    return {
        "total_count": total_count,
        "filtered_total_count": filtered_total_count,
        "counts": counts,
        "status_counts": status_counts,
        "data": data,
    }

@router.get("/message-template/{template_id}")
async def retrieve_message_template(template_id: int, user: User = Depends(get_current_user) ):
    template = await MessageTemplate.get_or_none(id=template_id)
    if not template:
        raise HTTPException(status_code=404, detail="Message template not found")
   
    return template






@router.post("/use-template")
async def message_using_templates(temp_id: int, patient_id:str , user: User = Depends(get_current_user) ):
    template = await MessageTemplate.get_or_none(id = temp_id)
    patient = await Patient.get_or_none(id=patient_id)
    contact = await PatientContact.get_or_none(patient=patient)

    if not template or not patient:
        raise HTTPException(status_code=404, detail="Message template or patient not found")
    
    context = {
        "FirstName": patient.name,
        "VisitType": template.category,
    }

    subject = render_template(template.subject, context) if template.subject else ""
    message = render_template(template.message, context)

    create_message = await Message.create(
        patient=patient,
        user=user,
        template=template,
        communication_type=template.communication_type,
        subject=subject,
        message=message
    )
    result = None
    if template.communication_type == "both":
        if contact and contact.email:
            result = await send_dynamic_email(EmailPayload(subject=subject,
                                                       to=contact.email,
                                                         message=message))
        elif contact and contact.phone:
            result = whatsapp_message(contact.phone, subject+message)
    
    if template.communication_type == "whatsapp":
        result = whatsapp_message(contact.phone, subject+message)


    if template.communication_type == "email":
        if contact and contact.email:
            result = await send_dynamic_email(EmailPayload(subject=subject,
                                                          to=contact.email,
                                                          message=message))
        else:
            raise HTTPException(status_code=400, detail="Patient has no email contact for email template.")

    return result








@router.get("/message-history-list")
async def message_history_list(
    agent_id: Optional[str] = Query(default=None),
    platform: Optional[str] = Query(default=None),
    limit: int = Query(20, ge=1, le=100),
    skip: int = Query(0, ge=0),
    user: User = Depends(get_current_user)
):
    qs = Message.all()
    total_count = await qs.count()
    agent_platform_based_counting = (
        await qs
        .annotate(total=Count("id"))
        .group_by("user_id", "communication_type")
        .values("user_id", "communication_type", "total")
    )
    template_based_counting = (
        await qs
        .annotate(total=Count("id"))
        .group_by("template_id")
        .values("template_id", "total")
    )
    if agent_id:
        qs = qs.filter(user_id=agent_id)
    if platform:
        qs = qs.filter(communication_type=platform)
    filtered_total_count = await qs.count()
    data = await qs.offset(skip).limit(limit)

    return {
        "total_count": total_count,
        "filtered_total_count": filtered_total_count,
        "agent_platform_based_counting": agent_platform_based_counting,
        "template_based_counting": template_based_counting,
        "data": data,
    }




@router.post("/email&whatsapp-message")
async def whatsapp_message_endpoint(patient_id: str, platform: str, subject: Optional[str] = None, message: str = "", user: User = Depends(get_current_user) ):
    patient = await Patient.get_or_none(id=patient_id)
    contact = await PatientContact.get_or_none(patient=patient)

    if not patient or not contact:
        raise HTTPException(status_code=404, detail="Patient or contact not found")
    
    message_store = await Message.create(
        patient=patient,
        user=user,
        communication_type=platform,
        message=message
    )

    if platform == "whatsapp":
        result = whatsapp_message(contact.phone, message)
    elif platform == "email":
        result = await send_dynamic_email(EmailPayload(
            subject=subject if subject else "",
            to=contact.email,
            message=message
        ))
    
    return result

