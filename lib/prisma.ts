import { PrismaClient } from '@prisma/client'
import fs from 'fs'
import path from 'path'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
  prismaDbReady: boolean | undefined
  demoDataSanitized: Promise<void> | null | undefined
}

const runtimeDb = '/tmp/vu-courses.db'
const bundledDb = path.join(process.cwd(), 'prisma', 'dev.db')

function prepareRuntimeDatabase() {
  try {
    if (fs.existsSync(runtimeDb)) return true
    if (!fs.existsSync(bundledDb)) {
      console.error('Bundled SQLite database is missing:', bundledDb)
      return false
    }
    fs.copyFileSync(bundledDb, runtimeDb)
    return fs.existsSync(runtimeDb)
  } catch (error) {
    console.error('Unable to prepare runtime SQLite database:', error)
    return false
  }
}

if (!globalForPrisma.prismaDbReady) globalForPrisma.prismaDbReady = prepareRuntimeDatabase()

export const prisma = globalForPrisma.prisma ?? new PrismaClient({ log: ['error', 'warn'] })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

export async function ensureCleanProductionData() {
  if (process.env.NODE_ENV !== 'production') return
  if (!globalForPrisma.demoDataSanitized) {
    globalForPrisma.demoDataSanitized = (async () => {
      try {
        const demoUsers = await prisma.user.findMany({
          where: { email: { in: ['student1@vucourses.com', 'student2@vucourses.com', 'student3@vucourses.com'] } },
          select: { id: true },
        })
        const demoIds = demoUsers.map((u) => u.id)

        if (demoIds.length) {
          await prisma.message.deleteMany({ where: { OR: [{ senderId: { in: demoIds } }, { receiverId: { in: demoIds } }] } })
          await prisma.lessonProgress.deleteMany({ where: { userId: { in: demoIds } } })
          await prisma.quizAttempt.deleteMany({ where: { userId: { in: demoIds } } })
          await prisma.enrollment.deleteMany({ where: { userId: { in: demoIds } } })
          await prisma.certificate.deleteMany({ where: { userId: { in: demoIds } } })
          await prisma.favorite.deleteMany({ where: { userId: { in: demoIds } } })
          await prisma.notification.deleteMany({ where: { userId: { in: demoIds } } })
          await prisma.payment.deleteMany({ where: { userId: { in: demoIds } } })
          await prisma.user.deleteMany({ where: { id: { in: demoIds } } })
        }

        // Production is intentionally instructor-free until a real instructor is added later.
        const instructors = await prisma.user.findMany({ where: { role: 'INSTRUCTOR' }, select: { id: true } })
        const instructorIds = instructors.map((u) => u.id)
        if (instructorIds.length) {
          const instructorCourses = await prisma.course.findMany({ where: { instructorId: { in: instructorIds } }, select: { id: true } })
          const courseIds = instructorCourses.map((c) => c.id)

          if (courseIds.length) {
            await prisma.enrollment.deleteMany({ where: { courseId: { in: courseIds } } })
            await prisma.certificate.deleteMany({ where: { courseId: { in: courseIds } } })
            await prisma.favorite.deleteMany({ where: { courseId: { in: courseIds } } })
            await prisma.course.deleteMany({ where: { id: { in: courseIds } } })
          }

          await prisma.message.deleteMany({ where: { OR: [{ senderId: { in: instructorIds } }, { receiverId: { in: instructorIds } }] } })
          await prisma.lessonProgress.deleteMany({ where: { userId: { in: instructorIds } } })
          await prisma.quizAttempt.deleteMany({ where: { userId: { in: instructorIds } } })
          await prisma.enrollment.deleteMany({ where: { userId: { in: instructorIds } } })
          await prisma.certificate.deleteMany({ where: { userId: { in: instructorIds } } })
          await prisma.favorite.deleteMany({ where: { userId: { in: instructorIds } } })
          await prisma.notification.deleteMany({ where: { userId: { in: instructorIds } } })
          await prisma.payment.deleteMany({ where: { userId: { in: instructorIds } } })
          await prisma.user.deleteMany({ where: { id: { in: instructorIds } } })
        }

        await prisma.user.updateMany({
          where: { email: 'admin@vucourses.com' },
          data: { name: 'إدارة VU. COURSES', avatar: null, bio: 'الحساب الإداري الخاص بالمنصة' },
        })
      } catch (error) {
        console.error('Production data cleanup failed:', error)
      }
    })()
  }

  await globalForPrisma.demoDataSanitized
}
