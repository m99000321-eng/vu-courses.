import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAuthUser } from '@/lib/auth'

const mockPlans = [
  { id: 'plan-1', name: 'الخطة الأساسية', price: 199, durationDays: 30, features: 'دخول لجميع الدورات الأساسية', active: true },
  { id: 'plan-2', name: 'الخطة المتقدمة', price: 399, durationDays: 30, features: 'دخول لجميع الدورات + شهادات موثقة', active: true },
  { id: 'plan-3', name: 'الخطة الاحترافية', price: 699, durationDays: 90, features: 'كل شيء + دعم مباشر + مشاريع عملية', active: true },
]

const mockSubscriptions = [
  { id: 'sub-1', userId: 'user-1', userName: 'أحمد محمد', planId: 'plan-2', planName: 'الخطة المتقدمة', status: 'ACTIVE', startDate: '2026-07-01', endDate: '2026-08-01' },
  { id: 'sub-2', userId: 'user-2', userName: 'سارة علي', planId: 'plan-1', planName: 'الخطة الأساسية', status: 'ACTIVE', startDate: '2026-07-15', endDate: '2026-08-15' },
  { id: 'sub-3', userId: 'user-3', userName: 'محمد خالد', planId: 'plan-3', planName: 'الخطة الاحترافية', status: 'EXPIRED', startDate: '2026-06-01', endDate: '2026-07-01' },
]

export async function GET(req: NextRequest) {
  try {
    const auth = getAuthUser(req)
    if (!auth || auth.role !== 'ADMIN') {
      return NextResponse.json({ error: 'غير مصرح' }, { status: 403 })
    }

    const { searchParams } = new URL(req.url)
    const type = searchParams.get('type') || 'all'

    if (type === 'plans') {
      return NextResponse.json({ plans: mockPlans })
    }
    if (type === 'subscriptions') {
      const users = await prisma.user.findMany({
        select: { id: true, name: true, email: true, walletBalance: true },
      })
      const enrichedSubs = mockSubscriptions.map((sub) => {
        const user = users.find((u) => u.id === sub.userId)
        return { ...sub, userEmail: user?.email || '' }
      })
      return NextResponse.json({ subscriptions: enrichedSubs })
    }

    return NextResponse.json({ plans: mockPlans, subscriptions: mockSubscriptions })
  } catch (error: any) {
    console.error('Fetch subscriptions error:', error)
    return NextResponse.json({ error: 'فشل جلب بيانات الاشتراكات' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const auth = getAuthUser(req)
    if (!auth || auth.role !== 'ADMIN') {
      return NextResponse.json({ error: 'غير مصرح' }, { status: 403 })
    }

    const body = await req.json()
    const { name, price, durationDays, features } = body

    if (!name || !price) {
      return NextResponse.json({ error: 'اسم الخطة والسعر مطلوبان' }, { status: 400 })
    }

    const newPlan = {
      id: `plan-${Date.now()}`,
      name,
      price: parseFloat(price),
      durationDays: parseInt(durationDays) || 30,
      features: features || '',
      active: true,
    }

    mockPlans.push(newPlan)

    return NextResponse.json({ success: true, plan: newPlan })
  } catch (error: any) {
    console.error('Create plan error:', error)
    return NextResponse.json({ error: 'فشل إنشاء الخطة' }, { status: 500 })
  }
}

export async function PUT(req: NextRequest) {
  try {
    const auth = getAuthUser(req)
    if (!auth || auth.role !== 'ADMIN') {
      return NextResponse.json({ error: 'غير مصرح' }, { status: 403 })
    }

    const body = await req.json()
    const { id, name, price, durationDays, features, active } = body

    const planIndex = mockPlans.findIndex((p) => p.id === id)
    if (planIndex === -1) {
      return NextResponse.json({ error: 'الخطة غير موجودة' }, { status: 404 })
    }

    mockPlans[planIndex] = {
      ...mockPlans[planIndex],
      ...(name && { name }),
      ...(price && { price: parseFloat(price) }),
      ...(durationDays && { durationDays: parseInt(durationDays) }),
      ...(features && { features }),
      ...(active !== undefined && { active }),
    }

    return NextResponse.json({ success: true, plan: mockPlans[planIndex] })
  } catch (error: any) {
    console.error('Update plan error:', error)
    return NextResponse.json({ error: 'فشل تحديث الخطة' }, { status: 500 })
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
      return NextResponse.json({ error: 'معرف الخطة مطلوب' }, { status: 400 })
    }

    const planIndex = mockPlans.findIndex((p) => p.id === id)
    if (planIndex === -1) {
      return NextResponse.json({ error: 'الخطة غير موجودة' }, { status: 404 })
    }

    mockPlans.splice(planIndex, 1)

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Delete plan error:', error)
    return NextResponse.json({ error: 'فشل حذف الخطة' }, { status: 500 })
  }
}
