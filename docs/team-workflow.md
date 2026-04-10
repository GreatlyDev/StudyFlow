# Team Workflow Notes

## Repository Rules

- Do not push work directly to `main`.
- Each teammate should work from a feature branch.
- Open pull requests early so code can be reviewed before merge.

## Recommended Ownership Areas

- Auth team: `backend/app/routes/auth.py`, `backend/app/services/auth_service.py`, auth pages in `frontend/src/pages/`
- Schedule team: `backend/app/models/schedule.py`, `backend/app/routes/schedules.py`, `frontend/src/pages/SchedulePage.jsx`
- Courses/assignments team: create new modules beside the schedule feature instead of mixing logic into auth files
- Dashboard team: extend `frontend/src/pages/DashboardPage.jsx` and add backend summary endpoints later
- AI team: build placeholder interfaces first, then add real service integrations in a separate branch

## Branch Suggestions

- `feature/courses-module`
- `feature/assignments-module`
- `feature/dashboard-summary`
- `feature/reminders-foundation`
- `feature/ai-service-stubs`

## Team Development Notes

- Keep backend code grouped by responsibility: routes, schemas, models, services
- Keep frontend pages simple and move reusable logic into `api/`, `components/`, and `context/`
- Add comments only where they help explain intent or non-obvious behavior
- Keep SQLite for local development until the team is ready to move to PostgreSQL

## Next Sprint Candidates

1. Add course CRUD and connect it to assignments
2. Add assignment CRUD with due-date tracking
3. Add dashboard summary cards driven by real backend data
4. Add calendar filtering and weekly schedule views
5. Add AI placeholder endpoints and UI cards without implementing full AI logic yet
