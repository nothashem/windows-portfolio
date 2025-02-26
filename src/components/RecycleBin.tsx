'use client'

import { useState } from 'react'
import { FaTrash } from 'react-icons/fa'
import { WindowFrame } from './window/WindowFrame'

interface RecycleBinProps {
  isOpen: boolean
  onClose: () => void
  onMinimize?: () => void
  deletedItems: Array<{
    name: string
    deletedAt: string
    size: string
  }>
  onEmptyBin: () => void
}

export const RecycleBin = ({ 
  isOpen, 
  onClose, 
  onMinimize,
  // Commented out unused props to avoid ESLint errors
  // deletedItems,
  // onEmptyBin 
}: RecycleBinProps) => {
  // Removed unused state variables
  const [isMaximized, setIsMaximized] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)

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
      title="Recycle Bin"
      icon={<FaTrash className="w-4 h-4 text-white/90" />}
      isOpen={isOpen}
      onClose={onClose}
      onMinimize={handleMinimize}
      onMaximize={toggleMaximize}
      defaultSize={{ width: '500px', height: '400px' }}
      defaultPosition={{ x: 120, y: 120 }}
      isMaximized={isMaximized}
      isMinimized={isMinimized}
    >
      <div className="flex flex-col h-full bg-[#1e1e1e] text-white p-4">
        <div className="text-center py-8">
          <FaTrash className="w-16 h-16 mx-auto mb-4 text-gray-400" />
          <h2 className="text-xl font-medium mb-2">Recycle Bin is Empty</h2>
          <p className="text-gray-400">There are no items in the recycle bin.</p>
        </div>
      </div>
    </WindowFrame>
  )
} 