from fastapi import APIRouter, Request
from fastapi.responses import JSONResponse
import os
import json

router = APIRouter()

# Path for the notes file, assuming it's in the same directory as app.py
NOTES_FILE = r'./data.json'

@router.get("/get-notes")
def get_notes():
    try:
        if not os.path.exists(NOTES_FILE):
            # If the file doesn't exist, return an empty notes array
            return {"notes": []}
        with open(NOTES_FILE, "r") as f:
            data = json.load(f)
        return {"notes": data.get("notes", [])}
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})

@router.post("/update-notes")
async def update_notes(request: Request):
    try:
        # Get the JSON data from the request body
        new_notes_data = await request.json()
        
        # Read existing data from the file
        if os.path.exists(NOTES_FILE):
            with open(NOTES_FILE, "r") as f:
                data = json.load(f)
        else:
            data = {}

        # Update only the 'notes' part of the data
        data["notes"] = new_notes_data.get("notes", [])

        with open(NOTES_FILE, "w") as f:
            json.dump(data, f, indent=4)
        return {"success": True, "message": "Notes updated successfully."}
    except json.JSONDecodeError:
        return JSONResponse(status_code=400, content={"error": "Invalid JSON format."})
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})
