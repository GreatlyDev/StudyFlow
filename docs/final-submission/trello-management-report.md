# StudyFlow Trello Management Report

## 1. Purpose of Trello Board

The StudyFlow team used Trello as a Kanban-style project management board. The board helped the team organize the project into feature areas, user stories, tasks, current work, completed work, roles, setup items, and meetings.

The Trello board was important because it gave the team a shared place to track what had been planned, what was currently being built, and what had already been merged into the GitHub repository.

## 2. Board Columns

### Product Backlog

The Product Backlog contained the larger feature areas for the product:

- User Account Management
- Course and Assignment Management
- Flashcard Study Tools
- Study Material Upload
- Study Schedule and Calendar
- Dashboard and Progress Tracking
- Reminders and Notifications
- AI Study Recommendations
- Practice Quizzes
- AI Explanation and Feedback
- User Preferences and Help

### Sprint Backlog

The Sprint Backlog contained the user stories selected for the current prototype. The team focused on the features that were most important for a working student study platform:

- User Account Management
- Course and Assignment Management
- Study Schedule and Calendar
- Dashboard and Progress Tracking
- Flashcard Study Tools
- Study Material Upload
- Reminders and Notifications
- AI Study Recommendations

### To Do

The To Do list contained cards that were planned but not yet started. These cards were usually broken down into smaller implementation tasks connected to the Product Backlog and Sprint Backlog.

### In Progress

The In Progress list contained cards actively being worked on. When a developer started coding a task, the task card was moved here and connected to a feature branch.

### Done

The Done list was reserved for completed work that existed in GitHub and had been merged into `main`. This helped prevent the board from claiming work was finished before it was actually represented in the repository.

### Roles and Responsibilities

This list showed the team's working roles:

- Product Owner: Great-Anthony Umukoro
- Scrum Master: Nia Webster
- Development/Test Team: Darruis Jackson, Schidny Balisage, Christian Jamison, Kalonji Stephens

### Setup

The Setup list tracked early project setup work, including creating the GitHub repository and inviting team members.

### Meetings

The Meetings list tracked group meeting dates and communication checkpoints.

## 3. Meeting Minutes

### Meeting 1: April 1, 2026

Agenda:

- Discuss the project idea
- Identify the main problem StudyFlow should solve
- Choose the general feature direction
- Begin assigning early responsibilities

Summary:

The team discussed building a student-focused study organization app. The group agreed that the project should help students manage courses, assignments, deadlines, and study planning. The product owner role and scrum master role were identified.

Key Decisions:

- Build a web-based study optimization platform
- Use Trello to manage the project
- Use GitHub for source control
- Focus first on account management, courses, assignments, schedules, dashboard, and future AI support

### Meeting 2: April 8, 2026

Agenda:

- Review initial Trello board
- Discuss project setup
- Confirm tech stack
- Begin development planning

Summary:

The team reviewed the early Trello board and discussed how the Product Backlog and Sprint Backlog should be organized. The group agreed to use FastAPI, SQLAlchemy, SQLite, React, and Vite.

Key Decisions:

- Backend: FastAPI
- Frontend: React with Vite
- Database: SQLite for prototype
- Authentication: JWT
- Work should be done through branches and pull requests

### Meeting 3: April 10, 2026

Agenda:

- Review prototype progress
- Discuss dashboard and study schedule features
- Review GitHub branch workflow
- Identify remaining prototype features

Summary:

The team reviewed the working project foundation and confirmed that authentication, courses, assignments, schedules, and dashboard work were important for the demo. The board was updated so Done cards reflected work that existed in GitHub.

Key Decisions:

- `main` should remain stable
- Each coding task should use a separate branch
- Trello card numbers should connect back to Product Backlog items
- Placeholder AI features should be clearly marked until implemented

### Meeting 4: April 13, 2026

Agenda:

- Review user stories
- Improve Trello board structure
- Discuss documentation and diagrams
- Identify project report needs

Summary:

The team reorganized user stories so they were less repetitive and better connected to larger feature areas. Sprint Backlog items were written in a clearer "As a user, I want..." format.

Key Decisions:

- Product Backlog should use broad feature groups
- Sprint Backlog should contain user-focused goals
- To Do and In Progress cards should be implementation tasks
- The project documentation should explain board changes and task tracking

### Meeting 5: April 17, 2026

Agenda:

- Prepare for presentation
- Review demo flow
- Assign speaking roles
- Confirm completed features and future work

Summary:

The team reviewed the final demo flow and agreed that the presentation should focus on a realistic student workflow. Speaking roles were assigned so each member could explain a specific part of the project.

Key Decisions:

- Great-Anthony would lead the demo
- Nia would explain project management and Trello
- Development team members would explain backend, core features, flashcards/quizzes, dashboard, and AI direction
- The demo should avoid showing unfinished future features as complete

## 4. Task Cards and Team Duties

The team used task cards to connect project work to team responsibilities.

Examples:

- User authentication cards tracked account creation, login, JWT authentication, and protected routes.
- Course and assignment cards tracked database models, API routes, and frontend forms.
- Schedule cards tracked schedule model, CRUD endpoints, calendar/schedule UI, and frontend-backend connection.
- Flashcard cards tracked flashcard model, generation, study sets, study mode, and practice quiz behavior.
- Reminder cards tracked reminder model, reminder UI, and browser alert behavior.
- Dashboard cards tracked dashboard UI, live data, upcoming reminders, and AI recommendations.

Each task card represented a smaller piece of work that could be implemented, tested, and moved through the board.

## 5. Deadlines and Completion

Due dates were used on Trello cards to help keep work moving toward the presentation and final submission. Completed cards were moved to Done after the work was merged into GitHub.

The team met the major project deadlines by producing:

- Working source code
- Presentation-ready prototype
- GitHub repository
- Trello board
- Project documentation
- User documentation
- Final report materials

## 6. Branch and Pull Request Workflow

The team used GitHub to avoid breaking the project.

Workflow:

1. Start from latest `main`
2. Create a feature branch
3. Implement the task
4. Test locally
5. Push the branch
6. Open a pull request
7. Merge after review

This process helped keep `main` stable and allowed Trello Done cards to match real GitHub work.

## 7. Screenshots to Add

Add these screenshots before final submission:

- Full Trello board
- Product Backlog and Sprint Backlog
- In Progress and Done columns
- Roles and Responsibilities column
- Meetings column
- Example task card with description, labels, members, and due date
- GitHub repository main page
- GitHub pull request list or merged PR example

## 8. Summary

Trello helped the StudyFlow team plan, track, and communicate project work. The board made it easier to connect user stories to implementation tasks and to show how the team moved from planning to a working prototype.
