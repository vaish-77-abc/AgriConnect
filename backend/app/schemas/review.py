from pydantic import BaseModel, field_validator
from typing import Optional
from datetime import datetime
from .user import UserResponse


class ReviewCreate(BaseModel):
    reviewed_id: int
    job_id: int
    rating: int
    comment: Optional[str] = None

    @field_validator("rating")
    @classmethod
    def validate_rating(cls, v):
        if v < 1 or v > 5:
            raise ValueError("Rating must be between 1 and 5")
        return v


class ReviewResponse(BaseModel):
    id: int
    reviewer_id: int
    reviewed_id: int
    job_id: int
    rating: int
    comment: Optional[str] = None
    created_at: Optional[datetime] = None
    reviewer: Optional[UserResponse] = None

    class Config:
        from_attributes = True
