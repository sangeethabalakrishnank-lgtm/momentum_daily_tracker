'use client'

import { monthsRemaining } from '@/lib/date'

const RUNWAY_START = new Date('2026-05-22')

export default function CountdownBanner() {
  const months = monthsRemaining(new Date(), RUNWAY_START)

  return (
    <div
      className="rounded-2xl px-5 py-5 mb-4"
      style={{
        background: 'var(--ink)',
        color: 'white',
        border: '2.5px solid var(--ink)',
      }}
    >
      <div className="flex items-baseline gap-3">
        <span
          className="font-nunito leading-none tracking-tight"
          style={{ color: 'var(--orange)', fontWeight: 900, fontSize: 56 }}
        >
          {months}
        </span>
        <span
          className="font-nunito text-sm leading-tight"
          style={{ color: 'white', fontWeight: 800, letterSpacing: 0.2 }}
        >
          months of focused runway
        </span>
      </div>
      <p
        className="font-nunito text-xs mt-2 uppercase"
        style={{ color: 'var(--orange-soft)', fontWeight: 800, letterSpacing: 1.5, opacity: 0.85 }}
      >
        → ₹70 LPA · Senior PM · AI-forward SaaS
      </p>
    </div>
  )
}
