By the end of this page you can write a query that uses the answer to another query, recognise the four places one can go, spot the correlated kind that runs once per row, avoid the `NOT IN` that silently returns nothing, and convert any nest into named steps you can count one at a time. It is about twenty-five minutes, and every query and result below was run.

Here is what to do today, on the most nested query you own. Take the innermost subquery, lift it out to the top as a CTE with a real name, and run `SELECT COUNT(*)` against that name. You now know how many rows the middle of your query is working with, which is the one number a nested version will not give you.

The short version: a subquery is a query used as a value, a list, or a table. A CTE is the same query given a name up front. The logic is identical and only one of them can be checked in pieces.

That difference is the idea, so it gets the picture.

> _The original carries a diagram here. In words: Two arrangements of the same three-part query sit side by side. On the left, three rounded rectangles are drawn one inside another like nested boxes, the innermost small and buried at the centre. Only the outermost box has a count chip attached to its right-hand edge, showing the figure 4; the two inner boxes have no chip and no way to attach one, because nothing outside can reach them. On the right the same three parts are drawn as three separate boxes stacked vertically and joined by short downward arrows, each box the same size as the others. Every one of the three boxes has its own count chip on its right-hand edge, reading 16, then 8, then 4 from top to bottom. The final figure is 4 in both arrangements, so the answer has not changed; what has changed is that two intermediate numbers now exist and can be read._

**Every result on this page is real.** Sixteen orders, 9,890 in revenue, the same table used across this whole set of guides, loaded into DuckDB and queried. DuckDB's dialect is close to PostgreSQL, so these transfer to Postgres, Redshift and Snowflake unchanged.

## 1. What a subquery is, and the four places it goes

A subquery is a `SELECT` written inside another statement, wrapped in brackets. What it is _for_ depends on where you put it, and there are only four places.

| Where                          | What it must return            | What it is doing                                     |
|--------------------------------|--------------------------------|------------------------------------------------------|
| In `WHERE`, against `=` or `>` | One value                      | Supplying a number you would otherwise look up first |
| In `WHERE`, against `IN`       | One column, any number of rows | Supplying a list to match against                    |
| In `SELECT`                    | One value                      | Putting a total or a rate beside every row           |
| In `FROM`                      | A whole table                  | Querying the result of a query                       |

Everything else on this page is one of those four with a variation. Knowing which of the four you are writing tells you immediately what shape the subquery has to return, and most subquery errors are a shape mismatch: a list where one value was expected, or one column where a table was.

## 2. A scalar subquery: one value

Before the explanation: you want the orders worth more than the average order. Say why you cannot write `WHERE revenue > AVG(revenue)`.

Because `WHERE` runs before any aggregation, so at the moment it is evaluated there is no average yet. The subquery solves it by computing the average as a separate, complete query first.
    
    
    SELECT COUNT(*) AS orders, SUM(units*unit_price) AS revenue
    FROM orders
    WHERE units*unit_price > (SELECT AVG(units*unit_price) FROM orders);
    
    8 | 6475

Eight of the sixteen orders, worth 6,475 between them. The average itself is 9,890 ÷ 16, which is 618.125, and the eight are the ones above it.

A subquery that returns exactly one value is called **scalar** , and it can be used anywhere a number could be. That includes the select list, which is how you put a whole-table figure beside every row:
    
    
    SELECT order_id,
           units*unit_price AS revenue,
           ROUND(100.0*(units*unit_price)
                 / (SELECT SUM(units*unit_price) FROM orders), 1) AS pct
    FROM orders ORDER BY revenue DESC LIMIT 3;
    
    1010 | 1100 | 11.1
    1001 |  880 |  8.9
    1015 |  880 |  8.9

The largest order is 11.1% of everything. Check it: 1,100 ÷ 9,890 is 0.1112. The subquery ran once, not once per row, because it does not depend on the row it sits beside. That distinction becomes the whole of section four.

## 3. IN, and the NOT IN that returns nothing

`IN` takes a list rather than a value, so the subquery returns one column and as many rows as it likes.
    
    
    SELECT COUNT(*) FROM orders
    WHERE order_id IN (SELECT order_id FROM cancelled);
    
    2

