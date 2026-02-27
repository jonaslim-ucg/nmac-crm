from __future__ import annotations

from fastapi import APIRouter, HTTPException, Depends, Form, Query
from pydantic import BaseModel, EmailStr
from typing import List, Optional, Union
from applications.task.models import Task, TaskStatus, TaskPriority
from applications.user.models import User, UserRole
from applications.patient.models import Patient
from app.token import get_current_user
from datetime import datetime
from tortoise.functions import Count
from tortoise.expressions import Q

from app.utils.send_email import send_email
router = APIRouter(prefix="/task", tags=["Task"])





class TaskPayload(BaseModel):
    title: str
    description: Optional[str] = None
    patient_id: Optional[int] = None
    patient_name: Optional[str] = None
    patient_phone: Optional[str] = None
    assigned_to_id: Optional[int] = None
    assigned_to_name: Optional[str] = None
    status: Optional[TaskStatus] = TaskStatus.PENDING
    priority: Optional[TaskPriority] = TaskPriority.MEDIUM
    due_date: Optional[str] = None




# @router.post("/create-task")
# async def create_task(payload: TaskPayload):
#     try:
#         task = Task(
#             title=payload.title,
#             description=payload.description,
#             patient_id=payload.patient_id,
#             assigned_to_id=payload.assigned_to_id,
#             status=payload.status,
#             priority=payload.priority,
#             due_date=payload.due_date
#         )
#         await task.save()
#         return {"message": "Task created successfully", "task_id": task.id}
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=f"Failed to create task: {str(e)}")



@router.post("/create-task")
async def create_task(title: Optional[str] = Form(...),
                      description: Optional[str] = Form(None),
                      patient_id: Optional[str] = Form(None),
                      assigned_to_id: Optional[str] = Form(None),
                      status: Optional[TaskStatus] = Form(TaskStatus.PENDING),
                      priority: Optional[TaskPriority] = Form(TaskPriority.MEDIUM),
                      due_date: Optional[datetime] = Form(None),
                      user: User = Depends(get_current_user)):
    patient = await Patient.get_or_none(id=patient_id) 
    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found")
    user = await User.get_or_none(id=assigned_to_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    try:
        task = Task(
            title=title,
            description=description,
            patient=patient,
            assigned_to=user,
            status=status,
            priority=priority,
            due_date=due_date
        )
        await task.save()
        return {"message": "Task created successfully", "task_id": task.id}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to create task: {str(e)}")



@router.get("/get-task-list")
async def get_task_list(search_query: str | None = Query(default=None),
                        task_status: TaskStatus | None = Query(default=None),
                        task_priority: TaskPriority | None = Query(default=None),
                        agent_id: Optional[str] = Query(default=None),
                        offset: int = Query(default=0),
                        limit: int = Query(default=20),
                        user: User = Depends(get_current_user)):
    try:
        qs = Task.all()
        # if user.role == UserRole.MANAGER or user.role == UserRole.ADMIN:
        #     tasks = await Task.all().prefetch_related('patient', 'assigned_to')
        # else:
        #     tasks = await Task.filter(assigned_to_id=user.id).prefetch_related('patient', 'assigned_to')
        if user.role == UserRole.AGENT:
            qs = qs.filter(assigned_to_id=user.id)

        if agent_id:
            qs = qs.filter(assigned_to_id=agent_id)

        if task_status:
            qs = qs.filter(status=task_status)
        if task_priority:
            qs = qs.filter(priority=task_priority)

        if search_query:
            qs = qs.filter(
        Q(title__icontains=search_query) |
        Q(description__icontains=search_query)
    )

        tasks = await qs.prefetch_related('patient', 'assigned_to').offset(offset).limit(limit)
        task_count_on_status = (
            await qs.annotate(status__count=Count("id")).group_by("status").values("status", "status__count")
        )

        count_on_priority = (
            await qs.annotate(priority__count=Count("id")).group_by("priority").values("priority", "priority__count")
        )

        task_list = []
        for task in tasks:
            task_list.append({
                "id": task.id,
                "title": task.title,
                "description": task.description,
                "patient": {
                    "id": task.patient.id if task.patient else None,
                    "name": task.patient.name if task.patient else None
                },
                "assigned_to": {
                    "id": task.assigned_to.id if task.assigned_to else None,
                    "name": task.assigned_to.name if task.assigned_to else None
                },
                "status": task.status,
                "priority": task.priority,
                "due_date": task.due_date
            })
        return {"task_count_on_status": task_count_on_status, "count_on_priority": count_on_priority, "tasks": task_list}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to retrieve tasks: {str(e)}")