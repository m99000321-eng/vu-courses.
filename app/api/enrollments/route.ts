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
    const targetUserId = searchParams.get('userId')

    const isAdminOrInstructor = auth.role === 'ADMIN' || auth.role === 'INSTRUCTOR'
    const whereClause: any = {}
    if (targetUserId && isAdminOrInstructor) {
      whereClause.userId = targetUserId
    } else {
      whereClause.userId = auth.userId
    }

    const enrollments = await prisma.enrollment.findMany({
      where: whereClause,
      include: {
        course: {
          include: {
            instructor: { select: { name: true, avatar: true } },
            category: true,
            levels: {
              include: {
                lessons: true,
              },
            },
          },
        },
      },
      orderBy: { enrolledAt: 'desc' },
    })

    return NextResponse.json({ enrollments })
  } catch (error: any) {
    console.error('Fetch enrollments error:', error)
    return NextResponse.json({ error: 'فشل جلب التسجيلات' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const auth = getAuthUser(req)
    if (!auth || auth.role !== 'STUDENT') {
      return NextResponse.json({ error: 'غير مصرح لك بالتسجيل في الدورة' }, { status: 403 })
    }

    const { courseId } = await req.json()
    if (!courseId) {
      return NextResponse.json({ error: 'معرف الدورة مطلوب' }, { status: 400 })
    }

    const course = await prisma.course.findUnique({
      where: { id: courseId },
      select: { id: true, price: true, title: true },
    })

    if (!course) {
      return NextResponse.json({ error: 'الدورة غير موجودة' }, { status: 404 })
    }

    const student = await prisma.user.findUnique({
      where: { id: auth.userId },
      select: { id: true, walletBalance: true },
    })

    if (!student) {
      return NextResponse.json({ error: 'المستخدم غير موجود' }, { status: 404 })
    }

    const price = course.price || 0
    if (student.walletBalance < price) {
      return NextResponse.json({ error: 'رصيد غير كافٍ لشراء الدورة' }, { status: 400 })
    }

    const enrollment = await prisma.$transaction(async (tx) => {
      await tx.user.update({
        where: { id: auth.userId },
        data: { walletBalance: { decrement: price } },
      })

      return tx.enrollment.create({
        data: {
          userId: auth.userId,
          courseId: course.id,
        },
        include: {
          course: true,
        },
      })
    })

    return NextResponse.json({ success: true, enrollment })
  } catch (error: any) {
    console.error('Enrollment error:', error)
    return NextResponse.json({ error: 'فشل تسجيل الدورة' }, { status: 500 })
  }
}
