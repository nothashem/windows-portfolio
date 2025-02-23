'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useState, useRef, useEffect } from 'react'
import { FaTimes, FaWindowMaximize, FaWindowRestore, FaMinus } from 'react-icons/fa'
import { useSystemSounds } from '@/hooks/useSystemSounds'

interface WindowFrameProps {
  title: string
  icon?: React.ReactNode
  isOpen: boolean
  onClose: () => void
  children: React.ReactNode
  defaultSize?: {
    width: number | string
    height: number | string
  }
  defaultPosition?: {
    x: number
    y: number
  }
  isFullScreen?: boolean
  onMinimize?: () => void
}

export const WindowFrame = ({
  title,
  icon,
  isOpen,
  onClose,
  children,
  defaultSize = { width: '50%', height: '50%' },
  defaultPosition = { x: 40, y: 40 },
  isFullScreen = false,
  onMinimize
}: WindowFrameProps) => {
  const [isMounted, setIsMounted] = useState(false)
  const [isMaximized, setIsMaximized] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [position, setPosition] = useState(defaultPosition)
  const [size, setSize] = useState(defaultSize)
  const windowRef = useRef<HTMLDivElement>(null)
  const dragRef = useRef<{ x: number; y: number } | null>(null)

  const sounds = useSystemSounds()

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const handleMaximize = () => {
    sounds.playMaximize()
    setIsMaximized(!isMaximized)
  }

  const handleMinimize = () => {
    sounds.playMinimize()
    setIsMinimized(true)
    if (onMinimize) onMinimize()
  }

  const handleClose = () => {
    sounds.playClose()
    onClose()
  }

  const handleDragStart = () => {
    sounds.playClick();
  };

  const handleDragEnd = () => {
    sounds.playOpen();
  };

  if (!isMounted) {
    return null
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={windowRef}
          className={`
            fixed bg-[#1a1a1a] text-white rounded-lg overflow-hidden
            shadow-lg border border-white/10 flex flex-col
            ${isFullScreen ? 'w-screen h-screen' : ''}
            ${isMinimized ? 'opacity-0 pointer-events-none' : ''}
          `}
          style={{
            width: isFullScreen ? '100%' : size.width,
            height: isFullScreen ? '100%' : size.height,
            zIndex: 50,
            display: isMinimized ? 'none' : 'flex'
          }}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ 
            opacity: isMinimized ? 0 : 1, 
            scale: isMinimized ? 0.95 : 1,
            x: isFullScreen ? 0 : position.x,
            y: isFullScreen ? 0 : position.y,
          }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.1 }}
          drag={!isMaximized && !isFullScreen && !isMinimized}
          dragMomentum={false}
          dragConstraints={{
            top: 0,
            left: 0,
            right: typeof window !== 'undefined' ? window.innerWidth - 100 : 0,
            bottom: typeof window !== 'undefined' ? window.innerHeight - 100 : 0
          }}
          dragElastic={0}
          onDragStart={handleDragStart}
          onDragEnd={(event, info) => {
            handleDragEnd()
            setPosition({ x: info.point.x, y: info.point.y })
          }}
        >
          {/* Title Bar */}
          <div
            className={`flex items-center justify-between p-2 bg-[#1a1a1a] 
                       border-b border-white/10 select-none
                       ${!isMaximized ? 'cursor-move' : ''}`}
          >
            <div className="flex items-center gap-2">
              {icon && <div className="text-blue-400">{icon}</div>}
              <span className="text-sm font-medium">{title}</span>
            </div>
            <div className="flex items-center">
              <button
                className="p-2 hover:bg-white/10 rounded-md transition-colors"
                onClick={handleMinimize}
              >
                <FaMinus className="w-3 h-3" />
              </button>
              <button
                onClick={handleMaximize}
                className="p-2 hover:bg-white/10 rounded-md transition-colors"
              >
                {isMaximized ? (
                  <FaWindowRestore className="w-3 h-3" />
                ) : (
                  <FaWindowMaximize className="w-3 h-3" />
                )}
              </button>
              <button
                onClick={handleClose}
                className="p-2 hover:bg-red-500 rounded-md transition-colors"
              >
                <FaTimes className="w-3 h-3" />
              </button>
            </div>
          </div>

          {/* Window Content */}
          <div className="flex-1 h-full">
            {children}
          </div>

          {/* Resize Handles */}
          {!isMaximized && (
            <>
              <div 
                className="absolute top-0 left-0 right-0 h-1 cursor-n-resize hover:bg-blue-500/50"
                onMouseDown={(e) => {
                  const startY = e.clientY
                  const startHeight = windowRef.current?.clientHeight || 0
                  
                  const handleMouseMove = (e: MouseEvent) => {
                    const deltaY = startY - e.clientY
                    setSize(prev => ({
                      ...prev,
                      height: Math.max(200, startHeight + deltaY)
                    }))
                  }
                  
                  document.addEventListener('mousemove', handleMouseMove)
                  document.addEventListener('mouseup', () => {
                    document.removeEventListener('mousemove', handleMouseMove)
                  }, { once: true })
                }}
              />
              <div className="absolute bottom-0 left-0 right-0 h-1 cursor-s-resize hover:bg-blue-500/50" />
              <div className="absolute left-0 top-0 bottom-0 w-1 cursor-w-resize hover:bg-blue-500/50" />
              <div className="absolute right-0 top-0 bottom-0 w-1 cursor-e-resize hover:bg-blue-500/50" />
              <div className="absolute top-0 left-0 w-3 h-3 cursor-nw-resize hover:bg-blue-500/50" />
              <div className="absolute top-0 right-0 w-3 h-3 cursor-ne-resize hover:bg-blue-500/50" />
              <div className="absolute bottom-0 left-0 w-3 h-3 cursor-sw-resize hover:bg-blue-500/50" />
              <div className="absolute bottom-0 right-0 w-3 h-3 cursor-se-resize hover:bg-blue-500/50" />
            </>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  )
} 