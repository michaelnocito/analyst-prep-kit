# DRILL-FIRST — concept spec for the Analyst Prep Kit

Status: concept, not built. Written 2026-07-28 for a Real Test paper walkthrough.
Canon it inherits: `C:\Users\Mike\Projects\sql-drill\DRILL_BIBLE.md`.

---

## The flip

Today a kit unit is: read the concept, then practise it.
Drill-first makes a unit: **type it, type it again without help, then read why it worked.**

The verb of the kit becomes *doing*. Concepts stay in the building, one click away, and
they never open the unit.

The mentor model: a patient senior analyst sits next to you, writes the query, says
"type that", and only explains after you have run it.

---

## The unit

A unit is one ladder of **12 items** on one dataset, answering one business question.
Ladder rule from the Drill Bible, unchanged: each item is the previous item **plus one
new thing**, and the learner retypes the whole thing every time. Nothing unrelated.

A unit is two passes over the same 12 items.

### Pass 1 — Shown (12 reps)

Everything is on screen. The learner types it, runs it, sees real rows.

Per item, in this order, and nothing else:

1. One line: what this item adds.
2. Box 1: the comment header to paste (Purpose / Source with the grain / optional Note).
3. Box 2: the clean, complete, runnable code to type.
4. One prequestion, one line, before they run it: "more rows or fewer than last time?"
5. The directive, alone on the last line.

No grading, no score, no hiding. If they ask for the answer they already have it.

### Pass 2 — Now you try (same 12 items)

Same 12 items, same order, **prompt only**. The learner writes it from the business
question. Per item they can **attempt** or **pass on it**.

Reveal ladder on attempts:

| Attempt | What appears |
|---|---|
| Miss 1 | The first half of the code |
| Miss 2 | Three quarters of it |
| Miss 3 | The whole code, shown but never pasted in — it gets typed |

Every item lands in exactly one bucket:

- **Cleared** — got it right. Leaves the pool.
- **Missed** — attempted and failed. Goes to the missed pile.
- **Skipped** — passed on it. Goes to a *separate* skipped pile, never mixed with missed.

### The loop

Round 2 = pass 2 over the **missed pile only**. Then round 3 over what is still missed.
Rinse until the missed pile is empty.

When it is empty, two offers and no third: **try the ones you skipped**, or **run the
whole unit again**.

---

## Where concepts live

- After an item is cleared, one short "what that did" line under it. One sentence.
- At the end of the unit, a collapsed **What you just learned** card. Collapsed by default.
- Anywhere a learner is stuck: one small link, **"Having trouble? Explore this concept."**
  It opens the existing kit lesson in the kit. It is small, it is never the primary action,
  and it never appears above the editor.
- The old lesson path stays fully available from nav. Nobody is forced through drills.

---

## Adopted from the drill agents, unchanged

**Learning science** (Drill Bible Part 3): generation effect is the product; worked example
first (pass 1) is why the blank editor in pass 2 works; immediate real rows; spacing by
re-typing the same clause at N+3 and N+7; retrieval practice is pass 2 and it is finally
allowed to be graded here, because the missed pile is the whole mechanic.

**Friction budget** (Part 4): one action per message or screen; two code boxes, never
three; no preamble; no re-posting a finished item; the directive is always the last thing
and survives scrolling; answer on request, instantly; full absolute paths.

**Comment style** (Part 5): every item carries the three-line header. Purpose states
analytical intent, Source names the grain, Note earns its place or is dropped. Twelve reps
per unit makes the header reflex, and that is the actual transfer to a job.

**Element placement** (the live page, `analyst-prep-kit/drill/index.html`): drill text
left, real editor and real rows right. Desktop is the surface. The code never shrinks to
fit a phone; small screens get a heads-up instead. The editor is SQLED
(`analyst-prep-kit/assets/sqled/`) with highlighting, completion off the live schema,
Ctrl+Enter to run.

**Never** a leaderboard, a streak, a timer, or anything a learner could try to beat.

---

## Per-kit shape

| Kit | What "run it" means | Correctness check |
|---|---|---|
| SQL / Power BI (DAX) | sql.js returns rows | compare result set to the reference query |
| Python | Pyodide runs it | compare printed output / returned value |
| Excel | formula evaluates on a live grid | compare cell value |
| Tableau | build the shelf | compare shelf state |
| Stats | compute the statistic | compare the number |

Everything is a result comparison, never string-matching the code. Two correct queries
that return the same rows are both correct.

---

## The rotation trial (built 2026-07-29)

Mike asked to walk the pathing rather than read about it, so one lap is built and live at
`analyst-prep-kit/path/` (noindex, not linked from any nav yet).

The lap, in this order and no other: **primer → type → lesson → mini quiz → checkpoint.**

- **Primer.** Six lines, one idea each. Only enough to type rung 1 without guessing.
- **Type.** Six rungs, Unit 1 clauses only (SELECT, FROM, WHERE, AND, ORDER BY, LIMIT, and
  a COUNT that shows a query always hands back a table). Pass 1 rules, so the reference
  query is on screen the whole time. Ladder in `path/ladder.js`, every row count verified
  against the baked drill database.
- **Lesson.** Hands off to the real kit lessons (`sql/#lesson-1`, `-2`, `-104`, `-3`) in a
  new tab. It does not restate them; a second copy of Unit 1 would drift.
- **Mini quiz.** Four questions, one per lesson, taken from the kit's own lesson quizzes.
- **Checkpoint.** The SQL section of the existing Final Exam Kit (`final/#exam-sql`),
  called a readiness check, never a certification. Its own bank comes later.

