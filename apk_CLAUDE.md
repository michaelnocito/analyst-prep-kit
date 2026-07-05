# Session Handoff — Analyst Prep Kit

**Last session ended:** July 5, 2026 — ✅ **Medium #4 DONE (v1.101.3): retired stale "no login / no telemetry" copy.** Auth+sync + GA4 are live, so those claims are false. Reframed README, chart-literacy + forecasting meta descriptions ("No install, free to start") + footers ("saved in this browser, and syncs across devices when you sign in"), dropped the false "No telemetry" chip from final + simulator footers (both load GA4), and dropped "No sign-up" from the hub arcade note. The hub hero already said "Sign in to sync across devices" (unchanged). Parse clean across all touched files. **✅ Follow-up shipped same session (v1.101.4): privacy.html + terms.html rewritten to be accurate about optional sign-in + Supabase sync** — no-account use stays local; account stores email + synced progress/entitlements (Supabase named as backend); added account-deletion to "Your choices" + auth/sync to providers; both "Last updated" → July 5, 2026. Facts sourced from `SUPABASE_INTEGRATION.md`. **➡️ NEXT Medium item = #5 premium-unlocked badges** (badge/"Premium" pill driven by entitlement state — `user_entitlements`/`hasInterviewPass()`; pairs with freemium launch; verify current state first — #2/#3/#4 were all partly pre-built). Then #6 real chart visuals (large, last), #7 SEO (post-GSC).

**Prior (same day):** ✅ **Medium #3 DONE (v1.101.2): attempt-vs-correct display.** Already broad — v2 **Compare** stage renders an explicit "Your attempt | Correct answer" grid for the Parsons drill in ALL 6 kits (`_v2ParsAttempt`/`compareHTML`), and MC **Quick Checks** reveal pick+correct+explanation in Excel/Python/SQL/PBI/Stats. **Only gap = Tableau**: its `checkQuiz` marked the wrong pick red but never revealed the correct option (showed prose, then reset for retry). Fixed by greening the correct option on a wrong pick (mirrors Stats), so the compare is visible before the 2.2s retry reset. One-line behavior change, parse clean (5/5). **⚠️ Note the emerging pattern:** Medium #2 and #3 were both largely pre-satisfied by the v2 + High-#4 work, needing only small cleanups — expect the same triage on later items (verify current state before building). **➡️ NEXT Medium item = #4 remove "no login needed" marketing copy** (auth is live; find-replace across hub `<meta>`, READMEs, personal site, public docs → "free to start, optional sign-in to sync"). Then #5 premium-unlocked badges, #6 real chart visuals (large, last), #7 SEO (post-GSC).

**Prior (same day):** ✅ **Medium #2 DONE (v1.101.1): retired the dead "On the job" blurb render.** The block existed only in Excel, gated `flow!=='v2'`; all 51 Excel lessons are v2, so it had rendered NOWHERE since Phase H — the item ("no on-the-job noise on general lessons") was already satisfied by the migration. Removed the unreachable render line (excel/index.html ~2197, string terminator moved up to the `intro` line); **kept the 24 `onthejob` blurbs as dormant data** on the core lessons (Mike's call — reusable). No other kit has the block. Parse clean (4/4). **➡️ NEXT Medium item = #3 attempt-vs-correct free display** (show learner's attempt next to the correct answer post-submit; Excel's v2 Compare stage `v2CompareDynHTML` already does this — roll where missing / to standalone drills). Then #4 remove "no login needed" copy, #5 premium-unlocked badges, #6 real chart visuals (large, last), #7 SEO (post-GSC).

**Prior (same day):** ✅ **Medium #1 DONE (v1.101.0): hub "Practice arcade" section.** Added a games block below the 12 kits on `index.html` linking all six live analyst games — SQL Quest · Analyst Sprint (Excel) · Analyst Sprint (SQL) · Spreadsheet Archaeology · Tableau Archaeology · SQL Dry Run. All URLs verified HTTP 200 before linking; list + placement (own section, below kits) confirmed with Mike via question. Reuses the `.kit-card` component + new `.arcade-note` lead; external `target=_blank rel=noopener` links, one-line hook each. **Cards deliberately have NO `data-kit`** so they stay out of the KITS progress renderer (line ~613) and the `apk-last-kit` continue-tracker (line ~677) — like the existing Keygarden card. HTML/CSS only, inline-script parse gate clean (4/4). **➡️ NEXT Medium item = #2 "on-the-job blurbs only on track lessons"** (gate the role blurb to track lessons; add applicability check), then #3 attempt-vs-correct free display, #4 remove "no login needed" copy, #5 premium-unlocked badges, #6 real chart visuals (large/phased, last), #7 SEO (post-GSC, deferred). Full order in the Medium block below / `ROADMAP.md`.

