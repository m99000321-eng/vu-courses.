'use client'

import React, { useEffect, useState } from 'react'
import { Navbar } from '@/components/navbar'
import { Sidebar } from '@/components/sidebar'
import { User, Mail, Wallet, FileText, Save, Loader2 } from 'lucide-react'

interface UserProfile {
  id: string
  name: string
  email: string
  role: 'INSTRUCTOR' | 'ADMIN' | 'STUDENT'
  avatar?: string
  bio?: string
  walletBalance: number
  createdAt: string
}

export default function ProfilePage() {
  const [user, setUser] = useState<UserProfile | null>(null)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [editing, setEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({ name: '', bio: '' })

  useEffect(() => {
    Promise.all([
      fetch('/api/auth/me').then((res) => res.json()),
      fetch('/api/profile').then((res) => res.json()),
    ]).then(([userData, profileData]) => {
      const u = userData.user
      const p = profileData.user
      setUser(u)
      setProfile(p)
      setForm({ name: p.name || '', bio: p.bio || '' })
    })
  }, [])

  const handleSave = async () => {
    setSaving(true)
    try {
      const res = await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (res.ok) {
        setProfile(data.user)
        setEditing(false)
      }
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans" dir="rtl">
      <Navbar currentUser={user} />

      <div className="flex-1 max-w-7xl w-full mx-auto flex">
        <Sidebar role="STUDENT" activeTab="profile" />

        <main className="flex-1 p-6 space-y-6 overflow-y-auto">
          <div className="flex items-center gap-3">
            <User className="w-7 h-7 text-brand-purple" />
            <h1 className="text-xl font-black">الملف الشخصي</h1>
          </div>

          {profile ? (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-6">
              {/* Profile Header */}
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 rounded-full bg-brand-purple text-white font-black flex items-center justify-center text-2xl ring-4 ring-brand-orange/30 overflow-hidden shrink-0">
                  {profile.avatar ? (
                    <img src={profile.avatar} alt={profile.name} className="w-full h-full object-cover" />
                  ) : (
                    profile.name.charAt(0)
                  )}
                </div>
                <div className="space-y-1">
                  <h2 className="text-lg font-black">{profile.name}</h2>
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <Mail className="w-3.5 h-3.5" />
                    {profile.email}
                  </div>
                  <span className="inline-block px-2.5 py-1 bg-purple-50 text-brand-purple font-bold text-xs rounded-lg">
                    {profile.role === 'STUDENT' ? 'طالب' : profile.role === 'INSTRUCTOR' ? 'محاضر' : 'أدمن'}
                  </span>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-xl flex items-center gap-3">
                  <div className="p-2 bg-purple-50 dark:bg-slate-700 text-brand-purple rounded-lg">
                    <Wallet className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-500 font-semibold">الرصيد الحالي</p>
                    <p className="text-sm font-black text-slate-800 dark:text-slate-100">
                      {profile.walletBalance.toFixed(0)} ج.م
                    </p>
                  </div>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-xl flex items-center gap-3">
                  <div className="p-2 bg-orange-50 dark:bg-slate-700 text-brand-orange rounded-lg">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-500 font-semibold">تاريخ التسجيل</p>
                    <p className="text-sm font-black text-slate-800 dark:text-slate-100">
                      {new Date(profile.createdAt).toLocaleDateString('ar-EG')}
                    </p>
                  </div>
                </div>
              </div>

              {/* Edit Form */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">معلومات أساسية</h3>
                  {!editing && (
                    <button
                      onClick={() => setEditing(true)}
                      className="px-4 py-2 bg-brand-purple text-white text-xs font-bold rounded-xl hover:bg-brand-purple-hover transition shadow"
                    >
                      تعديل
                    </button>
                  )}
                </div>

                {editing ? (
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">الاسم</label>
                      <input
                        type="text"
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-brand-purple"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">نبذة شخصية</label>
                      <textarea
                        value={form.bio}
                        onChange={(e) => setForm({ ...form, bio: e.target.value })}
                        rows={4}
                        className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-brand-purple resize-none"
                      />
                    </div>
                    <div className="flex gap-3">
                      <button
                        onClick={handleSave}
                        disabled={saving}
                        className="px-5 py-2.5 bg-brand-purple text-white text-xs font-bold rounded-xl hover:bg-brand-purple-hover transition shadow flex items-center gap-2 disabled:opacity-50"
                      >
                        {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                        حفظ التغييرات
                      </button>
                      <button
                        onClick={() => {
                          setEditing(false)
                          setForm({ name: profile.name, bio: profile.bio || '' })
                        }}
                        className="px-5 py-2.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold rounded-xl hover:bg-slate-200 transition"
                      >
                        إلغاء
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-xl">
                      <p className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">الاسم</p>
                      <p className="text-sm text-slate-600 dark:text-slate-400">{profile.name}</p>
                    </div>
                    <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-xl">
                      <p className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">البريد الإلكتروني</p>
                      <p className="text-sm text-slate-600 dark:text-slate-400">{profile.email}</p>
                    </div>
                    <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-xl">
                      <p className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">نبذة شخصية</p>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        {profile.bio || 'لا توجد نبذة شخصية'}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <p className="text-xs text-slate-400 text-center py-8">جاري تحميل البيانات...</p>
          )}
        </main>
      </div>
    </div>
  )
}
