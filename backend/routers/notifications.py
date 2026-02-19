from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select
from typing import List
from ..database import get_session
from ..models import Notification, Parent
from ..auth import get_current_user

router = APIRouter(prefix="/notifications", tags=["notifications"])

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
