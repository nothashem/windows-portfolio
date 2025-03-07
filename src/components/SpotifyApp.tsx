'use client'

import { useState, useRef, useEffect } from 'react'
import { FaPlay, FaPause, FaStepForward, FaStepBackward, FaVolumeUp, FaVolumeMute } from 'react-icons/fa'
import { WindowFrame } from './window/WindowFrame'
import { useSystemSounds } from '@/hooks/useSystemSounds'
import Image from 'next/image'
import { useVolume } from '@/contexts/VolumeContext'

interface SongProgress {
  currentTime: number
  duration: number
  songId: string
}

interface Song {
  id: string
  title: string
  artist: string
  duration: string
  coverArt: string
  audioSrc?: string
}

const SAMPLE_SONGS: Song[] = [
  {
    id: '1',
    title: 'Embrace',
    artist: 'Pastel Ghost',
    duration: '3:28',
    coverArt: '/song.jpeg',
    audioSrc: '/sounds/embrace.mp3'
  },
  {
    id: '2',
    title: 'Dark Beach',
    artist: 'Pastel Ghost',
    duration: '3:42',
    coverArt: '/song.jpeg',
    audioSrc: '/sounds/dark.mp3'
  }
]

interface SpotifyAppProps {
  isOpen: boolean;
  onClose: () => void;
  onMinimize?: () => void;
}

