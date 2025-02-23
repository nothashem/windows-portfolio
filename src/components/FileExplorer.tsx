'use client'

import { 
  FaFolder, 
  FaFile
} from 'react-icons/fa'
import { WindowFrame } from './window/WindowFrame'
import { useSystemSounds } from '@/hooks/useSystemSounds'

interface FileExplorerProps {
  isOpen: boolean
  onClose: () => void
}

type FileType = 'file' | 'folder'

interface FileItem {
  id: string
  name: string
  type: FileType
}

const SAMPLE_FILES: FileItem[] = [
  { id: '1', name: 'Documents', type: 'folder' },
  { id: '2', name: 'Pictures', type: 'folder' },
  { id: '3', name: 'readme.txt', type: 'file' },
  { id: '4', name: 'notes.md', type: 'file' }
]

export const FileExplorer = ({ isOpen, onClose }: FileExplorerProps) => {
  const sounds = useSystemSounds()

  const handleItemClick = (type: FileType) => {
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