import csv
from io import StringIO

from fastapi import APIRouter, Depends, Query, status
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.application import ApplicationStatus
from app.schemas.application import (
    ApplicationCreate,
    ApplicationDetail,
    ApplicationPage,
    ApplicationStatusUpdate,
)
from app.services.applications import (
    create_application,
    get_application,
    list_applications,
    list_applications_for_export,
    update_application_status,
)
from app.utils.exceptions import bad_request

router = APIRouter(prefix="/applications", tags=["Applications"])


def parse_application_status(value: str | None) -> ApplicationStatus | None:
    if value is None:
        return None
    normalized = value.strip().lower()
    for status_value in ApplicationStatus:
        if normalized in {status_value.value.lower(), status_value.name.lower()}:
            return status_value
    raise bad_request("Invalid application status filter")


@router.post("", response_model=ApplicationDetail, status_code=status.HTTP_201_CREATED)
def create_application_endpoint(payload: ApplicationCreate, db: Session = Depends(get_db)):
    return create_application(db, payload)


@router.get("", response_model=ApplicationPage)
def list_applications_endpoint(
    status_filter: str | None = Query(default=None, alias="status"),
    email: str | None = Query(default=None),
    job_id: int | None = Query(default=None),
    page: int = Query(default=1, ge=1),
    size: int = Query(default=10, ge=1, le=100),
    db: Session = Depends(get_db),
):
    items, total = list_applications(
        db,
        status=parse_application_status(status_filter),
        email=email,
        job_id=job_id,
        page=page,
        size=size,
    )
    return {"total": total, "page": page, "size": size, "items": items}


@router.get("/export")
def export_applications_endpoint(
    status_filter: str | None = Query(default=None, alias="status"),
    email: str | None = Query(default=None),
    job_id: int | None = Query(default=None),
    db: Session = Depends(get_db),
):
    applications = list_applications_for_export(
        db,
        status=parse_application_status(status_filter),
        email=email,
        job_id=job_id,
    )
    output = StringIO()
    writer = csv.writer(output)
    writer.writerow(
        [
            "application_id",
            "candidate_name",
            "candidate_email",
            "job_title",
            "job_location",
            "resume_url",
            "status",
            "applied_at",
        ]
    )
    for application in applications:
        writer.writerow(
            [
                application.id,
                application.candidate.name,
                application.candidate.email,
                application.job.title,
                application.job.location,
                application.resume_url,
                application.status.value,
                application.created_at.isoformat(),
            ]
        )

    output.seek(0)
    return StreamingResponse(
        iter([output.getvalue()]),
        media_type="text/csv",
        headers={"Content-Disposition": "attachment; filename=applications.csv"},
    )


@router.get("/{application_id}", response_model=ApplicationDetail)
def get_application_endpoint(application_id: int, db: Session = Depends(get_db)):
    return get_application(db, application_id)


@router.patch("/{application_id}", response_model=ApplicationDetail)
def update_application_status_endpoint(
    application_id: int,
    payload: ApplicationStatusUpdate,
    db: Session = Depends(get_db),
):
    return update_application_status(db, application_id, payload.status)
