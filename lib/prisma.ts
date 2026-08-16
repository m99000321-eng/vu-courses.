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

if (!globalForPrisma.prismaDbReady) {
  globalForPrisma.prismaDbReady = prepareRuntimeDatabase()
}

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: ['error', 'warn'],
  })

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}

export async function ensureCleanProductionData() {
  if (process.env.NODE_ENV !== 'production') return
  if (!globalForPrisma.demoDataSanitized) {
    globalForPrisma.demoDataSanitized = (async () => {
      const demoEmails = [
        'student1@vucourses.com',
        'student2@vucourses.com',
        'student3@vucourses.com',
      ]

      await prisma.user.deleteMany({ where: { email: { in: demoEmails } } })

      await prisma.user.updateMany({
        where: { email: 'instructor@vucourses.com' },
        data: {
          name: 'فريق VU. COURSES',
          avatar: null,
          bio: 'فريق منصة VU. COURSES التعليمية',
        },
      })

      await prisma.user.updateMany({
        where: { email: 'admin@vucourses.com' },
        data: {
          name: 'إدارة VU. COURSES',
          avatar: null,
          bio: 'الحساب الإداري الخاص بالمنصة',
        },
      })
    })()
  }

  await globalForPrisma.demoDataSanitized
}
