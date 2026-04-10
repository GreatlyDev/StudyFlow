# StudyFlow

StudyFlow is a team-built software engineering project focused on helping students manage coursework, plan study time, and prepare for exams with a future-ready AI foundation.

This first scaffold covers:

- user authentication
- schedule management foundation
- a basic dashboard shell
- frontend and backend project structure for team collaboration

## Team-Friendly Structure

```text
StudyFlow/
|-- backend/                  # FastAPI backend
|-- docs/                     # Team workflow and project notes
|-- frontend/                 # React + Vite frontend
|-- .gitignore
`-- README.md
```

## Tech Stack

- Backend: FastAPI, SQLAlchemy, Pydantic
- Database: SQLite
- Frontend: React with Vite
- Auth: JWT

## Getting Started

### 1. Create and activate the virtual environment

From the repo root:

```powershell
py -m venv .venv
.\.venv\Scripts\Activate.ps1
```

If Windows blocks activation scripts, you can still use the virtual environment Python directly:

```powershell
.\.venv\Scripts\python.exe --version
```

### 2. Install backend dependencies

```powershell
.\.venv\Scripts\python.exe -m pip install -r backend\requirements.txt
```

### 3. Install frontend dependencies

```powershell
cd frontend
npm.cmd install
```

### 4. Run the backend

```powershell
cd backend
..\.venv\Scripts\python.exe -m uvicorn app.main:app --reload
```

### 5. Run the frontend

```powershell
cd frontend
npm.cmd run dev
```

## Current Features

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`
- `POST /api/assignments`
- `GET /api/assignments`
- `PUT /api/assignments/{id}`
- `DELETE /api/assignments/{id}`
- `POST /api/courses`
- `GET /api/courses`
- `PUT /api/courses/{id}`
- `DELETE /api/courses/{id}`
- `POST /api/schedules`
- `GET /api/schedules`
- `PUT /api/schedules/{id}`
- `DELETE /api/schedules/{id}`

## Suggested Branch Strategy

Do not work directly on `main`. Suggested feature branches:

- `feature/auth-backend`
- `feature/auth-frontend`
- `feature/schedule-foundation`
- `feature/courses-module`
- `feature/assignments-module`
- `feature/dashboard-improvements`
- `feature/ai-placeholders`

More workflow notes are in [docs/team-workflow.md](docs/team-workflow.md).
