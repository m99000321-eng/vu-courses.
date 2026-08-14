import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAuthUser } from '@/lib/auth'

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const auth = getAuthUser(req)
    if (!auth) {
      return NextResponse.json({ error: 'غير مصرح لك' }, { status: 401 })
    }

    const lessonId = params.id
    const { completed } = await req.json()

    // Find lesson and level
    const lesson = await prisma.lesson.findUnique({
      where: { id: lessonId },
      include: {
        level: {
          include: {
            course: {
              include: {
                levels: {
                  include: { lessons: true },
                },
              },
            },
          },
        },
      },
    })

    if (!lesson) {
      return NextResponse.json({ error: 'الدرس غير موجود' }, { status: 404 })
    }

    // Upsert lesson progress
    await prisma.lessonProgress.upsert({
      where: {
        userId_lessonId: {
          userId: auth.userId,
          lessonId,
        },
      },
      update: {
        completed: completed ?? true,
      },
      create: {
        userId: auth.userId,
        lessonId,
        completed: completed ?? true,
      },
    })

    // Calculate total course lessons & completed count
    const course = lesson.level.course
    const allLessons = course.levels.flatMap((lvl) => lvl.lessons)
    const totalLessons = allLessons.length

    const completedProgresses = await prisma.lessonProgress.findMany({
      where: {
        userId: auth.userId,
        completed: true,
        lessonId: { in: allLessons.map((l) => l.id) },
      },
    })

    const completedCount = completedProgresses.length
    const progressPercent = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 100

    // Update enrollment
    await prisma.enrollment.upsert({
      where: {
        id: (
          await prisma.enrollment.findFirst({
            where: { userId: auth.userId, courseId: course.id },
          })
        )?.id || '',
      },
      update: { progressPercent },
      create: {
        userId: auth.userId,
        courseId: course.id,
        progressPercent,
      },
    })

    return NextResponse.json({
      success: true,
      completed: true,
      progressPercent,
      completedCount,
      totalLessons,
    })
  } catch (error: any) {
    console.error('Progress update error:', error)
    return NextResponse.json({ error: 'فشل تحديث الإنجاز' }, { status: 500 })
  }
}
