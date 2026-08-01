from datetime import datetime

from pydantic import BaseModel, ConfigDict, EmailStr, Field, HttpUrl

from app.models.application import ApplicationStatus
from app.schemas.candidate import CandidateRead
from app.schemas.job import JobRead


class ApplicationCreate(BaseModel):
    job_id: int
    name: str = Field(..., min_length=2, max_length=120)
    email: EmailStr
    resume_url: HttpUrl


class ApplicationStatusUpdate(BaseModel):
    status: ApplicationStatus


class ApplicationRead(BaseModel):
    id: int
    candidate_id: int
    job_id: int
    resume_url: str
    status: ApplicationStatus
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class ApplicationDetail(ApplicationRead):
    candidate: CandidateRead
    job: JobRead
