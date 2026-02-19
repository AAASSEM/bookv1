from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select
from typing import List, Optional, Dict
from pydantic import BaseModel
from datetime import datetime, timedelta
import json

from ..database import get_session
from ..models import Assessment, AssessmentQuestion, LearningPlan, Activity, Child

router = APIRouter(prefix="/assessments", tags=["assessments"])

# ==================== SCHEMA DEFINITIONS ====================

class QuestionAnswer(BaseModel):
    question_id: int
    question_content: str
    selected_answer: str
    correct_answer: str
    time_spent: int

class AssessmentSubmission(BaseModel):
    child_id: int
    answers: List[QuestionAnswer]

class SkillAnalysis(BaseModel):
    skill_name: str
    total_questions: int
    correct_answers: int
    mastery_percentage: int
    status: str  # "Mastered", "Learning", "Needs Work"
    avg_time_seconds: float
    strengths: List[str]
    weaknesses: List[str]

class AssessmentResult(BaseModel):
    level: str
    accuracy: float
    message: str
    plan_id: int
    skill_analysis: List[SkillAnalysis]
    strengths: List[str]
    weaknesses: List[str]
    recommendations: List[str]

# ==================== HELPER FUNCTIONS ====================

def generate_weekly_goals(level: str, skill_analyses: List[SkillAnalysis], duration_weeks: int) -> str:
    """Generate JSON string of weekly goals based on child's level and skills"""
    weekly_goals = []

    for week in range(1, duration_weeks + 1):
        if level == "Beginner":
            if week <= 2:
                weekly_goals.append({
                    "week": week,
                    "title": "Letter Recognition Mastery",
                    "goals": [
                        "Practice identifying 5 new letters daily",
                        "Complete 3 Letter Hunt games",
                        "Trace 10 letters per day"
                    ],
                    "focus": "letter_recognition"
                })
            elif week <= 4:
                weekly_goals.append({
                    "week": week,
                    "title": "Beginning Phonics",
                    "goals": [
                        "Learn 3 letter sounds per week",
                        "Match sounds to pictures",
                        "Sing alphabet songs daily"
                    ],
                    "focus": "phonics"
                })
            elif week <= 6:
                weekly_goals.append({
                    "week": week,
                    "title": "Simple Rhyming",
                    "goals": [
                        "Identify rhyming words in stories",
                        "Play rhyming games",
                        "Create word families"
                    ],
                    "focus": "rhyming"
                })
            else:
                weekly_goals.append({
                    "week": week,
                    "title": "Reading Readiness",
                    "goals": [
                        "Read simple words",
                        "Practice sight words",
                        "Complete comprehension activities"
                    ],
                    "focus": "reading_fluency"
                })

        elif level == "Intermediate":
            if week <= 2:
                weekly_goals.append({
                    "week": week,
                    "title": "Phonics Reinforcement",
                    "goals": [
                        "Master all letter sounds",
                        "Blend simple sounds (CVC words)",
                        "Complete 4 Phonics Match games"
                    ],
                    "focus": "phonics"
                })
            elif week <= 4:
                weekly_goals.append({
                    "week": week,
                    "title": "Word Building",
                    "goals": [
                        "Build 3-letter words",
                        "Practice common word families",
                        "Read simple sentences"
                    ],
                    "focus": "phonics"
                })
            else:
                weekly_goals.append({
                    "week": week,
                    "title": "Reading Practice",
                    "goals": [
                        "Read 5 short stories",
                        "Answer comprehension questions",
                        "Practice reading aloud"
                    ],
                    "focus": "reading_fluency"
                })

        else:  # Advanced
            if week <= 3:
                weekly_goals.append({
                    "week": week,
                    "title": "Advanced Phonics",
                    "goals": [
                        "Master complex letter patterns",
                        "Read multi-syllable words",
                        "Practice pronunciation"
                    ],
                    "focus": "phonics"
                })
            else:
                weekly_goals.append({
                    "week": week,
                    "title": "Fluency & Comprehension",
                    "goals": [
                        "Read chapter books",
                        "Discuss story elements",
                        "Write simple sentences"
                    ],
                    "focus": "reading_fluency"
                })

    return json.dumps(weekly_goals)


