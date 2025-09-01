from pydantic import BaseModel, Field, EmailStr
from typing import List, Optional, Dict, Any
from datetime import datetime
from enum import Enum
import uuid

# Enums
class MembershipType(str, Enum):
    BASIC = "basic"
    PREMIUM = "premium" 
    ELITE = "elite"

class MembershipStatus(str, Enum):
    ACTIVE = "active"
    INACTIVE = "inactive"
    EXPIRED = "expired"

class EventStatus(str, Enum):
    UPCOMING = "upcoming"
    ONGOING = "ongoing"
    COMPLETED = "completed"
    CANCELLED = "cancelled"

class EventType(str, Enum):
    CHAMPIONSHIP = "Championship"
    TRAINING = "Training"
    COMPETITION = "Competition"
    SPRINT = "Sprint"
    TRAINING_CAMP = "Training Camp"
    FIELD_EVENTS = "Field Events"

# User Models
class User(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()), alias="_id")
    name: str
    email: EmailStr
    password: str
    memberId: str = Field(default_factory=lambda: f"2024{str(uuid.uuid4().int)[:3]}")
    membershipType: MembershipType = MembershipType.BASIC
    membershipStatus: MembershipStatus = MembershipStatus.ACTIVE
    joinDate: datetime = Field(default_factory=datetime.utcnow)
    avatar: Optional[str] = None
    qrCode: Optional[str] = None
    createdAt: datetime = Field(default_factory=datetime.utcnow)
    updatedAt: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        populate_by_name = True
        json_encoders = {datetime: lambda v: v.isoformat()}

class UserCreate(BaseModel):
    name: str
    email: EmailStr
    password: str
    membershipType: Optional[MembershipType] = MembershipType.BASIC

class UserUpdate(BaseModel):
    name: Optional[str] = None
    email: Optional[EmailStr] = None
    membershipType: Optional[MembershipType] = None
    avatar: Optional[str] = None

class UserResponse(BaseModel):
    id: str
    name: str
    email: EmailStr
    memberId: str
    membershipType: MembershipType
    membershipStatus: MembershipStatus
    joinDate: datetime
    avatar: Optional[str] = None
    qrCode: Optional[str] = None

# Authentication Models
class UserLogin(BaseModel):
    email: EmailStr
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse

# Event Models
class EventRegistration(BaseModel):
    userId: str
    registrationDate: datetime = Field(default_factory=datetime.utcnow)

class EventResults(BaseModel):
    winner: Optional[str] = None
    participants: int = 0
    completed: bool = False

class Event(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()), alias="_id")
    name: str
    description: str
    date: str  # Format: "March 15, 2025"
    time: str  # Format: "9:00 AM - 5:00 PM"
    type: EventType
    location: str
    maxCapacity: int
    memberOnly: bool = False
    price: float = 0.0
    registrationDeadline: str
    status: EventStatus = EventStatus.UPCOMING
    registrations: List[EventRegistration] = []
    results: Optional[EventResults] = None
    createdAt: datetime = Field(default_factory=datetime.utcnow)
    updatedAt: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        populate_by_name = True
        json_encoders = {datetime: lambda v: v.isoformat()}

class EventCreate(BaseModel):
    name: str
    description: str
    date: str
    time: str
    type: EventType
    location: str
    maxCapacity: int
    memberOnly: bool = False
    price: float = 0.0
    registrationDeadline: str

class EventUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    date: Optional[str] = None
    time: Optional[str] = None
    type: Optional[EventType] = None
    location: Optional[str] = None
    maxCapacity: Optional[int] = None
    memberOnly: Optional[bool] = None
    price: Optional[float] = None
    registrationDeadline: Optional[str] = None
    status: Optional[EventStatus] = None

class EventResponse(BaseModel):
    id: str
    name: str
    description: str
    date: str
    time: str
    type: EventType
    location: str
    maxCapacity: int
    memberOnly: bool
    price: float
    registrationDeadline: str
    status: EventStatus
    registrations: int  # Count of registrations
    results: Optional[EventResults] = None

# Community Models
class Comment(BaseModel):
    userId: str
    author: str
    content: str
    createdAt: datetime = Field(default_factory=datetime.utcnow)

class Like(BaseModel):
    userId: str
    likedAt: datetime = Field(default_factory=datetime.utcnow)

class CommunityPost(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()), alias="_id")
    author: str
    authorId: str
    title: str
    content: str
    likes: List[Like] = []
    comments: List[Comment] = []
    createdAt: datetime = Field(default_factory=datetime.utcnow)
    updatedAt: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        populate_by_name = True
        json_encoders = {datetime: lambda v: v.isoformat()}

class PostCreate(BaseModel):
    title: str
    content: str

class PostUpdate(BaseModel):
    title: Optional[str] = None
    content: Optional[str] = None

class PostResponse(BaseModel):
    id: str
    author: str
    authorId: str
    title: str
    content: str
    likes: int  # Count of likes
    comments: int  # Count of comments
    timestamp: str  # Formatted timestamp
    
class CommentCreate(BaseModel):
    content: str

# Membership Plan Models
class MembershipPlan(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()), alias="_id")
    planId: str  # "basic", "premium", "elite"
    name: str
    price: float
    duration: str
    features: List[str]
    popular: bool = False
    active: bool = True
    createdAt: datetime = Field(default_factory=datetime.utcnow)
    updatedAt: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        populate_by_name = True
        json_encoders = {datetime: lambda v: v.isoformat()}

class MembershipPlanResponse(BaseModel):
    id: str
    name: str
    price: float
    duration: str
    features: List[str]
    popular: bool

# Statistics Models
class MembershipStats(BaseModel):
    totalMembers: int
    activeEvents: int
    completedEvents: int
    trainingHours: int

class CommunityStats(BaseModel):
    totalMembers: int
    totalPosts: int  
    totalComments: int
    totalLikes: int

# QR Code Models
class QRCodeGenerate(BaseModel):
    type: str  # "access" or "member"
    userId: str

class QRCodeResponse(BaseModel):
    qrCode: str
    url: str

class QRScanRequest(BaseModel):
    qrCode: str

class QRScanResponse(BaseModel):
    valid: bool
    message: str
    user: Optional[UserResponse] = None

# Featured Member Model
class FeaturedMember(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()), alias="_id")
    name: str
    role: str
    speciality: str
    experience: str
    avatar: str
    active: bool = True

    class Config:
        populate_by_name = True