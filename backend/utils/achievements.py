"""
Achievement System - Comprehensive Badge Awarding Logic
Maps achievement definitions to checking logic
"""

from typing import List, Dict, Any
from sqlmodel import Session, select
from ..models import Achievement, ActivityProgress, Activity, Child, Assessment

# Achievement definitions matching frontend rewards.js
ACHIEVEMENT_DEFINITIONS = {
    # ASSESSMENT BADGES
    "first_assessment": {
        "name": "Brave Beginning",
        "icon": "🌟",
        "points": 50,
        "description": "Completed your first assessment"
    },
    "perfect_score": {
        "name": "Perfect Scholar",
        "icon": "💯",
        "points": 200,
        "description": "Got 100% on assessment"
    },
    "letter_expert": {
        "name": "Letter Expert",
        "icon": "🅰️+",
        "points": 100,
        "description": "Mastered letter recognition (100% in skill)"
    },
    "phonics_master": {
        "name": "Phonics Pro",
        "icon": "🎵",
        "points": 100,
        "description": "Mastered phonics (100% in skill)"
    },

    # ACTIVITY BADGES
    "first_activity": {
        "name": "First Steps",
        "icon": "👣",
        "points": 25,
        "description": "Completed your first activity"
    },
    "five_activities": {
        "name": "Getting Started",
        "icon": "📚",
        "points": 50,
        "description": "Completed 5 activities"
    },
    "letter_hunt_champion": {
        "name": "Letter Hunt Champion",
        "icon": "🏆",
        "points": 100,
        "description": "Found all letters in Letter Hunt with perfect score"
    },
    "phonics_genius": {
        "name": "Phonics Genius",
        "icon": "🧠",
        "points": 100,
        "description": "Perfect score in Phonics Match"
    },
    "tiny_artist": {
        "name": "Tiny Artist",
        "icon": "🎨",
        "points": 75,
        "description": "Completed 3 tracing activities"
    },
    "activity_marathon": {
        "name": "Activity Marathon",
        "icon": "🏃",
        "points": 150,
        "description": "Completed 10 activities in one day"
    },

    # STREAK BADGES
    "streak_3": {
        "name": "On Fire!",
        "icon": "🔥",
        "points": 75,
        "description": "3 day learning streak"
    },
    "streak_7": {
        "name": "Week Warrior",
        "icon": "⚔️",
        "points": 200,
        "description": "7 day learning streak"
    },
    "streak_14": {
        "name": "Dedicated Learner",
        "icon": "💎",
        "points": 500,
        "description": "14 day learning streak"
    },
    "streak_30": {
        "name": "Month Master",
        "icon": "👑",
        "points": 1000,
        "description": "30 day learning streak"
    },

    # SKILL BADGES
    "beginner_complete": {
        "name": "Beginner Graduate",
        "icon": "🎓",
        "points": 300,
        "description": "Completed all Beginner level skills"
    },
    "intermediate_complete": {
        "name": "Rising Star",
        "icon": "⭐",
        "points": 500,
        "description": "Completed all Intermediate level skills"
    },
    "advanced_complete": {
        "name": "Super Reader",
        "icon": "🦸",
        "points": 1000,
        "description": "Completed all Advanced level skills"
    },
    "skill_master_letter": {
        "name": "Letter Lord",
        "icon": "🔤",
        "points": 150,
        "description": "Mastered letter recognition skill (90%+)"
    },
    "skill_master_phonics": {
        "name": "Sound Specialist",
        "icon": "🎶",
        "points": 150,
        "description": "Mastered phonics skill (90%+)"
    },
    "skill_master_rhyming": {
        "name": "Rhyme Ranger",
        "icon": "🎭",
        "points": 150,
        "description": "Mastered rhyming skill (90%+)"
    },
    "skill_master_grammar": {
        "name": "Grammar Guru",
        "icon": "📝",
        "points": 150,
        "description": "Mastered grammar skill (90%+)"
    },
    "skill_master_fluency": {
        "name": "Fluency Hero",
        "icon": "📖",
        "points": 150,
        "description": "Mastered reading fluency (90%+)"
    },

    # SPECIAL BADGES
    "speed_demon": {
        "name": "Speed Demon",
        "icon": "⚡",
        "points": 100,
        "description": "Completed activity in under 2 minutes"
    },
    "night_owl": {
        "name": "Night Owl",
        "icon": "🦉",
        "points": 50,
        "description": "Completed activity after 8 PM"
    },
    "early_bird": {
        "name": "Early Bird",
        "icon": "🐦",
        "points": 50,
        "description": "Completed activity before 9 AM"
    },
    "perfectionist": {
        "name": "Perfectionist",
        "icon": "💎",
        "points": 300,
        "description": "5 perfect activity scores in a row"
    },
    "explorer": {
        "name": "Explorer",
        "icon": "🗺️",
        "points": 100,
        "description": "Tried all 3 activity types"
    },
    "social_butterfly": {
        "name": "Social Butterfly",
        "icon": "🦋",
        "points": 75,
        "description": "Invited parent to see progress"
    }
}


