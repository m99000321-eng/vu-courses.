# Frontend Structure - VU. COURSES

## Overview
This document provides a complete map of the frontend structure for the VU. COURSES platform. All frontend files are located in the `app/` and `components/` directories.

## Directory Tree

```
frontend/
├── app/                          # Next.js App Router
│   ├── layout.tsx               # Root layout (RTL, Theme Provider)
│   ├── page.tsx                 # Home page (redirects to /courses)
│   ├── globals.css              # Global styles + Tailwind
│   │
│   ├── login/                   # Login page
│   │   └── page.tsx
│   ├── register/                # Registration page
│   │   └── page.tsx
│   ├── courses/                 # Course catalog
│   │   └── page.tsx
│   ├── chat/                    # Chat/Messaging
│   │   └── page.tsx
│   ├── notifications/           # Notifications list
│   │   └── page.tsx
│   │
│   ├── student/                 # Student Portal
│   │   ├── dashboard/
│   │   │   └── page.tsx
│   │   ├── my-courses/
│   │   │   └── page.tsx
│   │   ├── progress/
│   │   │   └── page.tsx
│   │   ├── certificates/
│   │   │   └── page.tsx
│   │   ├── favorites/
│   │   │   └── page.tsx
│   │   ├── profile/
│   │   │   └── page.tsx
│   │   └── settings/
│   │       └── page.tsx
│   │
│   ├── instructor/              # Instructor Portal
│   │   ├── dashboard/
│   │   │   └── page.tsx
│   │   ├── my-courses/
│   │   │   └── page.tsx
│   │   ├── create-course/
│   │   │   └── page.tsx
│   │   ├── students/
│   │   │   └── page.tsx
│   │   ├── assignments/
│   │   │   └── page.tsx
│   │   ├── quizzes/
│   │   │   └── page.tsx
│   │   ├── analytics/
│   │   │   └── page.tsx
│   │   ├── profile/
│   │   │   └── page.tsx
│   │   └── settings/
│   │       └── page.tsx
│   │
│   └── admin/                   # Admin Portal
│       ├── dashboard/
│       │   └── page.tsx
│       ├── users/
│       │   └── page.tsx
│       ├── students/
│       │   └── page.tsx
│       ├── instructors/
│       │   └── page.tsx
│       ├── categories/
│       │   └── page.tsx
│       ├── levels/
│       │   └── page.tsx
│       ├── lessons/
│       │   └── page.tsx
│       ├── quizzes/
│       │   └── page.tsx
│       ├── certificates/
│       │   └── page.tsx
│       ├── payments/
│       │   └── page.tsx
│       ├── subscriptions/
│       │   └── page.tsx
│       ├── reports/
│       │   └── page.tsx
│       └── settings/
│           └── page.tsx
│
├── components/                  # Reusable React Components
│   ├── navbar.tsx               # Top navigation bar
│   ├── sidebar.tsx              # Side navigation menu
│   ├── logo.tsx                 # VU. COURSES logo
│   ├── theme-provider.tsx       # Dark/Light mode provider
│   ├── video-player-modal.tsx   # Video lesson player
│   ├── pdf-viewer-modal.tsx     # PDF document viewer
│   ├── quiz-modal.tsx           # Quiz/test modal
│   └── certificate-modal.tsx    # Certificate display modal
│
├── lib/                         # Utilities & Helpers
│   ├── prisma.ts                # Prisma client singleton
│   ├── auth.ts                  # JWT + bcrypt utilities
│   ├── validations.ts           # Zod schemas
│   ├── errors.ts                # Custom error classes
│   ├── logger.ts                # Logging system
│   ├── security.ts              # Rate limiting, CORS, headers
│   └── api-wrapper.ts           # API route wrappers
│
└── prisma/                      # Database
    ├── schema.prisma            # Prisma schema
    └── seed.ts                  # Database seeding
```

## Page Routes (35 pages)

### Public Pages
| Route | Description |
|-------|-------------|
| `/` | Home (redirects to /courses) |
| `/login` | User login |
| `/register` | User registration |
| `/courses` | Course catalog (all users) |
| `/chat` | Chat/Messaging (requires auth) |
| `/notifications` | Notifications (requires auth) |

### Student Pages (7)
| Route | Description |
|-------|-------------|
| `/student/dashboard` | Student dashboard with stats |
| `/student/my-courses` | Enrolled courses |
| `/student/progress` | Learning progress tracking |
| `/student/certificates` | Earned certificates |
| `/student/favorites` | Favorite courses |
| `/student/profile` | Profile management |
| `/student/settings` | Account settings |

### Instructor Pages (8)
| Route | Description |
|-------|-------------|
| `/instructor/dashboard` | Instructor dashboard |
| `/instructor/my-courses` | My created courses |
| `/instructor/create-course` | Create new course |
| `/instructor/students` | Enrolled students |
| `/instructor/assignments` | Lessons management |
| `/instructor/quizzes` | Quiz management |
| `/instructor/analytics` | Performance analytics |
| `/instructor/profile` | Profile management |
| `/instructor/settings` | Account settings |

