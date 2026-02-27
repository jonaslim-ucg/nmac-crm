from typing import Dict, Any, Optional
from fastapi import APIRouter, Query, Depends, HTTPException

from app.auth import login_required
from app.token import get_current_user
from applications.recall_engine.models import CallData, CallOutcome, PatientInterestLevel, PlatformChoice
from applications.user.models import User, UserRole

router = APIRouter(prefix="/calls", tags=["CallData"])


# ---------------- SERIALIZER ---------------- #
async def serialize_call_data(call: CallData) -> Dict[str, Any]:
    # Ensure related objects are loaded
    await call.fetch_related("patient", "appointment", "appointment__agent")

    appointment = call.appointment
    agent = appointment.agent if appointment else None

    return {
        "id": call.id,
        "patient_id": call.patient.id,
        "patient_name": call.patient.name,
        "patient_status": call.patient.status,
        "outcome": call.outcome,
        "call_duration": call.call_duration,
        "contact_method": call.contact_method,
        "patient_response": call.patient_response,
        "interest_level": call.interest_level,
        "concern": call.concern,
        "note": call.note,
        "is_appointed": call.is_appointed(),

        "appointment": {
            "id": appointment.id if appointment else None,
            "date": appointment.appointment_date if appointment else None,
            "time": appointment.appointment_time if appointment else None,
            "status": appointment.status if appointment else None,
        } if appointment else None,

        "agent": {
            "id": agent.id,
            "name": str(agent),
        } if agent else None,

        "created_at": call.created_at,
    }


# ---------------- GET CALL LIST ---------------- #
@router.get("/get-list")
async def get_calls(
    offset: int = Query(0, ge=0),
    limit: int = Query(10, ge=1, le=100),
    patient_id: Optional[str] = Query(None, description="Filter by patient ID"),
    appointment_id: Optional[int] = Query(None, description="Filter by appointment ID"),
    outcome: Optional[CallOutcome] = Query(None, description="Filter by call outcome"),
    interest_level: Optional[PatientInterestLevel] = Query(None, description="Filter by patient interest level"),
    contact_method: Optional[PlatformChoice] = Query(None, description="Filter by contact method"),
    user: User = Depends(get_current_user)
):
    query = CallData.all()
    if user.role == UserRole.AGENT:
        query = query.filter(patient__agent=user)

    if patient_id is not None:
        query = query.filter(patient_id=patient_id)
    if appointment_id is not None:
        query = query.filter(appointment_id=appointment_id)
    if outcome is not None:
        query = query.filter(outcome=outcome)
    if interest_level is not None:
        query = query.filter(interest_level=interest_level)
    if contact_method is not None:
        query = query.filter(contact_method=contact_method)

    total = await query.count()
    calls = (
        await query
        .order_by("-created_at")
        .offset(offset)
        .limit(limit)
        .prefetch_related("patient", "appointment", "appointment__agent")
    )

    # Serialize results
    results = [await serialize_call_data(call) for call in calls]

    return {
        "status": "success",
        "total": total,
        "offset": offset,
        "limit": limit,
        "data": results,
    }

@router.get("/details/")
async def get_single_call(call_id: int, user: User = Depends(login_required)) -> Dict[str, Any]:
    call = await CallData.get_or_none(id=call_id).prefetch_related(
        "patient", "appointment", "appointment__agent"
    )
    if not call:
        raise HTTPException(status_code=404, detail="CallData not found")
    if user.role == UserRole.AGENT and call.patient.agent_id != user.id:
        raise HTTPException(status_code=403, detail="You are not allowed to access this call")
    return await serialize_call_data(call)