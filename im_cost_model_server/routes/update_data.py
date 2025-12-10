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
        # Read JSON body coming from React
        incoming = await request.json()

        # Send this data to the Google Apps Script as POST
        res = requests.post(APPSCRIPT_URL_POST, json=incoming)
        full = res.json()

        # Extract appscript response
        data = full.get("data", {})
        
        def to_percentage(value):
            """Converts a ratio to a percentage if it's a number, otherwise returns it as is."""
            if value is None or value == '':
                return value
            try:
                return float(value) * 100
            except (ValueError, TypeError):
                return value
        
        # print("AppScript Response: ", full)
        
        for key, value in data.items():
            if key.endswith("_per"):
                data[key] = to_percentage(value)

        return {
            "success": True,
            "data": data
        }

    except Exception as e:
        return {"error": str(e)}