Two of the sixteen orders are on the cancelled list. Now the obvious next step, and this is the one to slow down for.

Before the explanation: the cancelled table holds three rows, `1004`, `1009` and one `NULL`. Predict how many of the sixteen orders come back as not cancelled.
    
    
    SELECT COUNT(*) FROM orders
    WHERE order_id NOT IN (SELECT order_id FROM cancelled);
    
    0

Zero. Not fourteen. Every row disappeared, and nothing errored.

The reason is that `x NOT IN (a, b, NULL)` expands to `x <> a AND x <> b AND x <> NULL`, and a comparison with `NULL` is never true, it is unknown. An `AND` chain containing an unknown can never come out true, so no row qualifies. The full account of why unknown behaves that way is in [NULL in SQL](https://michaelnocito.github.io/analyst-prep-kit/guides/sql-null/), and this is its most expensive consequence.

Two fixes, both verified on the same data:
    
    
    -- exclude the NULLs from the list
    WHERE order_id NOT IN (SELECT order_id FROM cancelled WHERE order_id IS NOT NULL)
    14
    
    -- or use NOT EXISTS, which is immune by construction
    WHERE NOT EXISTS (SELECT 1 FROM cancelled c WHERE c.order_id = o.order_id)
    14

Prefer `NOT EXISTS`. It cannot be broken by a null appearing in the list next month, it usually plans at least as well, and it reads as what you mean: there is no matching row. Keep `IN` for the positive case, where a null in the list is harmless.

## 4. Correlated subqueries: one run per row

A subquery that refers to a column from the outer query cannot be computed once, because its answer is different for every outer row. That is a **correlated** subquery.

The question: which orders beat the average _for their own region_? Here are the region averages first, so there is something to check against.
    
    
    East  | 4 orders | 3040 | 760.00
    North | 5 orders | 2495 | 499.00
    South | 4 orders | 2670 | 667.50
    West  | 3 orders | 1685 | 561.67
    
    
    SELECT o.order_id, o.region, o.units*o.unit_price AS revenue
    FROM orders o
    WHERE o.units*o.unit_price > (
      SELECT AVG(i.units*i.unit_price)
      FROM orders i
      WHERE i.region = o.region)
    ORDER BY o.region, revenue DESC;
    
    1010 | East  | 1100
    1001 | North |  880
    1014 | North |  510
    1015 | South |  880
    1002 | South |  850
    1012 | West  |  765

Six orders. Check one: North's average is 499, and North's orders are 880, 510, 440, 425 and 240, so exactly two clear it. The inner query ran sixteen times, once per outer row, each time filtered to that row's region.

Two things follow. It reads well, because the `WHERE i.region = o.region` line says out loud what "their own region" means. And it is the slowest shape on this page, because it is a loop: on sixteen rows nobody notices, on sixteen million it is the difference between a second and a coffee break. Section eight has the version that does the same job in one pass.

## 5. The derived table, and where it stops being readable

A subquery in `FROM` returns a whole table, which the outer query then treats as if it were one. It has to be given an alias, and it is the shape that lets you filter on an aggregate you just computed.
    
    
    SELECT region, revenue FROM (
      SELECT region, SUM(units*unit_price) AS revenue
      FROM orders GROUP BY 1
    ) t
    WHERE revenue > 2500
    ORDER BY revenue DESC;
    
    East  | 3040
    South | 2670

This works and it is fine at one level deep. The trouble starts at two, because the reading order inverts: the query executes from the inside out and is written from the outside in, so you scroll down to find the beginning. At three levels, with a join in the middle, nobody reads it at all, including whoever wrote it.

There is also a practical limitation worth knowing before it bites. A derived table can only be used once. If two parts of your query need the same intermediate result, you write it twice, and then somebody edits one copy.

## 6. The CTE: the same query with a name

A common table expression is the same subquery moved to the top and given a name with `WITH`. Here is the derived table from section five, unchanged in meaning:
    
    
    WITH by_region AS (
      SELECT region, SUM(units*unit_price) AS revenue
      FROM orders GROUP BY 1
    )
    SELECT region, revenue
    FROM by_region
    WHERE revenue > 2500
    ORDER BY revenue DESC;
    
    East  | 3040
    South | 2670

Identical output. What changed is that the steps are now in the order they happen, the intermediate result has a name a person chose, and the final `SELECT` is short enough to read in one go.

They stack, separated by commas, and each one can use the ones above it:
    
    
    WITH big AS (
      SELECT * FROM orders WHERE units*unit_price > 600
    ), by_rep AS (
      SELECT rep, COUNT(*) AS orders, SUM(units*unit_price) AS revenue
      FROM big GROUP BY 1
    )
    SELECT rep, orders, revenue FROM by_rep ORDER BY revenue DESC;
    
    Priya Shah | 3 | 2440
    Owen Park  | 3 | 2390
    Dana Reyes | 1 |  880
    Sam Okafor | 1 |  765

Eight large orders, spread four ways. Reading it top to bottom describes the analysis in the order somebody would explain it out loud: first take the large orders, then group them by rep, then sort. A nested version of the same thing says the last step first.

A named step can also be used more than once, which the derived table could not. [The CTE guide](https://michaelnocito.github.io/analyst-prep-kit/guides/sql-ctes/) goes further into the syntax and into building a query in checkable stages; this page is about when to reach for one instead of a subquery.

## 7. Counting every step

This is the practical reason to prefer CTEs, and it is worth more than the readability.

When a nested query returns the wrong answer, you have one number, the final one, and no way to tell which layer went wrong. With named steps you can point `SELECT COUNT(*)` at any of them by changing the last line:
    
    
    WITH big AS (
      SELECT * FROM orders WHERE units*unit_price > 600
    ), by_rep AS (
      SELECT rep, COUNT(*) AS orders, SUM(units*unit_price) AS revenue
      FROM big GROUP BY 1
    )
    SELECT COUNT(*) FROM big;      -- 8
    -- SELECT COUNT(*) FROM by_rep;   -- 4

Sixteen orders in, eight survive the filter, four rows come out of the grouping. Write those three numbers down before you run the real query, then compare. A filter that was meant to remove a handful and removed most of the table announces itself immediately, and a grouping that produced more rows than you have categories means a join multiplied something.

Say out loud what the equivalent debugging looks like on a three-deep nested query. You comment out the outer layers one at a time, editing the query to inspect it, which means the thing you are testing is no longer the thing that was wrong. Named steps let you look without changing anything above the last line.

## 8. When a window function beats both

The correlated subquery from section four asked: is this order above its region's average? Here is the same question with no subquery at all.
    
    
    SELECT order_id, region, revenue FROM (
      SELECT order_id, region,
             units*unit_price AS revenue,
             AVG(units*unit_price) OVER (PARTITION BY region) AS region_avg
      FROM orders)
    WHERE revenue > region_avg
    ORDER BY region, revenue DESC;
    
    1010 | East  | 1100
    1001 | North |  880
    1014 | North |  510
    1015 | South |  880
    1002 | South |  850
    1012 | West  |  765

The same six orders. `AVG(...) OVER (PARTITION BY region)` computes each region's average once and attaches it to every row of that region, in a single pass, instead of running a separate query per row.

So the rule of thumb: whenever a correlated subquery is computing an aggregate over a group the outer row belongs to, a window function does it faster and usually more clearly. [Window functions](https://michaelnocito.github.io/analyst-prep-kit/guides/sql-window-functions/) covers the rest of what `OVER` can do. Correlated subqueries keep their place for existence checks and for logic a window cannot express.

Picture the slowest query you are responsible for. Is there a subquery inside it that mentions a column from the outer query? That one line is where the time is going.

## The full before and after

Same question: which reps are carrying the large orders?

### Before
    
    
    SELECT rep, COUNT(*), SUM(revenue) FROM (
      SELECT rep, units*unit_price AS revenue FROM orders
      WHERE units*unit_price > (SELECT AVG(units*unit_price) FROM orders)
    ) x GROUP BY 1 ORDER BY 3 DESC;

Correct, and it has to be read from the middle outwards. The threshold is buried two levels down. There is no way to ask how many rows survived the filter without editing the query, and the derived table is called `x`, which tells the next reader nothing.

### After
    
    
    WITH avg_order AS (
      SELECT AVG(units*unit_price) AS v FROM orders          -- 618.125
    ), big AS (
      SELECT * FROM orders
      WHERE units*unit_price > (SELECT v FROM avg_order)     -- 8 rows
    ), by_rep AS (
      SELECT rep, COUNT(*) AS orders, SUM(units*unit_price) AS revenue
      FROM big GROUP BY 1                                    -- 4 rows
    )
    SELECT rep, orders, revenue FROM by_rep ORDER BY revenue DESC;
    
    Priya Shah | 3 | 2440
    Owen Park  | 3 | 2390
    Dana Reyes | 1 |  880
    Sam Okafor | 1 |  765

Same answer, read top to bottom, with the threshold named and three intermediate counts you can verify separately. 2,440 plus 2,390 plus 880 plus 765 is 6,475, which is the figure section two produced from the whole table, so nothing was lost between the steps.

The claim, and it is the reason to convert: **a nested query gives you one number to check and a named one gives you a number per step, which is the difference between knowing the answer is wrong and knowing where.**

## Edge cases that break a subquery

Six worth knowing.

**A scalar subquery that returns more than one row.** Fine until the data changes, then the query errors. If you are relying on it returning one row, say so with `LIMIT 1` and an `ORDER BY`, or aggregate it.

**A scalar subquery that returns no rows.** It gives `NULL`, not an error, and `NULL` in a comparison makes the whole condition unknown, so rows quietly disappear rather than a message appearing.

**`NOT IN` against anything nullable.** Section three. Assume every column is nullable unless the schema says otherwise, and reach for `NOT EXISTS`.

**A correlated subquery on a large table.** It is a loop. If a query got slow after somebody added a filter that references the outer table, this is why.

**The same CTE used twice.** Some engines recompute it each time it is referenced and some materialise it once, and which one yours does affects both speed and, if the CTE contains anything non-deterministic, the answer. Check your engine's behaviour before relying on it.

**An alias that shadows a table.** In a correlated subquery, if the inner and outer tables are not clearly aliased, `WHERE region = region` compares a column to itself and is always true, so the filter silently does nothing. Always alias both, as `o` and `i` above.

## Why this works

The nesting is not an accident of the language, it is the design. SQL's ancestor was built around the idea of a query block that could appear wherever a value or a table could, so that a complex question could be composed out of simpler ones without inventing new syntax for each combination (Chamberlin & Boyce, 1974, _Proceedings of the 1974 ACM SIGFIDET Workshop on Data Description, Access and Control_ , 249–264). That is why there are exactly four places a subquery can go: they are the four places a value or a table can appear. And it explains why a CTE is not a different feature. It is the same block, given a name and moved to the front, which is why converting between them never changes the answer.

The `NOT IN` failure is also a design consequence rather than a bug. A missing value is explicitly not the same as any other value, including itself, so a comparison involving one yields unknown rather than true or false, and an `AND` chain containing unknown cannot come out true (Codd, 1979, _ACM Transactions on Database Systems_ , 4(4), 397–434). Once you accept that rule, zero rows from `NOT IN` is not surprising, it is forced. The reason it catches everybody is that `IN` behaves perfectly normally on the same list, so the failure appears only on the negation.

One note on the cheat sheet below. It is built to be covered and recalled rather than reread, because self-testing beats restudying reliably enough to show up across a wide range of real classroom and workplace settings, not only in the laboratory (Agarwal, Nunes, & Blunt, 2021, _Educational Psychology Review_ , 33(4), 1409–1453).

## Using this on your own project

Rewriting every query in a repository is miserable and pointless. Do this instead, in order.

  1. **Search your queries for`NOT IN (SELECT`** and change each to `NOT EXISTS`. That is a correctness fix, not a style one, and it is mechanical.
  2. **Find any query nested more than one level** and convert only that one. Two levels is where readability falls off a cliff.
  3. **Name each CTE after what one of its rows is** : `big_orders`, `by_rep`, `first_purchase`. Not `t`, `x` or `cte1`.
  4. **Write the expected row count as a comment on each step** before you run it, then check. That habit finds more bugs than reading the SQL does.
  5. **Look for correlated subqueries in anything slow** , and replace the aggregate ones with a window function.
  6. **Leave working single-level subqueries alone.** A scalar subquery in a `WHERE` clause is clear and needs no ceremony.

If you have paper nearby, one optional sketch is worth five minutes. Draw your query as boxes, one per step, with an arrow between them, and write beside each box how many rows you expect to come out of it. That drawing is the CTE version, and typing it up afterwards is mostly transcription.

**More detail on this, and more like it.** Every how-to sits in one place on the [guides index](https://michaelnocito.github.io/analyst-prep-kit/guides/). If you would rather type queries than read about them, the [SQL Drill](https://michaelnocito.github.io/analyst-prep-kit/drill/) hands you one runnable query at a time against a real database, each one the query you just typed plus one new thing.

## The whole thing on one screen

This is the retrieval sheet. Cover the right column, work down the left, and say each answer out loud before you check it.

| Thing                      | What it does                                                |
|----------------------------|-------------------------------------------------------------|
| A subquery                 | A SELECT used as a value, a list or a table.                |
| The four places            | WHERE with a comparison, WHERE with IN, SELECT, FROM.       |
| Scalar subquery            | Returns one value. Usable anywhere a number could go.       |
| Why not `WHERE x > AVG(x)` | WHERE runs before aggregation. There is no average yet.     |
| `IN (SELECT ...)`          | One column, any number of rows.                             |
| `NOT IN` with a NULL       | Returns zero rows. No error.                                |
| The fix                    | `NOT EXISTS`, or filter the NULLs out of the list.          |
| Correlated subquery        | Mentions an outer column, so it runs once per outer row.    |
| Its cost                   | A loop. Invisible on small tables, expensive on large ones. |
| Derived table              | A subquery in FROM. Needs an alias. Usable once.            |
| CTE                        | `WITH name AS (...)`. Same query, named, at the top.        |
| Stacking                   | Comma-separated. Each can use the ones above it.            |
| Why prefer a CTE           | Every step gets a name and a row count you can check.       |
| Debugging a CTE            | Change the final line to `SELECT COUNT(*) FROM step`.       |
| Correlated aggregate       | Replace with `AVG(...) OVER (PARTITION BY ...)`.            |
| Scalar returning no rows   | NULL, so the comparison is unknown and rows vanish.         |
| Alias both tables          | Or `WHERE region = region` is always true.                  |

**The one habit to keep.** Write the row count you expect beside every step before you run it. A nested query only lets you check the last number; a named one lets you check all of them, and the first count that disagrees with your expectation is the bug. If a query misbehaves in a way this page does not cover, there is a general [diagnosis loop for being stuck](https://michaelnocito.github.io/analyst-prep-kit/guides/technical-tenacity/).

One last thought, and I would genuinely like other people's answers. The one that cost me most was a `NOT IN` against a supplier list that had been fine for a year, until one supplier record was created with a blank code, and the exclusion report went from a few hundred rows to none overnight without anybody noticing an empty report was unusual. What has a subquery quietly done to you?

## References

  * Chamberlin, D. D., & Boyce, R. F. (1974). SEQUEL: A structured English query language. _Proceedings of the 1974 ACM SIGFIDET Workshop on Data Description, Access and Control_ , 249–264.
  * Codd, E. F. (1979). Extending the database relational model to capture more meaning. _ACM Transactions on Database Systems_ , 4(4), 397–434.
  * Agarwal, P. K., Nunes, L. D., & Blunt, J. R. (2021). Retrieval practice consistently benefits student learning: A systematic review of applied research. _Educational Psychology Review_ , 33(4), 1409–1453.

---

*The full version of this guide lives on my site: [Subquery vs CTE in SQL: Same Logic, One You Can Check](https://michaelnocito.github.io/analyst-prep-kit/guides/sql-subqueries/).*

*If it was useful: [Buy Me a Coffee](https://buymeacoffee.com/michaelnocito).*
