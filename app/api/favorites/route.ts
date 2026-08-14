import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAuthUser } from '@/lib/auth'

export async function GET(req: NextRequest) {
  try {
    const auth = getAuthUser(req)
    if (!auth) {
      return NextResponse.json({ error: 'غير مصرح' }, { status: 401 })
    }

    const favorites = await prisma.favorite.findMany({
      where: { userId: auth.userId },
      include: {
        course: {
          include: {
            instructor: { select: { name: true, avatar: true } },
            category: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({ favorites })
  } catch (error: any) {
    console.error('Fetch favorites error:', error)
    return NextResponse.json({ error: 'فشل جلب المفضلة' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const auth = getAuthUser(req)
    if (!auth) {
      return NextResponse.json({ error: 'غير مصرح' }, { status: 401 })
    }

    const { courseId } = await req.json()
    if (!courseId) {
      return NextResponse.json({ error: 'معرف الكورس مطلوب' }, { status: 400 })
    }

    const existing = await prisma.favorite.findUnique({
      where: {
        userId_courseId: {
          userId: auth.userId,
          courseId,
        },
      },
    })

    if (existing) {
      await prisma.favorite.delete({
        where: { id: existing.id },
      })
      return NextResponse.json({ success: true, favorited: false })
    } else {
      await prisma.favorite.create({
        data: {
          userId: auth.userId,
          courseId,
        },
      })
      return NextResponse.json({ success: true, favorited: true })
    }
  } catch (error: any) {
    console.error('Toggle favorite error:', error)
    return NextResponse.json({ error: 'فشل تحديث المفضلة' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const auth = getAuthUser(req)
    if (!auth) {
      return NextResponse.json({ error: 'غير مصرح' }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const courseId = searchParams.get('courseId')

    if (!courseId) {
      return NextResponse.json({ error: 'معرف الكورس مطلوب' }, { status: 400 })
    }

    await prisma.favorite.deleteMany({
      where: {
        userId: auth.userId,
        courseId,
      },
    })

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Remove favorite error:', error)
    return NextResponse.json({ error: 'فشل حذف من المفضلة' }, { status: 500 })
  }
}
