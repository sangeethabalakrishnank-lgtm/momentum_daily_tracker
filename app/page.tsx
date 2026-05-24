'use client'

import { useState, useMemo, useEffect, useRef } from 'react'
import { AnimatePresence } from 'framer-motion'
import CountdownBanner from '@/components/CountdownBanner'
import QuoteCard from '@/components/QuoteCard'
import InitiativeCard from '@/components/InitiativeCard'
import MoodSelector, { type Mood } from '@/components/MoodSelector'
import { INITIATIVES } from '@/lib/initiatives'
import { todayISO, currentWeek } from '@/lib/date'

type WeekRec = { date: string; initiative: string; completed: boolean; mood?: string; note?: string }

export default function TodayPage() {
  const [doneToday, setDoneToday] = useState<Record<string, boolean>>(
    Object.fromEntries(INITIATIVES.map(i => [i.id, false]))
  )
  const [weeklyDone, setWeeklyDone] = useState<Record<string, number>>(
    Object.fromEntries(INITIATIVES.map(i => [i.id, 0]))
  )
  const [streaks, setStreaks] = useState<Record<string, number>>({})
  const [mood, setMood] = useState<Mood | null>(null)
  const [note, setNote] = useState('')
  const [saving, setSaving] = useState<Record<string, boolean>>({})
  const [lastSaved, setLastSaved] = useState<Date | null>(null)
  const moodNoteTimer = useRef<NodeJS.Timeout | null>(null)

  const today = todayISO()
  const week = currentWeek()

  // Hydrate from Notion on mount
  useEffect(() => {
    fetch(`/api/week?week=${week}`)
      .then(r => r.json())
      .then(({ records }: { records: WeekRec[] }) => {
        if (!records) return
        // Today's completed → doneToday
        const dt: Record<string, boolean> = {}
        const wk: Record<string, number> = {}
        for (const ini of INITIATIVES) {
          dt[ini.id] = records.some(r => r.initiative === ini.id && r.date === today && r.completed)
          wk[ini.id] = records.filter(r => r.initiative === ini.id && r.completed).length
        }
        setDoneToday(dt)
        setWeeklyDone(wk)
        // Mood + note from today's most recent record
        const todays = records.filter(r => r.date === today)
        const m = todays.find(r => r.mood)?.mood
        const n = todays.find(r => r.note)?.note
        if (m) setMood(m as Mood)
        if (n) setNote(n)
      })
      .catch(() => {})

    fetch('/api/streaks')
      .then(r => r.json())
      .then(({ streaks: s }) => { if (s) setStreaks(s) })
      .catch(() => {})
  }, [today, week])

  // Auto-save a single initiative on toggle
  async function toggle(id: string) {
    const newDone = !doneToday[id]
    setDoneToday(prev => ({ ...prev, [id]: newDone }))
    setWeeklyDone(prev => ({ ...prev, [id]: prev[id] + (newDone ? 1 : -1) }))
    setSaving(prev => ({ ...prev, [id]: true }))
    try {
      await fetch('/api/checkin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          date: today,
          initiative: id,
          completed: newDone,
          count: newDone ? 1 : 0,
          mood: mood ?? undefined,
          note: note || undefined,
        }),
      })
      setLastSaved(new Date())
    } catch (e) {
      // revert on failure
      setDoneToday(prev => ({ ...prev, [id]: !newDone }))
      setWeeklyDone(prev => ({ ...prev, [id]: prev[id] - (newDone ? 1 : -1) }))
    } finally {
      setSaving(prev => ({ ...prev, [id]: false }))
    }
  }

  // Auto-save mood/note (debounced, only for already-done initiatives — so today's row gets the metadata)
  function scheduleMetaSave(nextMood: Mood | null, nextNote: string) {
    if (moodNoteTimer.current) clearTimeout(moodNoteTimer.current)
    moodNoteTimer.current = setTimeout(async () => {
      const completedToday = INITIATIVES.filter(i => doneToday[i.id])
      if (completedToday.length === 0) return // nothing to attach to
      await Promise.all(completedToday.map(ini =>
        fetch('/api/checkin', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            date: today,
            initiative: ini.id,
            completed: true,
            count: 1,
            mood: nextMood ?? undefined,
            note: nextNote || undefined,
          }),
        })
      ))
      setLastSaved(new Date())
    }, 800)
  }

  function handleMood(m: Mood) {
    setMood(m)
    scheduleMetaSave(m, note)
  }

  function handleNote(n: string) {
    setNote(n)
    scheduleMetaSave(mood, n)
  }

  // Sort: not-done first (in defined order), done at bottom
  const sorted = useMemo(
    () => [...INITIATIVES].sort((a, b) => Number(doneToday[a.id]) - Number(doneToday[b.id])),
    [doneToday]
  )

  const doneCount = Object.values(doneToday).filter(Boolean).length
  const lastSavedStr = lastSaved
    ? `Saved ${lastSaved.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}`
    : 'Auto-saves on tap'

  return (
    <div className="px-4 pt-5">
      <CountdownBanner />
      <QuoteCard />

      {/* Header: today summary + autosave status */}
      <div className="flex items-end justify-between mb-3">
        <div>
          <p
            className="font-nunito text-[11px] uppercase tracking-widest"
            style={{ color: 'var(--ink-faint)', fontWeight: 900 }}
          >
            Today's checklist
          </p>
          <p className="font-nunito leading-none mt-1" style={{ color: 'var(--ink)', fontWeight: 900, fontSize: 28 }}>
            {doneCount}<span style={{ color: 'var(--ink-faint)', fontSize: 18 }}>/{INITIATIVES.length}</span>
          </p>
        </div>
        <p
          className="font-nunito text-[10px] uppercase tracking-widest"
          style={{ color: 'var(--ink-faint)', fontWeight: 800 }}
        >
          {lastSavedStr}
        </p>
      </div>

      {/* Flat checklist — auto-saves on tap, no Save button */}
      <AnimatePresence>
        {sorted.map(ini => (
          <InitiativeCard
            key={ini.id}
            initiative={ini}
            done={doneToday[ini.id]}
            weeklyDone={weeklyDone[ini.id]}
            streak={streaks[ini.id] ?? 0}
            saving={!!saving[ini.id]}
            onToggle={() => toggle(ini.id)}
          />
        ))}
      </AnimatePresence>

      {/* Mood + Note (auto-save with 800ms debounce, attaches to today's completed rows) */}
      <div
        className="rounded-2xl px-4 py-4 mb-6 mt-2 space-y-4"
        style={{ background: 'var(--card)', border: '2.5px solid var(--line)' }}
      >
        <MoodSelector value={mood} onChange={handleMood} />
        <div>
          <p
            className="font-nunito text-[10px] uppercase tracking-widest mb-2"
            style={{ color: 'var(--ink-soft)', fontWeight: 900 }}
          >
            One-liner
          </p>
          <input
            type="text"
            value={note}
            onChange={e => handleNote(e.target.value)}
            placeholder="What happened today?"
            maxLength={200}
            className="w-full rounded-xl px-3 py-2.5 text-sm outline-none"
            style={{
              background: 'var(--bg)',
              border: '2px solid var(--line)',
              color: 'var(--ink)',
              fontWeight: 700,
            }}
          />
        </div>
        {doneCount === 0 && (mood || note) && (
          <p className="text-[11px]" style={{ color: 'var(--ink-faint)', fontWeight: 700 }}>
            Mood & note save once you complete at least one item today.
          </p>
        )}
      </div>
    </div>
  )
}
