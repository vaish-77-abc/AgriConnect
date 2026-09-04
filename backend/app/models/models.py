from sqlalchemy import Column, Integer, String, Float, ForeignKey, DateTime, Text, Enum, Boolean, JSON
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import enum
from ..database.database import Base


# ─── Enums ────────────────────────────────────────────────────────────────────

class UserRole(str, enum.Enum):
    FARMER = "farmer"
    WORKER = "worker"


class JobStatus(str, enum.Enum):
    OPEN = "open"
    WORKER_SELECTED = "worker_selected"
    IN_PROGRESS = "in_progress"
    COMPLETED = "completed"
    CANCELLED = "cancelled"


class ApplicationStatus(str, enum.Enum):
    PENDING = "pending"
    ACCEPTED = "accepted"
    REJECTED = "rejected"
    WITHDRAWN = "withdrawn"


class AssignmentStatus(str, enum.Enum):
    ASSIGNED = "assigned"
    IN_PROGRESS = "in_progress"
    COMPLETED = "completed"
    CANCELLED = "cancelled"


class WorkType(str, enum.Enum):
    HARVESTING = "harvesting"
    PLANTING = "planting"
    IRRIGATION = "irrigation"
    WEEDING = "weeding"
    PLOWING = "plowing"
    FERTILIZING = "fertilizing"
    SPRAYING = "spraying"
    LIVESTOCK = "livestock"
    DAIRY = "dairy"
    POULTRY = "poultry"
    FRUIT_PICKING = "fruit_picking"
    VEGETABLE_FARMING = "vegetable_farming"
    SUGARCANE = "sugarcane"
    RICE_FARMING = "rice_farming"
    COTTON_FARMING = "cotton_farming"
    EQUIPMENT_OPERATION = "equipment_operation"
    MAINTENANCE = "maintenance"
    LOADING_UNLOADING = "loading_unloading"
    OTHER = "other"


class NotificationType(str, enum.Enum):
    APPLICATION_RECEIVED = "application_received"
    APPLICATION_ACCEPTED = "application_accepted"
    APPLICATION_REJECTED = "application_rejected"
    JOB_STATUS_CHANGED = "job_status_changed"
    NEW_MESSAGE = "new_message"
    NEW_REVIEW = "new_review"
    JOB_REMINDER = "job_reminder"
    SYSTEM = "system"


# ─── Models ───────────────────────────────────────────────────────────────────

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    role = Column(Enum(UserRole), nullable=False)
    name = Column(String, nullable=False)
    phone = Column(String, nullable=True)
    profile_photo = Column(String, nullable=True)  # file path
    bio = Column(Text, nullable=True)
    location_string = Column(String, nullable=True)
    location_lat = Column(Float, nullable=True)
    location_lon = Column(Float, nullable=True)
    avg_rating = Column(Float, default=0.0)
    total_reviews = Column(Integer, default=0)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationships
    farmer_profile = relationship("FarmerProfile", back_populates="user", uselist=False)
    worker_profile = relationship("WorkerProfile", back_populates="user", uselist=False)
    jobs_posted = relationship("Job", back_populates="farmer", foreign_keys="[Job.farmer_id]")
    applications = relationship("Application", back_populates="worker", foreign_keys="[Application.worker_id]")
    assignments = relationship("Assignment", back_populates="worker", foreign_keys="[Assignment.worker_id]")
    notifications = relationship("Notification", back_populates="user", foreign_keys="[Notification.user_id]")
    reviews_given = relationship("Review", back_populates="reviewer", foreign_keys="[Review.reviewer_id]")
    reviews_received = relationship("Review", back_populates="reviewed", foreign_keys="[Review.reviewed_id]")
    messages_sent = relationship("Message", back_populates="sender", foreign_keys="[Message.sender_id]")
    messages_received = relationship("Message", back_populates="receiver", foreign_keys="[Message.receiver_id]")


class FarmerProfile(Base):
    __tablename__ = "farmer_profiles"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True, nullable=False)
    farm_name = Column(String, nullable=True)
    farm_size = Column(String, nullable=True)  # e.g. "5 acres"
    crops_grown = Column(String, nullable=True)  # comma-separated
    farm_address = Column(String, nullable=True)
    farm_description = Column(Text, nullable=True)
    total_jobs_posted = Column(Integer, default=0)
    total_jobs_completed = Column(Integer, default=0)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    user = relationship("User", back_populates="farmer_profile")


