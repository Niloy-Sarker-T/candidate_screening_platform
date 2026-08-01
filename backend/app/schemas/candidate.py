from datetime import datetime

from pydantic import BaseModel, ConfigDict, EmailStr, Field


class CandidateRead(BaseModel):
    id: int
    name: str = Field(..., min_length=2, max_length=120)
    email: EmailStr
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
