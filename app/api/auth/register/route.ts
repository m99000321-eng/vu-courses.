import { NextResponse } from 'next/server'
import { ensureCleanProductionData, prisma } from '@/lib/prisma'
import { hashPassword, signToken } from '@/lib/auth'
import { withErrorHandling, withValidation } from '@/lib/api-wrapper'
import { registerSchema } from '@/lib/validations'
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
  withValidation(registerSchema)(async (req, data) => {
    await ensureCleanProductionData()
    const { name, email, password, role } = data
    const normalizedEmail = email.trim().toLowerCase()

    const existingUser = await prisma.user.findUnique({ where: { email: normalizedEmail } })
    if (existingUser) {
      return NextResponse.json({ error: 'البريد الإلكتروني مسجل بالفعل' }, { status: 400 })
    }

    const user = await prisma.user.create({
      data: {
        name: name.trim(),
        email: normalizedEmail,
        passwordHash: hashPassword(password),
        role: role || 'STUDENT',
        walletBalance: 500.0,
      },
    })

    const token = signToken({ userId: user.id, email: user.email, name: user.name, role: user.role })
    const response = NextResponse.json({ success: true, user: sanitizeUser(user), token })

    response.cookies.set('vu_auth_token', token, {
      httpOnly: true,
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
    })

    logger.info('User registered', { userId: user.id, email: user.email })
    return response
  })
)
