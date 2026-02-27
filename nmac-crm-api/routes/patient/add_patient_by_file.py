from fastapi import APIRouter, UploadFile, File, HTTPException, BackgroundTasks
import pandas as pd
import io

from routes.patient.add import BulkPatientIn, process_bulk_patients
from routes.patient.upload_patient_file import convert_dataframe_to_json


router = APIRouter(prefix="/add", tags=["Patients File"])


@router.post("/upload-file-save")
async def add_patient_by_file(background_tasks: BackgroundTasks, file: UploadFile = File(...)):
    if not file.filename.endswith(".xlsx"):
        raise HTTPException(status_code=400, detail="Only .xlsx files allowed")

    try:
        contents = await file.read()
        df = pd.read_excel(io.BytesIO(contents), engine="openpyxl", header=7)
        df = df.where(pd.notnull(df), None)

        data = convert_dataframe_to_json(df)
        payload = [BulkPatientIn(**item) for item in data]
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"File parsing/validation failed: {str(e)}")

    background_tasks.add_task(process_bulk_patients, payload)
    return {
        "status": "processing",
        "message": "Patient file import started in background",
        "records_received": len(payload),
    }
