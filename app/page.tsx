'use client'

import { useState, useMemo, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import CountdownBanner from '@/components/CountdownBanner'
import QuoteCard from '@/components/QuoteCard'
import InitiativeCard, { type CardState } from '@/components/InitiativeCard'
import MoodSelector, { type Mood } from '@/components/MoodSelector'
import { INITIATIVES, TIER1, TIER2 } from '@/lib/initiatives'

const initialState = (): Record<string, CardState> =>
  Object.fromEntries(INITIATIVES.map(i => [i.id, { taps: 0, done: false, bonus: 0 }]))

export default function TodayPage() {
  const [cards, setCards] = useState<Record<string, CardState>>(initialState)
  const [mood, setMood] = useState<Mood | null>(null)
  const [note, setNote] = useState('')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [streaks, setStreaks] = useState<Record<string, number>>({})

  // Load today's existing check-ins and streaks on mount
  useEffect(() => {
    fetch('/api/today')
      .then(r => r.json())
      .then(({ records }) => {
        if (!records?.length) return
        setCards(prev => {
          const next = { ...prev }
          for (const rec of records) {
            const ini = INITIATIVES.find(i => i.id === rec.initiative)
            if (!ini) continue
            const taps = Math.min(rec.count ?? 0, ini.target)
            const bonus = Math.max(0, (rec.count ?? 0) - ini.target)
            next[rec.initiative] = { taps, done: rec.completed, bonus }
          }
          return next
        })
        const firstWithMood = records.find((r: any) => r.mood)
        if (firstWithMood) setMood(firstWithMood.mood as Mood)
        const firstWithNote = records.find((r: any) => r.note)
        if (firstWithNote) setNote(firstWithNote.note)
        setSaved(true)
      })
      .catch(() => {})

    fetch('/api/streaks')
      .then(r => r.json())
      .then(({ streaks: s }) => { if (s) setStreaks(s) })
      .catch(() => {})
  }, [])

  function updateCard(id: string, s: CardState) {
    setCards(prev => ({ ...prev, [id]: s }))
    setSaved(false)
  }

  // sort: undone first, done at bottom
  const tier1Sorted = useMemo(
    () => [...TIER1].sort((a, b) => {
      const da = cards[a.id].done ? 1 : 0
      const db = cards[b.id].done ? 1 : 0
      return da - db
    }),
    [cards]
  )
  const tier2Sorted = useMemo(
    () => [...TIER2].sort((a, b) => {
      const da = cards[a.id].done ? 1 : 0
      const db = cards[b.id].done ? 1 : 0
      return da - db
    }),
    [cards]
  )

  async function handleSave() {
    setSaving(true)
    try {
      const today = new Date().toISOString().slice(0, 10)
      const promises = INITIATIVES.map(ini => {
        const s = cards[ini.id]
        return fetch('/api/checkin', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            date: today,
            initiative: ini.id,
            completed: s.done,
            count: s.taps + s.bonus,
            mood: mood ?? undefined,
            note: note || undefined,
          }),
        })
      })
      await Promise.all(promises)
      setSaved(true)
    } catch (err) {
      console.error(err)
    } finally {
      setSaving(false)
    }
  }

  const totalDone = INITIATIVES.filter(i => cards[i.id].done).length
  const tier1Done = TIER1.filter(i => cards[i.id].done).length

  return (
    <div className="px-4 pt-5">
      <CountdownBanner />
      <QuoteCard />

      {/* progress summary */}
      <div className="flex items-center gap-3 mb-4">
        <div
          className="flex-1 rounded-xl px-3 py-2 text-center"
          style={{ background: 'var(--cream)', border: '1px solid var(--mist)' }}
        >
          <p className="font-nunito font-800 text-lg leading-none" style={{ color: 'var(--sky-deep)' }}>
            {tier1Done}/{TIER1.length}
          </p>
          <p className="font-nunito text-[10px] font-bold mt-0.5" style={{ color: 'var(--ink-soft)' }}>
            must-hits
          </p>
        </div>
        <div
          className="flex-1 rounded-xl px-3 py-2 text-center"
          style={{ background: 'var(--cream)', border: '1px solid var(--mist)' }}
        >
          <p className="font-nunito font-800 text-lg leading-none" style={{ color: 'var(--sky-deep)' }}>
            {totalDone}/{INITIATIVES.length}
          </p>
          <p className="font-nunito text-[10px] font-bold mt-0.5" style={{ color: 'var(--ink-soft)' }}>
            total today
          </p>
        </div>
      </div>

      {/* Tier 1 */}
      <p className="font-nunito text-xs font-bold tracking-widest uppercase mb-2"
        style={{ color: 'var(--ink-soft)' }}>
        Must-Hit
      </p>
      <AnimatePresence>
        {tier1Sorted.map(ini => (
          <InitiativeCard
            key={ini.id}
            initiative={ini}
            streak={streaks[ini.id] ?? 0}
            state={cards[ini.id]}
            onChange={s => updateCard(ini.id, s)}
          />
        ))}
      </AnimatePresence>

      {/* Tier 2 */}
      <p className="font-nunito text-xs font-bold tracking-widest uppercase mb-2 mt-1"
        style={{ color: 'var(--ink-soft)' }}>
        Growth
      </p>
      <AnimatePresence>
        {tier2Sorted.map(ini => (
          <InitiativeCard
            key={ini.id}
            initiative={ini}
            streak={streaks[ini.id] ?? 0}
            state={cards[ini.id]}
            onChange={s => updateCard(ini.id, s)}
          />
        ))}
      </AnimatePresence>

      {/* Mood + Note */}
      <div
        className="rounded-2xl px-4 py-4 mb-4 space-y-4"
        style={{ background: 'var(--cream)', border: '1px solid var(--mist)' }}
      >
        <MoodSelector value={mood} onChange={setMood} />
        <div>
          <p className="font-nunito text-xs font-bold tracking-widest uppercase mb-2"
            style={{ color: 'var(--ink-soft)' }}>
            One-liner
          </p>
          <input
            type="text"
            value={note}
            onChange={e => { setNote(e.target.value); setSaved(false) }}
            placeholder="What happened today?"
            maxLength={200}
            className="w-full rounded-xl px-3 py-2.5 text-sm font-nunito outline-none"
            style={{
              background: 'var(--cream-warm)',
              border: '1.5px solid var(--mist)',
              color: 'var(--ink)',
            }}
          />
        </div>
      </div>

      {/* Save button */}
      <motion.button
        whileTap={{ scale: 0.97 }}
        onClick={handleSave}
        disabled={saving}
        className="w-full rounded-2xl py-4 font-nunito font-800 text-sm tracking-wide mb-6"
        style={{
          background: saved ? 'var(--mint)' : 'var(--sky-deep)',
          color: saved ? '#2A7A52' : 'white',
          opacity: saving ? 0.7 : 1,
          transition: 'background 0.3s',
        }}
      >
        {saving ? 'Saving…' : saved ? '✓ Saved to Notion' : 'Save to Notion'}
      </motion.button>
    </div>
  )
}
