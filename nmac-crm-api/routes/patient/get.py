from datetime import date, timezone, datetime
from typing import Dict, Any, Optional, List

from fastapi import APIRouter, Query, Depends, HTTPException
from tortoise.queryset import QuerySet

from app.auth import login_required
from app.utils.formatTime import format_duration
from applications.patient.models import Patient, Visit, PatientPriority, PatientStatus
from applications.user.models import User, UserRole

router = APIRouter(prefix='/get', tags=["Patients"])


# ----------------- SERIALIZER ----------------- #
async def serialize_patient(patient: Patient) -> Dict[str, Any]:
    await patient.fetch_related(
        "contacts",
        "visits",
        "visits__provider",
        "agent",
    )

    last_contact = max(patient.contacts, key=lambda c: c.created_at, default=None)
    last_visit = max(patient.visits, key=lambda v: v.visit_date, default=None)

    return {
        "id": patient.id,
        "mrn": patient.mrn,
        "name": patient.name,
        "dob": patient.dob,
        "phone": last_contact.phone if last_contact else None,
        "email": last_contact.email if last_contact else None,
        "gender": patient.gender,
        "address": patient.address,

        "insurance_payer": patient.insurance_payer,
        "insurance_plan": patient.insurance_plan,
        "insurance_member_id": patient.insurance_member_id,

        "priority": patient.priority,
        "status": patient.status,
        "is_active": patient.is_active,

        "preferred_channel": last_contact.preferred_channel if last_contact else None,
        "is_opted_out": last_contact.is_opted_out if last_contact else None,
        "last_visit_type": last_visit.visit_type if last_visit else None,
        "last_visit_date": last_visit.visit_date if last_visit else None,
        "last_visit_status": last_visit.visit_status if last_visit else None,
        "last_visit_note": last_visit.visit_note if last_visit else None,
        "primary_provider_name": last_visit.provider.name if last_visit else None,
        "due_for": format_duration(last_visit.created_at) if last_visit else None,

        "external_ecw_id": patient.external_ecw_id,
        "agent": {
            "id": patient.agent.id,
            "name": patient.agent.name,
        } if patient.agent else None,
        "contacts": [
            {
                "id": c.id,
                "phone": c.phone,
                "email": c.email,
                "preferred_channel": c.preferred_channel,
                "is_opted_out": c.is_opted_out,
                "created_at": c.created_at,
                "updated_at": c.updated_at,
            }
            for c in patient.contacts
        ],
        "visits": [
            {
                "id": v.id,
                "external_ecw_id": v.external_ecw_id,
                "visit_type": v.visit_type,
                "visit_date": v.visit_date,
                "visit_status": v.visit_status,
                "visit_note": v.visit_note,
                "provider": {
                    "id": v.provider.id,
                    "external_ecw_id": v.provider.external_ecw_id,
                    "name": v.provider.name,
                    "specialty": v.provider.specialty,
                } if v.provider else None,
            }
            for v in patient.visits
        ],
        "created_at": patient.created_at,
        "updated_at": patient.updated_at,
    }


# ----------------- GET SINGLE PATIENT ----------------- #
@router.get("/details")
async def get_patient(patient_id: str, user: User = Depends(login_required)):
    patient = await Patient.get_or_none(id=patient_id)
    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found")

    if user.role == UserRole.AGENT and patient.agent_id != user.id:
        raise HTTPException(status_code=403, detail="You do not have access to this patient")

    return await serialize_patient(patient)


# ----------------- LIST PATIENTS WITH FILTERS ----------------- #
@router.get("/")
async def list_patients(
    agent_id: Optional[int] = Query(None, description="Filter by agent ID"),
    assigned_only: Optional[bool] = Query(None, description="Only patients with assigned agents"),
    priority: Optional[PatientPriority] = Query(None),
    status: Optional[PatientStatus] = Query(None),
    visit_date_start: Optional[date] = Query(None, description="Filter visits from this date"),
    visit_date_end: Optional[date] = Query(None, description="Filter visits until this date"),
    search: Optional[str] = Query(None, description="Search by patient name"),
    limit: int = Query(20, ge=1, le=100),
    offset: int = Query(0, ge=0),
    user: User = Depends(login_required)
):
    query: QuerySet = Patient.all()
    if user.role == UserRole.AGENT:
        query = query.filter(agent=user)

    # ---------- BASIC FILTERS ----------
    if agent_id is not None:
        query = query.filter(agent_id=agent_id)

    if assigned_only:
        query = query.exclude(agent_id=None)

    if priority:
        query = query.filter(priority=priority)

    if status:
        query = query.filter(status=status)

    if search:
        query = query.filter(name__icontains=search)

    # ---------- VISIT DATE FILTER ----------
    if visit_date_start or visit_date_end:
        visit_qs = Visit.all()

        if visit_date_start:
            visit_qs = visit_qs.filter(visit_date__gte=visit_date_start)
        if visit_date_end:
            visit_qs = visit_qs.filter(visit_date__lte=visit_date_end)

        patient_ids = await visit_qs.values_list("patient_id", flat=True)

        if not patient_ids:
            return {"count": 0, "limit": limit, "offset": offset, "results": []}

        query = query.filter(id__in=patient_ids)

    # ---------- COUNT ----------
    total = await query.count()

    # ---------- FETCH DATA WITH PREFETCH ----------
    patients = await query.offset(offset).limit(limit)

    return {
        "count": total,
        "limit": limit,
        "offset": offset,
        "results": [await serialize_patient(p) for p in patients],
    }
