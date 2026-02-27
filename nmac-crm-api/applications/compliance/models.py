from tortoise import models, fields

class DNCRegistry(models.Model):
    id = fields.IntField(pk=True)

    patient = fields.ForeignKeyField("models.Patient", related_name="dnc_entries")
    channel = fields.CharField(max_length=50)
    reason = fields.CharField(max_length=255)

    created_at = fields.DatetimeField(auto_now_add=True)

    class Meta:
        unique_together = ("patient", "channel")
