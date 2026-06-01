# Changelog

All notable changes to the Analyst Prep Kit. Loose Keep-a-Changelog
conventions; semver where it makes sense for a static-site product:
- `MAJOR.MINOR.PATCH`
- PATCH = bug fixes only (no UX change)
- MINOR = new features or visible UX changes, no breaking content reorg
- MAJOR = structural changes that invalidate prior progress / URLs

---

## [1.8.0] — 2026-06-01 — Guided Path on Excel (lessons flow into their drills)

Excel prototype for the GR-G "Guided Path" epic. Each lesson now flows straight
into its OWN practice drills before moving on — guided-primary, but free jumping
is preserved.

### Added / Changed (Excel kit only)
- **Merged guided flow:** after a lesson's Quick Check the CTA is now
  **"Practice this →"** (not "Next lesson"). It walks that lesson's relevant
  drills one at a time — fill-in-the-blank, Fix the Formula, Parsons,
  Describe→Excel, What's Wrong, plus a Pivot Lab step for the pivot lessons —
  then advances to the next lesson. New `LESSON_DRILLS` map ties each lesson to
  its drills by topic.
- **Free exploration preserved:** Lessons / Practice / Cards nav still works; the
  complete card also offers "Skip to next lesson" and "All lessons."
- **Simplified home:** dropped the 3-tile Learn/Practice/Cards grid; leads with
  the Resume card + a prominent Pivot Lab card; Skill Readiness stays.
- **Bare Basics toned down:** the full-width banner is now a quiet link; toggle
  still works.

### Notes
- Verified the full loop headlessly (lesson → its drills → next lesson; fill &
  Parsons checks work inside the flow; home renders clean), zero console errors.
  No saved-progress keys or drill data changed.
- Excel-only prototype — once approved, the pattern rolls to the other kits.
- GR-G thread 4 (deeper visual reskin to "match the newer kits") still open: the
  home restructure modernizes it, but a full layout reskin wants Mike's eye.

---

## [1.7.0] — 2026-06-01 — Per-lesson reset across every lesson kit

Adds a **"↺ Reset this lesson"** control to the individual lesson view in every
lesson-based kit, so a learner can clear just one lesson's completion (and reopen
its Quick Check) without wiping the whole kit. Complements the kit-wide reset
that already exists in every kit.

Mike: "i need a lesson and a global reset for each kit."

### Added
- **Per-lesson reset**, shown on the lesson header only once that lesson is done:
  - **SQL, Power BI** — clears the lesson id from `doneLessons`, reopens the lesson.
  - **Excel, Python** — clears the lesson id from `lessonsDone`, reopens its Quick Check.
  - **Tableau, Stats** — clears `done['lesson'+id]`, re-renders the lesson.
  - **Interview** — marks that lesson incomplete again (`lessonsComplete[i]`).

### Notes
- **No global-reset change needed** — every kit already had a reachable kit-wide
  reset (SQL/Power BI: ⚙️ Settings → Reset Progress; Excel/Python/Tableau/Stats/
  Interview: ⚙️ Settings → Reset this kit; Simulator/Final: nav ↺ Reset).
- **Simulator & Final intentionally excluded** from per-unit reset: the Simulator
  is a continuous narrative week and the Final is an atomic exam — both already
  have the correct whole-unit reset ("Reset" / "Retake exam").
- Verified all 7 lesson kits headlessly (button appears when done → clears the
  lesson → button disappears), zero console errors. No saved-progress keys,
  lesson/quiz data, or URLs changed.

---

## [1.6.0] — 2026-05-31 — Calm-analyst re-skin rolled out to all 9 module kits

Extends the v1.5.0 hub re-skin to every module page (excel, sql, python,
tableau, stats, powerbi, interview, simulator, final). The whole suite now
shares one look: the light calm-analyst theme, system fonts, blue accent
(`#2f6df0`). Mike: "lets do each kit to look the same as this now, i love it."

**Look-and-feel only.** No saved-progress keys, lesson/quiz/drill data, kit
URLs, or JS behavior changed. The kits already supported light mode, so this
is a recolor of the light palette + a default flip, not a rebuild.

### Changed (every kit)

