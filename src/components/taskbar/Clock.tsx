'use client'

import { useState, useEffect } from 'react'

export const Clock = () => {
  const [mounted, setMounted] = useState(false)
  const [time, setTime] = useState<Date | null>(null)

  useEffect(() => {
    setMounted(true)
    setTime(new Date())
    const timer = setInterval(() => {
      setTime(new Date())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  if (!mounted || !time) {
    return (
      <div className="h-full px-3 flex flex-col justify-center items-end">
        <div className="w-14 h-4 bg-white/10 rounded animate-pulse" />
        <div className="w-20 h-3 bg-white/5 rounded mt-1 animate-pulse" />
      </div>
    )
  }

  const formatTime = new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  }).format(time)

  const formatDate = new Intl.DateTimeFormat('en-US', {
    month: 'numeric',
    day: 'numeric',
    year: 'numeric'
  }).format(time)

  return (
    <div
      className="h-full px-3 hover:bg-white/10 transition-colors duration-200 
                 cursor-default flex flex-col justify-center items-end group"
    >
      <span className="leading-tight text-sm text-white">
        {formatTime}
      </span>
      <span 
        className="leading-tight text-xs text-white/80 group-hover:text-white
                   transition-colors duration-200"
      >
        {formatDate}
      </span>
    </div>
  )
} 