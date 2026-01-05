from fastapi import APIRouter, HTTPException, Depends
from utils.database import SessionLocal
from utils.models import User
from sqlalchemy.orm import Session
from dotenv import load_dotenv
import os

router = APIRouter()
load_dotenv()

VERSION = os.getenv("VERSION")

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/version-check")
def version_check(
    data: dict,
    db: Session = Depends(get_db)
):
    email = data.get("email")

    if not isinstance(email, str) or not email.strip():
        raise HTTPException(status_code=400, detail="Email is required")

    user = db.query(User).filter(User.email == email).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    user_version = str(user.version)
    backend_version = str(VERSION)

    update_required = user_version != backend_version

    return {
        "update_required": update_required,
        "current_version": user_version,
        "latest_version": backend_version,
        "message": "Update required. Please login again." if update_required else ""
    }
