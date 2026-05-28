# Analyst Prep Kit — Roadmap

**Current version:** `v1.4.1` (shipped May 28, 2026 — awaiting test)
**Last cycle closed:** May 28, 2026 — Pedagogy fixes (SQL/Power BI/Python)
**Currently working:** _testing v1.4.1 (v1.2.3, v1.3.0, v1.4.0 still queued)_

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

- **GR-E: Bug Hunt drills need a "type your fix" input + validation** _(added May 28, 2026 — 12:39 AM ET)_
  - _What:_ The Bug Hunt drill in SQL Practice (and the equivalents in Excel and Python) shows the broken query and an error message, but the only actions are "Reveal Fix" and "Show Hint." There's no input field for the user to try their fix first. Add a textarea (or input) where the user types their proposed corrected query/formula/code; on submit, validate against the expected fix; show pass/fail feedback; and only THEN make "Reveal Fix" available as a fallback.
  - _Why it's here:_ Practice surfaces are supposed to let users practice. Right now Bug Hunt is read-only — the user can't make a real attempt before being given the answer. Vision Principle #3 ("free to explore") and the broader "retrieval beats re-reading" learning-science principle that the rest of the kit honors.
  - _Approach:_ Start with SQL (where Mike hit it). Add input field + validate-answer + pass/fail UI to the bug-hunt drill component. Validation can be string-compare against the data's `fix` field, with some normalization (whitespace, casing on keywords). Reveal/Hint buttons stay available. After SQL ships, replicate in Excel and Python (same drill pattern, same data shape).
  - _Definition of Done (SQL slice):_ Each SQL bug-hunt drill shows a textarea pre-populated with the broken query (or empty), a "Check My Fix" button, a pass/fail message, and the existing Reveal/Hint buttons available throughout. Tested across the 12 SQL bug-hunt drills.
  - _Est. effort:_ Medium per kit slice. SQL first (1 cycle), then Excel + Python (1 cycle each, or bundled if patterns are identical).

- **GR-C: Final Exam — per-section submit + cumulative overall grade** _(added May 27, 2026 — 8:00 PM ET)_
  - _What:_ The Final Exam currently requires answering all 28 questions and submitting once. Restructure so each subject section (Excel, SQL, Python, Tableau, Stats, Power BI, Interview) can be submitted independently. On per-section submit, that section locks and shows its immediate grade. When every section is submitted, the Results page shows an overall grade plus the existing per-section breakdown.
  - _Why it's here:_ Vision #2. Mike hit this during normal Bare Basics flow — finished Excel, got the "try the Final Exam" CTA, landed in the Final Exam, answered just the SQL questions, and had no way to submit and check his understanding without committing to the full 28. The "checkpoint as I go" pattern is what users actually do.
  - _Synergy:_ When this ships, the existing Medium item "per-kit mini exam" may simplify to "launch the Final Exam's [subject] section in standalone mode from inside the kit" rather than building separate mini-exam kits. Revisit the mini-exam scope after GR-C ships.
  - _Definition of Done:_ In `final/index.html`, each section header gets its own "Submit this section" button. State model adds `submittedSections` (set of section keys). On per-section submit, that section locks (answers become read-only), shows that section's score inline. Results page renders only-submitted sections plus a partial overall, with a "complete the remaining sections" hint. Full-overall grade displays once all 7 sections are submitted.
  - _Est. effort:_ Medium (1 cycle, mostly state-model + render changes in one file).

_(Bare Basics highlight visual unambiguity shipped May 28, 2026 — see CHANGELOG v1.4.0)_

_(RAL Excel reading-order shipped May 27, 2026 — see CHANGELOG v1.2.1)_

_(GR-1 shipped May 27, 2026 — see CHANGELOG v1.2.3)_

_(GR-2 shipped May 27, 2026 — see CHANGELOG v1.2.0)_

### 🟡 Medium
_Definition: polish, batched improvements, OR features with good
engagement ROI that don't bloat the core experience. Batched into
planned cycles._
_Response time: next planned cycle._

