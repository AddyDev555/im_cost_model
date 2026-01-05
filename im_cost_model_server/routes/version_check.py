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
    
    if not email:
        raise HTTPException(status_code=400, detail="Email is required")
    
    user = db.query(User).filter(User.email == email).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    if str(user.version) != VERSION:
        return {
            "status": True,
            "message": "Update required login again for updated version",
        }
    else:
        return {
            "status": False,
            "message": "No update required",
        }