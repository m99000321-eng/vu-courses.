import { NextRequest, NextResponse } from 'next/server'
import { getAuthUser } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  const auth = getAuthUser(req)
  if (!auth) {
    return NextResponse.json({ authenticated: false, user: null }, { status: 401 })
  }

  const user = await prisma.user.findUnique({
    where: { id: auth.userId },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      avatar: true,
      bio: true,
      walletBalance: true,
      createdAt: true,
    },
  })

  if (!user) {
    return NextResponse.json({ authenticated: false, user: null }, { status: 404 })
  }

  return NextResponse.json({ authenticated: true, user })
}
