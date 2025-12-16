from fastapi import APIRouter, Request
from dotenv import load_dotenv
import os
import requests

router = APIRouter()
load_dotenv()

APPSCRIPT_URL_POST = os.getenv("APPSCRIPT_GS_URL")


@router.post("/update-inputs")
async def update_inputs(request: Request):
    try:
        # 1️⃣ Read payload from frontend
        incoming = await request.json()
        print("Incoming payload:", incoming)

        # 2️⃣ Forward payload to Apps Script
        res = requests.post(
            APPSCRIPT_URL_POST,
            json=incoming,
            headers={"Content-Type": "application/json"},
            timeout=30
        )

        # Do NOT raise yet — Apps Script may return 200 with success:false
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

    except Exception as e:
        return {
            "success": False,
            "error": "Server error",
            "details": str(e)
        }
