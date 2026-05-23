# Momentum Tracker — Complete Handoff

> **For any Claude Code session:** paste this file as your first message and say "Continue the Momentum Tracker build from the handoff." The agent will have full context and can pick up exactly where this left off.

---

## What This App Is

A mobile-first PWA (installable to iPhone home screen) for daily habit tracking.

**Owner:** Sangeetha — PM, 5 YoE at Workday, targeting ₹70 LPA Senior PM at AI-B2B SaaS in 12 months.  
**Why it exists:** Drops initiatives by scattering. This enforces daily accountability with Notion as the durable, queryable backend.  
**Runway:** Closes ~May 2027 (baby planning). Hard deadline. Every week counts.

**Stack:** Next.js 14 App Router · Tailwind CSS · Framer Motion · `@notionhq/client` · Vercel  
**Repo:** https://github.com/sangeethabalakrishnank-lgtm/momentum_daily_tracker  
**Local path:** `/Users/sangeetha/Documents/Projects/Momentum`

---

## ✅ Build Status

`npm run build` → **passes cleanly. Zero TypeScript errors. Zero lint errors.**

All 31 source files committed on `main`. No pending changes.

---

## What Has Been Built (Complete)

### Lib layer

**`lib/initiatives.ts`**
5 initiatives with id, emoji, name, sub-text, weekly target, and tier:
- 🏋️ `gym` — baseline · energy compounds — target 4× — tier 1 (MUST-HIT)
- ✍️ `linkedin` — AI-PM case studies · recruiter magnet — target 3× — tier 1
- 🎯 `apply` — apply / recruiter msg / interview prep — target 5× — tier 1
- 🤖 `automate` — learn 1 AI technique per session — target 3× — tier 1
- 📝 `blog` — long-form, repurpose to LinkedIn — target 1× — tier 2

Exports `INITIATIVES`, `TIER1`, `TIER2`.

**`lib/quotes.ts`**
50 curated quotes (Naval Ravikant, Buffett, Munger, Marcus Aurelius, Seneca, James Clear, Paul Graham, Derek Sivers, Sam Altman, Reid Hoffman, Jensen Huang, and others). Every quote filtered to: long-term thinking, compound effort, deep focus, disciplined consistency, betting on yourself, shipping work. ~60% ambition, ~40% discipline.

`getQuoteOfDay(date?)` → deterministic pick by day-of-year (same quote all day, changes daily).

**`lib/date.ts`**
- `todayISO()` → `"2026-05-23"`
- `isoWeek(date)` → `"2026-W21"` (ISO 8601, handles year boundaries)
- `currentWeek()` → current ISO week
- `weekDays(week)` → array of 7 ISO date strings Mon–Sun
- `monthsRemaining(from, start)` → months left in 12-month runway
- `dayOfYear(date)` → integer day number for quote rotation

**`lib/notion.ts`**
Notion client wired to `process.env.NOTION_TOKEN` and `NOTION_DATABASE_ID`.

- `getTodayRecords(date)` → queries DB filtered by Date field
- `getWeekRecords(week)` → queries DB filtered by Week field
- `upsertCheckin(params)` → checks for existing (date, initiative) pair, updates if found, creates if not. No duplicates ever.
- `getStreaks(initiativeIds)` → fetches last 90 days of completed records, calculates consecutive-day streak per initiative (skips today if not yet done)

`CheckinRecord` type: `{ id, date, initiative, completed, count, mood?, note?, week }`

### API routes

| Route | Method | What it does |
|---|---|---|
| `/api/checkin` | POST | Upsert a check-in. Body: `{date, initiative, completed, count, mood?, note?}` |
| `/api/today` | GET | Returns today's records. Optional `?date=YYYY-MM-DD` param |
| `/api/week` | GET | Returns week's records. Optional `?week=2026-W21` param |
| `/api/streaks` | GET | Returns `{streaks: {gym: 3, linkedin: 1, ...}}` |

All GET routes are `force-dynamic` (no static rendering).

### Pages

**`app/page.tsx` — Today (default route `/`)**
- `'use client'` — loads existing Notion data on mount via `/api/today` + `/api/streaks`
- Countdown banner (months remaining)
- Daily rotating quote card (Fraunces italic)
- Progress summary: tier-1 done / total tier-1 · total done / total initiatives
- Tier 1 "MUST-HIT" cards above, Tier 2 "GROWTH" below
- Cards auto-sort: completed cards animate to bottom (Framer Motion `layout` + `layoutId`)
- Mood selector (🔥💪😐😴🌪️)
- One-liner note input (max 200 chars)
- Save button → calls `/api/checkin` for all 5 initiatives in parallel. Button turns mint green with "✓ Saved to Notion" on success.

