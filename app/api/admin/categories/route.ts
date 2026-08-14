import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAuthUser } from '@/lib/auth'

export async function GET(req: NextRequest) {
  try {
    const auth = getAuthUser(req)
    if (!auth || auth.role !== 'ADMIN') {
      return NextResponse.json({ error: 'غير مصرح' }, { status: 403 })
    }

    const categories = await prisma.category.findMany({
      orderBy: { name: 'asc' },
      include: {
        _count: { select: { courses: true } },
      },
    })

    return NextResponse.json({ categories })
  } catch (error: any) {
    console.error('Fetch categories error:', error)
    return NextResponse.json({ error: 'فشل جلب الأقسام' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const auth = getAuthUser(req)
    if (!auth || auth.role !== 'ADMIN') {
      return NextResponse.json({ error: 'غير مصرح' }, { status: 403 })
    }

    const { name, description } = await req.json()

    if (!name) {
      return NextResponse.json({ error: 'اسم القسم مطلوب' }, { status: 400 })
    }

    const category = await prisma.category.create({
      data: { name, description: description || '' },
    })

    return NextResponse.json({ success: true, category })
  } catch (error: any) {
    console.error('Create category error:', error)
    return NextResponse.json({ error: 'فشل إنشاء القسم' }, { status: 500 })
  }
}

export async function PUT(req: NextRequest) {
  try {
    const auth = getAuthUser(req)
    if (!auth || auth.role !== 'ADMIN') {
      return NextResponse.json({ error: 'غير مصرح' }, { status: 403 })
    }

    const { id, name, description } = await req.json()

    const category = await prisma.category.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(description !== undefined && { description }),
      },
    })

    return NextResponse.json({ success: true, category })
  } catch (error: any) {
    console.error('Update category error:', error)
    return NextResponse.json({ error: 'فشل تحديث القسم' }, { status: 500 })
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
      return NextResponse.json({ error: 'معرف القسم مطلوب' }, { status: 400 })
    }

    await prisma.category.delete({ where: { id } })

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Delete category error:', error)
    return NextResponse.json({ error: 'فشل حذف القسم' }, { status: 500 })
  }
}
