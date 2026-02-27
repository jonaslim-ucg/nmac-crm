from typing import Dict, Any, Optional
from fastapi import APIRouter, Form, HTTPException, Depends
from tortoise.transactions import in_transaction
from datetime import time

from applications.patient.models import Patient
from applications.appointment.models import Appointment
from applications.recall_engine.models import (
    CallData, CallOutcome, PatientInterestLevel, PlatformChoice
)
from applications.user.models import User, UserRole
from app.auth import login_required
from routes.recall.recall_list import serialize_call_data

router = APIRouter(prefix="/calls", tags=["CallData"])

# ---------------- CREATE ---------------- #
@router.post("/create")
async def create_call(
    patient_id: str = Form(...),
    appointment_id: Optional[int] = Form(None),
    outcome: CallOutcome = Form(CallOutcome.PATIENT_ANSWERED),
    call_duration: Optional[time] = Form(None),
    contact_method: PlatformChoice = Form(PlatformChoice.PHONE),
    patient_response: bool = Form(False),
    interest_level: Optional[PatientInterestLevel] = Form(None),
    concern: Optional[str] = Form(None),
    note: Optional[str] = Form(None),
    user: User = Depends(login_required),
):
    patient = await Patient.get_or_none(id=patient_id, agent_id=user.id)
    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found")

    if user.role == UserRole.AGENT and patient.agent_id != user.id:
        raise HTTPException(status_code=404, detail="You are not allowed")

    appointment = None
    if appointment_id:
        appointment = await Appointment.get_or_none(id=appointment_id)
        if not appointment:
            raise HTTPException(status_code=404, detail="Appointment not found")

    async with in_transaction():
        call = await CallData.create(
            patient=patient,
            appointment=appointment,
            outcome=outcome,
            call_duration=call_duration,
            contact_method=contact_method,
            patient_response=patient_response,
            interest_level=interest_level,
            concern=concern,
            note=note,
        )

    return {
        "status": "success",
        "call": await serialize_call_data(call),
    }


# ---------------- PATCH ---------------- #
@router.patch("/update")
async def update_call(
    call_id: int = Form(...),
    patient_id: Optional[int] = Form(None),
    appointment_id: Optional[int] = Form(None),
    outcome: Optional[CallOutcome] = Form(None),
    call_duration: Optional[time] = Form(None),
    contact_method: Optional[PlatformChoice] = Form(None),
    patient_response: Optional[bool] = Form(None),
    interest_level: Optional[PatientInterestLevel] = Form(None),
    concern: Optional[str] = Form(None),
    note: Optional[str] = Form(None),
    user: User = Depends(login_required),
):
    call = await CallData.get_or_none(id=call_id)
    if not call:
        raise HTTPException(status_code=404, detail="CallData not found")

    if user.role == UserRole.AGENT and call.patient.agent_id != user.id:
        raise HTTPException(status_code=404, detail="You are not allowed")

    if patient_id:
        patient = await Patient.get_or_none(id=patient_id)
        if not patient:
            raise HTTPException(status_code=404, detail="Patient not found")
        call.patient = patient

    if appointment_id:
        appointment = await Appointment.get_or_none(id=appointment_id)
        if not appointment:
            raise HTTPException(status_code=404, detail="Appointment not found")
        call.appointment = appointment

    if outcome:
        call.outcome = outcome
    if call_duration:
        call.call_duration = call_duration
    if contact_method:
        call.contact_method = contact_method
    if patient_response is not None:
        call.patient_response = patient_response
    if interest_level:
        call.interest_level = interest_level
    if concern is not None:
        call.concern = concern
    if note is not None:
        call.note = note

    await call.save()

    return {
        "status": "success",
        "call": await serialize_call_data(call),
    }


# ---------------- DELETE ---------------- #
@router.delete("/delete")
async def delete_call(call_id: int, user: User = Depends(login_required)):
    call = await CallData.get_or_none(id=call_id)
    if not call:
        raise HTTPException(status_code=404, detail="CallData not found")

    if user.role == UserRole.AGENT and call.patient.agent_id != user.id:
        raise HTTPException(status_code=404, detail="You are not allowed")

    await call.delete()
    return {"status": "success", "message": f"CallData {call_id} deleted"}
