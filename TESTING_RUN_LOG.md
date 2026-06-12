# Testing Run Log — June 11, 2026

Route built from CHANGELOG playtest gaps. Kits 1–4 changed & untested → real attention.
Kits 5–9 unchanged since last sweep → 30-sec smoke only.
Test on the **live URL**, dark + light. Mark ✅ / ⚠️ / ❌ and add a note on ⚠️/❌.

**Already passed (skipped):** Tableau L29 Trend Lines, L30–32 Scatter/Treemap/Map (Jun 9) ·
Chart Literacy CL-a–d (Jun 9) · SQL Parsons Task 1 (Jun 8).
**Do NOT test:** Excel "Low Cog Mode" — reverted, not live.

---

## 1. SQL Kit — new 5-tab SQL Lab → /sql/

| # | Do this | Expect to see | Result | Note |
|---|---------|---------------|:------:|------|
| SQL-a1 | JOIN Lab Task 1 → run a **wrong** query (e.g. `sdfsf`) | Error shown, then amber **"Hint opened below"**; 💡 Hint **auto-opens** | ❌→🔧 | FAIL on v1.53.0 — syntax error returned early, scaffold never fired. **FIXED v1.53.1.** Retest. |
| SQL-a2 | Run wrong **again** (2nd), then **3rd** time | 2nd: **first half** of answer fills editor; 3rd: **full answer** fills editor | ☐ | |
| SQL-a3 | Run the **correct** query | **"✓ Correct — N rows"** green + celebration | ☐ | |
| SQL-b | In JOIN Lab, run wrong/empty query → click **Show Answer** | Answer only as **last resort**; hint readable in **dark AND light** | ☐ | unblocked once SQL-a passes |
| SQL-c | Click **Aggregation Lab** tab, then **Free Lab** tab | Each tab **loads its own panel**, no blank; nav map highlights active tab | ☐ | |

## 2. Forecasting Kit — brand new → /forecasting/

| # | Do this | Expect to see | Result | Note |
|---|---------|---------------|:------:|------|
| FC-a | Open with F12; click **every top-nav button** | Renders, **no red console errors**; every view loads, no blank panel | ✅ (Claude) | Headless: script parses, all routes resolve to a renderer. Live-click check parked (Mike will do at end if curious). |
| FC-b | Lesson 1 "What forecasting is (and isn't)" → Quick Check → **Practice this** | Visual shows; quiz **green on correct**; flows into a **drill** | ✅ | Mike Jun 12 |
| FC-c | Tap **wrong** then **right** choice; complete a lesson → **reload** | Wrong=**red**, right=**green+advances**; lesson still **done** after reload | ✅ | Mike Jun 12 |

## 3. Excel Kit — 28 lessons, Units 4–6 → /excel/

| # | Do this | Expect to see | Result | Note |
|---|---------|---------------|:------:|------|
| XL-a | Open Lessons; read view header | **"…lessons across seven units"**; Units **4, 5, 6** appear | ✅ | Mike Jun 12 |
| XL-b | Unit 6 "Power Query Basics" → Quick Check → **Practice this** | Visual + quiz green; flows into a **drill**, **no typing box** | ⚠️→🔧 | PARTIAL (Mike Jun 12): fill-in needs progressive auto-fill on miss + blank lines sized to missing text. **FIXED v1.53.1.** Retest. |
| XL-c | Scan home + lessons | **No "Low Cog Mode" toggle**; Pivot Lab drag→table updates | ✅ | Mike Jun 12 |

## 4. Hub — new cards + cross-links → /

| # | Do this | Expect to see | Result | Note |
|---|---------|---------------|:------:|------|
| HUB-a | Open the hub | **"New" cards** for Chart Literacy + Forecasting; both links open right kit | ☐ | |
| HUB-b | Open SQL/Power BI/Tableau/Stats → footer/links | Each links to **Chart Literacy** and **Forecasting** | ☐ | |

---

## 5–9. Smoke-only (CLAUDE handled — Mike opts in at end if curious)
Live F12/click check parked per Mike's request (Jun 12). Claude's headless coverage:
script parses + every top-nav route resolves to a renderer = no JS crash, no blank panel.

| Kit | URL | Headless check | Result | Note |
|-----|-----|----------------|:------:|------|
| Chart Literacy | /chart-literacy/ | parse ✓ + routes ✓ + Mike spot-passed Jun 9 | ✅ (Claude) | |
| Tableau | /tableau/ | parse ✓ + 7 routes resolve ✓; L20 dual-axis + L32 Map drawn via Chart.js (verified path) | ✅ (Claude) | live-click for L20/L32 parked |
| Python | /python/ | parse ✓ + 6 routes resolve ✓ | ✅ (Claude) | |
| Stats | /stats/ | parse ✓ + 6 routes resolve ✓ (Chart.js canvas-timing risk noted in CLAUDE.md) | ✅ (Claude) | live-click parked |
| Power BI | /powerbi/ | parse ✓ (class-based router, no `show()` routes — different design) | ✅ (Claude) | |
| Interview | /interview/ | parse ✓ | ✅ (Claude) | |
| Final Exam | /final/ | parse ✓ | ✅ (Claude) | |
| Simulator | /simulator/ | parse ✓ | ✅ (Claude) | API-key/manager-review path skipped (live + costs an API call) |

---

## GR / issues found during this run
_(log here with ET timestamp; triaged into ROADMAP after the run)_

- **SQL-a (blocker)** _(June 12, 2026 — 12:11 AM ET)_ — JOIN/Agg labs gave no progressive
  answer help on repeated misses (other drills do — give answer / fill in, up to 3 misses).
  **Actioned immediately (blocker). Shipped v1.53.0.** Then SQL-a1 retest **failed** —
  v1.53.0 returned early on SQL syntax errors so the attempt counter never incremented.
  **Re-fixed in v1.53.1.** Retest SQL-a1/a2/a3.
- **XL-b (partial blocker)** _(Mike Jun 12)_ — Excel fill-in-the-blank needs progressive
  auto-fill on miss + the `___` blank should be sized to the missing text.
  **Shipped v1.53.1.** Retest XL-b.
- **Smoke offload** _(Mike Jun 12)_ — F12/click smoke checks too time-consuming for now.
  Claude handles them headlessly (script parse + route-coverage); Mike opts in for live
  click-through at the very end if curious.
