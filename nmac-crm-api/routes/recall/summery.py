from datetime import datetime, timedelta

from fastapi import APIRouter, Depends
from typing import Dict

import asyncio

from applications.patient.models import Patient, PatientStatus
from applications.recall_engine.models import CallData, CallOutcome, PlatformChoice
from applications.user.models import User, UserRole
from app.auth import get_current_user

router = APIRouter(prefix="/summery", tags=["Summery"])

@router.get("/calls")
async def calls_summary(user: User = Depends(get_current_user)) -> Dict[str, float]:
    patients_qs = Patient.all()
    calls_qs = CallData.all()

    if user.role == UserRole.AGENT:
        patients_qs = patients_qs.filter(agent=user)
        calls_qs = calls_qs.filter(patient__agent=user)

    # Define all count queries
    total_patients_task = patients_qs.count()
    no_answer_task = calls_qs.filter(outcome=CallOutcome.NO_ANSWER).count()
    wrong_number_task = calls_qs.filter(outcome=CallOutcome.WRONG_NUMBER).count()
    declined_task = patients_qs.filter(status=PatientStatus.DECLINED).count()
    call_back_later_task = patients_qs.filter(status=PatientStatus.CALL_BACK_LATER).count()
    already_scheduled_task = patients_qs.filter(status=PatientStatus.BOOKED).count()
    not_interested_task = patients_qs.filter(status=PatientStatus.NOT_INTERESTED).count()

    # Run all counts concurrently for speed
    (
        total_patients,
        no_answer_count,
        wrong_number_count,
        declined_count,
        call_back_later_count,
        already_scheduled_count,
        not_interested_count
    ) = await asyncio.gather(
        total_patients_task,
        no_answer_task,
        wrong_number_task,
        declined_task,
        call_back_later_task,
        already_scheduled_task,
        not_interested_task
    )

    # Helper for percentages
    def pct(count: int) -> float:
        return round((count / total_patients) * 100, 2) if total_patients else 0

    return {
        "total_patients": total_patients,
        "no_answer": pct(no_answer_count),
        "wrong_number": pct(wrong_number_count),
        "declined": pct(declined_count),
        "call_back_later": pct(call_back_later_count),
        "already_scheduled": pct(already_scheduled_count),
        "not_interested": pct(not_interested_count),
    }


@router.get("/contact-method-summary")
async def calls_summary_by_contact_method(
    user: User = Depends(get_current_user),
) -> Dict:
    calls_qs = CallData.all()

    if user.role == UserRole.AGENT:
        calls_qs = calls_qs.filter(patient__agent=user)

    # -------------------------------
    # Overall counts
    # -------------------------------
    total_calls_task = calls_qs.count()
    phone_calls_task = calls_qs.filter(contact_method=PlatformChoice.PHONE).count()
    whatsapp_calls_task = calls_qs.filter(contact_method=PlatformChoice.WHATSAPP).count()
    email_calls_task = calls_qs.filter(contact_method=PlatformChoice.EMAIL).count()

    # -------------------------------
    # Per-day summary (last 7 days)
    # -------------------------------
    today = datetime.utcnow().date()
    daily_tasks = []
    daily_ranges = []

    for i in range(7):
        day = today - timedelta(days=i)
        day_start = datetime.combine(day, datetime.min.time())
        day_end = datetime.combine(day, datetime.max.time())
        daily_ranges.append(day)

        day_qs = calls_qs.filter(
            created_at__gte=day_start,
            created_at__lte=day_end,
        )

        daily_tasks.extend([
            day_qs.count(),
            day_qs.filter(contact_method=PlatformChoice.PHONE).count(),
            day_qs.filter(contact_method=PlatformChoice.WHATSAPP).count(),
            day_qs.filter(contact_method=PlatformChoice.EMAIL).count(),
        ])

    # -------------------------------
    # Run everything concurrently
    # -------------------------------
    results = await asyncio.gather(
        total_calls_task,
        phone_calls_task,
        whatsapp_calls_task,
        email_calls_task,
        *daily_tasks,
    )

    total_calls, phone_calls, whatsapp_calls, email_calls, *daily_counts = results

    # -------------------------------
    # Prepare daily summary
    # -------------------------------
    daily_summary = []
    for i, day in enumerate(daily_ranges):
        idx = i * 4
        daily_summary.append({
            "date": day,
            "day_name": day.strftime("%a"),
            "total_calls": daily_counts[idx],
            "PHONE": daily_counts[idx + 1],
            "WHATSAPP": daily_counts[idx + 2],
            "EMAIL": daily_counts[idx + 3],
        })

    return {
        "total_calls": total_calls,
        "PHONE": phone_calls,
        "WHATSAPP": whatsapp_calls,
        "EMAIL": email_calls,
        "last_7_days": daily_summary,
    }


@router.get("/conversion-summary", response_model=Dict)
async def conversion_summary_last_7_days(user: User = Depends(get_current_user)) -> Dict:
    today = datetime.utcnow().date()
    patients_qs = Patient.all()

    if user.role == UserRole.AGENT:
        patients_qs = patients_qs.filter(agent=user)

    # -------------------------------
    # Overall counts
    # -------------------------------
    total_patients_task = patients_qs.count()
    contacted_task = patients_qs.filter(status=PatientStatus.CONTACTED).count()
    booked_task = patients_qs.filter(status=PatientStatus.BOOKED).count()

    # -------------------------------
    # Per-day summary (last 7 days)
    # -------------------------------
    daily_tasks = []
    daily_ranges = []

    for i in range(7):
        day = today - timedelta(days=i)
        day_start = datetime.combine(day, datetime.min.time())
        day_end = datetime.combine(day, datetime.max.time())
        daily_ranges.append(day)

        day_qs = patients_qs.filter(
            updated_at__gte=day_start,
            updated_at__lte=day_end
        )

        daily_tasks.extend([
            day_qs.count(),  # total contacts for the day
            day_qs.filter(status=PatientStatus.CONTACTED).count(),
            day_qs.filter(status=PatientStatus.BOOKED).count(),
        ])

    # -------------------------------
    # Run everything concurrently
    # -------------------------------
    results = await asyncio.gather(
        total_patients_task,
        contacted_task,
        booked_task,
        *daily_tasks,
    )

    total_patients, contacted_count, booked_count, *daily_counts = results

    # -------------------------------
    # Prepare daily summary
    # -------------------------------
    daily_summary = []
    for i, day in enumerate(daily_ranges):
        idx = i * 3
        total_day = daily_counts[idx]
        contacted_day = daily_counts[idx + 1]
        booked_day = daily_counts[idx + 2]

        daily_summary.append({
            "date": day,
            "day_name": day.strftime("%a"),
            "total_contacts": total_day,
            "CONTACTED": contacted_day,
            "BOOKED": booked_day,
        })

    return {
        "total_patients": total_patients,
        "CONTACTED": contacted_count,
        "BOOKED": booked_count,
        "last_7_days": daily_summary
    }