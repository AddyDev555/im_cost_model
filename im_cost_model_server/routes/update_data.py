from fastapi import APIRouter, Request, HTTPException
from dotenv import load_dotenv
import os
import requests

router = APIRouter()
load_dotenv()

APPSCRIPT_URL_POST = os.getenv("APPSCRIPT_GS_URL")

# Map each model to its initial and update sheet IDs
SHEET_ID_MAP = {
    "im_cost_model": {
        "initial": os.getenv("INITIAL_GS_ID_IM_COST_MODEL"),
        "update": os.getenv("UPDATE_GS_ID_IM_COST_MODEL")
    },
    "model_2": {
        "initial": os.getenv("GS_ID_1_MODEL_2"),
        "update": os.getenv("GS_ID_2_MODEL_2")
    },
    # add more models here
}

@router.post("/update-inputs")
async def update_inputs(request: Request):
    try:
        # 1️⃣ Read payload from frontend
        incoming = await request.json()

        mode = incoming.get("mode")
        model_name = incoming.get("modelName")

        if not mode or mode not in ["fetch", "update"]:
            raise HTTPException(status_code=400, detail="mode must be 'fetch' or 'update'")

        if not model_name or model_name not in SHEET_ID_MAP:
            raise HTTPException(status_code=400, detail=f"Unknown modelName: {model_name}")

        # Map mode to correct sheetId
        sheet_id = SHEET_ID_MAP[model_name]["initial"] if mode == "fetch" else SHEET_ID_MAP[model_name]["update"]

        # Inject sheetId into payload
        incoming["sheetId"] = sheet_id
        incoming.pop("modelName", None)  # Optional: remove modelName

        # 2️⃣ Forward payload to Apps Script
        res = requests.post(
            APPSCRIPT_URL_POST,
            json=incoming,
            headers={"Content-Type": "application/json"},
            timeout=30
        )

        gs_response = res.json()

        # 3️⃣ Return EXACT Apps Script response
        return gs_response

    except requests.exceptions.Timeout:
        return {
            "success": False,
            "error": "Apps Script request timed out"
        }

    except requests.exceptions.RequestException as e:
        return {
            "success": False,
            "error": "Apps Script request failed",
            "details": str(e)
        }

    except HTTPException:
        raise

    except Exception as e:
        return {
            "success": False,
            "error": "Server error",
            "details": str(e)
        }
