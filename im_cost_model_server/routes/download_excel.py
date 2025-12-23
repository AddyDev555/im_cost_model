from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from .update_data import SHEET_ID_MAP

router = APIRouter()


class DownloadRequest(BaseModel):
    sheetName: str          # e.g. "im_cost_model"
    mode: str = "update"   # "initial" or "update"


@router.post("/get_sheetId")
def download_excel(payload: DownloadRequest):
    sheet_name = payload.sheetName
    mode = payload.mode

    # 1️⃣ Validate sheet name
    if sheet_name not in SHEET_ID_MAP:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid sheetName: {sheet_name}"
        )

    # 2️⃣ Validate mode
    if mode not in SHEET_ID_MAP[sheet_name]:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid mode '{mode}' for sheet '{sheet_name}'"
        )

    sheet_id = SHEET_ID_MAP[sheet_name][mode]

    # 3️⃣ Validate env variable exists
    if not sheet_id:
        raise HTTPException(
            status_code=500,
            detail=f"Sheet ID not configured for {sheet_name} ({mode})"
        )

    return {
        "sheetName": sheet_name,
        "mode": mode,
        "sheetId": sheet_id
    }