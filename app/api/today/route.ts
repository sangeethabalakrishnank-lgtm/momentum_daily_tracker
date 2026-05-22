import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'
import { getTodayRecords } from '@/lib/notion'
import { todayISO } from '@/lib/date'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const date = searchParams.get('date') ?? todayISO()
    const records = await getTodayRecords(date)
    return NextResponse.json({ records })
  } catch (err) {
    console.error('[today]', err)
    return NextResponse.json({ error: 'Failed to fetch' }, { status: 500 })
  }
}
