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
| Miss 2 | (nothing new — one more swing on the half) |
| Miss 3 | The whole code |

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

## Open question for Mike

"Passes on it" is read here as **skips**, not as "got it right". So the buckets are
cleared / missed / skipped, and the end-of-unit offer is the skipped pile. If "passed"
meant "got it right and I want another crack at them later", the loop changes.
