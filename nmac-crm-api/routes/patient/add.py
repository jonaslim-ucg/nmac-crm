# from fastapi import APIRouter, UploadFile, File, HTTPException
# from pydantic import BaseModel
# from typing import List, Optional, Dict, Any
# from tortoise.transactions import in_transaction
# from datetime import date
# import pandas as pd
# import io


# from applications.patient.models import PatientPriority, PatientStatus, PatientContact, Patient, Visit, Provider
# from routes.patient.get import serialize_patient

# # ---------------- Pydantic Models ---------------- #

# class PatientContactIn(BaseModel):
#     phone: Optional[str] = None
#     email: Optional[str] = None
#     preferred_channel: str
#     is_opted_out: bool = False


# class ProviderIn(BaseModel):
#     external_ecw_id: str
#     name: str
#     specialty: Optional[str] = None


# class VisitIn(BaseModel):
#     external_ecw_id: str
#     visit_type: Optional[str] = None
#     visit_date: Optional[date] = None
#     visit_status: Optional[str] = None
#     visit_note: Optional[str] = None
#     provider: ProviderIn


# class BulkPatientIn(BaseModel):
#     external_ecw_id: str
#     mrn: Optional[str] = None
#     name: Optional[str] = None
#     dob: Optional[date] = None
#     gender: Optional[str] = None
#     priority: PatientPriority = PatientPriority.MEDIUM
#     status: PatientStatus = PatientStatus.NOT_STARTED
#     insurance_payer: Optional[str] = None
#     insurance_plan: Optional[str] = None
#     insurance_member_id: Optional[str] = None
#     contacts: List[PatientContactIn] = []
#     visits: List[VisitIn] = []

# # ---------------- Router ---------------- #
# router = APIRouter(prefix='/add', tags=["Patients"])

# @router.post("/", description="""[
#   {
#     "external_ecw_id": "ECW-PT-000201",
#     "mrn": "MRN-202401",
#     "name": "sdfsdfRahman",
#     "dob": "1994-07-18",
#     "gender": "male",
#     "priority": "MEDIUM",
#     "status": "NOT_STARTED",
#     "insurance_payer": "Blue Cross Blue Shield",
#     "insurance_plan": "Silver Plus",
#     "insurance_member_id": "BCBS-88991234",
#     "contacts": [
#       {
#         "phone": "+8801712345678",
#         "email": "ayesha.rahman@example.com",
#         "preferred_channel": "whatsapp",
#         "is_opted_out": false
#       },
#       {
#         "phone": "+8801911223344",
#         "preferred_channel": "phone",
#         "is_opted_out": true
#       }
#     ],
#     "visits": [
#       {
#         "external_ecw_id": "ECW-VS-000201",
#         "visit_type": "Annual Checkup",
#         "visit_date": "2025-11-19",
#         "visit_status": "COMPLETED",
#         "visit_note": null,
#         "provider": {
#           "external_ecw_id": "ECW-PV-000201",
#           "name": "Larry Burton",
#           "specialty": "Pediatrics"
#         }
#       },
#       {
#         "external_ecw_id": "ECW-VS-000345",
#         "visit_type": "Follow-up",
#         "visit_date": "2025-06-01",
#         "visit_status": "CANCELED",
#         "visit_note": null,
#         "provider": {
#           "external_ecw_id": "ECW-PV-000201",
#           "name": "Larry Burton",
#           "specialty": "Pediatrics"
#         }
#       }
#     ]
#   },
#   {
#     "external_ecw_id": "ECW-PT-000202",
#     "mrn": "MRN-202402",
#     "name": "Rahim Uddin",
#     "dob": "1986-11-03",
#     "gender": "Male",
#     "priority": "HIGH",
#     "status": "CONTACTED",
#     "insurance_payer": "UnitedHealthcare",
#     "insurance_plan": "Gold dfsdf Choice",
#     "insurance_member_id": "UHC-55443322",
#     "contacts": [
#       {
#         "phone": "+8801812345678",
#         "email": "rahim.uddin@example.com",
#         "preferred_channel": "phone",
#         "is_opted_out": false
#       }
#     ]
#   },
#   {
#     "external_ecw_id": "ECW-PT-000203",
#     "mrn": "MRN-202403",
#     "name": "Nusrat Jahan",
#     "dob": "1990-03-02",
#     "gender": "Female",
#     "priority": "LOW",
#     "status": "CALL_BACK_LATER",
#     "insurance_payer": "Aetna",
#     "insurance_plan": "Basic Care",
#     "insurance_member_id": "AET-77889900",
#     "contacts": [
#       {
#         "phone": "+8801911224455",
#         "email": "nusrat.jahan@example.com",
#         "preferred_channel": "email",
#         "is_opted_out": true
#       }
#     ]
#   }
# ]""")
# async def bulk_add_patients(payload: List[BulkPatientIn]):
#     created = []
#     updated = []
#     skipped = []

