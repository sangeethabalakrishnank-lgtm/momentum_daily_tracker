'use client'

import { monthsRemaining } from '@/lib/date'

const RUNWAY_START = new Date('2026-05-22')

export default function CountdownBanner() {
  const months = monthsRemaining(new Date(), RUNWAY_START)

  return (
    <div
      className="rounded-2xl px-5 py-4 mb-4"
      style={{ background: 'var(--ink)', color: 'white' }}
    >
      <div className="flex items-baseline gap-2">
        <span className="font-nunito text-5xl font-extrabold tracking-tight leading-none"
          style={{ color: 'var(--sky)' }}>
          {months}
        </span>
        <span className="font-nunito text-sm font-700 opacity-80 leading-tight">
          months of focused runway
        </span>
      </div>
      <p className="font-nunito text-xs mt-1.5 opacity-60 tracking-wide">
        → ₹70 LPA · Senior PM · AI-forward SaaS
      </p>
    </div>
  )
}
