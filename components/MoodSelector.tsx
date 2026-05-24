'use client'

const MOODS = ['🔥', '💪', '😐', '😴', '🌪️'] as const
export type Mood = typeof MOODS[number]

type Props = {
  value: Mood | null
  onChange: (m: Mood) => void
}

export default function MoodSelector({ value, onChange }: Props) {
  return (
    <div>
      <p
        className="font-nunito text-[10px] uppercase tracking-widest mb-2"
        style={{ color: 'var(--ink-soft)', fontWeight: 900 }}
      >
        Energy today
      </p>
      <div className="flex gap-2">
        {MOODS.map(m => {
          const active = value === m
          return (
            <button
              key={m}
              onClick={() => onChange(m)}
              className="flex-1 rounded-xl py-2.5 text-xl transition-all"
              style={{
                background: active ? 'var(--orange)' : 'var(--card)',
                border: `2px solid ${active ? 'var(--orange)' : 'var(--line)'}`,
                transform: active ? 'scale(1.05)' : 'scale(1)',
              }}
              aria-label={m}
            >
              {m}
            </button>
          )
        })}
      </div>
    </div>
  )
}
