from fastapi import APIRouter, Depends, HTTPException, status
from motor.motor_asyncio import AsyncIOMotorDatabase
from typing import List
from datetime import datetime
from models import MembershipPlanResponse, UserResponse, MembershipStats
from auth import get_current_user, get_optional_current_user
from database import get_database
from utils import generate_qr_code, create_qr_data

router = APIRouter(prefix="/membership", tags=["membership"])

@router.get("/plans", response_model=List[MembershipPlanResponse])
async def get_membership_plans(
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    """Get all active membership plans"""
    
    plans_cursor = db.membership_plans.find({"active": True}).sort("price", 1)
    plans = await plans_cursor.to_list(length=10)
    
    plan_responses = []
    for plan in plans:
        plan_response = MembershipPlanResponse(
            id=plan["planId"],
            name=plan["name"],
            price=plan["price"],
            duration=plan["duration"],
            features=plan["features"],
            popular=plan["popular"]
        )
        plan_responses.append(plan_response)
    
    return plan_responses

@router.post("/subscribe")
async def subscribe_to_plan(
    plan_data: dict,
    db: AsyncIOMotorDatabase = Depends(get_database),
    current_user: UserResponse = Depends(get_current_user)
):
    """Subscribe to a membership plan"""
    
    plan_id = plan_data.get("planId")
    if not plan_id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Plan ID is required"
        )
    
    # Check if plan exists
    plan = await db.membership_plans.find_one({"planId": plan_id, "active": True})
    if not plan:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Membership plan not found"
        )
    
    # Update user's membership type
    await db.users.update_one(
        {"_id": current_user.id},
        {
            "$set": {
                "membershipType": plan_id,
                "membershipStatus": "active",
                "updatedAt": datetime.utcnow()
            }
        }
    )
    
    # Generate new QR code for the user
    qr_data = create_qr_data("member", current_user.id, plan_id)
    qr_code_image = generate_qr_code(qr_data)
    
    # Update user's QR code
    await db.users.update_one(
        {"_id": current_user.id},
        {"$set": {"qrCode": qr_code_image}}
    )
    
    return {
        "message": f"Successfully subscribed to {plan['name']}",
        "planName": plan["name"],
        "planId": plan_id,
        "price": plan["price"],
        "qrCode": qr_code_image
    }

@router.get("/card/{user_id}")
async def get_membership_card(
    user_id: str,
    db: AsyncIOMotorDatabase = Depends(get_database),
    current_user: UserResponse = Depends(get_current_user)
):
    """Get user's digital membership card"""
    
    # Users can only get their own card (or admin can get any)
    if user_id != current_user.id:
        # In a real app, check for admin privileges here
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You can only access your own membership card"
        )
    
    user = await db.users.find_one({"_id": user_id})
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    # Get membership plan details
    plan = await db.membership_plans.find_one({"planId": user["membershipType"]})
    
    return {
        "memberId": user["memberId"],
        "name": user["name"],
        "email": user["email"],
        "membershipType": user["membershipType"],
        "membershipStatus": user["membershipStatus"],
        "joinDate": user["joinDate"],
        "qrCode": user.get("qrCode"),
        "planDetails": {
            "name": plan["name"] if plan else "Basic Membership",
            "features": plan["features"] if plan else [],
            "price": plan["price"] if plan else 0
        }
    }

@router.get("/stats", response_model=MembershipStats)
async def get_membership_stats(
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    """Get membership statistics"""
    
    # Get total members
    total_members = await db.users.count_documents({})
    
    # Get active events
    active_events = await db.events.count_documents({"status": "upcoming"})
    
    # Get completed events
    completed_events = await db.events.count_documents({"status": "completed"})
    
    # Calculate training hours (mock data for now)
    # In a real app, you'd track actual training hours
    training_hours = total_members * 10 + completed_events * 5
    
    return MembershipStats(
        totalMembers=total_members,
        activeEvents=active_events,
        completedEvents=completed_events,
        trainingHours=training_hours
    )

@router.get("/my-card")
async def get_my_membership_card(
    current_user: UserResponse = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    """Get current user's membership card"""
    
    # Get user's full data
    user = await db.users.find_one({"_id": current_user.id})
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    # Get membership plan details
    plan = await db.membership_plans.find_one({"planId": user["membershipType"]})
    
    return {
        "memberId": user["memberId"],
        "name": user["name"],
        "email": user["email"],
        "membershipType": user["membershipType"],
        "membershipStatus": user["membershipStatus"],
        "joinDate": user["joinDate"],
        "qrCode": user.get("qrCode"),
        "planDetails": {
            "name": plan["name"] if plan else "Basic Membership",
            "features": plan["features"] if plan else [],
            "price": plan["price"] if plan else 0
        }
    }

@router.post("/generate-card")
async def generate_new_membership_card(
    current_user: UserResponse = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    """Generate a new membership card with QR code"""
    
    # Generate new QR code
    qr_data = create_qr_data("member", current_user.id, current_user.membershipType.value)
    qr_code_image = generate_qr_code(qr_data)
    
    # Update user's QR code in database
    await db.users.update_one(
        {"_id": current_user.id},
        {"$set": {"qrCode": qr_code_image, "updatedAt": datetime.utcnow()}}
    )
    
    return {
        "message": "New membership card generated successfully",
        "qrCode": qr_code_image,
        "memberId": current_user.memberId
    }