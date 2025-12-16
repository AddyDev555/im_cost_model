from fastapi import APIRouter, HTTPException
import requests
import os
from dotenv import load_dotenv

router = APIRouter()
load_dotenv()

APPSCRIPT_URL = os.getenv("APPSCRIPT_GS_URL")

@router.get("/get-inputs-data")
async def get_inputs_data():
    try:
        res = requests.get(APPSCRIPT_URL, timeout=10)
        res.raise_for_status()

        payload = res.json()

        # Directly return inputData as-is
        return {
            "success": True,
            "inputData": payload.get("inputData", []),
            "summaryData": payload.get("summaryData", [])  
        }

    except requests.RequestException as e:
        raise HTTPException(status_code=500, detail=f"Apps Script error: {e}")

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))