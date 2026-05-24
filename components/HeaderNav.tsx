'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'

const TABS = [
  { href: '/',      label: 'Today' },
  { href: '/week',  label: 'This Week' },
  { href: '/goals', label: 'My Goals' },
]

export default function HeaderNav() {
  const path = usePathname()
  const [dateLabel, setDateLabel] = useState('')

  useEffect(() => {
    const d = new Date()
    const ds = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat']
    const ms = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
    setDateLabel(`${ds[d.getDay()].toLowerCase()}, ${ms[d.getMonth()]} ${d.getDate()}`)
  }, [])

  return (
    <header
      className="sticky top-0 z-50"
      style={{ background: 'var(--charcoal)', color: 'var(--cream)', padding: '22px 20px 16px' }}
    >
      <div className="flex items-baseline justify-between">
        <span
          className="font-fraunces"
          style={{ fontSize: 26, fontWeight: 800, color: 'var(--sage-light)', letterSpacing: -0.5 }}
        >
          momentum.
        </span>
        <span
          style={{ fontSize: 11, fontWeight: 700, color: 'var(--mid-grey)', letterSpacing: '0.08em', textTransform: 'uppercase' }}
        >
          {dateLabel}
        </span>
      </div>
      <nav className="flex gap-1.5 mt-3.5">
        {TABS.map(tab => {
          const active = path === tab.href
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className="flex-1 text-center transition-all"
              style={{
                padding: '9px 0',
                borderRadius: 10,
                fontSize: 12,
                fontWeight: 700,
                letterSpacing: '0.04em',
                background: active ? 'var(--sage)' : '#3A3A3A',
                color: active ? '#fff' : 'var(--mid-grey)',
              }}
            >
              {tab.label}
            </Link>
          )
        })}
      </nav>
    </header>
  )
}
