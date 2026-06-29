# Session Handoff — Analyst Prep Kit

**Last session ended:** June 29, 2026 — 🧠 **Excel Learning-Science Polish Phase D COMPLETE** (v1.80.0 → v1.81.0)
**Current version:** `v1.81.0`
**You are continuing an established collaboration with Mike Nocito.**

---

> ### 🧠 CURRENT INITIATIVE — EXCEL LEARNING-SCIENCE POLISH (Phase E next)
>
> Full plan: `EXCEL_POLISH_MASTER_PLAN.md`. Phase roadmap:
> - ✅ **Phase A (v1.78.0):** Foundation fixes (readiness score, tap-choice drills, inline SVG charts, mobile, skip button)
> - ✅ **Phase B (v1.79.0):** Progressive v2 lesson flow on formula-spine lessons (SUM id:1, IF id:2, Nested IF id:14). 7 stages: Orient→Worked Example→Try (Parsons)→Compare→Build (tap-choice)→Own (quiz)→Close. Mike-verified and approved.
> - ✅ **Phase C (v1.80.0):** v2 flow rolled to all 51 Excel lessons. All units 0–10 complete (v1.79.1–v1.79.11).
> - ✅ **Phase D (v1.81.0):** Spaced-recall engine, progressive-artifact bridge, retrieval-honesty note, recall-wins counter, Lucide fix, rating-button radio group, 51-lesson Try-puzzle audit (8 fixed). Mike-verified.
> - ➡️ **Phase E (NEXT):** Honest unlock/motivation layer
> - Phase F: Focus/Detailed toggle
> - Phase G: AI Coach (premium, decision-gated)
> - Phase H: Port to SQL, Python, Power BI, Tableau, Stats
>
> **Cross-kit changes log** (bulk-apply to other kits when Excel polish is done): tracked in `EXCEL_POLISH_MASTER_PLAN.md` → "Cross-kit changes" section.

---

## Phase E — Motivation layer (for the fresh session)

**File:** `excel/index.html` (single file, ~2900 lines, CRLF line endings, no build step)
**Starting version:** `v1.81.0`
**Read `EXCEL_POLISH_MASTER_PLAN.md` first** — Part 3.4 and Part 4 row "Reward/unlock" are the design rationale.

### The one rule that governs all of Phase E (SDT)
Every element must read as **informational / competence-affirming** — never controlling, never scarce, never loss-framed. Hollow token rewards (points, gems, hearts) trigger the overjustification effect and manufacture anxiety. The reward here is **more of the actual knowledge**, permanent and revisitable. If you're unsure whether something belongs, ask: "Does this tell the learner something real, or does it pressure them?" Pressure = cut it.

---

### E1 — Honest unlock: deeper-insight card at lesson Close

**What:** When a learner completes the Own (quiz) stage, the Close section reveals an extra `unlock:` block that was hidden before. The reward is a deeper "why," a real job context, or a subtle gotcha that makes the concept click harder. Not points — more of the concept.

**Data shape — add to each lesson object (after `reinforces:`):**
```js
unlock:"Most analysts reach for SUMIFS before they know COUNTIFS exists — once you know both, you stop writing extra helper columns just to count conditional rows."
```
One sentence to two sentences. Tone: peer-level, "here's something you now have access to." Not cheerful. Not "great job!" — just the knowledge.

**Render logic — in `v2Body`, in the Close section (`// ⑦ Close`):**
```js
// Only show unlock when lesson is already done (not on first visit through)
if (done && l.unlock) {
  h += `<div class="unlock-card"><div class="unlock-header"><i data-lucide="key"></i> Unlocked</div><p>${l.unlock}</p></div>`
}
```
The `done` variable is already in scope in `v2Body(l, done)`.

