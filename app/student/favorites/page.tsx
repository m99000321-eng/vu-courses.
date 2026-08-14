'use client'

import React, { useEffect, useState } from 'react'
import { Navbar } from '@/components/navbar'
import { Sidebar } from '@/components/sidebar'
import { Heart, Trash2, BookOpen, Star } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

interface Favorite {
  id: string
  createdAt: string
  course: {
    id: string
    title: string
    description: string
    thumbnail: string
    price: number
    rating: number
    instructor: { name: string; avatar: string }
  }
}

export default function FavoritesPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [favorites, setFavorites] = useState<Favorite[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      fetch('/api/auth/me').then((res) => res.json()),
      fetch('/api/favorites').then((res) => res.json()),
    ])
      .then(([userData, favData]) => {
        setUser(userData.user)
        setFavorites(favData.favorites || [])
      })
      .finally(() => setLoading(false))
  }, [])

  const requireAuth = () => {
    if (!user) {
      router.push('/login')
      return false
    }
    return true
  }

  const handleRemove = async (courseId: string) => {
    await fetch(`/api/favorites?courseId=${courseId}`, { method: 'DELETE' })
    setFavorites((prev) => prev.filter((f) => f.course.id !== courseId))
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans" dir="rtl">
      <Navbar currentUser={user} />

      <div className="flex-1 max-w-7xl w-full mx-auto flex">
        <Sidebar role="STUDENT" activeTab="favorites" />

        <main className="flex-1 p-6 space-y-6 overflow-y-auto">
          <div className="flex items-center gap-3">
            <Heart className="w-7 h-7 text-brand-purple" />
            <h1 className="text-xl font-black">الكورسات المفضلة</h1>
          </div>

          {loading ? (
            <p className="text-xs text-slate-400 text-center py-8">جاري تحميل البيانات...</p>
          ) : favorites.length === 0 ? (
            <div className="text-center py-12 space-y-3">
              <Heart className="w-16 h-16 text-slate-300 mx-auto" />
              <p className="text-sm text-slate-500">لا توجد كورسات في المفضلة</p>
              <Link
                href="/courses"
                onClick={(e) => {
                  if (!requireAuth()) e.preventDefault()
                }}
                className="inline-block px-5 py-2.5 bg-brand-purple text-white text-xs font-bold rounded-xl hover:bg-brand-purple-hover transition shadow"
              >
                استكشف الكورسات
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {favorites.map((fav) => (
                <div
                  key={fav.id}
                  className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-3"
                >
                  <div className="flex items-start justify-between">
                    <span className="px-2.5 py-1 bg-rose-50 text-rose-600 font-bold text-xs rounded-lg inline-block">
                      <Heart className="w-3 h-3 inline-block ml-1 fill-current" />
                      مفضل
                    </span>
                    <button
                      onClick={() => handleRemove(fav.course.id)}
                      className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-lg transition"
                      title="إزالة من المفضلة"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <h3 className="font-extrabold text-sm">{fav.course.title}</h3>
                  <p className="text-xs text-slate-500 line-clamp-2">{fav.course.description}</p>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 text-amber-500 fill-current" />
                      <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                        {fav.course.rating}
                      </span>
                    </div>
                    <span className="text-xs font-bold text-brand-purple">
                      {fav.course.price > 0 ? `${fav.course.price} ج.م` : 'مجاني'}
                    </span>
                  </div>

                  <Link
                    href={`/courses/${fav.course.id}`}
                    onClick={(e) => {
                      if (!requireAuth()) e.preventDefault()
                    }}
                    className="block w-full py-2.5 bg-brand-purple text-white font-bold text-xs rounded-xl text-center hover:bg-brand-purple-hover transition shadow"
                  >
                    <BookOpen className="w-4 h-4 inline-block ml-1" />
                    عرض الكورس
                  </Link>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
