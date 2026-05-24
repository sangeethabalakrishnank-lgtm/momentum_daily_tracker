'use client'

import { motion } from 'framer-motion'
import type { Initiative } from '@/lib/initiatives'

type Props = {
  initiative: Initiative
  done: boolean
  weeklyDone: number      // how many days completed this week
  streak: number
  saving: boolean
  onToggle: () => void
}

export default function InitiativeCard({ initiative, done, weeklyDone, streak, saving, onToggle }: Props) {
  const { emoji, name, sub, target } = initiative
  const weeklyMet = weeklyDone >= target

  return (
    <motion.button
      layout
      layoutId={initiative.id}
      transition={{ layout: { type: 'spring', stiffness: 320, damping: 32 } }}
      onClick={onToggle}
      disabled={saving}
      whileTap={{ scale: 0.98 }}
      className="relative w-full text-left rounded-2xl px-4 py-4 mb-3 select-none"
      style={{
        background: done ? 'var(--done-bg)' : 'var(--card)',
        border: `2.5px solid ${done ? 'var(--done)' : 'var(--line)'}`,
        opacity: saving ? 0.7 : 1,
        transition: 'background 0.2s, border-color 0.2s, opacity 0.15s',
      }}
    >
      <div className="flex items-center gap-3">
        {/* Big checkbox */}
        <div
          className="flex items-center justify-center rounded-lg flex-shrink-0"
          style={{
            width: 32, height: 32,
            background: done ? 'var(--done)' : 'transparent',
            border: `2.5px solid ${done ? 'var(--done)' : 'var(--ink)'}`,
            transition: 'all 0.15s',
          }}
        >
          {done && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 500, damping: 18 }}
              style={{ color: 'white', fontWeight: 900, fontSize: 18, lineHeight: 1 }}
            >
              ✓
            </motion.span>
          )}
        </div>

        {/* Emoji */}
        <span className="text-2xl leading-none flex-shrink-0">{emoji}</span>

        {/* Title + sub */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span
              className="font-nunito text-base"
              style={{
                color: 'var(--ink)',
                fontWeight: 900,
                textDecoration: done ? 'line-through' : 'none',
                textDecorationColor: 'var(--done)',
                textDecorationThickness: 2,
              }}
            >
              {name}
            </span>
            {streak > 1 && (
              <span
                className="text-[10px] font-black px-2 py-0.5 rounded"
                style={{ background: 'var(--orange)', color: 'white', letterSpacing: 0.3 }}
              >
                🔥 {streak}
              </span>
            )}
          </div>
          <p className="font-nunito text-xs mt-0.5" style={{ color: 'var(--ink-soft)', fontWeight: 600 }}>
            {sub}
          </p>
        </div>

        {/* Weekly count */}
        <div className="flex flex-col items-end flex-shrink-0">
          <span
            className="font-nunito tabular-nums leading-none"
            style={{
              color: weeklyMet ? 'var(--done)' : 'var(--blue-deep)',
              fontWeight: 900,
              fontSize: 20,
            }}
          >
            {weeklyDone}<span style={{ color: 'var(--ink-faint)', fontSize: 14 }}>/{target}</span>
          </span>
          <span
            className="text-[9px] font-black tracking-widest uppercase mt-0.5"
            style={{ color: 'var(--ink-faint)' }}
          >
            this week
          </span>
        </div>
      </div>
    </motion.button>
  )
}
