# Analyst Prep Kit — Roadmap

**Current version:** `v1.0.0` (tentatively stable, in testing)
**Last cycle closed:** 2026-05-27 — first stable release
**Currently working:** _nothing — awaiting feedback batch from testing_

---

## The workflow (one-man team, lightweight)

This is the loop. Keep it tight.

1. **Test** — Mike runs through the live site as a real user would,
   collecting issues in plain language.
2. **Triage** — every item is sorted into one of the four priority
   buckets below. Each item gets a one-line "Definition of Done."
3. **Work the top occupied bucket to completion** before accepting more
   feedback. The only exception is feedback _about an item already in
   flight_ (e.g. "the fix you just shipped didn't take, here's a
   repro").
4. **Tag a new version** when the bucket clears. PATCH for bug-only
   work, MINOR for visible features. Commit messages reference the
   roadmap item.
5. **Resume testing.** Repeat.

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
_Definition: visible bug or UX miss that hurts trust or learning.
Wrong content in a high-traffic spot, broken link, confusing label,
copy that contradicts itself between kits._
_Response time: current cycle. Clear before accepting new feedback._

(empty)

### 🟡 Medium
_Definition: polish. Minor visual inconsistencies, copy improvements,
nice-to-haves that don't block anyone but make the product feel more
professional. Batch into a single planned cycle._
_Response time: next planned cycle._

(empty)

### 🟢 Low
_Definition: ideas, future features, "wouldn't it be cool if…" Hold
until the backlog above is empty, OR until the same idea surfaces
twice (auto-promote to Medium on second mention)._
_Response time: when there's air to breathe._

(empty)

---

## Parking lot (deferred — don't lose, don't work yet)

Things that came up in conversation but were explicitly punted:

- **Within-lesson highlighting in Bare Basics mode** — currently the
  mode only highlights _which lessons_ are must-knows. Going deeper
  (highlighting specific drills or sections inside a lesson) was
  discussed but deferred. Promote to a bucket if testing shows the
  lesson-level highlight is insufficient.
- **CSS variable unification** — kits use a mix of `--text/--dim/
  --border` and `--txt/--txt2/--bord`. Invisible to users; pays off
  every future edit. Audit recommendation from the consistency review.
- **Cleanup of orphaned sprint CSS** in each kit's stylesheet (see
  CHANGELOG "Known orphans"). Cosmetic only.

---

## How to add an item to this file (for future-you)

```
### <bucket>

- **<short title>** — <one-sentence describe the bug or feature>
  - _Where:_ <file path or URL>
  - _Repro / context:_ <how to see it>
  - _Definition of Done:_ <what "fixed" looks like>
```

Move the whole block to CHANGELOG with a date stamp once shipped.
