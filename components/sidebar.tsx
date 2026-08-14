'use client'

import React, { useState, useEffect } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { useLanguage } from '@/components/language-provider'
import {
  LayoutDashboard,
  BookOpen,
  GraduationCap,
  TrendingUp,
  Award,
  MessageSquare,
  Bell,
  Heart,
  User,
  Settings,
  PlusCircle,
  Users,
  FileCheck,
  HelpCircle,
  BarChart3,
  ShieldCheck,
  CreditCard,
  Layers,
  FolderTree,
  FileText,
  DollarSign,
  Sliders,
  Sparkles,
  Menu,
  X,
} from 'lucide-react'

interface SidebarProps {
  role?: 'STUDENT' | 'INSTRUCTOR' | 'ADMIN'
  activeTab?: string
  onTabChange?: (tab: string) => void
}

export function Sidebar({ role = 'STUDENT', activeTab, onTabChange }: SidebarProps) {
  const pathname = usePathname()
  const router = useRouter()
  const { t } = useLanguage()
  const [isOpen, setIsOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024)
      if (window.innerWidth >= 1024) {
        setIsOpen(true)
      } else {
        setIsOpen(false)
      }
    }

    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const studentItems = [
    { id: 'dashboard', label: t('dashboard'), icon: LayoutDashboard, href: '/student/dashboard' },
    { id: 'courses', label: t('courses'), icon: BookOpen, href: '/courses' },
    { id: 'my-courses', label: t('myCourses'), icon: GraduationCap, href: '/student/my-courses' },
    { id: 'progress', label: t('myProgress'), icon: TrendingUp, href: '/student/progress' },
    { id: 'certificates', label: t('myCertificates'), icon: Award, href: '/student/certificates' },
    { id: 'chat', label: t('chat'), icon: MessageSquare, href: '/chat' },
    { id: 'notifications', label: t('notifications'), icon: Bell, href: '/notifications' },
    { id: 'favorites', label: t('favorites'), icon: Heart, href: '/student/favorites' },
    { id: 'profile', label: t('profile'), icon: User, href: '/student/profile' },
    { id: 'settings', label: t('settings'), icon: Settings, href: '/student/settings' },
  ]

  const instructorItems = [
    { id: 'dashboard', label: t('dashboard'), icon: LayoutDashboard, href: '/instructor/dashboard' },
    { id: 'my-courses', label: t('myCourses'), icon: BookOpen, href: '/instructor/my-courses' },
    { id: 'create-course', label: t('createCourse'), icon: PlusCircle, href: '/instructor/create-course' },
    { id: 'students', label: t('students'), icon: Users, href: '/instructor/students' },
    { id: 'assignments', label: t('assignments'), icon: FileCheck, href: '/instructor/assignments' },
    { id: 'quizzes', label: t('quizzes'), icon: HelpCircle, href: '/instructor/quizzes' },
    { id: 'chat', label: t('chat'), icon: MessageSquare, href: '/chat' },
    { id: 'analytics', label: t('analytics'), icon: BarChart3, href: '/instructor/analytics' },
    { id: 'profile', label: t('profile'), icon: User, href: '/instructor/profile' },
    { id: 'settings', label: t('settings'), icon: Settings, href: '/instructor/settings' },
  ]

  const adminItems = [
    { id: 'dashboard', label: t('dashboard'), icon: LayoutDashboard, href: '/admin/dashboard' },
    { id: 'users', label: t('userManagement'), icon: Users, href: '/admin/users' },
    { id: 'students', label: t('students'), icon: GraduationCap, href: '/admin/students' },
    { id: 'instructors', label: t('instructors'), icon: ShieldCheck, href: '/admin/instructors' },
    { id: 'courses', label: t('courses'), icon: BookOpen, href: '/courses' },
    { id: 'categories', label: t('categories'), icon: FolderTree, href: '/admin/categories' },
    { id: 'levels', label: t('levels'), icon: Layers, href: '/admin/levels' },
    { id: 'lessons', label: t('lessons'), icon: FileText, href: '/admin/lessons' },
    { id: 'quizzes', label: t('quizzes'), icon: HelpCircle, href: '/admin/quizzes' },
    { id: 'certificates', label: t('certificates'), icon: Award, href: '/admin/certificates' },
    { id: 'payments', label: t('payments'), icon: CreditCard, href: '/admin/payments' },
    { id: 'subscriptions', label: t('subscriptions'), icon: DollarSign, href: '/admin/subscriptions' },
    { id: 'reports', label: t('reports'), icon: BarChart3, href: '/admin/reports' },
    { id: 'notifications', label: t('notifications'), icon: Bell, href: '/notifications' },
    { id: 'chat', label: t('chat'), icon: MessageSquare, href: '/chat' },
    { id: 'settings', label: t('settings'), icon: Sliders, href: '/admin/settings' },
  ]

  const items = role === 'ADMIN' ? adminItems : role === 'INSTRUCTOR' ? instructorItems : studentItems

  const handleRoleSwitch = async (newRole: string) => {
    let email = 'student1@vucourses.com'
    let pass = 'pass123'
    if (newRole === 'INSTRUCTOR') {
      email = 'instructor@vucourses.com'
      pass = 'inst123'
    } else if (newRole === 'ADMIN') {
      email = 'admin@vucourses.com'
      pass = 'admin123'
    }

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password: pass }),
      })
      if (res.ok) {
        if (newRole === 'ADMIN') router.push('/admin/dashboard')
        else if (newRole === 'INSTRUCTOR') router.push('/instructor/dashboard')
        else router.push('/courses')
        router.refresh()
      }
    } catch (e) {
      console.error(e)
    }
  }

  const sidebarContent = (
    <>
      <div>
        {/* Role Badge Indicator */}
        <div className="mb-4 px-3 py-2 bg-gradient-to-r from-purple-500/10 to-orange-500/10 border border-purple-200 dark:border-slate-800 rounded-xl">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-brand-orange" />
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
              {role === 'ADMIN' ? t('adminMode') : role === 'INSTRUCTOR' ? t('instructorMode') : t('studentMode')}
            </span>
          </div>
        </div>

        {/* Sidebar Menu Items */}
        <nav className="space-y-1">
          {items.map((item) => {
            const Icon = item.icon
            const isActive = activeTab === item.id || pathname === item.href

            return (
              <button
                key={item.id}
                onClick={() => {
                  if (onTabChange) onTabChange(item.id)
                  router.push(item.href)
                  if (isMobile) setIsOpen(false)
                }}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition ${
                  isActive
                    ? 'bg-brand-purple text-white shadow-md shadow-brand-purple/20'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400 dark:text-slate-500'}`} />
                <span>{item.label}</span>
              </button>
            )
          })}
        </nav>
      </div>

      {/* Quick Role Switcher for Seamless Demo Testing */}
      <div className="pt-4 border-t border-slate-200 dark:border-slate-800 mt-6">
        <p className="text-[11px] font-bold text-slate-400 mb-2">{t('roleSwitcher')}</p>
        <div className="grid grid-cols-3 gap-1">
          <button
            onClick={() => handleRoleSwitch('STUDENT')}
            className={`py-1 px-1.5 text-[10px] font-bold rounded-lg transition ${
              role === 'STUDENT'
                ? 'bg-brand-orange text-white'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
            }`}
          >
            {t('student')}
          </button>
          <button
            onClick={() => handleRoleSwitch('INSTRUCTOR')}
            className={`py-1 px-1.5 text-[10px] font-bold rounded-lg transition ${
              role === 'INSTRUCTOR'
                ? 'bg-brand-orange text-white'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
            }`}
          >
            {t('instructor')}
          </button>
          <button
            onClick={() => handleRoleSwitch('ADMIN')}
            className={`py-1 px-1.5 text-[10px] font-bold rounded-lg transition ${
              role === 'ADMIN'
                ? 'bg-brand-orange text-white'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
            }`}
          >
            {t('admin')}
          </button>
        </div>
      </div>
    </>
  )

  return (
    <>
      {/* Mobile Toggle Button */}
      {isMobile && (
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="fixed top-4 right-4 z-50 p-2 bg-brand-purple text-white rounded-xl shadow-lg lg:hidden"
        >
          {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      )}

      {/* Overlay for mobile */}
      {isMobile && isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed inset-y-0 right-0 z-40 w-64 bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 shrink-0 
          transform transition-transform duration-300 ease-in-out
          lg:relative lg:translate-x-0 lg:block
          ${isOpen ? 'translate-x-0' : 'translate-x-full'}
          hidden lg:block
        `}
      >
        <div className="h-full overflow-y-auto p-4 flex flex-col justify-between">
          {sidebarContent}
        </div>
      </aside>

      {/* Mobile Sidebar Overlay */}
      {isMobile && isOpen && (
        <div className="fixed inset-y-0 right-0 z-50 w-64 bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 transform transition-transform duration-300 ease-in-out translate-x-0 lg:hidden">
          <div className="h-full overflow-y-auto p-4 flex flex-col justify-between">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  )
}
