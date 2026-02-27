from datetime import date, time, datetime
from enum import Enum
from tortoise import models, fields
from enum import Enum

class AppointmentStatus(str, Enum):
    SCHEDULED = "SCHEDULED"
    COMPLETED = "COMPLETED"
    CANCELED = "CANCELED"
    MISSED = "MISSED"
    DECLINED = "DECLINED"

class Appointment(models.Model):
    id = fields.IntField(pk=True)
    patient = fields.ForeignKeyField("models.Patient", related_name="appointments")
    agent = fields.ForeignKeyField("models.User", related_name="appointments", null=True, blank=True)
    appointment_date = fields.DateField(default=date.today)
    appointment_time = fields.TimeField(blank=True, null=True)
    status = fields.CharEnumField(AppointmentStatus, default=AppointmentStatus.SCHEDULED)
    notes = fields.TextField(null=True, blank=True)

    created_at = fields.DatetimeField(auto_now_add=True)
    updated_at = fields.DatetimeField(auto_now=True)

    class Meta:
        table = "appointments"
        ordering = ["-created_at"]

    def is_completed(self):
        return self.status == AppointmentStatus.COMPLETED

    def is_missed(self):
        return self.status == AppointmentStatus.MISSED

    def __str__(self):
        return f"Appointment {self.id} for {self.patient.name}"
