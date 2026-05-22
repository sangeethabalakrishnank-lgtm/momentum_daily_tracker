'use client'

import { motion } from 'framer-motion'

const MOODS = ['🔥', '💪', '😐', '😴', '🌪️'] as const
export type Mood = typeof MOODS[number]

type Props = {
  value: Mood | null
  onChange: (m: Mood) => void
}

export default function MoodSelector({ value, onChange }: Props) {
  return (
    <div>
      <p className="font-nunito text-xs font-bold tracking-widest uppercase mb-2"
        style={{ color: 'var(--ink-soft)' }}>
        Today&apos;s energy
      </p>
      <div className="flex gap-2">
        {MOODS.map(mood => (
          <motion.button
            key={mood}
            whileTap={{ scale: 0.9 }}
            animate={value === mood
              ? { scale: 1.25, filter: 'brightness(1.1)' }
              : { scale: 1, filter: 'brightness(1)' }}
            transition={{ type: 'spring', stiffness: 400, damping: 20 }}
            onClick={() => onChange(mood)}
            className="flex-1 text-2xl py-2 rounded-xl transition-all"
            style={{
              background: value === mood ? 'var(--lilac)' : 'var(--cream)',
              border: `2px solid ${value === mood ? 'var(--lilac-deep)' : 'var(--mist)'}`,
              boxShadow: value === mood ? '0 0 0 3px #D4C4E830' : 'none',
            }}
            aria-label={mood}
          >
            {mood}
          </motion.button>
        ))}
      </div>
    </div>
  )
}
