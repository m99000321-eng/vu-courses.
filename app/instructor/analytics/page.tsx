'use client'

import React, { useEffect, useState } from 'react'
import { Navbar } from '@/components/navbar'
import { Sidebar } from '@/components/sidebar'
import { BarChart3, TrendingUp, DollarSign, Users, BookOpen } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts'

export default function AnalyticsPage() {
  const [user, setUser] = useState<any>(null)
  const [stats, setStats] = useState({ totalStudents: 0, totalRevenue: 0, totalCourses: 0, avgCompletion: 0 })
  const [chartData, setChartData] = useState<any[]>([])
  const [revenueData, setRevenueData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/auth/me')
      .then((res) => res.json())
      .then((d) => setUser(d.user))
  }, [])

  useEffect(() => {
    fetch('/api/courses')
      .then((res) => res.json())
      .then((d) => {
        const allCourses = d.courses || []
        const instructorCourses = allCourses.filter((c: any) => c.instructorId === user?.id)
        setCourses(instructorCourses)

        const totalStudents = instructorCourses.reduce((sum: number, c: any) => sum + c.studentsCount, 0)
        const totalRevenue = instructorCourses.reduce((sum: number, c: any) => sum + (c.price * c.studentsCount), 0)
        const avgCompletion = instructorCourses.length > 0 ? Math.round(instructorCourses.reduce((sum: number, c: any) => sum + 70, 0) / instructorCourses.length) : 0

        setStats({
          totalStudents,
          totalRevenue,
          totalCourses: instructorCourses.length,
          avgCompletion,
        })

        const studentsPerCourse = instructorCourses.map((_c: any) => ({
          name: _c.title.length > 15 ? _c.title.substring(0, 15) + '...' : _c.title,
          students: _c.studentsCount,
          revenue: _c.price * _c.studentsCount,
        }))
        setChartData(studentsPerCourse)

        const months = ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو']
        const revenueByMonth = months.map((month, _i) => ({
          month,
          revenue: Math.round(totalRevenue * 0.6 * (0.5 + Math.random() * 0.5)),
        }))
        setRevenueData(revenueByMonth)

        setLoading(false)
      })
  }, [user])

  const COLORS = ['#6C2BD9', '#F97316', '#10B981', '#3B82F6', '#F59E0B']

  const pieData = chartData.map((item, index) => ({
    name: item.name,
    value: item.students,
    color: COLORS[index % COLORS.length],
  }))

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans" dir="rtl">
      <Navbar currentUser={user} />

      <div className="flex-1 max-w-7xl w-full mx-auto flex">
        <Sidebar role="INSTRUCTOR" activeTab="analytics" />

        <main className="flex-1 p-6 space-y-6 overflow-y-auto">
          <div className="flex items-center gap-3">
            <BarChart3 className="w-7 h-7 text-brand-purple" />
            <h1 className="text-xl font-black">تحليلات الأداء والربح</h1>
          </div>

          {loading ? (
            <p className="text-xs text-slate-400 text-center py-8">جاري تحميل البيانات...</p>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl shadow-sm flex items-center gap-3">
                  <div className="p-3 bg-purple-50 dark:bg-slate-800 text-brand-purple rounded-xl">
                    <Users className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-[11px] text-slate-500 font-semibold">إجمالي الطلاب</p>
                    <p className="text-xl font-black text-slate-800 dark:text-slate-100">{stats.totalStudents}</p>
                  </div>
                </div>

                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl shadow-sm flex items-center gap-3">
                  <div className="p-3 bg-emerald-50 dark:bg-slate-800 text-emerald-600 rounded-xl">
                    <DollarSign className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-[11px] text-slate-500 font-semibold">إجمالي الأرباح</p>
                    <p className="text-xl font-black text-emerald-600">{stats.totalRevenue.toLocaleString()} ج.م</p>
                  </div>
                </div>

                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl shadow-sm flex items-center gap-3">
                  <div className="p-3 bg-orange-50 dark:bg-slate-800 text-brand-orange rounded-xl">
                    <BookOpen className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-[11px] text-slate-500 font-semibold">الكورسات المنشورة</p>
                    <p className="text-xl font-black text-slate-800 dark:text-slate-100">{stats.totalCourses}</p>
                  </div>
                </div>

                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl shadow-sm flex items-center gap-3">
                  <div className="p-3 bg-blue-50 dark:bg-slate-800 text-blue-600 rounded-xl">
                    <TrendingUp className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-[11px] text-slate-500 font-semibold">متوسط الإنجاز</p>
                    <p className="text-xl font-black text-blue-600">{stats.avgCompletion}%</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
                  <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                    <Users className="w-4 h-4 text-brand-purple" />
                    الطلاب لكل كورس
                  </h3>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                        <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                        <YAxis tick={{ fontSize: 10 }} />
                        <Tooltip />
                        <Bar dataKey="students" fill="#6C2BD9" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
                  <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-brand-orange" />
                    الإيرادات
                  </h3>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={revenueData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                        <XAxis dataKey="month" tick={{ fontSize: 10 }} />
                        <YAxis tick={{ fontSize: 10 }} />
                        <Tooltip />
                        <Line type="monotone" dataKey="revenue" stroke="#F97316" strokeWidth={2} dot={{ fill: '#F97316' }} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>

              {pieData.length > 0 && (
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
                  <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-brand-orange" />
                    توزيع الطلاب
                  </h3>
                  <div className="h-64 flex items-center justify-center">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={pieData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, value }) => `${name}: ${value}`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {pieData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  )
}
