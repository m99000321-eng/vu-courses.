'use client'

import { motion } from 'framer-motion'
import { RefreshCw, TriangleAlert } from 'lucide-react'
import { useLanguage } from '@/components/language-provider'

export default function Error({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  const { t } = useLanguage()
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 p-6 dark:bg-slate-950" dir="rtl">
      <motion.section initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-xl dark:border-slate-800 dark:bg-slate-900">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-100 text-amber-600 dark:bg-amber-500/15"><TriangleAlert className="h-8 w-8" /></div>
        <h1 className="mt-5 text-xl font-black">{t('unexpectedError')}</h1>
        <p className="mt-3 text-sm leading-6 text-slate-500 dark:text-slate-400">{t('errorDescription')}</p>
        <button onClick={reset} className="mt-6 inline-flex items-center gap-2 rounded-xl bg-brand-purple px-5 py-3 text-sm font-bold text-white shadow-lg shadow-purple-500/20 transition hover:bg-brand-purple-hover"><RefreshCw className="h-4 w-4" /> {t('retry')}</button>
      </motion.section>
    </main>
  )
}
