import { NextRequest, NextResponse } from 'next/server'
import { ensureCleanProductionData, prisma } from '@/lib/prisma'
import { comparePassword, getRememberedAccount, signToken } from '@/lib/auth'
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
  withValidation(loginSchema)(async (req: NextRequest, data) => {
    await ensureCleanProductionData()
    const { email, password } = data
    const normalizedEmail = email.trim().toLowerCase()

    const remembered = getRememberedAccount(req)
    const user = await prisma.user.findUnique({ where: { email: normalizedEmail } })

    if (user) {
      if (!comparePassword(password, user.passwordHash)) {
        logger.warn('Failed login attempt', { email: normalizedEmail })
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
    }

    if (remembered && remembered.email === normalizedEmail && comparePassword(password, remembered.passwordHash)) {
      const token = signToken({
        userId: remembered.userId,
        email: remembered.email,
        name: remembered.name,
        role: remembered.role,
      })
      const response = NextResponse.json({
        success: true,
        user: {
          id: remembered.userId,
          name: remembered.name,
          email: remembered.email,
          role: remembered.role,
          avatar: undefined,
          walletBalance: 500,
        },
        token,
      })
      response.cookies.set('vu_auth_token', token, {
        httpOnly: true,
        path: '/',
        maxAge: 60 * 60 * 24 * 7,
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
      })
      logger.info('User logged in from remembered account record', { email: remembered.email })
      return response
    }

    logger.warn('Failed login attempt', { email: normalizedEmail })
    return NextResponse.json({ error: 'البريد الإلكتروني أو كلمة المرور غير صحيحة' }, { status: 401 })
  })
)
