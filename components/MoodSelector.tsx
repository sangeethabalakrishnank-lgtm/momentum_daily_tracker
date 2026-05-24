'use client'

const MOODS = ['🔥', '💪', '😐', '😴', '🌪️'] as const
export type Mood = typeof MOODS[number]

type Props = {
  value: Mood | null
  onChange: (m: Mood) => void
}

export default function MoodSelector({ value, onChange }: Props) {
  return (
    <div className="flex gap-2">
      {MOODS.map(m => {
        const active = value === m
        return (
          <button
            key={m}
            onClick={() => onChange(m)}
            className="flex-1 transition-all"
            style={{
              fontSize: 22,
              background: active ? 'var(--sage-light)' : 'var(--light-grey)',
              border: 'none',
              borderRadius: 10,
              padding: '8px 0',
              transform: active ? 'scale(1.1)' : 'scale(1)',
              cursor: 'pointer',
            }}
            aria-label={m}
          >
            {m}
          </button>
        )
      })}
    </div>
  )
}
