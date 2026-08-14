import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAuthUser } from '@/lib/auth'

export async function GET(req: NextRequest) {
  try {
    const auth = getAuthUser(req)
    if (!auth || auth.role !== 'ADMIN') {
      return NextResponse.json({ error: 'غير مصرح' }, { status: 403 })
    }

    const quizzes = await prisma.quiz.findMany({
      include: {
        lesson: {
          include: {
            level: {
              include: {
                course: { select: { id: true, title: true } },
              },
            },
          },
        },
        _count: { select: { questions: true, attempts: true } },
      },
      orderBy: { id: 'desc' },
    })

    return NextResponse.json({ quizzes })
  } catch (error: any) {
    console.error('Fetch quizzes error:', error)
    return NextResponse.json({ error: 'فشل جلب الاختبارات' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const auth = getAuthUser(req)
    if (!auth || auth.role !== 'ADMIN') {
      return NextResponse.json({ error: 'غير مصرح' }, { status: 403 })
    }

    const { lessonId, title, passingScore, timeLimitMinutes } = await req.json()

    if (!lessonId || !title) {
      return NextResponse.json({ error: 'الدرس والعنوان مطلوبان' }, { status: 400 })
    }

    const quiz = await prisma.quiz.create({
      data: {
        lessonId,
        title,
        passingScore: parseInt(passingScore) || 70,
        timeLimitMinutes: parseInt(timeLimitMinutes) || 15,
      },
      include: {
        lesson: {
          include: {
            level: { include: { course: { select: { id: true, title: true } } } },
          },
        },
      },
    })

    return NextResponse.json({ success: true, quiz })
  } catch (error: any) {
    console.error('Create quiz error:', error)
    return NextResponse.json({ error: 'فشل إنشاء الاختبار' }, { status: 500 })
  }
}

export async function PUT(req: NextRequest) {
  try {
    const auth = getAuthUser(req)
    if (!auth || auth.role !== 'ADMIN') {
      return NextResponse.json({ error: 'غير مصرح' }, { status: 403 })
    }

    const { id, title, passingScore, timeLimitMinutes } = await req.json()

    const quiz = await prisma.quiz.update({
      where: { id },
      data: {
        ...(title && { title }),
        ...(passingScore && { passingScore: parseInt(passingScore) }),
        ...(timeLimitMinutes && { timeLimitMinutes: parseInt(timeLimitMinutes) }),
      },
      include: {
        lesson: {
          include: {
            level: { include: { course: { select: { id: true, title: true } } } },
          },
        },
      },
    })

    return NextResponse.json({ success: true, quiz })
  } catch (error: any) {
    console.error('Update quiz error:', error)
    return NextResponse.json({ error: 'فشل تحديث الاختبار' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const auth = getAuthUser(req)
    if (!auth || auth.role !== 'ADMIN') {
      return NextResponse.json({ error: 'غير مصرح' }, { status: 403 })
    }

    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'معرف الاختبار مطلوب' }, { status: 400 })
    }

    await prisma.quiz.delete({ where: { id } })

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Delete quiz error:', error)
    return NextResponse.json({ error: 'فشل حذف الاختبار' }, { status: 500 })
  }
}
