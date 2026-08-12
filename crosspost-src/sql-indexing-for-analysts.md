By the end of this page you can tell whether a query is reading your whole table or jumping straight to what it needs, add an index that changes which of those happens, recognise the three common ways a query throws away an index it already has, and say what indexes cost so you can argue for one honestly. It is about twenty-five minutes, and every timing below was measured on half a million rows.

Here is what to do today, on the query that is too slow. Put `EXPLAIN QUERY PLAN` in front of it, or `EXPLAIN` on Postgres and most others. If the answer contains the word _scan_ against a large table, the engine is reading every row, and that is the fact worth having before you change anything.

The short version: an index is a sorted copy of one or more columns kept alongside the table, so the engine can jump to a value instead of walking past every row looking for it.

Walking against jumping is the idea, so it gets the picture.

> _The original carries a diagram here. In words: Two copies of the same table stand side by side, each drawn as a tall stack of twelve thin horizontal bars in no particular order, with one bar near the bottom of each stack picked out in a darker shade as the row being looked for. On the left, a single blue line enters at the top of the stack and zigzags down through every single bar in turn before reaching the highlighted one, touching all twelve. On the right, a narrow second strip stands beside the stack, its segments graded evenly from short to long to show that it is a sorted copy of one column. An amber line goes straight into one segment of that sorted strip, without passing any others, and then a short horizontal arrow crosses from that segment to the highlighted bar in the stack. Both routes end at the same row; one of them visits eleven rows it did not want and the other visits none._

**Every number on this page was measured.** A 500,000-row orders table in SQLite, each query run five times with the fastest run reported, and the query plans read out of the engine rather than guessed. SQLite is used because its plans say _SCAN_ or _SEARCH_ in words; Postgres calls the same two things a sequential scan and an index scan, and everything here transfers.

## 1. What an index actually is

Before the explanation: your table has 500,000 rows and you ask for one customer. Say how many rows the engine has to look at.

All of them, unless something tells it where to stop. A table is a heap of rows in no particular order, so the only way to be sure you have found every match is to check every row. That is a **full table scan** , and it is not a mistake; it is the only correct thing to do without more information.

An index is that extra information. It is a separate structure holding the values of one or more columns, kept in sorted order, with a pointer from each value back to its row. Because it is sorted, the engine can find a value the way you find a word in a dictionary: not by reading every page, but by repeatedly discarding the half that cannot contain it.

Two consequences follow immediately and explain most of this page. An index only helps for the columns it covers, so an index on `customer_id` does nothing for a query about `region`. And it only helps if the query asks about the value in a way that the sorted order can answer, which is why section five exists.

## 2. Reading the plan: scan against search

You never have to guess which one is happening. Every engine will tell you, and on SQLite it is one word in front of the query.
    
    
    EXPLAIN QUERY PLAN
    SELECT COUNT(*), SUM(units*unit_price) FROM orders WHERE customer_id = 41234;
    
    SCAN orders

**SCAN** means every row. After adding an index on that column, the same query reports:
    
    
    SEARCH orders USING INDEX idx_customer (customer_id=?)

**SEARCH** means it went in through the index. The name of the index is right there, which is how you confirm the one you added is the one being used rather than a different one.

A third phrase turns up constantly and is worth recognising: **COVERING INDEX**. It means every column the query needed was inside the index, so the engine never had to go back to the table at all. That is the fastest case there is, and it is why an index that includes the column you are counting can outperform one that only includes the column you are filtering on.

On Postgres the same three ideas read as `Seq Scan`, `Index Scan` and `Index Only Scan`. Different words, same distinction, and `EXPLAIN ANALYZE` there gives you the timings as well.

## 3. The measurement

Here is the same query before and after one index, on 500,000 rows, best of five runs.
    
    
    SELECT COUNT(*), SUM(units*unit_price) FROM orders WHERE customer_id = 41234;
    
    no index    SCAN orders                                        90.9 ms
    index       SEARCH orders USING INDEX idx_customer (id=?)       0.2 ms

