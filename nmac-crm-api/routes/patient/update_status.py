from typing import Dict, Any, Optional
from fastapi import APIRouter, HTTPException, Form, Depends
from tortoise.transactions import in_transaction
from datetime import date

from applications.patient.models import Patient, PatientContact, PatientPriority, PatientStatus
from applications.user.models import User, UserRole
from app.auth import role_required, login_required
from routes.patient.get import serialize_patient

router = APIRouter(prefix='/update', tags=["Patients"])

# ---------------- PATCH ROUTE USING FORM ---------------- #
@router.patch("/", response_model=Dict[str, Any])
async def update_patient(
    patient_id: str = Form(...),
    mrn: Optional[str] = Form(None),
    name: Optional[str] = Form(None),
    dob: Optional[date] = Form(None),
    gender: Optional[str] = Form(None),
    priority: Optional[PatientPriority] = Form(None),
    status: Optional[PatientStatus] = Form(None),
    insurance_payer: Optional[str] = Form(None),
    insurance_plan: Optional[str] = Form(None),
    insurance_member_id: Optional[str] = Form(None),
    phone: Optional[str] = Form(None),
    email: Optional[str] = Form(None),
    preferred_channel: Optional[str] = Form(None),
    is_opted_out: Optional[bool] = Form(None),
    user: User = Depends(login_required)
):
    # Fetch patient
    patient = await Patient.get_or_none(id=patient_id)
    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found")

    # Only allow assigned agents
    if user.role == UserRole.AGENT and patient.agent_id != user.id:
        raise HTTPException(status_code=403, detail="You are not allowed to update this patient")

    async with in_transaction():
        # Update patient fields
        patient_fields = ["mrn", "name", "dob", "gender", "priority", "status",
                          "insurance_payer", "insurance_plan", "insurance_member_id"]
        for field in patient_fields:
            value = locals()[field]
            if value is not None:
                setattr(patient, field, value)
        await patient.save()

        # Update contact if any form field is provided
        if any([phone, email, preferred_channel, is_opted_out is not None]):
            # Delete old contacts
            await PatientContact.filter(patient=patient).delete()
            await PatientContact.create(
                patient=patient,
                phone=phone,
                email=email,
                preferred_channel=preferred_channel or "phone",
                is_opted_out=is_opted_out if is_opted_out is not None else False
            )

    return {
        "status": "success",
        "patient": await serialize_patient(patient)
    }


# ---------------- PATCH ROUTE USING FORM ---------------- #
@router.patch("/status", response_model=Dict[str, Any])
async def update_patient_status(
    patient_id: str = Form(...),
    status: Optional[PatientStatus] = Form(None),
    user: User = Depends(login_required)
):
    patient = await Patient.get_or_none(id=patient_id)
    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found")
    if user.role == UserRole.AGENT and patient.agent_id != user.id:
        raise HTTPException(status_code=403, detail="You are not allowed to update this patient")

    async with in_transaction():
        patient_fields = ["status"]
        for field in patient_fields:
            value = locals()[field]
            if value is not None:
                setattr(patient, field, value)
        await patient.save()

    return {
        "status": "success",
        "patient": await serialize_patient(patient)
    }



@router.patch("/assign-agent", dependencies=[Depends(role_required(UserRole.MANAGER, isGranted=True))])
async def assign_agent(
    patient_id: str = Form(...),
    agent_id: str = Form(...)
):
    patient = await Patient.get_or_none(id=patient_id)
    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found")

    agent = await User.get_or_none(id=agent_id, role=UserRole.AGENT)
    if not agent:
        raise HTTPException(status_code=404, detail="Agent not found or invalid role")

    async with in_transaction():
        patient.agent = agent
        await patient.save()

    return {
        "status": "success",
        "message": f"Agent {agent.name} assigned to patient {patient.name}",
        "patient": await serialize_patient(patient)
    }