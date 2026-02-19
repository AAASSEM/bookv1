from fastapi import APIRouter, Depends, HTTPException  # Import API Router and exception handlers
from sqlmodel import Session, select  # Import Session and select for DB operations
from typing import List, Optional  # Import typing helpers
from pydantic import BaseModel  # Import BaseModel for input validation schemas
from ..database import get_session  # Import DB session dependency
from ..models import Activity, ActivityProgress, Progress, Child, Parent, Achievement, Notification  # Import all relevant models
from datetime import datetime

# Create router for activity-related endpoints
router = APIRouter(prefix="/activities", tags=["activities"])

# Input Schema for recording activity progress (simplifies client interaction)
class ActivitySubmission(BaseModel):
    child_id: int
    activity_id: Optional[int] = None # Support existing activity
    activity_name: Optional[str] = None # For creating new ad-hoc
    activity_type: Optional[str] = None
    score: int = 10
    duration_seconds: int = 300
    completed: bool = True

# Endpoint to record progress
@router.post("/progress", response_model=ActivityProgress)
def record_progress(submission: ActivitySubmission, session: Session = Depends(get_session)):
    # 1. Fetch the Child
    child = session.get(Child, submission.child_id)
    if not child:
        raise HTTPException(status_code=404, detail="Child not found")
    
    # 2. Get or Create parent's main Progress record
    statement = select(Progress).where(Progress.parent_id == child.parent_id)
    progress_record = session.exec(statement).first()
    
    if not progress_record:
        progress_record = Progress(
            parent_id=child.parent_id,
            total_score=0,
            streak_days=1 
        )
        session.add(progress_record)
        session.commit()
        session.refresh(progress_record)
        
    # 3. Handle Activity (Find existing or create new)
    activity_record = None
    if submission.activity_id:
        activity_record = session.get(Activity, submission.activity_id)
    
    if not activity_record:
        # Fallback to creation if no ID or ID not found (logic from before)
        if not submission.activity_name:
             # If we tried to look up by ID and failed, and no name provided, we can't create.
             # But for robustness, let's error if ID was intended but failed.
             if submission.activity_id:
                  raise HTTPException(status_code=404, detail="Activity not found")
             else:
                  raise HTTPException(status_code=400, detail="Activity ID or Name required")

        activity_record = Activity(
            child_id=child.id,
            activity_type=submission.activity_type.capitalize() if submission.activity_type else "Game",
            activity_name=submission.activity_name,
            activity_content="Generated from submission",
            estimated_duration_minutes=int(submission.duration_seconds / 60),
            difficulty_level="Medium"
        )
        session.add(activity_record)
        session.commit()
        session.refresh(activity_record)
    
    # 4. Check for existing ActivityProgress to avoid duplicates?
    # In this app, maybe re-playing updates the status?
    statement = select(ActivityProgress).where(
        ActivityProgress.activity_id == activity_record.id,
        ActivityProgress.progress_id == progress_record.id
    )
    activity_progress = session.exec(statement).first()

    if activity_progress:
        # Update existing
        activity_progress.completion_status = "Completed" if submission.completed else activity_progress.completion_status
        activity_progress.total_time_spent_minutes += int(submission.duration_seconds / 60)
    else:
        # Create new
        activity_progress = ActivityProgress(
            activity_id=activity_record.id,
            progress_id=progress_record.id,
            completion_status="Completed" if submission.completed else "Incomplete",
            total_time_spent_minutes=int(submission.duration_seconds / 60)
        )
    
    session.add(activity_progress)
    
    # 5. Update Parent's Total Score
    progress_record.total_score += submission.score
    session.add(progress_record)
    
    # Commit final changes
    session.commit()
    session.refresh(activity_progress)

    # --- GAMIFICATION ENGINE ---
    # 6. Check for Achievements
    achievements_earned = []
    
    # A. First Activity Badge
    # Check if this is the only completed activity
    completed_count = session.exec(select(ActivityProgress).join(Activity).where(
        Activity.child_id == child.id, 
        ActivityProgress.completion_status == "Completed"
    )).all()
    
    if len(completed_count) == 1:
        # Check if already has badge to avoid duplicates (though logic implies it's first)
        existing_badge = session.exec(select(Achievement).where(
            Achievement.child_id == child.id, 
            Achievement.achievement_name == "First Steps"
        )).first()
        
        if not existing_badge:
            badge = Achievement(
                child_id=child.id,
                achievement_name="First Steps",
                description="Completed your first activity!",
                badge_icon="🌟"
            )
            session.add(badge)
            achievements_earned.append(badge)

    # B. Streak Master (Mock logic: if streak > 3)
    if progress_record.streak_days >= 3:
        existing_badge = session.exec(select(Achievement).where(
            Achievement.child_id == child.id,
            Achievement.achievement_name == "Streak Master"
        )).first()
        
        if not existing_badge:
            badge = Achievement(
                child_id=child.id,
                achievement_name="Streak Master",
                description="Maintained a 3-day streak!",
                badge_icon="🔥"
            )
            session.add(badge)
            achievements_earned.append(badge)

    # 7. Create Notifications for Parent
    # Always notify on completion? Or only milestones? Let's do milestones + summary.
    # For now, simple notification.
    if submission.completed:
        msg = f"{child.name} completed '{submission.activity_type}' activity!"
        if achievements_earned:
            msg += f" And earned {len(achievements_earned)} badge(s)!"
            
        notification = Notification(
            parent_id=child.parent_id,
            notification_type="Activity Update",
            message=msg,
            scheduled_time=datetime.now(),
            sent_time=datetime.now(),
            is_read=False
        )
        session.add(notification)

    # Commit Gamification
    session.commit()
    
    return activity_progress

# Endpoint to get progress (Needs to join tables now)
# NOTE: Returning raw ActivityProgress list might be scarce on info, 
# but sticking to schema return types for now.
@router.get("/progress/{child_id}", response_model=List[ActivityProgress])
def get_child_progress(child_id: int, session: Session = Depends(get_session)):
    # Join ActivityProgress with Activity to filter by child_id
    statement = select(ActivityProgress).join(Activity).where(Activity.child_id == child_id)
    results = session.exec(statement)
    return results.all()
