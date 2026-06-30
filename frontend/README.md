# Inventory Frontend

React + TypeScript + Vite frontend for the FastAPI inventory backend.

## Setup

Install dependencies:

```bash
npm install
```

Create or update `frontend/.env`:

```env
VITE_API_URL=http://localhost:8000
```

The frontend uses `VITE_API_URL` for product API requests. Make sure the FastAPI backend is running on the same URL, or update the value to match your backend host.

## Development

Start the Vite dev server:

```bash
npm run dev
```

By default, Vite serves the app at `http://localhost:5173`.

## Build

Create a production build:

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```
