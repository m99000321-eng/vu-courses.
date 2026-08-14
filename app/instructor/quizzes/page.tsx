'use client'

import React, { useEffect, useState } from 'react'
import { Navbar } from '@/components/navbar'
import { Sidebar } from '@/components/sidebar'
import { HelpCircle, Plus, Trash2, Save, Loader2, ChevronDown, ListChecks } from 'lucide-react'

interface Quiz {
  id: string
  title: string
  passingScore: number
  timeLimitMinutes: number
  questions: { id: string; questionText: string; type: string }[]
  lessonTitle: string
  levelTitle: string
}

interface Lesson {
  id: string
  title: string
}

interface Level {
  id: string
  title: string
  lessons: Lesson[]
}

export default function QuizzesPage() {
  const [user, setUser] = useState<any>(null)
  const [quizzes, setQuizzes] = useState<Quiz[]>([])
  const [levels, setLevels] = useState<Level[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreate, setShowCreate] = useState(false)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  const [newQuiz, setNewQuiz] = useState({ lessonId: '', title: '', passingScore: 70, timeLimitMinutes: 15 })

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
        const allLevels = instructorCourses.flatMap((c: any) => c.levels)
        setLevels(allLevels)
        const allQuizzes: Quiz[] = []
        instructorCourses.forEach((c: any) => {
          c.levels.forEach((l: any) => {
            l.lessons.forEach((ls: any) => {
              if (ls.quizzes && ls.quizzes.length > 0) {
                ls.quizzes.forEach((q: any) => {
                  allQuizzes.push({ ...q, lessonTitle: ls.title, levelTitle: l.title })
                })
              }
            })
          })
        })
        setQuizzes(allQuizzes)
        setLoading(false)
      })
  }, [user])

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      const res = await fetch('/api/instructor/quizzes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newQuiz),
      })
      const data = await res.json()
      if (res.ok) {
        setQuizzes([...quizzes, { ...data.quiz, lessonTitle: '', levelTitle: '' }])
        setShowCreate(false)
        setNewQuiz({ lessonId: '', title: '', passingScore: 70, timeLimitMinutes: 15 })
        setMessage('تم إنشاء الاختبار بنجاح')
        setTimeout(() => setMessage(''), 3000)
      } else {
        setMessage(data.error || 'حدث خطأ')
      }
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (quizId: string) => {
    if (!confirm('حذف هذا الاختبار؟')) return
    try {
      await fetch(`/api/instructor/quizzes/${quizId}`, { method: 'DELETE' })
      setQuizzes(quizzes.filter((q) => q.id !== quizId))
      setMessage('تم حذف الاختبار')
      setTimeout(() => setMessage(''), 3000)
    } catch {
      console.error('Delete failed')
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans" dir="rtl">
      <Navbar currentUser={user} />

      <div className="flex-1 max-w-7xl w-full mx-auto flex">
        <Sidebar role="INSTRUCTOR" activeTab="quizzes" />

        <main className="flex-1 p-6 space-y-6 overflow-y-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <HelpCircle className="w-7 h-7 text-brand-purple" />
              <h1 className="text-xl font-black">إدارة الاختبارات</h1>
            </div>
            <button
              onClick={() => setShowCreate(!showCreate)}
              className="px-4 py-2 bg-brand-purple text-white text-xs font-bold rounded-xl flex items-center gap-1 hover:bg-brand-purple-hover transition"
            >
              <Plus className="w-4 h-4" />
              اختبار جديد
            </button>
          </div>

          {message && (
            <div className="p-4 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 rounded-xl text-xs text-emerald-700 dark:text-emerald-400">
              {message}
            </div>
          )}

          {showCreate && (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
              <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">إنشاء اختبار جديد</h3>
              <form onSubmit={handleCreate} className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">الدرس</label>
                  <div className="relative">
                    <select
                      required
                      value={newQuiz.lessonId}
                      onChange={(e) => setNewQuiz({ ...newQuiz, lessonId: e.target.value })}
                      className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold outline-none focus:ring-2 focus:ring-brand-purple appearance-none"
                    >
                      <option value="">اختر الدرس</option>
                      {levels.flatMap((l) =>
                        l.lessons.map((ls) => (
                          <option key={ls.id} value={ls.id}>{l.title} - {ls.title}</option>
                        ))
                      )}
                    </select>
                    <ChevronDown className="absolute left-3 top-3.5 w-4 h-4 text-slate-400 pointer-events-none" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">عنوان الاختبار</label>
                  <input
                    type="text"
                    required
                    value={newQuiz.title}
                    onChange={(e) => setNewQuiz({ ...newQuiz, title: e.target.value })}
                    placeholder="مثال: اختبار المستوى الأول"
                    className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold outline-none focus:ring-2 focus:ring-brand-purple"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">نسبة النجاح</label>
                    <input
                      type="number"
                      value={newQuiz.passingScore}
                      onChange={(e) => setNewQuiz({ ...newQuiz, passingScore: parseInt(e.target.value) || 0 })}
                      className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold outline-none focus:ring-2 focus:ring-brand-purple"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">الوقت (دقيقة)</label>
                    <input
                      type="number"
                      value={newQuiz.timeLimitMinutes}
                      onChange={(e) => setNewQuiz({ ...newQuiz, timeLimitMinutes: parseInt(e.target.value) || 0 })}
                      className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold outline-none focus:ring-2 focus:ring-brand-purple"
                    />
                  </div>
                </div>
                <button type="submit" disabled={saving} className="px-5 py-2.5 bg-brand-purple text-white text-xs font-bold rounded-xl flex items-center gap-2 disabled:opacity-50">
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  إنشاء الاختبار
                </button>
              </form>
            </div>
          )}

          {loading ? (
            <p className="text-xs text-slate-400 text-center py-8">جاري تحميل البيانات...</p>
          ) : quizzes.length === 0 ? (
            <div className="text-center py-12 space-y-3">
              <HelpCircle className="w-12 h-12 text-slate-300 mx-auto" />
              <p className="text-xs text-slate-500">لا يوجد اختبارات بعد</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {quizzes.map((quiz) => (
                <div
                  key={quiz.id}
                  className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <h3 className="text-sm font-black">{quiz.title}</h3>
                      <p className="text-[11px] text-slate-500">{quiz.levelTitle} • {quiz.lessonTitle}</p>
                    </div>
                    <button
                      onClick={() => handleDelete(quiz.id)}
                      className="p-2 text-rose-600 hover:bg-rose-50 rounded-lg transition"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="flex items-center gap-3 text-[11px] text-slate-500">
                    <span className="flex items-center gap-1 px-2 py-1 bg-purple-50 text-brand-purple font-bold rounded-lg">
                      <ListChecks className="w-3.5 h-3.5" />
                      {quiz.questions.length} سؤال
                    </span>
                    <span className="px-2 py-1 bg-emerald-50 text-emerald-600 font-bold rounded-lg">
                      نجاح: {quiz.passingScore}%
                    </span>
                    <span className="px-2 py-1 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold rounded-lg">
                      {quiz.timeLimitMinutes} دقيقة
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
