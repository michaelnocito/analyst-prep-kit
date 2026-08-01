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
- **Lesson.** ~~Hands off to the real kit lessons in a new tab.~~ **Reversed 2026-08-01,
  Mike's call: the lesson is read in the app.** See "The lesson comes inside" below.
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
- **Every wrong run is a miss.** A query that will not run and a query that runs and gives
  the wrong table are the same event: you did not have it, so more of it gets uncovered.
  The first build excluded errors, which meant typing something broken uncovered nothing at
  the exact moment the help was wanted. The engine's own words go last on the line, after
  the explanation and after the help.
- **Correctness is a result comparison**, never a string match on the code. The reference
  result is computed at boot by running the ladder's own query, so nothing is hand-kept in
  sync. Column order counts; SQL text never does.
- **The wrong-answer line names the actual difference**: row count, column count, or same
  shape with different contents. Row count alone produced "You got 500 rows; the answer has
  500" whenever the columns were wrong.
- **The database is on the screen.** The schema browser from `/drill/` now sits under the
  editor on both passes: every table, its row count, its grain, and every column with its
  type, read out of the database rather than written down. Click a column and it types
  itself at the cursor. It matters most in recall, where the query is covered and a column
  name is the one thing nobody should be made to remember. Open or shut is the learner's
  call and it sticks.
- **Success is a popup** (added 2026-08-01, now canon for the whole kit — see the standing
  rule in `CURRICULUM_STANDARD.md`). A right answer opens a popup carrying the result table,
  the celebration, and one Continue button that is the next action. It persists; the backdrop
  and Escape dismiss it without advancing. Both passes and the mini quiz use it. This is what
  took the results out of the bottom of the page, where a first-timer never read them.
- **The end card** offers the two from the spec, "try the ones you passed on" and "write all
  six again", plus the way on to the lesson.
- The finish card and the checkpoint now read recall as well as the quiz. Fewer than five of
  six from memory makes another round the loud button, not the scored exam.
- Recall state survives a closed tab, or round 3 of the missed pile would lose the pile.

Deliberate deviation from the spec: the concept doc says two offers and no third. Recall
sits inside a round rather than ending a unit, so the lesson button is there as the loud
one and the two offers sit beside it quiet.

Next: Mike walks it, then units 2 to 4, then the SQL kit front door points at the track.

## The lesson comes inside (2026-08-01)

Mike, walking the round: *"here's where the user friction is too much. When they get to
lesson we push them out of the app and into the kit."*

The lesson step no longer opens `/sql/#lesson-1` in a new tab. The Unit 1 teaching text now
lives in `path/lessons.js` and is read on the page, four reads picked from a row of four
buttons, one on screen at a time, with Next read at the bottom and no link out of the round.

Each read carries what the kit lesson carries: the story, the idea, the read-it-aloud
walkthrough of a query line by line, the picture of what comes back, the operator notes, the
clause-order note, the close, and the one-level-deeper unlock. What it does **not** carry is
each lesson's quiz, Parsons problem and build question — the round has its own mini quiz
drawn from the same lessons, and a second copy of the drills would be three ways to answer
the same four questions.

**The two progress states are deliberately separate.** Finishing a round marks nothing in
the SQL kit, and kit progress does not mark anything here. That was the second half of
Mike's reason: kit progress must not mess with the round.

**The cost, stated plainly:** this is a second copy of Unit 1's teaching, and it can drift
from the kit's. `lessons.js` names its source (the `LESSONS` array in `sql/index.html`,
entries 1, 2, 104, 3) and the date it was copied. Any change to the kit's Unit 1 wording has
a second place to change. That trade was made on purpose: the alternative was dropping a
first-timer four steps into a round onto a 4,441px kit page that run 007b measured as having
no control anywhere on it pointing back.

The "read" checkmarks are honest now. The old version could only say **opened**, because the
words were in another tab. The words are on this page, so opening one is reading it.

## Four rungs, not six (2026-08-01)

Mike: *"lower to a 4 query sequence. Just enough for people to feel like 'god, 1 more…'"*

The ladder is four. One rung per read in step 3, so the typing and the lessons now line up
exactly:

