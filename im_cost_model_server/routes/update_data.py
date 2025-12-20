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
    "carton_cost_model": {
        "initial": os.getenv("INITIAL_GS_ID_CARTON_COST_MODEL"),
        "update": os.getenv("UPDATE_GS_ID_CARTON_COST_MODEL")
    },
    "corrugate_cost_model":{
        "initial": os.getenv("INITIAL_GS_ID_CORRUGATE_COST_MODEL"),
        "update": os.getenv("UPDATE_GS_ID_CORRUGATE_COST_MODEL")
    },
    "rigid_ebm_cost_model":{
        "initial": os.getenv("INITIAL_GS_ID_RIGIDS_EBD_COST_MODEL"),
        "update": os.getenv("UPDATE_GS_ID_RIGIDS_EBM_COST_MODEL")
    },
    "rigid_isbm1_cost_model":{
        "initial": os.getenv("INITIAL_GS_ID_RIGIDS_ISBM1_COST_MODEL"),
        "update": os.getenv("UPDATE_GS_ID_RIGIDS_ISBM1_COST_MODEL")
    },
    "rigid_isbm2_cost_model":{
        "initial": os.getenv("INITIAL_GS_ID_RIGIDS_ISBM2_COST_MODEL"),
        "update": os.getenv("UPDATE_GS_ID_RIGIDS_ISBM2_COST_MODEL")
    }
    # add more models here
}

@router.post("/update-inputs")
async def update_inputs(request: Request):
    try:
        incoming = await request.json()

        mode = incoming.get("mode")
        model_name = incoming.get("modelName")

        if not mode or mode not in ["fetch", "update"]:
            raise HTTPException(status_code=400, detail="mode must be 'fetch' or 'update'")

        if not model_name or model_name not in SHEET_ID_MAP:
            raise HTTPException(status_code=400, detail=f"Unknown modelName: {model_name}")

        sheet_id = SHEET_ID_MAP[model_name]["initial"] if mode == "fetch" else SHEET_ID_MAP[model_name]["update"]

        incoming["sheetId"] = sheet_id
        incoming.pop("modelName", None)

        # 🔁 CONVERT % → RATIO BEFORE UPDATE
        if mode == "update":
            input_data = incoming.get("inputData", [])
            for item in input_data:
                try:
                    if item.get("unit") == "%" and item.get("value") not in [None, ""]:
                        item["value"] = float(item["value"]) / 100
                except (ValueError, TypeError):
                    pass

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
