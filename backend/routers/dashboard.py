from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select
from typing import List, Optional, Dict
from pydantic import BaseModel
from datetime import datetime, timedelta

from ..database import get_session
from ..models import Child, Parent, Progress, LearningPlan, Activity, ActivityProgress, Achievement, Assessment
from ..auth import get_current_user

router = APIRouter(prefix="/dashboard", tags=["dashboard"])

# Output Schemas
class ActivityItem(BaseModel):
    id: int
    title: str
    type: str  # Game, Video, etc
    completed: bool
    icon_type: str  # To map to frontend icons (e.g., "GAME", "VIDEO")

class SkillStat(BaseModel):
    skill_name: str
    mastery_level: int  # 0-100
    status: str  # "Not Started", "Learning", "Mastered"

class ChildSummary(BaseModel):
    id: int
    name: str
    age: int
    level: str
    streak: int
    weekly_progress: int
    activities_completed: int
    total_activities: int

class DashboardData(BaseModel):
    child_name: str
    level: str
    streak: int
    total_score: int
    weekly_focus: str
    weekly_progress: int  # Percentage
    activities: List[ActivityItem]
    achievements: List[str]  # List of achievement names earned
    # New enhanced fields
    skills: List[SkillStat]
    total_time_spent_minutes: int
    activities_this_week: int
    last_active: Optional[str]
    sibling_summaries: List[ChildSummary]  # For multi-child view
    duration_weeks: Optional[int] = None  # Learning plan duration
    weekly_goals: Optional[str] = None  # JSON string of weekly goals

@router.get("/{child_id}", response_model=DashboardData)
def get_dashboard_data(child_id: int, session: Session = Depends(get_session), current_user: Parent = Depends(get_current_user)):
    # 1. Fetch Child
    child = session.get(Child, child_id)
    if not child:
        raise HTTPException(status_code=404, detail="Child not found")

    if child.parent_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to view this child's dashboard")

    # 2. Fetch Parent Progress (Streak/Score)
    statement = select(Progress).where(Progress.parent_id == child.parent_id)
    progress_record = session.exec(statement).first()

    streak = progress_record.streak_days if progress_record else 0
    total_score = progress_record.total_score if progress_record else 0

    # 3. Fetch Active Learning Plan
    latest_assessment = None
    if child.assessments:
        latest_assessment = child.assessments[-1]

    current_plan = None
    if latest_assessment and latest_assessment.learning_plan:
        current_plan = latest_assessment.learning_plan

    weekly_focus = "General Learning"
    weekly_progress = 0
    duration_weeks = None
    weekly_goals_json = None
    activities_list = []
    total_time_spent = 0

    if current_plan:
        weekly_focus = current_plan.focus_areas
        duration_weeks = current_plan.duration_weeks
        weekly_goals_json = current_plan.weekly_goals
        activities = current_plan.activities
        completed_count = 0

        for activity in activities:
            is_completed = False
            time_spent = 0

            if progress_record:
                stmt = select(ActivityProgress).where(
                    ActivityProgress.activity_id == activity.id,
                    ActivityProgress.progress_id == progress_record.id
                )
                progress_records = session.exec(stmt).all()

                for pr in progress_records:
                    time_spent += pr.total_time_spent_minutes
                    if pr.completion_status == "Completed":
                        is_completed = True
                        completed_count += 1

                total_time_spent += time_spent

            activities_list.append(ActivityItem(
                id=activity.id,
                title=activity.activity_name,
                type=activity.activity_type,
                completed=is_completed,
                icon_type=activity.activity_type.upper()
            ))

        if len(activities) > 0:
            weekly_progress = int((completed_count / len(activities)) * 100)

    # 4. Calculate Skills based on assessment results
    skills = []
    if latest_assessment:
        # Analyze assessment questions by skill
        skill_scores = {}  # skill -> {correct, total}

        for question in latest_assessment.questions:
            skill = question.question_type  # Using question_type as skill category
            if skill not in skill_scores:
                skill_scores[skill] = {"correct": 0, "total": 0}

            skill_scores[skill]["total"] += 1
            if question.is_correct:
                skill_scores[skill]["correct"] += 1

        # Convert to skill stats
        skill_name_map = {
            "multiple-choice": "Letter Recognition",
            "image-choice": "Phonics & Sounds",
            "matching": "Word Building",
            "tracing": "Writing Skills"
        }

        for skill, scores in skill_scores.items():
            mastery = int((scores["correct"] / scores["total"]) * 100) if scores["total"] > 0 else 0
            status = "Not Started" if mastery == 0 else "Learning" if mastery < 80 else "Mastered"

            skills.append(SkillStat(
                skill_name=skill_name_map.get(skill, skill),
                mastery_level=mastery,
                status=status
            ))

    # If no skills, add default
    if not skills:
        skills = [
            SkillStat(skill_name="Letter Recognition", mastery_level=0, status="Not Started"),
            SkillStat(skill_name="Phonics & Sounds", mastery_level=0, status="Not Started"),
            SkillStat(skill_name="Word Building", mastery_level=0, status="Not Started")
        ]

    # 5. Calculate activities this week
    one_week_ago = datetime.utcnow() - timedelta(days=7)
    activities_this_week = 0

    if progress_record:
        stmt = select(ActivityProgress).where(
            ActivityProgress.progress_id == progress_record.id,
            ActivityProgress.completion_status == "Completed"
        )
        # Note: We'd need a timestamp field on ActivityProgress for accurate weekly count
        # For now, count all completed
        activities_this_week = len(session.exec(stmt).all())

    # 6. Fetch Achievements
    achievements = session.exec(select(Achievement).where(Achievement.child_id == child_id)).all()
    earned_names = [a.achievement_name for a in achievements]

    # 7. Get sibling summaries for multi-child view
    siblings = session.exec(
        select(Child).where(Child.parent_id == current_user.id).where(Child.id != child_id)
    ).all()

    sibling_summaries = []
    for sibling in siblings:
        # Get sibling's basic stats
        sibling_stmt = select(ActivityProgress).join(Activity).where(
            Activity.child_id == sibling.id
        )
        sibling_progress = session.exec(sibling_stmt).all()
        completed = len([p for p in sibling_progress if p.completion_status == "Completed"])
        total = len(sibling_progress)

        sibling_summaries.append(ChildSummary(
            id=sibling.id,
            name=sibling.name,
            age=sibling.age,
            level=sibling.current_level,
            streak=streak,  # Sharing streak for now (family-based)
            weekly_progress=0,  # Would need separate calculation
            activities_completed=completed,
            total_activities=total
        ))

    # Last active - use most recent activity progress or assessment date
    last_active = None
    if latest_assessment:
        last_active = latest_assessment.assessment_date.strftime("%Y-%m-%d")

    return DashboardData(
        child_name=child.name,
        level=child.current_level,
        streak=streak,
        total_score=total_score,
        weekly_focus=weekly_focus,
        weekly_progress=weekly_progress,
        activities=activities_list,
        achievements=earned_names,
        skills=skills,
        total_time_spent_minutes=total_time_spent,
        activities_this_week=activities_this_week,
        last_active=last_active,
        sibling_summaries=sibling_summaries,
        duration_weeks=duration_weeks,
        weekly_goals=weekly_goals_json
    )
