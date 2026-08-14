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
    setLoading(true)
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

  const handleRevoke = async (id: string) => {
    if (!confirm(t('confirmRevokeCertificate'))) return
    try {
      const res = await fetch(`/api/admin/certificates?id=${id}`, { method: 'DELETE' })
      if (res.ok) {
        fetchCertificates()
      }
    } catch (e) {
      console.error(e)
    }
  }

  const filteredCerts = certificates.filter((c) =>
    c.user.name.toLowerCase().includes(search.toLowerCase()) ||
    c.course.title.toLowerCase().includes(search.toLowerCase()) ||
    c.certCode.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans" dir="rtl">
      <Navbar currentUser={user} />

      <div className="flex-1 max-w-7xl w-full mx-auto flex">
        <Sidebar role="ADMIN" activeTab="certificates" />

        <main className="flex-1 p-6 space-y-6 overflow-y-auto">
          <div className="bg-gradient-to-r from-purple-950 via-slate-900 to-brand-purple text-white p-6 rounded-2xl shadow-lg flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-black">{t('certificatesRecord')}</h1>
              <p className="text-xs text-purple-200 mt-1">{t('certificatesDescription')}</p>
            </div>
            <span className="px-3.5 py-1.5 bg-brand-orange text-white text-xs font-black rounded-full shadow">
              {certificates.length} {t('certificates')}
            </span>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
            <div className="relative">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                 placeholder={t('searchCertificatesPlaceholder')}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pr-10 pl-4 py-2 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium text-slate-800 dark:text-slate-200 outline-none focus:ring-2 focus:ring-brand-purple/50"
              />
            </div>

            {loading ? (
              <div className="text-center py-12 text-slate-400 text-xs">{t('loading')}</div>
            ) : filteredCerts.length === 0 ? (
              <div className="text-center py-12 text-slate-400 text-xs">{t('noCertificates')}</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-right text-xs">
                  <thead>
                     <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 font-bold">
                       <th className="py-3 px-4">{t('student')}</th>
                       <th className="py-3 px-4">{t('course')}</th>
                       <th className="py-3 px-4">{t('certificateCode')}</th>
                       <th className="py-3 px-4">{t('issuedAt')}</th>
                       <th className="py-3 px-4">{t('actions')}</th>
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                    {filteredCerts.map((c) => (
                      <tr key={c.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-brand-purple text-white font-bold flex items-center justify-center text-xs">
                              {c.user.name.charAt(0)}
                            </div>
                            <div>
                              <span className="font-bold text-slate-800 dark:text-slate-200 block">{c.user.name}</span>
                              <span className="text-[10px] text-slate-400">{c.user.email}</span>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-slate-500">{c.course.title}</td>
                        <td className="py-3 px-4">
                          <span className="px-2 py-1 bg-brand-purple/10 text-brand-purple rounded-lg font-mono font-bold">
                            {c.certCode}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-slate-500 flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {new Date(c.issuedAt).toLocaleDateString('ar-EG')}
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => setShowQR(showQR === c.id ? null : c.id)}
                              className="p-1.5 hover:bg-blue-50 dark:hover:bg-slate-800 text-blue-600 rounded-lg transition"
                               title={t('viewQR')}
                            >
                              <QrCode className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleRevoke(c.id)}
                              className="p-1.5 hover:bg-rose-50 dark:hover:bg-slate-800 text-rose-600 rounded-lg transition"
                               title={t('revokeCertificate')}
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

          {showQR && (
            <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
              <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 max-w-sm w-full shadow-2xl">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">QR Code</h3>
                  <button
                    onClick={() => setShowQR(null)}
                    className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
                  >
                    <XIcon className="w-4 h-4" />
                  </button>
                </div>
                <div className="flex items-center justify-center bg-slate-100 dark:bg-slate-800 rounded-xl p-6">
                  <div className="w-48 h-48 bg-white rounded-lg flex items-center justify-center">
                    <div className="text-center">
                      <QrCode className="w-24 h-24 text-brand-purple mx-auto" />
                      <p className="text-xs font-bold text-slate-600 mt-2">QR Simulation</p>
                    </div>
                  </div>
                </div>
                 <p className="text-xs text-slate-500 mt-3 text-center">{t('scanQRToVerify')}</p>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
