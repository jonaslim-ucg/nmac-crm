from datetime import timedelta

from fastapi import APIRouter, Depends, HTTPException
from tortoise.expressions import Q
from tortoise.functions import Count
from tortoise.timezone import now

from app.auth import permission_required, role_required
from applications.appointment.models import Appointment, AppointmentStatus
from applications.patient.models import PatientStatus, Patient
from applications.recall_engine.models import CallData
from applications.user.models import User, UserRole

router = APIRouter(prefix="/performance", tags=["Performance"])

def success_rate(total: int, failed: int) -> float:
    return round(((total - failed) / total) * 100, 2) if total > 0 else 0


def avg_time_from_seconds(total_seconds: int, count: int) -> str:
    if count == 0 or total_seconds == 0:
        return "00:00:00"
    avg = total_seconds // count
    h, r = divmod(avg, 3600)
    m, s = divmod(r, 60)
    return f"{h:02}:{m:02}:{s:02}"


async def call_stats(agent_id: str, start, end=None):
    qs = CallData.filter(
        patient__agent_id=agent_id,
        created_at__gte=start,
    )
    if end:
        qs = qs.filter(created_at__lt=end)

    data = await qs.annotate(
        total=Count("id"),
        missed=Count("id", _filter=Q(outcome=None)),
    ).values("total", "missed")

    total = data[0]["total"] if data else 0
    missed = data[0]["missed"] if data else 0

    durations = await qs.filter(call_duration__isnull=False).values_list("call_duration", flat=True)

    total_seconds = sum(d.total_seconds() for d in durations)

    return {
        "total": total,
        "missed": missed,
        "rate": success_rate(total, missed),
        "avg_time": avg_time_from_seconds(total_seconds, len(durations)),
    }


async def appointment_stats(agent_id: str, start, end=None):
    qs = Appointment.filter(
        patient__agent_id=agent_id,
        created_at__gte=start,
    )
    if end:
        qs = qs.filter(created_at__lt=end)

    data = await qs.annotate(
        total=Count("id"),
        completed=Count("id", _filter=Q(status=AppointmentStatus.COMPLETED)),
    ).values("total", "completed")

    total = data[0]["total"] if data else 0
    completed = data[0]["completed"] if data else 0

    return {
        "total": total,
        "completed": completed,
        "rate": success_rate(total, total - completed),
    }

async def conversation_stat(agent_id: str, start, end=None):
    relevant_statuses = [
        PatientStatus.CONTACTED,
        PatientStatus.INTERESTED,
        PatientStatus.NOT_INTERESTED,
        PatientStatus.BOOKED,
    ]

    ps = Patient.filter(
        agent_id=agent_id,
        status__in=relevant_statuses,
        created_at__gte=start,
    )
    if end:
        ps = ps.filter(created_at__lt=end)

    data = await ps.annotate(
        total=Count("id"),
    ).values("total")

    total = data[0]["total"] if data else 0
    booked_patients = await ps.filter(status=PatientStatus.BOOKED).count()

    rate = round((booked_patients / total) * 100, 2) if total > 0 else 0

    return {
        "total": total,
        "rate": rate,
    }


async def get_weekly_performance(agent_id: str):
    today = now()
    start_of_week = today - timedelta(days=today.weekday())
    start_of_week = start_of_week.replace(hour=0, minute=0, second=0, microsecond=0)

    week_days = {
        "mon": 0,
        "tue": 1,
        "wed": 2,
        "thu": 3,
        "fri": 4,
    }

    weekly = {}

    for day, offset in week_days.items():
        day_start = start_of_week + timedelta(days=offset)
        day_end = day_start + timedelta(days=1)

        weekly[day] = {
            "call": await CallData.filter(
                patient__agent_id=agent_id,
                created_at__gte=day_start,
                created_at__lt=day_end,
            ).count(),

            "appointment": await Appointment.filter(
                patient__agent_id=agent_id,
                created_at__gte=day_start,
                created_at__lt=day_end,
            ).count(),
        }

    return weekly


# -------------------------
# MAIN REUSABLE FUNCTION
# -------------------------
async def get_agent_performance(agent_id: str, period: str = "weekly"):
    now_time = now()

    if period == "daily":
        start = now_time.replace(hour=0, minute=0, second=0, microsecond=0)
        prev_start = start - timedelta(days=1)

    elif period == "weekly":
        start = now_time - timedelta(days=7)
        prev_start = start - timedelta(days=7)

    elif period == "yearly":
        start = now_time - timedelta(days=365)
        prev_start = start - timedelta(days=365)

    else:
        raise ValueError("Invalid period")

    call = await call_stats(agent_id, start)
    prev_call = await call_stats(agent_id, prev_start, start)

    appointment = await appointment_stats(agent_id, start)
    prev_appointment = await appointment_stats(agent_id, prev_start, start)

    conversation = await conversation_stat(agent_id, start)
    prev_conversation = await conversation_stat(agent_id, prev_start, start)

    return {
        "call": call["total"],
        "call_rate": round(call["rate"] - prev_call["rate"], 2) if call["rate"] > 0 else 0,
        "missed_calls": call["missed"],
        "avg_call_time": call["avg_time"],

        "appointment": appointment["total"],
        "appointment_rate": round(
            appointment["rate"] - prev_appointment["rate"], 2
        ) if appointment["rate"] > 0 else 0,

        # placeholders (future analytics)
        "conversation_rate": conversation["total"],
        "message_sent": round(
            conversation["rate"] - prev_conversation["rate"], 2
        ) if conversation["rate"] > 0 else 0,
    }


@router.get("/agent", dependencies=[Depends(role_required(UserRole('MANAGER'), isGranted=True))])
async def agent_performance(agent_id: str):
    agent = await User.get_or_none(id=agent_id, role=UserRole.AGENT)
    if not agent:
        raise HTTPException(status_code=404, detail="Agent not found.")

    perf = await get_agent_performance(agent_id, "weekly")

    return {
        "call": perf["call"],
        "call_rate": perf["call_rate"],
        "avg_call_time": perf["avg_call_time"],

        "appointment": perf["appointment"],
        "appointment_rate": perf["appointment_rate"],

        "message_sent": perf["message_sent"],
        "conversation_rate": perf["conversation_rate"],

        "missed_calls": perf["missed_calls"],
        "weekly": await get_weekly_performance(agent_id),
    }