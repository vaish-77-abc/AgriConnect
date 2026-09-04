from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..database.database import get_db
from ..models.models import User, Review, Job, Assignment, AssignmentStatus
from ..schemas.review import ReviewCreate, ReviewResponse
from ..middleware.auth import get_current_user
from ..services.notification_service import notify_new_review

router = APIRouter(prefix="/api/reviews", tags=["Reviews"])


@router.post("", response_model=ReviewResponse)
def create_review(
    review_data: ReviewCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Submit a review for a user after job completion."""

    # Can't review yourself
    if review_data.reviewed_id == current_user.id:
        raise HTTPException(status_code=400, detail="Cannot review yourself")

    # Check job exists and is completed
    job = db.query(Job).filter(Job.id == review_data.job_id).first()
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    if job.status.value != "completed":
        raise HTTPException(status_code=400, detail="Can only review after job is completed")

    # Check the reviewer was involved in this job
    is_farmer = job.farmer_id == current_user.id
    is_worker = db.query(Assignment).filter(
        Assignment.job_id == review_data.job_id,
        Assignment.worker_id == current_user.id
    ).first() is not None

    if not is_farmer and not is_worker:
        raise HTTPException(status_code=403, detail="You were not involved in this job")

    # Check not already reviewed
    existing = db.query(Review).filter(
        Review.reviewer_id == current_user.id,
        Review.reviewed_id == review_data.reviewed_id,
        Review.job_id == review_data.job_id
    ).first()
    if existing:
        raise HTTPException(status_code=400, detail="You have already reviewed this user for this job")

    # Create review
    review = Review(
        reviewer_id=current_user.id,
        reviewed_id=review_data.reviewed_id,
        job_id=review_data.job_id,
        rating=review_data.rating,
        comment=review_data.comment
    )
    db.add(review)
    db.commit()
    db.refresh(review)

    # Update the reviewed user's average rating
    reviewed_user = db.query(User).filter(User.id == review_data.reviewed_id).first()
    if reviewed_user:
        all_reviews = db.query(Review).filter(
            Review.reviewed_id == review_data.reviewed_id
        ).all()
        if all_reviews:
            avg = sum(r.rating for r in all_reviews) / len(all_reviews)
            reviewed_user.avg_rating = round(avg, 1)
            reviewed_user.total_reviews = len(all_reviews)
            db.commit()

    # Notify the reviewed user
    notify_new_review(db, review_data.reviewed_id, current_user.name, review_data.rating)

    return ReviewResponse.model_validate(review)


@router.get("/job/{job_id}", response_model=list[ReviewResponse])
def get_job_reviews(job_id: int, db: Session = Depends(get_db)):
    """Get all reviews for a specific job."""
    reviews = db.query(Review).filter(
        Review.job_id == job_id
    ).order_by(Review.created_at.desc()).all()

    return [ReviewResponse.model_validate(r) for r in reviews]
