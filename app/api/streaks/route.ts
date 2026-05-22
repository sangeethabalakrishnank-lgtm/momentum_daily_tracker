import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'
import { getStreaks } from '@/lib/notion'
import { INITIATIVES } from '@/lib/initiatives'

export async function GET() {
  try {
    const ids = INITIATIVES.map(i => i.id)
    const streaks = await getStreaks(ids)
    return NextResponse.json({ streaks })
  } catch (err) {
    console.error('[streaks]', err)
    return NextResponse.json({ error: 'Failed to fetch' }, { status: 500 })
  }
}
