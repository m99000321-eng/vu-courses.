'use client'

import React, { useState, useEffect } from 'react'
import { Navbar } from '@/components/navbar'
import { Sidebar } from '@/components/sidebar'
import {
  Search,
  Filter,
  Calendar,
  ChevronDown,
} from 'lucide-react'
import { useLanguage } from '@/components/language-provider'

interface Payment {
  id: string
  amount: number
  paymentMethod: string
  status: string
  description?: string
  createdAt: string
  user: { id: string; name: string; email: string }
}

export default function AdminPayments() {
  const { t } = useLanguage()
  const [user, setUser] = useState<any>(null)
  const [payments, setPayments] = useState<Payment[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [showFilters, setShowFilters] = useState(false)
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')

  useEffect(() => {
    fetchUser()
    fetchPayments()
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

  const fetchPayments = async () => {
    setLoading(true)
    try {
      let url = '/api/admin/payments'
      const params = new URLSearchParams()
      if (statusFilter) params.set('status', statusFilter)
      if (startDate) params.set('startDate', startDate)
      if (endDate) params.set('endDate', endDate)
      if (search) params.set('userId', search)

      const queryString = params.toString()
      if (queryString) url += `?${queryString}`

      const res = await fetch(url)
      if (res.ok) {
        const data = await res.json()
        setPayments(data.payments || [])
      }
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  const filteredPayments = payments.filter((p) =>
    p.user.name.toLowerCase().includes(search.toLowerCase()) ||
    p.user.email.toLowerCase().includes(search.toLowerCase())
  )

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED': return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
      case 'PENDING': return 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
      case 'FAILED': return 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400'
      case 'REFUNDED': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
      default: return 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400'
    }
  }

  const getMethodLabel = (method: string) => {
    switch (method) {
      case 'WALLET': return t('wallet')
      case 'CREDIT_CARD': return t('creditCard')
      case 'BANK_TRANSFER': return t('bankTransfer')
      case 'CASH': return t('cash')
      default: return method
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans" dir="rtl">
      <Navbar currentUser={user} />

      <div className="flex-1 max-w-7xl w-full mx-auto flex">
        <Sidebar role="ADMIN" activeTab="payments" />

        <main className="flex-1 p-6 space-y-6 overflow-y-auto">
          <div className="bg-gradient-to-r from-purple-950 via-slate-900 to-brand-purple text-white p-6 rounded-2xl shadow-lg flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-black">{t('paymentsAndTransactions')}</h1>
              <p className="text-xs text-purple-200 mt-1">{t('paymentsDescription')}</p>
            </div>
            <span className="px-3.5 py-1.5 bg-brand-orange text-white text-xs font-black rounded-full shadow">
              {payments.length} {t('transactions')}
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
              <button
                onClick={() => { setShowFilters(!showFilters); fetchPayments() }}
                className="px-4 py-2 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition flex items-center gap-2"
              >
                <Filter className="w-4 h-4" />
                {t('filter')}
              </button>
            </div>

            {showFilters && (
              <div className="flex flex-wrap items-center gap-3 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-800 dark:text-slate-200 outline-none"
                >
                  <option value="">{t('allStatuses')}</option>
                  <option value="COMPLETED">{t('completed')}</option>
                  <option value="PENDING">{t('pending')}</option>
                  <option value="FAILED">{t('failed')}</option>
                  <option value="REFUNDED">{t('refunded')}</option>
                </select>
                <div className="flex items-center gap-2">
                   <label className="text-xs font-bold text-slate-600 dark:text-slate-400">{t('from')}:</label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium text-slate-800 dark:text-slate-200 outline-none"
                  />
                </div>
                <div className="flex items-center gap-2">
                   <label className="text-xs font-bold text-slate-600 dark:text-slate-400">{t('to')}:</label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium text-slate-800 dark:text-slate-200 outline-none"
                  />
                </div>
                <button
                  onClick={fetchPayments}
                  className="px-4 py-2 bg-brand-purple text-white text-xs font-bold rounded-xl hover:bg-brand-purple-hover transition"
                >
                  {t('apply')}
                </button>
              </div>
            )}

            {loading ? (
              <div className="text-center py-12 text-slate-400 text-xs">{t('loading')}</div>
            ) : filteredPayments.length === 0 ? (
              <div className="text-center py-12 text-slate-400 text-xs">{t('noTransactions')}</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-right text-xs">
                  <thead>
                     <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 font-bold">
                       <th className="py-3 px-4">{t('user')}</th>
                       <th className="py-3 px-4">{t('amount')}</th>
                       <th className="py-3 px-4">{t('paymentMethod')}</th>
                       <th className="py-3 px-4">{t('status')}</th>
                       <th className="py-3 px-4">{t('description')}</th>
                       <th className="py-3 px-4">{t('date')}</th>
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                    {filteredPayments.map((p) => (
                      <tr key={p.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-brand-purple text-white font-bold flex items-center justify-center text-xs">
                              {p.user.name.charAt(0)}
                            </div>
                            <div>
                              <span className="font-bold text-slate-800 dark:text-slate-200 block">{p.user.name}</span>
                              <span className="text-[10px] text-slate-400">{p.user.email}</span>
                            </div>
                          </div>
                        </td>
                         <td className="py-3 px-4 font-bold text-emerald-600 dark:text-emerald-400">
                          {p.amount.toFixed(2)} {t('currency')}
                        </td>
                        <td className="py-3 px-4 text-slate-500">{getMethodLabel(p.paymentMethod)}</td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-1 rounded-lg text-xs font-bold ${getStatusColor(p.status)}`}>
                            {p.status === 'COMPLETED' ? t('completed') : p.status === 'PENDING' ? t('pending') : p.status === 'FAILED' ? t('failed') : p.status === 'REFUNDED' ? t('refunded') : p.status}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-slate-500 max-w-xs truncate">{p.description || '-'}</td>
                        <td className="py-3 px-4 text-slate-500 flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {new Date(p.createdAt).toLocaleDateString('ar-EG')}
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