**`app/week/page.tsx` — Week (`/week`)**
- Hero card (dark ink bg): ISO week label, `totalDone / weeklyTarget` count, 7-bar animated WeekChart
- "Initiative breakdown" section: one card per initiative
  - `done/target` with colour: green if complete, peach/rose if behind expected pace, sky if on track
  - `+N bonus` badge in butter if user did extras
  - 7 day-dots (Mon–Sun): green=done, sky=today, mist=empty
  - Progress bar with colour logic
- Sunday review card (only shown if today is Sunday): 3 textarea prompts for weekly reflection

**`app/goals/page.tsx` — Goals (`/goals`)**
- Static page, no data fetching
- 12-month hero card (dark bg): ₹70 LPA, Senior PM · AI-forward B2B SaaS, hard deadline note
- 2-year plan card (cream): 3 bullets
- 7-year vision card (lilac): 3 bullets
- Initiative → Goal map: each initiative links to which goals it serves, displayed as sky-coloured tags

### Components

**`components/InitiativeCard.tsx`**
Core interaction logic:
- Tap → decrements counter (4× left → 3× → 2× → 1× → ✓ done → +1 bonus per extra tap)
- On reaching target: full confetti burst (8 particles), card bg turns mint, card reorders to bottom
- Extra taps: mini confetti burst (5 particles), `+N bonus` badge in butter colour
- Counter bounces with `y: [-4, 0], scale: [1.2, 1]` on each decrement tap
- Progress bar animates width via Framer Motion `animate`

