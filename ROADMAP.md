# Analyst Prep Kit — Roadmap

**Current version:** `v1.1.0` (shipped May 27, 2026)
**Last cycle closed:** May 27, 2026 — feedback batch #1 High items
**Currently working:** _nothing — awaiting testing on v1.1.0_

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

(empty — last cycle shipped May 27, 2026; see CHANGELOG v1.1.0)

### 🟡 Medium
_Definition: polish, batched improvements, OR features with good
engagement ROI that don't bloat the core experience. Batched into
planned cycles._
_Response time: next planned cycle._

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
