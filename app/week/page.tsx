'use client'

import { useEffect, useState } from 'react'
import WeekChart from '@/components/WeekChart'
import { INITIATIVES } from '@/lib/initiatives'
import { currentWeek, weekDays, todayISO } from '@/lib/date'

type WeekRecord = {
  date: string
  initiative: string
  completed: boolean
  count: number
}

const DAY_LABELS = ['M', 'T', 'W', 'T', 'F', 'S', 'S']

const SUNDAY_PROMPTS = [
  'Which Tier 1 initiative slipped this week, and why?',
  'What\'s the ONE thing that\'ll move the ₹70 LPA needle next week?',
  'Anything to remove from the list?',
]

export default function WeekPage() {
  const week = currentWeek()
  const days = weekDays(week)
  const today = todayISO()
  const todayIdx = days.indexOf(today)
  const isSunday = new Date().getDay() === 0

  const [records, setRecords] = useState<WeekRecord[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`/api/week?week=${week}`)
      .then(r => r.json())
      .then(d => { setRecords(d.records ?? []); setLoading(false) })
      .catch(() => setLoading(false))
  }, [week])

  const weeklyTarget = INITIATIVES.reduce((s, i) => s + i.target, 0)
  const totalDone = INITIATIVES.reduce((s, ini) => {
    const rec = records.filter(r => r.initiative === ini.id && r.completed)
    return s + Math.min(rec.length, ini.target)
  }, 0)

  const dayBars = days.map((d, i) => {
    const dayRecs = records.filter(r => r.date === d && r.completed)
    const maxForDay = INITIATIVES.reduce((s, ini) => s + ini.target, 0)
    return {
      label: DAY_LABELS[i],
      pct: maxForDay ? (dayRecs.length / maxForDay) * 100 : 0,
      isToday: d === today,
    }
  })

  return (
    <div className="px-4 pt-5">
      {/* Hero */}
      <div
        className="rounded-2xl px-5 py-5 mb-5"
        style={{ background: 'var(--ink)', color: 'white' }}
      >
        <p className="font-nunito text-xs tracking-widest uppercase opacity-60 mb-1">{week}</p>
        <div className="flex items-baseline gap-2 mb-1">
          <span className="font-nunito font-800 text-4xl" style={{ color: 'var(--sky)' }}>
            {loading ? '…' : totalDone}
          </span>
          <span className="font-nunito text-base opacity-70">/ {weeklyTarget} targets</span>
        </div>
        <div className="mt-3">
          <WeekChart days={dayBars} />
        </div>
      </div>

      {/* Per-initiative rows */}
      <p className="font-nunito text-xs font-bold tracking-widest uppercase mb-3"
        style={{ color: 'var(--ink-soft)' }}>
        Initiative breakdown
      </p>

      <div className="space-y-3 mb-5">
        {INITIATIVES.map(ini => {
          const done = records.filter(r => r.initiative === ini.id && r.completed).length
          const extra = Math.max(0, done - ini.target)
          const capped = Math.min(done, ini.target)
          const behind = todayIdx >= 0 && capped < Math.ceil(ini.target * ((todayIdx + 1) / 7))

          return (
            <div
              key={ini.id}
              className="rounded-2xl px-4 py-3.5"
              style={{ background: 'var(--cream)', border: '1px solid var(--mist)' }}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-lg">{ini.emoji}</span>
                  <span className="font-nunito font-800 text-sm" style={{ color: 'var(--ink)' }}>
                    {ini.name}
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span
                    className="font-nunito font-800 text-sm"
                    style={{ color: capped >= ini.target ? '#2A7A52' : behind ? '#C05840' : 'var(--sky-deep)' }}
                  >
                    {capped}/{ini.target}
                  </span>
                  {extra > 0 && (
                    <span
                      className="text-[10px] font-bold px-1.5 py-0.5 rounded-full"
                      style={{ background: 'var(--butter)', color: '#A08040' }}
                    >
                      +{extra} bonus
                    </span>
                  )}
                </div>
              </div>

              {/* Day dots */}
              <div className="flex gap-1.5 mb-2">
                {days.map((d, i) => {
                  const hit = records.some(r => r.initiative === ini.id && r.date === d && r.completed)
                  return (
                    <div
                      key={i}
                      className="flex-1 rounded-full"
                      style={{
                        height: 6,
                        background: hit ? '#5AC48A' : d === today ? 'var(--sky)' : 'var(--mist)',
                        border: d === today ? '1.5px solid var(--sky-deep)' : 'none',
                      }}
                    />
                  )
                })}
              </div>

              {/* Progress bar */}
              <div
                className="rounded-full overflow-hidden"
                style={{ height: 4, background: 'var(--mist)' }}
              >
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${Math.min(100, (capped / ini.target) * 100)}%`,
                    background: capped >= ini.target ? '#5AC48A' : behind ? 'var(--peach)' : 'var(--sky-deep)',
                  }}
                />
              </div>
            </div>
          )
        })}
      </div>

      {/* Sunday review card */}
      {isSunday && (
        <div
          className="rounded-2xl px-5 py-5 mb-6"
          style={{
            background: 'var(--lilac)',
            border: '2px solid var(--lilac-deep)',
          }}
        >
          <p className="font-nunito font-800 text-sm mb-4" style={{ color: 'var(--ink)' }}>
            Sunday Review 🪞
          </p>
          <div className="space-y-3">
            {SUNDAY_PROMPTS.map((q, i) => (
              <div key={i}>
                <p className="font-nunito text-xs mb-1.5" style={{ color: 'var(--ink-soft)' }}>
                  {i + 1}. {q}
                </p>
                <textarea
                  rows={2}
                  className="w-full rounded-xl px-3 py-2 text-sm font-nunito resize-none outline-none"
                  style={{
                    background: 'white',
                    border: '1px solid var(--mist)',
                    color: 'var(--ink)',
                  }}
                  placeholder="Reflect…"
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
