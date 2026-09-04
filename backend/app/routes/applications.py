from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session, joinedload
from ..database.database import get_db
from ..models.models import (
    User, Job, Application, ApplicationStatus, Assignment, AssignmentStatus,
    JobStatus, UserRole
)
from ..schemas.application import ApplicationCreate, ApplicationAction, ApplicationResponse
from ..middleware.auth import get_current_user, require_farmer, require_worker
from ..services.notification_service import (
    notify_application_received, notify_application_accepted, notify_application_rejected
)

router = APIRouter(prefix="/api/applications", tags=["Applications"])


@router.post("", response_model=ApplicationResponse)
def apply_for_job(
    app_data: ApplicationCreate,
    current_user: User = Depends(require_worker),
    db: Session = Depends(get_db)
):
    """Apply for a job (worker only)."""

    # Check job exists and is open
    job = db.query(Job).filter(Job.id == app_data.job_id).first()
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    if job.status != JobStatus.OPEN:
        raise HTTPException(status_code=400, detail="This job is no longer accepting applications")

    # Check if already applied
    existing = db.query(Application).filter(
        Application.job_id == app_data.job_id,
        Application.worker_id == current_user.id
    ).first()
    if existing:
        raise HTTPException(status_code=400, detail="You have already applied for this job")

    # Create application
    application = Application(
        job_id=app_data.job_id,
        worker_id=current_user.id,
        cover_note=app_data.cover_note
    )
    db.add(application)

    # Update job application count
    job.total_applications = (job.total_applications or 0) + 1
    db.commit()
    db.refresh(application)

    # Notify farmer
    notify_application_received(db, job.farmer_id, current_user.name, job.title, job.id)

    return ApplicationResponse.model_validate(application)


@router.get("/my-applications", response_model=list[ApplicationResponse])
def get_my_applications(
    current_user: User = Depends(require_worker),
    db: Session = Depends(get_db)
):
    """Get all applications submitted by the current worker."""
    applications = db.query(Application).options(
        joinedload(Application.job).joinedload(Job.farmer)
    ).filter(
        Application.worker_id == current_user.id
    ).order_by(Application.created_at.desc()).all()

    return [ApplicationResponse.model_validate(a) for a in applications]


@router.get("/job/{job_id}", response_model=list[ApplicationResponse])
def get_job_applications(
    job_id: int,
    current_user: User = Depends(require_farmer),
    db: Session = Depends(get_db)
):
    """Get all applications for a specific job (farmer owner only)."""

    # Verify the farmer owns this job
    job = db.query(Job).filter(
        Job.id == job_id,
        Job.farmer_id == current_user.id
    ).first()
    if not job:
        raise HTTPException(status_code=404, detail="Job not found or not authorized")

    applications = db.query(Application).options(
        joinedload(Application.worker)
    ).filter(
        Application.job_id == job_id
    ).order_by(Application.created_at.desc()).all()

    return [ApplicationResponse.model_validate(a) for a in applications]


@router.put("/{application_id}/action", response_model=ApplicationResponse)
def handle_application(
    application_id: int,
    action_data: ApplicationAction,
    current_user: User = Depends(require_farmer),
    db: Session = Depends(get_db)
):
    """Accept or reject an application (farmer only)."""

    application = db.query(Application).options(
        joinedload(Application.job),
        joinedload(Application.worker)
    ).filter(
        Application.id == application_id
    ).first()

    if not application:
        raise HTTPException(status_code=404, detail="Application not found")

    # Verify farmer owns the job
    if application.job.farmer_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized")

    if application.status != ApplicationStatus.PENDING:
        raise HTTPException(status_code=400, detail="Application already processed")

    if action_data.action == "accept":
        application.status = ApplicationStatus.ACCEPTED

        # Create assignment
        assignment = Assignment(
            job_id=application.job_id,
            worker_id=application.worker_id,
            status=AssignmentStatus.ASSIGNED
        )
        db.add(assignment)

        # Update job workers_selected count
        application.job.workers_selected = (application.job.workers_selected or 0) + 1

        # If enough workers selected, update job status
        if application.job.workers_selected >= application.job.workers_needed:
            application.job.status = JobStatus.WORKER_SELECTED

        # Notify worker
        notify_application_accepted(db, application.worker_id, application.job.title, application.job_id)

    elif action_data.action == "reject":
        application.status = ApplicationStatus.REJECTED
        notify_application_rejected(db, application.worker_id, application.job.title, application.job_id)

    else:
        raise HTTPException(status_code=400, detail="Action must be 'accept' or 'reject'")

    db.commit()
    db.refresh(application)

    return ApplicationResponse.model_validate(application)
