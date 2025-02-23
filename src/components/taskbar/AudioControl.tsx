'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useState, useRef, useEffect } from 'react'
import { FaVolumeUp, FaVolumeMute } from 'react-icons/fa'
import { useSystemSounds } from '@/hooks/useSystemSounds'
import { useVolume } from '@/contexts/VolumeContext'

export const AudioControl = () => {
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const sounds = useSystemSounds()
  const { globalVolume, setGlobalVolume, isMuted, setIsMuted } = useVolume()

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleVolumeChange = (newVolume: number) => {
    sounds.playSlider()
    setGlobalVolume(newVolume)
    if (newVolume === 0) {
      setIsMuted(true)
    } else if (isMuted) {
      setIsMuted(false)
    }
  }

  return (
    <motion.div 
      ref={containerRef}
      className="relative px-3 cursor-default h-full flex items-center"
      role="button"
      tabIndex={0}
      onClick={() => setIsOpen(true)}
      whileHover={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
      whileTap={{ backgroundColor: 'rgba(255, 255, 255, 0.15)' }}
      animate={{ 
        backgroundColor: isOpen 
          ? 'rgba(255, 255, 255, 0.1)' 
          : 'rgba(255, 255, 255, 0)' 
      }}
    >
      <motion.div
        initial={false}
        animate={{ rotate: isMuted ? 360 : 0 }}
        transition={{ type: "spring", bounce: 0.3 }}
      >
        {isMuted || globalVolume === 0 ? (
          <FaVolumeMute className="w-4 h-4" />
        ) : (
          <FaVolumeUp className="w-4 h-4" />
        )}
      </motion.div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute bottom-full mb-2 right-0 bg-[#191919]/90 backdrop-blur-sm
                     p-3 rounded-lg shadow-lg border border-white/10 w-[320px]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex flex-col gap-6">
              <div className="flex items-center justify-between text-white/90">
                <span className="text-xs">Volume: {globalVolume}%</span>
              </div>
              
              <div className="relative flex items-center w-full">
                <div 
                  className="absolute w-full h-1 bg-white/20 rounded-full overflow-hidden"
                >
                  <div 
                    className="h-full bg-white rounded-full" 
                    style={{ width: `${globalVolume}%` }}
                  />
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={globalVolume}
                  onChange={(e) => handleVolumeChange(Number(e.target.value))}
                  className="w-full appearance-none bg-transparent cursor-pointer relative z-10"
                  style={{
                    '--thumb-size': '16px',
                    '--track-height': '4px',
                  } as React.CSSProperties}
                />
                <style jsx>{`
                  input[type='range'] {
                    height: var(--thumb-size);
                  }
                  input[type='range']::-webkit-slider-thumb {
                    -webkit-appearance: none;
                    width: var(--thumb-size);
                    height: var(--thumb-size);
                    border-radius: 50%;
                    background: white;
                    cursor: pointer;
                    border: none;
                    margin-top: calc((var(--thumb-size) - var(--track-height)) / -2);
                  }
                  input[type='range']::-webkit-slider-runnable-track {
                    width: 100%;
                    height: var(--track-height);
                    background: transparent;
                    border: none;
                  }
                `}</style>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
} 