Settled with Mike before building: one lap only, Unit 1 only, lesson page rather than
read-aloud, six typed items. Pass 2 stays parked, so the open question below is not
blocking the trial.

Next decision after he walks it: whether the rotation is one round per unit (4 rounds) or one
round per lesson, and where the second checkpoint lands.

### Real Test runs 007 and 007b, and what they changed

Two passes, both aimed at the feel of the buttons. What they caught, and what shipped:

- **The forward button sat above the result table.** Colour, motion and the directive all
  said "go forward" while the rows the query was run for sat below, silent. Moved below the
  table; Run stays beside the editor. Rows capped at 12, not 50.
- **The lesson tab was a dead end.** `/sql/#lesson-1` is a 4,441px page carrying four
  back-shaped controls, none of which returns to the round. Fixed on the kit side: the round
  links with `?from=path`, and `sql/index.html` renders one persistent "Back to the SQL Path
  round" pill when that param is present. Nobody arriving any other way sees it. The path
  page also gets its own favicon and a title that does not start with "SQL", because the two
  tabs were indistinguishable in a tab strip.
- **The finish card ignored the score.** Same congratulation for 0 of 4 as for 4 of 4, and
  the loud button pointed at the scored checkpoint. The card now states typed / opened /
  score, and under 3 of 4 the loud button becomes another round.
- **The error copy sent the tester to the wrong repair.** "no such column: country" reads to
  an Excel user as "the table has no country column". Now names the cause in words, shows
  both spellings, and quotes the engine second.
- Smaller: `<a><button>` nesting removed (two tab stops for one control), the checkpoint link
  labelled as opening a new tab, lessons marked "opened", every directive line says where
  its control is, and the primer runs two columns so Start typing clears the fold.

Known and not fixed:

- The Start-typing collision with the directive bar returns below a **676px viewport**
  (measured). A maximised browser on 1366x768 clears it by 25px.
- The 0.42s pop on the forward button fires roughly 990px from where the eye was at Run.
  Mike's eyes are the only instrument for whether it registers.
- The Copy button above the editor still exists on a page built for typing. Mike's call.
- "round" replaced "lap" and "rotation" on screen, on the same precedent as "rung".

## Pass 2 built (2026-08-01)

Mike's call: the round becomes the kit's front door, full lessons stay in nav, and pass 2
gets built before units 2 to 4. Only SQL for now; the other ten kits wait until this proves
out.

The round is five steps: **primer → type → recall → lesson → mini quiz → checkpoint.**
Recall is pass 2 and sits before the lesson, because the concept is type it, type it again
without help, *then* read why it worked.

**Recall is the same screen, not a second one.** This is the correction after the first
build: it shipped as a separate pane with its own layout and its own copy, which read as a
different page and hid the mechanic. There is one screen. Recall is that screen with the
left-hand query covered up, and every miss uncovers more of it in place.

What shipped in `path/index.html`:

- **The cover-up.** Same layout, same two panes, same buttons. The query box on the left
  holds grey bars the width of the code they stand in for, so uncovering never shuffles the
  query around the screen. Copy is hidden, because there is nothing to copy and copying is
  the enemy.
- **The blank pass.** Same six items, same order, the business question and nothing else.
  Two buttons: Run, and Pass on this one.
- **Buckets.** Cleared, missed, skipped, shown as a live tally above the panes. Skipped is
  never mixed into the missed loop.
- **The loop.** When the pool empties, the missed pile becomes the next round, and so on
  until it is empty. The rung label switches from "Query 3 of 6" to "Round 2 · 1 of 1".
- **Reveal ladder.** Miss 1 uncovers the first half of the query, miss 2 three quarters,
  miss 3 all of it. The cut is on characters, not lines: on a two-line query a line-based
  half and three quarters round to the same thing, which puts back the dead second swing
  this ladder exists to remove. The code is uncovered in the left pane only — the editor is
  never prefilled, so it gets typed out. An item cleared after the full uncover is **not**
  counted as cleared; it goes back in the missed pile, because copying the answer back in is
  not retrieval.
- **A query that errors is not an attempt.** The ladder only moves on a query that ran and
  returned the wrong table, so a typo costs nothing.
- **Correctness is a result comparison**, never a string match on the code. The reference
  result is computed at boot by running the ladder's own query, so nothing is hand-kept in
  sync. Column order counts; SQL text never does.
- **The wrong-answer line names the actual difference**: row count, column count, or same
  shape with different contents. Row count alone produced "You got 500 rows; the answer has
  500" whenever the columns were wrong.
- **The end card** offers the two from the spec, "try the ones you passed on" and "write all
  six again", plus the way on to the lesson.
- The finish card and the checkpoint now read recall as well as the quiz. Fewer than five of
  six from memory makes another round the loud button, not the scored exam.
- Recall state survives a closed tab, or round 3 of the missed pile would lose the pile.

Deliberate deviation from the spec: the concept doc says two offers and no third. Recall
sits inside a round rather than ending a unit, so the lesson button is there as the loud
one and the two offers sit beside it quiet.

Next: Mike walks it, then units 2 to 4, then the SQL kit front door points at the track.

## Open question for Mike

"Passes on it" is read here as **skips**, not as "got it right". So the buckets are
cleared / missed / skipped, and the end-of-unit offer is the skipped pile. If "passed"
meant "got it right and I want another crack at them later", the loop changes.
