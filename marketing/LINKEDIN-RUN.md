# The LinkedIn run

One post a day. This is the only social channel being worked, chosen because it
is the one place where traffic and the job hunt pull in the same direction.

## The rules

1. **One post teaches one usable thing.** A reader who never clicks anything
   still leaves with something. That is what earns the next impression.
2. **No link in the post body.** LinkedIn suppresses reach on posts with an
   outbound link. Put the link in the first comment, posted immediately after.
3. **Never lead on price, and never say "free".** Say what the thing does.
4. **Never sell against anyone.** No "most tutorials are wrong", no naming a
   competitor to knock it.
5. **Every link carries UTMs** so GA4 and Gumroad can separate this channel
   from the others. `utm_source=linkedin&utm_medium=social&utm_campaign=<name>`.
6. **Post, then leave.** Reply to comments, do not chase.

## The order of the week

Days 1, 3 and 5 point at the cheat sheet. Days 2 and 4 point at a guide on the
site. Never two selling posts in a row: the ratio is what keeps the account
worth following.

---

## Day 1 · the number nobody explained

Most SQL review comments come down to one line.

Somebody wrote:

WHERE cohort_size >= 50

and nobody, including the person who wrote it, can say why it is 50.

Fifty is not wrong. Fifty is undefended. Six months later the number is still
there, still unexplained, and now three dashboards depend on it. The person who
inherits the query has two options, neither good: keep a number they cannot
justify, or change it and find out what breaks.

One line fixes it permanently.

-- 50-customer floor: below this the repeat-rate swings
--   too hard to read month to month

Same SQL. The number now carries its own reason, and the next reader stops
arguing about it.

The rule generalises. Every threshold, floor, cutoff or magic value in a query
you hand to somebody else gets one line saying where it came from. Everything
else stays bare. A comment on every obvious line is its own problem.

I put this and five other checks on a two-page sheet you can print. Link in
the comments.

> **First comment:** Two printable pages: comment syntax across five databases,
> the rules that differ between them, and the six-point check.
> https://michaelnocito.gumroad.com/l/sql-comment-cheat-sheet?utm_source=linkedin&utm_medium=social&utm_campaign=cheat-sheet-d1

---

## Day 2 · the comment that says nothing

Some comments look like diligence and are closer to noise.

-- filter to active customers
WHERE status = 'active'

The comment restates the line under it. Anyone who can read the SQL already
knew. Anyone who cannot has not been helped.

The real cost is not the wasted line. It is that it trains the next reader to
skim your comments, so the one comment that mattered gets skimmed too.

The version that earns its place says what the code cannot:

-- active only: cancelled accounts keep their order history,
--   so including them double-counts the churn cohort

Same SQL. The comment now carries a decision instead of a caption.

Quick test: cover the comment. If you can still work out what the line does,
the comment needs to say why instead.

> **First comment:** More on where the line between useful and noisy sits:
> https://michaelnocito.github.io/analyst-prep-kit/guides/sql-comments/?utm_source=linkedin&utm_medium=social&utm_campaign=guide-comments

---

## Day 3 · two modes

Most arguments about SQL comments are two people using different rulebooks
without noticing.

Teaching mode narrates every clause. It belongs in a portfolio repo a hiring
manager will skim, in a tutorial, in your own revision notes. The point is that
a beginner reads it top to bottom like a sentence.

Handoff mode keeps the thinking and drops the narration. A short intent header,
then comments only where a number was chosen, where the code does something
non-obvious, or where a known defect is being worked around.

Put teaching mode in a shared codebase and you get a review comment about noise.
Put handoff mode in a portfolio repo and you have shown nothing about how you
think.

The strongest move in a portfolio project is to carry both. Teaching-mode query
files as the lesson, one handoff-mode file to show you know the difference. The
contrast is the signal.

Both templates are on the sheet. Link in the comments.

> **First comment:**
> https://michaelnocito.gumroad.com/l/sql-comment-cheat-sheet?utm_source=linkedin&utm_medium=social&utm_campaign=cheat-sheet-d3

---

## Day 4 · the header that saves a meeting

Five lines at the top of a query file, and the next person does not have to
book time with you.

-- monthly_retention.sql
-- PURPOSE: repeat-purchase rate by signup cohort, feeds the
--          retention tile on the growth dashboard
-- INPUTS:  orders, customers (prod replicas, refreshed nightly)
-- OUTPUT:  one row per signup month
-- NOTES:   cohorts under 50 customers excluded; rates that
--          small swing too hard to read
-- OWNER:   m.nocito     LAST CHANGED: 2026-08-24

Purpose, inputs, output, notes, owner.

The NOTES line does the heavy lifting. It is where the decisions live: the
exclusions, the known defects, the thing that looks like a bug and is not.

I have never regretted writing one of these. I have repeatedly regretted not
writing one.

> **First comment:** The rest of the format:
> https://michaelnocito.github.io/analyst-prep-kit/guides/sql-teaching-comments/?utm_source=linkedin&utm_medium=social&utm_campaign=guide-handoff

---

## Day 5 · grade the AI's output

If you are having an AI comment your SQL, the useful move is not a better
prompt. It is a scoring step.

Ask for the comments, then ask it to score its own output against the rules you
gave it and tell you what it fixed. Models are markedly better at catching a
generic reason than at avoiding writing one in the first place.

The four things worth scoring:

1. Does the header say why the question exists, or just what the SQL does?
2. Does every chosen number say where it came from?
3. Is every function in the calculation explained, in everyday words?
4. Is the query body clean, with nothing narrated inline?

Most first drafts fail on 1 and 2. Almost all of them pass on the second pass,
without you writing anything.

Both the prompt and the check are on the sheet. Link in the comments.

> **First comment:**
> https://michaelnocito.gumroad.com/l/sql-comment-cheat-sheet?utm_source=linkedin&utm_medium=social&utm_campaign=cheat-sheet-d5
