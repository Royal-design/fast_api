# FastAPI Inventory App

A full-stack inventory app with a FastAPI backend, PostgreSQL database, and React + TypeScript + Vite frontend.

## Project Structure

```text
backend/    FastAPI API, SQLAlchemy models, database config
frontend/   React inventory UI
```

## Environment Files

Backend environment:

```text
backend/.env
```

Example:

```env
DATABASE_URL=postgresql+psycopg://postgres:password@localhost:5432/fast_api
ALLOWED_ORIGINS=http://localhost:5173,http://127.0.0.1:5173
```

Frontend environment:

```text
frontend/.env
```

Example:

```env
VITE_API_URL=http://localhost:8000
```

Both `.env` files are ignored by git.

## Backend Setup

From the project root:

```bash
cd backend
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
```

Create `backend/.env` from `backend/.env.example`, then update `DATABASE_URL` for your local PostgreSQL database.

Start the API:

```bash
python -m uvicorn main:app --reload
```

The backend runs at `http://localhost:8000`.

## Frontend Setup

From the project root:

```bash
cd frontend
npm install
npm run dev
```

The frontend runs at `http://localhost:5173`.

See [frontend/README.md](frontend/README.md) for frontend-specific details.

## API Routes

```text
GET     /products
GET     /products/{id}
POST    /product
PUT     /products/{id}
DELETE  /products/{id}
```

## Production Build

Build the frontend:

```bash
cd frontend
npm run build
```

The backend deployment config is in `render.yaml`.
