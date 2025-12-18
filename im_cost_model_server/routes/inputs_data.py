from fastapi import APIRouter, HTTPException, Request
import requests
import os
from dotenv import load_dotenv

router = APIRouter()
load_dotenv()

APPSCRIPT_URL = os.getenv("APPSCRIPT_GS_URL")

# Map each model to its initial and update sheet IDs
SHEET_ID_MAP = {
    "im_cost_model": {
        "initial": os.getenv("INITIAL_GS_ID_IM_COST_MODEL"),
        "update": os.getenv("UPDATE_GS_ID_IM_COST_MODEL")
    },
    "carton_cost_model": {
        "initial": os.getenv("INITIAL_GS_ID_CARTON_COST_MODEL"),
        "update": os.getenv("UPDATE_GS_ID_CARTON_COST_MODEL")
    },
    # add more models here
}

@router.post("/get-inputs-data")
async def get_inputs_data(request: Request):
    try:
        payload = await request.json()

        mode = payload.get("mode")  # fetch or update
        model_name = payload.get("modelName")

        if not mode or mode not in ["fetch", "update"]:
            raise HTTPException(status_code=400, detail="mode must be 'fetch' or 'update'")

        if not model_name or model_name not in SHEET_ID_MAP:
            raise HTTPException(status_code=400, detail=f"Unknown modelName: {model_name}")

        # Map mode to correct sheetId
        sheet_id = SHEET_ID_MAP[model_name]["initial"] if mode == "fetch" else SHEET_ID_MAP[model_name]["update"]

        # Inject sheetId into payload for Apps Script
        payload["sheetId"] = sheet_id

        # Optional: remove modelName before sending
        payload.pop("modelName", None)

        # Forward request to Apps Script via POST
        res = requests.post(
            APPSCRIPT_URL,
            json=payload,
            timeout=10
        )
        res.raise_for_status()

        apps_script_response = res.json()

        # Return same structure to frontend
        return {
            "success": True,
            "inputData": apps_script_response.get("inputData", []),
            "summaryData": apps_script_response.get("summaryData", [])
        }

    except requests.RequestException as e:
        raise HTTPException(status_code=500, detail=f"Apps Script error: {e}")

    except HTTPException:
        raise

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))