**Prior (same day):** ✅ **Cleared High-bucket items #1–#6 (v1.98.0 → v1.100.1).** #1 mobile action buttons · #2 mobile text-overflow · #3 nav-overlapping-title (mobile CSS, all 6 kits, pending Mike's phone check) · #4 free-text drills → tap-the-choice (SQL/Python/PBI/Stats, hand-authored distractors) · #5 readiness meter now derives from live lessons (SQL/Python/PBI were frozen to the original 12; Excel/Tableau already live) · **#6 completion-model = decided AND already satisfied** (Mike: lesson completes at the v2 Done stage; the kits already mark `doneLessons` exactly there, and practice-drill "Check" buttons don't gate it — so no code change was needed). All parse clean. Working the ROADMAP High bucket one item at a time (Mike's cadence: I build+verify+ship one, hand off, he tests via the spreadsheet). **Key finding:** all drills are now tap-based (chips/MC) — NO free-text inputs — so the "keyboard covers the submit button" framing is moot; the fix = make the primary action a full-width, 48px-min, thumb-height CTA on mobile (≤600px), placed at the bottom of its button row. CSS-only, desktop untouched. **Per-kit gotchas that mattered:** Excel reveals all stages (`.v2-continue`, `.v2-drill-actions`, `.v2-close-actions`); the other 5 render ONE `.v2-stage-card` at a time. SQL/Power BI use `.row` button wrappers (already wrap); Python/Tableau/Stats use inline `<div style="display:flex">` with no wrap → forced via `.v2-stage-card div[style*="display:flex"]{flex-wrap:wrap}`. **Stats' primary is plain `.btn` not `.btn-primary`** (targeted `.btn:not(.btn-outline):not(.btn-sm)`) and had no ≤600px block (added one). All parse clean.
**High #2 (mobile text-overflow sweep) ✅ DONE (v1.99.1):** added `overflow-wrap`/`word-break` to the 5 non-Excel kits' `.quiz-opt`, `.v2-pars-chip` (`white-space:pre`→`pre-wrap`), `.v2-compare-code`, `.code-block` so long formulas/queries wrap instead of clipping (Excel already had this from v1.78.0).
**High #3 (jumbled/overlapping title) ✅ DIAGNOSED + FIXED (v1.99.2), pending Mike's confirm:** root cause was `nav{flex-wrap:wrap}` + fixed `height:56px` → mobile tab bar wrapped to a 2nd row that overflowed the sticky nav onto the page `<h1>`. Applied Excel's known-good `nav{flex-wrap:nowrap;overflow-x:auto}` (single scrollable row) to SQL/Python/PBI/Tableau/Stats. ⚠️ If Mike's "jumble" was a different screen, reopen with specifics.
**➡️ NEXT = work the MEDIUM bucket** (Mike's call, July 5 — the High quick-fixes #1–#6 are all done; the remaining High items are big gated efforts, deferred). Same cadence as the High run: **do ONE Medium item at a time, build + verify (headless parse gate: `node` new-Function on each kit's inline `<script>`) + ship (commit + push, per-kit checkpoints), then hand off.** Mike tests independently via the private `testing/APK_Testing_Checklist.xlsx`; don't walk him through in chat unless asked. Skip local preview (GH-Pages — he checks live). Commit as Michael Nocito, no AI trailers.
  **Medium bucket, in suggested order (small/high-value first — full detail in `ROADMAP.md` 🟡 section):**
  1. ✅ **DONE (v1.101.0)** — Hub "Practice arcade" section: 6 live games linked below the kits (SQL Quest · Analyst Sprint Excel/SQL · Spreadsheet + Tableau Archaeology · SQL Dry Run).
  2. ✅ **DONE (v1.101.1)** — "On the job" blurb: already hidden by v2 migration; removed the dead render line (Excel only), kept blurb data dormant.
  3. ✅ **DONE (v1.101.2)** — Attempt-vs-correct: already broad (v2 Compare grid all 6 + MC reveal in 5 kits); closed the one Tableau Quick Check gap.
  4. ✅ **DONE (v1.101.3)** — Removed stale "no login / no telemetry" copy (README, 2 kit meta+footers, final/simulator footers, arcade note). privacy/terms accuracy flagged as a separate task (legal, needs data facts).
  2. **"On the job" blurbs only on applicable (track) lessons** — gate the on-the-job/role blurb so it only renders on track lessons, not general ones (noise reduction). Small; add an applicability check (track-membership / flag).
  3. **Attempt-vs-correct comparison (free display)** — after a drill submit, show the learner's attempt next to the correct answer. NOTE Excel's v2 Compare stage already does this (`v2CompareDynHTML`) — this is about the standalone drills / rolling it where missing. Small-Med.
  4. **Remove "no login needed" marketing copy** — auth is live; search/replace across hub `<meta>` description, READMEs, personal site, public docs → "free to start, optional sign-in to sync." Small (find-replace).
  5. **Mark premium features as "unlocked" post-purchase** — badge/"Premium" pill driven by entitlement state (`user_entitlements`/`hasInterviewPass()`). Med. (Pairs with freemium launch.)
  6. **Real chart/pivot visuals in chart-based exercises** — where an exercise references a chart/pivot, render an actual visual (inline-SVG/Chart.js) instead of text. LARGE/phased, Excel first — save for last or split.
  7. **Per-kit SEO meta polish** — POST-GSC (wait ~1–2 wks for Search Console query data before rewriting titles/descriptions). Defer until data exists.
  **Big HIGH efforts still parked (start only if Mike asks):** AI Coach (decision-gated — needs his go + 3 decisions; research done, see ROADMAP + `SUPABASE_INTEGRATION.md`) · Learning-Science restructure (Excel; spec = `EXCEL_POLISH_MASTER_PLAN.md`) · GR-G remaining threads (simplified home + Excel makeover; needs design direction). THEN Low bucket, THEN Phase G Mode 2 (mock interview). Full lists in `ROADMAP.md`.
  **Cleanup candidates noticed:** dead CSS from the #4 conversion (`.fill-input`/`.drill-input`/`.correct-in`/`.wrong-in`, now unused) across SQL/Python/PBI/Stats. **Minor mobile leftovers if Mike flags them:** standalone practice-drill Check buttons (plain mid-card `.btn`) + drag pieces (`.pars-piece`).
**Prior session:** July 3, 2026 — 🏁 **Stats H1 COMPLETE (v1.96.0–v1.97.0) — and with it the ENTIRE PHASE H ROLLOUT: all 5 kits (SQL · Python · Power BI · Tableau · Stats) now run the 7-stage v2 flow with AI Coach Modes 1+3.** Stats port details: `v2StatBody` on the `S`/`save`/`openLesson` path (`v2st-` ids, `stat-lesson-mode`, shared `apk-coach-key` + Settings field). Worked Example renders `sections` (no `ral`): code sections show code + steps expanded; prose-only sections are the "More detail" layer; Unit-0 concept lessons (no code) show everything, no toggle. `drawStatChart` re-invoked after stage-1 injection (canvas-0×0 trap stays handled); Distribution Lab + all drills untouched. All 16 lessons validated (0 problems). Test batches 25–26 below. **NEXT FOR A FUTURE CHAT: Phase G Mode 2 — the mock interview, designed once across all kits (per the master plan) — unless Mike brings test results first.**
**Current version:** `v1.101.4`
**You are continuing an established collaboration with Mike Nocito.**

