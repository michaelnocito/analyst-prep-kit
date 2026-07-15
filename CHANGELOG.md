# Changelog

All notable changes to the Analyst Prep Kit. Loose Keep-a-Changelog
conventions; semver where it makes sense for a static-site product:
- `MAJOR.MINOR.PATCH`
- PATCH = bug fixes only (no UX change)
- MINOR = new features or visible UX changes, no breaking content reorg
- MAJOR = structural changes that invalidate prior progress / URLs

---

## [1.132.1] — 2026-07-15 — SQL kit: dark-mode text too faint (Mike)

- Dark muted text brightened `#A6ABB3` → `#C3C7CE` (zinc-sky stone-300);
  passed WCAG before but read faint on near-black.
- Flashcard definitions are primary content — now full text color in
  both modes instead of muted.

## [1.132.0] — 2026-07-15 — SQL kit: "Zinc & Sky" palette pilot

Pilot of a new color direction on the SQL kit only, chosen after a
bake-off of 2026-modern palettes (Mike picked B for light, C for dark):
- New `assets/grain/zinc-sky.css` token override, loaded after grain.css
  in `sql/index.html`. Re-points the Grain primitive ramps, so no markup
  or component CSS changed.
- Light mode: cool zinc neutrals + deep cyan primary (replaces cream/clay).
- Dark mode: zinc near-black surfaces + electric sky accent, micro-glow
  on progress bars; resume-card text flips to deep ink on the light
  sky gradient; sky buttons use ink text (contrast).
- Semantic hues modernized: emerald success, red danger, amber warning,
  indigo info (so info never collides with the cyan primary).
- If the pilot sticks, roll the override into Grain tokens proper and
  extend to the hub + remaining kits.

## [1.131.0] — 2026-07-15 — SQL kit: JOIN Lab reworked to challenge-first with progressive scaffold

Mike follow-up on v1.130.0: focus should be the terminal + "try these on your own,"
the rest optional. Reworked the JOIN Lab:
- **Removed the "Examples to try now" grid** — the lab is now the challenges. Each of
  the 4 challenges has its own terminal you type into.
