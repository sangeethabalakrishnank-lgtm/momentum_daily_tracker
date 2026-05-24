'use client'

import { useEffect, useState } from 'react'

type Props = { message: string | null }

export default function Toast({ message }: Props) {
  const [visible, setVisible] = useState(false)
  const [shown, setShown] = useState<string | null>(null)

  useEffect(() => {
    if (!message) return
    setShown(message)
    setVisible(true)
    const t = setTimeout(() => setVisible(false), 2200)
    return () => clearTimeout(t)
  }, [message])

  return (
    <div
      className="fixed left-1/2 z-[999] whitespace-nowrap"
      style={{
        bottom: 24,
        transform: `translateX(-50%) translateY(${visible ? 0 : 20}px)`,
        opacity: visible ? 1 : 0,
        background: 'var(--charcoal)',
        color: 'var(--cream)',
        fontSize: 13,
        fontWeight: 700,
        padding: '12px 22px',
        borderRadius: 30,
        boxShadow: '0 6px 20px rgba(0,0,0,0.2)',
        pointerEvents: 'none',
        transition: 'all 0.3s',
      }}
    >
      {shown}
    </div>
  )
}
