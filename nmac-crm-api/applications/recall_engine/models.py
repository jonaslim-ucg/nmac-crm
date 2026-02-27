from enum import Enum
from tortoise import models, fields

class CallOutcome(str, Enum):
    PATIENT_ANSWERED = "PATIENT_ANSWERED"
    LEFT_VOICEMAIL = "LEFT_VOICEMAIL"
    NO_ANSWER = "NO_ANSWER"
    WRONG_NUMBER = "WRONG_NUMBER"


class PatientInterestLevel(str, Enum):
    VERY_INTERESTED = "VERY_INTERESTED"
    INTERESTED = "INTERESTED"
    NEUTRAL = "NEUTRAL"
    NOT_INTERESTED = "NOT_INTERESTED"


class PlatformChoice(str, Enum):
    PHONE = "PHONE"
    WHATSAPP = "WHATSAPP"
    EMAIL = "EMAIL"


class CallData(models.Model):
    id = fields.IntField(pk=True)
    patient = fields.ForeignKeyField("models.Patient", related_name="recalls")
    outcome = fields.CharEnumField(CallOutcome, default=CallOutcome.PATIENT_ANSWERED, null=True, blank=True)
    call_duration = fields.TimeField(null=True, blank=True)
    contact_method = fields.CharEnumField(PlatformChoice, default=PlatformChoice.PHONE, null=True, blank=True)
    patient_response = fields.BooleanField(default=False)
    interest_level = fields.CharEnumField(PatientInterestLevel, null=True, blank=True)

    concern = fields.TextField(null=True, blank=True)
    note = fields.TextField(null=True, blank=True)

    appointment = fields.ForeignKeyField("models.Appointment", related_name="recalls", null=True, blank=True)

    created_at = fields.DatetimeField(auto_now_add=True)

    class Meta:
        table = "call_data"
        ordering = ["-created_at"]

    def is_appointed(self):
        return self.appointment is not None



