'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { Navbar } from '@/components/navbar'
import { Sidebar } from '@/components/sidebar'
import {
  Users,
  BookOpen,
  DollarSign,
  UserPlus,
  Award,
  PlusCircle,
  CreditCard,
  ShieldCheck,
} from 'lucide-react'
import { useLanguage } from '@/components/language-provider'

export default function AdminDashboard() {
  const { t } = useLanguage()
  const [user, setUser] = useState<any>(null)
  const [usersList, setUsersList] = useState<any[]>([])
  const [showAddModal, setShowAddModal] = useState(false)
  const [newUser, setNewUser] = useState({ name: '', email: '', password: '', role: 'STUDENT' })
  const [isCreating, setIsCreating] = useState(false)
  const reportData = { totalCertificates: 0 }

  useEffect(() => {
    fetch('/api/auth/me')
      .then((res) => res.json())
      .then((d) => setUser(d.user))

    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      const res = await fetch('/api/admin/users')
      if (res.ok) {
        const data = await res.json()
        setUsersList(data.users || [])
      }
    } catch (e) {
      console.error(e)
    }
  }

  const handleUpdateRole = async (userId: string, newRole: string) => {
    try {
      const res = await fetch('/api/admin/users', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: userId, role: newRole }),
      })
      if (res.ok) {
        fetchUsers()
      }
    } catch (e) {
      console.error(e)
    }
  }

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsCreating(true)
    try {
      const res = await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newUser),
      })
      if (res.ok) {
        setShowAddModal(false)
        setNewUser({ name: '', email: '', password: '', role: 'STUDENT' })
        fetchUsers()
        alert(t('userCreated'))
      } else {
        const data = await res.json()
        alert(data.error || t('createFailed'))
      }
    } catch (e) {
      console.error(e)
      alert(t('connectionError'))
    } finally {
      setIsCreating(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans page-transition" dir="rtl">
      <Navbar currentUser={user} />

      <div className="flex-1 flex">
        <Sidebar role="ADMIN" activeTab="dashboard" />

        <main className="flex-1 p-4 sm:p-6 space-y-4 sm:space-y-6 overflow-y-auto min-w-0">
          
          {/* Header Banner */}
          <div className="bg-gradient-to-r from-purple-950 via-slate-900 to-brand-purple text-white p-4 sm:p-6 rounded-2xl shadow-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 animate-fade-in-up">
            <div>
              <h1 className="text-xl sm:text-2xl font-black">{t('adminControlCenter')}</h1>
              <p className="text-xs text-purple-200 mt-1">{t('platformUsers')}، {t('userManagement')}، {t('courses')}، {t('payments')}.</p>
            </div>
            <span className="px-3.5 py-1.5 bg-brand-orange text-white text-xs font-black rounded-full shadow">
              {t('fullAccessAdmin')}
            </span>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setShowAddModal(true)}
              className="px-4 py-2 bg-brand-purple hover:bg-brand-purple-hover text-white text-xs font-bold rounded-xl shadow transition btn-hover flex items-center gap-2"
            >
              <UserPlus className="w-4 h-4" />
              {t('addNew')}
            </button>
            <Link
              href="/instructor/create-course"
              className="px-4 py-2 bg-brand-orange hover:bg-brand-orange-hover text-white text-xs font-bold rounded-xl shadow transition btn-hover flex items-center gap-2"
            >
              <PlusCircle className="w-4 h-4" />
              {t('createCourse')}
            </Link>
            <Link
              href="/admin/payments"
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow transition btn-hover flex items-center gap-2"
            >
              <CreditCard className="w-4 h-4" />
              {t('payments')}
            </Link>
          </div>

          {/* Add User Modal */}
          {showAddModal && (
            <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl p-6 w-full max-w-md animate-fade-in-up">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-black text-slate-800 dark:text-slate-200">{t('addNew')}</h3>
                  <button
                    onClick={() => setShowAddModal(false)}
                    className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                  >
                    ✕
                  </button>
                </div>

                <form onSubmit={handleCreateUser} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">{t('fullName')}</label>
                    <input
                      type="text"
                      required
                      value={newUser.name}
                      onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                      className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs outline-none focus:ring-2 focus:ring-brand-purple"
                      placeholder={t('fullNamePlaceholder')}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">{t('email')}</label>
                    <input
                      type="email"
                      required
                      value={newUser.email}
                      onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                      className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs outline-none focus:ring-2 focus:ring-brand-purple"
                      placeholder={t('emailPlaceholder')}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">{t('password')}</label>
                    <input
                      type="password"
                      required
                      value={newUser.password}
                      onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                      className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs outline-none focus:ring-2 focus:ring-brand-purple"
                      placeholder={t('passwordPlaceholder')}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">{t('roleLabel')}</label>
                    <select
                      value={newUser.role}
                      onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                      className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs outline-none focus:ring-2 focus:ring-brand-purple"
                    >
                      <option value="STUDENT">{t('studentOption')}</option>
                      <option value="ADMIN">{t('admin')}</option>
                    </select>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setShowAddModal(false)}
                      className="flex-1 py-2.5 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-bold hover:bg-slate-50 dark:hover:bg-slate-800 transition"
                    >
                      {t('cancel')}
                    </button>
                    <button
                      type="submit"
                      disabled={isCreating}
                      className="flex-1 py-2.5 bg-brand-purple hover:bg-brand-purple-hover text-white rounded-xl text-xs font-bold transition btn-hover"
                    >
                      {isCreating ? t('creatingAccount') : t('addNew')}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Platform Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-3 sm:p-4 rounded-2xl shadow-sm flex items-center gap-2 sm:gap-3 card-hover animate-fade-in-up stagger-1">
              <div className="p-2 sm:p-3 bg-purple-50 dark:bg-slate-800 text-brand-purple rounded-xl">
                <Users className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <div>
                 <p className="text-[10px] sm:text-[11px] text-slate-500 font-semibold">{t('platformUsers')}</p>
                 <p className="text-lg sm:text-xl font-black text-slate-800 dark:text-slate-100">{usersList.length || 5} {t('users')}</p>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-3 sm:p-4 rounded-2xl shadow-sm flex items-center gap-2 sm:gap-3 card-hover animate-fade-in-up stagger-2">
              <div className="p-2 sm:p-3 bg-orange-50 dark:bg-slate-800 text-brand-orange rounded-xl">
                <BookOpen className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <div>
                 <p className="text-[10px] sm:text-[11px] text-slate-500 font-semibold">{t('availableCourses')}</p>
                 <p className="text-lg sm:text-xl font-black text-slate-800 dark:text-slate-100">3 {t('courses')}</p>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-3 sm:p-4 rounded-2xl shadow-sm flex items-center gap-2 sm:gap-3 card-hover animate-fade-in-up stagger-3">
              <div className="p-2 sm:p-3 bg-emerald-50 dark:bg-slate-800 text-emerald-600 rounded-xl">
                <DollarSign className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <div>
                 <p className="text-[10px] sm:text-[11px] text-slate-500 font-semibold">{t('platformRevenue')}</p>
                 <p className="text-lg sm:text-xl font-black text-emerald-600">45,800 {t('currency')}</p>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-3 sm:p-4 rounded-2xl shadow-sm flex items-center gap-2 sm:gap-3 card-hover animate-fade-in-up stagger-4">
              <div className="p-2 sm:p-3 bg-blue-50 dark:bg-slate-800 text-blue-600 rounded-xl">
                <Award className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <div>
                 <p className="text-[11px] text-slate-500 font-semibold">{t('issuedCertificates')}</p>
                 <p className="text-xl font-black text-slate-800 dark:text-slate-100">{reportData.totalCertificates} {t('certificates')}</p>
              </div>
            </div>
          </div>

          {/* User Management Table */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                <Users className="w-5 h-5 text-brand-purple" />
                {t('usersRolesControl')}:
              </h2>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-right text-xs">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 font-bold">
                    <th className="py-3 px-4">{t('user')}</th>
                    <th className="py-3 px-4">{t('email')}</th>
                    <th className="py-3 px-4">{t('accountRole')}</th>
                    <th className="py-3 px-4">{t('actions')}</th>
                  </tr>
                </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                  {usersList.map((u) => (
                    <tr key={u.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                      <td className="py-3 px-4 font-bold text-slate-800 dark:text-slate-200">{u.name}</td>
                      <td className="py-3 px-4 text-slate-500">{u.email}</td>
                      <td className="py-3 px-4">
                        <select
                          value={u.role}
                          onChange={(e) => handleUpdateRole(u.id, e.target.value)}
                          className="bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 px-2 py-1 rounded-lg font-bold outline-none border border-slate-200 dark:border-slate-700"
                        >
                          <option value="STUDENT">{t('studentOption')}</option>
                          <option value="INSTRUCTOR">{t('instructorOption')}</option>
                          <option value="ADMIN">{t('adminOption')}</option>
                        </select>
                      </td>
                       <td className="py-3 px-4">
                           <div className="flex items-center gap-2">
                             <button
                               onClick={async () => {
                                 if (confirm(t('deleteUserConfirm'))) {
                                   const res = await fetch(`/api/admin/users?id=${u.id}`, { method: 'DELETE' })
                                   if (res.ok) {
                                     fetchUsers()
                                   }
                                 }
                               }}
                               className="px-3 py-1 bg-rose-600/10 text-rose-600 hover:bg-rose-600 hover:text-white rounded-lg font-bold transition"
                             >
                               {t('delete')}
                             </button>
                           </div>
                         </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Admin Power Section */}
          <div className="bg-gradient-to-l from-purple-50 to-orange-50 dark:from-slate-900 dark:to-slate-900 border border-purple-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
            <h2 className="text-sm font-black text-slate-800 dark:text-slate-200 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-brand-purple" />
              {t('adminControlCenter')}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4">
                <h3 className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">إدارة المستخدمين</h3>
                <p className="text-[11px] text-slate-500 mb-3">إضافة، تعديل، أو حذف أي مستخدم من المنصة</p>
                <button onClick={() => setShowAddModal(true)} className="w-full py-2 bg-brand-purple text-white text-xs font-bold rounded-lg">{t('addNew')}</button>
              </div>
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4">
                <h3 className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">إدارة الكورسات</h3>
                <p className="text-[11px] text-slate-500 mb-3">إنشاء أو مراجعة جميع الكورسات على المنصة</p>
                <Link href="/instructor/create-course" className="block w-full py-2 bg-brand-orange text-white text-xs font-bold rounded-lg text-center">{t('createCourse')}</Link>
              </div>
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4">
                <h3 className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">المدفوعات والمحفظة</h3>
                <p className="text-[11px] text-slate-500 mb-3">شحن المحافظ، متابعة المدفوعات، وإدارة الاشتراكات</p>
                <Link href="/admin/payments" className="block w-full py-2 bg-emerald-600 text-white text-xs font-bold rounded-lg text-center">{t('payments')}</Link>
              </div>
            </div>
          </div>


        </main>
      </div>
    </div>
  )
}