| Rung | Adds | Read it matches |
|---|---|---|
| 1 | SELECT three columns FROM the table | SELECT & FROM |
| 2 | WHERE genre = 'country' | WHERE |
| 3 | ORDER BY listeners DESC, LIMIT 10 | ORDER BY & LIMIT |
| 4 | COUNT(\*) and COUNT(DISTINCT artist) | A query returns a table |

What the cut dropped: the standalone AND rung, and the split between an ORDER BY rung and a
LIMIT rung. ORDER BY and LIMIT are one lesson and one idea — a top ten — so they are one
rung, and the ladder rule still holds: each rung is the one before it plus one new thing.
AND survives in the WHERE lesson's notes and in the mini quiz, which is where a learner
meets it next.

Row counts re-verified against the baked database after the cut: 500, 52, 10, 1.

Everything that names a count now reads it from `LAP.drills.length` rather than saying
"six", so the next change to the ladder length does not leave copy behind.

## Before and after (2026-08-01)

Mike: *"give them the test as the first step, telling them it's so they know where they are
headed, and at the end we give them a comparison of how they did."*

The round is six steps now: **Before → Primer → Type → Recall → Lesson → After.** Step 1 and
step 6 are the **same four questions**, and the finish card puts them side by side.

Rules the Before step obeys, and each of them is load-bearing:

- **Nothing is marked and no answer is revealed.** This is the one that makes the comparison
  worth anything. Show the right answers at the start and the check at the end measures who
  remembered a reveal, not who learned the material.
- **The only colour on that screen means "this is the one you picked."** Not right, not
  wrong. A pick can be changed until the learner leaves the step.
- **It says out loud that guessing is fine**, and why: not knowing yet is the reason the
  round exists. A learner who reads step 1 as a test they are failing will not reach step 2.
- **All four have to be answered to move on.** A blank before is not comparable to an after.

The finish card reads the gain and says what actually happened, in four cases: went up, was
already four of four, did not move, went down. "Four of four before and after" gets its own
line, because a learner who arrived knowing Unit 1 did not fail to improve and should not be
told they did. Every question the learner got wrong before and right after shows what they
had picked, so the change is legible rather than asserted.

Same-form pre/post is deliberate. Parallel forms would be cleaner measurement, but this is
feedback to a learner, not an experiment, and two different question sets cannot be compared
by the person reading them.

## No action button leaves the round (2026-08-01)

Mike, on the finish card: *"the SQL checkpoint part has two action buttons that navigate them
away from the app. No need for those teasers."*

The card carried three action buttons. One restarted the round; the other two opened the
Final Exam Kit in a new tab and the full SQL kit. Two thirds of the "what do I do next" row
led out of the twenty-minute thing the learner had just finished.

Both are gone. The card now offers two rounds, both inside: type them again, or write them
from memory again. Which one is loud follows what actually went badly — recall short of full
promotes the blind pass, otherwise the typing pass. The checkpoint is described as coming,
not linked, because there is nothing in-app to link to yet.

**The rule, now canon in `REAL_TEST.md` as sweep 5e:** content may link out; an action button
may not. A sentence with a link in it is read and considered. An action button sits in the
row where the next step lives, and a person looking for what to do next reads every button
in that row as the next step. "Opens in a new tab" is not a defence — it is still a different
product with its own nav and no route back, and now there are two tabs to tell apart.

Swept the whole round after the change: zero out-of-app destinations on any action control,
on any of the six steps. The footer credits and the breadcrumb still link out, and stay:
those are content, read and taken or not.

## "Wth is primer" (2026-08-01)

Three things came out of Mike reading his own step 1.

**"Primer" was ours.** Not the learner's word, not the profession's. The insider-word sweep
(REAL_TEST.md 5a) exists precisely for this and did not catch it, because it reads as an
ordinary English word. The step is six lines long, so it is called **Six words**.

**It looked like it was always skipped and always green.** It was not being skipped. The
round remembers where you left off, which is right, but it did it silently: a return visit
landed mid-round with ticks on steps this visit never did, and whatever it had jumped past
read as broken rather than finished. There is now a line at the top on a returning visit,
naming the step it resumed at, saying the ticks behind it are from last time, and offering
**Start the round over**. Any first action of the visit retires it — the first version only
retired on a step change, so pressing Next inside the typing step left it sitting there.

