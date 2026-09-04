from sqlalchemy.orm import Session
from ..models.models import Notification, NotificationType


def create_notification(
    db: Session,
    user_id: int,
    title: str,
    message: str,
    notification_type: NotificationType = NotificationType.SYSTEM,
    link: str = None
) -> Notification:
    """Create and store a notification for a user."""
    notification = Notification(
        user_id=user_id,
        title=title,
        message=message,
        type=notification_type,
        link=link
    )
    db.add(notification)
    db.commit()
    db.refresh(notification)
    return notification


def notify_application_received(db: Session, farmer_id: int, worker_name: str, job_title: str, job_id: int):
    """Notify farmer that a worker has applied to their job."""
    create_notification(
        db=db,
        user_id=farmer_id,
        title="New Application Received",
        message=f"{worker_name} has applied for your job: {job_title}",
        notification_type=NotificationType.APPLICATION_RECEIVED,
        link=f"/farmer/jobs/{job_id}/applications"
    )


def notify_application_accepted(db: Session, worker_id: int, job_title: str, job_id: int):
    """Notify worker that their application was accepted."""
    create_notification(
        db=db,
        user_id=worker_id,
        title="Application Accepted! 🎉",
        message=f"Your application for '{job_title}' has been accepted!",
        notification_type=NotificationType.APPLICATION_ACCEPTED,
        link=f"/jobs/{job_id}"
    )


def notify_application_rejected(db: Session, worker_id: int, job_title: str, job_id: int):
    """Notify worker that their application was rejected."""
    create_notification(
        db=db,
        user_id=worker_id,
        title="Application Update",
        message=f"Your application for '{job_title}' was not selected this time.",
        notification_type=NotificationType.APPLICATION_REJECTED,
        link=f"/worker/applications"
    )


def notify_job_status_changed(db: Session, user_id: int, job_title: str, new_status: str, job_id: int):
    """Notify user about a job status change."""
    status_messages = {
        "worker_selected": f"Workers have been selected for '{job_title}'",
        "in_progress": f"Work has started on '{job_title}'",
        "completed": f"'{job_title}' has been marked as completed",
        "cancelled": f"'{job_title}' has been cancelled",
    }
    create_notification(
        db=db,
        user_id=user_id,
        title="Job Status Updated",
        message=status_messages.get(new_status, f"Status of '{job_title}' changed to {new_status}"),
        notification_type=NotificationType.JOB_STATUS_CHANGED,
        link=f"/jobs/{job_id}"
    )


def notify_new_message(db: Session, receiver_id: int, sender_name: str, job_title: str, job_id: int):
    """Notify user about a new message."""
    create_notification(
        db=db,
        user_id=receiver_id,
        title="New Message",
        message=f"{sender_name} sent you a message about '{job_title}'",
        notification_type=NotificationType.NEW_MESSAGE,
        link=f"/messages/{job_id}"
    )


def notify_new_review(db: Session, user_id: int, reviewer_name: str, rating: int):
    """Notify user about a new review received."""
    create_notification(
        db=db,
        user_id=user_id,
        title="New Review Received",
        message=f"{reviewer_name} gave you a {rating}-star review!",
        notification_type=NotificationType.NEW_REVIEW,
        link=f"/profile"
    )
