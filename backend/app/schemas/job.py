from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from .user import UserResponse


class JobCreate(BaseModel):
    title: str
    description: Optional[str] = None
    work_type: Optional[str] = "other"
    wage: float
    wage_type: Optional[str] = "per_day"
    duration_days: Optional[int] = None
    duration_hours: Optional[int] = None
    workers_needed: Optional[int] = 1
    start_date: Optional[str] = None
    start_time: Optional[str] = None
    location_string: Optional[str] = None
    location_lat: Optional[float] = None
    location_lon: Optional[float] = None
    additional_requirements: Optional[str] = None


class JobUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    work_type: Optional[str] = None
    wage: Optional[float] = None
    wage_type: Optional[str] = None
    duration_days: Optional[int] = None
    duration_hours: Optional[int] = None
    workers_needed: Optional[int] = None
    start_date: Optional[str] = None
    start_time: Optional[str] = None
    location_string: Optional[str] = None
    location_lat: Optional[float] = None
    location_lon: Optional[float] = None
    additional_requirements: Optional[str] = None


class JobResponse(BaseModel):
    id: int
    farmer_id: int
    title: str
    description: Optional[str] = None
    work_type: Optional[str] = None
    wage: float
    wage_type: Optional[str] = "per_day"
    duration_days: Optional[int] = None
    duration_hours: Optional[int] = None
    workers_needed: int = 1
    workers_selected: int = 0
    start_date: Optional[str] = None
    start_time: Optional[str] = None
    location_string: Optional[str] = None
    location_lat: Optional[float] = None
    location_lon: Optional[float] = None
    additional_requirements: Optional[str] = None
    total_applications: int = 0
    status: str
    created_at: Optional[datetime] = None
    farmer: Optional[UserResponse] = None
    distance_km: Optional[float] = None  # computed field, not in DB

    class Config:
        from_attributes = True


class JobStatusUpdate(BaseModel):
    status: str


class JobSearchParams(BaseModel):
    work_type: Optional[str] = None
    min_wage: Optional[float] = None
    max_wage: Optional[float] = None
    location_lat: Optional[float] = None
    location_lon: Optional[float] = None
    radius_km: Optional[int] = 50
    start_date: Optional[str] = None
    status: Optional[str] = "open"
    search: Optional[str] = None
    page: Optional[int] = 1
    limit: Optional[int] = 20
