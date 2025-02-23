'use client'

import { forwardRef } from 'react'
import Image from 'next/image'
import { useSystemSounds } from '@/hooks/useSystemSounds'

interface DesktopIconProps {
  icon: string | React.ReactNode
  label: string
  onClick: () => void
  onDragStart?: (e: React.DragEvent) => void
  selected?: boolean
  inSelectionBox?: boolean
}

const DesktopIcon = forwardRef<HTMLDivElement, DesktopIconProps>(({
  icon,
  label,
  onClick,
  onDragStart,
  selected = false,
  inSelectionBox = false
}, ref) => {
  const sounds = useSystemSounds()

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      sounds.playClick()
      onClick()
    }
  }

  const renderIcon = () => {
    if (typeof icon === 'string') {
      if (icon.startsWith('/') || icon.startsWith('http')) {
        return (
          <Image
            src={icon}
            alt={label}
            fill
            className="object-contain"
          />
        )
      }
      return <span className="text-4xl">{icon}</span>
    }
    return icon
  }

  return (
    <div
      ref={ref}
      className={`
        flex flex-col items-center gap-2 p-2 rounded-md
        hover:bg-white/10 transition-colors duration-150
        ${selected || inSelectionBox ? 'bg-white/20' : 'bg-transparent'}
      `}
      onClick={() => {
        sounds.playClick()
        onClick()
      }}
      onKeyDown={handleKeyDown}
      onMouseEnter={() => sounds.playHover()}
      draggable
      onDragStart={onDragStart}
      role="button"
      tabIndex={0}
    >
      <div className="relative w-16 h-16 flex items-center justify-center">
        {renderIcon()}
      </div>
      <span className="text-sm text-white text-center">{label}</span>
    </div>
  )
})

// Add display name for React DevTools
DesktopIcon.displayName = 'DesktopIcon'

export default DesktopIcon 