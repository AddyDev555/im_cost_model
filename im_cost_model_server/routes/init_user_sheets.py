from fastapi import APIRouter, Request
from dotenv import load_dotenv
import os
import requests

router = APIRouter()
load_dotenv()

APPSCRIPT_URL = os.getenv("APPSCRIPT_GS_URL")

@router.post("/init-sheets")
async def update_inputs(request: Request):
    try:
        incoming = await request.json()

        res = requests.post(
            APPSCRIPT_URL,
            json=incoming,
            headers={"Content-Type": "application/json"},
        )
        
        print(res.json())
        return res.json()

    except Exception as e:
        return {"error": str(e)}