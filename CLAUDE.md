# Session Handoff — Analyst Prep Kit

**Last session ended:** June 3, 2026 (huge day — v1.22.0 → v1.40.0)
**Current version:** `v1.40.0` (large feature session shipped; awaiting Mike's playtest)
**You are continuing an established collaboration with Mike Nocito.**

> ### 🚧 ACTIVE WORK — START HERE (the curriculum rebuild, in progress)
> Mike's current big initiative: move every kit from "bare basics" to an **in-depth,
> scaffolded education** aimed at **what a junior analyst / BA / new data pro should
> already know ~6 months on the job.** Specs: `CURRICULUM_STANDARD.md` (the target +
> tier model) and `CURRICULUM_PLAN.md` (the per-kit blueprint — READ THIS before building).
>
> **The repeatable pattern (per kit):**
> 1. **Unit 0 — Foundations** (4 new lessons): how the tool sees data (rows/fields/**grain**),
>    data types, what "aggregate" means, the analyst's loop. Each kit's 4 are specced in `CURRICULUM_PLAN.md`.
> 2. **Per-lesson `prereq`** field + **`story`** field (a 📖 narrative bridge that recalls the
>    prior lesson and adds ONE new idea — the running scenario: *new junior analyst at a coffee
>    company; the manager's questions drive each lesson*). `story` renders in place of `prereq`.
> 3. **Intermediate micro-lessons** filling the biggest jumps; **split bundled lessons** for smaller steps.
> 4. **Depth beats** (why/when + gotcha + "on the job you'd…") on shallow lessons.
>
> **Architecture for adding lessons WITHOUT breaking saved progress (important):** do NOT
> renumber. Give new lessons **non-colliding ids** and place them at the right **array position**;
> rendering + nav use **array order** via `lessonPos()` / `nextLessonId()` (added to Tableau —
> replicate per kit). Existing ids + `LESSON_DRILLS` + `localStorage` progress stay intact. Ships MINOR.
>
> **Tableau = the PILOT (v1.37–v1.40), beginner→mid path DONE:** now **28 lessons**. Order:
> Unit 0 (4) → Interface → **Your First Drag** → Dim/Measures → Bar → Line → **Sorting** →
> **Filtering** (split from "Filters & Sorting") → Marks → **Your First Calculation** → Calc Fields
> → Aggregation → Grouping → **From One Sheet to a Workbook** → Dashboard → Tooltips → Chart
> Choice → Story → (cert Units 4–5: L14–L20). New-lesson ids used: 21–28. Story bridges done
> through ~L10.
>
> **➡️ NEXT STEPS (resume here):**
> 1. Finish Tableau: add `prereq`+`story` bridges to **L11–L20** (Tooltips, Chart Choice, Story,
>    + cert units), and any remaining depth beats.
> 2. **Roll the whole pattern to the other 5 kits**, one ship per kit: Excel → SQL → Python →
>    Power BI → Stats. Each gets its Unit 0 (specced in `CURRICULUM_PLAN.md`), prereq+story on
>    every lesson, intermediate micro-lessons at the big jumps, and the position-based nav plumbing.
>    Per-kit viz helper differs (see cheat-sheet below); per-kit "N lessons" copy + unit grouping
>    need updating (Stats hardcodes units in `renderLessonList`).
>
> ---
>
> ### ⏩ Earlier June 3 session — what shipped v1.22.0 → v1.36.0
> A very large session. All shipped, committed, pushed, live. Awaiting Mike's playtest.
> - **Tableau cert beef-up (v1.23–v1.30):** went for the **Tableau Desktop Specialist**
>   cert. Added 8 lessons → Tableau now has **20 lessons**. New **Unit 4 (Connecting &
>   Preparing Data)**: L14 Live vs Extract, L15 Joins/Unions/Relationships, L16 Data
>   Properties. New **Unit 5**: L17 Sets, L18 Hierarchies, L19 Parameters, L20 Dual-Axis.
>   Plus a new **L9 Grouping** lesson (+ method-choice depth + Data-pane "where did it go"
>   gotcha + visuals). Plan/handoff docs: `TABLEAU_CERT_HANDOFF.md`, `TABLEAU_CERT_PLAN.md`.
>   **Tableau passes so far: L14, L16, L17 ✅.**
> - **🧭 "Know Your Workspace" UI module (v1.27):** interactive interface tour + "Find it"
>   hotspot drill. In **Tableau, Power BI, Excel only** (GUI tools) — **DECIDED not to roll to
>   SQL/Python/Stats** (code/concept kits). Nav entry `show('workspace')`/`navigate('workspace')`
>   + `renderWorkspace()` + `WORKSPACE` data + a `#view-workspace` (Tableau/Excel) or `#main`
>   render (Power BI). Lesson-flow CTA on each kit's interface/first lesson.
> - **Visual-parity sweep (v1.32–v1.36): COMPLETE across all 6 lesson kits.** Principle: if a
>   lesson's text names ≥2 co-equal concepts, the "See it" visual must show ALL of them. ~31
>   lesson visuals fixed (Tableau 6, Excel 5, SQL 4, Python 7, Power BI 4, Stats 2 + 3 borderline).
>   Tracking: `VISUAL_PARITY_SWEEP.md`.
> - **Final Exam study-guide visuals (v1.31):** first visuals in the Final kit — a "📺 See it"
>   diagram per subject section (`studyViz(key)`).
> - **New helpers this session:** Tableau `renderLesson` now supports per-RAL-block `html`;
>   Tableau `drawLessonChart` has a `dualaxis` branch (second `y1` axis); Stats `lessonStatHTML`
>   now supports an `html` viz (since `drawStatChart` is single-series).
> - **New repo docs:** `TABLEAU_CERT_HANDOFF.md`, `TABLEAU_CERT_PLAN.md`, `VISUAL_PARITY_SWEEP.md`,
>   `TESTING_CHECKLIST.md` (whole-kit smoke/acceptance QA).
> - **Story-delivery rule (memory):** "walking with a friend" dev recaps → always full text IN CHAT,
>   default the LONG (~15 min) version, never just a saved file path.

Read this entire file before doing anything. It is the source of truth
for HOW we work; `ROADMAP.md` and `CHANGELOG.md` are the source of
truth for WHAT is in flight.

---

## What this project is

A free browser-based prep suite at
**https://michaelnocito.github.io/analyst-prep-kit/** that teaches
people how to break into entry-level data analytics. Nine
self-contained kits, no install, no login, no telemetry. Source on
GitHub at `github.com/michaelnocito/analyst-prep-kit`.

Local repo: `C:\Users\Mike\Projects\analyst-prep-kit`

The kits, in learning order:
1. Excel · 2. SQL · 3. Python · 4. Tableau · 5. Stats ·
6. Power BI (optional) · 7. Interview · 8. Associate Data Analyst
Simulator (week-1 sim with live Claude API manager review) ·
9. Final Exam Kit (28-Q cross-subject test + bare-basics study guide)

Each kit is a single self-contained `index.html`. No build step. CSS,
JS, content all inline. Theme: dark teal default (`--accent:#58aaa2`),
light toggle persisted via `localStorage['apk-theme']`.

The signature pedagogy is **"Say It Out Loud"** — every formula/query
gets a plain-English leading sentence + a chunk-by-chunk breakdown +
a quick check.

---

## Who Mike is

Career switcher actively job-hunting for an entry-level data analyst
role. He's the target audience — building the on-ramp he wished
existed. Personal site: `michaelnocito.github.io` (separate repo at
`C:\Users\Mike\Projects\michaelnocito.github.io`).

**How Mike communicates:**
- Voice-to-text often. Expect garbled punctuation. Read for intent.
- Direct. He'll say "wtf are you talking about" or "you didn't put it
  in" — that's not personal, that's signal. He's correcting you
  because he wants the project to ship right.
- He pushes back when you're wrong. You should push back when HE's
  wrong (with reasoning). He'll respect it.
- He's smart but not a developer by training. Use plain-English
  analogies (per his own GR-D rule below). Don't lecture.

---

## The workflow — STRICT, follow it exactly

This is the loop we hammered out. Honor it.

1. **Mike says "ready" or "what's next"** → you pick the single
   highest-priority unshipped item OR the next untested-shipped item
   from `ROADMAP.md` (priority: Blocker > High > Medium > Low).
2. **Give exactly 3 testing checks for that one item** in this format:

   ```
   | # | Do this                              | Expect to see                          |
   |---|--------------------------------------|----------------------------------------|
   | 1 | Open Excel Lesson 10 — "Text Cleaning" | Reads TRIM on top, then A2 underneath  |
   ```

   **Rules for "Do this" cells:** name the kit, lesson NUMBER, lesson
   TITLE, and the section to scroll to. Lead with a verb. NOT
   "the text-cleaning lesson" — *"Excel Lesson 10 — 'Text Cleaning'"*.

   **Rules for "Expect to see" cells:** literal expected text in the
   order it should appear, with **bold** on the strings Mike is
   verifying. NEVER "no regression" or "looks right" — those put the
   work on Mike. Spell out what "right" means.

3. **Mike tests, reports back:** pass / partial / fail.
4. **If pass:** mark in CHANGELOG, move to next item.
   **If partial / fail:** the issue becomes its own roadmap item,
   triaged, worked next.
5. **One item in flight at a time.** Bundle only when items share a
   data layer or file AND you've asked permission first. Last time
   bundling without permission caused a miss.
6. **Tag every cycle:** `v1.x.y` (semver). PATCH (`x.y.z+1`) for
   bug-only or content-only. MINOR (`x.y+1.0`) for visible UX
   changes. MAJOR (`2.0.0`) only for restructure / breaking changes.
7. **Eastern timestamp on EVERY new feedback entry.** Format:
   `Month D, YYYY — H:MM AM/PM ET`. Get it with:
   ```bash
   TZ='America/New_York' date '+%B %-d, %Y — %-I:%M %p ET'
   ```

### The "GR" tag
When Mike spots something during testing that isn't about the active
target, he tags it `GR:` (General Remarks). GR items get triaged into
their own roadmap entries — they don't fold into the active test
result. They wait their turn.

### When in doubt — ASK
If Mike sends an ambiguous "ready" or you're not sure if his feedback
is a current-cycle blocker or a future item, ask with
`AskUserQuestion` (max 3 options, recommend one). Better to spend 30
seconds confirming than ship the wrong thing.

---

## Vision Principles — the prioritization lens

Every roadmap item is scored against these. They're written at the
top of `ROADMAP.md` and they decide bucket priority.

1. **See your progress at a glance.** No clicking required.
2. **Always know what to do next.** No "where was I?" moments.
3. **Free to explore.** Nothing locked. Wandering off-path is fine.
4. **Sub-rule: simplicity beats completeness.** Don't ship features
   that bloat the UI just to feel complete.

---

## Parking Lot criteria

An item parks if it matches AT LEAST one of:
- **Low impact** — improves something real but few users will notice.
- **Big overhaul** — needs its own planning cycle, not one bucket.
- **Speculative** — interesting idea, no confirmed ROI yet. Promote
  on second mention.
- **Breaking change** — would invalidate saved progress or URLs.

When Mike suggests "you can parking lot this" — you can override with
reasoning if the item has direct ROI on a shipped feature. Mike
respects that move; he gave you the discretion explicitly.

---

## Versioning shorthand
- `v1.0.x` (1.0.1, 1.0.2…) → bug-fix patches.
- `v1.x.0` (1.1.0, 1.2.0…) → new features or visible UX waves.
- `v2.0.0` → re-architect, URL changes, or breaking saved progress.

---

## Where things live

| Thing | Location |
|---|---|
| Live site | https://michaelnocito.github.io/analyst-prep-kit/ |
| GitHub | github.com/michaelnocito/analyst-prep-kit |
| Local repo | `C:\Users\Mike\Projects\analyst-prep-kit` |
| Roadmap (active items) | `ROADMAP.md` at repo root |
| Changelog (shipped items) | `CHANGELOG.md` at repo root |
| Vision principles | top of `ROADMAP.md` |
| Workflow rules | also in `ROADMAP.md` |
| This handoff | `CLAUDE.md` (you're reading it) |
| Mike's personal site repo | `C:\Users\Mike\Projects\michaelnocito.github.io` |
| Marketing brief (for the other Claude project) | _generated in chat, not saved as file_ |
| Dev-walkthrough audio script | `C:\Users\Mike\Projects\dev-walkthrough-script.md` |

---

## Things to NEVER do

These are things we got wrong in the last session and corrected:

- **Never bundle items into one cycle without explicit permission.**
  Last time it caused testing-direction problems.
- **Never write vague test directions** ("open the text-cleaning
  lesson"). Always specific lesson NUMBER + TITLE + section.
- **Never use "no regression" or "looks right"** as an expected
  outcome. Spell it out.
- **Never defer feedback to a future item without asking.** When a
  partial-test result references something on the roadmap, ask Mike
  whether that item is the current-cycle blocker before deferring.
- **Never commit without a timestamp on the commit message** when it's
  triaging GR feedback.
- **Never assume the SAME render fix works in every kit.** Per-kit
  data shapes vary. The RAL reading-order cycle aborted because of
  this — we now know SQL, Python, Power BI data is already in
  reading order while Excel was mixed.
- **Never invent a feature past what was asked.** When Mike says
  "fix X" he means X — not X + Y.

---

## Things to ALWAYS do

- **Run `git pull --rebase` before every push** (we hit fast-forward
  conflicts a few times when Mike was editing things locally).
- **Acknowledge the miss when you missed something** before
  explaining. Don't make excuses. Mike values the directness.
- **Suggest a default but let Mike override.** AskUserQuestion with
  one option labeled "(Recommended)" is the pattern.
- **Update ROADMAP.md and CHANGELOG.md every cycle** — they're how
  future-you (and future-future-you) stay coherent.
- **Use real-world non-tech analogies in any explanation** — Mike's
  own GR-D rule. "Triage is like an emergency room." "Versioning is
  like dating Word doc saves." Apply to your own writing too.

---

## Current state at handoff (June 3, 2026)

A long marathon session took the suite from v1.4.1 → **v1.22.0**.
Every active roadmap bucket is now empty (only the Parking Lot
remains). Below is what shipped and what's awaiting Mike's playtest.

### What shipped this session (v1.5 → v1.22)

Four big themes, all rolled across the 6 *lesson* kits
(Excel, SQL, Python, Tableau, Stats, Power BI). **The Interview kit,
the Simulator, and the Final Exam Kit were intentionally NOT swept** —
they're structurally different (see per-kit notes below).

1. **Guided Path (v1.7–v1.13)** — every lesson now flows directly into
   the practice drills it applies to. `LESSON_DRILLS` maps
   `lessonId → [[drillKey, idx], …]`; `startGuided / renderGuidedStep /
   guidedNext / gotoNextLesson` drive the flow. Per-lesson reset added.
2. **"See it on screen" lesson visuals (v1.14–v1.16)** — all 72
   lessons open with a rendered preview of the concept BEFORE the
   abstract explanation. Tableau/Stats use Chart.js; SQL=result tables,
   Excel=cell grids, Python=output blocks, Power BI=result tables.
   (Helpers: `lessonVizHTML/drawLessonChart`, `lessonResultHTML`,
   `lessonGridHTML`, `lessonOutputHTML`, `lessonStatHTML/drawStatChart`.)
3. **Backlog sweep (v1.17–v1.20)** — GR-C Final Exam per-section
   submit + partial cumulative grade; GR-E Bug Hunt "check my fix"
   input (later superseded by tap-the-choice); GR-A Bare Basics
   cross-kit handoff; GR-D real-world analogy opener on **every** lesson
   (72); per-kit mini-exam ("Exam" nav entry deep-links to that kit's
   Final-Exam section via `#exam-<section>`); hub mini-exam score badge
   + Bare Basics "X of N subjects" pill; Excel/Python nav overflow fix.
4. **Tap-the-choice drills (v1.20.1–v1.22)** — Mike's strongest recent
   ask: **NO free-text answer boxes anywhere.** All Bug Hunt + Describe
   drills across all 6 kits converted to Duolingo-style
   tap-the-word/phrase. Also fixed lesson-complete scroll (was bouncing
   to top with the action buttons off-screen).

### Tests awaiting Mike

Nothing is "broken-pending" — but the whole v1.5→v1.22 arc was shipped
faster than Mike could playtest. He last said **"so much better, love
it!!!"** after the visuals wave. Expect him to come back with playtest
results on the **tap-the-choice drills (v1.21/v1.22)** and/or the
**lesson visuals**, or to say "ready" for the next thing.

### Roadmap state (as of this handoff)

Open `ROADMAP.md` for the live version. Summary:

- 🔴 Blocker: empty
- 🟠 High: empty
- 🟡 Medium: empty
- 🟢 Low: empty
- 🅿️ Parking Lot: the deferred items (CSS var unification, orphaned
  sprint CSS cleanup, within-lesson basics highlighting, GR-B "living a
  workday" expansion, GR-D analogy sweep into glossary/say-lines beyond
  the proof set, extending visuals/tap-the-choice into the Interview
  kit). **Don't start these unless Mike promotes one.**

### What Mike will likely say first

One of:
- **Playtest results on v1.21/v1.22 or the visuals** → acknowledge,
  log any GR items with ET timestamp, fix or triage per workflow.
- **"Ready" / "what's next"** → all active buckets are empty. Either
  surface a Parking-Lot item for promotion (with reasoning + ROI) or
  ask what direction he wants. Don't invent scope.
- **New feedback** → triage with ET timestamp, propose bucket, confirm
  before working.

---

## Per-kit architecture cheat-sheet (earned the hard way)

**The #1 rule of this codebase: the SAME fix does NOT work in every
kit.** Each kit has its own render signatures, state shapes, and
helper names. Always read the specific kit's code before editing.
Below is the map so you don't re-discover it.

### Lesson-visual helpers ("See it on screen")
| Kit | Helper | Render tech |
|---|---|---|
| Tableau | `lessonVizHTML` / `drawLessonChart` | Chart.js (bar/line/scatter, `refline:'avg'`, `html`, `table`) |
| Stats | `lessonStatHTML` / `drawStatChart` | Chart.js (bar/line/scatter, `ci` floating-bar) |
| SQL | `lessonResultHTML` | HTML result table |
| Power BI | `lessonResultHTML` | HTML result table |
| Excel | `lessonGridHTML` | HTML cell grid |
| Python | `lessonOutputHTML` | HTML output block |

> Chart.js is loaded ONLY in Tableau + Stats. The other kits are pure
> HTML/CSS — don't reach for Chart.js there.
> **Canvas timing trap (Stats):** `openLesson` must set the view
> *active/visible* BEFORE calling `renderLesson()`, or charts render at
> 0×0 (blank). We hit this.

### Drill render signatures (they DIFFER)
| Kit(s) | Pattern | Signature |
|---|---|---|
| SQL, Power BI | navigate-based | `renderBug(idx)`, lives in `#main`, advance via `navigate('bug',n)` / `_bugAdvance(idx)` |
| Stats | item-state | `renderBug(item, done)`, `drillState.idx` |
| Excel, Python | indexed | `renderBug(item, idx, isDone)` |

### Tap-the-choice pattern (v1.21–v1.22, all 6 kits)
Every Bug Hunt / Describe drill has a `choices:[correct, …distractors]`
array (**correct is always index 0**). Render shuffles with `_shuf()`
and tags each button `data-correct="${c===choices[0]?1:0}"`. Handlers:
- SQL/Power BI: `pickBugFix(this, idx)` — reads `btn.dataset.correct`
- Excel/Python/Stats: `pickBug(this, idx)` / `pickEsql(this, idx)`
- On correct: green styles, disable all, `markDone('bugsDone'|'esqlDone', idx)`,
  celebrate, advance. On wrong: red the clicked button only.

> **There are NO `<textarea>` / free-text answer inputs left anywhere
> in the 6 lesson kits.** If you add a drill, it must be tap-the-choice.

### Headless verification (no browser needed)
Extract each inline `<script>` block and syntax-check with
`new Function(src)`. Catches the brace/paren slips that bit us
(Tableau scatter `Chart()`, etc.). Then optionally live-smoke via the
`preview_*` MCP tools — `preview_eval` DOM checks are reliable;
`preview_screenshot` was flaky this session.

---

## Stack details for quick reference

| Detail | Value |
|---|---|
| Live runtime | GitHub Pages (static site) |
| Each kit | Single self-contained `index.html`, inline CSS/JS |
| Theme variable | `--accent:#58aaa2` (teal) default; light mode toggles via `data-theme="light"` |
| Theme storage | `localStorage['apk-theme']` |
| Bare Basics flag | `localStorage['apk-basics'] === '1'` |
| Bare Basics highlight color | `#e0b84a` (amber, set in v1.4.0) |
| Per-kit lesson state keys | epk, sqlkit-v1, ppk, tpk, spk, pbikt-v1, ipk, sim2, apk-final |
| Most recent kit visited | `localStorage['apk-last-kit']` (drives Continue card) |
| Simulator API key (user-supplied) | `localStorage['sim2-apikey']` |
| Simulator API call | Direct browser → api.anthropic.com using `anthropic-dangerous-direct-browser-access: true` header. Uses `claude-sonnet-4-5`. |

---

## First thing to do when you start

1. Read this entire file (you just did).
2. Read `ROADMAP.md` — confirm "Currently working" line + bucket
   contents.
3. Read the latest entry in `CHANGELOG.md` — confirm what shipped
   most recently.
4. `git log --oneline -10` to see recent commits.
5. Wait for Mike's first message and respond per workflow.

Good luck. He's a great collaborator. Push back when you need to,
ship small, test on the live URL, and keep the cycle tight.
