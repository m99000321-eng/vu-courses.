import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAuthUser } from '@/lib/auth'

export async function POST(req: NextRequest) {
  try {
    const auth = getAuthUser(req)
    if (!auth || auth.role !== 'STUDENT') {
      return NextResponse.json({ error: 'غير مصرح لك بالوصول' }, { status: 403 })
    }

    const { amount } = await req.json()
    const numericAmount = parseFloat(amount)

    if (!numericAmount || numericAmount <= 0) {
      return NextResponse.json({ error: 'المبلغ غير صالح' }, { status: 400 })
    }

    const updatedUser = await prisma.user.update({
      where: { id: auth.userId },
      data: {
        walletBalance: {
          increment: numericAmount,
        },
      },
      select: {
        id: true,
        walletBalance: true,
      },
    })

    return NextResponse.json({ success: true, walletBalance: updatedUser.walletBalance })
  } catch (error: any) {
    console.error('Top-up error:', error)
    return NextResponse.json({ error: 'فشل شحن المحفظة' }, { status: 500 })
  }
}
