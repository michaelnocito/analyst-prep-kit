By the end of this page you can predict what any query does when it meets a missing value, which is the skill that separates "my query returned nothing and I don't know why" from a two-second fix. You will know why `= NULL` matches zero rows, why one NULL can empty an entire `NOT IN`, and how NULLs quietly move averages, counts, groups, and sort orders. It is about twenty minutes.

Here is what to actually do with it. Next time a filter returns fewer rows than you expected, ask one question first: does the column I am comparing have NULLs in it? Run `WHERE the_column IS NULL` and look. That one check explains most mystery row counts before any real debugging starts.

The short version: NULL means unknown, not zero and not empty text. A comparison with unknown answers "unknown", and `WHERE` only keeps rows that answer "yes". So every NULL comparison silently drops rows.

That yes-only gate is the one idea under everything on this page, so it gets the picture.

**The worked example is real.** Every number on this page comes from a 10-row support-tickets table with NULLs seeded on purpose, and every query was run against it in SQLite before its output was pasted here. The table is small enough to check by eye. If `SELECT` and `WHERE` are new, start with [SQL foundations](https://michaelnocito.github.io/analyst-prep-kit/guides/sql-foundations/) and come back.

Here is the table. Ten tickets. Three are missing their close time, two are missing their region, and two have no assignee.

| ticket_id | region | minutes_to_close | assignee |
|-----------|--------|------------------|----------|
| 1         | East   | 45               | Priya    |
| 2         | East   | NULL             | Priya    |
| 3         | West   | 30               | Marcus   |
| 4         | West   | 90               | NULL     |
| 5         | NULL   | 60               | Marcus   |
| 6         | East   | 15               | Dana     |
| 7         | West   | NULL             | NULL     |
| 8         | NULL   | 120              | Dana     |
| 9         | East   | 75               | Priya    |
| 10        | West   | NULL             | Marcus   |

## 1. What NULL actually means, and why = NULL finds nothing

Before the explanation: two tickets in that table have no assignee. What do you expect this query to return?
    
    
    SELECT * FROM tickets WHERE assignee = NULL;

Zero rows. Not the two unassigned tickets. Zero, out of ten, every time, on every database. I ran it and got an empty result, and the reason is the definition of NULL itself.

NULL does not mean zero, and it does not mean empty text. NULL means unknown: this row has an assignee slot, and nobody has said what goes in it. So `assignee = NULL` asks "does this ticket's assignee equal an unknown value?", and the only honest answer is "I don't know". Even for ticket 4, where the assignee is itself NULL, the question is "does one unknown equal another unknown?", and the answer is still unknown. I ran `SELECT NULL = NULL` and the database returns NULL, not true.

SQL therefore gives you a separate verb for the question you actually meant. `IS NULL` asks "is this value missing?", which is a question about the slot, not the value, so it has a real yes-or-no answer.
    
    
    SELECT * FROM tickets WHERE assignee IS NULL;

| ticket_id | region | minutes_to_close | assignee |
|-----------|--------|------------------|----------|
| 4         | West   | 90               | NULL     |
| 7         | West   | NULL             | NULL     |

There are the two unassigned tickets. `IS NOT NULL` is the mirror, and it returns the other 8 rows. The rule to keep: `=` and `<>` compare values, `IS NULL` and `IS NOT NULL` check for missing ones, and they are not interchangeable.

## 2. Three-valued logic in everyday words

Before the explanation: the table has 10 tickets and 3 of them are assigned to Priya. How many rows does `WHERE assignee <> 'Priya'` return?

Most people say seven. The database says five. I ran it: 5 rows.

Here is the machinery, in everyday words. In most of life a question has two answers, yes or no. In SQL a comparison has three: yes, no, and unknown, where unknown is what you get whenever a NULL is involved. This is called three-valued logic, and the name matters less than the consequence: `WHERE` keeps only the rows that answer "yes". Rows that answer "no" are dropped, and rows that answer "unknown" are dropped too, silently, with no error and no warning.

So for `assignee <> 'Priya'`: five tickets answer yes (Marcus and Dana's), three answer no (Priya's), and tickets 4 and 7 answer unknown, because comparing NULL to 'Priya' has no honest answer. The unknowns vanish. Ten in, five out, and the two unassigned tickets are in neither the Priya pile nor the not-Priya pile.

Say out loud where tickets 4 and 7 went before reading on, because that sentence is the whole trick. They were not excluded for being Priya's. They were excluded for being unanswerable. When you truly mean "everyone except Priya, including unassigned", you have to say so.
    
    
    SELECT COUNT(*) AS n
    FROM tickets
    WHERE assignee <> 'Priya' OR assignee IS NULL;
    -- n = 7

## 3. The NOT IN trap: one NULL, zero rows

Before the explanation: you have a list of staff who close tickets, and you want tickets handled by anyone not on the list. The list has three entries: Priya, Marcus, and one NULL from a bad import. How many rows do you think come back?
    
    
    SELECT * FROM tickets
    WHERE assignee NOT IN (SELECT name FROM closers);

Zero rows. Not "the Dana tickets", not "everything but Priya and Marcus". Zero, and I ran it to confirm. This is the single nastiest NULL surprise in SQL, because the query looks completely reasonable and returns an empty set with no error.

The reason follows from step two. `NOT IN` unrolls into a chain of comparisons: `assignee <> 'Priya' AND assignee <> 'Marcus' AND assignee <> NULL`. That last comparison answers unknown for every row in the table. And a chain of ANDs can only answer yes if every link answers yes, so the best any row can do is unknown. No row answers yes, `WHERE` keeps only yes, and the result is empty. One NULL in the list poisons all ten rows.

Two fixes, both of which I ran. Screen the NULL out of the subquery, which returns the 2 Dana tickets:
    
    
    SELECT ticket_id, assignee
    FROM tickets
    WHERE assignee NOT IN (
        SELECT name FROM closers WHERE name IS NOT NULL
    );
    -- tickets 6 and 8, both Dana

Or use `NOT EXISTS`, which checks "no matching row exists" one row at a time and is immune to the trap. It returned 4 rows on the same data: Dana's two tickets plus the two unassigned ones, because an unassigned ticket genuinely has no match in the list. The two fixes disagree about tickets 4 and 7, and neither is wrong. They answer different questions, so the fork is: should unassigned tickets count as "not on the list"? If yes, `NOT EXISTS` says what you mean. If no, the screened `NOT IN` does. What decides is the sentence you would say to a stakeholder, and it is worth writing that sentence into the query as a comment.

## 4. COALESCE for defaults, and when not to use it

Before the explanation: your ticket report goes to a manager who keeps asking what the blank assignee cells mean. What would you like those cells to say instead?

`COALESCE` is the tool. It takes a list of values and returns the first one that is not NULL, which makes it a fill-in-the-blank function: `COALESCE(assignee, 'Unassigned')` means "the assignee, or the word Unassigned when there is none".
    
    
    SELECT ticket_id,
           COALESCE(assignee, 'Unassigned') AS assignee_display
    FROM tickets
    ORDER BY ticket_id;

I ran it: tickets 4 and 7 now read "Unassigned" and the other eight show their names unchanged. That is the honest use of `COALESCE`: labeling missingness so a reader can see it.

The dishonest use is papering over it. `COALESCE(minutes_to_close, 0)` makes the NULLs disappear into zeros, and a zero-minute close time is a claim, not a label: it says the ticket closed instantly, when the truth is nobody recorded it. Three of the ten tickets here have no close time. That is a 30% hole in the column, and a hole that size is a finding your reader deserves to hear about, not a formatting problem to smooth away. When you fill a value for display, say so in the report, and when the missingness is large, report it as its own line. [Documenting data limitations](https://michaelnocito.github.io/analyst-prep-kit/guides/documenting-data-limitations/) covers how to write that up without burying the analysis.

## 5. How NULLs move your counts and averages

Before the explanation: `minutes_to_close` has seven real values and three NULLs. When you take `AVG(minutes_to_close)`, what number does the database divide by, ten or seven?

Seven. Aggregate functions skip NULLs entirely: `SUM`, `AVG`, `MIN`, `MAX`, and `COUNT(column)` all act only on the rows where the value exists. I ran the numbers on the worked table.
    
    
    SELECT COUNT(*)                    AS all_rows,
           COUNT(minutes_to_close)     AS with_minutes,
           AVG(minutes_to_close)       AS avg_minutes
    FROM tickets;

| all_rows | with_minutes | avg_minutes |
|----------|--------------|-------------|
| 10       | 7            | 62.1        |

The average is 435 divided by 7, which is 62.1 minutes. Force the NULLs to zero with `COALESCE` and the same column averages 43.5, because now it is 435 divided by 10. That is a 30% swing in a headline number from one decision about missing data, and neither number is automatically right. 62.1 is the average of the tickets whose close time was recorded. 43.5 pretends unrecorded means instant. The honest report states the first number and the hole: "62.1 minutes average, across the 7 of 10 tickets with a recorded close time".

`COUNT(*)` against `COUNT(column)` is the same skip in count form. `COUNT(*)` counts rows, 10 here. `COUNT(minutes_to_close)` counts non-NULL values, 7 here, and `COUNT(assignee)` gives 8. The gap between the two counts is your missing-data count, which makes this pair the fastest completeness check in SQL. The whole COUNT family, including `DISTINCT`, is in [COUNT in SQL](https://michaelnocito.github.io/analyst-prep-kit/guides/sql-count-function/).

Now picture running `COUNT(*)` next to `COUNT(the_column)` on the most important numeric column in your own data. Do you know, right now, what the gap would be? Most people find out later than they wanted to.

## 6. The full before and after

Same table, same question: how fast does each region close tickets?

### Before
    
    
    SELECT region, AVG(minutes_to_close) AS avg_minutes
    FROM tickets
    GROUP BY region;

Three quiet problems, no errors. The average silently skips the three unrecorded close times, so nobody can see how much data is behind each number. The two tickets with no region form their own blank-looking group with no explanation. And the reader has no way to tell any of this from the output.

### After
    
    
    -- ============================================================
    -- STEP 4: How fast does each region close tickets?
    -- WHY: minutes_to_close is missing on 3 of 10 tickets, and
    --      region is missing on 2. Averages skip the NULLs, so
    --      each average is shown WITH how many tickets back it.
    -- NOTE: 'No region' is real missing data, reported as its
    --      own line rather than dropped or blank.
    -- ============================================================
    --SELECT the region (labelled when missing), tickets in the
    --   group, how many have a recorded close time, and their avg
    SELECT COALESCE(region, 'No region')  AS region_display,
           COUNT(*)                        AS tickets,
           COUNT(minutes_to_close)         AS with_close_time,
           ROUND(AVG(minutes_to_close), 1) AS avg_minutes
    FROM tickets
    GROUP BY region;

The blank group now has a name, every average sits beside the count of values that produced it, and the missingness is visible instead of ambient. The comment format is the one from [how to comment SQL so it teaches](https://michaelnocito.github.io/analyst-prep-kit/guides/sql-teaching-comments/). To get this shape into your fingers, [type the query yourself](https://michaelnocito.github.io/analyst-prep-kit/drill/) in the SQL Drill rather than pasting it.

## 7. Edge cases: groups, joins, and sort order

Before the explanation: NULL never equals NULL, yet the two no-region tickets just landed in one group together. How can both of those be true?

Because different parts of SQL treat NULL differently, on purpose, and the seams are where surprises live. Four to know.

**GROUP BY puts all NULLs in one group.** Grouping asks "which rows belong together?", and the standard answers that all missing values belong together, even though no two of them are equal. On the worked table, grouping by region returns West 4, East 4, and a NULL group of 2, which I ran to confirm. That blank-looking row is not a glitch. It is your missing-region count, and it is worth reading every time.

**LEFT JOIN manufactures NULLs.** A LEFT JOIN keeps every row from the left table, and when a row finds no match on the right, the right-hand columns arrive as NULL. Joining tickets to a two-row regions lookup that only lists East, I ran it: the four East tickets get their manager, and the other six rows show NULL, covering both real West tickets with no lookup entry and tickets whose region was already missing. So a NULL after a join means "no match or missing key", and telling those apart takes an `IS NULL` check on the join key. [SQL joins](https://michaelnocito.github.io/analyst-prep-kit/guides/sql-joins/) walks the whole family.

**ORDER BY has to put NULLs somewhere, and databases disagree.** Sorting the worked table by `minutes_to_close` ascending in SQLite puts the three NULL rows first, before 15; descending puts them last. SQLite and SQL Server treat NULLs as smallest, PostgreSQL and Oracle treat them as largest, and PostgreSQL and Oracle accept an explicit `NULLS FIRST` or `NULLS LAST` to say what you mean. The portable habit: when a sorted report matters, state the placement, either with that clause or by sorting on `the_column IS NULL` first.

**Empty text is not NULL, except where it is.** An empty string is a known value: someone said "nothing", rather than nobody saying anything. Filters and counts treat the two differently on most databases, so a column can look blank while `IS NULL` finds nothing. Oracle is the famous exception, storing empty strings as NULL. When blanks behave strangely, check both: `WHERE col IS NULL OR col = ''`.

## Why this works

None of this is trivia to memorize item by item. It all falls out of one design decision: a relational database must represent "value not known" without inventing a fake value, and every operator must then answer honestly when it meets one. Codd's relational model introduced exactly that idea, missing information as a first-class state rather than a magic number like 0 or 999 (Codd, 1970, _Communications of the ACM_ , 13(6), 377–387). Once "unknown" exists, three-valued logic is forced: a comparison with an unknown cannot honestly answer yes or no, so a third answer must exist, and every behavior on this page follows. `= NULL` is unknown, a chain of ANDs with one unknown link is at best unknown, and an aggregate over unknowns can only use the values it actually has.

The page also keeps asking you to commit to a row count before showing one, and that is deliberate. Generating an answer before seeing the correct one reliably improves retention, even when the guess is wrong (Bisra, Liu, Nesbit, Salimi, & Winne, 2018, _Educational Psychology Review_ , 30(3), 703–725), and retrieving beats rereading for keeping it (Roediger & Karpicke, 2006, _Psychological Science_ , 17(3), 249–255). Guessing seven and getting five is why `<>` dropping the unknowns will still be with you next month.

## Using this on your own project

Auditing every query you own for NULL handling in one pass is miserable, and nobody finishes it. Do this instead, in order.

  1. **Profile one table: run`COUNT(*)` next to `COUNT(col)` for each column that matters.** The gaps are your missing-data map, and most tables only have two or three columns worth worrying about.
  2. **Search your saved queries for`NOT IN` with a subquery.** Each one is either already screened with `IS NOT NULL` or is a zero-rows surprise waiting for the first NULL to arrive. Fix or convert to `NOT EXISTS`.
  3. **Find every`<>` in a WHERE clause and ask whether the NULL rows belong in the answer.** If they do, add `OR col IS NULL`. If they do not, leave it and move on.
  4. **Put the count of values next to every average you publish.** "62.1 across 7 of 10" is a different claim from "62.1", and the reader deserves to know which one you are making.
  5. **Label displayed NULLs with`COALESCE`, and log filled ones.** A default that changes arithmetic belongs in the limitations note, not just the query.

If you have paper nearby and five minutes, one optional drawing earns its space. Draw six rows heading toward a gate, mark two yes, two no, and two with question marks, and draw only the yes rows coming out the far side. Redrawing that from memory next week is a fair test of whether the yes-only gate is yours now.

**More detail on this, and more like it.** Every how-to sits in one place on the [guides index](https://michaelnocito.github.io/analyst-prep-kit/guides/): SQL, Tableau, data migration, and the working habits around them.

## The whole thing on one screen

This is the retrieval sheet. Cover the right column, work down the left, and say each answer out loud before you check it.

| Concept                          | What it does                                                                                  |
|----------------------------------|-----------------------------------------------------------------------------------------------|
| NULL                             | Unknown. Not zero, not empty text. A slot nobody has filled.                                  |
| `= NULL`                         | Answers unknown for every row, so it matches nothing. Ever.                                   |
| `IS NULL` / `IS NOT NULL`        | The real test for missing values. Asks about the slot, not the value.                         |
| Three-valued logic               | Comparisons answer yes, no, or unknown. NULL always produces unknown.                         |
| `WHERE`                          | Keeps only yes rows. Unknown rows drop silently, same as no.                                  |
| `<> 'x'`                         | Drops the NULL rows too. Add `OR col IS NULL` if they belong.                                 |
| `NOT IN` with a NULL in the list | Returns zero rows, no error. Screen the subquery or use `NOT EXISTS`.                         |
| `NOT EXISTS`                     | Immune to the trap, and counts NULL rows as non-matches. Decide if that is what you mean.     |
| `COALESCE(col, default)`         | First non-NULL value. Label missingness with it; do not silently rewrite numbers.             |
| `COUNT(*)` vs `COUNT(col)`       | Rows vs non-NULL values. The gap is your missing-data count.                                  |
| Aggregates                       | `SUM`, `AVG`, `MIN`, `MAX` skip NULLs. `AVG` divides by the values it kept.                   |
| `NULL = NULL`                    | Unknown, not true. No NULL ever equals another.                                               |
| `GROUP BY`                       | Still puts all NULLs in one group. That group is your missing count.                          |
| LEFT JOIN                        | Unmatched rows arrive with NULLs in the right-hand columns.                                   |
| `ORDER BY`                       | NULLs sort first or last depending on the database. Say `NULLS FIRST`/`LAST` where supported. |
| Empty string                     | A known value, distinct from NULL almost everywhere. Oracle stores it as NULL.                |

**The one habit to keep.** If you take nothing else from this page, run `COUNT(*)` next to `COUNT(the_column)` before you trust any filter, join, or average on that column. The NULL failures on this page share one trait: no error message, just a wrong row count that looks like a result. If a query misbehaves in a way this page does not cover, there is a general [diagnosis loop for being stuck](https://michaelnocito.github.io/analyst-prep-kit/guides/technical-tenacity/).

One last thought, and I would genuinely like other people's answers. My worst NULL bug was a NOT IN that returned zero rows for a week, and the report it fed just said "no exceptions found", which everyone was happy to believe. What is the longest a NULL has quietly lied to you, and what finally gave it away?

## References

  * Codd, E. F. (1970). A relational model of data for large shared data banks. _Communications of the ACM_ , 13(6), 377–387.
  * Bisra, K., Liu, Q., Nesbit, J. C., Salimi, F., & Winne, P. H. (2018). Inducing self-explanation: A meta-analysis. _Educational Psychology Review_ , 30(3), 703–725.
  * Roediger, H. L., & Karpicke, J. D. (2006). Test-enhanced learning: Taking memory tests improves long-term retention. _Psychological Science_ , 17(3), 249–255.

---

*The full version of this guide lives on my site: [NULL in SQL: Why = NULL Finds Nothing and What to Write Instead](https://michaelnocito.github.io/analyst-prep-kit/guides/sql-null/).*

*If it was useful: [Buy Me a Coffee](https://buymeacoffee.com/michaelnocito).*
