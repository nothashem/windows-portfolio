'use client'

import { useEffect, useState } from 'react'
import Taskbar from './Taskbar'
import DesktopIcon from './DesktopIcon'
import { SpotifyApp } from './SpotifyApp'
import { Browser } from './Browser'
import { useSystemSounds } from '@/hooks/useSystemSounds'
import { Notepad } from './Notepad'
import { FaFileAlt } from 'react-icons/fa'
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

  const sounds = useSystemSounds()

  useEffect(() => {
    setMounted(true)
    sounds.playStartup()
  }, [sounds])

  const handleStartMenuToggle = () => {
    sounds.playStartMenu()
    setIsStartMenuOpen(prev => !prev)
  }

  const handleWindowOpen = (setWindowState: (state: boolean) => void) => {
    sounds.playNotification()
    setWindowState(true)
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
          <div className="p-2 grid grid-cols-6 gap-4 content-start">
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
              onClick={() => setIsBrowserOpen(true)}
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
          </div>
        </div>

        {/* Windows Layer */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="pointer-events-auto">
            <SpotifyApp
              isOpen={isSpotifyOpen}
              onClose={() => setIsSpotifyOpen(false)}
            />
            <Browser
              isOpen={isBrowserOpen}
              onClose={() => setIsBrowserOpen(false)}
              onMinimize={() => setIsBrowserOpen(false)}
            />
            <Notepad
              isOpen={isNotepadOpen}
              onClose={() => setIsNotepadOpen(false)}
            />
          </div>
        </div>

        {/* Taskbar Layer */}
        <div className="absolute inset-x-0 bottom-0 z-30">
          <Taskbar 
            isStartMenuOpen={isStartMenuOpen}
            onStartMenuToggle={handleStartMenuToggle}
            isBrowserOpen={isBrowserOpen}
            onBrowserToggle={() => setIsBrowserOpen(!isBrowserOpen)}
            isSpotifyOpen={isSpotifyOpen}
            onSpotifyToggle={() => setIsSpotifyOpen(!isSpotifyOpen)}
            isNotepadOpen={isNotepadOpen}
            onNotepadToggle={() => setIsNotepadOpen(!isNotepadOpen)}
          />
        </div>

        <StartMenu 
          isOpen={isStartMenuOpen}
          onClose={() => setIsStartMenuOpen(false)}
          onOpenBrowser={() => setIsBrowserOpen(true)}
          onOpenSpotify={() => setIsSpotifyOpen(true)}
          onOpenNotepad={() => setIsNotepadOpen(true)}
        />
      </main>
    </div>
  )
}

export default Desktop 