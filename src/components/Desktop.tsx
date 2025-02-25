'use client'

import { useEffect, useState } from 'react'
import Taskbar from './Taskbar'
import DesktopIcon from './DesktopIcon'
import { SpotifyApp } from './SpotifyApp'
import { Browser } from './Browser'
import { useSystemSounds } from '@/hooks/useSystemSounds'
import { Notepad } from './Notepad'
import { FaFileAlt, FaTable } from 'react-icons/fa'
import { StartMenu } from './StartMenu'
import { Excel } from './Excel'

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
  const [activeWindow, setActiveWindow] = useState<string | null>(null)

  const sounds = useSystemSounds()

  useEffect(() => {
    setMounted(true)
    sounds.playStartup()
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
            isExcelOpen={isExcelOpen}
            onExcelToggle={() => handleWindowToggle(isExcelOpen, setIsExcelOpen, 'excel')}
            activeWindow={activeWindow}
            setActiveWindow={setActiveWindow}
          />
        </div>

        <StartMenu 
          isOpen={isStartMenuOpen}
          onClose={() => setIsStartMenuOpen(false)}
          onOpenBrowser={() => setIsBrowserOpen(true)}
          onOpenSpotify={() => setIsSpotifyOpen(true)}
          onOpenNotepad={() => setIsNotepadOpen(true)}
          onOpenExcel={() => setIsExcelOpen(true)}
        />
      </main>
    </div>
  )
}

export default Desktop 