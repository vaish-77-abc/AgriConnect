from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from .user import UserResponse
from .job import JobResponse


class ApplicationCreate(BaseModel):
    job_id: int
    cover_note: Optional[str] = None


class ApplicationAction(BaseModel):
    action: str  # "accept" or "reject"


class ApplicationResponse(BaseModel):
    id: int
    job_id: int
    worker_id: int
    cover_note: Optional[str] = None
    status: str
    created_at: Optional[datetime] = None
    worker: Optional[UserResponse] = None
    job: Optional[JobResponse] = None

    class Config:
        from_attributes = True
