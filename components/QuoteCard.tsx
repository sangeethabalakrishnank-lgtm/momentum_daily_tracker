import { getQuoteOfDay } from '@/lib/quotes'

export default function QuoteCard() {
  const quote = getQuoteOfDay()

  return (
    <div
      className="rounded-2xl px-5 py-4 mb-5"
      style={{ background: 'var(--cream)', border: '1px solid var(--mist)' }}
    >
      <p className="font-fraunces text-base leading-relaxed mb-2"
        style={{ color: 'var(--ink)' }}>
        &ldquo;{quote.text}&rdquo;
      </p>
      <p className="font-nunito text-xs font-700 tracking-widest uppercase"
        style={{ color: 'var(--ink-soft)' }}>
        — {quote.author}
      </p>
    </div>
  )
}
