'use client'

import React, { useState, useEffect } from 'react'
import { Navbar } from '@/components/navbar'
import { Sidebar } from '@/components/sidebar'
import {
  ShieldCheck,
  Search,
  BookOpen,
  Users,
  CheckCircle,
  XCircle,
  ChevronDown,
} from 'lucide-react'
import { useLanguage } from '@/components/language-provider'

interface User {
  id: string
  name: string
  email: string
  avatar?: string
  bio?: string
  walletBalance: number
  createdAt: string
}

interface CourseInfo {
  id: string
  title: string
  studentsCount: number
  rating: number
}

interface InstructorData extends User {
  courses: CourseInfo[]
  totalStudents: number
  status: 'ACTIVE' | 'SUSPENDED'
}

export default function AdminInstructors() {
  const { t } = useLanguage()
  const [user, setUser] = useState<any>(null)
  const [instructors, setInstructors] = useState<InstructorData[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [expandedInstructor, setExpandedInstructor] = useState<string | null>(null)

  useEffect(() => {
    fetchUser()
    fetchInstructors()
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

  const fetchInstructors = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/users')
      if (res.ok) {
        const data = await res.json()
        const instructorUsers = (data.users || []).filter((u: any) => u.role === 'INSTRUCTOR')

        const enriched = await Promise.all(
          instructorUsers.map(async (inst: User) => {
            try {
              const coursesRes = await fetch(`/api/courses?instructorId=${inst.id}`)
              const coursesData = await coursesRes.json()
              const courses = (coursesData.courses || []).map((c: any) => ({
                id: c.id,
                title: c.title,
                studentsCount: c.studentsCount || 0,
                rating: c.rating || 0,
              }))
              const totalStudents = courses.reduce((sum: number, c: CourseInfo) => sum + c.studentsCount, 0)

              return {
                ...inst,
                courses,
                totalStudents,
                status: 'ACTIVE' as const,
              }
            } catch (e) {
              return { ...inst, courses: [], totalStudents: 0, status: 'ACTIVE' as const }
            }
          })
        )

        setInstructors(enriched)
      }
    } catch {
      console.error('fetchUser error')
    } finally {
      setLoading(false)
    }
  }

  const filteredInstructors = instructors.filter((inst) =>
    inst.name.toLowerCase().includes(search.toLowerCase()) || inst.email.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans" dir="rtl">
      <Navbar currentUser={user} />

      <div className="flex-1 max-w-7xl w-full mx-auto flex">
        <Sidebar role="ADMIN" activeTab="instructors" />

        <main className="flex-1 p-6 space-y-6 overflow-y-auto">
          <div className="bg-gradient-to-r from-purple-950 via-slate-900 to-brand-purple text-white p-6 rounded-2xl shadow-lg flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-black">{t('manageInstructors')}</h1>
              <p className="text-xs text-purple-200 mt-1">{t('instructorsDescription')}</p>
            </div>
            <span className="px-3.5 py-1.5 bg-brand-orange text-white text-xs font-black rounded-full shadow">
              {instructors.length} {t('instructors')}
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
            ) : filteredInstructors.length === 0 ? (
              <div className="text-center py-12 text-slate-400 text-xs">{t('noInstructors')}</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-right text-xs">
                  <thead>
                     <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 font-bold">
                       <th className="py-3 px-4">{t('instructor')}</th>
                       <th className="py-3 px-4">{t('email')}</th>
                       <th className="py-3 px-4">{t('courses')}</th>
                       <th className="py-3 px-4">{t('totalStudents')}</th>
                       <th className="py-3 px-4">{t('status')}</th>
                       <th className="py-3 px-4">{t('actions')}</th>
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                    {filteredInstructors.map((inst) => (
                      <>
                        <tr key={inst.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 rounded-full bg-brand-purple text-white font-bold flex items-center justify-center text-xs">
                                {inst.avatar ? <img src={inst.avatar} alt="" className="w-full h-full rounded-full object-cover" /> : inst.name.charAt(0)}
                              </div>
                              <div>
                                <span className="font-bold text-slate-800 dark:text-slate-200 block">{inst.name}</span>
                                {inst.bio && <span className="text-[10px] text-slate-400 block">{inst.bio.slice(0, 40)}...</span>}
                              </div>
                            </div>
                          </td>
                          <td className="py-3 px-4 text-slate-500">{inst.email}</td>
                          <td className="py-3 px-4 font-bold">{inst.courses.length}</td>
                          <td className="py-3 px-4 font-bold text-brand-purple">
                            {inst.totalStudents.toLocaleString('ar-EG')}
                          </td>
                          <td className="py-3 px-4">
                            <span className={`px-2 py-1 rounded-lg text-xs font-bold flex items-center gap-1 w-fit ${
                              inst.status === 'ACTIVE'
                                ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                                : 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400'
                            }`}>
                              {inst.status === 'ACTIVE' ? <CheckCircle className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                               {inst.status === 'ACTIVE' ? t('active') : t('suspended')}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <button
                              onClick={() => setExpandedInstructor(expandedInstructor === inst.id ? null : inst.id)}
                              className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-lg transition"
                            >
                              <ChevronDown className={`w-4 h-4 transition-transform ${expandedInstructor === inst.id ? 'rotate-180' : ''}`} />
                            </button>
                          </td>
                        </tr>
                        {expandedInstructor === inst.id && (
                          <tr key={`${inst.id}-courses`}>
                            <td colSpan={6} className="px-4 py-4 bg-slate-50 dark:bg-slate-800/30">
                               <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-3">{t('coursesTaught')}:</h4>
                               {inst.courses.length === 0 ? (
                                 <p className="text-xs text-slate-400">{t('noCourses')}</p>
                              ) : (
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                                  {inst.courses.map((c) => (
                                    <div key={c.id} className="bg-white dark:bg-slate-800 p-3 rounded-xl border border-slate-200 dark:border-slate-700">
                                      <p className="text-xs font-bold text-slate-800 dark:text-slate-200 mb-2">{c.title}</p>
                                      <div className="flex items-center gap-4 text-[10px] text-slate-500">
                                        <span className="flex items-center gap-1">
                                          <Users className="w-3 h-3" />
                                           {c.studentsCount} {t('students')}
                                        </span>
                                        <span className="flex items-center gap-1">
                                          <BookOpen className="w-3 h-3" />
                                           {c.rating.toFixed(1)} {t('rating')}
                                        </span>
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