**CSS** (add near other v2 styles):
```css
.unlock-card{background:var(--surf2);border:1px solid var(--accent);border-radius:var(--radius);padding:14px 16px;margin-top:12px}
.unlock-header{font-size:11px;font-weight:700;letter-spacing:.06em;text-transform:uppercase;color:var(--accent);display:flex;align-items:center;gap:6px;margin-bottom:6px}
.unlock-header .lucide{width:13px;height:13px}
```

**Commit:** `v1.81.1 Phase E: add unlock[] data to all 51 lessons`
**Commit:** `v1.81.2 Phase E: unlock card renders in Close stage when lesson complete`

---

### E2 — Return-streak: gentle "welcome back" on Home

**What:** Track the last date the user visited in `localStorage['epk-last-visit']` (date string `YYYY-MM-DD`). On each Home render, compare to today. If they're returning after ≥1 day away, show a one-line competence-affirming message in the resume card — nothing lost, just acknowledged. Clear on same-day reload (so it's one greeting per return visit, not per page load).

**Logic** (add to `renderHome()` or wherever the home view is built):
```js
function checkReturnStreak(){
  const today = new Date().toISOString().slice(0,10);
  const last = localStorage.getItem('epk-last-visit');
  localStorage.setItem('epk-last-visit', today);
  if(last && last !== today){
    const el = document.getElementById('returnGreeting');
    if(el) el.textContent = 'Good to have you back. Pick up where you left off.';
  }
}
```

Add a `<p id="returnGreeting" style="font-size:13px;color:var(--dim);margin-top:6px"></p>` inside the resume card (after the subtitle line). Call `checkReturnStreak()` inside `show('home')` (or in the existing `renderHome` function — grep for it).

No streak counter display, no "🔥 3-day streak" — just the one quiet line. Keep it purely informational.

**Commit:** `v1.81.3 Phase E: return-visit greeting on Home`

---

### E3 — Mentor voice audit (close lines only)

Grep for `close:"` in `excel/index.html` and scan all 51 close strings. The standard is:
- **Competence framing:** "You can now X" or "You have Y" — celebrates a real capability gained.
- **Forward thread:** "Next: Z" — what the next lesson adds to what was just built.
- **No cheerleading:** remove "Great work!", "Excellent!", or "Well done!" if any remain.
- **No loss-framing:** no "Don't forget…" or "Make sure you…"

Most close lines were written in Phase C with this in mind, so this is a scan + spot-fix pass, not a full rewrite. Fix any that violate the rules above. One commit if any changes needed.

**Commit (only if changes needed):** `v1.81.4 Phase E: mentor-voice audit on close lines`

---

### Commit pattern

```
v1.81.1 Phase E: add unlock text to all 51 lessons
v1.81.2 Phase E: unlock card renders in Close when lesson complete
v1.81.3 Phase E: return-visit greeting on Home
v1.81.4 Phase E: mentor-voice audit on close lines  ← only if fixes needed
```

Bump to **`v1.82.0`** when all sub-tasks are done. Update `CHANGELOG.md` and this file.

---

