'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import Confetti from './Confetti'
import type { Initiative } from '@/lib/initiatives'

export type CardState = {
  taps: number      // how many times tapped total
  done: boolean     // reached target
  bonus: number     // taps beyond target
}

type Props = {
  initiative: Initiative
  streak: number
  state: CardState
  onChange: (s: CardState) => void
}

export default function InitiativeCard({ initiative, streak, state, onChange }: Props) {
  const { emoji, name, sub, target, tier } = initiative
  const { taps, done, bonus } = state
  const remaining = Math.max(0, target - taps)

  const [confettiBurst, setConfettiBurst] = useState(false)
  const [miniBurst, setMiniBurst] = useState(false)
  const [bounce, setBounce] = useState(false)

  function handleTap() {
    if (!done) {
      const newTaps = taps + 1
      const nowDone = newTaps >= target
      if (nowDone) {
        setConfettiBurst(true)
        setTimeout(() => setConfettiBurst(false), 50)
      } else {
        setBounce(true)
        setTimeout(() => setBounce(false), 50)
      }
      onChange({ taps: newTaps, done: nowDone, bonus })
    } else {
      // bonus tap
      setMiniBurst(true)
      setTimeout(() => setMiniBurst(false), 50)
      onChange({ taps, done, bonus: bonus + 1 })
    }
  }

  return (
    <motion.div
      layout
      layoutId={initiative.id}
      transition={{ layout: { type: 'spring', stiffness: 300, damping: 30 } }}
      className="relative rounded-2xl px-4 py-3.5 mb-3 cursor-pointer select-none active:scale-[0.98]"
      style={{
        background: done ? 'var(--mint)' : 'var(--cream)',
        border: `2px solid ${
          done ? '#A0D4B8' :
          tier === 1 ? 'var(--lilac-deep)' : 'var(--mist)'
        }`,
        opacity: done ? 0.85 : 1,
        transition: 'background 0.4s, border-color 0.3s, opacity 0.3s',
      }}
      onClick={handleTap}
    >
      <Confetti trigger={confettiBurst} />
      <Confetti trigger={miniBurst} mini />

      <div className="flex items-center gap-3">
        <span className="text-2xl leading-none">{emoji}</span>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <span className="font-nunito font-800 text-sm" style={{ color: 'var(--ink)' }}>
              {name}
            </span>
            {tier === 1 && (
              <span
                className="text-[9px] font-bold tracking-widest uppercase px-1.5 py-0.5 rounded-full"
                style={{ background: 'var(--lilac)', color: 'var(--lilac-deep)' }}
              >
                must-hit
              </span>
            )}
            {streak > 1 && (
              <span
                className="text-[9px] font-bold px-1.5 py-0.5 rounded-full"
                style={{ background: 'var(--butter)', color: '#A08040' }}
              >
                🔥 {streak}d
              </span>
            )}
          </div>
          <p className="font-nunito text-xs leading-tight" style={{ color: 'var(--ink-soft)' }}>
            {sub}
          </p>
        </div>

        <div className="flex flex-col items-end gap-1">
          {!done ? (
            <motion.span
              key={remaining}
              animate={bounce ? { y: [-4, 0], scale: [1.2, 1] } : {}}
              transition={{ duration: 0.25 }}
              className="font-nunito font-800 text-sm tabular-nums"
              style={{ color: 'var(--sky-deep)' }}
            >
              {remaining}× left
            </motion.span>
          ) : (
            <span className="font-nunito font-800 text-sm" style={{ color: '#2A7A52' }}>
              ✓ done
            </span>
          )}
          {bonus > 0 && (
            <span
              className="text-[10px] font-bold px-1.5 py-0.5 rounded-full"
              style={{ background: 'var(--butter)', color: '#A08040' }}
            >
              +{bonus} bonus
            </span>
          )}
        </div>
      </div>

      {/* Progress bar */}
      <div
        className="mt-2.5 rounded-full overflow-hidden"
        style={{ height: 3, background: 'var(--mist)' }}
      >
        <motion.div
          className="h-full rounded-full"
          style={{ background: done ? '#5AC48A' : 'var(--sky-deep)' }}
          initial={{ width: 0 }}
          animate={{ width: `${Math.min(100, ((taps) / target) * 100)}%` }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
        />
      </div>
    </motion.div>
  )
}
