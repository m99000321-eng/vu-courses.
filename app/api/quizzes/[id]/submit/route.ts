import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAuthUser } from '@/lib/auth'

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const auth = getAuthUser(req)
    if (!auth) {
      return NextResponse.json({ error: 'غير مصرح' }, { status: 401 })
    }

    const quizId = params.id
    const { answers } = await req.json() // { questionId: selectedOption }

    const quiz = await prisma.quiz.findUnique({
      where: { id: quizId },
      include: {
        questions: true,
        lesson: {
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
        },
      },
    })

    if (!quiz) {
      return NextResponse.json({ error: 'الاختبار غير موجود' }, { status: 404 })
    }

    // Auto grading
    let correctCount = 0
    const totalQuestions = quiz.questions.length

    quiz.questions.forEach((q) => {
      const userAnswer = answers[q.id]
      if (userAnswer && userAnswer.toString().trim() === q.correctAnswer.toString().trim()) {
        correctCount++
      }
    })

    const scorePercent = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 100
    const passed = scorePercent >= quiz.passingScore

    // Create attempt
    await prisma.quizAttempt.create({
      data: {
        userId: auth.userId,
        quizId: quiz.id,
        score: scorePercent,
        passed,
        answersJson: JSON.stringify(answers),
      },
    })

    // If passed, mark quiz lesson as completed
    if (passed) {
      await prisma.lessonProgress.upsert({
        where: {
          userId_lessonId: {
            userId: auth.userId,
            lessonId: quiz.lessonId,
          },
        },
        update: { completed: true },
        create: {
          userId: auth.userId,
          lessonId: quiz.lessonId,
          completed: true,
        },
      })

      // Update course overall progress
      const course = quiz.lesson.level.course
      const allLessons = course.levels.flatMap((lvl) => lvl.lessons)
      const completedProgresses = await prisma.lessonProgress.findMany({
        where: {
          userId: auth.userId,
          completed: true,
          lessonId: { in: allLessons.map((l) => l.id) },
        },
      })
      const progressPercent = Math.round((completedProgresses.length / allLessons.length) * 100)

      await prisma.enrollment.upsert({
        where: {
          id: (
            await prisma.enrollment.findFirst({
              where: { userId: auth.userId, courseId: course.id },
            })
          )?.id || '',
        },
        update: { progressPercent },
        create: { userId: auth.userId, courseId: course.id, progressPercent },
      })

      // If course progress is 100%, generate certificate!
      let certCode = null
      if (progressPercent >= 100) {
        const certCodeStr = `VU-CERT-${Math.floor(100000 + Math.random() * 900000)}`
        const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${certCodeStr}`

        const existingCert = await prisma.certificate.findFirst({
          where: { userId: auth.userId, courseId: course.id },
        })

        if (!existingCert) {
          const cert = await prisma.certificate.create({
            data: {
              userId: auth.userId,
              courseId: course.id,
              certCode: certCodeStr,
              qrCodeUrl: qrUrl,
            },
          })
          certCode = cert.certCode

          // Send success notification
          await prisma.notification.create({
            data: {
              userId: auth.userId,
              title: '🎉 تهانينا! صدرت شهادة التخرج',
              message: `مبروك إكمال دورة ${course.title} كود الشهادة: ${certCodeStr}`,
              type: 'success',
            },
          })
        } else {
          certCode = existingCert.certCode
        }
      }

      return NextResponse.json({
        success: true,
        scorePercent,
        correctCount,
        totalQuestions,
        passed: true,
        certCode,
      })
    }

    return NextResponse.json({
      success: true,
      scorePercent,
      correctCount,
      totalQuestions,
      passed: false,
    })
  } catch (error: any) {
    console.error('Submit quiz error:', error)
    return NextResponse.json({ error: 'فشل تسليم الاختبار' }, { status: 500 })
  }
}
