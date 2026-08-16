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
          select: { enrollments: true, courses: true, certificates: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({ users })
  } catch (error: any) {
    console.error('Admin users error:', error)
    return NextResponse.json({ error: 'فشل جلب قائمة المستخدمين' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const auth = getAuthUser(req)
    if (!auth || auth.role !== 'ADMIN') return NextResponse.json({ error: 'غير مصرح لك' }, { status: 403 })

    const { name, email, password, role, walletBalance } = await req.json()
    if (!name || !email || !password) return NextResponse.json({ error: 'البيانات الأساسية مطلوبة' }, { status: 400 })

    const normalizedEmail = String(email).trim().toLowerCase()
    const existing = await prisma.user.findUnique({ where: { email: normalizedEmail } })
    if (existing) return NextResponse.json({ error: 'البريد مسجل مسبقاً' }, { status: 400 })

    const user = await prisma.user.create({
      data: {
        name: String(name).trim(),
        email: normalizedEmail,
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
    if (!auth || auth.role !== 'ADMIN') return NextResponse.json({ error: 'غير مصرح' }, { status: 403 })

    const { id, role, walletBalance, name } = await req.json()
    if (!id) return NextResponse.json({ error: 'معرف المستخدم مطلوب' }, { status: 400 })
    if (id === auth.userId && role && role !== 'ADMIN') {
      return NextResponse.json({ error: 'لا يمكن تغيير دور حساب الإدارة الحالي' }, { status: 400 })
    }

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
    if (!auth || auth.role !== 'ADMIN') return NextResponse.json({ error: 'غير مصرح' }, { status: 403 })

    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')
    if (!id) return NextResponse.json({ error: 'معرف المستخدم مطلوب' }, { status: 400 })
    if (id === auth.userId) return NextResponse.json({ error: 'لا يمكن حذف حساب الإدارة الذي تستخدمه الآن' }, { status: 400 })

    const target = await prisma.user.findUnique({ where: { id }, select: { id: true, role: true } })
    if (!target) return NextResponse.json({ error: 'المستخدم غير موجود' }, { status: 404 })
    if (target.role === 'ADMIN') return NextResponse.json({ error: 'لا يمكن حذف حساب إدارة من هذه الصفحة' }, { status: 400 })

    await prisma.$transaction(async (tx) => {
      // Keep courses and their content intact when removing an instructor by transferring ownership to the current admin.
      if (target.role === 'INSTRUCTOR') {
        await tx.course.updateMany({ where: { instructorId: id }, data: { instructorId: auth.userId } })
      }

      await tx.message.deleteMany({ where: { OR: [{ senderId: id }, { receiverId: id }] } })
      await tx.lessonProgress.deleteMany({ where: { userId: id } })
      await tx.quizAttempt.deleteMany({ where: { userId: id } })
      await tx.enrollment.deleteMany({ where: { userId: id } })
      await tx.certificate.deleteMany({ where: { userId: id } })
      await tx.favorite.deleteMany({ where: { userId: id } })
      await tx.notification.deleteMany({ where: { userId: id } })
      await tx.payment.deleteMany({ where: { userId: id } })
      await tx.user.delete({ where: { id } })
    })

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Delete user error:', error)
    return NextResponse.json({ error: 'فشل حذف المستخدم. تأكد من عدم وجود بيانات مرتبطة غير مدعومة للحذف.' }, { status: 500 })
  }
}
