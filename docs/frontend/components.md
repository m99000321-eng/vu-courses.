# Components Documentation

## Core Components

### Navbar (`components/navbar.tsx`)
- **Type:** Client Component
- **Props:** `currentUser?: { name: string; email: string; role: string }`
- **Features:**
  - Responsive navigation
  - Logo + App name
  - Wallet balance display
  - Theme toggle (Sun/Moon icon)
  - Notifications bell with unread count
  - User dropdown menu (Dashboard, Profile, Logout)
  - Login/Register buttons (when not authenticated)
- **Used in:** All authenticated pages

### Sidebar (`components/sidebar.tsx`)
- **Type:** Client Component
- **Props:** `role: 'STUDENT' | 'INSTRUCTOR' | 'ADMIN'`, `activeTab?: string`
- **Features:**
  - Role-based menu items
  - Active tab highlighting with purple accent
  - Dashboard link (role-specific)
  - Quick action links based on role
  - User role switcher (demo purposes)
  - Responsive sidebar
- **Menu Items:**
  - **Student:** Dashboard, My Courses, Progress, Certificates, Favorites, Profile, Settings
  - **Instructor:** Dashboard, My Courses, Create Course, Students, Assignments, Quizzes, Analytics, Profile, Settings
  - **Admin:** Dashboard, Users, Students, Instructors, Categories, Levels, Lessons, Quizzes, Certificates, Payments, Subscriptions, Reports, Settings

### Logo (`components/logo.tsx`)
- **Type:** Client Component
- **Features:**
  - VU. COURSES brand logo
  - Purple gradient with icon
  - Responsive sizing
- **Usage:** Used in Navbar and Auth pages

### ThemeProvider (`components/theme-provider.tsx`)
- **Type:** Client Component
- **Features:**
  - Dark/Light mode toggle
  - Persists theme in localStorage
  - Defaults to light mode
  - Provides theme context to children
- **Usage:** Wraps root layout

## Modal Components

### VideoPlayerModal (`components/video-player-modal.tsx`)
- **Type:** Client Component
- **Props:** `isOpen: boolean`, `onClose: () => void`, `videoUrl: string`, `lessonTitle?: string`, `lessonId?: string`
- **Features:**
  - Full-screen video player
  - Auto-tracking of watch progress
  - Mark as complete button
  - Auto-complete at 80% watched
  - Progress indicator
  - Close on backdrop click
- **Calls:** `/api/lessons/[id]/progress`

### PdfViewerModal (`components/pdf-viewer-modal.tsx`)
- **Type:** Client Component
- **Props:** `isOpen: boolean`, `onClose: () => void`, `pdfUrl?: string`, `textContent?: string`, `lessonTitle?: string`, `lessonId?: string`
- **Features:**
  - PDF iframe viewer
  - Download button
  - Text content fallback if no PDF
  - Mark as complete button
- **Calls:** `/api/lessons/[id]/progress`

### QuizModal (`components/quiz-modal.tsx`)
- **Type:** Client Component
- **Props:** `isOpen: boolean`, `onClose: () => void`, `quiz: Quiz`, `onComplete?: (score: number) => void`
- **Features:**
  - Question navigation (previous/next)
  - Timer countdown
  - Option selection (radio/checkbox)
  - Submit button
  - Results screen with score
  - Certificate generation on pass (70%+)
  - Retry option on fail
- **Calls:** `/api/quizzes/[id]/submit`

### CertificateModal (`components/certificate-modal.tsx`)
- **Type:** Client Component
- **Props:** `isOpen: boolean`, `onClose: () => void`, `certificate: Certificate`
- **Features:**
  - Official certificate design with VU. COURSES branding
  - QR code for verification
  - Student name, course name, instructor signatures
  - Issue date and certificate code
  - Print/Save PDF button
- **Uses:** `qrcode` library for QR generation

## Utility Components

### LoadingSpinner
- **Location:** Used in multiple pages
- **Features:**
  - Spinning loader icon
  - "جاري التحميل..." text
  - Centered in container

### ErrorMessage
- **Location:** Used in API calls
- **Features:**
  - Displays error messages
  - Red/destructive styling
  - Dismissible

### EmptyState
- **Location:** Used when no data
- **Features:**
  - Icon placeholder
  - Message text
  - Optional action button

## UI Patterns

### Cards
- Rounded corners: `rounded-2xl`
- Border: `border border-slate-200 dark:border-slate-800`
- Shadow: `shadow-sm`
- Padding: `p-6`

### Buttons
- Primary: `bg-brand-purple hover:bg-brand-purple-hover`
- Secondary: `bg-slate-200 dark:bg-slate-800`
- Destructive: `bg-rose-600`
- Orange: `bg-brand-orange`
- Rounded: `rounded-xl`
- Font: `font-bold text-xs`

### Inputs
- Background: `bg-slate-100 dark:bg-slate-800`
- Border: `border border-slate-200 dark:border-slate-700`
- Rounded: `rounded-xl`
- Padding: `p-3`
- Focus: `focus:ring-2 focus:ring-brand-purple`

### Tables
- Container: `overflow-x-auto`
- Header: `border-b border-slate-200 dark:border-slate-800`
- Rows: `hover:bg-slate-50 dark:hover:bg-slate-800/40`
- Cells: `py-3 px-4`

### Badges
- Primary: `bg-brand-purple text-white`
- Success: `bg-emerald-100 text-emerald-700`
- Warning: `bg-amber-100 text-amber-700`
- Destructive: `bg-rose-100 text-rose-700`
- Rounded: `rounded-full` or `rounded-lg`