#     CHUNK_SIZE = 100  # 🔥 Adjust if needed (100–300 recommended)

#     for i in range(0, len(payload), CHUNK_SIZE):
#         chunk = payload[i:i + CHUNK_SIZE]

#         async with in_transaction() as conn:

#             for data in chunk:

#                 # ---------------- Check Patient ---------------- #
#                 patient = await Patient.filter(
#                     external_ecw_id=data.external_ecw_id
#                 ).using_db(conn).first()

#                 if patient:
#                     changed = False
#                     fields_to_check = [
#                         "mrn", "name", "dob", "gender",
#                         "priority", "status",
#                         "insurance_payer", "insurance_plan", "insurance_member_id"
#                     ]

#                     for field in fields_to_check:
#                         if getattr(patient, field) != getattr(data, field):
#                             setattr(patient, field, getattr(data, field))
#                             changed = True

#                     if changed:
#                         await patient.save()
#                         updated.append(await serialize_patient(patient))
#                     else:
#                         skipped.append(data.external_ecw_id)

#                 else:
#                     patient = await Patient.create(
#                         external_ecw_id=data.external_ecw_id,
#                         mrn=data.mrn,
#                         name=data.name,
#                         dob=data.dob,
#                         gender=data.gender,
#                         priority=data.priority,
#                         status=data.status,
#                         insurance_payer=data.insurance_payer,
#                         insurance_plan=data.insurance_plan,
#                         insurance_member_id=data.insurance_member_id,
#                         
#                     )
#                     created.append(await serialize_patient(patient))

#                 # ---------------- Contacts ---------------- #
#                 if data.contacts:
#                     await PatientContact.filter(
#                         patient=patient
#                     ).using_db(conn).delete()

#                     contact_objects = [
#                         PatientContact(
#                             patient=patient,
#                             phone=contact.phone,
#                             email=contact.email,
#                             preferred_channel=contact.preferred_channel,
#                             is_opted_out=contact.is_opted_out
#                         )
#                         for contact in data.contacts
#                     ]

#                     await PatientContact.bulk_create(
#                         contact_objects,
#                         
#                     )

#                 # ---------------- Visits ---------------- #
#                 if data.visits:
#                     for visit in data.visits:

#                         provider, _ = await Provider.get_or_create(
#                             external_ecw_id=visit.provider.external_ecw_id,
#                             defaults={
#                                 "name": visit.provider.name,
#                                 "specialty": visit.provider.specialty,
#                             },
#                             
#                         )

#                         await Visit.get_or_create(
#                             external_ecw_id=visit.external_ecw_id,
#                             defaults={
#                                 "patient": patient,
#                                 "provider": provider,
#                                 "visit_type": visit.visit_type,
#                                 "visit_date": visit.visit_date,
#                                 "visit_status": visit.visit_status,
#                                 "visit_note": visit.visit_note,
#                             },
#                             
#                         )

#     return {
#       "status": "success",
#       "created_count": len(created),
#       "updated_count": len(updated),
#       "skipped_count": len(skipped),
#     }





