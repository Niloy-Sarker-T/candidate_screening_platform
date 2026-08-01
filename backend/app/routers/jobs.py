from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.job import JobStatus
from app.schemas.application import ApplicationDetail
from app.schemas.job import JobCreate, JobRead, JobUpdate
from app.services.applications import list_job_applications
from app.services.jobs import close_job, create_job, get_job, list_jobs, list_open_jobs, update_job

router = APIRouter(prefix="/jobs", tags=["Jobs"])


@router.post("", response_model=JobRead, status_code=status.HTTP_201_CREATED)
def create_job_endpoint(payload: JobCreate, db: Session = Depends(get_db)):
    return create_job(db, payload)


@router.get("", response_model=list[JobRead])
def list_jobs_endpoint(
    search: str | None = Query(default=None),
    status_filter: JobStatus | None = Query(default=None, alias="status"),
    sort: str = Query(default="newest", pattern="^(newest|oldest|title)$"),
    db: Session = Depends(get_db),
):
    return list_jobs(db, search=search, status=status_filter, sort=sort)


@router.get("/open", response_model=list[JobRead])
def list_open_jobs_endpoint(
    search: str | None = Query(default=None),
    db: Session = Depends(get_db),
):
    return list_open_jobs(db, search=search)


@router.get("/{job_id}", response_model=JobRead)
def get_job_endpoint(job_id: int, db: Session = Depends(get_db)):
    return get_job(db, job_id)


@router.put("/{job_id}", response_model=JobRead)
def update_job_endpoint(job_id: int, payload: JobUpdate, db: Session = Depends(get_db)):
    return update_job(db, job_id, payload)


@router.patch("/{job_id}/close", response_model=JobRead)
def close_job_endpoint(job_id: int, db: Session = Depends(get_db)):
    return close_job(db, job_id)


@router.get("/{job_id}/applications", response_model=list[ApplicationDetail])
def list_job_applications_endpoint(job_id: int, db: Session = Depends(get_db)):
    return list_job_applications(db, job_id)
