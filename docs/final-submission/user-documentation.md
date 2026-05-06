# StudyFlow User Documentation

## 1. Product Overview

StudyFlow is an AI study optimization platform that helps students organize their academic workload. Students can manage courses, assignments, study schedules, reminders, study materials, flashcards, practice quizzes, and AI-supported recommendations from one web application.

This document explains how to install, run, and use StudyFlow.

## 2. System Requirements

StudyFlow is a local prototype. To run it, the user needs:

- Windows computer
- Python 3.10 or newer
- Node.js and npm
- Git
- Internet access for installing dependencies
- Optional: OpenAI API key for AI-supported features

## 3. Project Files

The repository is organized like this:

```text
StudyFlow/
|-- backend/                  # FastAPI backend
|-- frontend/                 # React/Vite frontend
|-- docs/                     # Project documents
|-- README.md                 # Project overview and setup
`-- .gitignore                # Prevents local secrets and dependencies from being committed
```

## 4. Installation Instructions

### Step 1: Clone the Repository

Open Git Bash or PowerShell and run:

```powershell
git clone https://github.com/GreatlyDev/StudyFlow.git
cd StudyFlow
```

[Screenshot to add: terminal after cloning the repository]

### Step 2: Create a Python Virtual Environment

From the project root:

```powershell
py -m venv .venv
```

Activate it:

```powershell
.\.venv\Scripts\Activate.ps1
```

If activation is blocked, use the virtual environment Python directly:

```powershell
.\.venv\Scripts\python.exe --version
```

[Screenshot to add: terminal showing the virtual environment or Python version]

### Step 3: Install Backend Dependencies

From the project root:

```powershell
.\.venv\Scripts\python.exe -m pip install -r backend\requirements.txt
```

[Screenshot to add: terminal after backend dependencies install]

### Step 4: Create Backend Environment File

Copy the example environment file:

```powershell
Copy-Item backend\.env.example backend\.env
```

Open `backend\.env` and set:

```env
SECRET_KEY=change-this-before-production
FRONTEND_URL=http://127.0.0.1:5173
DATABASE_URL=sqlite:///backend/studyflow.db
OPENAI_API_KEY=your-local-openai-api-key
OPENAI_MODEL=gpt-5.4-mini
```

Important: do not share or screenshot the real OpenAI API key.

[Screenshot to add: `.env.example` or a blurred `.env` file with API key hidden]

### Step 5: Install Frontend Dependencies

Open a terminal:

```powershell
cd frontend
npm.cmd install
```

[Screenshot to add: terminal after frontend dependencies install]

## 5. Running the Application

### Start the Backend

Open Terminal 1:

```powershell
cd StudyFlow\backend
..\.venv\Scripts\python.exe -m uvicorn app.main:app --host 127.0.0.1 --port 8000
```

The backend should run at:

```text
http://127.0.0.1:8000
```

[Screenshot to add: backend terminal showing Uvicorn running]

### Start the Frontend

Open Terminal 2:

```powershell
cd StudyFlow\frontend
npm.cmd run dev -- --host 127.0.0.1 --port 5173
```

The frontend should run at:

```text
http://127.0.0.1:5173
```

[Screenshot to add: frontend terminal showing Vite running]

### Open StudyFlow

Open a browser and go to:

```text
http://127.0.0.1:5173
```

[Screenshot to add: StudyFlow landing/login page]

## 6. Feature Guide

### 6.1 Register a New Account

1. Open the app.
2. Click the sign-up/create account option.
3. Enter name, email, and password.
4. Submit the form.
5. The account is created and the user is redirected into the app.

[Screenshot to add: signup page]

### 6.2 Log In

1. Open the login page.
2. Enter email and password.
3. Click Login.
4. The user is taken to the dashboard.

[Screenshot to add: login page]

### 6.3 Dashboard

The dashboard shows:

- Study plan timeline
- Upcoming schedule items
- Reminder summary
- Course and assignment counts
- AI-supported study recommendations

Users can use the dashboard to understand what they should focus on next.

[Screenshot to add: dashboard page]

### 6.4 Courses

To add a course:

1. Click Courses in the sidebar.
2. Enter course name and details.
3. Click Create Course.
4. The course appears in the saved course list.

Courses can also be edited or deleted.

[Screenshot to add: courses page with at least one course]

### 6.5 Assignments

To add an assignment:

1. Click Assignments.
2. Select or connect a course.
3. Enter assignment title, due date, and status.
4. Click Create Assignment.
5. The assignment appears in the saved assignment list.

[Screenshot to add: assignments page with at least one assignment]

### 6.6 Study Schedule

To create a study schedule item:

1. Click Schedule.
2. Enter title and optional description.
3. Select date.
4. Choose start and end time from the dropdowns.
5. Add location and notes if needed.
6. Click Create Schedule Item.

Schedule items can also be edited or deleted.

[Screenshot to add: schedule page with a saved schedule item]

### 6.7 Reminders

To create a reminder:

1. Click Reminders.
2. Enter a reminder title.
3. Choose reminder type.
4. Select date and time.
5. Optionally link it to an assignment or schedule item.
6. Add a message.
7. Click Create Reminder.

If the app is open when the reminder time arrives, StudyFlow displays a browser alert.

[Screenshot to add: reminders page with saved reminder]

### 6.8 Study Materials

To save study material:

1. Click Study Materials.
2. Enter title, subject, and notes/content.
3. Save the material.
4. The material can later be used to support flashcard generation.

[Screenshot to add: study materials page]

### 6.9 Flashcards

StudyFlow supports manual flashcards and generated flashcards.

To generate flashcards:

1. Click Flashcards.
2. Choose a starter topic or saved study material.
3. Choose the number of cards.
4. Click Generate Flashcards.
5. The cards are saved into a study set.

Example demo topic:

- Computer Science 458: Introduction to Software Engineering

[Screenshot to add: flashcards page after generating COSC 458 flashcards]

### 6.10 Flashcard Study Mode

To study flashcards:

1. Select an active study set.
2. Click Test Yourself or open study mode.
3. Read the question.
4. Reveal the answer.
5. Mark whether the card is known or still being learned.

[Screenshot to add: flashcard study mode]

### 6.11 Practice Quizzes

To take a quiz:

1. Click Practice Quizzes.
2. Choose a flashcard study set.
3. Start the quiz.
4. Reveal each answer.
5. Mark the card as correct or missed.
6. At the end, review the score and missed cards.

[Screenshot to add: quiz score and missed-card review]

### 6.12 AI Assistant and Recommendations

The AI foundation supports study recommendations and flashcard generation. AI features require an OpenAI API key in `backend\.env`.

The dashboard may suggest study actions based on available courses, assignments, schedules, reminders, flashcards, and study materials.

[Screenshot to add: AI recommendations on dashboard]

## 7. Troubleshooting

### Backend will not start

Check:

- The virtual environment exists.
- Backend dependencies are installed.
- Port `8000` is not already being used.
- `backend\.env` exists.

### Frontend will not start

Check:

- Node.js is installed.
- `npm.cmd install` was run inside `frontend/`.
- Port `5173` is not already being used.

### AI features do not work

Check:

- `OPENAI_API_KEY` is set in `backend\.env`.
- The backend was restarted after editing `.env`.
- The API key has available credits.

### Data looks empty

This is normal on a fresh laptop because SQLite local data is not shared across computers. Create a demo account and add sample courses, assignments, reminders, and flashcards.

## 8. Current Limitations

StudyFlow is a class prototype. Current limitations include:

- No production hosting yet
- SQLite local database only
- Browser reminders work while the app is open
- AI is integrated as a useful foundation, not a full personalized learning engine
- No mobile app yet

## 9. Summary

StudyFlow gives students a single workspace for managing academic tasks and turning study material into schedules, reminders, flashcards, and quizzes. The prototype shows a realistic path toward a more advanced AI-supported study assistant.
