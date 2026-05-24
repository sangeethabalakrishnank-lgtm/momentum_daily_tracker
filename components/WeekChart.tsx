'use client'

import { motion } from 'framer-motion'

type DayBar = {
  label: string   // 'M', 'T' etc.
  pct: number     // 0-100
  isToday: boolean
}

export default function WeekChart({ days }: { days: DayBar[] }) {
  return (
    <div className="flex items-end gap-1.5 h-16">
      {days.map((d, i) => (
        <div key={i} className="flex-1 flex flex-col items-center gap-1">
          <motion.div
            className="w-full rounded-t"
            style={{
              background: d.pct >= 100 ? 'var(--orange)' :
                          d.pct > 0    ? 'var(--blue)' : 'rgba(255,255,255,0.15)',
              border: d.isToday ? '2px solid white' : 'none',
              minHeight: 4,
            }}
            initial={{ height: 0 }}
            animate={{ height: `${Math.max(4, d.pct * 0.48)}px` }}
            transition={{ duration: 0.5, delay: i * 0.05, ease: 'easeOut' }}
          />
          <span
            className="font-nunito text-[10px]"
            style={{ color: d.isToday ? 'var(--orange)' : 'rgba(255,255,255,0.6)', fontWeight: 900 }}
          >
            {d.label}
          </span>
        </div>
      ))}
    </div>
  )
}
