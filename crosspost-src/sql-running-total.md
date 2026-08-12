By the end of this page you can add a cumulative column to any ordered result, write the frame clause that says exactly which rows are being added, run separate totals for each group in one pass, turn the same shape into a moving average, and check the whole thing with one comparison. It is about twenty-five minutes, and every result below was run.

Here is what to do today. Find your running-total query and look for the words `ROWS BETWEEN`. If they are not there, you are using the default frame, and on any column with repeated values the default frame gives every tied row the same cumulative figure. Add `ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW` and compare the two.

The short version: `SUM(x) OVER (ORDER BY y)` adds up a _frame_ of rows that ends at the current one, and the frame clause is what decides where it ends.

The frame growing one row at a time is the idea, so it gets the picture.

> _The original carries a diagram here. In words: A single column of four stacked cells runs down the left of the picture, holding the values 2,630, then 2,245, then 2,585, then 2,430. To the right of that column stand four tall square brackets, side by side and getting progressively longer. The first bracket encloses only the top cell and has the number 2,630 printed at its foot. The second encloses the top two cells and reads 4,875. The third encloses the top three and reads 7,460. The fourth encloses all four and reads 9,890. Every bracket starts at the very top of the column and differs only in where it ends, so the picture shows one growing span rather than four different calculations, and the last bracket's figure is the total of the whole column._

**Every result on this page is real.** Sixteen orders, 9,890 in revenue, the same table used across this whole set of guides, loaded into DuckDB and queried. The dialect is close to PostgreSQL, so these transfer to Postgres, Redshift and Snowflake unchanged.

## 1. The one-line running total

