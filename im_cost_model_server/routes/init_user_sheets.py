from fastapi import APIRouter, Request
from dotenv import load_dotenv
import os
import requests
from .inputs_data import SHEET_ID_MAP

router = APIRouter()
load_dotenv()

APPSCRIPT_URL = os.getenv("APPSCRIPT_GS_URL")

@router.post("/init-sheets")
async def init_sheets(request: Request):
    try:
        incoming = await request.json()

        if incoming.get("mode") != "init":
            return {"error": "Invalid mode"}

        if "email" not in incoming:
            return {"error": "email is required"}

        sheets_payload = []

        for model_name, data in SHEET_ID_MAP.items():
            sheet_ids = []

            # Collect ALL keys that start with "sheetId"
            for key, value in data.items():
                if key.lower().startswith("sheetid") and value:
                    sheet_ids.append(value)

            if sheet_ids:
                sheets_payload.append({
                    "modelName": model_name,
                    "sheetIds": sheet_ids
                })

        incoming["sheets"] = sheets_payload

        res = requests.post(
            APPSCRIPT_URL,
            json=incoming,
            headers={"Content-Type": "application/json"},
            timeout=20
        )

        return res.json()

    except Exception as e:
        return {"error": str(e)}
