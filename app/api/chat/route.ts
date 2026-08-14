import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAuthUser } from '@/lib/auth'

export async function GET(req: NextRequest) {
  try {
    const auth = getAuthUser(req)
    if (!auth) {
      return NextResponse.json({ error: 'غير مصرح' }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const withUserId = searchParams.get('withUserId')

    if (withUserId) {
      // Get chat thread between auth.userId and withUserId
      const messages = await prisma.message.findMany({
        where: {
          OR: [
            { senderId: auth.userId, receiverId: withUserId },
            { senderId: withUserId, receiverId: auth.userId },
          ],
        },
        orderBy: { createdAt: 'asc' },
      })
      return NextResponse.json({ messages })
    }

    // Get list of recent contacts / users to message
    const users = await prisma.user.findMany({
      where: {
        id: { not: auth.userId },
      },
      select: {
        id: true,
        name: true,
        role: true,
        avatar: true,
      },
    })

    return NextResponse.json({ contacts: users })
  } catch (error: any) {
    console.error('Fetch chat error:', error)
    return NextResponse.json({ error: 'فشل جلب الرسائل' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const auth = getAuthUser(req)
    if (!auth) {
      return NextResponse.json({ error: 'غير مصرح' }, { status: 401 })
    }

    const { receiverId, content } = await req.json()

    if (!receiverId || !content) {
      return NextResponse.json({ error: 'محتوى الرسالة والمستلم مطلوبان' }, { status: 400 })
    }

    const message = await prisma.message.create({
      data: {
        senderId: auth.userId,
        receiverId,
        content,
      },
    })

    // Also trigger a notification for the receiver
    await prisma.notification.create({
      data: {
        userId: receiverId,
        title: `رسالة جديدة من ${auth.name}`,
        message: content.length > 40 ? content.slice(0, 40) + '...' : content,
        type: 'message',
      },
    })

    return NextResponse.json({ success: true, message })
  } catch (error: any) {
    console.error('Send message error:', error)
    return NextResponse.json({ error: 'فشل إرسال الرسالة' }, { status: 500 })
  }
}
