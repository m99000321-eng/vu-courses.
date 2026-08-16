import { PrismaClient } from '@prisma/client'
import fs from 'fs'
import path from 'path'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

const sourceDb = path.join(process.cwd(), 'prisma', 'dev.db')
const runtimeDb = '/tmp/vu-courses.db'

try {
  if (fs.existsSync(sourceDb) && !fs.existsSync(runtimeDb)) {
    fs.copyFileSync(sourceDb, runtimeDb)
  }
} catch (error) {
  console.error('Database initialization failed:', error)
}

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: ['error', 'warn'],
    datasources: {
      db: { url: 'file:/tmp/vu-courses.db' },
    },
  })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
