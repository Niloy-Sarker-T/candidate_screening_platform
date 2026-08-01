from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field

from app.models.job import EmploymentType, JobStatus


class JobBase(BaseModel):
    title: str = Field(..., min_length=2, max_length=150)
    description: str = Field(..., min_length=10)
    location: str = Field(..., min_length=2, max_length=120)
    employment_type: EmploymentType


class JobCreate(JobBase):
    pass


class JobUpdate(JobBase):
    status: JobStatus | None = None


class JobRead(JobBase):
    id: int
    status: JobStatus
    created_at: datetime
    updated_at: datetime
    application_count: int = 0

    model_config = ConfigDict(from_attributes=True)