from fastapi import APIRouter, BackgroundTasks
from pydantic import BaseModel
from typing import List, Optional, Dict
from tortoise.transactions import in_transaction
from tortoise.exceptions import OperationalError
from datetime import date
import asyncio

from applications.patient.models import PatientPriority, PatientStatus, PatientContact, Patient, Visit, Provider

router = APIRouter(prefix="/add", tags=["Patients"])

CHUNK_SIZE = 25  # safer for hosted DB connections (Render/MySQL)
MAX_RETRIES = 3
RETRY_DELAY_SECONDS = 2

# ---------------- Pydantic Models ---------------- #
class PatientContactIn(BaseModel):
    phone: Optional[str] = None
    email: Optional[str] = None
    preferred_channel: str
    is_opted_out: bool = False

class ProviderIn(BaseModel):
    external_ecw_id: str
    name: str
    specialty: Optional[str] = None

class VisitIn(BaseModel):
    external_ecw_id: str
    visit_type: Optional[str] = None
    visit_date: Optional[date] = None
    visit_status: Optional[str] = None
    visit_note: Optional[str] = None
    provider: ProviderIn

class BulkPatientIn(BaseModel):
    external_ecw_id: str
    mrn: Optional[str] = None
    name: Optional[str] = None
    dob: Optional[date] = None
    gender: Optional[str] = None
    priority: PatientPriority = PatientPriority.MEDIUM
    status: PatientStatus = PatientStatus.NOT_STARTED
    insurance_payer: Optional[str] = None
    insurance_plan: Optional[str] = None
    insurance_member_id: Optional[str] = None
    contacts: List[PatientContactIn] = []
    visits: List[VisitIn] = []

# ---------------- Core Bulk Processing ---------------- #
async def process_bulk_patients(payload: List[BulkPatientIn]):
    created_count, updated_count, skipped_count = 0, 0, 0
    provider_cache: Dict[str, Provider] = {}

    for i in range(0, len(payload), CHUNK_SIZE):
        chunk = payload[i:i + CHUNK_SIZE]
        for attempt in range(1, MAX_RETRIES + 1):
            try:
                for data in chunk:
                    # ---------------- Patient ---------------- #
                    patient = await Patient.filter(external_ecw_id=data.external_ecw_id).first()
                    if patient:
                        changed = False
                        for field in ["mrn", "name", "dob", "gender", "priority", "status",
                                      "insurance_payer", "insurance_plan", "insurance_member_id"]:
                            if getattr(patient, field) != getattr(data, field):
                                setattr(patient, field, getattr(data, field))
                                changed = True
                        if changed:
                            await patient.save()
                            updated_count += 1
                        else:
                            skipped_count += 1
                    else:
                        patient = await Patient.create(
                            external_ecw_id=data.external_ecw_id,
                            mrn=data.mrn,
                            name=data.name,
                            dob=data.dob,
                            gender=data.gender,
                            priority=data.priority,
                            status=data.status,
                            insurance_payer=data.insurance_payer,
                            insurance_plan=data.insurance_plan,
                            insurance_member_id=data.insurance_member_id,
                            
                        )
                        created_count += 1

                    # ---------------- Contacts ---------------- #
                    if data.contacts:
                        await PatientContact.filter(patient=patient).delete()
                        contact_objects = [
                            PatientContact(
                                patient=patient,
                                phone=c.phone,
                                email=c.email,
                                preferred_channel=c.preferred_channel,
                                is_opted_out=c.is_opted_out
                            )
                            for c in data.contacts
                        ]
                        await PatientContact.bulk_create(contact_objects, )

                    # ---------------- Visits ---------------- #
                    if data.visits:
                        for visit in data.visits:
                            pid = visit.provider.external_ecw_id
                            if pid in provider_cache:
                                provider = provider_cache[pid]
                            else:
                                provider, _ = await Provider.get_or_create(
                                    external_ecw_id=pid,
                                    defaults={"name": visit.provider.name, "specialty": visit.provider.specialty},
                                    
                                )
                                provider_cache[pid] = provider

                            await Visit.get_or_create(
                                external_ecw_id=visit.external_ecw_id,
                                defaults={
                                    "patient": patient,
                                    "provider": provider,
                                    "visit_type": visit.visit_type,
                                    "visit_date": visit.visit_date,
                                    "visit_status": visit.visit_status,
                                    "visit_note": visit.visit_note,
                                },
                                
                            )
            
                break
            except OperationalError as e:
                if attempt == MAX_RETRIES:
                    print(f"Bulk import failed at chunk {i // CHUNK_SIZE + 1}: {e}")
                    raise
                await asyncio.sleep(RETRY_DELAY_SECONDS * attempt)

    print(f"Bulk import finished: created={created_count}, updated={updated_count}, skipped={skipped_count}")



