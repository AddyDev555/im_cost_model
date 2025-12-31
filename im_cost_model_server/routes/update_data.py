from fastapi import APIRouter, Request, HTTPException
from dotenv import load_dotenv
import os
import requests
from sqlalchemy.orm import Session
from fastapi import Depends
from utils.database import SessionLocal
from utils.models import User

router = APIRouter()
load_dotenv()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


APPSCRIPT_URL_POST = os.getenv("APPSCRIPT_GS_URL")

@router.post("/update-inputs")
async def update_inputs(
    request: Request,
    db: Session = Depends(get_db)
):
    try:
        incoming = await request.json()

        mode = incoming.get("mode")
        model_name = incoming.get("modelName")
        email = incoming.get("email")

        if mode not in ["fetch", "update"]:
            raise HTTPException(
                status_code=400,
                detail="mode must be 'fetch' or 'update'"
            )

        if not model_name:
            raise HTTPException(
                status_code=400,
                detail="modelName is required"
            )

        # 🔐 AUTH CHECK (ONLY FOR UPDATE)
        if mode == "update":
            if not email:
                raise HTTPException(
                    status_code=401,
                    detail="Login required to calculate"
                )

            user = db.query(User).filter(User.email == email).first()
            if not user:
                raise HTTPException(
                    status_code=401,
                    detail="Login required to calculate"
                )

            # 🔁 % → ratio conversion
            input_data = incoming.get("inputData", [])
            for item in input_data:
                try:
                    if item.get("unit") == "%" and item.get("value") not in [None, ""]:
                        item["value"] = float(item["value"]) / 100
                except (ValueError, TypeError):
                    pass

        # 🔁 Forward request as-is to Apps Script
        res = requests.post(
            APPSCRIPT_URL_POST,
            json=incoming,
            headers={"Content-Type": "application/json"},
            timeout=30
        )

        return res.json()

    except HTTPException:
        raise

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
