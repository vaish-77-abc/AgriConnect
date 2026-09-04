from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from ..database.database import get_db
from ..models.models import User, UserRole, FarmerProfile, WorkerProfile
from ..schemas.user import UserCreate, UserLogin, Token, UserResponse
from ..core.security import hash_password, verify_password, create_access_token
from ..middleware.auth import get_current_user

router = APIRouter(prefix="/api/auth", tags=["Authentication"])


@router.post("/register", response_model=Token)
def register(user_data: UserCreate, db: Session = Depends(get_db)):
    """Register a new user (farmer or worker)."""

    # Check if email already exists
    existing_user = db.query(User).filter(User.email == user_data.email).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )

    # Validate role
    if user_data.role not in ["farmer", "worker"]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Role must be 'farmer' or 'worker'"
        )

    # Create user
    new_user = User(
        email=user_data.email,
        hashed_password=hash_password(user_data.password),
        name=user_data.name,
        role=UserRole(user_data.role),
        phone=user_data.phone,
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    # Auto-create the role-specific profile
    if new_user.role == UserRole.FARMER:
        farmer_profile = FarmerProfile(user_id=new_user.id)
        db.add(farmer_profile)
    else:
        worker_profile = WorkerProfile(user_id=new_user.id)
        db.add(worker_profile)
    db.commit()

    # Generate JWT token
    access_token = create_access_token(data={"sub": new_user.id})

    return Token(
        access_token=access_token,
        user=UserResponse.model_validate(new_user)
    )


@router.post("/login", response_model=Token)
def login(credentials: UserLogin, db: Session = Depends(get_db)):
    """Login with email and password."""

    user = db.query(User).filter(User.email == credentials.email).first()
    if not user or not verify_password(credentials.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )

    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Account is deactivated"
        )

    access_token = create_access_token(data={"sub": user.id})

    return Token(
        access_token=access_token,
        user=UserResponse.model_validate(user)
    )


@router.get("/me", response_model=UserResponse)
def get_me(current_user: User = Depends(get_current_user)):
    """Get the current authenticated user's info."""
    return UserResponse.model_validate(current_user)
