import { createContext, useContext, useState } from 'react'

interface VolumeContextType {
  globalVolume: number
  setGlobalVolume: (volume: number) => void
  isMuted: boolean
  setIsMuted: (muted: boolean) => void
}

const VolumeContext = createContext<VolumeContextType | undefined>(undefined)

export const VolumeProvider = ({ children }: { children: React.ReactNode }) => {
  const [globalVolume, setGlobalVolume] = useState(50)
  const [isMuted, setIsMuted] = useState(false)

  return (
    <VolumeContext.Provider value={{ globalVolume, setGlobalVolume, isMuted, setIsMuted }}>
      {children}
    </VolumeContext.Provider>
  )
}

export const useVolume = () => {
  const context = useContext(VolumeContext)
  if (context === undefined) {
    throw new Error('useVolume must be used within a VolumeProvider')
  }
  return context
} 