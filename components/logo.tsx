import React from 'react'

interface LogoProps {
  className?: string
  size?: 'sm' | 'md' | 'lg'
}

export function Logo({ className = '', size = 'md' }: LogoProps) {
  const sizeClasses = {
    sm: { title: 'text-2xl', sub: 'text-[10px] tracking-[0.2em]' },
    md: { title: 'text-3xl', sub: 'text-xs tracking-[0.25em]' },
    lg: { title: 'text-5xl', sub: 'text-base tracking-[0.3em]' },
  }[size]

  return (
    <div className={`inline-flex flex-col items-start font-sans select-none ${className}`}>
      <div className={`font-black leading-none ${sizeClasses.title} flex items-baseline`}>
        <span className="text-brand-purple tracking-tight">VU</span>
        <span className="text-brand-orange ml-0.5 font-bold">.</span>
      </div>
      <div className={`font-extrabold text-brand-orange leading-none mt-1 uppercase ${sizeClasses.sub}`}>
        COURSES
      </div>
    </div>
  )
}
