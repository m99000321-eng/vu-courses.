'use client'

import React, { useState, useEffect } from 'react'
import { X, Clock, CheckCircle2, XCircle, Award, ArrowRight, ArrowLeft } from 'lucide-react'
import { useLanguage } from './language-provider'

interface Question {
  id: string
  questionText: string
  type: string
  optionsJson: string
  correctAnswer: string
}

interface QuizModalProps {
  isOpen: boolean
  onClose: () => void
  quizId: string
  title: string
  questions: Question[]
  passingScore?: number
  timeLimitMinutes?: number
  onSuccess?: (certCode?: string) => void
}

export function QuizModal({
  isOpen,
  onClose,
  quizId,
  title,
  questions = [],
  passingScore = 70,
  timeLimitMinutes = 10,
  onSuccess,
}: QuizModalProps) {
  const { t } = useLanguage()
  const [currentIndex, setCurrentIndex] = useState(0)
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({})
  const [timeLeft, setTimeLeft] = useState(timeLimitMinutes * 60)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [result, setResult] = useState<{
    scorePercent: number
    passed: boolean
    correctCount: number
    totalQuestions: number
    certCode?: string
  } | null>(null)

  useEffect(() => {
    if (isOpen && !result) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timer)
            handleSubmit()
            return 0
          }
          return prev - 1
        })
      }, 1000)
      return () => clearInterval(timer)
    }
  }, [isOpen, result])

  if (!isOpen) return null

  const currentQuestion = questions[currentIndex]
  const parsedOptions: string[] = currentQuestion?.optionsJson ? JSON.parse(currentQuestion.optionsJson) : []

  const handleSelectOption = (option: string) => {
    setUserAnswers({
      ...userAnswers,
      [currentQuestion.id]: option,
    })
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)
    try {
      const res = await fetch(`/api/quizzes/${quizId}/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answers: userAnswers }),
      })
      const data = await res.json()
      if (res.ok && data.success) {
        setResult(data)
        if (data.passed && onSuccess) {
          onSuccess(data.certCode)
        }
      }
    } catch (e) {
      console.error(e)
    } finally {
      setIsSubmitting(false)
    }
  }

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60)
    const s = seconds % 60
    return `${m}:${s < 10 ? '0' : ''}${s}`
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl">
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950">
          <div className="flex items-center gap-3">
            <span className="px-2.5 py-1 rounded-md bg-purple-600 text-white text-[10px] font-bold">TEST</span>
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">{title}</h3>
          </div>

          {!result && (
            <div className="flex items-center gap-2 px-3 py-1 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 rounded-full text-amber-600 dark:text-amber-400 text-xs font-bold">
              <Clock className="w-4 h-4" />
              <span>{formatTime(timeLeft)}</span>
            </div>
          )}

          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-white rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body Content */}
        <div className="p-6 max-h-[70vh] overflow-y-auto">
          {result ? (
            /* Results Screen */
            <div className="text-center space-y-4 py-4">
              <div className="inline-flex p-4 rounded-full bg-purple-50 dark:bg-slate-800">
                {result.passed ? (
                  <CheckCircle2 className="w-16 h-16 text-emerald-500" />
                ) : (
                  <XCircle className="w-16 h-16 text-rose-500" />
                )}
              </div>

              <h2 className="text-xl font-black text-slate-800 dark:text-slate-100">
                {result.passed ? t('quizPassed') : t('quizFailed')}
              </h2>

              <p className="text-sm text-slate-500">
                {t('yourScore')}: <span className="font-bold text-brand-purple text-base">{result.scorePercent}%</span> ({t('requiredScore')}: {passingScore}%)
              </p>

              <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-800 text-right text-xs space-y-2">
                <p className="font-bold text-slate-700 dark:text-slate-300">{t('correctAnswersDetails')}:</p>
                <p className="text-slate-600 dark:text-slate-400">
                  {t('correctAnswers')}: {result.correctCount} {t('ofTotal')} {result.totalQuestions} {t('questions')}.
                </p>
                {result.certCode && (
                  <div className="mt-3 p-3 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 rounded-lg flex items-center justify-between">
                    <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-300">
                      <Award className="w-5 h-5" />
                      <span className="font-bold">{t('certificateIssued')} {t('code')}: {result.certCode}</span>
                    </div>
                  </div>
                )}
              </div>

              <div className="pt-2">
                <button
                  onClick={onClose}
                  className="px-6 py-2.5 bg-brand-purple text-white text-xs font-bold rounded-xl shadow hover:bg-brand-purple-hover transition"
                >
                  {t('closeQuizAndReturn')}
                </button>
              </div>
            </div>
          ) : questions.length === 0 ? (
            <p className="text-center text-slate-400 py-8">{t('noQuestionsYet')}</p>
          ) : (
            /* Active Question Screen */
            <div className="space-y-6">
              {/* Question Stepper */}
              <div className="flex items-center justify-between text-xs text-slate-500 font-bold border-b border-slate-100 dark:border-slate-800 pb-3">
                <span>{t('question')} {currentIndex + 1} {t('of')} {questions.length}</span>
                <span className="text-brand-purple">{t('requiredToPass')} {passingScore}%</span>
              </div>

              {/* Question Text */}
              <h4 className="text-base font-bold text-slate-800 dark:text-slate-100">
                {currentQuestion.questionText}
              </h4>

              {/* Options list */}
              <div className="space-y-2.5">
                {parsedOptions.map((opt, idx) => {
                  const isSelected = userAnswers[currentQuestion.id] === opt
                  return (
                    <button
                      key={idx}
                      onClick={() => handleSelectOption(opt)}
                      className={`w-full text-right p-3.5 rounded-xl border text-xs font-semibold transition flex items-center justify-between ${
                        isSelected
                          ? 'border-brand-purple bg-purple-50 dark:bg-purple-950/40 text-brand-purple dark:text-purple-300 font-bold shadow-sm'
                          : 'border-slate-200 dark:border-slate-800 hover:border-brand-purple/50 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      <span>{opt}</span>
                      <div
                        className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                          isSelected ? 'border-brand-purple bg-brand-purple text-white' : 'border-slate-300'
                        }`}
                      >
                        {isSelected && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>
          )}
        </div>

        {/* Footer Navigation Buttons */}
        {!result && questions.length > 0 && (
          <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 flex items-center justify-between">
            <button
              onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
              disabled={currentIndex === 0}
              className="px-4 py-2 text-xs font-bold text-slate-600 dark:text-slate-400 disabled:opacity-40 flex items-center gap-1"
            >
              <ArrowRight className="w-4 h-4" />
              {t('previous')}
            </button>

            {currentIndex === questions.length - 1 ? (
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="px-6 py-2.5 bg-brand-orange hover:bg-brand-orange-hover text-white text-xs font-bold rounded-xl shadow transition"
              >
                {isSubmitting ? t('submitting') : t('submitQuiz')}
              </button>
            ) : (
              <button
                onClick={() => setCurrentIndex((prev) => Math.min(questions.length - 1, prev + 1))}
                className="px-5 py-2 bg-brand-purple hover:bg-brand-purple-hover text-white text-xs font-bold rounded-xl transition flex items-center gap-1"
              >
                {t('next')}
                <ArrowLeft className="w-4 h-4" />
              </button>
            )}
          </div>
        )}

      </div>
    </div>
  )
}