The result is identical, nine rows totalling 8,415, in both cases. Only the route changed. That is the whole promise of an index and the reason people reach for one first.

A range works the same way. Filtering a month out of a year of dates:
    
    
    WHERE order_date >= '2026-03-01' AND order_date < '2026-04-01'
    
    no index    SCAN orders                                       123.5 ms
    index       SEARCH orders USING COVERING INDEX idx_date        3.9 ms

42,470 rows either way. Notice that this one came back as a covering index: the query only needed the date, and the date is in the index, so the table was never touched.

Say out loud why the range case is slower than the point lookup even with an index. It is returning 42,470 matches rather than nine, and the index gets you to the start of the matches quickly but the engine still has to walk them. An index removes the cost of finding rows, not the cost of reading the ones you asked for.

## 4. What an index costs

Indexes are not free, and knowing the price is what lets you ask for one without being waved away.

**Time to build.** Creating the index on 500,000 rows took 572 ms. On a hundred million rows it is minutes, and on some engines it locks the table while it runs.

**Disk.** The database file was 25.1 MB with the first index in place. Every index is a second copy of its columns plus pointers, so a table with six indexes can be several times its own size.

**Writes.** This is the one people underestimate. Every insert, update and delete has to maintain every index on the table. Measured on the same machine, inserting 200,000 rows:
    
    
    no indexes        449 ms
    three indexes    3124 ms      7.0x slower

Seven times, for three indexes. That is the trade in one number: reads get faster and writes get slower, and which matters depends entirely on what the table is for. A reporting table loaded once a night can carry a lot of indexes. A table taking a write per user action cannot.

It also explains a piece of advice that sounds odd until you have seen this: when bulk loading a large table, drop the indexes, load, then rebuild them. Building an index once over finished data is much cheaper than maintaining it through every row.

## 5. Three ways to lose an index you have

Before the explanation: the index on `customer_id` exists and the query filters on `customer_id`. Say whether that guarantees it will be used.

It does not, and all three of these were measured on a table where the index existed.

**A function or arithmetic on the column.**
    
    
    WHERE customer_id = 41234        SEARCH ... (customer_id=?)     0.2 ms
    WHERE customer_id + 0 = 41234    SCAN                          57.9 ms

The index is sorted by `customer_id`, not by `customer_id + 0`. As far as the engine is concerned that is a different expression, and it has no sorted copy of it, so it computes it for every row. The date version is worse:
    
    
    WHERE order_date >= '2026-03-01' AND order_date < '2026-04-01'    3.9 ms
    WHERE strftime('%Y-%m', order_date) = '2026-03'                 488.8 ms

