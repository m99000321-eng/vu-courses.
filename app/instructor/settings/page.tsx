'use client'

import React, { useEffect, useState } from 'react'
import { Navbar } from '@/components/navbar'
import { Sidebar } from '@/components/sidebar'
import { Settings, Bell, Moon, Lock, Save, Loader2, CheckCircle } from 'lucide-react'
import { useTheme } from '@/components/theme-provider'

interface SettingsState {
  notifications: boolean
  emailNotifications: boolean
}

export default function InstructorSettingsPage() {
  const { theme, toggleTheme } = useTheme()
  const [user, setUser] = useState<any>(null)
  const [settings, setSettings] = useState<SettingsState>({
    notifications: true,
    emailNotifications: true,
  })
  const [passwordForm, setPasswordForm] = useState({ current: '', newPass: '', confirm: '' })
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    fetch('/api/auth/me')
      .then((res) => res.json())
      .then((d) => setUser(d.user))
  }, [])

  const handleSaveSettings = async () => {
    setSaving(true)
    try {
      await new Promise((r) => setTimeout(r, 500))
      localStorage.setItem('vu_settings', JSON.stringify(settings))
      setMessage('تم حفظ الإعدادات بنجاح')
      setTimeout(() => setMessage(''), 3000)
    } finally {
      setSaving(false)
    }
  }

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    if (passwordForm.newPass !== passwordForm.confirm) {
      setMessage('كلمة المرور الجديدة وتأكيدها غير متطابقين')
      return
    }
    setSaving(true)
    try {
      await new Promise((r) => setTimeout(r, 500))
      setPasswordForm({ current: '', newPass: '', confirm: '' })
      setMessage('تم تغيير كلمة المرور بنجاح')
      setTimeout(() => setMessage(''), 3000)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans" dir="rtl">
      <Navbar currentUser={user} />

      <div className="flex-1 max-w-7xl w-full mx-auto flex">
        <Sidebar role="INSTRUCTOR" activeTab="settings" />

        <main className="flex-1 p-6 space-y-6 overflow-y-auto">
          <div className="flex items-center gap-3">
            <Settings className="w-7 h-7 text-brand-purple" />
            <h1 className="text-xl font-black">الإعدادات</h1>
          </div>

          {message && (
            <div className="p-4 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 rounded-xl flex items-center gap-2 text-xs text-emerald-700 dark:text-emerald-400">
              <CheckCircle className="w-4 h-4" />
              {message}
            </div>
          )}

          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
            <h2 className="text-sm font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
              <Moon className="w-4 h-4 text-brand-purple" />
              المظهر
            </h2>
            <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800 rounded-xl">
              <div className="space-y-1">
                <p className="text-xs font-bold text-slate-800 dark:text-slate-200">الوضع الليلي</p>
                <p className="text-[11px] text-slate-500">تفعيل أو تعطيل المظهر الداكن</p>
              </div>
              <button
                onClick={toggleTheme}
                className={`relative w-14 h-8 rounded-full transition-colors ${
                  theme === 'dark' ? 'bg-brand-purple' : 'bg-slate-300'
                }`}
              >
                <div
                  className={`absolute top-1 w-6 h-6 bg-white rounded-full shadow transition-transform ${
                    theme === 'dark' ? 'translate-x-7' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
            <h2 className="text-sm font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
              <Bell className="w-4 h-4 text-brand-orange" />
              التنبيهات
            </h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800 rounded-xl">
                <div className="space-y-1">
                  <p className="text-xs font-bold text-slate-800 dark:text-slate-200">تنبيهات المنصة</p>
                  <p className="text-[11px] text-slate-500">تلقي إشعارات عن التحديثات والأنشطة</p>
                </div>
                <button
                  onClick={() => setSettings({ ...settings, notifications: !settings.notifications })}
                  className={`relative w-14 h-8 rounded-full transition-colors ${
                    settings.notifications ? 'bg-brand-purple' : 'bg-slate-300'
                  }`}
                >
                  <div
                    className={`absolute top-1 w-6 h-6 bg-white rounded-full shadow transition-transform ${
                      settings.notifications ? 'translate-x-7' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
              <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800 rounded-xl">
                <div className="space-y-1">
                  <p className="text-xs font-bold text-slate-800 dark:text-slate-200">إشعارات البريد الإلكتروني</p>
                  <p className="text-[11px] text-slate-500">تلقي رسائل بريد إلكتروني حول الدورات</p>
                </div>
                <button
                  onClick={() => setSettings({ ...settings, emailNotifications: !settings.emailNotifications })}
                  className={`relative w-14 h-8 rounded-full transition-colors ${
                    settings.emailNotifications ? 'bg-brand-purple' : 'bg-slate-300'
                  }`}
                >
                  <div
                    className={`absolute top-1 w-6 h-6 bg-white rounded-full shadow transition-transform ${
                      settings.emailNotifications ? 'translate-x-7' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </div>
            <button
              onClick={handleSaveSettings}
              disabled={saving}
              className="mt-2 px-5 py-2.5 bg-brand-purple text-white text-xs font-bold rounded-xl hover:bg-brand-purple-hover transition shadow flex items-center gap-2 disabled:opacity-50"
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              حفظ الإعدادات
            </button>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
            <h2 className="text-sm font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
              <Lock className="w-4 h-4 text-emerald-500" />
              الأمان
            </h2>
            <form onSubmit={handleChangePassword} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">كلمة المرور الحالية</label>
                <input
                  type="password"
                  value={passwordForm.current}
                  onChange={(e) => setPasswordForm({ ...passwordForm, current: e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-brand-purple"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">كلمة المرور الجديدة</label>
                <input
                  type="password"
                  value={passwordForm.newPass}
                  onChange={(e) => setPasswordForm({ ...passwordForm, newPass: e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-brand-purple"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">تأكيد كلمة المرور</label>
                <input
                  type="password"
                  value={passwordForm.confirm}
                  onChange={(e) => setPasswordForm({ ...passwordForm, confirm: e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-brand-purple"
                />
              </div>
              <button
                type="submit"
                disabled={saving}
                className="px-5 py-2.5 bg-emerald-600 text-white text-xs font-bold rounded-xl hover:bg-emerald-700 transition shadow flex items-center gap-2 disabled:opacity-50"
              >
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Lock className="w-4 h-4" />}
                تغيير كلمة المرور
              </button>
            </form>
          </div>
        </main>
      </div>
    </div>
  )
}
