'use client'

import React, { useEffect, useState } from 'react'
import { Navbar } from '@/components/navbar'
import { Sidebar } from '@/components/sidebar'
import {
  BookOpen,
  Clock,
  Award,
  TrendingUp,
  Play,
  Sparkles,
  Wallet,
} from 'lucide-react'
import Link from 'next/link'
import { useLanguage } from '@/components/language-provider'
import { useRouter } from 'next/navigation'
import { CertificateModal } from '@/components/certificate-modal'

export default function StudentDashboard() {
  const router = useRouter()
  const { t } = useLanguage()
  const [user, setUser] = useState<any>(null)
  const [certificates, setCertificates] = useState<any[]>([])
  const [selectedCert, setSelectedCert] = useState<any>(null)
  const [topUpAmount, setTopUpAmount] = useState('')
  const [isToppingUp, setIsToppingUp] = useState(false)

  useEffect(() => {
    fetch('/api/auth/me')
      .then((res) => res.json())
      .then((d) => setUser(d.user))

    fetch('/api/certificates')
      .then((res) => res.json())
      .then((d) => setCertificates(d.certificates || []))
  }, [])

  const requireAuth = () => {
    if (!user) {
      router.push('/login')
      return false
    }
    return true
  }

  const handleTopUp = async (e: React.FormEvent) => {
    e.preventDefault()
    const amount = parseFloat(topUpAmount)
    if (!amount || amount <= 0) return
    setIsToppingUp(true)
    try {
      const res = await fetch('/api/wallet/topup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount }),
      })
      if (res.ok) {
        const data = await res.json()
        setUser((prev: any) => ({ ...prev, walletBalance: data.walletBalance }))
        setTopUpAmount('')
        alert(t('success'))
      } else {
        alert(t('error'))
      }
    } catch (err) {
      console.error(err)
      alert(t('error'))
    } finally {
      setIsToppingUp(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans page-transition" dir="rtl">
      <Navbar currentUser={user} />

      <div className="flex-1 flex">
        <Sidebar role="STUDENT" activeTab="dashboard" />

        <main className="flex-1 p-4 sm:p-6 space-y-4 sm:space-y-6 overflow-y-auto min-w-0">
          
          {/* Welcome Banner */}
          <div className="bg-gradient-to-r from-brand-purple to-slate-900 text-white p-4 sm:p-6 rounded-2xl shadow-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 animate-fade-in-up">
              <div className="space-y-1">
                <h1 className="text-xl sm:text-2xl font-black">{t('welcomeBack')}، {user?.name || t('student')} 👋</h1>
                <p className="text-xs text-purple-200">{t('welcomeSubtitle')}</p>
              </div>
            <Link
              href="/courses"
              onClick={(e) => {
                if (!requireAuth()) e.preventDefault()
              }}
              className="px-4 sm:px-5 py-2 sm:py-2.5 bg-brand-orange hover:bg-brand-orange-hover text-white text-xs font-bold rounded-xl shadow transition btn-hover whitespace-nowrap"
            >
              {t('continueLearningNow')}
            </Link>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-3 sm:p-4 rounded-2xl shadow-sm flex items-center gap-2 sm:gap-3 card-hover animate-fade-in-up stagger-1">
              <div className="p-2 sm:p-3 bg-purple-50 dark:bg-slate-800 text-brand-purple rounded-xl">
                <BookOpen className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <div>
                <p className="text-[10px] sm:text-[11px] text-slate-500 font-semibold">{t('enrolledCourses')}</p>
                <p className="text-lg sm:text-xl font-black text-slate-800 dark:text-slate-100">3 {t('courses')}</p>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-3 sm:p-4 rounded-2xl shadow-sm flex items-center gap-2 sm:gap-3 card-hover animate-fade-in-up stagger-2">
              <div className="p-2 sm:p-3 bg-orange-50 dark:bg-slate-800 text-brand-orange rounded-xl">
                <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <div>
                <p className="text-[10px] sm:text-[11px] text-slate-500 font-semibold">{t('completionRate')}</p>
                <p className="text-lg sm:text-xl font-black text-brand-purple">68%</p>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-3 sm:p-4 rounded-2xl shadow-sm flex items-center gap-2 sm:gap-3 card-hover animate-fade-in-up stagger-3">
              <div className="p-2 sm:p-3 bg-emerald-50 dark:bg-slate-800 text-emerald-600 rounded-xl">
                <Award className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <div>
                <p className="text-[10px] sm:text-[11px] text-slate-500 font-semibold">{t('certificates')}</p>
                <p className="text-lg sm:text-xl font-black text-slate-800 dark:text-slate-100">{certificates.length || 1} {t('certificates')}</p>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-3 sm:p-4 rounded-2xl shadow-sm flex items-center gap-2 sm:gap-3 card-hover animate-fade-in-up stagger-4">
              <div className="p-2 sm:p-3 bg-blue-50 dark:bg-slate-800 text-blue-600 rounded-xl">
                <Clock className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <div>
                <p className="text-[10px] sm:text-[11px] text-slate-500 font-semibold">{t('studyHours')}</p>
                <p className="text-lg sm:text-xl font-black text-slate-800 dark:text-slate-100">14.5 {t('hoursStudied')}</p>
              </div>
            </div>
          </div>

          {/* Wallet Section */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4 animate-fade-in-up stagger-5">
            <h2 className="text-sm font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
              <Wallet className="w-4 h-4 text-brand-orange" />
              {t('walletBalance')}
            </h2>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <p className="text-xs text-slate-500 font-semibold">{t('currentBalance')}</p>
                <p className="text-2xl font-black text-slate-800 dark:text-slate-100">
                  {user?.walletBalance ?? 0} {t('currency')}
                </p>
              </div>
              <form onSubmit={handleTopUp} className="flex items-center gap-2">
                <input
                  type="number"
                  min="1"
                  step="0.01"
                  required
                  value={topUpAmount}
                  onChange={(e) => setTopUpAmount(e.target.value)}
                  placeholder={t('topUpAmountPlaceholder')}
                  className="w-40 p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold outline-none focus:ring-2 focus:ring-brand-purple"
                />
                <button
                  type="submit"
                  disabled={isToppingUp}
                  className="px-4 py-2 bg-brand-orange hover:bg-brand-orange-hover text-white text-xs font-bold rounded-xl shadow transition btn-hover"
                >
                  {isToppingUp ? t('loading') : t('chargeWallet')}
                </button>
              </form>
            </div>
          </div>

          {/* Enrolled Courses Progress */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4 animate-fade-in-up stagger-5">
            <h2 className="text-sm font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-brand-orange" />
              {t('currentCourses')}:
            </h2>

            <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="space-y-1 max-w-lg">
                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                  {t('courseTitle')}
                </h3>
                <p className="text-xs text-slate-500">{t('currentLevelLabel')}: Level 2 - CSS Flexbox & Layout</p>
                <div className="w-64 bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden mt-2">
                  <div className="bg-brand-purple h-full transition-all duration-1000" style={{ width: '68%' }} />
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-xs font-black text-brand-purple">68% {t('completed')}</span>
                <Link
                  href="/courses"
                  onClick={(e) => {
                    if (!requireAuth()) e.preventDefault()
                  }}
                  className="px-4 py-2 bg-brand-purple hover:bg-brand-purple-hover text-white text-xs font-bold rounded-xl shadow transition flex items-center gap-1 btn-hover"
                >
                  <Play className="w-4 h-4 fill-current" />
                  {t('continueCourse')}
                </Link>
              </div>
            </div>
          </div>

          {/* Certificates Section */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4 animate-fade-in-up stagger-6">
            <h2 className="text-sm font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
              <Award className="w-4 h-4 text-brand-purple" />
              {t('certificatesIssued')}:
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 bg-purple-50/50 dark:bg-slate-800/50 border border-purple-200 dark:border-slate-700 rounded-2xl flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">Frontend Foundations</h4>
                  <p className="text-[10px] text-brand-orange mt-0.5">كود الشهادة: VU-CERT-2026-99482</p>
                </div>
                <button
                  onClick={() => {
                    if (!requireAuth()) return
                    setSelectedCert({
                       studentName: user?.name || t('student'),
                      courseTitle: 'Frontend Foundations',
                      certCode: 'VU-CERT-2026-99482',
                    })
                  }}
                  className="px-3 py-1.5 bg-brand-purple text-white text-xs font-bold rounded-lg shadow hover:bg-brand-purple-hover transition btn-hover"
                >
                  {t('viewCertificate')}
                </button>
              </div>
            </div>
          </div>

        </main>
      </div>

      {selectedCert && (
        <CertificateModal
          isOpen={true}
          onClose={() => setSelectedCert(null)}
          studentName={selectedCert.studentName}
          courseTitle={selectedCert.courseTitle}
          certCode={selectedCert.certCode}
        />
      )}
    </div>
  )
}
