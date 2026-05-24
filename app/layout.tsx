import type { Metadata, Viewport } from 'next'
import './globals.css'
import BottomNav from '@/components/BottomNav'

export const metadata: Metadata = {
  title: 'Momentum',
  description: '12 months of focused runway · ₹70 LPA · Senior PM',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Momentum',
  },
}

export const viewport: Viewport = {
  themeColor: '#0A0A0A',
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
      <body className="max-w-md mx-auto pb-24">
        <main className="min-h-dvh">{children}</main>
        <BottomNav />
      </body>
    </html>
  )
}