---

## 🧪 TESTING — now tracked in a spreadsheet, not in-chat

Mike tests independently using a working checklist, NOT a batch-by-batch chat walkthrough. Do not re-walk him through these batches in chat unless he explicitly asks.

**File:** `testing/APK_Testing_Checklist.xlsx` (local only — not committed to git; it's a working doc, not kit content)
**Columns:** # | Kit | Item | Steps (numbered, one per line) | Result (dropdown: Pass/Partial/Fail/Not Tested) | Notes / Follow-up
**Contents:** all 18 batches below, covering every unverified change from the June 30 – July 1 build sprint (v1.83.6 → v1.89.1): Excel Phase F/G Mode 3 polish, SQL H1 (all 46 lessons), Python H2+H1 (all 42 lessons), Power BI H2 content fixes.

If Mike references results from that sheet (e.g. "batch 6 failed" or "row 12 partial"), ask him to paste the Notes/Follow-up content or describe what broke, then triage into a roadmap item before continuing new build work. The batch descriptions below are kept as the canonical source Mike's spreadsheet was generated from — useful if the sheet needs regenerating or a batch needs re-explaining.

### Batch 1 — Excel: Phase F toggle polish + Phase G Mode 3 (Lesson 5 only, ~3 min)
Open Excel → Lesson 5 ("Your First Formula"). Worked Example stage: toggle button should read "More details" → click → "Less". Try stage: deliberately get the parsons puzzle wrong, Check. Compare stage: two-column "Your attempt" (red) vs "Correct answer" (green) box should appear, plus an "Ask the AI Tutor →" button (only shows on a wrong attempt) that calls Sonnet and names the specific gap.

### Batch 2 — SQL Unit 0: Before You Query (Lessons 1–4, ~7 min)
Deep-dive Lesson 1 ("What a Database Is") through all 7 stages: stage bar → Worked Example toggle ("More detail"/"Less detail") → Try (parsons chips, wrong-then-right, confirm "Stuck? Ask the AI Coach →" button + sparkles icon render) → Compare → Build (wrong-then-right) → Check quiz (wrong-then-right) → Close (unlock card). Spot-check Lessons 2–4 (open, click through every stage, confirm nothing blank/stuck).

### Batch 3 — SQL Unit 1: Foundations (Lessons 5–8, ~5 min)
Deep-dive Lesson 5 ("SELECT & FROM"), same 7-stage walk as Batch 2. Spot-check Lessons 6–8.

### Batch 4 — SQL Unit 2: Aggregates & Joins (Lessons 9–14, ~7 min)
Deep-dive Lesson 9 ("COUNT, SUM & GROUP BY"). Spot-check Lessons 10–14.

### Batch 5 — SQL Unit 3: Advanced SQL (Lessons 15–20, ~7 min)
Deep-dive Lesson 15 ("Subqueries"). Spot-check Lessons 16–18 plus 19–20 ("SQL Indexing", "Temp Tables vs Views" — these two had parsons authored from scratch with no prior data, worth a closer look at the Try stage).

### Batch 6 — SQL Unit 4: Data Migration (Lessons 21–28, ~9 min)
Deep-dive Lesson 21 ("Profiling: Counts & Uniqueness"). Spot-check Lessons 22–28 (the full Data Migration track — all new today).

### Batch 7 — SQL Unit 5: From Question to Metric (Lessons 29–34, ~7 min)
Deep-dive Lesson 34 ("Cohort Retention" — the unit capstone, longest parsons puzzle, sits on top of an H2 bug fix). Spot-check Lessons 29–33.

### Batch 8 — SQL Unit 6: Financial Analysis (Lessons 35–40, ~7 min)
Deep-dive Lesson 35 ("Build the P&L from the Ledger"). Spot-check Lessons 36–40.

### Batch 9 — SQL Unit 7: Advanced Analyst Toolkit (Lessons 41–46, ~7 min)
Deep-dive Lesson 41 ("Profile the Data First"). Spot-check Lessons 42–46 (43 "Distribution & Outliers" and 45 "Correlation ≠ Causation" each got a dialect note in H2 — worth a skim).

### Batches 10–17 — PYTHON kit: full v2 flow (v1.87.0–v1.89.0, all 42 lessons untested)
Same walk pattern as the SQL batches: one deep-dive per unit through all 7 stages (Orient → Worked Example w/ "More detail"/"Less detail" toggle → Try parsons w/ "Stuck? Ask the AI Coach →" on a wrong check → Compare w/ "Ask the AI Tutor →" after wrong → Build wrong-then-right → Quick Check wrong-then-right → Done card + unlock + Practice-this CTA). Spot-check the rest of each unit. ⚠️ Python lesson POSITION = list order: Unit 0 = Lessons 1–4 (ids 101–104), Unit 1 = 5–7 (ids 1–3), Unit 2 = 8–13 (ids 4–9), Unit 3 = 14–18 (ids 10–14), Unit 4 = 19–24, Unit 5 = 25–30, Unit 6 = 31–36, Unit 7 = 37–42.
- **Batch 10** — Unit 0 (Lessons 1–4): deep-dive Lesson 1 "What Code Is"
- **Batch 11** — Unit 1 (Lessons 5–7): deep-dive Lesson 5 "Variables & Data Types"; ALSO verify Settings modal (gear icon) now shows an "AI Coach" key field that saves
- **Batch 12** — Unit 2 (Lessons 8–13): deep-dive Lesson 12 "GroupBy & Aggregation"
- **Batch 13** — Unit 3 (Lessons 14–18): deep-dive Lesson 14 "Finding & Fixing Nulls"
- **Batch 14** — Unit 4 (Lessons 19–24): deep-dive Lesson 19 "Profiling: Shape, Nulls & Uniqueness"
- **Batch 15** — Unit 5 (Lessons 25–30): deep-dive Lesson 30 "Cohort Retention" (capstone)
- **Batch 16** — Unit 6 (Lessons 31–36): deep-dive Lesson 31 "Build the P&L from a Ledger"
- **Batch 17** — Unit 7 (Lessons 37–42): deep-dive Lesson 37 "Profile the Data First"
- Cross-cut check (any one lesson): legacy "Quick Check on the intro page" flow must be GONE on v2 lessons — the quiz only appears at stage 6 of 7
- AI Coach key is SHARED with Excel (`apk-coach-key`): saving it in the Python Settings should make Excel's coach work without re-entering (and vice versa)

### Batch 18 — Power BI: H2 content-review spot-check (v1.89.1, ~2 min)
- 18a: Open Power BI Lesson 1 ("How Power BI Sees Data") → Quick Check — question now asks **"Where does that grain actually become dangerous?"**; correct answer is the relationships/fan-out option
- 18b: Open Power BI Lesson 15 ("Dashboard Design Principles") → story paragraph — reads **"One or two accent colors, maximum"** (matches the code card)

### Batches 19–21 — POWER BI kit: full v2 flow (v1.90.0–v1.92.0, all 39 lessons untested)
Same walk pattern as the SQL/Python batches: one deep-dive per batch through all 7 stages, spot-check the rest. ⚠️ Power BI lesson POSITION = list order: Unit 0 = Lessons 1–4 (ids 101–104), Unit 1 = 5–8 (ids 1–4), Unit 2 = 9–12 (ids 5–8), Unit 3 = 13–16 (ids 9–12), Unit 4 = 17–21 (ids 401–405), Unit 5 = 22–27 (ids 601–606), Unit 6 = 28–33 (ids 701–706), Unit 7 = 34–39 (ids 801–806).
- **Batch 19** — Units 0+1 (Lessons 1–8): deep-dive Lesson 1 "How Power BI Sees Data (Table & Grain)"; ALSO verify Settings (gear icon) shows an "AI Coach" key field that saves, AND that Lesson 5 "The Power BI Interface" still shows the "Tour the workspace interactively" button on its first (Orient) stage
- **Batch 20** — Units 2+3 (Lessons 9–16): deep-dive Lesson 11 "CALCULATE & Filter Context" (Lesson position 11 = id:7)
- **Batch 21** — Units 4–7 (Lessons 17–39): deep-dive Lesson 22 "Define the Measure Before You Compute It" (id:601); spot-check one lesson per unit (suggest 17, 28, 34)
- Cross-cut check (any one lesson): legacy "Quick Check on the intro page" flow must be GONE — the quiz only appears at stage 6 of 7
- AI Coach key is SHARED with Excel + Python (`apk-coach-key`); note SQL still uses its own `sql-coach-key` (divergence flagged, not yet unified)

### Batches 22–24 — TABLEAU kit: full v2 flow (v1.93.0–v1.95.0, all 32 lessons untested)
Same walk pattern as SQL/Python/Power BI: one deep-dive per batch through all 7 stages (Orient → Worked Example w/ "More detail"/"Less detail" toggle → Try parsons w/ "Stuck? Ask the AI Coach →" on a wrong check → Compare w/ "Ask the AI Tutor →" after wrong → Build wrong-then-right → Quick Check wrong-then-right → Done card + unlock + Practice-this CTA). ⚠️ Tableau lesson POSITION = list order: Unit 0 = Lessons 1–4 (ids 21–24), Unit 1 = 5–9 (ids 1,25,2,3,4), Unit 2 = 10–19 (ids 28,5,6,26,7,8,9,30,31,32), Unit 3 = 20–25 (ids 27,10,11,29,12,13), Unit 4 = 26–28 (ids 14,15,16), Unit 5 = 29–32 (ids 17,18,19,20).
- **Batch 22** — Units 0+1 (Lessons 1–9): deep-dive Lesson 1 "How Tableau Sees Your Data"; ALSO verify Settings (gear) shows the "AI Coach" key field and saves, AND Lesson 5 "The Tableau Interface" still shows the "Tour the workspace interactively" button on its Orient stage
- **Batch 23** — Units 2+3 (Lessons 10–25): deep-dive Lesson 11 "Filtering Your Data" (id:5); on the Worked Example stage confirm the Chart.js "See it on screen" visual DRAWS (canvas not blank) on a chart-type lesson — check Lesson 8 "Dimensions vs. Measures" (id:2, bar chart)
- **Batch 24** — Units 4+5 (Lessons 26–32): deep-dive Lesson 30 "Parameters" (id:19); spot-check 26 (Live vs Extract) and 32 (Dual-Axis, id:20 — its Chart.js dual-axis viz must draw)
- Cross-cut: Viz Builder and Workspace tour must still work (nav → Viz Builder; interface lesson → tour button); legacy quiz-on-intro flow must be GONE (quiz only at stage 6 of 7)
- AI Coach key SHARED with Excel + Python + Power BI (`apk-coach-key`); SQL still separate (`sql-coach-key`)

### Batches 25–26 — STATS kit: full v2 flow (v1.96.0–v1.97.0, all 16 lessons untested)
Same walk pattern as the other kits: deep-dive through all 7 stages (Orient → Worked Example → Try parsons w/ "Stuck? Ask the AI Coach →" on a wrong check → Compare w/ "Ask the AI Tutor →" after wrong → Build wrong-then-right → Quick Check wrong-then-right → Done card + unlock + Practice-this CTA). ⚠️ Stats lesson POSITION = list order: Unit 0 = Lessons 1–4 (ids 101–104), Unit 1 = 5–8 (ids 1–4), Unit 2 = 9–12 (ids 5–8), Unit 3 = 13–16 (ids 9–12).
- **Batch 25** — Units 0+1 (Lessons 1–8): deep-dive Lesson 5 "Mean, Median & Mode" (id:1); ALSO verify Settings (gear) shows the "AI Coach" key field and saves, AND that on Lesson 1 "What Stats Is For" (a no-code concept lesson) the Worked Example shows ALL sections with NO "More detail" button, while Lesson 5 (a code lesson) shows the button and it toggles the prose sections
- **Batch 26** — Units 2+3 (Lessons 9–16): deep-dive Lesson 16 "Confidence Intervals" (id:12) — its Worked Example must draw the Chart.js CI band (canvas not blank); spot-check Lesson 10 "Normal Distribution & Z-Scores" (id:6, line chart draws) and Lesson 13 "Hypothesis Testing" (id:9, html viz)
- Cross-cut: the Distribution Lab (nav) must still work; legacy quiz-on-intro flow must be GONE (quiz only at stage 6 of 7); Lesson 9 "Probability Basics" (id:5) has no drills, so its Done card shows no "Practice this" button
- AI Coach key SHARED with Excel + Python + Power BI + Tableau (`apk-coach-key`); SQL still separate (`sql-coach-key`)

**Total estimate: ~105–120 min across all three kits (+~20 min for Power BI batches 19–21, +~20 min for Tableau batches 22–24).** Full copy-ready SQL tables were given in chat June 30; Python batches follow the identical per-stage pattern.

---

> ### 🧠 CURRENT INITIATIVE — EXCEL LEARNING-SCIENCE POLISH (Phase G next)
>
> Full plan: `EXCEL_POLISH_MASTER_PLAN.md`. Phase roadmap:
> - ✅ **Phase A (v1.78.0):** Foundation fixes (readiness score, tap-choice drills, inline SVG charts, mobile, skip button)
> - ✅ **Phase B (v1.79.0):** Progressive v2 lesson flow on formula-spine lessons (SUM id:1, IF id:2, Nested IF id:14). 7 stages: Orient→Worked Example→Try (Parsons)→Compare→Build (tap-choice)→Own (quiz)→Close. Mike-verified and approved.
> - ✅ **Phase C (v1.80.0):** v2 flow rolled to all 51 Excel lessons. All units 0–10 complete (v1.79.1–v1.79.11).
> - ✅ **Phase D (v1.81.0):** Spaced-recall engine, progressive-artifact bridge, retrieval-honesty note, recall-wins counter, Lucide fix, rating-button radio group, 51-lesson Try-puzzle audit (8 fixed). Mike-verified.
> - ✅ **Phase E (v1.82.0):** Honest unlock card (51 lessons, Close stage, done-gated), return-visit greeting on Home, mentor-voice audit (all 51 close strings passed — no changes needed).
> - ✅ **Phase F (v1.83.0):** Focus/Details toggle in Worked Example — "More details" / "Less" hides/shows Gotcha + intro; persisted to `localStorage['epk-lesson-mode']`. Also: gates removed, free until Aug 1, 2026 — gate redesign parked for after Phase G/H.
> - ✅ **Phase G Mode 1 (v1.83.3–v1.83.5):** AI Coach stuck-help on Try (Parsons) + Build stages. BYOK Anthropic key (localStorage), Haiku model, stage-aware context. Prompt tailors to Parsons ordering hints or Build multiple-choice hints. Error recovery: "Try different key" clears and re-prompts.
> - ✅ **Phase G Mode 3 (v1.83.6–v1.83.7):** Attempt-vs-correct comparison + AI gap analysis on Compare stage. Free side-by-side display; Sonnet reads the gaps. UX polish: "Ask My Tutor" (not "AI Coach"), shows only on incorrect, improved key entry copy, sentiment buttons.
> - **Phase H — Port to SQL · Python · Power BI · Tableau · Stats (one kit per cycle):**
>   - **H2 first (content review):** accuracy audit (technically correct + up to date), relevance audit (real analyst job tasks), friction audit (no jargon/confusion on first read), style audit (mentor voice, consistent across all lessons). Fix content before porting structure. 🔒 LOCKED RULE.
>   - **H1 second (structural port):** v2 lesson flow (Orient→Worked Example→Try→Compare→Build→Own→Close) + AI Coach (Modes 1 & 3) + all cross-kit changes from `EXCEL_POLISH_MASTER_PLAN.md`. 🔒 LOCKED RULE: content review always precedes structural port.
>   - **Kit order:** SQL → Python → Power BI → Tableau → Stats
>   - **Progress:** ✅ SQL (H2 v1.83.8, H1 v1.86.0) · ✅ Python (H2 v1.86.2, H1 v1.87.0–v1.89.0) · ✅ Power BI (H2 v1.89.1, H1 v1.90.0–v1.92.0) · ✅ Tableau (H2 v1.92.1, H1 v1.93.0–v1.95.0) · ✅ Stats (H2 v1.95.1, H1 v1.96.0–v1.97.0) — **🏁 PHASE H COMPLETE. Next per plan: Phase G Mode 2 (mock interview, cross-kit).**
>   - Power BI H1 pattern to follow (same as SQL/Python before it): port the v2 CSS block + engine functions (`v2PyBody`-equivalent, stage get/set, parsons chip tap/check, build pick, quiz answer/retry, reset, AI Coach Modes 1+3) adapted to Power BI's own render architecture, then author `parsons`/`compare`/`build`/`close`/`unlock` fields for all 39 lessons. Check the kit's existing state-object and render-dispatch pattern first (may differ from both SQL's `state`/`navigate` and Python's `S`/`openLesson`).
>   - _(Phase H before Phase G Mode 2 — Mike's call June 30, 2026. Reason: Mode 2 mock interview is designed once for all kits after H is done, not bolted onto Excel alone first.)_
> - **Phase G Mode 2 — Mock interview (after Phase H):** Designed to work across all kits simultaneously. Tied to interview-track units in each kit.
> - **After Phase H → Data Migration Track Audit (all 4 tool kits):** Full interview-readiness review of the Data Migration track (Unit 4) across SQL, Excel, Python, Power BI. Add gap-filler lessons where needed (e.g. SQL id:509 "Comparing Old & New Schemas with JOINs" — LEFT/INNER/RIGHT JOIN in migration context). Audit findings feed Interview kit mock questions. _(Scoped June 30, 2026 — real interview signal: "Explain LEFT vs INNER JOIN with an example.")_
>
> **Cross-kit changes log** (bulk-apply to other kits when Excel polish is done): tracked in `EXCEL_POLISH_MASTER_PLAN.md` → "Cross-kit changes" section.

---

## Proposed Roadmap Items (locked pending mike approval)

### Data Migration Track Audit & Reinforcement (Post-Phase G, all kits)

**Context:** Mike received real interview question: "Explain the difference between LEFT JOIN and INNER JOIN and give an example when to use them." Current Data Migration tracks (Unit 4) across kits lack domain-specific reinforcement on interview fundamentals.

**Scope:** Three-phase work to ensure Data Migration track is interview-ready across all kits.

**Phase 1: Kit-specific SQL/Excel/Python/PowerBI reinforcement (1 lesson per kit)**
- SQL (id:504): "Comparing Old & New Schemas with JOINs" — LEFT vs INNER vs RIGHT in migration context (gap analysis, orphan detection, reconciliation)
- Excel (id:?): Migration scenario + VLOOKUP/INDEX-MATCH for matching old/new records (reconciliation pattern)
- Python (id:?): Pandas merge() left/inner/outer — find missing records, duplicates
- Power BI (id:?): Relationship types (1-to-many, many-to-many) in schema migration

**Phase 2: Cross-kit audit & gap analysis**
- Review all 4 Data Migration tracks (Units 4) for coverage of interview patterns:
  - Schema changes (adding/removing columns, type conversions)
  - Data quality (duplicates, nulls, orphans)
  - Reconciliation (old vs new, pre/post migration validation)
  - Join types in practice (when to use each)
  - Row count validation (grain warnings, duplicates)
  - Backfill/default strategies (handle missing values)
- Identify gaps: Which interview questions would learners fail on?
- Recommend: Add, remove, or reinforce lessons

**Phase 3: Interview Kit integration**
- Proposed Data Migration mock-interview questions (based on Phase 2 audit)
- Tie back to specific lessons learners should review
- Create a "Data Migration Prep" quiz in Interview kit that hits all 4 kits' coverage

**Effort:** Medium (4 lessons + 1 audit sweep + interview questions)
**Priority:** High (real interview signal, ties to job readiness)
**Timeline:** After Phase G ships (early August 2026 estimate)

---

## Phase F — Focus / Details toggle — COMPLETE (v1.83.0)

**File:** `excel/index.html` (single file, ~3000 lines, CRLF line endings, no build step)
**Starting version:** `v1.82.0`

### What it is

A two-mode toggle on every lesson's Worked Example stage. **Focus** (the default) shows just the RAL formula breakdown + the grid visual — the core teaching, zero noise. **Details** expands to also reveal:
- The `l.notes` Gotcha card (edge case / subtle trap)
- The `l.intro` paragraph (background / deeper context)

Both of those fields exist in every lesson object already. The toggle is a thin wrapper — no content is rewritten, just shown or hidden. Preference is saved in `localStorage['epk-lesson-mode']` so it persists across lessons and visits.

SDT rule (same as Phase E): never frame Details as "the real lesson" or Focus as "easy mode." The toggle label is purely functional: **"More details"** / **"Less"**. No star icons, no "Advanced" label.

---

### F1 — Toggle state + localStorage

Add to the top of the page JS (near other state helpers):
```js
function getLessonMode(){ return localStorage.getItem('epk-lesson-mode')||'focus'; }
function setLessonMode(m){ localStorage.setItem('epk-lesson-mode',m); }
```

---

### F2 — Render the toggle + wire it into v2Body

**In `v2Body`, inside the `// ② Worked Example` block**, after the RAL and viz are built but before closing the stage div, add the toggled content:

```js
// ── Focus/Details extras (shown only in 'details' mode) ──────────────
const _mode = getLessonMode();
const _detailsVis = _mode === 'details';
h += `<div id="v2-details-${lid}" style="${_detailsVis?'':'display:none'}">`;
if(l.intro) h += `<div class="card card-sm" style="margin-top:8px;color:var(--dim);font-size:14px;line-height:1.65">${l.intro}</div>`;
h += `</div>`;
// Move the Gotcha inside the details wrapper — replace the existing l.notes block
// (see below: remove the old bare notes render and replace with this)
h += `<div id="v2-gotcha-${lid}" style="${_detailsVis?'':'display:none'}">`;
if(l.notes) h += `<div class="card card-sm" style="border-color:var(--warn);margin-top:8px"><span style="font-weight:700;color:var(--warn)">Gotcha:</span> ${l.notes}</div>`;
h += `</div>`;
// Toggle button
h += `<div style="margin-top:10px"><button class="btn btn-outline btn-sm" onclick="v2ToggleMode(${lid})" id="v2-mode-btn-${lid}">${_detailsVis?'Less':'More details'}</button></div>`;
```

**Remove** the existing bare `l.notes` render (the one-liner at line ~2446) so it doesn't appear twice.

**Toggle handler** (add near other v2 helpers):
```js
function v2ToggleMode(lid){
  const m = getLessonMode()==='focus'?'details':'focus';
  setLessonMode(m);
  const show = m==='details';
  ['v2-details-','v2-gotcha-'].forEach(p=>{
    const el=document.getElementById(p+lid);
    if(el) el.style.display=show?'':'none';
  });
  const btn=document.getElementById('v2-mode-btn-'+lid);
  if(btn) btn.textContent=show?'Less':'More details';
}
```

**Commit:** `v1.82.1 Phase F: focus/details toggle in Worked Example stage`

Bump to **`v1.83.0`** when done. Update `CHANGELOG.md` and this file.

---

### Test checks (3, correct lesson POSITIONS not IDs)

⚠️ Lesson POSITION = `lessonPos(id) + 1`. id:1 = position 5. id:9 = position 13. Never use the id as the position number.

| # | Do this | Expect to see |
|---|---------|---------------|
| F1a | Open Excel Lesson 5 — "Your First Formula" → scroll to the Worked Example stage | RAL breakdown and grid are visible; Gotcha and intro are **hidden**; a small **"More details"** button appears below the grid |
| F1b | Click "More details" on Lesson 5 | The Gotcha card (amber border, "Gotcha:") and intro paragraph slide into view; the button label changes to **"Less"** |
| F1c | Navigate to Excel Lesson 6 — "Make Decisions with IF" (without refreshing) | The Worked Example on Lesson 6 opens in Details mode (persisted) — Gotcha and intro are already visible; button says **"Less"** |

---

## Phase G Mode 1 — AI Coach stuck-help — COMPLETE (v1.83.3–v1.83.5)

**File:** `excel/index.html` (~3050 lines)
**Starting version:** `v1.83.2`
**Decisions locked (June 30, 2026):** Funding = Cap + BYOK escape hatch. Scope = Modes 1+3 first. Models = Haiku for Mode 1 / Sonnet for Mode 3.

### What it is

A learner-facing "Stuck? Ask the coach →" button on two attempt stages:
- **Try it (Parsons):** learner is arranging formula pieces in order; coach hints at the ordering logic without revealing the answer.
- **Build (tap-choice):** learner is choosing the correct formula; coach hints at how to think through the problem.

Both use the same Anthropic key (BYOK via `localStorage['apk-coach-key']`), Haiku model, and stage-aware prompts. No hosted API proxy yet — that's Phase G Mode 3+ scope.

### Implementation notes

- `getCoachKey()` / `setCoachKey()` manage localStorage persistence
- `v2CoachStuck(lid, stage)` opens the panel + prompts for key if missing
- `v2CoachCall(lid, key)` makes the actual Haiku call; context-aware prompt based on `_coachCtx[lid].stage`
- On API error, "Try different key" clears the saved key and re-prompts (fixes the retry bug from v1.83.3)
- Panel ID differs per stage (`v2-coach-build-${lid}` vs `v2-coach-try-${lid}`)

### Shipped commits

```
v1.83.3 Phase G: AI Coach Mode 1 — stuck-help on Build stage (BYOK, Haiku)
v1.83.4 fix: error retry now clears key and re-prompts for new one
v1.83.5 Phase G: add AI Coach to Try (Parsons) stage; stage-aware context
```

### Test checks (DONE ✓)

| # | Do this | Expect to see |
|---|---------|---------------|
| G1a | Open Excel Lesson 5 → Try stage | **"Stuck? Ask the coach →"** button below Reset |
| G1b | Click it → paste Anthropic key → Save & Ask | Coach panel shows 1-2 hints about piece ordering (Haiku, 250 tokens) |
| G1c | Continue to Build stage | **"Stuck? Ask the coach →"** button there too; same key already saved; coach gives Build-specific hints |

---

## Phase G Mode 3 — Attempt-vs-correct gap analysis (NEXT)

**File:** `excel/index.html`
**Starting version:** `v1.83.5`
**Scope:** Build the free **Compare surface** (attempt capture + side-by-side display), then wire Mode 3 AI gap-read on top.

### What it is

**Free tier:** After a learner solves the Try stage (Parsons), they advance to Compare. There, we show:
- Their attempt (the pieces they ordered or the partial answer)
- The correct answer side-by-side
- A visual diff or named gap ("You ordered these 4, but the last two are reversed")

**Premium tier (Mode 3):** A **"Why is that wrong?"** button that calls Sonnet to:
- Read both attempts
- Identify the specific gap ("You used SUMIF instead of SUMIFS — two conditions need -IFS")
- Explain the why ("SUMIF handles one condition; SUMIFS handles multiple")
- Suggest the fix ("Change SUMIF to SUMIFS and adjust the argument order")

Sonnet instead of Haiku because gap analysis is heavier reasoning.

### Build plan

**G3a — Capture and pass attempt forward:**
- In `v2ParsCheck()`, when learner gets Parsons right, save their ordered pieces to a state var or sessionStorage.
- In `v2Body()` Compare stage, retrieve that attempt.
- Do NOT render the full Compare yet — just confirm capture works.

**G3b — Render free attempt-vs-correct side-by-side:**
- Build a `compareHTML(attempt, correct, stage)` helper.
- For Try (Parsons): show learner's pieces in one column, correct pieces in another, highlight diffs.
- For Build (tap-choice): show their selected choice vs. the right choice.
- Render both in the Compare stage before the `l.compare` text.
- Test: does the side-by-side appear? Are attempt and correct both visible?

**G3c — Wire Mode 3 AI button:**
- Add **"Why is that wrong?"** button below the compare display (only on paid entitlement; BYOK for now, same as Mode 1).
- Button calls `v2CoachGap(lid, attempt, correct, stage)`.
- Sonnet prompt: "Here's what the learner tried: [attempt]. Here's the correct answer: [correct]. In 2-3 sentences, name the specific gap and explain why it matters."
- Same error handling + key management as Mode 1.

### Test checks (for implementation)

| # | Do this | Expect to see |
|---|---------|---------------|
| G3a | Open Lesson 5 → Try stage → build a correct Parsons answer → click "Check order" | **✓ Correct!** message; advance to Compare stage |
| G3b | Compare stage opens | **Attempt** (your pieces) and **Correct** (right pieces) shown side-by-side; `l.compare` text below |
| G3c | Click **"Why is that wrong?"** (if BYOK key set) | Sonnet response: specific gap name + why + suggested fix (~100–150 tokens) |
| G3d | Test wrong answer path: Try stage → wrong Parsons answer | "Not quite" feedback; Compare still shows attempt vs. correct; coach button works on the wrong attempt |

### Integration notes

- `_coachCtx` already tracks stage; extend it to also track `attempt` + `correct`.
- `v2CoachCall()` routes based on stage — add a case for `stage==='compare'` with the gap prompt.
- Attempt shape differs: Try = array of pieces (use `JSON.stringify` for display), Build = single choice (use the button label or choice text).
- Sonnet call is higher-token (250–300); consider prompt caching if multiple learners hit the same lesson.

### Decisions still open

None for Mode 3 itself; funding/scope/model are locked. One design choice: Should the **"Why is that wrong?"** button appear unconditionally, or only if the attempt is incorrect? (Recommend: appear always, but the prompt adapts: "They did X, correct is Y. Why is that different?" works for both right and wrong.)

---

## Phase E — COMPLETE (v1.82.0)

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

## ⚠️ Mistakes from the last session — do not repeat

These are real errors from the June 30 session. Read them before touching any file.

1. **Lucide icons inside `v2Body()` don't render.** `v2Body` builds an HTML string that gets injected via `innerHTML`. Lucide's `createIcons()` (called by `refreshIcons()`) runs once after the DOM is set — any `data-lucide` inside the injected string is NOT picked up unless `refreshIcons()` is called again after injection. The Phase F toggle button used `data-lucide="chevron-down"` and the chevron never appeared. Fix: use plain Unicode characters (`▼`/`▲`) or call `refreshIcons()` after injection — DO NOT assume Lucide renders inside dynamically-injected HTML strings.

2. **Test steps were too verbose — Mike called it out twice.** "Expect" cells had multiple clauses, parenthetical explanations, and qualifiers. Mike could not use them. See the test-step rules below — they have been tightened. One short phrase per cell. Nothing else.

3. **Always syntax-check before committing.** Run `node -e "..."` (the inline script extractor pattern already in use) before every `git commit`. This session had 3 commits in a row on the same feature because of avoidable UI bugs caught only after pushing. Catch them before they ship.

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

   **Rules for "Do this" cells:** name the kit, lesson POSITION, lesson
   TITLE, and the section to scroll to. Lead with a verb.

   ⚠️ **LESSON POSITION ≠ LESSON ID.** The Excel kit has 4 Unit 0
   lessons (ids 101–104) before id:1. So id:1 = Lesson 5, id:9 = Lesson
   13, etc. Always compute position as `lessonPos(id) + 1` — the number
   that appears in the lesson list UI next to the title. Mike has
   corrected this 3× — never use the lesson `id` as the lesson number.

   Example of correct format:
   *"Open Excel Lesson 13 — 'Spot and Fix Dirty Data'"*

   Example of WRONG format (uses id, not position):
   ~~*"Open Excel Lesson 9 — 'Spot and Fix Dirty Data'"*~~

   **Rules for "Expect" cells — KEEP THEM SHORT. Mike has corrected this repeatedly.**
   One short phrase. Bold the key thing he's looking for. Nothing else — no parentheticals,
   no sub-clauses, no explanations. If you can't fit it in one line, it's too long.

   Good: `Button flips to **"▲ Hide gotcha & background"**; Gotcha card visible`
   Bad: `The Gotcha card (amber border, "Gotcha:") and intro paragraph slide into view; the button label changes to "Less"`

   **Rules for tech-step instructions (DevTools, localStorage, etc.):**
   Never say "open DevTools console" bare. Write it out: "Press F12 →
   click Console tab → paste X → press Enter → refresh." Mike is not a
   developer — spell every step like it's the first time.

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
| This handoff | `apk_CLAUDE.md` (you're reading it) |
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
- **Never use lesson id as the lesson number in test steps.** The Excel
  kit has 4 Unit 0 lessons (ids 101–104) before id:1. Always use
  `lessonPos(id) + 1` — the number shown in the UI. id:1 = Lesson 5,
  id:9 = Lesson 13. Mike corrected this 3 times. It must never happen
  again.
- **Never write bare "open DevTools" or "run in console" test steps.**
  Write every technical step out fully: Press F12 → Console tab → paste
  → Enter → refresh. Mike is not a developer.

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
2. Read `ROADMAP.md` — confirm "Currently working" line + bucket contents.
3. Read the latest entry in `CHANGELOG.md` — confirm what shipped most recently.
4. Read **Phase G Mode 3** spec in this file (above).
5. `git log --oneline -10` to see recent commits; confirm v1.83.5 is HEAD.
6. **Next task:** Build Phase G Mode 3 — Attempt-vs-correct comparison + AI gap analysis on Compare stage. Start with G3a (capture & pass attempt forward).
7. When ready, ask Mike for the go-ahead on the design choice: "Why is that wrong?" button on all attempts, or only wrong ones?

**Current state:** v1.83.5. Mode 1 (stuck-help) shipped on Try + Build. Mode 3 is the follow-up: free side-by-side display, then premium Sonnet gap-read.

Good luck. He's a great collaborator. Push back when you need to, ship small, test on the live URL, and keep the cycle tight.
