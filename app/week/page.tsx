'use client'

import { useEffect, useState } from 'react'
import { INITIATIVES } from '@/lib/initiatives'
import { currentWeek, weekDays, todayISO } from '@/lib/date'

type WeekRecord = {
  date: string
  initiative: string
  completed: boolean
}

const DAY_LETTERS = ['M', 'T', 'W', 'T', 'F', 'S', 'S']

export default function WeekPage() {
  const week = currentWeek()
  const days = weekDays(week)
  const today = todayISO()
  const todayIdx = days.indexOf(today)
  const effectiveTodayIdx = todayIdx === -1 ? 6 : todayIdx

  const [records, setRecords] = useState<WeekRecord[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`/api/week?week=${week}`)
      .then(r => r.json())
      .then(d => { setRecords(d.records ?? []); setLoading(false) })
      .catch(() => setLoading(false))
  }, [week])

  const weeklyMax = INITIATIVES.reduce((s, i) => s + i.target, 0)
  const totalDone = INITIATIVES.reduce((s, ini) => {
    const done = records.filter(r => r.initiative === ini.id && r.completed).length
    return s + done
  }, 0)

  // Week label
  const monday = new Date(days[0] + 'T00:00:00')
  const sunday = new Date(days[6] + 'T00:00:00')
  const fmt = (x: Date) => x.toLocaleDateString('en-GB', { month: 'short', day: 'numeric' })
  const weekLabel = `Week of ${fmt(monday)} – ${fmt(sunday)}`

  // Day bars
  const dayBars = days.map((d, i) => {
    const cnt = records.filter(r => r.date === d && r.completed).length
    return {
      cnt,
      pct: (cnt / INITIATIVES.length) * 100,
      isToday: d === today,
      isPast: i < effectiveTodayIdx,
    }
  })

  return (
    <div className="px-4 pt-5">
      {/* Hero */}
      <div
        style={{
          background: 'var(--charcoal)',
          borderRadius: 18,
          padding: '22px 20px',
          color: 'var(--cream)',
          marginBottom: 18,
        }}
      >
        <p
          className="font-fraunces italic mb-1.5"
          style={{ fontSize: 12, fontWeight: 300, color: 'var(--sage-light)', letterSpacing: '0.04em' }}
        >
          {weekLabel}
        </p>
        <div className="flex items-end gap-2.5">
          <span
            className="font-fraunces"
            style={{ fontSize: 56, fontWeight: 800, lineHeight: 0.95, color: '#fff' }}
          >
            {loading ? '…' : totalDone}
          </span>
          <span style={{ fontSize: 12, color: 'var(--mid-grey)', paddingBottom: 8 }}>
            / {weeklyMax} weekly targets
          </span>
        </div>
        <div className="flex gap-1.5 mt-4 items-end" style={{ height: 64 }}>
          {dayBars.map((b, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-1.5">
              <div className="flex-1 w-full flex items-end">
                <div
                  className="w-full"
                  style={{
                    borderRadius: '4px 4px 0 0',
                    background: b.isToday ? 'var(--sage)' : b.isPast && b.cnt > 0 ? '#5A7A5C' : '#3A3A3A',
                    minHeight: 4,
                    height: Math.max(b.pct * 0.55, b.cnt > 0 ? 6 : 2),
                    transition: 'height 0.4s',
                  }}
                />
              </div>
              <span
                className="uppercase"
                style={{ fontSize: 9, fontWeight: 800, letterSpacing: '0.06em', color: 'var(--mid-grey)' }}
              >
                {DAY_LETTERS[i]}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Initiative breakdown */}
      <p
        className="font-fraunces uppercase mb-3"
        style={{ fontSize: 12, fontWeight: 600, color: 'var(--mid-grey)', letterSpacing: '0.12em' }}
      >
        Initiative progress
      </p>

      <div className="space-y-2.5 mb-5">
        {[...INITIATIVES]
          .sort((a, b) => (a.tier === 1 ? 0 : 1) - (b.tier === 1 ? 0 : 1))
          .map(ini => {
            const done = records.filter(r => r.initiative === ini.id && r.completed).length
            const pct = Math.min((done / ini.target) * 100, 100)
            const expected = ((effectiveTodayIdx + 1) / 7) * ini.target
            const behind = done < expected * 0.7

            return (
              <div
                key={ini.id}
                style={{
                  background: 'var(--warm-white)',
                  borderRadius: 14,
                  padding: '14px 16px',
                  boxShadow: '0 1px 4px rgba(0,0,0,0.05)',
                }}
              >
                <div className="flex items-center justify-between mb-2.5">
                  <div className="flex items-center gap-2">
                    <span style={{ fontSize: 18 }}>{ini.emoji}</span>
                    <span style={{ fontSize: 14, fontWeight: 700 }}>{ini.name}</span>
                  </div>
                  <span
                    className="font-fraunces"
                    style={{
                      fontSize: 14,
                      fontWeight: 600,
                      color: behind ? 'var(--accent-rose)' : 'var(--charcoal)',
                    }}
                  >
                    {done}/{ini.target}
                  </span>
                </div>

                {/* Day dots row */}
                <div className="flex gap-1.5 mb-2">
                  {days.map((d, i) => {
                    const isDone = records.some(r => r.initiative === ini.id && r.date === d && r.completed)
                    const isToday = d === today
                    let bg = 'var(--light-grey)'
                    let color = 'var(--mid-grey)'
                    let extra: React.CSSProperties = {}
                    if (isDone) { bg = 'var(--sage)'; color = '#fff' }
                    else if (isToday) {
                      bg = 'var(--sage-tint)'
                      color = 'var(--sage-dark)'
                      extra = { boxShadow: 'inset 0 0 0 2px var(--sage)' }
                    }
                    return (
                      <div
                        key={i}
                        className="flex-1 flex items-center justify-center"
                        style={{
                          height: 26,
                          borderRadius: 7,
                          fontSize: 9,
                          fontWeight: 800,
                          background: bg,
                          color,
                          ...extra,
                        }}
                      >
                        {DAY_LETTERS[i]}
                      </div>
                    )
                  })}
                </div>

                {/* Progress bar */}
                <div
                  className="overflow-hidden"
                  style={{ background: 'var(--light-grey)', borderRadius: 20, height: 6 }}
                >
                  <div
                    style={{
                      height: '100%',
                      borderRadius: 20,
                      width: `${pct}%`,
                      background: behind ? 'var(--accent-rose)' : 'var(--sage)',
                      transition: 'width 0.5s',
                    }}
                  />
                </div>
              </div>
            )
          })}
      </div>

      {/* Sunday review — always shown */}
      <div
        style={{
          background: 'linear-gradient(135deg, var(--sage-dark), var(--sage))',
          borderRadius: 16,
          padding: 18,
          color: '#fff',
          marginTop: 18,
        }}
      >
        <p className="font-fraunces italic mb-1.5" style={{ fontSize: 18, fontWeight: 600 }}>
          Sunday review
        </p>
        <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.85)', marginBottom: 12 }}>
          10 minutes. Open this on Sundays — that's the whole ritual.
        </p>
        {[
          'Which initiative slipped, and why?',
          "What's the ONE thing you'll move next week?",
          'Anything to remove from the list?',
        ].map((q, i) => (
          <p key={i} style={{ fontSize: 13, fontWeight: 700, margin: '10px 0 6px' }}>
            → {q}
          </p>
        ))}
      </div>
    </div>
  )
}
