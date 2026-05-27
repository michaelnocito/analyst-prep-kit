# Changelog

All notable changes to the Analyst Prep Kit. Loose Keep-a-Changelog
conventions; semver where it makes sense for a static-site product:
- `MAJOR.MINOR.PATCH`
- PATCH = bug fixes only (no UX change)
- MINOR = new features or visible UX changes, no breaking content reorg
- MAJOR = structural changes that invalidate prior progress / URLs

---

## [1.2.1] — 2026-05-27 — Excel "Say It Out Loud" lines in reading order

Closes the High-bucket RAL order item from feedback batch #2
(May 27, 2026 — 4:52 PM ET). Direct response to Mike's screenshot
showing the Excel L1 breakdown reading argument-first, function-last.

### Fixed
- Excel single-argument lessons (`=SUM`, `=AVERAGE`, `=COUNT`, `=TRIM`,
  `=PROPER`, `=LEN`, `=YEAR`, `=MONTH`) had their RAL `lines` arrays
  authored inside-out — argument explained first, function name last.
  Reordered each to match reading order: function name → arguments.
- Two lessons that didn't have a function-name line (`=LEFT`, `=TEXT`)
  now do, so the reading-order is consistent across the kit.

### Not touched
- SQL, Python, Power BI: data was already authored in reading order.
- Tableau, Stats: use a different render path (sections-based, not
  the RAL chunk breakdown).
- Excel multi-argument lessons (`=IF`, `=VLOOKUP`, `=XLOOKUP`,
  `=COUNTIF`, `=SUMIF`, `=COUNTIFS`, `=IFERROR`): already in
  param-order, no change.

### Cycle history note
First attempt at this fix (May 27, 7:00–7:35 PM ET) tried a
render-side reverse and was aborted before shipping when investigation
revealed the data was mixed across kits and within Excel. Re-spec'd
as Excel-only data edits; this is that ship.

---

## [1.2.0] — 2026-05-27 — Hub deduplicated: one entry point per kit

_Verified pass on all three checks at May 27, 2026 — 2:31 PM ET
(retroactively logged 7:42 PM ET during v1.2.1 testing)._

Closes GR-2 from feedback batch #2 (May 27, 2026 — 5:43 PM ET). Serves
the "simplicity beats completeness" sub-rule of the Vision Principles.

### Changed
- **Removed the duplicate "What's here" tool grid** that sat above the
  kit cards. Two clickable rows for the same kits was a cognitive-load
  problem and the bottom row (with progress bars from v1.1.0) was
  always going to be the right entry point.
- **Merged the deleted grid's "why it matters" copy into the kit cards
  as a small accent-colored subtitle line** below each kit name.
  Each card now carries both the sales pitch (why this kit matters)
  and the feature list (what's inside) without forcing the user to
  scan two sections.

### Why this shipped
Hub is now one column: kit name → why it matters → what's in it →
your progress. Single entry point per kit, all the information
preserved, less scrolling.

---

## [1.1.0] — 2026-05-27 — Hub progress + Continue card

Feedback batch #1 (May 27, 2026 — 4:05 PM ET) High-bucket items shipped.
Serves Vision Principles #1 (see your progress) and #2 (always know
what to do next).

### Added
- **Per-kit progress on every hub kit card.** Each card now shows
  "X of Y lessons" (or tasks / questions, depending on the kit) plus a
  thin teal progress bar that reads from the kit's existing localStorage
  state. Completed kits get a ✓ marker. Brand-new visitors see
  "Not started" placeholders so the layout doesn't shift. No new state
  storage — adapters read each kit's existing shape (epk, sqlkit-v1,
  ppk, tpk, spk, pbikt-v1, ipk, sim2, apk-final).
- **"Continue where you left off" hero card** at the top of the hub.
  Shows the kit name + which lesson/task you're on. Picks based on
  (1) the most recently clicked kit if it still has work to do,
  (2) otherwise the first incomplete kit with any progress,
  (3) hidden entirely if nothing has been started yet (no friction for
  first-time visitors). Click-stamps the chosen kit so the suggestion
  follows the user.

### Why this shipped
Returning users used to land on a hub that looked identical to a
first-time visitor's hub — no progress, no "what's next" cue. v1.1.0
makes those answers visible without an extra click, which was the
biggest cognitive-load gap in v1.0.

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
