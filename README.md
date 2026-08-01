# Candidate Screening Platform

A full-stack Candidate Screening Platform for recruiters and candidates. Recruiters can create and manage jobs, review applications, export candidate data, and update screening statuses. Candidates can browse open roles, apply for jobs, and track their application status.

## Live Demo

Frontend: `https://candidate-screening-platform-frontend.onrender.com`

Backend API: `https://candidate-screening-platform-frontend.onrender.com`


Video demo : `https://drive.google.com/file/d/1sjGW_KzDbPF61mRRylk79wcHpoldhp5G/view?usp=sharing`



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

Deployment:
- Frontend: Render
- Backend: Render
- Database: Neon PostgreSQL

## Core Features

- Create jobs
- Edit jobs
- Close jobs
- View all jobs as a recruiter
- View open jobs as a candidate
- Apply for jobs
- Track application status by application ID
- View applications for a job
- Update candidate application status
- Reuse existing candidate record when applying with an existing email

## Additional Features

- Search jobs by title, description, or location
- Filter jobs by location and status
- Sort jobs by newest, oldest, or title
- Paginated jobs API
- Filter applications by status, email, and job ID
- Export applications as CSV
- Prevent duplicate job applications with `409 Conflict`
- Dashboard statistics
- Application count per job
- Responsive SaaS-style UI
- Loading states, empty states, and success/error alerts
- Configurable CORS for local and deployed frontends

## Architecture

The backend is organized into models, schemas, routers, services, database configuration, config, and utilities. Routers handle HTTP concerns, services contain business logic, schemas validate request and response bodies, and models define database tables and relationships.

The frontend is organized into API clients, reusable components, hooks, and pages. API communication is centralized through Axios.

```text
React (Vite)
     |
     v
FastAPI REST API
     |
     v
SQLAlchemy ORM
     |
     v
PostgreSQL (Neon in production)
```

## Folder Structure

```text
backend/
  app/
    main.py
    config.py
    database.py
    models/
      application.py
      candidate.py
      job.py
    schemas/
      application.py
      candidate.py
      job.py
      pagination.py
    routers/
      applications.py
      jobs.py
    services/
      applications.py
      candidates.py
      jobs.py
    utils/
      exceptions.py
  requirements.txt
  .env.example

frontend/
  src/
    api/
      applications.js
      client.js
      jobs.js
    components/
      Alert.jsx
      EmptyState.jsx
      JobForm.jsx
      Loading.jsx
      Navbar.jsx
      PageHeader.jsx
      StatusBadge.jsx
    hooks/
      useAsync.js
    pages/
      ApplicationsPage.jsx
      ApplyPage.jsx
      CandidateHome.jsx
      JobEditor.jsx
      RecruiterDashboard.jsx
      TrackStatus.jsx
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

Data integrity:
- A candidate cannot apply to the same job more than once.
- Duplicate applications return HTTP `409 Conflict`.

## API Documentation

FastAPI automatically exposes interactive API documentation:

- Local Swagger UI: `http://localhost:8000/docs`
- Local ReDoc: `http://localhost:8000/redoc`
- Production Swagger UI: `https://your-backend.onrender.com/docs`

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

Duplicate application response:

```json
{
  "detail": "You have already applied for this job."
}
```



## Deployment

Frontend:
- Hosted on Render
- Uses `VITE_API_URL` to connect to the deployed backend API

Backend:
- Hosted on Render
- Uses FastAPI with Uvicorn
- CORS is configured through `FRONTEND_ORIGINS`

Database:
- Production database is hosted on Neon PostgreSQL
- Local PostgreSQL is only required for local development

- Add Docker Compose for local development
- Add recruiter notes and candidate rating
