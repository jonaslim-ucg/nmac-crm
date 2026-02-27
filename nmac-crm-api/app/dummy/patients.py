import random
from faker import Faker
from tortoise.transactions import in_transaction
from tortoise.exceptions import IntegrityError
from applications.patient.models import (
    Patient,
    PatientContact,
    Provider,
    Visit,
    PatientPriority,
    PatientStatus,
    VisitStatus,
)

fake = Faker()

TOTAL_PATIENTS = 30
TOTAL_PROVIDERS = 5
MAX_VISITS_PER_PATIENT = 3

async def seed_patients_only():
    try:
        existing_count = await Patient.all().count()
        if existing_count >= 200:
            print(f"⏭️ Skipping patient seeding (already {existing_count} patients exist).")
            return

        async with in_transaction():
            # ---------- PROVIDERS ----------
            providers: list[Provider] = []
            for i in range(TOTAL_PROVIDERS):
                provider_obj, created = await Provider.get_or_create(
                    external_ecw_id=f"ECW-PROV-{i+1}",
                    defaults={
                        "name": fake.name(),
                        "specialty": random.choice([
                            "Cardiology",
                            "Dermatology",
                            "Internal Medicine",
                            "Orthopedics",
                            "Pediatrics",
                        ]),
                    },
                )
                providers.append(provider_obj)

            print(f"✅ Providers seeded: {len(providers)}")

            # ---------- PATIENTS ----------
            patients: list[Patient] = []
            for _ in range(TOTAL_PATIENTS):
                patient = await Patient.create(
                    name=fake.name(),
                    dob=fake.date_of_birth(minimum_age=18, maximum_age=85),
                    gender=random.choice(["MALE", "FEMALE", "OTHERS"]),
                    priority=random.choice(list(PatientPriority)),
                    status=random.choice(list(PatientStatus)),
                    address=fake.address(),
                    insurance_payer=random.choice([
                        "Aetna", "Blue Cross", "UnitedHealth", "Cigna", "Medicare"
                    ]),
                    insurance_plan=fake.word(),
                    insurance_member_id=fake.bothify("INS-#####"),
                    external_ecw_id=f"ECW-PAT-{fake.unique.random_number(digits=6)}",
                )
                patients.append(patient)

            print(f"✅ Patients seeded: {len(patients)}")

            # ---------- PATIENT CONTACTS ----------
            for patient in patients:
                await PatientContact.create(
                    patient=patient,
                    phone=fake.phone_number(),
                    email=fake.email(),
                    preferred_channel=random.choice(["whatsapp", "email", "phone"]),
                    is_opted_out=random.choice([False, False, True]),
                )

            print("✅ Patient contacts seeded")

            # ---------- VISITS ----------
            total_visits = 0
            for patient in patients:
                for _ in range(random.randint(1, MAX_VISITS_PER_PATIENT)):
                    await Visit.create(
                        external_ecw_id=f"ECW-VISIT-{fake.unique.random_number(digits=7)}",
                        patient=patient,
                        provider=random.choice(providers),
                        visit_type=random.choice([
                            "Annual Checkup",
                            "Follow-up",
                            "Consultation",
                        ]),
                        visit_date=fake.date_between(start_date="-1y", end_date="today"),
                        visit_status=random.choice(list(VisitStatus)),
                    )
                    total_visits += 1

            print(f"✅ Visits seeded: {total_visits}")
            print("🎉 Patient data seeding completed successfully!")

    except IntegrityError as e:
        print("❌ Integrity error:", e)
    except Exception as e:
        print("❌ Unexpected error:", e)
