# API Routes Documentation

## Authentication Endpoints

### POST `/api/auth/login`
Authenticate a user and receive JWT token.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "user": {
    "id": "uuid",
    "name": "User Name",
    "email": "user@example.com",
    "role": "STUDENT"
  },
  "token": "jwt-token-here"
}
```

**Cookies:** Sets `vu_auth_token` (httpOnly, 7 days)

---

### POST `/api/auth/register`
Register a new user account.

**Request Body:**
```json
{
  "name": "User Name",
  "email": "user@example.com",
  "password": "password123",
  "role": "STUDENT"
}
```

**Response:**
```json
{
  "success": true,
  "user": { "id": "uuid", "name": "User Name", "email": "user@example.com", "role": "STUDENT" },
  "token": "jwt-token-here"
}
```

---

### GET `/api/auth/me`
Get current authenticated user.

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "user": {
    "id": "uuid",
    "name": "User Name",
    "email": "user@example.com",
    "role": "STUDENT",
    "walletBalance": 500.0
  }
}
```

---

### POST `/api/auth/logout`
Logout current user (clears cookie).

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "success": true
}
```

---

## Course Endpoints

### GET `/api/courses`
List all courses with optional filters.

**Query Parameters:**
- `instructorId` (optional): Filter by instructor
- `categoryId` (optional): Filter by category

**Response:**
```json
{
  "courses": [
    {
      "id": "uuid",
      "title": "Course Title",
      "description": "Course description",
      "thumbnail": "https://...",
      "price": 99.0,
      "duration": "10 hours",
      "category": { "id": "uuid", "name": "Category" },
      "instructor": { "name": "Instructor Name", "avatar": "https://..." },
      "studentsCount": 42,
      "rating": 4.5,
      "levels": [...],
      "_count": { "enrollments": 42 }
    }
  ]
}
```

---

### POST `/api/courses`
Create a new course (instructor only).

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "title": "Course Title",
  "description": "Course description",
  "categoryId": "uuid",
  "price": 99.0,
  "duration": "10 hours",
  "thumbnail": "https://..."
}
```

**Response:**
```json
{
  "success": true,
  "course": { "id": "uuid", "title": "Course Title", ... }
}
```

---

### POST `/api/courses/[id]/levels`
Add a level to a course.

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "title": "Level 1: Introduction",
  "description": "Level description"
}
```

**Response:**
```json
{
  "success": true,
  "level": { "id": "uuid", "title": "Level 1", ... }
}
```

---

## Lesson Endpoints

### GET `/api/lessons`
List all lessons (admin) or user's lessons.

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "lessons": [
    {
      "id": "uuid",
      "title": "Lesson Title",
      "type": "VIDEO",
      "contentUrl": "https://...",
      "pdfUrl": "https://...",
      "duration": "15 minutes",
      "order": 1,
      "level": {
        "id": "uuid",
        "title": "Level Title",
        "course": { "id": "uuid", "title": "Course Title" }
      },
      "quizzes": [],
      "_count": { "progress": 1 }
    }
  ]
}
```

---

### POST `/api/lessons`
Create a new lesson.

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "levelId": "uuid",
  "title": "Lesson Title",
  "type": "VIDEO",
  "contentUrl": "https://...",
  "pdfUrl": "https://...",
  "textContent": "Content text",
  "duration": "15 minutes",
  "order": 1
}
```

**Response:**
```json
{
  "success": true,
  "lesson": { "id": "uuid", "title": "Lesson Title", ... }
}
```

---

### PUT `/api/lessons`
Update a lesson.

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "id": "uuid",
  "title": "Updated Title",
  "type": "PDF"
}
```

---

### DELETE `/api/lessons?id=uuid`
Delete a lesson.

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "success": true
}
```

---

### POST `/api/lessons/[id]/progress`
Mark a lesson as complete and track progress.

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "completed": true
}
```

**Response:**
```json
{
  "success": true,
  "progress": {
    "id": "uuid",
    "completed": true,
    "watchPercentage": 100
  }
}
```

---

## Quiz Endpoints

### GET `/api/quizzes`
List all quizzes.

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "quizzes": [
    {
      "id": "uuid",
      "title": "Quiz Title",
      "passingScore": 70,
      "timeLimitMinutes": 15,
      "lesson": {
        "id": "uuid",
        "title": "Lesson Title",
        "level": {
          "id": "uuid",
          "title": "Level Title",
          "course": { "id": "uuid", "title": "Course Title" }
        }
      },
      "_count": {
        "questions": 10,
        "attempts": 5
      }
    }
  ]
}
```

---

### POST `/api/quizzes`
Create a new quiz.

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "lessonId": "uuid",
  "title": "Quiz Title",
  "passingScore": 70,
  "timeLimitMinutes": 15
}
```

---

