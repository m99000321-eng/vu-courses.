import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting VU. COURSES database seeding...')

  // Clear existing data
  await prisma.payment.deleteMany()
  await prisma.notification.deleteMany()
  await prisma.message.deleteMany()
  await prisma.favorite.deleteMany()
  await prisma.certificate.deleteMany()
  await prisma.lessonProgress.deleteMany()
  await prisma.enrollment.deleteMany()
  await prisma.quizAttempt.deleteMany()
  await prisma.question.deleteMany()
  await prisma.quiz.deleteMany()
  await prisma.lesson.deleteMany()
  await prisma.level.deleteMany()
  await prisma.course.deleteMany()
  await prisma.category.deleteMany()
  await prisma.user.deleteMany()

  const passwordHashAdmin = bcrypt.hashSync('admin123', 10)
  const passwordHashInst = bcrypt.hashSync('inst123', 10)
  const passwordHashStudent = bcrypt.hashSync('pass123', 10)

  // Users
  const admin = await prisma.user.create({
    data: {
      name: 'مدير النظام (Admin)',
      email: 'admin@vucourses.com',
      passwordHash: passwordHashAdmin,
      role: 'ADMIN',
      walletBalance: 2500.0,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      bio: 'مدير عام منصة VU. COURSES التعليمية',
    },
  })

  const instructor = await prisma.user.create({
    data: {
      name: 'م. أحمد محمود',
      email: 'instructor@vucourses.com',
      passwordHash: passwordHashInst,
      role: 'INSTRUCTOR',
      walletBalance: 1200.0,
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      bio: 'مهندس برمجيات ومحاضر محترف بخبرة +10 سنوات في تقنيات Web & Cloud',
    },
  })

  const student1 = await prisma.user.create({
    data: {
      name: 'طالب تجريبي',
      email: 'student1@vucourses.com',
      passwordHash: passwordHashStudent,
      role: 'STUDENT',
      walletBalance: 500.0,
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    },
  })

  const student2 = await prisma.user.create({
    data: {
      name: 'سارة يوسف',
      email: 'student2@vucourses.com',
      passwordHash: passwordHashStudent,
      role: 'STUDENT',
      walletBalance: 350.0,
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    },
  })

  const student3 = await prisma.user.create({
    data: {
      name: 'محمد علي',
      email: 'student3@vucourses.com',
      passwordHash: passwordHashStudent,
      role: 'STUDENT',
      walletBalance: 800.0,
      avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80',
    },
  })

  // Categories
  const catFrontend = await prisma.category.create({
    data: {
      name: 'تطوير الواجهات Frontend',
      description: 'تعلم تقنيات HTML, CSS, JavaScript, React, Tailwind CSS',
    },
  })

  const catBackend = await prisma.category.create({
    data: {
      name: 'تطوير الخلفيات Backend',
      description: 'تعلم Node.js, Express, PostgreSQL, Prisma APIs',
    },
  })

  // Course 1: Frontend Foundations
  const courseFrontend = await prisma.course.create({
    data: {
      title: 'Frontend Foundations - أساسيات تطوير الواجهات',
      description: 'دورة شاملة لتأسيس وتصميم الواجهات البرمجية التفاعلية مع دراسة HTML, CSS, JavaScript بالتفصيل التطبيقي.',
      categoryId: catFrontend.id,
      instructorId: instructor.id,
      price: 0,
      duration: '16 ساعة',
      rating: 4.9,
      studentsCount: 142,
      published: true,
      thumbnail: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=600&auto=format&fit=crop&q=80',
    },
  })

  // Levels for Course 1
  const level1 = await prisma.level.create({
    data: {
      courseId: courseFrontend.id,
      levelNumber: 1,
      title: 'Level 1: أساسيات HTML5 الهيكلية',
      description: 'تعلم عناصر HTML الأساسية وكتابة النماذج والجداول والقوائم بأسلوب قياسي.',
    },
  })

  const level2 = await prisma.level.create({
    data: {
      courseId: courseFrontend.id,
      levelNumber: 2,
      title: 'Level 2: تنسيقات CSS3 والتصميم التجاوبي',
      description: 'إتقان تنسيقات Flexbox, CSS Grid وإحداث مظهر عالي الفخامة.',
    },
  })

  const level3 = await prisma.level.create({
    data: {
      courseId: courseFrontend.id,
      levelNumber: 3,
      title: 'Level 3: التفاعلية البرمجية بـ JavaScript',
      description: 'التعامل مع DOM، المتغيرات، الدوال والتطبيقات المباشرة.',
    },
  })

  const level4 = await prisma.level.create({
    data: {
      courseId: courseFrontend.id,
      levelNumber: 4,
      title: 'Level 4: المشروع النهائي والتطبيق العملي',
      description: 'بناء موقع متكامل ونشره على منصة الاستضافة.',
    },
  })

  // Lessons for Level 1
  const l1_video = await prisma.lesson.create({
    data: {
      levelId: level1.id,
      title: 'Introduction to HTML - مقدمة في لغة HTML',
      type: 'VIDEO',
      contentUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
      duration: '12 دقيقة',
      order: 1,
    },
  })

  const l1_pdf = await prisma.lesson.create({
    data: {
      levelId: level1.id,
      title: 'HTML Basics Guide - كتيب القواعد والوسوم الأساسية',
      type: 'PDF',
      pdfUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
      textContent: 'ملف توثيقي ممتع يشرح كافة الوسوم في HTML5 مع أمثلة كود توضيحية.',
      duration: '10 دقائق',
      order: 2,
    },
  })

  const l1_test = await prisma.lesson.create({
    data: {
      levelId: level1.id,
      title: 'HTML Quiz - اختبار قياس المفاهيم الأساسية',
      type: 'TEST',
      duration: '15 دقيقة',
      order: 3,
    },
  })

  // Quiz for Level 1
  const quiz1 = await prisma.quiz.create({
    data: {
      lessonId: l1_test.id,
      title: 'اختبار HTML الأساسي',
      passingScore: 70,
      timeLimitMinutes: 10,
    },
  })

  await prisma.question.createMany({
    data: [
      {
        quizId: quiz1.id,
        questionText: 'ما هو العنصر المستخدم لإنشاء عنوان رئيسي في لغة HTML؟',
        type: 'MULTIPLE_CHOICE',
        optionsJson: JSON.stringify(['<h1>', '<head>', '<header>', '<title>']),
        correctAnswer: '<h1>',
      },
      {
        quizId: quiz1.id,
        questionText: 'هل وسم <img> يتطلب وسم إغلاق مغلق مغاير </img> في HTML5؟',
        type: 'TRUE_FALSE',
        optionsJson: JSON.stringify(['خطأ (لا يتطلب وسم إغلاق)', 'صحيح (يتطلب وسم إغلاق)']),
        correctAnswer: 'خطأ (لا يتطلب وسم إغلاق)',
      },
      {
        quizId: quiz1.id,
        questionText: 'ما هي الخاصية المستخدمة لإضافة رابط التشعب في وسم <a>؟',
        type: 'MULTIPLE_CHOICE',
        optionsJson: JSON.stringify(['href', 'src', 'link', 'target']),
        correctAnswer: 'href',
      },
    ],
  })

  // Lessons for Level 2
  await prisma.lesson.create({
    data: {
      levelId: level2.id,
      title: 'CSS Flexbox & Layout - شرح التخطيط التكيّفي',
      type: 'VIDEO',
      contentUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
      duration: '18 دقيقة',
      order: 1,
    },
  })

  await prisma.lesson.create({
    data: {
      levelId: level2.id,
      title: 'CSS Cheatsheet - مرجع خصائص التنسيق',
      type: 'PDF',
      pdfUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
      textContent: 'دليل ملخص لأهم خصائص CSS في التنسيقات والألوان والأبعاد.',
      duration: '15 دقيقة',
      order: 2,
    },
  })

  const l2_test = await prisma.lesson.create({
    data: {
      levelId: level2.id,
      title: 'CSS Quiz - اختبار تنسيقات المواقع',
      type: 'TEST',
      duration: '15 دقيقة',
      order: 3,
    },
  })

  const quiz2 = await prisma.quiz.create({
    data: {
      lessonId: l2_test.id,
      title: 'اختبار CSS3 والتصميم التفاعلي',
      passingScore: 70,
      timeLimitMinutes: 10,
    },
  })

  await prisma.question.createMany({
    data: [
      {
        quizId: quiz2.id,
        questionText: 'ما هي الخاصية المستخدمة لتحديد لون خلفية العنصر في CSS؟',
        type: 'MULTIPLE_CHOICE',
        optionsJson: JSON.stringify(['background-color', 'color', 'bgcolor', 'background-style']),
        correctAnswer: 'background-color',
      },
      {
        quizId: quiz2.id,
        questionText: 'أي القيم التالية تجعل العنصر يتصرف كحاوية مرنة Flex Container؟',
        type: 'MULTIPLE_CHOICE',
        optionsJson: JSON.stringify(['display: flex', 'display: grid', 'display: block', 'position: absolute']),
        correctAnswer: 'display: flex',
      },
    ],
  })

  // Course 2: React Development
  const courseReact = await prisma.course.create({
    data: {
      title: 'React & Next.js Masterclass - تطوير التطبيقات الحديثة',
      description: 'تعلم بناء تطبيقات ويب فائقة الأداء باستخدام React 18, Next.js 14, Hooks, State Management.',
      categoryId: catFrontend.id,
      instructorId: instructor.id,
      price: 299,
      duration: '24 ساعة',
      rating: 5.0,
      studentsCount: 88,
      published: true,
      thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=600&auto=format&fit=crop&q=80',
    },
  })

  const reactL1 = await prisma.level.create({
    data: {
      courseId: courseReact.id,
      levelNumber: 1,
      title: 'Level 1: أساسيات Components & JSX',
      description: 'فهم المكونات و Props و State في مكتبة React.',
    },
  })

  await prisma.lesson.create({
    data: {
      levelId: reactL1.id,
      title: 'React Components Overview - فهم البنية البرمجية',
      type: 'VIDEO',
      contentUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
      duration: '20 دقيقة',
      order: 1,
    },
  })

  // Enroll Student 1 in Course 1
  await prisma.enrollment.create({
    data: {
      userId: student1.id,
      courseId: courseFrontend.id,
      progressPercent: 68.0,
    },
  })

  // Lesson Progress for Student 1
  await prisma.lessonProgress.create({
    data: {
      userId: student1.id,
      lessonId: l1_video.id,
      completed: true,
    },
  })

  await prisma.lessonProgress.create({
    data: {
      userId: student1.id,
      lessonId: l1_pdf.id,
      completed: true,
    },
  })

  // Favorite
  await prisma.favorite.create({
    data: {
      userId: student1.id,
      courseId: courseFrontend.id,
    },
  })

  // Certificate for Student 1
  await prisma.certificate.create({
    data: {
      userId: student1.id,
      courseId: courseFrontend.id,
      certCode: 'VU-CERT-2026-99482',
      qrCodeUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=VU-CERT-2026-99482',
    },
  })

  // Messages
  await prisma.message.create({
    data: {
      senderId: instructor.id,
      receiverId: student1.id,
      content: 'أهلاً بك يا عمر في دورة Frontend Foundations! يسعدني إجابة أي استفسارات لديك.',
      read: true,
    },
  })

  await prisma.message.create({
    data: {
      senderId: student1.id,
      receiverId: instructor.id,
      content: 'شكراً جزيلاً لك بشمهندس أحمد، الدورة ممتازة جداً والتطبيقات واضحة.',
      read: true,
    },
  })

  // Notifications
  await prisma.notification.createMany({
    data: [
      {
        userId: student1.id,
        title: 'مبروك! تم إصدار شهادتك',
        message: 'تم إصدار شهادة إتمام Level 1 بنجاح كود الشهادة: VU-CERT-2026-99482',
        type: 'success',
      },
      {
        userId: student1.id,
        title: 'تنبيه درس جديد',
        message: 'تم إضافة فيديو جديد في Level 2: CSS Flexbox & Layout',
        type: 'info',
      },
      {
        userId: instructor.id,
        title: 'طالب جديد انضم للفرع',
        message: 'قام طالب بالانضمام لدورة Frontend Foundations',
        type: 'info',
      },
      {
        userId: admin.id,
        title: 'تقرير النظام اليومي',
        message: 'إجمالي المستخدمين النشطين اليوم 15 طالب ومدرب.',
        type: 'system',
      },
    ],
  })

  // Payments
  await prisma.payment.create({
    data: {
      userId: student1.id,
      amount: 299.0,
      paymentMethod: 'المحفظة الإلكترونية',
      status: 'COMPLETED',
      description: 'اشتراك دورة React & Next.js Masterclass',
    },
  })

  console.log('✅ Database successfully seeded with full production datasets!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
