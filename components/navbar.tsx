'use client'

import React, { useState, useEffect } from 'react'
import { Logo } from './logo'
import { useTheme } from './theme-provider'
import { useLanguage } from './language-provider'
import {
  Bell,
  Sun,
  Moon,
  Wallet,
  User as UserIcon,
  LogOut,
  LogIn,
  ChevronDown,
  Languages,
  GraduationCap,
  LayoutDashboard,
  BookOpen,
  CheckCircle,
  MessageSquare,
  Sparkles,
} from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

interface User {
  id: string
  name: string
  email: string
  role: 'STUDENT' | 'INSTRUCTOR' | 'ADMIN'
  walletBalance: number
  avatar?: string
}

interface NotificationItem {
  id: string
  title: string
  message: string
  type: string
  read: boolean
  createdAt: string
}

export function Navbar({ currentUser }: { currentUser?: User | null }) {
  const { theme, toggleTheme } = useTheme()
  const { t, language, setLanguage } = useLanguage()
  const router = useRouter()
  const [showNotifications, setShowNotifications] = useState(false)
  const [showProfileMenu, setShowProfileMenu] = useState(false)
  const [showLangMenu, setShowLangMenu] = useState(false)
  const [notifications, setNotifications] = useState<NotificationItem[]>([])
  const [unreadCount, setUnreadCount] = useState(0)

  useEffect(() => {
    if (currentUser) {
      fetchNotifications()
    }
  }, [currentUser])

  const fetchNotifications = async () => {
    try {
      const res = await fetch('/api/notifications')
      if (res.ok) {
        const data = await res.json()
        setNotifications(data.notifications || [])
        setUnreadCount(data.unreadCount || 0)
      }
    } catch (e) {
      console.error(e)
    }
  }

  const markNotificationsRead = async () => {
    try {
      await fetch('/api/notifications', { method: 'PUT' })
      setUnreadCount(0)
    } catch (e) {
      console.error(e)
    }
  }

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/login')
    router.refresh()
  }

  const getDashboardLink = () => {
    if (!currentUser) return '/login'
    if (currentUser.role === 'ADMIN') return '/admin/dashboard'
    if (currentUser.role === 'INSTRUCTOR') return '/instructor/dashboard'
    return '/student/dashboard'
  }

  const getProfileLink = () => {
    if (!currentUser) return '/login'
    if (currentUser.role === 'ADMIN') return '/admin/profile'
    if (currentUser.role === 'INSTRUCTOR') return '/instructor/profile'
    return '/student/profile'
  }

  const languages = [
    { code: 'ar', name: 'العربية', flag: '🇸🇦' },
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
    { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
    { code: 'es', name: 'Español', flag: '🇪🇸' },
  ]

  return (
    <header className="sticky top-0 z-40 w-full bg-white/90 dark:bg-slate-900/90 backdrop-blur border-b border-slate-200 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Logo & Brand */}
        <div className="flex items-center gap-4">
          <Link href="/courses" className="flex items-center gap-2 hover:opacity-90 transition">
            <Logo size="md" />
          </Link>
        </div>

        {/* Right side controls */}
        <div className="flex items-center gap-2">
          
          {/* User Balance Badge */}
          {currentUser && (
            <div className="hidden sm:flex items-center gap-2 bg-purple-50 dark:bg-slate-800 px-3 py-1.5 rounded-full border border-purple-200 dark:border-slate-700">
              <Wallet className="w-4 h-4 text-brand-orange" />
              <span className="text-xs font-bold text-brand-purple dark:text-purple-400">
                {currentUser.walletBalance?.toFixed(0) || 0} {t('currency')}
              </span>
            </div>
          )}

          {/* Language Switcher */}
          <div className="relative">
            <button
              onClick={() => setShowLangMenu(!showLangMenu)}
              className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition flex items-center gap-1"
              title={t('language')}
            >
              <Languages className="w-5 h-5" />
              <span className="text-xs font-bold hidden sm:inline">{language.toUpperCase()}</span>
            </button>

            {showLangMenu && (
              <div className="absolute left-0 sm:left-auto right-0 mt-2 w-48 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl p-2 z-50">
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => {
                      setLanguage(lang.code as 'ar' | 'en' | 'fr' | 'de' | 'es')
                      setShowLangMenu(false)
                    }}
                    className={`w-full flex items-center gap-2 px-3 py-2 text-xs font-medium rounded-lg transition ${
                      language === lang.code
                        ? 'bg-brand-purple text-white'
                        : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    <span className="text-base">{lang.flag}</span>
                    <span>{lang.name}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition"
            title={t('changeTheme')}
          >
            {theme === 'dark' ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-slate-700" />}
          </button>

          {/* Login Button */}
          <Link
            href="/login"
            className="flex items-center gap-1.5 px-3 py-2 bg-brand-purple hover:bg-brand-purple-hover text-white text-xs font-bold rounded-lg shadow transition btn-hover whitespace-nowrap"
            title="تسجيل الدخول"
          >
            <LogIn className="w-4 h-4" />
            <span className="hidden sm:inline">تسجيل الدخول</span>
          </Link>

          {/* Notifications Bell */}
          {currentUser && (
            <div className="relative">
              <button
                onClick={() => {
                  setShowNotifications(!showNotifications)
                  if (!showNotifications && unreadCount > 0) {
                    markNotificationsRead()
                  }
                }}
                className="relative p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition"
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-brand-orange text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-pulse">
                    {unreadCount}
                  </span>
                )}
              </button>

              {showNotifications && (
                <div className="absolute left-0 sm:left-auto right-0 mt-2 w-80 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl p-3 z-50">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800 mb-2">
                    <h4 className="font-bold text-sm text-slate-800 dark:text-slate-200">{t('dashboard')}</h4>
                    <span className="text-xs text-brand-purple font-medium">{notifications.length} {t('courses')}</span>
                  </div>

                  <div className="max-h-64 overflow-y-auto space-y-2">
                    {notifications.length === 0 ? (
                      <p className="text-xs text-slate-400 text-center py-4">{t('noNotifications')}</p>
                    ) : (
                      notifications.map((n) => (
                        <div
                          key={n.id}
                          className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 transition flex items-start gap-2.5"
                        >
                          <div className="mt-0.5">
                            {n.type === 'success' ? (
                              <CheckCircle className="w-4 h-4 text-emerald-500" />
                            ) : n.type === 'message' ? (
                              <MessageSquare className="w-4 h-4 text-brand-purple" />
                            ) : (
                              <Sparkles className="w-4 h-4 text-brand-orange" />
                            )}
                          </div>
                          <div>
                            <p className="text-xs font-bold text-slate-800 dark:text-slate-200">{n.title}</p>
                            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">{n.message}</p>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Profile Dropdown */}
          {currentUser ? (
            <div className="relative">
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex items-center gap-2 p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition"
              >
                <div className="w-9 h-9 rounded-full bg-brand-purple text-white font-bold flex items-center justify-center overflow-hidden ring-2 ring-brand-orange/30">
                  {currentUser.avatar ? (
                    <img src={currentUser.avatar} alt={currentUser.name} className="w-full h-full object-cover" />
                  ) : (
                    <GraduationCap className="w-5 h-5" />
                  )}
                </div>
                <div className="hidden md:block text-right">
                  <p className="text-xs font-bold text-slate-800 dark:text-slate-200">{currentUser.name}</p>
                </div>
                <ChevronDown className="w-4 h-4 text-slate-400" />
              </button>

              {showProfileMenu && (
                <div className="absolute left-0 mt-2 w-56 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl p-2 z-50">
                  <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-800 mb-1">
                    <p className="text-xs font-bold text-slate-800 dark:text-slate-200">{currentUser.name}</p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">{currentUser.email}</p>
                  </div>

                  <Link
                    href={getDashboardLink()}
                    className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-purple-50 dark:hover:bg-slate-800 rounded-lg transition"
                    onClick={() => setShowProfileMenu(false)}
                  >
                    <LayoutDashboard className="w-4 h-4 text-brand-purple" />
                    {t('dashboard')}
                  </Link>

                  <Link
                    href={getProfileLink()}
                    className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-purple-50 dark:hover:bg-slate-800 rounded-lg transition"
                    onClick={() => setShowProfileMenu(false)}
                  >
                    <UserIcon className="w-4 h-4 text-brand-purple" />
                    {t('profile')}
                  </Link>

                  <Link
                    href="/courses"
                    className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-purple-50 dark:hover:bg-slate-800 rounded-lg transition"
                    onClick={() => setShowProfileMenu(false)}
                  >
                    <BookOpen className="w-4 h-4 text-brand-purple" />
                    {t('courses')}
                  </Link>

                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-lg transition mt-1"
                  >
                    <LogOut className="w-4 h-4" />
                    {t('logout')}
                  </button>
                </div>
              )}
            </div>
          ) : null}
        </div>
      </div>
    </header>
  )
}
