# Frontend - VU. COURSES

## 📁 هيكل المشروع

```
frontend/
├── index.html                 ← هذا الملف - عرض جميع الصفحات
├── styles/
│   └── main.css               ← تنسيقات العرض
├── pages/                     ← الصفحات (مرجع)
│   ├── student/              # 7 صفحات طالب
│   ├── instructor/           # 8 صفحات محاضر
│   ├── admin/                # 13 صفحة أدمن
│   ├── public/               # 6 صفحات عامة
│   └── ...
├── components/                ← المكونات (مرجع)
│   ├── navbar.tsx
│   ├── sidebar.tsx
│   ├── video-player-modal.tsx
│   ├── pdf-viewer-modal.tsx
│   ├── quiz-modal.tsx
│   └── certificate-modal.tsx
└── README.md                  ← هذا الملف
```

## 📊 إحصائيات المشروع

| البند | العدد |
|-------|-------|
| إجمالي الصفحات | 35 |
| صفحات الطالب | 7 |
| صفحات المحاضر | 8 |
| صفحات الأدمن | 13 |
| صفحات عامة | 6 |
| المكونات | 8 |
| API Endpoints | 21 |

## 🎨 التقنيات المستخدمة

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Icons:** Lucide React
- **Charts:** Recharts
- **State:** React Hooks
- **Theme:** Dark/Light Mode
- **Direction:** RTL (Arabic)

## 📱 جميع الصفحات

### صفحات عامة (6)
1. `/` - الصفحة الرئيسية
2. `/login` - تسجيل الدخول
3. `/register` - إنشاء حساب
4. `/courses` - catalog الكورسات
5. `/chat` - المحادثات
6. `/notifications` - التنبيهات

### بوابة الطالب (7)
7. `/student/dashboard` - لوحة التحكم
8. `/student/my-courses` - دوراتي
9. `/student/progress` - التقدم
10. `/student/certificates` - الشهادات
11. `/student/favorites` - المفضلة
12. `/student/profile` - الملف الشخصي
13. `/student/settings` - الإعدادات

### بوابة المحاضر (8)
14. `/instructor/dashboard` - لوحة التحكم
15. `/instructor/my-courses` - كورساتي
16. `/instructor/create-course` - إنشاء كورس
17. `/instructor/students` - الطلاب
18. `/instructor/assignments` - المهام والدروس
19. `/instructor/quizzes` - الاختبارات
20. `/instructor/analytics` - التحليلات
21. `/instructor/profile` - الملف الشخصي
22. `/instructor/settings` - الإعدادات

### بوابة الأدمن (13)
23. `/admin/dashboard` - لوحة التحكم
24. `/admin/users` - المستخدمين
25. `/admin/students` - الطلاب
26. `/admin/instructors` - المحاضرين
27. `/admin/categories` - الأقسام
28. `/admin/levels` - المستويات
29. `/admin/lessons` - الدروس
30. `/admin/quizzes` - الاختبارات
31. `/admin/certificates` - الشهادات
32. `/admin/payments` - المدفوعات
33. `/admin/subscriptions` - الاشتراكات
34. `/admin/reports` - التقارير
35. `/admin/settings` - الإعدادات

## 🧩 المكونات (Components)

1. **Navbar** - شريط التنقل العلوي
2. **Sidebar** - القائمة الجانبية
3. **Logo** - شعار VU. COURSES
4. **ThemeProvider** - إدارة الوضع الليلي
5. **VideoPlayerModal** - مشغل الفيديو
6. **PdfViewerModal** - عارض PDF
7. **QuizModal** - نافذة الاختبارات
8. **CertificateModal** - نافذة الشهادات

## 🎨 نظام التصميم

### الألوان
- **Primary Purple:** `#6C2BD9`
- **Primary Orange:** `#F97316`
- **Dark Background:** `#0f172a`
- **Light Background:** `#f8fafc`

### الخطوط
- **Font:** System fonts (Arabic optimized)
- **Direction:** RTL
- **Language:** Arabic

### الأنماط
- Border Radius: `rounded-2xl`
- Shadows: `shadow-sm` to `shadow-lg`
- Spacing: `p-4`, `p-6`, `gap-4`

## 📂 المكان الفعلي للملفات

جميع ملفات الفرونت اند موجودة في:
```
app/
├── layout.tsx
├── page.tsx
├── globals.css
├── login/page.tsx
├── register/page.tsx
├── courses/page.tsx
├── chat/page.tsx
├── notifications/page.tsx
├── student/
├── instructor/
└── admin/

components/
├── navbar.tsx
├── sidebar.tsx
├── video-player-modal.tsx
├── pdf-viewer-modal.tsx
├── quiz-modal.tsx
└── certificate-modal.tsx
```

## 🚀 كيفية التشغيل

```bash
npm run dev
```

ثم افتح: http://localhost:3000

## 📖 التوثيق الكامل

- `docs/frontend-structure.md` - هيكل المشروع الكامل
- `docs/frontend/pages.md` - توثيق جميع الصفحات
- `docs/frontend/components.md` - توثيق المكونات
- `docs/frontend/api.md` - توثيق الـ APIs
- `README.md` - دليل المشروع الرئيسي
