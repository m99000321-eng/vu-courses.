import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { AppError, handleApiError } from '@/lib/errors'
import { logger } from '@/lib/logger'

export function withErrorHandling(handler: (req: NextRequest) => Promise<NextResponse>) {
  return async (req: NextRequest) => {
    try {
      return await handler(req)
    } catch (error) {
      logger.error('API Error:', {
        url: req.url,
        method: req.method,
        error: error instanceof Error ? error.message : 'Unknown error',
      })

      const { error: message, statusCode } = handleApiError(error)
      return NextResponse.json({ success: false, error: message }, { status: statusCode })
    }
  }
}

export function withValidation<T>(schema: z.ZodSchema<T>) {
  return (handler: (req: NextRequest, data: T) => Promise<NextResponse>) => {
    return withErrorHandling(async (req: NextRequest) => {
      const body = await req.json()
      const validatedData = schema.parse(body)
      return handler(req, validatedData)
    })
  }
}

export function withAuth(handler: (req: NextRequest, user: any) => Promise<NextResponse>) {
  return withErrorHandling(async (req: NextRequest) => {
    const { getAuthUser } = await import('@/lib/auth')
    const user = getAuthUser(req)

    if (!user) {
      throw new AppError('غير مصرح لك', 401)
    }

    return handler(req, user)
  })
}

export function withAdminAuth(handler: (req: NextRequest, user: any) => Promise<NextResponse>) {
  return withAuth(async (req: NextRequest, user) => {
    if (user.role !== 'ADMIN') {
      throw new AppError('غير مصرح لك. صلاحيات الأدمن مطلوبة', 403)
    }
    return handler(req, user)
  })
}