> ### 🎨 GRAIN REDESIGN — COMPLETE (archived context below)
> Restyling the whole suite to the **Grain** design system (clay `#C5511F` primary, honey amber
> accent, warm stone-on-cream; Space Grotesk + IBM Plex; **Lucide** line icons, no emoji) and,
> later, adopting its normalized lesson content. **Brief + drop-in tokens + Phase-3 content live
> OUTSIDE this repo:**
> `C:\Users\Mike\Projects\excel-dry-run-handoff\Grain Design System\design_handoff_grain_redesign\`
> (`GRAIN_REDESIGN_BRIEF.md` + `README.md` + `grain_reference/lessons-*.js`).
>
> **Guardrails:** zero build step, GitHub-Pages, vanilla HTML/CSS/JS; **keep every kit's real
> engine** (sql.js, Pyodide, Chart.js, the Claude-API sim); style only via Grain token CSS vars in
> `assets/grain/` (no one-off hex); test each kit end-to-end before the next.
>
> **DONE (v1.61.0 → v1.67.1):** hub + all **6 core lesson kits** (SQL, Excel, Python, Power BI,
> Tableau, Stats) restyled to Grain + the **"Say It Out Loud"** lesson view + a per-lesson
> confidence rater. Two crash fixes shipped: **v1.64.1** Lucide `createIcons()`+observer
> infinite-loop (froze lessons); **v1.67.1** a pre-existing top-level `Chart.register()` under
> deferred Chart.js that blanked Stats. A full headless sweep of all 11 kits + hub = every view
> renders, no errors.
>
> **DONE last session (v1.68.0–v1.68.1):** **Chart Literacy** restyled to Grain (Phase 2f) — inline
> **SVG (not Chart.js)**, robust Lucide loader; then **v1.68.1** fixed its **Practice** freeDrill bug
> (`lessonId:null` → `renderGuidedStep` read `lesson.title` on undefined → threw → drill tile did nothing).
> _Lesson learned: click-test interactive flows (drills), don't just confirm they render._
>
> **DONE this session (v1.69.0 + v1.70.0):**
> • **Forecasting** (Phase 2g) restyled to Grain + the **same freeDrill fix** ported over (it shared
>   the exact bug). ⚠️ The handoff predicted Forecasting "WILL use Chart.js" — it does NOT (inline
>   HTML `viz.html`), so the defer trap never applied. Brand mark = Lucide `trending-up`.
> • **Interview** (Phase 2h) restyled to Grain. **Structurally different** kit — rate-the-answer /
>   multiple-choice drills + an Answer Builder + a sealed-intention card, **NO `freeDrill` path**, so
>   no freeDrill bug to fix. Key trick: the old blue accent was baked into **14** `rgba(47,109,240,…)`
>   tints → all re-derived via `color-mix(in srgb, var(--accent) N%, transparent)`; hardcoded state
>   reds/amber → new `--err`/`--warn` vars. Brand mark = Lucide `messages-square`. **✅ verified by
>   Mike (070a/b/c pass).**
> • **Simulator** (Phase 2i) restyled to Grain — the **live Claude-API** kit. **Style ONLY: the
>   fetch endpoint, `claude-sonnet-4-5` model, `x-api-key`/direct-browser headers, and `sim2-apikey`
>   localStorage flow were NOT touched** (verified intact). Full var set → tokens; brand = Lucide
>   `briefcase`; intro/stat emoji → Lucide; 2 baked tints → `color-mix`; the cool `TYPE_COLOR`
>   skill palette remapped to Grain hues. No Chart.js. Content emoji (🗣️💡🎉👤, PASS✓/FAIL✗ in
>   prompts) left intact.
> All verified headless (0 syntax errors, 0 color residue, API block confirmed untouched); awaiting
> Mike's live playtest of Forecasting + Simulator, dark + light.
> • **♻️ Review-list / flag refactor (v1.72.0, all 6 core lesson kits):** Mike flagged the "Shaky?
>   Flag to revisit" button as redundant with the confidence rater. **Removed the flag feature
>   entirely** (lesson + drill flags — note Excel/Python/Tableau/Stats flagged drills via a *variable*
>   arg `flagBtnHTML(type,idx)`, SQL/PowerBI via literals). Home's "Your review list" is now built from
>   `confidence` ratings: lessons rated `low`/`mid` appear; `high`/unrated don't. New `confGotIt(id)`
>   sets confidence `high` (the "✓ Got it now" button). Two state-var groups: SQL/PowerBI use
>   `state`/`saveState`/`navigate('lesson',id)`; Excel/Python/Tableau/Stats use `S`/`save`/`openLesson(id)`
>   (Tableau/Stats "Got it" button is `btn-outline`, others `btn-ghost`). **Dead code left behind on
>   purpose:** `flagBtnHTML`/`toggleFlag`/`isFlagged`/`flagLabel` + `.flag-btn` CSS are now unused in all
>   6 kits — a spawned cleanup task covers removing them.
> _GR noted for triage: two stray "Chart Literacy" copy-paste leftovers in `forecasting/index.html` —
> the home heading "Start learning charts" (~L681) and the Settings → About text "Chart Literacy Kit"
> (~L963). Content-only; not fixed (no bundling without permission)._
>
> **Per-kit pattern (SQL/Excel/Python/PBI/Tableau/Stats = templates):** link `assets/grain/grain.css`
> → re-point the kit's `:root`/`.light`|`[data-theme]` vars onto Grain tokens (no new hex) → Space
> Grotesk headings + nav brand mark → emoji→Lucide via the robust icon loader → rebuild the lesson
> view to Grain "Say It Out Loud" (megaphone card → dark code block → say line → chunk chips → "See
> it on screen" eyebrow → gotcha → quick-check → confidence rater). Leave pedagogical CONTENT emoji
> + transient toasts. **Full pattern + gotchas are in memory `project_sql_prep_kit_state.md`.**
>
> **⚠️ TWO GOTCHAS:** (1) this Lucide build leaves `data-lucide` ON the generated `<svg>` → it
> re-matches its own output; the refresh helper MUST strip it — use Stats' robust loader
> (`grainRefreshIcons()` = createIcons + strip + disconnect-during-refresh observer + poll-for-lucide).
> (2) Chart.js loads `defer` (Tableau/Stats) → never call `Chart.*` at TOP LEVEL (it's undefined
> then → throws → aborts the whole script → blank page). Guard: `if(typeof Chart!=='undefined'){…}`
> else register on window `load`.
>
> **✅ DONE this session — Phase 2j: Final Exam kit** restyled to Grain (full var set→tokens, Lucide
> `clipboard-check` brand + chrome/CTA/See-it icons, 7-color `--c-*` subject palette → Grain hues, 6
> baked tints → `color-mix`). **Kept the Tableau dimension/measure study pills' blue/green on purpose**
> (mimics Tableau's real UI — recoloring would make the lesson wrong). No Chart.js.
>
> **🎉 GRAIN PHASE 2 IS COMPLETE — all 11 kits + the hub are on Grain.**
>
> **📚 PHASE 3 IN PROGRESS — adding the 4 cross-kit interview tracks (ADDITIVE, Mike's call).**
> Scope decided: **add the new tracks only** (Units 4–7), one kit per cycle, keeping existing lessons
> untouched. Tracks exist only for the 4 **tool** kits: SQL, Excel, Python, Power BI. Source =
> `design_handoff_grain_redesign/grain_reference/lessons-<kit>.js` (Units 4–7 are the new content;
> Units 0–3 are just reshapes of existing lessons — DON'T re-import those).
> - **✅ SQL DONE (v1.74.0 + v1.75.0):** all 4 tracks → 46 lessons. **✅ Excel DONE (v1.76.0):** all 4
>   tracks (Units 7–10) → 51 lessons; Excel `ral` is an array of `{formula,say,lines}` (Grain `code`→
>   `formula`) and viz is a grid `{cols,grid}` rendered by `lessonGridHTML` (chart→table converter +
>   wrap to grid: column letters + headers in row 1; added `histogram`). **🏷️ Hub lesson labels fixed**
>   (were stale "12 lessons"). ⚠️ Filter tracks by NAME not unit number — Excel's Units 4–6 are CORE
>   (Deeper Formulas/Charts/Power Tools); tracks are Units 7–10. Pattern proven:
>   1. node-extract Units 4–7 from `lessons-sql.js`; translate Grain shape → the kit's shape
>      (`code`→`ral.sql`, `say`→`ral.say`, `lines`→`ral.lines`); insert into `DATA.LESSONS` before the
>      array close (⚠️ files are **CRLF** — anchor with `\r\n`). New IDs 501–508/601–606/701–706/801–806
>      don't collide. Made lesson `intro` optional in the render (track lessons have no intro).
>   2. **Chart viz → data tables:** track lessons use viz types the kits can't draw
>      (bar/line/waterfall/boxplot/combo/scatter). Mike's call = render the underlying data as a
>      `{columns,rows}` table via the existing result-table renderer. The converter is in the SQL
>      git history (v1.75.0 commit) — reuse it for the other kits (each kit's table renderer differs:
>      Excel=`lessonGridHTML`, Python=`lessonOutputHTML`, Power BI=`lessonResultHTML`).
> - **✅ Python DONE + ✅ Power BI DONE (v1.77.0).** Python: ral array `{formula,say,lines}`, viz →
>   `lessonOutputHTML` `df` table. Power BI: ral object `{code,say,lines}`, viz → `lessonPbiHTML`
>   `html` table (inline `<table>` string). **🎉 Phase 3 track rollout COMPLETE — all 4 tool kits.**
>   (Tableau/Stats/Charts/Forecasting/Interview have NO tracks — tool-kit only.)
>   Reusable generator lives in the v1.74–v1.77 commits: load Grain `lessons-<kit>.js` by string
>   index (NOT regex), filter tracks by NAME, `vizToTable()` converter (table/bar/line/waterfall/
>   boxplot/histogram/combo/scatter), then wrap to the kit's viz shape; CRLF anchors.
> **⏸️ Phase 4 is PARKED — revisit ~July 25, 2026 (traffic-gated).** Decision (Mike + Claude, Jun 25):
>   hold the whole phase ~1 month; none of it earns its keep pre-traffic (GA4 was just added — let usage
>   data promote what's worth building). Verdicts in ROADMAP Parking Lot: cross-kit Cards/Practice/
>   Glossary → later; achievements → later/maybe-skip (clutter risk vs calm vision); real Grain dark
>   palette → later/low-pri (dark already works); **React re-platform → skip even later** (vanilla/zero-
>   build is a feature). One portfolio-value pull-forward if promoted sooner: real inline-SVG **charts**
>   in the track lessons (they currently render as data tables). **Don't start Phase 4 unless Mike
>   promotes it.** Independent loose ends still open: none blocking.
> Then **Phase 3:** adopt Grain's normalized lesson content + the 4 cross-kit tracks (Data Migration ·
> From Question to Metric · Financial Analyst · Advanced Analyst Toolkit). **Phase 4** (separate
> decision): cross-kit Cards/Practice/Glossary surfaces, a real Grain dark palette, React-vs-vanilla.
>
> **Per-kit Grain pattern (reused this session, proven on Chart Literacy):** link
> `../assets/grain/grain.css` → re-point the kit's own `:root` / `[data-theme="light"]` vars onto Grain
> tokens (no new hex) → `h1–h4{font-family:var(--font-display)}` → emoji→Lucide (nav `.logo-mark` +
> chrome buttons + drill-tile icons) → add the **robust `grainRefreshIcons()` loader** (createIcons +
> strip `data-lucide` off generated `<svg>` + disconnect-during-refresh MutationObserver + poll-for-lucide).
> **Click-test the drills**, not just render. Cleanup noted: "Bare Basics" (removed v1.58) still appears
> as dead refs in 8 files — prune when convenient.
>
> ---
>
> _Older history (curriculum rebuild v1.41–v1.46 w/ Unit-0 foundations + 📖 coffee-company story
> bridges + position-based nav via `lessonPos()`/`nextLessonId()`; Tableau cert v1.23–v1.40;
> visual-parity sweep; "Know Your Workspace" module in Tableau/PBI/Excel) is in `CHANGELOG.md` +
> git. **The per-kit architecture cheat-sheet lower in THIS file is still current and load-bearing —
> read it before editing any kit.**_

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
| Bare Basics mode | REMOVED in v1.58.0 (Mike-directed) — the Analyst Sprint games are the "bare basics" now. `apk-basics` is cleaned from localStorage on load. Don't rebuild it. |
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
