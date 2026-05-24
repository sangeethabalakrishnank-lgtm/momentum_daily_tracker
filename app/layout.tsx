import type { Metadata, Viewport } from 'next'
import './globals.css'
import HeaderNav from '@/components/HeaderNav'

export const metadata: Metadata = {
  title: 'Momentum',
  description: 'Tap to log. That\'s the whole thing.',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Momentum',
  },
}

export const viewport: Viewport = {
  themeColor: '#2C2C2C',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="apple-touch-icon" href="/icon-192.png" />
      </head>
      <body className="max-w-[480px] mx-auto pb-8">
        <HeaderNav />
        <main className="min-h-[calc(100dvh-140px)]">{children}</main>
      </body>
    </html>
  )
}