class WorkerProfile(Base):
    __tablename__ = "worker_profiles"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True, nullable=False)
    skills = Column(JSON, nullable=True)  # list of skill strings
    work_types = Column(JSON, nullable=True)  # list of WorkType values they can do
    experience_years = Column(Integer, default=0)
    experience_description = Column(Text, nullable=True)
    availability = Column(String, default="available")  # available, busy, unavailable
    preferred_work_radius_km = Column(Integer, default=25)
    daily_wage_expectation = Column(Float, nullable=True)
    total_jobs_completed = Column(Integer, default=0)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    user = relationship("User", back_populates="worker_profile")


class Job(Base):
    __tablename__ = "jobs"

    id = Column(Integer, primary_key=True, index=True)
    farmer_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    title = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    work_type = Column(Enum(WorkType), default=WorkType.OTHER)
    wage = Column(Float, nullable=False)
    wage_type = Column(String, default="per_day")  # per_day, per_hour, fixed
    duration_days = Column(Integer, nullable=True)
    duration_hours = Column(Integer, nullable=True)
    workers_needed = Column(Integer, default=1)
    workers_selected = Column(Integer, default=0)

    # Schedule
    start_date = Column(String, nullable=True)  # ISO date string
    start_time = Column(String, nullable=True)  # e.g. "06:00"

    # Location for the job
    location_string = Column(String, nullable=True)
    location_lat = Column(Float, nullable=True)
    location_lon = Column(Float, nullable=True)

    # Additional info
    additional_requirements = Column(Text, nullable=True)
    total_applications = Column(Integer, default=0)

    status = Column(Enum(JobStatus), default=JobStatus.OPEN)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    farmer = relationship("User", back_populates="jobs_posted", foreign_keys=[farmer_id])
    applications = relationship("Application", back_populates="job")
    assignments = relationship("Assignment", back_populates="job")
    reviews = relationship("Review", back_populates="job")
    messages = relationship("Message", back_populates="job")


class Application(Base):
    __tablename__ = "applications"

    id = Column(Integer, primary_key=True, index=True)
    job_id = Column(Integer, ForeignKey("jobs.id"), nullable=False)
    worker_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    cover_note = Column(Text, nullable=True)
    status = Column(Enum(ApplicationStatus), default=ApplicationStatus.PENDING)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    job = relationship("Job", back_populates="applications")
    worker = relationship("User", back_populates="applications")


class Assignment(Base):
    """Tracks the confirmed worker-job relationship after acceptance."""
    __tablename__ = "assignments"

    id = Column(Integer, primary_key=True, index=True)
    job_id = Column(Integer, ForeignKey("jobs.id"), nullable=False)
    worker_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    status = Column(Enum(AssignmentStatus), default=AssignmentStatus.ASSIGNED)
    started_at = Column(DateTime(timezone=True), nullable=True)
    completed_at = Column(DateTime(timezone=True), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    job = relationship("Job", back_populates="assignments")
    worker = relationship("User", back_populates="assignments")


class Notification(Base):
    __tablename__ = "notifications"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    title = Column(String, nullable=False)
    message = Column(Text, nullable=False)
    type = Column(Enum(NotificationType), default=NotificationType.SYSTEM)
    is_read = Column(Boolean, default=False)
    link = Column(String, nullable=True)  # Frontend route to navigate to
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    user = relationship("User", back_populates="notifications")


class Review(Base):
    __tablename__ = "reviews"

    id = Column(Integer, primary_key=True, index=True)
    reviewer_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    reviewed_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    job_id = Column(Integer, ForeignKey("jobs.id"), nullable=False)
    rating = Column(Integer, nullable=False)  # 1-5 stars
    comment = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    reviewer = relationship("User", back_populates="reviews_given", foreign_keys=[reviewer_id])
    reviewed = relationship("User", back_populates="reviews_received", foreign_keys=[reviewed_id])
    job = relationship("Job", back_populates="reviews")


class Message(Base):
    __tablename__ = "messages"

    id = Column(Integer, primary_key=True, index=True)
    sender_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    receiver_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    job_id = Column(Integer, ForeignKey("jobs.id"), nullable=False)
    content = Column(Text, nullable=False)
    is_read = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    sender = relationship("User", back_populates="messages_sent", foreign_keys=[sender_id])
    receiver = relationship("User", back_populates="messages_received", foreign_keys=[receiver_id])
    job = relationship("Job", back_populates="messages")