**The first screen now explains how it works.** Mike: *"first screen should tell them how it
works, that's step 1: you will see what to type on the left, you type on the right, then this
then this."* Step 1 is **How it works**, and it does two things before asking for anything:
shows the left/right split of the working screen as two labelled panes in the same
arrangement as the real thing, then lists what every remaining step will do.

The running order on that screen is generated from the step definitions themselves, so the
promise and the round cannot drift apart. Adding a step writes its own line.

The round is seven steps: **How it works → Before → Six words → Type → Recall → Lesson →
After.**

## Lesson before recall, and no menu at the end of it (2026-08-01)

**Two changes, both Mike's, and they work together.**

### The order swapped

Mike: *"should we move step 4 to step 3, so it's type, learn why you typed, then you try from
memory?"* Yes. The round is now:

**How it works → Before → Six words → Type → Lesson → Recall → After.**

The original spec put recall before the lesson: *type it, type it again without help, then
read why it worked.* The argument for that order was retrieve-before-you-are-told. **The
Before step now does that job**, on the same four questions the round ends on, so recall no
longer has to carry it.

What the new order buys: four reads sit between typing a query and writing it covered up,
which makes the recall genuinely unaided instead of an echo of a query that was on screen a
minute earlier. The gap is the point. And the round ends on the learner performing without
help rather than on them reading.

### The end-of-recall menu is gone

Mike: *"don't give them choices here, make them try mistakes again, then next one they auto
move on."*

Recall used to end on a card offering three buttons: go to the lesson, retry the ones you
passed on, or write them all again. That card asked a learner to plan their own remediation,
which is the one thing they are least equipped to do, and the cheapest button on it was
always the one that skipped the work.

Now: anything not cleared comes straight back, missed and passed-on together, without being
asked. When nothing is left, the round moves itself on. **Skipped is no longer a separate
pile** — it rejoins the loop — so the button says **Come back to this one** rather than "Pass
on this one", because that is what it does. The tally is two numbers instead of three: from
memory, and coming back to you.

An item only counts as cleared if it was cleared before the whole query was uncovered, so the
loop cannot be ended by copying. That rule now also guarantees the celebration at the end is
earned: the only way out of recall is having actually written all four.

### A bug that came with the six-to-four cut

Mike's screenshot showed **"6 passed on"** under a round of four queries. Saved progress from
the six-rung build was being restored whole, so indices 4 and 5 came back pointing at rungs
that no longer exist — and with the new auto-loop, two unclearable items would have meant a
loop that never empties. Restored recall state is now filtered against the current ladder
length.

## Cut back to the run (2026-08-01, and this is where it landed)

Mike, after a day of adding: *"I just want how it works, type this query, recall type query,
what you did (very brief explanation of each NEW SQL concept), your score / best score / last
score. That's it. That's the run. I like how the type this query and type recall are set up,
I just don't want all the extra steps. It's jump in, learn by repetition, just enough theory
in the why it worked, and where it's used in different industries and roles."*

**The round is four steps and a score card:**

1. **How it works** — the left/right layout, then what the other steps do.
2. **Type** — four queries, reference query on screen.
3. **Recall** — the same four, covered up.
4. **What you did** — one block per new piece of SQL.
5. **Your score** — this run, best, last.

**Cut today, after being built today:** the Before pre-test, the Six words primer, the
four-read in-app Lesson, the After quiz, and the before/after comparison card. Everything
that had accumulated around the two typing passes, which are the part that works.

`lessons.js` stays on disk and is no longer loaded. The kit's Unit 1 text is in it, copied,
and the checkpoint work will want it back. The unused CSS for the primer, lesson and quiz
went with them.

### What you did

One block per NEW thing the four queries introduce: SELECT and FROM, WHERE, ORDER BY and
LIMIT, then COUNT with DISTINCT and AS. Each one carries what the words do, why *your* query
worked, and **where you will use it** as three named jobs rather than an abstraction. A nurse
manager pulling patient IDs, a claims analyst pulling denied claims, a media buyer sorting
the worst ad sets worst-first. The industry framing is the half Mike asked for and the half
that is missing everywhere else.

### The score

Scored on the **covered-up pass only**. The typing pass has the answer on screen, so scoring
it would measure copying.

Twenty-five points a query, less whatever help it took:

| Help needed | Points |
|---|---|
| Nothing uncovered | 25 |
| Half uncovered | 15 |
| Three quarters | 10 |
| All of it | 5 |
| Never written from memory | 0 |

