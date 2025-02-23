import './globals.css'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Hashim OS',
  description: 'A web-based operating system experience',
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/background.png', type: 'image/png' }
    ],
    apple: '/background.png'
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  )
}
