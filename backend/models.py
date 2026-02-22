from typing import Optional, List  # Import Optional (for nullable fields) and List (for relationships) from typing module
from sqlmodel import Field, SQLModel, Relationship  # Import key components from SQLModel for database definition
from datetime import datetime, date  # Import datetime and date types for timestamp and date fields

# --- 1. PARENT ENTITY ---
class Parent(SQLModel, table=True):
    # Primary Key: Unique identifier for the parent
    id: Optional[int] = Field(default=None, primary_key=True)
    # Parent's full name
    name: str
    # Parent's email address (should be unique in a real app)
    email: str = Field(index=True, unique=True)
    # Parent's phone number
    phone_number: Optional[str] = None
    # Secure hash of the parent's password (never store plain text passwords)
    password_hash: str
    # Notification preferences (stored as JSON string)
    notification_data: Optional[str] = None

    # Relationship: One parent can have multiple children
    children: List["Child"] = Relationship(back_populates="parent")
    # Relationship: One parent has one progress record (as per ERD, though usually progress is per child)
    progress: List["Progress"] = Relationship(back_populates="parent")
    # Relationship: One parent receives multiple notifications
    notifications: List["Notification"] = Relationship(back_populates="parent")

# --- 2. CHILD ENTITY ---
class Child(SQLModel, table=True):
    # Primary Key: Unique identifier for the child
    id: Optional[int] = Field(default=None, primary_key=True)
    # Child's name
    name: str
    # Child's date of birth
    date_of_birth: Optional[date] = None
    # Current reading/skill level (e.g., "Beginner")
    current_level: str = "Beginner"
    # Child's native language
    native_language: str = "English"
    # Child's age (could be derived from DOB, but stored explicitly as per ERD)
    age: int
    # Foreign Key: Links this child to a specific Parent
    parent_id: Optional[int] = Field(default=None, foreign_key="parent.id")
    
    # Relationship: Link back to the Parent
    parent: Optional[Parent] = Relationship(back_populates="children")
    # Relationship: One child has many assessments
    assessments: List["Assessment"] = Relationship(back_populates="child")
    # Relationship: One child has many activities assigned/completed
    activities: List["Activity"] = Relationship(back_populates="child")
    # Relationship: One child earns many achievements
    achievements: List["Achievement"] = Relationship(back_populates="child")

# --- 3. ASSESSMENT ENTITY ---
class Assessment(SQLModel, table=True):
    # Primary Key: Unique identifier for the assessment
    id: Optional[int] = Field(default=None, primary_key=True)
    # Foreign Key: Links assessment to a specific Child
    child_id: int = Field(foreign_key="child.id")
    # Type of assessment (e.g., "Placement", "Progress Check")
    assessment_type: str
    # Total number of questions in the assessment
    total_questions: int
    # Number of questions answered correctly
    correct_answers: int
    # Accuracy percentage (0-100)
    accuracy_percentage: float
    # Date when the assessment was taken
    assessment_date: datetime = Field(default_factory=datetime.utcnow)
    # Resulting skill level determined by the assessment
    skill_level_result: str
    # Flag to indicate if this is the initial placement test
    is_initial: bool = False
    
    # Relationship: Link back to the Child
    child: Optional[Child] = Relationship(back_populates="assessments")
    # Relationship: One assessment has many questions
    questions: List["AssessmentQuestion"] = Relationship(back_populates="assessment")
    # Relationship: One assessment generates one Learning Plan
    learning_plan: Optional["LearningPlan"] = Relationship(back_populates="assessment")

# --- 4. ASSESSMENT_QUESTION ENTITY ---
class AssessmentQuestion(SQLModel, table=True):
    # Primary Key: Unique identifier for the question record
    id: Optional[int] = Field(default=None, primary_key=True)
    # Foreign Key: Links to the parent Assessment
    assessment_id: int = Field(foreign_key="assessment.id")
    # Type of question (e.g., "Multiple Choice", "Drag and Drop")
    question_type: str
    # Content of the question (text or JSON string)
    question_content: str
    # The answer provided by the child
    child_answer: str
    # The correct answer for validation
    correct_answer: str
    # Time taken to answer in seconds
    time_spent_seconds: int
    # Boolean flag: True if correct, False otherwise
    is_correct: bool
    
    # Relationship: Link back to the Assessment
    assessment: Optional[Assessment] = Relationship(back_populates="questions")