def get_child_achievement_ids(session: Session, child_id: int) -> List[str]:
    """Get list of achievement IDs a child has earned"""
    achievements = session.exec(
        select(Achievement).where(Achievement.child_id == child_id)
    ).all()

    # Map achievement names back to IDs
    achievement_ids = []
    for achievement in achievements:
        # Find matching ID by name
        for ach_id, definition in ACHIEVEMENT_DEFINITIONS.items():
            if definition["name"] == achievement.achievement_name:
                achievement_ids.append(ach_id)
                break

    return achievement_ids


def award_achievement(session: Session, child_id: int, achievement_id: str) -> Achievement:
    """Award an achievement to a child (checks if already earned)"""
    # Check if already earned
    earned_ids = get_child_achievement_ids(session, child_id)
    if achievement_id in earned_ids:
        return None

    # Get achievement definition
    if achievement_id not in ACHIEVEMENT_DEFINITIONS:
        raise ValueError(f"Unknown achievement ID: {achievement_id}")

    definition = ACHIEVEMENT_DEFINITIONS[achievement_id]

    # Create achievement record
    achievement = Achievement(
        child_id=child_id,
        achievement_name=definition["name"],
        description=definition["description"],
        badge_icon=definition["icon"]
    )

    session.add(achievement)
    session.commit()
    session.refresh(achievement)

    return achievement


def check_and_award_achievements(
    session: Session,
    child: Child,
    activity: Activity = None,
    score: int = 0,
    duration_seconds: int = 0
) -> List[Achievement]:
    """
    Check all achievement conditions and award any new ones.
    Returns list of newly earned achievements.
    """
    newly_earned = []

    # Get current stats
    completed_activities = session.exec(
        select(ActivityProgress).join(Activity).where(
            Activity.child_id == child.id,
            ActivityProgress.completion_status == "Completed"
        )
    ).all()

    total_completed = len(completed_activities)

    # Get latest assessment
    latest_assessment = None
    if child.assessments:
        latest_assessment = child.assessments[-1]

    # ===== ACTIVITY ACHIEVEMENTS =====

    # First activity
    if total_completed >= 1:
        newly_earned.append(award_achievement(session, child.id, "first_activity"))

    # Five activities
    if total_completed >= 5:
        newly_earned.append(award_achievement(session, child.id, "five_activities"))

    # Letter Hunt Champion (perfect score on Letter Hunt)
    if activity and "letter hunt" in activity.activity_name.lower() and score >= 90:
        newly_earned.append(award_achievement(session, child.id, "letter_hunt_champion"))

    # Phonics Genius (perfect score on Phonics)
    if activity and "phonics" in activity.activity_name.lower() and score >= 90:
        newly_earned.append(award_achievement(session, child.id, "phonics_genius"))

    # Tiny Artist (3 tracing activities)
    tracing_count = len([a for a in completed_activities if a.activity.activity_type == "Tracing"])
    if tracing_count >= 3:
        newly_earned.append(award_achievement(session, child.id, "tiny_artist"))

    # Activity Marathon (10 activities in one day) - TODO: Need timestamp tracking
    # if total_completed >= 10:
    #     newly_earned.append(award_achievement(session, child.id, "activity_marathon"))

    # ===== SPECIAL ACHIEVEMENTS =====

    # Speed Demon (under 2 minutes)
    if duration_seconds > 0 and duration_seconds < 120:
        newly_earned.append(award_achievement(session, child.id, "speed_demon"))

    # ===== ASSESSMENT ACHIEVEMENTS =====

    if latest_assessment:
        # First assessment
        newly_earned.append(award_achievement(session, child.id, "first_assessment"))

        # Perfect score (100% accuracy)
        if latest_assessment.accuracy_percentage >= 100:
            newly_earned.append(award_achievement(session, child.id, "perfect_score"))

    # ===== STREAK ACHIEVEMENTS =====
    # TODO: Need proper streak tracking in Progress model
    # For now, skip streak achievements

    # ===== SKILL BADGES =====
    # TODO: Need skill mastery tracking from assessment
    # For now, skip skill badges

    # Filter out None values (already earned)
    newly_earned = [a for a in newly_earned if a is not None]

    if newly_earned:
        session.commit()

    return newly_earned
