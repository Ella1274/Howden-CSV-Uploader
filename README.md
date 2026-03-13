# Howden-CSV-Uploader

Small web application allowing users to upload, preview and edit two CSV files and validate them.

## Tech Stack

Frontend
- React
- Axios
- PapaParse

Backend
- FastAPI
- Pandas

## Setup

### Backend

cd backend

Delete venv 

Create new venv:
py -3.12 -m venv venv

May need to bypss using:  Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass

source venv/scripts/activate

pip install -r requirements.txt

uvicorn main:app --reload

Backend runs on:
http://127.0.0.1:8000

---

### Frontend

cd frontend

May need to Bypass using:  Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass

npm install

npm start

Frontend runs on:
http://localhost:3000

---

## Features

- Upload Test_Loc.csv
- Upload Test_Acc.csv
- Enter Portfolio Name
- Preview first 5 rows
- Client-side validation
- Editable table
- Backend validation
- Error reporting
