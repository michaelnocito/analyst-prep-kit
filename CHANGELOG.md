# Changelog

All notable changes to the Analyst Prep Kit. Loose Keep-a-Changelog
conventions; semver where it makes sense for a static-site product:
- `MAJOR.MINOR.PATCH`
- PATCH = bug fixes only (no UX change)
- MINOR = new features or visible UX changes, no breaking content reorg
- MAJOR = structural changes that invalidate prior progress / URLs

---

## [1.27.0] — 2026-06-03 — "Know Your Workspace" UI module (Tableau, Power BI, Excel)

New feature addressing the UI-learning wall (separate from the knowledge wall):
learners struggle with "where is that button," not just concepts. Researched the
best fit for our setup (labeled-graphic + hotspot quiz win for UI learning at low
cognitive load) and built it across the three GUI-tool kits. June 3, 2026 —
12:54 PM ET.

- **New 🧭 Workspace module** (nav entry in Tableau, Power BI, Excel) with two
  phases on one interface mockup: **① Tour** (tap a panel → it explains itself)
  and **② Find it** (a hotspot drill — prompt asks "where would you…", you tap
  the correct region; green/right, red/wrong, same feedback as tap-the-choice).
- **Accessible from anywhere** via the nav, AND woven into the lesson flow:
  a "🧭 New here? Tour the workspace" CTA on each kit's interface/first lesson
  (Tableau L1 & Power BI L1 "Interface"; Excel L1, since Excel has no interface
  lesson — built a fresh Excel mockup: ribbon, name box, formula bar, column
  headers, grid, sheet tabs).
- Per-kit wiring respected: Tableau/Excel use `show()` + `#view-workspace`;
  Power BI uses `navigate('workspace')` into `#main` (+ nav active-map entry).
  New `.ws-spot` hotspot CSS (hover/lit/good/bad) in each kit.

Headless-verified: all three kits' inline scripts syntax-clean; module + nav +
hotspot styles present in each.

## [1.26.0] — 2026-06-03 — Tableau cert beef-up, Cycle 2: Joins/Unions/Relationships (L15)

Cycle 2/7 of the Desktop Specialist push (exam Domain 1.2). June 3, 2026 — 12:33 PM ET.

- **New Lesson 15 — "Joins, Unions & Relationships"** (Unit 4). Tape-side-by-side
  (join) vs stack-rows (union) vs flexible-link (relationship) analogy; a "three
  ways to combine data" block, join-types block (inner/left/right/full), and a
  "when to use which" decision aid.
- **Visual:** an html three-mini-table diagram (Orders + Products lookup → joined
  on ProdID) using the lesson `viz` html path — no dataset change.
