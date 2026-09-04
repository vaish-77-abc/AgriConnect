from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime


# ─── Auth Schemas ─────────────────────────────────────────────────────────────

class UserCreate(BaseModel):
    email: EmailStr
    password: str
    name: str
    role: str  # "farmer" or "worker"
    phone: Optional[str] = None


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: "UserResponse"


# ─── User Schemas ─────────────────────────────────────────────────────────────

class UserResponse(BaseModel):
    id: int
    email: str
    name: str
    role: str
    phone: Optional[str] = None
    profile_photo: Optional[str] = None
    bio: Optional[str] = None
    location_string: Optional[str] = None
    location_lat: Optional[float] = None
    location_lon: Optional[float] = None
    avg_rating: float = 0.0
    total_reviews: int = 0
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class UserUpdate(BaseModel):
    name: Optional[str] = None
    phone: Optional[str] = None
    bio: Optional[str] = None
    location_string: Optional[str] = None
    location_lat: Optional[float] = None
    location_lon: Optional[float] = None
    profile_photo: Optional[str] = None


# ─── Farmer Profile Schemas ──────────────────────────────────────────────────

class FarmerProfileCreate(BaseModel):
    farm_name: Optional[str] = None
    farm_size: Optional[str] = None
    crops_grown: Optional[str] = None
    farm_address: Optional[str] = None
    farm_description: Optional[str] = None


class FarmerProfileResponse(BaseModel):
    id: int
    user_id: int
    farm_name: Optional[str] = None
    farm_size: Optional[str] = None
    crops_grown: Optional[str] = None
    farm_address: Optional[str] = None
    farm_description: Optional[str] = None
    total_jobs_posted: int = 0
    total_jobs_completed: int = 0
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True


# ─── Worker Profile Schemas ──────────────────────────────────────────────────

class WorkerProfileCreate(BaseModel):
    skills: Optional[list] = None
    work_types: Optional[list] = None
    experience_years: Optional[int] = 0
    experience_description: Optional[str] = None
    availability: Optional[str] = "available"
    preferred_work_radius_km: Optional[int] = 25
    daily_wage_expectation: Optional[float] = None


class WorkerProfileResponse(BaseModel):
    id: int
    user_id: int
    skills: Optional[list] = None
    work_types: Optional[list] = None
    experience_years: int = 0
    experience_description: Optional[str] = None
    availability: str = "available"
    preferred_work_radius_km: int = 25
    daily_wage_expectation: Optional[float] = None
    total_jobs_completed: int = 0
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True


# ─── Full Profile (User + Role Profile) ──────────────────────────────────────

class FullUserProfile(BaseModel):
    user: UserResponse
    farmer_profile: Optional[FarmerProfileResponse] = None
    worker_profile: Optional[WorkerProfileResponse] = None
