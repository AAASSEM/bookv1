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
    """Generate PERSONALIZED weekly goals based on child's specific skill weaknesses"""
    weekly_goals = []

    # Identify the 2 weakest skills for this child
    weak_skills = sorted(
        [s for s in skill_analyses if s.status in ["Needs Work", "Learning"]],
        key=lambda x: x.mastery_percentage
    )[:2]

    # Identify strongest skills
    strong_skills = [s for s in skill_analyses if s.status == "Mastered"]

    # Create personalized plan based on actual weaknesses
    for week in range(1, duration_weeks + 1):
        # Focus on the weakest skill first
        primary_weakness = weak_skills[0] if weak_skills else None
        secondary_weakness = weak_skills[1] if len(weak_skills) > 1 else None

        if level == "Beginner":
            if week <= 2:
                # Always start with letter recognition if it's weak
                if primary_weakness and "Letter" in primary_weakness.skill_name:
                    weekly_goals.append({
                        "week": week,
                        "title": f"Mastering {primary_weakness.skill_name}",
                        "goals": [
                            f"Practice {primary_weakness.skill_name.lower()} 15 min daily",
                            f"Focus on letters you struggled with in the assessment",
                            "Complete Letter Hunt games twice daily",
                            "Trace each letter 5 times while saying the sound"
                        ],
                        "focus": "letter_recognition",
                        "personalized": True
                    })
                else:
                    weekly_goals.append({
                        "week": week,
                        "title": f"Strengthening {primary_weakness.skill_name if primary_weakness else 'Basic Skills'}",
                        "goals": [
                            f"Practice {primary_weakness.skill_name.lower() if primary_weakness else 'letters'} for 20 min daily",
                            "Use flashcards for quick recognition",
                            "Play alphabet games and songs",
                            "Complete 3 Letter Hunt activities daily"
                        ],
                        "focus": primary_weakness.skill_name.lower().replace(" ", "_") if primary_weakness else "letter_recognition",
                        "personalized": True
                    })

            elif week <= 4:
                # Focus on phonics if it's weak, otherwise continue with current skill
                if secondary_weakness and "Phonics" in secondary_weakness.skill_name:
                    weekly_goals.append({
                        "week": week,
                        "title": f"Building {secondary_weakness.skill_name}",
                        "goals": [
                            f"Learn one new letter sound per day",
                            f"Practice sounds you found difficult: {', '.join([s.skill_name for s in weak_skills])}",
                            "Match sounds to pictures in Phonics Match",
                            "Sing phonics songs daily"
                        ],
                        "focus": "phonics",
                        "personalized": True
                    })
                else:
                    weekly_goals.append({
                        "week": week,
                        "title": f"Advancing {primary_weakness.skill_name if primary_weakness else 'Reading Skills'}",
                        "goals": [
                            f"15 min daily practice on {primary_weakness.skill_name.lower() if primary_weakness else 'letters'}",
                            "Introduce simple words with known letters",
                            "Read alphabet books together",
                            "Play letter recognition games"
                        ],
                        "focus": primary_weakness.skill_name.lower().replace(" ", "_") if primary_weakness else "letter_recognition",
                        "personalized": True
                    })

            elif week <= 6:
                # Move to rhyming or continue strengthening weak skills
                weekly_goals.append({
                    "week": week,
                    "title": "Exploring Word Patterns",
                    "goals": [
                        "Find rhyming words in stories",
                        "Play rhyming games for 10 min daily",
                        "Create word families (cat, hat, mat, sat)",
                        "Clap out syllables in words"
                    ],
                    "focus": "rhyming",
                    "personalized": True
                })

            else:
                # Reading readiness
                weekly_goals.append({
                    "week": week,
                    "title": "Preparing to Read",
                    "goals": [
                        "Read simple sight words daily",
                        "Practice letter blending: c-a-t = cat",
                        "Read 3 short picture books daily",
                        "Discuss what happened in the story"
                    ],
                    "focus": "reading_fluency",
                    "personalized": True
                })

        elif level == "Intermediate":
            if week <= 2:
                # Focus on the weakest skill
                target_skill = primary_weakness if primary_weakness else skill_analyses[0]

                weekly_goals.append({
                    "week": week,
                    "title": f"Intensive {target_skill.skill_name} Practice",
                    "goals": [
                        f"Your assessment showed {target_skill.skill_name.lower()} needs work",
                        f"Practice this skill for 25 min daily",
                        "Complete targeted activities",
                        f"Goal: Improve from {target_skill.mastery_percentage}% to 70%+"
                    ],
                    "focus": target_skill.skill_name.lower().replace(" ", "_"),
                    "personalized": True
                })

            elif week <= 4:
                # Word building based on weaknesses
                weekly_goals.append({
                    "week": week,
                    "title": "Building Words & Sentences",
                    "goals": [
                        "Build 5 new CVC words daily",
                        "Practice word families you struggled with",
                        "Read simple sentences with known words",
                        "Write 3 simple sentences daily"
                    ],
                    "focus": "word_building",
                    "personalized": True
                })

            else:
                weekly_goals.append({
                    "week": week,
                    "title": "Reading Fluency Practice",
                    "goals": [
                        "Read one short story daily",
                        "Practice reading aloud for 5 min",
                        "Answer comprehension questions",
                        f"Focus on {secondary_weakness.skill_name.lower() if secondary_weakness else 'phonics'} while reading"
                    ],
                    "focus": "reading_fluency",
                    "personalized": True
                })

        else:  # Advanced
            if week <= 3:
                target_skill = primary_weakness if primary_weakness else skill_analyses[0]

                weekly_goals.append({
                    "week": week,
                    "title": f"Advanced {target_skill.skill_name} Mastery",
                    "goals": [
                        f"Based on your assessment: {target_skill.mastery_percentage}% in {target_skill.skill_name}",
                        "Practice complex letter patterns",
                        "Read multi-syllable words",
                        f"Goal: Reach 90% mastery in {target_skill.skill_name.lower()}"
                    ],
                    "focus": target_skill.skill_name.lower().replace(" ", "_"),
                    "personalized": True
                })

            else:
                weekly_goals.append({
                    "week": week,
                    "title": "Fluency & Comprehension",
                    "goals": [
                        "Read chapter books for 20 min daily",
                        "Discuss: characters, plot, setting",
                        "Practice expression while reading",
                        "Write about what you read"
                    ],
                    "focus": "reading_fluency",
                    "personalized": True
                })

    return json.dumps(weekly_goals)


