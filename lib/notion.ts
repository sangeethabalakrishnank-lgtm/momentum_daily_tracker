import { Client } from '@notionhq/client'
import { isoWeek, toISODate } from './date'
import type { Initiative } from './initiatives'

const notion = new Client({ auth: process.env.NOTION_TOKEN })
const DB = process.env.NOTION_DATABASE_ID!

export type CheckinRecord = {
  id: string
  date: string
  initiative: string
  completed: boolean
  count: number
  mood?: string
  note?: string
  week: string
}

function rowToRecord(page: any): CheckinRecord {
  const p = page.properties
  return {
    id: page.id,
    date: p.Date?.date?.start ?? '',
    initiative: p.Initiative?.select?.name ?? '',
    completed: p.Completed?.checkbox ?? false,
    count: p.Count?.number ?? 0,
    mood: p.Mood?.select?.name,
    note: p.Note?.rich_text?.[0]?.plain_text,
    week: p.Week?.rich_text?.[0]?.plain_text ?? '',
  }
}

export async function getTodayRecords(date: string): Promise<CheckinRecord[]> {
  const res = await notion.databases.query({
    database_id: DB,
    filter: { property: 'Date', date: { equals: date } },
  })
  return res.results.map(rowToRecord)
}

export async function getWeekRecords(week: string): Promise<CheckinRecord[]> {
  const res = await notion.databases.query({
    database_id: DB,
    filter: { property: 'Week', rich_text: { equals: week } },
  })
  return res.results.map(rowToRecord)
}

export async function upsertCheckin(params: {
  date: string
  initiative: string
  completed: boolean
  count: number
  mood?: string
  note?: string
}): Promise<CheckinRecord> {
  const { date, initiative, completed, count, mood, note } = params
  const week = isoWeek(new Date(date))
  const name = `${date} · ${initiative}`

  // find existing
  const existing = await notion.databases.query({
    database_id: DB,
    filter: {
      and: [
        { property: 'Date', date: { equals: date } },
        { property: 'Initiative', select: { equals: initiative } },
      ],
    },
  })

  const props: Record<string, any> = {
    Name: { title: [{ text: { content: name } }] },
    Date: { date: { start: date } },
    Initiative: { select: { name: initiative } },
    Completed: { checkbox: completed },
    Count: { number: count },
    Week: { rich_text: [{ text: { content: week } }] },
  }

  if (mood) props.Mood = { select: { name: mood } }
  if (note !== undefined) props.Note = { rich_text: [{ text: { content: note } }] }

  if (existing.results.length > 0) {
    const page = await notion.pages.update({
      page_id: existing.results[0].id,
      properties: props,
    })
    return rowToRecord(page)
  }

  const page = await notion.pages.create({
    parent: { database_id: DB },
    properties: props,
  })
  return rowToRecord(page)
}

export async function getStreaks(initiatives: string[]): Promise<Record<string, number>> {
  // Fetch last 90 days to calculate streaks
  const cutoff = new Date()
  cutoff.setDate(cutoff.getDate() - 90)
  const res = await notion.databases.query({
    database_id: DB,
    filter: {
      and: [
        { property: 'Completed', checkbox: { equals: true } },
        { property: 'Date', date: { on_or_after: toISODate(cutoff) } },
      ],
    },
    sorts: [{ property: 'Date', direction: 'descending' }],
  })

  const records = res.results.map(rowToRecord)
  const streaks: Record<string, number> = {}

  for (const id of initiatives) {
    const filtered = records.filter(r => r.initiative === id)
    let streak = 0
    let cursor = new Date()
    cursor.setHours(0, 0, 0, 0)

    for (let i = 0; i < 90; i++) {
      const dateStr = toISODate(cursor)
      const found = filtered.some(r => r.date === dateStr)
      if (found) {
        streak++
        cursor.setDate(cursor.getDate() - 1)
      } else if (i === 0) {
        // today not done yet is OK, check yesterday
        cursor.setDate(cursor.getDate() - 1)
      } else {
        break
      }
    }
    streaks[id] = streak
  }

  return streaks
}