# --- 5. LEARNING_PLAN ENTITY ---
class LearningPlan(SQLModel, table=True):
    # Primary Key: Unique identifier for the learning plan
    id: Optional[int] = Field(default=None, primary_key=True)
    # Foreign Key: Links plan to the Assessment that expanded it
    assessment_id: int = Field(foreign_key="assessment.id")
    # Date when the plan was created
    plan_created_date: datetime = Field(default_factory=datetime.utcnow)
    # Duration of the plan in weeks
    duration_weeks: int
    # Start date of the plan
    plan_start_date: datetime
    # Current status of the plan (e.g., "Active", "Completed")
    status: str
    # Projected end date
    plan_end_date: datetime
    # Focus areas description (e.g., "Vowels", "Phonics")
    focus_areas: str
    # Weekly goals description
    weekly_goals: str
    
    # Relationship: Link back to Assessment
    assessment: Optional[Assessment] = Relationship(back_populates="learning_plan")
    # Relationship: One plan contains many activities
    activities: List["Activity"] = Relationship(back_populates="learning_plan")

# --- 6. ACTIVITY ENTITY ---
class Activity(SQLModel, table=True):
    # Primary Key: Unique identifier for the activity
    id: Optional[int] = Field(default=None, primary_key=True)
    # Type of activity (e.g., "Game", "Video")
    activity_type: str
    # Display name of the activity
    activity_name: str
    # Content or URL for the activity
    activity_content: str
    # Estimated time to complete in minutes
    estimated_duration_minutes: int
    # Language of the activity
    language: str = "English"
    # Difficulty level (1-10 or "Easy", "Hard")
    difficulty_level: str
    # Foreign Key: Links activity to a Learning Plan
    plan_id: Optional[int] = Field(default=None, foreign_key="learningplan.id")
    # Foreign Key: Links activity to a specific Child (if assigned directly)
    child_id: Optional[int] = Field(default=None, foreign_key="child.id")
    
    # Relationships
    learning_plan: Optional[LearningPlan] = Relationship(back_populates="activities")
    child: Optional[Child] = Relationship(back_populates="activities")
    # Relationship to ActivityProgress linkage
    progress_records: List["ActivityProgress"] = Relationship(back_populates="activity")

# --- 7. ACTIVITY_PROGRESS ENTITY ---
# This is a link table or detailed status table for activity completion
class ActivityProgress(SQLModel, table=True):
    # Primary Key (Composite typically, but using ID for simplicity in SQLModel)
    id: Optional[int] = Field(default=None, primary_key=True)
    # Foreign Key: Links to the Activity
    activity_id: int = Field(foreign_key="activity.id")
    # Foreign Key: Links to the main Progress entity
    progress_id: int = Field(foreign_key="progress.id")
    
    # Status: "In Progress", "Completed"
    completion_status: str
    # Time spent on this specific attempt/record
    total_time_spent_minutes: int
    
    # Relationships
    activity: Optional[Activity] = Relationship(back_populates="progress_records")
    parent_progress: Optional["Progress"] = Relationship(back_populates="activity_progress_items")

# --- 8. PROGRESS ENTITY ---
# Aggregated progress stats (per ERD linked to Parent)
class Progress(SQLModel, table=True):
    # Primary Key
    id: Optional[int] = Field(default=None, primary_key=True)
    # Total score accumulated
    total_score: int
    # Current streak in days
    streak_days: int
    # Foreign Key: Links to Parent
    parent_id: int = Field(foreign_key="parent.id")
    
    # Relationship: Link back to Parent
    parent: Optional[Parent] = Relationship(back_populates="progress")
    # Relationship: Contains many activity progress records
    activity_progress_items: List[ActivityProgress] = Relationship(back_populates="parent_progress")

# --- 9. ACHIEVEMENT ENTITY ---
class Achievement(SQLModel, table=True):
    # Primary Key
    id: Optional[int] = Field(default=None, primary_key=True)
    # Name of the achievement/badge
    achievement_name: str
    # Description of how to earn it
    description: str
    # Icon identifier or URL
    badge_icon: str
    # Foreign Key: Links to the Child who earned it
    child_id: int = Field(foreign_key="child.id")
    
    # Relationship: Link back to Child
    child: Optional[Child] = Relationship(back_populates="achievements")

# --- 10. NOTIFICATION ENTITY ---
class Notification(SQLModel, table=True):
    # Primary Key
    id: Optional[int] = Field(default=None, primary_key=True)
    # Type of notification (e.g., "Reminder", "Achievement")
    notification_type: str
    # The message content
    message: str
    # Any additional data (JSON string)
    notification_data: Optional[str] = None
    # When to send the notification
    scheduled_time: datetime
    # When it was actually sent
    sent_time: Optional[datetime] = None
    # Boolean flag: True if read by user
    is_read: bool = False
    # Foreign Key: Links to Parent (User)
    parent_id: int = Field(foreign_key="parent.id")
    
    # Relationship: Link back to Parent
    parent: Optional[Parent] = Relationship(back_populates="notifications")
