export type Initiative = {
  id: string
  emoji: string
  name: string
  sub: string
  target: number
  tier: 1 | 2
}

export const INITIATIVES: Initiative[] = [
  { id: 'gym',      emoji: '🏋️', name: 'Gym',                  sub: 'baseline · energy compounds',           target: 4, tier: 1 },
  { id: 'linkedin', emoji: '✍️', name: 'LinkedIn post',        sub: 'AI-PM case studies · recruiter magnet', target: 3, tier: 1 },
  { id: 'apply',    emoji: '🎯', name: 'Job search action',    sub: 'apply / recruiter msg / interview prep', target: 5, tier: 1 },
  { id: 'automate', emoji: '🤖', name: 'Automations (AI lab)', sub: 'learn 1 AI technique per session',      target: 3, tier: 1 },
  { id: 'blog',     emoji: '📝', name: 'Blog → LinkedIn',      sub: 'long-form, repurpose to LinkedIn',      target: 1, tier: 2 },
]

export const TIER1 = INITIATIVES.filter(i => i.tier === 1)
export const TIER2 = INITIATIVES.filter(i => i.tier === 2)
