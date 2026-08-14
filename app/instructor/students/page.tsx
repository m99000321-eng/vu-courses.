'use client'

import React, { useEffect, useState } from 'react'
import { Navbar } from '@/components/navbar'
import { Sidebar } from '@/components/sidebar'
import { Users, Mail, Search, BookOpen, ChevronDown } from 'lucide-react'
import { useLanguage } from '@/components/language-provider'

interface Student {
  id: string
  name: string
  email: string
  avatar?: string
  enrolledAt: string
  course: {
    id: string
    title: string
  }
}

export default function StudentsPage() {
  const { t } = useLanguage()
  const [user, setUser] = useState<any>(null)
  const [students, setStudents] = useState<Student[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [courseFilter, setCourseFilter] = useState('')

  useEffect(() => {
    fetch('/api/auth/me')
      .then((res) => res.json())
      .then((d) => setUser(d.user))

    fetch('/api/instructor/enrollments')
      .then((res) => res.json())
      .then((d) => {
        setStudents(d.enrollments || [])
        setLoading(false)
      })
  }, [])

  const filteredStudents = students.filter((s) => {
    const matchSearch = s.name.includes(search) || s.email.includes(search)
    const matchCourse = !courseFilter || s.course.id === courseFilter
    return matchSearch && matchCourse
  })

  const uniqueCourses = Array.from(new Map(students.map((s) => [s.course.id, s.course])).values())

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans" dir="rtl">
      <Navbar currentUser={user} />

      <div className="flex-1 max-w-7xl w-full mx-auto flex">
        <Sidebar role="INSTRUCTOR" activeTab="students" />

        <main className="flex-1 p-6 space-y-6 overflow-y-auto">
          <div className="flex items-center gap-3">
            <Users className="w-7 h-7 text-brand-purple" />
             <h1 className="text-xl font-black">{t('enrolledStudentsInMyCourses')}</h1>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute right-3 top-2.5 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                 placeholder={t('searchStudentPlaceholder')}
                className="w-full p-2.5 pr-10 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-medium outline-none focus:ring-2 focus:ring-brand-purple"
              />
            </div>
            <div className="relative">
              <select
                value={courseFilter}
                onChange={(e) => setCourseFilter(e.target.value)}
                className="w-full sm:w-64 p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-bold outline-none focus:ring-2 focus:ring-brand-purple appearance-none"
              >
                <option value="">{t('allCourses')}</option>
                {uniqueCourses.map((c) => (
                  <option key={c.id} value={c.id}>{c.title}</option>
                ))}
              </select>
              <ChevronDown className="absolute left-3 top-2.5 w-4 h-4 text-slate-400 pointer-events-none" />
            </div>
          </div>

          {loading ? (
            <p className="text-xs text-slate-400 text-center py-8">{t('loadingData')}</p>
          ) : filteredStudents.length === 0 ? (
            <div className="text-center py-12 space-y-3">
              <Users className="w-12 h-12 text-slate-300 mx-auto" />
              <p className="text-xs text-slate-500">{t('noEnrolledStudentsYet')}</p>
            </div>
          ) : (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-right text-xs">
                  <thead>
                     <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 font-bold">
                       <th className="py-3 px-4">{t('student')}</th>
                       <th className="py-3 px-4">{t('email')}</th>
                       <th className="py-3 px-4">{t('enrolledCourse')}</th>
                       <th className="py-3 px-4">{t('enrollmentDate')}</th>
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                    {filteredStudents.map((s) => (
                      <tr key={s.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-brand-purple text-white font-bold flex items-center justify-center text-xs">
                              {s.avatar ? (
                                <img src={s.avatar} alt={s.name} className="w-full h-full object-cover rounded-full" />
                              ) : (
                                s.name.charAt(0)
                              )}
                            </div>
                            <span className="font-bold text-slate-800 dark:text-slate-200">{s.name}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-slate-500 flex items-center gap-1">
                          <Mail className="w-3.5 h-3.5" />
                          {s.email}
                        </td>
                        <td className="py-3 px-4">
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-purple-50 text-brand-purple font-bold rounded-lg">
                            <BookOpen className="w-3.5 h-3.5" />
                            {s.course.title}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-slate-500">{new Date(s.enrolledAt).toLocaleDateString('ar-EG')}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
