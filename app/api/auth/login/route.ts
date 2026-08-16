import { NextResponse } from 'next/server'
import { ensureCleanProductionData, prisma } from '@/lib/prisma'
import { comparePassword, signToken } from '@/lib/auth'
import { withErrorHandling, withValidation } from '@/lib/api-wrapper'
import { loginSchema } from '@/lib/validations'
import { logger } from '@/lib/logger'

const sanitizeUser = (user: any) => ({
  id: user.id,
  name: user.name,
  email: user.email,
  role: user.role,
  avatar: user.avatar,
  walletBalance: user.walletBalance,
})

export const POST = withErrorHandling(
  withValidation(loginSchema)(async (req, data) => {
    await ensureCleanProductionData()
    const { email, password } = data

    const user = await prisma.user.findUnique({ where: { email } })
    if (!user || !comparePassword(password, user.passwordHash)) {
      logger.warn('Failed login attempt', { email })
      return NextResponse.json({ error: 'البريد الإلكتروني أو كلمة المرور غير صحيحة' }, { status: 401 })
    }

    const token = signToken({ userId: user.id, email: user.email, name: user.name, role: user.role })
    const response = NextResponse.json({ success: true, user: sanitizeUser(user), token })

    response.cookies.set('vu_auth_token', token, {
      httpOnly: true,
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
    })

    logger.info('User logged in', { userId: user.id, email: user.email })
    return response
  })
)
