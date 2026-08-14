import { NextRequest, NextResponse } from 'next/server'
import { getAuthUser } from '@/lib/auth'

const defaultSettings = {
  siteName: 'VU Courses',
  siteDescription: 'منصة التعليم الإلكتروني الرائدة',
  contactEmail: 'support@vucourses.com',
  supportPhone: '+20 123 456 7890',
  smtpHost: 'smtp.vucourses.com',
  smtpPort: '587',
  smtpUser: 'noreply@vucourses.com',
  smtpPass: '',
  maintenanceMode: false,
  logoUrl: '',
  facebookUrl: 'https://facebook.com/vucourses',
  twitterUrl: 'https://twitter.com/vucourses',
  instagramUrl: 'https://instagram.com/vucourses',
}

let settingsCache = { ...defaultSettings }

export async function GET(req: NextRequest) {
  try {
    const auth = getAuthUser(req)
    if (!auth || auth.role !== 'ADMIN') {
      return NextResponse.json({ error: 'غير مصرح' }, { status: 403 })
    }

    return NextResponse.json({ settings: settingsCache })
  } catch (error: any) {
    console.error('Fetch settings error:', error)
    return NextResponse.json({ error: 'فشل جلب الإعدادات' }, { status: 500 })
  }
}

export async function PUT(req: NextRequest) {
  try {
    const auth = getAuthUser(req)
    if (!auth || auth.role !== 'ADMIN') {
      return NextResponse.json({ error: 'غير مصرح' }, { status: 403 })
    }

    const body = await req.json()

    settingsCache = {
      ...settingsCache,
      ...body,
    }

    return NextResponse.json({ success: true, settings: settingsCache })
  } catch (error: any) {
    console.error('Update settings error:', error)
    return NextResponse.json({ error: 'فشل تحديث الإعدادات' }, { status: 500 })
  }
}
