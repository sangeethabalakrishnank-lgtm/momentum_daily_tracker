'use client'

import { useState, useMemo, useEffect, useRef } from 'react'
import { AnimatePresence } from 'framer-motion'
import InitiativeCard from '@/components/InitiativeCard'
import MoodSelector, { type Mood } from '@/components/MoodSelector'
import Toast from '@/components/Toast'
import { INITIATIVES } from '@/lib/initiatives'
import { todayISO, currentWeek } from '@/lib/date'

type WeekRec = { date: string; initiative: string; completed: boolean; mood?: string; note?: string }

export default function TodayPage() {
  const [doneToday, setDoneToday] = useState<Record<string, boolean>>(
    Object.fromEntries(INITIATIVES.map(i => [i.id, false]))
  )
  const [streaks, setStreaks] = useState<Record<string, number>>({})
  const [mood, setMood] = useState<Mood | null>(null)
  const [note, setNote] = useState('')
  const [saving, setSaving] = useState<Record<string, boolean>>({})
  const [toast, setToast] = useState<string | null>(null)
  const moodNoteTimer = useRef<NodeJS.Timeout | null>(null)

  const today = todayISO()
  const week = currentWeek()

  useEffect(() => {
    fetch(`/api/week?week=${week}`)
      .then(r => r.json())
      .then(({ records }: { records: WeekRec[] }) => {
        if (!records) return
        const dt: Record<string, boolean> = {}
        for (const ini of INITIATIVES) {
          dt[ini.id] = records.some(r => r.initiative === ini.id && r.date === today && r.completed)
        }
        setDoneToday(dt)
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

  function fireToast(msg: string) {
    setToast(null)
    setTimeout(() => setToast(msg), 30)
  }

  async function toggle(id: string) {
    const newDone = !doneToday[id]
    setDoneToday(prev => ({ ...prev, [id]: newDone }))
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
      if (newDone) fireToast('Logged! Keep going 🌱')
    } catch {
      setDoneToday(prev => ({ ...prev, [id]: !newDone }))
    } finally {
      setSaving(prev => ({ ...prev, [id]: false }))
    }
  }

  function scheduleMetaSave(nextMood: Mood | null, nextNote: string) {
    if (moodNoteTimer.current) clearTimeout(moodNoteTimer.current)
    moodNoteTimer.current = setTimeout(async () => {
      const completedToday = INITIATIVES.filter(i => doneToday[i.id])
      if (completedToday.length === 0) return
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
      fireToast('Saved ✓')
    }, 800)
  }

  function handleMood(m: Mood) { setMood(m); scheduleMetaSave(m, note) }
  function handleNote(n: string) { setNote(n); scheduleMetaSave(mood, n) }

  // Sort: priority not-done first, then non-priority not-done, then all done at bottom
  const sorted = useMemo(() => {
    return [...INITIATIVES].sort((a, b) => {
      const da = doneToday[a.id] ? 1 : 0
      const db = doneToday[b.id] ? 1 : 0
      if (da !== db) return da - db
      const pa = a.tier === 1 ? 0 : 1
      const pb = b.tier === 1 ? 0 : 1
      return pa - pb
    })
  }, [doneToday])

  return (
    <div className="px-4 pt-5">
      <p
        className="font-fraunces uppercase mb-3"
        style={{ fontSize: 12, fontWeight: 600, color: 'var(--mid-grey)', letterSpacing: '0.12em' }}
      >
        Tap to log — that's it
      </p>

      <AnimatePresence>
        {sorted.map(ini => (
          <InitiativeCard
            key={ini.id}
            initiative={ini}
            done={doneToday[ini.id]}
            streak={streaks[ini.id] ?? 0}
            saving={!!saving[ini.id]}
            onToggle={() => toggle(ini.id)}
          />
        ))}
      </AnimatePresence>

      <p
        className="font-fraunces uppercase mt-6 mb-3"
        style={{ fontSize: 12, fontWeight: 600, color: 'var(--mid-grey)', letterSpacing: '0.12em' }}
      >
        Context for future-you
      </p>

      <div
        className="mb-2.5"
        style={{
          background: 'var(--warm-white)',
          borderRadius: 14,
          padding: '14px 16px',
          boxShadow: '0 1px 4px rgba(0,0,0,0.05)',
        }}
      >
        <p
          className="uppercase mb-2.5"
          style={{ fontSize: 11, fontWeight: 800, color: 'var(--mid-grey)', letterSpacing: '0.08em' }}
        >
          Energy today
        </p>
        <MoodSelector value={mood} onChange={handleMood} />
      </div>

      <div
        style={{
          background: 'var(--warm-white)',
          borderRadius: 14,
          padding: '14px 16px',
          boxShadow: '0 1px 4px rgba(0,0,0,0.05)',
        }}
      >
        <p
          className="uppercase mb-2.5"
          style={{ fontSize: 11, fontWeight: 800, color: 'var(--mid-grey)', letterSpacing: '0.08em' }}
        >
          One line — what did you actually move?
        </p>
        <textarea
          value={note}
          onChange={e => handleNote(e.target.value)}
          rows={2}
          placeholder="e.g. Drafted LinkedIn post #2, gym done, 30 min on blog outline…"
          maxLength={300}
          className="w-full outline-none resize-none"
          style={{
            background: 'var(--light-grey)',
            borderRadius: 10,
            padding: '10px 12px',
            fontSize: 13,
            color: 'var(--charcoal)',
            border: 'none',
            fontFamily: 'Nunito, sans-serif',
          }}
        />
      </div>

      <Toast message={toast} />
    </div>
  )
}