Aggregate to the grain you want to accumulate at first. Here that is one row per month, which is the same starting point as any trend work and is covered in [grouping by month](https://michaelnocito.github.io/analyst-prep-kit/guides/sql-dates/).
    
    
    2026-01-01 | 2630
    2026-02-01 | 2245
    2026-03-01 | 2585
    2026-05-01 | 2430

Now the cumulative column.
    
    
    SELECT month, revenue,
           SUM(revenue) OVER (ORDER BY month
                              ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW) AS running
    FROM by_month
    ORDER BY month;
    
    2026-01-01 | 2630 | 2630
    2026-02-01 | 2245 | 4875
    2026-03-01 | 2585 | 7460
    2026-05-01 | 2430 | 9890

Check by hand: 2,630 plus 2,245 is 4,875, plus 2,585 is 7,460, plus 2,430 is 9,890, which is the table's whole revenue. That last equality is not decoration; it is the test, and section seven makes it a habit.

Read the clause as a sentence: sum revenue, over the rows ordered by month, from the very beginning up to and including this row. That is what `UNBOUNDED PRECEDING` and `CURRENT ROW` mean, and once you can say it aloud the syntax stops needing to be looked up.

## 2. What the frame actually is

Before the explanation: a normal `SUM` with `GROUP BY` collapses rows. This one keeps all four. Say where the extra number is coming from.

From a **frame** : a set of rows defined relative to the row you are currently on. A window function walks the result once, and at each row it looks at a span of neighbouring rows and computes something over them. The row itself is never collapsed, which is why you get sixteen rows out of sixteen rows in.

Three parts, in order, and all three are optional, which is where the trouble comes from.

| Part               | What it decides                     | If you leave it out                        |
|--------------------|-------------------------------------|--------------------------------------------|
| `PARTITION BY`     | Where the accumulation restarts     | One partition: the whole result            |
| `ORDER BY`         | The sequence the frame moves along  | No frame at all; every row sees everything |
| `ROWS BETWEEN ...` | Exactly which rows the frame covers | A default that is not the one you meant    |

The rest of this page is those three, one at a time. If you want the wider tour of what else `OVER` can do, ranking and `LAG` and the rest, [the window functions guide](https://michaelnocito.github.io/analyst-prep-kit/guides/sql-window-functions/) is the place.

## 3. ORDER BY is what makes it running

Before the explanation: remove the `ORDER BY` from inside the `OVER`. Predict the four numbers.
    
    
    SELECT month, revenue, SUM(revenue) OVER () AS whole_thing
    FROM by_month ORDER BY month;
    
    2026-01-01 | 2630 | 9890
    2026-02-01 | 2245 | 9890
    2026-03-01 | 2585 | 9890
    2026-05-01 | 2430 | 9890

The grand total, repeated four times. With no `ORDER BY` there is no sequence, so there is no "so far", and every row's frame is the entire partition. That is a genuinely useful thing, it is how you put a denominator beside every row, and it is not a running total.

Note also the `ORDER BY` at the end of the statement is a different thing entirely. That one sorts the output. The one inside `OVER` defines the accumulation order. They are often the same column and they do not have to be, and a query that sorts its output by one column while accumulating along another will produce a cumulative column that appears to jump about.

## 4. Ties, and the default frame that lumps them

This is the section that justifies the page. Order by revenue instead of month, so that ties exist: two orders are worth 440, two are worth 660 and two are worth 880. Compute the running total twice, once with the default frame and once with `ROWS`.
    
    
    order_id | revenue | default | ROWS
        1004 |     240 |     240 |  240
        1009 |     280 |     520 |  520
        1007 |     425 |     945 |  945
        1011 |     440 |    1825 | 1385
        1016 |     440 |    1825 | 1825
        1008 |     480 |    2305 | 2305
        1014 |     510 |    2815 | 2815
        1013 |     600 |    3415 | 3415
        1003 |     660 |    4735 | 4075
        1005 |     660 |    4735 | 4735
        1006 |     680 |    5415 | 5415
        1012 |     765 |    6180 | 6180
        1002 |     850 |    7030 | 7030
        1001 |     880 |    8790 | 7910
        1015 |     880 |    8790 | 8790
        1010 |    1100 |    9890 | 9890

Look at the two 440 rows. The default says 1,825 on both. `ROWS` says 1,385 and then 1,825. Same for the two 660s and the two 880s: six of the sixteen rows disagree.

Neither is a bug. When you write `ORDER BY` in a window and leave the frame out, the standard default is `RANGE BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW`, and `RANGE` works on _values_ rather than positions: current row means every row with the same ordering value as this one. So both 440s are inside each other's frame, and both get the total including both. `ROWS` works on positions, so current row means literally this row and no further.

Say out loud which one you want for a cumulative report. Almost always `ROWS`, because a reader scanning a running total expects each line to add its own value and no more. `RANGE` is the right answer when tied rows genuinely belong together, for instance a cumulative total by day where several orders share a date and you want each day's rows to show the day's closing figure.

The reason nobody notices is that on a unique ordering column the two are identical, which is why the month query in section one gave the same answer either way. Order by anything with repeats, and they diverge. Type the frame.

## 5. A separate running total per group

`PARTITION BY` restarts the accumulation whenever the partition column changes.
    
    
    SELECT region, order_date, units*unit_price AS revenue,
           SUM(units*unit_price) OVER (PARTITION BY region ORDER BY order_date
                                       ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW) AS running
    FROM orders ORDER BY region, order_date;
    
    East  | 2026-01-19 |  660 |  660
    East  | 2026-02-09 |  680 | 1340
    East  | 2026-03-09 | 1100 | 2440
    East  | 2026-05-04 |  600 | 3040
    North | 2026-01-05 |  880 |  880
    North | 2026-01-26 |  240 | 1120
    North | 2026-02-16 |  425 | 1545
    North | 2026-03-16 |  440 | 1985
    North | 2026-05-11 |  510 | 2495
    ...

Each region starts again from its own first order, and each region's last running value is that region's total: East 3,040, North 2,495, South 2,670, West 1,685. Those four add to 9,890, so the partitions between them account for every row.

That is the same partition idea as a `GROUP BY`, with one difference worth stating plainly: `GROUP BY` replaces the rows with one row per group, and `PARTITION BY` keeps every row and adds a column. If you want both the detail and the group figure on the same line, this is the only one of the two that can do it.

## 6. A frame that slides: moving averages

Change where the frame starts and it stops being cumulative and starts sliding. `ROWS BETWEEN 2 PRECEDING AND CURRENT ROW` is a three-row window: this row and the two before it.

Run on the monthly series with a calendar, so the empty April is a real zero rather than a missing row:
    
    
    month      | revenue |    ma3 | running
    2026-01-01 |    2630 | 2630.00 |    2630
    2026-02-01 |    2245 | 2437.50 |    4875
    2026-03-01 |    2585 | 2486.67 |    7460
    2026-04-01 |       0 | 1610.00 |    7460
    2026-05-01 |    2430 | 1671.67 |    9890

Check one: the three months ending March are 2,630, 2,245 and 2,585, which average to 2,486.67. And notice the first two rows: the frame cannot reach back beyond the start, so January's average is over one row and February's over two. That is usually fine and occasionally misleading, and if it matters you suppress the first rows rather than letting a one-row average look like a three-month one.

The running column not moving between March and April is the calendar doing its job: a month with no sales adds nothing, and it is visible as a flat step rather than as an absent row. That whole argument is [the date guide's](https://michaelnocito.github.io/analyst-prep-kit/guides/sql-dates/) and it applies to every frame on this page, because a frame counts rows and a missing month is a missing row.

Two other frames worth knowing by name. `ROWS BETWEEN CURRENT ROW AND UNBOUNDED FOLLOWING` accumulates from here to the end, which gives a remaining-balance column. And `ROWS BETWEEN 1 PRECEDING AND 1 FOLLOWING` centres the window on the current row, which is the honest smoother when you are not forecasting.

## 7. The check that catches everything

One comparison catches the frame bug, a wrong partition, a missing row and a duplicated row at once.
    
    
    last running value | grand total
                  9890 | 9890

The final value of a cumulative column must equal the plain total of the column it accumulates. If it is higher, something is being counted twice, usually a join that multiplied rows. If it is lower, rows are missing before the window ever sees them, usually a filter or an inner join. If it is equal but the intermediate values look wrong, the frame is the suspect.

Write it as a query rather than doing it by eye, because "the last number looks about right" is not a check:
    
    
    SELECT (SELECT MAX(running) FROM r) AS last_running,
           (SELECT SUM(units*unit_price) FROM orders) AS grand_total;

Picture the cumulative report you send out most often. Is there anything on it that would tell you if its last row and its total had stopped agreeing?

## 8. Running counts and running share

The same shape works on anything that can be aggregated, and two variants earn their place on almost any cumulative report.
    
    
    month      | orders | running_orders | pct_of_year
    2026-01-01 |      4 |              4 |        26.6
    2026-02-01 |      4 |              8 |        49.3
    2026-03-01 |      4 |             12 |        75.4
    2026-05-01 |      4 |             16 |       100.0

The running count answers "how many so far", and it ends at 16, which is the row count of the table. The share column divides the running total by the grand total, and it is the one people actually read, because 75.4% of the year's revenue by March is a sentence and 7,460 is a number.

Note how the share was built: a windowed running total divided by a window with no `ORDER BY`, which from section three is the whole-partition total. Two windows in one expression, one accumulating and one not.
    
    
    ROUND(100.0 * SUM(revenue) OVER (ORDER BY month
                                     ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW)
          / SUM(revenue) OVER (), 1)

And the last row must be 100.0. If it is not, it is the section seven check failing in a different disguise.

## The full before and after

Same question: how did revenue accumulate through the year, and what share was in by each month?

### Before
    
    
    SELECT month, revenue,
           SUM(revenue) OVER (ORDER BY revenue) AS running
    FROM by_month;

Three problems in one line. The accumulation is ordered by revenue rather than by month, so the column climbs in size order and means nothing. There is no frame clause, so tied revenues would share a figure. And there is no check anywhere, so none of that is visible.

### After
    
    
    SELECT month,
           revenue,
           SUM(revenue) OVER (ORDER BY month
                              ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW) AS running,
           ROUND(100.0 * SUM(revenue) OVER (ORDER BY month
                                            ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW)
                 / SUM(revenue) OVER (), 1) AS pct
    FROM by_month
    ORDER BY month;
    
    2026-01-01 | 2630 | 2630 |  26.6
    2026-02-01 | 2245 | 4875 |  49.3
    2026-03-01 | 2585 | 7460 |  75.4
    2026-05-01 | 2430 | 9890 | 100.0

Ordered along time, framed explicitly, and finished with a share column whose last value has to be 100.0. The last running figure is 9,890, which is the table total, so the column reconciles.

The claim, and it is why the frame clause is worth typing every time: **on a column with ties, the default frame gave six of sixteen rows a cumulative figure that included a row below them, and the only visible difference between the two queries was a clause that most people never write.**

## Edge cases that break a running total

Six worth knowing.

**A non-unique ordering column.** Section four. If the order column has ties and you have not written a frame, the answer is not the one you are describing. Adding a tie-breaker to the `ORDER BY`, such as the primary key, also fixes it and makes the result deterministic.

**NULLs in the ordering column.** They sort to one end, and which end differs by engine. A row with a missing date can end up at the start of your cumulative column carrying nothing, or at the end carrying the lot.

**NULLs in the value column.** `SUM` skips them, so the running total flattens for those rows rather than erroring. Count them before you accumulate.

**A missing period.** A window frame counts rows, so a month with no rows is not a flat step, it simply is not there, and `2 PRECEDING` reaches back three months instead of two. Build the calendar first.

**Accumulating after a join that multiplied rows.** The running total climbs past the real total, and section seven's check is the only thing on the page that would show it.

**Filtering on the window column.** `WHERE running > 5000` does not work, because window functions are computed after `WHERE`. Wrap the query in a CTE and filter outside it, which is exactly the pattern [named steps](https://michaelnocito.github.io/analyst-prep-kit/guides/sql-subqueries/) exist for.

## Why this works

The first thing to know is that a relational table has no inherent order. Rows are members of a set, and a set has no first element, which is why `ORDER BY` exists as a presentation step at the very end of a query rather than as a property of a table (Codd, 1970, _Communications of the ACM_ , 13(6), 377–387). A running total is inherently about sequence, so it cannot be computed until a sequence is supplied, and that is precisely what the `ORDER BY` inside `OVER` is for. It is not sorting the output; it is manufacturing the order that makes "so far" meaningful. Section three's result, the grand total repeated four times, is what the language does when you ask for an accumulation without saying along what.

The frame is the second half of the same idea. Once there is an order, the engine still has to be told how much of it each row sees, and the two options differ because they answer to different things: `ROWS` counts positions and `RANGE` compares values. Database work on evaluating these functions treats the frame as the central object, because it determines both the answer and how cheaply the answer can be produced in a single ordered pass (Cao, Chan, Li, & Tan, 2012, _Proceedings of the VLDB Endowment_ , 5(11), 1244–1255). That is also why the default exists at all and why it is `RANGE`: it is the behaviour the standard specifies, not an oversight, and it is only surprising if you did not know a choice was being made.

One note on the cheat sheet below. It is built to be covered and recalled rather than reread, because actively retrieving something does more than fix it in memory, it reorganises what you know in a way that transfers to new problems (Karpicke, 2012, _Current Directions in Psychological Science_ , 21(3), 157–163).

## Using this on your own project

Auditing every window function at once is miserable. Do this instead, in order.

  1. **Search your SQL for`OVER (ORDER BY`** and check each hit for a frame clause. The ones without are the queue.
  2. **For each, ask whether the ordering column has repeats.** If it can, add `ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW` and compare the before and after.
  3. **Add a tie-breaker to the ORDER BY** so the result is the same every time it runs, even on an engine that shuffles equal rows.
  4. **Put the reconciliation in the query** : last running value against the plain total, as two columns you can see.
  5. **Build the calendar before the frame** on anything periodic, so a gap is a zero row and not an absent one.
  6. **Move any filter on a windowed column outside** , into a query that reads the named step.

If you have paper nearby, one optional sketch is worth five minutes. Draw your rows as a column of boxes and, beside them, draw the bracket you actually want at row four: where does it start, where does it end, and does it include row four's twin if there is one. Then write the frame clause that matches the bracket. Most people find they have been picturing `ROWS` the whole time.

**More detail on this, and more like it.** Every how-to sits in one place on the [guides index](https://michaelnocito.github.io/analyst-prep-kit/guides/). If you would rather type queries than read about them, the [SQL Drill](https://michaelnocito.github.io/analyst-prep-kit/drill/) gives you one runnable query at a time against a real database.

## The whole thing on one screen

This is the retrieval sheet. Cover the right column, work down the left, and say each answer out loud before you check it.

| Thing                     | What it does                                                                |
|---------------------------|-----------------------------------------------------------------------------|
| The running total         | `SUM(x) OVER (ORDER BY y ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW)` |
| What a frame is           | The rows, relative to this one, that the function adds up.                  |
| No ORDER BY inside OVER   | No sequence, so every row sees the whole partition.                         |
| That is still useful      | `SUM(x) OVER ()` is the denominator for a share column.                     |
| Two ORDER BYs             | Inside OVER sets the accumulation. At the end sorts the output.             |
| The default frame         | `RANGE BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW`.                        |
| RANGE                     | Compares values. Tied rows share one figure.                                |
| ROWS                      | Counts positions. Each row adds only itself.                                |
| Which to use              | ROWS for a cumulative report. RANGE when ties belong together.              |
| Why nobody notices        | On a unique ordering column they are identical.                             |
| `PARTITION BY`            | Restarts the accumulation per group. Keeps every row.                       |
| Against GROUP BY          | GROUP BY collapses rows; PARTITION BY adds a column.                        |
| Moving average            | `ROWS BETWEEN 2 PRECEDING AND CURRENT ROW`.                                 |
| Short frames at the start | The first rows average fewer values. Suppress or label them.                |
| Remaining balance         | `ROWS BETWEEN CURRENT ROW AND UNBOUNDED FOLLOWING`.                         |
| The check                 | Last running value equals the plain total. Share ends at 100.0.             |
| Filtering the result      | Not in WHERE. Wrap it in a CTE and filter outside.                          |

**The one habit to keep.** Put the last running value and the plain total side by side in the query itself. Every failure on this page, a wrong frame, a wrong partition, a join that multiplied rows, a filter that removed them, shows up as those two numbers disagreeing, and nothing else on a cumulative report does. If a window function misbehaves in a way this page does not cover, there is a general [diagnosis loop for being stuck](https://michaelnocito.github.io/analyst-prep-kit/guides/technical-tenacity/).

One last thought, and I would genuinely like other people's answers. Mine was a cumulative bookings report ordered by deal value rather than by date, which nobody questioned for a quarter because the last number was always right. What has a window frame quietly done in something you own?

## References

  * Codd, E. F. (1970). A relational model of data for large shared data banks. _Communications of the ACM_ , 13(6), 377–387.
  * Cao, Y., Chan, C.-Y., Li, J., & Tan, K.-L. (2012). Optimization of analytic window functions. _Proceedings of the VLDB Endowment_ , 5(11), 1244–1255.
  * Karpicke, J. D. (2012). Retrieval-based learning: Active retrieval promotes meaningful learning. _Current Directions in Psychological Science_ , 21(3), 157–163.

---

*The full version of this guide lives on my site: [Running Total in SQL: The Window Frame That Decides the Answer](https://michaelnocito.github.io/analyst-prep-kit/guides/sql-running-total/).*

*If it was useful: [Buy Me a Coffee](https://buymeacoffee.com/michaelnocito).*
