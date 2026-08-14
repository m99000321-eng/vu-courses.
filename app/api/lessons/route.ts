import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAuthUser } from '@/lib/auth'

export async function GET(req: NextRequest) {
  try {
    const auth = getAuthUser(req)
    if (!auth) {
      return NextResponse.json({ error: 'غير مصرح' }, { status: 403 })
    }

    const lessons = await prisma.lesson.findMany({
      include: {
        level: {
          include: {
            course: { select: { id: true, title: true } },
          },
        },
        quizzes: true,
        _count: { select: { progress: true } },
      },
      orderBy: [{ levelId: 'asc' }, { order: 'asc' }],
    })

    return NextResponse.json({ lessons })
  } catch (error: any) {
    console.error('Fetch lessons error:', error)
    return NextResponse.json({ error: 'فشل جلب الدروس' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const auth = getAuthUser(req)
    if (!auth) {
      return NextResponse.json({ error: 'غير مصرح' }, { status: 403 })
    }

    const { levelId, title, type, contentUrl, pdfUrl, textContent, duration, order } = await req.json()

    if (!levelId || !title) {
      return NextResponse.json({ error: 'المستوى والعنوان مطلوبان' }, { status: 400 })
    }

    const level = await prisma.level.findUnique({
      where: { id: levelId },
      include: { course: true },
    })

    if (!level) {
      return NextResponse.json({ error: 'المستوى غير موجود' }, { status: 404 })
    }

    if (auth.role !== 'ADMIN' && level.course.instructorId !== auth.userId) {
      return NextResponse.json({ error: 'غير مصرح لك بإضافة درس لهذا المستوى' }, { status: 403 })
    }

    const maxOrder = await prisma.lesson.count({ where: { levelId } })

    const lesson = await prisma.lesson.create({
      data: {
        levelId,
        title,
        type: type || 'VIDEO',
        contentUrl: contentUrl || '',
        pdfUrl: pdfUrl || '',
        textContent: textContent || '',
        duration: duration || '15 دقيقة',
        order: order ?? maxOrder + 1,
      },
      include: {
        level: { include: { course: { select: { id: true, title: true } } } },
      },
    })

    return NextResponse.json({ success: true, lesson })
  } catch (error: any) {
    console.error('Create lesson error:', error)
    return NextResponse.json({ error: 'فشل إنشاء الدرس' }, { status: 500 })
  }
}

export async function PUT(req: NextRequest) {
  try {
    const auth = getAuthUser(req)
    if (!auth) {
      return NextResponse.json({ error: 'غير مصرح' }, { status: 403 })
    }

    const { id, title, type, contentUrl, pdfUrl, textContent, duration, order } = await req.json()

    const lesson = await prisma.lesson.findUnique({
      where: { id },
      include: { level: { include: { course: true } } },
    })

    if (!lesson) {
      return NextResponse.json({ error: 'الدرس غير موجود' }, { status: 404 })
    }

    if (auth.role !== 'ADMIN' && lesson.level.course.instructorId !== auth.userId) {
      return NextResponse.json({ error: 'غير مصرح لك بتعديل هذا الدرس' }, { status: 403 })
    }

    const updated = await prisma.lesson.update({
      where: { id },
      data: {
        ...(title && { title }),
        ...(type && { type }),
        ...(contentUrl !== undefined && { contentUrl }),
        ...(pdfUrl !== undefined && { pdfUrl }),
        ...(textContent !== undefined && { textContent }),
        ...(duration && { duration }),
        ...(order && { order: parseInt(order) }),
      },
      include: {
        level: { include: { course: { select: { id: true, title: true } } } },
      },
    })

    return NextResponse.json({ success: true, lesson: updated })
  } catch (error: any) {
    console.error('Update lesson error:', error)
    return NextResponse.json({ error: 'فشل تحديث الدرس' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const auth = getAuthUser(req)
    if (!auth) {
      return NextResponse.json({ error: 'غير مصرح' }, { status: 403 })
    }

    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'معرف الدرس مطلوب' }, { status: 400 })
    }

    const lesson = await prisma.lesson.findUnique({
      where: { id },
      include: { level: { include: { course: true } } },
    })

    if (!lesson) {
      return NextResponse.json({ error: 'الدرس غير موجود' }, { status: 404 })
    }

    if (auth.role !== 'ADMIN' && lesson.level.course.instructorId !== auth.userId) {
      return NextResponse.json({ error: 'غير مصرح لك بحذف هذا الدرس' }, { status: 403 })
    }

    await prisma.lesson.delete({ where: { id } })

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Delete lesson error:', error)
    return NextResponse.json({ error: 'فشل حذف الدرس' }, { status: 500 })
  }
}
