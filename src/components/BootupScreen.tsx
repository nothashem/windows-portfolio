'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface BootupScreenProps {
  isOpen: boolean
  onClose: () => void
}

export const BootupScreen = ({ isOpen, onClose }: BootupScreenProps) => {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    if (!isOpen) {
      setProgress(0)
      return
    }

    const steps = [15, 30, 45, 60, 75, 90, 100]
    let currentStep = 0

    const loadingInterval = setInterval(() => {
      if (currentStep < steps.length) {
        setProgress(steps[currentStep])
        currentStep++
        
        // When we reach 100%, trigger the fade out
        if (steps[currentStep - 1] === 100) {
          setTimeout(() => {
            onClose()
          }, 300) // Wait half a second after reaching 100% before starting fade
        }
      } else {
        clearInterval(loadingInterval)
      }
    }, 400)

    return () => clearInterval(loadingInterval)
  }, [isOpen, onClose])

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black z-50"
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="h-full flex flex-col items-center justify-center">
            {/* Logo Container */}
            <div className="mb-16 relative">
              {/* Colored squares similar to Windows logo */}
              <div className="absolute -top-12 left-1/2 -translate-x-1/2 flex gap-1">
                <div className="w-8 h-8 bg-[#F25022] transform rotate-12" />
                <div className="w-8 h-8 bg-[#7FBA00] transform -rotate-12" />
                <div className="w-8 h-8 bg-[#00A4EF] transform rotate-12" />
                <div className="w-8 h-8 bg-[#FFB900] transform -rotate-12" />
              </div>
              
              {/* OS Name with 3D effect */}
              <div className="text-center">
                <div className="text-sm text-white/90 mb-1">Hashim®</div>
                <div 
                  className="text-5xl font-bold tracking-tight"
                  style={{
                    color: 'white',
                    textShadow: `
                      0 0 1px rgba(255,255,255,0.5),
                      0 0 2px rgba(255,255,255,0.3),
                      0 0 5px rgba(255,255,255,0.2),
                      0 1px 2px rgba(0,0,0,0.3),
                      0 2px 4px rgba(0,0,0,0.2),
                      0 4px 8px rgba(0,0,0,0.1),
                      0 8px 16px rgba(0,0,0,0.1)
                    `,
                    transform: 'perspective(500px) rotateX(10deg)',
                  }}
                >
                  OS
                </div>
              </div>
            </div>

            {/* Loading Bar */}
            <div className="w-64 h-1.5 bg-[#004e98]/20 rounded-full overflow-hidden">
              <motion.div 
                className="h-full bg-[#004e98]"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ type: "spring", damping: 20 }}
              />
            </div>

            {/* Copyright Text */}
            <div className="absolute bottom-8 left-0 right-0 text-center">
              <p className="text-xs text-white/60">Copyright © 2024 Hashim Corporation</p>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
} 