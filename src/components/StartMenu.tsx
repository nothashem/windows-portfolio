'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { FaGlobe, FaMusic, FaFileAlt } from 'react-icons/fa'
import { useSystemSounds } from '../hooks/useSystemSounds'

interface AppItem {
  id: string
  icon: React.ReactNode
  label: string
  onClick: () => void
}

interface StartMenuProps {
  isOpen: boolean
  onClose: () => void
  onOpenBrowser: () => void
  onOpenSpotify: () => void
  onOpenNotepad: () => void
}

export const StartMenu = ({ 
  isOpen, 
  onClose,
  onOpenBrowser,
  onOpenSpotify,
  onOpenNotepad
}: StartMenuProps) => {
  const sounds = useSystemSounds();
  
  const apps: AppItem[] = [
    {
      id: 'browser',
      icon: <FaGlobe className="w-6 h-6" />,
      label: 'Browser',
      onClick: onOpenBrowser
    },
    {
      id: 'spotify',
      icon: <FaMusic className="w-6 h-6" />,
      label: 'Music Player',
      onClick: onOpenSpotify
    },
    {
      id: 'notepad',
      icon: <FaFileAlt className="w-6 h-6" />,
      label: 'Notepad',
      onClick: onOpenNotepad
    }
  ]

  const handleAppClick = (app: AppItem) => {
    sounds.playClick();
    app.onClick();
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 20, opacity: 0 }}
          transition={{ type: "spring", bounce: 0.3 }}
          className="fixed bottom-12 left-2 w-[400px] bg-[#202020] rounded-lg shadow-2xl
                   border border-white/10 text-white overflow-hidden z-[60]"
          onClick={(e) => e.stopPropagation()}
        >
          {/* All Apps */}
          <div className="px-4 py-4">
            <h2 className="text-xs font-semibold mb-3 text-white/70">All Apps</h2>
            <div className="grid grid-cols-2 gap-2">
              {apps.map((app) => (
                <motion.button
                  key={app.id}
                  className="flex items-center gap-3 p-3 rounded-md hover:bg-white/10
                           transition-colors text-left"
                  onClick={() => handleAppClick(app)}
                  onHoverStart={() => sounds.playHover()}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="text-white/90">
                    {app.icon}
                  </div>
                  <span className="text-sm">{app.label}</span>
                </motion.button>
              ))}
            </div>
          </div>

          {/* User Section */}
          <div className="mt-auto border-t border-white/10">
            <button
              className="flex items-center gap-3 p-4 w-full hover:bg-white/10
                       transition-colors"
              onClick={onClose}
            >
              <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center">
                <span className="text-white text-sm">H</span>
              </div>
              <span className="text-sm">Hashim Alsharif</span>
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}; 