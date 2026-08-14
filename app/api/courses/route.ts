import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAuthUser } from '@/lib/auth'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const query = searchParams.get('q') || ''
    const category = searchParams.get('category') || ''
    const level = searchParams.get('level') || ''

    const whereClause: any = {}
    if (query) {
      whereClause.OR = [
        { title: { contains: query } },
        { description: { contains: query } },
      ]
    }
    if (category) {
      whereClause.categoryId = category
    }

    const courses = await prisma.course.findMany({
      where: whereClause,
      include: {
        instructor: {
          select: { id: true, name: true, avatar: true },
        },
        category: true,
        levels: {
          orderBy: { levelNumber: 'asc' },
          include: {
            lessons: {
              orderBy: { order: 'asc' },
              include: {
                quizzes: {
                  include: { questions: true },
                },
              },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({ courses })
  } catch (error: any) {
    console.error('Fetch courses error:', error)
    return NextResponse.json({ error: 'فشل جلب الكورسات' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const auth = getAuthUser(req)
    if (!auth || (auth.role !== 'INSTRUCTOR' && auth.role !== 'ADMIN')) {
      return NextResponse.json({ error: 'غير مصرح لك بإضافة دورة تعليمية' }, { status: 403 })
    }

    const body = await req.json()
    const { title, description, categoryId, price, duration, thumbnail } = body

    if (!title || !description) {
      return NextResponse.json({ error: 'يرجى إدخال عنوان الدورة والوصف' }, { status: 400 })
    }

    const course = await prisma.course.create({
      data: {
        title,
        description,
        categoryId: categoryId || null,
        instructorId: auth.userId,
        price: parseFloat(price) || 0,
        duration: duration || '10 ساعات',
        thumbnail: thumbnail || 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&auto=format&fit=crop&q=80',
        levels: {
          create: [
            {
              levelNumber: 1,
              title: 'Level 1: المقدمة والأساسيات',
              description: 'مستوى التأسيس والوسائط المبدئية',
            },
          ],
        },
      },
      include: {
        levels: true,
      },
    })

    return NextResponse.json({ success: true, course })
  } catch (error: any) {
    console.error('Create course error:', error)
    return NextResponse.json({ error: 'حدث خطأ أثناء إنتاج الكورس' }, { status: 500 })
  }
}
