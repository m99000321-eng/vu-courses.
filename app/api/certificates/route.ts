import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAuthUser } from '@/lib/auth'

export async function GET(req: NextRequest) {
  try {
    const auth = getAuthUser(req)
    const { searchParams } = new URL(req.url)
    const code = searchParams.get('code')

    // If searching by code (public verification)
    if (code) {
      const cert = await prisma.certificate.findUnique({
        where: { certCode: code },
        include: {
          user: { select: { id: true, name: true, email: true } },
          course: {
            include: {
              instructor: { select: { name: true } },
            },
          },
        },
      })
      if (!cert) {
        return NextResponse.json({ error: 'الشهادة غير موجودة أو كود التوثيق غير صحيح' }, { status: 404 })
      }
      return NextResponse.json({ cert })
    }

    if (!auth) {
      return NextResponse.json({ error: 'غير مصرح' }, { status: 401 })
    }

    const certificates = await prisma.certificate.findMany({
      where: { userId: auth.userId },
      include: {
        course: {
          include: {
            instructor: { select: { name: true } },
          },
        },
      },
      orderBy: { issuedAt: 'desc' },
    })

    return NextResponse.json({ certificates })
  } catch (error: any) {
    console.error('Fetch certificates error:', error)
    return NextResponse.json({ error: 'فشل جلب الشهادات' }, { status: 500 })
  }
}
