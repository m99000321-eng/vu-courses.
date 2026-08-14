# VU. COURSES - منصة تعليمية متكاملة

منصة تعليمية إلكترونية متكاملة لتعليم تطوير البرمجيات والويب، مع نظام شهادات تفاعلية واختبارات تقييمية.

## الميزات

### للطلاب
- تصفح الدورات التعليمية
- مشاهدة الدروس (فيديو، PDF، نص)
- إجراء اختبارات تقييمية
- تتبع التقدم الدراسي
- الحصول على شهادات إتمام
- المفضلة والتنبيهات
- المحادثات مع المحاضرين

### للمحاضرين
- إنشاء وإدارة الدورات
- إضافة الدروس والوسائط
- إنشاء الاختبارات
- متابعة الطلاب المسجلين
- تحليلات الأداء والأرباح

### للأدمن
- إدارة المستخدمين والصلاحيات
- إدارة الأقسام والدورات
- إدارة المستويات والدروس
- إدارة الاختبارات
- سجل الشهادات
- المدفوعات والاشتراكات
- التقارير والتحليلات
- إعدادات المنصة

## التقنيات المستخدمة

- **Frontend:** Next.js 14, React 18, TypeScript, Tailwind CSS
- **Backend:** Next.js API Routes
- **Database:** SQLite with Prisma ORM
- **Authentication:** JWT
- **Charts:** Recharts
- **Icons:** Lucide React

## التشغيل المحلي

### المتطلبات
- Node.js 18+
- npm أو yarn

### خطوات التشغيل

```bash
# 1. استنساخ المشروع
git clone <repository-url>
cd vu-courses

# 2. تثبيت التبعيات
npm install

# 3. إعداد قاعدة البيانات
npx prisma generate
npx prisma db push
npx prisma db seed

# 4. تشغيل السيرفر
npm run dev
```

المنصة ستكون متاحة على: `http://localhost:3000`

## الحسابات التجريبية

| الدور | البريد | كلمة المرور |
|-------|---------|-------------|
| طالب | student1@vucourses.com | pass123 |
| محاضر | instructor@vucourses.com | inst123 |
| أدمن | admin@vucourses.com | admin123 |

## هيكل المشروع

```
frontend/                          ← واجهات المشروع (Frontend)
├── index.html                     ← عرض جميع الصفحات
├── README.md                      ← دليل الفرونت اند
├── QUICK_REFERENCE.md             ← مرجع سريع
├── styles/
│   └── main.css                   ← تنسيقات العرض
└── pages/                         ← مرجع الصفحات

app/                    # Next.js App Router
├── layout.tsx          # التخطيط الرئيسي
├── page.tsx            # الصفحة الرئيسية
├── globals.css         # التنسيقات العامة
├── login/              # تسجيل الدخول
├── register/           # التسجيل
├── courses/            # الكورسات
├── chat/               # المحادثات
├── notifications/      # التنبيهات
├── student/            # 7 صفحات طالب
├── instructor/         # 8 صفحات محاضر
└── admin/              # 13 صفحة أدمن

components/             # المكونات القابلة لإعادة الاستخدام
├── navbar.tsx
├── sidebar.tsx
├── video-player-modal.tsx
├── pdf-viewer-modal.tsx
├── quiz-modal.tsx
└── certificate-modal.tsx

lib/                    # الأدوات والمساعدات
├── prisma.ts
├── auth.ts
├── validations.ts
├── errors.ts
├── logger.ts
├── security.ts
└── api-wrapper.ts

prisma/                 # قاعدة البيانات
├── schema.prisma
└── seed.ts

docs/                   # التوثيق الكامل
├── frontend-structure.md
├── PROJECT_SUMMARY.md
├── PROFESSIONAL_FEATURES.md
└── frontend/
    ├── pages.md
    ├── components.md
    └── api.md
```

## الأوامر المتاحة

```bash
npm run dev          # تشغيل السيرفر المحلي
npm run build        # بناء المشروع للإنتاج
npm run start        # تشغيل الإصدار المنتج
npm run lint         # فحص الأكواد
npm run test         # تشغيل الاختبارات
npm run db:push      # تحديث قاعدة البيانات
npm run db:seed      # تعبئة قاعدة البيانات
npm run db:studio    # فتح Prisma Studio
```

## بيئة الإنتاج

### باستخدام Docker

```bash
# بناء وتشغيل
docker-compose up -d

# إيقاف
docker-compose down
```

### متغيرات البيئة

```env
NODE_ENV=production
JWT_SECRET=your-secret-key
DATABASE_URL=file:./data/dev.db
NEXT_PUBLIC_API_URL=https://your-domain.com/api
```

## الأمان

- مصادقة JWT
- تشفير كلمات المرور (bcrypt)
- حماية من CSRF
- Rate Limiting
- Headers أمان HTTP
- CORS مُعد

## الترخيص

MIT

## الدعم

للدعم والاستفسارات: support@vucourses.com
