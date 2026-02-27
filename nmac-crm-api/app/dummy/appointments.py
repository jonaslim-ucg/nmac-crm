import random
from faker import Faker
from tortoise.transactions import in_transaction
from tortoise.exceptions import IntegrityError
from applications.patient.models import Patient
from applications.user.models import User
from applications.appointment.models import Appointment, AppointmentStatus

fake = Faker()

TOTAL_APPOINTMENTS = 50
TIMEZONE = "UTC"  # kept for reference
MAX_APPOINTMENTS_PER_PATIENT = 5

async def seed_appointments():
    try:
        existing_count = await Appointment.all().count()
        if existing_count >= 200:
            print(f"⏭️ Skipping Appointment seeding (already {existing_count} records exist).")
            return

        async with in_transaction():
            patients = await Patient.all()
            agents = await User.all()

            if not patients:
                print("❌ No patients found. Please seed patients first.")
                return
            if not agents:
                print("❌ No agents found. Please seed agents first.")
                return

            appointments_created = 0

            for _ in range(TOTAL_APPOINTMENTS):
                patient = random.choice(patients)
                agent = random.choice(agents + [None])
                status = random.choice(list(AppointmentStatus))

                await Appointment.create(
                    patient=patient,
                    agent=agent,
                    # appointment_date=appointment_date,
                    # appointment_time=appointment_time,
                    status=status,
                    notes=fake.sentence(nb_words=12),
                )

                appointments_created += 1

            print(f"✅ Dummy appointments seeded: {appointments_created}")
            print("🎉 Appointment data seeding completed successfully!")

    except IntegrityError as e:
        print("❌ Integrity error:", e)
    except Exception as e:
        print("❌ Unexpected error:", e)
