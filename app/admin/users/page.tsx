'use client'

import React, { useState, useEffect } from 'react'
import { Navbar } from '@/components/navbar'
import { Sidebar } from '@/components/sidebar'
import {
  Users,
  Search,
  ShieldCheck,
  Trash2,
  Wallet,
  X,
} from 'lucide-react'
import { useLanguage } from '@/components/language-provider'

interface User {
  id: string
  name: string
  email: string
  role: string
  walletBalance: number
  avatar?: string
  createdAt: string
  _count?: { enrollments: number; courses: number; certificates: number }
}

export default function AdminUsers() {
  const { t } = useLanguage()
  const [user, setUser] = useState<any>(null)
  const [usersList, setUsersList] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState('')
  const [showEditRole, setShowEditRole] = useState<string | null>(null)
  const [showEditWallet, setShowEditWallet] = useState<string | null>(null)
  const [newRole, setNewRole] = useState('')
  const [walletAmount, setWalletAmount] = useState('')

  useEffect(() => {
    fetchUser()
    fetchUsers()
  }, [])

  const fetchUser = async () => {
    try {
      const res = await fetch('/api/auth/me')
      if (res.ok) {
        const data = await res.json()
        setUser(data.user)
      }
    } catch (e) {
      console.error(e)
    }
  }

  const fetchUsers = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/users')
      if (res.ok) {
        const data = await res.json()
        setUsersList(data.users || [])
      }
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateRole = async (userId: string, role: string) => {
    try {
      const res = await fetch('/api/admin/users', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: userId, role }),
      })
      if (res.ok) {
        fetchUsers()
        setShowEditRole(null)
      }
    } catch (e) {
      console.error(e)
    }
  }

  const handleUpdateWallet = async (userId: string, amount: string) => {
    try {
      const res = await fetch('/api/admin/users', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: userId, walletBalance: amount }),
      })
      if (res.ok) {
        fetchUsers()
        setShowEditWallet(null)
        setWalletAmount('')
      }
    } catch (e) {
      console.error(e)
    }
  }

  const handleDeleteUser = async (userId: string) => {
    if (!confirm(t('confirmDeleteUser'))) return
    try {
      const res = await fetch(`/api/admin/users?id=${userId}`, { method: 'DELETE' })
      if (res.ok) {
        fetchUsers()
      }
    } catch (e) {
      console.error(e)
    }
  }

  const filteredUsers = usersList.filter((u) => {
    const matchesSearch = u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase())
    const matchesRole = !roleFilter || u.role === roleFilter
    return matchesSearch && matchesRole
  })

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans" dir="rtl">
      <Navbar currentUser={user} />

      <div className="flex-1 max-w-7xl w-full mx-auto flex">
        <Sidebar role="ADMIN" activeTab="users" />

        <main className="flex-1 p-6 space-y-6 overflow-y-auto">
          <div className="bg-gradient-to-r from-purple-950 via-slate-900 to-brand-purple text-white p-6 rounded-2xl shadow-lg flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-black">{t('manageUsers')}</h1>
              <p className="text-xs text-purple-200 mt-1">{t('usersDescription')}</p>
            </div>
            <span className="px-3.5 py-1.5 bg-brand-orange text-white text-xs font-black rounded-full shadow">
              {usersList.length} {t('users')}
            </span>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex-1 min-w-[240px] relative">
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder={t('searchByNameOrEmail')}
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pr-10 pl-4 py-2 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium text-slate-800 dark:text-slate-200 outline-none focus:ring-2 focus:ring-brand-purple/50"
                />
              </div>
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="px-4 py-2 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-800 dark:text-slate-200 outline-none"
              >
                <option value="">{t('allRoles')}</option>
                <option value="STUDENT">{t('student')}</option>
                <option value="INSTRUCTOR">{t('instructor')}</option>
                <option value="ADMIN">{t('admin')}</option>
              </select>
            </div>

            {loading ? (
              <div className="text-center py-12 text-slate-400 text-xs">{t('loading')}</div>
            ) : filteredUsers.length === 0 ? (
              <div className="text-center py-12 text-slate-400 text-xs">{t('noUsers')}</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-right text-xs">
                  <thead>
                     <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 font-bold">
                       <th className="py-3 px-4">{t('user')}</th>
                       <th className="py-3 px-4">{t('email')}</th>
                       <th className="py-3 px-4">{t('role')}</th>
                       <th className="py-3 px-4">{t('walletBalance')}</th>
                       <th className="py-3 px-4">{t('createdAt')}</th>
                       <th className="py-3 px-4">{t('actions')}</th>
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                    {filteredUsers.map((u) => (
                      <tr key={u.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-brand-purple text-white font-bold flex items-center justify-center text-xs">
                              {u.avatar ? <img src={u.avatar} alt="" className="w-full h-full rounded-full object-cover" /> : u.name.charAt(0)}
                            </div>
                            <span className="font-bold text-slate-800 dark:text-slate-200">{u.name}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-slate-500">{u.email}</td>
                        <td className="py-3 px-4">
                          {showEditRole === u.id ? (
                            <div className="flex items-center gap-1">
                              <select
                                value={newRole}
                                onChange={(e) => setNewRole(e.target.value)}
                                className="bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 px-2 py-1 rounded-lg font-bold outline-none border border-slate-200 dark:border-slate-700 text-xs"
                              >
                                 <option value="STUDENT">{t('student')}</option>
                                 <option value="INSTRUCTOR">{t('instructor')}</option>
                                 <option value="ADMIN">{t('admin')}</option>
                              </select>
                               <button
                                 onClick={() => handleUpdateRole(u.id, newRole)}
                                 className="px-2 py-1 bg-brand-purple text-white rounded-lg text-xs font-bold"
                               >
                                 {t('save')}
                               </button>
                              <button
                                onClick={() => setShowEditRole(null)}
                                className="p-1 hover:bg-slate-200 rounded-lg"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </div>
                          ) : (
                            <span className={`px-2 py-1 rounded-lg text-xs font-bold ${
                              u.role === 'ADMIN' ? 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400' :
                              u.role === 'INSTRUCTOR' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' :
                              'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                            }`}>
                              {u.role}
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-4 font-bold text-brand-purple">
                          {showEditWallet === u.id ? (
                            <div className="flex items-center gap-1">
                              <input
                                type="number"
                                value={walletAmount}
                                onChange={(e) => setWalletAmount(e.target.value)}
                                className="w-20 px-2 py-1 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-bold outline-none"
                                 placeholder={t('amount')}
                              />
                               <button
                                 onClick={() => handleUpdateWallet(u.id, walletAmount)}
                                 className="px-2 py-1 bg-emerald-600 text-white rounded-lg text-xs font-bold"
                               >
                                 {t('save')}
                               </button>
                              <button
                                onClick={() => { setShowEditWallet(null); setWalletAmount('') }}
                                className="p-1 hover:bg-slate-200 rounded-lg"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </div>
                          ) : (
                             <span>{u.walletBalance.toFixed(0)} {t('currency')}</span>
                          )}
                        </td>
                        <td className="py-3 px-4 text-slate-500">
                          {new Date(u.createdAt).toLocaleDateString('ar-EG')}
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => { setShowEditRole(u.id); setNewRole(u.role) }}
                              className="p-1.5 hover:bg-blue-50 dark:hover:bg-slate-800 text-blue-600 rounded-lg transition"
                               title={t('editRole')}
                            >
                              <ShieldCheck className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => { setShowEditWallet(u.id); setWalletAmount(String(u.walletBalance)) }}
                              className="p-1.5 hover:bg-emerald-50 dark:hover:bg-slate-800 text-emerald-600 rounded-lg transition"
                               title={t('editWallet')}
                            >
                              <Wallet className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteUser(u.id)}
                              className="p-1.5 hover:bg-rose-50 dark:hover:bg-slate-800 text-rose-600 rounded-lg transition"
                               title={t('deleteUser')}
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}
