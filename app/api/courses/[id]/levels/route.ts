import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAuthUser } from '@/lib/auth'

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const auth = getAuthUser(req)
    if (!auth || (auth.role !== 'ADMIN' && auth.role !== 'INSTRUCTOR')) {
      return NextResponse.json({ error: 'غير مصرح لك بإضافة مستويات.' }, { status: 403 })
    }

    const courseId = params.id
    const body = await req.json()
    const { title, description } = body

    const existingCount = await prisma.level.count({
      where: { courseId },
    })

    const nextLevelNumber = existingCount + 1

    const newLevel = await prisma.level.create({
      data: {
        courseId,
        levelNumber: nextLevelNumber,
        title: title || `Level ${nextLevelNumber}: المستوى الجديد`,
        description: description || 'محتويات وتمارين جديدة لهذا المستوى.',
        lessons: {
          create: [
            {
              title: `فيديو توضيحي Level ${nextLevelNumber}`,
              type: 'VIDEO',
              contentUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
              duration: '15 دقيقة',
              order: 1,
            },
            {
              title: `دليل وموارد PDF Level ${nextLevelNumber}`,
              type: 'PDF',
              pdfUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
              textContent: 'ملف توثيقي مدمج يستعرض الشرح النظري لهذا المستوى.',
              duration: '10 دقائق',
              order: 2,
            },
            {
              title: `اختبار تقييم Level ${nextLevelNumber}`,
              type: 'TEST',
              duration: '15 دقيقة',
              order: 3,
            },
          ],
        },
      },
      include: {
        lessons: true,
      },
    })

    const testLesson = newLevel.lessons.find((l) => l.type === 'TEST')
    if (testLesson) {
      const quiz = await prisma.quiz.create({
        data: {
          lessonId: testLesson.id,
          title: `اختبار Level ${nextLevelNumber}`,
          passingScore: 70,
          timeLimitMinutes: 15,
        },
      })
      await prisma.question.create({
        data: {
          quizId: quiz.id,
          questionText: `سؤال تقييمي للمستوى ${nextLevelNumber}: هل استوعبت المفاهيم الأساسية؟`,
          type: 'MULTIPLE_CHOICE',
          optionsJson: JSON.stringify(['نعم، بشكل كامل', 'نعم، أحتاج مراجعة بسيطة', 'لا، أرغب بإعادة الشرح']),
          correctAnswer: 'نعم، بشكل كامل',
        },
      })
    }

    return NextResponse.json({ success: true, level: newLevel })
  } catch (error: any) {
    console.error('Create level error:', error)
    return NextResponse.json({ error: 'فشل إضافة المستوى' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const auth = getAuthUser(req)
    if (!auth || auth.role !== 'ADMIN') {
      return NextResponse.json({ error: 'غير مصرح لك بحذف مستويات. يرجى تسجيل الدخول كأدمن.' }, { status: 403 })
    }

    const courseId = params.id
    const body = await req.json()
    const { levelId } = body

    if (!levelId) {
      return NextResponse.json({ error: 'يجب تحديد المستوى المراد حذفه' }, { status: 400 })
    }

    const level = await prisma.level.findUnique({
      where: { id: levelId },
      select: { courseId: true },
    })

    if (!level || level.courseId !== courseId) {
      return NextResponse.json({ error: 'المستوى غير موجود في هذه الدورة' }, { status: 404 })
    }

    await prisma.level.delete({
      where: { id: levelId },
    })

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Delete level error:', error)
    return NextResponse.json({ error: 'فشل حذف المستوى' }, { status: 500 })
  }
}