def generate_week_activities(week_num: int, level: str, skill_analyses: List[SkillAnalysis], child_id: int, plan_id: int) -> List[Activity]:
    """Generate PERSONALIZED activities based on child's specific skill weaknesses"""
    activities = []
    days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]

    # Identify weakest skill
    weak_skills = sorted(
        [s for s in skill_analyses if s.status in ["Needs Work", "Learning"]],
        key=lambda x: x.mastery_percentage
    )
    primary_weakness = weak_skills[0] if weak_skills else None

    for day_num, day in enumerate(days, 1):
        if level == "Beginner":
            if week_num <= 2:
                # Focus on letter recognition if it's weak
                if primary_weakness and "Letter" in primary_weakness.skill_name:
                    if day_num % 2 == 0:
                        activities.append(Activity(
                            plan_id=plan_id, child_id=child_id, activity_type="Game",
                            activity_name=f"Letter Hunt - Day {day_num}",
                            activity_content=f"Find and identify letters (Focus: {primary_weakness.skill_name})",
                            estimated_duration_minutes=15, difficulty_level="Easy"
                        ))
                    else:
                        activities.append(Activity(
                            plan_id=plan_id, child_id=child_id, activity_type="Tracing",
                            activity_name=f"Letter Tracing - Day {day_num}",
                            activity_content=f"Trace letters while saying sounds ({primary_weakness.skill_name})",
                            estimated_duration_minutes=12, difficulty_level="Easy"
                        ))
                else:
                    activities.append(Activity(
                        plan_id=plan_id, child_id=child_id, activity_type="Game",
                        activity_name=f"Phonics Match - Day {day_num}",
                        activity_content=f"Match sounds to letters (Week {week_num})",
                        estimated_duration_minutes=12, difficulty_level="Easy"
                    ))

            elif week_num <= 4:
                # Phonics focus
                if primary_weakness and "Phonics" in primary_weakness.skill_name:
                    activities.append(Activity(
                        plan_id=plan_id, child_id=child_id, activity_type="Game",
                        activity_name=f"Phonics Practice - Day {day_num}",
                        activity_content=f"Practice letter sounds you found difficult (Target: 70% mastery)",
                        estimated_duration_minutes=15, difficulty_level="Easy"
                    ))
                else:
                    activities.append(Activity(
                        plan_id=plan_id, child_id=child_id, activity_type="Game",
                        activity_name=f"Letter Hunt - Day {day_num}",
                        activity_content="Find letters and match sounds",
                        estimated_duration_minutes=12, difficulty_level="Easy"
                    ))

            else:
                activities.append(Activity(
                    plan_id=plan_id, child_id=child_id, activity_type="Reading",
                    activity_name=f"Story Time - Day {day_num}",
                    activity_content=f"Read simple {day} story together",
                    estimated_duration_minutes=15, difficulty_level="Easy"
                ))

        elif level == "Intermediate":
            # Personalize based on weakness
            if primary_weakness:
                skill_focus = primary_weakness.skill_name
                if day_num % 3 == 0:
                    activities.append(Activity(
                        plan_id=plan_id, child_id=child_id, activity_type="Game",
                        activity_name=f"{skill_focus} Challenge - Day {day_num}",
                        activity_content=f"Targeted practice on {skill_focus} (Current: {primary_weakness.mastery_percentage}%, Goal: 80%)",
                        estimated_duration_minutes=18, difficulty_level="Medium"
                    ))
                elif day_num % 3 == 1:
                    activities.append(Activity(
                        plan_id=plan_id, child_id=child_id, activity_type="Tracing",
                        activity_name=f"Word Tracing - Day {day_num}",
                        activity_content=f"Trace CVC words focusing on {skill_focus}",
                        estimated_duration_minutes=12, difficulty_level="Medium"
                    ))
                else:
                    activities.append(Activity(
                        plan_id=plan_id, child_id=child_id, activity_type="Reading",
                        activity_name=f"Reading Practice - Day {day_num}",
                        activity_content=f"Read simple sentences applying {skill_focus}",
                        estimated_duration_minutes=15, difficulty_level="Medium"
                    ))
            else:
                activities.append(Activity(
                    plan_id=plan_id, child_id=child_id, activity_type="Game",
                    activity_name=f"Phonics Game - Day {day_num}",
                    activity_content="Practice phonics and word building",
                    estimated_duration_minutes=15, difficulty_level="Medium"
                ))

        else:  # Advanced
            if primary_weakness:
                activities.append(Activity(
                    plan_id=plan_id, child_id=child_id, activity_type="Game",
                    activity_name=f"{primary_weakness.skill_name} Mastery - Day {day_num}",
                    activity_content=f"Advanced practice on {primary_weakness.skill_name} (Target: 90% mastery)",
                    estimated_duration_minutes=20, difficulty_level="Hard"
                ))
            else:
                activities.append(Activity(
                    plan_id=plan_id, child_id=child_id, activity_type="Reading",
                    activity_name=f"Chapter Reading - Day {day_num}",
                    activity_content=f"Read chapter {(week_num * 7 + day_num) // 14}",
                    estimated_duration_minutes=25, difficulty_level="Hard"
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