**`components/Confetti.tsx`**
Framer Motion particle burst. Props: `trigger: boolean, mini?: boolean`.
- Full: 8 particles, 8×8px
- Mini: 5 particles, 6×6px
- Colors: mint (#C4E8D4), lilac (#D4C4E8), butter (#F5E8B8), peach (#F5C9B8), sky (#B8D4E8)
- Trigger via: set `trigger=true` then `setTimeout(() => set false, 50)` — the effect fires on the `true` edge

**`components/CountdownBanner.tsx`**
Dark ink card. Large sky-coloured number = months remaining from runway start (`2026-05-22`). Tagline: `→ ₹70 LPA · Senior PM · AI-forward SaaS`.

**`components/QuoteCard.tsx`**
Calls `getQuoteOfDay()`, displays in Fraunces italic. Shows text + author.

**`components/MoodSelector.tsx`**
5 pastel buttons: 🔥💪😐😴🌪️. Selected state: scale 1.08 + coloured bg. Emits `Mood` type string.

**`components/WeekChart.tsx`**
7 animated bars. Each bar: mint=100%, sky=partial, mist=0%. Today's bar has sky-deep border. Day labels M/T/W/T/F/S/S below.

**`components/BottomNav.tsx`**
Fixed bottom tab bar: Today (✦) · Week (◈) · Goals (◎). Active tab: sky-deep colour + scale 1.2. Uses `usePathname()` for active state.

### App shell

**`app/layout.tsx`**
- Imports Fraunces + Nunito from Google Fonts via `globals.css`
- Sets PWA metadata: manifest link, apple-web-app capable, theme colour `#B8D4E8`
- Max width `max-w-md mx-auto`, bottom padding `pb-24` (for bottom nav)
- `<BottomNav />` rendered globally

**`app/globals.css`**
All CSS custom properties (design tokens):
```css
--sky: #B8D4E8        /* primary action, progress bars */
--sky-deep: #7CA8C9   /* hovers, emphasis */
--lilac: #D4C4E8      /* secondary, accents */
--lilac-deep: #A892C9 /* tier-1 borders */
--cream: #FAF6EE      /* card backgrounds */
--cream-warm: #F5EFE3 /* page background */
--ink: #2D2D3A        /* primary text, dark mode header */
--ink-soft: #6B6B7A   /* secondary text */
--mist: #E8E4DC       /* dividers, idle state */
--peach: #F5C9B8      /* behind-pace warnings */
--mint: #C4E8D4       /* completion/success burst */
--butter: #F5E8B8     /* streak + bonus badges */
```
Google Fonts import: `Fraunces:ital,wght@1,600` + `Nunito:wght@400;700;800`

**`public/manifest.json`**
PWA manifest: standalone display, portrait, sky theme. References `icon-192.png` and `icon-512.png` (not yet created).

---

## ❌ What Still Needs To Be Done

### 1. 🔴 SECURITY — Regenerate Notion Token (do this NOW)

The Notion token was accidentally pasted in plain text in a Claude chat session. It must be treated as compromised:

1. Go to → https://www.notion.so/profile/integrations
2. Find the Momentum integration → click it → **Regenerate token**
3. Copy the new token (starts with `ntn_...`)

Do NOT use the old token `ntn_35973359...` anywhere.

### 2. Create the Notion Database

Create a new full-page database in Notion called **`Momentum Log`** with exactly these properties:

| Property name | Type | Notes |
|---|---|---|
| `Name` | Title | Auto-set to `YYYY-MM-DD · initiative_id` by the API |
| `Date` | Date | The day this check-in is for |
| `Initiative` | Select | Options must be: `gym` `linkedin` `apply` `automate` `blog` |
| `Completed` | Checkbox | True when the initiative was done |
| `Count` | Number | Total taps (target + bonus sessions) |
| `Mood` | Select | Options must be: `🔥` `💪` `😐` `😴` `🌪️` |
| `Note` | Rich text | Daily one-liner |
| `Week` | Rich text | ISO week string e.g. `2026-W21` — **must be Rich text, not Text** |

**Important:** The `Week` property type must be **Rich text** (not plain Text). The API query `{ rich_text: { equals: week } }` in `lib/notion.ts` depends on this.

After creating the database:
1. Click **Share** (top right) → **Add connections** → find your Momentum integration → click it
2. Copy the database ID from the URL: `https://notion.so/YOUR-ID-HERE?v=...`
   - It's the 32-character hex string before the `?`
   - Format with hyphens: `xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx`

### 3. Create `.env.local`

In the project root (`/Users/sangeetha/Documents/Projects/Momentum/`):

```bash
touch .env.local
```

Contents:
```
NOTION_TOKEN=ntn_your_new_regenerated_token_here
NOTION_DATABASE_ID=your-32-char-database-id-here
```

`.env.local` is already in `.gitignore` — it will NOT be committed.

### 4. Test locally

```bash
cd "/Users/sangeetha/Documents/Projects/Momentum"
npm run dev
```

Open http://localhost:3000 on your browser (or phone on same wifi using your Mac's IP).

Test checklist:
- [ ] Today page loads (countdown shows ~11 months, quote shows)
- [ ] Tap a card: counter decrements, progress bar grows
- [ ] Tap to done: confetti burst, card turns mint, slides to bottom
- [ ] Select mood, type a note
- [ ] Hit "Save to Notion" → button turns green "✓ Saved to Notion"
- [ ] Check Notion database — 5 rows should appear (one per initiative)
- [ ] Refresh page — data rehydrates from Notion (cards show previous state)
- [ ] Navigate to /week — shows this week's data
- [ ] Navigate to /goals — static content loads

### 5. Add PWA Icons

Two PNG files needed in `/Users/sangeetha/Documents/Projects/Momentum/public/`:
- `icon-192.png` (192×192 px)
- `icon-512.png` (512×512 px)

Quick option — generate at https://maskable.app/editor or https://realfavicongenerator.net  
Design: simple **M** or **✦** glyph on sky-blue (`#B8D4E8`) background, dark ink (`#2D2D3A`) text.

Without these files, the app still works — it just won't have a custom icon on the home screen.

### 6. Deploy to Vercel

```bash
# Install Vercel CLI if not installed
npm install -g vercel

cd "/Users/sangeetha/Documents/Projects/Momentum"
vercel
```

Follow prompts:
- Link to existing project or create new → `momentum-tracker`
- Framework: Next.js (auto-detected)
- Don't override build settings

After deploy, go to **Vercel dashboard → project → Settings → Environment Variables** and add:
- `NOTION_TOKEN` = your new token
- `NOTION_DATABASE_ID` = your database ID

Then redeploy: `vercel --prod`

You'll get a URL like `momentum-tracker-xyz.vercel.app`.

### 7. Install to iPhone

1. Open the Vercel URL in Safari on your iPhone
2. Tap the **Share** button (box with arrow)
3. Tap **Add to Home Screen**
4. Name it `Momentum` → tap **Add**

The app launches in standalone mode (no browser chrome, full screen).

---

## Optional Improvements (low priority)

### A. Save Sunday review answers to Notion
The Sunday review card in `/week` has 3 textarea prompts but they're not currently saved anywhere. Could add a separate Notion database or a special check-in type to persist these.

### B. Streak badges on Week page
`app/week/page.tsx` doesn't currently show streak data. Could add `fetch('/api/streaks')` useEffect similar to Today page.

### C. Quote enrichment cron
Add `GET /api/enrich-quotes` that fetches from `https://api.quotable.io/quotes?tags=wisdom|business|success&limit=10`, dedupes by text, appends to a local cache file. Could be triggered weekly via Vercel Cron. Low priority — the 50 curated quotes are high quality and rotate well.

### D. Undo last tap
Currently there's no way to undo a mistaken tap. Could add long-press gesture or a small undo button that appears briefly after each tap.

---

## Complete File Tree

```
/Users/sangeetha/Documents/Projects/Momentum/
├── app/
│   ├── globals.css              ← CSS vars + Google Fonts + Tailwind
│   ├── layout.tsx               ← Root layout: PWA metadata, BottomNav, max-w-md
│   ├── page.tsx                 ← Today page (client component, fetches Notion on mount)
│   ├── week/
│   │   └── page.tsx             ← Week view (client component, fetches /api/week)
│   ├── goals/
│   │   └── page.tsx             ← Goals page (static, no data fetching)
│   └── api/
│       ├── checkin/route.ts     ← POST: upsert check-in to Notion
│       ├── today/route.ts       ← GET: today's records from Notion
│       ├── week/route.ts        ← GET: week's records from Notion
│       └── streaks/route.ts     ← GET: streak counts per initiative
├── components/
│   ├── BottomNav.tsx            ← Fixed bottom tab bar: Today/Week/Goals
│   ├── Confetti.tsx             ← Framer Motion particle burst (full + mini)
│   ├── CountdownBanner.tsx      ← Months remaining + ₹70 LPA tagline
│   ├── InitiativeCard.tsx       ← Tap-to-decrement card with animations
│   ├── MoodSelector.tsx         ← 5 pastel mood buttons
│   ├── QuoteCard.tsx            ← Daily rotating quote (Fraunces italic)
│   └── WeekChart.tsx            ← 7-bar animated progress chart
├── lib/
│   ├── date.ts                  ← ISO date/week helpers + monthsRemaining
│   ├── initiatives.ts           ← Initiative config array + TIER1/TIER2 exports
│   ├── notion.ts                ← Notion client + all DB operations
│   └── quotes.ts                ← 50 curated quotes + getQuoteOfDay()
├── public/
│   ├── manifest.json            ← PWA manifest (standalone, portrait, sky theme)
│   ├── icon-192.png             ← ⚠️ MISSING — needs to be created
│   └── icon-512.png             ← ⚠️ MISSING — needs to be created
├── .env.local                   ← ⚠️ MISSING — needs to be created with real tokens
├── .env.local.example           ← Template showing required env var names
├── .gitignore                   ← node_modules, .next, .env.local etc.
├── next.config.mjs              ← Minimal Next.js config
├── package.json                 ← next@14.2.5, framer-motion, @notionhq/client
├── postcss.config.mjs
├── tailwind.config.ts           ← Extended with fontFamily: nunito, fraunces
├── tsconfig.json
└── README.md                    ← Full Notion setup walkthrough
```

---

## Git State

- **Branch:** `main`
- **Remote:** `https://github.com/sangeethabalakrishnank-lgtm/momentum_daily_tracker`
- **Commits:**
  - `f9f1436` — "Your daily commit log of your life" — full build (31 files)
  - `d4588e7` — "first commit" — initial README only
- Branch `initial-scaffold` also exists on remote (points to d4588e7, used for PR base)

---

## Key Design Decisions (context for future changes)

1. **Upsert, not insert:** `upsertCheckin` always checks for existing (date, initiative) pair before writing. Safe to call multiple times.

2. **`count` = total taps:** Stored as total (target + bonus), not just bonus. So if target=4 and user tapped 6 times, count=6. The UI reconstructs `taps = min(count, target)` and `bonus = max(0, count - target)` on hydration.

3. **API routes are `force-dynamic`:** Prevents Next.js from trying to statically render them at build time. Required because they read env vars and call Notion at runtime.

4. **Confetti trigger pattern:** The `trigger` prop is momentarily set `true` then `false` (via 50ms timeout). The `useEffect` in Confetti fires on the `true` edge and spawns particles.

5. **Week filter uses `Rich text`:** `lib/notion.ts` queries `{ property: 'Week', rich_text: { equals: week } }`. If you create the Notion DB with `Week` as plain "Text" instead of "Rich text", this query will silently return 0 results. Must be Rich text.

6. **ISO week is UTC-safe:** `isoWeek()` uses `Date.UTC()` throughout to avoid timezone-shift bugs when converting dates.

7. **Streak logic:** Skips today if not yet done (streak doesn't break mid-day). Counts consecutive days working backwards. Caps search at 90 days.

---

## Next Session Startup Commands

```bash
cd "/Users/sangeetha/Documents/Projects/Momentum"
git status          # should be clean
npm run dev         # start dev server
```

Then open http://localhost:3000 — if .env.local exists with valid credentials, it's live.
