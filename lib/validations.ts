import { z } from 'zod'

export const loginSchema = z.object({
  email: z.string().email('البريد الإلكتروني غير صحيح'),
  password: z.string().min(6, 'كلمة المرور يجب أن تكون 6 أحرف على الأقل'),
})

export const registerSchema = z.object({
  name: z.string().min(2, 'الاسم يجب أن يكون حرفين على الأقل'),
  email: z.string().email('البريد الإلكتروني غير صحيح'),
  password: z.string().min(6, 'كلمة المرور يجب أن تكون 6 أحرف على الأقل'),
  role: z.enum(['STUDENT', 'INSTRUCTOR', 'ADMIN']).default('STUDENT'),
})

export const createCourseSchema = z.object({
  title: z.string().min(3, 'عنوان الكورس مطلوب'),
  description: z.string().min(10, 'وصف الكورس مطلوب'),
  categoryId: z.string().uuid().optional(),
  price: z.coerce.number().min(0, 'السعر لا يمكن أن يكون سالباً'),
  duration: z.string().optional(),
  thumbnail: z.string().url().optional(),
})

export const createLevelSchema = z.object({
  title: z.string().min(3, 'عنوان المستوى مطلوب'),
  description: z.string().optional(),
})

export const createLessonSchema = z.object({
  levelId: z.string().uuid('معرف المستوى غير صحيح'),
  title: z.string().min(3, 'عنوان الدرس مطلوب'),
  type: z.enum(['VIDEO', 'PDF', 'TEST', 'TEXT']).default('VIDEO'),
  contentUrl: z.string().url().optional(),
  pdfUrl: z.string().url().optional(),
  textContent: z.string().optional(),
  duration: z.string().optional(),
  order: z.coerce.number().int().min(1).default(1),
})

export const createQuizSchema = z.object({
  lessonId: z.string().uuid('معرف الدرس غير صحيح'),
  title: z.string().min(3, 'عنوان الاختبار مطلوب'),
  passingScore: z.coerce.number().int().min(1).max(100).default(70),
  timeLimitMinutes: z.coerce.number().int().min(1).default(15),
})

export const createQuestionSchema = z.object({
  quizId: z.string().uuid('معرف الاختبار غير صحيح'),
  questionText: z.string().min(3, 'نص السؤال مطلوب'),
  type: z.enum(['MULTIPLE_CHOICE', 'TRUE_FALSE', 'MULTIPLE_ANSWER']).default('MULTIPLE_CHOICE'),
  optionsJson: z.string().min(1, 'الخيارات مطلوبة'),
  correctAnswer: z.string().min(1, 'الإجابة الصحيحة مطلوبة'),
})

export const updateUserSchema = z.object({
  id: z.string().uuid('معرف المستخدم غير صحيح'),
  role: z.enum(['STUDENT', 'INSTRUCTOR', 'ADMIN']).optional(),
  walletBalance: z.coerce.number().min(0).optional(),
  name: z.string().min(2).optional(),
})

export const updateProfileSchema = z.object({
  name: z.string().min(2).optional(),
  bio: z.string().optional(),
})

export const createCategorySchema = z.object({
  name: z.string().min(2, 'اسم القسم مطلوب'),
  description: z.string().optional(),
})

export const createPaymentSchema = z.object({
  userId: z.string().uuid('معرف المستخدم غير صحيح'),
  amount: z.coerce.number().min(1, 'المبلغ مطلوب'),
  paymentMethod: z.string().optional(),
  description: z.string().optional(),
})

export const createSubscriptionPlanSchema = z.object({
  name: z.string().min(2, 'اسم الخطة مطلوب'),
  price: z.coerce.number().min(1, 'السعر مطلوب'),
  durationDays: z.coerce.number().int().min(1).default(30),
  features: z.string().optional(),
  active: z.boolean().default(true),
})

export const updateSettingsSchema = z.object({
  siteName: z.string().optional(),
  siteDescription: z.string().optional(),
  contactEmail: z.string().email().optional(),
  supportPhone: z.string().optional(),
  smtpHost: z.string().optional(),
  smtpPort: z.string().optional(),
  smtpUser: z.string().optional(),
  smtpPass: z.string().optional(),
  maintenanceMode: z.boolean().optional(),
  logoUrl: z.string().url().optional(),
  facebookUrl: z.string().url().optional(),
  twitterUrl: z.string().url().optional(),
  instagramUrl: z.string().url().optional(),
})

export type LoginInput = z.infer<typeof loginSchema>
export type RegisterInput = z.infer<typeof registerSchema>
export type CreateCourseInput = z.infer<typeof createCourseSchema>
export type CreateLevelInput = z.infer<typeof createLevelSchema>
export type CreateLessonInput = z.infer<typeof createLessonSchema>
export type CreateQuizInput = z.infer<typeof createQuizSchema>
export type CreateQuestionInput = z.infer<typeof createQuestionSchema>
export type UpdateUserInput = z.infer<typeof updateUserSchema>
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>
export type CreateCategoryInput = z.infer<typeof createCategorySchema>
export type CreatePaymentInput = z.infer<typeof createPaymentSchema>
export type CreateSubscriptionPlanInput = z.infer<typeof createSubscriptionPlanSchema>
export type UpdateSettingsInput = z.infer<typeof updateSettingsSchema>