def generate_week_activities(week_num: int, level: str, skill_analyses: List[SkillAnalysis], child_id: int, plan_id: int) -> List[Activity]:
    """Generate a week's worth of activities based on the week number and child's level"""
    activities = []
    days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]

    for day_num, day in enumerate(days, 1):
        if level == "Beginner":
            if week_num <= 2:
                if day_num % 2 == 0:
                    activities.append(Activity(
                        plan_id=plan_id, child_id=child_id, activity_type="Game",
                        activity_name=f"Letter Hunt - Week {week_num} Day {day_num}",
                        activity_content=f"Find letters", estimated_duration_minutes=10, difficulty_level="Easy"
                    ))
                else:
                    activities.append(Activity(
                        plan_id=plan_id, child_id=child_id, activity_type="Tracing",
                        activity_name=f"Trace Letters - Week {week_num} Day {day_num}",
                        activity_content=f"Trace letters", estimated_duration_minutes=15, difficulty_level="Easy"
                    ))
            else:
                activities.append(Activity(
                    plan_id=plan_id, child_id=child_id, activity_type="Game",
                    activity_name=f"Practice Activity - Week {week_num} Day {day_num}",
                    activity_content="Daily practice", estimated_duration_minutes=10, difficulty_level="Easy"
                ))

        elif level == "Intermediate":
            activities.append(Activity(
                plan_id=plan_id, child_id=child_id, activity_type="Game",
                activity_name=f"Phonics Game - Week {week_num} Day {day_num}",
                activity_content="Practice phonics", estimated_duration_minutes=15, difficulty_level="Medium"
            ))

        else:  # Advanced
            activities.append(Activity(
                plan_id=plan_id, child_id=child_id, activity_type="Reading",
                activity_name=f"Reading Practice - Week {week_num} Day {day_num}",
                activity_content="Read and comprehend", estimated_duration_minutes=20, difficulty_level="Hard"
            ))

    return activities


def analyze_skills(submission: AssessmentSubmission) -> List[SkillAnalysis]:
    """AI-powered skill analysis based on assessment results"""
    skill_data: Dict[str, Dict] = {}

    skill_mapping = {
        1: "letter_recognition", 2: "letter_recognition", 3: "letter_recognition", 4: "letter_recognition",
        5: "phonics", 6: "phonics", 7: "phonics", 8: "phonics",
        9: "rhyming", 10: "rhyming", 11: "rhyming",
        12: "grammar", 13: "grammar",
        14: "reading_fluency", 15: "reading_fluency"
    }

    skill_display_names = {
        "letter_recognition": "Letter Recognition",
        "phonics": "Phonics & Sounds",
        "rhyming": "Rhyming Patterns",
        "grammar": "Grammar & Word Structure",
        "reading_fluency": "Reading Fluency"
    }

    for answer in submission.answers:
        q_id = answer.question_id
        skill = skill_mapping.get(q_id, "general")

        if skill not in skill_data:
            skill_data[skill] = {"total": 0, "correct": 0, "time_total": 0, "questions": []}

        skill_data[skill]["total"] += 1
        skill_data[skill]["time_total"] += answer.time_spent
        skill_data[skill]["questions"].append(answer)

        if answer.selected_answer == answer.correct_answer:
            skill_data[skill]["correct"] += 1

    skill_analyses = []
    for skill, data in skill_data.items():
        total = data["total"]
        correct = data["correct"]
        mastery = int((correct / total) * 100) if total > 0 else 0
        avg_time = data["time_total"] / total if total > 0 else 0

        if mastery >= 80:
            status = "Mastered"
        elif mastery >= 50:
            status = "Learning"
        else:
            status = "Needs Work"

        strengths = []
        weaknesses = []

        if mastery >= 80:
            strengths.append(f"Strong understanding of {skill_display_names.get(skill, skill)}")
        elif mastery >= 50:
            strengths.append(f"Developing {skill_display_names.get(skill, skill)} skills")
            weaknesses.append(f"Needs more practice with {skill_display_names.get(skill, skill)}")
        else:
            weaknesses.append(f"Requires focused practice on {skill_display_names.get(skill, skill)}")

        if avg_time > 30:
            weaknesses.append(f"Taking too long on {skill_display_names.get(skill, skill)} questions")
        elif avg_time < 5 and mastery >= 80:
            strengths.append(f"Quick and accurate with {skill_display_names.get(skill, skill)}")

        skill_analyses.append(SkillAnalysis(
            skill_name=skill_display_names.get(skill, skill),
            total_questions=total,
            correct_answers=correct,
            mastery_percentage=mastery,
            status=status,
            avg_time_seconds=round(avg_time, 1),
            strengths=strengths,
            weaknesses=weaknesses
        ))

    return skill_analyses


