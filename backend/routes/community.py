from fastapi import APIRouter, Depends, HTTPException, status, Query
from motor.motor_asyncio import AsyncIOMotorDatabase
from typing import List, Optional
from models import (
    CommunityPost, PostCreate, PostUpdate, PostResponse, 
    CommentCreate, Comment, Like, UserResponse, FeaturedMember
)
from auth import get_current_user, get_optional_current_user
from database import get_database
from utils import format_timestamp
from datetime import datetime

router = APIRouter(prefix="/community", tags=["community"])

@router.get("/posts", response_model=List[PostResponse])
async def get_community_posts(
    limit: int = Query(10, ge=1, le=50),
    skip: int = Query(0, ge=0),
    db: AsyncIOMotorDatabase = Depends(get_database),
    current_user: Optional[UserResponse] = Depends(get_optional_current_user)
):
    """Get community posts with pagination"""
    
    posts_cursor = db.community_posts.find().sort("createdAt", -1).skip(skip).limit(limit)
    posts = await posts_cursor.to_list(length=limit)
    
    post_responses = []
    for post in posts:
        post_response = PostResponse(
            id=post["_id"],
            author=post["author"],
            authorId=post["authorId"],
            title=post["title"],
            content=post["content"],
            likes=len(post.get("likes", [])),
            comments=len(post.get("comments", [])),
            timestamp=format_timestamp(post["createdAt"])
        )
        post_responses.append(post_response)
    
    return post_responses

@router.post("/posts", response_model=PostResponse)
async def create_post(
    post_data: PostCreate,
    db: AsyncIOMotorDatabase = Depends(get_database),
    current_user: UserResponse = Depends(get_current_user)
):
    """Create a new community post"""
    
    new_post = CommunityPost(
        author=current_user.name,
        authorId=current_user.id,
        title=post_data.title,
        content=post_data.content
    )
    
    result = await db.community_posts.insert_one(new_post.dict(by_alias=True))
    
    return PostResponse(
        id=str(result.inserted_id),
        author=new_post.author,
        authorId=new_post.authorId,
        title=new_post.title,
        content=new_post.content,
        likes=0,
        comments=0,
        timestamp=format_timestamp(new_post.createdAt)
    )

@router.put("/posts/{post_id}", response_model=PostResponse)
async def update_post(
    post_id: str,
    post_update: PostUpdate,
    db: AsyncIOMotorDatabase = Depends(get_database),
    current_user: UserResponse = Depends(get_current_user)
):
    """Update a community post (author only)"""
    
    # Get existing post
    post = await db.community_posts.find_one({"_id": post_id})
    if not post:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Post not found"
        )
    
    # Check if user is the author
    if post["authorId"] != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You can only edit your own posts"
        )
    
    # Prepare update data
    update_data = {k: v for k, v in post_update.dict().items() if v is not None}
    if update_data:
        update_data["updatedAt"] = datetime.utcnow()
        
        await db.community_posts.update_one(
            {"_id": post_id},
            {"$set": update_data}
        )
    
    # Get updated post
    updated_post = await db.community_posts.find_one({"_id": post_id})
    
    return PostResponse(
        id=updated_post["_id"],
        author=updated_post["author"],
        authorId=updated_post["authorId"],
        title=updated_post["title"],
        content=updated_post["content"],
        likes=len(updated_post.get("likes", [])),
        comments=len(updated_post.get("comments", [])),
        timestamp=format_timestamp(updated_post["createdAt"])
    )

@router.delete("/posts/{post_id}")
async def delete_post(
    post_id: str,
    db: AsyncIOMotorDatabase = Depends(get_database),
    current_user: UserResponse = Depends(get_current_user)
):
    """Delete a community post (author only)"""
    
    # Get existing post
    post = await db.community_posts.find_one({"_id": post_id})
    if not post:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Post not found"
        )
    
    # Check if user is the author
    if post["authorId"] != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You can only delete your own posts"
        )
    
    await db.community_posts.delete_one({"_id": post_id})
    
    return {"message": "Post deleted successfully"}

