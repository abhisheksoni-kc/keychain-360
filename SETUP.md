# Keychain 360 — Planned Products Sandbox

## Local development

```bash
cd keychain-360
npm install
npm run dev
# → http://localhost:3000
```

The app starts at `/` and immediately redirects to `/planned-products`.

---

## Deploy to Vercel

### Option A — Vercel CLI (fastest)
```bash
npm i -g vercel
cd keychain-360
vercel          # follow prompts; framework auto-detected as Next.js
```

### Option B — GitHub + Vercel dashboard
1. Push the `keychain-360/` folder to a GitHub repo (as the repo root).
2. In the Vercel dashboard → New Project → Import that repo.
3. Framework: **Next.js** (auto-detected). No env vars needed.
4. Click Deploy.

---

## Recording click-path

Start at `http://localhost:3000` (or your Vercel URL):

| # | Action | URL / result |
|---|--------|--------------|
| 1 | App loads | Redirects to **Planned Products** list |
| 2 | Observe table | 15 seeded products across stages; stage pills (Verification, Quick Bid in purple, NDA, RFI) |
| 3 | Type "Popcorn" in search | Table filters live |
| 4 | Clear search → open **Stage** filter → select "Quick Bid" | Table shows only Quick Bid rows |
| 5 | Clear filter → click **View Details** on row 1 (Popcorn 27th May 1) | → `/planned-products/proj001` |
| 6 | Project detail loads | Header, Active pill, pipeline stepper (Shortlisted✓ → Verification highlighted), AI banner, supplier table |
| 7 | Click **Hide** on AI banner | Banner dismisses |
| 8 | Click another tab (e.g. Timeline) | Tab content placeholder shown |
| 9 | Click **Suppliers** tab | Returns to supplier table |
| 10 | Click **← All Projects** | Back to list |
| 11 | Find a row with "Find Suppliers" (yellow button) — e.g. row 3 | Click **Find Suppliers** |
| 12 | Wizard loads | Progress bar at 25%, product summary card on right |
| 13 | Fill in Project Name, Quantity, Price, Timeline | Step 1 |
| 14 | Click **Continue →** | Step 2 — Requirements |
| 15 | Toggle a few certification chips | Step 2 |
| 16 | Click **Continue →** | Step 3 — Invite Suppliers |
| 17 | Leave "Keychain AI" selected | Step 3 |
| 18 | Click **Continue →** | Step 4 — Review & Post |
| 19 | Confirm summary | Step 4 |
| 20 | Click **Post Project** | API creates project + updates product stage to Quick Bid |
| 21 | Success screen (green check) → auto-redirect | → project detail page for the new project |
| 22 | Back to Planned Products list | New project row now shows **Quick Bid** purple pill |

---

## Architecture overview

```
/app/api/          ← all data served from here (products, projects, suppliers)
/lib/repository.ts ← ONLY file touching the data store; swap JSON→Postgres here
/data/seed.json    ← demo seed; writes persist in-memory within a server instance
/components/ui/    ← DataTable, StatusPill (reuse for every future module)
/config/nav.ts     ← sidebar nav definition (add a module = add a config entry)
```

### Adding more products / suppliers
Edit `data/seed.json` and add rows — the UI picks them up automatically on next restart. No UI changes needed.

### Upgrading to a real database
1. In `lib/repository.ts`, replace the in-memory arrays with your Postgres/Supabase/Vercel KV calls.
2. The API shape stays the same; no page or component changes needed.
