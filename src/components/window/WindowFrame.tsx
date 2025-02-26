'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useState, useRef, useEffect } from 'react'
import { FaTimes, FaWindowMaximize, FaWindowRestore, FaMinus } from 'react-icons/fa'
import { useSystemSounds } from '@/hooks/useSystemSounds'
import useWindowDimensions from '@/hooks/useWindowDimensions'

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
  onMaximize?: () => void
  isMaximized: boolean
  isMinimized: boolean
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
  onMinimize,
  onMaximize,
  isMaximized,
  isMinimized
}: WindowFrameProps) => {
  const [isMounted, setIsMounted] = useState(false)
  const [position, setPosition] = useState(defaultPosition)
  const [size, setSize] = useState(defaultSize)
  const [dragStartPosition, setDragStartPosition] = useState({ x: 0, y: 0 })
  const windowRef = useRef<HTMLDivElement>(null)
  const [isDragging, setIsDragging] = useState(false)
  const dragConstraintsRef = useRef<HTMLDivElement>(null)
  const { width: windowWidth, height: windowHeight } = useWindowDimensions()

  const sounds = useSystemSounds()

  // Add this state to fix the error
  const [localIsMinimized, setLocalIsMinimized] = useState(isMinimized)

  useEffect(() => {
    setIsMounted(true)
    
    // Update local state when prop changes
    setLocalIsMinimized(isMinimized)
  }, [isMinimized])

  const handleMaximizeClick = () => {
    sounds.playMaximize()
    if (onMaximize) {
      onMaximize()
    }
    
    if (!isMaximized) {
      // Store current position and size before maximizing
      setDragStartPosition(position)
    } else {
      // Restore previous position when un-maximizing
      setPosition(dragStartPosition)
    }
  }

  const handleMinimize = () => {
    sounds.playMinimize()
    setLocalIsMinimized(true) // Use local state instead of undefined setIsMinimized
    if (onMinimize) {
      onMinimize()
    }
  }

  const handleClose = () => {
    sounds.playClose()
    onClose()
  }

  const constrainPosition = (x: number, y: number) => {
    if (!windowRef.current) return { x, y }
    
    const width = windowRef.current.offsetWidth
    const height = windowRef.current.offsetHeight
    const maxX = windowWidth - width
    const maxY = windowHeight - height - 48 // Account for taskbar

    return {
      x: Math.min(Math.max(0, x), maxX),
      y: Math.min(Math.max(0, y), maxY)
    }
  }

  const handleDragStart = () => {
    sounds.playClick()
    setIsDragging(true)
    setDragStartPosition(position)
  }

  const handleDrag = (
    event: MouseEvent | TouchEvent | PointerEvent,
    info: {
      delta: {
        x: number;
        y: number;
      }
    }
  ) => {
    if (isMaximized || isFullScreen) return
    
    const newPosition = {
      x: position.x + info.delta.x,
      y: position.y + info.delta.y
    }
    
    const constrained = constrainPosition(newPosition.x, newPosition.y)
    setPosition(constrained)
  }

  const handleDragEnd = () => {
    setIsDragging(false)
    sounds.playOpen()
  }

  // Add a useEffect to handle window restoration
  useEffect(() => {
    if (isOpen && localIsMinimized) {
      setLocalIsMinimized(false)
    }
  }, [isOpen, localIsMinimized])

  if (!isMounted) {
    return null
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <div ref={dragConstraintsRef} style={{ width: '100vw', height: 'calc(100vh - 48px)', position: 'fixed', top: 0, left: 0, pointerEvents: 'none' }} />
          <motion.div
            ref={windowRef}
            className={`
              fixed bg-[#1a1a1a] text-white rounded-lg overflow-hidden
              shadow-lg border border-white/10 flex flex-col
              ${isFullScreen || isMaximized ? 'w-screen h-screen' : ''}
              ${isDragging ? 'cursor-grabbing opacity-95' : ''}
            `}
            style={{
              width: isFullScreen || isMaximized ? '100%' : size.width,
              height: isFullScreen || isMaximized ? '100%' : size.height,
              left: isFullScreen || isMaximized ? 0 : position.x,
              top: isFullScreen || isMaximized ? 0 : position.y,
              zIndex: isDragging ? 100 : 50,
              position: 'fixed',
              visibility: localIsMinimized ? 'hidden' : 'visible',
              display: 'flex',
              touchAction: 'none',
            }}
            initial={{ 
              opacity: 0, 
              scale: 0.95,
              y: localIsMinimized ? windowHeight : 0 
            }}
            animate={{ 
              opacity: 1,
              scale: 1,
              y: localIsMinimized ? windowHeight : 0,
              transition: {
                duration: 0.15,
                ease: "easeOut"
              }
            }}
            exit={{ 
              opacity: 0, 
              scale: 0.95,
              y: windowHeight 
            }}
            transition={{ 
              duration: 0.15,
              type: "spring",
              damping: 20,
              stiffness: 300
            }}
            drag={!isMaximized && !isFullScreen && !localIsMinimized}
            dragMomentum={false}
            dragElastic={0}
            dragConstraints={{
              top: 0,
              left: 0,
              right: windowWidth - (windowRef.current?.offsetWidth || 0),
              bottom: windowHeight - (windowRef.current?.offsetHeight || 0) - 48
            }}
            onDragStart={handleDragStart}
            onDrag={handleDrag}
            onDragEnd={handleDragEnd}
          >
            {/* Title Bar */}
            <div
              className={`flex items-center justify-between p-2 bg-[#1a1a1a] 
                         border-b border-white/10 select-none
                         ${!isMaximized && !isFullScreen ? (isDragging ? 'cursor-grabbing bg-white/5' : 'cursor-grab') : ''}`}
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
                  onClick={handleMaximizeClick}
                  className="p-2 hover:bg-white/10 rounded-md transition-colors"
                  disabled={isFullScreen}
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
            <div className="flex-1 h-full overflow-hidden">
              {children}
            </div>

            {/* Resize Handles */}
            {!isMaximized && !isFullScreen && (
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
        </>
      )}
    </AnimatePresence>
  )
} 