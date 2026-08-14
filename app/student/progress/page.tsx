'use client'

import React, { useEffect, useState } from 'react'
import { Navbar } from '@/components/navbar'
import { Sidebar } from '@/components/sidebar'
import {
  BookOpen,
  CheckCircle,
  Clock,
  TrendingUp,
  Sparkles,
  Award,
} from 'lucide-react'

interface Enrollment {
  id: string
  progressPercent: number
  enrolledAt: string
  course: {
    id: string
    title: string
    description: string
    thumbnail: string
    duration: string
    instructor: { name: string; avatar: string }
    levels: {
      lessons: { id: string; title: string; duration: string }[]
    }[]
  }
}

export default function ProgressPage() {
  const [user, setUser] = useState<any>(null)
  const [enrollments, setEnrollments] = useState<Enrollment[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      fetch('/api/auth/me').then((res) => res.json()),
      fetch('/api/enrollments').then((res) => res.json()),
    ])
      .then(([userData, enrollData]) => {
        setUser(userData.user)
        setEnrollments(enrollData.enrollments || [])
      })
      .finally(() => setLoading(false))
  }, [])

  const totalEnrolled = enrollments.length
  const completedLessons = enrollments.reduce((sum, e) => {
    const allLessons = e.course.levels.flatMap((l) => l.lessons)
    return sum + Math.floor((e.progressPercent / 100) * allLessons.length)
  }, 0)
  const avgProgress = totalEnrolled > 0 ? Math.round(enrollments.reduce((sum, e) => sum + e.progressPercent, 0) / totalEnrolled) : 0
  const studyHours = enrollments.reduce((sum, e) => {
    const allLessons = e.course.levels.flatMap((l) => l.lessons)
    const completedCount = Math.floor((e.progressPercent / 100) * allLessons.length)
    const hours = completedCount * 0.25
    return sum + hours
  }, 0)

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans" dir="rtl">
      <Navbar currentUser={user} />

      <div className="flex-1 max-w-7xl w-full mx-auto flex">
        <Sidebar role="STUDENT" activeTab="progress" />

        <main className="flex-1 p-6 space-y-6 overflow-y-auto">
          <div className="flex items-center gap-3">
            <TrendingUp className="w-7 h-7 text-brand-purple" />
            <h1 className="text-xl font-black">مستوى التقدم التعليمي</h1>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl shadow-sm flex items-center gap-3">
              <div className="p-3 bg-purple-50 dark:bg-slate-800 text-brand-purple rounded-xl">
                <BookOpen className="w-6 h-6" />
              </div>
              <div>
                <p className="text-[11px] text-slate-500 font-semibold">الكورسات المسجلة</p>
                <p className="text-xl font-black text-slate-800 dark:text-slate-100">{totalEnrolled}</p>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl shadow-sm flex items-center gap-3">
              <div className="p-3 bg-emerald-50 dark:bg-slate-800 text-emerald-600 rounded-xl">
                <CheckCircle className="w-6 h-6" />
              </div>
              <div>
                <p className="text-[11px] text-slate-500 font-semibold">الدروس المكتملة</p>
                <p className="text-xl font-black text-slate-800 dark:text-slate-100">{completedLessons}</p>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl shadow-sm flex items-center gap-3">
              <div className="p-3 bg-orange-50 dark:bg-slate-800 text-brand-orange rounded-xl">
                <TrendingUp className="w-6 h-6" />
              </div>
              <div>
                <p className="text-[11px] text-slate-500 font-semibold">متوسط الإنجاز</p>
                <p className="text-xl font-black text-brand-purple">{avgProgress}%</p>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl shadow-sm flex items-center gap-3">
              <div className="p-3 bg-blue-50 dark:bg-slate-800 text-blue-600 rounded-xl">
                <Clock className="w-6 h-6" />
              </div>
              <div>
                <p className="text-[11px] text-slate-500 font-semibold">ساعات الدراسة</p>
                <p className="text-xl font-black text-slate-800 dark:text-slate-100">{studyHours.toFixed(1)}</p>
              </div>
            </div>
          </div>

          {/* Per-Course Progress */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
            <h2 className="text-sm font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-brand-orange" />
              تقدمك في كل كورس:
            </h2>

            {loading ? (
              <p className="text-xs text-slate-400 text-center py-8">جاري تحميل البيانات...</p>
            ) : enrollments.length === 0 ? (
              <div className="text-center py-8 space-y-2">
                <Award className="w-12 h-12 text-slate-300 mx-auto" />
                <p className="text-xs text-slate-500">لم تسجل في أي كورس بعد</p>
              </div>
            ) : (
              <div className="space-y-4">
                {enrollments.map((enrollment) => {
                  const allLessons = enrollment.course.levels.flatMap((l) => l.lessons)
                  const totalLessons = allLessons.length
                  const completedCount = Math.floor((enrollment.progressPercent / 100) * totalLessons)

                  return (
                    <div
                      key={enrollment.id}
                      className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700/80"
                    >
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                        <div className="space-y-2 flex-1">
                          <div className="flex items-center gap-2">
                            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                              {enrollment.course.title}
                            </h3>
                            <span className="px-2 py-0.5 bg-brand-purple text-white text-[10px] font-bold rounded-lg">
                              {enrollment.progressPercent}%
                            </span>
                          </div>
                          <p className="text-xs text-slate-500">
                            {completedCount} من {totalLessons} درس مكتمل
                          </p>
                          <div className="w-full bg-slate-200 dark:bg-slate-700 h-2.5 rounded-full overflow-hidden">
                            <div
                              className="bg-brand-purple h-full rounded-full transition-all duration-500"
                              style={{ width: `${enrollment.progressPercent}%` }}
                            />
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <span className="text-xs font-black text-brand-purple">
                            {enrollment.progressPercent}% مكتمل
                          </span>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}
