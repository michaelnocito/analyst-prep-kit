# Changelog

All notable changes to the Analyst Prep Kit. Loose Keep-a-Changelog
conventions; semver where it makes sense for a static-site product:
- `MAJOR.MINOR.PATCH`
- PATCH = bug fixes only (no UX change)
- MINOR = new features or visible UX changes, no breaking content reorg
- MAJOR = structural changes that invalidate prior progress / URLs

---

## [1.0.0] — 2026-05-27 — First stable release

Tentative stable: structure locked, content complete, no known blockers.
Entering test-and-iterate mode. See `ROADMAP.md` for in-flight items.

### What ships in 1.0.0

**Nine self-contained kits, sequenced in learning order:**
1. **Excel** — formulas, PivotTables, drag-and-drop Pivot Lab
2. **SQL** — live SQLite via sql.js, 12 lessons
3. **Python** — live Pyodide terminal, pandas focus
4. **Tableau** — drag-and-drop Viz Builder (Chart.js)
5. **Stats** — interactive Distribution Lab
6. **Power BI** — optional, DAX + Power Query, 12 lessons
7. **Interview** — STAR, Answer Builder, behavioral drills
8. **Associate Data Analyst Simulator** — 5-day, 10-task week-1 sim with
   live Claude API manager review (user-supplied API key)
9. **Final Exam Kit** — 28-question cross-subject test + bare-basics
   study guide, per-section score breakdown that points back to weak kits

**Cross-cutting features:**
- **Bare Basics mode** — global toggle on the hub. When ON, every kit
  highlights must-know lessons with a clearly labeled `★ Bare Basics`
  pill and dims the rest. Replaces the old Interview Sprint mode.
- **"Say It Out Loud" methodology** — every query, formula, and chart
  broken into plain-language chunks. Inclusive of non-native English
  speakers.
- **Consistent ecosystem nav** — every kit links to every other kit +
  the Simulator + Final Exam. `← All Kits` always top-left in every nav.
- **Theme toggle** — dark/light, persisted in localStorage across kits.
- **No install, no login, no telemetry.** Progress saved locally.

**Personal landing page** (michaelnocito.github.io) updated to feature
all 9 modules in learning order.

### Removed in 1.0.0
- **Interview Sprint mode** — confusing visual signal, replaced by Bare
  Basics with explicit `BARE BASICS MODE` labeling.
- **Games / Arcade prototype** — pulled from the repo until it has a
  defined role in the curriculum.

### Known orphans (cosmetic only, no user impact)
- Sprint-era CSS rules (`#sprint-bar`, `body.sprint-on`, `.sb-*`,
  `.st-*`) remain in each kit's stylesheet. They target DOM elements
  that no longer exist, so they render nothing. Slated for cleanup in
  a future patch when other CSS work is being done.

---

## Versioning shorthand for this project

Because this is a static-site solo project, I'm using:
- `v1.0.x` (1.0.1, 1.0.2, …) for bug-fix patches that come out of
  testing
- `v1.x.0` (1.1.0, 1.2.0, …) for new features or visible UX waves
- `v2.0.0` only if we re-architect the kits, change URL structure,
  or break saved progress
