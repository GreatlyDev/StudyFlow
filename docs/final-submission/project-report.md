# StudyFlow Project Report

## 1. Project Overview

StudyFlow is a web-based AI study optimization platform designed to help students organize academic responsibilities and improve study habits. The application helps students manage courses, assignments, study schedules, reminders, study materials, flashcards, practice quizzes, and AI-supported study recommendations.

The purpose of StudyFlow is to reduce academic stress by giving students one organized workspace for planning, studying, and reviewing course material.

## 2. Development Process

The team followed an iterative development process. Instead of trying to build every feature at once, the project was broken into smaller feature areas and task cards. Trello was used to plan and track work, while GitHub was used for source control and pull requests.

The development process followed this pattern:

1. Identify a user story or feature area.
2. Break the story into smaller technical tasks.
3. Move the task into In Progress on Trello.
4. Create a GitHub branch for the task.
5. Implement and test the feature locally.
6. Open and merge a pull request.
7. Move the Trello card to Done after the work was merged.

This helped the team keep the project organized and reduced the chance of overwriting each other's work.

## 3. Tech Stack

The project used:

- Frontend: React, Vite, React Router, CSS
- Backend: FastAPI, SQLAlchemy, Pydantic
- Database: SQLite
- Authentication: JWT and password hashing
- AI Support: OpenAI API through backend services
- Project Management: Trello
- Version Control: GitHub

## 4. User Stories

The team's Product Backlog and Sprint Backlog were organized around these user stories.

### 1. User Account Management

As a student, I want to create an account and log in securely so that I can save and access my study data.

Implementation:

- User model
- Registration endpoint
- Login endpoint
- Password hashing
- JWT token authentication
- Protected frontend routes
- Forgot/reset password demo flow

### 2. Course and Assignment Management

As a student, I want to add courses and assignments so that I can organize my academic workload.

Implementation:

- Course database model
- Course CRUD API
- Course frontend page
- Assignment database model
- Assignment CRUD API
- Assignment frontend page
- Assignment-course relationship

### 3. Flashcard Study Tools

As a student, I want to generate and review flashcards so that I can study important concepts more effectively.

Implementation:

- Flashcard model
- Manual flashcard creation
- AI/starter-topic flashcard generation
- Flashcard study sets grouped by source topic/material
- Flashcard review mode
- COSC 458 starter topic for presentation demo

### 4. Study Material Upload

As a student, I want to save study material so that the system can help me turn my notes into study tools.

Implementation:

- Study material model
- Study material API
- Study material frontend page
- Saved study materials available for flashcard generation

### 5. Study Schedule and Calendar

As a student, I want to create study schedule items so that I can plan my study time.

Implementation:

- Schedule model
- Schedule CRUD API
- Schedule frontend page
- Improved time dropdowns
- Dashboard schedule timeline
- Add AI recommendation to schedule

### 6. Dashboard and Progress Tracking

As a student, I want a dashboard so that I can quickly see what I need to focus on.

Implementation:

- Dashboard summary API
- Dashboard page
- Upcoming reminders
- Study plan timeline
- Counts for courses, assignments, reminders, and study blocks
- AI recommendation cards

### 7. Reminders and Notifications

As a student, I want reminders for assignments and study sessions so that I do not miss important deadlines.

Implementation:

- Reminder model
- Reminder API
- Reminder frontend page
- Links to assignments and schedules
- Browser alert behavior while the app is open

### 8. AI Study Recommendations

As a student, I want AI-supported study recommendations so that I can decide what to study next.

Implementation:

- OpenAI API configuration through environment variables
- Backend AI recommendation service
- Dashboard recommendation cards
- Graceful fallback behavior for prototype use

### 9. Practice Quizzes

As a student, I want to quiz myself from flashcards so that I can test what I know.

Implementation:

- Practice quiz frontend page
- Select one flashcard study set
- Reveal answers
- Mark correct or missed
- Score summary
- Missed-card review

### 10. AI Explanation and Feedback

As a student, I want AI explanations so that I can better understand concepts I miss.

Implementation Status:

- AI Assistant page and AI foundation are present.
- Full conversational tutoring and detailed quiz feedback remain future work.

### 11. User Preferences and Help

As a student, I want settings and help options so that the app is easier to personalize and use.

Implementation Status:

- This remains future work beyond the current prototype.

## 5. Completed Features

The final prototype includes:

- User registration and login
- JWT-protected frontend and backend routes
- Course management
- Assignment management
- Study schedule management
- Reminder management and browser alerts
- Study material saving
- Flashcard creation and generation
- Flashcard study sets
- Practice quizzes from selected flashcard sets
- Dashboard with real user data
- AI-supported recommendations and flashcard generation foundation
- Final README and presentation documentation

## 6. Project Management and Tracking

The team used Trello to track work across:

- Product Backlog
- Sprint Backlog
- To Do
- In Progress
- Done
- Roles and Responsibilities
- Meetings
- Setup

GitHub was used for source control. The team avoided direct edits to `main` and used branches and pull requests. This helped protect the project from accidental changes and made it easier to connect completed Trello cards to real code.

## 7. Difficulties and Challenges

### Challenge 1: Keeping the Trello Board Organized

Early Trello cards were too similar and repetitive. This made it harder to clearly show what the team was building.

How we addressed it:

- Reorganized Product Backlog into broader feature groups.
- Rewrote Sprint Backlog cards as user stories.
- Numbered implementation tasks so they connected back to backlog items.
- Only moved cards to Done when the work existed in GitHub.

### Challenge 2: Preventing GitHub Workflow Problems

Team projects can easily break if multiple people work directly on `main`.

How we addressed it:

- Created branch rules.
- Used feature branches.
- Used pull requests.
- Kept `main` stable.
- Documented the workflow in `docs/team-workflow.md`.

### Challenge 3: Balancing AI Features With Time

Full AI personalization can become too large for a class prototype.

How we addressed it:

- Built an AI foundation instead of overbuilding.
- Added useful AI-supported recommendations and flashcard generation.
- Kept future advanced AI tutoring and personalization as future work.

### Challenge 4: Making the App Feel Presentation-Ready

The app needed to feel like more than placeholder pages.

How we addressed it:

- Replaced placeholders with working study materials, flashcards, reminders, and practice quizzes.
- Improved dashboard data.
- Added a polished landing page.
- Added COSC 458 flashcards for a relevant class demo.

## 8. Missing or Future Features

These features are not included in the current prototype:

- Production deployment
- Mobile version
- Email/SMS reminder delivery
- Advanced analytics
- Dark mode/preferences
- Full AI tutoring conversations
- Advanced quiz types beyond flashcard quizzes
- Real long-term spaced repetition algorithm

These are reasonable future improvements because the current project focused on a working end-of-semester prototype.

## 9. Efforts to Overcome Problems

The team worked through challenges by:

- Improving Trello organization
- Using branch-based GitHub workflow
- Writing documentation for setup and team process
- Testing features locally
- Keeping feature scope realistic
- Prioritizing presentation-critical features
- Making AI useful without letting it overtake the whole project

## 10. Final Project Completion

StudyFlow reached a strong prototype stage. It demonstrates the main purpose of the product and includes enough working features to show how the app can help students manage and improve their study habits.

The project is not a finished commercial product, but it is a realistic software engineering prototype with a clear path for future expansion.
