import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAuthUser } from '@/lib/auth'

export async function GET(req: NextRequest) {
  try {
    const auth = getAuthUser(req)
    if (!auth || auth.role !== 'ADMIN') {
      return NextResponse.json({ error: 'غير مصرح' }, { status: 403 })
    }

    const levels = await prisma.level.findMany({
      include: {
        course: {
          select: { id: true, title: true, instructor: { select: { name: true } } },
        },
        lessons: true,
        _count: { select: { lessons: true } },
      },
      orderBy: [{ courseId: 'asc' }, { levelNumber: 'asc' }],
    })

    return NextResponse.json({ levels })
  } catch (error: any) {
    console.error('Fetch levels error:', error)
    return NextResponse.json({ error: 'فشل جلب المستويات' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const auth = getAuthUser(req)
    if (!auth || auth.role !== 'ADMIN') {
      return NextResponse.json({ error: 'غير مصرح' }, { status: 403 })
    }

    const { courseId, title, levelNumber, description } = await req.json()

    if (!courseId || !title) {
      return NextResponse.json({ error: 'الدورة والعنوان مطلوبان' }, { status: 400 })
    }

    const level = await prisma.level.create({
      data: { courseId, title, levelNumber: parseInt(levelNumber) || 1, description: description || '' },
      include: { course: { select: { id: true, title: true } } },
    })

    return NextResponse.json({ success: true, level })
  } catch (error: any) {
    console.error('Create level error:', error)
    return NextResponse.json({ error: 'فشل إنشاء المستوى' }, { status: 500 })
  }
}

export async function PUT(req: NextRequest) {
  try {
    const auth = getAuthUser(req)
    if (!auth || auth.role !== 'ADMIN') {
      return NextResponse.json({ error: 'غير مصرح' }, { status: 403 })
    }

    const { id, title, levelNumber, description } = await req.json()

    const level = await prisma.level.update({
      where: { id },
      data: {
        ...(title && { title }),
        ...(levelNumber && { levelNumber: parseInt(levelNumber) }),
        ...(description !== undefined && { description }),
      },
      include: { course: { select: { id: true, title: true } } },
    })

    return NextResponse.json({ success: true, level })
  } catch (error: any) {
    console.error('Update level error:', error)
    return NextResponse.json({ error: 'فشل تحديث المستوى' }, { status: 500 })
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
      return NextResponse.json({ error: 'معرف المستوى مطلوب' }, { status: 400 })
    }

    await prisma.level.delete({ where: { id } })

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Delete level error:', error)
    return NextResponse.json({ error: 'فشل حذف المستوى' }, { status: 500 })
  }
}
