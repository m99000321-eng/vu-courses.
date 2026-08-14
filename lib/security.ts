import { NextRequest, NextResponse } from 'next/server'

const rateLimitMap = new Map<string, { count: number; resetTime: number }>()

export const rateLimit = (maxRequests: number = 100, windowMs: number = 900000) => {
  const getClientIdentifier = (req: NextRequest): string => {
    return (
      req.headers.get('x-forwarded-for') ||
      req.headers.get('x-real-ip') ||
      'anonymous'
    )
  }

  return (req: NextRequest): boolean => {
    const clientId = getClientIdentifier(req)
    const now = Date.now()

    const record = rateLimitMap.get(clientId)

    if (!record || now > record.resetTime) {
      rateLimitMap.set(clientId, {
        count: 1,
        resetTime: now + windowMs,
      })
      return true
    }

    if (record.count >= maxRequests) {
      return false
    }

    record.count++
    return true
  }
}

export const sanitizeHeaders = (res: NextResponse) => {
  res.headers.set('X-Content-Type-Options', 'nosniff')
  res.headers.set('X-Frame-Options', 'DENY')
  res.headers.set('X-XSS-Protection', '1; mode=block')
  res.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  res.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()')
  return res
}

export const corsHeaders = (origin: string = '*'): Record<string, string> => {
  return {
    'Access-Control-Allow-Origin': origin,
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Max-Age': '86400',
  }
}

export const handleCors = (req: NextRequest, res: NextResponse) => {
  const origin = req.headers.get('origin') || '*'
  const headers = corsHeaders(origin)

  Object.entries(headers).forEach(([key, value]) => {
    res.headers.set(key, value)
  })

  return res
}
