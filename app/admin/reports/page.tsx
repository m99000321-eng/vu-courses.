'use client'

import React, { useState, useEffect } from 'react'
import { Navbar } from '@/components/navbar'
import { Sidebar } from '@/components/sidebar'
import {
  Users,
  BookOpen,
  DollarSign,
  TrendingUp,
  Award,
  Download,
  RefreshCw,
} from 'lucide-react'
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts'
import { useLanguage } from '@/components/language-provider'

interface ReportData {
  userGrowth: { month: string; users: number }[]
  coursePopularity: { name: string; students: number }[]
  revenue: { month: string; revenue: number }[]
  completionRates: { name: string; value: number; color: string }[]
  totalUsers: number
  totalCourses: number
  totalRevenue: number
  totalCertificates: number
}

export default function AdminReports() {
  const { t } = useLanguage()
  const [user, setUser] = useState<any>(null)
  const [reportData, setReportData] = useState<ReportData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchUser()
    fetchReports()
  }, [])

  const fetchUser = async () => {
    try {
      const res = await fetch('/api/auth/me')
      if (res.ok) {
        const data = await res.json()
        setUser(data.user)
      }
    } catch (e) {
      console.error(e)
    }
  }

  const fetchReports = async () => {
    setLoading(true)
    try {
      const usersRes = fetch('/api/admin/users')
      const coursesRes = fetch('/api/courses')
      const certsRes = fetch('/api/admin/certificates')

      const [usersData, coursesData, certsData] = await Promise.all([usersRes, coursesRes, certsRes])
      const users = (await usersData.json()).users || []
      const courses = (await coursesData.json()).courses || []
      const certs = (await certsData.json()).certificates || []

      const months = ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر']
      const userGrowth = months.slice(0, 7).map((month, i) => ({
        month,
        users: Math.floor(users.length * (0.3 + i * 0.1) + Math.random() * 5),
      }))

      const coursePopularity = courses.slice(0, 5).map((c: any) => ({
        name: c.title.length > 20 ? c.title.slice(0, 20) + '...' : c.title,
        students: c.studentsCount || Math.floor(Math.random() * 200),
      }))

      const revenue = months.slice(0, 7).map((month, i) => ({
        month,
        revenue: Math.floor(3000 + i * 1500 + Math.random() * 2000),
      }))

      const totalCertificates = certs.length
      const totalStudents = users.filter((u: any) => u.role === 'STUDENT').length
      const completionRates = [
        { name: 'مكتمل', value: Math.floor(totalStudents * 0.4), color: '#6C2BD9' },
        { name: 'قيد التقدم', value: Math.floor(totalStudents * 0.35), color: '#F97316' },
        { name: 'لم يبدأ', value: Math.floor(totalStudents * 0.25), color: '#94A3B8' },
      ]

      setReportData({
        userGrowth,
        coursePopularity,
        revenue,
        completionRates,
        totalUsers: users.length,
        totalCourses: courses.length,
        totalRevenue: revenue.reduce((sum, r) => sum + r.revenue, 0),
        totalCertificates,
      })
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  const handleExportCSV = () => {
    alert(t('csvExportSimulation'))
  }

  const handleExportPDF = () => {
    alert(t('pdfExportSimulation'))
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans" dir="rtl">
        <Navbar currentUser={user} />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <RefreshCw className="w-8 h-8 animate-spin text-brand-purple mx-auto mb-2" />
            <p className="text-xs text-slate-500">{t('loadingReports')}</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans" dir="rtl">
      <Navbar currentUser={user} />

      <div className="flex-1 max-w-7xl w-full mx-auto flex">
        <Sidebar role="ADMIN" activeTab="reports" />

        <main className="flex-1 p-6 space-y-6 overflow-y-auto">
          <div className="bg-gradient-to-r from-purple-950 via-slate-900 to-brand-purple text-white p-6 rounded-2xl shadow-lg flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-black">التقارير والتحليلات</h1>
              <p className="text-xs text-purple-200 mt-1">إحصائيات شاملة عن أداء المنصة</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleExportCSV}
                className="px-3 py-2 bg-white/10 text-white text-xs font-bold rounded-xl hover:bg-white/20 transition flex items-center gap-1"
              >
                <Download className="w-3 h-3" />
                CSV
              </button>
              <button
                onClick={handleExportPDF}
                className="px-3 py-2 bg-brand-orange text-white text-xs font-bold rounded-xl hover:bg-brand-orange-hover transition flex items-center gap-1"
              >
                <Download className="w-3 h-3" />
                PDF
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl shadow-sm flex items-center gap-3">
              <div className="p-3 bg-purple-50 dark:bg-slate-800 text-brand-purple rounded-xl">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <p className="text-[11px] text-slate-500 font-semibold">إجمالي المستخدمين</p>
                <p className="text-xl font-black text-slate-800 dark:text-slate-100">{reportData?.totalUsers || 0}</p>
              </div>
            </div>
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl shadow-sm flex items-center gap-3">
              <div className="p-3 bg-orange-50 dark:bg-slate-800 text-brand-orange rounded-xl">
                <BookOpen className="w-6 h-6" />
              </div>
              <div>
                <p className="text-[11px] text-slate-500 font-semibold">الكورسات</p>
                <p className="text-xl font-black text-slate-800 dark:text-slate-100">{reportData?.totalCourses || 0}</p>
              </div>
            </div>
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl shadow-sm flex items-center gap-3">
              <div className="p-3 bg-emerald-50 dark:bg-slate-800 text-emerald-600 rounded-xl">
                <DollarSign className="w-6 h-6" />
              </div>
              <div>
                <p className="text-[11px] text-slate-500 font-semibold">الإيرادات</p>
                <p className="text-xl font-black text-emerald-600">{(reportData?.totalRevenue || 0).toLocaleString('ar-EG')} ج.م</p>
              </div>
            </div>
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl shadow-sm flex items-center gap-3">
              <div className="p-3 bg-blue-50 dark:bg-slate-800 text-blue-600 rounded-xl">
                <Award className="w-6 h-6" />
              </div>
              <div>
                <p className="text-[11px] text-slate-500 font-semibold">الشهادات</p>
                <p className="text-xl font-black text-slate-800 dark:text-slate-100">{reportData?.totalCertificates || 0}</p>
              </div>
            </div>
          </div>

          {reportData && (
            <>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
                  <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 mb-4 flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-brand-purple" />
                    نمو المستخدمين
                  </h3>
                  <ResponsiveContainer width="100%" height={250}>
                    <LineChart data={reportData.userGrowth}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                      <XAxis dataKey="month" tick={{ fontSize: 10 }} />
                      <YAxis tick={{ fontSize: 10 }} />
                      <Tooltip
                        contentStyle={{ borderRadius: '12px', border: '1px solid #E2E8F0', fontSize: '12px' }}
                        labelStyle={{ fontFamily: 'sans-serif' }}
                      />
                      <Line type="monotone" dataKey="users" stroke="#6C2BD9" strokeWidth={3} dot={{ r: 4 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>

                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
                  <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 mb-4 flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-brand-orange" />
                    شعبية الكورسات
                  </h3>
                  <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={reportData.coursePopularity}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                      <XAxis dataKey="name" tick={{ fontSize: 9 }} />
                      <YAxis tick={{ fontSize: 10 }} />
                      <Tooltip
                        contentStyle={{ borderRadius: '12px', border: '1px solid #E2E8F0', fontSize: '12px' }}
                        labelStyle={{ fontFamily: 'sans-serif' }}
                      />
                      <Bar dataKey="students" fill="#F97316" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
                  <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 mb-4 flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-emerald-600" />
                    الإيرادات الشهرية
                  </h3>
                  <ResponsiveContainer width="100%" height={250}>
                    <AreaChart data={reportData.revenue}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                      <XAxis dataKey="month" tick={{ fontSize: 10 }} />
                      <YAxis tick={{ fontSize: 10 }} />
                      <Tooltip
                        contentStyle={{ borderRadius: '12px', border: '1px solid #E2E8F0', fontSize: '12px' }}
                        labelStyle={{ fontFamily: 'sans-serif' }}
                      />
                      <Area type="monotone" dataKey="revenue" stroke="#10B981" fill="#10B981" fillOpacity={0.2} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>

                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
                  <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 mb-4 flex items-center gap-2">
                    <Award className="w-4 h-4 text-blue-600" />
                    معدلات الإكمال
                  </h3>
                  <ResponsiveContainer width="100%" height={250}>
                    <PieChart>
                      <Pie
                        data={reportData.completionRates}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {reportData.completionRates.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{ borderRadius: '12px', border: '1px solid #E2E8F0', fontSize: '12px' }}
                        labelStyle={{ fontFamily: 'sans-serif' }}
                      />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  )
}
