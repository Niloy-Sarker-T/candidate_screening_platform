from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.schemas.application import ApplicationCreate, ApplicationDetail, ApplicationStatusUpdate
from app.services.applications import create_application, get_application, update_application_status

router = APIRouter(prefix="/applications", tags=["Applications"])


@router.post("", response_model=ApplicationDetail, status_code=status.HTTP_201_CREATED)
def create_application_endpoint(payload: ApplicationCreate, db: Session = Depends(get_db)):
    return create_application(db, payload)


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
