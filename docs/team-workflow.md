# Team Workflow Notes

This document is here to keep the team on the same page as StudyFlow moves from a clean prototype into a fuller class project.

Right now, the repository is no longer just a scaffold. We already have a working base for authentication, schedules, courses, assignments, dashboard UI, and placeholder sections for AI Assistant and Flashcards. That means the next phase should be less about starting from scratch and more about building carefully on top of what is already stable.

For a plain-English snapshot of the project itself, also check [project-status.md](project-status.md).

## Where We Are Right Now

As of April 10, 2026, the project includes:

- working user registration and login
- JWT-based authentication with protected routes
- course management foundation
- assignment management foundation
- study schedule CRUD foundation
- dashboard UI with timeline and calendar layout
- AI Assistant placeholder page
- Flashcards placeholder page
- protected `main` branch workflow on GitHub

This is a good first version for the semester prototype. It is enough to demonstrate the main structure of the product without pretending the full product is finished.

## Team Agreement

- Do not push work directly to `main`.
- Start every task from the latest `main`.
- One Trello card should usually mean one branch and one pull request.
- Keep pull requests focused. Small PRs are easier to review and safer to merge.
- If something is unfinished, label it clearly instead of quietly leaving broken behavior behind.
- If you are unsure where a change belongs, ask before moving files around.

## Git Workflow

The expected team flow is:

1. Switch to `main`
2. Pull the latest changes
3. Create a feature branch
4. Do the work on that branch
5. Push the branch
6. Open a pull request into `main`
7. Merge only after review

Typical commands:

```bash
git checkout main
git pull origin main
git checkout -b feature/your-task-name
```

Example branch names:

- `feature/flashcards-foundation`
- `feature/dashboard-polish`
- `feature/schedule-week-view`
- `feature/notifications-placeholder`
- `fix/auth-error-handling`

## If You Accidentally Work On `main`

If someone makes local changes on `main`, do not panic. The fix is usually simple:

1. Create a new branch immediately so the work is saved
2. Move back to `main`
3. Reset `main` back to the remote version if needed

Example:

```bash
git checkout -b feature/save-my-work
git checkout main
git fetch origin
git reset --hard origin/main
```

The main rule is: save the work on a branch first, then clean up `main`.

## Merge Rules

The GitHub ruleset is there to protect the project, not to slow people down.

- `main` should stay clean and usable
- changes should go through pull requests
- if a PR is not ready, it should not be merged
- if a PR needs changes, it is better to request changes than to merge something shaky

Best practice for this team:

- teammates build on branches
- the product owner or designated reviewer does the final merge into `main`

## Recommended Ownership Areas

These are not hard walls, but they help reduce conflicts:

- Auth and session flow: `backend/app/routes/auth.py`, `backend/app/services/auth_service.py`, auth pages in `frontend/src/pages/`
- Schedule feature: `backend/app/models/schedule.py`, `backend/app/routes/schedules.py`, `frontend/src/pages/SchedulePage.jsx`
- Courses and assignments: their backend routes/models plus the related frontend pages
- Dashboard and UI polish: `frontend/src/pages/DashboardPage.jsx`, layout components, shared styles
- AI and Flashcards foundation: placeholder pages first, real logic later in separate branches
- Documentation and workflow: `docs/`, `README.md`, setup instructions, team notes

## Definition Of Done For This Team

A task should usually count as done only when:

- the feature works locally
- the branch is pushed
- the PR explains what changed
- nothing obvious is broken in the existing flow
- the code still fits the project structure
- the UI still feels consistent with the rest of the app

For this class project, "done" does not mean "perfect." It means stable enough to demo, understandable to teammates, and safe to build on.

## What We Should Protect From Breaking

These are the current foundations we should avoid destabilizing:

- auth flow
- protected routes
- course creation
- assignment creation
- schedule creation
- dashboard loading
- local frontend/backend startup steps

If a new feature touches one of these areas, test the old flow again before opening the PR.

## Suggested Next Work

The most sensible next steps are:

1. Improve the schedule experience with weekly or monthly views
2. Expand the dashboard with more real academic summaries
3. Build the real flashcards data model and card workflow
4. Add reminder and notification groundwork
5. Add smarter AI placeholders or service stubs without promising full AI yet
6. Strengthen error handling and polish rough UI edges

## Notes On Scope

The current prototype should stay realistic.

- AI is still a placeholder
- Flashcards are visible in the UI, but not fully implemented
- notifications and reminders are still future work
- the app is strong enough to show direction, structure, and working CRUD features right now

That is okay. The goal is a believable and well-organized student product, not a fake "everything is finished" demo.

## Final Reminder

If the team follows one habit consistently, it should be this:

Build on branches, keep `main` clean, and leave the next person a project that still runs.
