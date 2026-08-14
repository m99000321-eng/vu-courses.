'use client'

import React, { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { gsap } from 'gsap'
import { User, Mail, Lock, ShieldAlert, GraduationCap, Sparkles, Eye, EyeOff } from 'lucide-react'
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
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  const [showPassword, setShowPassword] = useState(false)

  const containerRef = useRef<HTMLDivElement>(null)
  const cardRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const ctx = canvasRef.current?.getContext('2d')
    if (!ctx || !canvasRef.current) return

    let animationId: number
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
      canvasRef.current!.width = window.innerWidth
      canvasRef.current!.height = window.innerHeight
    }

    const createParticles = () => {
      particles = []
      const count = Math.min(100, Math.floor(window.innerWidth / 15))
      for (let i = 0; i < count; i++) {
        particles.push({
          x: Math.random() * canvasRef.current!.width,
          y: Math.random() * canvasRef.current!.height,
          size: Math.random() * 2 + 0.5,
          speedX: (Math.random() - 0.5) * 0.3,
          speedY: (Math.random() - 0.5) * 0.3,
          opacity: Math.random() * 0.5 + 0.2,
          color: Math.random() > 0.5 ? '#6C2BD9' : '#F97316',
        })
      }
    }

    const animate = () => {
      ctx!.clearRect(0, 0, canvasRef.current!.width, canvasRef.current!.height)

      particles.forEach((p) => {
        p.x += p.speedX
        p.y += p.speedY

        if (p.x < 0) p.x = canvasRef.current!.width
        if (p.x > canvasRef.current!.width) p.x = 0
        if (p.y < 0) p.y = canvasRef.current!.height
        if (p.y > canvasRef.current!.height) p.y = 0

        ctx!.beginPath()
        ctx!.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx!.fillStyle = p.color
        ctx!.globalAlpha = p.opacity
        ctx!.fill()
      })

      ctx!.globalAlpha = 1
      animationId = requestAnimationFrame(animate)
    }

    resize()
    createParticles()
    animate()

    window.addEventListener('resize', resize)

    return () => {
      window.removeEventListener('resize', resize)
      cancelAnimationFrame(animationId)
    }
  }, [])

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })

      tl.fromTo(
        '.register-card',
        { opacity: 0, y: 60, scale: 0.95, rotationX: 10 },
        { opacity: 1, y: 0, scale: 1, rotationX: 0, duration: 1.2 }
      )

      tl.fromTo(
        '.form-item',
        { opacity: 0, y: 30, scale: 0.95 },
        { opacity: 1, y: 0, scale: 1, duration: 0.8, stagger: 0.1 },
        '-=0.6'
      )

      tl.fromTo(
        '.submit-btn',
        { opacity: 0, scale: 0.9 },
        { opacity: 1, scale: 1, duration: 0.7, ease: 'back.out(1.7)' },
        '-=0.4'
      )

      tl.fromTo(
        '.floating-shape',
        { opacity: 0, scale: 0 },
        { opacity: 0.1, scale: 1, duration: 2, stagger: 0.2 },
        '-=1'
      )
    }, containerRef)

    return () => ctx.revert()
  }, [])

  useEffect(() => {
    if (!cardRef.current) return

    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e
      const { innerWidth, innerHeight } = window
      const x = (clientX / innerWidth - 0.5) * 20
      const y = (clientY / innerHeight - 0.5) * 20

      gsap.to(cardRef.current, {
        rotateY: x,
        rotateX: -y,
        duration: 0.5,
        ease: 'power2.out',
      })

      setMousePos({ x: clientX, y: clientY })
    }

    const handleMouseLeave = () => {
      gsap.to(cardRef.current, {
        rotateY: 0,
        rotateX: 0,
        duration: 0.8,
        ease: 'elastic.out(1, 0.5)',
      })
    }

    window.addEventListener('mousemove', handleMouseMove)
    cardRef.current.addEventListener('mouseleave', handleMouseLeave)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      cardRef.current?.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [])

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, role }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || t('registerFailed'))
        return
      }

      if (data.user?.role === 'ADMIN') router.push('/admin/dashboard')
      else if (data.user?.role === 'INSTRUCTOR') router.push('/instructor/dashboard')
      else router.push('/courses')

      router.refresh()
    } catch {
      setError(t('connectionError'))
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div
      ref={containerRef}
      className="min-h-screen bg-slate-950 flex flex-col justify-center items-center p-4 font-sans relative overflow-hidden"
      dir="rtl"
    >
      {/* Canvas Background */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none"
      />

      {/* Gradient Orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand-purple/20 rounded-full blur-[120px] animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-brand-orange/20 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '1s' }} />

      {/* Floating Shapes */}
      <div className="floating-shape absolute top-20 right-20 w-32 h-32 border border-brand-purple/20 rounded-full" />
      <div className="floating-shape absolute bottom-32 left-16 w-24 h-24 border border-brand-orange/20 rounded-full" />
      <div className="floating-shape absolute top-1/3 left-1/3 w-16 h-16 border border-brand-purple/30 rounded-lg rotate-45" />

      {/* Mouse Glow */}
      <div
        className="absolute w-64 h-64 bg-brand-purple/10 rounded-full blur-[80px] pointer-events-none transition-all duration-300"
        style={{
          left: mousePos.x - 128,
          top: mousePos.y - 128,
        }}
      />

      {/* Main Card */}
      <div ref={cardRef} className="register-card w-full max-w-md relative z-10" style={{ perspective: '1000px' }}>
        <div className="relative bg-slate-900/80 backdrop-blur-xl border border-slate-700/50 rounded-3xl shadow-2xl shadow-black/50 overflow-hidden">

          {/* Top Gradient Line */}
          <div className="h-1 w-full bg-gradient-to-r from-brand-purple via-brand-orange to-brand-purple animate-pulse" />

          {/* Inner Glow */}
          <div className="absolute inset-0 bg-gradient-to-br from-brand-purple/5 via-transparent to-brand-orange/5 pointer-events-none" />

          <div className="p-8 md:p-10 space-y-6">
            {/* Brand Header */}
            <div className="flex flex-col items-center text-center space-y-4">
              {/* Animated Logo */}
              <div className="relative">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-brand-purple to-brand-orange flex items-center justify-center shadow-2xl shadow-brand-purple/40 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-tr from-white/20 to-transparent" />
                  <GraduationCap className="w-10 h-10 text-white relative z-10" />
                </div>
                <div className="absolute -inset-2 bg-gradient-to-br from-brand-purple/20 to-brand-orange/20 rounded-2xl blur-xl animate-pulse" />
              </div>

              <div>
                <h1 className="text-3xl font-black text-white tracking-tight mb-2">
                  {t('createAccountTitle')}
                </h1>
                <div className="h-0.5 w-16 mx-auto bg-gradient-to-r from-brand-purple to-brand-orange rounded-full mb-3" />
                <p className="text-sm text-slate-400">
                  {t('startLearningJourney')}
                </p>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="form-item p-3.5 bg-rose-950/40 border border-rose-500/30 text-rose-300 text-xs font-medium rounded-xl flex items-center gap-2.5 backdrop-blur-sm">
                <ShieldAlert className="w-4 h-4 shrink-0 text-rose-400" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleRegister} className="space-y-4">
              {/* Full Name */}
              <div className="form-item">
                <label className="block text-xs font-bold text-slate-300 mb-1.5">{t('fullName')}</label>
                <div className="relative group">
                  <input
                    type="text"
                    required
                    placeholder={t('fullNamePlaceholder')}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="input-field w-full p-3.5 pr-11 bg-slate-800/50 border border-slate-700/50 rounded-xl text-sm text-white placeholder:text-slate-500 outline-none focus:border-brand-purple focus:ring-2 focus:ring-brand-purple/30 transition-all duration-300 backdrop-blur-sm"
                  />
                  <div className="absolute right-3.5 top-3.5 text-slate-500 group-focus-within:text-brand-purple transition-colors duration-300">
                    <User className="w-4 h-4" />
                  </div>
                </div>
              </div>

              {/* Email */}
              <div className="form-item">
                <label className="block text-xs font-bold text-slate-300 mb-1.5">{t('email')}</label>
                <div className="relative group">
                  <input
                    type="email"
                    required
                    placeholder={t('emailPlaceholder')}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="input-field w-full p-3.5 pr-11 bg-slate-800/50 border border-slate-700/50 rounded-xl text-sm text-white placeholder:text-slate-500 outline-none focus:border-brand-purple focus:ring-2 focus:ring-brand-purple/30 transition-all duration-300 backdrop-blur-sm"
                  />
                  <div className="absolute right-3.5 top-3.5 text-slate-500 group-focus-within:text-brand-purple transition-colors duration-300">
                    <Mail className="w-4 h-4" />
                  </div>
                </div>
              </div>

              {/* Password */}
              <div className="form-item">
                <label className="block text-xs font-bold text-slate-300 mb-1.5">{t('password')}</label>
                <div className="relative group">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder={t('passwordPlaceholder')}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="input-field w-full p-3.5 pr-11 bg-slate-800/50 border border-slate-700/50 rounded-xl text-sm text-white placeholder:text-slate-500 outline-none focus:border-brand-purple focus:ring-2 focus:ring-brand-purple/30 transition-all duration-300 backdrop-blur-sm"
                  />
                  <div className="absolute right-3.5 top-3.5 text-slate-500 group-focus-within:text-brand-purple transition-colors duration-300">
                    <Lock className="w-4 h-4" />
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute left-3.5 top-3.5 text-slate-500 hover:text-slate-300 transition-colors duration-200"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Role Select */}
              <div className="form-item">
                <label className="block text-xs font-bold text-slate-300 mb-1.5">{t('roleLabel')}</label>
                <div className="relative group">
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full p-3.5 bg-slate-800/50 border border-slate-700/50 rounded-xl text-sm text-white font-bold outline-none focus:border-brand-purple focus:ring-2 focus:ring-brand-purple/30 transition-all duration-300 appearance-none cursor-pointer"
                  >
                    <option value="STUDENT" className="bg-slate-800 text-white">{t('studentOption')}</option>
                    <option value="INSTRUCTOR" className="bg-slate-800 text-white">{t('instructorOption')}</option>
                  </select>
                  <div className="absolute left-3.5 top-3.5 pointer-events-none text-slate-500">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="m6 9 6 6 6-6" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="form-item pt-1">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="submit-btn relative w-full py-3.5 bg-gradient-to-l from-brand-purple to-brand-purple-hover hover:from-brand-purple-hover hover:to-brand-purple text-white text-sm font-bold rounded-xl shadow-lg shadow-brand-purple/30 transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed overflow-hidden group"
                >
                  <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    {isLoading ? (
                      <>
                        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                        {t('creatingAccount')}
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4" />
                        <span>{t('createAccountNow')}</span>
                      </>
                    )}
                  </span>
                </button>
              </div>
            </form>

            {/* Divider */}
            <div className="relative py-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-700/50" />
              </div>
              <div className="relative flex justify-center">
                <span className="px-3 bg-slate-900 text-slate-500 text-[11px] font-medium">{t('orDivider')}</span>
              </div>
            </div>

            {/* Login Link */}
            <div className="text-center text-sm text-slate-400">
              {t('alreadyHaveAccount')}{' '}
              <Link
                href="/login"
                className="text-brand-purple font-bold hover:text-brand-purple-hover transition-colors duration-200 relative inline-block"
              >
                {t('loginLink')}
              </Link>
            </div>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-slate-600 text-xs mt-5 font-medium">
          {t('copyright')}
        </p>
      </div>
    </div>
  )
}