### POST `/api/quizzes/[id]/submit`
Submit quiz answers.

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "answers": {
    "question-id-1": "answer-a",
    "question-id-2": "answer-b"
  }
}
```

**Response:**
```json
{
  "success": true,
  "score": 80,
  "passed": true,
  "correctAnswers": 8,
  "totalQuestions": 10
}
```

---

## Enrollment Endpoints

### GET `/api/enrollments`
Get user enrollments.

**Headers:** `Authorization: Bearer <token>`

**Query Parameters:**
- `userId` (admin/instructor only): View another user's enrollments

**Response:**
```json
{
  "enrollments": [
    {
      "id": "uuid",
      "progressPercent": 45.5,
      "completedAt": null,
      "enrolledAt": "2026-01-01",
      "course": {
        "id": "uuid",
        "title": "Course Title",
        "thumbnail": "https://...",
        "instructor": { "name": "Instructor", "avatar": "https://..." },
        "category": { "name": "Category" },
        "levels": [...]
      }
    }
  ]
}
```

---

## Favorite Endpoints

### GET `/api/favorites`
Get user's favorite courses.

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "favorites": [
    {
      "id": "uuid",
      "course": {
        "id": "uuid",
        "title": "Course Title",
        "thumbnail": "https://...",
        "price": 99.0,
        "rating": 4.5,
        "instructor": { "name": "Instructor" }
      }
    }
  ]
}
```

---

### POST `/api/favorites`
Add/remove a course from favorites.

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "courseId": "uuid"
}
```

**Response:**
```json
{
  "success": true,
  "favorited": true
}
```

---

### DELETE `/api/favorites`
Remove a course from favorites.

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "courseId": "uuid"
}
```

---

## Profile Endpoints

### GET `/api/profile`
Get current user profile.

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "user": {
    "id": "uuid",
    "name": "User Name",
    "email": "user@example.com",
    "bio": "User bio",
    "avatar": "https://...",
    "walletBalance": 500.0,
    "role": "STUDENT"
  }
}
```

---

### PUT `/api/profile`
Update user profile.

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "name": "Updated Name",
  "bio": "Updated bio"
}
```

**Response:**
```json
{
  "success": true,
  "user": { "id": "uuid", "name": "Updated Name", ... }
}
```

---

## Certificate Endpoints

### GET `/api/certificates`
Get user's certificates.

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "certificates": [
    {
      "id": "uuid",
      "certificateCode": "VU-ABC123",
      "issuedAt": "2026-01-01",
      "qrCode": "data:image/png;base64,...",
      "user": { "name": "User Name" },
      "course": { "title": "Course Title", "thumbnail": "https://..." }
    }
  ]
}
```

---

### GET `/api/certificates?code=VU-ABC123` (Public)
Verify a certificate by code.

**Response:**
```json
{
  "valid": true,
  "certificate": {
    "certificateCode": "VU-ABC123",
    "issuedAt": "2026-01-01",
    "user": { "name": "User Name" },
    "course": { "title": "Course Title" }
  }
}
```

---

## Notification Endpoints

### GET `/api/notifications`
Get user notifications.

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "notifications": [
    {
      "id": "uuid",
      "title": "Notification Title",
      "message": "Notification message",
      "type": "INFO",
      "read": false,
      "createdAt": "2026-01-01"
    }
  ],
  "unreadCount": 2
}
```

---

### PUT `/api/notifications`
Mark notifications as read.

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "notificationId": "uuid"
}
```

---

## Chat Endpoints

### GET `/api/chat`
Get chat contacts and messages.

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "contacts": [
    {
      "id": "uuid",
      "name": "Contact Name",
      "avatar": "https://...",
      "lastMessage": "Hello",
      "lastMessageTime": "2026-01-01"
    }
  ]
}
```

---

