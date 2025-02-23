'use client'

import { useEffect, useState } from 'react'

interface SelectionBoxProps {
  onSelectionChange?: (rect: DOMRect | null) => void
}

export const SelectionBox = ({ onSelectionChange }: SelectionBoxProps) => {
  const [mounted, setMounted] = useState(false)
  const [isSelecting, setIsSelecting] = useState(false)
  const [startPoint, setStartPoint] = useState({ x: 0, y: 0 })
  const [endPoint, setEndPoint] = useState({ x: 0, y: 0 })

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return

    const handleMouseMove = (e: MouseEvent) => {
      if (isSelecting) {
        setEndPoint({ x: e.clientX, y: e.clientY })
      }
    }

    const handleMouseUp = () => {
      if (isSelecting) {
        setIsSelecting(false)
        onSelectionChange?.(null)
      }
    }

    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseup', handleMouseUp)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleMouseUp)
    }
  }, [isSelecting, onSelectionChange, mounted])

  const handleMouseDown = (e: React.MouseEvent) => {
    // Only start selection if right-clicking directly on the desktop (not on icons)
    if (e.button === 2 && (e.target as HTMLElement).classList.contains('desktop-background')) {
      e.preventDefault()
      setIsSelecting(true)
      setStartPoint({ x: e.clientX, y: e.clientY })
      setEndPoint({ x: e.clientX, y: e.clientY })
    }
  }

  // We'll handle the context menu in the Desktop component instead
  if (!mounted) return null

  return (
    <div 
      className="fixed inset-0 desktop-background"
      onMouseDown={handleMouseDown}
      style={{ zIndex: 0 }}
    >
      {isSelecting && (
        <div
          className="fixed pointer-events-none border-2 border-[#0078D7] bg-[#0078D7]/40"
          style={{
            left: Math.min(startPoint.x, endPoint.x),
            top: Math.min(startPoint.y, endPoint.y),
            width: Math.abs(endPoint.x - startPoint.x),
            height: Math.abs(endPoint.y - startPoint.y),
            zIndex: 9999,
          }}
        />
      )}
    </div>
  )
} 