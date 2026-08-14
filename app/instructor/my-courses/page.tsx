'use client'

import React, { useEffect, useState } from 'react'
import { Navbar } from '@/components/navbar'
import { Sidebar } from '@/components/sidebar'
import { BookOpen, Star, Users, Edit } from 'lucide-react'
import Link from 'next/link'

interface Course {
  id: string
  title: string
  description: string
  thumbnail: string
  price: number
  duration: string
  rating: number
  studentsCount: number
  levels: { lessons: { id: string }[] }[]
}

export default function MyCoursesPage() {
  const [user, setUser] = useState<any>(null)
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      fetch('/api/auth/me').then((res) => res.json()),
      fetch('/api/courses').then((res) => res.json()),
    ]).then(([userData, coursesData]) => {
      const u = userData.user
      setUser(u)
      const allCourses = coursesData.courses || []
      setCourses(allCourses.filter((c: any) => c.instructorId === u.id))
      setLoading(false)
    })
  }, [])

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans" dir="rtl">
      <Navbar currentUser={user} />

      <div className="flex-1 max-w-7xl w-full mx-auto flex">
        <Sidebar role="INSTRUCTOR" activeTab="my-courses" />

        <main className="flex-1 p-6 space-y-6 overflow-y-auto">
          <div className="flex items-center gap-3">
            <BookOpen className="w-7 h-7 text-brand-purple" />
            <h1 className="text-xl font-black">كورساتي المضافة</h1>
          </div>

          {loading ? (
            <p className="text-xs text-slate-400 text-center py-8">جاري تحميل البيانات...</p>
          ) : courses.length === 0 ? (
            <div className="text-center py-12 space-y-3">
              <BookOpen className="w-12 h-12 text-slate-300 mx-auto" />
              <p className="text-xs text-slate-500">لم تقم بإضافة أي كورس بعد</p>
              <Link
                href="/instructor/create-course"
                className="inline-block px-5 py-2.5 bg-brand-purple text-white text-xs font-bold rounded-xl hover:bg-brand-purple-hover transition shadow"
              >
                إنشاء كورس جديد
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
               {courses.map((course) => {
                 return (
                  <div
                    key={course.id}
                    className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition"
                  >
                    <div className="relative h-40 bg-slate-100 dark:bg-slate-800">
                      <img
                        src={course.thumbnail || 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&auto=format&fit=crop&q=80'}
                        alt={course.title}
                        className="w-full h-full object-cover"
                      />
                      <span className="absolute top-3 right-3 px-2.5 py-1 bg-brand-purple text-white text-[10px] font-bold rounded-lg">
                        {course.price === 0 ? 'مجاني' : `${course.price} ج.م`}
                      </span>
                    </div>
                    <div className="p-4 space-y-3">
                      <h3 className="text-sm font-black line-clamp-2">{course.title}</h3>
                      <p className="text-[11px] text-slate-500 line-clamp-2">{course.description}</p>
                      <div className="flex items-center gap-3 text-[11px] text-slate-500">
                        <span className="flex items-center gap-1">
                          <Users className="w-3.5 h-3.5" />
                          {course.studentsCount} طالب
                        </span>
                        <span className="flex items-center gap-1">
                          <Star className="w-3.5 h-3.5 text-amber-500 fill-current" />
                          {course.rating}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          {course.duration}
                        </span>
                      </div>
                      <div className="flex gap-2">
                        <Link
                          href={`/instructor/assignments?courseId=${course.id}`}
                          className="flex-1 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[10px] font-bold rounded-xl flex items-center justify-center gap-1 hover:bg-slate-200 transition"
                        >
                          <Edit className="w-3.5 h-3.5" />
                          إدارة الدروس
                        </Link>
                        <Link
                          href={`/instructor/quizzes?courseId=${course.id}`}
                          className="flex-1 py-2 bg-brand-purple text-white text-[10px] font-bold rounded-xl flex items-center justify-center gap-1 hover:bg-brand-purple-hover transition"
                        >
                          الاختبارات
                        </Link>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
