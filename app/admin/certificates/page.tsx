'use client'

import React, { useState, useEffect } from 'react'
import { Navbar } from '@/components/navbar'
import { Sidebar } from '@/components/sidebar'
import {
  Search,
  Trash2,
  QrCode,
  Calendar,
  BookOpen,
  XIcon,
} from 'lucide-react'
import { useLanguage } from '@/components/language-provider'

interface Certificate {
  id: string
  certCode: string
  issuedAt: string
  qrCodeUrl?: string
  user: { id: string; name: string; email: string }
  course: { id: string; title: string; thumbnail: string }
}

export default function AdminCertificates() {
  const { t } = useLanguage()
  const [user, setUser] = useState<any>(null)
  const [certificates, setCertificates] = useState<Certificate[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [showQR, setShowQR] = useState<string | null>(null)

  useEffect(() => {
    fetchUser()
    fetchCertificates()
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

  const fetchCertificates = async () => {
    try {
      const res = await fetch('/api/admin/certificates')
      if (res.ok) {
        const data = await res.json()
        setCertificates(data.certificates || [])
      }
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  const filteredCertificates = certificates.filter((cert) =>
    cert.certCode.toLowerCase().includes(search.toLowerCase()) ||
    cert.user.name.toLowerCase().includes(search.toLowerCase()) ||
    cert.user.email.toLowerCase().includes(search.toLowerCase()) ||
    cert.course.title.toLowerCase().includes(search.toLowerCase())
  )

  const deleteCertificate = async (id: string) => {
    if (!confirm(t('confirmDeleteCertificate'))) return
    try {
      const res = await fetch('/api/admin/certificates', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      })
      if (res.ok) fetchCertificates()
    } catch (e) {
      console.error(e)
    }
  }

  if (loading) {
    return <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center text-slate-500">{t('loading')}</div>
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col" dir="rtl">
      <Navbar currentUser={user} />
      <div className="flex-1 flex">
        <Sidebar role={user?.role || 'ADMIN'} activeTab="certificates" />
        <main className="flex-1 p-4 sm:p-6 space-y-6 overflow-y-auto min-w-0">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-black">{t('certificates')}</h1>
              <p className="text-sm text-slate-500 mt-1">{t('manageCertificates')}</p>
            </div>
            <div className="relative w-full sm:w-80">
              <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder={t('search')} className="w-full p-3 pr-10 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-sm outline-none focus:border-brand-purple" />
              <Search className="absolute right-3 top-3.5 w-4 h-4 text-slate-400" />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {filteredCertificates.map((cert) => (
              <div key={cert.id} className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 shadow-sm">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-black text-sm">{cert.certCode}</p>
                    <p className="text-xs text-slate-500 mt-1">{cert.user.name}</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">{cert.course.title}</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <button onClick={() => setShowQR(cert.id)} className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"><QrCode className="w-4 h-4" /></button>
                    <button onClick={() => deleteCertificate(cert.id)} className="p-1 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-lg text-rose-500"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </div>
                <div className="mt-3 flex items-center gap-2 text-[11px] text-slate-400">
                  <Calendar className="w-3.5 h-3.5" />
                  {new Date(cert.issuedAt).toLocaleDateString('ar-EG')}
                </div>
              </div>
            ))}
          </div>

          {filteredCertificates.length === 0 && (
            <div className="text-center py-12 text-slate-400">{t('noCertificates')}</div>
          )}

          {showQR && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60">
              <div className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl p-6">
                <button onClick={() => setShowQR(null)} className="absolute left-3 top-3 p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"><XIcon className="w-4 h-4" /></button>
                <div className="flex items-center justify-center bg-slate-100 dark:bg-slate-800 rounded-xl p-6">
                  <QrCode className="w-32 h-32 text-slate-400" />
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
