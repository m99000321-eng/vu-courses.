'use client'

import React from 'react'
import { X, ShieldCheck, Award, Printer } from 'lucide-react'
import { Logo } from './logo'
import { useLanguage } from './language-provider'

interface CertificateModalProps {
  isOpen: boolean
  onClose: () => void
  studentName: string
  courseTitle: string
  instructorName?: string
  certCode: string
  issuedAt?: string
  qrCodeUrl?: string
}

export function CertificateModal({
  isOpen,
  onClose,
  studentName,
  courseTitle,
  instructorName = 'م. أحمد محمود',
  certCode,
  issuedAt = new Date().toLocaleDateString('ar-EG'),
  qrCodeUrl,
}: CertificateModalProps) {
  const { t } = useLanguage()
  if (!isOpen) return null

  const handlePrint = () => {
    window.print()
  }

  const defaultQrUrl = qrCodeUrl || `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${certCode}`

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-3xl overflow-hidden shadow-2xl my-8">
        
        {/* Top Actions Bar */}
        <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-brand-orange" />
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">{t('certificateTitle')}</h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-brand-purple text-white text-xs font-bold rounded-lg hover:bg-brand-purple-hover transition"
            >
              <Printer className="w-4 h-4" />
              {t('printSavePdf')}
            </button>
            <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-white rounded-lg">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Certificate Frame */}
        <div className="p-8 sm:p-12 bg-slate-50 dark:bg-slate-950 border-8 border-double border-purple-200 dark:border-slate-800 text-center relative font-sans">
          
          {/* Certificate Corner Ribbons */}
          <div className="absolute top-4 left-4">
            <Logo size="sm" />
          </div>

          <div className="my-6 space-y-4">
            <span className="inline-block px-4 py-1 bg-gradient-to-r from-purple-500/20 to-orange-500/20 text-brand-purple dark:text-purple-300 text-xs font-black rounded-full border border-purple-300 dark:border-purple-800">
              {t('officialCertificate')}
            </span>

            <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-wide">
              {t('completionCertificate')}
            </h1>

            <p className="text-xs text-slate-500 font-medium">{t('certificateWitness')}</p>

            <h2 className="text-2xl sm:text-3xl font-black text-brand-purple dark:text-purple-400 py-2 border-b-2 border-dashed border-purple-200 dark:border-slate-800 inline-block px-8">
              {studentName}
            </h2>

            <p className="text-xs text-slate-600 dark:text-slate-400 max-w-lg mx-auto leading-relaxed">
              {t('certificateSuccessText')}
            </p>

            <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 bg-white dark:bg-slate-900 py-3 px-6 rounded-xl border border-slate-200 dark:border-slate-800 inline-block shadow-sm">
              {courseTitle}
            </h3>
          </div>

          {/* Bottom Verification & Signatures */}
          <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-800 grid grid-cols-3 items-center text-right text-xs">
            
            {/* Instructor Signature */}
            <div>
              <p className="text-[11px] text-slate-400">{t('certifiedInstructor')}:</p>
              <p className="font-bold text-slate-800 dark:text-slate-200 mt-1">{instructorName}</p>
              <p className="text-[10px] text-brand-orange">Senior Software Engineer</p>
            </div>

            {/* QR Code */}
            <div className="flex flex-col items-center justify-center">
              <img src={defaultQrUrl} alt="QR Code" className="w-20 h-20 border p-1 bg-white rounded-lg shadow-sm" />
              <p className="text-[10px] text-slate-400 mt-1 font-mono">{certCode}</p>
            </div>

            {/* Platform Seal */}
            <div className="text-left">
              <p className="text-[11px] text-slate-400">{t('issuedAt')}:</p>
              <p className="font-bold text-slate-800 dark:text-slate-200 mt-1">{issuedAt}</p>
              <div className="flex items-center justify-end gap-1 text-emerald-600 dark:text-emerald-400 mt-1 text-[10px] font-bold">
                <ShieldCheck className="w-3.5 h-3.5" />
                {t('officiallyVerified')}
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  )
}