- **GR-D: Real-world non-tech analogies in every help/explanation** _(added May 27, 2026 — 8:00 PM ET)_
  - _What:_ Every "intro" / "Think of it as" / "On the job" / "Watch out" / `say` / quiz-explanation / glossary block should anchor on a concrete real-world non-tech analogy, not just a clearer technical paraphrase. Example: instead of *"VLOOKUP pulls a value from another table by matching a key. Think of it as: find this ID in that list, then bring back the value from a specific column,"* something like *"VLOOKUP is like a phone book — you look up someone's name, and it brings back their phone number."*
  - _Why it's here:_ Direct serve of the product's pedagogy promise (plain language for beginners). High impact for the target audience. Mike asked for this across "all the help areas" — pattern applies across all kits.
  - _Approach:_ Slice by kit. Excel first (where Mike is testing). Each kit gets a content pass: rewrite intros and key explanations to lead with a real-world analogy. Keep the technical detail beneath, but the FIRST sentence in every helper block is the analogy.
  - _Definition of Done:_ Excel pass complete = every intro, every "on the job" sidebar, every quiz explanation, and every `say` line either contains a real-world analogy or is a literal pronunciation of a formula (which doesn't need one). Spot-check by reading any random help block — if the FIRST sentence doesn't include a non-tech comparison or concrete scenario, rewrite. After Excel ships, repeat for SQL, Python, Tableau, Stats, Power BI, Interview. Sim and Final Exam already use scenarios, so they need a lighter pass.
  - _Est. effort:_ Medium per kit-slice (≈1 cycle per kit, 7 kits to fully complete).

- **GR-A: Bare Basics needs cross-kit handoff flow** _(added May 27, 2026 — 7:42 PM ET; Mike suggested parking lot but I'm overriding to Medium — see reason below)_
  - _What:_ Bare Basics mode currently highlights must-know lessons within a kit, but when the user finishes the last must-know lesson in (say) SQL, there's no "Next: Excel bare basics →" prompt. Need:
    1. End-of-last-basics CTA inside each kit: when the user completes their final core lesson with Bare Basics on, the lesson-complete view shows "Next bare basics: [Kit Name] →" pointing to the next kit in learning order.
    2. Hub indicator: the Bare Basics entry card could show "X of 7 subjects complete in Bare Basics" so the user sees a cross-kit progress signal at the hub.
  - _Why it's here:_ Vision Principle #2 ("always know what to do next"). The mode we just shipped actively contradicts this principle at the moment of biggest engagement opportunity — when someone finishes a kit's must-knows and is most ready to continue.
  - _Why not Parking Lot:_ Doesn't match Parking Lot criteria. Not speculative (ROI is direct on a mode we just shipped). Not a big overhaul (per-kit small JS edit). Not low impact (active mode currently has a continuity gap). Promoted to Medium.
  - _Definition of Done:_ With Bare Basics ON: finishing the last must-know lesson in a kit shows a primary CTA pointing to the next kit's bare basics (or "Final Exam →" after Interview). The hub's Bare Basics card shows cumulative progress across kits. Tested by walking through SQL → Excel handoff manually.
  - _Est. effort:_ Small-Medium (1 cycle).

_(SIOL rollout shipped May 28, 2026 — see CHANGELOG v1.3.0. Tableau and Stats use a sections-based render rather than the RAL chunk pattern; deferred — see new Parking Lot entry.)_

- **Per-kit mini exam at the end of each subject** _(added May 27, 2026 — 4:05 PM ET)_
  - _What:_ Each tool kit (Excel/SQL/Python/Tableau/Stats/Power BI/Interview) gets its own short closing exam — ~6–8 questions, the same MC + fill-in pattern as the Final Exam Kit. Lives as a new tab inside each kit (e.g. "Exam") so the user finishes a kit with a clear win condition. Reuses and extends the question pool already in `final/index.html`.
  - _Why it's here:_ User explicitly asked for this and suggested parking lot, but I'm promoting to Medium. Reasoning: it directly serves Vision #2 (after each mini exam, "what's next" is unambiguously the next kit) and reuses an existing pattern with minimal new structure. The Final Exam stays as the cross-subject capstone. Doesn't add UI clutter — slots into the existing kit tab bar.
  - _Definition of Done:_ Every tool kit has an "Exam" entry in its nav; passing the mini exam visibly marks the kit "complete" on the hub (ties to the High items above); failing points back to weak lessons. The Final Exam Kit's per-subject question pool is the source of truth — no content duplication.
  - _Est. effort:_ Medium-Large (likely 1–2 cycles depending on whether we factor a shared exam component or just clone the pattern).

### 🟢 Low
_Definition: ideas worth remembering, future features, "wouldn't it be
cool if…" Hold until the backlog above is empty, OR until the same idea
surfaces twice (auto-promote to Medium on second mention)._
_Response time: when there's air to breathe._

(empty)

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
