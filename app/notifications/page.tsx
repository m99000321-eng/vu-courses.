'use client'

import React, { useEffect, useState } from 'react'
import { Navbar } from '@/components/navbar'
import { Sidebar } from '@/components/sidebar'
import { Bell, Sparkles } from 'lucide-react'
import { useLanguage } from '@/components/language-provider'

export default function NotificationsPage() {
  const { t } = useLanguage()
  const [user, setUser] = useState<any>(null)
  const [notifications, setNotifications] = useState<any[]>([])

  useEffect(() => {
    fetch('/api/auth/me')
      .then((res) => res.json())
      .then((d) => setUser(d.user))

    fetch('/api/notifications')
      .then((res) => res.json())
      .then((d) => setNotifications(d.notifications || []))
  }, [])

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans" dir="rtl">
      <Navbar currentUser={user} />
      <div className="flex-1 max-w-7xl w-full mx-auto flex">
        <Sidebar role={user?.role || 'STUDENT'} activeTab="notifications" />
        <main className="flex-1 p-6 space-y-6">
          <div className="flex items-center gap-3">
            <Bell className="w-7 h-7 text-brand-orange" />
            <h1 className="text-xl font-black">{t('allNotifications')}</h1>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-3">
            {notifications.length === 0 ? (
              <p className="text-xs text-slate-400 text-center py-8">{t('noNotifications')}</p>
            ) : (
              notifications.map((n) => (
                <div
                  key={n.id}
                  className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700 flex items-start gap-3"
                >
                  <div className="p-2 bg-purple-50 dark:bg-slate-700 rounded-lg text-brand-purple">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-slate-800 dark:text-slate-200">{n.title}</h4>
                    <p className="text-xs text-slate-500 mt-1">{n.message}</p>
                    <span className="text-[10px] text-slate-400 mt-2 block">
                      {new Date(n.createdAt).toLocaleDateString('ar-EG')}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </main>
      </div>
    </div>
  )
}