Out of 100. The card shows **this run, best, and last**, and a table underneath saying what
each query cost, so the number has its working attached.

`helpUsed` records the **worst** help an item ever needed, not the last, because a query you
had to uncover once is not a query you knew. Best and last live in their own localStorage
key, so clearing round progress does not wipe the record. Banked once per visit to the card,
or a reload would overwrite "last run" with the run you are looking at.

**No streaks and no timers.** Those are things to game, and the Drill Bible rules them out.

## RABBIT CAUGHT (2026-08-01, Mike)

Mike, on the four-step round: *"mark that as rabbit caught. This is the core verbs: drill,
review, repeat."*

Against **GAME_BIBLE.md principle 13, "The first 30 seconds are the whole pitch. Chase the
rabbit"** — the Mario 64 method, tune the verb in an empty room before there is a level.

**The core verb is settled: type a query, run it, see real rows.** Everything the round did
before today was scaffolding around that verb, and every piece of scaffolding that got added
this session got cut again. What survived is the shape:

**Drill** (type it with the query on screen) → **review** (what you did, why it worked, where
it is used) → **repeat** (the covered-up pass, the loop, the score to beat).

That is the loop this product is built on, and it is the one to port to the other kits.

### Where it actually stands against the 30-second test, honestly

The bible says to record 30 seconds and name the exact second of first-press, first-win and
first-read, and it says the opening must have **no text block** in front of the verb.

- **First win and first read: good.** The first query returns 500 real rows and the popup
  says what it was for. That is a clean success at the core verb with a reward beat.
- **First press: not yet clean.** The round opens on **How it works**, which is a screen of
  text, and the verb is one click behind it. By principle 13 that is a menu wall.

Two ways to close it, and this is Mike's call, not mine:

1. **Open on query 1** with the how-it-works content moved into the first screen's left pane,
   where the layout it describes is actually in front of them.
2. **Keep How it works but make it pressable**: a live editor on the same screen with one
   toy query already in it, so the first press happens inside the explanation.

I would take option 1. The screen explains a two-pane layout the learner cannot see while
they are reading about it, which is the weakest place to put that explanation.

## Chasing the rabbit, and killing the loop (2026-08-01)

### The round opens on the verb

The How it works screen is gone. It was a screen of text in front of the verb, which is what
GAME_BIBLE principle 13 calls a menu wall, and it explained a two-pane layout the reader
could not see while reading about it.

The round now **opens on query 1**. The orientation lives inside the left pane of that first
screen, where the layout it describes is on the screen around it and the editor is one press
away: what this pane holds, what the pane on the right is, and the running order underneath.
It shows on query 1 of the typing pass and never again.

The running order is still generated from the step definitions, so it cannot drift.

### The uncovered part now announces itself

Every reveal marks **only the slice that just appeared**, and it flashes twice before
settling into ordinary code. The eye is in the editor when Run is pressed and the help
arrives in the other pane, so without it the reveal could be missed entirely. Motion-reduced
users get the highlight without the pulse, so the same information lands.

`keepIndex()` was pulled out of `coverUp()` so the same rule decides both edges of a reveal
and the new slice cannot be off by a character.

### One pass. No forced repeats.

Mike: *"stuck in a step 3 loop. Don't force them to redo mistakes, it's creating a
frustration loop."*

Recall was looping every unanswered query back until it was cleared, and an item answered
after a full uncover did not count, so it came back too. Two people-sized problems: getting
one wrong already costs the query on screen and the points, and being marched through it a
third and fourth time costs the round.

**Recall is one pass now.** Four queries, then it moves on:

- Answered is answered. However much of the query it took, it counts, and `helpUsed` puts
  the cost in the score instead of in another lap.
- **Come back to this one** scores zero and moves on. Nobody is held on a query they do not
  want to fight.
- Repeating is **Run it again**, which is the learner's call.

Gone with it: the round counter, the missed and passed-on piles, the Move on button that
existed to escape the loop, and the send-back on a fully uncovered answer. The tally reads as
progress rather than debt: how many answered, and how many of those took no help.

## Open question for Mike

"Passes on it" is read here as **skips**, not as "got it right". So the buckets are
cleared / missed / skipped, and the end-of-unit offer is the skipped pile. If "passed"
meant "got it right and I want another crack at them later", the loop changes.
