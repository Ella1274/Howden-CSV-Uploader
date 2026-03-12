from fastapi import FastAPI, UploadFile, File, Form
import pandas as pd
from validator import validate_loc_file
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict
import logging

# Configure logging
logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s")

app = FastAPI()

# Allow React frontend to access FastAPI
origins = [
    "http://localhost:3000"  # React dev server
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,       # allowed origins
    allow_credentials=True,
    allow_methods=["*"],         # GET, POST, etc.
    allow_headers=["*"],         # Allow all headers
)

@app.post("/upload")
async def upload_files(
    portfolio_name: str = Form(...),
    loc_file: UploadFile = File(...),
    acc_file: UploadFile = File(...)
):

    if not loc_file or not acc_file:
        return {"status": "error", "message": "Both Loc and Acc files must be uploaded together."}

    try:
        loc_df = pd.read_csv(loc_file.file)
        acc_df = pd.read_csv(acc_file.file)

        errors = validate_loc_file(loc_df)

        if errors:
            return {"status": "error", "errors": errors}

        logging.info(f"Files uploaded successfully for portfolio '{portfolio_name}'")
        return {
            "status": "success",
            "message": "Files uploaded successfully",
            "portfolio": portfolio_name,
            "loc_rows": len(loc_df),
            "acc_rows": len(acc_df)
        }

    except Exception as e:
        logging.error(f"Error uploading files for portfolio '{portfolio_name}': {e}")
        return {"status": "error", "message": str(e)}

class UploadJSONRequest(BaseModel):
    portfolio_name: str
    loc_data: List[Dict]
    acc_data: List[Dict]

@app.post("/upload_json")
async def upload_json(data: UploadJSONRequest):
    if not data.loc_data or not data.acc_data:
        return {"status": "error", "message": "Both Loc and Acc data must be submitted together."}

    try:
        # Convert JSON data to DataFrames
        loc_df = pd.DataFrame(data.loc_data)
        acc_df = pd.DataFrame(data.acc_data)

         # Convert numeric columns to the correct type
        if "OCCTYPE" in loc_df.columns:
            loc_df["OCCTYPE"] = pd.to_numeric(loc_df["OCCTYPE"], errors="coerce")
        if "LATITUDE" in loc_df.columns:
            loc_df["LATITUDE"] = pd.to_numeric(loc_df["LATITUDE"], errors="coerce")
        if "LONGITUDE" in loc_df.columns:
            loc_df["LONGITUDE"] = pd.to_numeric(loc_df["LONGITUDE"], errors="coerce")

        # Run existing validation
        errors = validate_loc_file(loc_df)

        if errors:
            return {"status": "error", "errors": errors}

        logging.info(f"Files uploaded successfully for portfolio '{data.portfolio_name}'")
        return {
            "status": "success",
            "message": "Data uploaded successfully",
            "portfolio": data.portfolio_name,
            "loc_rows": len(loc_df),
            "acc_rows": len(acc_df)
        }

    except Exception as e:
        logging.error(f"Error uploading edited data for portfolio '{data.portfolio_name}': {e}")
        return {"status": "error", "message": str(e)}

@app.get("/")
async def root():
    return {"message": "FastAPI backend is running"}