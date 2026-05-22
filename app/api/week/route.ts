import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'
import { getWeekRecords } from '@/lib/notion'
import { currentWeek } from '@/lib/date'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const week = searchParams.get('week') ?? currentWeek()
    const records = await getWeekRecords(week)
    return NextResponse.json({ records })
  } catch (err) {
    console.error('[week]', err)
    return NextResponse.json({ error: 'Failed to fetch' }, { status: 500 })
  }
}
