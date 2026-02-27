import random
from faker import Faker

from tortoise.transactions import in_transaction
from tortoise.exceptions import IntegrityError

from applications.patient.models import Patient
from applications.appointment.models import Appointment
from applications.recall_engine.models import (
    CallData,
    CallOutcome,
    PatientInterestLevel,
    PlatformChoice,
)

fake = Faker()

TOTAL_CALLS = 100  # Total dummy call data
MAX_TOTAL_CALLS = 200  # Hard cap for safety

async def seed_call_data():
    try:
        existing_count = await CallData.all().count()
        if existing_count >= MAX_TOTAL_CALLS:
            print(f"⏭️ Skipping CallData seeding (already {existing_count} records exist).")
            return

        async with in_transaction():
            patients = await Patient.all()
            appointments = await Appointment.all()

            if not patients:
                print("❌ No patients found. Please seed patients first.")
                return

            calls_created = 0

            for _ in range(TOTAL_CALLS):
                patient = random.choice(patients)

                # Optionally link appointment of the same patient
                patient_appointments = [a for a in appointments if a.patient_id == patient.id]
                appointment = random.choice(patient_appointments + [None]) if patient_appointments else None

                # --------------------------------------------------
                # Call duration (TimeField MUST be naive)
                # --------------------------------------------------
                # raw_time = fake.time_object()
                # call_duration = make_naive_time(raw_time)

                await CallData.create(
                    patient=patient,
                    appointment=appointment,
                    outcome=random.choice(list(CallOutcome)),
                    contact_method=random.choice(list(PlatformChoice)),
                    interest_level=random.choice(list(PatientInterestLevel)),
                    patient_response=random.choice([True, False]),
                    # call_duration=call_duration,
                    concern=fake.sentence(nb_words=6),
                    note=fake.sentence(nb_words=8),
                )

                calls_created += 1

            print(f"✅ Dummy call data seeded: {calls_created}")
            print("🎉 CallData seeding completed successfully!")

    except IntegrityError as e:
        print("❌ Integrity error:", e)
    except Exception as e:
        print("❌ Unexpected error:", e)
