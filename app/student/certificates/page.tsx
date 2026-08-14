'use client'

import React, { useEffect, useState } from 'react'
import { Navbar } from '@/components/navbar'
import { Sidebar } from '@/components/sidebar'
import { Award, ShieldCheck, Search, ExternalLink } from 'lucide-react'
import { CertificateModal } from '@/components/certificate-modal'

interface Certificate {
  id: string
  certCode: string
  issuedAt: string
  qrCodeUrl?: string
  course: {
    id: string
    title: string
    instructor: { name: string }
  }
}

export default function CertificatesPage() {
  const [user, setUser] = useState<any>(null)
  const [certificates, setCertificates] = useState<Certificate[]>([])
  const [selectedCert, setSelectedCert] = useState<any>(null)
  const [verifyCode, setVerifyCode] = useState('')
  const [verifyResult, setVerifyResult] = useState<any>(null)
  const [verifying, setVerifying] = useState(false)

  useEffect(() => {
    fetch('/api/auth/me')
      .then((res) => res.json())
      .then((d) => setUser(d.user))

    fetch('/api/certificates')
      .then((res) => res.json())
      .then((d) => setCertificates(d.certificates || []))
  }, [])

  const handleVerify = async () => {
    if (!verifyCode.trim()) return
    setVerifying(true)
    setVerifyResult(null)
    try {
      const res = await fetch(`/api/certificates?code=${encodeURIComponent(verifyCode)}`)
      const data = await res.json()
      if (res.ok) {
        setVerifyResult({ cert: data.cert, valid: true })
      } else {
        setVerifyResult({ error: data.error || 'الشهادة غير موجودة', valid: false })
      }
    } catch {
      setVerifyResult({ error: 'فشل التحقق من الشهادة', valid: false })
    } finally {
      setVerifying(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans" dir="rtl">
      <Navbar currentUser={user} />

      <div className="flex-1 max-w-7xl w-full mx-auto flex">
        <Sidebar role="STUDENT" activeTab="certificates" />

        <main className="flex-1 p-6 space-y-6 overflow-y-auto">
          <div className="flex items-center gap-3">
            <Award className="w-7 h-7 text-brand-purple" />
            <h1 className="text-xl font-black">الشهادات المكتسبة</h1>
          </div>

          {/* Certificates Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {certificates.length === 0 ? (
              <div className="col-span-full text-center py-12 space-y-3">
                <Award className="w-16 h-16 text-slate-300 mx-auto" />
                <p className="text-sm text-slate-500">لم تحصل على أي شهادات بعد</p>
                <p className="text-xs text-slate-400">أكمل الكورسات المسجلة للحصول على شهادة إتمام</p>
              </div>
            ) : (
              certificates.map((cert) => (
                <div
                  key={cert.id}
                  className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-3"
                >
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <span className="px-2.5 py-1 bg-purple-50 text-brand-purple font-bold text-xs rounded-lg inline-block">
                        شهادة إتمام
                      </span>
                      <h3 className="font-extrabold text-sm mt-2">{cert.course.title}</h3>
                      <p className="text-xs text-slate-500">المحاضر: {cert.course.instructor.name}</p>
                    </div>
                    <Award className="w-8 h-8 text-brand-orange shrink-0" />
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                      <span>كود الشهادة:</span>
                      <span className="font-mono font-bold text-brand-purple">{cert.certCode}</span>
                    </div>
                    <p className="text-xs text-slate-500">
                      تاريخ الإصدار: {new Date(cert.issuedAt).toLocaleDateString('ar-EG')}
                    </p>
                    {cert.qrCodeUrl && (
                      <img
                        src={cert.qrCodeUrl}
                        alt="QR Code"
                        className="w-16 h-16 border p-1 bg-white rounded-lg shadow-sm mt-2"
                      />
                    )}
                  </div>

                  <button
                    onClick={() =>
                      setSelectedCert({
                        studentName: user?.name || 'الطالب',
                        courseTitle: cert.course.title,
                        instructorName: cert.course.instructor.name,
                        certCode: cert.certCode,
                        issuedAt: new Date(cert.issuedAt).toLocaleDateString('ar-EG'),
                        qrCodeUrl: cert.qrCodeUrl,
                      })
                    }
                    className="w-full py-2.5 bg-brand-purple text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 hover:bg-brand-purple-hover transition shadow"
                  >
                    <ExternalLink className="w-4 h-4" />
                    عرض الشهادة
                  </button>
                </div>
              ))
            )}
          </div>

          {/* Verify Certificate Section */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
            <h2 className="text-sm font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              التحقق من صحة شهادة
            </h2>
            <p className="text-xs text-slate-500">أدخل كود الشهادة للتحقق من صحتها وصلاحيتها</p>

            <div className="flex gap-3">
              <input
                type="text"
                value={verifyCode}
                onChange={(e) => setVerifyCode(e.target.value)}
                placeholder="أدخل كود الشهادة..."
                className="flex-1 px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-brand-purple"
              />
              <button
                onClick={handleVerify}
                disabled={verifying}
                className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition shadow flex items-center gap-2 disabled:opacity-50"
              >
                <Search className="w-4 h-4" />
                {verifying ? 'جاري التحقق...' : 'تحقق'}
              </button>
            </div>

            {verifyResult && (
              <div
                className={`p-4 rounded-xl text-xs space-y-1 ${
                  verifyResult.valid
                    ? 'bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800'
                    : 'bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800'
                }`}
              >
                {verifyResult.valid ? (
                  <>
                    <p className="font-bold text-emerald-700 dark:text-emerald-400">شهادة صالحة</p>
                    <p className="text-slate-600 dark:text-slate-400">الكورس: {verifyResult.cert.course.title}</p>
                    <p className="text-slate-600 dark:text-slate-400">الطالب: {verifyResult.cert.user.name}</p>
                    <p className="text-slate-600 dark:text-slate-400">المحاضر: {verifyResult.cert.course.instructor.name}</p>
                    <p className="text-slate-600 dark:text-slate-400">تاريخ الإصدار: {new Date(verifyResult.cert.issuedAt).toLocaleDateString('ar-EG')}</p>
                  </>
                ) : (
                  <p className="font-bold text-rose-700 dark:text-rose-400">{verifyResult.error}</p>
                )}
              </div>
            )}
          </div>
        </main>
      </div>

      {selectedCert && (
        <CertificateModal
          isOpen={true}
          onClose={() => setSelectedCert(null)}
          studentName={selectedCert.studentName}
          courseTitle={selectedCert.courseTitle}
          instructorName={selectedCert.instructorName}
          certCode={selectedCert.certCode}
          issuedAt={selectedCert.issuedAt}
          qrCodeUrl={selectedCert.qrCodeUrl}
        />
      )}
    </div>
  )
}
