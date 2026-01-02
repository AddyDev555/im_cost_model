from fastapi import APIRouter, Request, Depends, HTTPException
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session

from utils.database import SessionLocal
from utils.models import Note

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.get("/get-notes")
def get_notes(username: str, db: Session = Depends(get_db)):
    try:
        notes = (
            db.query(Note)
            .filter(Note.username == username)
            .all()
        )

        return {
            "username": username,
            "notes": [
                {
                    "id": note.id,
                    "content": note.content
                }
                for note in notes
            ]
        }
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})

@router.post("/update-notes")
async def update_notes(request: Request, db: Session = Depends(get_db)):
    try:
        payload = await request.json()

        username = payload.get("email")
        notes = payload.get("notes", [])

        if not username or not isinstance(notes, list):
            raise HTTPException(status_code=400, detail="Invalid payload")

        # Delete existing notes for this user
        db.query(Note).filter(Note.username == username).delete()

        # Insert new notes
        for note in notes:
            db_note = Note(
                username=username,
                content=note.get("content", "")
            )
            db.add(db_note)

        db.commit()

        return {
            "success": True,
            "message": "Notes updated successfully"
        }

    except HTTPException as e:
        raise e
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})