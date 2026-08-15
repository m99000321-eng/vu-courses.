'use client'

import { useEffect, useRef } from 'react'
import Link from 'next/link'
import { gsap } from 'gsap'
import { GraduationCap, LogIn, Sparkles, UserPlus } from 'lucide-react'
import { Logo } from '@/components/logo'

export default function RootPage() {
  const pageRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!canvas || !ctx) return

    let animationId = 0
    let particles: Array<{
      x: number
      y: number
      size: number
      speedX: number
      speedY: number
      opacity: number
      color: string
    }> = []

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    const createParticles = () => {
      const count = Math.min(90, Math.floor(window.innerWidth / 18))
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 2 + 0.5,
        speedX: (Math.random() - 0.5) * 0.24,
        speedY: (Math.random() - 0.5) * 0.24,
        opacity: Math.random() * 0.45 + 0.12,
        color: Math.random() > 0.5 ? '#6C2BD9' : '#F97316',
      }))
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      particles.forEach((p) => {
        p.x += p.speedX
        p.y += p.speedY
        if (p.x < 0) p.x = canvas.width
        if (p.x > canvas.width) p.x = 0
        if (p.y < 0) p.y = canvas.height
        if (p.y > canvas.height) p.y = 0

        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx.fillStyle = p.color
        ctx.globalAlpha = p.opacity
        ctx.fill()
      })
      ctx.globalAlpha = 1
      animationId = requestAnimationFrame(animate)
    }

    resize()
    createParticles()
    animate()
    window.addEventListener('resize', resize)

    const ctxGsap = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })
      tl.fromTo('.hero-badge', { opacity: 0, y: 24, scale: 0.9 }, { opacity: 1, y: 0, scale: 1, duration: 0.7 })
        .fromTo('.hero-title', { opacity: 0, y: 40, scale: 0.92 }, { opacity: 1, y: 0, scale: 1, duration: 1 }, '-=0.35')
        .fromTo('.hero-subtitle', { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.75 }, '-=0.5')
        .fromTo('.hero-actions', { opacity: 0, y: 24, scale: 0.96 }, { opacity: 1, y: 0, scale: 1, duration: 0.75 }, '-=0.35')
        .fromTo('.hero-orbit', { opacity: 0, scale: 0.6, rotation: -30 }, { opacity: 1, scale: 1, rotation: 0, duration: 1.4, stagger: 0.15 }, '-=0.8')

      gsap.to('.hero-glow', {
        scale: 1.08,
        opacity: 0.78,
        duration: 3,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      })
      gsap.to('.floating-cap', {
        y: -12,
        rotation: 4,
        duration: 2.8,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      })
    }, pageRef)

    return () => {
      window.removeEventListener('resize', resize)
      cancelAnimationFrame(animationId)
      ctxGsap.revert()
    }
  }, [])

  return (
    <main ref={pageRef} className="min-h-screen bg-slate-50 text-slate-900 font-sans relative overflow-hidden" dir="rtl">
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none opacity-70" />

      <div className="absolute inset-0 pointer-events-none">
        <div className="hero-glow absolute -top-24 -right-24 w-80 h-80 rounded-full bg-brand-purple/10 blur-3xl" />
        <div className="hero-glow absolute -bottom-24 -left-24 w-80 h-80 rounded-full bg-brand-orange/10 blur-3xl" />
      </div>

      <header className="relative z-20 sticky top-0 bg-white/85 backdrop-blur border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
          <Link href="/" className="shrink-0 hover:opacity-90 transition">
            <Logo size="md" />
          </Link>

          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              href="/login"
              className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-bold text-brand-purple hover:bg-purple-50 rounded-xl transition"
            >
              <LogIn className="w-4 h-4" />
              <span>تسجيل الدخول</span>
            </Link>
            <Link
              href="/login"
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-brand-purple hover:bg-brand-purple-hover text-white text-sm font-bold rounded-xl shadow-lg shadow-brand-purple/20 transition"
            >
              <UserPlus className="w-4 h-4" />
              <span>إنشاء حساب</span>
            </Link>
          </div>
        </div>
      </header>

      <section className="relative z-10 min-h-[calc(100vh-5rem)] flex items-center justify-center px-4 py-14 sm:py-20">
        <div className="w-full max-w-5xl mx-auto text-center">
          <div className="hero-badge inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-100/80 border border-purple-200 text-brand-purple font-bold text-sm shadow-sm">
            <Sparkles className="w-4 h-4" />
            منصة التعليم البرمجي
          </div>

          <div className="relative mt-8 sm:mt-10 flex justify-center">
            <div className="hero-orbit absolute w-40 h-40 sm:w-56 sm:h-56 rounded-full border border-brand-purple/15" />
            <div className="hero-orbit absolute w-56 h-56 sm:w-80 sm:h-80 rounded-full border border-brand-orange/10" />

            <div className="floating-cap relative z-10 w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-gradient-to-br from-brand-purple to-brand-orange flex items-center justify-center shadow-2xl shadow-brand-purple/20">
              <GraduationCap className="w-10 h-10 sm:w-12 sm:h-12 text-white" />
            </div>
          </div>

          <h1 className="hero-title mt-8 text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-slate-950">
            أهلاً بك في
            <span className="block mt-2 bg-gradient-to-r from-brand-orange via-rose-500 to-brand-purple bg-clip-text text-transparent">
              VU. COURSES
            </span>
          </h1>

          <p className="hero-subtitle mt-6 max-w-2xl mx-auto text-base sm:text-xl text-slate-600 leading-relaxed">
            واصل رحلة التعلم الرقمي واكتساب المهارات البرمجية اليوم.
          </p>

          <div className="hero-actions mt-10 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
            <Link
              href="/login"
              className="w-full sm:w-auto min-w-52 inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-brand-purple hover:bg-brand-purple-hover text-white text-base font-bold rounded-2xl shadow-xl shadow-brand-purple/20 transition"
            >
              <Sparkles className="w-5 h-5" />
              إنشاء الحساب الآن
            </Link>
            <Link
              href="/login"
              className="w-full sm:w-auto min-w-52 inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-white hover:bg-slate-50 text-brand-purple text-base font-bold rounded-2xl border-2 border-brand-purple shadow-sm transition"
            >
              <LogIn className="w-5 h-5" />
              دخول للحساب
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}