- **Misconception bust (the exam's favorite trap):** relationship vs join — a
  join flattens immediately and can double-count on grain mismatch; a
  relationship preserves each table's grain and joins per worksheet.
- **3 guided tap-the-choice drills:** ESQL "stacking rows = Union" (idx 14),
  WRONG "SUM doubled = join grain mismatch, use relationship" (idx 13), FILLS
  "side-by-side on a key = Join" (idx 14). `LESSON_DRILLS[15]` added.

Headless-verified: 3 scripts clean; 15 sequential lesson ids; FILLS/ESQL=15,
WRONG=14; LESSON_DRILLS keys 1–15.

## [1.25.0] — 2026-06-03 — Grouping lesson: visuals for the new sections

Mike (playtest): the Grouping lesson's added breakdown blocks were text-only and
"need visuals, especially the where-did-it-go part." June 3, 2026 — 12:30 PM ET.

- **Engine:** `renderLesson` now renders an optional `html` per breakdown (RAL)
  block, so any block can carry its own inline visual (not just the one top-of-
  lesson `viz`). Small, reusable addition.
- **"Where did my group go?"** now shows a **mock Data pane** — Dimensions list
  with the new **📎 Product (group)** field highlighted at the BOTTOM and an
  "⬅ lands here" callout. Directly answers the question visually.
- **"3 ways to group"** gets a 3-method → one-field flow diagram (in the view /
  headers / Data pane → 📎 one grouped field).
- **"Group vs. Set vs. Hierarchy"** gets a 3-up icon comparison
  (📎 Group · ◐ Set IN/OUT · ▸ Hierarchy).

Headless-verified: 3 scripts clean; block.html path live.

## [1.24.0] — 2026-06-03 — Tableau cert beef-up, Cycle 1: Live vs. Extract (L14) ✅ playtested PASS (June 3)

First lesson of the Tableau Desktop Specialist cert push (see `TABLEAU_CERT_PLAN.md`).
Targets exam Domain 1 (Connecting & Preparing Data, 25% — previously almost
entirely missing). June 3, 2026 — 12:23 PM ET.

- **New Lesson 14 — "Live vs. Extract Connections"** in a new **Unit 4:
  Connecting & Preparing Data (Cert Domain 1)**. Phone-line-vs-photocopy analogy,
  a Live/Extract trade-off breakdown, a "when to use which" decision aid, an
  html two-panel visual, and the misconception bust ("publishing keeps data
  current" → no, an extract is a frozen snapshot until refreshed).
- **3 guided tap-the-choice drills** wired in: ESQL "where do you create an
  extract" (idx 13), WRONG "stale dashboard = un-refreshed extract" (idx 12),
  FILLS ".hyper snapshot = Extract" (idx 13). `LESSON_DRILLS[14]` added.
- **Appended** (ids stay sequential, no renumbering of L1–13). Side effect: the
  "finish line" moved — L13 no longer ends the kit, L14 does.

Headless-verified: 3 scripts clean; 14 sequential lesson ids; FILLS/ESQL=14,
WRONG=13; LESSON_DRILLS keys 1–14.

## [1.23.2] — 2026-06-03 — Grouping lesson: deeper basics for struggling learners

Mike's class is struggling with grouping-method decisions; he asked for more
basics — how the methods are the same/different, use cases, how-to, and the
specific "why don't view-created groups show in the Data pane?" question
(June 3, 2026 — 12:10 PM ET). Verified the actual Tableau behavior against the
official docs before writing (Tableau Help: Group Your Data; Organize Fields in
the Data Pane). Rebuilt the lesson body into four breakdown blocks:

- **"3 ways to group — same result, different starting point"** — in the view
  (marks), in the view (headers), and from the Data pane (Create ▸ Group), with
  the key point that **all three produce the same single grouped field**.
- **"Where did my group go? (the Data-pane gotcha)"** — corrects the common
  misconception: view-created groups **are** saved as a reusable `[Field]
  (group)` paperclip field — they just land at the **bottom of the Dimensions
  list** (not next to the original), and the view swaps the shelf pill, which is
  why they look like they vanished. Data-pane method = surest path to reuse.
- **"Group vs. Set vs. Hierarchy — when to use which"** + a quick decision cue.
- Note rewritten to explain *why* the three get confused (static merge vs.
  dynamic in/out vs. drill-down nesting).

## [1.23.1] — 2026-06-03 — Grouping lesson: methods + Group/Set/Hierarchy

Mike asked to make sure the new Grouping lesson covers **how to choose the best
grouping method** (June 3, 2026 — 11:48 AM ET):

- Added a second breakdown block, **"Ways to make a group — pick the method that
  fits"**: Visual (select marks → paperclip), Header select, Data-pane dialog
  (best for long lists), Group-by-another-field, and Hierarchy (noted as a
  separate drill-down tool, not a merge).
- Expanded the note to **"Choosing the method"** + a clear **Group vs. Set vs.
  Hierarchy** distinction with a quick decision cue (Electronics-as-one-bar →
  Group; top performers that update → Set; expand Category into products →
  Hierarchy).

## [1.23.0] — 2026-06-03 — Tableau: new Grouping lesson

Mike's class is covering Tableau **Groups**, and the kit had no section on it
(the word "group" only appeared incidentally). Added a dedicated lesson
(June 3, 2026 — 11:33 AM ET):

- **New Lesson 9 — "Grouping"** (Unit 2: Building Better Vizzes). Teaches
  combining several dimension members into one named member, using the kit's
  coffee dataset: group **Espresso Shot + Latte + Cappuccino + Mocha → "Espresso
  Drinks"** and **"Group Other"** to roll the rest into a single "Other" bar —
  i.e. the group-vs-everything-else comparison Mike described (electronics-aisle
  analogy in the opener).
- **"See it on screen" visual** — an HTML two-bar comparison (Espresso Drinks vs
  Other), no Chart.js needed.
- **Group vs. Set note** — clarifies group (static buckets) vs. set (dynamic
  in/out, Top N, conditions).
- **Quick check** + **3 new tap-the-choice drills** wired into the guided path:
  a Fill-in-the-Blank (`Group`), a Describe→Tableau (`Group Other`), and a
  Fix-the-Config bug (check "Group Other"). All at index 12 of FILLS/ESQL/BUGS.
- Unit 3 lessons renumbered 9→10 … 12→13 (ids stay sequential for next-lesson
  nav); `LESSON_DRILLS` rewired accordingly. Now **13 Tableau lessons**.

Headless-verified: 3 inline scripts syntax-clean; 13 sequential lesson ids;
FILLS/BUGS/ESQL at 13 items; LESSON_DRILLS keys 1–13.

## [1.22.0] — 2026-06-03 — Tap-the-choice drills rolled to all kits

Following the Tableau conversion, Mike asked to roll the same tap-the-choice
treatment to the rest. Converted every remaining free-text drill (June 3, 2026 —
11:04 AM ET):

- **Bug Hunt / Fix-the-Code / Fix-the-Formula** — SQL, Power BI, Python, Stats,
  and Excel were all "type the fix." Now each shows the broken code/formula and
  **3 tappable fix options** (one correct + two distractors); tap the right fix,
  wrong taps mark red and disable, hint/answer still available.
- **Describe → X** — Stats and Excel had free textareas. Now **tap-the-phrase**:
  the prompt plus short method/formula chips (e.g. `.mean(), .median(), .mode()`
  for Stats; `=SUM(D2:D100)` vs `=SUM(D2,D100)` for Excel).

Added a `choices` array (correct first, shuffled on render) to all converted
drills — 36 each for Stats/Excel (bugs + describe), 12 each for SQL/Python/Power
BI bugs. Replaced every `<textarea>`/`<input>` + answer-matching with a
data-correct tap handler. Applies to both the Practice tab and the guided
"Practice this" flow. **No free-text answer boxes remain in any kit's drills.**

Verified live across the three render architectures: navigate-based (SQL/Power
BI), item-state (Stats), and indexed (Excel/Python) — correct chip → ✓, wrong →
"try another," no input fields. Headless parse of all five kits is green.

---

## [1.21.0] — 2026-06-03 — Tableau drills: tap-the-choice, no more free typing

Mike: the Tableau practice/"Practice this" drills still had too much free-fill
text — should be minimal tap-the-word/phrase choice. Converted the two free-text
Tableau drill types (June 3, 2026 — 10:35 AM ET):

- **Bug Hunt** — was a "type the corrected code" textbox. Now shows the broken
  config and **3 tappable fix options** (one correct + two distractors); tap the
  right fix, wrong taps mark red and disable, the hint/answer still available.
- **Describe → Tableau** — was a free textarea. Now a **tap-the-word/phrase**
  question (like the fill-in drills): the prompt plus 3–4 code/term chips, tap the
  correct one (e.g. `COUNTD([Product])` vs `COUNT([Product])`, or the right IF
  expression).

Added a `choices` array (correct first) to all 12 Bug and 12 Describe items;
choices are shuffled on render. Applies to both the standalone Practice tab and
the guided "Practice this" flow (shared renderers). Verified live: no input
fields remain, correct/wrong tap feedback works, long code chips render cleanly.

---

## [1.20.1] — 2026-06-03 — Fix: land on the action buttons after finishing a lesson

Mike: answering a lesson's Quick Check correctly bounced the page to the top (or
left you scrolled at the now-gone quiz), so you had to hunt/scroll for the
"Practice this / Next" buttons. Fixed across all 6 lesson kits — on completion
the lesson-complete card's action buttons are now smoothly scrolled into view
(Stats/Tableau scroll to the top where the short complete card sits; Excel/Python
center the complete card in the re-rendered lesson; SQL/Power BI scroll the
newly-appended button row into view). Verified live: buttons land within the
viewport in every kit (June 3, 2026 — 12:08 AM ET).

---

## [1.20.0] — 2026-06-02 — Hub follow-ons: mini-exam badge + Bare Basics progress

Two hub (root `index.html`) features Mike greenlit (June 2, 2026 — 11:56 PM ET):

- **Mini-exam score on each kit card.** The Final Exam now persists per-section
  scores (`apk-final.sectionScores`); the hub reads them and shows a badge on
  each kit card — **"✓ Exam 4/4"** (green) once a subject's mini-exam is passed
  (≥75%), or **"📝 Exam 2/4"** (grey) if taken but not yet passed.
- **Bare Basics cross-kit progress.** The hub's Bare Basics card shows
  **"🔖 Bare basics: X of 6 subjects complete"** — computed by checking each
  lesson kit's core (must-know) lessons against its saved progress. Hidden until
  at least one subject's basics are done.

Also (GR-D extended, **proof slice**): added tasteful parenthetical analogies to
4 Excel quiz explanations (e.g. "A number stored as text is a price tag written
in crayon — looks right, won't scan"). Pending Mike's read on whether to roll the
quiz/glossary analogy treatment across all kits — recommendation is to keep it
sparing (intros already carry the analogy load; over-applying risks repetition).

Verified: headless parse of hub + final; live check with injected state — SQL
card showed "✓ Exam 4/4", Excel "📝 Exam 2/4", basics pill "1 of 6 subjects".

---

## [1.19.0] — 2026-06-02 — Per-kit mini exam + Excel/Python nav overflow fix

Closing out the active backlog (June 2, 2026 — 11:44 PM ET):

- **Per-kit mini exam.** Every lesson kit (Excel, SQL, Python, Tableau, Stats,
  Power BI) gets a **"📝 Exam"** entry in its nav that deep-links to that
  subject's section of the Final Exam (`final/#exam-<subject>` — new hash route
  that opens the exam and scrolls to the section). The learner answers that
  subject's questions and submits just that section (reusing the GR-C per-section
  logic), getting an immediate score. **No content duplication** — the Final
  Exam's question pool stays the single source of truth. _(Deferred: marking the
  kit "complete" on the hub when the mini exam is passed — that's cross-kit hub
  state for a later cycle.)_