- **Progressive scaffold, no hint button.** A static callout tells the learner to give
  each one at least 3 tries and explains the help. Every wrong Run escalates: miss 1
  fills the first third of the answer into the editor + adds a guidance line, miss 2
  fills two thirds + another line, miss 3 drops in the full answer. The light-grey help
  block under each terminal is persistent and grows one line per miss. A correct run
  greens and resets the counter. (Reuses the kit's `_labFillPartial` scaffold helper.)
- **Schema + INNER-vs-LEFT walkthrough demoted to collapsed "Reference" cards** below the
  challenges; a one-line table summary stays inline. Verified in-browser: miss 1/2/3 fill
  1/3 → 2/3 → full with 1/2/3 grey help lines, correct run resets. Removed dead
  `JOIN_EXAMPLES` / explorer functions.

## [1.130.0] — 2026-07-15 — SQL kit: JOIN Lab redesigned as an explorer + new COUNT guide

Playtest-triage batch (Mike's feedback via the tracker).

- **JOIN Lab rebuilt as a flat "JOIN Explorer."** The old one-task-at-a-time
  pager (with the small clickable dots that were easy to miss) is gone. The
  Lab is now one live terminal plus everything visible at once:
  - **Examples to try now** — a grid of six ready-to-run joins (INNER, LEFT,
    LEFT+IS NULL gap, JOIN+COUNT, JOIN+SUM, JOIN+WHERE). One click loads the
    query into the terminal, runs it, and shows a "what you'll see" line.
  - **Walkthrough** — the INNER-vs-LEFT side-by-side comparison, now open by
    default instead of hidden behind a task.
  - **Now try these on your own** — four open challenges. Write each in the
    same terminal; a per-challenge **Help** button reveals the approach and a
    worked answer (with a one-click "load into terminal").
  Same two tables, same sql.js engine; the change is purely presentation +
  interaction. Removed the dead `_joinTaskIdx` / `runJoinQuery` / `toggleJoinHint`
  paths; the Aggregation Lab's shared runner is untouched.
- **New guide: COUNT in SQL** (`guides/sql-count-function/`). Beginner article
  on `COUNT(*)` vs `COUNT(column)` vs `COUNT(DISTINCT)`, the NULL rule, COUNT
  with GROUP BY, and how analysts use COUNT to verify a data migration
  (row-count reconciliation, duplicate detection, completeness). Linked from
  the GROUP BY lesson notes, the sitemap, and the guide cross-link footers.

## [1.129.0] — 2026-07-13 — SQL kit: Card Drills lab + Put It All Together capstone

- New Lab tab **Card Drills**: every one of the 38 flashcard concepts is now
  runnable — each card gets 2-3 graduated prompts on different columns/tables,
  a live terminal, reveal-on-demand answers, and per-card completion tracking.
- Flashcards now link straight into their drill ("Practice it in the Lab →"
  on the reveal face).
- New Lab tab **Put It All Together**: a 4-step capstone mini-analysis
  (filter/sort → join+aggregate → HAVING+CASE segmentation → CTE+window
  ranking) answering a real business question; each step auto-checked by
  comparing the learner's result set to the reference query's.
- New embedded practice dataset: `products` (12 rows) + `sales` (180 rows,
  deterministic seeded generator — same data for everyone, includes NULL
  regions and customers that only exist in `customers_old` for gap/NULL/
  reconciliation drills). Existing lab tables untouched, so all prior lab
  tasks and expected row counts still hold. No hosted dataset needed —
  research confirmed sql.js handles this size in-browser easily.
- MySQL-flavored date cards (CURDATE, DATE_SUB, DATE_FORMAT, DATEDIFF) get a
  callout in their drills teaching the SQLite equivalent the lab actually runs.

## [1.128.0] — 2026-07-13 — Flashcards definition-first + Bug Hunt spoiler fix

- Flashcards now show the DEFINITION first; flipping reveals the term
  (retrieval practice: recall the name from the meaning). Applied in 8 kits:
  SQL, Power BI, Excel, Python, Stats, Tableau, Chart Literacy, Forecasting.
  Interview kit left question-first (its cards are Q→A, so the question IS
  the prompt side).
- Bug Hunt (SQL + Power BI): the ⚠ issue line stated the answer right under
  the broken code. It's now hidden until you pick the correct fix (or revisit
  a completed bug). Prompt reworded to "Spot the bug, then tap the correct fix."

## [1.127.0] — 2026-07-12 — SQL Lesson 105: external deep-dive link

- SQL kit, Lesson 105 (Set Up a SQL Database): intro now links a "second take"
  AI walkthrough (Gemini share) that answers the lesson's two spaced-recall
  questions in depth — CSV → queryable table steps, `_raw` rationale, and the
  three post-import verification queries.

## [1.126.0] — 2026-07-12 — 📣 Gems-style "Say It Out Loud" rewrite across all 7 lesson kits

Read-aloud lines now narrate the actual displayed code line-by-line, in order,
the way the Steam Hidden Gems portfolio SQL does (`--SELECT (display) the Name
column`, `--WHERE (keep only) rows with at least 2,000 reviews`) — instead of
loose vocabulary definitions untied to the shown query:
- **Every chunk is a real fragment of the displayed code**, read in the order
  it appears; multi-part expressions broken into their own rows.
- **Plain-verb glosses** open each reading (display / pull from / keep only /
  sort by / collapse rows sharing…), with concrete values read with meaning.
- **Functions explained on first appearance, then phased out** — later lessons
  use the plain reading (repetition to reinforce, then trust the learner).
- Kept at most one or two essential vocabulary rows per lesson where the
  reading itself doesn't cover them; purely conceptual read-alouds untouched.
- Coverage: SQL 45 lessons · Power BI 20 · Excel 12 · Tableau 10 · Chart
  Literacy 9 · Forecasting 5 · Python 5 (most Python lessons were already in
  the style). `say` sentences and all other lesson fields unchanged.
- Verified: inline-script parse gate on all 7 files, de-test suite (one
  pre-existing SQL chart-eyebrow check unrelated to this change), legacy 24,
  render-smoke all pages clean.

## [1.125.0] — 2026-07-10 — 🔁 Cert kits: per-concept confidence rater + needs-review filter + lesson deep links

Closes the loop between the three cert kits and their parent kits (Mike's ask:
low-friction visible links back to kit concepts + self-grading + filter to
what needs reinforcing, like the kits' confidence rater):
- **Every study-guide bullet is now a ratable concept**: ✗ Not yet · ~ Almost ·
  ✓ Have it chips (same semantics as the kits' rater; click again to clear),
  persisted in each cert kit's state (`state.conf`).
- **Needs-review filter**: a second button beside Expand-all — "Filter: needs
  review (N)" — collapses the study guide to ONLY low/mid-rated concepts
  (sections force-open, See-it/misconception blocks hidden for focus; empty
  domains drop out). Home shows a "🔁 N concepts flagged for review" callout
  linking straight into the filtered view. Deep-linkable via `#review`.
- **82 per-concept lesson deep links** (`LESSON_LINKS`, keyed domain-bulletIdx):
  "Open the lesson →" on each bullet that has a matching parent-kit lesson,
  e.g. Sets → tableau L17, CALCULATE → powerbi L7, Tables → excel L13. All
  targets machine-validated against the parent kits' actual lesson ids.
- **Parent kits gained `#lesson-<id>` deep-link support** (tableau/excel/
  powerbi): a window-load hash handler calls `openLesson()` / `navigate('lesson')`
  — on load (not setTimeout) so deferred Chart.js is ready for lesson vizzes.
- Headless verified: syntax on all 6 touched files; every LESSON_LINKS key in
  bullet-array bounds; every #lesson target exists in its kit.

## [1.124.0] — 2026-07-10 — 🎖️ TWO MORE CERT KITS: Power BI (PL-300) + Excel (MO-210); SQL cert skipped by design

Cloned the Tableau Cert Prep shell (v1.123.0) for the two other worthwhile
analyst certifications, after web research verified current blueprints:
- **`powerbi-cert/` — Microsoft PL-300 (Power BI Data Analyst Associate).**
  Blueprint verified against the OFFICIAL Microsoft Learn study guide (skills
  as of April 20, 2026): Prepare 25–30% · Model 25–30% · Visualize & Analyze
  25–30% · Manage & Secure 15–20% (secondary sources disagreed; official guide
  wins). Facts: 40–60 Q / 100 min / pass 700 / $165 / renews yearly via free
  online assessment. 50-question practice exam (14/14/13/9), 100:00 timer,
  mc + multiple-response, estimated /1000 scaled score vs 700. Study guide
  misconceptions: clean-it-in-DAX-later ❌ · calculated column vs measure ❌ ·
  drill down = drillthrough ❌ · RLS binds workspace editors ❌. localStorage
  `apk-pbicert`.
- **`excel-cert/` — MOS Excel Associate (MO-210, Microsoft 365 Apps).**
  5 objective domains (Worksheets & Workbooks 25–30 · Cells & Ranges 25–30 ·
  Tables 10–15 · Formulas & Functions 15–20 · Charts 15–20). 35-question drill
  at the real exam's 50:00 pace (10/10/4/6/5). Because MO-210 is
  PERFORMANCE-BASED (live tasks in real Excel), the kit carries an explicit
  format warning + "rep it in-app" framing throughout; results framed as a
  knowledge check, not a score prediction. Misconceptions: hidden-data travels
  (Inspect Document) · Delete ≠ clear formats · formatted range ≠ Table ·
  $ = currency ❌ · rebuild-the-chart ❌. localStorage `apk-excelcert`.
- **SQL cert: deliberately NOT built.** Research verdict: no widely recognized
  entry-level SQL certification exists; sources consistently rank practical
  SQL + portfolio over any SQL credential, and point analysts at PL-300
  instead. Documented here so it isn't re-litigated.
- Wiring: hub cards (each beside its parent kit) + progress registry entries,
  sitemap, hub meta 12→14 kits, cross-links among all three cert kits' footers.
  Both kits headless-verified (script syntax, question counts/shapes, unique
  ids, stray-character scan). Free, no pass gate, non-affiliation footers.

## [1.123.0] — 2026-07-10 — 🎖️ NEW KIT: Tableau Certification Prep (`tableau-cert/`)

A dedicated Tableau Desktop Specialist cert-prep kit — the capstone item 8 from
`TABLEAU_CERT_HANDOFF.md`, built in the Final Exam Kit's Grain shell:
- **Home**: exam facts (45 Q / 40 scored / 60 min / 750 scaled to pass / $100 /
  never expires) + official domain-weight bars + pointers into the Tableau Kit
  (Units 4–5 were built for Domains 1–2).
- **Study guide**: all four blueprint domains as collapsible sections in the
  kit's teaching style — say-it-out-loud phrasings, "when to use which"
  decision aids, See-it mini-visuals, and a **misconception-to-bust callout per
  domain** (extract auto-updates ❌ · parameter filters by itself ❌ · story =
  dashboard ❌ · blue = dimension ❌).
- **Practice exam**: 45 questions weighted exactly to the blueprint
  (D1 11 · D2 16 · D3 11 · D4 7), timed 60:00 with auto-submit (or untimed
  practice mode), multiple-choice AND multiple-response ("choose all that
  apply", exact-match grading like the real exam), grade-at-submit only,
  estimated 100–1000 scaled score against the 750 pass line, per-domain
  results bars with study-section deep links. All tap-the-choice, no free text.
- Wired in everywhere: hub kit card + progress registry (`apk-tabcert`),
  sitemap, GA4 tag, footer cross-links (Tableau Kit, Chart Literacy, Final
  Exam, Tableau Archaeology). Free (no pass gate) — cert prep is an acquisition
  page. Non-affiliation note in the footer.
- Verified headless: `new Function` syntax check on all inline scripts +
  structural checks (45 unique ids, per-domain counts, mc/ms answer-shape
  validation) — all pass.

## [1.122.0] — 2026-07-10 — 🧪 SQL Lesson 105 (Set Up a SQL Database): learning-science pass + workflow diagram

Reviewed against the SQL Quest learning-science findings plus fresh research
(Mayer multimedia principles, worked-example fading, pretesting effect, setup-
lesson dropout patterns):
- **New `flow` diagram type** (`svgFlowDiagram`) in the SQL kit's inline-SVG
  chart system — numbered vertical step flow with per-step ⚠ failure and
  ✓ success callouts attached to each node (spatial contiguity), final verify
  step highlighted (signaling). Reusable via `SQL_CHARTS[id]`.
- **Lesson 105 uses it**: create db → import CSV → name `_raw` → verify, with
  each gotcha on the node it belongs to. The old "steps table" in the
  "See it on screen" slot was removed (redundancy principle — it duplicated
  the diagram and wasn't a query result).
- **Pretest prompt** in the story ("commit to a guess: import first or CREATE
  first?") — a low-stakes guess before the reveal improves retention even when
  wrong — plus a matching "why this order?" line in the Say It Out Loud
  breakdown to close the loop (self-explanation prompt).
- **"You'll know it worked when…" success check** added to the Gotcha notes
  (COUNT matches + SELECT * LIMIT 5 eyeballs clean) — the standard mitigation
  for setup-lesson dropout.
Competitor scan (SQLBolt, Select Star SQL, Khan Academy, Mode): none teach the
CSV-import step at all — keeping it, well-scaffolded, is a differentiator.

## [1.121.0] — 2026-07-08 — 🎮 Project Studio: per-stage "How Steam Hidden Gems handled this" callouts

The worked example now walks beside you through the Build phase instead of only
living on the home screen. Added an `ex` field to four analysis stages, rendered
as an accent callout under the best-practice note when that stage is expanded:
- **Prepare** — the impossible flat `MAX(Positive)=100` that started it all.
- **Process** — the broken-header fix in a clean copy, raw file untouched.
- **Analyze** — threshold tuning (5,175 → 175) + the Portal 2 / Batman catches.
- **Share** — leading with the top-25 table, scope/assumptions stated up front.
Just-in-time: the real project's move for a stage shows exactly when the user is
working that stage. Verified in-preview (all 6 stage cards render, callout shows
per open stage, no console errors).

## [1.120.0] — 2026-07-08 — 🎮 Project Studio: worked-example card now a per-stage guided tour

Expanded the Steam Hidden Gems card from a repo link into a concrete stage
walkthrough: the actual scope question used ("Which Steam games are hidden gems
I'd love but have never heard of?"), plus how the real project handled Prepare
(the broken-header catch), Analyze (evidence-driven threshold tuning, 5,175 →
175), and Share/validate (catching Portal 2 / Batman: Arkham City as bad
records). Turns the static example into a tour of a real project at each stage.

## [1.119.0] — 2026-07-08 — 🎮 Project Studio: Steam Hidden Gems worked-example card

Project Studio's home now shows a "Worked example" card above Your Projects:
Steam Hidden Gems, the finished portfolio project built with this exact
Scope → Plan → Build → Present workflow (SQL over ~125k Steam games → 175 gems).
Card links to the public GitHub repo, whose README documents every stage —
data-cleaning story, evidence-driven thresholds, scope/assumptions, validation.
Gives new users a concrete "this is what done looks like" target before they
scope their own project, and cross-links the portfolio repo from the kit.

## [1.118.0] — 2026-07-07 — 📖 GR-D COMPLETE: analogy-first openers on quiz explanations + Gotchas, all 6 lesson kits

The remainder of GR-D (intros were done in v1.18.0): every quiz explanation (`exp:`/`explain:`) and Gotcha (`notes:`) now OPENS with a real-world non-tech analogy or concrete scenario — or already did and was left alone. ~730 strings reviewed, 92 rewritten (Excel 25 · Stats 16 · Tableau 15 · Power BI 15 · SQL 11 · Python 10). Opening-sentence-only edits; technical content preserved; `say`/ral lines exempt (literal formula readings). Sample anchors: WHERE = bouncer at the door · LEFT JOIN = class roster with an optional sign-up sheet · window functions = rank written on each report card · p-value = "how weird is 9 heads in 10 flips?" · H₀ = courtroom's innocent-until-proven-guilty · filter context = the room a question is asked in · TOTALYTD = trip odometer · `df2 = df` = two name tags on one box · VLOOKUP = reading a receipt left-to-right · named range = a contact in your phone. Bonus content fix: Tableau's Top-N quiz explanation claimed Top N evaluates AFTER other filters — corrected to match Tableau's real order of operations (and its own build exp). Interview/Simulator/Final already use scenario-based feedback (lighter pass not needed). All green: 51-script parse gate, 121 de-test, 24 legacy, 13-page render smoke.

## [1.117.0] — 2026-07-07 — 📊 Tableau: What's-Wrong drills now SHOW the broken chart

8 diagnostic What's-Wrong items (flat bars, single YEAR bar, truncated Y-axis, stacked scatter, crushed dual axis, no-trend-line discrete pill, one-dot scatter, equal treemap tiles) now render the misbehaving chart they describe — zero-dep inline SVGs in a new `TAB_WRONG_SVG` map, wired via Excel's `svg:` field pattern into `renderWrong`. Deliberate scope call closing the all-exercise chart audit: chart-CHOICE questions ("which chart type fits?") stay text-only ON PURPOSE — drawing the chart would reveal the answer. With this, every exercise where seeing the chart aids diagnosis has one; SQL/Python/PBI/Stats exercise banks had no text-only diagnostic chart items (their chart lessons already draw via SQL_CHARTS/PY_CHARTS/PBI_CHARTS/Chart.js).

## [1.116.0] — 2026-07-07 — ✅ Final Exam: last free-text answers converted to tap-the-choice

The exam's 3 typed fill-in questions (e3 COUNTIF, s4 ORDER BY/LIMIT, p4 pandas groupby) are now multiple-choice with hand-authored distractors — the last surface where a legitimately-correct answer variation could be marked wrong is gone. Fill machinery removed (input render branch, answerFill, regex grading, fill CSS, orphaned escape helpers); saved typed answers migrated out of localStorage so they can't grade as permanently wrong.

## [1.115.0] — 2026-07-07 — 🧹 Finish-line polish sweep: open interface items closed + full stable-build test pass

Pre-paywall stabilization pass — every open non-paywall lesson/interface item from the ROADMAP + cleanup lists, plus a full automated test sweep.

**Interface items closed**
- **Home "Lessons" section rollout complete (SQL · Power BI · Python):** per-unit progress bars + a 3-item "Next up" list on each kit's Home, matching Excel/Tableau. Next-up surfaces accessible lessons only (never locked premium ones).
- **Stats home fixes:** Skill Readiness now derives from the LIVE lesson set by unit (was frozen to hardcoded lesson1–10 keys — Unit 0 and lessons 11–12 were uncounted); Resume button shows lesson POSITION, not raw id; added a "Next up" card.
- **Excel resume card fix:** LESSON number + watermark now show position, not raw id (a Unit-0 resume read "LESSON 101") — the same fix the D+E ports applied everywhere else, backported to the source kit.
- **Excel v2 Close stage:** now offers a lesson-bound "Practice this →" CTA (guided-primary), matching every other kit's Done card. Generic "Practice drills" button dropped in its favor.
- **Mobile:** standalone practice Parsons Check buttons are full-width thumb-height CTAs on ≤600px, and Parsons chips/pieces wrap instead of clipping (SQL/Python/PBI/Tableau/Stats; Excel already had both).
- **Cross-links:** Excel, Python, Interview, Simulator, and Final now link Chart Literacy + Forecasting in their sibling-kit lists (closes the Low-bucket consistency item).
- **Dead CSS removed:** .fill-input/.drill-input blocks from the fill→MC conversion deleted in 6 kits (Final keeps its — the exam legitimately uses typed answers).
- **README refreshed:** 12 apps incl. Project Studio, the 7-stage retrieval-first lesson flow + spaced recall, Practice-arcade links.
- **sitemap.xml:** added the missing projects/ entry.

**Verified (hub exam badges):** the per-kit mini-exam "✓ Exam" pass badge on the hub already satisfies the "mark kit complete on exam pass" follow-on — no change needed.

**Full test sweep (all green)**
- Parse gate: 51 inline scripts across 15 pages, 0 failures.
- Behavioral suite (de-test.mjs): 121 checks green.
- Legacy harness modernized (auth-sync + apkPass stubs; obsolete flag-feature checks removed; new tap-choice drill-integrity check; practice-this check now walks the v2 Close stage): 24 checks green.
- NEW runtime render-smoke: all 13 pages boot and render in a stubbed DOM with no undefined/NaN leaks.
- Link crawl: every internal href resolves; all 17 external URLs return HTTP 200.
- Content scan: no mojibake, no template leaks.

## [1.114.0] — 2026-07-07 — ✅ All-kits: revisit completed lesson walkthroughs

Playtest fix (Mike, sql inbox): once a staged lesson was completed, reopening it
landed on the "Done" card with no way back to earlier steps short of a
destructive Reset. Applies to SQL, Python, Power BI, Stats, Tableau (v2 stage
flow); Excel already shows the full walkthrough when done, so it's unchanged.

- **Stage dots are now clickable**: jump back to any stage you've already
  passed — and once the lesson is done, jump to ANY stage (hover shows the
  stage name). Non-destructive: your ✓ and quiz results stay.
- **← Back buttons added** on the Build It and Quick Check stages (they were
  the only stages without one), including the Quick Check retry re-render.
- **↺ Review lesson button** on the Done card: walks back to the start of the
  walkthrough without clearing completion (unlike ↺ Reset, which still exists
  for a true redo).

---

## [1.113.0] — 2026-07-06 — ✅ All-kits sweep: no auto-advance on lesson checks

Extends the v1.111.0 SQL fix (Mike's check-all-kits playtest blocker) to every
other kit with the same `setTimeout(...advance...)` pattern:

- **Python, Power BI, Tableau, Stats** (v2 stage flow, same shape as SQL):
  - Parsons reorder: correct answers now show "Correct — that's the right order."
    + a **Continue →** button instead of auto-jumping to the next stage after 900ms.
  - Build It: correct gets **Continue →**; wrong keeps the explanation on screen
    with **Try Again** + **Continue anyway** (was: auto-advance after 1.2–2.6s
    either way, wiping the explanation).
  - Quick Check: correct answers keep their explanation visible with a
    **Continue →** button (was: auto-advance after 1.2s). Wrong-answer
    Try Again / Continue anyway buttons already existed and are unchanged.
- **Power BI practice Parsons** (`checkParsons`): "✓ Correct order!" now holds
  with a **Continue →** button (guided mode and free mode both respected)
  instead of auto-navigating after 1.2s.
- **Excel** (older v2Continue flow): Parsons "✓ Correct!", Build "✓ That's it.",
  and Quick Check correct-answer explanations all now hold with a **Continue →**
  button instead of advancing 700ms later. Wrong-answer paths (Try Again /
  Skip / auto-reset of the Parsons chips) already behaved correctly and are unchanged.
- Swept clean (no auto-advance patterns found): interview, forecasting,
  chart-literacy, final, and the separate excel-lessons repo.
- All edited script blocks pass a headless Node syntax check.

## [1.112.0] — 2026-07-06 — 🗄️ SQL kit: "Set Up a SQL Database" lesson + Project Studio "New to this?" links

Both halves of Mike's portfolio-project feedback (he hit "import the raw CSV into
steam_games_raw" with no coverage of how):

- **SQL kit — new Unit 0 lesson (id 105, free): "Set Up a SQL Database."** The
  CSV → table bridge: SQLite/DB Browser workflow, CREATE TABLE + column types,
  the `_raw` untouched-original convention, and the COUNT(*) verify step. Full
  7-stage flow (story/RAL/viz/quiz/parsons/build) + 2 spaced-recall cues.
  SQL kit is now **47 lessons** (hub label updated).
- **SQL kit — hash deep links:** `sql/#lesson-105` (any lesson id) opens that
  lesson directly.
- **Project Studio — "📚 New to this?" links on plan steps.** Every step tagged
  with a tool now links to that tool's kit; the SQL load/import steps link
  straight to the new lesson. Render-time, so existing saved plans (Mike's
  Steam Hidden Gems project) get the links without re-generating the plan.

## [1.111.0] — 2026-07-06 — ✅ SQL kit: no auto-advance on lesson checks (playtest blocker)

From Mike's playtest-tracker feedback (2 bugs, both about lesson-flow checks):

- **Wrong answers no longer auto-advance.** The Build It step advanced to the next
  stage ~2s after a wrong pick (reported on Unit 0 "Keys & Why Tables Relate",
  question 5 of the lesson flow). It now shows **Try Again** (re-deals the question)
  and **Continue anyway**, matching the Quick Check's existing pattern.
- **Correct-answer explanations no longer vanish.** Quick Check, Build It, and the
  Parsons reorder all auto-advanced ~1s after a correct answer, yanking the
  explanation text off screen. All three now stay put and show a **Continue →**
  button, so the explanation reads at the learner's pace.
- Follow-up (roadmap): sweep the other kits for the same auto-advance patterns —
  Mike flagged this as a check-all-kits item.

## [1.110.0] — 2026-07-06 — 📊 Python + Power BI: track-lesson charts (Medium #6 slices 2+3 — track-chart work COMPLETE)

Same generators as v1.109.0's SQL slice, bundled because they share the component
(cycle-scoping rule). 7 chart-centric track lessons per kit, spec numbers matching
each lesson's own output table (kits intentionally have slightly different data):

- **Python** (`PY_CHARTS`, vars adapted to `--dim`/`--success`/`--err`): pct_change line ·
  cumsum line · funnel bars · margin bars (60/23/15) · variance diverging bars · box plot
  ($510 outlier) · Pareto (540→30, 71% at B).
- **Power BI** (`PBI_CHARTS`, SQL-clone vars): DATEADD MoM line · TOTALYTD line · funnel
  bars · margin bars · variance diverging bars · **histogram bars** (its 803 has real bin
  counts, so a histogram beats a box plot) · Pareto (600→30, 74% at B).

**All four tool kits with interview tracks (SQL · Python · Power BI + Excel's existing
charts) now show real visuals on chart-centric lessons.** Tableau draws its own Chart.js
viz; Stats has Chart.js lesson charts — neither needed this. Headless: 121 checks green.

## [1.109.0] — 2026-07-06 — 📊 SQL kit: real inline-SVG charts on chart-centric track lessons (Medium #6, slice 1)

The Phase-3 decision rendered track-lesson charts as data tables; this brings real
visuals back where they matter most — the chart-centric lessons — per the roadmap's
reconciliation note (charts where a visual teaches; tables stay elsewhere).

- **Zero-dependency parametric SVG generators** (line · bar with negative/diverging
  support · Pareto combo · box plot), all colors via CSS vars (dark + light), with
  `<title>` accessibility labels. No Chart.js — the kit stays static.
- **7 lessons charted** (`SQL_CHARTS` map, numbers match each lesson's result table):
  603 MoM line · 604 running-total line · 605 funnel bars · 702 margin bars ·
  705 variance diverging bars (color = verdict, not sign) · 803 box plot with the
  $540 outlier · 804 Pareto bars + cumulative % line.
- Chart card renders in the Worked Example stage AFTER the query-result table —
  the table stays the ground truth; the chart is the stakeholder view.
- Harness: chart checks added (ids valid, SVG renders, no NaN coords); apkPass stub
  added so premium track lessons render their real body headlessly. 117 checks green.

## [1.108.0] — 2026-07-06 — 🧠 Stats kit: Phase D+E parity — 🏁 D+E ROLLOUT COMPLETE (all 6 kits)

Final kit in the rollout. Stats specifics: numeric `unit` field (bridge condition adapted:
no bridge on unit 0), section-based lessons (no `ral`), quiz explanation field is `explain`.
Keys `spk-recalls`/`spk-recall-wins`/`spk-last-visit`.

- Spaced-recall engine (+1/+3/+7) with **16 hand-authored cue sets** (`STAT_REINFORCES`) —
  center/spread, sampling-bias, p-value-in-plain-language retrieval questions.
- Artifact bridge, retrieval-honesty note, recall-wins counter, return-visit greeting
  under the Home header; kit reset clears recall keys.

**With this, every lesson kit (Excel · SQL · Python · Power BI · Tableau · Stats) runs the
full learning-science stack: 7-stage retrieval-first flow + spaced recall + motivation layer.**
Headless: 115 checks green across the 5 ported kits (`de-test.mjs`).

## [1.107.0] — 2026-07-06 — 🧠 Tableau kit: Phase D+E learning-science parity

Fourth kit in the D+E rollout (after SQL/Python/Power BI). Tableau specifics: `S`/`save`/
`openLesson`+`lessonState`, renders into `view-lessons`; the Interface lesson's workspace-tour
button and the `prereq` story-fallback are preserved on Orient. Keys `tpk-recalls`/
`tpk-recall-wins`/`tpk-last-visit`.

- Spaced-recall engine (+1/+3/+7) with **32 hand-authored cue sets** (`TAB_REINFORCES`) —
  shelf-thinking, dimensions/measures, cert-domain retrieval questions.
- Artifact bridge at Orient, retrieval-honesty note on Try, recall-wins counter in Close,
  return-visit greeting on the Home resume card (already position-based — no fix needed).
- Kit reset clears the recall keys.

Headless: 92 checks green across SQL + Python + Power BI + Tableau.

## [1.106.0] — 2026-07-06 — 🧠 Power BI kit: Phase D+E learning-science parity

Same layer as the SQL (v1.104.0) and Python (v1.105.0) ports; Power BI is a SQL-clone
architecture so the port is 1:1 (keys `pbikt-recalls`/`pbikt-recall-wins`/`pbikt-last-visit`):

- Spaced-recall engine (+1/+3/+7), recall cards at Orient (Lesson 1's workspace-tour
  button preserved), got-it/nope, "Have it" clears.
- **39 hand-authored recall cue sets** (`PBI_REINFORCES`) — Power Query, DAX, and
  model-thinking retrieval questions.
- Artifact bridge at Orient, retrieval-honesty note on Try, recall-wins counter in Close,
  return-visit greeting on Home.
- Ride-alongs: resume card shows lesson **position** (was raw id); reset clears recall keys.

Headless: 69 checks green across SQL + Python + Power BI (`de-test.mjs`).

## [1.105.0] — 2026-07-06 — 🧠 Python kit: Phase D+E learning-science parity

Same layer as v1.104.0's SQL port, adapted to Python's Excel-shaped architecture
(`S`/`save`/`openLesson`, static Home resume card):

- Spaced-recall engine (+1/+3/+7; keys `ppk-recalls`/`ppk-recall-wins`), recall cards at
  Orient, got-it/nope buttons, "Have it" clears the queue.
- **42 hand-authored recall cue sets** (`PY_REINFORCES`, 2 retrieval questions per lesson).
- Artifact bridge at Orient (same-unit chains), retrieval-honesty note on Try,
  recall-wins counter in Close, return-visit greeting on Home (`ppk-last-visit`).
- Ride-alongs: Home resume card + watermark now show lesson **position** (was raw id —
  "Lesson 101" for Unit 0); per-kit and all-kit resets clear the new recall/visit keys
  (all-kit reset also clears Excel's and SQL's).

Headless suite generalized to a kit-parameterized `de-test.mjs` (private): 46 checks
across SQL + Python, all green. One cue rewritten (L13 Deep/Shallow Copy) after the
cue-relevance heuristic flagged it.

## [1.104.0] — 2026-07-06 — 🧠 SQL kit: Phase D+E learning-science parity with Excel

The Phase H structural port gave SQL the 7-stage v2 flow, but the Phase D (spaced recall)
and Phase E (motivation) layers were Excel-only until now. Ported per `EXCEL_POLISH_MASTER_PLAN.md`:

- **Spaced-recall engine** (+1/+3/+7 lesson positions): rating a lesson "Not yet"/"Almost"
  queues its recall cues; they resurface as a "Quick recall — no peeking" card at the Orient
  stage of later lessons. "I remembered it" counts a win; "Nope" re-queues at the next lesson.
  Re-rating to "Have it" clears the queue for that lesson. Keys: `sqlkit-recalls`, `sqlkit-recall-wins`.
- **46 hand-authored recall cue sets** (2 retrieval questions per lesson) in one auditable
  `SQL_REINFORCES` map, merged onto lesson objects at boot (runtime shape matches Excel's `reinforces:[]`).
- **Progressive-artifact bridge** at Orient ("Last time you built: X. Now you'll add to it.")
  for same-unit lesson chains (not on unit openers / Unit 0).
- **Retrieval-honesty note** on the Try stage ("This feels harder because it works…").
- **Recall-wins counter** in the Close stage ("N concepts recalled from memory so far").
- **Return-visit greeting** on Home on a new-day return (`sqlkit-last-visit`).
- Fixes riding along: Home resume card now shows the lesson **position** (was raw id — showed
  "Lesson 101" for Unit 0); AI Coach key migrated to the shared `apk-coach-key` (legacy
  `sql-coach-key` still read as fallback); Reset-all clears the new recall/visit keys.

Verified via a new private headless behavioral suite (23 checks: eval, cue coverage/shape/relevance,
v2 field integrity across all 46 lessons, recall queue round-trip, 46×7 stage-render sweep,
bridge/note/greeting rendering, link targets — all green). External links HEAD-checked 200.

## [1.103.2] — 2026-07-06 — fix: Project Studio "Generate with Claude" used a stale model ID

`claude-sonnet-4-5-20250514` is a deprecated dated snapshot; the API returned a `not_found_error` whose message (just the model name) surfaced as the whole error, misleadingly. Switched to `claude-sonnet-4-5` (no date suffix) — matches the working model ID already used by Excel's Mode 3 coach and the Simulator kit.

## [1.103.1] — 2026-07-06 — fix: Project Studio Next button stuck disabled while typing

Question/criteria textareas skip a full re-render on every keystroke (by design, to keep cursor focus), so the scope wizard's Next button never re-checked validity after the first render — it stayed disabled even once you'd typed a valid answer. Added `refreshNextBtn()`, called from `scType`/`scCrit`, which re-evaluates `scopeStepValid()` and toggles the button directly without re-rendering the view.

## [1.103.0] — 2026-07-06 — 🧭 Project Studio — new "Projects" section

New kit at `projects/`: a portfolio-project builder that walks a learner from a vague idea to an interview-ready project through four phases, teaching real analyst workflow along the way.

- **Scope** — 7-step intake wizard (domain → one-sentence question → measurable criteria → data-feasibility check per criterion (direct/proxy/cut) → define the deliverable → pick tools → stamped scoping doc). Job-first tool guidance: Excel/SQL/Tableau flagged as the recommended core, Power BI/Python optional.
- **Plan** — the step-by-step, three sources: (a) a guided template generated from the scope + chosen tools, (b) paste/write your own (`## Stage` headings + `[skill]` tags parsed into stages), (c) optional Claude draft — BYOK direct-browser call (Sonnet, shared `apk-coach-key`), scope doc → strict-JSON plan. All three land in the same editor (edit/add/delete/tag steps) before locking.
- **Build** — the plan as an accordion checklist over the six industry-standard analysis stages (Ask → Prepare → Process → Analyze → Share → Act), each stage with a best-practice mentor note (raw-data hygiene, cleaning logs, thresholds from real distributions, lead-with-the-answer). Per-step notes; progress bar; Present unlocks when all steps are done.
- **Present** — deliverable checklist seeded from the scope (README, methodology, published dashboard link when relevant, .sql file, workbook hygiene), 90-second-walkthrough interview tip, and a one-click **project doc export** (copy or download .md: scope + full plan with notes + checklist — a ready README skeleton).
- Hub: new Project Studio kit card (`data-kit="projects"`, amber accent, "Portfolio · New" badge) above Keygarden; excluded from progress/continue tracking by design.
- Single-file vanilla JS, GRAIN design system, dark-mode via the cross-kit `apk-theme` contract, state in `localStorage['apk-projects-v1']`. Parse gate clean (projects + hub).

## [1.102.0] — 2026-07-05 — 🔓 Premium-unlocked badges — **Medium #5 COMPLETE**

Buying now *feels* like unlocking something instead of features silently working. All new state/badge logic is centralized in `assets/apk-pass.js`, so each premium surface gets a small, uniform change.

**Source of truth (Mike's call): genuine redemption, not the pre-launch free bypass.** `apkPass.isUnlocked()` free-bypasses to `true` for everyone until Aug 1, so it can't drive an honest "you unlocked this" badge. New `apkPass.hasRedeemed()` reads the *real* local unlock (redeemed code, unexpired), and `apkPass.isMember()` = `hasRedeemed()` OR a signed-in account entitlement (`hasInterviewPass()`, hydrated async and cached in `_acctPass`).

- **`apkPass.lessonBadge()`** — three-state pill on every premium lesson card: `✓ Unlocked` (member, green), `Premium · free now` (free-launch preview), `🔒 Premium` (locked). Replaces the old lock-icon-only treatment.
- **`apkPass.unlockedBanner(noun)`** — green "Unlocked. This premium lesson is part of your All-Access Pass." banner atop a premium surface a member has opened.
- **`apkPass.celebrateUnlock()`** — one-time "You've unlocked the All-Access Pass" toast, fired once per browser after a genuine unlock (guarded by an `apk-pass-celebrated` flag shared across all kits, so it shows once for the whole suite). Called on every kit load; no-ops unless a member who hasn't seen it.
- **`apkPass.hydrateAcct(rerender)`** — async-checks the Supabase account entitlement; if it resolves true, caches it, re-renders, and fires the celebration. Safe no-op without the auth layer / when signed out.
- **Applied to:** the 4 tool kits with interview tracks (Excel, SQL, Python, Power BI — card pill + lesson banner + init) and the fully-gated Final Exam kit (home banner + init). Tableau/Stats have no premium content (no `id≥500` tracks, don't load `apk-pass.js`) — correctly untouched. The Interview kit (free) and Simulator (BYOK) aren't pass-gated — no badge applies.
- CSS for pills/banner/toast added to `apk-pass.js`'s injected `<style>`, themed via existing CSS vars with hard-coded fallbacks. Parse gate clean across all 5 touched kits + the shared JS.

## [1.101.4] — 2026-07-05 — ⚖️ Privacy & Terms: accurate about optional sign-in + sync

Follow-up to Medium #4. With optional Supabase sign-in (email/password or Google) and cross-device progress sync live, the legal docs were factually inaccurate. Corrected against the real data model (`SUPABASE_INTEGRATION.md`: Auth stores email/identity; `user_progress` syncs progress; `user_entitlements` holds paid access; no-account use stays local):
- **privacy.html** — "The short version" no longer claims "no accounts, no logins… we don't ask for your email"; now: no-account use is local-only, optional sign-in stores your email + syncs progress. Added a new **"Account & sync data (only if you sign in)"** collection item naming Supabase as the backend. Qualified the on-device progress claim with "if you don't sign in." Added authentication/sync to the providers list and account-deletion to "Your choices." Bumped "Last updated" to July 5, 2026.
- **terms.html** — dropped the false "runs entirely in your browser with no login" clause; kept the accurate unlock-code + local-storage access model and noted sign-in is optional (progress sync only). "Last updated" → July 5, 2026.

## [1.101.3] — 2026-07-05 — 🔑 Retire stale "no login / no telemetry" copy — **Medium #4 COMPLETE**

Optional Supabase sign-in + cross-device sync and GA4 analytics are live, so "no login" / "no telemetry" marketing claims are outdated. Reframed to the hub's positioning ("free to start · optional sign-in to sync · progress syncs when you sign in"):
- `README.md` — "no install, no login, no telemetry" → "no install, free to start — with optional sign-in to sync across devices."
- `chart-literacy` + `forecasting` — meta description "No install, no login" → "No install, free to start"; footer "…no login. Your progress is saved only in this browser." → "…Your progress is saved in this browser, and syncs across devices when you sign in."
- `final` + `simulator` footers — dropped the false "No telemetry" chip (both load GA4).
- Hub arcade note — dropped "No sign-up."
- Hub hero already said "Sign in to sync across devices" (unchanged). Parse gate clean across all touched kits.

⚠️ **Out of scope, flagged separately (spawned task):** `privacy.html` + `terms.html` still claim "no accounts, no logins… progress never leaves your device" — now factually false with sign-in/sync live. Left untouched here because an accurate rewrite needs the real data-handling facts (what the sync stores/retains) + Mike's review — it's a legal doc, not marketing copy.

## [1.101.2] — 2026-07-05 — 🔍 Attempt-vs-correct: close the last Tableau gap — **Medium #3 COMPLETE**

Medium #3 asked to show the learner's attempt beside the correct answer post-submit. **Finding:** already implemented broadly — the v2 **Compare** stage renders an explicit "Your attempt | Correct answer" grid for the Parsons drill in all 6 kits (`_v2ParsAttempt` / `compareHTML`), and the MC **Quick Checks** reveal the picked option + the correct option + an explanation in Excel, Python, SQL, Power BI, and Stats. The **one** gap: Tableau's Quick Check marked the wrong pick red but never revealed which option was correct (it showed the prose explanation, then reset for a retry).
- Tableau ([tableau/index.html](tableau/index.html), `checkQuiz`): on a wrong answer, now also highlights the correct option (matching Stats' pattern) so the learner sees attempt-vs-correct before the retry reset. One-line behavior fix, parse clean (5/5).
- DoD met: every drill type that captures an attempt now shows the attempt next to the correct answer, in all 6 kits.

## [1.101.1] — 2026-07-05 — 🧹 Retire the dead "On the job" blurb render — **Medium #2 COMPLETE**

Medium #2 asked to stop showing the "On the job" role blurb on general lessons (noise reduction). **Finding:** it was already invisible everywhere — the block existed only in the Excel kit and was gated `flow!=='v2'`, but all 51 Excel lessons are now `flow:'v2'` (Phase-H rollout), so it hadn't rendered for any user since the migration. No other kit has the block.
- Removed the unreachable render line ([excel/index.html:2197](excel/index.html)); the string terminator moved up to the `intro` line. The 24 hand-written `onthejob` blurbs stay as **dormant data** on the core lessons (cheap, reusable) per Mike's call — not deleted.
- DoD met: general lessons show no on-the-job blurb (they already didn't); nothing else changed. Parse gate clean (4/4).

## [1.101.0] — 2026-07-05 — 🎮 Hub "Practice arcade" section — **Medium #1 COMPLETE**

Added a **Practice arcade** section to the hub (`index.html`), below the 12 kits, cross-promoting the six shipped analyst skill-games so learners discover them:
- **SQL Quest** (SQL tower-defense), **Analyst Sprint — Excel**, **Analyst Sprint — SQL** (timed formula/query drills), **Spreadsheet Archaeology** + **Tableau Archaeology** (narrative job-sims), **SQL Dry Run** (timed exam/interview rehearsal). All six URLs verified live (HTTP 200) before linking.
- Reuses the existing `.kit-card` component + a new `.arcade-note` lead line; each card is an external `target="_blank" rel="noopener"` link with a one-line hook. Cards intentionally carry **no `data-kit`** so they don't hijack the "Continue where you left off" resume target or the progress renderer.
- HTML/CSS only; inline-script parse gate clean (4/4 blocks). Placement + game list confirmed with Mike.

## [1.100.1] — 2026-07-05 — 📊 Readiness meter counts the new lessons — **High #5 COMPLETE**

The home "skill readiness" meter ignored every lesson added after the original 12. **Root cause:** SQL, Python, and Power BI built their skill bars from **hardcoded lesson-id lists** (`[1,2,3,4]`, `[5,6,7,8]`, `[9,10,11,12]`) — so Unit 0 (foundations) and all four interview-track units (Data Migration · From Question to Metric · Financial Analysis · Advanced Analyst Toolkit) were invisible to both the bars and the % denominator. A learner could finish the whole track and the meter wouldn't budge.

Fixed all three to derive the meter from the **live** `DATA.LESSONS` set, bucketed by unit (Excel's model), so every lesson is counted and completing any lesson moves the score:
- Skill areas now match on unit name (`Unit [01]:` → Foundations, `Unit 2:`, `Unit 3:`, `Unit [4-7]:` → a combined "Interview Tracks" bar), covering Units 0–7 with nothing dropped.
- Completion still = the lesson's existing `doneLessons`/`lessonsDone` flag, which is set when the learner reaches the v2 **Done** stage (per the July-5 completion-model decision — practice drills stay optional).
- Also fixed stale "You've finished all **12** lessons" copy in SQL/Power BI → live `${total}`.

**Excel & Tableau were already live** (derive from units); **Stats** has no skill breakdown (simple live `done/total` card). CSS-only-adjacent (JS logic), all 3 parse clean. Untested in browser.

---

## [1.100.0] — 2026-07-05 — ✅ Free-text drills → tap-the-choice (grading-trust) — **High #4 COMPLETE**

Killed the last free-text drill inputs that graded by string match — where a legitimately-correct typed answer (a spacing/case/variant difference) could be marked wrong. Converted every surviving free-text practice drill to tap-the-choice with **hand-authored, verified distractors**, following Excel's existing `.bug-choice` pattern (`correct = choices[0]`, `_shuf` at render, tap → `data-correct` → disable-on-correct). Excel was already done (v1.78.0) and was the model.

Converted (standalone practice / guided-path drills):
- **SQL** — Fill-in-the-Blank (16 items): each blank now offers 4 SQL keywords (correct + 3 plausible-but-wrong, e.g. `LEFT/RIGHT/INNER/FULL`, `HAVING/WHERE/QUALIFY/FILTER`).
- **Python** — Fill (14) **and** "Describe → Python" / ESQL (14, was "Write the code…" free text): 4 pandas/Python code-line options each.
- **Power BI** — Fill (12): 4 DAX options each (e.g. `SUM/SUMX/TOTAL/ADD`, `DISTINCTCOUNT/COUNTDISTINCT/UNIQUECOUNT/DISTINCT`).
- **Stats** — Fill (12): 4 stats-term options each (e.g. `mean/median/mode/range`, `0.05/0.01/0.10/0.50`).

`renderFill`/`renderEsql` rewritten to tap; `checkFill`/`checkEsql` replaced with `pickFill`/`pickEsql` (per-kit: SQL/PBI use a `_fillAdvance` Next button + `markDone('doneFills',id)`; Python/Stats mirror their own `pickBug` with `markDone(...,idx)`). **Progress keys unchanged** (`doneFills`/`fillsDone`/`S.done['fills'+idx]`), so no saved progress is invalidated. All 4 kits parse clean (0 errors); no stale `checkFill`/input refs remain. Distractors were authored to be real-but-wrong for that specific blank (a too-obvious or actually-correct option would defeat the drill). **Minor leftover:** the now-unused `.fill-input`/`.drill-input`/`.correct-in`/`.wrong-in` CSS classes are harmless dead code (cleanup candidate). Untested in browser.

---

## [1.99.2] — 2026-07-05 — 📱 Mobile nav overlapping the page title — **High #3 COMPLETE**

Fixed the "jumbled / overlapping title text on some kits" bug. **Root cause:** SQL/Python/Power BI/Tableau/Stats set `nav{flex-wrap:wrap}` with a **fixed `height:56px`** (Tableau/Stats) — so on a narrow phone the tab bar wrapped to a second row that overflowed the fixed-height sticky nav and landed on top of the page `<h1>` below it. Exactly the "fix applied to some kits but not all" Mike flagged: **Excel already forced `nav{flex-wrap:nowrap;overflow-x:auto}` on mobile** (single scrollable row, the known-good pattern); SQL/Power BI only half-mitigated by hiding the brand; Python/Tableau/Stats had no fix.

Added Excel's mobile rule to the other 5 kits' ≤600px block:
```
nav{flex-wrap:nowrap;overflow-x:auto;-webkit-overflow-scrolling:touch;scrollbar-width:none}
nav::-webkit-scrollbar{display:none}
```
The tabs already carry `white-space:nowrap`, so their content min-width resists squishing and the row scrolls horizontally instead of wrapping — no second row, nothing overlaps the title. CSS-only, no logic. All 5 parse clean. **Diagnosed + fixed by inference (the fixed-height + wrap is a textbook overlap); Mike to confirm on the screen he saw.** Untested in browser.

---

## [1.99.1] — 2026-07-05 — 📱 Mobile text-overflow sweep (all 6 kits) — **High #2 COMPLETE**

Fixed long formula/query strings clipping off the right edge of cards on narrow viewports (Mike's June-29 screenshot: an Excel "Nested IF" tap-the-formula option ran off the card). Excel already had the wrap protections from v1.78.0; the other 5 kits never got that sweep. Added `overflow-wrap:anywhere` / `word-break:break-word` to the code-bearing elements so long tokens wrap or scroll instead of clipping:

- **`.quiz-opt`** (SQL · Python · Power BI · Tableau · Stats) — build/quiz options that can hold formulas/queries → `overflow-wrap:anywhere`.
- **`.v2-pars-chip`** (all 5) — Try-stage parsons chips were `white-space:pre` (no wrap) in SQL/Python/Power BI → switched to `pre-wrap` + `overflow-wrap:anywhere;word-break:break-word;max-width:100%` (Tableau/Stats were `pre-wrap`, added the break props).
- **`.v2-compare-code`** (Tableau · Stats) and **`.code-block`** (Tableau) — `pre-wrap` with no long-token break → added `overflow-wrap:anywhere;word-break:break-word`.

Code display blocks that were already safe were left alone (`.ral-sql`/`.ral-code`/`.code-block` with `white-space:pre;overflow-x:auto` scroll horizontally; Excel/`.v2-code-block` already had wrap). CSS-only, no logic. All 6 kits parse clean (0 errors). **Scope note:** covers the v2 lesson flow + shared code classes; the older standalone practice-drill drag pieces (`.pars-piece`) weren't touched. Untested in browser (Mike verifies on his phone).

---

## [1.99.0] — 2026-07-05 — 📱 Mobile action-button rollout to the other 5 kits — **High #1 COMPLETE**

Rolled the v1.98.0 Excel mobile-CTA pattern to **SQL · Python · Power BI · Tableau · Stats**, closing High-bucket item #1. Each kit's v2 lesson flow now makes the primary stage CTA (Orient's "See how it works", "Try it yourself", "Check order", "Build it", "Next lesson") a **full-width, 48px-min, 15px thumb-height button on mobile (≤600px), placed at the bottom of its button row (closest to the thumb)**; secondary Back/Skip stay small on the row above.

Implementation notes (the kits are NOT uniform):

- **SQL & Power BI** wrap their stage buttons in `.row` (already `flex-wrap:wrap`); **Python, Tableau, Stats** use inline `<div style="display:flex">` rows with no wrap. A CSS-only `.v2-stage-card div[style*="display:flex"]{flex-wrap:wrap}` forces those inline rows to wrap so the full-width primary drops to its own line — no template edits needed.
- **Stats' primary CTA is plain `.btn`** (not `.btn-primary`) — targeted with `.btn:not(.btn-outline):not(.btn-sm)`; it also had no ≤600px media block, so one was added.
- `order:2` on the primary pushes it below Back/Skip (bottom = thumb-reachable).

CSS-only, no logic touched. All 5 kits' inline scripts parse clean (0 errors). **Scope note:** this covers the v2 lesson flow (the main loop). The older standalone *practice-drill* Check buttons (guided path) still use plain `.btn` mid-card and were left as a minor follow-up. Untested in browser (Mike verifies on his phone).

---

## [1.98.0] — 2026-07-04 — 📱 Mobile submit/action button placement (Excel pilot) — High #1

First High-bucket item from the June 29 mobile-playtest batch. Mike's complaint: on a phone the submit/Check button sits in an awkward spot and you have to hunt for it. **Finding:** every Excel drill is now tap-based (chips / multiple-choice) — no free-text inputs remain — so the literal "keyboard covers the button" case is gone; the real friction is the primary action not being a big, obvious, thumb-reachable target. Adopted the item's own **"full-width bottom CTA"** pattern (mobile ≤600px only, desktop unchanged):

- `.v2-continue .btn` (every stage-advance CTA: "See the formula →", "Now you try →", "Build one yourself →", "Next lesson →") → full-width, 14px padding, 15px, thumb-height.
- Try-stage Check/Reset row → new `.v2-drill-actions` class, buttons grow to fill with a 46px min tap target.
- Close-stage actions → new `.v2-close-actions` class, stacked full-width (Next lesson is the hero).
- Standalone-practice `.check-row .btn` → 46px min tap target.

CSS-only + three class hooks; no logic touched. Verified: inline scripts parse clean (0 errors). **Excel is the pilot; rolls to SQL · Python · Power BI · Tableau · Stats next — but each kit has its own v2 markup (SQL/PBI/Stats render one stage-card at a time via `.v2-stage-card` + a stage index; Excel reveals all stages with `.v2-continue`), so the rollout is per-kit tailoring of the same full-width-CTA idea, not a copy-paste of these class names.** Untested in browser (Mike checks live).

---

## [1.97.0] — 2026-07-03 — 🏗️ Phase H1-B: Stats v2 lesson data — Units 2+3 (8 lessons) · **PHASE H COMPLETE**

v2 fields (parsons/compare/build/close/unlock) authored for Probability Basics, Normal & Z-Scores, Sampling & Bias, Correlation vs Causation, Hypothesis Testing, P-Values, A/B Testing, Confidence Intervals. Builds are applied analyst judgment calls (peeking at an A/B test early, significant-but-negligible effects, self-selected reviews, firefighter confounding). **All 16 Stats lessons now route through `v2StatBody` — Stats H1 is complete, and with it the entire Phase H rollout: all 5 kits (SQL · Python · Power BI · Tableau · Stats) run the 7-stage v2 flow with AI Coach.** Untested in browser.

---

## [1.96.0] — 2026-07-03 — 🏗️ Phase H1-A: Stats v2 lesson flow — engine + Unit 0/1 pilot (8 lessons)

The 7-stage v2 flow ported to the Stats kit, adapted to its section-based architecture:

- `v2StatBody` renders inside `view-lessons` via the existing `openLesson`/`renderLesson` path; stage state in `S.lessonStage` (`spk` localStorage); `openLesson` already activates the view before render, so the Chart.js canvas-0×0 trap stays handled — `drawStatChart` re-invoked after every stage-1 injection
- Worked Example renders `sections` (Stats has no `ral`): code sections show code + Step-by-step expanded; prose-only sections become the "More detail" layer (`stat-lesson-mode`); concept lessons (no code, Unit 0) show everything and hide the toggle
- AI Coach Modes 1+3 (Haiku stuck-help on Try/Build, Sonnet gap analysis on Compare) with the shared `localStorage['apk-coach-key']`; key field added to the Settings modal
- v2 CSS block mapped onto Stats vars (`--bord`/`--ok`/`--txt`), new `quiz-opt` + `unlock-card` styles, color-mix tints (no baked hex); `resetLesson` also clears stage + attempt state
- Unit 0 + Unit 1 v2 data authored (8 lessons); Distribution Lab and all drills untouched

---

## [1.95.1] — 2026-07-02 — 📝 Phase H2: Stats content review — 4 fixes

Four-audit pass (accuracy / relevance / friction / style) over all 16 Stats lessons + drills, cards, glossary. Content-only:

- **Encoding fix:** `Hâ'€` mojibake → `H₀` in 10 places (Lesson 13 quiz, a fill-in, two drills, a parsons explain, flashcard, glossary ×2)
- **Lesson 7 (Percentiles & IQR):** corrected `np.percentile` outputs to what numpy actually returns with interpolation — Q1 122.5 / Q3 167.5 / IQR 45 / fences 55 & 235 (was 120/170/50/45/245) in code, steps, and viz caption
- **Lesson 15 (A/B Testing):** `proportions_ztest` on 25/500 vs 35/500 gives p ≈ 0.18 (z ≈ 1.33, two-sided), not the claimed 0.098 — same "not significant" conclusion, right number
- **Lesson 16 (Confidence Intervals):** SE = 5.0 (was 5.1) and CI = ($135.3, $157.9) (was $135.1–$158.1) — verified numerically

Relevance and style audits passed with no changes: analyst-job framing (revenue, A/B tests, survey bias) and mentor voice are consistent across all 16 lessons.

---

## [1.95.0] — 2026-07-02 — 🏗️ Phase H1-C: Tableau v2 lesson data — Units 4+5 (7 lessons)

v2 fields authored for the cert-domain units: Live vs Extract decision path, join/union/relationship fork (with the double-count trap as the Build), data-properties tidy pass, sets on Color vs Filters, hierarchy drill, parameter wiring, dual-axis synchronize rule. **All 32 Tableau lessons now route through `v2TabBody` — Tableau H1 is complete (fifth of five tool kits on the v2 flow; Stats next).** Untested in browser.

---

## [1.94.0] — 2026-07-02 — 🏗️ Phase H1-B: Tableau v2 lesson data — Units 2+3 (16 lessons)

v2 fields (parsons/compare/build/close/unlock) authored for Building Better Vizzes and Dashboards & Best Practices. Parsons arrange real shelf workflows (Top-N + context filter order, scatter disaggregation via Detail, treemap build, geographic role before map); Build distractors are real Tableau mistakes (sorting months by value, syncing mismatched axes, 7-slice pies). Untested in browser.

---

## [1.93.0] — 2026-07-02 — 🏗️ Phase H1-A: Tableau v2 lesson flow — engine + Unit 0/1 pilot (9 lessons)

The 7-stage v2 flow (Orient→Example→Try→Compare→Build→Check→Close) ported to the Tableau kit, adapted to its own architecture:

- `v2TabBody` renders inside `view-lessons` via the existing `openLesson`/`renderLesson` path; stage state in `S.lessonStage` (`tpk` localStorage)
- Worked Example stage renders Tableau's `ral` shelf-array (`{shelf,lines,html}` blocks) + the Chart.js "See it on screen" viz — `drawLessonChart` re-invoked after every stage-1 injection so canvases draw
- AI Coach Modes 1+3 (Haiku stuck-help on Try/Build, Sonnet gap analysis on Compare) with the shared `localStorage['apk-coach-key']`; key field added to the Settings modal
- Focus/Details toggle (`tab-lesson-mode`), honest unlock card, per-lesson reset extended to clear stage + attempts
- Viz Builder, Workspace tour (still linked from the interface lesson's Orient stage), and all drill engines untouched
- Unit 0 (foundations) + Unit 1 (fundamentals) authored: 9 lessons

---

## [1.92.1] — 2026-07-02 — 📝 Phase H2: Tableau content review (accuracy · relevance · friction · style)

Full four-audit content review of all 32 Tableau lessons plus the drill banks (fills, bugs, wrong-answer, parsons, ESQL, cards, glossary) — the fifth kit in the Phase H rollout, content review before structural port. The content held up well; four defects fixed, no rewrites needed:

- Lesson "What Aggregate Means": example math now consistent — SUM = $1,824 with AVG $152 × COUNT 12 (was $1,820)
- Lesson "Aggregation in Tableau": viz table `COUNT(*)` → `COUNT(Units)` — `COUNT(*)` isn't Tableau syntax and now matches the RAL breakdown (132 ÷ 12 = 11 ✓)
- Lesson "Build a Map": "Chloropleth" → "Choropleth" (spelling)
- Cards: "Dual Axis" card said "two measures sharing one axis" — that's a combined axis; now reads "overlaid, each on its own axis," matching the Dual-Axis lesson

Relevance, friction, and style audits passed clean: mentor voice consistent, story chain intact across all 32 lessons, no jargon-first explanations, drill answers verified against lesson content. Content-only; no UX change.

---

## [1.92.0] — 2026-07-02 — 🏗️ Phase H1-C: Power BI v2 lesson data — Units 4–7, all 4 tracks (23 lessons)

v2 stage flow extended to every remaining Power BI lesson. **All 39 Power BI lessons now route through `v2PbiBody` — Phase H1 structural port is complete for the Power BI kit** (fourth of five; Tableau next after testing).

- **Unit 4: Data Migration** (401–405) · **Unit 5: From Question to Metric** (601–606) · **Unit 6: Financial Analysis** (701–706) · **Unit 7: Advanced Analyst Toolkit** (801–806)
- Parsons arrange real DAX (CALCULATE arg order, VAR-before-RETURN, VAR capture before FILTER context shifts) or Power Query workflows (profile → dedupe → cleanse → type → reconcile)
- Build distractors are real Power BI mistakes: SUM on an ID column, flipped conversion ratios, Left vs Right Anti direction, / instead of DIVIDE, measure-vs-column for slicers
- Untested in browser (build sprint)

---

## [1.91.0] — 2026-07-02 — 🏗️ Phase H1-B: Power BI v2 lesson data — Units 2+3 (ids 5–12, 8 lessons)

v2 fields (parsons/compare/build/close/unlock) authored for the DAX & Measures and Reports & Insights units. Parsons include the CALCULATE expression-then-filter order, the DIVIDE margin shape, the measure-stack YoY build, and the filter-scope ladder. Untested in browser.

---

## [1.90.0] — 2026-07-02 — 🏗️ Phase H1-A: Power BI v2 lesson flow — engine + Unit 0/1 pilot (8 lessons)

Structural port of the v2 lesson flow (Orient→Example→Try→Compare→Build→Check→Close) to the Power BI kit, adapted to its `state`/`navigate`/`renderLesson` architecture:

- v2 CSS block (Grain `color-mix` tints), stage engine (`getPbiStage`/`setPbiStage`, `v2pbi-` DOM ids), parsons chip tap/check, build pick, quiz answer/retry with Continue-anyway, per-lesson reset, Focus/Details toggle (`localStorage['pbi-lesson-mode']`)
- AI Coach Modes 1+3 (Haiku stuck-help on Try/Build, Sonnet gap analysis on Compare) — key SHARED with Excel/Python via `localStorage['apk-coach-key']` (note: SQL still uses its own `sql-coach-key`)
- Settings → AI Coach key field (save/persist)
- Lesson 5 ("The Power BI Interface") keeps its interactive workspace-tour button, now on the Orient stage
- v2 fields authored for Unit 0 (ids 101–104) + Unit 1 (ids 1–4)
- Untested in browser (build sprint)

---

## [1.89.1] — 2026-06-30 — 🔍 Phase H2: Power BI content review complete

Full accuracy / relevance / friction / style audit of all 39 Power BI lessons. Cleanest kit yet — the DAX content verified accurate (no-native-CORR and no-native-NPV facts, TOTALYTD / DATEADD / SWITCH(TRUE()) / ALLSELECTED patterns all canonical). Two fixes:

- **id:101 (Lesson 1)** — quiz was ambiguous: two of the four options described the same correct behavior (plain SUM is safe at line-item grain), so a learner picking either got inconsistent grading. Rewrote the question to ask WHERE line-item grain becomes dangerous (answer: relationships/fan-out, not plain SUM) with three genuinely wrong distractors
- **id:11 (Lesson 15)** — story said "Two or three accent colors maximum" while the code card and say-line teach "1-2 accent colors max"; story now matches

Content review phase complete for Power BI; H1 structural port (v2 flow) is next.

---

## [1.89.0] — 2026-06-30 — 🏗️ Phase H1-D: Python v2 lesson data — Units 4–7, all 4 tracks (24 lessons)

v2 stage flow extended to every remaining Python lesson. **All 42 Python lessons now route through `v2PyBody` — Phase H1 structural port is complete for the Python kit** (second of five; SQL done, Power BI next after testing).

- **Unit 4: Data Migration** (401–406) · **Unit 5: From Question to Metric** (601–606) · **Unit 6: Financial Analysis** (701–706) · **Unit 7: Advanced Analyst Toolkit** (801–806)
- All parsons authored as strict dependency chains (each line uses the previous line's variable — one valid order); notable: the quick ratio derived FROM the current ratio, the funnel helper as a def-body puzzle, describe()'s max/Q3 tail-check
- Build distractors are real pandas/finance mistakes: fillna vs dropna vs astype(str) on NOT NULL, keep='first' hiding originals, unsorted cumsum/Pareto, == on float sums
- Untested in browser (build sprint)

---

## [1.88.0] — 2026-06-30 — 🏗️ Phase H1-B+C: Python v2 lesson data — Units 2+3 (11 lessons)

v2 stage flow extended to all core pandas and cleaning lessons (ids 4–14). 18 of 42 Python lessons now on v2.

- **Unit 2: pandas** (ids 4–9) — Your First DataFrame, Exploring Data, Filtering Rows, Sorting & Selecting, GroupBy & Aggregation, Merging DataFrames
- **Unit 3: Data Cleaning** (ids 10–14) — Finding & Fixing Nulls, String Cleaning, Types/Duplicates/Export, Deep vs Shallow Copy, Decorators
- All parsons authored from scratch as strict dependency chains or meaning-forced orders (one valid arrangement); build distractors are real pandas mistakes (missing parens on masks, `and` vs `&`, removed `df.sort()`, unassigned string methods)
- Untested in browser (build sprint)

---

## [1.87.0] — 2026-06-30 — 🏗️ Phase H1-A: Python v2 lesson flow — infrastructure + pilot (7 lessons)

The SQL kit's v2 stage flow (Orient → Example → Try → Compare → Build → Check → Close) ported to the Python kit, adapted to its architecture (`S`/`save()`/`openLesson()`/`#lessonContent`; ral is an array; viz renders via `lessonOutputHTML`).

- **Infrastructure** — `v2PyBody`, `setPyStage`/`getPyStage` (stage store is `S.v2Stage` — separate from the legacy `S.lessonStage` string), `v2ParsChipTap`/`v2ParsCheck`, `v2BuildPick`, `v2QuizAnswer`/`v2QuizRetry`/`v2QuizDone`, `v2ResetLesson`; stage-bar; Focus/Details toggle (`ppk-lesson-mode`); Close stage keeps Python's "Practice this →" guided-drills CTA
- **AI Coach Modes 1+3** — Haiku stuck-hints on Try/Build, Sonnet gap analysis on Compare; key field added to the Settings modal. Key is `localStorage['apk-coach-key']` — SHARED with the Excel kit (enter once, works in both). ⚠️ SQL still uses its own `sql-coach-key` — migration to the shared key noted for cleanup
- **Grain-correct CSS** — v2 styles use `color-mix(in srgb, var(--accent) N%, transparent)` tints, not baked rgba. ⚠️ Noted: SQL's v2 CSS (shipped v1.84.0) carries baked-blue `rgba(47,109,240,…)` tints — cleanup item
- **Pilot lesson data** (parsons/compare/build/close/unlock) — Unit 0 (ids 101–104) + Unit 1 (ids 1–3), all parsons authored from scratch with strict dependency chains (one valid order); validated programmatically
- Untested in browser (build sprint)

---

## [1.86.2] — 2026-06-30 — 🔍 Phase H2: Python content review complete

Full accuracy / relevance / friction / style audit of all 42 Python lessons (per the locked content-review-first rule). Track Units 4–7 were clean (same Grain authoring batch as SQL); five fixes landed in the older Unit 0–2 content plus one in Unit 6:

- **id:102 (Lesson 2)** — `int(x)` failure on unparseable text is a **ValueError**, not TypeError (chunk-line fix)
- **id:102 (Lesson 2)** — quiz premise was factually wrong: pandas strips CSV quotes and still infers numerics, so quoted `'120'` loads as int64, NOT object. Rewrote the quiz around thousands-separators (`1,200`) — a real cause of numeric-as-object — and the exp now teaches `pd.read_csv(thousands=',')`
- **id:104 (Lesson 4)** — grammar: "it's separate label" → "it's a separate label"
- **id:5 (Lesson 9)** — a Series is not "a one-dimensional DataFrame"; now "a single labeled column of values"
- **id:704 (Lesson 34)** — viz caption's IRR corrected from "about 18%" to "just under 20%" (actual ≈ 19.8%: NPV at 19% = +$9.3K, at 20% = −$2.3K); added setup note that numpy-financial is a separate `pip install numpy-financial` (guaranteed ModuleNotFoundError otherwise)

Observation logged, no action (needs Mike's call): id:13 Deep Copy and id:14 Decorators sit in "Unit 3: Data Cleaning" but are general Python interview topics, not cleaning tasks — could move to a future "Python Interview Extras" grouping during H1.

Content review phase complete for Python; H1 structural port (v2 flow) is next.

---

## [1.86.1] — 2026-06-30 — 🐛 fix: Excel Compare stage rendered stale attempt data

Found during Batch 1 testing (v1.86.0 test plan). The Compare stage's "Your attempt vs Correct answer" display and the "Ask the AI Tutor" button were computed once at initial page load — before the learner had touched the Try stage — so they never reflected the real attempt. Extracted the dynamic part into `v2CompareDynHTML(lid,l,done)`, rendered into a `#v2-compare-dyn-${lid}` wrapper, and `v2ParsCheck()` now refreshes that wrapper live the instant an attempt is checked (right or wrong), instead of relying on the stale HTML baked at `v2Body()` render time.

**Known gap, not fixed here (needs Mike's call):** the Try stage's "Check order" only advances to Compare on a CORRECT answer — a wrong answer just resets the chips for another try. There is no way to reach Compare with an incorrect attempt on record, so with this fix in place the comparison will always show a match and "Ask the AI Tutor" will correctly never appear. The button is real but currently unreachable through the UI.

---

## [1.86.0] — 2026-06-30 — 🏗️ Phase H1-D: SQL v2 lesson data — Units 4–7, all 4 interview tracks (26 lessons)

v2 stage flow (`parsons`, `compare`, `build`, `close`, `unlock`) extended to every remaining SQL lesson — the full Data Migration, From Question to Metric, Financial Analysis, and Advanced Analyst Toolkit tracks. **All 46 SQL lessons now route through `v2SqlBody`** — Phase H1 structural port is complete for the SQL kit.

- **Unit 4: Data Migration** (ids 501–508) — Profiling (Counts/Uniqueness, Duplicates, Nulls/Format Chaos), Cleansing (Standardize Text), Mapping (CASE WHEN), Type Coercion & Defaults, Validation (Row Counts & Control Totals), Reconciliation (EXCEPT/LEFT JOIN orphan check)
- **Unit 5: From Question to Metric** (ids 601–606) — Define the Metric, Segment with CASE, MoM Growth (LAG), Running Totals (window frame), Funnel Conversion, Cohort Retention (capstone)
- **Unit 6: Financial Analysis** (ids 701–706) — Build the P&L, Margins, Liquidity & Leverage Ratios, NPV, Budget vs Actual Variance, Contribution Margin & Break-Even
- **Unit 7: Advanced Analyst Toolkit** (ids 801–806) — Profile the Data First, Validate the Grain, Distribution & Outliers, Pareto, Correlation ≠ Causation, Sanity-Check & Reconcile
- All `parsons` puzzles authored from scratch (no prior `DATA.PARSONS` entries existed for the track lessons); answer-index permutations and build/quiz answer indices verified programmatically
- Repo handoff file renamed `CLAUDE.md` → `apk_CLAUDE.md` (project-named handoff convention)
- All 26 lessons untested in browser (build sprint); test batch covers these in next session

---

## [1.85.0] — 2026-06-30 — 🏗️ Phase H1-B+C: SQL v2 lesson data — Units 2+3 (12 lessons)

v2 stage flow extended to all 12 free lessons in Units 2 and 3 (ids 5–16). Every lesson now has `parsons`, `compare`, `build`, `close`, and `unlock` fields; all route through `v2SqlBody` on load.

- **Unit 2** (ids 5, 6, 7, 8, 13, 14) — COUNT/GROUP BY, LEFT JOIN, HAVING, CASE/COALESCE, RIGHT JOIN, Date Functions
- **Unit 3** (ids 9, 10, 11, 12, 15, 16) — Subqueries, Window Functions, CTEs, Reconciliation, SQL Indexing, Temp Tables vs Views
- **New parsons** — ids 15 and 16 had no prior PARSONS entry; authored from scratch inline on the lesson object
- All 12 lessons untested in browser (build sprint); test batch covers these in next session

---

## [1.84.0] — 2026-06-30 — 🏗️ Phase H1-A: SQL v2 lesson flow — pilot (8 lessons)

v2 stage flow (Orient → Example → Try → Compare → Build → Check → Close) live on Unit 0 (ids 101–104) and Unit 1 (ids 1–4). All other lessons remain on the legacy flat view until their v2 data is authored in subsequent cycles.

- **Infrastructure** — `v2SqlBody`, `setSqlStage`/`getSqlStage`, `v2ParsChipTap`/`v2ParsCheck`, `v2BuildPick`, `v2QuizAnswer`/`v2QuizRetry`, `v2ResetLesson`; stage-bar progress indicator; Focus/Details toggle (`getSqlMode`/`v2SqlToggleMode`)
- **AI Coach Mode 1** — Haiku stuck-hint on Try and Build stages (BYOK); Settings page gains AI Coach key field
- **AI Coach Mode 3** — Sonnet gap analysis on Compare stage ("Ask My Tutor", shows only after a wrong parsons attempt)
- **Lesson data** — added `parsons`, `compare`, `build`, `close`, `unlock` fields to all 8 pilot lessons; Unit 0 parsons authored from scratch; Unit 1 parsons adapted from existing `DATA.PARSONS` entries
- **CSS** — `.v2-stage-bar/dot`, `.v2-stage-card`, `.v2-pool`, `.v2-answer-zone`, `.v2-pars-chip`, `.v2-compare-grid`, `.unlock-card`, `.v2-mode-btn`, `.v2-coach-btn/.resp`, `.v2-coach-key-row`
- **Gate** — `renderLesson` dispatches to `v2SqlBody` when `l.parsons` is present; non-v2 lessons unchanged

---

## [1.83.8] — 2026-06-30 — 🔍 Phase H2: SQL content review complete

Five accuracy and friction fixes across the SQL kit (46 lessons) — no structural changes, content only.

- **id:503 (Lesson 23)** — replaced PostgreSQL `COUNT(*) FILTER (WHERE …)` with MySQL-compatible `SUM(CASE WHEN phone IS NULL THEN 1 ELSE 0 END)`; updated chunk breakdown label to match
- **id:606 (Lesson 34)** — fixed invalid SQL: `FIRST_VALUE(COUNT(…))` can't be applied in the same query level as `GROUP BY`; rewrote with a CTE that aggregates first, then applies the window function on the computed column; updated `lines` breakdown accordingly
- **id:606 (Lesson 34)** — added `cohort_activity` table structure to story (columns `user_id`, `cohort_month`, `months_since_signup`) so learners aren't dropped cold into an unfamiliar schema
- **id:803 (Lesson 43)** — added dialect note to `notes`: `PERCENTILE_CONT` is PostgreSQL / SQL Server / warehouse syntax; flagged MySQL 8.0+ behavior and workaround
- **id:805 (Lesson 45)** — added dialect note to `notes`: `CORR()` is PostgreSQL / warehouse syntax; MySQL has no built-in equivalent; concept is fully portable
- F2 finding (id:602 `GROUP BY 1`) was already addressed in the existing `lines` array — no change needed

All 7 test checks passed (H2-1a through H2-3b). Content review phase complete; H1 structural port is next.

---

## [1.83.5] — 2026-06-30 — 🤖 Phase G Mode 1 (AI Coach stuck-help, Try + Build stages)

### AI Coach stuck-help on Try stage (v1.83.5)

Expanded Phase G Mode 1 to the Try (Parsons) stage. Learners can now ask for hints when arranging formula pieces in order.

- `v2CoachStuck(lid, stage)` refactored to be stage-aware; tracks context in `_coachCtx[lid]` with `{stage, panelId}`
- `v2CoachCall()` routes prompt by stage: Try stage sends pieces array + ordering hints; Build stage sends the multiple-choice question + solving hints
- "Stuck? Ask the coach →" button added below Reset button in Try stage
- Coach panel ID differs per stage to avoid conflicts: `v2-coach-try-${lid}` for Try, `v2-coach-build-${lid}` for Build
- Both stages share the same saved Anthropic key

### Error recovery (v1.83.4)

Fixed retry behavior when API key is rejected.

- On API error, "Try different key" button now clears the saved key and re-prompts (previously just retried with the same bad key)
- Allows learners to swap keys without clicking a small "Change key" link
- "Ask again" button still works on success

### AI Coach stuck-help (Mode 1 core, v1.83.3)

Learners can ask for scaffolded hints on attempted problems. BYOK (bring your own Anthropic key) model; uses Haiku for low-latency, high-volume hint generation.

- **Try stage:** Parsons ordering hints. Prompt sends question + all pieces; Haiku suggests ordering logic without revealing the answer
- **Build stage:** Multiple-choice hints. Prompt sends the question; Haiku suggests how to think through it without revealing the answer
- Key saved to `localStorage['apk-coach-key']` for session persistence
- On first "Stuck?" click, prompts for key + offers "Get a key" link; subsequent clicks use saved key
- Coach panels render below the practice buttons; "Thinking…" feedback while calling the API
- Max 250 tokens per Haiku call; error messages include the API error so learners can debug key issues
- "Hosted AI Coach (included with the pass) coming soon" notice indicates BYOK is temporary

---

## [1.83.0] — 2026-06-29 — 🧠 Phase F (focus/details toggle) + free access until Aug 1

### Phase F — Focus/Details toggle (v1.82.1)

Two-mode toggle on every Excel lesson's Worked Example stage. **Focus** (default) shows the RAL formula breakdown and grid visual only — zero noise. **"More details"** expands to also reveal the Gotcha card (`l.notes`, amber border) and the intro paragraph (`l.intro`). Preference is saved in `localStorage['epk-lesson-mode']` and persists across lessons and visits.

- `getLessonMode()` / `setLessonMode()` helpers added near other state helpers
- `v2ToggleMode(lid)` handler flips mode, updates both hidden divs and the button label
- Bare `l.notes` render in the Worked Example block replaced with toggle wrappers; `l.intro` folded in alongside it
- Toggle button: `btn-outline btn-sm`, label "More details" / "Less"

### Free access until August 1 (v1.82.2)

All premium gates removed until August 1, 2026. Content will be re-gated after Phase G (AI Coach) and Phase H (port to all kits) are complete and the full premium feature set is defined.

- `apkPass.isUnlocked()` returns `true` before 2026-08-01 (code-check logic resumes after that date)
- Hub founding-offer banner replaced with a plain "Everything is free until August 1" notice
- "Have a code?" redeem section removed from hub (no gate to unlock)
- Gate redesign added to ROADMAP Parking Lot — rebuild with actual premium features in hand

---

## [1.82.0] — 2026-06-29 — 🧠 Excel Learning-Science Polish · Phase E (motivation layer)

Phase E adds an honest, SDT-guarded motivation layer — no hearts, no streak anxiety, no cheerleading. Three tasks shipped across v1.81.1–v1.81.4:

- **Honest unlock (E1, v1.81.1 + v1.81.2):** All 51 lessons now carry an `unlock:` field — a deeper "why," a real job insight, or a subtle gotcha that makes the concept click harder. The unlock card (`key` icon, accent border) appears in the Close stage only after the lesson is completed (`done === true`). The reward is more of the actual knowledge — permanent and revisitable — not points or tokens.
- **Return-visit greeting (E2, v1.81.3):** On Home render, compares today's date to `localStorage['epk-last-visit']`. If returning after ≥1 day, a single quiet line appears in the resume card: "Good to have you back. Pick up where you left off." No streak counter, no flame emoji. One greeting per return visit (cleared on same-day reload).
- **Mentor-voice audit (E3, no commit needed):** Scanned all 51 `close:` strings for cheerleading ("Great work!") or loss-framing ("Don't forget…"). None found — Phase C held the standard.

Phase E is complete. Phase F (Focus/Detailed toggle) is next.

---

## [1.81.0] — 2026-06-29 — 🧠 Excel Learning-Science Polish · Phase D (spaced recall + progressive spine + honesty layer)

Phase D wires learning-science research directly into the lesson flow. Five sub-tasks shipped across v1.80.1–v1.81.0:

- **Spaced-recall engine (D1 + D2):** Every lesson carries 1–3 `reinforces:[]` retrieval prompts. When a lesson is rated "Still shaky" or "Getting there", cues are queued at +1/+3/+7 lesson positions in `localStorage`. On the due lesson, a recall card appears above Orient with "I remembered it / Nope, remind me again" buttons. "I remembered it" increments a persistent win counter; "Nope" re-queues at +1.
- **Progressive-artifact bridge (D2):** Non-Unit-0 lessons that are not first in their unit show a one-line bridge above Orient: "Last time you built: [prev lesson title]. Now you'll add to it." Wires consecutive lessons together cognitively.
- **Retrieval-honesty note (D3):** Small italic line below both the Try and Build stage badges: "This feels harder because it works — struggling to recall is how memory forms." Primes the learner before each hard-recall moment.
- **Recall-wins counter (D3):** Close section shows "🔁 N recalled" (suppressed at 0) — a running tally of successful recalls across the whole kit.
- **Dead-code cleanup (D4):** Removed stale `flagged:[]` state default; Lucide `createIcons()` loop fixed via `refreshIcons()` wrapper that strips `data-lucide` from generated SVGs.
- **Rating-button radio group fix:** Confidence rater is now a true radio group — one highlight at a time, always re-rateable, no baked-in default.
- **Try-puzzle audit (all 51 lessons):** Full sweep of every Parsons puzzle against a 5-rule quality checklist. Fixed 8: 4 broken checkers (pieces/ans mismatch) + 4 bad-UX (numbered steps, trivial arrangements, concept mismatch).

Phase D is complete. Phase E is next.

---

## [1.80.0] — 2026-06-29 — 🧠 Excel Learning-Science Polish · Phase C (v2 flow rolled to all 51 lessons)

Applied the Phase B v2 lesson flow (Orient → Try → Compare → Build → Own → Close) to all 48 remaining Excel lessons across Units 0–10. Every lesson now opens with a manager scenario, walks through a Parsons chip-ordering exercise, reveals the mental model, offers a tap-choice Build question, and closes with a forward teaser. Committed per unit (v1.79.1–v1.79.11). Phase C is complete; all 51 lessons carry `flow:'v2'`.

---

## [1.79.0] — 2026-06-29 — 🧠 Excel Learning-Science Polish · Phase B (progressive v2 lesson flow)

Rebuilt formula-spine lessons (SUM id:1, IF id:2, Nested IF id:14) with a new 7-stage progressive flow: Orient → Worked Example → Try (Parsons chip-ordering) → Compare → Build (tap-choice) → Own (quiz) → Close. Each stage is hidden until the previous step is completed — retrieval practice is now embedded in the lesson itself, not buried in a separate Practice screen. Parsons problems generate the formula from shuffled chips; Build is tap-to-choose with correct answer reveal; Own reuses the existing quiz system. Confidence rating (Still shaky / Getting there / Have it) added at Close to drive spaced-recall in Phase D. Phase B is backward-compatible: all 48 non-v2 lessons render through the unchanged original path.

---

## [1.78.1] — 2026-06-29 — Home page "In this kit" nav grid (Excel)

Added a compact tile grid on the Excel kit home page linking to every nav section: Lessons, Practice, Workspace, Pivot Lab, Cards, Glossary, and Exam. Users can now navigate to any part of the kit from the home page without hunting the header. Placed between the review list and the Lessons card. Cross-kit porting tracked in `EXCEL_POLISH_MASTER_PLAN.md` cross-kit changes log (entry #1).

---

## [1.78.0] — 2026-06-29 — 🧪 Excel Learning-Science Polish · Phase A (foundation fixes)

First shippable slice of the Excel learning-science redesign (full plan in `EXCEL_POLISH_MASTER_PLAN.md`). Stand-alone foundation fixes that de-risk the mobile/correctness feedback before the bigger lesson-flow rebuild (Phase B, the exemplar). Content was authored and adversarially verified via multi-agent workflows. Excel kit only; pattern ports to the other kits later (Phase H).

- **Skill Readiness now reflects every lesson.** Replaced the frozen 16-point hardcoded score (covered only a Unit 1–3 subset, never moved when lessons were added) with a live computation grouped into skill areas, derived from the actual lesson set + the learner's *accessible* lessons (premium tracks count once unlocked). The home "next up" list and "all complete" copy now track the same accessible set — no more surfacing locked lessons or a wrong total.
- **Fill-in-the-Blank → gradable multiple choice.** The last free-text drill could mark a correct-but-unrecognized variation wrong; converted to tap-the-choice (24 items, each with 2 adversarially-verified distractors that are real Excel mistakes and never equivalent to the answer under normalization). Removing the text box also resolves the mobile submit-button-placement complaint for this drill. (`renderFill`/`pickFill`; removed `checkFill`/`normVal`/`_fillAttempts`/`#fillInput`.)
- **Real charts where charts are discussed.** New zero-dependency inline-SVG chart library (themed via CSS vars, works dark + light): a regional bar chart on Lesson 17 "Your First Chart," and a misleading-axis bar chart on the "What's Wrong?" #17 drill (the chart-less item flagged in feedback). Also corrected WRONG#17's explanation, which was factually backwards about why values bunched near a 0-based axis look identical.
- **Mobile overflow fixes.** `overflow-wrap`/`word-break` on tap-choice formula buttons, Parsons chips, and example boxes so long formulas no longer clip off the iPhone card edge; `.check-row` wraps on narrow screens.
- **Honest completion.** A failed Quick Check now offers "Skip for now" (moves on *without* marking the lesson done) instead of "Continue anyway" (which falsely marked it complete) — keeps the readiness score honest while staying free to explore (Vision #3).
- **Copy:** stale "28 lessons across seven units" / "All 16 lessons complete" now computed from the live lesson set.

Verified: all inline scripts parse; private headless harness green (excl. 3 stale checks for the v1.72-removed flag feature); 5-dimension adversarial review (correctness / regression / mobile / data-integrity / SVG) returned **0 high findings**, and the 24 distractor sets were independently re-verified clean.

## [1.77.0] — 2026-06-25 — 📚 Phase 3: Python (42) + Power BI (39) tracks — **track rollout COMPLETE**

Added the 4 interview tracks to the last two tool kits, finishing the additive-tracks
phase. All 4 tool kits (SQL, Excel, Python, Power BI) now carry Data Migration · From
Question to Metric · Financial Analysis · General Analyst Toolkit.

- **Python kit:** +24 track lessons (Units 4–7; ids 401–406/601–606/701–706/801–806) →
  **42 lessons**. Python `ral` is an array of `{formula,say,lines}` (Grain `code`→
  `formula`); viz renders via `lessonOutputHTML`'s **`df` table** slot — chart viz
  converted to `{df:{columns,rows}}`.
- **Power BI kit:** +23 track lessons (Unit 4 = 5 lessons; ids 401–405/601–606/701–706/
  801–806) → **39 lessons**. Power BI `ral` is `{code,say,lines}`; viz renders via
  `lessonPbiHTML`'s **`html`** slot — chart viz converted to an inline HTML table.
- Both: chart viz the kits can't draw rendered as **data tables** (Mike's call); lesson
  `intro` made optional in each render.
- **Hub labels updated:** Python 42, Power BI 39 (joining Excel 51 · SQL 46 · Tableau 32
  · Stats/Interview 16 · Charts/Forecasting 13).

Each kit now **matches Grain's declared total** (SQL 46 · Excel 51 · Python 42 · Power BI
39). **Verified headless:** both kits 0 syntax errors, correct totals, all 4 track units
present; hub 0 errors.

**Phase 3 (additive interview tracks) is complete.** Remaining is **Phase 4** (separate
decision): cross-kit Cards/Practice/Glossary surfaces, real Grain dark palette.

## [1.76.0] — 2026-06-25 — 📚 Phase 3: Excel kit tracks (51 lessons) + 🏷️ hub lesson labels fixed

**Excel kit — all 4 interview tracks added** (23 lessons), purely additive:
- **Unit 7: Data Migration** (521–525, 5), **Unit 8: From Question to Metric** (601–606),
  **Unit 9: Financial Analysis** (701–706), **Unit 10: General Analyst Toolkit** (801–806).
  Excel now **51 lessons** (28 core + 23 tracks) — matches Grain's target.
- Per-kit shape differs from SQL: Excel `ral` is an array of `{formula, say, lines}`
  blocks (Grain `code`→`formula`), and viz is a spreadsheet **grid** `{cols, grid}`.
  Extended the chart→table converter (added `histogram`) then wrapped each into grid
  form (column letters + headers in row 1) so they render via the existing
  `lessonGridHTML`. Made Excel's lesson `intro` optional in the render.

**🏷️ Hub lesson-count labels corrected** (`index.html`) — they all said "12 lessons"
(stale since the curriculum grew well before this). Now accurate per kit: Excel 51 ·
SQL 46 · Tableau 32 · Python 18 · Stats 16 · Power BI 16 · Interview 16 · Chart
Literacy 13 · Forecasting 13. (Simulator / Final keep their "5 days · 10 tasks" /
"Study + 28 Qs" labels.)

**Verified headless:** Excel 0 syntax errors, 51 lessons, all 4 track units present,
all track viz grid-shaped; hub 0 syntax errors, all labels accurate.

**Next:** Python, then Power BI (same recipe; each kit's table/grid renderer differs).

## [1.75.0] — 2026-06-25 — 📚 Phase 3: SQL kit — all 4 interview tracks complete (46 lessons)

Added the remaining 3 interview tracks to the SQL kit (Unit 4 shipped in v1.74.0):
- **Unit 5: From Question to Metric** (6 lessons, 601–606)
- **Unit 6: Financial Analysis** (6 lessons, 701–706)
- **Unit 7: General Analyst Toolkit** (6 lessons, 801–806)

**SQL kit is now 46 lessons** (20 core + 26 across 4 tracks) — matches Grain's target.
Content translated from `lessons-sql.js` into the SQL kit's lesson shape.

**Chart viz → data tables** (per Mike's call): these tracks use chart viz the SQL kit
can't draw (bar/line/waterfall/boxplot/combo/scatter). A converter renders each chart's
underlying data as a "See it on screen" result table via the existing `lessonResultHTML`
— e.g. a waterfall P&L becomes a Step/Amount table, a boxplot becomes a five-number
summary, a scatter becomes an x/y table. No new rendering engine, no Chart.js added.

**Verified headless:** 0 syntax errors; 46 lessons; all 4 track units present; every new
lesson's viz is a `{columns,rows}` table (no unrenderable chart types remain).

**Next:** roll the same 4 tracks to Excel, Python, Power BI (one kit per cycle), reusing
this chart→table converter.

## [1.74.0] — 2026-06-25 — 📚 Phase 3 (content) begins: SQL "Data Migration" interview track

First slice of Phase 3 — adding Grain's **cross-kit interview tracks** to the tool kits,
purely additive (existing lessons untouched). Approach confirmed with Mike: add the new
tracks only, one kit per cycle, starting SQL.

- **SQL kit: added Unit 4 "Data Migration"** — 8 new lessons (ids 501–508) bolted onto
  the existing curriculum: Profiling (counts/uniqueness, duplicates, nulls & format
  chaos), Cleansing (standardize text), Mapping (CASE WHEN source→target), Type Coercion
  & Defaults (CAST + COALESCE), Validation (row counts & control totals), Reconciliation
  (what didn't make it). Content from Grain's `lessons-sql.js`, translated into the SQL
  kit's existing lesson shape (`code`→`ral.sql`, `say`→`ral.say`, `lines`→`ral.lines`,
  `viz` table). SQL now has **28 lessons** (was 20). Directly relevant to Mike's
  AlayaCare data-migration interview.
- Made the lesson `intro` field optional in the render (`${l.intro?…:''}`) — the Grain
  track lessons lead with `story`, no separate intro.

**Verified headless:** 0 syntax errors; all 8 lesson ids present; Unit 4 groups correctly;
all viz are `table` (render via the existing `lessonResultHTML`); nav flows to the finish
celebration after lesson 508.

**Known next step:** SQL's other 3 tracks (Units 5–7) and the other tool kits use chart
viz types (bar/line/waterfall/boxplot/combo/scatter) the kits can't currently draw —
a viz-handling decision is pending before they're added. Also noted: the hub's per-kit
"12 lessons" labels are pre-existing stale (kits have 20–28) — separate fix.

## [1.73.1] — 2026-06-25 — 🧹 Cleanup: remove dead flag-feature code + fix Forecasting copy leftovers

Post-Phase-2 tidy-up (no user-facing behavior change beyond two copy fixes).

- **Forecasting kit:** fixed two "Chart Literacy" copy-paste leftovers — the Home
  hero now reads **"Start learning forecasting"** (was "Start learning charts"), and
  the Settings → About line now reads **"Forecasting & Trend Modeling Kit"** (was
  "Chart Literacy Kit").
- **Dead-code removal (all 6 core lesson kits):** the flag feature was retired in
  v1.72.0 but its helpers lingered. Removed the now-unused `isFlagged`,
  `toggleFlag`, `flagBtnHTML`, `flagLabel` functions and the `.flag-btn` CSS rules
  (kept `.flag-row`/`.flag-row-title`, which the confidence-driven review list still
  uses). **Also removed 5 lingering guided-practice step flag references**
  (`flagBtnHTML(step[0],…)`) that the v1.72.0 sweep missed — these called a function
  that v1.72.0's UI removal had left callable, but the dead-code pass would have made
  them throw in the guided view; both the calls and the function are now gone.
  (`flagged:[]` left in each kit's state for back-compat; it's simply unread.)

**Verified headless (all 6 kits):** 0 syntax errors; 0 remaining references to any of
the 4 removed helpers; `renderFlagged`/`confGotIt`/`DRILL_TYPES`/`.flag-row` all
intact.

## [1.73.0] — 2026-06-25 — 🎨 Grain redesign Phase 2j: Final Exam kit — **Phase 2 COMPLETE**

Restyled the **Final Exam** kit (28-Q cross-subject test + study guide) to the Grain
design system — the **last** of the non-core surfaces. Style only; the exam
engine, scoring, per-section submit, and study-guide content are unchanged.
**This completes the Grain Phase-2 rollout: all 11 kits + the hub are now on Grain.**

- Link `assets/grain/grain.css`; re-point the kit's full semantic var set onto Grain
  tokens (no one-off hex). `:root` = warm dark; `[data-theme="light"]` = Grain cream.
  `--good` → leaf, `--warn` → amber, `--bad` → rust.
- Space Grotesk headings (nav/CTA/study/exam titles); IBM Plex body/mono.
- Nav brand glyph (`▦`) → Grain `.logo-mark` + Lucide **`clipboard-check`**; Reset +
  theme chrome (`↺`/`☀☾`) → Lucide `rotate-ccw` / `sun`·`moon`; the two home CTA
  icons (`📖`/`📝`) → Lucide `book-open` / `clipboard-list`; the study-viz "See it"
  caption (`📺`) → Lucide `monitor`; the Results "Retake exam" `↺` → Lucide.
- **Per-subject palette** (`--c-excel`…`--c-interview`, 7 cool greens/blues/purple)
  remapped to distinct, cream-readable Grain hues (leaf / teal / clay / amber / rust
  / stone / dark-teal).
- Six baked accent/error rgba tints → `color-mix` off `var(--accent)` / `var(--bad)`.
- Added the robust Lucide loader.
- **Intentionally left as pedagogical content:** the star-schema study diagram emoji
  (📅 👤 ★ 📦 🌐), the 🗣️ "Say it out loud" + 🔒 absolute-ref notes, and — notably —
  the **Tableau dimension/measure study pills** keep their blue/green (`#5b8cf5` +
  `▦` / green): that blue=dimension, green=measure coloring mimics Tableau's real UI,
  so recoloring it would make the lesson wrong.

**No Chart.js** in this kit, so the defer trap didn't apply.

**Verified headless:** 2 inline scripts, 0 syntax errors; only the intentional
Tableau-pill glyph remains; content emoji preserved. Awaiting Mike's live playtest.

## [1.72.0] — 2026-06-24 — ♻️ Review list is now driven by the confidence rater (flag feature removed)

Mike-reported (June 24, 7:00 PM ET): the **"Shaky? Flag to revisit"** button was
**redundant** with the lesson confidence rater ("How well do you have this?"). If a
learner doesn't mark a lesson as "Have it," that should be enough to put it on the
review list — no separate flag tap needed.

**Change (all 6 core lesson kits — Excel, SQL, Python, Tableau, Stats, Power BI):**
- **Removed the flag feature entirely** — the per-lesson "Shaky? Flag to revisit"
  button AND the per-drill flag buttons (SQL & Power BI had literal-keyed flags;
  Excel/Python/Tableau/Stats had variable-keyed drill flags). One clean model.
- **The Home "Your review list" card is now driven by the confidence rating:** a
  lesson appears when rated **"Not yet"** (shown as a *Not yet* tag) or **"Almost"**
  (*Almost*). Rating **"Have it"** keeps it off; **unrated** lessons don't appear
  (no signal yet) — per Mike's "if they don't mark have it, it goes to review."
- The list's **"✓ Got it now"** button now calls a new `confGotIt(lessonId)` that
  sets the lesson's confidence to "high" (removing it), instead of the old
  `toggleFlag`. Card subtitle updated: "Lessons you rated below 'Have it'."
- Decisions confirmed with Mike up front: review threshold = below "Have it";
  remove all flags (no per-drill flagging).

**Note:** old saved `flagged` entries are simply ignored now (the array remains in
state for back-compat but is no longer read). The now-unused flag helpers
(`flagBtnHTML`/`toggleFlag`/`isFlagged`/`flagLabel`) and `.flag-btn` CSS are left
in place as dead code — a separate cleanup.

**Verified headless (all 6 kits):** 0 inline-script syntax errors; 0 remaining
`flagBtnHTML` call-sites; `confGotIt` present; review list confidence-driven; new
subtitle in place. Logic-tested: low/mid surface, high/unrated excluded, "Got it
now" removes. **✅ Verified by Mike on the live site — 072a/b/c all pass.**

## [1.71.0] — 2026-06-24 — 🎨 Grain redesign Phase 2i: Simulator (Claude-API) kit

Restyled the **Associate Data Analyst Simulator** to the Grain design system —
the fourth of the 5 non-core surfaces, and the only one that makes **live Claude
API calls**. **Style only — the API/fetch/prompt/grading logic was not touched**
(endpoint, `claude-sonnet-4-5` model, `x-api-key` + direct-browser headers, and
the `sim2-apikey` localStorage flow all verified intact).

- Link `assets/grain/grain.css`; re-point the kit's full semantic var set onto
  Grain tokens (no one-off hex). `:root` = warm dark; `[data-theme="light"]` =
  Grain cream default. `--good` → leaf (green completion states), `--info` → teal
  (Sarah the reviewer's avatar), `--warn` → amber, `--bad` → rust.
- Space Grotesk headings (intro/board/task titles + nav + modal); IBM Plex body/mono.
- Nav brand glyph (`▦`) → Grain `.logo-mark` + Lucide **`briefcase`**; the API-Key,
  Reset and theme chrome buttons (`⚙`/`↺`/`☀☾`) → Lucide `settings` / `rotate-ccw`
  / `sun`·`moon`; the intro hero `📊` and the three stat icons (`📅`/`✓`/`💬`) →
  Lucide `bar-chart-3` / `calendar-days` / `list-checks` / `message-square`.
- Two baked tints (`rgba(47,109,240,…)` view-feedback hover, `rgba(122,179,230,…)`
  reviewer avatar) → `color-mix` off `var(--accent)` / `var(--info)`.
- **Skill-category palette** (`TYPE_COLOR`: SQL/Python/Excel/Tableau/Communication/
  Reflection) remapped from cool greens/blues/purple to distinct, cream-readable
  Grain hues (teal / clay / leaf / amber / stone / rust).
- Added the robust Lucide loader (same as the other kits).
- Pedagogical content emoji left intact (🗣️ Say It Out Loud, 💡 hints, 🎉 complete,
  👤 manager, and the `PASS ✓`/`FAIL ✗` markers inside the assignment prompts).

**No Chart.js** in this kit, so the defer trap didn't apply.

**Verified headless:** 2 inline scripts, 0 syntax errors; API/engine block confirmed
untouched; 0 old-color/blue-rgba/chrome-emoji residue. Awaiting Mike's live playtest
(dark + light; intro → board → a task; optionally paste an API key for a live review).

## [1.70.0] — 2026-06-24 — 🎨 Grain redesign Phase 2h: Interview kit

Restyled the **Interview Prep** kit to the Grain design system — the third of the
5 remaining non-core surfaces. Style only; engine and content unchanged. This kit
is **structurally different** from the lesson kits (rate-the-answer / multiple-choice
drills, an Answer Builder, a sealed-intention card — no `freeDrill` guided-practice
path), so there was no freeDrill bug to fix here.

- Link `assets/grain/grain.css`; re-point the kit's semantic vars onto Grain tokens
  (no one-off hex). `:root` = warm dark; `[data-theme="light"]` = Grain cream default.
  Added `--err` (rust) and `--warn` (amber) vars — this kit previously hardcoded its
  state colors.
- Space Grotesk headings (`h1–h4` → `--font-display`); IBM Plex body/mono.
- Nav brand mark (`▦` CSS glyph) → a Grain `.logo-mark` + Lucide **`messages-square`**;
  settings/theme chrome emoji (`⚙️`/`🌓`) → Lucide `settings` / `sun-moon`; the
  settings-modal header gear → Lucide.
- **Token-faithful tint conversion:** the kit had the old blue accent baked into
  **14** `rgba(47,109,240,…)` tints (active states, callouts, choice-correct,
  say-it box, flashcard back, sprint bar) — all re-derived via
  `color-mix(in srgb, var(--accent) N%, transparent)` so they follow the clay
  accent and theme. Hardcoded wrong/ok state colors (`#c85050`/`#e07070`/`#c8a03c`
  and their rgba tints) → `var(--err)` (rust) / `var(--warn)` (amber).
- Added the robust Lucide loader (`grainRefreshIcons` + strip-`data-lucide` +
  disconnect-during-refresh observer + poll-for-Lucide), same as the other kits.
- Pedagogical content emoji left intact (📢 Say It Out Loud, 💡 hint, 🔒 sealed
  intention, 🎉 toast), per the per-kit recipe.

**No Chart.js** in this kit, so the defer trap didn't apply.

**Verified headless:** 2 inline scripts, 0 syntax errors; 0 blue/old-hex residue;
all referenced Grain tokens defined. **✅ Verified by Mike on the live site — 070a/b/c
all pass** (nav/brand, warm rust wrong-state + clay-tinted highlights, theme toggle).

## [1.69.0] — 2026-06-24 — 🎨 Grain redesign Phase 2g: Forecasting kit (+ freeDrill fix)

Restyled the **Forecasting & Trend Modeling** kit to the Grain design system —
the second of the 5 remaining non-core surfaces. Style only; the kit's engine and
content are unchanged. Also fixed the latent `freeDrill` Practice bug it shared
with Chart Literacy (flagged in v1.68.1), bundled in per the Phase-2g plan.

**Grain restyle (mirrors the proven Chart Literacy recipe):**
- Link `assets/grain/grain.css`; re-point the kit's semantic vars onto Grain
  tokens (no one-off hex). `:root` = warm dark variant; `[data-theme="light"]` =
  the Grain cream look (default).
- Space Grotesk headings (`h1–h4` → `--font-display` + `--tracking-tight`);
  IBM Plex body/mono.
- Nav brand mark CSS-emoji → a Grain `.logo-mark` + Lucide **`trending-up`**;
  settings/theme chrome emoji and the 5 drill-tile icons → Lucide.
- Added the robust Lucide loader (`grainRefreshIcons` + strip-`data-lucide` +
  disconnect-during-refresh observer + poll-for-Lucide), same as Stats / Chart
  Literacy, to avoid the `createIcons` self-match loop.

**Chart.js note:** the handoff flagged the Chart.js-`defer` top-level trap for
this kit, but Forecasting **does not use Chart.js** — its lesson visuals are
inline HTML (`viz.html`), like Chart Literacy's inline SVG. The trap did not
apply; no Chart.js was added.

**🐛 freeDrill fix (same as Chart Literacy v1.68.1):** the free-practice path
builds a guided session with `lessonId:null`, but `renderGuidedStep()` read
`lesson.title` on an undefined lesson → **TypeError** → render aborted, so
clicking a Practice drill tile did nothing. `renderGuidedStep()` and
`guidedNext()` now handle the no-lesson case — a "Free practice · &lt;type&gt;
N/M" header, a "← Back to practice" button, and a Finish that returns to the
practice grid (instead of `gotoNext(null)`).

**Verified headless** (3 inline scripts, 0 syntax errors; all Grain tokens
referenced are defined in `assets/grain/`). Awaiting Mike's live playtest
(dark + light; click-test all 5 Practice drill types).

## [1.68.1] — 2026-06-23 — 🐛 Fix: Chart Literacy "Practice" drills did nothing on click (pre-existing)

Mike-reported (June 23, 7:17 PM ET) during v1.68.0 testing: in Chart Literacy the
lessons worked but the **Practice tab drills did nothing** — click a drill tile and
nothing happened.

**Cause (pre-existing, NOT the Grain restyle — the restyle only touched
icons/vars):** the **free-practice** path (`freeDrill`) builds a guided session with
`lessonId:null`, but `renderGuidedStep()` did `DATA.LESSONS.find(l=>l.id===lessonId)`
(→ `undefined`) and then read `esc(lesson.title)` → **TypeError: Cannot read
properties of undefined (reading 'title')** → the render aborted, so nothing
appeared. (Lesson-driven guided practice worked because it passes a real `lessonId`.)

**Fix:** made `renderGuidedStep()` and `guidedNext()` handle the no-lesson case —
a "Free practice · &lt;drill type&gt; N/M" header, a "← Back to practice" button
that routes to the practice list, and a Finish that returns to the practice grid
(instead of calling `gotoNext(null)`).

**Verified (live localhost):** all 5 drill types (Fill / Fix / What's Wrong /
Parsons / Name That Chart) open, answer, advance with Next, and Finish back to the
practice list — no throw, no console errors; 0 inline-script syntax errors.

**Note:** the **Forecasting** kit shares this exact `freeDrill` code and has the
same latent bug — it'll be fixed as part of the Forecasting Grain cycle (Phase 2g,
next). The 6 core lesson kits use a different practice structure and are unaffected.

## [1.68.0] — 2026-06-23 — 🎨 Grain redesign Phase 2f: Chart Literacy kit

Restyled the Chart Literacy kit to the Grain design system — the first of the
five remaining non-core surfaces (Chart Literacy · Forecasting · Interview ·
Simulator · Final).

**What changed (style only — no engine/content changes):**
- Linked `../assets/grain/grain.css` and re-pointed the kit's own semantic vars
  (`--bg/--surf/--surf2/--accent/--accent2/--text/--dim/--border/--success/--err/--warn/--font/--mono`)
  onto Grain tokens — no one-off hex. `:root` = warm dark variant; `[data-theme="light"]`
  = the full Grain cream look (default).
- Headings now use Space Grotesk (`--font-display`); body uses IBM Plex Sans/Mono.
- Nav brand mark converted from a CSS `::before` emoji to a Grain `.logo-mark`
  with a Lucide `bar-chart-big` icon; settings/theme chrome emoji and the five
  drill-tile icons converted to Lucide line icons.
- Added the **robust Lucide loader** (`grainRefreshIcons()` + a strip-`data-lucide`
  + disconnect-during-refresh MutationObserver + poll-for-lucide) — same as Stats,
  so dynamically-injected icons convert without the createIcons self-match loop
  that froze a kit in v1.64.1.

**Notes:** Chart Literacy renders its example charts with inline **SVG**, not
Chart.js — so the Chart.js-`defer` top-level trap (v1.67.1) does not apply here.
The SVGs reference `var(--accent/--err/--dim)`, so they re-themed to Grain
automatically. RAL / "Say It Out Loud" lesson structure was already present and
is unchanged.

**Verified (headless + live localhost, dark + light):** 0 inline-script syntax
errors; Grain tokens applied (clay accent, warm stone surfaces); all icons
convert to SVG with no leftover `<i data-lucide>` and no `svg[data-lucide]`
loop residue; lessons/practice render; nav responsive (no freeze); no console
errors. Awaiting Mike's live-URL playtest.

## [1.67.1] — 2026-06-23 — 🐛 Fix: Stats kit blank on load + dead Cards tab (pre-existing crash)

Mike-reported (June 23): clicking into Stats showed blank areas. Found via a
full headless sweep of all 11 kits + hub.

**Cause (pre-existing, since Chart.js went `defer` in v1.54.1 — not the Grain
restyle):** `Chart.register(vertLinesPlugin)` ran at the top level of the inline
script, but Chart.js loads with `defer`, so `Chart` was `undefined` at that
point → it threw and **aborted the rest of the script**. Everything after it
never ran: the `let cardFlipped` declaration (so the **Cards** tab threw a
temporal-dead-zone error and rendered blank) and the **BOOT** call
(`loadState/applyTheme/show('home')`) — so the kit showed a **blank landing**
until you clicked a tab.

**Fix:** register the plugin only if `Chart` is defined, otherwise on
`window.load` (after the deferred Chart.js is ready) — never throw at top level.

**Verified by headless sweep:** Stats now boots to Home on load, the Cards tab
renders, and every view (Home/Lessons/Practice/Distribution Lab/Cards/Glossary)
has content. All other 10 kits + hub confirmed rendering every view with no
errors.

## [1.67.0] — 2026-06-23 — 🎨 GRAIN redesign · Phase 2e (Stats kit) — all 6 lesson kits done

Grain applied to Stats — completing the **six core lesson kits**. Stats is
section-based (no Read-Aloud `ral`), so the lesson view gets the Grain visual
treatment rather than the megaphone card. **Chart.js + the Distribution Lab are
untouched** (charts draw into a real canvas — verified).

- **Shell → Grain:** links `../assets/grain/grain.css`; the kit's distinct vars
  (`--txt/txt2/accdim/ok/bord` + standard) re-pointed onto Grain tokens (no
  one-off hex); Space Grotesk headings; lesson code blocks darkened to a Grain
  stone-900 surface.
- **Emoji → Lucide** across the chrome (Σ brand mark, nav exam/settings/theme,
  home review, lesson-list status, drill pickers, drill hints, the Read-It
  toggle, flags). 
- **Lesson view → Grain:** Grain amber story bridge; section cards with clay
  `.sec-head` headings + dark code blocks; the Chart.js "See it on screen" gets a
  Grain section eyebrow; "Quick Check" gets a Lucide icon; added the confidence
  rater (persisted to `S.confidence`).
- **Icon loader hardened:** Stats uses a **disconnect-during-refresh** observer
  (can't loop) plus a short **poll-for-Lucide** retry so the initial nav/home
  icons still render if the CDN loads late.

Verified in-browser (incl. a chart lesson). Distribution Lab, charts, progress,
flags, quizzes unchanged. **Phase 2 lesson kits complete** — remaining surfaces:
Chart Literacy, Forecasting, Interview, Simulator, Final.

## [1.66.0] — 2026-06-23 — 🎨 GRAIN redesign · Phase 2d (Tableau kit)

Grain applied to Tableau. **Chart.js lesson charts + the Viz Builder + the
Workspace tour are untouched** (charts still draw into a real canvas — verified
the canvas-timing path is preserved).

- **Shell → Grain:** links `../assets/grain/grain.css`; vars re-pointed onto
  Grain tokens (no one-off hex; the dimension-blue / measure-green pill colors
  map onto Grain teal / leaf); Space Grotesk headings; fixed a stray `:root`
  override that still carried old hex.
- **Emoji → Lucide** across UI chrome (brand mark, nav workspace/exam/settings/
  theme, home review + Sprint + builder/workspace buttons, flags, drill pickers,
  drill hints, lesson-list status, workspace tour, the Read-It toggle). Lucide
  via CDN with the loop-safe `document.body` observer. Tableau's rich
  interface/chart-type/field emoji inside lesson content are left as illustrative
  content.
- **Lesson view → Grain "Say It Out Loud":** megaphone-headed card; each `ral`
  block shows its **shelf** artifact + chunk-by-chunk `lines` (clay chips); the
  Chart.js "See it on screen" visual gets a Grain section eyebrow; story bridge
  → Grain amber callout; "Note" + "Quick Check" get Lucide icons; added the
  confidence rater (persisted to `S.confidence`).

Verified in-browser (incl. a bar-chart lesson). Charts, Viz Builder, Workspace,
progress, flags, quizzes unchanged.

## [1.65.0] — 2026-06-23 — 🎨 GRAIN redesign · Phase 2c (Power BI kit)

Same Grain treatment as the other lesson kits, applied to Power BI (a SQL-clone
architecture). **The DAX Lab reference + workspace tour are untouched.**

- **Shell → Grain:** links `../assets/grain/grain.css`; the kit's vars
  (`--bg/surf/accent/text/muted/border/red/green/yellow/r/r2`) re-pointed onto
  Grain tokens (clay-on-cream, no one-off hex); Space Grotesk headings; quiz /
  code-state soft-tints moved to Grain leaf/rust.
- **Emoji → Lucide** across the UI chrome (brand mark, nav workspace/exam/
  settings/theme, home review + path tiles, drill pickers, flags, hints,
  workspace tour). Lucide via CDN with the v1.64.1 loop-safe `#main` observer
  (strips `data-lucide` from rendered svgs). Power BI's interface-mockup emoji
  (report canvas, viz-type icons, table glyphs) are left as illustrative content.
- **Lesson view → Grain "Say It Out Loud":** megaphone-headed card → dark DAX
  code block → 🗣️ `say` line → chunk-by-chunk `lines` (clay chips) → "See it on
  screen" KPI/bar visual eyebrow → Gotcha → Quick Check → confidence rater
  (persisted to `state.confidence`). Story bridge restyled to a Grain amber callout.

Verified in-browser. DAX Lab, progress, flags, quizzes, saved state unchanged.

## [1.64.1] — 2026-06-23 — 🐛 Fix: lessons froze the page (Lucide icon loop)

Mike-reported (June 23, 2026): opening any lesson in the SQL/Excel/Python kits
showed no view change, then the browser's **"Page Unresponsive — Wait / Close"**
dialog.

**Cause:** this build of Lucide's `createIcons()` leaves the `data-lucide`
attribute *on the `<svg>` it generates*, so calling it again re-matches and
re-replaces its own output. Paired with the new icon-refresh **MutationObserver**,
each `createIcons()` mutation re-fired the observer → another `createIcons()` →
an **infinite loop** that locked the main thread. (The hub has no observer, so it
was unaffected — which is why kit *home* pages looked fine but lessons hung.)

**Fix:** the refresh helper now strips `data-lucide` from the rendered svgs
(`svg[data-lucide] → removeAttribute`) so they no longer re-match; the observer
settles after one pass. Verified in-browser: all three kits open lessons,
icons render, the thread stays responsive, and `svg[data-lucide]` settles to 0.

## [1.64.0] — 2026-06-23 — 🎨 GRAIN redesign · Phase 2b (Python kit)

Same Grain treatment, applied to Python. **The Pyodide terminal (real
in-browser CPython) is untouched.**

- **Shell → Grain:** links `../assets/grain/grain.css`; vars re-pointed onto
  Grain tokens (clay-on-cream, no one-off hex); Space Grotesk headings; the
  lesson code block darkened to a Grain stone-900 surface.
- **Emoji → Lucide** across the UI chrome (brand mark, nav exam/settings/theme,
  home review + Python Terminal cards, flags, drill hints). Lucide via CDN with
  a `document.body` MutationObserver. (Transient celebration toasts left as-is.)
- **Lesson view → Grain "Say It Out Loud":** megaphone-headed card, dark code
  block per `ral` item, 🗣️ `say` line, chunk-by-chunk `lines` (clay chips),
  "What it outputs" section eyebrow (code + DataFrame + output), Grain amber
  story bridge, Watch-out, Quick Check, and the **confidence rater** (persisted
  to `S.confidence`).

Pyodide, progress, flags, quizzes, and saved state unchanged. Zero build step.
**Phase 2 continues** — Tableau, Power BI, Chart Literacy, Forecasting, Stats,
Interview, Simulator, and Final still to come.

## [1.63.0] — 2026-06-23 — 🎨 GRAIN redesign · Phase 2a (Excel kit)

Same Grain treatment as the SQL pilot, applied to Excel. **The drag-and-drop
Pivot Lab engine is untouched.**

- **Shell → Grain:** links `../assets/grain/grain.css`; the kit's vars
  (`--bg/surf/accent/text/dim/border/success/err/warn`) re-pointed onto Grain
  tokens (clay-on-cream, no one-off hex); Space Grotesk headings; the active-tab
  and cell-highlight tints moved to clay.
- **Emoji → Lucide** across all UI chrome (brand mark, nav workspace/exam/
  settings/theme, home review/Pivot Lab/Sprint cards, flags, drill hints,
  workspace tour, the lesson "Watch out" / "On the job" / completion marks).
  Lucide via CDN; a `document.body` MutationObserver re-renders icons after any
  view change. (Pedagogical content emoji — flashcard text, conditional-format
  example dots — left as content.)
- **Lesson view → Grain "Say It Out Loud":** one bordered card with a megaphone
  header; each formula becomes a **dark code block**, followed by the 🗣️ `say`
  line and chunk-by-chunk `lines` (clay chunk chips). "See it on the sheet"
  becomes a Grain section eyebrow; story bridge is a Grain amber callout; the
  redundant `📖` story prefix removed. Added the same **confidence rater**
  ("Not yet / Almost / Have it", persisted to `S.confidence`).

Pivot Lab, progress, flags, quizzes, and saved state unchanged. Zero build step.

## [1.62.0] — 2026-06-23 — 🎨 GRAIN redesign · Phase 1 (SQL pilot)

The pilot kit, end-to-end in Grain — proving the pattern before rolling to the
rest. **The sql.js query engine is untouched** (runner, JOIN/Aggregation labs,
schema all still execute live).

**Shell restyled to Grain (`sql/index.html`):**
- Links `../assets/grain/grain.css`; the kit's own semantic vars (`--bg`,
  `--surf`, `--accent`, `--text`, `--muted`, `--border`, `--red/green/yellow`…)
  are re-pointed onto Grain tokens — no one-off hex. The whole kit (cards,
  buttons, nav, drills, labs, terminal) recolors to clay-on-cream. The light
  default is the full Grain cream look; the dark toggle maps onto warm stone
  tokens. Headings now use Space Grotesk.
- **Emoji → Lucide line icons** across nav (brand/exam/settings/theme), home
  tiles, drill pickers, lab tabs, hint/answer buttons, flags, and warnings.
  Lucide loads from CDN; a `#main` MutationObserver re-renders icons after
  every view change.

**Lesson view rebuilt to the Grain "Say It Out Loud" anatomy:**
- A single bordered card: **megaphone header → dark code block (the query) →
  🗣️ one-line everyday-words `say` → chunk-by-chunk `lines` breakdown** (clay
  chunk chips) → **"See it on screen"** result table → **Gotcha** → **Quick
  Check** quiz → a new **confidence rater** ("Not yet / Almost / Have it",
  persisted to `state.confidence`, complements the 🚩 flag — never blocks
  progress). Story bridge restyled to a Grain amber callout.

Progress, flags, quizzes, and all saved state are unchanged. Zero build step.

## [1.61.0] — 2026-06-23 — 🎨 GRAIN redesign · Phase 0 (design tokens + hub restyle)

First cycle of the multi-phase **Grain** redesign (brief +
tokens in the `design_handoff_grain_redesign` handoff folder). Phase 0 is the
framework-agnostic, zero-build foundation: drop in the design tokens and restyle
the hub. **No engine, link, or saved-progress changes.**

**New — `assets/grain/` design-token layer (drop-in, used as-is):**
- `tokens/{fonts,colors,typography,spacing,elevation,motion}.css` — Grain's CSS
  custom properties (earthy clay/amber/stone palette, Space Grotesk + IBM Plex
  type scale, 4px spacing grid, warm-tinted elevation, motion easings).
- `grain.css` — single entry point that `@import`s the six token layers in
  order. Linked from the hub via `<link rel="stylesheet" href="assets/grain/grain.css">`.

**Hub `index.html` restyled to Grain:**
- The page's own semantic vars (`--bg`, `--accent`, `--ink`, …) are now
  **re-pointed onto Grain tokens** — clay `#C5511F` primary, honey amber accent,
  warm stone neutrals on cream. No one-off hex values remain; both the light
  default and the dark toggle map onto Grain tokens (a dedicated Grain dark
  palette is a later token job, out of scope this pass).
- Type: Space Grotesk for display headings (hero, kit names, card titles), IBM
  Plex Sans for body/UI, IBM Plex Mono for code/metrics.
- **Emoji → Lucide line icons** everywhere (brand mark, theme toggle, Continue/
  beta/method cards, all 11 kit icons, exam badge). Lucide loaded from CDN; the
  theme toggle swaps moon/sun and re-renders.

**Unchanged on purpose:** all markup, links, and JS behavior (theme toggle,
`apk-theme` contract, per-kit progress bars, Continue card, mini-exam badges).
Zero build step; still a static GitHub-Pages site.

## [1.60.0] — 2026-06-16 — 🎮 Tableau kit "Learn by playing" callout

Added a "Learn by playing" card to the Tableau kit home view pointing at the
new **Tableau Analyst Sprint** (prep-companion-apps), mirroring the existing
Excel- and SQL-kit callouts. The reciprocal link: the sprint's lessons already
deep-link back to this kit, and now the kit funnels players to the warm-up game.
Companion to the new Part 3 Tableau sprint shipped in prep-companion-apps
(June 16, 2026 — 1:04 PM ET).

## [1.59.0] — 2026-06-13 — 🚩 Flag-for-review + "Practice this" wrong-lesson fix

Mike-reported (June 13, 2026 — 12:41 AM ET): (1) finishing the Excel XLOOKUP
lesson and clicking "Practice this →" dumped him into the COUNTIF drills;
(2) users need a zero-friction way to mark "I got it right but I'm shaky on
this" and find those items again later.

**Bug fix (Excel + Python only — the other 4 kits were already correct):**
`finishLesson` advances `currentLesson` to the NEXT lesson (for Home resume)
before re-rendering, and `renderLesson` looked the lesson up from
`currentLesson` — so the "Lesson complete" card and its "Practice this →"
button belonged to the next lesson, not the one just finished. Fixed with a
new `doneLesson` state field; the done card, its drill count, Practice-this,
and per-lesson Reset now all bind to the finished lesson. Also: lessons with
zero drills (Unit 0 concept lessons) no longer show "Practice this →" — Next
Lesson becomes the primary button with honest copy.

**New feature (all 6 lesson kits): 🚩 Flag for review.**
- One-tap "🚩 Shaky? Flag to revisit" button on every lesson header, every
  standalone drill, and every guided-practice step. Tap again to unflag.
- Flagged items appear in a "🚩 Your review list" card at the top of the
  kit's Home (hidden when empty), each row jumping straight back to that
  exact lesson/drill, with a "✓ Got it now" button to clear it.
- Persisted per kit in localStorage (`flagged:[]`); stale keys (renumbered
  content) are tolerated silently.

Verified with a new private headless harness (DOM-stubbed node run of each
kit): script evaluation, LESSON_DRILLS index integrity, the
finish-then-practice regression, and the full flag round-trip — 78 checks
green across all 6 kits. Two latent crash guards landed alongside (SQL +
Power BI `navigate()` empty-NodeList guard; Stats `drawStatChart` html-viz
early return).

## [1.58.0] — 2026-06-13 — Bare Basics mode removed everywhere

Mike-directed (June 13, 2026 — 12:07 AM ET): "remove the bare basics feature
from all prep kits, I hated it anyways and now these games are the bare
basics" — the Analyst Sprint companion games now fill that role.

Removed from the hub + all 7 kits that had it (Excel, SQL, Python, Tableau,
Stats, Power BI, Interview):

- Hub: the "Just want the bare basics?" entry card, the cross-kit toggle
  (`apk-basics` flag), the "X of N subjects" progress pill, and the now-unused
  `coreIds` in the KITS adapters. The flag is cleaned from localStorage on load.
- Per kit: the top "Turn on Bare Basics mode" bar + active-mode banner, the
  shared CSS block (amber pills/highlight/dimming), the
  apply/activate/deactivateBasics functions, the "🔖 Bare Basics: X of N"
  lesson-list chips, the ★ pills on core lessons, the lesson-complete
  "next kit's bare basics" handoff links, and Stats' Bare Basics home hero.

Kept: lesson `core:` data flags (inert), the Final Exam Kit's per-subject
study guide (content, not the mode), and each kit's normal lesson flow —
finishing a lesson now always offers Practice/Next Lesson as before the mode
was on. All 8 pages pass the inline-script syntax check.

## [1.57.0] — 2026-06-12 — Companion games rebranded to Analyst Sprint

Mike-directed: the games are now **Excel Analyst Sprint** and **SQL Analyst
Sprint** (series: Analyst Sprint) — search-optimized naming. Both kit
callouts and the README updated; URLs unchanged.

## [1.56.1] — 2026-06-12 — Sprint links follow the companion repo rename

Mike-directed: the consolidated games repo was renamed `sales-sprint` →
`prep-companion-apps`. All sprint links (Excel kit callout, SQL kit callout,
README "Learn by playing") now point at
https://michaelnocito.github.io/prep-companion-apps/. Series branding is
unchanged — the games are still the Sales Sprint.

## [1.56.0] — 2026-06-12 — SQL Sales Sprint is live; sprint links point at the consolidated repo

Mike-directed (June 12, 2026 — 10:21 PM ET): the sprint games were consolidated
into one scalable repo, `github.com/michaelnocito/sales-sprint` (one subdirectory
per skill + hub page, mirroring this repo's structure). Old URLs redirect.

- **SQL kit home:** the "🎮 Learn by playing" card now links the live **SQL Sales
  Sprint** (https://michaelnocito.github.io/sales-sprint/sql/) — queries run
  against an in-browser database, matched unit-for-unit to this kit — with a
  pointer to the Excel sprint as the start of the story. (This closes the
  v1.55.0 "swap this link when the SQL game ships" note.)
- **Excel kit home:** the "🎮 Excel Sales Sprint" callout now points at the new
  home, https://michaelnocito.github.io/sales-sprint/excel/.
- **README:** new "Learn by playing" section linking the Sales Sprint hub and
  both games.

## [1.55.0] — 2026-06-12 — Excel Sales Sprint cross-promo callouts (Excel + SQL kits)

Mike-directed (June 12, 2026 — 9:52 PM ET): the Excel Sales Sprint game
(https://michaelnocito.github.io/excel-sales-sprint/) is revived with a 14-lesson
curriculum matched unit-for-unit to the Excel Kit. Added cross-promo:

- **Excel kit home:** new "🎮 Excel Sales Sprint" callout card (below Pivot Lab,
  same card pattern) — "Practice with real analyst examples… ten minutes, matched
  unit-for-unit to this kit." Opens the game in a new tab.
- **SQL kit home:** new "🎮 Learn by playing" card (above Other Kits) linking the
  Excel game, noting a SQL edition of the sprint is coming next. Swap this link to
  the SQL game when it ships.

## [1.54.1] — 2026-06-12 — GR-H fix: half-visible completion toast (Tableau/Excel/Python) + render-blocking Chart.js (Tableau/Stats)

From Mike's playtest (June 12, 2026 — 7:06 PM ET), after passing all ten v1.54.0 checks:

**GR-H — green completion toast persists across screens, half visible.** Root cause
found and it's kit-specific exactly as the roadmap entry suspected: Tableau, Excel and
Python use a top-anchored toast whose hidden state was only `translateY(-80px)` with
**no fade** — the pill is ~40px tall and anchored at `top:64px`, so after the hide
animation its bottom half stayed parked over the sticky nav (with the last message's
text) until a reload emptied it. The other kits hide with `opacity:0`, which is why
they never showed the artifact. Fix in all three kits: hidden state now
`translateY(-110px)` + `opacity:0` + `visibility:hidden` (matching transition), shown
state restores them. GR-H closed.

**Intermittent page-load delay (Tableau + Stats).** Chart.js was loaded from the CDN
in `<head>` without `defer`, blocking the entire page from painting until the CDN
responded — instant when cached, visibly slow when not ("sometimes delays, sometimes
not"). Both kits now load it with `defer` (neither draws a chart at boot; first chart
happens on user navigation, long after the deferred script runs). Tableau `buildChart`
gained the same `typeof Chart` guard the lesson charts already had. SQL kit already
loads sql.js at the end of `<body>` — not affected.

Headless-verified: all script blocks in the 4 touched kits parse.

**v1.54.0 playtest: ✅ ALL TEN PASS (Mike, June 12, 2026 — steps 054a–054j).**

## [1.54.0] — 2026-06-12 — Tableau kit: 10-improvement sweep (orientation, home rebuild, working Filter shelf, touch support)

One bundled pass over the Tableau kit (Mike's direct ask: "implement 10 improvements").
All verified headless: 3 script blocks parse, all 7 nav routes resolve, all 49 inline
event handlers reference defined functions.

1. **Nav highlight finally moves** — `show()` toggled `.nav-link` but every nav button
   is `.nav-btn`, so "Home" stayed underlined forever. You now always see which tab you're on.
2. **Home rebuilt on the Excel "polished" pattern** (the roadmap's "roll the Lessons home
   section to other kits" item): big resume card (lesson position + title + first-sentence
   teaser + Start/Continue/Review verb), Learn/Practice/Cards path tiles with progress
   bars, **Progress by unit** (6 real units replacing the stale 5-skill map that only
   counted old lesson ids 1–10), and a **Next up** card with the next 3 unfinished lessons.
   Also purged the dead two-generations-old static home markup (incl. an undefined
   `resumeLesson()` handler and a hardcoded "0/28").
3. **Lesson numbers shown by position everywhere** — completion toast said "Lesson 27
   complete!" for the lesson displayed as Lesson 16; Continue button labeled raw ids
   ("Lesson 101"). Both now use `lessonPos()+1`, and Continue targets the last-visited
   lesson only if unfinished, else the first incomplete one (`resumeTarget()`).
4. **Viz Builder months in calendar order** — dragging Month to Columns sorted
   alphabetically (Apr, Aug, Dec…); now uses MONTH_ORDER like the lesson charts. Also
   fixed the scatter x-axis spread that wiped tick colors.
5. **Filter shelf actually filters** — it was a no-op (the old comment admitted it).
   Dropping a dimension now shows its values as tap-to-toggle pills (all on by default);
   unticked values drop out of the chart. A measure shows a teaching note about range
   filters instead.
6. **Touch support for the two drag-only surfaces** — Parsons pieces move on tap
   (drag still works), and Viz Builder fields place by tap-field-then-tap-shelf.
   Phone users were locked out of both before (HTML5 drag needs a mouse).
7. **Lesson list upgrade** — page header survives re-render and counts dynamically
   ("32 lessons", was hardcoded "28"), per-unit done counts (x/y), **▶ Next up** badge on
   the first unfinished lesson, L-number on every card, and a real description line
   (first sentence of the intro — the old `subtitle` field no longer exists, so that
   line had rendered empty).
8. **Practice resumes where you left off** — each drill-type card opens at the first
   unfinished exercise with a "continue at #N" cue (was always #1).
9. **"Reset all kits" resets ALL kits** — it only cleared the original 5 keys; now also
   Power BI, Interview, Simulator, Final, Chart Literacy, Forecasting + the hub's
   last-kit pointer. Settings copy updated ("all 5 kits" → "every kit in the suite").
10. **Celebration + theme polish** — back-to-back toasts no longer get cut short by the
    previous toast's timer; one shared AudioContext instead of a new one per celebration;
    and the workspace-tour highlight dropped the last old-teal `rgba(88,170,162,…)`
    leftover for the accent blue.

## [1.53.1] — 2026-06-12 — Fix SQL-a1 + Excel fill-in scaffold (test feedback)

**SQL-a1 fix (blocker from v1.53.0):** when a query had a SQL syntax error
(e.g. typing `sdfsf`), the catch block returned early and the attempt counter
never incremented — so progressive help never fired. Syntax errors now count
as a miss the same way wrong rows do: miss 1 auto-opens the hint, miss 2 fills
the first half of the answer, miss 3 fills the full answer. Error message still
shown above the scaffold prompt.

**Excel fill-in-the-blank (XL-b partial):** matched the SQL Lab pattern.
- **Progressive scaffold on miss:** miss 1 = show hint, miss 2 = auto-fill the
  **first half** of the answer into the input, miss 3 = fill the **full answer**.
  Per-drill attempt counter (`_fillAttempts`) resets on a correct answer.
- **Sized blank lines:** the `___` placeholder in `partial` now renders as a
  monospace underscore run sized to the actual missing text length, so the
  learner sees visually how much is missing. Falls back to `___` literal when
  the partial/answer shape doesn't match.

Headless-verified: all 11 kits' scripts parse; every top-level nav route in
the 9 unchanged kits resolves to a renderer (FC-a smoke + 5–9 smoke
coverage check).

## [1.53.0] — 2026-06-12 — SQL Lab: progressive answer scaffold on miss (JOIN + Aggregation)

Fixes a testing blocker (SQL-a partial, June 12, 2026 — 12:11 AM ET): the JOIN and
Aggregation labs only had a manual "Show Answer" button and a loose row-count check —
no graduated help when a learner keeps missing, unlike the Parsons drill. Now both labs
escalate help the same way Parsons does, driven by a real correctness check:

- **Correctness check** — the user's result rows are compared against the model answer's
  rows (not just the row count), so a wrong query actually registers as a miss. A match
  shows **"✓ Correct"** + celebrate.
- **Miss 1:** the 💡 Hint auto-opens. *"Hint opened below — adjust and Run again."*
- **Miss 2:** the **first half** of the answer is filled into the editor. *"Finish it and Run again."*
- **Miss 3:** the **full answer** is filled in. *"Run it to see the target result."*

Shared `_runLabQuery(kind, idx)` + `_labAttempts` counter; `runJoinQuery`/`runAggQuery` are
now thin wrappers. Manual "📋 Show Answer" button kept as the explicit last resort.
Headless-verified (script parses). Free Lab (freeform) and the two stub labs unaffected.

## [1.50.0] — 2026-06-09 — Two new standalone kits: Chart Literacy + Forecasting & Trend Modeling

Added two tool-agnostic concept kits that teach the *thinking* the tool kits assume, plus Tableau visualization additions. Built on the shared single-file pattern (calm-analyst design system, guided path, tap-the-choice drills, flashcards, glossary). New non-colliding kit folders — no existing kit, id, or saved progress touched.

**New — Chart Literacy Kit (`chart-literacy/`)** — 13 lessons, 43 drills, 20 flashcards, 23 glossary terms.
- Unit 0: what a chart encodes · the visual-encoding accuracy ranking · reading any axis.
- Unit 1 (the 6 you'll use most): bar, line, scatter, pie/donut, treemap/heatmap, waterfall.
- Unit 2: how charts lie (truncated axes, cherry-picking) · misleading comparisons (bases, normalizing).
- Unit 3: choosing the right chart (question→chart path) · explaining a chart to stakeholders.

**New — Forecasting & Trend Modeling Kit (`forecasting/`)** — 13 lessons, 42 drills, 20 flashcards, 25 glossary terms.
- Foundations: what forecasting is (and isn't) · time-series anatomy (trend/season/cycle/noise) · signal vs noise.
- Trend & smoothing: moving averages · exponential smoothing (α) · linear trend (slope/R²) · seasonality & seasonal indices.
- Models: regression on drivers · Holt-Winters (level/trend/season) · ARIMA in Everyday words.
- Evaluating & communicating: MAE/MAPE/RMSE + train/test split · prediction intervals (the fan chart) · common mistakes + presenting a forecast.

**Tableau kit additions (shipped earlier this session, ids 29–32):**
- L29 Trend Lines & Reference Lines (Analytics pane, R²) + 4 drills.
- L30 Build a Scatter Plot, L31 Build a Treemap, L32 Build a Map — each with drills.
- (Dual-axis bar+line was already covered by L20 Dual-Axis & Combined-Axis Charts.)

**Cross-linking:** hub homepage gets "New" cards for both kits. New kits link to Tableau/Power BI/Stats/each other; SQL, Power BI, Tableau, and Stats kits gained links to the two new kits. Fixed a stale `../statistics/` link (→ `../stats/`) in Chart Literacy.

**Headless-verified:** every kit's inline script parses; all guided-path drill references resolve; every drill is covered by a lesson; every quiz/answer index is valid.

**Playtest (June 9, 2026):** ✅ Tableau Trend Lines (29a–c), ✅ Tableau Build Scatter/Treemap/Map (T1a–e), ✅ Chart Literacy (CL-a–d) all PASSED. Forecasting kit + cross-links awaiting playtest. Personal site (`michaelnocito.github.io`) feature card updated with both new kits (shipped same day — blocker).

## [1.49.1] — 2026-06-08 — SQL Parsons: scaffold layout fix (Task 1 ✅)

After hint fires, layout restacks to Answer-on-top / Available-Lines-below — reads top→bottom naturally. Reset restores original side-by-side.

## [1.49.0] — 2026-06-08 — SQL Parsons: progressive scaffold on wrong answer (Task 1)

Put in Order drill now gives progressive help when wrong:
- **1st wrong attempt:** first half of lines snap into the answer zone in correct order (locked/dimmed). Message: "first N lines placed for you — drag the rest."
- **2nd wrong attempt:** full correct answer shown locked. "Full answer shown — study the order." Next → button appears.
- Reset and correct answer both clear the attempt counter.

---

## [1.48.0] — 2026-06-05 — Excel expanded to 28 lessons (Units 4–6)

Excel is now the deepest kit, matching Tableau's lesson count. Added 3 new units, 12 new lessons:

- **Unit 4: Deeper Formulas** — Excel Tables (Ctrl+T), Nested IF/IFS, INDEX+MATCH, SUMPRODUCT
- **Unit 5: Charts & Formatting** — Your First Chart, Conditional Formatting, Data Validation, Named Ranges
- **Unit 6: Power Tools** — Power Query Basics, Dynamic Arrays (FILTER/UNIQUE/SORT), Keyboard Shortcuts & Speed, Protecting Your Work

Drill arrays expanded: FILLS/BUGS/WRONG/ESQL now 24 entries each; PARSONS 22 (shortcuts+protecting skip — no formula to order). LESSON_DRILLS entries added for all 12 new ids. 6 new CARDS, 4 new GLOSSARY terms.

---

## [1.47.0] — 2026-06-05 — Excel polish: home lessons section + nav flow fixes (all kits)

**Excel kit — polished example:**
- **Home screen lessons section:** new "Lessons" card shows unit-by-unit progress bars + up to 3 next-up lessons with direct links. Home now answers "where are the lessons?" without hunting the nav.
- **Fixed: `finishLesson` ID bug** — was using `lid+1` (breaks for Unit 0 ids 101–104); now uses `nextLessonId()` (array-position based). After L104, correctly advances to L1 instead of a nonexistent id=105.
- **Fixed: `gotoNextLesson` ID bug** — was `lid < DATA.LESSONS.length` + `lid+1` (after L104 the condition `104 < 16` fired "you finished everything!"). Now uses `nextLessonId()`.
- **Fixed: invisible "Next Lesson" button** — was `btn-ghost` (white text = invisible in light mode). Changed to `btn-outline`, renamed from "Skip to next lesson" to "Next Lesson →".
- **Unit completion celebrations** — completing the last lesson in a unit now fires a 🎊 toast.
- **Mobile nav** — nav now scrolls horizontally on ≤600px instead of wrapping into multiple rows.
- **Stale lesson count** — lessons view header updated from "12 lessons" to "16 lessons across four units".

**All kits (Excel, SQL, Python, Stats, Power BI) — same nav fixes:**
- `gotoNextLesson` rewritten to use `nextLessonId()` in all 5 affected kits.
- Python: `finishLesson` currentLesson advancement also fixed.
- Next-lesson buttons changed from `btn-ghost` to `btn-outline` where applicable.
- Tableau was already correct (pilot kit); no changes needed.

---

## [1.46.0] — 2026-06-04 — Curriculum rollout complete: all 5 remaining kits

Full 6-month curriculum pattern rolled to Excel, SQL, Python, Stats, and Power BI.
Each kit received: Unit 0 Foundations (4 new lessons, ids 101–104), 📖 story bridges on
all 12 existing lessons, position-based nav (lessonPos/nextLessonId), and lesson number
display fixed to use array position instead of raw id.

- **v1.42.0 Excel:** Unit 0 "Before You Type a Formula" (grid, cell refs, types, formulas)
- **v1.43.0 SQL:** Unit 0 "Before You Query" (DB structure, grain, keys, NULL/query shape)
- **v1.44.0 Python:** Unit 0 "Before You Code" (values/vars, types, libraries, DataFrame)
- **v1.45.0 Stats:** Unit 0 "Before You Calculate" (stats purpose, variables, pop/sample, describe vs infer); renderLessonList updated to include unit 0
- **v1.46.0 Power BI:** Unit 0 "Before You Build" (table/grain, types, aggregation, Load→Shape→Analyze loop)

Total new lessons added: 20 (4 per kit × 5 kits). Story bridges added: 60 (12 per kit × 5 kits).
All kits: 16 lessons each (was 12). Interview kit: intentionally skipped (meta-skills, no tool grain).
All syntax-clean (headless verified). Pushed live.

---

## [1.41.0] — 2026-06-04 — Tableau story bridges complete: all 28 lessons threaded

Story bridges added to L11–L20 (Tooltips, Chart Choice, Telling a Story, Live/Extract,
Joins/Unions/Relationships, Data Properties, Sets, Hierarchies, Parameters, Dual-Axis).
Every Tableau lesson now opens with a 📖 narrative bridge that recalls the prior lesson
and introduces exactly one new idea — the coffee-company scenario runs end-to-end through
all 28 lessons. Tableau pilot is now fully narrative-complete.

---

## [1.40.0] — 2026-06-03 — Curriculum pilot v4: finest-granularity Tableau beginner→mid path

Mike chose "fill every big jump + split bundles." June 3, 2026 — 9:17 PM ET.

- **3 new intermediate micro-lessons:** *Sorting Your View* (before Filtering), *Your
  First Calculation* (Profit = Rev − Cost, before Calculated Fields), *From One Sheet
  to a Workbook* (before Building a Dashboard).
- **Split the bundle:** "Filters & Sorting" → **Sorting Your View** + **Filtering Your
  Data** (two lessons, smaller steps).
- **Story bridges threaded through the whole beginner→mid path** (Unit 0 → Unit 1 →
  Unit 2 → into Unit 3): 18 lessons now each recall the prior lesson and add one idea.
- Tableau now **28 lessons**. Order: Unit 0 → Interface → Your First Drag → Dim/Measures
  → Bar → Line → Sorting → Filtering → Marks → Your First Calculation → Calc Fields →
  Aggregation → Grouping → Sheets-to-Workbook → Dashboard → …

Remaining: bridges on L11–L20 (Tooltips/Chart Choice/Story + cert units), then roll the
whole pattern (Unit 0 + prereqs + depth + story bridges + intermediate lessons) to the
other 5 kits. Headless-verified: 3 scripts clean; 28 lessons; position-nav intact.

## [1.39.0] — 2026-06-03 — Curriculum pilot v3: first intermediate micro-lesson

Mike: bridges help but the biggest gaps need NEW smaller lessons inserted. June 3,
2026 — 9:12 PM ET.

- **New intermediate micro-lesson "Your First Drag"** inserted between "The Interface"
  (where things live) and "Dimensions vs. Measures" (a concept) — the missing
  *"just do one simple thing"* step. Teaches the single core gesture: drag a field
  onto a shelf, watch the canvas redraw, drag it off to undo. Pure confidence-builder.
- Placed by **array position** (id 25, between lessons 1 and 2) — position-based nav
  flows Interface → Your First Drag → Dimensions vs. Measures with no renumbering.
- Tightened Lesson 2's story bridge to build on the drag lesson.

Tableau now 25 lessons. Demonstrates the "intermediate micro-lesson" approach; scanning
for the other large jumps next (see chat / `CURRICULUM_PLAN.md`). Headless-verified: clean.

## [1.38.0] — 2026-06-03 — Curriculum pilot v2: story thread + lesson layering

Mike's feedback on v1.37.0: good start, but the jumps between lessons are still too
big and there's no narrative pulling it together. June 3, 2026 — 9:08 PM ET.

- **Story thread:** a running scenario now threads the kit — *you're a new junior
  analyst at the coffee company; your manager's questions drive each lesson* (reuses
  the existing reps/regions/products). Rendered as a 📖 "story bridge" at the top of
  each lesson.
- **Lesson-to-lesson layering:** every bridge **recalls the previous lesson and adds
  exactly one new idea** ("you can split by region; now total the sales → dimensions
  vs. measures"), so the sequence reads as one continuous build, not a topic list.
- New `story` field (rendered in place of the bare prereq callout; prereq kept as
  fallback). Piloted on **Tableau Unit 0 + Unit 1 (8 lessons)**; rolls to all lessons/kits.

Headless-verified: 3 scripts clean; 8 story bridges; render wired.

## [1.37.0] — 2026-06-03 — Curriculum rebuild PILOT: Tableau "Unit 0 — Foundations"

First build toward the 6-Month Analyst Standard (`CURRICULUM_STANDARD.md` /
`CURRICULUM_PLAN.md`). Tableau is the pilot. June 3, 2026 — 8:51 PM ET.

- **New "Unit 0 — Before You Build" (4 foundation lessons), rendered FIRST:**
  - 0.1 **How Tableau Sees Your Data** — rows/fields and the **grain**.
  - 0.2 **Field Types & Why Tableau Colors Them** — data type → blue/green.
  - 0.3 **What "Aggregate" Means** — many rows → one number, before any SUM button.
  - 0.4 **The Analyst's Loop** — question → field → shelf → chart → insight ("so what").
- **Per-lesson PREREQUISITE line** — new `prereq` field rendered as a "📎 Before this:"
  callout. Added to Unit 0 + Unit 1 (L1–L4); rolls to the rest next.
- **Depth beats** on the flagged beginner lessons: L2 (a number can be a category —
  Year/ZIP/Store ID), L3 (lead a deck with one sorted bar — applied beat).
- **Position-based navigation** (`lessonPos` / `nextLessonId`) so Unit 0 sits at the
  front WITHOUT renumbering the existing 20 lessons — **saved progress + LESSON_DRILLS
  untouched**, ships as MINOR (not a v2.0.0 progress-wipe). "Lesson X of N", "next
  lesson", and the complete-card now follow display order; foundation lessons (no
  drills) show a clean "Next lesson →".
- Updated stale home copy (24 lessons).

Tableau now 24 lessons. Pattern proven here; rolls to Excel/SQL/Python/Power BI/Stats
next (each gets its own Unit 0 + prereqs — see `CURRICULUM_PLAN.md`). Headless-verified:
3 scripts clean; 24 lessons, Unit 0 first, existing ids 1–20 intact.

## [1.36.0] — 2026-06-03 — Finishing wave: borderline visuals closed + handoff refreshed

"Big push to finished." June 3, 2026 — 8:31 PM ET.

- **Closed the 3 remaining borderline visual-parity cases** (sweep now 100%, no asterisks):
  - **SQL L10 Window Functions:** table now shows ROW_NUMBER / RANK / DENSE_RANK / LAG together.
  - **Power BI L6 Basic DAX Aggregations:** four cards — SUM / AVERAGE / COUNTROWS / DISTINCTCOUNT.
  - **Stats L9 Hypothesis Testing:** both **H₀ and H₁** claim cards (via the new `html` viz support).
- **Health check:** all 9 kits' inline scripts syntax-clean; Tableau structural integrity verified
  (84 LESSON_DRILLS references all in range; drill arrays + 20 sequential lessons intact).
- **`CLAUDE.md` handoff refreshed** to v1.36.0 with a top-of-file summary of the whole June-3
  session (was stale at v1.22.0).

## [1.35.0] — 2026-06-03 — Visual-parity sweep COMPLETE (SQL, Python, Power BI, Stats)

Finished the all-kits sweep ("do them all"). Every "See it" visual now shows
every co-equal concept its lesson names. June 3, 2026 — 6:48 PM ET.

- **SQL (4):** L5 aggregates (COUNT/SUM/AVG/MAX/MIN columns), L7 HAVING+DISTINCT
  comparison, L8 CASE+COALESCE columns, L12 three recon patterns (gaps/dupes/mismatch).
- **Python (7):** L1 int/float/str/bool, L3 function+loop, L5 describe/select/value_counts,
  L6 ==/&/isin, L7 sort_values/nlargest/value_counts, L10 isnull/fillna/dropna,
  L11 strip/lower/replace/contains — multi-statement code + output.
- **Power BI (4):** L5 calc-column table + measure card, L8 TOTALYTD/SAMEPERIODLASTYEAR/
  DIVIDE table, L9 slicer + filter-pane (3 levels), L10 drill-through + cross-filtering.
- **Stats (2):** L1 mean/median/mode 3-bar chart; L4 symmetric/right/left skew sparklines
  (added optional `html` support to `lessonStatHTML` since `drawStatChart` is single-series).

**All 6 kits swept** (Tableau, Excel, SQL, Python, Power BI, Stats). Borderline
"menu-style" cases (SQL L10, PBI L6, Stats L9) intentionally left as single worked
examples. Headless-verified: all kits' inline scripts syntax-clean.

## [1.34.0] — 2026-06-03 — Visual-parity sweep, Excel kit complete

Kit 2 of 6 in the sweep. June 3, 2026 — 6:28 PM ET.

- **L1 Your First Formula:** grid now shows **SUM (500) / AVERAGE (125) / COUNT (4)**
  result rows (was SUM only).
- **L5 Count & Sum with Conditions:** shows **COUNTIF (3) + SUMIF (260)** (was SUMIF only).
- **L10 Text Functions:** a 4-row table — **TRIM / PROPER / LEFT / LEN** (was PROPER only).
- **L11 Dates and Numbers:** **YEAR (2026) / MONTH (3) / TEXT ('Mar 2026')** rows (was MONTH only).
- **L8 Slicers, Sorting & Grouping:** grid now shows a **slicer chip + sorted rows + grouped
  months** — all three tools (was a single filtered pivot).

Sweep progress: Tableau ✅, Excel ✅. Next: SQL → Python → Power BI → Stats.
Headless-verified: 2 scripts clean.

## [1.33.0] — 2026-06-03 — Visual-parity sweep, Tableau kit complete

Per Mike's "sweep all kits" — audited every kit's "See it" visuals (found ~26
gaps total; tracked in `VISUAL_PARITY_SWEEP.md`). This cycle fixes the remaining
Tableau gaps. June 3, 2026 — 6:20 PM ET.

- **L8 Aggregation:** now a table showing **SUM / AVG / COUNT / COUNTD** with each
  one's result + "what it answers" (was a single SUM bar).
- **L5 Filters & Sorting:** now shows the **three filter types** (dimension /
  measure / Top N) as chips plus a sorted result (was a sorted bar, no filter).
- **L12 Chart Choice:** now a **5-chart-type grid** (bar / line / scatter / pie /
  map), scatter highlighted as the example (was scatter only).
- **L6 Color, Size & Labels:** now one mark showing **all three encodings**
  (Color + Size + Label) (was a color-only bar).

Tableau kit fully swept (L5, L6, L8, L12, L15, L20). Next kits: Excel → SQL →
Python → Power BI → Stats. Headless-verified: 3 scripts clean.

## [1.32.0] — 2026-06-03 — Visual parity sweep: show every concept the text names

Mike (playtest): L15's "See it on screen" showed a nice JOIN but the text names
JOIN + UNION + RELATIONSHIP — "if we call it out in text we need visuals."
Principle: when a lesson names co-equal concepts, the visual must show all of
them. June 3, 2026 — 6:13 PM ET.

- **L15 "Joins, Unions & Relationships":** replaced the join-only visual with a
  **three-part visual** — JOIN (glue columns on a key), UNION (stack same-shape
  rows into one taller table), RELATIONSHIP (link on a key without flattening).
- **L20 "Dual-Axis & Combined-Axis":** added a **combined-axis mini-visual** beside
  the dual-axis one (two scales vs. one shared scale) on the "Dual vs Combined
  axis" breakdown block — the title names both, so both are now shown.

Sweep finding (not yet changed — pending Mike's call): a weaker, "menu-style"
pattern exists in a few older Tableau lessons where the text lists several
*options* but the visual shows one worked example — L5 Filters & Sorting
(filter types), L6 Color/Size/Labels, L8 Aggregation (SUM/AVG/COUNT/COUNTD),
L12 Chart Choice (chart-type menu). These are arguably fine as one example; flagged
for a decision rather than auto-rewritten.

Headless-verified: 3 scripts clean; L15 three-part + L20 combined-axis present.

## [1.31.0] — 2026-06-03 — Final Exam study guide: per-section "See it" visuals

The Final Exam Kit's bare-basics study guide was text-only (it was never part of
the earlier visuals sweep). Added a compact "📺 See it" diagram at the top of each
of the 7 subject sections — making the definitions visual without bloating the
40+ bullets. June 3, 2026 — 1:30 PM ET.

- **Excel:** `$A$1` 🔒 stays put vs `A1` ↘ shifts (absolute vs relative refs).
- **SQL:** the clause-order chain (SELECT → FROM → WHERE → GROUP BY → HAVING →
  ORDER BY) + WHERE-before / HAVING-after note.
- **Python:** the `df → .groupby('region') → ['revenue'].sum()` flow.
- **Tableau:** blue dimension vs green measure pills.
- **Statistics:** a right-skew bar sparkline with median (middle) vs mean (pulled
  right) markers.
- **Power BI:** a star-schema diagram (Sales fact in the center, dimensions around).
- **Interview:** the STAR chips (Situation → Task → Action → Result).

Implementation: a new `studyViz(key)` helper (pure HTML/CSS, no Chart.js) rendered
at the top of each `study-body`, plus `.study-viz` styles. Headless-verified: inline
script syntax-clean; helper + render hook present.

## [1.30.0] — 2026-06-03 — Tableau cert beef-up, Cycles 5–7: Hierarchies, Parameters, Dual-Axis (L18–L20)

Final wave of the cert-critical subset (Mike: "keep going"). Completes Unit 5 and
the whole cert-critical plan in `TABLEAU_CERT_PLAN.md`. June 3, 2026 — 1:15 PM ET.

- **L18 — "Hierarchies"** (Domain 2.2): file-folder +/− analogy; build-a-hierarchy
  block + when-to-use; html collapsed↔drilled-down visual (Category ▸ Product);
  misconception bust (a hierarchy nests, it doesn't merge — that's a group).
- **L19 — "Parameters"** (Domain 2.3): thermostat-dial analogy; create-and-wire
  block + when-to-use; html parameter-control mock; misconception bust (a
  parameter does nothing until a calc/filter references it).
- **L20 — "Dual-Axis & Combined-Axis"** (Domain 2.1): duet analogy; build-a-combo
  block + dual-vs-combined; **real Chart.js dual-axis visual** (Revenue bars on a
  left axis, Units line on a right axis) — added a `dualaxis` branch with a
  second `y1` scale to `drawLessonChart`; misconception bust (only synchronize
  axes when units match).
- **9 new guided tap-the-choice drills** across FILLS/ESQL/WRONG/BUGS/PARSONS;
  `LESSON_DRILLS[18..20]` wired.

**Cert-critical subset COMPLETE** — Tableau now 20 lessons covering exam Domain 1
(connections/data model/data properties) and the key Domain 2 organizers
(groups, sets, hierarchies, parameters, dual-axis).

Headless-verified: 3 scripts clean; 20 sequential lesson ids; FILLS=19, ESQL=20,
WRONG=17, BUGS=15, PARSONS=13; LESSON_DRILLS keys 1–20; dualaxis branch present.
(Dual-axis chart renders live via Chart.js — confirm visually on the live URL.)

## [1.29.0] — 2026-06-03 — Tableau cert beef-up, Cycle 4: Sets (L17)

Cycle 4/7 (exam Domain 2.2). Opens the new Unit 5. June 3, 2026 — 1:09 PM ET.

- **New Lesson 17 — "Sets"** (Unit 5: Sets, Hierarchies, Parameters & Dual-Axis).
  "VIP list that updates itself" analogy; introduces IN/OUT as the core idea
  (kept light per Mike — the deeper IN/OUT-in-filters explainer stays parked);
  create-a-set block (General / Condition / Top tabs) + what-you-do-with-a-set.
- **Visual:** an html IN / OUT two-column split ("revenue over $200" → IN vs OUT).
- **Misconception bust:** "a set is just a fancy filter" → it's a reusable,
  dynamic IN/OUT membership that recomputes as data changes (vs a static group).
- **3 guided tap-the-choice drills:** ESQL "dynamic IN/OUT = Set" (idx 16),
  WRONG "Top-10 group went stale → use a Top-N Set" (idx 14), FILLS "drag set to
  Filters to keep IN members" (idx 16). `LESSON_DRILLS[17]` added.

Headless-verified: 3 scripts clean; 17 sequential lesson ids; FILLS/ESQL=17,
WRONG=15; LESSON_DRILLS keys 1–17.

## [1.28.0] — 2026-06-03 — Tableau cert beef-up, Cycle 3: Managing Data Properties (L16)

Cycle 3/7 of the Desktop Specialist push (exam Domain 1.3). Completes the Unit 4
"Connecting & Preparing Data" mini-unit. June 3, 2026 — 1:06 PM ET.

- **New Lesson 16 — "Managing Data Properties"** (Unit 4). Moving-boxes-labels
  analogy; a "five properties" block (rename, alias, data type, geographic role,
  default properties) + a "which one do I need?" decision aid.
- **Visual:** a before/after `table` (raw field/value → cleaned display) showing
  rename / alias / data type / geographic role as display-layer fixes.
- **Misconception bust:** rename/alias are display-only (source untouched), and
  rename ≠ alias; plus a text geo column won't map until given a Geographic Role.
- **3 guided tap-the-choice drills:** ESQL "rename a VALUE = Alias" (idx 15),
  FILLS "map needs Geographic Role" (idx 15), BUGS "state won't map → assign
  geographic role" (idx 13). `LESSON_DRILLS[16]` added.

Headless-verified: 3 scripts clean; 16 sequential lesson ids; FILLS/ESQL=16,
BUGS=14; LESSON_DRILLS keys 1–16.

Also: parked a Tableau **IN/OUT explanation** request (filters/categories → Sets)
to the Parking Lot per Mike — revisit at L17 Sets once the Workspace feature is done.

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

## [1.3.0] — 2026-05-28 — "Say It Out Loud" everyday-words sentence rolls out to SQL, Python, Power BI, and the hub demo

Closes the Medium-bucket follow-up to v1.2.2. Mike hit the gap in the
wild (May 28, 12:08 AM ET) — opened the SQL kit, saw the line-by-line
breakdown was still missing the everyday-words leader sentence. Promoted
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

## [1.2.2] — 2026-05-27 — Excel RAL everyday-words leading sentence

_Verified pass on all three checks at May 27, 2026 — 8:03 PM ET._

Closes the second half of the RAL feedback (May 27, 4:52 PM ET → 6:25 PM
ET refinement → 7:42 PM ET re-clarification). v1.2.1 fixed the line
order; this ships the everyday-words sentence that should have been
included in the same cycle.

### Added
- A `say` field on every formula RAL block in Excel — a conversational
  sentence that reads the formula's intent in Everyday words, using the
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
