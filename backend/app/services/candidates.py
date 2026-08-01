from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.candidate import Candidate


def get_or_create_candidate(db: Session, *, name: str, email: str) -> Candidate:
    candidate = db.scalar(select(Candidate).where(Candidate.email == email.lower()))
    if candidate:
        if candidate.name != name:
            candidate.name = name
            db.flush()
        return candidate

    candidate = Candidate(name=name, email=email.lower())
    db.add(candidate)
    db.flush()
    return candidate