- **GR-G — home/Excel makeover:** investigated. Excel's home is already
  hero-led and modern (leads with the resume/Continue card, Pivot Lab prominent,
  no 3-tile grid), so no redesign was warranted. The one real defect was a
  **horizontal-scroll bug**: Excel's and Python's nav bars had `flex-wrap:nowrap`,
  so on narrower windows the buttons pushed the page ~190px wide and created a
  sideways scrollbar. Fixed (added `flex-wrap:wrap` + `min-height`); the other 5
  kits already wrapped. Mike confirmed the home is otherwise fine as-is.

With this, every active roadmap bucket is clear (parking lot excluded). Verified:
headless parse of all touched kits + live check that the Exam deep-link opens the
right Final Exam section with its submit button.

---

## [1.18.0] — 2026-06-02 — GR-D: every lesson opens with a real-world analogy

Mike's GR-D (and his own "VLOOKUP is like a phone book" rule): lead each lesson
with a concrete non-tech analogy before the technical detail, so beginners get a
mental hook first. Done across **all 6 lesson kits — 72 lessons** (June 2, 2026 —
11:22 PM ET). Examples:

- Excel: IF = "a bouncer at a door"; PivotTable = "a junk drawer sorted into bins";
  dates = "a number wearing a costume"; IFERROR = "a safety net under a trapeze."
