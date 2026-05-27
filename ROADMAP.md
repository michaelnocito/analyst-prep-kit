# Analyst Prep Kit — Roadmap

**Current version:** `v1.2.1` (shipped May 27, 2026 — awaiting test)
**Last cycle closed:** May 27, 2026 — Excel RAL reading order
**Currently working:** _testing v1.2.1_

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

- Lead each "Do" cell with a verb (Open, Click, Complete, Toggle).
- Bold the key part of the "Expect" outcome — the thing the user is
  actually scanning for.
- Optional one-line "why this matters" preface above the table, no
  longer than two sentences.
- No bonus or extra checks below the table — three rows, that's it.
  Anything beyond three becomes a separate test cycle.

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

- **Bare Basics: make the highlight visually unambiguous** _(added May 27, 2026 — 4:52 PM ET)_
  - _What:_ When Bare Basics mode is on, the visual treatment on highlighted lessons currently looks like a default teal accent — users can't tell the highlight has meaning vs. it's just the design. Needs a treatment that's obviously NOT the default style. Options: a persistent visible "★ Bare Basics" label that's always rendered (not behind a pill), a left-border accent stripe, a distinct icon/marker, or a different color entirely (yellow/amber would contrast against the teal accent).
  - _Why it's here:_ Vision Principles #1 and #3 — the user must be able to read the state of the UI at a glance, and explore without confusion about why elements look the way they do. Reported via screenshot from the live site.
  - _Definition of Done:_ A returning user in Bare Basics mode can tell — in under 2 seconds and without reading labels — that something is being highlighted intentionally. Test: open any tool kit's Lessons screen with the mode on; the must-know lessons should look visibly "marked," not just "differently shaded."
  - _Est. effort:_ Small (1 cycle).

_(RAL Excel reading-order shipped May 27, 2026 — see CHANGELOG v1.2.1)_

- **GR-1: Final Exam should default to Home on fresh entry** _(added May 27, 2026 — 5:43 PM ET)_
  - _What:_ Clicking the Final Exam kit card from the hub currently lands the user wherever they last were in that kit (e.g. Study Guide if they previously visited via a `#study` link). That's confusing — they can't find how to start the exam. Fix: when the kit is entered without an explicit hash, force the view to Home; honor hash routing only when present.
  - _Why it's here:_ Vision #2 — discoverability of a core action. Reported during v1.1.0 testing: Mike clicked Final Exam and landed on the Study Guide ("looked like a glossary"), took a moment to figure out how to start the exam.
  - _Definition of Done:_ Fresh entry to `/final/` always lands on Home with the two big CTAs ("Here's what you should know" and "Take the Exam"). Deep links like `/final/#study` and `/final/#exam` still work as before. View state still persists within a session for back-button behavior, but doesn't carry over across fresh entries.
  - _Est. effort:_ Small (1 cycle, single-file change).

_(GR-2 shipped May 27, 2026 — see CHANGELOG v1.2.0)_

### 🟡 Medium
_Definition: polish, batched improvements, OR features with good
engagement ROI that don't bloat the core experience. Batched into
planned cycles._
_Response time: next planned cycle._

- **GR-A: Bare Basics needs cross-kit handoff flow** _(added May 27, 2026 — 7:42 PM ET; Mike suggested parking lot but I'm overriding to Medium — see reason below)_
  - _What:_ Bare Basics mode currently highlights must-know lessons within a kit, but when the user finishes the last must-know lesson in (say) SQL, there's no "Next: Excel bare basics →" prompt. Need:
    1. End-of-last-basics CTA inside each kit: when the user completes their final core lesson with Bare Basics on, the lesson-complete view shows "Next bare basics: [Kit Name] →" pointing to the next kit in learning order.
    2. Hub indicator: the Bare Basics entry card could show "X of 7 subjects complete in Bare Basics" so the user sees a cross-kit progress signal at the hub.
  - _Why it's here:_ Vision Principle #2 ("always know what to do next"). The mode we just shipped actively contradicts this principle at the moment of biggest engagement opportunity — when someone finishes a kit's must-knows and is most ready to continue.
  - _Why not Parking Lot:_ Doesn't match Parking Lot criteria. Not speculative (ROI is direct on a mode we just shipped). Not a big overhaul (per-kit small JS edit). Not low impact (active mode currently has a continuity gap). Promoted to Medium.
  - _Definition of Done:_ With Bare Basics ON: finishing the last must-know lesson in a kit shows a primary CTA pointing to the next kit's bare basics (or "Final Exam →" after Interview). The hub's Bare Basics card shows cumulative progress across kits. Tested by walking through SQL → Excel handoff manually.
  - _Est. effort:_ Small-Medium (1 cycle).

- **"Say It Out Loud": add literal spoken-aloud reading above every RAL block** _(added May 27, 2026 — 4:52 PM ET, refined May 27, 2026 — 6:25 PM ET)_
  - _What:_ Above each formula/query, render a one-line spoken-aloud version of how a person would actually pronounce it word-by-word. **NOT** a paraphrase of what it does — the literal speech. Examples:
    - `=SUM(A4:A10)` → "Give me the sum of A4 to A10."
    - `=AVERAGE(C2:C20)` → "Give me the average of C2 to C20."
    - `revenue = 144.50` → "Revenue equals one hundred forty-four dot fifty."
    - `SELECT name FROM customers WHERE status = 'active'` → "Select name from customers where status equals 'active.'"
    The breakdown lines (function → arguments, per the order fix) follow below.
  - _Why it's here:_ The methodology is literally called "Say It Out Loud." The leading line should be exactly what you'd say. Refined per Mike's feedback (May 27, 6:25 PM ET) — the original spec said "paraphrase" which is wrong for the methodology.
  - _Definition of Done:_ Every RAL block in every kit (Excel, SQL, Python, Tableau, Stats, Power BI, Interview, and the Say-It-Out-Loud demo on the hub) has a literal spoken-aloud line above the breakdown. Tone is conversational ("Give me…", "Get the…"), not instructional ("Find the…"). Verified by reading one example per kit aloud — if it doesn't sound like normal speech, rewrite.
  - _Est. effort:_ Medium-Large (1–2 cycles, mostly content authoring).
  - _Depends on:_ High item "Say It Out Loud breakdown reads in wrong order" shipping first.

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
