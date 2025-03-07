'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { FaMusic, FaFileAlt, FaGlobe, FaTable } from 'react-icons/fa'
import { TaskbarIcon } from './TaskbarIcon'
import { Clock } from './taskbar/Clock'
import { AudioControl } from './taskbar/AudioControl'
import { StartMenu } from './StartMenu'

interface TaskbarProps {
  isStartMenuOpen: boolean
  onStartMenuToggle: () => void
  isBrowserOpen: boolean
  onBrowserToggle: () => void
  isSpotifyOpen: boolean
  onSpotifyToggle: () => void
  isNotepadOpen: boolean
  onNotepadToggle: () => void
  activeWindow: string | null
  setActiveWindow: React.Dispatch<React.SetStateAction<string | null>>
  isExcelOpen: boolean
  onExcelToggle: () => void
}

export const Taskbar: React.FC<TaskbarProps> = ({
  isStartMenuOpen,
  onStartMenuToggle,
  isBrowserOpen,
  onBrowserToggle,
  isSpotifyOpen,
  onSpotifyToggle,
  isNotepadOpen,
  onNotepadToggle,
  activeWindow,
  setActiveWindow,
  isExcelOpen,
  onExcelToggle
}) => {
  return (
    <>
      {/* Start Menu */}
      <AnimatePresence mode="wait">
        {isStartMenuOpen && (
          <StartMenu 
            isOpen={isStartMenuOpen}
            onClose={() => onStartMenuToggle()}
            onOpenBrowser={() => onBrowserToggle()}
            onOpenSpotify={() => onSpotifyToggle()}
            onOpenNotepad={() => onNotepadToggle()}
            onOpenExcel={() => onExcelToggle()}
          />
        )}
      </AnimatePresence>

      {/* Taskbar */}
      <motion.div 
        key="taskbar"
        className="fixed bottom-0 left-0 right-0 h-12 bg-[#191919] flex items-center px-2 select-none z-50"
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", bounce: 0.2 }}
      >
        {/* Left section - Start button only */}
        <div className="flex items-center h-full">
          <motion.button 
            key="start-button"
            className="h-full px-3 flex items-center justify-center group
                     transition-all duration-150 ease-in-out relative"
            onClick={(e) => {
              e.stopPropagation(); // Prevent click from bubbling
              onStartMenuToggle();
            }}
          >
            {/* Background hover effect */}
            <div className={`absolute inset-0 transition-all duration-200
                           ${isStartMenuOpen ? 'bg-white/15' : 'group-hover:bg-white/5'}`}
            />
            
            {/* Windows Icon */}
            <div className={`relative z-10 transition-all duration-200
                           ${isStartMenuOpen ? 'text-white scale-105' : 
                             'text-white/70 group-hover:text-white'}`}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                className="fill-current"
              >
                <path d="M11 11H2V2h9v9zm0 11H2v-9h9v9zm11-11h-9V2h9v9zm0 11h-9v-9h9v9z" />
              </svg>
            </div>

            {/* Active Indicator */}
            <div className={`absolute -bottom-[2px] left-1/2 transform -translate-x-1/2
                           transition-all duration-200 ${
                             isStartMenuOpen ? 'w-5 h-[2px] bg-white' :
                             'w-0 h-[2px] bg-white/30 group-hover:w-3'
                           }`}
            />
          </motion.button>
        </div>

        {/* Middle section - Open apps */}
        <div className="flex-1 flex items-center h-full px-2 gap-1">
          <TaskbarIcon
            icon={<FaGlobe className="w-5 h-5" />}
            isOpen={isBrowserOpen}
            isActive={activeWindow === 'browser'}
            onClick={() => {
              onBrowserToggle()
              setActiveWindow('browser')
            }}
            tooltip="Browser"
          />
          <TaskbarIcon
            icon={<FaMusic className="w-5 h-5" />}
            isOpen={isSpotifyOpen}
            isActive={activeWindow === 'spotify'}
            onClick={() => {
              onSpotifyToggle()
              setActiveWindow('spotify')
            }}
            tooltip="Music Player"
          />
          <TaskbarIcon
            icon={<FaFileAlt className="w-5 h-5" />}
            isOpen={isNotepadOpen}
            isActive={activeWindow === 'notepad'}
            onClick={() => {
              onNotepadToggle()
              setActiveWindow('notepad')
            }}
            tooltip="Notepad"
          />
          <TaskbarIcon
            icon={<FaTable className="w-5 h-5" />}
            isOpen={isExcelOpen}
            isActive={activeWindow === 'excel'}
            onClick={() => {
              onExcelToggle()
              setActiveWindow('excel')
            }}
            tooltip="Excel"
          />
        </div>

        {/* Right section - System tray */}
        <div className="flex items-center h-full">
          <AudioControl />
          <Clock />
        </div>
      </motion.div>
    </>
  )
}

export default Taskbar 