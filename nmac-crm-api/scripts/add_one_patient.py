#!/usr/bin/env python3
"""One-off script to add a single patient with email for SMTP testing."""
import asyncio
import sys
from pathlib import Path

# Ensure app is importable
sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from tortoise import Tortoise
from app.config import TORTOISE_ORM
from applications.patient.models import Patient, PatientContact, PatientStatus, PatientPriority


async def main():
    await Tortoise.init(config=TORTOISE_ORM)
    try:
        email = "test1bub2+test@gmail.com"
        external_id = f"ECW-PT-TEST-{id(email) % 100000}"
        if await Patient.filter(external_ecw_id=external_id).exists():
            print(f"Patient with external_ecw_id {external_id} already exists.")
            patient = await Patient.get(external_ecw_id=external_id)
        else:
            patient = await Patient.create(
                external_ecw_id=external_id,
                name="SMTP Test Patient",
                mrn=f"MRN-TEST-{id(email) % 100000}",
                priority=PatientPriority.MEDIUM,
                status=PatientStatus.NOT_STARTED,
            )
            print(f"Created patient: id={patient.id}, name={patient.name}")

        contact = await PatientContact.get_or_none(patient=patient, email=email)
        if contact:
            print(f"Contact with email {email} already exists for this patient.")
        else:
            await PatientContact.create(
                patient=patient,
                email=email,
                phone=None,
                preferred_channel="email",
                is_opted_out=False,
            )
            print(f"Created contact: email={email}")
        print(f"\nDone. Patient id={patient.id} – use this when sending a template to test SMTP.")
    finally:
        await Tortoise.close_connections()


if __name__ == "__main__":
    asyncio.run(main())
