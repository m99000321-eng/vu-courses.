# Pages Documentation

## Student Pages

### Dashboard (`/student/dashboard`)
- **Purpose:** Main student dashboard with overview stats
- **Features:**
  - Welcome banner with user name
  - Quick metrics: enrolled courses, completion %, certificates, study hours
  - Current course progress with progress bar
  - Certificates section with view button
- **Data Sources:** `/api/auth/me`, `/api/certificates`

### My Courses (`/student/my-courses`)
- **Purpose:** Show all courses the student is enrolled in
- **Features:**
  - Course cards with progress percentage
  - Level completion status
  - "Continue Learning" button
- **Data Sources:** Static demo data (can be connected to enrollments API)

### Progress (`/student/progress`)
- **Purpose:** Detailed learning progress tracking
- **Features:**
  - Stats cards: total enrolled, completed lessons, average progress, study hours
  - Per-course progress bars
  - Lesson completion counts
- **Data Sources:** `/api/auth/me`, `/api/enrollments`

### Certificates (`/student/certificates`)
- **Purpose:** View and verify earned certificates
- **Features:**
  - Certificate cards with QR code
  - Course title, instructor, issue date
  - "View Certificate" button (opens modal)
  - Certificate verification section (enter cert code)
- **Data Sources:** `/api/auth/me`, `/api/certificates`

### Favorites (`/student/favorites`)
- **Purpose:** Manage favorite/wishlist courses
- **Features:**
  - Course cards with remove favorite button
  - Rating and price display
  - "View Course" link
- **Data Sources:** `/api/auth/me`, `/api/favorites`

### Profile (`/student/profile`)
- **Purpose:** View and edit user profile
- **Features:**
  - Avatar display
  - Name, email, role display
  - Wallet balance
  - Edit form for name and bio
- **Data Sources:** `/api/auth/me`, `/api/profile`

### Settings (`/student/settings`)
- **Purpose:** Account settings and preferences
- **Features:**
  - Dark/Light theme toggle
  - Notification preferences
  - Change password form
- **Data Sources:** `/api/auth/me`, localStorage for settings

## Instructor Pages

### Dashboard (`/instructor/dashboard`)
- **Purpose:** Instructor overview and quick stats
- **Features:**
  - Welcome banner
  - Stats: total students, courses, revenue, rating
  - Quick add course form
- **Data Sources:** `/api/auth/me`, `/api/courses`

### My Courses (`/instructor/my-courses`)
- **Purpose:** Manage instructor's courses
- **Features:**
  - Course cards with thumbnail, students count, rating
  - "Manage Lessons" and "Quizzes" links
  - Create new course link
- **Data Sources:** `/api/auth/me`, `/api/courses`

### Create Course (`/instructor/create-course`)
- **Purpose:** Form to create new course
- **Features:**
  - Title, description, category, price, duration, thumbnail
  - Form validation
  - Redirect to dashboard after creation
- **Data Sources:** `/api/categories`, `/api/courses`

### Students (`/instructor/students`)
- **Purpose:** View students enrolled in instructor's courses
- **Features:**
  - Table with student info, enrolled course, enrollment date
  - Search functionality
  - Course filter dropdown
- **Data Sources:** `/api/auth/me`, `/api/instructor/enrollments`

### Assignments (`/instructor/assignments`)
- **Purpose:** Manage lessons and assignments
- **Features:**
  - Course selector dropdown
  - Levels and lessons list
  - Add new lesson form (VIDEO/PDF/TEXT)
  - Quiz indicator per lesson
- **Data Sources:** `/api/auth/me`, `/api/courses`, `/api/instructor/lessons`

### Quizzes (`/instructor/quizzes`)
- **Purpose:** Manage quizzes for courses
- **Features:**
  - Quiz cards with question count, passing score, time limit
  - Create new quiz form
  - Delete quiz action
- **Data Sources:** `/api/auth/me`, `/api/courses`, `/api/instructor/quizzes`

### Analytics (`/instructor/analytics`)
- **Purpose:** Performance and revenue analytics
- **Features:**
  - Stats cards: total students, revenue, courses, avg completion
  - Bar chart: students per course
  - Line chart: revenue over time
  - Pie chart: student distribution
- **Data Sources:** `/api/auth/me`, `/api/courses`

### Profile (`/instructor/profile`)
- **Purpose:** View and edit instructor profile
- **Features:**
  - Avatar, name, email, bio
  - Wallet balance
  - Inline edit form
- **Data Sources:** `/api/auth/me`, `/api/profile`

### Settings (`/instructor/settings`)
- **Purpose:** Instructor settings
- **Features:**
  - Theme toggle
  - Notification preferences
  - Password change form
- **Data Sources:** `/api/auth/me`, localStorage

## Admin Pages

### Dashboard (`/admin/dashboard`)
- **Purpose:** Admin overview and platform stats
- **Features:**
  - Stats: users, courses, revenue, certificates
  - Quick actions
- **Data Sources:** `/api/auth/me`, `/api/admin/users`

