'use client'

import React, { useState, useEffect } from 'react'
import { Navbar } from '@/components/navbar'
import { Sidebar } from '@/components/sidebar'
import {
  Settings,
  Save,
  RefreshCw,
  Globe,
  Mail,
  Shield,
  ToggleLeft,
  ToggleRight,
} from 'lucide-react'
import { useLanguage } from '@/components/language-provider'

interface Settings {
  siteName: string
  siteDescription: string
  contactEmail: string
  supportPhone: string
  smtpHost: string
  smtpPort: string
  smtpUser: string
  smtpPass: string
  maintenanceMode: boolean
  logoUrl: string
  facebookUrl: string
  twitterUrl: string
  instagramUrl: string
}

export default function AdminSettings() {
  const { t } = useLanguage()
  const [user, setUser] = useState<any>(null)
  const [settings, setSettings] = useState<Settings>({
    siteName: '',
    siteDescription: '',
    contactEmail: '',
    supportPhone: '',
    smtpHost: '',
    smtpPort: '',
    smtpUser: '',
    smtpPass: '',
    maintenanceMode: false,
    logoUrl: '',
    facebookUrl: '',
    twitterUrl: '',
    instagramUrl: '',
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    fetchUser()
    fetchSettings()
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

  const fetchSettings = async () => {
    setLoading(false)
    try {
      const res = await fetch('/api/admin/settings')
      if (res.ok) {
        const data = await res.json()
        if (data.settings) {
          setSettings({ ...settings, ...data.settings })
        }
      }
    } catch (e) {
      console.error(e)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setMessage('')
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      })

      if (res.ok) {
        setMessage(t('settingsSaved'))
        setTimeout(() => setMessage(''), 3000)
      } else {
        setMessage(t('settingsSaveFailed'))
      }
    } catch (e) {
      console.error(e)
      setMessage(t('unexpectedError'))
    } finally {
      setSaving(false)
    }
  }

  const handleChange = (field: keyof Settings, value: string | boolean) => {
    setSettings({ ...settings, [field]: value })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans" dir="rtl">
        <Navbar currentUser={user} />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <RefreshCw className="w-8 h-8 animate-spin text-brand-purple mx-auto mb-2" />
             <p className="text-xs text-slate-500">{t('loadingSettings')}</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans" dir="rtl">
      <Navbar currentUser={user} />

      <div className="flex-1 max-w-7xl w-full mx-auto flex">
        <Sidebar role="ADMIN" activeTab="settings" />

        <main className="flex-1 p-6 space-y-6 overflow-y-auto">
          <div className="bg-gradient-to-r from-purple-950 via-slate-900 to-brand-purple text-white p-6 rounded-2xl shadow-lg">
            <div className="flex items-center gap-3">
              <Settings className="w-6 h-6" />
              <div>
                 <h1 className="text-2xl font-black">{t('platformSettings')}</h1>
                 <p className="text-xs text-purple-200 mt-1">{t('platformSettingsDescription')}</p>
              </div>
            </div>
          </div>

          {message && (
            <div className={`p-4 rounded-xl text-xs font-bold ${message.includes('نجاح') ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' : 'bg-rose-50 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400'}`}>
              {message}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
              <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                <Globe className="w-4 h-4 text-brand-purple" />
                 المعلومات العامة
               </h3>
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                 <div>
                   <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1">{t('siteName')}</label>
                  <input
                    type="text"
                    value={settings.siteName}
                    onChange={(e) => handleChange('siteName', e.target.value)}
                    className="w-full px-4 py-2 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium text-slate-800 dark:text-slate-200 outline-none focus:ring-2 focus:ring-brand-purple/50"
                  />
                </div>
                <div>
                   <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1">{t('siteDescription')}</label>
                  <input
                    type="text"
                    value={settings.siteDescription}
                    onChange={(e) => handleChange('siteDescription', e.target.value)}
                    className="w-full px-4 py-2 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium text-slate-800 dark:text-slate-200 outline-none focus:ring-2 focus:ring-brand-purple/50"
                  />
                </div>
                <div>
                   <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1">{t('logoUrl')}</label>
                  <input
                    type="text"
                    value={settings.logoUrl}
                    onChange={(e) => handleChange('logoUrl', e.target.value)}
                    className="w-full px-4 py-2 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium text-slate-800 dark:text-slate-200 outline-none focus:ring-2 focus:ring-brand-purple/50"
                  />
                </div>
                <div>
                   <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1">{t('supportEmail')}</label>
                  <input
                    type="email"
                    value={settings.contactEmail}
                    onChange={(e) => handleChange('contactEmail', e.target.value)}
                    className="w-full px-4 py-2 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium text-slate-800 dark:text-slate-200 outline-none focus:ring-2 focus:ring-brand-purple/50"
                  />
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
              <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                <Mail className="w-4 h-4 text-brand-orange" />
                 إعدادات البريد الإلكتروني
               </h3>
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                 <div>
                   <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1">{t('smtpHost')}</label>
                  <input
                    type="text"
                    value={settings.smtpHost}
                    onChange={(e) => handleChange('smtpHost', e.target.value)}
                    className="w-full px-4 py-2 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium text-slate-800 dark:text-slate-200 outline-none focus:ring-2 focus:ring-brand-purple/50"
                  />
                </div>
                <div>
                   <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1">{t('smtpPort')}</label>
                  <input
                    type="text"
                    value={settings.smtpPort}
                    onChange={(e) => handleChange('smtpPort', e.target.value)}
                    className="w-full px-4 py-2 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium text-slate-800 dark:text-slate-200 outline-none focus:ring-2 focus:ring-brand-purple/50"
                  />
                </div>
                <div>
                   <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1">{t('smtpUsername')}</label>
                  <input
                    type="text"
                    value={settings.smtpUser}
                    onChange={(e) => handleChange('smtpUser', e.target.value)}
                    className="w-full px-4 py-2 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium text-slate-800 dark:text-slate-200 outline-none focus:ring-2 focus:ring-brand-purple/50"
                  />
                </div>
                <div>
                   <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1">{t('smtpPassword')}</label>
                  <input
                    type="password"
                    value={settings.smtpPass}
                    onChange={(e) => handleChange('smtpPass', e.target.value)}
                    className="w-full px-4 py-2 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium text-slate-800 dark:text-slate-200 outline-none focus:ring-2 focus:ring-brand-purple/50"
                  />
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
              <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                <Shield className="w-4 h-4 text-rose-600" />
                 إعدادات النظام
               </h3>
               <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
                 <div>
                   <p className="text-xs font-bold text-slate-800 dark:text-slate-200">{t('maintenanceMode')}</p>
                   <p className="text-[10px] text-slate-500">{t('maintenanceModeDescription')}</p>
                </div>
                <button
                  type="button"
                  onClick={() => handleChange('maintenanceMode', !settings.maintenanceMode)}
                  className="p-1"
                >
                  {settings.maintenanceMode ? (
                    <ToggleRight className="w-8 h-8 text-brand-purple" />
                  ) : (
                    <ToggleLeft className="w-8 h-8 text-slate-300" />
                  )}
                </button>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="submit"
                disabled={saving}
                className="px-6 py-3 bg-brand-purple text-white text-xs font-bold rounded-xl hover:bg-brand-purple-hover transition flex items-center gap-2 disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                 {saving ? t('saving') : t('saveSettings')}
               </button>
               <button
                 type="button"
                 onClick={fetchSettings}
                 className="px-6 py-3 bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold rounded-xl hover:bg-slate-300 dark:hover:bg-slate-700 transition flex items-center gap-2"
               >
                 <RefreshCw className="w-4 h-4" />
                 {t('reload')}
               </button>
            </div>
          </form>
        </main>
      </div>
    </div>
  )
}
