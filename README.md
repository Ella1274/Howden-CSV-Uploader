# Howden-CSV-Uploader

Small web application allowing users to upload two CSV files and validate them.

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

python -m venv venv
source venv/scripts/activate

pip install -r requirements.txt

uvicorn main:app --reload

Backend runs on:
http://127.0.0.1:8000

---

### Frontend

cd frontend

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