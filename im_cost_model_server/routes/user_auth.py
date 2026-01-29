from fastapi import APIRouter, HTTPException, Depends
from utils.magicLink import send_magic_link
from utils.verifyMagicToken import generate_magic_token, verify_magic_token
from utils.database import SessionLocal
from utils.models import User
from sqlalchemy.orm import Session
import os
from dotenv import load_dotenv

router = APIRouter()
load_dotenv()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.post("/send-magic-link")
def send_link(data: dict):
    email = data.get("email")
    if not email:
        raise HTTPException(status_code=400, detail="Email is required")

    token = generate_magic_token(email)
    send_magic_link(email, token)

    return {"message": "Magic link sent"}


@router.post("/verify")
def verify(data: dict, db: Session = Depends(get_db)):
    token = data.get("token")
    email = data.get("email")
    password = data.get("password")

    try:
        # 🔐 CASE 1: MAGIC LINK AUTH
        if token:
            email_from_token = verify_magic_token(token)

            user = db.query(User).filter(User.email == email_from_token).first()
            if not user:
                user = User(email=email_from_token, version=1)
                db.add(user)
                db.commit()
                db.refresh(user)

            return {
                "success": True,
                "auth_type": "magic_link",
                "email": email_from_token
            }

        # 🔑 CASE 2: EMAIL + PASSWORD AUTH
        if not email or not password:
            raise HTTPException(
                status_code=400,
                detail="Email and password are required"
            )

        user = db.query(User).filter(User.email == email).first()
        print(user.email)
        if not user:
            raise HTTPException(status_code=401, detail="Invalid credentials")

        return {
            "success": True,
            "auth_type": "password",
            "email": email
        }

    except HTTPException:
        raise
    except Exception as e:
        print("Auth error:", str(e))
        raise HTTPException(status_code=400, detail="Authentication failed")