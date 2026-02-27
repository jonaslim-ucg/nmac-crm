from typing import List, Dict

from fastapi import APIRouter, Depends
import asyncio

from tortoise.expressions import Q
from tortoise.functions import Count

from app.auth import role_required
from applications.patient.models import Patient, Visit, PatientStatus
from applications.user.models import UserRole, User

router = APIRouter(prefix="/summery", tags=["Summery"])

@router.get("/", dependencies=[Depends(role_required(UserRole.ADMIN))])
async def user_summary_for_admin():
    # Get all counts concurrently
    total_user_task = User.all().count()
    total_patients_task = Patient.all().count()
    total_agent_task = User.filter(role=UserRole.AGENT).count()
    total_active_agent = User.filter(is_active=True).count()
    total_manager_task = User.filter(role=UserRole.MANAGER).count()

    total_user, total_patients, total_agent, total_active_agent, total_manager = await asyncio.gather(
        total_user_task,
        total_patients_task,
        total_agent_task,
        total_active_agent,
        total_manager_task
    )

    return {
        "total_user": total_user,
        "total_patients": total_patients,
        "total_agents": total_agent,
        "total_active_agent": total_active_agent,
        "total_managers": total_manager
    }


@router.get("/top-agents", dependencies=[Depends(role_required(UserRole.MANAGER, isGranted=True))])
async def top_agents() -> List[Dict]:
    agents_qs = (
        User.filter(role=UserRole.AGENT)
        .annotate(
            total_calls=Count("patients"),
            total_booked=Count("patients", _filter=Q(patients__status=PatientStatus.BOOKED))
        )
        .order_by("-total_calls")
        .limit(10)
        .values("id", "name", "photo", "total_calls", "total_booked")
    )

    agents = await agents_qs

    # 2) Calculate conversion rate
    for agent in agents:
        total_calls = agent["total_calls"] or 0
        total_booked = agent["total_booked"] or 0
        agent["conversion_rate_percent"] = round((total_booked / total_calls) * 100, 2) if total_calls else 0

    return agents