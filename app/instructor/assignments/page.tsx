'use client'

import React, { useEffect, useState } from 'react'
import { Navbar } from '@/components/navbar'
import { Sidebar } from '@/components/sidebar'
import { FileCheck, Plus, Save, Loader2, ChevronDown, Play, FileText, Type, GraduationCap } from 'lucide-react'

interface Lesson {
  id: string
  title: string
  type: string
  duration: string
  order: number
  quizzes: { id: string; title: string }[]
}

interface Level {
  id: string
  title: string
  levelNumber: number
  lessons: Lesson[]
}

interface Course {
  id: string
  title: string
  levels: Level[]
}

export default function AssignmentsPage() {
  const [user, setUser] = useState<any>(null)
  const [courses, setCourses] = useState<Course[]>([])
  const [selectedCourseId, setSelectedCourseId] = useState('')
  const [showAddLesson, setShowAddLesson] = useState(false)
  const [addingToLevelId, setAddingToLevelId] = useState('')
  const [lessonForm, setLessonForm] = useState({ title: '', type: 'VIDEO', contentUrl: '', pdfUrl: '', textContent: '', duration: '15 دقيقة' })
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetch('/api/auth/me')
      .then((res) => res.json())
      .then((d) => setUser(d.user))

    fetch('/api/courses')
      .then((res) => res.json())
      .then((d) => {
        const allCourses = d.courses || []
        const instructorCourses = allCourses.filter((c: any) => c.instructorId === d.user?.id || user?.id)
        setCourses(instructorCourses)
        const params = new URLSearchParams(window.location.search)
        const cid = params.get('courseId') || ''
        setSelectedCourseId(cid)
      })
  }, [])

  const selectedCourse = courses.find((c) => c.id === selectedCourseId)

  const handleAddLesson = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!addingToLevelId || !lessonForm.title) return
    setSaving(true)
    try {
      const res = await fetch('/api/instructor/lessons', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ levelId: addingToLevelId, ...lessonForm }),
      })
      if (res.ok) {
        setShowAddLesson(false)
        setLessonForm({ title: '', type: 'VIDEO', contentUrl: '', pdfUrl: '', textContent: '', duration: '15 دقيقة' })
        setAddingToLevelId('')
        fetchCourses()
      }
    } finally {
      setSaving(false)
    }
  }

  const fetchCourses = async () => {
    const res = await fetch('/api/courses')
    const data = await res.json()
    const allCourses = data.courses || []
    const instructorCourses = allCourses.filter((c: any) => c.instructorId === user.id)
    setCourses(instructorCourses)
  }

  const lessonTypeIcon = (type: string) => {
    if (type === 'VIDEO') return <Play className="w-3.5 h-3.5 text-brand-purple" />
    if (type === 'PDF') return <FileText className="w-3.5 h-3.5 text-brand-orange" />
    return <Type className="w-3.5 h-3.5 text-emerald-600" />
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans" dir="rtl">
      <Navbar currentUser={user} />

      <div className="flex-1 max-w-7xl w-full mx-auto flex">
        <Sidebar role="INSTRUCTOR" activeTab="assignments" />

        <main className="flex-1 p-6 space-y-6 overflow-y-auto">
          <div className="flex items-center gap-3">
            <FileCheck className="w-7 h-7 text-brand-purple" />
            <h1 className="text-xl font-black">المهام والتكليفات</h1>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">اختر الكورس</label>
            <div className="relative">
              <select
                value={selectedCourseId}
                onChange={(e) => setSelectedCourseId(e.target.value)}
                className="w-full sm:w-96 p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-bold outline-none focus:ring-2 focus:ring-brand-purple appearance-none"
              >
                <option value="">اختر كورس</option>
                {courses.map((c) => (
                  <option key={c.id} value={c.id}>{c.title}</option>
                ))}
              </select>
              <ChevronDown className="absolute left-3 top-3.5 w-4 h-4 text-slate-400 pointer-events-none" />
            </div>
          </div>

          {selectedCourse ? (
            <div className="space-y-4">
              {selectedCourse.levels.map((level) => (
                <div key={level.id} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <GraduationCap className="w-5 h-5 text-brand-purple" />
                      <h3 className="text-sm font-black">{level.title}</h3>
                      <span className="text-[10px] text-slate-500 font-bold">المستوى {level.levelNumber}</span>
                    </div>
                    <button
                      onClick={() => { setAddingToLevelId(level.id); setShowAddLesson(true) }}
                      className="px-3 py-1.5 bg-brand-purple text-white text-[10px] font-bold rounded-lg flex items-center gap-1 hover:bg-brand-purple-hover transition"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      إضافة درس
                    </button>
                  </div>

                  {showAddLesson && addingToLevelId === level.id && (
                    <form onSubmit={handleAddLesson} className="p-4 bg-slate-50 dark:bg-slate-800 rounded-xl space-y-3 border border-slate-200 dark:border-slate-700">
                      <input
                        type="text"
                        required
                        placeholder="عنوان الدرس"
                        value={lessonForm.title}
                        onChange={(e) => setLessonForm({ ...lessonForm, title: e.target.value })}
                        className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-bold outline-none focus:ring-2 focus:ring-brand-purple"
                      />
                      <select
                        value={lessonForm.type}
                        onChange={(e) => setLessonForm({ ...lessonForm, type: e.target.value })}
                        className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-bold outline-none focus:ring-2 focus:ring-brand-purple"
                      >
                        <option value="VIDEO">فيديو VIDEO</option>
                        <option value="PDF">ملف PDF</option>
                        <option value="TEXT">نص TEXT</option>
                      </select>
                      <input
                        type="text"
                        placeholder="رابط الفيديو (إذا كان فيديو)"
                        value={lessonForm.contentUrl}
                        onChange={(e) => setLessonForm({ ...lessonForm, contentUrl: e.target.value })}
                        className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-bold outline-none focus:ring-2 focus:ring-brand-purple"
                      />
                      <input
                        type="text"
                        placeholder="رابط PDF (إذا كان ملف)"
                        value={lessonForm.pdfUrl}
                        onChange={(e) => setLessonForm({ ...lessonForm, pdfUrl: e.target.value })}
                        className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-bold outline-none focus:ring-2 focus:ring-brand-purple"
                      />
                      <textarea
                        placeholder="النص (إذا كان نص)"
                        value={lessonForm.textContent}
                        onChange={(e) => setLessonForm({ ...lessonForm, textContent: e.target.value })}
                        className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-bold outline-none focus:ring-2 focus:ring-brand-purple resize-none"
                        rows={2}
                      />
                      <div className="flex gap-2">
                        <button type="submit" disabled={saving} className="px-4 py-2 bg-brand-purple text-white text-xs font-bold rounded-lg flex items-center gap-1 disabled:opacity-50">
                          {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                          حفظ
                        </button>
                        <button type="button" onClick={() => { setShowAddLesson(false); setAddingToLevelId('') }} className="px-4 py-2 bg-slate-200 text-slate-700 text-xs font-bold rounded-lg">
                          إلغاء
                        </button>
                      </div>
                    </form>
                  )}

                  <div className="space-y-2">
                    {level.lessons.map((lesson) => (
                      <div key={lesson.id} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-xl">
                        <div className="flex items-center gap-3">
                          {lessonTypeIcon(lesson.type)}
                          <div>
                            <p className="text-xs font-bold">{lesson.title}</p>
                            <p className="text-[10px] text-slate-500">{lesson.duration} • ترتيب {lesson.order}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-bold px-2 py-1 bg-slate-200 dark:bg-slate-700 rounded-lg">{lesson.type}</span>
                          {lesson.quizzes.length > 0 && (
                            <span className="text-[10px] font-bold px-2 py-1 bg-purple-50 text-brand-purple rounded-lg">اختبار: {lesson.quizzes[0].title}</span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 space-y-3">
              <FileCheck className="w-12 h-12 text-slate-300 mx-auto" />
              <p className="text-xs text-slate-500">اختر كورس لعرض الدروس</p>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