@router.post("/posts/{post_id}/like")
async def toggle_post_like(
    post_id: str,
    db: AsyncIOMotorDatabase = Depends(get_database),
    current_user: UserResponse = Depends(get_current_user)
):
    """Like or unlike a post"""
    
    # Get post
    post = await db.community_posts.find_one({"_id": post_id})
    if not post:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Post not found"
        )
    
    # Check if user already liked the post
    likes = post.get("likes", [])
    user_liked = any(like["userId"] == current_user.id for like in likes)
    
    if user_liked:
        # Unlike the post
        await db.community_posts.update_one(
            {"_id": post_id},
            {"$pull": {"likes": {"userId": current_user.id}}}
        )
        return {"message": "Post unliked", "liked": False}
    else:
        # Like the post
        new_like = Like(userId=current_user.id)
        await db.community_posts.update_one(
            {"_id": post_id},
            {"$push": {"likes": new_like.dict()}}
        )
        return {"message": "Post liked", "liked": True}

@router.post("/posts/{post_id}/comment")
async def add_comment(
    post_id: str,
    comment_data: CommentCreate,
    db: AsyncIOMotorDatabase = Depends(get_database),
    current_user: UserResponse = Depends(get_current_user)
):
    """Add comment to a post"""
    
    # Check if post exists
    post = await db.community_posts.find_one({"_id": post_id})
    if not post:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Post not found"
        )
    
    # Create new comment
    new_comment = Comment(
        userId=current_user.id,
        author=current_user.name,
        content=comment_data.content
    )
    
    # Add comment to post
    await db.community_posts.update_one(
        {"_id": post_id},
        {"$push": {"comments": new_comment.dict()}}
    )
    
    return {
        "message": "Comment added successfully",
        "comment": {
            "author": new_comment.author,
            "content": new_comment.content,
            "createdAt": new_comment.createdAt
        }
    }

@router.get("/posts/{post_id}/comments")
async def get_post_comments(
    post_id: str,
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    """Get comments for a specific post"""
    
    post = await db.community_posts.find_one({"_id": post_id})
    if not post:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Post not found"
        )
    
    comments = post.get("comments", [])
    
    # Format comments for response
    formatted_comments = []
    for comment in comments:
        formatted_comments.append({
            "author": comment["author"],
            "content": comment["content"],
            "timestamp": format_timestamp(comment["createdAt"])
        })
    
    return {
        "postId": post_id,
        "totalComments": len(comments),
        "comments": formatted_comments
    }

@router.get("/members")
async def get_featured_members(
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    """Get featured community members"""
    
    members_cursor = db.featured_members.find({"active": True}).limit(10)
    members = await members_cursor.to_list(length=10)
    
    featured_members = []
    for member in members:
        featured_members.append({
            "id": member["_id"],
            "name": member["name"],
            "role": member["role"],
            "speciality": member["speciality"],
            "experience": member["experience"],
            "avatar": member["avatar"]
        })
    
    return featured_members

@router.get("/stats")
async def get_community_stats(
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    """Get community statistics"""
    
    # Get total members
    total_members = await db.users.count_documents({})
    
    # Get total posts
    total_posts = await db.community_posts.count_documents({})
    
    # Get total comments (aggregate from all posts)
    pipeline = [
        {"$project": {"commentCount": {"$size": {"$ifNull": ["$comments", []]}}}},
        {"$group": {"_id": None, "totalComments": {"$sum": "$commentCount"}}}
    ]
    comment_result = await db.community_posts.aggregate(pipeline).to_list(length=1)
    total_comments = comment_result[0]["totalComments"] if comment_result else 0
    
    # Get total likes (aggregate from all posts)
    pipeline = [
        {"$project": {"likeCount": {"$size": {"$ifNull": ["$likes", []]}}}},
        {"$group": {"_id": None, "totalLikes": {"$sum": "$likeCount"}}}
    ]
    like_result = await db.community_posts.aggregate(pipeline).to_list(length=1)
    total_likes = like_result[0]["totalLikes"] if like_result else 0
    
    return {
        "totalMembers": total_members,
        "totalPosts": total_posts,
        "totalComments": total_comments,
        "totalLikes": total_likes
    }