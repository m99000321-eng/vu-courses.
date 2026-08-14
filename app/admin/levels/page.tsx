'use client'

import React, { useState, useEffect } from 'react'
import { Navbar } from '@/components/navbar'
import { Sidebar } from '@/components/sidebar'
import {
  PlusCircle,
  Edit,
  Trash2,
  Search,
} from 'lucide-react'
import { useLanguage } from '@/components/language-provider'

interface Level {
  id: string
  title: string
  levelNumber: number
  description?: string
  course: { id: string; title: string }
  lessons: { id: string }[]
}

export default function AdminLevels() {
  const { t } = useLanguage()
  const [user, setUser] = useState<any>(null)
  const [levels, setLevels] = useState<Level[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState({ courseId: '', title: '', levelNumber: '', description: '' })

  useEffect(() => {
    fetchUser()
    fetchLevels()
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

  const fetchLevels = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/levels')
      if (res.ok) {
        const data = await res.json()
        setLevels(data.levels || [])
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
        ? { id: editingId, title: formData.title, levelNumber: formData.levelNumber, description: formData.description }
        : formData

      const res = await fetch('/api/levels', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })

      if (res.ok) {
        fetchLevels()
        resetForm()
      }
    } catch (e) {
      console.error(e)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm(t('confirmDeleteLevel'))) return
    try {
      const res = await fetch(`/api/levels?id=${id}`, { method: 'DELETE' })
      if (res.ok) {
        fetchLevels()
      }
    } catch (e) {
      console.error(e)
    }
  }

  const resetForm = () => {
    setShowForm(false)
    setEditingId(null)
    setFormData({ courseId: '', title: '', levelNumber: '', description: '' })
  }

  const startEdit = (level: Level) => {
    setEditingId(level.id)
    setFormData({
      courseId: level.course.id,
      title: level.title,
      levelNumber: String(level.levelNumber),
      description: level.description || '',
    })
    setShowForm(true)
  }

  const filteredLevels = levels.filter((l) =>
    l.title.toLowerCase().includes(search.toLowerCase()) ||
    l.course.title.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans" dir="rtl">
      <Navbar currentUser={user} />

      <div className="flex-1 max-w-7xl w-full mx-auto flex">
        <Sidebar role="ADMIN" activeTab="levels" />

        <main className="flex-1 p-6 space-y-6 overflow-y-auto">
          <div className="bg-gradient-to-r from-purple-950 via-slate-900 to-brand-purple text-white p-6 rounded-2xl shadow-lg flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-black">{t('manageLevels')}</h1>
              <p className="text-xs text-purple-200 mt-1">{t('levelsDescription')}</p>
            </div>
            <button
              onClick={() => resetForm()}
              className="px-4 py-2 bg-brand-orange text-white text-xs font-black rounded-xl hover:bg-brand-orange-hover transition flex items-center gap-2"
            >
              <PlusCircle className="w-4 h-4" />
              {t('addLevel')}
            </button>
          </div>

          {showForm && (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
              <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 mb-4">
                {editingId ? t('editLevel') : t('addNewLevel')}
              </h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                     <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1">{t('levelTitle')}</label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      required
                      className="w-full px-4 py-2 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium text-slate-800 dark:text-slate-200 outline-none focus:ring-2 focus:ring-brand-purple/50"
                    />
                  </div>
                  <div>
                     <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1">{t('levelNumberLabel')}</label>
                    <input
                      type="number"
                      value={formData.levelNumber}
                      onChange={(e) => setFormData({ ...formData, levelNumber: e.target.value })}
                      required
                      className="w-full px-4 py-2 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium text-slate-800 dark:text-slate-200 outline-none focus:ring-2 focus:ring-brand-purple/50"
                    />
                  </div>
                </div>
                <div>
                   <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1">{t('descriptionOptional')}</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={2}
                    className="w-full px-4 py-2 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium text-slate-800 dark:text-slate-200 outline-none focus:ring-2 focus:ring-brand-purple/50 resize-none"
                  />
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
                 placeholder={t('searchLevelsPlaceholder')}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pr-10 pl-4 py-2 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium text-slate-800 dark:text-slate-200 outline-none focus:ring-2 focus:ring-brand-purple/50"
              />
            </div>

            {loading ? (
              <div className="text-center py-12 text-slate-400 text-xs">{t('loading')}</div>
            ) : filteredLevels.length === 0 ? (
              <div className="text-center py-12 text-slate-400 text-xs">{t('noLevels')}</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-right text-xs">
                  <thead>
                     <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 font-bold">
                       <th className="py-3 px-4">{t('level')}</th>
                       <th className="py-3 px-4">{t('course')}</th>
                       <th className="py-3 px-4">{t('levelNumber')}</th>
                       <th className="py-3 px-4">{t('description')}</th>
                       <th className="py-3 px-4">{t('lessonsCount')}</th>
                       <th className="py-3 px-4">{t('actions')}</th>
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                    {filteredLevels.map((l) => (
                      <tr key={l.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                        <td className="py-3 px-4 font-bold text-slate-800 dark:text-slate-200">{l.title}</td>
                        <td className="py-3 px-4 text-slate-500">{l.course.title}</td>
                        <td className="py-3 px-4 text-slate-500">{l.levelNumber}</td>
                        <td className="py-3 px-4 text-slate-500 max-w-xs truncate">{l.description || '-'}</td>
                        <td className="py-3 px-4 text-slate-500">{l.lessons.length}</td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => startEdit(l)}
                              className="p-1.5 hover:bg-blue-50 dark:hover:bg-slate-800 text-blue-600 rounded-lg transition"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(l.id)}
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
