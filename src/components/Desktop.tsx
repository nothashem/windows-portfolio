'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FaFileAlt, FaTable } from 'react-icons/fa'
import { useSystemSounds } from '@/hooks/useSystemSounds'

import DesktopIcon from './DesktopIcon'
import { Taskbar } from './Taskbar'
import { SpotifyApp } from './SpotifyApp'
import { Browser } from './Browser'
import { Notepad } from './Notepad'
import { Excel } from './Excel'
import { BootupScreen } from './BootupScreen'
import { StartMenu } from './StartMenu'

interface DesktopProps {
  wallpaper: string
}

export const Desktop = ({ wallpaper }: DesktopProps) => {
  const [mounted, setMounted] = useState(false)
  const [isStartMenuOpen, setIsStartMenuOpen] = useState(false)
  const [isSpotifyOpen, setIsSpotifyOpen] = useState(false)
  const [isBrowserOpen, setIsBrowserOpen] = useState(false)
  const [isNotepadOpen, setIsNotepadOpen] = useState(false)
  const [isExcelOpen, setIsExcelOpen] = useState(false)
  const [isBootupOpen, setIsBootupOpen] = useState(true)
  const [activeWindow, setActiveWindow] = useState<string | null>(null)

  const sounds = useSystemSounds()

  useEffect(() => {
    setMounted(true)
    
    // Play startup sound after a slight delay
    const soundTimer = setTimeout(() => {
      sounds.playStartup()
    }, 1000)

    // Close the bootup screen with a fade effect
    const bootTimer = setTimeout(() => {
      setIsBootupOpen(false)
    }, 3000)

    return () => {
      clearTimeout(soundTimer)
      clearTimeout(bootTimer)
    }
  }, [sounds])

  const handleWindowOpen = (opener: () => void) => {
    opener()
    setIsStartMenuOpen(false)
  }

  const handleWindowToggle = (isOpen: boolean, setOpen: (open: boolean) => void, windowId: string) => {
    if (isOpen) {
      setOpen(false)
    } else {
      setOpen(true)
      setActiveWindow(windowId)
    }
  }

  if (!mounted) return null

  return (
    <div className="relative h-screen w-screen overflow-hidden">
      <main 
        className="h-screen w-screen overflow-hidden relative select-none"
        style={{
          backgroundImage: `url(${wallpaper})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        {/* Background and Icons Layer */}
        <div className="absolute inset-0">
          <div className="p-2 flex flex-col gap-1 w-fit">
            <DesktopIcon
              icon="🎵"
              label="Music"
              onClick={() => handleWindowOpen(() => setIsSpotifyOpen(true))}
              selected={false}
              inSelectionBox={false}
            />
            <DesktopIcon
              icon="🌐"
              label="Browser"
              onClick={() => handleWindowOpen(() => setIsBrowserOpen(true))}
              selected={false}
              inSelectionBox={false}
            />
            <DesktopIcon
              icon={<FaFileAlt className="w-8 h-8 text-yellow-400" />}
              label="Notepad"
              onClick={() => handleWindowOpen(() => setIsNotepadOpen(true))}
              selected={false}
              inSelectionBox={false}
            />
            <DesktopIcon
              icon={<FaTable className="w-8 h-8 text-green-600" />}
              label="Excel"
              onClick={() => handleWindowOpen(() => setIsExcelOpen(true))}
              selected={false}
              inSelectionBox={false}
            />
          </div>
        </div>

        {/* Windows Layer */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="pointer-events-auto">
            <SpotifyApp
              isOpen={isSpotifyOpen}
              onClose={() => setIsSpotifyOpen(false)}
              onMinimize={() => handleWindowToggle(isSpotifyOpen, setIsSpotifyOpen, 'spotify')}
            />
            <Browser
              isOpen={isBrowserOpen}
              onClose={() => setIsBrowserOpen(false)}
              onMinimize={() => handleWindowToggle(isBrowserOpen, setIsBrowserOpen, 'browser')}
            />
            <Notepad
              isOpen={isNotepadOpen}
              onClose={() => setIsNotepadOpen(false)}
              onMinimize={() => handleWindowToggle(isNotepadOpen, setIsNotepadOpen, 'notepad')}
            />
            <Excel
              isOpen={isExcelOpen}
              onClose={() => setIsExcelOpen(false)}
              onMinimize={() => handleWindowToggle(isExcelOpen, setIsExcelOpen, 'excel')}
            />
          </div>
        </div>

        {/* Taskbar Layer */}
        <div className="absolute inset-x-0 bottom-0 z-30">
          <Taskbar 
            isStartMenuOpen={isStartMenuOpen}
            onStartMenuToggle={() => setIsStartMenuOpen(!isStartMenuOpen)}
            isBrowserOpen={isBrowserOpen}
            onBrowserToggle={() => handleWindowToggle(isBrowserOpen, setIsBrowserOpen, 'browser')}
            isSpotifyOpen={isSpotifyOpen}
            onSpotifyToggle={() => handleWindowToggle(isSpotifyOpen, setIsSpotifyOpen, 'spotify')}
            isNotepadOpen={isNotepadOpen}
            onNotepadToggle={() => handleWindowToggle(isNotepadOpen, setIsNotepadOpen, 'notepad')}
            activeWindow={activeWindow}
            setActiveWindow={setActiveWindow}
            isExcelOpen={isExcelOpen}
            onExcelToggle={() => handleWindowToggle(isExcelOpen, setIsExcelOpen, 'excel')}
          />
        </div>

        {/* Bootup Screen - as an overlay */}
        <AnimatePresence>
          {isBootupOpen && (
            <motion.div 
              className="absolute inset-0 bg-black z-50"
              initial={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8 }}
            >
              <BootupScreen
                isOpen={isBootupOpen}
                onClose={() => setIsBootupOpen(false)}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* StartMenu - rendered directly like in the original */}
        <StartMenu 
          isOpen={isStartMenuOpen}
          onClose={() => setIsStartMenuOpen(false)}
          onOpenBrowser={() => handleWindowOpen(() => setIsBrowserOpen(true))}
          onOpenSpotify={() => handleWindowOpen(() => setIsSpotifyOpen(true))}
          onOpenNotepad={() => handleWindowOpen(() => setIsNotepadOpen(true))}
          onOpenExcel={() => handleWindowOpen(() => setIsExcelOpen(true))}
        />
      </main>
    </div>
  )
}

export default Desktop 