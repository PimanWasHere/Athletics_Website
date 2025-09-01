from fastapi import APIRouter, Depends, HTTPException, status
from motor.motor_asyncio import AsyncIOMotorDatabase
from models import QRCodeGenerate, QRCodeResponse, QRScanRequest, QRScanResponse, UserResponse
from auth import get_current_user, get_optional_current_user
from database import get_database
from utils import generate_qr_code, create_qr_data, validate_qr_code
from datetime import datetime

router = APIRouter(prefix="/qr", tags=["qr_codes"])

@router.post("/generate", response_model=QRCodeResponse)
async def generate_qr_code_endpoint(
    qr_data: QRCodeGenerate,
    db: AsyncIOMotorDatabase = Depends(get_database),
    current_user: UserResponse = Depends(get_current_user)
):
    """Generate QR code for user"""
    
    # Users can only generate QR codes for themselves (or admin for any user)
    if qr_data.userId != current_user.id:
        # In a real app, check for admin privileges here
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You can only generate QR codes for yourself"
        )
    
    # Get user data
    user = await db.users.find_one({"_id": qr_data.userId})
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    # Create QR code data
    qr_code_data = create_qr_data(qr_data.type, qr_data.userId, user.get("membershipType"))
    
    # Generate QR code image
    qr_code_image = generate_qr_code(qr_code_data)
    
    # Update user's QR code in database if it's a member card
    if qr_data.type == "member":
        await db.users.update_one(
            {"_id": qr_data.userId},
            {"$set": {"qrCode": qr_code_image, "updatedAt": datetime.utcnow()}}
        )
    
    return QRCodeResponse(
        qrCode=qr_code_image,
        url=qr_code_data
    )

@router.get("/generate/{qr_type}/{user_id}", response_model=QRCodeResponse)
async def generate_qr_code_by_params(
    qr_type: str,
    user_id: str,
    db: AsyncIOMotorDatabase = Depends(get_database),
    current_user: UserResponse = Depends(get_current_user)
):
    """Generate QR code by URL parameters"""
    
    # Users can only generate QR codes for themselves
    if user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You can only generate QR codes for yourself"
        )
    
    # Get user data
    user = await db.users.find_one({"_id": user_id})
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    # Create QR code data
    qr_code_data = create_qr_data(qr_type, user_id, user.get("membershipType"))
    
    # Generate QR code image
    qr_code_image = generate_qr_code(qr_code_data)
    
    return QRCodeResponse(
        qrCode=qr_code_image,
        url=qr_code_data
    )

@router.post("/scan", response_model=QRScanResponse)
async def scan_qr_code(
    scan_request: QRScanRequest,
    db: AsyncIOMotorDatabase = Depends(get_database),
    current_user: Optional[UserResponse] = Depends(get_optional_current_user)
):
    """Scan and validate QR code"""
    
    try:
        # Parse QR code data
        qr_data = scan_request.qrCode
        
        # Validate QR code format
        if not (qr_data.startswith("NT-ACCESS-") or qr_data.startswith("NT-MEMBER-")):
            return QRScanResponse(
                valid=False,
                message="Invalid QR code format"
            )
        
        # Extract user ID from QR code
        parts = qr_data.split("-")
        if len(parts) < 3:
            return QRScanResponse(
                valid=False,
                message="Invalid QR code format"
            )
        
        user_id = parts[2]
        
        # Find user in database
        user = await db.users.find_one({"_id": user_id})
        if not user:
            return QRScanResponse(
                valid=False,
                message="User not found"
            )
        
        # Check membership status
        if user.get("membershipStatus") != "active":
            return QRScanResponse(
                valid=False,
                message="Membership is not active"
            )
        
        # Validate QR code against user
        if not validate_qr_code(qr_data, user_id):
            return QRScanResponse(
                valid=False,
                message="QR code validation failed"
            )
        
        # Log access attempt (in a real app, you might want to log this)
        access_log = {
            "userId": user_id,
            "qrCode": qr_data,
            "scannedAt": datetime.utcnow(),
            "scannedById": current_user.id if current_user else None,
            "valid": True
        }
        await db.access_logs.insert_one(access_log)
        
        # Create user response
        user_response = UserResponse(
            id=user["_id"],
            name=user["name"],
            email=user["email"],
            memberId=user["memberId"],
            membershipType=user["membershipType"],
            membershipStatus=user["membershipStatus"],
            joinDate=user["joinDate"],
            avatar=user.get("avatar"),
            qrCode=user.get("qrCode")
        )
        
        return QRScanResponse(
            valid=True,
            message=f"Access granted! Welcome {user['name']}",
            user=user_response
        )
        
    except Exception as e:
        # Log invalid access attempt
        access_log = {
            "qrCode": scan_request.qrCode,
            "scannedAt": datetime.utcnow(),
            "scannedById": current_user.id if current_user else None,
            "valid": False,
            "error": str(e)
        }
        await db.access_logs.insert_one(access_log)
        
        return QRScanResponse(
            valid=False,
            message="QR code scan failed"
        )

@router.post("/verify")
async def verify_member_access(
    access_data: dict,
    db: AsyncIOMotorDatabase = Depends(get_database),
    current_user: Optional[UserResponse] = Depends(get_optional_current_user)
):
    """Verify member access for facilities"""
    
    member_id = access_data.get("memberId")
    if not member_id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Member ID is required"
        )
    
    # Find user by member ID
    user = await db.users.find_one({"memberId": member_id})
    if not user:
        return {
            "valid": False,
            "message": "Member not found"
        }
    
    # Check membership status
    if user.get("membershipStatus") != "active":
        return {
            "valid": False,
            "message": "Membership is not active"
        }
    
    # Log access
    access_log = {
        "userId": user["_id"],
        "memberId": member_id,
        "accessType": "facility",
        "accessedAt": datetime.utcnow(),
        "verifiedById": current_user.id if current_user else None,
        "valid": True
    }
    await db.access_logs.insert_one(access_log)
    
    return {
        "valid": True,
        "message": f"Access granted for {user['name']}",
        "membershipType": user["membershipType"],
        "name": user["name"]
    }

@router.get("/access-logs")
async def get_access_logs(
    limit: int = 50,
    current_user: UserResponse = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    """Get access logs (admin only)"""
    
    # In a real app, check for admin privileges here
    
    logs_cursor = db.access_logs.find().sort("scannedAt", -1).limit(limit)
    logs = await logs_cursor.to_list(length=limit)
    
    formatted_logs = []
    for log in logs:
        formatted_logs.append({
            "id": str(log.get("_id")),
            "userId": log.get("userId"),
            "memberId": log.get("memberId"),
            "qrCode": log.get("qrCode", "N/A"),
            "accessType": log.get("accessType", "qr_scan"),
            "timestamp": log.get("scannedAt", log.get("accessedAt")),
            "valid": log.get("valid"),
            "error": log.get("error")
        })
    
    return {
        "totalLogs": len(formatted_logs),
        "logs": formatted_logs
    }