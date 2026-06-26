# Analyst Prep Kit

A free, browser-based learning suite for breaking into data analytics. Eleven self-contained apps, no install, no login, no telemetry.

**Live:** https://michaelnocito.github.io/analyst-prep-kit/

## What's in the kit

| Kit | What it teaches | Signature feature |
|---|---|---|
| [SQL](sql/) | Joins, aggregation, window functions, CTEs — against a real in-browser SQLite database | Live `sql.js` query runner |
| [Excel](excel/) | Formulas, PivotTables, lookup logic, data cleaning | Drag-and-drop Pivot Lab |
| [Python](python/) | pandas, basic scripting, file validation, data cleaning | Live Pyodide terminal (real CPython in the browser) |
| [Tableau](tableau/) | Chart selection, dashboard design, visual hierarchy | Drag-and-drop Viz Builder (Chart.js) |
| [Chart Literacy](chart-literacy/) | Tool-agnostic: what a chart encodes, the 6 charts you'll use most, how charts mislead, choosing & explaining | Question→chart decision path |
| [Forecasting & Trend Modeling](forecasting/) | Tool-agnostic: trend & seasonality, moving averages & smoothing, regression, Holt-Winters, ARIMA in plain English, accuracy & intervals | Fan-chart uncertainty intuition |
| [Statistics](stats/) | Distributions, A/B testing, p-values, regression intuition | Interactive Distribution Lab |
| [Power BI](powerbi/) | DAX, time intelligence, dashboard design, the Microsoft stack | Lesson-driven walkthroughs |
| [Interview](interview/) | STAR, behavioral prep, the hard moments that decide the offer | Answer Builder with self-scoring |
| [Associate Data Analyst Simulator](simulator/) | A simulated first week as an associate analyst — 10 real assignments with AI manager review | Live Claude-API manager feedback per task |
| [Final Exam Kit](final/) | A 28-question final exam across all 7 subjects, plus a bare-basics study guide for each | Per-section score breakdown that points back to the kit you should revisit |

## How every lesson works — "Say It Out Loud"

Every query, formula, or chart in this kit is broken down piece by piece into plain language. Read it back to yourself — in whatever language you think in — and if you can explain what each part is doing, you own it. The method works the same whether English is your first language or your fifth.

Example:

```sql
SELECT name FROM customers WHERE status = 'active';
```

- `SELECT name` → get the name column
- `FROM customers` → from the customers table
- `WHERE status = 'active'` → only rows where status is active

That's the whole methodology. Each lesson follows the same shape: see the code → read the breakdown → say it back → drill it.

## Tech

- One self-contained `index.html` per kit. No build step, no dependencies bundled in source.
- Dark default with a light toggle. Theme is shared across kits (`localStorage` key `apk-theme`).
- Per-kit progress is saved in `localStorage` so you can leave and come back.
- The simulator's "manager review" uses the Claude API directly from your browser. Paste your own API key in the simulator's nav — it's stored only on your machine.

## Learn by playing

The kit has companion games: the **[Analyst Sprint](https://michaelnocito.github.io/prep-companion-apps/)** series ([repo](https://github.com/michaelnocito/prep-companion-apps)) — ten-minute warm-up games matched unit-for-unit to the kits. Coach Srbina, a sales rep finding her analyst instincts, through the [Excel sprint](https://michaelnocito.github.io/prep-companion-apps/excel/) and the [SQL sprint](https://michaelnocito.github.io/prep-companion-apps/sql/), then come back here to go deeper.

## Suggested order

If you're prepping for an entry-level / associate analyst role from scratch:

1. **SQL** — the most-tested skill in analyst interviews
2. **Excel** — universally assumed
3. **Statistics** — A/B testing and distributions come up in nearly every technical panel
4. **Interview Kit** — the non-technical round that decides whether you get the offer
5. **Associate Data Analyst Simulator** — once you have the tools, this is where you practice using them like a real analyst
6. **Final Exam Kit** — pressure-test your knowledge end-to-end; the per-section score tells you exactly which kit to revisit
7. **Python**, **Tableau**, **Power BI** — depth in whichever the role you're targeting actually uses

There's also a one-click **Interview Sprint** on the hub page that filters the kit down to the four tools that move the needle most, sequenced in the right order.

## Status

Actively in development. Content and layout may change between sessions. All progress is local — it won't be wiped by updates.

## License & credits

Built by [Michael Nocito](https://michaelnocito.github.io). Core content is free to use. The CONTOSO and DataBridge Analytics datasets are fictional.
