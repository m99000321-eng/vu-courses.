'use client'

import React, { useState, useEffect } from 'react'
import { Navbar } from '@/components/navbar'
import { Sidebar } from '@/components/sidebar'
import {
  Search,
  BookOpen,
  Award,
} from 'lucide-react'
import { useLanguage } from '@/components/language-provider'

interface User {
  id: string
  name: string
  email: string
  avatar?: string
  walletBalance: number
  createdAt: string
}

interface Enrollment {
  id: string
  course: { id: string; title: string; thumbnail: string }
  progressPercent: number
  enrolledAt: string
}

interface StudentData extends User {
  enrollments: Enrollment[]
  certificatesCount: number
}

export default function AdminStudents() {
  const { t } = useLanguage()
  const [user, setUser] = useState<any>(null)
  const [students, setStudents] = useState<StudentData[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    fetchUser()
    fetchStudents()
  }, [])

  const fetchUser = async () => {
    try {
      const res = await fetch('/api/auth/me')
      if (res.ok) {
        const data = await res.json()
        setUser(data.user)
      }
    } catch {
      console.error('fetchUser error')
    }
  }

  const fetchStudents = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/users')
      if (res.ok) {
        const data = await res.json()
        const studentUsers = (data.users || []).filter((u: any) => u.role === 'STUDENT')

        const enriched = await Promise.all(
          studentUsers.map(async (s: User) => {
            try {
              const enrollRes = await fetch(`/api/enrollments?userId=${s.id}`)
              const enrollData = await enrollRes.json()
              const certRes = await fetch(`/api/certificates`)
              const certData = await certRes.json()
              const certsForUser = (certData.certificates || []).filter((c: any) => c.userId === s.id)

              return {
                ...s,
                enrollments: (enrollData.enrollments || []).map((e: any) => ({
                  id: e.id,
                  course: e.course,
                  progressPercent: e.progressPercent,
                  enrolledAt: e.enrolledAt,
                })),
                certificatesCount: certsForUser.length,
              }
            } catch (e) {
              return { ...s, enrollments: [], certificatesCount: 0 }
            }
          })
        )

        setStudents(enriched)
      }
    } catch {
      console.error('fetchUser error')
    } finally {
      setLoading(false)
    }
  }

  const filteredStudents = students.filter((s) =>
    s.name.toLowerCase().includes(search.toLowerCase()) || s.email.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans" dir="rtl">
      <Navbar currentUser={user} />

      <div className="flex-1 max-w-7xl w-full mx-auto flex">
        <Sidebar role="ADMIN" activeTab="students" />

        <main className="flex-1 p-6 space-y-6 overflow-y-auto">
          <div className="bg-gradient-to-r from-purple-950 via-slate-900 to-brand-purple text-white p-6 rounded-2xl shadow-lg flex items-center justify-between">
            <div>
               <h1 className="text-2xl font-black">{t('manageStudents')}</h1>
               <p className="text-xs text-purple-200 mt-1">{t('studentsDescription')}</p>
            </div>
            <span className="px-3.5 py-1.5 bg-brand-orange text-white text-xs font-black rounded-full shadow">
              {students.length} {t('students')}
            </span>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
            <div className="relative">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                 placeholder={t('searchByNameOrEmail')}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pr-10 pl-4 py-2 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium text-slate-800 dark:text-slate-200 outline-none focus:ring-2 focus:ring-brand-purple/50"
              />
            </div>

            {loading ? (
              <div className="text-center py-12 text-slate-400 text-xs">{t('loading')}</div>
            ) : filteredStudents.length === 0 ? (
              <div className="text-center py-12 text-slate-400 text-xs">{t('noStudents')}</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-right text-xs">
                  <thead>
                     <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 font-bold">
                       <th className="py-3 px-4">{t('student')}</th>
                       <th className="py-3 px-4">{t('email')}</th>
                       <th className="py-3 px-4">{t('enrolledCourses')}</th>
                       <th className="py-3 px-4">{t('certificates')}</th>
                       <th className="py-3 px-4">{t('walletBalance')}</th>
                       <th className="py-3 px-4">{t('createdAt')}</th>
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                    {filteredStudents.map((s) => (
                      <>
                        <tr key={s.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 rounded-full bg-brand-purple text-white font-bold flex items-center justify-center text-xs">
                                {s.avatar ? <img src={s.avatar} alt="" className="w-full h-full rounded-full object-cover" /> : s.name.charAt(0)}
                              </div>
                              <span className="font-bold text-slate-800 dark:text-slate-200">{s.name}</span>
                            </div>
                          </td>
                          <td className="py-3 px-4 text-slate-500">{s.email}</td>
                          <td className="py-3 px-4 font-bold">{s.enrollments.length}</td>
                          <td className="py-3 px-4">
                            <span className="flex items-center gap-1 text-amber-600 font-bold">
                              <Award className="w-3 h-3" />
                              {s.certificatesCount}
                            </span>
                          </td>
                           <td className="py-3 px-4 font-bold text-brand-purple">{s.walletBalance.toFixed(0)} {t('currency')}</td>
                          <td className="py-3 px-4 text-slate-500">
                            {new Date(s.createdAt).toLocaleDateString('ar-EG')}
                          </td>
                        </tr>
                        {expandedStudent === s.id && (
                          <tr key={`${s.id}-details`}>
                            <td colSpan={6} className="px-4 py-4 bg-slate-50 dark:bg-slate-800/30">
                               <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-3">{t('enrolledCourses')}:</h4>
                               {s.enrollments.length === 0 ? (
                                 <p className="text-xs text-slate-400">{t('noEnrolledCourses')}</p>
                              ) : (
                                <div className="space-y-2">
                                  {s.enrollments.map((e) => (
                                    <div key={e.id} className="flex items-center gap-3 bg-white dark:bg-slate-800 p-3 rounded-xl border border-slate-200 dark:border-slate-700">
                                      <BookOpen className="w-4 h-4 text-brand-purple" />
                                      <span className="font-bold text-slate-800 dark:text-slate-200 flex-1">{e.course.title}</span>
                                      <div className="flex items-center gap-2">
                                        <div className="w-24 h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                                          <div
                                            className="h-full bg-brand-purple rounded-full"
                                            style={{ width: `${e.progressPercent}%` }}
                                          />
                                        </div>
                                        <span className="text-xs font-bold text-slate-600 dark:text-slate-400">{e.progressPercent.toFixed(0)}%</span>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </td>
                          </tr>
                        )}
                      </>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}
