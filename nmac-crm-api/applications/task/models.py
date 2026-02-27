from tortoise import fields, models
from enum import Enum



class TaskStatus(str, Enum):
    PENDING = "PENDING"
    IN_PROGRESS = "IN_PROGRESS"
    COMPLETED = "COMPLETED"

class TaskPriority(str, Enum):
    HIGH = "HIGH"
    MEDIUM = "MEDIUM"
    LOW = "LOW"

class Task(models.Model):
    id = fields.IntField(pk=True)
    title = fields.CharField(max_length=255)
    description = fields.TextField(null=True, blank=True)
    patient = fields.ForeignKeyField("models.Patient", related_name="tasks", null=True, blank=True)
    assigned_to = fields.ForeignKeyField("models.User", related_name="tasks", null=True, blank=True)
    status = fields.CharEnumField(TaskStatus, default=TaskStatus.PENDING)
    priority = fields.CharEnumField(TaskPriority, default=TaskPriority.MEDIUM)
    due_date = fields.DatetimeField(null=True, blank=True)
    created_at = fields.DatetimeField(auto_now_add=True)
    updated_at = fields.DatetimeField(auto_now=True)

    class Meta:
        table = "tasks"
        ordering = ["-created_at"]
