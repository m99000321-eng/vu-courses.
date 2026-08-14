import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAuthUser } from '@/lib/auth'

export async function DELETE(req: NextRequest) {
  try {
    const auth = getAuthUser(req)
    if (!auth) {
      return NextResponse.json({ error: 'غير مصرح' }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'معرف الاختبار مطلوب' }, { status: 400 })
    }

    const quiz = await prisma.quiz.findUnique({
      where: { id },
      include: {
        lesson: {
          include: {
            level: {
              include: {
                course: true,
              },
            },
          },
        },
      },
    })

    if (!quiz || quiz.lesson.level.course.instructorId !== auth.userId) {
      return NextResponse.json({ error: 'غير مصرح لك بحذف هذا الاختبار' }, { status: 403 })
    }

    await prisma.quiz.delete({ where: { id } })

    return NextResponse.json({ success: true })
  } catch (_error: any) {
    console.error('Delete quiz error:', _error)
    return NextResponse.json({ error: 'فشل حذف الاختبار' }, { status: 500 })
  }
}

export async function GET(req: NextRequest) {
  try {
    const auth = getAuthUser(req)
    if (!auth) {
      return NextResponse.json({ error: 'غير مصرح' }, { status: 401 })
    }

    const courses = await prisma.course.findMany({
      where: { instructorId: auth.userId },
      select: { id: true },
    })

    const courseIds = courses.map((c) => c.id)

    const levels = await prisma.level.findMany({
      where: { courseId: { in: courseIds } },
      include: {
        lessons: {
          include: {
            quizzes: {
              include: { questions: true },
            },
          },
          orderBy: { order: 'asc' },
        },
      },
      orderBy: { levelNumber: 'asc' },
    })

    const quizzes = levels.flatMap((l) =>
      l.lessons.flatMap((lesson) => lesson.quizzes.map((quiz) => ({ ...quiz, lessonTitle: lesson.title, levelTitle: l.title })))
    )

    return NextResponse.json({ quizzes })
  } catch (_error: any) {
    return NextResponse.json({ error: 'فشل جلب الاختبارات' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const auth = getAuthUser(req)
    if (!auth) {
      return NextResponse.json({ error: 'غير مصرح' }, { status: 401 })
    }

    const body = await req.json()
    const { lessonId, title, passingScore, timeLimitMinutes } = body

    if (!lessonId || !title) {
      return NextResponse.json({ error: 'يرجى إدخال عنوان الاختبار ورقم الدرس' }, { status: 400 })
    }

    const lesson = await prisma.lesson.findUnique({
      where: { id: lessonId },
      include: {
        level: {
          include: {
            course: true,
          },
        },
      },
    })

    if (!lesson || lesson.level.course.instructorId !== auth.userId) {
      return NextResponse.json({ error: 'غير مصرح لك بإضافة اختبار لهذا الدرس' }, { status: 403 })
    }

    const quiz = await prisma.quiz.create({
      data: {
        lessonId,
        title,
        passingScore: passingScore || 70,
        timeLimitMinutes: timeLimitMinutes || 15,
      },
      include: { questions: true },
    })

    return NextResponse.json({ success: true, quiz })
  } catch (_error: any) {
    return NextResponse.json({ error: 'فشل إنشاء الاختبار' }, { status: 500 })
  }
}
