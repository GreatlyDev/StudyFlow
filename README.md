# StudyFlow

**AI Study Optimization Platform for students who want one organized place for classes, deadlines, study materials, flashcards, quizzes, reminders, and study planning.**

<p>
  <img alt="FastAPI" src="https://img.shields.io/badge/FastAPI-Backend-00A884?style=for-the-badge&logo=fastapi&logoColor=white&labelColor=007F67">
  <img alt="React" src="https://img.shields.io/badge/React-Frontend-61DAFB?style=for-the-badge&logo=react&logoColor=061B24&labelColor=149ECA">
  <img alt="Vite" src="https://img.shields.io/badge/Vite-Build_Tool-FFD62E?style=for-the-badge&logo=vite&logoColor=111827&labelColor=646CFF">
  <img alt="SQLite" src="https://img.shields.io/badge/SQLite-Database-2F80ED?style=for-the-badge&logo=sqlite&logoColor=white&labelColor=003B57">
  <img alt="JWT" src="https://img.shields.io/badge/JWT-Authentication-F97316?style=for-the-badge&logo=jsonwebtokens&logoColor=white&labelColor=DC2626">
  <img alt="OpenAI" src="https://img.shields.io/badge/OpenAI-AI_Assistant-10A37F?style=for-the-badge&logo=openai&logoColor=white&labelColor=412991">
</p>

StudyFlow is a team-built COSC 458 software engineering project. The prototype helps students create an account, organize coursework, schedule study time, save study materials, generate flashcards, practice with quizzes, and receive simple AI-supported study recommendations.

## Prototype Status

This repository is now in a presentation-ready prototype state. It is not a production deployment, but it demonstrates the major user flow for the class presentation:

1. Create an account or log in.
2. Add courses and assignments.
3. Create study schedule items.
4. Add reminders and receive browser alerts while the app is open.
5. Save study materials.
6. Generate flashcards from starter topics or saved materials.
7. Study flashcard sets and take practice quizzes.
8. View dashboard recommendations and convert AI suggestions into schedule items.

## Feature Snapshot

| Area | What Works Now |
| --- | --- |
| Account Management | Register, login, JWT-protected routes, current-user session, forgot/reset password demo flow |
| Courses | Create, view, edit, and delete courses |
| Assignments | Create, view, edit, and delete assignments linked to courses |
| Study Schedule | Create, view, edit, and delete study blocks with improved time dropdowns |
| Dashboard | Shows real user data, upcoming reminders, study blocks, counts, and AI recommendation cards |
| Reminders | Create reminders, link them to assignments/schedules, and receive in-app browser alerts |
| Study Materials | Save notes/materials that can support flashcard generation |
| Flashcards | Manual flashcards, AI/starter-topic generated cards, grouped study sets, study mode |
| Practice Quizzes | Quiz yourself from one selected flashcard set, track score, and review missed cards |
| AI Foundation | OpenAI-backed recommendations/flashcard support with graceful prototype structure |

## Team-Friendly Structure

```text
StudyFlow/
|-- backend/                  # FastAPI backend, SQLAlchemy models, routes, services
|-- docs/                     # Team workflow, project status, and presentation guide
|-- frontend/                 # React + Vite frontend
|-- .gitignore                # Keeps venv, node_modules, local DB, and secrets out of Git
`-- README.md
```

## Tech Stack

| Layer | Tools |
| --- | --- |
| Frontend | React, Vite, React Router, CSS |
| Backend | FastAPI, SQLAlchemy, Pydantic |
| Database | SQLite for the prototype |
| Auth | JWT tokens and password hashing |
| AI | OpenAI API through backend environment variables |
| Collaboration | GitHub branches, pull requests, Trello Kanban board |

## Running Locally

These commands assume Windows PowerShell or Git Bash from the cloned repository.

### 1. Create and activate the virtual environment

From the repo root:

```powershell
py -m venv .venv
.\.venv\Scripts\Activate.ps1
```

If Windows blocks activation scripts, use the virtual environment Python directly:

```powershell
.\.venv\Scripts\python.exe --version
```

### 2. Install backend dependencies

```powershell
.\.venv\Scripts\python.exe -m pip install -r backend\requirements.txt
```

### 3. Create the backend environment file

Copy `backend\.env.example` into a new local file named `backend\.env`.

```powershell
Copy-Item backend\.env.example backend\.env
```

Then edit `backend\.env`.

```env
SECRET_KEY=change-this-before-production
FRONTEND_URL=http://127.0.0.1:5173
DATABASE_URL=sqlite:///backend/studyflow.db
OPENAI_API_KEY=your-local-openai-key-here
OPENAI_MODEL=gpt-5.4-mini
```

Important: do not commit `backend\.env`. It is intentionally ignored by Git.

### 4. Install frontend dependencies

```powershell
cd frontend
npm.cmd install
```

### 5. Run the backend

Open one terminal:

```powershell
cd C:\Users\great\Documents\Playground\StudyFlow\backend
..\.venv\Scripts\python.exe -m uvicorn app.main:app --host 127.0.0.1 --port 8000
```

### 6. Run the frontend

Open a second terminal:

```powershell
cd C:\Users\great\Documents\Playground\StudyFlow\frontend
npm.cmd run dev -- --host 127.0.0.1 --port 5173
```

Then open:

```text
http://127.0.0.1:5173
```

## OpenAI Key on Another Laptop

Yes, to demo the OpenAI-backed parts on another laptop, that laptop also needs its own local `backend\.env` file with `OPENAI_API_KEY` filled in. The key should never be pushed to GitHub.

If no key is provided, the regular app still runs, but AI-backed recommendations/generation may fall back or fail depending on the route being used. For the presentation laptop, set the key before demo time.

## Demo Flow Recommendation

For the final presentation, keep the demo focused and smooth:

1. Show the landing/login page.
2. Log in with a prepared demo user.
3. Show the dashboard and explain that it summarizes real schedule/reminder/study data.
4. Create or show a course and assignment.
5. Create a schedule item and a reminder.
6. Generate COSC 458 flashcards from the starter topic.
7. Open Practice Quizzes and quiz yourself from that specific flashcard set.
8. Return to the dashboard and show how the study plan/recommendations connect the app together.

## Collaboration Workflow

We use Trello to plan work and GitHub to protect the code.

- Product Backlog: larger feature areas.
- Sprint Backlog: selected user stories for the current sprint.
- To Do: tasks ready to begin.
- In Progress: tasks actively being coded.
- Done: only work that exists in GitHub and has been merged.

Branch rule:

```text
main stays stable.
Each task gets its own feature branch.
Branches are merged through pull requests.
```

Example branch names:

```text
feature/flashcard-study-mode
feature/reminder-alerts
feature/practice-quiz-mode
feature/dashboard-ai-recommendations
```

More workflow notes are in [docs/team-workflow.md](docs/team-workflow.md).

## Presentation Support

Use [docs/presentation-guide.md](docs/presentation-guide.md) to divide speaking parts across the team and keep the demo within the time limit.

## Current Limitations

This is a class prototype, so a few items are intentionally scoped for future work:

- No hosted production deployment yet.
- SQLite is used for local development instead of a production database.
- Reminder alerts work while the web app is open.
- AI features are useful for demo purposes, but not a full personalized learning engine yet.
- No Docker setup is required for the current presentation workflow.

## Team

- Product Owner: Great-Anthony Umukoro
- Scrum Master: Nia Webster
- Development/Test Team: Darruis Jackson, Schidny Balisage, Christian Jamison, Kalonji Stephens
