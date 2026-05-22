# Momentum

Mobile-first daily habit tracker. Writes to Notion. Installable as a PWA.

**Stack:** Next.js 14 · Tailwind CSS · Framer Motion · Notion API · Vercel

---

## Notion Setup

### 1. Create a Notion Integration

1. Go to [notion.so/profile/integrations](https://www.notion.so/profile/integrations)
2. Click **New integration**
3. Name it `Momentum`, choose your workspace, leave Content Capabilities as Read/Update/Insert
4. Copy the **Internal Integration Token** (`secret_...`)

### 2. Create the Database

Create a new **full-page database** in Notion called `Momentum Log` with these properties:

| Property | Type | Notes |
|---|---|---|
| Name | Title | Auto-set to `YYYY-MM-DD · initiative_id` |
| Date | Date | The day this check-in is for |
| Initiative | Select | Options: `gym`, `linkedin`, `apply`, `automate`, `blog` |
| Completed | Checkbox | |
| Count | Number | Sessions logged that day |
| Mood | Select | Options: `🔥` `💪` `😐` `😴` `🌪️` |
| Note | Rich text | Daily one-liner |
| Week | Text | ISO week string e.g. `2026-W21` |

### 3. Share the Database with the Integration

Open the database → click **Share** (top right) → **Add connections** → select your `Momentum` integration.

### 4. Copy the Database ID

The database URL looks like:
```
https://www.notion.so/Your-Title-<DATABASE_ID>?v=...
```
Copy the 32-character ID (letters and numbers before the `?`).

### 5. Set Environment Variables

**For local dev** — create `.env.local` (never commit this):
```bash
cp .env.local.example .env.local
# then fill in the values
```

**For Vercel** — go to your project → Settings → Environment Variables → add:
- `NOTION_TOKEN` = your integration token
- `NOTION_DATABASE_ID` = your database ID

---

## Local Development

```bash
npm install
cp .env.local.example .env.local
# fill in .env.local with your Notion credentials
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Deploy to Vercel

```bash
npm install -g vercel   # if not installed
vercel                  # follow prompts, link to your Vercel account
```

Then add the two env vars in the Vercel dashboard (Settings → Environment Variables).

After deploy, open the URL on your iPhone → Share → **Add to Home Screen** → tap Add.

---

## PWA Icons

You need two PNG icons in `/public`:
- `icon-192.png` — 192×192px
- `icon-512.png` — 512×512px

You can generate them from any image using [realfavicongenerator.net](https://realfavicongenerator.net) or [maskable.app](https://maskable.app/editor).

---

## Initiatives

| ID | Name | Weekly target | Tier |
|---|---|---|---|
| gym | Gym | 4× | Must-Hit |
| linkedin | LinkedIn post | 3× | Must-Hit |
| apply | Job search action | 5× | Must-Hit |
| automate | Automations (AI lab) | 3× | Must-Hit |
| blog | Blog → LinkedIn | 1× | Growth |

---

## Project Structure

```
app/
  page.tsx              Today — daily checklist
  week/page.tsx         Week — progress + mini chart
  goals/page.tsx        Goals — 2yr / 7yr targets
  api/
    checkin/route.ts    POST — upsert a check-in to Notion
    today/route.ts      GET  — today's records
    week/route.ts       GET  — this week's records
    streaks/route.ts    GET  — current streaks per initiative
lib/
  initiatives.ts        Initiative config
  quotes.ts             50 curated quotes + getQuoteOfDay()
  date.ts               ISO week helpers
  notion.ts             Notion client + db helpers
components/
  InitiativeCard.tsx    Tap-to-decrement card + confetti
  Confetti.tsx          Particle burst animation
  CountdownBanner.tsx   12-month runway countdown
  QuoteCard.tsx         Daily rotating quote
  WeekChart.tsx         7-bar mini chart
  MoodSelector.tsx      Energy mood picker
  BottomNav.tsx         Tab navigation
public/
  manifest.json         PWA manifest
  icon-192.png          (you add this)
  icon-512.png          (you add this)
```
