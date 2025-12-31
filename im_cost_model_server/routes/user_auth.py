from fastapi import APIRouter, HTTPException, Depends
from utils.magicLink import send_magic_link
from utils.verifyMagicToken import generate_magic_token, verify_magic_token
from utils.database import SessionLocal
from utils.models import User
from sqlalchemy.orm import Session

router = APIRouter()

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
def verify(
    data: dict,
    db: Session = Depends(get_db)
):
    token = data.get("token")
    if not token:
        raise HTTPException(status_code=400, detail="Token required")

    try:
        email = verify_magic_token(token)

        user = db.query(User).filter(User.email == email).first()
        if not user:
            user = User(email=email)
            db.add(user)
            db.commit()
            db.refresh(user)

        return {
            "success": True,
            "email": email
        }

    except Exception:
        raise HTTPException(status_code=400, detail="Invalid or expired link")