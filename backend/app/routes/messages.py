from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session, joinedload
from sqlalchemy import or_, and_, func
from ..database.database import get_db
from ..models.models import User, Message, Job, Assignment
from ..schemas.message import MessageCreate, MessageResponse, ConversationSummary
from ..middleware.auth import get_current_user
from ..services.notification_service import notify_new_message

router = APIRouter(prefix="/api/messages", tags=["Messages"])


@router.post("", response_model=MessageResponse)
def send_message(
    msg_data: MessageCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Send a message to another user about a specific job."""

    # Verify job exists
    job = db.query(Job).filter(Job.id == msg_data.job_id).first()
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")

    # Verify sender is involved in the job (farmer or assigned worker)
    is_farmer = job.farmer_id == current_user.id
    is_worker = db.query(Assignment).filter(
        Assignment.job_id == msg_data.job_id,
        Assignment.worker_id == current_user.id
    ).first() is not None

    if not is_farmer and not is_worker:
        raise HTTPException(
            status_code=403,
            detail="You can only message about jobs you are involved in"
        )

    # Create message
    message = Message(
        sender_id=current_user.id,
        receiver_id=msg_data.receiver_id,
        job_id=msg_data.job_id,
        content=msg_data.content
    )
    db.add(message)
    db.commit()
    db.refresh(message)

    # Notify receiver
    notify_new_message(db, msg_data.receiver_id, current_user.name, job.title, job.id)

    return MessageResponse.model_validate(message)


@router.get("/conversations", response_model=list[ConversationSummary])
def get_conversations(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get all conversation threads for the current user."""

    # Get all messages involving this user
    messages = db.query(Message).filter(
        or_(
            Message.sender_id == current_user.id,
            Message.receiver_id == current_user.id
        )
    ).order_by(Message.created_at.desc()).all()

    # Group by (job_id, other_user_id)
    conversations = {}
    for msg in messages:
        other_user_id = msg.receiver_id if msg.sender_id == current_user.id else msg.sender_id
        key = (msg.job_id, other_user_id)

        if key not in conversations:
            other_user = db.query(User).filter(User.id == other_user_id).first()
            job = db.query(Job).filter(Job.id == msg.job_id).first()

            # Count unread messages from the other user
            unread = db.query(Message).filter(
                Message.job_id == msg.job_id,
                Message.sender_id == other_user_id,
                Message.receiver_id == current_user.id,
                Message.is_read == False
            ).count()

            conversations[key] = ConversationSummary(
                job_id=msg.job_id,
                job_title=job.title if job else "Unknown Job",
                other_user=other_user,
                last_message=msg.content,
                last_message_at=msg.created_at,
                unread_count=unread
            )

    return list(conversations.values())


@router.get("/{job_id}/{other_user_id}", response_model=list[MessageResponse])
def get_conversation(
    job_id: int,
    other_user_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get all messages in a conversation about a specific job."""

    messages = db.query(Message).options(
        joinedload(Message.sender)
    ).filter(
        Message.job_id == job_id,
        or_(
            and_(Message.sender_id == current_user.id, Message.receiver_id == other_user_id),
            and_(Message.sender_id == other_user_id, Message.receiver_id == current_user.id),
        )
    ).order_by(Message.created_at.asc()).all()

    # Mark incoming messages as read
    for msg in messages:
        if msg.receiver_id == current_user.id and not msg.is_read:
            msg.is_read = True
    db.commit()

    return [MessageResponse.model_validate(m) for m in messages]
