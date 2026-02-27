from collections import defaultdict
from datetime import date, timedelta

from dateutil.relativedelta import relativedelta
from fastapi import APIRouter, Depends
from typing import Dict, List

import asyncio
from tortoise.functions import Max
from applications.patient.models import Patient, PatientStatus, Visit
from applications.user.models import User, UserRole
from app.auth import login_required

router = APIRouter(prefix='/summery', tags=["Patients"])

@router.get("/")
async def patient_summary(user: User = Depends(login_required)) -> Dict[str, float]:
    patients_qs = Patient.all()

    if user.role == UserRole.AGENT:
        patients_qs = patients_qs.filter(agent=user)

    patients_qs = patients_qs.annotate(last_visit=Max("visits__visit_date"))
    active_statuses = [PatientStatus.CONTACTED, PatientStatus.INTERESTED, PatientStatus.BOOKED]

    one_month_ago = date.today() - relativedelta(months=1)

    total_patients_task = patients_qs.count()
    active_patients_task = patients_qs.filter(status__in=active_statuses).count()
    assigned_patients_task = patients_qs.exclude(agent=None).count()
    unassigned_patients_task = patients_qs.filter(agent=None).count()
    contacted_patients_task = patients_qs.filter(status=PatientStatus.CONTACTED).count()
    booked_appointments_task = patients_qs.filter(status=PatientStatus.BOOKED).count()
    due_for_recall_task = patients_qs.filter(last_visit__lte=one_month_ago).count()

    (
        total_patients,
        active_patients,
        assigned_patients,
        unassigned_patients,
        contacted_patients,
        booked_appointments,
        due_for_recall,
    ) = await asyncio.gather(
        total_patients_task,
        active_patients_task,
        assigned_patients_task,
        unassigned_patients_task,
        contacted_patients_task,
        booked_appointments_task,
        due_for_recall_task,
    )
    conversation_rate = round((booked_appointments / contacted_patients) * 100, 2) if contacted_patients else 0

    data = {
        "total_patients": total_patients,
        "active_patients": active_patients,
        "contacted_patients": contacted_patients,
        "booked_appointments": booked_appointments,
        "conversation_rate": conversation_rate,
        "due_for_recall": due_for_recall,
    }

    if user.role != UserRole.AGENT:
        data["assigned_patients"] = assigned_patients
        data["unassigned_patients"] = unassigned_patients

    return data


class OuterRef:
    pass


@router.get("/visit-type-stats")
async def visit_type_stats(user = Depends(login_required)) -> List[Dict]:
    today = date.today()
    d3 = today - relativedelta(months=3)
    d6 = today - relativedelta(months=6)
    d12 = today - relativedelta(months=12)

    visits_qs = Visit.all()

    if hasattr(user, "id") and await Visit.filter(patient__agent_id=user.id).exists():
        visits_qs = visits_qs.filter(patient__agent_id=user.id)

    latest_per_patient = await (
        visits_qs
        .group_by("patient_id")
        .annotate(last_date=Max("visit_date"))
        .values("patient_id", "last_date")
    )

    if not latest_per_patient:
        return []

    patient_last_date = {row["patient_id"]: row["last_date"] for row in latest_per_patient}

    latest_visits = await Visit.filter(
        patient_id__in=patient_last_date.keys(),
        visit_date__in=patient_last_date.values(),
    )

    stats = defaultdict(lambda: {
        "total": set(),
        "m3": set(),
        "m6": set(),
        "m12": set(),
    })

    for v in latest_visits:
        pid = v.patient_id
        vt = v.visit_type or "UNKNOWN"

        stats[vt]["total"].add(pid)
        if v.visit_date >= d3:
            stats[vt]["m3"].add(pid)
        if v.visit_date >= d6:
            stats[vt]["m6"].add(pid)
        if v.visit_date >= d12:
            stats[vt]["m12"].add(pid)

    return [
        {
            "visit_type": str(vt),
            "total_patients": len(d["total"]),
            "patients_3m": len(d["m3"]),
            "patients_6m": len(d["m6"]),
            "patients_12m": len(d["m12"]),
        }
        for vt, d in stats.items()
    ]