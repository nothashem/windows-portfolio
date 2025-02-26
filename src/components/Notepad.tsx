'use client'

import { useState, useEffect } from 'react'
import { WindowFrame } from './window/WindowFrame'
import { FaFileAlt } from 'react-icons/fa'
import { useSystemSounds } from '@/hooks/useSystemSounds'

interface Note {
  id: string
  content: string
  lastModified: string
}

interface NotepadProps {
  isOpen: boolean;
  onClose: () => void;
  onMinimize?: () => void;
}

export const Notepad = ({ isOpen, onClose, onMinimize }: NotepadProps) => {
  const [content, setContent] = useState('')
  const [savedNotes, setSavedNotes] = useState<Note[]>([])
  const [currentNoteId, setCurrentNoteId] = useState<string | null>(null)
  const [isMaximized, setIsMaximized] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const sounds = useSystemSounds()

  // Initialize notes on first mount
  useEffect(() => {
    const initializeNotes = () => {
      const savedNotesStr = localStorage.getItem('notes')
      
      if (savedNotesStr) {
        try {
          const parsedNotes = JSON.parse(savedNotesStr)
          if (Array.isArray(parsedNotes) && parsedNotes.length > 0) {
            setSavedNotes(parsedNotes)
            
            // Try to load the last active note
            const lastNoteId = localStorage.getItem('lastNoteId')
            const noteToLoad = lastNoteId 
              ? parsedNotes.find(note => note.id === lastNoteId)
              : parsedNotes[0]

            if (noteToLoad) {
              setCurrentNoteId(noteToLoad.id)
              setContent(noteToLoad.content)
              localStorage.setItem('lastNoteId', noteToLoad.id)
            }
            return
          }
        } catch (error) {
          console.error('Error parsing saved notes:', error)
        }
      }

      // If no valid notes found, create an initial note
      const initialNote: Note = {
        id: Date.now().toString(),
        content: '',
        lastModified: new Date().toISOString()
      }
      setSavedNotes([initialNote])
      setCurrentNoteId(initialNote.id)
      setContent('')
      localStorage.setItem('notes', JSON.stringify([initialNote]))
      localStorage.setItem('lastNoteId', initialNote.id)
    }

    initializeNotes()
  }, [])

  // Save note when content changes
  useEffect(() => {
    if (!currentNoteId) return

    const saveNote = () => {
      const updatedNotes = savedNotes.map(note =>
        note.id === currentNoteId
          ? { ...note, content, lastModified: new Date().toISOString() }
          : note
      )
      setSavedNotes(updatedNotes)
      localStorage.setItem('notes', JSON.stringify(updatedNotes))
      localStorage.setItem('lastNoteId', currentNoteId)
    }

    const saveTimeout = setTimeout(saveNote, 500)
    return () => clearTimeout(saveTimeout)
  }, [content, currentNoteId, savedNotes])

  const handleNewNote = () => {
    sounds.playClick()
    const newNote = {
      id: Date.now().toString(),
      content: '',
      lastModified: new Date().toISOString()
    }
    const updatedNotes = [...savedNotes, newNote]
    setSavedNotes(updatedNotes)
    setCurrentNoteId(newNote.id)
    setContent('')
    localStorage.setItem('notes', JSON.stringify(updatedNotes))
    localStorage.setItem('lastNoteId', newNote.id)
  }

  const loadNote = (note: Note) => {
    setCurrentNoteId(note.id)
    setContent(note.content)
    localStorage.setItem('lastNoteId', note.id)
  }

  const deleteNote = (id: string) => {
    const updatedNotes = savedNotes.filter(note => note.id !== id)
    
    if (updatedNotes.length === 0) {
      // If deleting the last note, create a new one
      handleNewNote()
      return
    }

    setSavedNotes(updatedNotes)
    localStorage.setItem('notes', JSON.stringify(updatedNotes))
    
    if (currentNoteId === id) {
      // Load the first note if deleting current note
      const firstNote = updatedNotes[0]
      setCurrentNoteId(firstNote.id)
      setContent(firstNote.content)
      localStorage.setItem('lastNoteId', firstNote.id)
    }
  }

  const getNoteName = (content: string) => {
    const firstLine = content.split('\n')[0] || ''
    const words = firstLine.trim().split(/\s+/)
    return words.slice(0, 3).join(' ') || 'Untitled'
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
      title="Notepad"
      icon={<FaFileAlt className="w-4 h-4 text-yellow-400" />}
      isOpen={isOpen}
      onClose={onClose}
      onMinimize={handleMinimize}
      onMaximize={toggleMaximize}
      defaultSize={{ width: '600px', height: '400px' }}
      defaultPosition={{ x: 100, y: 100 }}
      isMaximized={isMaximized}
      isMinimized={isMinimized}
    >
      <div className="flex h-full bg-[#1e1e1e] text-white">
        {/* Sidebar with saved notes */}
        <div className="w-48 border-r border-white/10 p-2 flex flex-col">
          <button
            onClick={handleNewNote}
            className="w-full px-3 py-2 bg-white/10 hover:bg-white/20 rounded mb-2 text-sm"
          >
            New Note
          </button>
          <div className="flex-1 overflow-y-auto">
            {savedNotes.map(note => (
              <div
                key={note.id}
                className={`
                  p-2 rounded cursor-pointer text-sm mb-1
                  ${currentNoteId === note.id ? 'bg-white/20' : 'hover:bg-white/10'}
                `}
                onClick={() => loadNote(note)}
              >
                <div className="truncate font-medium">
                  {getNoteName(note.content)}
                </div>
                <div className="text-xs text-gray-400">
                  {new Date(note.lastModified).toLocaleDateString()}
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    deleteNote(note.id)
                  }}
                  className="text-xs text-red-400 hover:text-red-300 mt-1"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Editor area */}
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="flex-1 bg-transparent p-4 outline-none resize-none font-mono text-white"
          placeholder="Start typing..."
          spellCheck={false}
        />
      </div>
    </WindowFrame>
  )
} 