- SQL: WHERE = "a guest list at the door"; LEFT JOIN = "taking class attendance";
  CTE = "prepping ingredients before you cook"; window fn = "ranking runners
  without pulling anyone off the track."
- Python: DataFrame = "a spreadsheet that lives inside Python"; GroupBy =
  "split-apply-combine of a bake sale"; merge = "a coat check."
- Tableau: dashboard = "a car's dashboard"; Story = "a slideshow that's still
  plugged in"; aggregation = "what a town's 'income' means."
- Power BI: star schema = "a hub airport"; CALCULATE = "changing the channel
  before you read the guide"; publish = "moving a doc to a shared drive."
- Stats: spread = "two pools both '4 ft deep on average'"; hypothesis test = "a
  courtroom"; A/B test = "a taste test with two cups"; CI = "a forecast's range."

The analogy is the first sentence; the existing technical explanation follows
unchanged. (Excel/SQL/Python/Tableau/Power BI lead the lesson `intro`; Stats has
no intro field, so the lead goes on the first section body.) Verified: headless
parse of all 6 kits + live check that the analogy renders first in both lesson
structures. Remaining GR-D scope (quiz explanations, glossary, every `say` line)
not yet swept — intros were the highest-leverage pass.

---

## [1.17.0] — 2026-06-02 — Backlog sweep: GR-C, GR-E, GR-A (Mike: "go for all")

