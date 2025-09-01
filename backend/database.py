from motor.motor_asyncio import AsyncIOMotorClient, AsyncIOMotorDatabase
from typing import Optional
import os
from models import MembershipPlan, FeaturedMember

class Database:
    client: Optional[AsyncIOMotorClient] = None
    db: Optional[AsyncIOMotorDatabase] = None

database = Database()

async def get_database() -> AsyncIOMotorDatabase:
    return database.db

async def connect_to_mongo():
    """Create database connection"""
    mongo_url = os.environ.get("MONGO_URL")
    database.client = AsyncIOMotorClient(mongo_url)
    database.db = database.client[os.environ.get("DB_NAME", "athletics_nt")]
    
    # Create indexes
    await create_indexes()
    
    # Initialize default data
    await initialize_default_data()

async def close_mongo_connection():
    """Close database connection"""
    if database.client:
        database.client.close()

async def create_indexes():
    """Create database indexes for better performance"""
    db = database.db
    
    # User indexes
    await db.users.create_index("email", unique=True)
    await db.users.create_index("memberId", unique=True)
    
    # Event indexes
    await db.events.create_index("date")
    await db.events.create_index("status")
    await db.events.create_index("type")
    
    # Community post indexes
    await db.community_posts.create_index("createdAt")
    await db.community_posts.create_index("authorId")
    
    # Membership plan indexes
    await db.membership_plans.create_index("planId", unique=True)

async def initialize_default_data():
    """Initialize default membership plans and featured members"""
    db = database.db
    
    # Check if membership plans exist
    plans_count = await db.membership_plans.count_documents({})
    
    if plans_count == 0:
        # Create default membership plans
        default_plans = [
            MembershipPlan(
                planId="basic",
                name="Basic Membership",
                price=50.0,
                duration="Annual",
                features=[
                    "Access to regular training sessions",
                    "Basic event participation",
                    "Monthly newsletter",
                    "Community forum access"
                ],
                popular=False
            ),
            MembershipPlan(
                planId="premium",
                name="Premium Membership",
                price=120.0,
                duration="Annual",
                features=[
                    "All Basic features",
                    "Priority event registration",
                    "Free coaching sessions (2/month)",
                    "Equipment discounts",
                    "Exclusive member events",
                    "Digital reward card"
                ],
                popular=True
            ),
            MembershipPlan(
                planId="elite",
                name="Elite Membership",
                price=200.0,
                duration="Annual",
                features=[
                    "All Premium features",
                    "Personal coaching sessions",
                    "Competition entry fees included",
                    "Advanced performance analytics",
                    "VIP event access",
                    "Custom training programs"
                ],
                popular=False
            )
        ]
        
        for plan in default_plans:
            await db.membership_plans.insert_one(plan.dict(by_alias=True))
    
    # Check if featured members exist
    members_count = await db.featured_members.count_documents({})
    
    if members_count == 0:
        # Create default featured members
        default_members = [
            FeaturedMember(
                name="Alex Chen",
                role="Sprint Coach",
                speciality="100m & 200m",
                experience="8 years",
                avatar="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face"
            ),
            FeaturedMember(
                name="Maria Rodriguez",
                role="Distance Runner",
                speciality="Marathon",
                experience="12 years",
                avatar="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face"
            ),
            FeaturedMember(
                name="David Park",
                role="Field Events Specialist",
                speciality="Javelin & Shot Put",
                experience="15 years",
                avatar="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face"
            )
        ]
        
        for member in default_members:
            await db.featured_members.insert_one(member.dict(by_alias=True))