- **Light default** with the calm-analyst palette (soft cool-gray bg, white
  cards, blue accent). The old teal `:root` became a restrained dark variant,
  so the per-kit theme toggle still works and still honors the cross-kit
  `apk-theme` flag.
- **System-font stack** everywhere — dropped the Google Fonts (`Hanken
  Grotesk` / `JetBrains Mono`) from the 6 kits that loaded them; now instant
  and offline-capable. Mono is Consolas/ui-monospace.
- **Top-bar logo chip** (▦) added to each kit's nav to echo the hub.
- All hard-coded teal (`#58aaa2`, `rgba(88,170,162,…)`, light `#116d69`) and
  dark-text-on-accent buttons recolored; contrast fixed to white-on-blue.

### Per-kit notes

- **Tableau / Stats** — recolored the teal chart/curve series (Viz Builder
  palette, Distribution Lab histogram + mean line) to the blue accent family.
  No chart/stats logic touched.
- **Power BI** — uses a class-based (`.light`) theme rather than the
  `data-theme` attribute; handled accordingly. Prereq banner amber preserved.
- **Final** — per-subject color block (`--c-excel`, `--c-sql`, …) left intact;
  added light-mode `--good/--warn/--bad` so semantics stay correct.
- **Amber Bare Basics** highlight (`#e0b84a`) preserved across all kits.

Verified: zero teal in any rendering path, zero Google Fonts, light default +
nav chip present in all 9, file integrity intact (no truncation, all JS
preserved).

---

## [1.5.0] — 2026-05-31 — Hub re-skin to the Nocito calm-analyst design system

Applies the shared **Nocito Web Design System**
(`spreadsheet-archaeology/DESIGN_SYSTEM.md`) to the hub page only
(`index.html`). The nine module apps keep their teal aesthetic for now —
this was a deliberate scope call (Mike: "hub page only, now") to avoid a
big-bang change across the complex interactive kits and to respect the
strict one-item-at-a-time workflow. Accent switched from teal to the
system's blue (`#2f6df0`) for cross-portfolio consistency with the
landing page (Mike: "switch to system blue").

This is look-and-feel only. No saved-progress keys, kit URLs, or JS
behavior changed — all progress adapters, the Continue card, Bare Basics
cross-kit mode, and the theme toggle work exactly as before.

### Changed

- **Light calm-analyst theme** is now the hub default: soft cool-gray
  background, white cards, system-font stack (drops the Google Fonts
  Hanken Grotesk + JetBrains Mono — instant, offline-capable),
  Consolas/ui-monospace for code + progress readouts.
- **Top orientation bar** — logo + brand ("Analyst Prep Kit" /
  "Break into data analytics") + a "Free · No login" phase chip + the
  theme toggle, styled as the system's sticky top bar.
- **Welcome card hero**, **Say It Out Loud** restyled as the system's
  voice/card, **Continue** + **Bare Basics** + **beta banner** restyled
  as accent-rail cards. Kit cards adopt the generic-card look with calm,
  semantic per-kit left rails (green/blue/warm/purple).
- **Theme toggle preserved.** The toggle still writes the cross-kit
  `apk-theme` flag; the hub now ships a restrained dark variant of the
  same design tokens (not the old teal), so dark mode still works and
  still carries into the kits. Default flipped dark → light to showcase
  the calm-analyst look.

### Note

The 9 module pages (excel / sql / python / tableau / stats / powerbi /
interview / simulator / final) are unchanged and still use the teal
theme. Re-skinning them is a separate, larger cycle — they're complex
interactive apps and the design system's own rule is "never assume the
same render fix works in every kit."

---

## [1.4.1] — 2026-05-28 — Pedagogy fixes (SQL HAVING, Power BI prerequisites, Python types/imports)

Closes GR-F-1, GR-F-2, and GR-F-3 from the May 28 10:46 PM ET pedagogy
audit. All three are content-only fixes that close knowledge-building
gaps where lessons/drills referenced concepts before they were
formally introduced.

### Fixed