# ---------------- API Endpoint ---------------- #
@router.post("/", description="""[
  {
    "external_ecw_id": "ECW-PT-000201",
    "mrn": "MRN-202401",
    "name": "sdfsdfRahman",
    "dob": "1994-07-18",
    "gender": "male",
    "priority": "MEDIUM",
    "status": "NOT_STARTED",
    "insurance_payer": "Blue Cross Blue Shield",
    "insurance_plan": "Silver Plus",
    "insurance_member_id": "BCBS-88991234",
    "contacts": [
      {
        "phone": "+8801712345678",
        "email": "ayesha.rahman@example.com",
        "preferred_channel": "whatsapp",
        "is_opted_out": false
      },
      {
        "phone": "+8801911223344",
        "preferred_channel": "phone",
        "is_opted_out": true
      }
    ],
    "visits": [
      {
        "external_ecw_id": "ECW-VS-000201",
        "visit_type": "Annual Checkup",
        "visit_date": "2025-11-19",
        "visit_status": "COMPLETED",
        "visit_note": null,
        "provider": {
          "external_ecw_id": "ECW-PV-000201",
          "name": "Larry Burton",
          "specialty": "Pediatrics"
        }
      },
      {
        "external_ecw_id": "ECW-VS-000345",
        "visit_type": "Follow-up",
        "visit_date": "2025-06-01",
        "visit_status": "CANCELED",
        "visit_note": null,
        "provider": {
          "external_ecw_id": "ECW-PV-000201",
          "name": "Larry Burton",
          "specialty": "Pediatrics"
        }
      }
    ]
  },
  {
    "external_ecw_id": "ECW-PT-000202",
    "mrn": "MRN-202402",
    "name": "Rahim Uddin",
    "dob": "1986-11-03",
    "gender": "Male",
    "priority": "HIGH",
    "status": "CONTACTED",
    "insurance_payer": "UnitedHealthcare",
    "insurance_plan": "Gold dfsdf Choice",
    "insurance_member_id": "UHC-55443322",
    "contacts": [
      {
        "phone": "+8801812345678",
        "email": "rahim.uddin@example.com",
        "preferred_channel": "phone",
        "is_opted_out": false
      }
    ]
  },
  {
    "external_ecw_id": "ECW-PT-000203",
    "mrn": "MRN-202403",
    "name": "Nusrat Jahan",
    "dob": "1990-03-02",
    "gender": "Female",
    "priority": "LOW",
    "status": "CALL_BACK_LATER",
    "insurance_payer": "Aetna",
    "insurance_plan": "Basic Care",
    "insurance_member_id": "AET-77889900",
    "contacts": [
      {
        "phone": "+8801911224455",
        "email": "nusrat.jahan@example.com",
        "preferred_channel": "email",
        "is_opted_out": true
      }
    ]
  }
]""")
async def bulk_add_patients_endpoint(payload: List[BulkPatientIn], background_tasks: BackgroundTasks):
    """
    Import patients in background for large datasets (1000+ records)
    """
    background_tasks.add_task(process_bulk_patients, payload)
    return {"status": "processing", "message": "Patient import started in background"}