### POST `/api/chat`
Send a message.

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "receiverId": "uuid",
  "content": "Hello!",
  "type": "text"
}
```

---

## Admin Endpoints

### GET `/api/admin/users`
List all users (admin only).

**Headers:** `Authorization: Bearer <token>` (Admin role required)

**Query Parameters:**
- `role` (optional): Filter by role
- `search` (optional): Search by name/email

**Response:**
```json
{
  "users": [
    {
      "id": "uuid",
      "name": "User Name",
      "email": "user@example.com",
      "role": "STUDENT",
      "walletBalance": 500.0,
      "createdAt": "2026-01-01"
    }
  ]
}
```

---

### PUT `/api/admin/users`
Update user (admin only).

**Headers:** `Authorization: Bearer <token>` (Admin role required)

**Request Body:**
```json
{
  "id": "uuid",
  "role": "INSTRUCTOR",
  "walletBalance": 1000.0
}
```

---

### DELETE `/api/admin/users?id=uuid`
Delete user (admin only).

**Headers:** `Authorization: Bearer <token>` (Admin role required)

---

### GET `/api/admin/categories`
List all categories (admin only).

**Headers:** `Authorization: Bearer <token>` (Admin role required)

**Response:**
```json
{
  "categories": [
    {
      "id": "uuid",
      "name": "Category Name",
      "description": "Category description",
      "_count": { "courses": 5 }
    }
  ]
}
```

---

### GET `/api/admin/certificates`
List all certificates (admin only).

**Headers:** `Authorization: Bearer <token>` (Admin role required)

**Response:**
```json
{
  "certificates": [
    {
      "id": "uuid",
      "certificateCode": "VU-ABC123",
      "issuedAt": "2026-01-01",
      "user": { "name": "User Name", "email": "user@example.com" },
      "course": { "title": "Course Title" }
    }
  ]
}
```

---

### GET `/api/admin/payments`
List all payments (admin only).

**Headers:** `Authorization: Bearer <token>` (Admin role required)

**Query Parameters:**
- `status` (optional): Filter by status
- `userId` (optional): Filter by user
- `startDate` (optional): Filter by date range
- `endDate` (optional): Filter by date range

**Response:**
```json
{
  "payments": [
    {
      "id": "uuid",
      "amount": 99.0,
      "paymentMethod": "CREDIT_CARD",
      "status": "COMPLETED",
      "createdAt": "2026-01-01",
      "user": { "name": "User Name", "email": "user@example.com" }
    }
  ]
}
```

---

### GET `/api/admin/subscriptions`
List subscription plans and subscriptions (admin only).

**Headers:** `Authorization: Bearer <token>` (Admin role required)

**Query Parameters:**
- `type=plans`: Get plans only
- `type=subscriptions`: Get subscriptions only
- No type: Get both

**Response:**
```json
{
  "plans": [
    {
      "id": "plan-1",
      "name": "Basic Plan",
      "price": 199,
      "durationDays": 30,
      "features": "Access to basic courses",
      "active": true
    }
  ],
  "subscriptions": [
    {
      "id": "sub-1",
      "userName": "User Name",
      "userEmail": "user@example.com",
      "planName": "Basic Plan",
      "status": "ACTIVE",
      "startDate": "2026-01-01",
      "endDate": "2026-02-01"
    }
  ]
}
```

---

### GET `/api/admin/settings`
Get platform settings (admin only).

**Headers:** `Authorization: Bearer <token>` (Admin role required)

**Response:**
```json
{
  "settings": {
    "siteName": "VU. COURSES",
    "siteDescription": "Platform description",
    "contactEmail": "support@vucourses.com",
    "supportPhone": "+20 123 456 7890",
    "maintenanceMode": false
  }
}
```

---

### PUT `/api/admin/settings`
Update platform settings (admin only).

**Headers:** `Authorization: Bearer <token>` (Admin role required)

**Request Body:**
```json
{
  "siteName": "New Name",
  "maintenanceMode": false
}
```

---

## Instructor Endpoints

### GET `/api/instructor/enrollments`
Get instructor's students.

**Headers:** `Authorization: Bearer <token>` (Instructor role required)

**Response:**
```json
{
  "enrollments": [
    {
      "id": "uuid",
      "enrolledAt": "2026-01-01",
      "progressPercent": 45.5,
      "user": {
        "id": "uuid",
        "name": "Student Name",
        "email": "student@example.com",
        "avatar": "https://..."
      },
      "course": {
        "id": "uuid",
        "title": "Course Title"
      }
    }
  ]
}
```

---

### GET `/api/instructor/quizzes`
Get instructor's quizzes.

**Headers:** `Authorization: Bearer <token>` (Instructor role required)

**Response:**
```json
{
  "quizzes": [
    {
      "id": "uuid",
      "title": "Quiz Title",
      "passingScore": 70,
      "timeLimitMinutes": 15,
      "lesson": {
        "title": "Lesson Title",
        "level": {
          "title": "Level Title",
          "course": { "title": "Course Title" }
        }
      }
    }
  ]
}
```

---

### DELETE `/api/instructor/quizzes?id=uuid`
Delete instructor's quiz.

**Headers:** `Authorization: Bearer <token>` (Instructor role required)

---

### POST `/api/instructor/lessons`
Create lesson for instructor's course.

**Headers:** `Authorization: Bearer <token>` (Instructor role required)

**Request Body:**
```json
{
  "levelId": "uuid",
  "title": "Lesson Title",
  "type": "VIDEO",
  "contentUrl": "https://...",
  "duration": "15 minutes",
  "order": 1
}
```

---

## Health Check

### GET `/api/health`
Check API and database health.

**Response:**
```json
{
  "status": "healthy",
  "timestamp": "2026-01-01T00:00:00.000Z",
  "database": {
    "status": "connected",
    "responseTime": "5ms"
  },
  "memory": {
    "used": "120MB",
    "total": "256MB"
  },
  "uptime": "125s",
  "version": "1.0.0"
}
```

---

## Error Responses

All endpoints return errors in the following format:

```json
{
  "success": false,
  "error": "Error message in Arabic",
  "statusCode": 400
}
```

**Common Status Codes:**
- `200` - Success
- `400` - Bad Request (validation error)
- `401` - Unauthorized (not logged in)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `429` - Too Many Requests (rate limit)
- `500` - Internal Server Error