# ==================== ROUTE HANDLERS ====================

@router.post("/submit", response_model=AssessmentResult)
def submit_assessment(submission: AssessmentSubmission, session: Session = Depends(get_session)):
    child = session.get(Child, submission.child_id)
    if not child:
        raise HTTPException(status_code=404, detail="Child not found")

    total_questions = len(submission.answers)
    correct_count = sum(1 for a in submission.answers if a.selected_answer == a.correct_answer)
    accuracy = (correct_count / total_questions) * 100 if total_questions > 0 else 0

    skill_analyses = analyze_skills(submission)

    letter_recog_mastery = next((s for s in skill_analyses if "Letter" in s.skill_name), None)
    phonics_mastery = next((s for s in skill_analyses if "Phonics" in s.skill_name), None)

    if accuracy < 50 or (letter_recog_mastery and letter_recog_mastery.mastery_percentage < 60):
        level = "Beginner"
        focus = "Letter Recognition"
    elif accuracy < 75 or (phonics_mastery and phonics_mastery.mastery_percentage < 70):
        level = "Intermediate"
        focus = "Phonics & Sound Blending"
    else:
        level = "Advanced"
        focus = "Reading Comprehension & Fluency"

    child.current_level = level
    session.add(child)

    assessment = Assessment(
        child_id=child.id,
        assessment_type="Enhanced Placement Test",
        total_questions=total_questions,
        correct_answers=correct_count,
        accuracy_percentage=accuracy,
        skill_level_result=level,
        is_initial=True
    )
    session.add(assessment)
    session.commit()
    session.refresh(assessment)

    skill_mapping = {
        1: "letter_recognition", 2: "letter_recognition", 3: "letter_recognition", 4: "letter_recognition",
        5: "phonics", 6: "phonics", 7: "phonics", 8: "phonics",
        9: "rhyming", 10: "rhyming", 11: "rhyming",
        12: "grammar", 13: "grammar",
        14: "reading_fluency", 15: "reading_fluency"
    }

    for answer in submission.answers:
        question_record = AssessmentQuestion(
            assessment_id=assessment.id,
            question_type=skill_mapping.get(answer.question_id, "general"),
            question_content=answer.question_content,
            child_answer=answer.selected_answer,
            correct_answer=answer.correct_answer,
            time_spent_seconds=answer.time_spent,
            is_correct=(answer.selected_answer == answer.correct_answer)
        )
        session.add(question_record)

    duration_weeks = 8 if level == "Beginner" else 6

    plan = LearningPlan(
        assessment_id=assessment.id,
        duration_weeks=duration_weeks,
        plan_start_date=datetime.utcnow(),
        plan_end_date=datetime.utcnow() + timedelta(weeks=duration_weeks),
        status="Active",
        focus_areas=focus,
        weekly_goals=generate_weekly_goals(level, skill_analyses, duration_weeks)
    )
    session.add(plan)
    session.commit()
    session.refresh(plan)

    activities_to_create = []
    for week_num in range(1, duration_weeks + 1):
        week_activities = generate_week_activities(week_num, level, skill_analyses, child.id, plan.id)
        activities_to_create.extend(week_activities)

    for activity in activities_to_create:
        session.add(activity)

    session.commit()

    strengths = []
    weaknesses = []
    recommendations = []

    for analysis in skill_analyses:
        strengths.extend(analysis.strengths)
        weaknesses.extend(analysis.weaknesses)

    if level == "Beginner":
        recommendations.extend([
            "Practice alphabet songs daily",
            "Use flashcards for letter recognition",
            "Point out letters in everyday environments"
        ])
    elif level == "Intermediate":
        recommendations.extend([
            "Practice letter-sound associations",
            "Read simple rhyming books together",
            "Play phonics games for 15 minutes daily"
        ])
    else:
        recommendations.extend([
            "Read age-appropriate books daily",
            "Discuss story characters and plot",
            "Practice sight words for fluency"
        ])

    return AssessmentResult(
        level=level,
        accuracy=round(accuracy, 1),
        message=f"Assessment Complete! Assigned Level: {level}",
        plan_id=plan.id,
        skill_analysis=skill_analyses,
        strengths=list(set(strengths))[:5],
        weaknesses=list(set(weaknesses))[:5],
        recommendations=recommendations[:5]
    )
