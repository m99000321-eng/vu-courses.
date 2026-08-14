'use client'

import React, { useState, useRef } from 'react'
import { X, Play, Pause, Volume2, VolumeX, CheckCircle } from 'lucide-react'
import { useLanguage } from './language-provider'

interface VideoPlayerModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  videoUrl: string
  lessonId: string
  onComplete?: () => void
}

export function VideoPlayerModal({
  isOpen,
  onClose,
  title,
  videoUrl,
  lessonId,
  onComplete,
}: VideoPlayerModalProps) {
  const { t } = useLanguage()
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [isCompleted, setIsCompleted] = useState(false)
  const [progress, setProgress] = useState(0)

  if (!isOpen) return null

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause()
      } else {
        videoRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const current = videoRef.current.currentTime
      const duration = videoRef.current.duration || 1
      const pct = (current / duration) * 100
      setProgress(pct)

      // Auto mark completed when user watches > 80%
      if (pct > 80 && !isCompleted) {
        markAsCompleted()
      }
    }
  }

  const markAsCompleted = async () => {
    setIsCompleted(true)
    try {
      await fetch(`/api/lessons/${lessonId}/progress`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ completed: true }),
      })
      if (onComplete) onComplete()
    } catch (e) {
      console.error(e)
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-4xl overflow-hidden shadow-2xl">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-800 bg-slate-950">
          <div className="flex items-center gap-3">
            <span className="px-2.5 py-1 rounded-md bg-brand-purple text-white text-[10px] font-bold">VIDEO</span>
            <h3 className="text-sm font-bold text-white">{title}</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Video Player */}
        <div className="relative bg-black aspect-video flex items-center justify-center">
          <video
            ref={videoRef}
            src={videoUrl}
            className="w-full h-full object-contain"
            onTimeUpdate={handleTimeUpdate}
            onEnded={markAsCompleted}
          />

          {/* Video Overlay Play Button */}
          {!isPlaying && (
            <button
              onClick={togglePlay}
              className="absolute w-16 h-16 rounded-full bg-brand-purple/90 text-white flex items-center justify-center shadow-lg hover:scale-110 transition"
            >
              <Play className="w-8 h-8 mr-1 fill-current" />
            </button>
          )}
        </div>

        {/* Video Controls Bar */}
        <div className="p-4 bg-slate-950 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button onClick={togglePlay} className="text-white hover:text-brand-orange transition">
              {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 fill-current" />}
            </button>
            <button
              onClick={() => {
                if (videoRef.current) {
                  videoRef.current.muted = !isMuted
                  setIsMuted(!isMuted)
                }
              }}
              className="text-slate-400 hover:text-white transition"
            >
              {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
            </button>
            
            {/* Progress Bar */}
            <div className="w-48 bg-slate-800 h-2 rounded-full overflow-hidden">
              <div className="bg-brand-purple h-full transition-all duration-200" style={{ width: `${progress}%` }} />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={markAsCompleted}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                isCompleted
                  ? 'bg-emerald-600/20 text-emerald-400 border border-emerald-500/30'
                  : 'bg-brand-purple text-white hover:bg-brand-purple-hover'
              }`}
            >
              <CheckCircle className="w-4 h-4" />
              {isCompleted ? t('lessonCompleted') : t('markAsCompleted')}
            </button>
          </div>
        </div>

      </div>
    </div>
  )
}
