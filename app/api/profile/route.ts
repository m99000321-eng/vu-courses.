import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAuthUser } from '@/lib/auth'

export async function GET(req: NextRequest) {
  try {
    const auth = getAuthUser(req)
    if (!auth) {
      return NextResponse.json({ error: 'غير مصرح' }, { status: 401 })
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

    return NextResponse.json({ user })
  } catch (error: any) {
    console.error('Fetch profile error:', error)
    return NextResponse.json({ error: 'فشل جلب الملف الشخصي' }, { status: 500 })
  }
}

export async function PUT(req: NextRequest) {
  try {
    const auth = getAuthUser(req)
    if (!auth) {
      return NextResponse.json({ error: 'غير مصرح' }, { status: 401 })
    }

    const { name, bio } = await req.json()

    const user = await prisma.user.update({
      where: { id: auth.userId },
      data: {
        ...(name && { name }),
        ...(bio !== undefined && { bio }),
      },
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

    return NextResponse.json({ success: true, user })
  } catch (error: any) {
    console.error('Update profile error:', error)
    return NextResponse.json({ error: 'فشل تحديث الملف الشخصي' }, { status: 500 })
  }
}
