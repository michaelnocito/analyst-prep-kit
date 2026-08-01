# The 6-Month Analyst Standard — Curriculum Vision

**Status:** proposal for Mike's review (June 3, 2026). Defines the new north star
before we restructure any kit.

## The shift
From **"bare basics"** (can you recognize a VLOOKUP?) → **"job-ready depth"**
(could you do this analyst's job after 6 months on it?). Grounded in what
entry-level postings and hiring managers actually reward.

## The target person
The **common core** of a *junior data analyst / business analyst / new data pro*
about **6 months in**. Independently, they can:
1. Turn a vague business question into a **data question**.
2. **Get** the data themselves (SQL), **clean** it reliably (Excel/Python), and trust it.
3. **Analyze & summarize** it (aggregations, the right comparison, basic stats).
4. **Visualize it honestly** (Tableau/Power BI) and communicate the **"so what"** to non-technical people.
5. **Catch their own errors** (attention to detail) and **explain *why*** they did what they did (workflow thinking).

> *BA-leaning variant adds requirements gathering, process mapping, and stakeholder
> translation. We target the data-analyst common core and flag BA divergences where useful.*

Source signal: employers weight **workflow competence + tool fluency + "what the data
means"** over isolated syntax; **attention to detail/reliability** is the hiring
separator at this level. (CourseCareers, Weld, IIBA, Research.com.)

## The structural problem we're fixing
Today's kits teach **tool features** but skip the **prerequisites and mental models**
underneath them — and stay shallow. Example flagged by Mike: Tableau jumps to
**"Dimensions vs Measures"** assuming you already know what a *field*, a *data type*,
a *row/grain*, and *aggregation* are. We teach the **"which button"** before the
**"why."** That's the #1 gap.

## The new structure — three tiers per kit
- **Tier 0 · Foundations (the prerequisites a lesson assumes).** Data literacy:
  rows/columns/**grain**, data types, nulls, what "clean" means, and the analytics
  workflow. **Mostly missing today — the biggest gap.**
- **Tier 1 · Core mechanics.** The working skills (where the kits mostly live now) —
  but deepened, each with the **why/when** and the **gotcha**, not just the how.
- **Tier 2 · Applied (6-month competence).** Real tasks done independently +
  judgment + communicating the result. *"On the job you'd…"*

**Every lesson gains a stated PREREQUISITE** ("before this, be comfortable with X"),
so the path scaffolds instead of dropping beginners mid-stream.

## Cross-cutting threads (every kit, currently under-served)
1. The **analytics workflow**: question → acquire → clean → analyze → visualize → communicate.
2. **Asking the right question** — turning a business ask into a data ask.
3. **Communicating findings** to non-technical people (the "so what").
4. **Attention to detail** — catching your own errors before they ship.

## Per-kit "6-month-ready" snapshot (what "done" means)
- **Excel:** clean messy data reliably; lookups; conditional aggregates; PivotTables;
  knows the text-vs-number traps cold. Can hand a clean sheet to a stakeholder.
- **SQL:** pull data independently; joins (and *why* a join double-counts); GROUP
  BY/HAVING; window functions at a recognition level; reconciliation queries.
- **Python/pandas:** load, inspect, clean, group, merge, export — the daily 80%.
- **Tableau:** build the right chart for the question; dimensions/measures/aggregation
  fluently; filters/sets/groups/params; an honest, readable dashboard.
- **Stats:** mean/median, spread, correlation≠causation, p-values & A/B basics —
  enough to not misuse them.
- **Power BI:** model (star schema), core DAX, time intelligence, a shareable report.
- **Cross-cutting:** explain the *why* behind every step; present a finding in one sentence.

## Pilot: Tableau restructure (the kit you flagged)
**Today** it opens: Interface → Dimensions vs Measures → charts. **Missing prerequisites:**
what a data table *is* (rows=records, columns=fields, the **grain**), data **types**
(why Tableau colors them), and what **"aggregate"** means *before* "Tableau
auto-aggregates."

**Proposed new "Unit 0 · Before You Build (Foundations)":**
- **0.1 How Tableau sees your data** — the data table: rows, fields, the grain.
- **0.2 Field types & why color matters** — text/number/date → discrete/continuous, blue/green.
- **0.3 What "aggregate" means** — one value standing in for many (the idea behind SUM/AVG).
- **0.4 The analyst's loop in Tableau** — question → field → shelf → chart → insight.

Then the existing 20 lessons become Tier 1/2, each gaining a one-line **prerequisite**
and a deeper **why/gotcha/applied** beat. Same pattern then rolls to every kit.

## Decisions for Mike
1. **Persona:** target the **data-analyst common core** (recommended) + flag BA bits,
   or build a separate BA track?
2. **Scope:** **restructure existing kits in place** — add Tier-0 Foundations +
   prerequisite scaffolding + more depth (recommended) — vs net-new kits?
3. **Start:** **pilot the full restructure on Tableau first** (you flagged it), prove
   the pattern, then roll kit-by-kit (recommended)?

---

## Standing rule — Directive visibility (added 2026-07-25, Mike)

**Every lesson surface states what the learner has to do RIGHT NOW, set apart from the
rest of the text, and keeps it visible for as long as they are working on it — including
while scrolling on a phone.** This is a bible rule, not a per-kit choice.

- **One directive per stage.** Imperative, concrete, task-shaped: "For every order, find
  the matching customer and pull their name alongside the order's revenue."
- **Visually dominant.** Larger and clearly distinct from body copy. It is the north star
  for the stage, so it must not read as one more callout among several.
- **Top of the working area, and persistent.** It stays on screen through scroll; on
  phone widths it condenses rather than disappearing. It must never cover the primary
  action (see feedback_action_always_visible).
- **Not an explainer.** Background, motivation, and prose framing are a separate concern
  from the directive — do not merge them back into it.

**Why (research):** the split-attention effect — when learners must hold instructions from
one place while working in another, working memory is spent on the layout rather than on
learning (Chandler & Sweller 1992, *British Journal of Educational Psychology* 62(2),
doi:10.1111/j.2044-8279.1992.tb01017.x; Ayres & Sweller, "The Split-Attention Principle in
Multimedia Learning", *Cambridge Handbook of Multimedia Learning*). Small screens amplify
it: restricted viewports chunk the task out of view and the learner loses the global goal.
UX guidance for the fix is a sticky (not tall-fixed) element with a condensed mobile
treatment and keyboard focus never trapped behind it.

**Applies to:** all lesson kits (excel · sql · python · powerbi · tableau · stats), their
practice drills, and any new lesson type. Non-lesson pages get the same audit before ship.

## Standing rule — Generative prompting (added 2026-07-27, Mike)

**Every teaching surface makes the learner produce something in their own head before it
hands them the answer.** Explanation alone does not teach; it only feels like teaching.
This is a bible rule, not a per-kit choice.

Mike's trigger, listening to the guides on his phone: *"great information, and we're
getting better at breaking it down, but they're not engaging — it's not prompting me to
think or visualize."* The same gap is in the kits.

**The name for it is generative learning.** Fiorella & Mayer map eight strategies; four
survive contact with a lesson screen, in ascending cost:

| Prompt | Sounds like | Evidence |
|---|---|---|
| **Prequestion** — ask before you answer | "Before the answer: which one loses rows?" | g = 0.66 on the asked idea, near zero on the rest |
| **Self-explanation** — make them say why | "Say why that would be true before reading on." | g = 0.55 across 64 reports |
| **Imagination** — make them picture it | "Picture running that on your own table. What comes back?" | Effect grows as the material gets harder |
| **Drawing** — make them sketch it | "Draw the two tables and the key between them." | g = 0.69, strongest and most expensive |

**The boundary condition, and it is the one we will get wrong.** These all spend working
memory. Asking a learner to imagine or draw something they do not yet understand leaves
them worse off, because they have nothing to imagine with. **Explain first, prompt
second.** A prompt is never a substitute for the explanation and never an opener.

**How this lands in a kit.**

- **The prequestion goes above the concept**, one per lesson, aimed at the single idea
  the lesson exists to deliver.
- **The self-explanation prompt goes between the worked example and the drill.** This is
  the beat that is missing everywhere today: we show the example, then immediately ask
  them to perform. Nothing asks them to account for it first.
- **The imagination prompt goes after the worked example, before the learner types.**
- **Drawing stays optional and rare.** Once per unit at most.
- **Four or five prompts per lesson, hard cap.** Past that learners skip them, and the
  skipping generalises to the ones that mattered.
- **Never visually marked.** Mike, 2026-07-27: the read version and the heard version
  are identical. No prompt box, no icon, no "Try this" label. A marked prompt is a prompt
  learners train themselves to skip.
- **It must work spoken.** Anything phrased as "look at the box above" fails for a
  learner using their phone's read-aloud. Same test as the guides.

**Relationship to the existing rules.** This does not replace the directive-visibility
rule; the directive is what to DO, a generative prompt is what to THINK before doing it.
Nor does it replace the recall/review queue, which is retrieval AFTER learning. This is
the missing beat BEFORE and DURING.

**Applies to:** all lesson kits (excel · sql · python · powerbi · tableau · stats), their
drills, the cert kits, the guides, and any new lesson type. Confirm per surface at build
time, per the cross-kit applicability rule.

**Research:** Fiorella, L., & Mayer, R. E. (2016). Eight ways to promote generative
learning. *Educational Psychology Review*, 28(4), 717-741. doi:10.1007/s10648-015-9348-9 ·
Bisra, K., Liu, Q., Nesbit, J. C., Salimi, F., & Winne, P. H. (2018). Inducing
self-explanation: a meta-analysis. *Educational Psychology Review*, 30(3), 703-725.
doi:10.1007/s10648-018-9434-x · Pan, S. C., & Carpenter, S. K. (2023). Prequestioning and
pretesting effects. *Educational Psychology Review*, 35, 97. doi:10.1007/s10648-023-09814-5 ·
Leahy, W., & Sweller, J. (2008). The imagination effect increases with an increased
intrinsic cognitive load. *Applied Cognitive Psychology*, 22(2), 273-283.
doi:10.1002/acp.1373 · Dunlosky, J., Rawson, K. A., Marsh, E. J., Nathan, M. J., &
Willingham, D. T. (2013). Improving students' learning with effective learning techniques.
*Psychological Science in the Public Interest*, 14(1), 4-58. doi:10.1177/1529100612453266

## Standing rule — Listen (added 2026-07-27, Mike)

**Every page we publish carries its own read-aloud control.** Lesson pages, guides,
hub pages, articles. The canon for how it looks, where it sits, what it reads and what
it skips is **`LISTEN_STANDARD.md`** — a single file, updated in the same commit as any
change to the feature. Do not restate its rules here.

The connection to teaching: if a learner can hear a lesson, the lesson has to work
spoken. That is the same test the generative-prompting rule above imposes, and the same
test the no-visual-marking decision imposes. All three are one standard — **what you
read and what you hear are the same thing.**

**Status: on hold for Mike's review.** Live on two pages only. No rollout to the kits
until he has listened and said go.

## Standing rule — A checked answer is a popup (added 2026-08-01, Mike)

**When a learner's answer gets checked, the outcome opens a popup. It is not a line of text
further down the page. Right and wrong both.**

The popup carries four things and nothing else:

1. **What they achieved**, in a short heading. "Rows match." "You had it." "4 of 4."
2. **The result itself** — the table their query returned, the value their formula produced,
   the number they computed. Whatever they did the work to see.
3. **The celebration.** Confetti and a toast, the kit's existing `celebrate()`. A result
   that is right but did not come from them gets the popup without the confetti.
4. **One Continue button**, which is the next action. Clicking it closes the popup and
   starts that action.

Rules the popup obeys:

- **It persists.** No timer, no fade, no auto-advance. It waits as long as they look at it.
- **The reward and the next step are the same click.** Continue is the only forward control,
  so nobody has to hunt for one after being congratulated.
- **A dismiss that does not advance.** The backdrop, Escape, and a quiet second button all
  close it and leave the learner where they are. Someone comparing the rows against what
  they typed should not have to go through the door to do it.
- **It takes focus and gives it back.** Focus lands on Continue when it opens and returns to
  where it came from when it closes. Tab wraps inside it.
- **It replaces the trip down the page.** This is what the rule is for: the result used to
  live below the editor, below the fold, and a first-timer clicked forward without reading
  one row. The rows come to them now.

**A wrong answer gets the same popup.** Same shape, same result table, same single button.
What changes is the colour, the words, and where the button goes:

| | Right | Wrong |
|---|---|---|
| Heading | What they achieved | What is different about it |
| Result shown | The result they produced | The result they produced |
| Celebration | Confetti and toast | Neither |
| Button | **Continue** — starts the next action | **Try again** — closes and puts the cursor back in the editor |

The reason they are symmetric: a wrong answer that only writes a line below the fold is the
quiet outcome, and quiet reads as nothing happened. The learner needs to see what their own
work actually returned — not the right answer, *theirs* — because that is the repair.

**Say what the answer has to contain.** A business question does not name its columns, and a
result comparison checks all of them. Any surface that checks a whole result must state what
to bring back, and that statement must be read off the reference result rather than written
by hand, so it cannot disagree with the check.

Where it applies: any checked answer that produces a result — a query, a formula, a computed
statistic, a completed quiz. Not micro-interactions like a single multiple-choice pick inside
a longer set; those keep their inline marking, and the popup fires when the set is done.

Reference implementation: `path/index.html`, `winPopup()`. Rollout across the kits and the
apps is tracked in `ROADMAP.md`.
