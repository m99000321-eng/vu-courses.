'use client'

import React, { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Eye, EyeOff, GraduationCap, Lock, Mail, ShieldAlert, Sparkles, User, BriefcaseBusiness, ShieldCheck } from 'lucide-react'
import { gsap } from 'gsap'
import { useLanguage } from '@/components/language-provider'

export default function RegisterPage() {
  const router = useRouter()
  const { t } = useLanguage()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState('STUDENT')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  const containerRef = useRef<HTMLDivElement>(null)
  const cardRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!canvas || !ctx) return
    let animationId = 0
    let particles: Array<{ x: number; y: number; size: number; vx: number; vy: number; opacity: number; color: string }> = []
    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
      particles = Array.from({ length: Math.min(100, Math.floor(window.innerWidth / 15)) }, () => ({ x: Math.random() * canvas.width, y: Math.random() * canvas.height, size: Math.random() * 2 + 0.5, vx: (Math.random() - 0.5) * 0.3, vy: (Math.random() - 0.5) * 0.3, opacity: Math.random() * 0.5 + 0.2, color: Math.random() > 0.5 ? '#6C2BD9' : '#F97316' }))
    }
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      for (const p of particles) { p.x += p.vx; p.y += p.vy; if (p.x < 0) p.x = canvas.width; if (p.x > canvas.width) p.x = 0; if (p.y < 0) p.y = canvas.height; if (p.y > canvas.height) p.y = 0; ctx.beginPath(); ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2); ctx.fillStyle = p.color; ctx.globalAlpha = p.opacity; ctx.fill() }
      ctx.globalAlpha = 1
      animationId = requestAnimationFrame(animate)
    }
    resize(); animate(); window.addEventListener('resize', resize)
    return () => { window.removeEventListener('resize', resize); cancelAnimationFrame(animationId) }
  }, [])

  useEffect(() => {
    const ctx = gsap.context(() => { gsap.timeline({ defaults: { ease: 'power3.out' } }).fromTo('.register-card', { opacity: 0, y: 60, scale: 0.95, rotationX: 10 }, { opacity: 1, y: 0, scale: 1, rotationX: 0, duration: 1.1 }).fromTo('.form-item', { opacity: 0, y: 25 }, { opacity: 1, y: 0, duration: 0.7, stagger: 0.08 }, '-=0.5').fromTo('.submit-btn', { opacity: 0, scale: 0.92 }, { opacity: 1, scale: 1, duration: 0.6, ease: 'back.out(1.7)' }, '-=0.3') }, containerRef)
    return () => ctx.revert()
  }, [])

  useEffect(() => {
    const card = cardRef.current
    if (!card) return
    const move = (e: MouseEvent) => { const x = (e.clientX / window.innerWidth - 0.5) * 18; const y = (e.clientY / window.innerHeight - 0.5) * 18; gsap.to(card, { rotateY: x, rotateX: -y, duration: 0.45, ease: 'power2.out' }); setMousePos({ x: e.clientX, y: e.clientY }) }
    const leave = () => gsap.to(card, { rotateY: 0, rotateX: 0, duration: 0.7, ease: 'elastic.out(1, 0.5)' })
    window.addEventListener('mousemove', move); card.addEventListener('mouseleave', leave)
    return () => { window.removeEventListener('mousemove', move); card.removeEventListener('mouseleave', leave) }
  }, [])

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault(); setIsLoading(true); setError('')
    try {
      const res = await fetch('/api/auth/register', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name: name.trim(), email: email.trim().toLowerCase(), password, role }) })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) { setError(data.error || t('registerFailed')); return }
      const target = data.user?.role === 'INSTRUCTOR' ? '/instructor/dashboard' : data.user?.role === 'ADMIN' ? '/admin/dashboard' : '/student/dashboard'
      router.replace(target); router.refresh()
    } catch { setError(t('connectionError')) } finally { setIsLoading(false) }
  }

  return (
    <div ref={containerRef} className="min-h-screen bg-slate-950 flex flex-col justify-center items-center p-4 font-sans relative overflow-hidden" dir="rtl">
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand-purple/20 rounded-full blur-[120px] animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-brand-orange/20 rounded-full blur-[120px] animate-pulse" />
      <div className="floating-shape absolute top-20 right-20 w-32 h-32 border border-brand-purple/20 rounded-full" />
      <div className="floating-shape absolute bottom-32 left-16 w-24 h-24 border border-brand-orange/20 rounded-full" />
      <div className="absolute w-64 h-64 bg-brand-purple/10 rounded-full blur-[80px] pointer-events-none transition-all duration-300" style={{ left: mousePos.x - 128, top: mousePos.y - 128 }} />

      <div ref={cardRef} className="register-card w-full max-w-md relative z-10" style={{ perspective: '1000px' }}>
        <div className="relative bg-slate-900/80 backdrop-blur-xl border border-slate-700/50 rounded-3xl shadow-2xl shadow-black/50 overflow-hidden">
          <div className="h-1 w-full bg-gradient-to-r from-brand-purple via-brand-orange to-brand-purple animate-pulse" />
          <div className="p-8 md:p-10 space-y-6">
            <div className="flex flex-col items-center text-center space-y-4"><div className="relative"><div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-brand-purple to-brand-orange flex items-center justify-center shadow-2xl shadow-brand-purple/40"><GraduationCap className="w-10 h-10 text-white" /></div></div><div><h1 className="text-3xl font-black text-white tracking-tight mb-2">إنشاء حساب جديد</h1><div className="h-0.5 w-16 mx-auto bg-gradient-to-r from-brand-purple to-brand-orange rounded-full mb-3" /><p className="text-sm text-slate-400">ابدأ رحلتك نحو الاحتراف الآن</p></div></div>
            {error && <div className="form-item p-3.5 bg-rose-950/40 border border-rose-500/30 text-rose-300 text-xs font-medium rounded-xl flex items-center gap-2.5"><ShieldAlert className="w-4 h-4 shrink-0 text-rose-400" /><span>{error}</span></div>}
            <form onSubmit={handleRegister} className="space-y-4">
              <div className="form-item"><label className="block text-xs font-bold text-slate-300 mb-1.5">الاسم الكامل</label><div className="relative"><input type="text" required minLength={2} maxLength={80} autoComplete="name" placeholder="أدخل اسمك" value={name} onChange={(e) => setName(e.target.value)} className="input-field w-full p-3.5 pr-11 bg-slate-800/50 border border-slate-700/50 rounded-xl text-sm text-white placeholder:text-slate-500 outline-none focus:border-brand-purple focus:ring-2 focus:ring-brand-purple/30 transition-all" /><User className="absolute right-3.5 top-3.5 w-4 h-4 text-slate-500" /></div></div>
              <div className="form-item"><label className="block text-xs font-bold text-slate-300 mb-1.5">البريد الإلكتروني</label><div className="relative"><input type="email" required autoComplete="email" placeholder={t('enterEmail')} value={email} onChange={(e) => setEmail(e.target.value)} className="input-field w-full p-3.5 pr-11 bg-slate-800/50 border border-slate-700/50 rounded-xl text-sm text-white placeholder:text-slate-500 outline-none focus:border-brand-purple focus:ring-2 focus:ring-brand-purple/30 transition-all" /><Mail className="absolute right-3.5 top-3.5 w-4 h-4 text-slate-500" /></div></div>
              <div className="form-item"><label className="block text-xs font-bold text-slate-300 mb-1.5">كلمة المرور</label><div className="relative"><input type={showPassword ? 'text' : 'password'} required minLength={6} autoComplete="new-password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} className="input-field w-full p-3.5 pr-11 bg-slate-800/50 border border-slate-700/50 rounded-xl text-sm text-white placeholder:text-slate-500 outline-none focus:border-brand-purple focus:ring-2 focus:ring-brand-purple/30 transition-all" /><Lock className="absolute right-3.5 top-3.5 w-4 h-4 text-slate-500" /><button type="button" onClick={() => setShowPassword((v) => !v)} className="absolute left-3.5 top-3.5 text-slate-500 hover:text-slate-300" aria-label="إظهار أو إخفاء كلمة المرور">{showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}</button></div></div>
              <div className="form-item"><label className="block text-xs font-bold text-slate-300 mb-2">نوع الحساب</label><div className="grid grid-cols-3 gap-2">
                <button type="button" onClick={() => setRole('STUDENT')} className={`p-3 rounded-xl border transition-all flex flex-col items-center gap-1.5 ${role === 'STUDENT' ? 'border-brand-purple bg-brand-purple/20 text-white ring-2 ring-brand-purple/30' : 'border-slate-700/50 bg-slate-800/50 text-slate-400 hover:border-slate-600'}`}><GraduationCap className="w-5 h-5" /><span className="text-xs font-bold">طالب</span></button>
                <button type="button" onClick={() => setRole('INSTRUCTOR')} className={`p-3 rounded-xl border transition-all flex flex-col items-center gap-1.5 ${role === 'INSTRUCTOR' ? 'border-brand-orange bg-brand-orange/20 text-white ring-2 ring-brand-orange/30' : 'border-slate-700/50 bg-slate-800/50 text-slate-400 hover:border-slate-600'}`}><BriefcaseBusiness className="w-5 h-5" /><span className="text-xs font-bold">محاضر</span></button>
                <button type="button" onClick={() => setRole('ADMIN')} className={`p-3 rounded-xl border transition-all flex flex-col items-center gap-1.5 ${role === 'ADMIN' ? 'border-emerald-500 bg-emerald-500/20 text-white ring-2 ring-emerald-500/30' : 'border-slate-700/50 bg-slate-800/50 text-slate-400 hover:border-slate-600'}`}><ShieldCheck className="w-5 h-5" /><span className="text-xs font-bold">أدمن</span></button>
              </div></div>
              <div className="form-item pt-1"><button type="submit" disabled={isLoading} className="submit-btn relative w-full py-3.5 bg-gradient-to-l from-brand-purple to-brand-purple-hover hover:from-brand-purple-hover hover:to-brand-purple text-white text-sm font-bold rounded-xl shadow-lg shadow-brand-purple/30 transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed"><span className="relative z-10 flex items-center justify-center gap-2">{isLoading ? <><Sparkles className="w-4 h-4 animate-pulse" />{t('loading')}</> : <><Sparkles className="w-4 h-4" />إنشاء الحساب الآن</>}</span></button></div>
            </form>
            <div className="text-center"><p className="text-xs text-slate-500">لديك حساب بالفعل؟ <Link href="/login" className="text-brand-purple font-bold hover:text-brand-purple-hover">تسجيل الدخول</Link></p></div>
          </div>
        </div>
        <p className="text-center text-slate-600 text-xs mt-5 font-medium">© 2026 جميع الحقوق محفوظة - VU. COURSES</p>
      </div>
    </div>
  )
}
