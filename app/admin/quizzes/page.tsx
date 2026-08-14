'use client'

import React, { useState, useEffect } from 'react'
import { Navbar } from '@/components/navbar'
import { Sidebar } from '@/components/sidebar'
import {
  Search,
  PlusCircle,
  Edit,
  Trash2,
  Clock,
} from 'lucide-react'
import { useLanguage } from '@/components/language-provider'

interface Quiz {
  id: string
  title: string
  passingScore: number
  timeLimitMinutes: number
  lesson: {
    id: string
    title: string
    level: {
      id: string
      title: string
      course: { id: string; title: string }
    }
  }
  _count: { questions: number; attempts: number }
}

export default function AdminQuizzes() {
  const { t } = useLanguage()
  const [user, setUser] = useState<any>(null)
  const [quizzes, setQuizzes] = useState<Quiz[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState({ lessonId: '', title: '', passingScore: '70', timeLimitMinutes: '15' })

  useEffect(() => {
    fetchUser()
    fetchQuizzes()
  }, [])

  const fetchUser = async () => {
    try {
      const res = await fetch('/api/auth/me')
      if (res.ok) {
        const data = await res.json()
        setUser(data.user)
      }
    } catch (e) {
      console.error(e)
    }
  }

  const fetchQuizzes = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/quizzes')
      if (res.ok) {
        const data = await res.json()
        setQuizzes(data.quizzes || [])
      }
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const method = editingId ? 'PUT' : 'POST'
      const body = editingId
        ? { id: editingId, title: formData.title, passingScore: formData.passingScore, timeLimitMinutes: formData.timeLimitMinutes }
        : formData

      const res = await fetch('/api/quizzes', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })

      if (res.ok) {
        fetchQuizzes()
        resetForm()
      }
    } catch (e) {
      console.error(e)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm(t('confirmDeleteQuiz'))) return
    try {
      const res = await fetch(`/api/quizzes?id=${id}`, { method: 'DELETE' })
      if (res.ok) {
        fetchQuizzes()
      }
    } catch (e) {
      console.error(e)
    }
  }

  const resetForm = () => {
    setShowForm(false)
    setEditingId(null)
    setFormData({ lessonId: '', title: '', passingScore: '70', timeLimitMinutes: '15' })
  }

  const startEdit = (quiz: Quiz) => {
    setEditingId(quiz.id)
    setFormData({
      lessonId: quiz.lesson.id,
      title: quiz.title,
      passingScore: String(quiz.passingScore),
      timeLimitMinutes: String(quiz.timeLimitMinutes),
    })
    setShowForm(true)
  }

  const filteredQuizzes = quizzes.filter((q) =>
    q.title.toLowerCase().includes(search.toLowerCase()) ||
    q.lesson.level.course.title.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans" dir="rtl">
      <Navbar currentUser={user} />

      <div className="flex-1 max-w-7xl w-full mx-auto flex">
        <Sidebar role="ADMIN" activeTab="quizzes" />

        <main className="flex-1 p-6 space-y-6 overflow-y-auto">
          <div className="bg-gradient-to-r from-purple-950 via-slate-900 to-brand-purple text-white p-6 rounded-2xl shadow-lg flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-black">{t('manageQuizzes')}</h1>
              <p className="text-xs text-purple-200 mt-1">{t('quizzesDescription')}</p>
            </div>
            <button
              onClick={() => resetForm()}
              className="px-4 py-2 bg-brand-orange text-white text-xs font-black rounded-xl hover:bg-brand-orange-hover transition flex items-center gap-2"
            >
              <PlusCircle className="w-4 h-4" />
              {t('addQuiz')}
            </button>
          </div>

          {showForm && (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
              <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 mb-4">
                {editingId ? t('editQuiz') : t('addNewQuiz')}
              </h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                     <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1">{t('quizTitle')}</label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      required
                      className="w-full px-4 py-2 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium text-slate-800 dark:text-slate-200 outline-none focus:ring-2 focus:ring-brand-purple/50"
                    />
                  </div>
                  <div>
                     <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1">{t('passingScoreLabel')} (%)</label>
                    <input
                      type="number"
                      value={formData.passingScore}
                      onChange={(e) => setFormData({ ...formData, passingScore: e.target.value })}
                      className="w-full px-4 py-2 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium text-slate-800 dark:text-slate-200 outline-none focus:ring-2 focus:ring-brand-purple/50"
                    />
                  </div>
                  <div>
                     <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1">{t('timeLabel')} ({t('minutes')})</label>
                    <input
                      type="number"
                      value={formData.timeLimitMinutes}
                      onChange={(e) => setFormData({ ...formData, timeLimitMinutes: e.target.value })}
                      className="w-full px-4 py-2 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium text-slate-800 dark:text-slate-200 outline-none focus:ring-2 focus:ring-brand-purple/50"
                    />
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="submit"
                    className="px-6 py-2 bg-brand-purple text-white text-xs font-bold rounded-xl hover:bg-brand-purple-hover transition"
                  >
                     {editingId ? t('update') : t('add')}
                  </button>
                  <button
                    type="button"
                    onClick={resetForm}
                    className="px-6 py-2 bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold rounded-xl hover:bg-slate-300 dark:hover:bg-slate-700 transition"
                  >
                     {t('cancel')}
                  </button>
                </div>
              </form>
            </div>
          )}

          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
            <div className="relative">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                 placeholder={t('searchQuizzesPlaceholder')}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pr-10 pl-4 py-2 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium text-slate-800 dark:text-slate-200 outline-none focus:ring-2 focus:ring-brand-purple/50"
              />
            </div>

            {loading ? (
              <div className="text-center py-12 text-slate-400 text-xs">{t('loading')}</div>
            ) : filteredQuizzes.length === 0 ? (
              <div className="text-center py-12 text-slate-400 text-xs">{t('noQuizzes')}</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-right text-xs">
                  <thead>
                     <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 font-bold">
                       <th className="py-3 px-4">{t('quiz')}</th>
                       <th className="py-3 px-4">{t('lesson')}</th>
                       <th className="py-3 px-4">{t('course')}</th>
                       <th className="py-3 px-4">{t('passingScore')}</th>
                       <th className="py-3 px-4">{t('time')}</th>
                       <th className="py-3 px-4">{t('questions')}</th>
                       <th className="py-3 px-4">{t('attempts')}</th>
                       <th className="py-3 px-4">{t('actions')}</th>
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                    {filteredQuizzes.map((q) => (
                      <tr key={q.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                        <td className="py-3 px-4 font-bold text-slate-800 dark:text-slate-200">{q.title}</td>
                        <td className="py-3 px-4 text-slate-500">{q.lesson.title}</td>
                        <td className="py-3 px-4 text-slate-500">{q.lesson.level.course.title}</td>
                        <td className="py-3 px-4 font-bold text-brand-purple">{q.passingScore}%</td>
                        <td className="py-3 px-4 text-slate-500 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                           {q.timeLimitMinutes} {t('minutesShort')}
                        </td>
                        <td className="py-3 px-4 text-slate-500">{q._count.questions}</td>
                        <td className="py-3 px-4 text-slate-500">{q._count.attempts}</td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => startEdit(q)}
                              className="p-1.5 hover:bg-blue-50 dark:hover:bg-slate-800 text-blue-600 rounded-lg transition"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(q.id)}
                              className="p-1.5 hover:bg-rose-50 dark:hover:bg-slate-800 text-rose-600 rounded-lg transition"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
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
