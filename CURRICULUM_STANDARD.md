# The 6-Month Analyst Standard — Curriculum Vision

**Status:** proposal for Mike's review (June 3, 2026). Defines the new north star
before we restructure any kit.

## The shift
From **"bare basics"** (can you recognize a VLOOKUP?) → **"job-ready depth"**
(could you do this analyst's job after 6 months on it?). Grounded in what
entry-level postings and hiring managers actually reward.

## The target person
The **common core** of a *junior data analyst / business analyst / new data pro*
about **6 months in**. Independently, they can:
1. Turn a vague business question into a **data question**.
2. **Get** the data themselves (SQL), **clean** it reliably (Excel/Python), and trust it.
3. **Analyze & summarize** it (aggregations, the right comparison, basic stats).
4. **Visualize it honestly** (Tableau/Power BI) and communicate the **"so what"** to non-technical people.
5. **Catch their own errors** (attention to detail) and **explain *why*** they did what they did (workflow thinking).

> *BA-leaning variant adds requirements gathering, process mapping, and stakeholder
> translation. We target the data-analyst common core and flag BA divergences where useful.*

Source signal: employers weight **workflow competence + tool fluency + "what the data
means"** over isolated syntax; **attention to detail/reliability** is the hiring
separator at this level. (CourseCareers, Weld, IIBA, Research.com.)

## The structural problem we're fixing
Today's kits teach **tool features** but skip the **prerequisites and mental models**
underneath them — and stay shallow. Example flagged by Mike: Tableau jumps to
**"Dimensions vs Measures"** assuming you already know what a *field*, a *data type*,
a *row/grain*, and *aggregation* are. We teach the **"which button"** before the
**"why."** That's the #1 gap.

## The new structure — three tiers per kit
- **Tier 0 · Foundations (the prerequisites a lesson assumes).** Data literacy:
  rows/columns/**grain**, data types, nulls, what "clean" means, and the analytics
  workflow. **Mostly missing today — the biggest gap.**
- **Tier 1 · Core mechanics.** The working skills (where the kits mostly live now) —
  but deepened, each with the **why/when** and the **gotcha**, not just the how.
- **Tier 2 · Applied (6-month competence).** Real tasks done independently +
  judgment + communicating the result. *"On the job you'd…"*

**Every lesson gains a stated PREREQUISITE** ("before this, be comfortable with X"),
so the path scaffolds instead of dropping beginners mid-stream.

## Cross-cutting threads (every kit, currently under-served)
1. The **analytics workflow**: question → acquire → clean → analyze → visualize → communicate.
2. **Asking the right question** — turning a business ask into a data ask.
3. **Communicating findings** to non-technical people (the "so what").
4. **Attention to detail** — catching your own errors before they ship.

## Per-kit "6-month-ready" snapshot (what "done" means)
- **Excel:** clean messy data reliably; lookups; conditional aggregates; PivotTables;
  knows the text-vs-number traps cold. Can hand a clean sheet to a stakeholder.
- **SQL:** pull data independently; joins (and *why* a join double-counts); GROUP
  BY/HAVING; window functions at a recognition level; reconciliation queries.
- **Python/pandas:** load, inspect, clean, group, merge, export — the daily 80%.
- **Tableau:** build the right chart for the question; dimensions/measures/aggregation
  fluently; filters/sets/groups/params; an honest, readable dashboard.
- **Stats:** mean/median, spread, correlation≠causation, p-values & A/B basics —
  enough to not misuse them.
- **Power BI:** model (star schema), core DAX, time intelligence, a shareable report.
- **Cross-cutting:** explain the *why* behind every step; present a finding in one sentence.

## Pilot: Tableau restructure (the kit you flagged)
**Today** it opens: Interface → Dimensions vs Measures → charts. **Missing prerequisites:**
what a data table *is* (rows=records, columns=fields, the **grain**), data **types**
(why Tableau colors them), and what **"aggregate"** means *before* "Tableau
auto-aggregates."

**Proposed new "Unit 0 · Before You Build (Foundations)":**
- **0.1 How Tableau sees your data** — the data table: rows, fields, the grain.
- **0.2 Field types & why color matters** — text/number/date → discrete/continuous, blue/green.
- **0.3 What "aggregate" means** — one value standing in for many (the idea behind SUM/AVG).
- **0.4 The analyst's loop in Tableau** — question → field → shelf → chart → insight.

Then the existing 20 lessons become Tier 1/2, each gaining a one-line **prerequisite**
and a deeper **why/gotcha/applied** beat. Same pattern then rolls to every kit.

## Decisions for Mike
1. **Persona:** target the **data-analyst common core** (recommended) + flag BA bits,
   or build a separate BA track?
2. **Scope:** **restructure existing kits in place** — add Tier-0 Foundations +
   prerequisite scaffolding + more depth (recommended) — vs net-new kits?
3. **Start:** **pilot the full restructure on Tableau first** (you flagged it), prove
   the pattern, then roll kit-by-kit (recommended)?
