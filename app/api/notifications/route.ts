import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAuthUser } from '@/lib/auth'

export async function GET(req: NextRequest) {
  try {
    const auth = getAuthUser(req)
    if (!auth) {
      return NextResponse.json({ error: 'غير مصرح' }, { status: 401 })
    }

    const notifications = await prisma.notification.findMany({
      where: { userId: auth.userId },
      orderBy: { createdAt: 'desc' },
      take: 20,
    })

    const unreadCount = await prisma.notification.count({
      where: { userId: auth.userId, read: false },
    })

    return NextResponse.json({ notifications, unreadCount })
  } catch (_error: any) {
    console.error('Fetch notifications error:', _error)
    return NextResponse.json({ error: 'فشل جلب الإشعارات' }, { status: 500 })
  }
}

export async function PUT(req: NextRequest) {
  try {
    const auth = getAuthUser(req)
    if (!auth) return NextResponse.json({ error: 'غير مصرح' }, { status: 401 })

    await prisma.notification.updateMany({
      where: { userId: auth.userId, read: false },
      data: { read: true },
    })

    return NextResponse.json({ success: true })
  } catch (_error: any) {
    return NextResponse.json({ error: 'فشل تحديث الإشعارات' }, { status: 500 })
  }
}