**SQL (GR-F-1)** — Bug-hunt drill #4 ("HAVING used instead of WHERE")
forced users to engage with HAVING before Lesson 7 formally teaches
it. Replaced with a NULL-handling bug ("Using = with NULL") which
fits the WHERE territory that's already been covered. Also removed
the `HAVING` mention from drill #3's clause-order hint. Lesson 7's
intro updated to acknowledge "you've already used WHERE" so the
transition to HAVING feels like a build-on rather than a cold-start.

**Power BI (GR-F-2)** — Added a prominent amber prerequisite banner on
the Power BI home view: "Heads up — Power BI assumes some background.
The DAX unit (Lessons 5–8) borrows syntax from Excel formulas and
concepts from SQL filtering and aggregation. New to both? Work through
the Excel Kit or SQL Kit first." Banner links to both kits directly.
Lesson 5's intro updated with a soft prerequisite reminder.

**Python (GR-F-3)** — Lesson 1's intro previously listed the four types
by abbreviation only (int / float / str / bool). Quiz asked about
"string" — a word the user hadn't seen yet. Intro now bolds each type
and gives its full name in parens: int (whole number), float (decimal),
**str (string — text in quotes)**, bool (boolean — True or False).
Lesson 4 now explains what `import` is on its first appearance:
"Think of it like clicking 'Open' on a toolbox before you can use the
tools inside."

### Audit grades (May 28, 2026 — 10:46 PM ET)
- Excel A−, Tableau A, Stats A, Interview A
- Python B+ (now fixed)
- Power BI B (now fixed)
- SQL C+ (now fixed)

Patch release (1.4.1) — content edits only, no UX or render changes.

---

## [1.4.0] — 2026-05-28 — Bare Basics mode now visually unambiguous (amber)

Closes the oldest open High item (May 27, 4:52 PM ET): Bare Basics
highlight used the same teal accent as the rest of the site, so users
couldn't tell that the highlight had meaning — it just looked like
default styling.

### Changed
- **Highlight color swapped from teal to amber** (`#e0b84a`) across
  every part of the Bare Basics visual language. Teal is the site's
  default accent and was reading as "just design." Amber is clearly
  not the default — it signals **"this is intentional, mode is on."**
- **Pill restyled as a sticker, not a chip.** The `★ BARE BASICS`
  pill next to highlighted lessons now has a solid amber background,
  dark text, a subtle drop shadow, and a 4px (sticker-style) radius
  instead of the previous 20px (pill-style). Looks like a label
  someone stuck on the item, not a design accent.
- **Active banner under the kit nav** (the `🔖 BARE BASICS MODE` row)
  is now amber-tinted with an amber 2px bottom border. Same on the
  Exit Mode button — amber border, amber text.
- **Card highlight ring** (the glow around must-know lessons) is now
  amber with an amber-tinted box-shadow. Non-basics lessons keep the
  existing dim treatment.
- **Hub "● Bare Basics is ON" pill** also flipped to amber + sticker
  shape, matching what users see inside each kit.

### Touched files
All 7 tool kits (excel, sql, python, tableau, stats, powerbi,
interview) — same 4-rule CSS swap in each — plus the hub
(`index.html`).

### Why amber
Teal is the site's accent everywhere — buttons, links, headings,
icons. Using it for the basics highlight made the highlight invisible
as a special state. Amber is in the palette already (`--warn` in
several kits used a similar value), so it doesn't introduce a new
brand color, but it contrasts strongly enough that a user in Bare
Basics mode instantly sees what's marked and what's dimmed.

Minor version (1.4.0) — visible UX change, no breaking behavior.

---

## [1.3.0] — 2026-05-28 — "Say It Out Loud" plain-English sentence rolls out to SQL, Python, Power BI, and the hub demo

Closes the Medium-bucket follow-up to v1.2.2. Mike hit the gap in the
wild (May 28, 12:08 AM ET) — opened the SQL kit, saw the line-by-line
breakdown was still missing the plain-English leader sentence. Promoted
from Medium to High and shipped same-cycle.

### Added
- **SQL Kit** — every Read-Aloud block in all 12 lessons now leads with
  a conversational sentence above the chunk-by-chunk breakdown.
  Examples:
  - `SELECT name FROM customers WHERE status = 'active';` → *"Give me
    the names of customers whose status is 'active'."*
  - `SELECT a.id FROM customers_old a LEFT JOIN customers b ON a.id =
    b.id WHERE b.id IS NULL;` → *"Find the IDs from customers_old that
    don't exist in the customers table — useful for spotting rows
    that were dropped between versions."*
