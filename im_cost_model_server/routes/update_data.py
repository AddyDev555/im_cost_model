from fastapi import APIRouter, Request
from dotenv import load_dotenv
import os
import requests

router = APIRouter()
load_dotenv()

APPSCRIPT_URL_POST = os.getenv("APPSCRIPT_GS_URL")


@router.post("/update-inputs")
async def update_material_cost_inputs(request: Request):
    try:
        # Read JSON from frontend
        incoming = await request.json()

        # Always force mode = "update"
        incoming["mode"] = "update"

        # Send to Apps Script
        res = requests.post(APPSCRIPT_URL_POST, json=incoming)
        full = res.json()

        # Extract data
        data = full.get("data", {})

        # Convert ratios to percentage
        def to_percentage(value):
            if value is None or value == "":
                return value
            try:
                return float(value) * 100
            except (ValueError, TypeError):
                return value

        # Convert *_per keys to %
        for key, value in data.items():
            if key.endswith("_per"):
                data[key] = to_percentage(value)

        return {
            "success": True,
            "data": data
        }

    except Exception as e:
        return {"error": str(e)}