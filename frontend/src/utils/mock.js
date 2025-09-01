// Mock data for Athletics Northern Territory app

export const mockData = {
  user: {
    id: "user123",
    name: "Sarah Johnson",
    email: "sarah.johnson@email.com",
    memberId: "2024001",
    membershipType: "Premium",
    joinDate: "2024-01-15",
    qrCode: "NT-2024001-PREMIUM",
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face"
  },
  
  events: {
    upcoming: [
      {
        id: "evt001",
        name: "Summer Athletics Championship",
        date: "March 15, 2025",
        time: "9:00 AM - 5:00 PM",
        type: "Championship",
        description: "Annual summer athletics championship featuring track and field events for all age groups.",
        location: "Darwin Athletics Stadium",
        registrations: 145,
        maxCapacity: 200,
        registrationDeadline: "March 10, 2025",
        memberOnly: false,
        price: 25
      },
      {
        id: "evt002", 
        name: "Youth Development Program",
        date: "March 22, 2025",
        time: "4:00 PM - 6:00 PM",
        type: "Training",
        description: "Specialized training program for young athletes aged 12-18 years.",
        location: "NT Athletics Training Ground",
        registrations: 32,
        maxCapacity: 40,
        registrationDeadline: "March 20, 2025",
        memberOnly: true,
        price: 0
      },
      {
        id: "evt003",
        name: "Masters Athletics Meet",
        date: "April 5, 2025", 
        time: "10:00 AM - 4:00 PM",
        type: "Competition",
        description: "Competitive meet for athletes aged 35 and above across various disciplines.",
        location: "Alice Springs Athletic Center",
        registrations: 78,
        maxCapacity: 100,
        registrationDeadline: "April 1, 2025",
        memberOnly: false,
        price: 20
      }
    ],
    
    previous: [
      {
        id: "evt101",
        name: "New Year Sprint Challenge",
        date: "January 20, 2025",
        type: "Sprint",
        description: "High-energy sprint competition to kick off the new athletics season.",
        participants: 89,
        results: "completed",
        winner: "Michael Thompson"
      },
      {
        id: "evt102",
        name: "Endurance Training Camp",
        date: "February 10-12, 2025",
        type: "Training Camp",
        description: "Intensive 3-day endurance training camp for long-distance runners.",
        participants: 45,
        results: "completed",
        winner: null
      },
      {
        id: "evt103",
        name: "Field Events Showcase",
        date: "February 25, 2025",
        type: "Field Events",
        description: "Showcase of throwing and jumping events with expert coaching tips.",
        participants: 67,
        results: "completed",
        winner: "Lisa Anderson"
      }
    ]
  },
  
  membership: {
    plans: [
      {
        id: "basic",
        name: "Basic Membership",
        price: 50,
        duration: "Annual",
        features: [
          "Access to regular training sessions",
          "Basic event participation",
          "Monthly newsletter",
          "Community forum access"
        ],
        popular: false
      },
      {
        id: "premium",
        name: "Premium Membership", 
        price: 120,
        duration: "Annual",
        features: [
          "All Basic features",
          "Priority event registration",
          "Free coaching sessions (2/month)",
          "Equipment discounts",
          "Exclusive member events",
          "Digital reward card"
        ],
        popular: true
      },
      {
        id: "elite",
        name: "Elite Membership",
        price: 200,
        duration: "Annual", 
        features: [
          "All Premium features",
          "Personal coaching sessions",
          "Competition entry fees included",
          "Advanced performance analytics",
          "VIP event access",
          "Custom training programs"
        ],
        popular: false
      }
    ]
  },
  
  community: {
    members: [
      {
        id: "mem001",
        name: "Alex Chen",
        role: "Sprint Coach",
        speciality: "100m & 200m",
        experience: "8 years",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face"
      },
      {
        id: "mem002", 
        name: "Maria Rodriguez",
        role: "Distance Runner",
        speciality: "Marathon",
        experience: "12 years",
        avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face"
      },
      {
        id: "mem003",
        name: "David Park",
        role: "Field Events Specialist",
        speciality: "Javelin & Shot Put",
        experience: "15 years", 
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face"
      }
    ],
    
    posts: [
      {
        id: "post001",
        author: "Alex Chen",
        title: "Tips for Improving Your Sprint Start",
        content: "The key to a powerful sprint start is all in the positioning and explosive drive...",
        timestamp: "2 hours ago",
        likes: 23,
        comments: 8
      },
      {
        id: "post002",
        author: "Maria Rodriguez", 
        title: "Marathon Training Schedule for Beginners",
        content: "Starting your marathon journey can be overwhelming. Here's a structured 16-week plan...",
        timestamp: "1 day ago",
        likes: 45,
        comments: 12
      }
    ]
  },
  
  qrCodes: {
    accessCard: "https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=NT-ACCESS-2024001",
    memberCard: "https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=NT-MEMBER-2024001-PREMIUM"
  },
  
  stats: {
    totalMembers: 1247,
    activeEvents: 8,
    completedEvents: 156,
    trainingHours: 3840
  }
};