### Users (`/admin/users`)
- **Purpose:** Manage all platform users
- **Features:**
  - User table with search and role filter
  - Edit role, edit wallet balance, delete user
  - Avatar and info display
- **Data Sources:** `/api/auth/me`, `/api/admin/users`

### Students (`/admin/students`)
- **Purpose:** Manage student accounts
- **Features:**
  - Student table with enrollments count, certificates count
  - Expandable row showing enrolled courses with progress
  - Search functionality
- **Data Sources:** `/api/auth/me`, `/api/admin/users`, `/api/enrollments`

### Instructors (`/admin/instructors`)
- **Purpose:** Manage instructor accounts
- **Features:**
  - Instructor table with courses count, total students
  - Expandable row showing instructor's courses
  - Status indicator (ACTIVE/SUSPENDED)
- **Data Sources:** `/api/auth/me`, `/api/admin/users`, `/api/courses`

### Categories (`/admin/categories`)
- **Purpose:** Manage course categories
- **Features:**
  - Category table with course count
  - Add/edit/delete categories
  - Search functionality
- **Data Sources:** `/api/auth/me`, `/api/admin/categories`

### Levels (`/admin/levels`)
- **Purpose:** Manage course levels
- **Features:**
  - Level table with course info, lesson count
  - Add/edit/delete levels
  - Search by title or course
- **Data Sources:** `/api/auth/me`, `/api/levels`

### Lessons (`/admin/lessons`)
- **Purpose:** Manage all lessons
- **Features:**
  - Lesson table with type icon, course, level, duration
  - Add/edit/delete lessons
  - Type indicators (VIDEO/PDF/TEST)
- **Data Sources:** `/api/auth/me`, `/api/lessons`

### Quizzes (`/admin/quizzes`)
- **Purpose:** Manage all quizzes
- **Features:**
  - Quiz table with lesson, course, passing score, time limit
  - Question count and attempts
  - Add/edit/delete quizzes
- **Data Sources:** `/api/auth/me`, `/api/quizzes`

### Certificates (`/admin/certificates`)
- **Purpose:** Manage all certificates
- **Features:**
  - Certificate table with student, course, cert code, issue date
  - View QR code modal
  - Revoke certificate action
  - Search by name, course, or cert code
- **Data Sources:** `/api/auth/me`, `/api/admin/certificates`

### Payments (`/admin/payments`)
- **Purpose:** Track all payments and transactions
- **Features:**
  - Payment table with user, amount, method, status, date
  - Status filters (COMPLETED, PENDING, FAILED, REFUNDED)
  - Date range filter
  - Search by user name/email
- **Data Sources:** `/api/auth/me`, `/api/admin/payments`

### Subscriptions (`/admin/subscriptions`)
- **Purpose:** Manage subscription plans and view subscriptions
- **Features:**
  - Plans panel (CRUD)
  - Active subscriptions table
  - Plan status toggle
- **Data Sources:** `/api/auth/me`, `/api/admin/subscriptions`

### Reports (`/admin/reports`)
- **Purpose:** Platform analytics and reports
- **Features:**
  - Stats cards: users, courses, revenue, certificates
  - Line chart: user growth
  - Bar chart: course popularity
  - Area chart: monthly revenue
  - Pie chart: completion rates
  - Export CSV/PDF buttons
- **Data Sources:** `/api/auth/me`, `/api/admin/users`, `/api/courses`, `/api/admin/certificates`

### Settings (`/admin/settings`)
- **Purpose:** Platform configuration
- **Features:**
  - General info: site name, description, logo
  - Email settings: SMTP configuration
  - System settings: maintenance mode toggle
  - Social media links
- **Data Sources:** `/api/auth/me`, `/api/admin/settings`

## Shared Components

### Navbar
- **Location:** `components/navbar.tsx`
- **Features:**
  - Logo and brand
  - Wallet balance badge
  - Theme toggle (dark/light)
  - Notifications bell with dropdown
  - Profile dropdown with role-based dashboard link
  - Login/Register buttons (when logged out)

### Sidebar
- **Location:** `components/sidebar.tsx`
- **Features:**
  - Role-based menu items
  - Active tab highlighting
  - Quick role switcher (demo)
  - Responsive design

### VideoPlayerModal
- **Location:** `components/video-player-modal.tsx`
- **Features:**
  - Video playback with controls
  - Progress bar
  - Auto-complete at 80%
  - Manual complete button
  - Calls `/api/lessons/[id]/progress`

### PdfViewerModal
- **Location:** `components/pdf-viewer-modal.tsx`
- **Features:**
  - PDF iframe viewer
  - Download button
  - Text content fallback
  - Mark as complete button

### QuizModal
- **Location:** `components/quiz-modal.tsx`
- **Features:**
  - Question navigation (previous/next)
  - Timer countdown
  - Option selection
  - Submit and show results
  - Certificate generation on pass

### CertificateModal
- **Location:** `components/certificate-modal.tsx`
- **Features:**
  - Official certificate design
  - QR code for verification
  - Print/Save PDF button
  - Student name, course, instructor signatures
