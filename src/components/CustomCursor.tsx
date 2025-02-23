'use client'

import { useEffect } from 'react'

const CustomCursor = () => {
  useEffect(() => {
    const updatePosition = (e: MouseEvent) => {
      // We're handling cursor position via CSS
      // This component is just for initialization
    }

    window.addEventListener('mousemove', updatePosition)
    return () => window.removeEventListener('mousemove', updatePosition)
  }, [])

  return null
}

export default CustomCursor 