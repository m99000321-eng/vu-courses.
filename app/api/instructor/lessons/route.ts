import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAuthUser } from '@/lib/auth'

export async function POST(req: NextRequest) {
  try {
    const auth = getAuthUser(req)
    if (!auth) {
      return NextResponse.json({ error: 'غير مصرح' }, { status: 401 })
    }

    const body = await req.json()
    const { levelId, title, type, contentUrl, pdfUrl, textContent, duration } = body

    if (!levelId || !title || !type) {
      return NextResponse.json({ error: 'يرجى إدخال عنوان الدرس ونوعه' }, { status: 400 })
    }

    const level = await prisma.level.findUnique({
      where: { id: levelId },
      include: {
        course: true,
      },
    })

    if (!level || level.course.instructorId !== auth.userId) {
      return NextResponse.json({ error: 'غير مصرح لك بإضافة درس لهذا المستوى' }, { status: 403 })
    }

    const maxOrder = await prisma.lesson.count({
      where: { levelId },
    })

    const lesson = await prisma.lesson.create({
      data: {
        levelId,
        title,
        type,
        contentUrl: contentUrl || '',
        pdfUrl: pdfUrl || '',
        textContent: textContent || '',
        duration: duration || '15 دقيقة',
        order: maxOrder + 1,
      },
    })

    return NextResponse.json({ success: true, lesson })
  } catch (_error: any) {
    return NextResponse.json({ error: 'فشل إضافة الدرس' }, { status: 500 })
  }
}
