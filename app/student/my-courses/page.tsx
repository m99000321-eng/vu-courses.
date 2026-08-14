'use client'

import React, { useEffect, useState } from 'react'
import { Navbar } from '@/components/navbar'
import { Sidebar } from '@/components/sidebar'
import { GraduationCap, Play, Star } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function MyCoursesPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    fetch('/api/auth/me')
      .then((res) => res.json())
      .then((d) => setUser(d.user))
  }, [])

  const requireAuth = () => {
    if (!user) {
      router.push('/login')
      return false
    }
    return true
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans" dir="rtl">
      <Navbar currentUser={user} />
      <div className="flex-1 max-w-7xl w-full mx-auto flex">
        <Sidebar role="STUDENT" activeTab="my-courses" />
        <main className="flex-1 p-6 space-y-6">
          <div className="flex items-center gap-3">
            <GraduationCap className="w-7 h-7 text-brand-purple" />
            <h1 className="text-xl font-black">دوراتي التعليمية المسجل بها</h1>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-4">
              <div className="flex justify-between items-start">
                <span className="px-3 py-1 bg-purple-50 text-brand-purple font-bold text-xs rounded-lg">قيد الدراسة</span>
                <span className="text-xs font-bold text-brand-purple">68% الإنجاز</span>
              </div>
              <h3 className="font-extrabold text-base">Frontend Foundations - أساسيات تطوير الواجهات</h3>
              <p className="text-xs text-slate-500">تم إكمال Level 1 ويجري الآن دراسة Level 2: CSS Flexbox</p>
              <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                <div className="bg-brand-purple h-full" style={{ width: '68%' }} />
              </div>
              <Link
                href="/courses"
                onClick={(e) => {
                  if (!requireAuth()) e.preventDefault()
                }}
                className="w-full py-2.5 bg-brand-purple text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 hover:bg-brand-purple-hover transition shadow"
              >
                <Play className="w-4 h-4 fill-current" />
                استكمال التعلم
              </Link>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
