import { INITIATIVES } from '@/lib/initiatives'

const GOAL_MAP: Record<string, { goal: string; horizon: '12-mo' | '2-yr' | '7-yr' }> = {
  gym:      { goal: 'Strength + energy baseline · stamina for the grind', horizon: '12-mo' },
  linkedin: { goal: 'AI-PM brand · recruiter magnet',                     horizon: '12-mo' },
  apply:    { goal: 'Land Senior PM role · ₹70 LPA',                      horizon: '12-mo' },
  automate: { goal: 'AI/automation moat · recognised AI-PM voice',        horizon: '2-yr' },
  blog:     { goal: 'Recognised AI-PM voice · long-form proof',           horizon: '2-yr' },
}

const VISION_12MO = [
  { title: 'Land Senior PM at AI-forward B2B SaaS', sub: '₹70 LPA total comp · the hard deadline' },
  { title: 'Build an AI/automation moat',           sub: 'Hands-on AI lab → portfolio of shipped automations' },
  { title: 'Strength + energy baseline',            sub: 'Gym ≥ 4×/week as a non-negotiable' },
]

const VISION_7YR = [
  { title: 'Product Head role',                  sub: 'Leading PMs, shaping org strategy' },
  { title: 'Recognised AI-PM voice',             sub: 'Writing, speaking, building in public' },
  { title: 'Optional side income',               sub: 'Consulting, content, or product bets' },
]

export default function GoalsPage() {
  const sorted = [...INITIATIVES].sort((a, b) => (a.tier === 1 ? 0 : 1) - (b.tier === 1 ? 0 : 1))

  return (
    <div className="px-4 pt-5">
      {/* Why hero — ₹70 LPA pinned */}
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
          className="font-fraunces italic mb-1.5 uppercase"
          style={{ fontSize: 11, fontWeight: 300, color: 'var(--sage-light)', letterSpacing: '0.12em' }}
        >
          12-month target
        </p>
        <p
          className="font-fraunces leading-none mb-1.5"
          style={{ fontSize: 36, fontWeight: 800, color: '#fff' }}
        >
          ₹70 LPA
        </p>
        <p style={{ fontSize: 13, fontWeight: 700, color: 'var(--cream)' }}>
          Senior PM · AI-forward B2B SaaS
        </p>
        <div
          style={{
            marginTop: 12,
            background: 'rgba(168,197,170,0.15)',
            borderRadius: 10,
            padding: '8px 12px',
            fontSize: 11,
            color: 'var(--sage-light)',
            fontWeight: 700,
            lineHeight: 1.5,
          }}
        >
          🗓 Runway closes ~May 2027 · baby planning in ~12 months · hard deadline.
        </div>
      </div>

      <p
        className="font-fraunces uppercase mb-3"
        style={{ fontSize: 12, fontWeight: 600, color: 'var(--mid-grey)', letterSpacing: '0.12em' }}
      >
        Why you're doing this
      </p>

      {/* 12-month vision */}
      <div
        style={{
          background: 'var(--warm-white)',
          borderRadius: 14,
          padding: 16,
          marginBottom: 12,
          boxShadow: '0 1px 4px rgba(0,0,0,0.05)',
        }}
      >
        <p
          className="font-fraunces italic uppercase mb-3"
          style={{ fontSize: 11, fontWeight: 600, color: 'var(--sage-dark)', letterSpacing: '0.12em' }}
        >
          🎯 12-Month Plan
        </p>
        {VISION_12MO.map((v, i) => (
          <div key={i} className="flex items-start gap-2.5 mb-2.5 last:mb-0">
            <div
              style={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                background: 'var(--sage)',
                marginTop: 5,
                flexShrink: 0,
              }}
            />
            <div>
              <div style={{ fontSize: 13, fontWeight: 700 }}>{v.title}</div>
              <div style={{ fontSize: 11, color: 'var(--mid-grey)', marginTop: 2, lineHeight: 1.4 }}>{v.sub}</div>
            </div>
          </div>
        ))}
      </div>

      {/* 7-year vision */}
      <div
        style={{
          background: 'var(--warm-white)',
          borderRadius: 14,
          padding: 16,
          marginBottom: 12,
          boxShadow: '0 1px 4px rgba(0,0,0,0.05)',
        }}
      >
        <p
          className="font-fraunces italic uppercase mb-3"
          style={{ fontSize: 11, fontWeight: 600, color: 'var(--sage-dark)', letterSpacing: '0.12em' }}
        >
          🌟 7-Year Vision
        </p>
        {VISION_7YR.map((v, i) => (
          <div key={i} className="flex items-start gap-2.5 mb-2.5 last:mb-0">
            <div
              style={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                background: 'var(--accent-gold)',
                marginTop: 5,
                flexShrink: 0,
              }}
            />
            <div>
              <div style={{ fontSize: 13, fontWeight: 700 }}>{v.title}</div>
              <div style={{ fontSize: 11, color: 'var(--mid-grey)', marginTop: 2, lineHeight: 1.4 }}>{v.sub}</div>
            </div>
          </div>
        ))}
      </div>

      <p
        className="font-fraunces uppercase mt-5 mb-3"
        style={{ fontSize: 12, fontWeight: 600, color: 'var(--mid-grey)', letterSpacing: '0.12em' }}
      >
        Initiative → Goal map (priority order)
      </p>

      <div className="space-y-2">
        {sorted.map(ini => {
          const m = GOAL_MAP[ini.id]
          const priority = ini.tier === 1
          return (
            <div
              key={ini.id}
              style={{
                background: 'var(--warm-white)',
                borderRadius: 12,
                padding: '12px 14px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
              }}
            >
              <div className="flex items-center gap-2 mb-1">
                <span style={{ fontSize: 18 }}>{ini.emoji}</span>
                <span style={{ fontSize: 13, fontWeight: 700 }}>{ini.name}</span>
                <span
                  className="ml-auto uppercase"
                  style={{
                    fontSize: 9,
                    fontWeight: 800,
                    color: priority ? 'var(--accent-gold)' : 'var(--sage-dark)',
                    background: priority ? 'var(--gold-tint)' : 'var(--sage-tint)',
                    borderRadius: 20,
                    padding: '3px 8px',
                    letterSpacing: '0.06em',
                  }}
                >
                  {priority ? `MUST · ${m?.horizon ?? ''}` : m?.horizon ?? ''}
                </span>
              </div>
              <div style={{ fontSize: 11, color: 'var(--mid-grey)' }}>
                {m?.goal ?? ini.sub}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
