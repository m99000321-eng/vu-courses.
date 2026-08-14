import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { logger } from '@/lib/logger'

export async function GET() {
  try {
    const startTime = Date.now()

    await prisma.$queryRaw`SELECT 1`

    const dbResponseTime = Date.now() - startTime

    const health = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      database: {
        status: 'connected',
        responseTime: `${dbResponseTime}ms`,
      },
      memory: {
        used: `${Math.round(process.memoryUsage().heapUsed / 1024 / 1024)}MB`,
        total: `${Math.round(process.memoryUsage().heapTotal / 1024 / 1024)}MB`,
      },
      uptime: `${Math.round(process.uptime())}s`,
      version: process.env.npm_package_version || '1.0.0',
    }

    return NextResponse.json(health, { status: 200 })
  } catch (error) {
    logger.error('Health check failed', error)

    return NextResponse.json(
      {
        status: 'unhealthy',
        timestamp: new Date().toISOString(),
        database: {
          status: 'disconnected',
          error: 'Database connection failed',
        },
      },
      { status: 503 }
    )
  }
}
