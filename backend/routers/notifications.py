from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select
from typing import List, Optional, Dict, Any
from pydantic import BaseModel
from datetime import datetime, timedelta
from ..database import get_session
from ..models import Notification, Parent, Child, Activity, ActivityProgress, Progress, Achievement
from ..auth import get_current_user

router = APIRouter(prefix="/notifications", tags=["notifications"])

# Input Schema for creating notifications
class NotificationCreate(BaseModel):
    parent_id: int
    notification_type: str
    message: str
    scheduled_time: Optional[datetime] = None

# Input Schema for notification preferences
class NotificationPreferences(BaseModel):
    emailNotifications: bool = True
    pushNotifications: bool = False
    inAppNotifications: bool = True
    activityCompleted: bool = True
    achievementEarned: bool = True
    streakReminder: bool = True
    weeklyReport: bool = True
    assessmentAlert: bool = True
    dailyReminder: bool = False
    milestoneReached: bool = True
    dailyReminderTime: str = "16:00"
    weeklyReportDay: str = "Friday"
    digestMode: bool = False
    quietHoursEnabled: bool = False
    quietHoursStart: str = "20:00"
    quietHoursEnd: str = "08:00"

@router.get("/{parent_id}", response_model=List[Notification])
def get_notifications(parent_id: int, session: Session = Depends(get_session), current_user: Parent = Depends(get_current_user)):
    if parent_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized")
    statement = select(Notification).where(
        Notification.parent_id == parent_id
    ).order_by(Notification.sent_time.desc())
    return session.exec(statement).all()

@router.post("/{notification_id}/read")
def mark_read(notification_id: int, session: Session = Depends(get_session), current_user: Parent = Depends(get_current_user)):
    notification = session.get(Notification, notification_id)
    if not notification:
        raise HTTPException(status_code=404, detail="Notification not found")
    if notification.parent_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized")

    notification.is_read = True
    session.add(notification)
    session.commit()
    return {"ok": True}

@router.post("/create")
def create_notification(notification_data: NotificationCreate, session: Session = Depends(get_session)):
    """Create a new notification (manual or scheduled)"""
    parent = session.get(Parent, notification_data.parent_id)
    if not parent:
        raise HTTPException(status_code=404, detail="Parent not found")

    notification = Notification(
        parent_id=notification_data.parent_id,
        notification_type=notification_data.notification_type,
        message=notification_data.message,
        scheduled_time=notification_data.scheduled_time or datetime.now(),
        sent_time=notification_data.scheduled_time or datetime.now(),
        is_read=False
    )

    session.add(notification)
    session.commit()
    session.refresh(notification)

    return notification

@router.post("/{parent_id}/daily-reminder")
def create_daily_reminder(parent_id: int, session: Session = Depends(get_session)):
    """Create a daily practice reminder notification"""
    parent = session.get(Parent, parent_id)
    if not parent:
        raise HTTPException(status_code=404, detail="Parent not found")

    # Check if child has completed an activity today
    today = datetime.now().date()
    children = session.exec(select(Child).where(Child.parent_id == parent_id)).all()

    message = f"🌟 Time for daily learning! {parent.name}, don't forget to practice with your child today."

    if children:
        child_names = [child.name for child in children]
        if len(child_names) == 1:
            message = f"🌟 Time for {child_names[0]}'s learning adventure! A few activities today keeps the streak going!"
        else:
            message = f"🌟 Learning time! {', '.join(child_names[:-1])} and {child_names[-1]} are waiting for their activities."

    notification = Notification(
        parent_id=parent_id,
        notification_type="Reminder",
        message=message,
        scheduled_time=datetime.now(),
        sent_time=datetime.now(),
        is_read=False
    )

    session.add(notification)
    session.commit()
    session.refresh(notification)

    return notification

@router.post("/{parent_id}/streak-warning")
def create_streak_warning(parent_id: int, session: Session = Depends(get_session)):
    """Create a streak warning notification"""
    parent = session.get(Parent, parent_id)
    if not parent:
        raise HTTPException(status_code=404, detail="Parent not found")

    statement = select(Progress).where(Progress.parent_id == parent_id)
    progress = session.exec(statement).first()

    if not progress or progress.streak_days < 1:
        return {"message": "No active streak to warn about"}

    message = f"🔥 Keep the {progress.streak_days}-day streak alive! Complete an activity today to maintain it."

    notification = Notification(
        parent_id=parent_id,
        notification_type="Alert",
        message=message,
        scheduled_time=datetime.now(),
        sent_time=datetime.now(),
        is_read=False
    )

    session.add(notification)
    session.commit()
    session.refresh(notification)

    return notification

@router.post("/{parent_id}/weekly-report")
def create_weekly_report_notification(parent_id: int, session: Session = Depends(get_session)):
    """Create a weekly report notification"""
    parent = session.get(Parent, parent_id)
    if not parent:
        raise HTTPException(status_code=404, detail="Parent not found")

    # Get stats
    children = session.exec(select(Child).where(Child.parent_id == parent_id)).all()

    total_activities = 0
    for child in children:
        statement = select(ActivityProgress).join(Activity).where(
            Activity.child_id == child.id,
            ActivityProgress.completion_status == "Completed"
        )
        activities = session.exec(statement).all()
        total_activities += len(activities)

    message = f"📊 Weekly Report Ready! Your child completed {total_activities} activities this week. Check the dashboard for detailed insights!"

    notification = Notification(
        parent_id=parent_id,
        notification_type="Milestone",
        message=message,
        scheduled_time=datetime.now(),
        sent_time=datetime.now(),
        is_read=False
    )

    session.add(notification)
    session.commit()
    session.refresh(notification)

    return notification


@router.get("/{parent_id}/preferences", response_model=NotificationPreferences)
def get_notification_preferences(parent_id: int, session: Session = Depends(get_session), current_user: Parent = Depends(get_current_user)):
    """Get parent's notification preferences"""
    if parent_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized")

    parent = session.get(Parent, parent_id)
    if not parent:
        raise HTTPException(status_code=404, detail="Parent not found")

    # If parent has notification_data stored, parse it
    if parent.notification_data:
        try:
            import json
            preferences = json.loads(parent.notification_data)
            return NotificationPreferences(**preferences)
        except:
            pass

    # Return default preferences
    return NotificationPreferences()

@router.put("/{parent_id}/preferences")
def save_notification_preferences(parent_id: int, preferences: NotificationPreferences, session: Session = Depends(get_session), current_user: Parent = Depends(get_current_user)):
    """Update parent's notification preferences"""
    if parent_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized")

    parent = session.get(Parent, parent_id)
    if not parent:
        raise HTTPException(status_code=404, detail="Parent not found")

    # Save preferences as JSON in notification_data field
    import json
    parent.notification_data = json.dumps(preferences.dict())
    session.add(parent)
    session.commit()

    return {"message": "Preferences updated successfully", "preferences": preferences}
