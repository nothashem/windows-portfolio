'use client'

import { useState } from 'react'
import { FaUndo } from 'react-icons/fa'
import { WindowFrame } from './window/WindowFrame'

interface RecycleBinProps {
  isOpen: boolean
  onClose: () => void
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
  deletedItems,
  onEmptyBin 
}: RecycleBinProps) => {
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set())

  return (
    <WindowFrame
      title="Recycle Bin"
      icon={<FaTrash className="w-4 h-4 text-white/90" />}
      isOpen={isOpen}
      onClose={onClose}
      defaultSize={{ width: '60%', height: '70%' }}
      defaultPosition={{ x: 80, y: 80 }}
    >
      <div className="flex flex-col h-full">
        {/* Toolbar */}
        <div className="flex items-center gap-2 p-2 bg-[#1a1a1a] border-b border-white/10">
          <button 
            className="px-3 py-1.5 hover:bg-white/10 rounded-md text-white/90 text-sm
                     flex items-center gap-2"
            onClick={onEmptyBin}
          >
            <FaTrash className="w-3 h-3" />
            <span>Empty Recycle Bin</span>
          </button>
          <button 
            className="px-3 py-1.5 hover:bg-white/10 rounded-md text-white/90 text-sm
                     flex items-center gap-2"
            disabled={selectedItems.size === 0}
          >
            <FaUndo className="w-3 h-3" />
            <span>Restore</span>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 p-4 overflow-auto">
          {deletedItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-white/50">
              <FaTrash className="w-16 h-16 mb-4" />
              <p>Recycle Bin is empty</p>
            </div>
          ) : (
            <div className="space-y-2">
              {deletedItems.map((item, index) => (
                <div 
                  key={index}
                  className="flex items-center gap-4 p-2 hover:bg-white/5 rounded-md"
                >
                  <input
                    type="checkbox"
                    checked={selectedItems.has(item.name)}
                    onChange={(e) => {
                      const newSelected = new Set(selectedItems)
                      if (e.target.checked) {
                        newSelected.add(item.name)
                      } else {
                        newSelected.delete(item.name)
                      }
                      setSelectedItems(newSelected)
                    }}
                    className="w-4 h-4"
                  />
                  <div className="flex-1">
                    <div className="text-white">{item.name}</div>
                    <div className="text-sm text-white/50">
                      Deleted on {new Date(item.deletedAt).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="text-white/70">{item.size}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </WindowFrame>
  )
} 