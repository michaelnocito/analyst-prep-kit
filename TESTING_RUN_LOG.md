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
| SQL-a | Open SQL Lab → click **JOIN Lab** tab | Opens **blank** (no pre-filled query); guided JOIN tasks; **INNER vs LEFT compare panel** present | ⚠️→🔧 | PARTIAL (Jun 12, 12:11 AM ET): no progressive answer help on miss. **FIXED v1.53.0** — progressive scaffold (miss1 hint / miss2 half / miss3 full) + correctness check, JOIN+Agg labs. **Retest SQL-a1/a2/a3.** |
| SQL-a1 | JOIN Lab Task 1 → run a **wrong** query | "(expected ~N)"; amber **"Hint opened below"**; 💡 Hint **auto-opens** | ☐ | retest after v1.53.0 deploys |
| SQL-a2 | Run wrong **again** (2nd), then **3rd** time | 2nd: **first half** of answer fills editor; 3rd: **full answer** fills editor | ☐ | |
| SQL-a3 | Run the **correct** query | **"✓ Correct — N rows"** green + celebration | ☐ | |
| SQL-b | In JOIN Lab, run wrong/empty query → click **Show Answer** | Answer only as **last resort**; hint readable in **dark AND light** | ☐ | unblocked once SQL-a passes |
| SQL-c | Click **Aggregation Lab** tab, then **Free Lab** tab | Each tab **loads its own panel**, no blank; nav map highlights active tab | ☐ | |

## 2. Forecasting Kit — brand new → /forecasting/

| # | Do this | Expect to see | Result | Note |
|---|---------|---------------|:------:|------|
| FC-a | Open with F12; click **every top-nav button** | Renders, **no red console errors**; every view loads, no blank panel | ☐ | |
| FC-b | Lesson 1 "What forecasting is (and isn't)" → Quick Check → **Practice this** | Visual shows; quiz **green on correct**; flows into a **drill** | ☐ | |
| FC-c | Tap **wrong** then **right** choice; complete a lesson → **reload** | Wrong=**red**, right=**green+advances**; lesson still **done** after reload | ☐ | |

## 3. Excel Kit — 28 lessons, Units 4–6 → /excel/

| # | Do this | Expect to see | Result | Note |
|---|---------|---------------|:------:|------|
| XL-a | Open Lessons; read view header | **"…lessons across seven units"**; Units **4, 5, 6** appear | ☐ | |
| XL-b | Unit 6 "Power Query Basics" → Quick Check → **Practice this** | Visual + quiz green; flows into a **drill**, **no typing box** | ☐ | |
| XL-c | Scan home + lessons | **No "Low Cog Mode" toggle**; Pivot Lab drag→table updates | ☐ | |

## 4. Hub — new cards + cross-links → /

| # | Do this | Expect to see | Result | Note |
|---|---------|---------------|:------:|------|
| HUB-a | Open the hub | **"New" cards** for Chart Literacy + Forecasting; both links open right kit | ☐ | |
| HUB-b | Open SQL/Power BI/Tableau/Stats → footer/links | Each links to **Chart Literacy** and **Forecasting** | ☐ | |

---

## 5–9. Smoke-only (unchanged kits — 30 sec each)
Open, F12 on, click every nav button. Pass = renders, no red console errors, no blank panel.

| Kit | URL | Extra check | Result | Note |
|-----|-----|-------------|:------:|------|
| Chart Literacy | /chart-literacy/ | loads (already spot-passed) | ☐ | |
| Tableau | /tableau/ | **L20 dual-axis** + **L32 Build a Map** draw a chart | ☐ | |
| Python | /python/ | output-block visual renders | ☐ | |
| Stats | /stats/ | charts render (not blank canvas) | ☐ | |
| Power BI | /powerbi/ | DAX Lab opens; nav routes clean | ☐ | |
| Interview | /interview/ | one behavioral Q flow works | ☐ | |
| Final Exam | /final/ | submit a section → score shows | ☐ | |
| Simulator | /simulator/ | (optional, costs API call) manager review returns | ☐ | |

---

## GR / issues found during this run
_(log here with ET timestamp; triaged into ROADMAP after the run)_

- **SQL-a (blocker)** _(June 12, 2026 — 12:11 AM ET)_ — JOIN/Agg labs gave no progressive
  answer help on repeated misses (other drills do — give answer / fill in, up to 3 misses).
  **Actioned immediately (blocker). Shipped v1.53.0.** Awaiting retest SQL-a1/a2/a3.
