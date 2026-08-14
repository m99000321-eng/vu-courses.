# Frontend Quick Reference

## 📂 File Locations

### Pages (الصفحات)
```
app/
├── login/page.tsx              # تسجيل الدخول
├── register/page.tsx           # التسجيل
├── courses/page.tsx            # الكورسات
├── chat/page.tsx               # المحادثات
├── notifications/page.tsx      # التنبيهات
├── student/
│   ├── dashboard/page.tsx      # لوحة التحكم
│   ├── my-courses/page.tsx     # دوراتي
│   ├── progress/page.tsx       # التقدم
│   ├── certificates/page.tsx   # الشهادات
│   ├── favorites/page.tsx      # المفضلة
│   ├── profile/page.tsx        # الملف الشخصي
│   └── settings/page.tsx       # الإعدادات
├── instructor/
│   ├── dashboard/page.tsx      # لوحة التحكم
│   ├── my-courses/page.tsx     # كورساتي
│   ├── create-course/page.tsx  # إنشاء كورس
│   ├── students/page.tsx       # الطلاب
│   ├── assignments/page.tsx    # المهام
│   ├── quizzes/page.tsx        # الاختبارات
│   ├── analytics/page.tsx      # التحليلات
│   ├── profile/page.tsx        # الملف الشخصي
│   └── settings/page.tsx       # الإعدادات
└── admin/
    ├── dashboard/page.tsx      # لوحة التحكم
    ├── users/page.tsx          # المستخدمين
    ├── students/page.tsx       # الطلاب
    ├── instructors/page.tsx    # المحاضرين
    ├── categories/page.tsx     # الأقسام
    ├── levels/page.tsx         # المستويات
    ├── lessons/page.tsx        # الدروس
    ├── quizzes/page.tsx        # الاختبارات
    ├── certificates/page.tsx   # الشهادات
    ├── payments/page.tsx       # المدفوعات
    ├── subscriptions/page.tsx  # الاشتراكات
    ├── reports/page.tsx        # التقارير
    └── settings/page.tsx       # الإعدادات
```

### Components (المكونات)
```
components/
├── navbar.tsx                  # الشريط العلوي
├── sidebar.tsx                 # القائمة الجانبية
├── logo.tsx                    # الشعار
├── theme-provider.tsx          # إدارة الثيم
├── video-player-modal.tsx      # مشغل الفيديو
├── pdf-viewer-modal.tsx        # عارض PDF
├── quiz-modal.tsx              # نافذة الاختبار
└── certificate-modal.tsx       # نافذة الشهادة
```

### Styles (التنسيقات)
```
app/
└── globals.css                 # Tailwind + تنسيقات عامة
```

## 🎯 الصفحات حسب الدور

### طالب (Student) - 7 صفحات
- Dashboard
- My Courses
- Progress
- Certificates
- Favorites
- Profile
- Settings

### محاضر (Instructor) - 8 صفحات
- Dashboard
- My Courses
- Create Course
- Students
- Assignments
- Quizzes
- Analytics
- Profile
- Settings

### أدمن (Admin) - 13 صفحة
- Dashboard
- Users
- Students
- Instructors
- Categories
- Levels
- Lessons
- Quizzes
- Certificates
- Payments
- Subscriptions
- Reports
- Settings

## 🔗 الروابط

### الصفحات العامة
- Home: `/`
- Login: `/login`
- Register: `/register`
- Courses: `/courses`
- Chat: `/chat`
- Notifications: `/notifications`

### Student Portal
- Dashboard: `/student/dashboard`
- My Courses: `/student/my-courses`
- Progress: `/student/progress`
- Certificates: `/student/certificates`
- Favorites: `/student/favorites`
- Profile: `/student/profile`
- Settings: `/student/settings`

### Instructor Portal
- Dashboard: `/instructor/dashboard`
- My Courses: `/instructor/my-courses`
- Create Course: `/instructor/create-course`
- Students: `/instructor/students`
- Assignments: `/instructor/assignments`
- Quizzes: `/instructor/quizzes`
- Analytics: `/instructor/analytics`
- Profile: `/instructor/profile`
- Settings: `/instructor/settings`

### Admin Portal
- Dashboard: `/admin/dashboard`
- Users: `/admin/users`
- Students: `/admin/students`
- Instructors: `/admin/instructors`
- Categories: `/admin/categories`
- Levels: `/admin/levels`
- Lessons: `/admin/lessons`
- Quizzes: `/admin/quizzes`
- Certificates: `/admin/certificates`
- Payments: `/admin/payments`
- Subscriptions: `/admin/subscriptions`
- Reports: `/admin/reports`
- Settings: `/admin/settings`

## 📱 المكونات

| المكون | الملف | الوصف |
|--------|-------|-------|
| Navbar | `components/navbar.tsx` | الشريط العلوي |
| Sidebar | `components/sidebar.tsx` | القائمة الجانبية |
| Logo | `components/logo.tsx` | الشعار |
| ThemeProvider | `components/theme-provider.tsx` | إدارة الوضع الليلي |
| VideoPlayer | `components/video-player-modal.tsx` | مشغل الفيديو |
| PdfViewer | `components/pdf-viewer-modal.tsx` | عارض PDF |
| QuizModal | `components/quiz-modal.tsx` | نافذة الاختبار |
| CertificateModal | `components/certificate-modal.tsx` | نافذة الشهادة |

## 🚀 التشغيل

```bash
# تثبيت التبعيات
npm install

# تشغيل السيرفر
npm run dev

# فتح المتصفح
http://localhost:3000
```

## 📖 توثيق إضافي

- `../docs/frontend-structure.md` - هيكل المشروع الكامل
- `../docs/frontend/pages.md` - توثيق الصفحات
- `../docs/frontend/components.md` - توثيق المكونات
- `../docs/frontend/api.md` - توثيق الـ APIs
- `../README.md` - دليل المشروع الرئيسي
