import { INITIATIVES } from '@/lib/initiatives'

// Map existing initiative IDs to the pivoted goal direction
const GOAL_MAP: Record<string, { goal: string; horizon: '2-yr' | '5-yr' }> = {
  gym:      { goal: 'Energy + discipline baseline',          horizon: '2-yr' },
  linkedin: { goal: 'Personal brand → strategy pivot',       horizon: '2-yr' },
  apply:    { goal: 'Qualification for strategy/org design', horizon: '5-yr' },
  automate: { goal: 'Skill + future revenue',                horizon: '5-yr' },
  blog:     { goal: 'Thought leadership · long-form proof',  horizon: '2-yr' },
}

const VISION_2YR = [
  { title: 'Visible personal brand in HR tech & org design', sub: 'LinkedIn presence + blog → recognised voice' },
  { title: 'Ship a working side product',                    sub: 'To-do app live, used by real people' },
  { title: 'Strength + energy baseline',                     sub: 'Gym ≥ 4×/week as a non-negotiable' },
]

const VISION_5YR = [
  { title: 'Pivot into strategy / org design',  sub: 'Leverage Workday background → consulting or senior strategy role' },
  { title: 'Independent revenue stream',         sub: 'Products + automations earning on the side' },
  { title: 'Be known, not just competent',       sub: 'Online and offline reputation in your niche' },
]

export default function GoalsPage() {
  const sorted = [...INITIATIVES].sort((a, b) => (a.tier === 1 ? 0 : 1) - (b.tier === 1 ? 0 : 1))

  return (
    <div className="px-4 pt-5">
      <p
        className="font-fraunces uppercase mb-3"
        style={{ fontSize: 12, fontWeight: 600, color: 'var(--mid-grey)', letterSpacing: '0.12em' }}
      >
        Why you're doing this
      </p>

      {/* 2-Year Vision */}
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
          🎯 2-Year Vision
        </p>
        {VISION_2YR.map((v, i) => (
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

      {/* 5-Year Vision */}
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
          🌟 5-Year Vision
        </p>
        {VISION_5YR.map((v, i) => (
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
