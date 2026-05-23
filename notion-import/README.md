# Notion Database Import

## Quick Setup (CSV Import)

### 1. Import the CSV
1. Open Notion → create a new page
2. Type `/import` → select **CSV**
3. Upload `Momentum Log.csv` from this folder
4. Notion creates a new database with 5 sample rows

### 2. Fix column types (REQUIRED — CSV import makes everything Text)

Click each column header → **Edit property** → change type:

| Column | Change type to | Then configure |
|---|---|---|
| **Name** | Title | (usually auto-set as title) |
| **Date** | Date | — |
| **Initiative** | Select | Options: `gym` `linkedin` `apply` `automate` `blog` |
| **Completed** | Checkbox | Notion will convert "Yes"/"No" automatically |
| **Count** | Number | — |
| **Mood** | Select | Options: `🔥` `💪` `😐` `😴` `🌪️` |
| **Note** | Text (Rich text) | — |
| **Week** | Text (Rich text) | ⚠️ MUST be Rich text, not plain — the API depends on this |

### 3. Delete the 5 sample rows
They're just there to show Notion what data types to expect. Select all → delete.

### 4. Connect to your integration
1. Click **Share** (top right of the database page)
2. Click **Add connections** → search for your Momentum integration → select it
3. Now the API can read/write this database

### 5. Copy the database ID
From the URL: `https://notion.so/YOUR-DATABASE-ID?v=...`
- Copy the 32-character hex string before the `?`
- Paste it into `.env.local` as `NOTION_DATABASE_ID`

---

## Schema Reference

| Property | Type | Purpose |
|---|---|---|
| Name | Title | Auto-set to `YYYY-MM-DD · initiative_id` by the API |
| Date | Date | The day this check-in is for |
| Initiative | Select | One of: gym, linkedin, apply, automate, blog |
| Completed | Checkbox | True if hit the daily target |
| Count | Number | Total taps (target + bonus sessions) |
| Mood | Select | One of: 🔥 💪 😐 😴 🌪️ |
| Note | Rich text | Daily one-liner |
| Week | Rich text | ISO week e.g. "2026-W21" — for weekly rollup queries |

---

## After Setup

Verify with a test write from the app:
```bash
cd /Users/sangeetha/Documents/Projects/Momentum
npm run dev
```

Open http://localhost:3000, tap a card, hit Save. A new row should appear in your Notion database within seconds.

If the row doesn't appear:
- Check the integration is connected to the database (Share menu)
- Check `.env.local` has the right token + database ID
- Check the dev server console for `[checkin]` errors