export const SpotifyApp = ({ isOpen, onClose, onMinimize }: SpotifyAppProps) => {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentSong, setCurrentSong] = useState<Song>(SAMPLE_SONGS[0])
  const [progress, setProgress] = useState<SongProgress>({
    currentTime: 0,
    duration: 0,
    songId: SAMPLE_SONGS[0].id
  })
  const [isMaximized, setIsMaximized] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const audioRef = useRef<HTMLAudioElement>(null)
  const sounds = useSystemSounds()
  const { globalVolume, isMuted, setGlobalVolume, setIsMuted } = useVolume()

  // Load cached progress when component mounts
  useEffect(() => {
    const cachedProgress = localStorage.getItem('songProgress')
    if (cachedProgress) {
      const parsed = JSON.parse(cachedProgress)
      setProgress(parsed)
      const cachedSong = SAMPLE_SONGS.find(song => song.id === parsed.songId)
      if (cachedSong) {
        setCurrentSong(cachedSong)
        if (audioRef.current) {
          audioRef.current.currentTime = parsed.currentTime
          // Load the audio to get metadata
          audioRef.current.load()
        }
      }
    }
  }, [])

  // Add new effect to handle initial audio loading
  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    // Load the audio to get metadata when component mounts
    audio.load()
  }, []) // Empty dependency array means this runs once on mount

  // Save progress to cache when component unmounts or window closes
  useEffect(() => {
    const audio = audioRef.current
    return () => {
      if (audio) {
        localStorage.setItem('songProgress', JSON.stringify({
          currentTime: audio.currentTime,
          duration: audio.duration,
          songId: currentSong.id
        }))
      }
    }
  }, [currentSong.id])

  // Replace the interval-based progress update with timeupdate event
  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const handleTimeUpdate = () => {
      setProgress({
        currentTime: audio.currentTime,
        duration: audio.duration,
        songId: currentSong.id
      })
    }

    const handleLoadedMetadata = () => {
      setProgress(prev => ({
        ...prev,
        duration: audio.duration,
      }))
    }

    audio.addEventListener('timeupdate', handleTimeUpdate)
    audio.addEventListener('loadedmetadata', handleLoadedMetadata)

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate)
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata)
    }
  }, [currentSong.id])

  useEffect(() => {
    const currentAudio = audioRef.current
    if (!currentAudio) return

    const updateVolume = () => {
      const effectiveVolume = isMuted ? 0 : globalVolume / 100
      if (currentAudio.volume !== effectiveVolume) {
        currentAudio.volume = effectiveVolume
      }
    }

    // Initial volume setup
    updateVolume()

    // Add event listener for volume changes
    currentAudio.addEventListener('play', updateVolume)

    return () => {
      if (currentAudio) {
        currentAudio.removeEventListener('play', updateVolume)
      }
    }
  }, [globalVolume, isMuted])

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.load()
    }
  }, [currentSong.audioSrc])

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  const handleProgressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = Number(e.target.value)
    if (audioRef.current) {
      audioRef.current.currentTime = newTime
      setProgress(prev => ({ ...prev, currentTime: newTime }))
    }
  }

  const handlePlayPause = async () => {
    if (!currentSong.audioSrc) {
      sounds.playError()
      return
    }
    
    try {
      if (isPlaying) {
        audioRef.current?.pause()
        setIsPlaying(false)
      } else {
        const playPromise = audioRef.current?.play()
        if (playPromise) {
          await playPromise
          setIsPlaying(true)
        }
      }
    } catch (error) {
      console.error("Playback error:", error)
      sounds.playError()
      setIsPlaying(false)
    }
  }

  const handleSongSelect = async (song: Song) => {
    if (currentSong.id === song.id) {
      handlePlayPause()
      return
    }

    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.currentTime = 0
    }
    setCurrentSong(song)
    setIsPlaying(false)  // Reset playing state temporarily

    // Add slight delay to allow audio to load
    setTimeout(async () => {
      try {
        if (audioRef.current) {
          const playPromise = audioRef.current.play()
          if (playPromise) {
            await playPromise
            setIsPlaying(true)
          }
        }
      } catch (error) {
        console.error("Playback error:", error)
        sounds.playError()
        setIsPlaying(false)
      }
    }, 100)
  }

  const handleMinimize = () => {
    setIsMinimized(true)
    if (onMinimize) {
      onMinimize()
    }
  }

  const toggleMaximize = () => {
    setIsMaximized(!isMaximized)
  }

  return (
    <WindowFrame
      title="Music Player"
      icon={<FaPlay className="w-4 h-4 text-green-400" />}
      isOpen={isOpen}
      onClose={onClose}
      onMinimize={handleMinimize}
      onMaximize={toggleMaximize}
      defaultSize={{ width: '800px', height: '600px' }}
      defaultPosition={{ x: 100, y: 60 }}
      isMaximized={isMaximized}
      isMinimized={isMinimized}
    >
      <div className="flex h-full bg-[#121212] text-white">
        {/* Left Sidebar */}
        <div className="w-64 p-6 border-r border-white/10">
          <h2 className="text-xl font-bold mb-6">Your Library</h2>
          <div className="space-y-4">
            <div className="text-white/70 hover:text-white cursor-pointer">Liked Songs</div>
            <div className="text-white/70 hover:text-white cursor-pointer">Your Playlists</div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-6">
          <h2 className="text-2xl font-bold mb-6">Recently Played</h2>
          <div className="grid grid-cols-2 gap-6">
            {SAMPLE_SONGS.map((song) => (
              <div
                key={song.id}
                onClick={() => handleSongSelect(song)}
                className="flex items-center gap-4 group cursor-pointer hover:bg-white/10 p-3 rounded-md transition-colors"
              >
                <div className="relative w-12 h-12 flex-shrink-0">
                  <Image
                    src={song.coverArt}
                    alt={`${song.title} cover`}
                    fill
                    className="object-cover rounded"
                    priority
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium truncate">{song.title}</div>
                  <div className="text-sm text-gray-400">{song.artist}</div>
                </div>
                <div className="text-sm text-gray-400">{song.duration}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Player Controls */}
      <div className="absolute bottom-0 left-0 right-0 bg-[#181818] border-t border-white/10">
        <div className="px-4 pt-2">
          <div className="flex items-center gap-2 text-xs text-white/70">
            <span>{formatTime(progress.currentTime)}</span>
            <div className="flex-1 relative">
              <input
                type="range"
                min="0"
                max={progress.duration || 0}
                value={progress.currentTime}
                onChange={(e) => handleProgressChange(e)}
                className="w-full h-1 bg-white/20 rounded-lg appearance-none cursor-pointer accent-white"
              />
            </div>
            <span>{formatTime(progress.duration)}</span>
          </div>
        </div>

        <div className="px-4 py-3 flex items-center justify-between">
          {/* Now Playing */}
          <div className="flex items-center gap-3 min-w-0 w-[30%]">
            <div className="relative w-14 h-14 flex-shrink-0">
              <Image
                src={currentSong.coverArt}
                alt={`${currentSong.title} cover`}
                fill
                className="object-cover rounded"
                priority
              />
            </div>
            <div className="min-w-0">
              <div className="font-medium truncate">{currentSong.title}</div>
              <div className="text-sm text-gray-400 truncate">{currentSong.artist}</div>
            </div>
          </div>

          {/* Playback Controls */}
          <div className="flex items-center gap-6">
            <FaStepBackward className="w-4 h-4 text-white/70 hover:text-white cursor-pointer" />
            <button
              onClick={handlePlayPause}
              className="w-8 h-8 rounded-full bg-white flex items-center justify-center hover:scale-105 transition-transform"
            >
              {isPlaying ? (
                <FaPause className="w-4 h-4 text-black" />
              ) : (
                <FaPlay className="w-4 h-4 text-black ml-1" />
              )}
            </button>
            <FaStepForward className="w-4 h-4 text-white/70 hover:text-white cursor-pointer" />
          </div>

          {/* Volume Control */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setIsMuted(!isMuted)
                sounds.playClick()
              }}
              className="hover:text-white transition-colors"
            >
              {isMuted || globalVolume === 0 ? (
                <FaVolumeMute className="w-4 h-4 text-white/70" />
              ) : (
                <FaVolumeUp className="w-4 h-4 text-white/70" />
              )}
            </button>
            <div className="relative w-24">
              <input
                type="range"
                min="0"
                max="100"
                value={isMuted ? 0 : globalVolume}
                onChange={(e) => {
                  const newVolume = Number(e.target.value)
                  setGlobalVolume(newVolume)
                  if (newVolume > 0 && isMuted) {
                    setIsMuted(false)
                  }
                  sounds.playSlider()
                }}
                className="w-full h-1 bg-white/20 rounded-lg appearance-none cursor-pointer accent-white"
              />
            </div>
          </div>
        </div>
      </div>

      <audio
        ref={audioRef}
        src={currentSong.audioSrc}
        onEnded={() => setIsPlaying(false)}
      />
    </WindowFrame>
  )
} 