'use client'

import { motion } from 'framer-motion'
import { Clock3, Headphones, Mail, MessageCircle, ShieldCheck } from 'lucide-react'
import Link from 'next/link'
import { Navbar } from '@/components/navbar'
import { useLanguage } from '@/components/language-provider'

export default function SupportPage() {
  const { t } = useLanguage()
  const supportItems = [
    { icon: MessageCircle, title: t('quickHelp'), description: t('chatSupportDescription'), href: '/chat', action: t('openChats') },
    { icon: Mail, title: t('emailSupport'), description: t('emailSupportDescription'), href: 'mailto:support@vucourses.com', action: 'support@vucourses.com' },
    { icon: Clock3, title: t('supportHours'), description: t('supportHoursDescription'), href: '#hours', action: t('dailySupportHours') },
  ]
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100" dir="rtl">
      <Navbar />
      <main className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="relative overflow-hidden rounded-3xl bg-gradient-to-l from-brand-purple via-purple-700 to-slate-900 px-6 py-12 text-center text-white shadow-xl sm:px-12">
          <div className="relative z-10 mx-auto max-w-2xl">
            <motion.div animate={{ rotate: [0, -6, 6, 0] }} transition={{ duration: 2.5, repeat: Infinity, repeatDelay: 1.5 }} className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/15"><Headphones className="h-8 w-8 text-amber-300" /></motion.div>
            <h1 className="text-3xl font-black sm:text-4xl">{t('howCanWeHelp')}</h1>
            <p className="mt-4 text-sm leading-7 text-purple-100 sm:text-base">{t('supportTeamReady')}</p>
          </div>
          <div className="absolute -right-12 -top-12 h-48 w-48 rounded-full bg-orange-400/20 blur-2xl" />
          <div className="absolute -bottom-16 -left-12 h-52 w-52 rounded-full bg-white/10 blur-2xl" />
        </motion.section>
        <section className="mt-8 grid gap-5 md:grid-cols-3">
          {supportItems.map(({ icon: Icon, title, description, href, action }, index) => (
            <motion.div key={title} initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }} whileHover={{ y: -5 }} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-purple-50 text-brand-purple dark:bg-purple-500/15"><Icon className="h-5 w-5" /></div>
              <h2 className="mt-4 font-extrabold">{title}</h2>
              <p className="mt-2 min-h-12 text-sm leading-6 text-slate-500 dark:text-slate-400">{description}</p>
              <Link href={href} className="mt-5 inline-flex text-sm font-bold text-brand-purple hover:underline">{action}</Link>
            </motion.div>
          ))}
        </section>
        <section id="hours" className="mt-8 flex items-center gap-4 rounded-2xl border border-emerald-200 bg-emerald-50 p-5 text-emerald-950 dark:border-emerald-900/60 dark:bg-emerald-950/20 dark:text-emerald-100"><ShieldCheck className="h-7 w-7 shrink-0 text-emerald-600" /><div><h2 className="font-extrabold">{t('secureSupportTitle')}</h2><p className="mt-1 text-sm opacity-80">{t('secureSupportDescription')}</p></div></section>
      </main>
    </div>
  )
}
