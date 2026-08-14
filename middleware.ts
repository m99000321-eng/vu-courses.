import { NextRequest, NextResponse } from 'next/server'
import { rateLimit } from '@/lib/security'
import { logger } from '@/lib/logger'

export const config = {
  matcher: ['/api/:path*'],
}

export function middleware(request: NextRequest) {
  const response = NextResponse.next()

  const limiter = rateLimit(100, 15 * 60 * 1000)
  if (!limiter(request)) {
    logger.warn('Rate limit exceeded', { ip: request.ip })
    return NextResponse.json(
      { error: 'تم تجاوز الحد المسموح من الطلبات' },
      { status: 429 }
    )
  }

  const securityHeaders = {
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'X-XSS-Protection': '1; mode=block',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
  }

  Object.entries(securityHeaders).forEach(([key, value]) => {
    response.headers.set(key, value)
  })

  return response
}
