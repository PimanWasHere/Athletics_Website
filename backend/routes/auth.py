from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials
from motor.motor_asyncio import AsyncIOMotorDatabase
from datetime import timedelta
from models import UserCreate, UserLogin, Token, UserResponse, User
from auth import (
    get_password_hash, 
    verify_password, 
    create_access_token, 
    get_current_user,
    ACCESS_TOKEN_EXPIRE_MINUTES
)
from database import get_database
from utils import generate_qr_code, create_qr_data, generate_member_id
import uuid

router = APIRouter(prefix="/auth", tags=["authentication"])

@router.post("/register", response_model=Token)
async def register_user(
    user_data: UserCreate,
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    """Register a new user"""
    
    # Check if user already exists
    existing_user = await db.users.find_one({"email": user_data.email})
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    # Create new user
    hashed_password = get_password_hash(user_data.password)
    member_id = generate_member_id()
    
    # Generate QR code for new user
    qr_data = create_qr_data("member", str(uuid.uuid4()), user_data.membershipType.value)
    qr_code_image = generate_qr_code(qr_data)
    
    new_user = User(
        name=user_data.name,
        email=user_data.email,
        password=hashed_password,
        memberId=member_id,
        membershipType=user_data.membershipType,
        qrCode=qr_code_image
    )
    
    # Insert user into database
    result = await db.users.insert_one(new_user.dict(by_alias=True))
    
    # Create access token
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user_data.email}, 
        expires_delta=access_token_expires
    )
    
    # Prepare user response
    user_response = UserResponse(
        id=str(result.inserted_id),
        name=new_user.name,
        email=new_user.email,
        memberId=new_user.memberId,
        membershipType=new_user.membershipType,
        membershipStatus=new_user.membershipStatus,
        joinDate=new_user.joinDate,
        avatar=new_user.avatar,
        qrCode=new_user.qrCode
    )
    
    return Token(
        access_token=access_token,
        user=user_response
    )

@router.post("/login", response_model=Token)
async def login_user(
    user_credentials: UserLogin,
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    """Login user"""
    
    # Find user by email
    user_data = await db.users.find_one({"email": user_credentials.email})
    if not user_data:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials"
        )
    
    # Verify password
    if not verify_password(user_credentials.password, user_data["password"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials"
        )
    
    # Create access token
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user_credentials.email},
        expires_delta=access_token_expires
    )
    
    # Prepare user response
    user_response = UserResponse(
        id=user_data["_id"],
        name=user_data["name"],
        email=user_data["email"],
        memberId=user_data["memberId"],
        membershipType=user_data["membershipType"],
        membershipStatus=user_data["membershipStatus"],
        joinDate=user_data["joinDate"],
        avatar=user_data.get("avatar"),
        qrCode=user_data.get("qrCode")
    )
    
    return Token(
        access_token=access_token,
        user=user_response
    )

@router.get("/me", response_model=UserResponse)
async def get_current_user_profile(
    current_user: UserResponse = Depends(get_current_user)
):
    """Get current user profile"""
    return current_user

@router.put("/profile", response_model=UserResponse)
async def update_user_profile(
    user_update: dict,
    current_user: UserResponse = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    """Update user profile"""
    
    # Prepare update data
    update_data = {k: v for k, v in user_update.items() if v is not None}
    if update_data:
        update_data["updatedAt"] = datetime.utcnow()
        
        # Update user in database
        await db.users.update_one(
            {"_id": current_user.id},
            {"$set": update_data}
        )
        
        # Get updated user data
        updated_user = await db.users.find_one({"_id": current_user.id})
        
        return UserResponse(
            id=updated_user["_id"],
            name=updated_user["name"],
            email=updated_user["email"],
            memberId=updated_user["memberId"],
            membershipType=updated_user["membershipType"],
            membershipStatus=updated_user["membershipStatus"],
            joinDate=updated_user["joinDate"],
            avatar=updated_user.get("avatar"),
            qrCode=updated_user.get("qrCode")
        )
    
    return current_user

@router.post("/qr-generate")
async def generate_user_qr(
    current_user: UserResponse = Depends(get_current_user)
):
    """Generate new QR code for current user"""
    
    qr_data = create_qr_data("member", current_user.id, current_user.membershipType.value)
    qr_code_image = generate_qr_code(qr_data)
    
    return {
        "qrCode": qr_code_image,
        "data": qr_data,
        "message": "QR code generated successfully"
    }