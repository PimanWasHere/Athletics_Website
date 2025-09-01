import qrcode
import io
import base64
from datetime import datetime
from typing import Optional
import uuid

def generate_qr_code(data: str) -> str:
    """Generate QR code as base64 encoded PNG"""
    qr = qrcode.QRCode(
        version=1,
        error_correction=qrcode.constants.ERROR_CORRECT_L,
        box_size=10,
        border=4,
    )
    qr.add_data(data)
    qr.make(fit=True)
    
    img = qr.make_image(fill_color="black", back_color="white")
    
    # Convert to base64
    buffer = io.BytesIO()
    img.save(buffer, format='PNG')
    img_str = base64.b64encode(buffer.getvalue()).decode()
    
    return f"data:image/png;base64,{img_str}"

def generate_member_id() -> str:
    """Generate unique member ID"""
    return f"2024{str(uuid.uuid4().int)[:3]}"

def format_timestamp(dt: datetime) -> str:
    """Format datetime to human readable string"""
    now = datetime.utcnow()
    diff = now - dt
    
    if diff.days > 0:
        return f"{diff.days} day{'s' if diff.days > 1 else ''} ago"
    elif diff.seconds > 3600:
        hours = diff.seconds // 3600
        return f"{hours} hour{'s' if hours > 1 else ''} ago"
    elif diff.seconds > 60:
        minutes = diff.seconds // 60
        return f"{minutes} minute{'s' if minutes > 1 else ''} ago"
    else:
        return "Just now"

def validate_qr_code(qr_code: str, user_id: str) -> bool:
    """Validate QR code for user access"""
    # QR code format: NT-ACCESS-{user_id} or NT-MEMBER-{user_id}-{membership_type}
    if qr_code.startswith("NT-ACCESS-") or qr_code.startswith("NT-MEMBER-"):
        parts = qr_code.split("-")
        if len(parts) >= 3 and parts[2] == user_id:
            return True
    return False

def create_qr_data(qr_type: str, user_id: str, membership_type: Optional[str] = None) -> str:
    """Create QR code data string"""
    if qr_type == "access":
        return f"NT-ACCESS-{user_id}"
    elif qr_type == "member":
        membership = membership_type.upper() if membership_type else "BASIC"
        return f"NT-MEMBER-{user_id}-{membership}"
    else:
        return f"NT-{qr_type.upper()}-{user_id}"

def calculate_age_from_date(date_str: str) -> int:
    """Calculate age from date string (used for event age restrictions)"""
    try:
        birth_date = datetime.strptime(date_str, "%Y-%m-%d")
        today = datetime.now()
        age = today.year - birth_date.year - ((today.month, today.day) < (birth_date.month, birth_date.day))
        return age
    except:
        return 0