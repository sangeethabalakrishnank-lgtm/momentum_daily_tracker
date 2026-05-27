import { NextRequest, NextResponse } from 'next/server'
import { upsertCheckin } from '@/lib/notion'

export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { date, initiative, completed, count, mood, note } = body

    if (!date || !initiative || completed === undefined || count === undefined) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const record = await upsertCheckin({ date, initiative, completed, count, mood, note })
    return NextResponse.json({ record })
  } catch (err: any) {
    const detail = err?.body ?? err?.message ?? String(err)
    const code = err?.code ?? 'unknown'
    console.error('[checkin] Notion error:', code, detail)
    return NextResponse.json({ error: 'Failed to save', code, detail }, { status: 500 })
  }
}