Three High-priority roadmap items, shipped together at Mike's request and each
smoke-tested live (June 2, 2026 — 11:05 PM ET):

- **GR-C — Final Exam per-section submit + cumulative grade.** Each subject now
  has its own "Submit this section" button; submitting locks + grades just that
  section. The top bar offers "Submit all & finish" once everything's answered.
  Results show your score across only the submitted sections (partial, "in
  progress") with a "finish the rest" prompt, and the full grade once all 7 are in.
- **GR-E — Bug Hunt "Check My Fix" input** on **SQL & Power BI** (they were
  Reveal-Fix-only). A textarea + "Check My Fix" validates the attempt against the
  fix (whitespace/case-tolerant, 80% token match) before Reveal stays as fallback.
  Works inside the guided flow too.
- **GR-A — Bare Basics cross-kit handoff.** Finishing a kit's last must-know
  lesson with Bare Basics on now shows "🔖 [Kit] bare basics done — Next: [next
  kit] bare basics →" (Excel→SQL→Python→Tableau→Stats→Power BI→Interview→Final),
  instead of dead-ending at the Final Exam. Hidden when Bare Basics is off.

Verified: headless parse (all touched kits green) + live browser smoke
(per-section lock/partial-score; fix-checker pass/fail incl. loose whitespace;
handoff shows only with basics-on + all-core-done and links to the right kit).

_Still open (large / needs design input): per-kit mini exams, GR-D analogy
sweep, and the GR-G home-simplify + Excel-makeover threads._

---

## [1.16.0] — 2026-06-02 — Lesson visuals now on EVERY lesson (full coverage)

Mike asked to fill the ~15 concept lessons skipped in v1.15.0. Done — all **72
lessons across all 6 kits** now have a "See it on screen" visual (June 2, 2026 —
10:21 PM ET). New this round:

- **Tableau** (5 added → 12/12) — a labeled **interface mockup** (Data pane /
  shelves / Marks / canvas) for the interface lesson, a **calculated-field result
  table** (new Avg Price column highlighted), a **tiled dashboard mockup**, a
  **reference-line chart** (dashed line auto-drawn at the real average), and a
  **Story Points** sequence mockup. Renderer extended with `html` (mockups),
  `table`, and `refline` support.
- **Stats** (5 added → 12/12) — probability bars, biased-vs-true-population
  comparison, a null-distribution bell curve, a p-value-vs-α bar, and a
  **confidence-interval floating bar** (new `ci` chart type).
- **Power BI** (5 added → 12/12) — hand-built mockups: the **Desktop interface**
  (canvas / Visualizations / Fields panes), **Power Query** Applied Steps, a
  **star-schema** diagram (fact + dimension tables), a **report-hierarchy**
  layout, and a **publish→workspace→share** flow. Renderer gained an `html` branch.

**Verification:** headless parse of all 6 kits (green) + live browser smoke test.
The smoke test caught + fixed a correctness bug: Tableau's reference line was
hardcoded at 320, but the real Contoso region totals are ~10× that, so the dashed
line sat at the floor — changed it to auto-compute the actual average (now 1,133,
correctly between the West bar and the rest). Friction check: every visual sits
after the explanation and before the gotcha/quick-check, so the order still guides.

---

## [1.15.0] — 2026-06-02 — Lesson visuals rolled out to every kit ("See it on screen")

Mike approved the prototype style and asked to roll it out across all kits, then
headless-test, smoke-test, and check for UI friction. Done (June 2, 2026 — 9:54 PM
ET). **57 lessons** now show what the concept/output actually looks like, each
placed right where it anchors the mental model (after the explanation, before the
gotcha/quick-check) — so the order still guides the learner:

- **Tableau** (7 lessons) — shelf-config pills + the live Chart.js chart they
  produce (bar/line/scatter, value-sorted where the lesson preaches sorting).
