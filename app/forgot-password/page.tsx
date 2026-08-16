'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Mail, ArrowRight, LockKeyhole } from 'lucide-react'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSent(true)
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-4" dir="rtl">
      <div className="w-full max-w-md bg-slate-900/90 border border-slate-700/50 rounded-3xl p-8 shadow-2xl">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-brand-purple to-brand-orange flex items-center justify-center">
            <LockKeyhole className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-black">نسيت كلمة المرور؟</h1>
            <p className="text-sm text-slate-400">استرجاع الوصول إلى حسابك</p>
          </div>
        </div>

        {sent ? (
          <div className="space-y-5">
            <div className="rounded-2xl border border-emerald-500/30 bg-emerald-950/30 p-4 text-sm text-emerald-200 leading-7">
              تم استلام طلب الاسترجاع للبريد المدخل. لإرسال رسالة إعادة تعيين فعلية، يجب ربط خدمة البريد الإلكتروني الخاصة بالمشروع.
            </div>
            <Link href="/login" className="w-full py-3.5 rounded-xl bg-brand-purple hover:bg-brand-purple-hover font-bold flex items-center justify-center gap-2">
              العودة لتسجيل الدخول
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <label className="block text-xs font-bold text-slate-300">البريد الإلكتروني</label>
            <div className="relative">
              <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="example@domain.com" className="w-full p-3.5 pr-11 bg-slate-800/60 border border-slate-700/60 rounded-xl text-sm text-white placeholder:text-slate-500 outline-none focus:border-brand-purple focus:ring-2 focus:ring-brand-purple/30" />
              <Mail className="absolute right-3.5 top-3.5 w-4 h-4 text-slate-500" />
            </div>
            <button type="submit" className="w-full py-3.5 rounded-xl bg-gradient-to-l from-brand-purple to-brand-purple-hover font-bold shadow-lg shadow-brand-purple/20">
              إرسال طلب إعادة التعيين
            </button>
            <Link href="/login" className="text-xs text-slate-400 hover:text-white flex items-center justify-center gap-2">
              <ArrowRight className="w-3.5 h-3.5" />
              العودة لتسجيل الدخول
            </Link>
          </form>
        )}
      </div>
    </main>
  )
}
