from fastapi import APIRouter, Depends, HTTPException, status, Query
from motor.motor_asyncio import AsyncIOMotorDatabase
from typing import List, Optional
from models import (
    Event, EventCreate, EventUpdate, EventResponse, EventRegistration, 
    EventStatus, UserResponse
)
from auth import get_current_user, get_optional_current_user
from database import get_database
from datetime import datetime
import uuid

router = APIRouter(prefix="/events", tags=["events"])

@router.get("/", response_model=List[EventResponse])
async def get_events(
    status_filter: Optional[str] = Query(None, description="Filter by status: upcoming, previous, all"),
    event_type: Optional[str] = Query(None, description="Filter by event type"),
    member_only: Optional[bool] = Query(None, description="Filter member-only events"),
    db: AsyncIOMotorDatabase = Depends(get_database),
    current_user: Optional[UserResponse] = Depends(get_optional_current_user)
):
    """Get all events with optional filters"""
    
    # Build query
    query = {}
    
    if status_filter == "upcoming":
        query["status"] = EventStatus.UPCOMING
    elif status_filter == "previous":
        query["status"] = {"$in": [EventStatus.COMPLETED, EventStatus.CANCELLED]}
    
    if event_type:
        query["type"] = event_type
        
    if member_only is not None:
        query["memberOnly"] = member_only
    
    # Get events from database
    events_cursor = db.events.find(query).sort("date", 1)
    events = await events_cursor.to_list(length=100)
    
    # Convert to response format
    event_responses = []
    for event in events:
        # Check if user is registered
        user_registered = False
        if current_user:
            user_registered = any(
                reg["userId"] == current_user.id 
                for reg in event.get("registrations", [])
            )
        
        event_response = EventResponse(
            id=event["_id"],
            name=event["name"],
            description=event["description"],
            date=event["date"],
            time=event["time"],
            type=event["type"],
            location=event["location"],
            maxCapacity=event["maxCapacity"],
            memberOnly=event["memberOnly"],
            price=event["price"],
            registrationDeadline=event["registrationDeadline"],
            status=event["status"],
            registrations=len(event.get("registrations", [])),
            results=event.get("results")
        )
        event_responses.append(event_response)
    
    return event_responses

@router.get("/{event_id}", response_model=EventResponse)
async def get_event(
    event_id: str,
    db: AsyncIOMotorDatabase = Depends(get_database),
    current_user: Optional[UserResponse] = Depends(get_optional_current_user)
):
    """Get specific event by ID"""
    
    event = await db.events.find_one({"_id": event_id})
    if not event:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Event not found"
        )
    
    return EventResponse(
        id=event["_id"],
        name=event["name"],
        description=event["description"],
        date=event["date"],
        time=event["time"],
        type=event["type"],
        location=event["location"],
        maxCapacity=event["maxCapacity"],
        memberOnly=event["memberOnly"],
        price=event["price"],
        registrationDeadline=event["registrationDeadline"],
        status=event["status"],
        registrations=len(event.get("registrations", [])),
        results=event.get("results")
    )

@router.post("/", response_model=EventResponse)
async def create_event(
    event_data: EventCreate,
    db: AsyncIOMotorDatabase = Depends(get_database),
    current_user: UserResponse = Depends(get_current_user)
):
    """Create new event (admin only)"""
    
    # In a real app, you'd check for admin privileges here
    # For now, any authenticated user can create events
    
    new_event = Event(
        name=event_data.name,
        description=event_data.description,
        date=event_data.date,
        time=event_data.time,
        type=event_data.type,
        location=event_data.location,
        maxCapacity=event_data.maxCapacity,
        memberOnly=event_data.memberOnly,
        price=event_data.price,
        registrationDeadline=event_data.registrationDeadline
    )
    
    result = await db.events.insert_one(new_event.dict(by_alias=True))
    
    return EventResponse(
        id=str(result.inserted_id),
        name=new_event.name,
        description=new_event.description,
        date=new_event.date,
        time=new_event.time,
        type=new_event.type,
        location=new_event.location,
        maxCapacity=new_event.maxCapacity,
        memberOnly=new_event.memberOnly,
        price=new_event.price,
        registrationDeadline=new_event.registrationDeadline,
        status=new_event.status,
        registrations=0,
        results=new_event.results
    )

@router.post("/{event_id}/register")
async def register_for_event(
    event_id: str,
    db: AsyncIOMotorDatabase = Depends(get_database),
    current_user: UserResponse = Depends(get_current_user)
):
    """Register current user for an event"""
    
    # Get event
    event = await db.events.find_one({"_id": event_id})
    if not event:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Event not found"
        )
    
    # Check if event is member-only and user has appropriate membership
    if event["memberOnly"] and current_user.membershipType.value == "basic":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="This event requires premium or elite membership"
        )
    
    # Check if event is full
    current_registrations = len(event.get("registrations", []))
    if current_registrations >= event["maxCapacity"]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Event is full"
        )
    
    # Check if user is already registered
    registrations = event.get("registrations", [])
    if any(reg["userId"] == current_user.id for reg in registrations):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Already registered for this event"
        )
    
    # Add registration
    new_registration = EventRegistration(
        userId=current_user.id,
        registrationDate=datetime.utcnow()
    )
    
    await db.events.update_one(
        {"_id": event_id},
        {"$push": {"registrations": new_registration.dict()}}
    )
    
    return {
        "message": "Successfully registered for event",
        "eventName": event["name"],
        "registrationDate": new_registration.registrationDate
    }

@router.delete("/{event_id}/register")
async def unregister_from_event(
    event_id: str,
    db: AsyncIOMotorDatabase = Depends(get_database),
    current_user: UserResponse = Depends(get_current_user)
):
    """Unregister current user from an event"""
    
    # Remove registration
    result = await db.events.update_one(
        {"_id": event_id},
        {"$pull": {"registrations": {"userId": current_user.id}}}
    )
    
    if result.modified_count == 0:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Registration not found or event not found"
        )
    
    return {"message": "Successfully unregistered from event"}

@router.get("/{event_id}/registrations")
async def get_event_registrations(
    event_id: str,
    db: AsyncIOMotorDatabase = Depends(get_database),
    current_user: UserResponse = Depends(get_current_user)
):
    """Get event registrations (admin only)"""
    
    event = await db.events.find_one({"_id": event_id})
    if not event:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Event not found"
        )
    
    registrations = event.get("registrations", [])
    
    # Get user details for each registration
    registration_details = []
    for reg in registrations:
        user = await db.users.find_one({"_id": reg["userId"]})
        if user:
            registration_details.append({
                "userId": reg["userId"],
                "userName": user["name"],
                "userEmail": user["email"],
                "registrationDate": reg["registrationDate"],
                "membershipType": user["membershipType"]
            })
    
    return {
        "eventId": event_id,
        "eventName": event["name"],
        "totalRegistrations": len(registrations),
        "maxCapacity": event["maxCapacity"],
        "registrations": registration_details
    }