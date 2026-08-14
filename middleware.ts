import { NextRequest, NextResponse } from 'next/server'
import { rateLimit } from '@/lib/security'
import { logger } from '@/lib/logger'

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}

const PUBLIC_PATHS = new Set([
  '/login',
  '/register',
])

const PUBLIC_PREFIXES = [
  '/api/auth/',
]

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Keep authentication and registration pages public.
  const isPublicPath = PUBLIC_PATHS.has(pathname) || PUBLIC_PREFIXES.some((prefix) => pathname.startsWith(prefix))

  if (!isPublicPath) {
    const token = request.cookies.get('vu_auth_token')?.value

    if (!token) {
      const loginUrl = request.nextUrl.clone()
      loginUrl.pathname = '/login'
      loginUrl.searchParams.set('next', pathname)
      return NextResponse.redirect(loginUrl)
    }
  }

  const response = NextResponse.next()

  // API rate limiting.
  if (pathname.startsWith('/api/')) {
    const limiter = rateLimit(100, 15 * 60 * 1000)
    if (!limiter(request)) {
      logger.warn('Rate limit exceeded', { ip: request.ip })
      return NextResponse.json(
        { error: 'تم تجاوز الحد المسموح من الطلبات' },
        { status: 429 }
      )
    }
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
