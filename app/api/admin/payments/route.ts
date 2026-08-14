import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAuthUser } from '@/lib/auth'

export async function GET(req: NextRequest) {
  try {
    const auth = getAuthUser(req)
    if (!auth || auth.role !== 'ADMIN') {
      return NextResponse.json({ error: 'غير مصرح' }, { status: 403 })
    }

    const { searchParams } = new URL(req.url)
    const status = searchParams.get('status') || ''
    const userId = searchParams.get('userId') || ''
    const startDate = searchParams.get('startDate') || ''
    const endDate = searchParams.get('endDate') || ''

    const whereClause: any = {}
    if (status) whereClause.status = status
    if (userId) whereClause.userId = userId
    if (startDate || endDate) {
      whereClause.createdAt = {}
      if (startDate) whereClause.createdAt.gte = new Date(startDate)
      if (endDate) whereClause.createdAt.lte = new Date(endDate)
    }

    const payments = await prisma.payment.findMany({
      where: whereClause,
      include: {
        user: {
          select: { id: true, name: true, email: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({ payments })
  } catch (error: any) {
    console.error('Fetch payments error:', error)
    return NextResponse.json({ error: 'فشل جلب المدفوعات' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const auth = getAuthUser(req)
    if (!auth || auth.role !== 'ADMIN') {
      return NextResponse.json({ error: 'غير مصرح' }, { status: 403 })
    }

    const { userId, amount, paymentMethod, description } = await req.json()

    if (!userId || !amount) {
      return NextResponse.json({ error: 'المستخدم والمبلغ مطلوبان' }, { status: 400 })
    }

    const payment = await prisma.payment.create({
      data: {
        userId,
        amount: parseFloat(amount),
        paymentMethod: paymentMethod || 'WALLET',
        description: description || 'دفعة يدوية من الأدمن',
      },
      include: {
        user: {
          select: { id: true, name: true, email: true },
        },
      },
    })

    return NextResponse.json({ success: true, payment })
  } catch (error: any) {
    console.error('Create payment error:', error)
    return NextResponse.json({ error: 'فشل إنشاء الدفعة' }, { status: 500 })
  }
}
