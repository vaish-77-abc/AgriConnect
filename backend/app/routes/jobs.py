from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session, joinedload
from sqlalchemy import or_
from ..database.database import get_db
from ..models.models import User, Job, JobStatus, WorkType, FarmerProfile
from ..schemas.job import JobCreate, JobUpdate, JobResponse, JobStatusUpdate
from ..middleware.auth import get_current_user, require_farmer
from ..services.location_service import haversine_distance, sort_jobs_by_distance, filter_jobs_by_radius

router = APIRouter(prefix="/api/jobs", tags=["Jobs"])


@router.post("", response_model=JobResponse)
def create_job(
    job_data: JobCreate,
    current_user: User = Depends(require_farmer),
    db: Session = Depends(get_db)
):
    """Create a new job posting (farmer only)."""
    new_job = Job(
        farmer_id=current_user.id,
        title=job_data.title,
        description=job_data.description,
        work_type=WorkType(job_data.work_type) if job_data.work_type else WorkType.OTHER,
        wage=job_data.wage,
        wage_type=job_data.wage_type,
        duration_days=job_data.duration_days,
        duration_hours=job_data.duration_hours,
        workers_needed=job_data.workers_needed,
        start_date=job_data.start_date,
        start_time=job_data.start_time,
        location_string=job_data.location_string,
        location_lat=job_data.location_lat,
        location_lon=job_data.location_lon,
        additional_requirements=job_data.additional_requirements,
    )
    db.add(new_job)

    # Update farmer's job count
    farmer_profile = db.query(FarmerProfile).filter(
        FarmerProfile.user_id == current_user.id
    ).first()
    if farmer_profile:
        farmer_profile.total_jobs_posted = (farmer_profile.total_jobs_posted or 0) + 1

    db.commit()
    db.refresh(new_job)
    return JobResponse.model_validate(new_job)


@router.get("", response_model=list[JobResponse])
def search_jobs(
    work_type: str = Query(None),
    min_wage: float = Query(None),
    max_wage: float = Query(None),
    location_lat: float = Query(None),
    location_lon: float = Query(None),
    radius_km: int = Query(50),
    start_date: str = Query(None),
    job_status: str = Query("open"),
    search: str = Query(None),
    page: int = Query(1),
    limit: int = Query(20),
    db: Session = Depends(get_db)
):
    """Search and filter jobs. Supports location-based sorting."""

    query = db.query(Job).options(joinedload(Job.farmer))

    # Filter by status
    if job_status:
        try:
            query = query.filter(Job.status == JobStatus(job_status))
        except ValueError:
            pass

    # Filter by work type
    if work_type:
        try:
            query = query.filter(Job.work_type == WorkType(work_type))
        except ValueError:
            pass

    # Filter by wage range
    if min_wage is not None:
        query = query.filter(Job.wage >= min_wage)
    if max_wage is not None:
        query = query.filter(Job.wage <= max_wage)

    # Filter by start date
    if start_date:
        query = query.filter(Job.start_date >= start_date)

    # Text search
    if search:
        search_term = f"%{search}%"
        query = query.filter(
            or_(
                Job.title.ilike(search_term),
                Job.description.ilike(search_term),
                Job.location_string.ilike(search_term),
            )
        )

    # Order by most recent
    query = query.order_by(Job.created_at.desc())

    # Pagination
    total = query.count()
    jobs = query.offset((page - 1) * limit).limit(limit).all()

    # Location-based filtering and sorting
    if location_lat is not None and location_lon is not None:
        jobs = filter_jobs_by_radius(jobs, location_lat, location_lon, radius_km)
        jobs = sort_jobs_by_distance(jobs, location_lat, location_lon)

    result = []
    for job in jobs:
        job_dict = JobResponse.model_validate(job)
        if hasattr(job, 'distance_km') and job.distance_km is not None:
            job_dict.distance_km = job.distance_km
        result.append(job_dict)

    return result


@router.get("/my-jobs", response_model=list[JobResponse])
def get_my_jobs(
    current_user: User = Depends(require_farmer),
    db: Session = Depends(get_db)
):
    """Get all jobs posted by the current farmer."""
    jobs = db.query(Job).filter(
        Job.farmer_id == current_user.id
    ).order_by(Job.created_at.desc()).all()

    return [JobResponse.model_validate(j) for j in jobs]


@router.get("/{job_id}", response_model=JobResponse)
def get_job(job_id: int, db: Session = Depends(get_db)):
    """Get detailed information about a specific job."""
    job = db.query(Job).options(
        joinedload(Job.farmer)
    ).filter(Job.id == job_id).first()

    if not job:
        raise HTTPException(status_code=404, detail="Job not found")

    return JobResponse.model_validate(job)


@router.put("/{job_id}", response_model=JobResponse)
def update_job(
    job_id: int,
    job_data: JobUpdate,
    current_user: User = Depends(require_farmer),
    db: Session = Depends(get_db)
):
    """Update a job posting (farmer owner only)."""
    job = db.query(Job).filter(
        Job.id == job_id,
        Job.farmer_id == current_user.id
    ).first()

    if not job:
        raise HTTPException(status_code=404, detail="Job not found or not authorized")

    update_dict = job_data.model_dump(exclude_unset=True)

    # Handle work_type enum conversion
    if "work_type" in update_dict and update_dict["work_type"]:
        try:
            update_dict["work_type"] = WorkType(update_dict["work_type"])
        except ValueError:
            update_dict["work_type"] = WorkType.OTHER

    for key, value in update_dict.items():
        setattr(job, key, value)

    db.commit()
    db.refresh(job)
    return JobResponse.model_validate(job)


@router.put("/{job_id}/status", response_model=JobResponse)
def update_job_status(
    job_id: int,
    status_data: JobStatusUpdate,
    current_user: User = Depends(require_farmer),
    db: Session = Depends(get_db)
):
    """Update a job's status (farmer owner only)."""
    job = db.query(Job).filter(
        Job.id == job_id,
        Job.farmer_id == current_user.id
    ).first()

    if not job:
        raise HTTPException(status_code=404, detail="Job not found or not authorized")

    try:
        new_status = JobStatus(status_data.status)
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid status")

    job.status = new_status

    # If completed, update farmer profile stats
    if new_status == JobStatus.COMPLETED:
        farmer_profile = db.query(FarmerProfile).filter(
            FarmerProfile.user_id == current_user.id
        ).first()
        if farmer_profile:
            farmer_profile.total_jobs_completed = (farmer_profile.total_jobs_completed or 0) + 1

    db.commit()
    db.refresh(job)

    # Notify assigned workers about status change
    from ..models.models import Assignment
    from ..services.notification_service import notify_job_status_changed
    assignments = db.query(Assignment).filter(Assignment.job_id == job_id).all()
    for assignment in assignments:
        notify_job_status_changed(db, assignment.worker_id, job.title, status_data.status, job_id)

    return JobResponse.model_validate(job)


@router.delete("/{job_id}")
def delete_job(
    job_id: int,
    current_user: User = Depends(require_farmer),
    db: Session = Depends(get_db)
):
    """Cancel/delete a job (farmer owner only). Sets status to cancelled."""
    job = db.query(Job).filter(
        Job.id == job_id,
        Job.farmer_id == current_user.id
    ).first()

    if not job:
        raise HTTPException(status_code=404, detail="Job not found or not authorized")

    job.status = JobStatus.CANCELLED
    db.commit()

    return {"message": "Job cancelled successfully"}
