from tortoise import models, fields
from enum import Enum
from app.utils.generate_unique import generate_unique

class PatientStatus(str, Enum):
    NOT_STARTED = "NOT_STARTED"
    CONTACTED = "CONTACTED"
    INTERESTED = "INTERESTED"
    NOT_INTERESTED = "NOT_INTERESTED"
    BOOKED = "BOOKED"
    DECLINED = "DECLINED"
    CALL_BACK_LATER = "CALL_BACK_LATER"


class PatientPriority(str, Enum):
    HIGH = "HIGH"
    MEDIUM = "MEDIUM"
    LOW = "LOW"

class VisitStatus(str, Enum):
    PENDING = "PENDING"
    COMPLETED = "COMPLETED"
    MISSED = "MISSED"
    CANCELED = "CANCELED"
    DECLINED = "DECLINED"

class Patient(models.Model):
    id = fields.CharField(pk=True, max_length=60)
    mrn = fields.CharField(max_length=100, unique=True, null=True)

    name = fields.CharField(max_length=255, null=True)
    dob = fields.DateField(null=True)
    gender = fields.CharField(max_length=50, null=True)

    priority = fields.CharEnumField(PatientPriority, default=PatientPriority.MEDIUM)
    address = fields.CharField(max_length=255, null=True)
    is_active = fields.BooleanField(default=True)

    insurance_payer = fields.CharField(max_length=255, null=True)
    insurance_plan = fields.CharField(max_length=255, null=True)
    insurance_member_id = fields.CharField(max_length=255, null=True)

    agent = fields.ForeignKeyField("models.User", related_name="patients", blank=True, null=True)
    status = fields.CharEnumField(PatientStatus, default=PatientStatus.NOT_STARTED)

    external_ecw_id = fields.CharField(max_length=255, unique=True, null=False)
    created_at = fields.DatetimeField(auto_now_add=True)
    updated_at = fields.DatetimeField(auto_now=True)

    class Meta:
        table = "patients"
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.name} ({self.mrn})"

    async def save(self, *args, **kwargs):
        if not self.id:
            self.id = (await generate_unique(Patient, text="PI", max_length=10)).upper()
        await super().save(*args, **kwargs)


class PatientContact(models.Model):
    id = fields.IntField(pk=True)

    patient = fields.ForeignKeyField("models.Patient", related_name="contacts")

    phone = fields.CharField(max_length=50, null=True)
    email = fields.CharField(max_length=255, null=True)
    preferred_channel = fields.CharField(max_length=50)

    is_opted_out = fields.BooleanField(default=False)

    created_at = fields.DatetimeField(auto_now_add=True)
    updated_at = fields.DatetimeField(auto_now=True)

    class Meta:
        table = "patient_contacts"
        ordering = ["-created_at"]



class Provider(models.Model):
    id = fields.IntField(pk=True)
    external_ecw_id = fields.CharField(max_length=255, unique=True)
    name = fields.CharField(max_length=255)
    specialty = fields.CharField(max_length=255, null=True)

    created_at = fields.DatetimeField(auto_now_add=True)
    updated_at = fields.DatetimeField(auto_now=True)

    class Meta:
        table = "providers"
        ordering = ["-created_at"]


class Visit(models.Model):
    id = fields.IntField(pk=True)
    external_ecw_id = fields.CharField(max_length=255, unique=True)
    patient = fields.ForeignKeyField("models.Patient", related_name="visits")
    provider = fields.ForeignKeyField("models.Provider", related_name="visits")

    visit_type = fields.CharField(max_length=100, null=True)
    visit_date = fields.DateField()
    visit_status = fields.CharEnumField(VisitStatus, default=VisitStatus.COMPLETED)
    visit_note = fields.TextField(null=True)

    created_at = fields.DatetimeField(auto_now_add=True)
    updated_at = fields.DatetimeField(auto_now=True)

    class Meta:
        indexes = [("patient_id", "visit_date")]
        ordering = ["-visit_date"]
