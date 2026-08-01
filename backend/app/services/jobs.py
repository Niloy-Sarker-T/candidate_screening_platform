from sqlalchemy import Select, func, select
from sqlalchemy.orm import Session

from app.models.application import Application
from app.models.job import Job, JobStatus
from app.schemas.job import JobCreate, JobUpdate
from app.utils.exceptions import not_found


def _job_query_with_counts() -> Select:
    return (
        select(Job, func.count(Application.id).label("application_count"))
        .outerjoin(Application)
        .group_by(Job.id)
    )


def attach_application_count(job: Job, count: int) -> Job:
    setattr(job, "application_count", count)
    return job


def list_jobs(
    db: Session,
    *,
    search: str | None = None,
    status: JobStatus | None = None,
    sort: str = "newest",
) -> list[Job]:
    query = _job_query_with_counts()

    if search:
        pattern = f"%{search}%"
        query = query.where(
            Job.title.ilike(pattern)
            | Job.description.ilike(pattern)
            | Job.location.ilike(pattern)
        )

    if status:
        query = query.where(Job.status == status)

    if sort == "oldest":
        query = query.order_by(Job.created_at.asc())
    elif sort == "title":
        query = query.order_by(Job.title.asc())
    else:
        query = query.order_by(Job.created_at.desc())

    rows = db.execute(query).all()
    return [attach_application_count(job, count) for job, count in rows]


def list_open_jobs(db: Session, *, search: str | None = None) -> list[Job]:
    return list_jobs(db, search=search, status=JobStatus.OPEN)


def get_job(db: Session, job_id: int) -> Job:
    row = db.execute(_job_query_with_counts().where(Job.id == job_id)).first()
    if not row:
        raise not_found("Job not found")

    job, count = row
    return attach_application_count(job, count)


def create_job(db: Session, payload: JobCreate) -> Job:
    job = Job(**payload.model_dump())
    db.add(job)
    db.commit()
    db.refresh(job)
    return attach_application_count(job, 0)


def update_job(db: Session, job_id: int, payload: JobUpdate) -> Job:
    job = get_job(db, job_id)
    for field, value in payload.model_dump(exclude_unset=True).items():
        setattr(job, field, value)

    db.commit()
    db.refresh(job)
    return get_job(db, job.id)


def close_job(db: Session, job_id: int) -> Job:
    job = get_job(db, job_id)
    job.status = JobStatus.CLOSED
    db.commit()
    db.refresh(job)
    return get_job(db, job.id)
