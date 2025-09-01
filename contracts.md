# Athletics Northern Territory - Backend Implementation Contracts

## Overview
This document defines the contracts for implementing backend functionality to replace frontend mock data with real database integration for the Athletics Northern Territory webapp.

## Current Mock Data (to be replaced)

### User & Membership Data
- User profile: name, email, memberId, membershipType, joinDate, qrCode, avatar
- Membership plans: Basic, Premium, Elite with features and pricing
- Membership statistics: totalMembers, activeEvents, completedEvents, trainingHours

### Events Data
- Upcoming events: name, date, time, type, description, location, registrations, maxCapacity, memberOnly, price
- Previous events: name, date, type, description, participants, results, winner
- Event registration and management

### Community Data
- Member profiles: name, role, specialty, experience, avatar
- Community posts: author, title, content, timestamp, likes, comments
- Community interactions: likes, comments, post creation

### QR Codes & Access
- QR code generation for member cards and access
- Digital card management
- Access verification system

## API Contracts

### Authentication & Users
```
POST /api/auth/register - Register new user
POST /api/auth/login - User login
GET /api/auth/me - Get current user profile
PUT /api/auth/profile - Update user profile
POST /api/auth/qr-generate - Generate QR code for user

GET /api/users/:id - Get user by ID
PUT /api/users/:id - Update user
```

### Membership
```
GET /api/membership/plans - Get all membership plans
POST /api/membership/subscribe - Subscribe to membership plan
GET /api/membership/card/:userId - Get user's digital membership card
GET /api/membership/stats - Get membership statistics
```

### Events
```
GET /api/events - Get all events (with filters: upcoming/previous)
GET /api/events/:id - Get event by ID
POST /api/events - Create new event (admin only)
PUT /api/events/:id - Update event (admin only)
DELETE /api/events/:id - Delete event (admin only)

POST /api/events/:id/register - Register for event
DELETE /api/events/:id/register - Unregister from event
GET /api/events/:id/registrations - Get event registrations
```

### Community
```
GET /api/community/posts - Get community posts
POST /api/community/posts - Create new post
PUT /api/community/posts/:id - Update post
DELETE /api/community/posts/:id - Delete post

POST /api/community/posts/:id/like - Like/unlike post
POST /api/community/posts/:id/comment - Add comment to post
GET /api/community/posts/:id/comments - Get post comments

GET /api/community/members - Get featured community members
GET /api/community/stats - Get community statistics
```

### QR Scanner & Access
```
POST /api/qr/scan - Validate QR code scan
GET /api/qr/generate/:type/:userId - Generate QR code
POST /api/access/verify - Verify member access
GET /api/access/logs - Get access logs (admin only)
```

## MongoDB Models

### User Model
```javascript
{
  _id: ObjectId,
  name: String,
  email: String (unique),
  password: String (hashed),
  memberId: String (unique),
  membershipType: String (enum: basic, premium, elite),
  membershipStatus: String (enum: active, inactive, expired),
  joinDate: Date,
  avatar: String,
  qrCode: String,
  createdAt: Date,
  updatedAt: Date
}
```

### Event Model
```javascript
{
  _id: ObjectId,
  name: String,
  description: String,
  date: Date,
  time: String,
  type: String,
  location: String,
  maxCapacity: Number,
  memberOnly: Boolean,
  price: Number,
  registrationDeadline: Date,
  status: String (enum: upcoming, ongoing, completed, cancelled),
  registrations: [{ userId: ObjectId, registrationDate: Date }],
  results: {
    winner: String,
    participants: Number,
    completed: Boolean
  },
  createdAt: Date,
  updatedAt: Date
}
```

### Community Post Model
```javascript
{
  _id: ObjectId,
  author: String,
  authorId: ObjectId,
  title: String,
  content: String,
  likes: [{ userId: ObjectId, likedAt: Date }],
  comments: [{
    userId: ObjectId,
    author: String,
    content: String,
    createdAt: Date
  }],
  createdAt: Date,
  updatedAt: Date
}
```

### Membership Plan Model
```javascript
{
  _id: ObjectId,
  id: String (unique),
  name: String,
  price: Number,
  duration: String,
  features: [String],
  popular: Boolean,
  active: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

## Backend Implementation Plan

### Phase 1: Core Models & Authentication
1. Set up MongoDB models for User, Event, Post, MembershipPlan
2. Implement authentication with JWT
3. Create user registration/login endpoints
4. Implement user profile management

### Phase 2: Events System
1. Create CRUD operations for events
2. Implement event registration system
3. Add event filtering (upcoming/previous)
4. Implement member-only event restrictions

### Phase 3: Community Features
1. Implement community posts CRUD
2. Add like/comment functionality
3. Create community statistics
4. Implement featured members system

### Phase 4: Membership & QR System
1. Implement membership plan management
2. Create QR code generation system
3. Implement digital card functionality
4. Add access verification system

## Frontend-Backend Integration Plan

### Mock Data Replacement Strategy
1. **Replace API calls**: Update frontend to use real backend URLs instead of mock data
2. **Update data flow**: Modify components to handle API responses and loading states
3. **Error handling**: Add proper error handling for API failures
4. **Loading states**: Implement proper loading indicators during API calls

### Integration Points
1. **Header component**: Real user authentication status
2. **HomePage**: Real events data, real QR scanner functionality
3. **EventsPage**: Real event data, real registration functionality
4. **CommunityPage**: Real posts, real member data, real interactions
5. **MembershipPage**: Real membership data, real plan selection

### Authentication Flow
1. Add login/register forms
2. Implement JWT token storage
3. Add protected routes for member-only features
4. Implement user context for state management

## Testing Strategy
1. **Backend testing**: Unit tests for all API endpoints
2. **Integration testing**: Test frontend-backend communication
3. **QR functionality**: Test QR code generation and scanning
4. **Event registration**: Test complete registration flow
5. **Community features**: Test post creation, likes, comments

## Security Considerations
1. JWT token authentication
2. Input validation and sanitization
3. Password hashing (bcrypt)
4. Member-only event access control
5. QR code security and validation
6. Rate limiting for API endpoints

## Error Handling
1. Proper HTTP status codes
2. Meaningful error messages
3. Frontend error state management
4. Graceful fallbacks for failed API calls

This contract serves as the blueprint for seamless integration between the existing frontend and the new backend system.