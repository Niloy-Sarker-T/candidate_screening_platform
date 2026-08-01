# Candidate Screening Platform

A clean full-stack Candidate Screening Platform for recruiters and candidates. Recruiters can create and manage jobs, review applications, and update candidate status. Candidates can browse open roles, apply, and track their application.

## Tech Stack

Backend:
- FastAPI
- SQLAlchemy 2.x
- PostgreSQL
- Pydantic
- Uvicorn

Frontend:
- React with Vite
- React Router
- Axios
- Tailwind CSS

## Features

- Recruiter dashboard with job list, filters, search, sorting, and statistics
- Paginated job APIs with search, location filtering, status filtering, and sorting
- Application filtering by status, email, and job
- CSV export for applications
- Create, edit, and close jobs
- View applications for a job
- Update application status through `Applied`, `Screening`, `Interview`, `Rejected`, and `Hired`
- Candidate open-jobs page
- Candidate application form with email and resume URL validation
- Application tracking by ID
- Empty states, loading states, success and error alerts
- Configurable CORS for local React development

## Architecture

The backend is split into models, schemas, routers, services, database configuration, config, and utilities. Routers handle HTTP concerns, services contain business logic, schemas validate request and response bodies, and models define database tables and relationships.

The frontend is split into API clients, reusable UI components, hooks, and pages. API access is centralized through Axios.

## Folder Structure

```text
backend/
  app/
    main.py
    config.py
    database.py
    models/
    schemas/
    routers/
    services/
    utils/
  requirements.txt
  .env.example

frontend/
  src/
    api/
    components/
    hooks/
    pages/
    App.jsx
    main.jsx
    styles.css
  package.json
  .env.example
```

## Database Schema

`jobs`
- `id`
- `title`
- `description`
- `location`
- `employment_type`
- `status`
- `created_at`
- `updated_at`

`candidates`
- `id`
- `name`
- `email` unique
- `created_at`

`applications`
- `id`
- `candidate_id`
- `job_id`
- `resume_url`
- `status`
- `created_at`

Relationships:
- Job has many Applications
- Candidate has many Applications
- Application belongs to one Job and one Candidate

## API Documentation

FastAPI automatically exposes interactive API documentation:

- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

Main endpoints:

| Method | Endpoint | Description |
| --- | --- | --- |
| `GET` | `/health` | Health check |
| `POST` | `/jobs` | Create job |
| `GET` | `/jobs` | Paginated jobs with optional `search`, `location`, `status`, `sort`, `page`, and `size` |
| `GET` | `/jobs/open` | List open jobs with optional `search` and `location` |
| `GET` | `/jobs/{job_id}` | Get one job |
| `PUT` | `/jobs/{job_id}` | Update job |
| `PATCH` | `/jobs/{job_id}/close` | Close job |
| `GET` | `/jobs/{job_id}/applications` | List applications for a job |
| `GET` | `/applications` | Paginated applications with optional `status`, `email`, `job_id`, `page`, and `size` |
| `GET` | `/applications/export` | Download filtered applications as CSV |
| `POST` | `/applications` | Apply to a job |
| `GET` | `/applications/{application_id}` | Track application |
| `PATCH` | `/applications/{application_id}` | Update application status |

Example paginated jobs response:

```json
{
  "total": 86,
  "page": 1,
  "size": 10,
  "items": []
}
```

Example filters:

```text
GET /jobs?search=python&location=dhaka&page=1&size=10
GET /jobs?status=OPEN&sort=title
GET /applications?status=screening
GET /applications?email=niloy@example.com
GET /applications/export?status=Interview
```

## Environment Variables

Backend:

```env
DATABASE_URL=postgresql+psycopg2://postgres:postgres@localhost:5432/candidate_screening
FRONTEND_ORIGINS=http://localhost:5173,http://127.0.0.1:5173
APP_NAME=Candidate Screening Platform
DEBUG=true
```

Frontend:

```env
VITE_API_URL=http://localhost:8000
```

## Setup Instructions

Create a PostgreSQL database:

```bash
createdb candidate_screening
```

Or create it with any PostgreSQL client and update `backend/.env`.

## Running Backend

```bash
cd backend
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
copy .env.example .env
uvicorn app.main:app --reload
```

The backend runs at `http://localhost:8000`.

Tables are created automatically on startup for this interview-ready project. In a production system, use migrations such as Alembic.

## Running Frontend

```bash
cd frontend
npm install
copy .env.example .env
npm run dev
```

The frontend runs at `http://localhost:5173`.

## Screenshots

Add screenshots here after running the project locally:

- Candidate open jobs
- Apply form
- Recruiter dashboard
- Applications pipeline

## Future Improvements

- Add authentication and role-based access control
- Add Alembic migrations
- Add pagination for jobs and applications
- Add file upload support for resumes
- Add automated tests with pytest and React Testing Library
- Add Docker Compose for PostgreSQL, backend, and frontend
