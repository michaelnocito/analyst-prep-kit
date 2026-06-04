# Curriculum Restructure — Master Build Plan (all 6 lesson kits)

Companion to `CURRICULUM_STANDARD.md`. Synthesizes the per-kit restructure plans
(6 parallel planning passes, June 3, 2026). **Plan-only — approve before building.**

## The headline finding
Every kit has the **identical structural gap**: it opens at Lesson 1 already
assuming the learner knows the mental models underneath the tool — and never
teaches them. The fix is the same everywhere: **a 4-lesson "Unit 0 — Foundations"**
at the front + a **stated prerequisite on every existing lesson** + **depth beats**
(why / when / gotcha / "on the job you'd…") on the shallow ones.

## The universal Unit 0 pattern (recurs in all 6 kits)
1. **How [tool] sees your data** — table = rows (records) × columns (fields), and the
   **grain** ("what one row means"). *Grain is the single highest-leverage concept —
   it's the hidden cause of join double-counting, GROUP BY, and "is this number too big?"*
2. **Data types** — text vs number vs date, and the "looks like a number ≠ is a number" trap.
3. **What "aggregate" means** — one value standing in for many rows (the idea before any SUM button).
4. **The analyst's loop / what this is for** — question → acquire → clean → analyze → visualize → communicate.

## Per-kit Unit 0 (24 new foundation lessons total)
- **Excel · "Before You Type a Formula":** 0.1 How a spreadsheet is built (the grid) · 0.2 Cell
  references & the A1 grid *(most load-bearing)* · 0.3 Text vs number (& dates) · 0.4 What a formula actually is.
- **SQL · "Before You Query":** 0.1 What a database is (tables/rows/columns) · 0.2 The grain of a
  table · 0.3 Keys & why tables relate · 0.4 A query returns a table; NULL = unknown.
- **Python · "Before You Code":** 0.1 What code is (values/variables/top-to-bottom) · 0.2 Data types
  & the text-vs-number trap · 0.3 What a library is & why pandas (import) · 0.4 What a DataFrame really is (rows/cols/index/grain).
- **Tableau · "Before You Build"** *(PILOT)*: 0.1 How Tableau sees your data (rows/fields/grain) ·
  0.2 Field types & why Tableau colors them · 0.3 What "aggregate" means · 0.4 The analyst's loop in Tableau.
- **Stats · "Before You Calculate":** 0.1 What stats is for · 0.2 Variables, observations & datasets ·
  0.3 Population vs sample · 0.4 Describe vs infer (the map of the whole kit).
- **Power BI · "Before You Build":** 0.1 How Power BI sees data (table & grain) · 0.2 Data types &
  why they matter · 0.3 What "aggregate" means · 0.4 Load vs shape vs analyze (the loop).

## Depth scaffolding (every existing lesson)
- **Add a one-line `prereq`** to every lesson ("before this, be comfortable with X") — the single
  biggest structural add; no kit has this today.
- **Deepen the shallow lessons** with why/when + gotcha + an applied "on the job you'd…" beat.
  Shallowest per kit (fix first):
  - Excel: all need prereq lines; L3 VLOOKUP needs the #N/A-reconcile beat. (Kit is otherwise strong.)
  - SQL: **L4 INNER JOIN (add the double-count gotcha — priority)**, L1, L3, L9.
  - Python: **L2 (dict→DataFrame bridge), L3 ("pandas replaces loops"), L9 (merge double-count)**.
  - Tableau: **L1, L2, L3, L10** — the beginner "fundamentals" zone Mike flagged.
  - Stats: L2, L5, and the inference trio L9/L10/L12 (the key gotcha currently hides in the quiz — promote to the body).
  - Power BI: L1, L3, L10, L12 (feature tours); **L4 & L5 are the hardest concepts and most need Unit 0 under them**.

## The one architectural decision (raised by every plan): lesson ids / ordering
Adding Unit 0 at the front collides with how the kits key everything off numeric lesson `id`
(`LESSON_DRILLS`, saved progress in localStorage, "next lesson", progress bar).
- **Option A — renumber existing lessons** (clean ids) → **breaks every learner's saved progress**
  + remaps all `LESSON_DRILLS` → **v2.0.0 / breaking** (hits the Parking-Lot "invalidates saved progress" trigger).
- **Option B (RECOMMENDED) — append Unit-0 lessons with new non-colliding ids, render them FIRST**
  (array order / a display-order field), and fix the two id-assuming spots (progress % and
  "next lesson") to walk **display position** instead of raw id. Preserves all saved progress and
  existing drill wiring → ships as a normal **MINOR** per kit. This mirrors how the Tableau cert
  lessons were *appended* rather than inserted.

**Recommendation: Option B**, per kit. One small contained code change per kit (display-order +
progress/next logic), then purely additive content.

## Build sequencing (kit-by-kit, one ship per kit)
1. **Tableau first (the pilot Mike flagged).** Build Unit 0 (4 lessons) + the display-order plumbing
   + prereq lines + deepen L1/L2/L3/L10. This proves the whole pattern end-to-end.
2. **Mike reacts to the pilot** → lock the pattern.
3. **Roll the same pattern** to Excel → SQL → Python → Power BI → Stats (one ship each).
- Per kit also: give each Unit-0 lesson a viz (reuse the kit's existing viz path — grids/tables/
  output/html/charts), a quiz, and ≥1 tap-the-choice drill; update the hardcoded "N lessons" copy.

## Refinement after the pilot (Mike's feedback, June 3 — v1.38.0)
The Unit-0 start was good but the **jumps between lessons were still too large** and
there was no narrative. Two additions, now part of the standard for every kit:
1. **A story thread.** A running scenario threads the whole kit: *you're a new junior
   analyst at the coffee company; your manager's questions drive each lesson.* Reuses
   the existing data (reps Maya/Jordan/Sam, regions, products). Rendered as a 📖
   "story bridge" at the top of each lesson.
2. **Lesson-to-lesson layering.** Every lesson's bridge **recalls the previous lesson's
   concept and adds exactly ONE new idea** ("You can already split by region; now you
   need to total the sales → dimensions vs. measures"). This shrinks the perceived jump
   and makes the sequence feel like one continuous build, not a topic list.
- Mechanism: a new `story` field per lesson (replaces the bare `prereq` callout when
  present; `prereq` stays as fallback/data). Piloted on Tableau Unit 0 + Unit 1 (8
  lessons); rolls to all lessons in every kit.
- **Open question for Mike:** do the bridges make the jumps small enough, or do the
  biggest gaps also need NEW intermediate micro-lessons inserted?

## Scope reality
~**24 new lessons** + ~**80 prerequisite lines** + depth beats + per-kit ordering plumbing.
Big, multi-cycle, but every cycle is shippable and testable on its own. Net: the suite moves from
"bare basics" to a scaffolded, prerequisite-aware, job-depth education — the 6-month standard.
