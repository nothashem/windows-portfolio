'use client'

import { useState, useEffect } from 'react'

type CursorType = 'default' | 'pointer' | 'text' | 'move' | 'resizeNS' | 'resizeEW' | 'resizeNESW' | 'resizeNWSE'

const CustomCursor = () => {
  const [cursorType, setCursorType] = useState<CursorType>('default')
  
  useEffect(() => {
    const updateCursorType = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      
      // Check for text elements
      if (target.matches('input, textarea, [contenteditable="true"]')) {
        setCursorType('text')
        return
      }

      // Check for clickable elements
      if (target.matches('button, a, [role="button"], .clickable')) {
        setCursorType('pointer')
        return
      }

      // Check for draggable elements
      if (target.matches('[draggable="true"], .draggable')) {
        setCursorType('move')
        return
      }

      // Default cursor
      setCursorType('default')
    }

    window.addEventListener('mousemove', updateCursorType)
    return () => window.removeEventListener('mousemove', updateCursorType)
  }, [])

  return null // We'll use CSS for cursors instead
}

export default CustomCursor 