'use client'

import { useState } from 'react'
import { 
  FaArrowLeft, 
  FaArrowRight, 
  FaRedo, 
  FaStar, 
  FaCog,
  FaLock,
  FaGlobe
} from 'react-icons/fa'
import { WindowFrame } from './window/WindowFrame'
import { useSystemSounds } from '@/hooks/useSystemSounds'

interface Bookmark {
  id: string
  title: string
  url: string
  icon?: string
  favicon?: string
}

const DEFAULT_BOOKMARKS: Bookmark[] = [
  {
    id: 'blog',
    title: 'Blog',
    url: 'https://blog.hash8m.com',
    icon: '📝',
    favicon: '/icons/blog-favicon.png'
  },
  {
    id: 'hash8m',
    title: 'Hash8m',
    url: 'https://hash8m.com',
    icon: '🌐'
  },
  {
    id: 'tamara',
    title: 'Tamara',
    url: 'https://tamara.co',
    icon: '💳'
  },
]

interface BrowserProps {
  isOpen: boolean
  onClose: () => void
  onMinimize?: () => void
}

export const Browser = ({ isOpen, onClose, onMinimize }: BrowserProps) => {
  const [currentUrl, setCurrentUrl] = useState('https://blog.hash8m.com')
  const [displayUrl, setDisplayUrl] = useState('https://blog.hash8m.com')
  const [urlHistory, setUrlHistory] = useState<string[]>(['https://blog.hash8m.com'])
  const [historyIndex, setHistoryIndex] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [bookmarks] = useState<Bookmark[]>(DEFAULT_BOOKMARKS)
  const [isBookmarked, setIsBookmarked] = useState(false)
  const sounds = useSystemSounds()

  const handleIframeLoad = () => {
    setIsLoading(false)
  }

  const navigateTo = (url: string) => {
    setCurrentUrl(url)
    setDisplayUrl(url)
    setUrlHistory(prev => [...prev.slice(0, historyIndex + 1), url])
    setHistoryIndex(prev => prev + 1)
  }

  const handleBack = () => {
    if (historyIndex > 0) {
      setHistoryIndex(prev => prev - 1)
      setCurrentUrl(urlHistory[historyIndex - 1])
      setDisplayUrl(urlHistory[historyIndex - 1])
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      sounds.playClick()
      navigateTo(displayUrl)
    }
  }

  const toggleBookmark = () => {
    setIsBookmarked(!isBookmarked)
  }

  return (
    <WindowFrame
      title="Browser"
      icon={<FaGlobe />}
      isOpen={isOpen}
      onClose={onClose}
      onMinimize={onMinimize}
    >
      <div className="flex flex-col h-full w-full bg-[#1a1a1a]">
        {/* Navigation Bar */}
        <div className="flex items-center gap-2 p-2 bg-[#2a2a2a] border-b border-white/10">
          <div className="flex items-center gap-1">
            <button
              onClick={handleBack}
              disabled={historyIndex <= 0}
              className={`p-2 rounded-md ${
                historyIndex > 0 ? 'hover:bg-white/10 text-white' : 'text-white/30'
              }`}
              aria-label="Go back"
            >
              <FaArrowLeft className="w-4 h-4" />
            </button>
            
            <button
              onClick={() => historyIndex < urlHistory.length - 1 && navigateTo(urlHistory[historyIndex + 1])}
              disabled={historyIndex >= urlHistory.length - 1}
              className={`p-2 rounded-md ${
                historyIndex < urlHistory.length - 1 ? 'hover:bg-white/10 text-white' : 'text-white/30'
              }`}
              aria-label="Go forward"
            >
              <FaArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => navigateTo(currentUrl)}
              className="p-2 rounded-md hover:bg-white/10 text-white"
              aria-label="Reload page"
            >
              <FaRedo className="w-4 h-4" />
            </button>
          </div>

          <div className="flex-1 flex items-center bg-[#333333] rounded-md px-3 py-1.5">
            <FaLock className="w-3 h-3 text-green-500 mr-2" />
            <input
              type="text"
              value={displayUrl}
              onChange={(e) => setDisplayUrl(e.target.value)}
              onKeyDown={handleKeyDown}
              className="w-full bg-transparent border-none outline-none text-white text-sm"
              placeholder="Enter URL or search"
            />
          </div>

          <button
            onClick={toggleBookmark}
            className={`p-2 rounded-md hover:bg-white/10 ${isBookmarked ? 'text-yellow-400' : 'text-white'}`}
            aria-label={isBookmarked ? 'Remove bookmark' : 'Add bookmark'}
          >
            <FaStar className="w-4 h-4" />
          </button>

          <button
            className="p-2 rounded-md hover:bg-white/10 text-white"
            aria-label="Settings"
          >
            <FaCog className="w-4 h-4" />
          </button>
        </div>

        {/* Bookmarks Bar */}
        <div className="flex items-center gap-1 px-2 py-1 bg-[#252525] border-b border-white/10">
          {bookmarks.map((bookmark) => (
            <button
              key={bookmark.id}
              onClick={() => navigateTo(bookmark.url)}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-md 
                       hover:bg-white/10 text-white/90 transition-colors
                       ${currentUrl === bookmark.url ? 'bg-white/10' : ''}`}
            >
              <span className="text-base">{bookmark.icon}</span>
              <span className="text-sm">{bookmark.title}</span>
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="flex-1 min-h-0 w-full overflow-hidden relative">
          {isLoading && (
            <div className="absolute top-0 left-0 w-full h-1 bg-[#1a1a1a]">
              <div className="h-full bg-blue-500 animate-pulse" />
            </div>
          )}
          <iframe
            src={currentUrl}
            style={{
              width: '100%',
              height: '100%',
              border: 'none',
              display: 'block',
              backgroundColor: 'white'
            }}
            sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
            referrerPolicy="no-referrer"
            onLoad={handleIframeLoad}
          />
        </div>
      </div>
    </WindowFrame>
  )
}