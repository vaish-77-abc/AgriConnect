from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from ..core.security import decode_access_token
from ..database.database import get_db
from ..models.models import User, UserRole

# OAuth2 scheme — expects "Authorization: Bearer <token>" header
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/login")


async def get_current_user(
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db)
) -> User:
    """Extract and validate the current user from the JWT token."""
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )

    payload = decode_access_token(token)
    if payload is None:
        raise credentials_exception

    user_id: int = payload.get("sub")
    if user_id is None:
        raise credentials_exception

    user = db.query(User).filter(User.id == user_id).first()
    if user is None:
        raise credentials_exception

    return user


async def require_farmer(current_user: User = Depends(get_current_user)) -> User:
    """Dependency that ensures the current user is a farmer."""
    if current_user.role != UserRole.FARMER:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only farmers can access this resource"
        )
    return current_user


async def require_worker(current_user: User = Depends(get_current_user)) -> User:
    """Dependency that ensures the current user is a worker."""
    if current_user.role != UserRole.WORKER:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only workers can access this resource"
        )
    return current_user
