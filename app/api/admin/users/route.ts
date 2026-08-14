import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAuthUser, hashPassword } from '@/lib/auth'

export async function GET(req: NextRequest) {
  try {
    const auth = getAuthUser(req)
    if (!auth || auth.role !== 'ADMIN') {
      return NextResponse.json({ error: 'غير مصرح لك للوصول للوحة التحكم الكاملة' }, { status: 403 })
    }

    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        walletBalance: true,
        avatar: true,
        createdAt: true,
        _count: {
          select: {
            enrollments: true,
            courses: true,
            certificates: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({ users })
  } catch (_error: any) {
    console.error('Admin users error:', _error)
    return NextResponse.json({ error: 'فشل جلب قائمة المستخدمين' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const auth = getAuthUser(req)
    if (!auth || auth.role !== 'ADMIN') {
      return NextResponse.json({ error: 'غير مصرح لك' }, { status: 403 })
    }

    const { name, email, password, role, walletBalance } = await req.json()

    if (!name || !email || !password) {
      return NextResponse.json({ error: 'البيانات الأساسية مطلوبة' }, { status: 400 })
    }

    const existing = await prisma.user.findUnique({ where: { email } })
    if (existing) {
      return NextResponse.json({ error: 'البريد مسجل مسبقاً' }, { status: 400 })
    }

    const user = await prisma.user.create({
      data: {
        name,
        email,
        passwordHash: hashPassword(password),
        role: role as string,
        walletBalance: parseFloat(walletBalance) || 500,
      },
    })

    return NextResponse.json({ success: true, user })
  } catch (_error: any) {
    return NextResponse.json({ error: 'فشل إضافة المستخدم' }, { status: 500 })
  }
}

export async function PUT(req: NextRequest) {
  try {
    const auth = getAuthUser(req)
    if (!auth || auth.role !== 'ADMIN') {
      return NextResponse.json({ error: 'غير مصرح' }, { status: 403 })
    }

    const { id, role, walletBalance, name } = await req.json()

    const updatedUser = await prisma.user.update({
      where: { id },
      data: {
        ...(role && { role: role as string }),
        ...(walletBalance !== undefined && { walletBalance: parseFloat(walletBalance) }),
        ...(name && { name }),
      },
    })

    return NextResponse.json({ success: true, user: updatedUser })
  } catch (_error: any) {
    return NextResponse.json({ error: 'فشل تعديل بيانات المستخدم' }, { status: 500 })
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
      return NextResponse.json({ error: 'معرف المستخدم مطلوب' }, { status: 400 })
    }

    await prisma.user.delete({
      where: { id },
    })

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Delete user error:', error)
    return NextResponse.json({ error: 'فشل حذف المستخدم' }, { status: 500 })
  }
}
