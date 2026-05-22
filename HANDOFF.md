# Momentum Tracker — Handoff Context

> Drop this into a new Claude Code session and say: "Continue building the Momentum Tracker from the handoff file."

---

## What This App Is

Mobile-first PWA (installable to phone home screen) for daily habit tracking.
Built by: Sangeetha (PM, 5 YoE at Workday, targeting ₹70 LPA Senior PM in 12 months).
Stack: Next.js 14 App Router · Tailwind CSS · Framer Motion · Notion API · Vercel.

---

## What Has Been Built (100% complete, build passes cleanly)

### Config & Scaffold
- `package.json` — next@14.2.5, framer-motion, @notionhq/client, tailwind
- `next.config.mjs`, `tsconfig.json`, `tailwind.config.ts`, `postcss.config.mjs`
- `node_modules/` installed
- `.gitignore`, `.env.local.example`
- `README.md` — full Notion setup walkthrough

### Lib layer (`/lib`)
- `lib/initiatives.ts` — 5 initiatives: gym (4×), linkedin (3×), apply (5×), automate (3×), blog (1×); tier 1 vs tier 2
- `lib/quotes.ts` — 50 curated quotes (Naval, Munger, Buffett, Aurelius, Seneca, Clear, Graham, Sivers, Altman, Huang) + `getQuoteOfDay()` deterministic by day-of-year
- `lib/date.ts` — `todayISO()`, `isoWeek()`, `weekDays()`, `monthsRemaining()`, `dayOfYear()`
- `lib/notion.ts` — `upsertCheckin()`, `getTodayRecords()`, `getWeekRecords()`, `getStreaks()` — all wired to Notion API

### API Routes (`/app/api`)
- `POST /api/checkin` — upserts (date, initiative) pair in Notion, never duplicates
- `GET /api/today` — returns today's records; `force-dynamic`
- `GET /api/week?week=2026-W21` — returns week's records; `force-dynamic`
- `GET /api/streaks` — calculates current streak per initiative; `force-dynamic`

### Pages
- `app/page.tsx` (Today) — countdown banner, daily quote, tier-1 + tier-2 initiative cards, mood selector, one-liner note, save button. Loads existing Notion data on mount. Fully wired to all APIs.
- `app/week/page.tsx` (Week) — hero card (done/total), 7-bar mini chart, per-initiative rows with day dots + progress bars + behind-pace warning, Sunday review card
- `app/goals/page.tsx` (Goals) — 12-month hero (₹70 LPA), 2-year plan, 7-year vision, initiative→goal map

### Components
- `CountdownBanner` — live months remaining from 2026-05-22 → ₹70 LPA tagline
- `QuoteCard` — daily rotating quote, italic Fraunces font
- `InitiativeCard` — tap-to-decrement counter (4× left → 3× → ✓ done → +1 bonus), confetti burst on completion, smooth Framer Motion reorder to bottom, progress bar, streak badge, tier badge
- `Confetti` — Framer Motion particle burst (8 full / 5 mini particles in mint/lilac/butter/peach/sky)
- `MoodSelector` — 5 pastel buttons 🔥💪😐😴🌪️ with scale+glow on select
- `WeekChart` — 7-bar animated chart (mint=100%, sky=partial, mist=0%)
- `BottomNav` — fixed bottom tab bar: Today / Week / Goals

### PWA
- `public/manifest.json` — standalone mode, sky theme, icon references

### Design system (Tailwind + CSS vars)
- Palette: sky/sky-deep, lilac/lilac-deep, cream/cream-warm, ink/ink-soft, mist, peach, mint, butter
- Fonts: Fraunces 600 italic (display/quotes) + Nunito 700/800 (UI) via Google Fonts

---

## What Still Needs To Be Done

### 1. Notion credentials (BLOCKER — do this first)
The Notion token was accidentally shared in chat — **it must be regenerated** before use.

