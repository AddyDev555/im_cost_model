from fastapi import FastAPI
import uvicorn
from routes.material_cost import router as material_cost_calculator
from fastapi.middleware.cors import CORSMiddleware
from routes.inputs_data import router as inputs_data_router
from routes.update_data import router as update_data_router
from routes.note import router as note_router
from routes.download_excel import router as download_excel_router
from routes.user_auth import router as user_auth_router
from routes.init_user_sheets import router as init_user_sheets_router
from utils.database import engine
from utils.models import Base

Base.metadata.create_all(bind=engine)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000", # Example for a local React frontend
        "http://127.0.0.1:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],          # Allows all methods
    allow_headers=["*"],          # Allows all headers
)

app.include_router(material_cost_calculator, prefix="/api/material", tags=["Material Cost"])
app.include_router(inputs_data_router, prefix="/api/inputs", tags=["Inputs Data"])
app.include_router(update_data_router, prefix="/api/updates", tags=["Updates Data"])
app.include_router(note_router, prefix="/api/notes", tags=["Notes"])
app.include_router(download_excel_router, prefix="/api/download", tags=["Download Excel"])
app.include_router(user_auth_router, prefix="/api/auth", tags=["User Auth"])
app.include_router(init_user_sheets_router, prefix="/api/init", tags=["Init User Sheets"])

# The uvicorn.run() is great for development.
# For production, consider using a process manager like Gunicorn:
# gunicorn -w 4 -k uvicorn.workers.UvicornWorker app:app
if __name__ == "__main__":
    uvicorn.run(app, host="127.0.0.1", port=8000)