- **Python Kit** — every formula RAL block across all 12 lessons gets
  the same treatment (30+ formulas authored). Tone matches the
  conversational style established in v1.2.2's Excel pass.
- **Power BI Kit** — every Read-Aloud block in all 12 lessons gets the
  leader sentence (interface tour, Power Query, DAX measures, time
  intelligence, dashboard design, publishing).
- **Hub Say-It-Out-Loud demo card** — the SQL example on the home
  page now leads with *"Give me the names of customers whose status
  is 'active'."* before the chunk breakdown, matching what users will
  see inside every kit.

All four updates use the same `.ral-say` / `.method-say` CSS pattern
established in v1.2.2: italic body text, faint accent tint, left
accent border, 🗣️ prefix. Visually distinct from both the formula
above and the breakdown lines below.

### Render changes
- SQL render: injects `${l.ral.say}` between `ral-sql` and the chunk
  lines.
- Python render: injects `${r.say}` per RAL block, inside the same
  `forEach` that renders the formula and lines.
- Power BI render: injects `${l.ral.say}` between `ral-code` and the
  chunk lines.
- Hub demo: static `<div class="method-say">` between the `<code>`
  block and the method-line breakdown.

Minor version (1.3.0) — visible content addition across multiple kits.

---

## [1.2.3] — 2026-05-27 — Final Exam: cold entry lands on Home (GR-1)

Closes GR-1 from feedback batch #3 (May 27, 5:43 PM ET).

### Fixed
- Clicking the Final Exam kit card from the hub previously dropped
  the user wherever they had last navigated inside the Final Exam —
  often the Study Guide if they had ever followed a `#study` deep
  link. That made the "Take the Exam" CTA invisible on entry.
- Now: any cold entry to `/final/` (URL has no hash) always lands on
  Home with the two big CTAs. Saved `state.view` is still honored
  within a session for back-button behavior, but does not carry over
  across cold visits. URL deep links (`#study`, `#study-sql`, `#exam`,
  etc.) still work as before.

Single-line state-hydration change. Patch release.

---

## [1.2.2] — 2026-05-27 — Excel RAL plain-English leading sentence

_Verified pass on all three checks at May 27, 2026 — 8:03 PM ET._

Closes the second half of the RAL feedback (May 27, 4:52 PM ET → 6:25 PM
ET refinement → 7:42 PM ET re-clarification). v1.2.1 fixed the line
order; this ships the plain-English sentence that should have been
included in the same cycle.

### Added
- A `say` field on every formula RAL block in Excel — a conversational
  sentence that reads the formula's intent in plain English, using the
  actual cell refs from the formula. Examples:
  - `=SUM(B2:B10)` → "Give me the sum of everything in B2 to B10."
  - `=VLOOKUP(A2, products!A:D, 3, FALSE)` → "Find A2 in the products
    table and return the value from column 3 — exact match only."
  - `=IFERROR(D2/E2, 0)` → "Divide D2 by E2; if that errors (like
    dividing by zero), return 0 instead."
- Rendered as a new `.ral-say` block between the formula and the
  chunk-by-chunk breakdown. Italic body text on a faint accent tint,
  prefixed with 🗣️ to tie back to the Say-It-Out-Loud methodology
  card on the hub.

### Not touched (yet)
- SQL, Python, Power BI, and the hub's SIOL demo card: same pattern
  applies but content authoring is its own cycle. Tracked as the
  Medium-bucket follow-up item.
- Excel conceptual RAL blocks (PivotTable zones, build steps, slicer
  workflow, dirty-data checklist): not formulas, so no sentence added.

### Cycle history
v1.2.2's content was originally split off into a future Medium item.
Should have shipped with v1.2.1 — Mike flagged it both at 4:52 PM ET
("partial 2" with the leading-sentence request) and again at 7:42 PM
ET ("you did not put it in"). Process improvement: when a partial
test result references a known roadmap item, ask whether that item
is the current-cycle blocker before deferring it.

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
