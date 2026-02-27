from fastapi import APIRouter, UploadFile, File, HTTPException
from uuid import uuid4
from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from datetime import date
import pandas as pd
import io

from applications.patient.models import (
    PatientPriority,
    PatientStatus,
    PatientContact,
    Patient, VisitStatus,
)
from routes.patient.get import serialize_patient


# ---------------- Pydantic Models ---------------- #
class ProviderIn(BaseModel):
    external_ecw_id: str
    name: str
    specialty: Optional[str] = None


class VisitIn(BaseModel):
    external_ecw_id: str
    visit_type: Optional[str] = None
    visit_date: date
    visit_status: VisitStatus = VisitStatus.COMPLETED
    visit_note: Optional[str] = None
    provider: ProviderIn

class PatientContactIn(BaseModel):
    phone: Optional[str] = None
    email: Optional[str] = None
    preferred_channel: str
    is_opted_out: bool = False


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
    contacts: List[PatientContactIn] = Field(default_factory=list)
    visits: List[VisitIn] = Field(default_factory=list)


# ---------------- Router ---------------- #

router = APIRouter(prefix="/add", tags=["Patients File"])


# ---------------- Helper ---------------- #

def clean_nan(value):
    if pd.isna(value):
        return None
    return value

def as_text(value):
    value = clean_nan(value)
    if value is None:
        return None
    return str(value).strip()

def parse_date(value):
    if not value:
        return None
    parsed = pd.to_datetime(value, errors="coerce")
    return parsed.date() if pd.notnull(parsed) else None


def is_empty_row(row: pd.Series) -> bool:
    for value in row.values:
        cleaned = clean_nan(value)
        if cleaned is None:
            continue
        if isinstance(cleaned, str) and cleaned.strip() == "":
            continue
        return False
    return True


def normalize_visit_status(value):
    if not value:
        return VisitStatus.COMPLETED

    value = str(value).upper().strip()

    # Extract code before colon
    if ":" in value:
        value = value.split(":")[0].strip()

    status_mapping = {
        "PEN": VisitStatus.PENDING,
        "CON1MTH": VisitStatus.COMPLETED,
        "CON2WKS": VisitStatus.COMPLETED,
    }

    return status_mapping.get(value, VisitStatus.COMPLETED)


# ---------------- Excel Conversion ---------------- #
def convert_dataframe_to_json(df: pd.DataFrame, patient_id=None) -> List[Dict[str, Any]]:
    results = []

    # Remove hidden spaces from headers
    df.columns = df.columns.str.strip()

    for _, row in df.iterrows():
        if is_empty_row(row):
            continue

        dob_value = clean_nan(row.get("Patient DOB"))
        if dob_value:
            dob_value = pd.to_datetime(dob_value, errors="coerce")
            dob = dob_value.strftime("%Y-%m-%d") if pd.notnull(dob_value) else None
        else:
            dob = None

        patient = {
            "external_ecw_id": as_text(row.get("Patient ID")) or str(uuid4()),
            "mrn": as_text(row.get("MRN")),
            "name": as_text(row.get("Patient Name")),
            "dob": dob,
            "gender": (
                as_text(row.get("Patient Gender")).lower()
                if clean_nan(row.get("Patient Gender"))
                else None
            ),
            "priority": "MEDIUM",
            "status": "NOT_STARTED",
            "insurance_payer": as_text(row.get("Primary Insurance Name")),
            "insurance_plan": as_text(row.get("Primary Insurance Plan Name")),
            "insurance_member_id": as_text(row.get("Primary Insurance Member ID")),
            "contacts": [],
            "visits": [],
        }

        # Home phone
        home_phone = clean_nan(row.get("Patient Home Phone"))
        if home_phone:
            patient["contacts"].append({
                "phone": as_text(home_phone),
                "email": as_text(row.get("Patient Email")),
                "preferred_channel": "phone",
                "is_opted_out": False,
            })

        # Cell phone
        cell_phone = clean_nan(row.get("Patient Cell Phone"))
        if cell_phone:
            patient["contacts"].append({
                "phone": as_text(cell_phone),
                "email": as_text(row.get("Patient Email")),
                "preferred_channel": "phone",
                "is_opted_out": False,
            })

        visit_id = as_text(row.get("Visit Type"))

        if visit_id:
            visit = {
                "external_ecw_id": visit_id or str(uuid4()),
                "visit_type": as_text(row.get("Visit Type")),
                "visit_date": parse_date(clean_nan(row.get("Appointment Date"))),
                "visit_status": normalize_visit_status(
                    clean_nan(row.get("Visit Status"))
                ),
                # "visit_status": clean_nan(row.get("Visit Status")),
                "visit_note": as_text(row.get("Visit Note")),
                "provider": {
                    "external_ecw_id": as_text(row.get("Provider ID")) or str(uuid4()),
                    "name": as_text(row.get("Appointment Provider Name")),
                    "specialty": as_text(row.get("Provider Specialty")),
                },
            }

            patient["visits"].append(visit)

        results.append(patient)

    return results


# ---------------- Upload Excel Endpoint ---------------- #

@router.post("/upload-excel")
async def upload_excel(file: UploadFile = File(...)):

    if not file.filename.endswith(".xlsx"):
        raise HTTPException(status_code=400, detail="Only .xlsx files allowed")

    try:
        contents = await file.read()

        df = pd.read_excel(
            io.BytesIO(contents),
            engine="openpyxl",
            header=7
        )

        # Convert NaN to None globally
        df = df.where(pd.notnull(df), None)

        data = convert_dataframe_to_json(df)

    except Exception as e:
        raise HTTPException(
            status_code=400,
            detail=f"Excel parsing failed: {str(e)}",
        )
    return data
