'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { LockKeyhole, LogIn, UserPlus, X } from 'lucide-react'
import Link from 'next/link'
import { useLanguage } from './language-provider'

interface LoginRequiredModalProps {
  isOpen: boolean
  onClose: () => void
  courseTitle?: string
}

export function LoginRequiredModal({ isOpen, onClose, courseTitle }: LoginRequiredModalProps) {
  const { t } = useLanguage()
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}>
          <motion.div role="dialog" aria-modal="true" className="relative w-full max-w-md overflow-hidden rounded-3xl bg-white p-7 text-center shadow-2xl dark:bg-slate-900" initial={{ opacity: 0, y: 24, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 16, scale: 0.97 }} transition={{ type: 'spring', stiffness: 320, damping: 26 }} onClick={(event) => event.stopPropagation()} dir="rtl">
            <button onClick={onClose} className="absolute left-4 top-4 rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800" aria-label={t('close')}><X className="h-5 w-5" /></button>
            <motion.div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-purple-100 text-brand-purple dark:bg-purple-500/15 dark:text-purple-300" animate={{ y: [0, -5, 0] }} transition={{ duration: 2, repeat: Infinity }}><LockKeyhole className="h-8 w-8" /></motion.div>
            <h2 className="text-xl font-black text-slate-900 dark:text-white">{t('loginRequiredTitle')}</h2>
            <p className="mt-3 text-sm leading-6 text-slate-500 dark:text-slate-400">{courseTitle ? t('loginRequiredCourse', { courseTitle }) : t('loginRequiredDefault')}</p>
            <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
              <Link href="/login" className="flex items-center justify-center gap-2 rounded-xl bg-brand-purple px-4 py-3 text-sm font-bold text-white shadow-lg shadow-purple-500/20 transition hover:bg-brand-purple-hover"><LogIn className="h-4 w-4" /> {t('login')}</Link>
              <Link href="/register" className="flex items-center justify-center gap-2 rounded-xl border border-purple-200 px-4 py-3 text-sm font-bold text-brand-purple transition hover:bg-purple-50 dark:border-purple-500/30 dark:hover:bg-slate-800"><UserPlus className="h-4 w-4" /> {t('register')}</Link>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
