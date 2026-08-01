from sqlalchemy import select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session, joinedload

from app.models.application import Application, ApplicationStatus
from app.models.job import Job, JobStatus
from app.schemas.application import ApplicationCreate
from app.services.candidates import get_or_create_candidate
from app.utils.exceptions import bad_request, conflict, not_found


def get_application(db: Session, application_id: int) -> Application:
    application = db.scalar(
        select(Application)
        .options(joinedload(Application.candidate), joinedload(Application.job))
        .where(Application.id == application_id)
    )
    if not application:
        raise not_found("Application not found")
    return application


def list_job_applications(db: Session, job_id: int) -> list[Application]:
    job_exists = db.scalar(select(Job.id).where(Job.id == job_id))
    if not job_exists:
        raise not_found("Job not found")

    return list(
        db.scalars(
            select(Application)
            .options(joinedload(Application.candidate), joinedload(Application.job))
            .where(Application.job_id == job_id)
            .order_by(Application.created_at.desc())
        )
    )


def create_application(db: Session, payload: ApplicationCreate) -> Application:
    job = db.scalar(select(Job).where(Job.id == payload.job_id))
    if not job:
        raise not_found("Job not found")
    if job.status != JobStatus.OPEN:
        raise bad_request("This job is closed and no longer accepts applications")

    candidate = get_or_create_candidate(
        db,
        name=payload.name,
        email=str(payload.email),
    )
    application = Application(
        candidate_id=candidate.id,
        job_id=job.id,
        resume_url=str(payload.resume_url),
    )
    db.add(application)

    try:
        db.commit()
    except IntegrityError as exc:
        db.rollback()
        raise conflict("Candidate has already applied to this job") from exc

    return get_application(db, application.id)


def update_application_status(
    db: Session,
    application_id: int,
    status: ApplicationStatus,
) -> Application:
    application = get_application(db, application_id)
    application.status = status
    db.commit()
    db.refresh(application)
    return get_application(db, application.id)
