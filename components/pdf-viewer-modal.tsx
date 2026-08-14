'use client'

import React, { useState } from 'react'
import { X, Download, FileText, CheckCircle } from 'lucide-react'
import { useLanguage } from './language-provider'

interface PdfViewerModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  pdfUrl?: string
  textContent?: string
  lessonId: string
  onComplete?: () => void
}

export function PdfViewerModal({
  isOpen,
  onClose,
  title,
  pdfUrl,
  textContent,
  lessonId,
  onComplete,
}: PdfViewerModalProps) {
  const { t } = useLanguage()
  const [isCompleted, setIsCompleted] = useState(false)

  if (!isOpen) return null

  const markAsCompleted = async () => {
    setIsCompleted(true)
    try {
      await fetch(`/api/lessons/${lessonId}/progress`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ completed: true }),
      })
      if (onComplete) onComplete()
    } catch (e) {
      console.error(e)
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden shadow-2xl">
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950">
          <div className="flex items-center gap-3">
            <span className="px-2.5 py-1 rounded-md bg-brand-orange text-white text-[10px] font-bold">PDF</span>
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">{title}</h3>
          </div>

          <div className="flex items-center gap-2">
            {pdfUrl && (
              <a
                href={pdfUrl}
                download
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-lg text-xs font-bold transition"
              >
                <Download className="w-4 h-4" />
                {t('downloadPdf')}
              </a>
            )}
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-white rounded-lg transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Viewer Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-100 dark:bg-slate-950">
          {pdfUrl ? (
            <div className="w-full h-[550px] rounded-xl overflow-hidden border border-slate-300 dark:border-slate-800 shadow-inner bg-white">
              <iframe src={pdfUrl} className="w-full h-full" title={title} />
            </div>
          ) : (
            <div className="p-6 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
              <div className="flex items-center gap-2 text-brand-purple mb-4">
                <FileText className="w-5 h-5" />
                <h4 className="font-bold text-base">{t('explanationDocument')}</h4>
              </div>
              <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line">
                {textContent || t('pdfDefaultText')}
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center justify-between">
          <p className="text-xs text-slate-500">{t('readDocumentBeforeQuiz')}</p>
          <button
            onClick={markAsCompleted}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition ${
              isCompleted
                ? 'bg-emerald-600/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30'
                : 'bg-brand-purple text-white hover:bg-brand-purple-hover'
            }`}
          >
            <CheckCircle className="w-4 h-4" />
            {isCompleted ? t('readingCompleted') : t('markAsCompleted')}
          </button>
        </div>

      </div>
    </div>
  )
}
