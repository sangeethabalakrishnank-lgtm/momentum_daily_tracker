import { INITIATIVES } from '@/lib/initiatives'

const GOAL_MAP: Record<string, string[]> = {
  gym:      ['strength + energy baseline', 'stamina for the grind'],
  linkedin: ['land Senior PM role', 'build AI/automation moat', 'recruiter visibility'],
  apply:    ['land Senior PM role', '₹70 LPA target comp'],
  automate: ['build AI/automation moat', 'recognised AI-PM voice'],
  blog:     ['recognised AI-PM voice', 'optional side income foundation'],
}

export default function GoalsPage() {
  return (
    <div className="px-4 pt-5 space-y-4">
      {/* Hero */}
      <div
        className="rounded-2xl px-5 py-5"
        style={{ background: 'var(--ink)', color: 'white', border: '2.5px solid var(--ink)' }}
      >
        <p className="font-nunito text-[10px] uppercase tracking-widest mb-2"
          style={{ color: 'rgba(255,255,255,0.5)', fontWeight: 900 }}>
          12-month target
        </p>
        <p className="font-nunito leading-tight mb-1"
          style={{ color: 'var(--orange)', fontWeight: 900, fontSize: 32 }}>
          ₹70 LPA
        </p>
        <p className="font-nunito text-base" style={{ color: 'white', fontWeight: 800 }}>
          Senior PM · AI-forward B2B SaaS
        </p>
        <div
          className="mt-3 rounded-xl px-3 py-2 text-xs"
          style={{ background: 'rgba(255,106,31,0.15)', color: 'var(--orange-soft)', fontWeight: 700 }}
        >
          🗓 Runway closes ~May 2027 · Baby planning in ~12 months · Hard deadline.
        </div>
      </div>

      {/* 2-year plan */}
      <div
        className="rounded-2xl px-5 py-4"
        style={{ background: 'var(--card)', border: '2.5px solid var(--line)' }}
      >
        <p className="font-nunito text-[10px] uppercase tracking-widest mb-3"
          style={{ color: 'var(--ink-faint)', fontWeight: 900 }}>
          2-year plan
        </p>
        {[
          'Land Senior PM role at an AI-forward B2B SaaS company',
          'Build an AI/automation moat that compounds over time',
          'Establish strength + energy baseline to sustain the grind',
        ].map((b, i) => (
          <div key={i} className="flex gap-2.5 mb-2 last:mb-0">
            <span style={{ color: 'var(--orange)', fontWeight: 900 }} className="mt-0.5">▸</span>
            <p className="font-nunito text-sm" style={{ color: 'var(--ink)', fontWeight: 700 }}>{b}</p>
          </div>
        ))}
      </div>

      {/* 7-year plan */}
      <div
        className="rounded-2xl px-5 py-4"
        style={{ background: 'var(--blue-soft)', border: '2.5px solid var(--blue)' }}
      >
        <p className="font-nunito text-[10px] uppercase tracking-widest mb-3"
          style={{ color: 'var(--blue-deep)', fontWeight: 900 }}>
          7-year vision
        </p>
        {[
          'Product Head role — leading PMs, shaping org strategy',
          'Recognised AI-PM voice — writing, speaking, building in public',
          'Optional side income — consulting, content, or product bets',
        ].map((b, i) => (
          <div key={i} className="flex gap-2.5 mb-2 last:mb-0">
            <span style={{ color: 'var(--blue)', fontWeight: 900 }} className="mt-0.5">▸</span>
            <p className="font-nunito text-sm" style={{ color: 'var(--ink)', fontWeight: 700 }}>{b}</p>
          </div>
        ))}
      </div>

      {/* Initiative → Goal map */}
      <div>
        <p className="font-nunito text-[10px] uppercase tracking-widest mb-3"
          style={{ color: 'var(--ink-faint)', fontWeight: 900 }}>
          How each habit connects
        </p>
        <div className="space-y-2.5">
          {INITIATIVES.map(ini => (
            <div
              key={ini.id}
              className="rounded-2xl px-4 py-3.5"
              style={{ background: 'var(--card)', border: '2.5px solid var(--line)' }}
            >
              <div className="flex items-center gap-2 mb-1.5">
                <span className="text-lg">{ini.emoji}</span>
                <span className="font-nunito text-sm" style={{ color: 'var(--ink)', fontWeight: 900 }}>
                  {ini.name}
                </span>
                <span className="font-nunito text-xs" style={{ color: 'var(--ink-faint)', fontWeight: 700 }}>
                  {ini.target}×/wk
                </span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {(GOAL_MAP[ini.id] ?? []).map(g => (
                  <span
                    key={g}
                    className="text-[11px] px-2.5 py-1 rounded"
                    style={{ background: 'var(--orange)', color: 'white', fontWeight: 900 }}
                  >
                    {g}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="h-4" />
    </div>
  )
}
