from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from ..database.database import get_db
from ..models.models import User, UserRole, FarmerProfile, WorkerProfile, Review
from ..schemas.user import (
    UserResponse, UserUpdate, FarmerProfileCreate, FarmerProfileResponse,
    WorkerProfileCreate, WorkerProfileResponse, FullUserProfile
)
from ..schemas.review import ReviewResponse
from ..middleware.auth import get_current_user

router = APIRouter(prefix="/api/users", tags=["Users"])


@router.get("/{user_id}", response_model=FullUserProfile)
def get_user_profile(user_id: int, db: Session = Depends(get_db)):
    """Get a user's public profile."""
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    result = {"user": user}

    if user.role == UserRole.FARMER:
        result["farmer_profile"] = db.query(FarmerProfile).filter(
            FarmerProfile.user_id == user_id
        ).first()
    else:
        result["worker_profile"] = db.query(WorkerProfile).filter(
            WorkerProfile.user_id == user_id
        ).first()

    return result


@router.put("/profile", response_model=UserResponse)
def update_profile(
    update_data: UserUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Update the current user's basic profile information."""
    update_dict = update_data.model_dump(exclude_unset=True)

    for key, value in update_dict.items():
        setattr(current_user, key, value)

    db.commit()
    db.refresh(current_user)
    return UserResponse.model_validate(current_user)


@router.post("/farmer-profile", response_model=FarmerProfileResponse)
def update_farmer_profile(
    profile_data: FarmerProfileCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Create or update the farmer-specific profile."""
    if current_user.role != UserRole.FARMER:
        raise HTTPException(status_code=403, detail="Only farmers can update farmer profile")

    profile = db.query(FarmerProfile).filter(
        FarmerProfile.user_id == current_user.id
    ).first()

    if not profile:
        profile = FarmerProfile(user_id=current_user.id)
        db.add(profile)

    update_dict = profile_data.model_dump(exclude_unset=True)
    for key, value in update_dict.items():
        setattr(profile, key, value)

    db.commit()
    db.refresh(profile)
    return FarmerProfileResponse.model_validate(profile)


@router.post("/worker-profile", response_model=WorkerProfileResponse)
def update_worker_profile(
    profile_data: WorkerProfileCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Create or update the worker-specific profile."""
    if current_user.role != UserRole.WORKER:
        raise HTTPException(status_code=403, detail="Only workers can update worker profile")

    profile = db.query(WorkerProfile).filter(
        WorkerProfile.user_id == current_user.id
    ).first()

    if not profile:
        profile = WorkerProfile(user_id=current_user.id)
        db.add(profile)

    update_dict = profile_data.model_dump(exclude_unset=True)
    for key, value in update_dict.items():
        setattr(profile, key, value)

    db.commit()
    db.refresh(profile)
    return WorkerProfileResponse.model_validate(profile)


@router.get("/{user_id}/reviews", response_model=list[ReviewResponse])
def get_user_reviews(user_id: int, db: Session = Depends(get_db)):
    """Get all reviews received by a user."""
    reviews = db.query(Review).filter(
        Review.reviewed_id == user_id
    ).order_by(Review.created_at.desc()).all()

    return [ReviewResponse.model_validate(r) for r in reviews]
