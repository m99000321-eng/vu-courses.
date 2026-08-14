'use client'

import React, { useEffect, useState } from 'react'
import { Navbar } from '@/components/navbar'
import { Sidebar } from '@/components/sidebar'
import {
  Users,
  BookOpen,
  DollarSign,
  PlusCircle,
  Star,
  UserPlus,
  GraduationCap,
} from 'lucide-react'
import { useLanguage } from '@/components/language-provider'

interface User {
  id: string
  name: string
  email: string
  role: 'STUDENT' | 'INSTRUCTOR' | 'ADMIN'
  walletBalance: number
  avatar?: string
}

export default function InstructorDashboard() {
  const [user, setUser] = useState<User | null>(null)
  const [newCourseTitle, setNewCourseTitle] = useState('')
  const [newCourseDesc, setNewCourseDesc] = useState('')
  const [isCreating, setIsCreating] = useState(false)
  const [showAddMenu, setShowAddMenu] = useState(false)
  const { t } = useLanguage()

  useEffect(() => {
    fetch('/api/auth/me')
      .then((res) => res.json())
      .then((d) => setUser(d.user))
  }, [])

  const handleCreateCourse = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newCourseTitle || !newCourseDesc) return

    setIsCreating(true)
    try {
      const res = await fetch('/api/courses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newCourseTitle,
          description: newCourseDesc,
        }),
      })
      if (res.ok) {
        setNewCourseTitle('')
        setNewCourseDesc('')
        alert('تم إضافة الكورس بنجاح وسيظهر الآن للطلاب!')
      }
    } catch (err) {
      console.error(err)
    } finally {
      setIsCreating(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans page-transition" dir="rtl">
      <Navbar currentUser={user} />

      <div className="flex-1 flex">
        <Sidebar role="INSTRUCTOR" activeTab="dashboard" />

        <main className="flex-1 p-4 sm:p-6 space-y-4 sm:space-y-6 overflow-y-auto min-w-0">
          
          {/* Header Banner */}
          <div className="bg-gradient-to-r from-slate-900 via-brand-purple to-purple-900 text-white p-4 sm:p-6 rounded-2xl shadow-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 animate-fade-in-up">
            <div>
              <h1 className="text-xl sm:text-2xl font-black">{t('instructorStudio')}</h1>
              <p className="text-xs text-purple-200 mt-1">{t('welcomeInstructor')} {user?.name || 'أحمد محمود'} - {t('trackStats')}</p>
            </div>
            <div className="relative">
              <button
                onClick={() => setShowAddMenu(!showAddMenu)}
                className="px-4 py-2 bg-brand-orange hover:bg-brand-orange-hover text-white text-xs font-bold rounded-xl shadow transition flex items-center gap-2"
              >
                <PlusCircle className="w-4 h-4" />
                {t('addNew')}
              </button>

              {showAddMenu && (
                <div className="absolute left-0 mt-2 w-56 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl p-2 z-50">
                  <button className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-purple-50 dark:hover:bg-slate-800 rounded-lg transition">
                    <UserPlus className="w-4 h-4 text-brand-purple" />
                    {t('addStudent')}
                  </button>
                  <button className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-purple-50 dark:hover:bg-slate-800 rounded-lg transition">
                    <GraduationCap className="w-4 h-4 text-brand-purple" />
                    {t('addInstructor')}
                  </button>
                  <button className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-purple-50 dark:hover:bg-slate-800 rounded-lg transition">
                    <BookOpen className="w-4 h-4 text-brand-purple" />
                    {t('createCourse')}
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Instructor Analytics Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-3 sm:p-4 rounded-2xl shadow-sm flex items-center gap-2 sm:gap-3 card-hover animate-fade-in-up stagger-1">
              <div className="p-3 bg-purple-50 dark:bg-slate-800 text-brand-purple rounded-xl">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <p className="text-[11px] text-slate-500 font-semibold">{t('totalStudents')}</p>
                <p className="text-xl font-black text-slate-800 dark:text-slate-100">230 {t('students')}</p>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-3 sm:p-4 rounded-2xl shadow-sm flex items-center gap-2 sm:gap-3 card-hover animate-fade-in-up stagger-2">
              <div className="p-3 bg-orange-50 dark:bg-slate-800 text-brand-orange rounded-xl">
                <BookOpen className="w-6 h-6" />
              </div>
              <div>
                <p className="text-[11px] text-slate-500 font-semibold">{t('publishedCourses')}</p>
                <p className="text-xl font-black text-slate-800 dark:text-slate-100">2 {t('courses')}</p>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-3 sm:p-4 rounded-2xl shadow-sm flex items-center gap-2 sm:gap-3 card-hover animate-fade-in-up stagger-3">
              <div className="p-3 bg-emerald-50 dark:bg-slate-800 text-emerald-600 rounded-xl">
                <DollarSign className="w-6 h-6" />
              </div>
              <div>
                <p className="text-[11px] text-slate-500 font-semibold">{t('totalRevenue')}</p>
                <p className="text-xl font-black text-emerald-600">12,400 ج.م</p>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-3 sm:p-4 rounded-2xl shadow-sm flex items-center gap-2 sm:gap-3 card-hover animate-fade-in-up stagger-4">
              <div className="p-3 bg-amber-50 dark:bg-slate-800 text-amber-500 rounded-xl">
                <Star className="w-6 h-6 fill-current" />
              </div>
              <div>
                <p className="text-[11px] text-slate-500 font-semibold">{t('avgRating')}</p>
                <p className="text-xl font-black text-slate-800 dark:text-slate-100">4.9 / 5.0</p>
              </div>
            </div>
          </div>

          {/* Quick Add Course Panel */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4 animate-fade-in-up stagger-5">
            <h2 className="text-sm font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
              <PlusCircle className="w-5 h-5 text-brand-purple" />
              {t('createNewCourse')}:
            </h2>

            <form onSubmit={handleCreateCourse} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  {t('courseTitleLabel')}:
                </label>
                <input
                  type="text"
                  required
                  placeholder="مثال: Python & Django Mastery"
                  value={newCourseTitle}
                  onChange={(e) => setNewCourseTitle(e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold outline-none focus:ring-2 focus:ring-brand-purple transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  {t('courseDescLabel')}:
                </label>
                <textarea
                  required
                  rows={3}
                  placeholder="اشرح محتويات الدورة المستهدفة للطلاب..."
                  value={newCourseDesc}
                  onChange={(e) => setNewCourseDesc(e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs outline-none focus:ring-2 focus:ring-brand-purple transition-all"
                />
              </div>

              <button
                type="submit"
                disabled={isCreating}
                className="px-6 py-2.5 bg-brand-purple hover:bg-brand-purple-hover text-white text-xs font-bold rounded-xl shadow transition btn-hover"
              >
                {isCreating ? t('creatingAccount') : t('savePublish')}
              </button>
            </form>
          </div>

        </main>
      </div>
    </div>
  )
}
