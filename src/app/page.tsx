'use client'

import { Desktop } from '@/components/Desktop'
import { VolumeProvider } from '@/contexts/VolumeContext'

export default function Home() {
  return (
    <main className="h-screen w-screen bg-[#1a1a1a] overflow-hidden relative">
      <VolumeProvider>
        <Desktop wallpaper="/wallpaper.jpg" />
      </VolumeProvider>
    </main>
  )
}
