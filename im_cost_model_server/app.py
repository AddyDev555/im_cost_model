from fastapi import FastAPI
import uvicorn
from routes.material_cost import router as material_cost_calculator
from fastapi.middleware.cors import CORSMiddleware
from routes.sku_data import router as sku_data_router
from routes.conversion_cost import router as conversion_cost_router

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
app.include_router(sku_data_router, prefix="/api/sku", tags=["SKU Data"])
app.include_router(conversion_cost_router, prefix="/api/conversion", tags=["Conversion Cost"])

# The uvicorn.run() is great for development.
# For production, consider using a process manager like Gunicorn:
# gunicorn -w 4 -k uvicorn.workers.UvicornWorker app:app
if __name__ == "__main__":
    uvicorn.run(app, host="127.0.0.1", port=8000)