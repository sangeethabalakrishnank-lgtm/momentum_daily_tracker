'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const TABS = [
  { href: '/',       label: 'Today',  icon: '✦' },
  { href: '/week',   label: 'Week',   icon: '◈' },
  { href: '/goals',  label: 'Goals',  icon: '◎' },
]

export default function BottomNav() {
  const path = usePathname()

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 max-w-md mx-auto">
      <div
        className="flex items-center justify-around px-4 py-3"
        style={{
          background: 'var(--ink)',
          borderTop: '2.5px solid var(--ink)',
        }}
      >
        {TABS.map(tab => {
          const active = path === tab.href
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className="flex flex-col items-center gap-0.5 min-w-[64px]"
            >
              <span
                className="text-lg leading-none transition-transform duration-150"
                style={{
                  color: active ? 'var(--orange)' : 'white',
                  opacity: active ? 1 : 0.5,
                  transform: active ? 'scale(1.25)' : 'scale(1)',
                }}
              >
                {tab.icon}
              </span>
              <span
                className="text-[11px] tracking-wider uppercase"
                style={{
                  color: active ? 'var(--orange)' : 'white',
                  opacity: active ? 1 : 0.5,
                  fontWeight: 900,
                }}
              >
                {tab.label}
              </span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