### Admin Pages (13)
| Route | Description |
|-------|-------------|
| `/admin/dashboard` | Admin dashboard |
| `/admin/users` | User management |
| `/admin/students` | Student management |
| `/admin/instructors` | Instructor management |
| `/admin/categories` | Category management |
| `/admin/levels` | Level management |
| `/admin/lessons` | Lesson management |
| `/admin/quizzes` | Quiz management |
| `/admin/certificates` | Certificate management |
| `/admin/payments` | Payment tracking |
| `/admin/subscriptions` | Subscription plans |
| `/admin/reports` | Analytics reports |
| `/admin/settings` | Platform settings |

## API Routes (21 endpoints)

### Authentication
| Route | Method | Description |
|-------|--------|-------------|
| `/api/auth/login` | POST | User login |
| `/api/auth/register` | POST | User registration |
| `/api/auth/me` | GET | Get current user |
| `/api/auth/logout` | POST | User logout |

### Courses & Content
| Route | Method | Description |
|-------|--------|-------------|
| `/api/courses` | GET | List all courses |
| `/api/courses` | POST | Create course |
| `/api/courses/[id]/levels` | POST | Add level to course |
| `/api/levels` | GET | List all levels |
| `/api/levels` | POST | Create level |
| `/api/levels` | PUT | Update level |
| `/api/levels` | DELETE | Delete level |
| `/api/lessons` | GET | List all lessons |
| `/api/lessons` | POST | Create lesson |
| `/api/lessons` | PUT | Update lesson |
| `/api/lessons` | DELETE | Delete lesson |
| `/api/lessons/[id]/progress` | POST | Update lesson progress |
| `/api/quizzes` | GET | List all quizzes |
| `/api/quizzes` | POST | Create quiz |
| `/api/quizzes` | PUT | Update quiz |
| `/api/quizzes` | DELETE | Delete quiz |
| `/api/quizzes/[id]/submit` | POST | Submit quiz attempt |

### User Features
| Route | Method | Description |
|-------|--------|-------------|
| `/api/enrollments` | GET | User enrollments |
| `/api/favorites` | GET | User favorites |
| `/api/favorites` | POST | Add/remove favorite |
| `/api/favorites` | DELETE | Remove favorite |
| `/api/profile` | GET | Get profile |
| `/api/profile` | PUT | Update profile |
| `/api/certificates` | GET | User certificates |
| `/api/certificates` | GET | Verify certificate (public) |
| `/api/notifications` | GET | User notifications |
| `/api/notifications` | PUT | Mark as read |
| `/api/chat` | GET | Get contacts/messages |
| `/api/chat` | POST | Send message |

### Admin
| Route | Method | Description |
|-------|--------|-------------|
| `/api/admin/users` | GET | List all users |
| `/api/admin/users` | POST | Create user |
| `/api/admin/users` | PUT | Update user |
| `/api/admin/users` | DELETE | Delete user |
| `/api/admin/categories` | GET | List categories |
| `/api/admin/categories` | POST | Create category |
| `/api/admin/categories` | PUT | Update category |
| `/api/admin/categories` | DELETE | Delete category |
| `/api/admin/certificates` | GET | List all certificates |
| `/api/admin/certificates` | DELETE | Revoke certificate |
| `/api/admin/payments` | GET | List payments |
| `/api/admin/payments` | POST | Create payment |
| `/api/admin/subscriptions` | GET | List plans/subscriptions |
| `/api/admin/subscriptions` | POST | Create plan |
| `/api/admin/subscriptions` | PUT | Update plan |
| `/api/admin/subscriptions` | DELETE | Delete plan |
| `/api/admin/settings` | GET | Get settings |
| `/api/admin/settings` | PUT | Update settings |

### Instructor
| Route | Method | Description |
|-------|--------|-------------|
| `/api/instructor/enrollments` | GET | Instructor's students |
| `/api/instructor/quizzes` | GET | Instructor's quizzes |
| `/api/instructor/quizzes` | POST | Create quiz |
| `/api/instructor/quizzes` | DELETE | Delete quiz |
| `/api/instructor/lessons` | POST | Create lesson |

### System
| Route | Method | Description |
|-------|--------|-------------|
| `/api/health` | GET | Health check |
| `/api/categories` | GET | Public categories list |

## Components

| Component | Description |
|-----------|-------------|
| `Navbar` | Top navigation with logo, notifications, profile menu |
| `Sidebar` | Side navigation with role-based menu items |
| `Logo` | VU. COURSES brand logo |
| `ThemeProvider` | Dark/Light mode context |
| `VideoPlayerModal` | Video lesson player with progress tracking |
| `PdfViewerModal` | PDF document viewer |
| `QuizModal` | Interactive quiz/test modal |
| `CertificateModal` | Certificate display with QR code |

## Design System

### Colors
- **Primary Purple:** `#6C2BD9`
- **Primary Orange:** `#F97316`
- **Dark Mode:** Slate colors (slate-50 to slate-950)

### Typography
- **Font Family:** System fonts (Arabic-optimized)
- **Direction:** RTL (Right-to-Left)
- **Language:** Arabic

### UI Patterns
- Cards with rounded corners (rounded-2xl)
- Consistent spacing (p-4, p-6)
- Shadow-sm for depth
- Border colors for separation
- Icon + Text patterns

## Technology Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Icons:** Lucide React
- **Charts:** Recharts
- **Database:** SQLite + Prisma
- **Auth:** JWT + bcrypt
