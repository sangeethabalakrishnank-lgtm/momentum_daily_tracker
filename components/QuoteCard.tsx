'use client'

import { getQuoteOfDay } from '@/lib/quotes'

export default function QuoteCard() {
  const q = getQuoteOfDay()

  return (
    <div
      className="rounded-2xl px-5 py-4 mb-4"
      style={{
        background: 'var(--card)',
        border: '2.5px solid var(--line)',
        borderLeft: '6px solid var(--orange)',
      }}
    >
      <p
        className="font-fraunces text-base leading-snug"
        style={{ color: 'var(--ink)' }}
      >
        &ldquo;{q.text}&rdquo;
      </p>
      <p
        className="font-nunito text-xs mt-2 uppercase tracking-widest"
        style={{ color: 'var(--ink-soft)', fontWeight: 800 }}
      >
        — {q.author}
      </p>
    </div>
  )
}
