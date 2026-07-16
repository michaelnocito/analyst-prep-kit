# Analyst Prep Kit — Roadmap

> ### 🧪 SQL-KIT PLAYTEST TRIAGE 2026-07-16 — RESEARCH-BACKED BATCH PLAN (DECIDED: research done, builds pending Mike's batch go)
> 13 inbox items from Mike's 2026-07-16 SQL-kit playtest, triaged same day with three
> focused research passes (lab placement / progressive capstone / SQL sequencing /
> path-map + badges + return engagement). Decisions written back to the playtest
> tracker (Supabase, all 13 items → roadmap/noted). **SQL kit is the polish bench —
> every batch here becomes a template for the other kits, riding the same
> one-kit-per-chat rollout train as the knowledge path.**
>
> **Batch 1 — quick fixes + content glue (small) — ✅ SHIPPED v1.148.0 (2026-07-16), awaiting Mike's retest**
> - 🐛 Hint text unreadable in light mode.
> - 🐛 Parsons "put in order" drag friction (desktop + mobile) → low-friction
>   tap-to-place ordering.
> - Every query exercise must state its table names (+ schema glance) in the prompt.
> - Aliasing: NO standalone page (research call — just-in-time principle, Mayer &
>   Moreno 2003, doi:10.1207/S15326985EP3801_6). Teach column aliases (`AS`) inline
>   at the first aggregate; table aliases (`o`, `s`) inline at the first join that
>   uses them.
>
> **Batch 2 — "Put It All Together" v2 — ✅ SHIPPED v1.151.0 (2026-07-16), awaiting Mike's retest; this 18-step faded-capstone pattern is the template for the other kits**
> - Backward-faded worked-example capstone, 15–20 steps, exactly ONE new clause or
>   one removed scaffold per step; starts fully worked + annotated, ends with bare
>   business questions; skip-ahead for confident users (expertise-reversal guard).
> - Research: fading worked examples (Renkl & Atkinson 2003, doi:10.1207/S15326985EP3801_3;
>   Atkinson, Renkl & Merrill 2003, J Ed Psych, doi:10.1037/0022-0663.95.4.774);
>   expertise reversal (Kalyuga et al. 2003, doi:10.1207/S15326985EP3801_4).
>
> **Batch 3 — lab integration into the guided path — ✅ SHIPPED v1.152.0 (2026-07-16), awaiting Mike's retest**
> - End-of-unit cumulative "Make it stick" lab nodes on the path: mix the unit's
>   constructs with earlier units' (interleaving ~doubles test performance,
>   Rohrer & Taylor 2007, Instr Sci, doi:10.1007/s11251-007-9015-8; spacing:
>   Cepeda et al. 2006, Psych Bull, doi:10.1037/0033-2909.132.3.354).
> - Per-unit Put-It-All-Together versions (Mike's ask) = these unit-boundary labs.
> - Hand-off friction fix: labs launch FROM and RETURN TO the exact path position;
>   persistent breadcrumb ("Unit 3 • Lab • then Lesson 3.4") + "Continue path →"
>   on lab completion; same dataset/schema as the unit (contiguity, Ginns 2006,
>   doi:10.1016/j.learninstruc.2006.10.001).
> - "Repeat until fluid" framing only pays if repeats are SPACED (Rohrer et al.
>   2005, doi:10.1002/acp.1083) → pair with next-day recall prompts, don't push
>   many immediate reps.
>
> **Batch 4 — curriculum reorder + Unit 0 diet — ✅ SHIPPED v1.149.0 (2026-07-16), awaiting Mike's retest. IDs unchanged; see CHANGELOG for the new unit map.**
> - Playtest instinct confirmed: no respected curriculum (SQLBolt, Mode, university
>   syllabi) puts a complex join before single-table fluency. For analysts:
>   aggregates BEFORE joins (lower element interactivity — Sweller 1988,
>   doi:10.1207/s15516709cog1202_4; prerequisite ordering — Doignon & Falmagne 1985,
>   doi:10.1016/S0020-7373(85)80031-6).
> - Canonical 12-lesson core order: SELECT → WHERE → ORDER/LIMIT/DISTINCT →
>   expressions+AS → aggregates → GROUP BY → HAVING+order-of-execution (spiral
>   review) → INNER JOIN+table aliases → LEFT JOIN+NULLs → join+GROUP BY combined
>   (spiral) → subqueries/CTEs → window functions.
> - Unit 0: shrink to a 5-minute orientation; redistribute the rest as short
>   just-in-time preambles inside the lessons that need them (pretraining +
>   segmenting, Mayer & Moreno 2003). ⚠️ Touches lesson ids/cards/drills maps —
>   coordinate with the knowledge-path data (`LESSON_CARDS`/`LESSON_DRILLS`/`LESSON_LABS`).
>
> **Batch 5 — visual path map + badges + return engagement**
> - Duolingo-style single vertical rail per kit: done/current/upcoming (dimmed,
>   NEVER locked — soft-guide rule), unit headers with progress rings, current
>   node = Continue.
> - Badges: competence-framed mastery badges with visible progress ("3/5 join
>   lessons") + a few unexpected delight badges; NO attendance trinkets
>   (badges work when monitored — Hamari 2017, CHB, doi:10.1016/j.chb.2015.03.036;
>   expected contingent rewards undermine intrinsic motivation — Deci, Koestner &
>   Ryan 1999, Psych Bull, doi:10.1037/0033-2909.125.6.627).
> - Return loop (localStorage-feasible, no push): review-due queue as the primary
>   hook (spaced retrieval is real learning, not retention theater — Roediger &
>   Karpicke 2006, doi:10.1111/j.1467-9280.2006.01693.x), streak with 1 free
>   freeze/week as secondary (broken-streak demotivation — Silverman & Barasch
>   2023, JCR, doi:10.1093/jcr/ucac029), soft "2 reviews due tomorrow" sign-off
>   copy. Mirror to Supabase when signed in.
>
> **Suggested sequencing vs the two in-flight initiatives:** Batch 1 anytime
> (small). Batch 4 (reorder) BEFORE Batches 2–3 get templated to other kits, so
> the capstone/lab pattern lands on the corrected order once. Knowledge-path
> rollout (next kit: Stats) and Zinc & Sky rollout (next kit: Interview) continue
> on their own one-kit-per-chat tracks; Batch 3 extends the path pattern, so any
> kit that gets the path AFTER Batch 3 ships should get lab nodes in the same pass.

> ### 🎨 ZINC & SKY PALETTE ROLLOUT — IN PROGRESS (July 2026)
> Mike rejected the Grain clay/amber colors ("Claude-branding-like, too neutral").
> New palette chosen after a blue bake-off: **light = zinc neutrals + deep cyan
> `#0E7490`; dark = zinc near-black `#09090B/#18181B` + electric sky `#38BDF8`**.
> Mechanism: `assets/grain/zinc-sky.css` loaded AFTER grain.css re-points the
> Grain primitive ramps — no markup changes per kit. Full plan, per-kit checklist,
> and gotchas: **`HANDOFF-zinc-sky-rollout.md`** (authoritative for this effort).
> Cadence: ONE kit per session, Mike checks in between.
> - ✅ SQL (v1.132.0 pilot + v1.132.1 contrast patch)
> - ✅ Excel (v1.133.0 — selectors generalized for its data-theme convention)
> - ✅ Python (v1.134.0) · ✅ Power BI (v1.135.0) · ✅ Hub (v1.136.0, pulled
>   forward) · ✅ Tableau (v1.137.0) · ✅ Stats (v1.139.0) · ✅ Chart Literacy
>   (v1.140.0) · ✅ Forecasting (v1.141.0)
> - ⬜ REMAINING: Interview → Simulator → Final → cert kits (tableau-cert /
>   excel-cert / powerbi-cert) → excel-lessons → guides/* → privacy/terms →
>   fold zinc-sky into Grain tokens. (Hub already done.)
> - ⬜ THEN other applicable repos (same zinc-sky token approach where they use
>   the calm-analyst/Grain look): personal site `michaelnocito.github.io`,
>   prep-companion-apps (Sprint Excel/SQL), sql-dry-run, excel-dry-run,
>   nexus-sql-mystery, keygarden (evaluate — has its own art-pack identity),
>   spreadsheet/tableau-archaeology, draw-lab, excel-interview. Decide per repo
>   with Mike; games (play-area, sql-quest) keep their own art directions.

**Current version:** `v1.118.0` (shipped July 7, 2026 — 📖 **"Go for all": the three flagged finish-line items CLOSED.** `v1.116.0` Final Exam's last 3 typed fill-ins → tap-the-choice (fill machinery removed, stale typed answers migrated). `v1.117.0` Tableau's 8 diagnostic What's-Wrong items now RENDER the broken chart (inline-SVG `TAB_WRONG_SVG`, Excel's `svg:` pattern) — closes the all-exercise chart audit with a documented scope call: chart-CHOICE questions stay text-only on purpose (the visual would reveal the answer). `v1.118.0` **GR-D COMPLETE**: ~730 quiz explanations + Gotchas reviewed across all 6 lesson kits, 92 rewritten to open with a real-world analogy/concrete scenario (Excel 25 · Stats 16 · Tableau 15 · PBI 15 · SQL 11 · Python 10); bonus Tableau Top-N order-of-operations content fix. All suites green after each step. Test batches 35–36 in `apk_CLAUDE.md`.)
**Prior:** `v1.115.0` (shipped July 7, 2026 — 🧹 **Finish-line polish sweep before the paywall work**: ALL open non-paywall interface items closed — home "Lessons" section (unit bars + Next up) rolled to SQL/PBI/Python + Stats next-up; Stats readiness un-frozen (was hardcoded lesson1–10, missed Unit 0 + L11–12) + position-based Resume; Excel resume card position fix (showed "LESSON 101") + lesson-bound "Practice this →" on the v2 Close stage (was generic, out of step with every other kit); mobile full-width Parsons Check CTAs + wrapping chips (5 kits); Chart Literacy/Forecasting cross-links added to Excel/Python/Interview/Simulator/Final (Low-bucket item CLOSED); dead fill-input CSS removed (6 kits); README refreshed (12 apps, v2 flow, arcade); sitemap +projects/. **Full test sweep all green:** 51-script parse gate · 121 de-test checks · 24 modernized legacy-harness checks (flag checks removed, drill-choices integrity added) · NEW 13-page runtime render-smoke · link crawl (internal all resolve, 17 externals HTTP 200) · no mojibake/template leaks. Hub "✓ Exam" badge verified as already satisfying the exam-pass follow-on.)
**Prior:** `v1.113.0` (shipped July 6, 2026 — ✅ **All-kits no-auto-advance sweep** (Mike's check-all-kits playtest blocker): Python / Power BI / Tableau / Stats stage flows + Power BI practice Parsons + Excel v2Continue flow all hold on answers with Try Again / Continue buttons, matching the v1.111.0 SQL fix. interview / forecasting / chart-literacy / final / excel-lessons swept clean. Auto-advance sweep CLOSED.)
**Prior:** `v1.112.0` (shipped July 6, 2026 — 🗄️ **SQL kit "Set Up a SQL Database" lesson (Unit 0 id 105, free — CSV → steam_games_raw → verify) + hash deep links (`sql/#lesson-105`) + Project Studio "📚 New to this?" links** on tool-tagged plan steps, SQL load steps pointing at the new lesson. Closes both roadmapped items from the 2026-07-06 playtest triage. Kits' auto-advance sweep still open.)
**Prior:** `v1.111.0` (shipped July 6, 2026 — ✅ **SQL kit: no auto-advance on lesson checks** (Mike's playtest blocker: Build It advanced past wrong answers; correct-answer explanations vanished in ~1s). Quick Check / Build It / Parsons now hold with Try Again + Continue buttons. **Open follow-ups from this playtest:** (1) sweep the OTHER kits for the same auto-advance patterns — Mike flagged check-all-kits; (2) new content idea: a "Setting up a SQL database" section (import a raw CSV into a table, e.g. `steam_games_raw`, to enable filtering/joining — hit this doing a real portfolio project) + link technically-heavy coached steps to a basics explainer.)
**Prior:** `v1.110.0` (shipped July 6, 2026 — 📊 **Medium #6 slices 2+3: Python + Power BI track-lesson charts — the track-chart pull-forward is COMPLETE across all applicable kits** (Tableau/Stats already draw Chart.js viz). 121 headless checks green. Test batch 33 in `apk_CLAUDE.md`. Remaining #6 scope = the broader all-exercise chart/pivot audit (parked flavor); #7 SEO stays post-GSC.)
**Prior:** `v1.109.0` (shipped July 6, 2026 — 📊 **Medium #6 slice 1: SQL track lessons get real inline-SVG charts** (line/bar/diverging/box/Pareto generators, zero-dep, CSS-var themed; 7 chart-centric lessons; table stays as ground truth). 117 headless checks green. Test batch 32 in `apk_CLAUDE.md`. **Next #6 slices: Excel What's-Wrong sweep done long ago — remaining = Python/PBI track lessons reusing these generators.**)
**Prior:** `v1.108.0` (shipped July 6, 2026 — 🏁 **Phase D+E rollout COMPLETE: Tableau (v1.107.0) + Stats (v1.108.0) shipped, so all 6 lesson kits now run the full learning-science stack** (7-stage flow + spaced recall + motivation layer). 165 hand-authored recall cues across the 5 ported kits this sprint. 115 headless checks green. Test batches 27–31 in `apk_CLAUDE.md`. **The Learning-Science High item is now fully built — pending Mike's playtest of the batches.**)
**Prior:** `v1.106.0` (shipped July 6, 2026 — 🧠 **Power BI kit Phase D+E parity**: spaced-recall engine + 39 cue sets + bridge/honesty/wins/greeting; resume-card position fix; reset clears recall keys. 69 headless checks green across SQL+Python+PBI. Test batch 29 in `apk_CLAUDE.md`. **Remaining: Tableau → Stats.**)
**Prior:** `v1.105.0` (shipped July 6, 2026 — 🧠 **Python kit Phase D+E parity**: spaced-recall engine + 42 cue sets + bridge/honesty/wins/greeting; resume-card position fix; resets clear recall keys. Headless suite now kit-parameterized (`de-test.mjs`, 46 checks green across SQL+Python). Test batch 28 in `apk_CLAUDE.md`. **Remaining: Power BI → Tableau → Stats.**)
**Prior:** `v1.104.0` (shipped July 6, 2026 — 🧠 **SQL kit Phase D+E learning-science parity with Excel**: spaced-recall engine (+1/+3/+7) with 46 hand-authored cue sets, artifact bridge, retrieval-honesty note, recall-wins counter, return-visit greeting; coach key migrated to shared `apk-coach-key`. Verified by a new 23-check private headless behavioral suite. Test batch 27 in `apk_CLAUDE.md`. **Next: roll D+E to Python → Power BI → Tableau → Stats on Mike's go.**)
**Prior:** `v1.83.8` (shipped June 30, 2026 — ✅ **Phase H2 SQL content review COMPLETE** — 5 fixes: MySQL dialect fix on id:503, broken cohort SQL rewritten with CTE on id:606, table-structure context added to id:606 story, dialect notes added to id:803 and id:805. All 7 test checks passed. **Next: Phase H1 — SQL structural port (v2 lesson flow + AI Coach).**)
**Prior:** `v1.83.7` (June 30, 2026 — Phase G Mode 3 UX polish shipped.)
**Prior:** `v1.77.0` (shipped June 25, 2026 — 📚 **Phase 3 track rollout COMPLETE** — Python (+24 → 42 lessons) and Power BI (+23 → 39) gained all 4 interview tracks, finishing the additive-tracks phase across all 4 tool kits (SQL 46 · Excel 51 · Python 42 · Power BI 39, all matching Grain targets). Python viz → `lessonOutputHTML` `df` table; Power BI viz → `lessonPbiHTML` `html` table. Hub labels updated. Verified headless, 0 syntax errors. **Grain Phases 2 + 3 both COMPLETE. Phase 4 is PARKED — revisit ~July 25, 2026 (traffic-gated; see Parking Lot).**)
**Prior:** `v1.76.0` (June 25, 2026 — 📚 Phase 3: Excel kit complete — 4 tracks → 51 lessons; hub labels fixed.) — all 4 interview tracks added (Units 7–10), Excel now **51 lessons** (matches Grain). Excel shape differs (ral array `{formula,say,lines}`; viz = spreadsheet grid `{cols,grid}`) — chart→table converter extended (+histogram) then wrapped to grid form for `lessonGridHTML`. 🏷️ **Hub lesson-count labels fixed** (were all stale "12 lessons" → now accurate: Excel 51 · SQL 46 · Tableau 32 · Python 18 · Stats 16 · PBI 16 · Interview 16 · Charts/Forecasting 13). Verified headless, 0 syntax errors. **Next: Python → Power BI.**)
**Prior:** `v1.75.0` (June 25, 2026 — 📚 Phase 3: SQL kit complete — all 4 interview tracks, 46 lessons; chart viz→data tables.) — all 4 interview tracks added (Units 4–7: Data Migration · From Question to Metric · Financial Analysis · Advanced Analyst Toolkit), SQL now **46 lessons** (matches Grain target). Chart viz the kit can't draw (bar/line/waterfall/boxplot/combo/scatter) are rendered as **data tables** via a converter + the existing `lessonResultHTML` (Mike's call — no Chart.js added). Verified headless, 0 syntax errors. **Next: roll the 4 tracks to Excel → Python → Power BI**, reusing the chart→table converter.)
**Prior:** `v1.74.0` (June 25, 2026 — 📚 Phase 3 begins: SQL Unit 4 "Data Migration" track (8 lessons), pilot of the additive-tracks approach.)
**Prior:** `v1.73.1` (June 25, 2026 — 🧹 cleanup: removed dead flag-feature helpers (`isFlagged`/`toggleFlag`/`flagBtnHTML`/`flagLabel` + `.flag-btn` CSS + 5 lingering guided-step flag refs) from all 6 core kits; fixed two "Chart Literacy" copy leftovers in Forecasting. Verified headless: 0 syntax errors, 0 dead refs. **Both loose ends from the Phase-2 wrap are now closed.**)
**Prior:** `v1.73.0` (June 25, 2026 — 🎨 Grain redesign Phase 2j: **Final Exam** kit restyled to Grain — full var set→tokens, Space Grotesk headings, Lucide `clipboard-check` brand + chrome/CTA/See-it icons via the robust loader; 7-color per-subject palette remapped to Grain hues; 6 baked tints → `color-mix`. **🎉 This COMPLETES the Grain Phase-2 rollout — all 11 kits + hub are now on Grain.** Intentionally kept the Tableau dimension/measure study pills' blue/green (mimics Tableau's real UI). No Chart.js. Verified headless, 0 syntax errors. Awaiting Mike's live playtest.)
**Prior:** `v1.72.0` (June 24, 2026 — ♻️ **Review list now driven by the confidence rater; flag feature removed** across all 6 core lesson kits. The "Shaky? Flag to revisit" button (lesson + drill) was redundant with "How well do you have this?" — now a lesson lands on Home's "Your review list" when rated "Not yet" or "Almost" (unrated/"Have it" stay off); the "✓ Got it now" button sets confidence to "high" via new `confGotIt()`. Mike-confirmed: threshold = below "Have it", remove all flags. Verified headless, 6 kits, 0 syntax errors, 0 flag call-sites, logic-tested. Dead flag helpers left for a separate cleanup.)
**Prior:** `v1.71.0` (June 24, 2026 — 🎨 Grain redesign Phase 2i: **Simulator** (Claude-API) kit restyled to Grain — full var set→tokens, Space Grotesk headings, Lucide `briefcase` brand mark + chrome/intro/stat icons via the robust loader. **Style only — the live Claude API fetch/model/key logic was NOT touched** (verified intact). Two baked tints → `color-mix`; the cool skill-category palette (`TYPE_COLOR`) remapped to Grain hues. No Chart.js. Verified headless, 0 syntax errors, 0 residue, API block confirmed untouched. Awaiting Mike's live playtest.)
**Prior:** `v1.70.0` (June 24, 2026 — 🎨 Grain Phase 2h: Interview kit restyled — 14 baked-blue tints → `color-mix`; **✅ verified by Mike, 070a/b/c pass**.)
**Prior:** `v1.69.0` (June 24, 2026 — 🎨 Grain Phase 2g: Forecasting restyled + its `freeDrill` Practice bug fixed; Forecasting does NOT use Chart.js. Verified headless.)
**Prior:** `v1.68.1` (June 23, 2026 — 🐛 fix: Chart Literacy "Practice" drills did nothing on click — `freeDrill` `lessonId:null` → `renderGuidedStep` read `lesson.title` on undefined → threw. Fixed the no-lesson free-practice path. Verified live.)
**Prior:** `v1.68.0` (June 23, 2026 — 🎨 Grain redesign Phase 2f: Chart Literacy restyled to Grain. Inline SVG, not Chart.js. Verified headless + live, dark + light.)

> ### 🎨 GRAIN REDESIGN — ✅ PHASES 0–3 COMPLETE (July 2026). Phase 4 parked (see Parking Lot; revisit ~July 25, traffic-gated). Historical plan below.
> Restyling the suite to the **Grain** design system (clay primary `#C5511F`, honey amber accent,
> warm stone neutrals on cream; Space Grotesk + IBM Plex type; **Lucide** line icons, no emoji).
> Plan + tokens live in `C:\Users\Mike\Projects\excel-dry-run-handoff\Grain Design System\design_handoff_grain_redesign\`
> (`GRAIN_REDESIGN_BRIEF.md` + `README.md`). **Guardrails:** zero build step, GitHub-Pages-deployable,
> vanilla HTML/CSS/JS; **keep every kit's real engine** (sql.js, Pyodide, Chart.js, Claude-API sim);
> style only through Grain token CSS vars (no one-off hex); test each phase before the next.
> - **Phase 0 — Tokens + hub restyle ✅ shipped v1.61.0.** Tokens in `assets/grain/`.
> - **Phase 1 — SQL pilot ✅ shipped v1.62.0.** Shell remap + Say-It-Out-Loud lesson view +
>   confidence rater + Lucide (MutationObserver on `#main`); sql.js engine untouched.
> - **Phase 2 — roll restyle + Say-It-Out-Loud across remaining kits, one at a time.**
>   ✅ Excel (v1.63.0) · ✅ Python (v1.64.0) · ✅ Power BI (v1.65.0) · ✅ Tableau (v1.66.0) · ✅ Stats (v1.67.0).
>   **All 6 core lesson kits done.** Then the non-core surfaces: ✅ Chart Literacy (v1.68.0) ·
>   ✅ Forecasting (v1.69.0) · ✅ Interview (v1.70.0) · ✅ Simulator (v1.71.0) · ✅ Final (v1.73.0).
>   **🎉 Phase 2 COMPLETE — all 11 kits + hub are on Grain.** (None of the non-core kits used
>   Chart.js — all inline HTML/SVG — so the defer trap never applied. `color-mix(in srgb, var(--accent)
>   N%, transparent)` was the reusable trick for baked-accent rgba tints; cool categorical palettes
>   (Simulator `TYPE_COLOR`, Final `--c-*`) were remapped to Grain hues.)
> - **➡️ NEXT: Phase 3** — adopt Grain's normalized lesson content + the 4 cross-kit interview tracks
>   (Data Migration · From Question to Metric · Financial Analyst · Advanced Analyst Toolkit). Content,
>   not styling. Plan/tokens still in the design_handoff folder.
> - **Phase 3 — adopt Grain's normalized lesson content + the 4 cross-kit interview tracks.**
> - **Phase 4 — (separate decision, not this initiative):** Cards/Practice/Glossary surfaces,
>   achievements, real Grain dark palette, React-vs-vanilla call.

**Prior version:** `v1.54.1` (shipped June 12, 2026 — GR-H toast fix + Chart.js defer; v1.54.0's ten checks 054a–054j ALL PASSED, Mike June 12)
**Note (June 12, 2026 — 2:10 PM ET):** the "roll the Excel home Lessons section to other kits" inbox item is now DONE for **Tableau** (v1.54.0 home rebuild). Remaining: SQL, Python, Stats, Power BI.
**Recent:** v1.42–46 **Curriculum rollout COMPLETE** — all 5 remaining kits (Excel, SQL, Python, Stats, Power BI) each received Unit 0 (4 foundation lessons) + story bridges on all 12 existing lessons + position-nav. 20 new lessons total. Tableau already done (v1.37–v1.41). All 6 lesson kits are now fully scaffolded.
**6-Month Analyst Standard rebuild: SHIPPED.** Every kit now has: Unit 0 Foundations, 📖 story bridges on every lesson, position-based nav, lesson number display by array position. Interview/Sim/Final kits intentionally excluded. Plans: `CURRICULUM_STANDARD.md`, `CURRICULUM_PLAN.md`.
**In flight: the 6-Month Analyst Standard rebuild** (`CURRICULUM_STANDARD.md` + `CURRICULUM_PLAN.md`). Tableau pilot ✅ shipped — awaiting Mike's reaction. On approval, roll the same pattern (Unit 0 + prereqs + depth) to **Excel → SQL → Python → Power BI → Stats**, one kit per cycle. Per-kit Unit-0 lessons already specced in `CURRICULUM_PLAN.md`.
**State: everything shipped is verified clean and awaiting Mike's playtest.** Big-day session (v1.22 → v1.36): Tableau cert beef-up (20 lessons), Workspace module (3 GUI kits), full visual-parity sweep, Final study-guide visuals.
**Visual-parity sweep: ✅ DONE (all 6 kits).** Borderline menu-cases (SQL L10, PBI L6, Stats L9) left as single examples by design.
**Rollout audit (June 3, 2026 — 6:55 PM ET):** confirmed scope of every session change. Visual-parity = all 6 lesson kits ✅. 🧭 Workspace module = **GUI tools only (Tableau/Power BI/Excel) — DECIDED, not rolling to SQL/Python/Stats** (code/concept kits, no button-hunting). Grouping + cert lessons = Tableau-only by design. No missed kits.
**Playtest passes:** Tableau L14 Live/Extract ✅, L16 Data Properties ✅, L17 Sets ✅ (June 3).
**QA:** whole-kit smoke/acceptance checklist added at `TESTING_CHECKLIST.md` (6 shared checks per kit + kit-specific top-level item; research-backed lenses). v1.27.0 "Know Your Workspace" UI module. v1.24.0 Cycle 1/7 L14 ✅ PASS.
**Note:** Tableau cert-critical plan (`TABLEAU_CERT_PLAN.md`) fully shipped — L14–L20 awaiting Mike's playtest. Optional future: full-blueprint Tableau (maps/density, bins/histograms, quick table calcs, formatting, sharing/export, cert practice-exam mode); roll Workspace module to SQL/Python/Stats. Parking Lot: deeper IN/OUT-in-filters explainer (fold into L17 Sets when promoted) — park until UI-walkthrough fully done.

🅿️ **PARKING LOT (added June 3, 2026 — 1:00 PM ET):** Tableau — a clear **"IN / OUT" explanation** (how membership shows as IN/OUT in **filters** and when bucketing **categories**, i.e. the Sets concept). Mike's call: **park until the new UI-walkthrough (Workspace) feature is fully done across the kits**, then address. Natural home = the upcoming **L17 Sets** lesson (fold the IN/OUT explainer there) — revisit when promoting. v1.25.0 Grouping lesson visuals (per-block `html`). v1.24.0 cert Cycle 1/7 L14 Live vs Extract ✅ PASS. Next: cert Cycle 3/7 = L16 Managing Data Properties. v1.23.2 Grouping lesson — deeper basics + Data-pane gotcha, verified vs Tableau docs. v1.23.1 Grouping lesson — added methods + Group-vs-Set-vs-Hierarchy note. v1.23.0 Tableau new **Grouping** lesson (Lesson 9, Unit 2) — combine members into a group, "Group Other," group-vs-everything-else visual + 3 guided tap-the-choice drills (Mike's class topic). v1.21.0 Tableau drills → tap-the-choice; v1.22.0 rolled tap-the-choice to all kits' Bug Hunt + Describe drills (no free-text answer boxes remain anywhere).
**Last cycle closed:** June 2, 2026 — Hub follow-ons: mini-exam score badge per kit + Bare Basics "X of 6 subjects" indicator (final persists section scores)
**Active buckets are now CLEAR** (parking lot excluded). Recently shipped: per-kit mini exam + GR-G home/Excel resolved (v1.19.0), GR-D analogy intros (v1.18.0), GR-C/E/A (v1.17.0), Guided Path + "See it on screen" visuals on all 72 lessons (v1.10–v1.16). _Follow-ons noted: GR-D sweep beyond intros (quiz explanations / glossary / `say` lines); mini-exam → mark kit "complete" on hub; optional Bare Basics hub "X of 7" indicator._
**Currently working:** _v1.59.0 shipped (June 13, 2026 — 12:41 AM ET): 🚩 flag-for-review on all 6 lesson kits (one-tap "Shaky? Flag to revisit" on lessons/drills/guided steps → "Your review list" card on each kit Home) + fixed the "Practice this practices the NEXT lesson's drills" bug in Excel & Python (XLOOKUP→COUNTIF repro). Awaiting Mike's playtest._
Earlier: _GR-G epic Guided Path now LIVE on all six code-drill kits (Excel, Python, Tableau, SQL, Stats, Power BI), each with full drill coverage (every drill linked to the first lesson it applies to). Interview kit deferred — its rate-the-answer / multiple-choice structure needs its own design (Mike's call, June 2). Also shipped: Tableau tap-the-word fills + persistent Quick Check feedback (v1.11.0)._

---

## Vision principles (the prioritization lens)

Every roadmap item is scored against these three principles. If a
feature reinforces one and harms none, it moves up. If it reinforces
one but adds friction elsewhere, it gets parked or redesigned.

1. **See your progress at a glance.** A returning user should know,
   without clicking, how far they've gotten in each kit.
2. **Always know what to do next.** No "where was I?" moments. The
   hub and every kit should answer "do this next" without thinking.
3. **Free to explore.** Nothing locked, nothing punishing. Wandering
   off the recommended path costs nothing and looks the same as
   following it.

Sub-rule: **simplicity beats completeness.** A feature that serves
one principle but bloats the UI doesn't ship until it can be done
without bloat. We'd rather have nine clean kits than nine kits and
seven dashboards.

---

## Quarterly Premium Release Strategy

**Goal:** Launch with a solid free tier (Aug 1, 2026). Then release **one major premium feature per quarter** on a predictable schedule to keep marketing momentum, convert free users, and maintain buzz without launch-day pressure.

**Release cadence:**
- **Q3 2026 (Nov 1, 2026)** — First premium drop: **Portfolio Projects** (guided capstone analytics projects — weather dashboard, spreadsheet cleaner, data generator, etc.). Build step-by-step deep-explanation pedagogy; exportable artifacts for GitHub/portfolio.
- **Q4 2026 (Feb 1, 2027)** — **Memory & Comprehension Tune-Up Module** (reading comprehension + retention techniques for data pros; memory palace methods applied to each lesson). Premium gate: clickable "boost this lesson" button on every lesson — premium users get the feature, free users get signup offer.
- **Q1 2027 (May 1, 2027)** — TBD (candidates: AI Coach, industry tracks, certificates, career-path simulator, etc. — Mike to decide)
- **Ongoing** — Each release gets a marketing push (email, social, changelog). The recurring schedule itself becomes a retention hook ("new premium feature every 3 months").

**Strategy rationale:** Front-load the free tier with full course content (lessons, exams, basic drills). Paid tier = portfolio-building + job-getting value (projects, feedback, interviews, certificates, career coaching). Quarterly releases give enough time to polish each feature AND give marketing a predictable cadence to re-engage free users.

**Premium feature candidates (locked and upcoming):**
- Portfolio Projects (Q3 2026, Nov 1) ✓
- Memory & Comprehension Tune-Up (Q4 2026, Feb 1) ✓
- AI Coach (Q1 2027 candidate — inline tutoring + interview prep)
- Industry-specific tracks (healthcare, finance, etc.) — Q1 2027 candidate
- Career-path simulator / job-search playbook — Q1 2027 candidate
- Mock interview library + video feedback — post-Q1 candidate
- Shareable certificate / credential system — post-Q1 candidate
- Resume review + optimization guide — post-Q1 candidate
- LinkedIn profile coaching — post-Q1 candidate
- Advanced drills (harder difficulty tiers on existing lessons) — post-Q1 candidate

**Game ecosystem (cross-kit, with easter eggs):**
- **Keygarden** (existing): calm typing trainer for analysts (web + mobile code-typing version). LIVE at michaelnocito.github.io/keygarden/
- **Sprint series** (all skill kits): Excel Sprint + SQL Analyst Sprint currently live at michaelnocito.github.io/prep-companion-apps/; **rollout in progress** to Python, Power BI, Tableau, Stats (one kit per cycle).
- **SQL Quest** (existing): sql.js tower-defense game, waves 1-3 live at michaelnocito.github.io/sql-quest/; **rollout to other kits planned** (Excel Quest, Python Quest, etc. adapted per tool).
- **Mystery game** (in progress): Nexus SQL Mystery (Jekyll narrative); **finish this, then adapt across other kits** (Excel Mystery, Python Mystery, etc.).
- **Nordic action RPG** (existing archived): Rune Wanderer (Godot 4.6 action-RPG, private repo); inspiration/story thread for easter eggs.
- **Future space narrative** (Bullet-Time Test): Set in future; small visual/story callouts weave into Analyst Sprint SQL (Sabrina SQL Sprint) and other games as easter eggs (e.g., "this memory palace technique is used by space analysts in the future").
- **Easter egg strategy:** each game/kit gets subtle nods to the overarching narrative (calm, mind-expanding journey through data). Links are cosmetic (a symbol, a skill name reference, an omen); they don't gate progress but reward attention (discovery, replay value).

---

## The workflow (one-man team, lightweight)

This is the loop. Keep it tight. **One item in flight at a time.**

1. **Mike says "what's next" or "ready"** — Claude picks the single
   highest-priority unshipped item (Blocker > High > Medium > Low),
   OR the next untested shipped item if a cycle just landed.
2. **Claude gives 3 specific things to check** for that one item.
   Format: short, actionable, observable on the live site. No more,
   no less — three.
3. **Mike tests just that one item** against those three checks.
4. **Mike reports back** — pass, partial, or fail (with notes).
5. **If pass:** move to the next item, repeat from step 1.
   **If partial / fail:** the issue becomes its own roadmap item,
   triaged into a bucket, and worked before continuing.
6. **Triage of new feedback** still goes through the standard
   bucket process (with Eastern Time timestamp) — but new feedback
   waits its turn unless it's a Blocker.
7. **Tag a new version when items ship.** PATCH for bug-only work,
   MINOR for visible features. Items move from ROADMAP to CHANGELOG.

### Cycle scoping rule
Each cycle ships **one** roadmap item by default. Bundling two items
into a single ship is only OK when they share the same data layer or
component and splitting them would force the same code to be touched
twice. (Lesson learned from v1.1.0 — shipped two items together;
should have split them so testing was one-at-a-time from the start.)

### "GR" — General Feedback
When Mike spots something during a test round that isn't directly
about the active test target, he tags it `GR:` (General Remarks).
GR items are NOT folded into the active test result — they get
triaged into the buckets as their own items (with the Eastern Time
timestamp from when they were reported) and wait their turn. The
active test continues uninterrupted.

### Testing-checklist format
Every testing target is presented as a 3-row table, not a paragraph:

```
| # | Do this              | Expect to see                          |
|---|----------------------|----------------------------------------|
| 1 | <action, lead verb>  | <expected outcome, **bold** the key>   |
```

**"Do this" cell rules** (sharper after May 27, 7:42 PM ET feedback):
- Name the specific kit, lesson **number**, and lesson **title** —
  not the category. Bad: "Open the text-cleaning lesson." Good:
  "Open Excel Lesson 10 — 'Text Cleaning'."
- Name the section to scroll to ("Read It Aloud", "Quick Check").
- Lead with a verb (Open, Click, Complete, Toggle).

**"Expect to see" cell rules:**
- Show literal expected text in the order it should appear.
  Bad: "leads with the function name." Good: "Reads TRIM on top,
  then A2 underneath."
- **Bold** the exact strings the user is verifying.
- Never use "no regression" or "looks right" — those put the work
  on Mike. Spell out what "right" means.

**Three checks max.** Anything beyond three is a separate test cycle.

### Why this works for a solo team

- **One bucket at a time** prevents the half-done multi-front problem.
- **Definition of Done in the line item** removes ambiguity later —
  there's no "is this finished?" question because we wrote the answer
  up front.
- **Tag every cycle** so we always have a known-good fallback on the
  live site if a later cycle introduces regressions.
- **Test on the live URL, not localhost** — that's where users live;
  GitHub Pages caching surprises stay caught.

---

## Definition of "Done" (universal, applies to every item)

A roadmap item is done when:
1. The change is committed and pushed.
2. The fix is verified on the live GitHub Pages URL (not just locally).
3. Manually checked in **both dark and light mode**.
4. Manually checked that **no previously-tested feature regressed**.
5. The roadmap entry is moved to the CHANGELOG with a one-line note.

---

## Priority buckets

### 🔴 Blocker
_Definition: stops a user from completing a core flow. Site doesn't
load, kit won't open, a lesson crashes the page, hub is broken._
_Response time: same day. Drop everything._

(empty)

### 🟠 High
_Definition: visible bug or UX miss that hurts trust or learning, OR
a feature that directly serves a Vision Principle and has clear ROI._
_Response time: current cycle. Clear before accepting new feedback._

- **Guided knowledge path (Duolingo-style) — thread the orphaned features into the lesson flow** _(added July 16, 2026 — 5:17 PM ET; from SQL-kit playtest inbox note, July 16)_
  - _What:_ A single guided path that walks the learner step-to-step through everything, instead of the current core-lesson spine with cards, Parsons problems, and labs "hanging out by themselves" waiting for a click. The path should route the learner through the extra modes at the right moments so they actually get used to drive the material home.
  - _Why it's here:_ Mike's direct playtest note on the SQL kit — the side features are important for retention but effectively invisible unless the user goes hunting. Also aligns with the spaced-retrieval gap in the learning-science gap analysis and the GR-A cross-kit-flow thread.
  - _Definition of Done:_ From any lesson, the "next" action is unambiguous and the path visits cards/Parsons/labs at researched, pedagogically sensible points; the extra modes stop being optional dead-ends.
  - _Est. effort:_ Large (rollout across all lesson kits, one kit per chat)
  - _DECIDED (July 16, 2026, research pass done):_ **Soft-guide** (path is the default Continue action, map stays clickable, every step keeps Skip; NO hard gates), **review nodes do NOT block forward progress** in v1. Architecture = promote each kit's existing guided drill flow (`LESSON_DRILLS`/`startGuided`) into THE path: lesson → retrieval cards → Parsons/fills/bugs → lab task → next lesson, with a short mixed review node at each unit boundary pulling from 2-3 units back (~6 items, Khan-style). Passed quick-check may skip scaffolded rungs (expertise reversal). Science + product research: worked-example fading (Renkl 2002), testing effect (Roediger & Karpicke 2006), interleaving (Rohrer & Taylor 2007), spacing (Cepeda 2006), Parsons efficiency (Ericson 2017); Duolingo 2022 single-path + Khan mixed-mastery patterns. **ALL-KIT correction, one kit per chat, starting with EXCEL**, then port kit-by-kit. Each kit's chat must ALSO verify that kit is on the Zinc & Sky color scheme before shipping (SQL is the reference).
  - _Rollout status:_ ✅ **Excel shipped v1.142.0 (July 16, 2026)** — pattern to copy: `LESSON_CARDS` map + `guidedSeqFor()` + `startUnitReview()` + "Continue path →" CTAs + `S.unitReviewsDone`, see excel/index.html around `LESSON_DRILLS`. ✅ **SQL shipped v1.143.0 + v1.144.0 (July 16, 2026)** — same pattern plus lab hand-off steps (`LESSON_LABS`: lesson 4 → JOIN Lab, lesson 5 → Aggregation Lab); all 38 cards mapped once across `LESSON_CARDS`. **v1.144.0 pattern requirement (Mike's call): STABLE FRAME** — the guided path renders one persistent layout (header + progress dots + step body + uniform bottom Back/Next bar) and only the step body swaps; NO per-step standalone pages, NO per-drill inline advance buttons in guided mode (drill renderers return body-only markup under guided). SQL's `renderGuidedStep()` is the reference. ✅ **Python shipped v1.145.0 (July 16, 2026)** — all 33 cards mapped once, unit reviews, stable frame extended for review mode; terminal hand-off steps kept as the lab equivalent. ✅ **Power BI shipped v1.146.0 (July 16, 2026)** — all 28 cards mapped once, unit reviews, stable frame (drill renderers split into body-only `fillBody`/`bugBody`/`parsonsBody` + standalone wrappers); hand-off steps = Know Your Workspace (lesson 1) + DAX Lab (lesson 6), with `guidedHandoff()`/`guidedResume()` holding the learner's place because Power BI's `navigate()` clears `guided`. ✅ **Tableau shipped v1.147.0 (July 16, 2026)** — all 30 cards mapped once, unit reviews, stable frame (its five drill renderers already returned body-only markup, so no split was needed and the standalone drill pages were untouched); hand-off = Know Your Workspace (lesson 1) via `guidedHandoff()`/`guidedResume()`, needed for a resume affordance rather than state loss since Tableau's `show()` leaves `guided` intact. Both complete surfaces (legacy card + v2 Done stage) now route through `gotoNextLesson()` — the v2 stage previously jumped to the first unfinished lesson and skipped unit reviews. Unit 0's review is cards-only by design (its concept lessons carry no drills). Remaining, one kit per chat: **Stats next** (sections-based lesson render — check whether its guided plumbing exists), then evaluate Chart-Literacy/Forecasting (may lack drill arrays entirely).

- **🔒 PAYWALL: server-side entitlement enforcement (harden the freemium gate) — DUE BEFORE AUG 1, 2026 LAUNCH** _(added July 15, 2026 — TOP PRIORITY this cycle)_
  - _Why now:_ The current gate (`assets/apk-pass.js` + the `PREP-PASS-2026` code → `localStorage['apk-pass']`) is **client-side only** and trivially bypassable (view-source reveals every premium lesson; anyone can set the flag in devtools). Fine as a launch stopgap, NOT fine to charge $11.11/mo against. Revisit + decide the enforcement level before flipping `MODE='live'`.
  - _Root fix (the real one):_ move the entitlement CHECK server-side. Premium lesson content stops shipping inside the static HTML; instead a **Supabase Edge Function** verifies the logged-in user's `user_entitlements` row (`hasInterviewPass()`) and returns the gated content only to entitled users. Reuses the LIVE Supabase backend (auth Google+email, `user_progress`/`user_entitlements`, `SUPABASE_INTEGRATION.md`) — same proxy pattern the AI Coach research already scoped. Site stays vanilla/static on GitHub Pages.
  - _Hosting note:_ if the Edge Function path needs a friendlier home (custom domain, native edge functions), Cloudflare Pages / Netlify is the move — still free, and it also sidesteps GitHub Pages' "no primarily-commercial sites" ToS wrinkle ([[project_monetization_strategy]]). Not required for v1 (Supabase Edge Functions work from a GH-Pages front-end via fetch).
  - _Scope decision to make with Mike (before build):_ (a) keep client-side gate through Aug 1 and ship server-side enforcement as a fast-follow, OR (b) block launch on it. Mike's call July 15: **revisit before Aug 1** — this item is the reminder + scoping home.
  - _DoD:_ A non-purchaser cannot reach premium lesson CONTENT via view-source or devtools (content isn't in the payload); a purchaser (verified entitlement) gets it seamlessly across devices via their account. Verified live, both states.
  - _Est:_ Medium (backend exists; the lift is content-splitting + the Edge Function + wiring the fetch into each kit's lesson render).
  - _Related:_ [[project_freemium_ecosystem]], `SUPABASE_INTEGRATION.md`, the "premium-unlocked badges" Medium item (post-purchase UX pairs with this).

_(GR-F-1, GR-F-2, GR-F-3 shipped May 28, 2026 — see CHANGELOG v1.4.1)_

_(GR-H shipped June 12, 2026 (v1.54.1) — root cause was the top-anchored toast in Tableau/Excel/Python hiding via translateY(-80px) with no fade, leaving its bottom half over the sticky nav; now fades + fully clears. Other kits were never affected (they hide with opacity:0). Same release: Chart.js now `defer` in Tableau/Stats — was render-blocking and caused the intermittent page-load delay Mike reported.)_

#### ⬇️ June 29, 2026 feedback batch (Mike's mobile playtest + voice memos) — triaged below across High / Medium + folded into the Learning-Science item

- **MOBILE: submit/answer button placement in drills (portrait + keyboard up)** _(added June 29, 2026 — 12:13 PM ET)_ — _mobile UX, research-informed_
  - _STATUS (July 5, 2026):_ ✅✅ **DONE — all 6 kits.** Excel pilot (v1.98.0) + rollout to SQL/Python/Power BI/Tableau/Stats (v1.99.0). Finding: drills are all tap-based now (no free-text/keyboard), so the fix = full-width, thumb-height primary CTAs on mobile (the item's own "full-width bottom CTA" option). v2 lesson flow covered in every kit. Minor follow-up left: the older standalone practice-drill Check buttons still use a plain mid-card `.btn`. Awaiting Mike's phone verification, then this block moves to CHANGELOG.
  - _What:_ On a phone in portrait, after typing an answer with the keyboard up, the submit/"check" button sits in an awkward spot — the learner has to hunt for it. Research how leading learning apps (Duolingo, Mimo, Sololearn, Brilliant) position the submit/continue button for low-friction "type → submit" on mobile (sticky-above-keyboard bar, full-width bottom CTA, etc.) and adopt the pattern.
  - _Why High:_ Mike hit this as the target user; drills are the core loop and this is friction on the most common device. Pre-launch.
  - _Scope:_ Audit the drill/answer submit affordance on mobile across all kits; implement a consistent low-friction pattern (likely a sticky action bar that rides above the keyboard). Excel first, then roll.
  - _DoD:_ On an iPhone in portrait with the keyboard open, the submit/check action is visible and reachable without scrolling, on every drill type, all kits. Verified live, dark + light.
  - _Est:_ Medium.

- **MOBILE: text overflow / cut-off sweep (MC answers + Excel lessons)** _(added June 29, 2026 — 12:13 PM ET)_ — _responsive bug, screenshot-confirmed_
  - _STATUS (July 5, 2026):_ ✅ **DONE — all 6 kits (v1.99.1).** Excel already had the wrap fixes (v1.78.0); added `overflow-wrap`/`word-break` to the other 5 kits' `.quiz-opt`, `.v2-pars-chip` (switched `white-space:pre`→`pre-wrap` where needed), `.v2-compare-code`, `.code-block`. Code blocks already scrolling (`.ral-sql`/`.ral-code`) left as-is. Minor leftover: standalone practice drag pieces (`.pars-piece`). Awaiting Mike's phone check, then this block moves to CHANGELOG.
  - _What:_ Two symptoms, one root cause (mobile width handling): (a) in the Excel "Nested IF and IFS" tap-the-formula drill the long formula options don't wrap and run off the card's right edge (`…,"High")` clipped — confirmed in Mike's screenshot); (b) text is cut off on phone view in Excel lessons. Sweep ALL lessons + ALL drill choice rendering for horizontal overflow.
  - _Why High:_ Clipped answers/text = unreadable = broken on mobile. Trust + learning hit. Pre-launch.
  - _Scope:_ Fix choice-button / code-string rendering to wrap or scroll within the card on narrow viewports (word-break / overflow-wrap / horizontal scroll for code); audit every kit's lesson body + drill choices. Long formula/query strings are the usual offender.
  - _DoD:_ On a 390px-wide viewport, no lesson text or drill choice is clipped or overflows its container in any kit; long formulas wrap or scroll cleanly. Verified live, dark + light.
  - _Est:_ Medium.

- **BUG: jumbled / overlapping title text on some kits** _(added June 29, 2026 — 12:13 PM ET)_ — _visible rendering bug_
  - _STATUS (July 5, 2026):_ ✅ **DIAGNOSED + FIXED — all kits (v1.99.2), pending Mike's confirm.** Root cause: SQL/Python/PBI/Tableau/Stats had `nav{flex-wrap:wrap}` + fixed `height:56px`, so on mobile the tab bar wrapped to a 2nd row that overflowed the fixed-height nav onto the page `<h1>`. Excel already forced `nav{flex-wrap:nowrap;overflow-x:auto}` (single scrollable row) — applied that same known-good rule to the other 5. If Mike's "jumble" was a *different* screen, reopen with the specific kit/screen.
  - _What:_ Some kits have screens where the title text jumbles/overlaps. Mike's read: a title-rendering fix was applied to some kits but not all. Find the kits still showing it and apply the same fix everywhere.
  - _Why High:_ Visible breakage on a header = immediate trust hit.
  - _Scope:_ Identify which screens/kits jumble the title (likely the Space Grotesk heading + Lucide brand-mark interaction, or a long title wrapping under the nav); apply the known-good fix across all kits.
  - _DoD:_ No kit shows overlapping/jumbled title text on any screen, mobile + desktop. Verified live.
  - _Est:_ Small-Medium.

- **CORRECTNESS: convert fragile fill-in-the-blank to multiple-choice (audit all kits)** _(added June 29, 2026 — 12:13 PM ET)_ — _grading-trust bug_
  - _STATUS (July 5, 2026):_ ✅ **DONE — all kits (v1.100.0).** Audited every `<input>`; the only free-text DRILLS left were SQL Fill (16), Python Fill (14) + ESQL (14), Power BI Fill (12), Stats Fill (12). All converted to tap-the-choice with hand-authored 4-option distractors (correct = `choices[0]`, `_shuf` at render), matching Excel's `.bug-choice` model. Excel was already done (v1.78.0). Tableau had no free-text drills (its inputs are the Viz-Builder calc-field + searches). Progress keys unchanged. Dead CSS (`.fill-input` etc.) left as a cleanup candidate.
  - _What:_ A fill-in-the-blank exercise expects a typed answer, but free text means a learner can type a correct variation we don't recognize and get marked wrong. Mike's call: where the answer space is open-ended (formula fragments, etc.), use multiple-choice instead of free-text fill-in-the-blank. Check ALL fill-in-the-blank / type-the-answer situations across every kit and convert the ungradable ones to tap-the-choice.
  - _Why High:_ Marking a right answer wrong destroys trust faster than almost anything. (Note: v1.21–22 already removed free-text from Bug Hunt + Describe drills — this is a sweep for any remaining type-the-answer spots: guided steps / exam / Parsons gaps.)
  - _Scope:_ Inventory every free-text answer input across all kits; for each, decide MC vs keep; convert the fragile ones. Keep tap-the-choice's "correct = index 0" pattern.
  - _DoD:_ No exercise can mark a legitimately-correct answer wrong due to unmatched text variations; remaining free-text inputs are only where exact-match is truly safe. Verified live.
  - _Est:_ Medium.

- **BUG: skill-readiness score doesn't reflect the new lessons** _(added June 29, 2026 — 12:13 PM ET)_ — _progress-accuracy bug (Vision #1)_
  - _STATUS (July 5, 2026):_ ✅ **DONE (v1.100.1).** Root cause: SQL/Python/Power BI built the skill meter from hardcoded id lists (`[1,2,3,4]`…) = only the original 12 lessons; Unit 0 + the 4 track units were uncounted. Rewrote all three to derive from live `DATA.LESSONS` by unit (Excel's model; "Interview Tracks" bucket = Units 4–7). Completion = the Done-stage `doneLessons` flag (matches the #6 decision). Excel/Tableau already live; Stats has no breakdown. Stale "all 12 lessons" copy also fixed.
  - _What:_ The skill-readiness score/meter looks like it isn't counting the lessons added recently (the 4 interview tracks pushed kits to SQL 46 / Excel 51 / Python 42 / Power BI 39). The denominator/progress math is stale.
  - _Why High:_ Vision #1 = "see your progress at a glance." A score that ignores new lessons is wrong and misleads the learner.
  - _Scope:_ Find where readiness is computed (per-kit lesson counts / completion ratio); make it derive from the live lesson set so new lessons are included. Check every kit.
  - _DoD:_ Readiness reflects all current lessons; completing a new track lesson moves the score; numbers match actual lesson counts. Verified live. (Coordinate with the "Check button completion model" decision below — same data.)
  - _Est:_ Small-Medium.

- **UX/DECISION: practice "Check" button lets you skip a lesson without completing it** _(added June 29, 2026 — 12:13 PM ET)_ — _completion-tracking model_
  - _✅ RESOLVED (Mike decision, July 5, 2026):_ **A lesson counts as complete when the learner reaches the v2 "Done"/Close stage** (which already requires going through Try → Build → Quick Check). The standalone **practice drills stay OPTIONAL** and do NOT gate completion (Vision #3). **No code change was needed** — every v2 kit already sets its `doneLessons`/`S.done['lesson'+id]` flag exactly at the Done stage (verified while doing #5), and the practice "Check" buttons never touched lesson completion. So the current behavior already matches the decision; #5's readiness math is built on this same flag. Item closed.
  - _What:_ Many practice problems show a "Check" button (not "Submit"/"Complete"), and you can jump to the next lesson without ever completing the current one. Mike's open question: keep it or require completion? Decide the model — e.g. "Check" stays for low-stakes self-test, but a lesson only marks complete when its drills are done (feeds the readiness score + Vision #2 "what's next").
  - _Why High:_ Touches completion tracking, the readiness score (item above), and Vision #2. Decide before building the readiness fix so they stay consistent.
  - _Scope:_ Decision first (Mike), then align button labels + completion logic across kits.
  - _DoD:_ Defined completion model; buttons + progress reflect it consistently. Verified live.
  - _Est:_ Small (decision) + Medium (rollout).

- **LEARNING SCIENCE: Restructure Excel kit for spaced retrieval + retrieval practice + hint escalation** _(added June 28, 2026 — 3:45 PM ET)_ — _Phase 1 (High), Excel pilot before rollout_
  - _STATUS (July 6, 2026):_ 🏁 **FULLY BUILT — all 6 kits.** Excel Phases A–F (v1.78.0–v1.83.0), then the D+E layer ported in one sprint: SQL v1.104.0 · Python v1.105.0 · Power BI v1.106.0 · Tableau v1.107.0 · Stats v1.108.0. Every kit: 7-stage retrieval-first flow + spaced recall (+1/+3/+7, hand-authored cues) + bridge + honesty note + wins counter + greeting. 115 headless checks green. **Remaining: Mike's playtest (batches 27–31), then this block moves to CHANGELOG.**
  - _What:_ Restructure the Excel kit to implement the three highest-ROI gaps identified in the SQL Quest learning-science review: **(1) Spaced-retrieval prompts** (reactivate earlier concepts at ~1/3/7 lesson intervals, e.g., "Recall: Text functions from Lesson 5 — use TRIM with a dropdown?"); **(2) Retrieval-first flow** (flip Read-Aloud: show the story + goal, learner solves/thinks, then show the breakdown as post-attempt explanation); **(3) Progressive hint escalation** (Miss 1 = thinking-nudge, Miss 2 = partial syntax, Miss 3 = full solution + "I give up" button, reusing SQL Quest's reveal pattern).
  - _Why High:_ Direct implementation of Mike's learning-science thesis ("spacing and retrieval are where learning happens"). SQL Quest proves these principles work; Excel is the proof-of-concept before rolling to SQL, Python, Tableau, Stats, Power BI. High ROI: retention + recall > content volume.
  - _Scope (Excel kit only):_
    1. **Spaced-retrieval prompts** — add a `reinforces:[]` field per lesson (lesson IDs that this lesson reactivates). Inject a yellow recall card at lesson N for concepts from earlier lessons, ~1/3/7 intervals (e.g., lesson 10 recalls lesson 5). No new UI — reuse the existing card pattern.
    2. **Read-Aloud reorder** — current: "Everyday words → Code → See it → Quick Check." New: "Everyday words goal (no code) → See it → Quick Check (code shown AFTER attempt, not before)." This flips recognition to retrieval; learners must think/click first.
    3. **Hint escalation on drills** — all tap-the-choice drills get a 3-tier hint system: Miss 1 displays a thinking-nudge ("You need a clause that filters after grouping"); Miss 2 displays partial syntax ("HAVING _____ > 1"); Miss 3 displays full solution + an "I give up" button that auto-fills (learner still executes). Reuse SQL Quest's `revealFrac` logic adapted for tap-the-choice (not free-text).
  - _Testing gates (what Mike verifies):_
    1. Open Excel Lesson 5 — read the lesson intro and Click "See it on screen" without the code solution being visible upfront.
    2. Complete Excel Lesson 10 — "Text Cleaning" and scroll down; a yellow card appears asking to Recall TRIM from Lesson 5 (verify it's specific, not generic).
    3. Fail a tap-the-choice drill intentionally three times on a lesson; verify: Miss 1 shows a nudge, Miss 2 shows partial code, Miss 3 shows full solution + "I give up" button.
  - _Definition of Done (Excel kit locked):_ All 12 lessons reordered with spaced-retrieval data + Read-Aloud flipped + all drills have hint escalation. Verified on live URL, dark + light mode, no regressions on nav/home/progress.
  - _Handoff sequence:_ (1) Claude designs + codes Excel restructure; (2) Mike tests the three gates above; (3) If pass: spin off Phase 2 items (SQL, Python, etc. as separate roadmap entries); (4) If partial/fail: fix and re-test before rollout.
  - _Est. effort:_ Large (multi-system refactor: lesson data, drill rendering, hint logic). 60–80 hours for Excel pilot.
  - _Reference:_ Gap analysis + roadmap = `/sql-quest-learning-science-review.md` (session June 28, 2026). Gaps: Spaced retrieval (1/5), Retrieval practice (2/5), Help escalation (1/5) — these are the movers.
  - **➕ June 29, 2026 expansion (12:13 PM ET) — design these WITH the three gaps above (new feedback from Mike's mobile playtest + voice memos; research-gated, Excel pilot still first). This is the "restructure to meet the gaps AND the new feedback" pass:**
    1. **Two reading modes — "Focus" + "Detailed":** add a trimmed **Focus / Targeted mode** (bare high-signal essentials + the question, low cognitive load), with a "More info" button that expands to the full content; rename the current view **Detailed mode**. (Mike had a version once — Bare Basics, removed v1.58 — this is a cleaner, research-grounded redo; confirm it doesn't resurrect what he disliked.) **⏸️ DEFERRED to the END of this effort (Mike, June 29, 2026 — 12:37 PM ET): do the lesson-material research + the Detailed-mode restructure (#2) FIRST.** Rationale: once the content is researched and restructured (condensed, re-titled, logically ordered), the "focus down" version likely falls out of that work naturally — or gets added as the final step. Don't design Focus mode up front; build it last (or fold it into the restructure changes when they land).
    2. **Restructure Detailed mode for logical progression:** content feels piecemeal — condense, re-title headings, order it for productive reading + retention (check vs learning science).
    3. **Reward / unlock framework:** present deeper info about each function/concept as something you *unlock* (Codecademy/Mimo feel) — a short "mini story" per function instead of an outline info-dump; unlocking = a motivating reward.
    4. **Elevate practice → "practice-unlocks-knowledge":** actually writing the formula/query (today's quiet "Practice this") deserves a bigger role. Sequence practice modes — basic question → Parsons (put-in-order) → fill-the-blank/MC — so each unlocks a different piece of the concept. Research the loop's viability + fun first.
    5. **Parsons problems — research + expand:** Mike finds them especially effective; research the evidence base and make them a more prominent, more detailed part of the kit (feeds the practice ladder in #4).
    6. **Progressive formula-building across concepts (spiral):** the same formula grows across lessons (basic SUM → gains an IF → grows further) so each new concept reuses prior content — a built-in spacing/interleaving mechanic; pairs with the spaced-retrieval thread.
    7. **Attempt-vs-correct comparison:** free side-by-side attempt/correct display (Medium item) + premium AI gap-analysis (AI Coach mode 3) — the corrective-feedback half of retrieval.
    - _Note:_ #4–#7 overlap the original three gaps (retrieval-first, spacing, hint escalation). Treat the whole thing as ONE lesson-structure redesign to scope together, research-first, Excel pilot first. Several pieces need a Mike decision before build (Focus-mode go-ahead; how "unlock as reward" squares with the calm/no-gimmick vision).
  - **📋 MASTER PLAN WRITTEN (June 29, 2026 — 12:48 PM ET): `EXCEL_POLISH_MASTER_PLAN.md`** (repo root) — the authoritative build spec for this whole effort. Backed by 4 research/audit passes (full `excel/index.html` code audit + 3 cited learning-science briefs). New lesson flow = **Orient → Worked Example → Try → Compare → Build → Own → Close** (generation-first, not recognition-first); progressive formula spine; +1/+3/+7 position-based spaced recall (no SRS engine); instructive-only visuals (show the chart when a chart is discussed); SDT-guarded motivation layer (honest unlock = more _knowledge_, light mentor voice, progress-only — NO hearts/loss); Focus/Detailed split built LAST. Build phases A–H: **A** foundation fixes (readiness score, mobile overflow + sticky submit, free-text Fill→MC, chart visuals, stale copy) → **B** exemplar on the SUM→IF→nested spine (KEYSTONE — Mike tests the feel + signs off before rollout) → **C** roll pattern + content/wording scrub + on-the-job gating → **D** spacing + spine + honesty messaging → **E** motivation layer → **F** Focus/Detailed toggle → **G** AI Coach (premium, modes 1+3 into Build/Compare surfaces; decision-gated) → **H** port to SQL/Python/PowerBI/Tableau/Stats. 5 open decisions for Mike listed in the plan (exemplar-first; on-the-job gating; inline-SVG charts; Parsons/completion/MC attempt input; AI-Coach timing) — all with recommendations.

- **GR-G (EPIC): "Guided Path" — merge Learn + Practice into one linear flow, simplify home, tone down Bare Basics, Excel makeover** _(added June 1, 2026 — 12:40 AM ET — TOP PRIORITY per Mike; prototype on Excel first)_
  - _STATUS (June 2, 2026):_ Thread 1 (merged guided flow) **SHIPPED on all 6 lesson kits** (v1.10–v1.13). Thread 3 (tone down Bare Basics) effectively done — kits already show a quiet one-line "Turn on Bare Basics" link, not a full-width banner. **Remaining: Thread 2 (simplified home — drop the 3-tile grid, lead with one Start-learning entry) and Thread 4 (Excel layout makeover).** Both are visible redesigns — get Mike's design direction before executing.
  - _What:_ Collapse the currently-segmented Lessons / Practice / Cards into a single guided route. One prominent "Start learning" entry walks the user straight through: lesson content → Quick Check → **that lesson's practice drills** (fill-in-the-blank, Bug Hunt, put-in-order, relevant cards/lab) → next lesson. After the Quick Check the CTA becomes "Practice this," NOT "Next lesson" — reinforce the lesson's content immediately, no skip-ahead within the flow. Four threads:
    1. **Merged guided flow** (core) — lesson → check → that lesson's drills → next.
    2. **Simplified home** — keep the live interactive surface prominent (Excel = Pivot Lab; SQL = query terminal), drop the 3-tile Learn/Practice/Cards grid, lead with one "Click here to learn — straight path through all content."
    3. **Tone down Bare Basics** — keep the toggle, minimize its callout/visibility (currently a full-width banner). NOTE: partially reverses v1.4.0 amber-prominence work (untested) — v1.4.0 likely superseded.
    4. **Excel visual makeover** — bring Excel's layout in line with the newer kits (Mike: "still looks old and weird").
  - _Why it's here:_ Vision #2 (always know what to do next — one straight path) + the retrieval/practice learning-science principle the kit already honors (drill the lesson immediately after learning it). Mike's direct direction.
  - _Scope:_ Prototype on **Excel first**. Once Mike approves the feel, **roll the pattern to all other kits** (SQL, Python, Tableau, Stats, Power BI, Interview). ⏰ _Mike asked to be reminded after today to schedule the rollout._
  - _Definition of Done (Excel prototype — locked June 1, 2026):_ Scope = **whole Excel kit (all 12 lessons) in one pass**. Model = **guided-primary, browse stays** (straight path is the hero/default; no skip past a lesson's drills to the next lesson; Lessons/Practice list still reachable for free exploration per Vision #3). (1) Home leads with one prominent "Start/Continue learning" entry + Pivot Lab kept prominent; 3-tile Learn/Practice/Cards grid removed. (2) Guided flow: each lesson runs content → Quick Check → that lesson's drills (fill-in-blank / Bug Hunt / put-in-order / relevant cards) → next lesson; post-Quick-Check CTA reads "Practice this," not "Next lesson." (3) Bare Basics: toggle survives but full-width banner removed, callout minimized to a quiet link. (4) Excel layout reskinned to match the newer kits. Verified on live URL, dark + light. Then roll pattern to other kits (separate cycles).
  - _Est. effort:_ Large (multi-cycle epic; Excel prototype is cycle 1).

_(GR-E shipped June 2, 2026 — Bug Hunt "Check My Fix" input on SQL + Power BI — see CHANGELOG v1.17.0)_

_(GR-C shipped June 2, 2026 — Final Exam per-section submit + partial cumulative grade — see CHANGELOG v1.17.0. Note: the "per-kit mini exam" Medium item could now reuse this per-section logic.)_

_(Bare Basics highlight visual unambiguity shipped May 28, 2026 — see CHANGELOG v1.4.0)_

_(RAL Excel reading-order shipped May 27, 2026 — see CHANGELOG v1.2.1)_

_(GR-1 shipped May 27, 2026 — see CHANGELOG v1.2.3)_

_(GR-2 shipped May 27, 2026 — see CHANGELOG v1.2.0)_

### 🟡 Medium
_Definition: polish, batched improvements, OR features with good
engagement ROI that don't bloat the core experience. Batched into
planned cycles._
_Response time: next planned cycle._

#### ⬇️ June 29, 2026 feedback batch (continued — Medium-bucket items)

- **CONTENT: real chart/pivot visuals in chart-based exercises (audit all kits)** _(added June 29, 2026 — 12:13 PM ET)_ — _learning-quality content sweep; Excel first_
  - _STATUS (July 6, 2026):_ ✅ **Track-lesson slice COMPLETE** (the roadmap's reconciliation case): zero-dep inline-SVG generators (line · bar/diverging · Pareto combo · box plot) + 7 chart-centric track lessons each in SQL (v1.109.0), Python + Power BI (v1.110.0); Excel had its Phase-A charts; Tableau/Stats draw Chart.js natively. **Remaining scope = the broad ALL-exercise chart/pivot audit** (every exercise that merely mentions a chart/pivot) — still Large/phased; the generators are now built and reusable, so each future slice is mostly content-spec authoring. Test batches 32–33.
  - _What:_ When an exercise references a chart or pivot table (e.g. the Excel "what's wrong with this?" question), show an actual rendered visual, not just a description — so learners get used to reading charts/pivots. Go through ALL exercises across all kits and add the visual wherever a chart/pivot is mentioned, within the calm design principles.
  - _Why Medium:_ Real learning-quality lift, but a broad multi-file content audit (big-overhaul flavor) → phase it. ⚠️ Tension with the Phase-3 decision to render track-lesson charts as DATA TABLES (where kits can't draw them); this item is the counter-pressure to bring real visuals where they matter most (exercises). Reconcile: real inline-SVG/Chart.js visuals for chart-centric exercises; tables stay only where a visual adds nothing.
  - _Scope:_ Inventory every chart/pivot-referencing exercise; Excel first (the "what's wrong" charts + Pivot Lab), then SQL/Python/Tableau/Stats/Power BI. Reuse existing chart renderers where present.
  - _DoD:_ Every exercise that mentions a chart/pivot shows a matching visual; no chart-based question is text-only. Verified live, dark + light.
  - _Est:_ Large (phased).

- **CONTENT: "On the job" blurbs only on applicable (role/track) lessons** — ✅ **DONE (v1.101.1, July 5, 2026 — Medium #2).** Already satisfied by the v2 migration: the block only existed in Excel, gated `flow!=='v2'`, and all lessons are v2 → it rendered nowhere. Removed the dead render line; kept the 24 `onthejob` blurbs as dormant data (Mike's call). _(added June 29, 2026 — 12:13 PM ET)_ — _noise reduction_
  - _What:_ Show the "on the job" / role blurbs only when the lesson belongs to an applicable track (Analyst, Finance, etc.), not on general lessons where they're just noise. Gate the blurb on lesson applicability.
  - _Why Medium:_ Serves the calm / low-noise vision; small and targeted.
  - _Scope:_ Add an applicability check (track membership / a flag) so the on-the-job block only renders where relevant; audit lessons.
  - _DoD:_ General lessons no longer show non-applicable on-the-job blurbs; track lessons still do. Verified live.
  - _Est:_ Small.

- **HUB: list the analyst skill-based games on the Analyst Prep Kit page** — ✅ **DONE (v1.101.0, July 5, 2026 — Medium #1).** Added a "Practice arcade" section below the kits linking all six live analyst games (SQL Quest · Analyst Sprint Excel/SQL · Spreadsheet + Tableau Archaeology · SQL Dry Run); URLs verified 200; list + placement confirmed with Mike. _(added June 29, 2026 — 12:13 PM ET)_ — _discovery / cross-promo_
  - _What:_ The hub should list the applicable analyst skill-based games Mike built (e.g. SQL Quest, Excel/SQL Analyst Sprint, Spreadsheet Archaeology, Tableau Archaeology, …) so learners discover them.
  - _Why Medium:_ Retention + cross-promotion across the ecosystem; low effort, real engagement upside.
  - _Scope:_ Add a "Games / Practice arcade" section on the hub linking each game's live URL with a one-line hook; confirm the canonical list + URLs with Mike.
  - _DoD:_ Hub shows a games section with working links to each shipped analyst game. Verified live.
  - _Est:_ Small.

- **PREMIUM: clearly mark unlocked premium features after purchase** _(added June 29, 2026 — 12:13 PM ET)_ — _post-purchase UX (freemium)_
  - _What:_ After a user buys, visibly mark the now-unlocked premium features so it feels like "I unlocked something cool" — badges/highlights on the AI Coach, interview tracks, portfolio projects, etc., rather than them silently just working.
  - _Why Medium:_ Reinforces purchase value + reduces buyer's remorse; pairs with the freemium launch + entitlements (`user_entitlements`, `hasInterviewPass()`).
  - _Scope:_ Define an "unlocked" treatment (badge/glow/"Premium" pill + a one-time "You've unlocked…" moment) driven by entitlement state; apply to premium surfaces.
  - _DoD:_ A purchaser sees premium features clearly marked as unlocked; a free user sees them clearly as locked/preview. Verified live, both states.
  - _Est:_ Medium.

- **LEARNING: attempt-vs-correct comparison (free display)** — ✅ **DONE (v1.101.2, July 5, 2026 — Medium #3).** Already broad: v2 Compare stage shows an explicit "Your attempt | Correct answer" grid (Parsons) in all 6 kits; MC Quick Checks reveal pick + correct + explanation in Excel/Python/SQL/PBI/Stats. Closed the one gap — Tableau's Quick Check now reveals the correct option on a wrong pick too. _(added June 29, 2026 — 12:13 PM ET)_ — _retrieval/compare pedagogy; free tier_
  - _What:_ After a learner submits, show their attempt next to the correct answer so they can do the mental compare Mike finds effective (recall → see correction → compare). This is the free, non-AI display layer; the AI gap-analysis on top is the premium layer folded into the AI Coach item (mode 3, High).
  - _Why Medium:_ Directly serves the learning-science thesis (retrieval + corrective feedback). Cheap to show; high pedagogical value. Pairs with the Learning-Science restructure (design together).
  - _Scope:_ For drills that capture an attempt, render an attempt-vs-correct comparison panel post-submit.
  - _DoD:_ Post-attempt, the learner sees their answer and the correct answer side-by-side on the drill types that capture an attempt. Verified live.
  - _Est:_ Small-Medium.

- **MARKETING: remove "no login needed" copy** — ✅ **DONE (v1.101.3, July 5, 2026 — Medium #4).** Auth+sync + GA4 are live, so reframed README + chart-literacy/forecasting meta+footers to "free to start · optional sign-in to sync"; dropped false "No telemetry" chips from final/simulator footers + "No sign-up" from the hub arcade note. Hub hero was already correct. ✅ Follow-up done (v1.101.4): privacy.html + terms.html rewritten to be accurate about optional sign-in + Supabase sync (no-account use stays local; account stores email + synced progress/entitlements; added account-deletion + Supabase to providers).

- **STRATEGY (decision-gated): free-tier model — daily "hearts/energy" limit vs current open-free** _(added June 29, 2026 — 12:13 PM ET)_ — _monetization decision, not a build yet_
  - _What:_ Consider a Duolingo-style free model: free users get a limited number of "hearts"/attempts per day; deeper/unlimited use needs the paid Pass. Mike's open question — adopt it, and how does it square with the "free core is very complete" positioning + the one-time $15 Interview Pass?
  - _Why here:_ A real monetization lever but a structural change to the free/paid line (Vision #3 "free to explore" + the freemium economics). Decision needed before any build; risks souring the calm, generous free experience if done heavy-handed.
  - _Open decision for Mike:_ keep open-free (lessons free forever, paid = AI Coach / interview / projects) vs hearts-gated free vs hybrid (lessons open, but AI-coach/interview attempts metered).
  - **✅ RECOMMENDED RESOLUTION (recorded June 29, 2026 — 12:13 PM ET; awaiting Mike's final sign-off):** **Do NOT put hearts on the learning content; keep lessons + drills + games fully open-free, forever. Gate (and meter) ONLY the AI features, sold as a package/Pass.** If hearts were used, the advanced-content gate would be dropped (hearts replace the tier — don't do both); but hearts are the wrong fit here. Reasons: (1) hearts inject scarcity/urgency/lockout — the opposite of the calm, generous on-ramp the product is built on, and they land hardest on a stressed career-switcher who wants to study *more*; (2) they punish the wrong answer, which is exactly where the learning-science work says learning happens (recall → correction → compare); (3) lessons cost ~$0 to serve on GitHub Pages — there's nothing to ration, so hearts would be pure extraction-friction that kills the pre-launch funnel; (4) on a static site hearts are trivially bypassed (localStorage reset) without server enforcement. **A hearts/energy/credit cap is correct in exactly ONE place — on the AI features**, which have real per-use token cost + real "get-the-job" value (the AI Coach item already plans a per-user credit cap). **Net model to lock:** lessons/drills/games = open-free forever (no hearts, no content gate); AI Coach + mock interview + portfolio/certificate = the paid package with a usage cap *inside* it. This also closes STRATEGY gap #5 ("free is so complete paid feels optional") by making the paid line the unambiguous "get the job" value, not withheld lessons.
  - _DoD:_ Decision signed off by Mike + the free/paid line documented in GROWTH.md (lessons open-free; meter AI only). _Est:_ decision now, build TBD. Ties to the STRATEGY growth-plan item + `project_freemium_ecosystem` memory.

- **GR-D: Real-world non-tech analogies in every help/explanation** — ✅ **COMPLETE (v1.118.0, July 7, 2026).** Intros shipped v1.18.0; the remainder (quiz explanations + Gotcha/"Watch out" blocks, all 6 lesson kits) swept — ~730 strings reviewed, 92 rewritten to open with an analogy/concrete scenario. `say` lines exempt by the DoD (literal formula readings); "On the job" blocks dormant since v1.101.1; Interview/Sim/Final already scenario-based. _(added May 27, 2026 — 8:00 PM ET)_
  - _What:_ Every "intro" / "Think of it as" / "On the job" / "Watch out" / `say` / quiz-explanation / glossary block should anchor on a concrete real-world non-tech analogy, not just a clearer technical paraphrase. Example: instead of *"VLOOKUP pulls a value from another table by matching a key. Think of it as: find this ID in that list, then bring back the value from a specific column,"* something like *"VLOOKUP is like a phone book — you look up someone's name, and it brings back their phone number."*
  - _Why it's here:_ Direct serve of the product's pedagogy promise (plain language for beginners). High impact for the target audience. Mike asked for this across "all the help areas" — pattern applies across all kits.
  - _Approach:_ Slice by kit. Excel first (where Mike is testing). Each kit gets a content pass: rewrite intros and key explanations to lead with a real-world analogy. Keep the technical detail beneath, but the FIRST sentence in every helper block is the analogy.
  - _Definition of Done:_ Excel pass complete = every intro, every "on the job" sidebar, every quiz explanation, and every `say` line either contains a real-world analogy or is a literal pronunciation of a formula (which doesn't need one). Spot-check by reading any random help block — if the FIRST sentence doesn't include a non-tech comparison or concrete scenario, rewrite. After Excel ships, repeat for SQL, Python, Tableau, Stats, Power BI, Interview. Sim and Final Exam already use scenarios, so they need a lighter pass.
  - _Est. effort:_ Medium per kit-slice (≈1 cycle per kit, 7 kits to fully complete).

_(GR-A shipped June 2, 2026 — Bare Basics cross-kit handoff CTA across all 6 lesson kits — see CHANGELOG v1.17.0. The optional hub "X of 7 subjects" indicator was NOT done — promote if Mike wants it.)_

_(SIOL rollout shipped May 28, 2026 — see CHANGELOG v1.3.0. Tableau and Stats use a sections-based render rather than the RAL chunk pattern; deferred — see new Parking Lot entry.)_

- **Update all marketing copy & docs: remove "no login needed" language** _(added June 27, 2026 — 5:30 PM ET)_ — _PRE-LAUNCH_
  - _What:_ Search and replace across: personal site (`michaelnocito.github.io`), hub meta description, README files, social blurbs, and any other external-facing copy that says "no install, no login" or "no sign-up required." Replace with accurate language: "Free to start, optional sign-in to sync across devices" or similar.
  - _Why it's here:_ Auth is now live (Google OAuth + email/password). Marketing material that promises "no login" contradicts the actual product. Pre-launch polish before freemium launch.
  - _Scope:_ Audit and update: (1) hub `<meta name="description">` tag, (2) GitHub repo README, (3) personal site copy, (4) any other public-facing docs. Language should emphasize "free to explore without signing in, but sign in to sync progress."
  - _Definition of Done:_ All references to "no login" are removed. New copy accurately reflects that auth is optional but available. Verified on live URLs (site + GitHub).
  - _Est. effort:_ Small (mostly find-replace).

- **Per-kit SEO meta polish (titles + descriptions)** _(added June 27, 2026 — 6:10 PM ET)_ — _POST-GSC_
  - _What:_ Tighten each kit page's `<title>` and `<meta name="description">` to target real search queries (e.g. "free SQL practice for data analyst interviews", "learn Excel for data analysis no install"). Driven by data: once Google Search Console (set up June 27) shows which queries the site appears for, optimize the pages those queries hit.
  - _Why it's here:_ GSC + sitemap are now live; SEO is the main free-traffic lever. Generic titles leave rankings on the table. Wait ~1–2 weeks for GSC query data before rewriting so it's evidence-based, not guesswork.
  - _Definition of Done:_ Every kit has a unique, query-targeted title + description; verified live; cross-checked against GSC's top-impression queries.
  - _Est. effort:_ Small per kit (content-only).

- **STRATEGY: Marketability / competitive gap analysis → growth plan** _(added June 27, 2026 — 6:10 PM ET)_ — _STRATEGIC, not a code item_
  - _What:_ Turn the first-pass gap analysis (delivered in chat June 27) into a living growth plan. Core finding: the product is strong; the gaps are **distribution, social proof, and a sharpened paid offer** — not product quality. Track and revisit as traffic data (GA4 + GSC) comes in.
  - _The gaps to close (ranked):_ (1) **Discovery/distribution** — nobody knows it exists; needs active channels (SEO content, Reddit r/dataanalysis, LinkedIn, YouTube, communities), not just waiting. (2) **Outcome/credential proof** — career switchers pay for a job, not lessons; the Simulator + Final Exam could become a shareable certificate/portfolio artifact. (3) **Trust signals** — zero testimonials / "X learners" / reviews; cold-start problem. (4) **Email capture + retention loop** — auth now enables it, unused; build an audience to monetize at Aug 1 launch. (5) **Sharpen the free/paid line** — free is so complete the paid tier may feel optional; paid should = "get the job" (mock interviews, feedback, certificate). (6) **Niche positioning** — "learn data analytics" competes with giants; the wedge = "calm, everyday-words path for career switchers overwhelmed by DataCamp" + "interview prep that simulates the real job."
  - _Why it's here:_ Aug 1 founding launch to an audience of ~0 converts ~0 regardless of quality. Highest-leverage pre-launch work is audience-building + proof, not more features.
  - _Definition of Done:_ A short GROWTH.md with the positioning statement, 2–3 chosen channels, an email-capture plan, and the sharpened paid-tier value prop. Revisit monthly against GA4/GSC.
  - _Est. effort:_ Medium (strategy/writing + a few small site changes like email capture).

- **Per-kit mini exam at the end of each subject** _(added May 27, 2026 — 4:05 PM ET)_ — _SHIPPED June 2, 2026 (v1.19.0) via the reuse path: each kit's nav has an "📝 Exam" entry that deep-links to its Final Exam section (per-section submit from GR-C), no content duplication. REMAINING follow-on: mark the kit "complete" on the hub when passed._
  - _What:_ Each tool kit (Excel/SQL/Python/Tableau/Stats/Power BI/Interview) gets its own short closing exam — ~6–8 questions, the same MC + fill-in pattern as the Final Exam Kit. Lives as a new tab inside each kit (e.g. "Exam") so the user finishes a kit with a clear win condition. Reuses and extends the question pool already in `final/index.html`.
  - _Why it's here:_ User explicitly asked for this and suggested parking lot, but I'm promoting to Medium. Reasoning: it directly serves Vision #2 (after each mini exam, "what's next" is unambiguously the next kit) and reuses an existing pattern with minimal new structure. The Final Exam stays as the cross-subject capstone. Doesn't add UI clutter — slots into the existing kit tab bar.
  - _Definition of Done:_ Every tool kit has an "Exam" entry in its nav; passing the mini exam visibly marks the kit "complete" on the hub (ties to the High items above); failing points back to weak lessons. The Final Exam Kit's per-subject question pool is the source of truth — no content duplication.
  - _Est. effort:_ Medium-Large (likely 1–2 cycles depending on whether we factor a shared exam component or just clone the pattern).

- **PREMIUM PORTFOLIO PROJECTS — guided step-by-step analytics deep-dives** _(added June 28, 2026 — 4:30 PM ET)_ — _⚠️ RESEARCH-GATED (bulk discovery phase when this roadmap item becomes active)_
  - _What:_ A suite of premium capstone projects for paid-tier members; each is a guided, real-world analytics portfolio piece with step-by-step walkthroughs + deep conceptual explanations. Examples: **(1) Weather analytics dashboard builder** (EDA on weather datasets, predict patterns, build a viz-and-query dashboard), **(2) Spreadsheet cleaner CLI app** (import messy CSV → detect issues → guide fixes → export clean data with a reusable recipe), **(3) Data quality & documentation generator** (analyze datasets, auto-generate data dictionary + quality report + transformation log), **(4) E-commerce sales analyzer** (load transaction data, drill into customer/product/regional trends, surface anomalies, recommend actions). Each project is end-to-end: problem statement → read-aloud theory → sample dataset → guided solving (step hints + "stuck?" coach integration) → exportable portfolio artifact (clean CSV, dashboard export, report doc).
  - _Why it's here:_ Directly serves **"get the job" value (gap #2 from STRATEGY)** — career switchers need portfolio proof, not just lessons. Competitive differentiator: step-by-step pedagogical walkthroughs (not raw project sandboxes) + deep-explanation scaffolding + reusable templates (e.g., "a data-cleaning playbook you built yourself"). Pairs naturally with the **AI Coach** (premium gate + coaching on stuck points). Real projects on GitHub look 10× better than "I passed an online course."
  - _Scope decision needed:_ (a) **Excel-first MVP** (pick ONE project, ~3–5 lessons + a worked example, gated behind Interview Pass)? (b) **Multi-project tier** (2–4 projects spanning Excel/SQL/Python, one per tool track)? (c) **Skill-path alignment** (projects map to job JDs — e.g., "Entry Data Analyst" project suite includes cleaning + EDA + viz)?
  - _Research gates (front-load when activating):_
    1. **Job-market fit** — which portfolio pieces do job postings actually ask to see? (LinkedIn/Greenhouse job-post scrape; 10 recent analyst JDs, note "portfolio/projects/GitHub" requirements.)
    2. **Scaffolding patterns** — how do successful guided-project platforms (DataCamp projects, Mode Analytics SQL School, Kaggle Learn) structure step-by-step walkthroughs? (Review 3–5 for pacing, hint layers, export/artifact design.)
    3. **Dataset sourcing** — reuse public datasets (Kaggle, data.world, Google Dataset Search) or commission synthetic ones? (Feasibility + licensing check.)
    4. **Coach integration economics** — estimate token cost for "stuck" coach calls on a typical project; does it blow the AI Coach budget? (Model-tier selection, prompt caching, per-project credit caps.)
  - _Definition of Done (when built):_ at least 1 project complete end-to-end; includes problem intro + theory (Everyday words + worked example) + step-by-step guide (each step has hints + "ask coach" button, hint escalation working) + real dataset (clean downloadable CSV) + export artifact (clean CSV / dashboard export / doc) + "portfolio polish" notes (how to describe this on a resume/GitHub). Verified on live URL, dark + light, coach-gating confirmed, token budget held.
  - _Est. effort:_ Very Large (multi-cycle per project; 1st project ≈ 60–80 hours once scope locked; subsequent projects reuse scaffolding).
  - _Parking rationale:_ speculative ROI without traffic data; needs upfront research to avoid building the wrong thing. Promote to High once Aug 1 traffic patterns + AI Coach adoption confirm demand for portfolio-building features.

### 🟢 Low
_Definition: ideas worth remembering, future features, "wouldn't it be
cool if…" Hold until the backlog above is empty, OR until the same idea
surfaces twice (auto-promote to Medium on second mention)._
_Response time: when there's air to breathe._

- **Complete old→new cross-links across the remaining kits** — ✅ **DONE (v1.115.0, July 7, 2026).** Excel/Python (btn-outline lists), Interview (styled anchors), Simulator + Final (footer links) all link Chart Literacy + Forecasting. _(added June 9, 2026 — 8:05 PM ET)_
  - _What:_ Chart Literacy + Forecasting cross-links were added to the SQL, Power BI, Tableau, and Stats kits (the most topically related). The other kits — Excel, Python, Interview, Simulator, Final — reach the new kits only via the hub's "← All Kits" link, not a direct sibling link.
  - _Why it's Low:_ Every kit still connects to the new ones through the hub, so nothing is unreachable. Pure consistency polish.
  - _Est. effort:_ Small.

---

## Parking Lot (deferred — don't lose, don't work yet)

### What goes in the parking lot
An item belongs here if it matches **at least one** of:
- **Low impact** — improves something real but few users will notice
  (e.g. internal code cleanup, minor copy polish).
- **Big overhaul** — requires changes across many files or a structural
  rework; needs its own planning cycle, not a single-bucket fix.
- **Speculative** — interesting idea, no confirmed ROI on user
  engagement yet. Promote to a bucket on second mention or after a
  user pattern justifies it.
- **Breaking change** — would invalidate saved progress, break URLs,
  or force users to relearn something. Needs deliberate scheduling.

Items below stay here until promoted. Promotion happens when the item
gets requested again, when testing surfaces a related issue, or when
all other buckets are empty.

---

- **🤖 AI COACH — premium "stuck-help" tutor + interview back-and-forth** _(added June 28, 2026 — 4:19 PM ET; parked July 6, 2026)_ — _⏸️ Mike's call: the Project Studio kit (`projects/`, shipped v1.103.0) now has its own AI-assisted flow (Claude BYOK draft step). Nail the AI UX pattern there first, then revisit this and reuse whatever works. Directly serves the STRATEGY item's gap #5 ("paid = get the job")._
  - _What:_ A premium-gated AI coach with three modes. **(1) Inline "help me finish this":** clickable on any lesson/drill — it sees the current problem + the learner's attempt and gives a scaffolded path to the answer plus the concept, hints-first (not a dump). **(2) Interview back-and-forth:** role- and skill-specific mock interviewing for the kit's 4 interview tracks — asks realistic questions, critiques answers, shows good-answer examples, and supports free chat like a live prep partner. **(3) Attempt-vs-correct gap analysis** _(added June 29, 2026 — 12:13 PM ET)_: after a learner submits, the coach compares their attempt to the correct answer and names the specific gaps (what they missed and why) — automating the "compare my attempt to the right answer" instinct Mike finds effective. The free tier shows attempt-vs-correct side-by-side (see the Medium item); the AI gap-read is the premium layer. **Tightly gated** to cap token spend (Mike's explicit requirement).
  - _Why it mattered:_ The free tier is so complete the paid Pass can feel optional. An AI coach is the clearest "get the job" value-add and matches the proven monetization pattern (Exponent — the leading interview-prep platform — gates AI grading/feedback behind paid membership). The integrated, click-anywhere angle is a genuine differentiator over post-session grading. Mike's gating instinct isn't optional polish — it's what makes the economics survive a one-time pass (see below).
  - _Research findings (deep-research workflow, June 28; full report in chat):_
    - **Competitive:** Exponent gates AI interview feedback (per-attribute rubric scoring across behavioral/PM/system-design/data-science) behind paid membership — validates the gate-it-to-premium plan. The "stealth copilot / undetectable live-interview answers" end of the market (Final Round AI) is the dishonest-prep dark pattern and its claims failed verification — **do NOT go there**; honest prep is the right side and the differentiator.
    - **Safety/pedagogy:** AI tutors tend to over-disclose full solutions instead of scaffolding ("scale doesn't predict safety"). A learning coach must scaffold (hint-escalate), which is both better pedagogy AND cheaper tokens — and it dovetails with the existing **hint-escalation** roadmap item (Miss 1/2/3 tiers).
    - **Cost control patterns (industry):** model-tiered routing (cheap model for cheap tasks), per-user token budgets with real-time tracking, prompt caching (~90% off the cached prefix), tiered rate limits + a global daily spend circuit breaker.
  - _Architecture — much of the foundation already exists (de-risks this a lot):_
    1. **Supabase backend is live** (auth: Google + email/pass; `user_progress` + `user_entitlements` tables; `hasInterviewPass()` gate hook) — see `SUPABASE_INTEGRATION.md`. The entitlement gate the coach needs is already built.
    2. **A working browser→Claude API integration exists** (the Simulator kit, `claude-sonnet-4-5`, `anthropic-dangerous-direct-browser-access`, **user-supplied key** in `localStorage['sim2-apikey']`). Proves the call path; the BYOK pattern is reusable for a $0-cost "unlimited" tier. **Now also the Project Studio kit's BYOK draft step — a second live reference implementation to compare against once Mike has iterated on it.**
  - _The lift (net-new pieces):_
    1. **Server-side proxy (the keystone)** — a **Supabase Edge Function** holding the Anthropic key as a secret, so MIKE can pay for tokens without shipping his key in client JS (you can never put your key in a static GH-Pages site). Preserves the "zero build step, static site" guardrail — the Edge Function deploys separately; the site stays vanilla/static. ~Medium.
    2. **Gating + quota layer** — entitlement check + per-user credit/monthly cap + per-hour/day rate limits + a global daily spend circuit breaker, in the Edge Function + a `user_ai_usage` table. ~Medium. **This is the feature, not an add-on.**
    3. **Scope-lock the system prompt** — constrain the coach to the current problem/domain, scaffold-not-dump, and refuse off-topic ("act as free Claude") requests. Kills the biggest abuse vector. ~Small-Medium.
    4. **Coach UI** — slide-in panel + "Coach" button on lesson/drill/interview surfaces, capturing current-problem + attempt context. ~Medium (repeated per surface).
    5. **Model tiering + caching** — Haiku 4.5 for the inline coach (cheap, fast, scaffolding is easy); Sonnet 4.6 for interview back-and-forth; prompt-cache the static system prompt + problem context. ~Small.
  - _Economics (current pricing; the crux of Mike's concern):_ Haiku 4.5 = $1/$5 per 1M in/out; Sonnet 4.6 = $3/$15. **Inline coach call ≈ $0.006** (half a cent, Haiku). **Interview session (~15 turns) ≈ $0.20–0.35 on Sonnet, ~$0.07 on Haiku** (prompt caching cuts the history-resend cost ~90%). Verdict: a $15 one-time Pass works IF gated — allocate ~$2–3 of token budget/buyer → ~350–500 inline calls OR ~6–15 interview sessions, plenty for real prep. **The structural risk is the one-time-pass ↔ ongoing-cost mismatch:** a heavy user doing daily interview prep for a month (~30 sessions ≈ $9) eats most of the margin. Gating is what closes that gap.
  - _Open decisions for Mike (pick before build — one at a time):_
    1. **Funding/gating model:** (a) Pass includes a generous-but-capped credit allotment (e.g. "100 coach messages / 50 interview turns"), simplest; (b) small recurring "AI Coach" add-on ($/mo) so recurring revenue matches recurring cost — but breaks the one-time-$15 positioning; (c) **BYOK "unlimited" tier** (reuse the Simulator/Project Studio pattern, $0 cost to Mike) as the power-user option alongside a hosted-capped default. _Claude's rec: (a) + (c) — generous cap for everyone, BYOK escape hatch for power users; revisit (b) only if usage data shows demand for unlimited hosted._
    2. **Scope for v1:** inline "stuck-help" only (cheaper, simpler, broad appeal) vs. interview back-and-forth only (higher "get the job" value, pricier) vs. both.
    3. **Model choice** per mode (Haiku vs Sonnet) — affects cost ~3–5×.
  - _Definition of Done (when built, not now):_ coach reachable from the gated surfaces; every call passes through the Edge-Function proxy with entitlement + quota + rate-limit + global-spend checks enforced and verified; scope-lock refuses off-topic; BYOK path works; usage visible to the user (credits remaining). Verified on live URL, dark + light.
  - _Est. effort:_ Large (multi-cycle; the proxy + gating layer is the keystone; UI repeats per surface). Foundation (Supabase + a proven API call path, now with a second reference implementation in Project Studio) means this is NOT from-scratch.
  - _Reference:_ research report (chat, June 28, 2026); `SUPABASE_INTEGRATION.md`; Simulator kit API block (`sim/index.html`); Project Studio's BYOK draft step (`projects/index.html`).
  - _Revisit trigger:_ once Mike has iterated on the Project Studio AI flow and is happy with the UX pattern there.

- **Redesign premium gates (post-lessons/AI/coach)** _(parked June 29, 2026)_ — Gates removed as of v1.83.0; all content is free until August 1, 2026. When Phase G (AI Coach) and Phase H (port to other kits) are complete and the premium feature set is defined, rebuild the gate UX from scratch. The old `apkPass.isUnlocked()` hard-returns `true` before Aug 1 — after that date the existing code-check logic resumes. Gate redesign should happen with the actual paid features in hand (AI coach access, interview session limits, etc.) so the gate copy is honest and specific, not a placeholder. _Reason parked:_ premature to design gates before the premium value is built.

- **PivotTable content — revisit after kit-by-kit redo** _(parked June 29, 2026)_ — The PivotTable lessons (Unit 2) are hard to teach without a live interactive PivotTable. Static grids and text descriptions convey the shape but not the feel. Revisit as part of the full kit content review pass — options include an embedded interactive drag-zone mockup, a screencast/GIF, or the Pivot Lab already in the nav put front-and-center as the learning medium. _Reason parked:_ content-design decision, not a quick fix; depends on the broader kit review direction Mike is working toward.

- **"Hear it" speech button on recall prompts** _(parked June 29, 2026)_ — A small 🔊 button next to each recall-card cue that reads the prompt aloud via the Web Speech API (zero dependency, no API key). Rationale: text prompts for "say it out loud" don't actually compel speech — hearing it spoken first triggers call-and-response naturally and turns a silent read into an active verbal exercise. _Reason parked:_ feature-sized (not a one-liner); the base recall card is new and untested. Promote after Phase D ships and recall cards see real usage. _Est. effort:_ Small-Medium.

- **🎨 GRAIN PHASE 4 — cross-kit surfaces + polish** _(parked June 25, 2026 — revisit ~July 25, 2026)_
  - _What:_ The post-rollout "nice-to-haves" from the Grain brief — (a) cross-kit
    **Cards / Practice / Glossary** surfaces (auto-generate from lesson data), (b)
    **achievements / track badges**, (c) a real **Grain dark palette**, (d) a
    **React-vs-vanilla** re-platform.
  - _Decision (Mike + Claude, June 25):_ **hold the whole phase ~1 month and revisit**
    once GA4 traffic data exists. None of it earns its keep pre-traffic — it's all
    retention/polish/architecture that pays off only with repeat users. Per-item take:
    - **Cross-kit Cards/Practice/Glossary** → later (traffic-gated). Each kit already
      has these per-kit; the unified version is power-user/repeat-visitor value.
    - **Achievements/badges** → later, maybe skip. Retention gamification; biggest risk
      to the calm "simplicity beats completeness" vision. Only if GA4 shows return-then-drop.
    - **Real Grain dark palette** → later, low priority. Dark already works (mapped onto
      tokens); bespoke dark is pure polish, invisible to first-time visitors.
    - **React re-platform** → **skip even later** unless the app outgrows a single file.
      Vanilla + zero-build + GH-Pages is a feature; React adds a build step for no
      learner-visible gain (brief explicitly fences it off).
  - _One adjacent item with real portfolio value if promoted sooner:_ the interview-track
    **chart lessons currently render as data tables** (not charts). For a data-analyst's
    portfolio, real **inline-SVG charts** would photograph better than tables. Still a
    "nice to have," but the most justifiable Phase-4 pull-forward.
  - _Revisit trigger:_ ~July 25, 2026, OR when GA4 shows meaningful repeat traffic — let
    real usage promote whichever surface earns it.
  - _Est. effort:_ Large (multi-cycle; each sub-item its own scoped piece).

- **Within-lesson highlighting in Bare Basics mode** _(parked)_ —
  Currently the mode highlights _which lessons_ are must-knows but
  not which sections inside a lesson. Promote if testing shows
  lesson-level highlighting is insufficient. _Reason parked:_
  speculative — lesson-level may be enough.

- **CSS variable unification** _(parked)_ — Kits use a mix of
  `--text/--dim/--border` and `--txt/--txt2/--bord`. Invisible to
  users; pays off every future edit. _Reason parked:_ low impact for
  users, big-overhaul effort for the engineer.

- **Cleanup of orphaned sprint CSS** in each kit's stylesheet (see
  CHANGELOG "Known orphans"). _Reason parked:_ low impact, purely
  cosmetic, no DOM hits.

- **Tableau and Stats: equivalent of "Say It Out Loud" sentences** _(parked May 28, 2026 — 12:30 AM ET)_ —
  Tableau and Stats use a sections-based lesson render (`l.sections.map`) instead of the RAL chunk pattern that Excel/SQL/Python/Power BI use. To bring them in line with the v1.3.0 SIOL leader-sentence treatment, they'd need a different design pass: either add a `sec.say` field per section, or rewrite sections into the RAL pattern. _Reason parked:_ big-overhaul work (structural change to two kits) for a benefit that's smaller than the original pass — those kits' content is already mostly conceptual prose, not formula-heavy. Promote when (a) Mike calls it out in testing, or (b) a kit-by-kit content rewrite is scheduled anyway.

- **GR-B: "Living a workday" mindset expansion across all kits** _(parked May 27, 2026 — 7:42 PM ET)_ —
  The "On the job" framing currently in some Excel lessons is great
  and Mike wants the whole product to feel that way: more on-the-job
  sidebars, persistent "what your manager would ask" thread, scenario
  framing throughout, eventually a "live a workday" arc the user can
  walk through. _Reason parked:_ big-overhaul AND speculative-ROI per
  criteria. Content authoring across every kit + possible structural
  shift (sidebars, scenario threads, workday flow integration). Needs
  its own planning cycle, not a single-bucket fix. Promote when:
  (a) GR-A ships and the cross-kit flow exposes whether users want
  more job framing in transitions, OR (b) a small scoped slice
  surfaces that we can pilot in one kit as proof-of-concept.

---

## How to add an item to this file

Every entry includes a timestamp in Eastern Time, standard format
(not military). Run `TZ='America/New_York' date '+%B %-d, %Y — %-I:%M %p ET'`
to grab the current one.

```
- **<short title>** _(added <Month D, YYYY — H:MM AM/PM ET>)_
  - _What:_ <one sentence>
  - _Why it's here:_ <which Vision Principle or what bug>
  - _Definition of Done:_ <what "fixed" looks like>
  - _Est. effort:_ Small / Medium / Large
```

When an item ships, move the block to `CHANGELOG.md` under the version
where it landed, with the ship date.
