from typing import Dict, Any, Optional
from fastapi import APIRouter, HTTPException, Query
from fastapi.params import Form, Depends
from tortoise.transactions import in_transaction

from applications.appointment.models import Appointment, AppointmentStatus
from applications.patient.models import Patient
from applications.user.models import User, UserRole
from app.auth import login_required, role_required
from datetime import date, time, datetime, UTC


async def serialize_appointment(appointment: "Appointment") -> Dict[str, Any]:
    await appointment.fetch_related("patient", "agent")

    return {
        "id": appointment.id,
        "appointment_date": appointment.appointment_date,
        "appointment_time": appointment.appointment_time,
        "status": appointment.status,
        "notes": appointment.notes,

        "patient": {
            "id": appointment.patient.id,
            "name": appointment.patient.name,
            "mrn": appointment.patient.mrn,
            "dob": appointment.patient.dob,
            "gender": appointment.patient.gender,
            "priority": appointment.patient.priority,
            "status": appointment.patient.status,
            "is_active": appointment.patient.is_active,
        } if appointment.patient else None,

        "agent": {
            "id": appointment.agent.id,
            "name": str(appointment.agent),
        } if appointment.agent else None,

        "is_completed": appointment.is_completed(),
        "is_missed": appointment.is_missed(),

        "created_at": appointment.created_at,
        "updated_at": appointment.updated_at,
    }


router = APIRouter(prefix="/appointments", tags=["Appointments"])

@router.get("/my", response_model=Dict[str, Any])
async def get_appointments(
    offset: int = 0,
    limit: int = 10,
    patient_id: Optional[str] = Query(None, description="Filter by patient ID"),
    agent: User = Depends(role_required(UserRole('AGENT'))),
):
    query = Appointment.filter(agent_id=agent.id).order_by("-appointment_date", "-appointment_time")
    if patient_id is not None:
        query = query.filter(patient_id=patient_id)

    total = await query.count()
    appointments = await query.offset(offset).limit(limit).prefetch_related("patient", "agent")
    results = [await serialize_appointment(app) for app in appointments]

    return {
        "status": "success",
        "total": total,
        "offset": offset,
        "limit": limit,
        "appointments": results,
    }

@router.get("/get-list", response_model=Dict[str, Any], dependencies=[Depends(role_required(UserRole('AGENT'), isGranted=True)) ])
async def get_appointments(
    offset: int = 0,
    limit: int = 10,
    patient_id: Optional[str] = Query(None, description="Filter by patient ID"),
    agent_id: Optional[str] = Query(None, description="Filter by agent ID"),
):
    query = Appointment.all().order_by("-appointment_date", "-appointment_time")
    if patient_id is not None:
        query = query.filter(patient_id=patient_id)
    if agent_id is not None:
        query = query.filter(agent_id=agent_id)

    total = await query.count()
    appointments = await query.offset(offset).limit(limit).prefetch_related("patient", "agent")
    results = [await serialize_appointment(app) for app in appointments]

    return {
        "status": "success",
        "total": total,
        "offset": offset,
        "limit": limit,
        "appointments": results,
    }


@router.post("/create", response_model=Dict[str, Any])
async def create_appointment(
    appointment_date: date = Form(
        ..., description="Date of the appointment (YYYY-MM-DD > 2026-01-26)"
    ),
    appointment_time: Optional[str] = Form(
        None, description="Time of the appointment (HH:MM[:SS])"
    ),
    patient_id: Optional[str] = Form(None),
    notes: Optional[str] = Form(None),
    agent: User = Depends(role_required(UserRole('AGENT'))),
):
    parsed_time: time | None = None

    if appointment_time:
        try:
            naive_time = datetime.strptime(
                appointment_time, "%H:%M:%S"
            ).time()
            aware_time = datetime.combine(
                appointment_date, naive_time, tzinfo=UTC
            )
            utc_time = aware_time.astimezone(UTC)

            parsed_time = utc_time.time().replace(tzinfo=None)

        except ValueError:
            raise HTTPException(
                status_code=400,
                detail="Invalid time format. Use HH:MM:SS",
            )

    async with in_transaction():
        appointment = Appointment(
            appointment_date=appointment_date,
            appointment_time=parsed_time,
            notes=notes,
        )

        if patient_id:
            patient = await Patient.get_or_none(id=patient_id)
            if not patient:
                raise HTTPException(status_code=404, detail="Patient not found")
            appointment.patient = patient

        appointment.agent = agent
        await appointment.save()

    return {
        "status": "success",
        "appointment": await serialize_appointment(appointment),
    }


@router.patch("/update", response_model=Dict[str, Any])
async def update_appointment(
    appointment_id: int = Form(...),

    appointment_date: Optional[date] = Form(
        None, description="Date of the appointment (YYYY-MM-DD)"
    ),
    appointment_time: Optional[str] = Form(
        None, description="Time of the appointment (HH:MM[:SS])"
    ),

    patient_id: Optional[str] = Form(None),
    notes: Optional[str] = Form(None),
    status: Optional[AppointmentStatus] = Form(None),

    agent: User = Depends(role_required(UserRole('AGENT'))),
):
    appointment = await Appointment.get_or_none(id=appointment_id, agent_id=agent.id)
    if not appointment:
        raise HTTPException(status_code=404, detail="Appointment not found")

    async with in_transaction():
        if appointment_date is not None:
            appointment.appointment_date = appointment_date

        if appointment_time is not None:
            appointment.appointment_time = appointment_time

        if notes is not None:
            appointment.notes = notes

        if status is not None:
            appointment.status = status

        if patient_id is not None:
            patient = await Patient.get_or_none(id=patient_id)
            if not patient:
                raise HTTPException(status_code=404, detail="Patient not found")
            appointment.patient = patient

        await appointment.save()

    return {
        "status": "success",
        "appointment": await serialize_appointment(appointment),
    }


@router.delete("/delete", response_model=Dict[str, Any])
async def delete_appointment(appointment_id: int, user: User = Depends(login_required)):
    appointment = await Appointment.get_or_none(id=appointment_id)
    if user.role == UserRole.AGENT and appointment.agent_id != user.id:
        raise HTTPException(status_code=403, detail="Access denied")
    if not appointment:
        raise HTTPException(status_code=404, detail="Appointment not found")

    await appointment.delete()
    return {"status": "success", "message": f"Appointment {appointment_id} deleted"}