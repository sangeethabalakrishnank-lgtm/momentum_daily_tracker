'use client'

import { useState, useMemo, useEffect } from 'react'
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
  const [dirty, setDirty] = useState(false)
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState<string | null>(null)
  const [loaded, setLoaded] = useState(false)

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
      .finally(() => setLoaded(true))

    fetch('/api/streaks')
      .then(r => r.json())
      .then(({ streaks: s }) => { if (s) setStreaks(s) })
      .catch(() => {})
  }, [today, week])

  function fireToast(msg: string) {
    setToast(null)
    setTimeout(() => setToast(msg), 30)
  }

  function toggle(id: string) {
    setDoneToday(prev => ({ ...prev, [id]: !prev[id] }))
    setDirty(true)
  }

  function handleMood(m: Mood) {
    setMood(m)
    setDirty(true)
  }

  function handleNote(n: string) {
    setNote(n)
    setDirty(true)
  }

  async function save() {
    if (!dirty || saving) return
    setSaving(true)
    try {
      const results = await Promise.all(INITIATIVES.map(ini =>
        fetch('/api/checkin', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            date: today,
            initiative: ini.id,
            completed: doneToday[ini.id],
            count: doneToday[ini.id] ? 1 : 0,
            mood: mood ?? undefined,
            note: note || undefined,
          }),
        })
      ))
      const failed = results.filter(r => !r.ok)
      if (failed.length > 0) {
        const bodies = await Promise.all(failed.map(r => r.json().catch(() => ({}))))
        const firstCode = bodies[0]?.code ?? bodies[0]?.error ?? 'unknown'
        console.error('Some saves failed:', bodies)
        fireToast(`Save failed (${firstCode}) — ${failed.length}/${results.length}`)
        return
      }
      setDirty(false)
      fireToast("Saved! Keep going 🌱")
    } catch (err) {
      console.error('Save error:', err)
      fireToast('Save failed — check connection')
    } finally {
      setSaving(false)
    }
  }

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
            saving={false}
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

      {/* Fixed Save button */}
      <button
        onClick={save}
        disabled={!dirty || saving || !loaded}
        className="fixed left-1/2 z-[200] font-fraunces"
        style={{
          bottom: 16,
          transform: 'translateX(-50%)',
          width: 'calc(100% - 32px)',
          maxWidth: 448,
          background: dirty && !saving ? 'var(--sage)' : 'var(--sage-dark)',
          color: '#fff',
          border: 'none',
          borderRadius: 14,
          padding: 16,
          fontSize: 15,
          fontWeight: 600,
          letterSpacing: '0.02em',
          cursor: dirty && !saving ? 'pointer' : 'default',
          opacity: dirty || saving ? 1 : 0.55,
          boxShadow: '0 6px 18px rgba(78,107,80,0.35)',
          transition: 'all 0.2s',
        }}
      >
        {saving ? 'Saving…' : dirty ? "Save today's check-in ✓" : 'All saved'}
      </button>

      <Toast message={toast} />
    </div>
  )
}