- **SQL** (12) — the result table each query returns, with NULLs styled.
- **Excel** (12) — a mini spreadsheet: fx formula bar + A/B/1-2-3 grid with the
  result cell highlighted.
- **Python** (12) — the code's real output: a console block and/or a dataframe
  table with the pandas index.
- **Stats** (7) — a Chart.js visual of the concept (outlier bar, spread
  comparison, IQR, right-skew histogram, bell curve, correlation scatter, A/B bars).
- **Power BI** (7) — a KPI card (DAX measure result) + proportional HTML bars.

All driven by a reusable per-kit `viz` lesson field. Dependency-light: pure HTML
where possible; Chart.js only in the two kits that already loaded it.

**Verification:** headless parse of every kit's inline JS (all green) + a coverage
script confirming each `viz` is wired. **Smoke-tested live** in a local browser —
all six distinct renderers confirmed rendering (Tableau/Stats charts, SQL table,
Excel grid, Python output, Power BI card+bars). **Friction check** caught + fixed a
real bug: Stats opened the lesson view *after* rendering, so its Chart.js canvas
drew at 0×0 (blank) — reordered so the view is visible before the chart draws.

---

## [1.14.0] — 2026-06-02 — Lesson visuals: "See it on screen" (Tableau prototype)

Mike's note: lessons describe a config (shelves, pills, mark type) and ask the
learner to picture the result before they have any mental image of it. Fix:
show the thing. Added a **"📺 See it on screen"** block to a lesson that renders
the shelf config as colored pills (blue dimensions / green measures) **next to
the actual chart those shelves produce** (Chart.js over the kit's Contoso data).

Prototype scope — **two Tableau lessons** so the style can be judged before
rollout:
- **Lesson 3 "Your First Bar Chart"** → Columns: Region · Rows: SUM(Revenue) →
  renders the sorted bar chart.
- **Lesson 4 "Line Charts & Time"** → Columns: MONTH(Order Date) · Rows:
  SUM(Revenue) · Color: Category · Mark: Line → renders the multi-line trend.

Driven by a reusable `viz` lesson field, so rolling out to more lessons/kits is
mostly data, not code. Theme-aware (dark/light). Parse-verified.

**Pending Mike's sign-off on the style** before rolling out across Tableau and
the other kits — where the right visual differs by kit (SQL → result table,
Excel → cell grid, Python → output/df, Stats → distribution chart, Power BI →
visual + DAX result).

---

## [1.13.0] — 2026-06-02 — Guided Path built on SQL, Stats & Power BI

The Guided Path (finish a lesson → practice that lesson's own drills → next
lesson) now exists on **SQL, Stats, and Power BI** — previously only Excel,
Python, and Tableau had it. Each lesson-complete screen leads with a
**"Practice this →"** button that walks the drills tied to that lesson, with a
progress dot bar, a "← Back to lesson" exit, and a "Skip →" per step; finishing
the last drill rolls into the next lesson (added June 2, 2026 — 7:59 PM ET).

- **Every drill is linked to the first lesson it applies to** — full coverage,
  each drill walked exactly once:
  - SQL — all 36 (FILLS/BUGS/PARSONS ×12).
  - Power BI — all 36 (FILLS/BUGS/PARSONS ×12); concept lessons 1/3/11/12 have
    no DAX drills, so the flow advances past them.
  - Stats — all 60 (FILLS/BUGS/WRONG/PARSONS/ESQL ×12); L5 (Probability Basics)
    has no matching drills and is skipped.
- Stats reused the Tableau-style guided code (same render signatures). SQL and
  Power BI use a flag-based guided mode layered over their existing
  `navigate()`/`#main` drill renderers — normal Practice browsing is unchanged
  (any top-nav click exits the guided flow).

Verified headlessly: every inline script parses, and a coverage script confirms
each drill index 0–11 of every array is linked exactly once. **Interview kit
intentionally excluded** (its rate-the-answer / multiple-choice structure needs
its own design — Mike's call). Mike playtests the three on the live URLs.

---

## [1.12.0] — 2026-06-02 — Guided Path now links EVERY drill (Tableau, Excel, Python)

Mike's note: in the Guided Path kits, every practice drill should be reachable
from the first lesson it applies to — but the `LESSON_DRILLS` maps had gaps, so
some drills were orphaned (never walked by the guided flow). Rebuilt the maps for
**full coverage** (verified June 2, 2026 — 7:46 PM ET):

- **Tableau** — was leaving 7 drills unlinked (fills4, esql2/4/8, bugs11,
  parsons6/11). Now all 60 (FILLS/ESQL/PARSONS/BUGS/WRONG ×12) appear exactly once.
- **Excel** — added the 6 orphaned drills (AVERAGE-range bug → L1; COUNTIF/COUNTIFS
  fill/what's-wrong/Parsons → L5; LEFT Parsons + TRIM describe→Excel → L10) and
  de-duplicated the SUMIF "what's wrong" that was double-linked. Pivot Lab pseudo-
  steps for the concept lessons (6/7/8) preserved. All 60 covered once.
- **Python** — added the one orphan (export-to-CSV Parsons → L12). All 60 covered.

Each drill assigned to the FIRST lesson whose topic it matches. Verified by a
coverage script (every index 0–11 of every drill array linked exactly once, no
dupes, no out-of-bounds) and a JS parse check on all three files.

Still to roll out (separate cycle): the Guided Path itself is **not yet present**
on SQL, Stats, Power BI, or Interview.

---

## [1.11.0] — 2026-06-02 — Tableau: tap-the-word fills + feedback that persists

Two Tableau-kit fixes (reported June 2, 2026 — 7:36 PM ET):

- **Fill-in drills are now Duolingo-style tap-the-word.** The old free-type
  answer box (which used an undefined `.inp` class, so it fell back to raw,
  "old-looking" browser styling) is gone. Each fill now shows the sentence with
  an inline blank and a row of word tiles styled to match Check / Show Hint —
  tap the word that belongs in the blank. Wrong tiles mark red and disable;
  the right tile fills the blank green. Removes the "I don't know the exact
  syntax/spelling" guesswork. All 12 fills rewritten with curated distractors.
- **Quick Check feedback persists.** Lesson quizzes no longer auto-advance after
  ~1.2s (correct) or hide the explanation after ~1.8s (wrong). Correct answers
  now show the explanation with a **Continue →** button (read at your own pace);
  wrong answers keep the explanation on screen and just re-enable the options.
- Also defined the previously-undefined `.inp`, `.code-block`, `.pars-piece`
  classes and `--txt2` / `--bord` vars the JS renderers reference, so other
  Practice inputs stop looking unstyled too.

Verified headlessly (all inline scripts parse; new `pickFill`/`fillChoices`
wired; old `checkFill`/`item.partial` removed). Mike playtests on the live URL.

---

## [1.10.0] — 2026-06-01 — Guided Path rolled out to Tableau

Guided Path now on the **Tableau** kit. After a lesson's Quick Check a complete
card offers **"Practice this →"** which walks that lesson's own drills (fill /
fix / Parsons / describe→Tableau / what's-wrong) then advances to the next
lesson. Topical `LESSON_DRILLS` map. Home gains a prominent **"Start/Continue
learning"** CTA + **"Open Viz Builder"**. Bare Basics banner toned to a quiet
link. Free jumping preserved (Lessons/Practice nav + Skip/All-lessons).

Verified headlessly (lesson → its drills → next lesson; fill/Parsons/what's-wrong
render & check inside the flow), zero console errors. Rollout remaining: SQL,
Power BI, Stats, Interview.

---

## [1.9.0] — 2026-06-01 — Guided Path rolled out to Python

Same Guided Path pattern from v1.8.0 (Excel), now on the **Python** kit. After a
lesson's Quick Check the CTA is **"Practice this →"** and walks that lesson's own
drills (fill / fix-the-code / Parsons / describe→Python / what's-wrong, plus a
Terminal step) before advancing to the next lesson. Topical `LESSON_DRILLS` map.
Home simplified (3-tile grid → prominent Python Terminal card + Resume hero).
Bare Basics banner toned down to a quiet link. Free jumping preserved.

Verified the full loop headlessly (lesson → its drills → next lesson; drill
checks work inside the flow), zero console errors. Rollout continues next:
SQL, Power BI, Tableau, Stats, Interview.

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
