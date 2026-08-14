'use client'

import React, { useState, useEffect } from 'react'
import { Navbar } from '@/components/navbar'
import { Sidebar } from '@/components/sidebar'
import { VideoPlayerModal } from '@/components/video-player-modal'
import { PdfViewerModal } from '@/components/pdf-viewer-modal'
import { QuizModal } from '@/components/quiz-modal'
import { CertificateModal } from '@/components/certificate-modal'
import {
  Play,
  FileText,
  HelpCircle,
  Clock,
  User,
  Star,
  BookOpen,
  Sparkles,
  Trash2,
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useLanguage } from '@/components/language-provider'

interface Lesson {
  id: string
  title: string
  type: 'VIDEO' | 'PDF' | 'TEST' | 'TEXT'
  contentUrl?: string
  pdfUrl?: string
  textContent?: string
  duration: string
  order: number
  quizzes?: any[]
}

interface Level {
  id: string
  levelNumber: number
  title: string
  description?: string
  lessons: Lesson[]
}

interface Course {
  id: string
  title: string
  description: string
  thumbnail?: string
  price: number
  duration: string
  rating: number
  studentsCount: number
  instructor: {
    name: string
    avatar?: string
  }
  levels: Level[]
}

export default function CoursesPage() {
  const router = useRouter()
  const { t } = useLanguage()
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [courses, setCourses] = useState<Course[]>([])
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null)
  const [activeLevelNumber, setActiveLevelNumber] = useState<number>(1)
  const [isLoading, setIsLoading] = useState(true)

  // Active Modals state
  const [activeVideo, setActiveVideo] = useState<{ isOpen: boolean; title: string; videoUrl: string; lessonId: string } | null>(null)
  const [activePdf, setActivePdf] = useState<{ isOpen: boolean; title: string; pdfUrl?: string; textContent?: string; lessonId: string } | null>(null)
  const [activeQuiz, setActiveQuiz] = useState<{ isOpen: boolean; quizId: string; title: string; questions: any[] } | null>(null)
  const [activeCert, setActiveCert] = useState<{ isOpen: boolean; certCode: string } | null>(null)
  const [isAddingLevel, setIsAddingLevel] = useState(false)

  useEffect(() => {
    fetchAuthUser()
    fetchCourses()
  }, [])

  const fetchAuthUser = async () => {
    try {
      const res = await fetch('/api/auth/me')
      if (res.ok) {
        const data = await res.json()
        setCurrentUser(data.user)
      }
    } catch (e) {
      console.error(e)
    }
  }

  const requireAuth = () => {
    if (!currentUser) {
      router.push('/login')
      return false
    }
    return true
  }

  const fetchCourses = async () => {
    setIsLoading(true)
    try {
      const res = await fetch('/api/courses')
      if (res.ok) {
        const data = await res.json()
        setCourses(data.courses || [])
        if (data.courses && data.courses.length > 0) {
          setSelectedCourse(data.courses[0])
        }
      }
    } catch (e) {
      console.error(e)
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddLevel = async () => {
    if (!selectedCourse) return
    setIsAddingLevel(true)
    try {
      const res = await fetch(`/api/courses/${selectedCourse.id}/levels`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
         body: JSON.stringify({ title: `Level ${selectedCourse.levels.length + 1}: ${t('newLevelAdded')}` }),
      })
      if (res.ok) {
        await fetchCourses()
        setActiveLevelNumber(selectedCourse.levels.length + 1)
      }
    } catch (e) {
      console.error(e)
    } finally {
      setIsAddingLevel(false)
    }
  }

  const handleDeleteLevel = async (levelId: string) => {
    if (!selectedCourse) return
    if (!confirm(t('confirmDeleteLevel'))) return

    try {
      const res = await fetch(`/api/courses/${selectedCourse.id}/levels`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ levelId }),
      })

      if (res.ok) {
        await fetchCourses()
        const remainingLevels = selectedCourse.levels.filter((l) => l.id !== levelId)
        if (remainingLevels.length > 0) {
          setActiveLevelNumber(remainingLevels[0].levelNumber)
        }
      }
    } catch (e) {
      console.error(e)
    }
  }

  const activeLevel = selectedCourse?.levels.find((l) => l.levelNumber === activeLevelNumber) || selectedCourse?.levels[0]

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans" dir="rtl">
      
      {/* Header Navbar */}
      <Navbar currentUser={currentUser} />

      <div className="flex-1 flex">
        
        {/* Role-Based Sidebar */}
        <Sidebar role={currentUser?.role || 'STUDENT'} activeTab="courses" />

        {/* Main Content Area */}
        <main className="flex-1 p-4 sm:p-6 space-y-4 sm:space-y-6 overflow-y-auto min-w-0">
          
          {/* Top Banner / Course Header */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-gradient-to-r from-purple-900 via-brand-purple to-slate-900 text-white p-4 sm:p-6 rounded-2xl shadow-lg relative overflow-hidden animate-fade-in-up">
            <div className="relative z-10 space-y-2 max-w-2xl">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 bg-brand-orange text-white text-[11px] font-extrabold rounded-full uppercase tracking-wider">
                  VU. COURSES PLATFORM
                </span>
                <span className="text-xs text-purple-200 font-semibold">{t('webDevelopment')}</span>
              </div>

              <h1 className="text-xl sm:text-2xl md:text-3xl font-black">
                {selectedCourse?.title || t('courseTitle')}
              </h1>

              <p className="text-xs text-purple-100/90 leading-relaxed">
                {selectedCourse?.description || t('courseDescription')}
              </p>

              <div className="flex items-center gap-4 pt-2 text-xs text-purple-200">
                <div className="flex items-center gap-1">
                  <User className="w-4 h-4 text-brand-orange" />
                  <span>{t('instructor')}: {selectedCourse?.instructor.name || 'م. أحمد محمود'}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4 text-amber-400" />
                  <span>{t('duration')}: {selectedCourse?.duration || '16 ساعة'}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-amber-400 fill-current" />
                  <span>{t('rating')}: {selectedCourse?.rating || 4.9}</span>
                </div>
              </div>
            </div>

            {/* Course Selector Dropdown if multiple courses */}
            <div className="relative z-10 shrink-0">
              <select
                value={selectedCourse?.id || ''}
                onChange={(e) => {
                  const c = courses.find((x) => x.id === e.target.value)
                  if (c) {
                    setSelectedCourse(c)
                    setActiveLevelNumber(1)
                  }
                }}
                className="bg-white/10 backdrop-blur border border-white/20 text-white text-xs font-bold py-2.5 px-4 rounded-xl outline-none cursor-pointer focus:ring-2 focus:ring-brand-orange"
              >
                {courses.map((c) => (
                  <option key={c.id} value={c.id} className="bg-slate-900 text-white">
                    {c.title}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Level Tabs Bar (Level 1, Level 2, Level 3, Level 4, +) */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm">
            <div className="flex items-center justify-between gap-2 overflow-x-auto pb-2 border-b border-slate-100 dark:border-slate-800 mb-4">
              
              <div className="flex items-center gap-2">
                {selectedCourse?.levels.map((lvl) => {
                  const isActive = activeLevelNumber === lvl.levelNumber
                  return (
                    <div key={lvl.id} className="relative group flex items-center">
                      <button
                        onClick={() => setActiveLevelNumber(lvl.levelNumber)}
                        className={`px-5 py-2.5 rounded-xl text-xs font-black transition flex items-center gap-2 whitespace-nowrap ${
                          isActive
                            ? 'bg-brand-purple text-white shadow-md shadow-brand-purple/20'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                        }`}
                      >
                        <Sparkles className={`w-3.5 h-3.5 ${isActive ? 'text-amber-400' : 'text-slate-400'}`} />
                        Level {lvl.levelNumber}
                      </button>
                      {['ADMIN', 'INSTRUCTOR'].includes(currentUser?.role || '') && selectedCourse.levels.length > 1 && (
                        <button
                          onClick={() => handleDeleteLevel(lvl.id)}
                          className="absolute -top-1 -left-1 w-5 h-5 bg-rose-500 hover:bg-rose-600 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 shadow-md z-10"
                           title={t('deleteLevel')}
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  )
                })}

                {['ADMIN', 'INSTRUCTOR'].includes(currentUser?.role || '') && (
                  <button
                    onClick={handleAddLevel}
                    disabled={isAddingLevel}
                    className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-slate-800 border border-purple-200 dark:border-slate-700 text-brand-purple dark:text-purple-400 hover:bg-brand-purple hover:text-white flex items-center justify-center transition shadow-sm font-bold"
                     title={t('addNewLevel')}
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                )}
              </div>

              <div className="hidden sm:flex items-center gap-2 text-xs font-bold text-slate-500">
                <span>{t('currentLevelLabel')}:</span>
                <span className="text-brand-purple font-black">{activeLevel?.title}</span>
              </div>
            </div>

            {/* Level Content Resource Cards */}
            <div className="space-y-4 pt-2">
              <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2 animate-fade-in-up">
                <BookOpen className="w-4 h-4 text-brand-orange" />
                {t('resourcesInLevel')}:
              </h3>

              {!activeLevel || activeLevel.lessons.length === 0 ? (
                <div className="text-center py-8 sm:py-12 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl animate-fade-in-up">
                  <p className="text-xs text-slate-400">{t('noLessonsYet')}</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                  {activeLevel.lessons.map((lesson, index) => {
                    const isVideo = lesson.type === 'VIDEO'
                    const isPdf = lesson.type === 'PDF'
                    const isTest = lesson.type === 'TEST'

                    return (
                      <div
                        key={lesson.id}
                        className={`bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 rounded-2xl p-4 sm:p-5 hover:border-brand-purple/50 transition shadow-sm flex flex-col justify-between space-y-3 card-hover animate-fade-in-up stagger-${index + 1}`}
                      >
                        <div className="space-y-3">
                          {/* Badge Type Indicator */}
                          <div className="flex items-center justify-between">
                            <span
                              className={`px-3 py-1 rounded-md text-[10px] font-black tracking-wider uppercase text-white ${
                                isVideo
                                  ? 'bg-brand-purple'
                                  : isPdf
                                  ? 'bg-brand-orange'
                                  : 'bg-emerald-600'
                              }`}
                            >
                              {lesson.type}
                            </span>
                            <span className="text-[11px] text-slate-400 font-semibold">{lesson.duration}</span>
                          </div>

                          <h4 className="text-sm font-extrabold text-slate-900 dark:text-slate-100 leading-snug">
                            {lesson.title}
                          </h4>

                          <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">
                            {isVideo
                              ? t('videoDescription')
                              : isPdf
                              ? t('pdfDescription')
                              : t('testDescription')}
                          </p>
                        </div>

                        {/* Open Button (No Fake Buttons - Real Action!) */}
                        <button
                          onClick={() => {
                            if (!requireAuth()) return
                            if (isVideo) {
                              setActiveVideo({
                                isOpen: true,
                                title: lesson.title,
                                videoUrl: lesson.contentUrl || 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
                                lessonId: lesson.id,
                              })
                            } else if (isPdf) {
                              setActivePdf({
                                isOpen: true,
                                title: lesson.title,
                                pdfUrl: lesson.pdfUrl,
                                textContent: lesson.textContent,
                                lessonId: lesson.id,
                              })
                            } else if (isTest) {
                              const quiz = lesson.quizzes?.[0]
                              setActiveQuiz({
                                isOpen: true,
                                quizId: quiz?.id || lesson.id,
                                title: quiz?.title || lesson.title,
                                questions: quiz?.questions || [
                                  {
                                    id: 'q1',
                                    questionText: t('quizQuestion1'),
                                    optionsJson: JSON.stringify(['<h1>', '<title>', '<header>', '<head>']),
                                    correctAnswer: '<h1>',
                                  },
                                  {
                                    id: 'q2',
                                    questionText: t('quizQuestion2'),
                                    optionsJson: JSON.stringify(['<link rel="stylesheet">', '<script src="">', '<style text="">', '<css href="">']),
                                    correctAnswer: '<link rel="stylesheet">',
                                  },
                                ],
                              })
                            }
                          }}
                          className={`w-full py-2.5 rounded-xl text-xs font-bold text-white shadow transition flex items-center justify-center gap-2 ${
                            isVideo
                              ? 'bg-brand-purple hover:bg-brand-purple-hover'
                              : isPdf
                              ? 'bg-brand-orange hover:bg-brand-orange-hover'
                              : 'bg-emerald-600 hover:bg-emerald-700'
                          }`}
                        >
                          {isVideo ? (
                            <>
                              <Play className="w-4 h-4 fill-current" />
                              {t('openVideo')} [Open]
                            </>
                          ) : isPdf ? (
                            <>
                              <FileText className="w-4 h-4" />
                              {t('openPDF')} [Open]
                            </>
                          ) : (
                            <>
                              <HelpCircle className="w-4 h-4" />
                              {t('startQuiz')} [Open]
                            </>
                          )}
                        </button>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          </div>

        </main>
      </div>

      {/* Interactive Modals */}
      {activeVideo && (
        <VideoPlayerModal
          isOpen={activeVideo.isOpen}
          onClose={() => setActiveVideo(null)}
          title={activeVideo.title}
          videoUrl={activeVideo.videoUrl}
          lessonId={activeVideo.lessonId}
          onComplete={fetchCourses}
        />
      )}

      {activePdf && (
        <PdfViewerModal
          isOpen={activePdf.isOpen}
          onClose={() => setActivePdf(null)}
          title={activePdf.title}
          pdfUrl={activePdf.pdfUrl}
          textContent={activePdf.textContent}
          lessonId={activePdf.lessonId}
          onComplete={fetchCourses}
        />
      )}

      {activeQuiz && (
        <QuizModal
          isOpen={activeQuiz.isOpen}
          onClose={() => setActiveQuiz(null)}
          quizId={activeQuiz.quizId}
          title={activeQuiz.title}
          questions={activeQuiz.questions}
          onSuccess={(certCode) => {
            if (certCode) {
              setActiveCert({ isOpen: true, certCode })
            }
            fetchCourses()
          }}
        />
      )}

      {activeCert && (
        <CertificateModal
          isOpen={activeCert.isOpen}
          onClose={() => setActiveCert(null)}
           studentName={currentUser?.name || t('student')}
          courseTitle={selectedCourse?.title || t('courseTitle')}
          instructorName={selectedCourse?.instructor?.name || 'م. أحمد محمود'}
          certCode={activeCert.certCode}
        />
      )}

    </div>
  )
}