Same 42,470 rows, 125 times slower, and slower than having no index at all was, because now it is doing a full pass _and_ calling a function half a million times. This is the concrete reason behind the advice in [the date guide](https://michaelnocito.github.io/analyst-prep-kit/guides/sql-dates/) to compare the raw column to a range rather than wrapping it.

**A leading wildcard.** `LIKE 'Nor%'` can in principle use a sorted index, because everything starting with those three letters sits together. `LIKE '%orth'` cannot, in any engine, because a sorted list gives no starting point for an unknown prefix. On the engine used here neither form used the index and both scanned, at around 80 to 96 ms, while plain equality on the same column ran as a SEARCH in 16.0 ms. The rule to take away: an equality or a prefix range is index-friendly, and text matching in the middle of a value is a different problem needing a different kind of index.

**A type mismatch.** Comparing an indexed number to a quoted string, or an indexed string to a number, makes the engine convert one side per row, which is a function on the column wearing a disguise. If a query is unexpectedly scanning, check that both sides of the comparison are the same type before checking anything else.

## 6. Composite indexes and the leftmost rule

An index can cover several columns, and the order you list them in decides what it can be used for. One index on `(region, product)`, three queries, all measured:
    
    
    WHERE region = 'North'                         SEARCH (region=?)              16.1 ms
    WHERE region = 'North' AND product = 'Desk'    SEARCH (region=? AND product=?)  4.7 ms
    WHERE product = 'Desk'                         SCAN                            77.1 ms

The first two use it and the third does not. The reason is what the sorting means: the index is sorted by region first, and by product only within each region. Ask for a region and you know where to start. Ask for a product without a region and the matching entries are scattered through the whole index, so there is nothing to jump to.

That is the **leftmost prefix rule** , and it is the single most useful thing to know about composite indexes. An index on `(a, b, c)` serves queries on `a`, on `a and b`, and on `a, b and c`. It does nothing for a query on `b` alone.

Which gives a practical ordering rule: put the column you always filter on first, and the one you sometimes add second. If you genuinely need both directions, that is two indexes, and now you are back in section four deciding whether the write cost is worth it.

## 7. Selectivity: the same index, 130 times apart

Before the explanation: one index, one column, two queries that differ only in the number in them. Predict whether they take similar time.
    
    
    WHERE customer_id > 100        499,157 rows match      26.1 ms
    WHERE customer_id > 59990           74 rows match       0.2 ms

Both used the index. One is 130 times slower than the other, and nothing about the query or the index changed except how much of the table matched.

That property has a name, **selectivity** : what fraction of the table a condition keeps. An index is worth having when the condition is selective, and does little when it is not, because returning most of the table means reading most of the table however you got there. The same effect shows on a column with only two values:
    
    
    WHERE is_returned = 0     490,000 rows      45.2 ms
    WHERE is_returned = 1      10,000 rows       0.9 ms

The identical index, on the identical column, is excellent for the rare value and nearly pointless for the common one. This is why "index every column" is bad advice: an index on a flag that is 98% one value pays the full write cost and earns almost nothing on the query people actually run.

It is also why engines keep statistics about the distribution of values, and why a query that was fast last month can be slow today without anybody changing it: the data changed shape, and the optimiser now makes a different choice.

## 8. What to index, and what not to

The short list, in the order I would work through it.

| Index this                            | Why                                                                            |
|---------------------------------------|--------------------------------------------------------------------------------|
| Primary keys                          | Already done for you in most engines.                                          |
| Foreign keys, the columns you join on | Often the largest single win, because a join without one is a scan per lookup. |
| Columns in `WHERE` on big tables      | Especially dates, when you filter a period out of history.                     |
| Columns you sort by, on big results   | A sorted index can supply the order without a sort step.                       |

| Do not bother                       | Why                                                                                  |
|-------------------------------------|--------------------------------------------------------------------------------------|
| Small tables                        | Reading a few thousand rows is already fast. The engine may ignore the index anyway. |
| Low-cardinality columns             | Section seven. A flag with two values earns little and costs the same.               |
| Columns that are written constantly | Every update maintains the index too.                                                |
| Every column, defensively           | Seven times slower writes and a much larger file, for indexes nothing uses.          |

One more piece of advice that matters more than any of the above: as an analyst you frequently cannot create an index, because you have read access to somebody else's database. That is not a dead end. The plan output is still available to you, and "this query scans a hundred million rows because there is no index on `order_date`" is a specific, actionable request that a database owner can act on in a minute. Vague requests to make it faster get nothing; a plan output and a measured timing get an index.

And when the answer is genuinely no, the remaining moves are the ones in [handling large datasets](https://michaelnocito.github.io/analyst-prep-kit/guides/handle-large-datasets/): filter earlier, aggregate in the database, sample while developing, and materialise the result once instead of re-querying it.

## The full before and after

Same question: what did one customer buy, out of half a million orders?

### Before
    
    
    SELECT COUNT(*), SUM(units*unit_price)
    FROM orders WHERE customer_id = 41234;
    
    plan : SCAN orders
    time : 90.9 ms

Correct, and it read all 500,000 rows to return nine of them. On a dashboard that runs this once per customer per page load, that is the entire performance problem, and nothing in the query looks wrong.

### After
    
    
    CREATE INDEX idx_customer ON orders(customer_id);     -- 572 ms, once
    
    SELECT COUNT(*), SUM(units*unit_price)
    FROM orders WHERE customer_id = 41234;
    
    plan : SEARCH orders USING INDEX idx_customer (customer_id=?)
    time : 0.2 ms

Same nine rows, same 8,415. One statement, run once, and the cost is 25 MB of file, half a second of build time, and slower writes on a table that is loaded in batches anyway.

The claim, and it is the reason to read a plan before optimising anything: **the query did not change, the data did not change, and the same result went from 90.9 ms to 0.2 ms because the engine stopped reading rows it was never going to return.**

## Edge cases worth knowing

Six that come up.

**The optimiser ignores your index on purpose.** If it estimates that most of the table matches, a scan is genuinely cheaper than jumping around, and it will scan. That is usually correct, and when it is wrong it is because the statistics are stale.

**Stale statistics.** Engines choose plans from summaries of the data that are refreshed periodically. After a big load, run the engine's update command, `ANALYZE` on both SQLite and Postgres, or the plan may be based on a table that no longer exists in that shape.

**Indexes on a view.** A plain view has no data and cannot be indexed. You index the underlying tables, or you need a materialised view, which is a real stored result.

**NULLs.** Whether nulls are stored in an index and whether `IS NULL` can use it varies by engine. If you filter for missing values often, test it rather than assuming.

**An index that duplicates another.** An index on `(a)` is redundant when an index on `(a, b)` already exists, by the leftmost rule. It is pure write cost. Look for these before adding more.

**Joins.** An unindexed join key is the most expensive thing in most slow queries, because the lookup happens once per row of the other table. If a join is slow, index the key on the larger side first; the mechanics of what a join is doing are in [the joins guide](https://michaelnocito.github.io/analyst-prep-kit/guides/sql-joins/).

## Why this works

The reason a lookup can go from ninety milliseconds to a fraction of one is that the two routes have different growth curves rather than different constants. Scanning is proportional to the number of rows: double the table and you double the time. Searching a sorted structure grows with the logarithm of the size, because each step discards a large fraction of what remains. The structure that made this practical for data on disk is the B-tree, designed to keep a large ordered index balanced and shallow so that any value can be reached in a handful of page reads even as the file grows (Bayer & McCreight, 1972, _Acta Informatica_ , 1(3), 173–189). Almost every index you will meet is a variation of it, and its shape is why the win gets bigger as the table gets bigger, not smaller.

The second half of the page is about the fact that having an index is not the same as using one. The database decides, per query, which route is cheaper, by estimating how many rows each option would touch and costing them; that estimate is why the same index is chosen for one value and ignored for another. The framework for making that decision, including the idea of estimating a condition's selectivity and choosing an access path from it, was set out early and is still the shape of what optimisers do (Selinger, Astrahan, Chamberlin, Lorie, & Price, 1979, _Proceedings of the 1979 ACM SIGMOD International Conference on Management of Data_ , 23–34). Section seven's 130-fold difference is that machinery working correctly, and section five's failures are it working correctly on an expression you did not mean to write.

One note on the cheat sheet below. It is built to be covered and recalled rather than reread, because practice testing comes out ahead of restudying across a very large body of comparisons, including ones run in real courses rather than laboratories (Adesope, Trevisan, & Sundararajan, 2017, _Review of Educational Research_ , 87(3), 659–701).

## Using this on your own project

Indexing everything is worse than indexing nothing. Do this instead, in order.

  1. **Find the query that is actually slow** , by timing rather than by feel. One query is usually most of the problem.
  2. **Read its plan.** If there is no scan against a large table, the problem is not indexing and you would have spent a day on the wrong thing.
  3. **Check the query is not defeating an index it already has** : a function on the column, a type mismatch, a leading wildcard.
  4. **Index the join keys first** , then the columns in `WHERE` on the biggest tables.
  5. **Measure before and after** , best of several runs, and write both numbers down. That pair is the whole argument for keeping the index.
  6. **If you cannot create indexes** , send the plan and the two timings to whoever can. A specific request gets acted on; a slow report does not.

If you have paper nearby, one optional sketch is worth five minutes. Write out your slow query and circle every column that appears in `WHERE`, in `JOIN ... ON`, and in `ORDER BY`. Those circles are the entire candidate list for an index, in that order of priority, and most people find there are only two or three.

**More detail on this, and more like it.** Every how-to sits in one place on the [guides index](https://michaelnocito.github.io/analyst-prep-kit/guides/). If you would rather type queries than read about them, the [SQL Drill](https://michaelnocito.github.io/analyst-prep-kit/drill/) gives you one runnable query at a time against a real database.

## The whole thing on one screen

This is the retrieval sheet. Cover the right column, work down the left, and say each answer out loud before you check it.

| Thing                  | What it does                                                         |
|------------------------|----------------------------------------------------------------------|
| An index               | A sorted copy of some columns, with pointers back to the rows.       |
| No index               | Full table scan. Correct, and proportional to the row count.         |
| See which is happening | `EXPLAIN QUERY PLAN`, or `EXPLAIN` on most engines.                  |
| SCAN                   | Every row. Postgres calls it a Seq Scan.                             |
| SEARCH                 | Went in through the index. Postgres calls it an Index Scan.          |
| COVERING INDEX         | Everything needed was in the index. The table was never read.        |
| The measured win       | 90.9 ms to 0.2 ms on 500,000 rows, same result.                      |
| Build cost             | 572 ms here. Minutes on a very large table.                          |
| Write cost             | Three indexes made 200,000 inserts 7 times slower.                   |
| Bulk loading           | Drop the indexes, load, rebuild.                                     |
| Function on the column | Loses the index. `strftime(date)` was 125 times slower than a range. |
| Leading wildcard       | Cannot use a sorted index, in any engine.                            |
| Type mismatch          | A conversion per row. A function in disguise.                        |
| Composite index        | Sorted by the first column, then within it by the second.            |
| Leftmost prefix rule   | `(a,b)` serves a, and a with b. Not b alone.                         |
| Selectivity            | How much of the table a condition keeps. Rare values win.            |
| Same index, two values | 490,000 matches 45.2 ms, 10,000 matches 0.9 ms.                      |
| Index first            | Join keys, then WHERE columns on big tables.                         |
| Do not index           | Small tables, two-value flags, heavily written columns.              |

**The one habit to keep.** Read the plan before changing anything, and measure before and after. An index added on a hunch is a permanent write cost paid for an unmeasured benefit, and the plan takes ten seconds to read. If a query is slow in a way this page does not cover, there is a general [diagnosis loop for being stuck](https://michaelnocito.github.io/analyst-prep-kit/guides/technical-tenacity/).

One last thought, and I would genuinely like other people's answers. The one I remember was a nightly report that had crept from four minutes to fifty over a year, where the fix was a single index on a date column and the reason nobody had found it was that everyone assumed the query had simply got more data to chew. What turned out to be the one-line fix for something slow you inherited?

## References

  * Bayer, R., & McCreight, E. (1972). Organization and maintenance of large ordered indices. _Acta Informatica_ , 1(3), 173–189.
  * Selinger, P. G., Astrahan, M. M., Chamberlin, D. D., Lorie, R. A., & Price, T. G. (1979). Access path selection in a relational database management system. _Proceedings of the 1979 ACM SIGMOD International Conference on Management of Data_ , 23–34.
  * Adesope, O. O., Trevisan, D. A., & Sundararajan, N. (2017). Rethinking the use of tests: A meta-analysis of practice testing. _Review of Educational Research_ , 87(3), 659–701.

---

*The full version of this guide lives on my site: [When to Index a Table: A Practical Guide for Analysts](https://michaelnocito.github.io/analyst-prep-kit/guides/sql-indexing-for-analysts/).*

*If it was useful: [Buy Me a Coffee](https://buymeacoffee.com/michaelnocito).*
