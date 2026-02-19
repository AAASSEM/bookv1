from fastapi import APIRouter, Depends, HTTPException  # Import API Router and dependency injection tools
from sqlmodel import Session, select  # Import Session for database interaction and select for queries
from typing import List  # Import List for type hinting
from ..database import get_session  # Import the function to get a database session
from ..models import Parent, Child  # Import Parent (formerly User) and Child models
from ..auth import get_password_hash, get_current_user, verify_password # Import password hashing and auth dependency
from pydantic import BaseModel

class ParentCreate(BaseModel):
    name: str
    email: str
    password: str
    phone_number: str | None = None

class ChildCreate(BaseModel):
    name: str
    age: int
    level: str = "Beginner"

class PasswordChange(BaseModel):
    current_password: str
    new_password: str

# Create a router instance with a prefix '/users' and variable tag for documentation
# NOTE: Keeping endpoint as /users for now to avoid breaking frontend completely, but could be /parents
router = APIRouter(prefix="/users", tags=["users"])

# Endpoint to create a new parent account (formerly create_user)
@router.post("/", response_model=Parent)
def create_parent(parent_in: ParentCreate, session: Session = Depends(get_session)):
    # Hash the password
    hashed_password = get_password_hash(parent_in.password)
    
    # Create the DB model
    parent = Parent(
        name=parent_in.name,
        email=parent_in.email,
        phone_number=parent_in.phone_number,
        password_hash=hashed_password
    )
    
    # Add the new parent object to the session
    session.add(parent)
    try:
        # Commit the transaction to save to the database
        session.commit()
    except Exception as e:
        session.rollback()
        # Basic check for unique constraint violation (simplified for SQLite)
        if "UNIQUE constraint failed" in str(e) or "IntegrityError" in str(e):
            raise HTTPException(status_code=400, detail="Email already registered")
        raise e
        
    # Refresh the parent object to get the generated ID
    session.refresh(parent)
    # Return the created parent object
    return parent

# Endpoint to create a child profile linked to a specific parent
@router.post("/{parent_id}/children", response_model=Child)
def create_child(parent_id: int, child_in: ChildCreate, session: Session = Depends(get_session), current_user: Parent = Depends(get_current_user)):
    if parent_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to create child for another parent")

    # Create Child object from input
    child = Child(
        name=child_in.name,
        age=child_in.age,
        current_level=child_in.level,
        native_language="English",  # Default
        parent_id=parent_id
    )

    # Add the new child object to the session
    session.add(child)
    # Commit the transaction to save to the database
    session.commit()
    # Refresh the child object to get the generated ID
    session.refresh(child)
    # Return the created child object
    return child

# Endpoint to get all children for a specific parent
@router.get("/{parent_id}/children", response_model=List[Child])
def get_children(parent_id: int, session: Session = Depends(get_session), current_user: Parent = Depends(get_current_user)):
    if parent_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized")
    # Create a select statement to filter children by parent_id
    statement = select(Child).where(Child.parent_id == parent_id)
    # Execute the query
    results = session.exec(statement)
    # Return all matching results as a list
    return results.all()

# Endpoint to get parent details
@router.get("/{parent_id}", response_model=Parent)
def get_parent(parent_id: int, session: Session = Depends(get_session), current_user: Parent = Depends(get_current_user)):
    if parent_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized")
    parent = session.get(Parent, parent_id)
    if not parent:
        raise HTTPException(status_code=404, detail="Parent not found")
    return parent

# Endpoint to update parent profile
@router.put("/{parent_id}", response_model=Parent)
def update_parent(parent_id: int, parent_update: Parent, session: Session = Depends(get_session), current_user: Parent = Depends(get_current_user)):
    if parent_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized")
    db_parent = session.get(Parent, parent_id)
    if not db_parent:
        raise HTTPException(status_code=404, detail="Parent not found")

    # Update fields if provided
    db_parent.name = parent_update.name
    db_parent.email = parent_update.email
    if parent_update.phone_number is not None:
        db_parent.phone_number = parent_update.phone_number

    session.add(db_parent)
    session.commit()
    session.refresh(db_parent)
    return db_parent

# Endpoint to update child profile
@router.put("/children/{child_id}", response_model=Child)
def update_child(child_id: int, child_update: Child, session: Session = Depends(get_session), current_user: Parent = Depends(get_current_user)):
    db_child = session.get(Child, child_id)
    if not db_child:
        raise HTTPException(status_code=404, detail="Child not found")
    if db_child.parent_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized")

    db_child.name = child_update.name
    db_child.age = child_update.age
    # Don't allow updating current_level directly - it should be set by assessment
    # But allow updating other fields
    if child_update.native_language:
        db_child.native_language = child_update.native_language
    if child_update.date_of_birth:
        db_child.date_of_birth = child_update.date_of_birth

    session.add(db_child)
    session.commit()
    session.refresh(db_child)
    return db_child

# Endpoint to change password
@router.post("/{parent_id}/change-password")
def change_password(parent_id: int, password_data: PasswordChange, session: Session = Depends(get_session), current_user: Parent = Depends(get_current_user)):
    if parent_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized")

    db_parent = session.get(Parent, parent_id)
    if not db_parent:
        raise HTTPException(status_code=404, detail="Parent not found")

    # Verify current password
    if not verify_password(password_data.current_password, db_parent.password_hash):
        raise HTTPException(status_code=400, detail="Current password is incorrect")

    # Hash and set new password
    db_parent.password_hash = get_password_hash(password_data.new_password)

    session.add(db_parent)
    session.commit()

    return {"message": "Password changed successfully"}

# Endpoint to delete a child
@router.delete("/children/{child_id}")
def delete_child(child_id: int, session: Session = Depends(get_session), current_user: Parent = Depends(get_current_user)):
    db_child = session.get(Child, child_id)
    if not db_child:
        raise HTTPException(status_code=404, detail="Child not found")
    if db_child.parent_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized")

    session.delete(db_child)
    session.commit()

    return {"message": "Child deleted successfully"}
