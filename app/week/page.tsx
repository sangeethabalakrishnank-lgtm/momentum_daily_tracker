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
  "What's the ONE thing that'll move the ₹70 LPA needle next week?",
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
    const maxForDay = INITIATIVES.length
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
        style={{ background: 'var(--ink)', color: 'white', border: '2.5px solid var(--ink)' }}
      >
        <p
          className="font-nunito text-[10px] uppercase tracking-widest mb-2"
          style={{ color: 'rgba(255,255,255,0.5)', fontWeight: 900 }}
        >
          {week}
        </p>
        <div className="flex items-baseline gap-2 mb-3">
          <span
            className="font-nunito leading-none"
            style={{ color: 'var(--orange)', fontWeight: 900, fontSize: 44 }}
          >
            {loading ? '…' : totalDone}
          </span>
          <span className="font-nunito text-sm" style={{ color: 'white', fontWeight: 800, opacity: 0.7 }}>
            / {weeklyTarget} targets
          </span>
        </div>
        <WeekChart days={dayBars} />
      </div>

      {/* Per-initiative rows */}
      <p
        className="font-nunito text-[10px] uppercase tracking-widest mb-3"
        style={{ color: 'var(--ink-faint)', fontWeight: 900 }}
      >
        Initiative breakdown
      </p>

      <div className="space-y-3 mb-5">
        {INITIATIVES.map(ini => {
          const done = records.filter(r => r.initiative === ini.id && r.completed).length
          const extra = Math.max(0, done - ini.target)
          const capped = Math.min(done, ini.target)
          const behind = todayIdx >= 0 && capped < Math.ceil(ini.target * ((todayIdx + 1) / 7))
          const metColor = capped >= ini.target ? 'var(--done)' : behind ? 'var(--orange-deep)' : 'var(--blue-deep)'

          return (
            <div
              key={ini.id}
              className="rounded-2xl px-4 py-3.5"
              style={{ background: 'var(--card)', border: '2.5px solid var(--line)' }}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-lg">{ini.emoji}</span>
                  <span className="font-nunito text-sm" style={{ color: 'var(--ink)', fontWeight: 900 }}>
                    {ini.name}
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span
                    className="font-nunito tabular-nums"
                    style={{ color: metColor, fontWeight: 900, fontSize: 16 }}
                  >
                    {capped}/{ini.target}
                  </span>
                  {extra > 0 && (
                    <span
                      className="text-[10px] px-2 py-0.5 rounded"
                      style={{ background: 'var(--orange)', color: 'white', fontWeight: 900 }}
                    >
                      +{extra}
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
                        background: hit ? 'var(--done)' : d === today ? 'var(--blue)' : 'var(--rule)',
                        border: d === today && !hit ? '1.5px solid var(--blue-deep)' : 'none',
                      }}
                    />
                  )
                })}
              </div>

              {/* Progress bar */}
              <div
                className="rounded-full overflow-hidden"
                style={{ height: 4, background: 'var(--rule)' }}
              >
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${Math.min(100, (capped / ini.target) * 100)}%`,
                    background: capped >= ini.target ? 'var(--done)' : behind ? 'var(--orange)' : 'var(--blue)',
                  }}
                />
              </div>
            </div>
          )
        })}
      </div>

      {/* Sunday review */}
      {isSunday && (
        <div
          className="rounded-2xl px-5 py-5 mb-6"
          style={{ background: 'var(--orange-soft)', border: '2.5px solid var(--orange)' }}
        >
          <p className="font-nunito text-sm mb-4" style={{ color: 'var(--ink)', fontWeight: 900 }}>
            Sunday Review 🪞
          </p>
          <div className="space-y-3">
            {SUNDAY_PROMPTS.map((q, i) => (
              <div key={i}>
                <p className="font-nunito text-xs mb-1.5" style={{ color: 'var(--ink-soft)', fontWeight: 700 }}>
                  {i + 1}. {q}
                </p>
                <textarea
                  rows={2}
                  className="w-full rounded-xl px-3 py-2 text-sm resize-none outline-none"
                  style={{
                    background: 'white',
                    border: '2px solid var(--line)',
                    color: 'var(--ink)',
                    fontWeight: 700,
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
