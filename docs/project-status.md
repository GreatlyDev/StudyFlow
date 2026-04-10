# Project Status

This is the quick project snapshot for StudyFlow so nobody has to guess where the app stands.

## Current Status

As of April 10, 2026, StudyFlow has moved past the initial scaffold stage and into a working prototype stage.

The app now has:

- backend authentication with register, login, JWT, and protected user routes
- a React frontend connected to the backend
- course management foundation
- assignment management foundation
- study schedule CRUD foundation
- a styled dashboard with a study timeline and calendar view
- AI Assistant placeholder page
- Flashcards placeholder page

In other words, the project already has enough structure to demonstrate the main idea of the platform in a real way.

## What Is Working Right Now

### Backend

- FastAPI application structure is in place
- SQLite is being used for local development
- SQLAlchemy models exist for users, schedules, courses, and assignments
- auth endpoints are working
- schedule endpoints are working
- course endpoints are working
- assignment endpoints are working
- dashboard summary endpoint is working
- AI placeholder endpoint is working

### Frontend

- login and signup pages are connected to the backend
- JWT token storage is working
- protected routing is working
- dashboard layout is working
- schedule page is working
- courses page is working
- assignments page is working
- AI Assistant and Flashcards are visible in the app as future-facing placeholders

## What Is Intentionally Not Finished Yet

These are not bugs. They are simply out of scope for the first solid prototype:

- real AI recommendations
- real flashcard generation
- notifications and reminders
- advanced calendar views
- analytics beyond the basic dashboard summary
- deeper testing coverage

## What We Can Demo Right Now

If someone asks what the team has already built, the honest answer is:

- a user can sign up and log in
- a user can manage courses
- a user can manage assignments
- a user can create schedule entries
- a user can view a dashboard-style study overview
- a user can see where future AI and Flashcards features will fit into the platform

That is a strong place to be for this stage of the semester.

## Best Next Build Order

If the team wants a sensible path forward, this is the order that makes the most sense:

1. Finish the schedule experience so it feels more useful day to day
2. Improve the dashboard with more real summary content
3. Build out the Flashcards feature properly
4. Add notification/reminder foundations
5. Expand AI from placeholders into safer, clearly scoped service integrations

## General Direction

The project should keep moving in a way that feels believable and maintainable.

That means:

- keep `main` stable
- avoid overbuilding features that are still placeholder-only
- improve one part at a time
- make each new branch small enough to review
- prefer features that strengthen the demo without making the codebase messy

## Bottom Line

StudyFlow is in a good spot.

It is no longer just an idea, and it is not pretending to be fully finished either. It is a real working prototype with a clear direction, which is exactly where a strong team project should be right now.
