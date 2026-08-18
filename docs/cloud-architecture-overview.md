# Cloud Architecture Overview

This repository is a local development monorepo for a Todo application. It contains a React frontend, an Express backend API, an in-memory SQLite database, automated tests, and product documentation. There are no deployed cloud services or external storage components in the current implementation.

## Context Diagram

```mermaid
flowchart LR
  user[User Actor]

  subgraph dev[Local Development Environment]
    browser[Web Browser]

    subgraph frontend[Frontend Workspace: packages/frontend]
      react[React App]
      app[App.js]
      taskForm[TaskForm.js]
      taskList[TaskList.js]
      frontendTests[Frontend Tests]
    end

    subgraph backend[Backend Workspace: packages/backend]
      server[index.js\nExpress Server on port 3030]
      api[app.js\nTask API Routes]
      middleware[CORS, JSON Parser, Morgan]
      backendTests[Backend Tests]
    end

    db[(In-memory SQLite\nbetter-sqlite3)]
    docs[Docs and Requirements]
    rootScripts[Root npm Workspace Scripts]
  end

  user -->|opens app| browser
  browser -->|loads UI| react
  react --> app
  app --> taskForm
  app --> taskList

  user -->|creating a TODO: enters title, description, due date| taskForm
  taskForm -->|submits task object| app
  app -->|POST /api/tasks| server
  server --> middleware
  middleware --> api
  api -->|validate required title| api
  api -->|INSERT task| db
  db -->|created task row| api
  api -->|201 Created JSON| app
  app -->|increments refresh key| taskList
  taskList -->|GET /api/tasks| server
  api -->|SELECT tasks ordered by due date| db
  db -->|task list rows| api
  api -->|200 OK JSON| taskList
  taskList -->|renders updated list| browser
  browser -->|shows created TODO| user

  rootScripts -->|start frontend and backend| frontend
  rootScripts -->|start frontend and backend| backend
  frontendTests -.->|exercise UI behavior| frontend
  backendTests -.->|exercise API behavior| backend
  docs -.->|define product requirements and stories| frontend
  docs -.->|define product requirements and stories| backend
```

## Component Notes

- User Actor: A person using the Todo app through a web browser.
- Web Browser: Runs the React application during local development.
- React App: The frontend application served by `react-scripts` from `packages/frontend`.
- `App.js`: Owns edit state, save behavior, and task list refresh behavior.
- `TaskForm.js`: Captures task title, description, and due date, then submits task data for create or update actions.
- `TaskList.js`: Fetches tasks, renders task rows, and supports edit, delete, and completion toggle actions.
- Express Server: Started by `packages/backend/src/index.js` on port `3030` by default.
- Task API Routes: Implemented in `packages/backend/src/app.js`, including create, list, detail, update, complete, and delete endpoints.
- Middleware: Enables CORS, parses JSON request bodies, and logs HTTP requests.
- In-memory SQLite: Stores tasks for the lifetime of the backend process using `better-sqlite3`.
- Root npm Workspace Scripts: Start and test the frontend and backend workspaces from the repository root.
- Tests: Frontend and backend test suites validate UI and API behavior.
- Docs and Requirements: Product requirements, epics, stories, and supporting artifacts guide implementation scope.

## Create TODO Flow

1. The user opens the React app in a browser.
2. The user enters TODO details in `TaskForm.js` and submits the form.
3. `TaskForm.js` passes the task object to `App.js`.
4. `App.js` sends `POST /api/tasks` to the Express backend.
5. `app.js` validates that `title` is present and inserts the task into the in-memory SQLite database.
6. The API returns the created task as JSON with a `201 Created` response.
7. `App.js` refreshes `TaskList.js`.
8. `TaskList.js` requests `GET /api/tasks` and renders the updated TODO list.