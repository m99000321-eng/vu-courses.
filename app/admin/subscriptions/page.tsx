'use client'

import React, { useState, useEffect } from 'react'
import { Navbar } from '@/components/navbar'
import { Sidebar } from '@/components/sidebar'
import {
  DollarSign,
  PlusCircle,
  Edit,
  Trash2,
  Search,
  User,
} from 'lucide-react'
import { useLanguage } from '@/components/language-provider'

interface Plan {
  id: string
  name: string
  price: number
  durationDays: number
  features: string
  active: boolean
}

interface Subscription {
  id: string
  userId: string
  userName: string
  userEmail: string
  planId: string
  planName: string
  status: string
  startDate: string
  endDate: string
}

export default function AdminSubscriptions() {
  const { t } = useLanguage()
  const [user, setUser] = useState<any>(null)
  const [plans, setPlans] = useState<Plan[]>([])
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [showPlanForm, setShowPlanForm] = useState(false)
  const [editingPlanId, setEditingPlanId] = useState<string | null>(null)
  const [planForm, setPlanForm] = useState({ name: '', price: '', durationDays: '30', features: '' })

  useEffect(() => {
    fetchUser()
    fetchSubscriptions()
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

  const fetchSubscriptions = async () => {
    setLoading(true)
    try {
      const [plansRes, subsRes] = await Promise.all([
        fetch('/api/admin/subscriptions?type=plans'),
        fetch('/api/admin/subscriptions?type=subscriptions'),
      ])

      if (plansRes.ok) {
        const plansData = await plansRes.json()
        setPlans(plansData.plans || [])
      }
      if (subsRes.ok) {
        const subsData = await subsRes.json()
        setSubscriptions(subsData.subscriptions || [])
      }
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  const handlePlanSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const method = editingPlanId ? 'PUT' : 'POST'
      const body = editingPlanId
        ? { id: editingPlanId, ...planForm }
        : planForm

      const res = await fetch('/api/admin/subscriptions', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })

      if (res.ok) {
        fetchSubscriptions()
        resetPlanForm()
      }
    } catch (e) {
      console.error(e)
    }
  }

  const handleDeletePlan = async (id: string) => {
    if (!confirm(t('confirmDeletePlan'))) return
    try {
      const res = await fetch(`/api/admin/subscriptions?id=${id}`, { method: 'DELETE' })
      if (res.ok) {
        fetchSubscriptions()
      }
    } catch (e) {
      console.error(e)
    }
  }

  const resetPlanForm = () => {
    setShowPlanForm(false)
    setEditingPlanId(null)
    setPlanForm({ name: '', price: '', durationDays: '30', features: '' })
  }

  const startEditPlan = (plan: Plan) => {
    setEditingPlanId(plan.id)
    setPlanForm({
      name: plan.name,
      price: String(plan.price),
      durationDays: String(plan.durationDays),
      features: plan.features,
    })
    setShowPlanForm(true)
  }

  const filteredSubs = subscriptions.filter((s) =>
    s.userName.toLowerCase().includes(search.toLowerCase()) ||
    s.userEmail.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans" dir="rtl">
      <Navbar currentUser={user} />

      <div className="flex-1 max-w-7xl w-full mx-auto flex">
        <Sidebar role="ADMIN" activeTab="subscriptions" />

        <main className="flex-1 p-6 space-y-6 overflow-y-auto">
          <div className="bg-gradient-to-r from-purple-950 via-slate-900 to-brand-purple text-white p-6 rounded-2xl shadow-lg flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-black">{t('manageSubscriptions')}</h1>
              <p className="text-xs text-purple-200 mt-1">{t('subscriptionsDescription')}</p>
            </div>
            <button
              onClick={() => resetPlanForm()}
              className="px-4 py-2 bg-brand-orange text-white text-xs font-black rounded-xl hover:bg-brand-orange-hover transition flex items-center gap-2"
            >
              <PlusCircle className="w-4 h-4" />
              {t('addPlan')}
            </button>
          </div>

          {showPlanForm && (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
              <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 mb-4">
                {editingPlanId ? t('editPlan') : t('addNewPlan')}
              </h3>
              <form onSubmit={handlePlanSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                     <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1">{t('planName')}</label>
                    <input
                      type="text"
                      value={planForm.name}
                      onChange={(e) => setPlanForm({ ...planForm, name: e.target.value })}
                      required
                      className="w-full px-4 py-2 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium text-slate-800 dark:text-slate-200 outline-none focus:ring-2 focus:ring-brand-purple/50"
                    />
                  </div>
                  <div>
                     <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1">{t('price')} ({t('currency')})</label>
                    <input
                      type="number"
                      value={planForm.price}
                      onChange={(e) => setPlanForm({ ...planForm, price: e.target.value })}
                      required
                      className="w-full px-4 py-2 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium text-slate-800 dark:text-slate-200 outline-none focus:ring-2 focus:ring-brand-purple/50"
                    />
                  </div>
                  <div>
                     <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1">{t('duration')} ({t('days')})</label>
                    <input
                      type="number"
                      value={planForm.durationDays}
                      onChange={(e) => setPlanForm({ ...planForm, durationDays: e.target.value })}
                      className="w-full px-4 py-2 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium text-slate-800 dark:text-slate-200 outline-none focus:ring-2 focus:ring-brand-purple/50"
                    />
                  </div>
                  <div>
                     <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1">{t('features')}</label>
                    <input
                      type="text"
                      value={planForm.features}
                      onChange={(e) => setPlanForm({ ...planForm, features: e.target.value })}
                      className="w-full px-4 py-2 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium text-slate-800 dark:text-slate-200 outline-none focus:ring-2 focus:ring-brand-purple/50"
                    />
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="submit"
                    className="px-6 py-2 bg-brand-purple text-white text-xs font-bold rounded-xl hover:bg-brand-purple-hover transition"
                  >
                     {editingPlanId ? t('update') : t('add')}
                  </button>
                  <button
                    type="button"
                    onClick={resetPlanForm}
                    className="px-6 py-2 bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold rounded-xl hover:bg-slate-300 dark:hover:bg-slate-700 transition"
                  >
                     {t('cancel')}
                  </button>
                </div>
              </form>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
              <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-brand-purple" />
                {t('subscriptionPlans')}
              </h3>
               {plans.length === 0 ? (
                 <p className="text-xs text-slate-400 text-center py-8">{t('noPlans')}</p>
              ) : (
                <div className="space-y-3">
                  {plans.map((plan) => (
                    <div key={plan.id} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700">
                      <div>
                        <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">{plan.name}</h4>
                        <p className="text-[10px] text-slate-500 mt-1">{plan.features}</p>
                        <div className="flex items-center gap-3 mt-2">
                           <span className="text-sm font-black text-brand-purple">{plan.price} {t('currency')}</span>
                           <span className="text-[10px] text-slate-400">{plan.durationDays} {t('days')}</span>
                           <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${plan.active ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                             {plan.active ? t('active') : t('inactive')}
                           </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => startEditPlan(plan)}
                          className="p-1.5 hover:bg-blue-50 dark:hover:bg-slate-800 text-blue-600 rounded-lg transition"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeletePlan(plan.id)}
                          className="p-1.5 hover:bg-rose-50 dark:hover:bg-slate-800 text-rose-600 rounded-lg transition"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
              <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                <User className="w-4 h-4 text-brand-orange" />
                {t('activeSubscriptions')}
              </h3>
              <div className="relative">
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                   placeholder={t('search')}
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pr-10 pl-4 py-2 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium text-slate-800 dark:text-slate-200 outline-none focus:ring-2 focus:ring-brand-purple/50"
                />
              </div>
               {loading ? (
                 <div className="text-center py-8 text-slate-400 text-xs">{t('loading')}</div>
               ) : filteredSubs.length === 0 ? (
                 <p className="text-xs text-slate-400 text-center py-8">{t('noSubscriptions')}</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-right text-xs">
                    <thead>
                       <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 font-bold">
                         <th className="py-2 px-3">{t('user')}</th>
                         <th className="py-2 px-3">{t('plan')}</th>
                         <th className="py-2 px-3">{t('status')}</th>
                         <th className="py-2 px-3">{t('endDate')}</th>
                       </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                      {filteredSubs.map((sub) => (
                        <tr key={sub.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                          <td className="py-2 px-3">
                            <div>
                              <span className="font-bold text-slate-800 dark:text-slate-200 block">{sub.userName}</span>
                              <span className="text-[10px] text-slate-400">{sub.userEmail}</span>
                            </div>
                          </td>
                          <td className="py-2 px-3 text-slate-500">{sub.planName}</td>
                          <td className="py-2 px-3">
                            <span className={`px-2 py-1 rounded-lg text-[10px] font-bold ${sub.status === 'ACTIVE' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                               {sub.status === 'ACTIVE' ? t('active') : t('expired')}
                            </span>
                          </td>
                          <td className="py-2 px-3 text-slate-500">{new Date(sub.endDate).toLocaleDateString('ar-EG')}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
