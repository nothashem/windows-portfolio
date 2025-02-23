'use client'

import { useState } from 'react'
import { 
  FaFolder, 
  FaFolderOpen,
  FaChevronRight, 
  FaChevronDown,
  FaArrowLeft,
  FaArrowRight,
  FaRedo,
  FaSearch,
  FaEllipsisH,
  FaHome,
  FaDownload,
  FaDesktop,
  FaFile
} from 'react-icons/fa'
import { WindowFrame } from './window/WindowFrame'
import { useSystemSounds } from '@/hooks/useSystemSounds'

interface FileExplorerProps {
  isOpen: boolean
  onClose: () => void
}

interface FileItem {
  id: string
  name: string
  type: 'folder' | 'file'
  children?: FileItem[]
  size?: string
  modified?: string
}

const SAMPLE_FILES = [
  { id: '1', name: 'Documents', type: 'folder' },
  { id: '2', name: 'Pictures', type: 'folder' },
  { id: '3', name: 'readme.txt', type: 'file' },
  { id: '4', name: 'notes.md', type: 'file' }
]

export const FileExplorer = ({ isOpen, onClose }: FileExplorerProps) => {
  const [currentPath, setCurrentPath] = useState<string[]>(['This PC'])
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set())
  const sounds = useSystemSounds()

  const fileSystem: FileItem[] = [
    {
      id: 'desktop',
      name: 'Desktop',
      type: 'folder',
      children: [
        { id: 'doc1', name: 'Document.pdf', type: 'file', size: '1.2 MB', modified: '2/23/2024' },
        { id: 'img1', name: 'Image.jpg', type: 'file', size: '2.4 MB', modified: '2/23/2024' }
      ]
    },
    {
      id: 'documents',
      name: 'Documents',
      type: 'folder',
      children: [
        { id: 'work', name: 'Work', type: 'folder', children: [] },
        { id: 'personal', name: 'Personal', type: 'folder', children: [] }
      ]
    },
    {
      id: 'downloads',
      name: 'Downloads',
      type: 'folder',
      children: []
    }
  ]

  const toggleFolder = (folderId: string) => {
    setExpandedFolders(prev => {
      const next = new Set(prev)
      if (next.has(folderId)) {
        next.delete(folderId)
      } else {
        next.add(folderId)
      }
      return next
    })
  }

  const renderFileTree = (items: FileItem[], level = 0) => {
    return items.map(item => (
      <div key={item.id} style={{ paddingLeft: `${level * 20}px` }}>
        <div
          className="flex items-center py-1 px-2 hover:bg-white/5 rounded-sm cursor-default"
        >
          {item.type === 'folder' && (
            <button
              onClick={() => {
                sounds.playOpen()
                toggleFolder(item.id)
              }}
              className="p-1 hover:bg-white/10 rounded-sm"
            >
              {expandedFolders.has(item.id) ? (
                <FaChevronDown className="w-3 h-3 text-white/70" />
              ) : (
                <FaChevronRight className="w-3 h-3 text-white/70" />
              )}
            </button>
          )}
          <div className="flex items-center gap-2 flex-1">
            {item.type === 'folder' ? (
              expandedFolders.has(item.id) ? (
                <FaFolderOpen className="w-4 h-4 text-yellow-200/90" />
              ) : (
                <FaFolder className="w-4 h-4 text-yellow-200/90" />
              )
            ) : (
              <FaFile className="w-4 h-4 text-white/70" />
            )}
            <span className="text-sm">{item.name}</span>
          </div>
        </div>
        {item.type === 'folder' && expandedFolders.has(item.id) && item.children && (
          <div className="ml-2">
            {renderFileTree(item.children, level + 1)}
          </div>
        )}
      </div>
    ))
  }

  const handleItemClick = (type: 'file' | 'folder') => {
    if (type === 'folder') {
      sounds.playOpen()
    } else {
      sounds.playClick()
    }
  }

  return (
    <WindowFrame
      title="File Explorer"
      icon={<FaFolder className="w-4 h-4" />}
      isOpen={isOpen}
      onClose={onClose}
    >
      <div className="p-4">
        {SAMPLE_FILES.map((item) => (
          <div 
            key={item.id}
            className="flex items-center gap-2 p-2 hover:bg-white/10 cursor-pointer rounded"
            onClick={() => handleItemClick(item.type)}
          >
            {item.type === 'folder' ? (
              <FaFolder className="w-4 h-4" />
            ) : (
              <FaFile className="w-4 h-4" />
            )}
            <span>{item.name}</span>
          </div>
        ))}
      </div>
    </WindowFrame>
  )
} 