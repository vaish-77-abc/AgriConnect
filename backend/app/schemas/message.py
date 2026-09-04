from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from .user import UserResponse


class MessageCreate(BaseModel):
    receiver_id: int
    job_id: int
    content: str


class MessageResponse(BaseModel):
    id: int
    sender_id: int
    receiver_id: int
    job_id: int
    content: str
    is_read: bool = False
    created_at: Optional[datetime] = None
    sender: Optional[UserResponse] = None

    class Config:
        from_attributes = True


class ConversationSummary(BaseModel):
    job_id: int
    job_title: str
    other_user: UserResponse
    last_message: Optional[str] = None
    last_message_at: Optional[datetime] = None
    unread_count: int = 0
