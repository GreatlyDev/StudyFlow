# StudyFlow Final Presentation Guide

This guide is for keeping the final presentation organized, clear, and fair. Everyone should speak about a specific part of the project so nobody gets left out.

## Presentation Goal

StudyFlow should be presented as a student-focused AI study optimization platform. The main message is simple:

Students often have classes, assignments, notes, study sessions, reminders, and test preparation spread across too many places. StudyFlow brings those pieces into one workspace and uses AI support to help students turn their study material into action.

## Assignment Requirements Checklist

Use this checklist while building the slides and practicing the demo:

- Explain what we planned to do.
- Explain how we built it.
- Explain what we completed and what is still future work.
- Show the development process and Trello workflow.
- Discuss user stories and how tasks were tracked.
- Avoid overly technical explanations for a general audience.
- Sell the product as useful and valuable.
- Justify the custom software design.
- Use visuals, screenshots, diagrams, and demo clips.
- Demo the project features.
- Demo the local installation/running process.
- Make sure every team member participates.

## Suggested Slide Structure

### Slide 1: Title and Team

Content:

- StudyFlow - AI Study Optimization Platform
- Course: COSC 458
- Team member names and roles

Speaker:

- Great-Anthony

What to say:

StudyFlow is our group project for helping students organize their academic workload, study more consistently, and prepare for quizzes or exams using schedules, reminders, flashcards, practice quizzes, and AI-supported recommendations.

### Slide 2: Problem and Motivation

Content:

- Students manage deadlines, notes, schedules, and studying in too many places.
- Missing deadlines and poor planning create stress.
- Students need a focused workspace that turns coursework into study actions.

Speaker:

- Nia

What to say:

The problem we focused on is academic organization. A student may have a syllabus in one place, notes in another, reminders somewhere else, and flashcards in another app. StudyFlow is designed to reduce that scattered feeling by bringing the study workflow into one application.

### Slide 3: Planned Scope

Content:

- Account management
- Course and assignment management
- Study schedule and reminders
- Study materials
- Flashcards and practice quizzes
- Dashboard and AI recommendations

Speaker:

- Great-Anthony

What to say:

Our first version focused on the foundation of the product. We did not try to build a giant AI platform immediately. We started with the features students need first: login, courses, assignments, schedules, reminders, study materials, flashcards, quizzes, and a dashboard.

### Slide 4: Trello and Development Process

Content:

- Product Backlog
- Sprint Backlog
- To Do
- In Progress
- Done
- Feature branches and pull requests

Speaker:

- Nia

What to say:

We used Trello as our project management board. The Product Backlog held major feature areas, the Sprint Backlog held selected user stories, and coding tasks moved across To Do, In Progress, and Done. We also used GitHub branches and pull requests so work did not go directly into main until it was ready.

### Slide 5: System Design and Tech Stack

Content:

- Frontend: React and Vite
- Backend: FastAPI
- Database: SQLite and SQLAlchemy
- Auth: JWT
- AI: OpenAI API

Speaker:

- Darruis

What to say:

The frontend is built with React and Vite, while the backend is built with FastAPI. We used SQLite for the prototype database because it is lightweight and easy to run locally. SQLAlchemy handles models and database access, JWT handles user authentication, and the OpenAI API supports AI-assisted study features.

### Slide 6: Core User Features

Content:

- Register and login
- Courses
- Assignments
- Schedule items
- Reminders

Speaker:

- Schidny

What to say:

The core features are what make StudyFlow useful before AI is even involved. Students can create an account, add courses, track assignments, schedule study sessions, and set reminders. This gives the app real student data to organize and eventually use for smarter recommendations.

### Slide 7: Study Tools

Content:

- Study materials
- Flashcard generation
- Flashcard study sets
- Practice quizzes
- Missed-card review

Speaker:

- Christian

What to say:

The study tools are where the app starts feeling more interactive. Students can save study material, generate flashcards from starter topics or saved material, keep flashcards grouped into study sets, and then quiz themselves from one set at a time. After the quiz, the app shows the score and missed cards so students know what to review.

### Slide 8: Dashboard and AI Foundation

Content:

- Dashboard summary
- Upcoming reminders
- Study plan timeline
- AI recommendations
- Add recommendation to schedule

Speaker:

- Kalonji

What to say:

The dashboard connects the app together. Instead of just showing random placeholder text, it uses the student's saved courses, assignments, schedules, reminders, and flashcards. AI recommendations appear as study suggestions, and the user can choose to add a recommendation to the schedule instead of the app changing the schedule automatically.

### Slide 9: Demo Plan

Content:

- Log in
- Show dashboard
- Add or show course/assignment
- Show schedule/reminder
- Generate COSC 458 flashcards
- Take practice quiz
- Show missed-card review

Speaker:

- Great-Anthony leads the live demo
- Other members can briefly explain the feature connected to their slide

What to say:

For the demo, we will show a realistic student flow instead of clicking through every screen randomly. The flow starts with login, moves into the dashboard, shows planning features, generates COSC 458 flashcards, and ends with a practice quiz.

### Slide 10: What Is Done vs. Future Work

Content:

Done:

- Auth
- Courses and assignments
- Schedules
- Reminders
- Study materials
- Flashcards
- Practice quizzes
- Dashboard
- AI foundation

Future Work:

- Hosted deployment
- Stronger AI personalization
- Email/SMS reminders
- More advanced quiz types
- Dark mode/user preferences
- Progress analytics

Speaker:

- Great-Anthony or Nia

What to say:

We have a working prototype with the main academic workflow in place. Future work would make the product more production-ready by adding deployment, stronger AI personalization, email or SMS reminders, more quiz types, and analytics.

## Demo Script

Keep the live demo under control. The goal is to show the best flow, not every button.

1. Open the app and show the landing page.
2. Log in with the demo user.
3. Show the dashboard and explain that the information comes from the student's saved data.
4. Go to Courses and show a course.
5. Go to Assignments and show an assignment.
6. Go to Schedule and show a study block.
7. Go to Reminders and show a reminder.
8. Go to Flashcards.
9. Generate flashcards from "Computer Science 458: Introduction to Software Engineering."
10. Go to Practice Quizzes.
11. Select the COSC 458 flashcard set.
12. Start a quiz, reveal answers, mark one correct and one missed.
13. Show the final score and missed-card review.
14. Return to Dashboard and close by explaining how StudyFlow helps students plan, study, and review.

## Speaking Roles

These roles can be adjusted, but everyone should have a clear part.

| Team Member | Suggested Responsibility |
| --- | --- |
| Great-Anthony Umukoro | Product owner, project overview, live demo lead, GitHub/Trello workflow |
| Nia Webster | Scrum master, Trello process, meetings, project organization |
| Darruis Jackson | Backend structure, FastAPI, database, authentication/API explanation |
| Schidny Balisage | Courses, assignments, reminders, testing and user workflow |
| Christian Jamison | Flashcards, practice quizzes, study tools |
| Kalonji Stephens | Dashboard, AI recommendations, future AI direction |

## What Not To Overdo

- Do not spend too long explaining code line by line.
- Do not demo unfinished future features as if they are complete.
- Do not type a lot during the live demo if prepared data already exists.
- Do not expose the OpenAI API key on screen.
- Do not let one person speak for the whole presentation.

## Strong Closing

StudyFlow is not just a planner and not just a flashcard app. It is a student workflow tool that connects planning, deadlines, study materials, reminders, AI suggestions, and practice into one place. The prototype shows the foundation of a product that can grow into a more intelligent academic assistant.
