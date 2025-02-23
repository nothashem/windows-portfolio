'use client'

import Image from 'next/image'

export const WallpaperTest = () => {
  return (
    <div className="relative w-screen h-screen">
      <Image 
        src="/wallpaper.jpg"
        alt="Windows XP Bliss wallpaper"
        fill
        priority
        className="object-cover"
        onError={(e) => {
          console.error('Error loading wallpaper:', e)
        }}
        onLoad={() => {
          console.log('Wallpaper loaded successfully')
        }}
      />
    </div>
  )
} 