Steps:
1. Go to notion.so/profile/integrations → find the Momentum integration → regenerate the token
2. Create the `Momentum Log` database in Notion with these exact properties:

| Property | Type | Notes |
|---|---|---|
| Name | Title | auto-set to `YYYY-MM-DD · initiative_id` |
| Date | Date | |
| Initiative | Select | Options: `gym`, `linkedin`, `apply`, `automate`, `blog` |
| Completed | Checkbox | |
| Count | Number | |
| Mood | Select | Options: `🔥` `💪` `😐` `😴` `🌪️` |
| Note | Rich text | |
| Week | Text | e.g. `2026-W21` |

3. Share the database with the integration (Share → Add connections → Momentum)
4. Copy the 32-char database ID from the URL
5. Create `.env.local` in the project root:
```
NOTION_TOKEN=your_new_token_here
NOTION_DATABASE_ID=your_database_id_here
```

### 2. Test local dev
```bash
cd "/Users/sangeetha/Documents/Projects/Momentum"
npm run dev
# open http://localhost:3000
# tap a card, change mood, add a note, hit Save — check Notion for the row
```

### 3. Add PWA icons
Two PNG files needed in `/public`:
- `icon-192.png` (192×192)
- `icon-512.png` (512×512)

Generate at maskable.app/editor or realfavicongenerator.net. Use a simple ✦ or M glyph on sky blue (`#B8D4E8`) background.

### 4. Deploy to Vercel
```bash
npm install -g vercel   # if not installed
cd "/Users/sangeetha/Documents/Projects/Momentum"
vercel
```
Then in Vercel dashboard → project → Settings → Environment Variables → add:
- `NOTION_TOKEN`
- `NOTION_DATABASE_ID`

Redeploy after adding env vars.

### 5. Install to phone
Open the Vercel URL on iPhone → Share → Add to Home Screen → Add.

### 6. (Optional) Week page: load streaks
`app/week/page.tsx` currently doesn't show streak badges. Can add a `fetch('/api/streaks')` useEffect similar to the Today page.

### 7. (Optional) Enrich quotes cron
`GET /api/enrich-quotes` — fetches from quotable.io, appends to local cache, dedupes. Low priority since 50 curated quotes are already loaded.

---

## File Tree (complete)
```
/Users/sangeetha/Documents/Projects/Momentum/
├── app/
│   ├── globals.css
│   ├── layout.tsx
│   ├── page.tsx                  ← Today
│   ├── week/
│   │   └── page.tsx              ← Week
│   ├── goals/
│   │   └── page.tsx              ← Goals
│   └── api/
│       ├── checkin/route.ts
│       ├── today/route.ts
│       ├── week/route.ts
│       └── streaks/route.ts
├── components/
│   ├── BottomNav.tsx
│   ├── Confetti.tsx
│   ├── CountdownBanner.tsx
│   ├── InitiativeCard.tsx
│   ├── MoodSelector.tsx
│   ├── QuoteCard.tsx
│   └── WeekChart.tsx
├── lib/
│   ├── date.ts
│   ├── initiatives.ts
│   ├── notion.ts
│   └── quotes.ts
├── public/
│   └── manifest.json
├── .env.local.example
├── .gitignore
├── next.config.mjs
├── package.json
├── postcss.config.mjs
├── README.md
├── tailwind.config.ts
└── tsconfig.json
```

---

## Build Status
`npm run build` → ✓ passes clean. Zero TypeScript errors. Zero lint errors.

---

## Key Design Decisions Made
- Notion upsert uses `(date, initiative)` as the unique key — no duplicates
- ISO week calc handles year boundaries correctly (ISO 8601)
- API routes are `force-dynamic` so Next.js doesn't try to static-render them
- `count` field stores total taps (target + bonus) so Notion data is the source of truth
- Today page hydrates from Notion on mount — refresh doesn't lose your state
- Framer Motion `layout` + `layoutId` handles card reordering when an initiative is completed
