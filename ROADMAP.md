# Analyst Prep Kit — Roadmap

**Current version:** `v1.67.0` (shipped June 23, 2026 — 🎨 GRAIN **Phase 2e**: Stats kit — all 6 core lesson kits now Grain. Awaiting Mike's playtest.)

> ### 🎨 GRAIN REDESIGN — IN FLIGHT (multi-phase, one phase per cycle)
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
>   **All 6 core lesson kits done.** Remaining surfaces: Chart Literacy · Forecasting · Interview ·
>   Simulator (Claude-API) · Final. (Stats uses the more-robust disconnect observer + poll-for-Lucide;
>   consider retrofitting that to the earlier kits if any icon-load flakiness shows up.)
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

_(GR-F-1, GR-F-2, GR-F-3 shipped May 28, 2026 — see CHANGELOG v1.4.1)_

_(GR-H shipped June 12, 2026 (v1.54.1) — root cause was the top-anchored toast in Tableau/Excel/Python hiding via translateY(-80px) with no fade, leaving its bottom half over the sticky nav; now fades + fully clears. Other kits were never affected (they hide with opacity:0). Same release: Chart.js now `defer` in Tableau/Stats — was render-blocking and caused the intermittent page-load delay Mike reported.)_

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

- **GR-D: Real-world non-tech analogies in every help/explanation** _(added May 27, 2026 — 8:00 PM ET)_ — _PARTIALLY SHIPPED June 2, 2026 (v1.18.0): all 72 lesson intros/openers now lead with an analogy across all 6 kits. REMAINING: quiz explanations, glossary entries, `say` lines, and "Watch out"/"On the job" blocks._
  - _What:_ Every "intro" / "Think of it as" / "On the job" / "Watch out" / `say` / quiz-explanation / glossary block should anchor on a concrete real-world non-tech analogy, not just a clearer technical paraphrase. Example: instead of *"VLOOKUP pulls a value from another table by matching a key. Think of it as: find this ID in that list, then bring back the value from a specific column,"* something like *"VLOOKUP is like a phone book — you look up someone's name, and it brings back their phone number."*
  - _Why it's here:_ Direct serve of the product's pedagogy promise (plain language for beginners). High impact for the target audience. Mike asked for this across "all the help areas" — pattern applies across all kits.
  - _Approach:_ Slice by kit. Excel first (where Mike is testing). Each kit gets a content pass: rewrite intros and key explanations to lead with a real-world analogy. Keep the technical detail beneath, but the FIRST sentence in every helper block is the analogy.
  - _Definition of Done:_ Excel pass complete = every intro, every "on the job" sidebar, every quiz explanation, and every `say` line either contains a real-world analogy or is a literal pronunciation of a formula (which doesn't need one). Spot-check by reading any random help block — if the FIRST sentence doesn't include a non-tech comparison or concrete scenario, rewrite. After Excel ships, repeat for SQL, Python, Tableau, Stats, Power BI, Interview. Sim and Final Exam already use scenarios, so they need a lighter pass.
  - _Est. effort:_ Medium per kit-slice (≈1 cycle per kit, 7 kits to fully complete).

_(GR-A shipped June 2, 2026 — Bare Basics cross-kit handoff CTA across all 6 lesson kits — see CHANGELOG v1.17.0. The optional hub "X of 7 subjects" indicator was NOT done — promote if Mike wants it.)_

_(SIOL rollout shipped May 28, 2026 — see CHANGELOG v1.3.0. Tableau and Stats use a sections-based render rather than the RAL chunk pattern; deferred — see new Parking Lot entry.)_

- **Per-kit mini exam at the end of each subject** _(added May 27, 2026 — 4:05 PM ET)_ — _SHIPPED June 2, 2026 (v1.19.0) via the reuse path: each kit's nav has an "📝 Exam" entry that deep-links to its Final Exam section (per-section submit from GR-C), no content duplication. REMAINING follow-on: mark the kit "complete" on the hub when passed._
  - _What:_ Each tool kit (Excel/SQL/Python/Tableau/Stats/Power BI/Interview) gets its own short closing exam — ~6–8 questions, the same MC + fill-in pattern as the Final Exam Kit. Lives as a new tab inside each kit (e.g. "Exam") so the user finishes a kit with a clear win condition. Reuses and extends the question pool already in `final/index.html`.
  - _Why it's here:_ User explicitly asked for this and suggested parking lot, but I'm promoting to Medium. Reasoning: it directly serves Vision #2 (after each mini exam, "what's next" is unambiguously the next kit) and reuses an existing pattern with minimal new structure. The Final Exam stays as the cross-subject capstone. Doesn't add UI clutter — slots into the existing kit tab bar.
  - _Definition of Done:_ Every tool kit has an "Exam" entry in its nav; passing the mini exam visibly marks the kit "complete" on the hub (ties to the High items above); failing points back to weak lessons. The Final Exam Kit's per-subject question pool is the source of truth — no content duplication.
  - _Est. effort:_ Medium-Large (likely 1–2 cycles depending on whether we factor a shared exam component or just clone the pattern).

### 🟢 Low
_Definition: ideas worth remembering, future features, "wouldn't it be
cool if…" Hold until the backlog above is empty, OR until the same idea
surfaces twice (auto-promote to Medium on second mention)._
_Response time: when there's air to breathe._

- **Complete old→new cross-links across the remaining kits** _(added June 9, 2026 — 8:05 PM ET)_
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
