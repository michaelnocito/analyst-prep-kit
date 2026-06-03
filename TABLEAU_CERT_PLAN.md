# Tableau Cert Beef-Up — Build Plan (cert-critical subset)

Companion to `TABLEAU_CERT_HANDOFF.md`. Architect-approved plan, June 3, 2026.
Scope = the cert-critical subset Mike chose (Domain 1 mini-unit + Sets +
Hierarchies + Parameters + Dual-axis). 7 new lessons, **all appended (no
renumbering of existing lessons 1–13, no remap of existing LESSON_DRILLS)**.

## Approach decision
- **Append new lessons at the end** as two new units → zero ripple to existing
  ids/drills (next/prev nav uses id+1, so ids must stay contiguous; appending
  keeps that true). Trade-off: the new "Connecting & Preparing Data" unit renders
  *below* the fundamentals rather than first — acceptable for a cert add-on.
- **Two new units** so each renders as one contiguous block in `renderLessonList`
  (which groups by first-seen `unit` string):
  - **Unit 4: Connecting & Preparing Data (Cert Domain 1)** — L14–16
  - **Unit 5: Sets, Hierarchies, Parameters & Dual-Axis (Cert Domain 2)** — L17–20
- **Dataset:** do NOT enrich `CONTOSO`. Teach with `html`/`table` mocks (the
  Grouping-lesson pattern); the only Chart.js change is a dual-axis `y1` branch
  in `drawLessonChart` for L20 (reuses existing month/revenue/units).

## The 7 lessons (in build/cycle order)

| Cycle | New id | Unit | Title | slug | Viz | Drills → LESSON_DRILLS |
|---|---|---|---|---|---|---|
| 1 | 14 | Unit 4 | Live vs. Extract Connections | `connections` | html 2-panel | `14:[['esql',13],['wrong',12],['fills',13]]` |
| 2 | 15 | Unit 4 | Joins, Unions & Relationships | `data-model` | html 3 mini-tables | `15:[['esql',14],['wrong',13],['fills',14]]` |
| 3 | 16 | Unit 4 | Managing Data Properties | `data-properties` | table before/after | `16:[['esql',15],['fills',15],['bugs',13]]` |
| 4 | 17 | Unit 5 | Sets | `sets` | html IN/OUT | `17:[['esql',16],['wrong',14],['fills',16]]` |
| 5 | 18 | Unit 5 | Hierarchies | `hierarchies` | html drill +/− | `18:[['esql',17],['fills',17],['bugs',14]]` |
| 6 | 19 | Unit 5 | Parameters | `parameters` | html dial mock | `19:[['esql',18],['wrong',15],['fills',18]]` |
| 7 | 20 | Unit 5 | Dual-Axis & Combined-Axis | `dual-axis` | Chart.js y1 (new branch) | `20:[['esql',19],['wrong',16],['parsons',12]]` |

Each lesson must include: an everyday analogy intro, a "say it out loud"
breakdown, a **misconception to bust**, and a **"when to use which" decision
aid**. Per-lesson specs (analogies, RAL points, misconception, drill text) are in
the architect's output — see chat transcript / regenerate if needed.

## Drill-index allocation (all new appends; no reuse → preserves "each drill
appears once in the guided path")
- FILLS: 13,14,15,16,17,18  · ESQL: 13,14,15,16,17,18,19
- WRONG: 12,13,14,15,16  · BUGS: 13,14  · PARSONS: 12
- Per-array shapes differ: ESQL/BUGS `choices[0]=correct`; FILLS `ans`+`choices`;
  WRONG `opts`+`ans` index; PARSONS `pieces`+`ans`; lesson `quiz` `opts`+`ans`.

## Cycle pacing
Default 7 cycles, one lesson each, MINOR bump per lesson, CHANGELOG/ROADMAP + ET
timestamp + headless verify each cycle. Optional bundles to PROPOSE (need Mike's
OK): {L17+L18 organize wave}, {L14+L15+L16 Domain-1 wave}.

## Risks / gotchas
1. **Finish line shifts**: L13 was last (showed "Try the Final Exam"); after
   appending, that moves to L20. Add a test check for it (automatic via
   `DATA.LESSONS.length`).
2. **Don't reuse existing unit strings** for the new lessons or you get a 2nd
   "Unit 2" block — use the new Unit 4 / Unit 5 strings.
3. **Match each drill array's shape** exactly (easy to give WRONG a `choices`
   array by mistake).
4. **Never reuse an existing drill index** in LESSON_DRILLS (double-counts).
5. **Dual-axis (L20)** is the only logic change — `drawLessonChart` gets a `y1`
   scale + per-dataset `yAxisID`/`type`; run the headless `new Function(src)`
   syntax check after that cycle. Chart.js already loaded.
6. html tables → wrap in `overflow-x:auto` for mobile.
7. No free-text anywhere — all 18 new drills are tap-the-choice/ordering.

## Only file that changes
`tableau/index.html` — append to `DATA.LESSONS`, the 5 drill arrays, and
`LESSON_DRILLS`; add the dual-axis branch to `drawLessonChart` (cycle 7 only).
