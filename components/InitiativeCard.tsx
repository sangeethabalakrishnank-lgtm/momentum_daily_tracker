'use client'

import { motion } from 'framer-motion'
import type { Initiative } from '@/lib/initiatives'

type Props = {
  initiative: Initiative
  done: boolean
  streak: number
  saving: boolean
  onToggle: () => void
}

export default function InitiativeCard({ initiative, done, streak, saving, onToggle }: Props) {
  const { emoji, name, sub, tier } = initiative
  const priority = tier === 1

  return (
    <motion.div
      layout
      layoutId={initiative.id}
      transition={{ layout: { type: 'spring', stiffness: 320, damping: 32 } }}
      onClick={() => !saving && onToggle()}
      whileTap={{ scale: 0.98 }}
      className="flex items-center gap-3 mb-2.5 cursor-pointer"
      style={{
        background: done ? 'var(--sage-tint)' : 'var(--warm-white)',
        borderRadius: 14,
        padding: '14px 16px',
        borderLeft: done ? '3px solid var(--sage)' : 'none',
        boxShadow: priority && !done
          ? '0 0 0 1.5px var(--sage-light), 0 1px 4px rgba(0,0,0,0.05)'
          : '0 1px 4px rgba(0,0,0,0.05)',
        opacity: saving ? 0.6 : 1,
        transition: 'background 0.2s, opacity 0.15s',
      }}
    >
      <div style={{ fontSize: 24, flexShrink: 0 }}>{emoji}</div>

      <div className="flex-1 min-w-0">
        {priority && (
          <div
            style={{
              fontSize: 9,
              fontWeight: 800,
              color: 'var(--sage-dark)',
              letterSpacing: '0.1em',
              marginBottom: 2,
            }}
          >
            MUST-HIT
          </div>
        )}
        <div
          style={{
            fontSize: 14,
            fontWeight: 700,
            color: done ? 'var(--sage-dark)' : 'var(--charcoal)',
          }}
        >
          {name}
        </div>
        <div style={{ fontSize: 11, color: 'var(--mid-grey)', marginTop: 2 }}>
          {sub}
        </div>
      </div>

      {streak > 1 && (
        <div
          style={{
            fontSize: 11,
            fontWeight: 800,
            color: 'var(--accent-gold)',
            background: 'var(--gold-tint)',
            borderRadius: 20,
            padding: '4px 9px',
            whiteSpace: 'nowrap',
          }}
        >
          🔥 {streak}
        </div>
      )}

      <div
        className="flex items-center justify-center flex-shrink-0"
        style={{
          width: 28,
          height: 28,
          borderRadius: '50%',
          border: `2px solid ${done ? 'var(--sage)' : 'var(--light-grey)'}`,
          background: done ? 'var(--sage)' : 'transparent',
          color: done ? '#fff' : 'transparent',
          fontSize: 14,
          fontWeight: 700,
          transition: 'all 0.2s',
        }}
      >
        {done && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 500, damping: 18 }}
          >
            ✓
          </motion.span>
        )}
      </div>
    </motion.div>
  )
}
