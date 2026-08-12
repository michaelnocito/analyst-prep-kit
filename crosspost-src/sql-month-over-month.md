By the end of this page you can write a month-over-month growth query and trust its answer. You will know the growth formula and how to say it in a sentence, what `LAG()` actually does, and the three traps that produce wrong percentages without producing an error: integer division, the empty first month, and the missing month. It is about twenty minutes.

Here is what to actually do today. Before you trust any growth query you have already written, run one check: count the distinct months in your data and compare that count to the calendar. If any month is missing, at least one of your growth numbers is comparing the wrong pair of months.

The short version: growth is this month minus last month, divided by last month. `LAG()` fetches last month's value onto this month's row. But `LAG()` fetches the previous row, not the previous month, and those are only the same thing when no month is missing.

That last distinction is the one that bites, so it gets the picture.

> _The original carries a diagram here. In words: Two side-by-side panels, each a vertical column of month rows. In the left panel the rows are January, February, March, and then May, because April is missing from the data. Curved arrows run from each row up to the row above it: February points to January, March points to February, and May points to March. The May-to-March arrow is drawn in a warning color with a cross beside it, because May is being compared to March, skipping the missing April. In the right panel the same months appear but a dashed April row has been inserted between March and May. Now the arrow from May points to April, and every arrow connects true calendar neighbors. A check mark sits beside the May-to-April arrow. The picture shows that LAG connects adjacent rows, so growth is only month-over-month when every calendar month has a row._

**The worked example is real.** Every query on this page ran in SQLite against the twelve-row orders table shown below, and every output is pasted from the run. SQLite has had window functions since version 3.25, so you can reproduce all of it on your own machine today. If grouping itself is new, read [GROUP BY and HAVING](https://michaelnocito.github.io/analyst-prep-kit/guides/sql-group-by-having/) first and come back.

Here is the whole dataset. Twelve orders, five months, and no orders at all in April. That empty April is on purpose, because it is the star of trap number three.

| order_id | order_date | amount |
|----------|------------|--------|
| 1        | 2025-01-04 | 120    |
| 2        | 2025-01-18 | 80     |
| 3        | 2025-01-27 | 50     |
| 4        | 2025-02-03 | 90     |
| 5        | 2025-02-14 | 130    |
| 6        | 2025-02-25 | 80     |
| 7        | 2025-03-08 | 200    |
| 8        | 2025-03-19 | 60     |
| 9        | 2025-03-30 | 100    |
| 10       | 2025-05-06 | 110    |
| 11       | 2025-05-21 | 140    |
| 12       | 2025-06-11 | 250    |

## 1. The growth formula, and how to say it in a sentence

Before the explanation: revenue was 250 in January and 300 in February. Say the February growth rate out loud before you read the formula.

Month-over-month growth is this month minus last month, divided by last month. In numbers: 300 minus 250 is 50, and 50 divided by 250 is 0.2, which is 20%. The division is the part people skip when talking, and it is the part that makes the number comparable. A jump of 50 is huge for a coffee cart and a rounding error for an airline. Dividing by last month turns the raw change into a share of where you started.

The sentence version matters because you will be asked for it in interviews and in hallways. Practice this exact shape: "Revenue grew 20% month over month, from 250 in January to 300 in February." Rate first, then the two raw numbers. Giving both protects you, because a percentage with no base hides small numbers, and a raw change with no base hides scale.

One vocabulary note. "Month over month" always means this month compared to the month immediately before it. Comparing June to last June is "year over year," and the two answer different questions. Section seven comes back to that.

## 2. One row per month first, then compare

Before the explanation: the orders table has twelve rows covering five months. How many rows should the table you compare neighbors on have?

Five. Growth is a comparison between months, so before any comparing can happen, the data has to become one row per month. This is a grain move. Grain is what one row means: right now one row is one order, and the question needs one row to be one month. `GROUP BY` makes that move, and [GROUP BY and HAVING](https://michaelnocito.github.io/analyst-prep-kit/guides/sql-group-by-having/) covers it in full if the collapse feels magic.
    
    
    SELECT strftime('%Y-%m', order_date) AS month,
           SUM(amount) AS revenue
    FROM orders
    GROUP BY strftime('%Y-%m', order_date)
    ORDER BY month;

The `strftime('%Y-%m', ...)` part chops a full date like 2025-01-04 down to its month, 2025-01. Other databases spell this differently: `DATE_TRUNC('month', order_date)` in PostgreSQL, `FORMAT(order_date, 'yyyy-MM')` in SQL Server. Same idea everywhere. Here is the real output.

| month   | revenue |
|---------|---------|
| 2025-01 | 250     |
| 2025-02 | 300     |
| 2025-03 | 360     |
| 2025-05 | 250     |
| 2025-06 | 250     |

Check it by hand once, because trust in the rest of the page flows from this table. January is 120 plus 80 plus 50, which is 250. March is 200 plus 60 plus 100, which is 360. And notice what the table does not have: an April row. Zero orders means zero rows to group, so April is not zero here. It is absent. Keep that in mind.

## 3. LAG in everyday words

Before the explanation: you have five monthly rows and you need each row to also know the previous row's revenue. Where would that number physically go?

Onto the same row, in a new column. That is the whole job of `LAG()`. In everyday words: sort the rows, then for each row, reach up to the row above and copy a value down. `LAG(revenue) OVER (ORDER BY month)` says "sort by month, then hand every row the revenue from the row before it." It is a window function, which means it can see neighboring rows without collapsing them, and [window functions](https://michaelnocito.github.io/analyst-prep-kit/guides/sql-window-functions/) covers that family properly.
    
    
    WITH monthly AS (
      SELECT strftime('%Y-%m', order_date) AS month,
             SUM(amount) AS revenue
      FROM orders
      GROUP BY strftime('%Y-%m', order_date)
    )
    SELECT month,
           revenue,
           LAG(revenue) OVER (ORDER BY month) AS prev_revenue
    FROM monthly
    ORDER BY month;

| month   | revenue | prev_revenue |
|---------|---------|--------------|
| 2025-01 | 250     | NULL         |
| 2025-02 | 300     | 250          |
| 2025-03 | 360     | 300          |
| 2025-05 | 250     | 360          |
| 2025-06 | 250     | 250          |

Once last month sits beside this month, growth is plain arithmetic on one row: revenue minus prev_revenue, divided by prev_revenue. But look closely at that output first. Two of the five rows already contain this page's remaining traps. January's prev_revenue is NULL. And May's prev_revenue is 360, which is March's number. Both get their own section.

The `ORDER BY month` inside the parentheses is not decoration. LAG has no idea what a month is. It only knows "the row before this one in the order I was given." Sort by the wrong column and LAG will cheerfully hand you the revenue of some unrelated row.

## 4. Two quiet traps: integer division and the NULL first month

Before the explanation: 50 divided by 250 is 0.2. What will a database answer if both numbers are stored as whole numbers?

Zero. In most databases, dividing one integer by another throws away the remainder, because an integer column promises whole numbers. So `(revenue - prev_revenue) / prev_revenue` is 50 / 250, which integer division rounds down to 0. Every growth rate between minus 99% and plus 99% becomes zero, the query runs without complaint, and the report says growth is flat. I ran exactly that against this table and every single month came back 0.

The fix is to force decimal math before the division happens. Multiplying by `100.0` first does it, because one decimal number in the expression makes the whole expression decimal:
    
    
    ROUND(100.0 * (revenue - prev_revenue) / prev_revenue, 1) AS growth_pct

That returns 20.0 for February instead of 0. `CAST(revenue AS REAL)` does the same job if you prefer it spelled out.

The second quiet trap is January. Its prev_revenue is NULL, because LAG reached up from the first row and found nothing there. NULL is SQL's marker for unknown, a hole where a value would go, and [NULL in SQL](https://michaelnocito.github.io/analyst-prep-kit/guides/sql-null/) is a whole guide on how those holes behave. Here the behavior is actually merciful: arithmetic with NULL yields NULL, so January's growth prints as NULL rather than as a fake number. Leave it that way. A NULL first month is the honest answer, because growth from before your data started is genuinely unknown. The only mistake is "fixing" it to zero, which claims flat growth you have no evidence for.

## 5. The missing-month trap, shown actually happening

Here is the full naive growth query. It looks finished. Say what May's growth_pct will be, and against which month, before you look at the output.
    
    
    WITH monthly AS (
      SELECT strftime('%Y-%m', order_date) AS month,
             SUM(amount) AS revenue
      FROM orders
      GROUP BY strftime('%Y-%m', order_date)
    )
    SELECT month,
           revenue,
           LAG(revenue) OVER (ORDER BY month) AS prev_revenue,
           ROUND(100.0 * (revenue - LAG(revenue) OVER (ORDER BY month))
                 / LAG(revenue) OVER (ORDER BY month), 1) AS growth_pct
    FROM monthly
    ORDER BY month;

| month   | revenue | prev_revenue | growth_pct |
|---------|---------|--------------|------------|
| 2025-01 | 250     | NULL         | NULL       |
| 2025-02 | 300     | 250          | 20.0       |
| 2025-03 | 360     | 300          | 20.0       |
| 2025-05 | 250     | 360          | -30.6      |
| 2025-06 | 250     | 250          | 0.0        |

The May row reports a 30.6% drop. That number is labeled month over month, and it is not month over month. April had no orders, so April has no row, so the row above May is March. LAG did its job perfectly: it fetched the previous row. The previous row was two calendar months ago. Nothing errors, nothing warns, and the report now says one month's decline when the truth is a two-month slide with a dead month in the middle.

Say out loud why May compared itself to March before reading the fix. If you can state it, you can spot it in any query for the rest of your career.

The fix is to build the calendar yourself and attach the data to it, so every month has a row whether or not it had orders. In SQLite a recursive CTE generates the months. PostgreSQL has `generate_series` for the same job, and in a warehouse you usually join to a date dimension table that already exists.
    
    
    WITH RECURSIVE calendar(month) AS (
      SELECT '2025-01'
      UNION ALL
      SELECT strftime('%Y-%m', date(month || '-01', '+1 month'))
      FROM calendar
      WHERE month < '2025-06'
    ),
    monthly AS (
      SELECT strftime('%Y-%m', order_date) AS month,
             SUM(amount) AS revenue
      FROM orders
      GROUP BY strftime('%Y-%m', order_date)
    )
    SELECT c.month,
           COALESCE(m.revenue, 0) AS revenue,
           LAG(COALESCE(m.revenue, 0)) OVER (ORDER BY c.month) AS prev_revenue,
           ROUND(
             100.0 * (COALESCE(m.revenue, 0)
                      - LAG(COALESCE(m.revenue, 0)) OVER (ORDER BY c.month))
             / NULLIF(LAG(COALESCE(m.revenue, 0)) OVER (ORDER BY c.month), 0),
           1) AS growth_pct
    FROM calendar c
    LEFT JOIN monthly m ON m.month = c.month
    ORDER BY c.month;

Three small parts carry the weight. The `LEFT JOIN` keeps every calendar month even when no orders match it. `COALESCE(m.revenue, 0)` turns the empty April into an actual zero, which is correct here because zero orders really did mean zero revenue. And `NULLIF(..., 0)` guards the division: growth from a zero month would divide by zero, so it returns NULL instead. Here is the real output.

| month   | revenue | prev_revenue | growth_pct |
|---------|---------|--------------|------------|
| 2025-01 | 250     | NULL         | NULL       |
| 2025-02 | 300     | 250          | 20.0       |
| 2025-03 | 360     | 300          | 20.0       |
| 2025-04 | 0       | 360          | -100.0     |
| 2025-05 | 250     | 0            | NULL       |
| 2025-06 | 250     | 250          | 0.0        |

Now the story is true. April fell 100%, to nothing. May's growth is NULL because a percentage climb from zero is undefined, and NULL is the honest way to print undefined. The fake single-month 30.6% drop is gone, replaced by what actually happened: a collapse and a restart.

## 6. The full before and after

Same table, same question: how is revenue growing month over month?

### Before
    
    
    WITH monthly AS (
      SELECT strftime('%Y-%m', order_date) AS month,
             SUM(amount) AS revenue
      FROM orders
      GROUP BY strftime('%Y-%m', order_date)
    )
    SELECT month, revenue,
           (revenue - LAG(revenue) OVER (ORDER BY month))
             / LAG(revenue) OVER (ORDER BY month) AS growth
    FROM monthly;

Three defects, zero error messages. Integer division makes every growth rate print as 0. The missing April makes May compare against March. And nothing on the screen tells the reader either thing happened.

### After
    
    
    -- ============================================================
    -- Month-over-month revenue growth.
    -- WHY the calendar CTE: LAG compares adjacent ROWS. April has
    --      no orders, so without a calendar row May would compare
    --      against March and report a fake one-month drop.
    -- WHY 100.0: integer division would round every rate to 0.
    -- WHY NULLIF: growth from a zero month is undefined, and NULL
    --      is the honest way to report undefined.
    -- ============================================================
    WITH RECURSIVE calendar(month) AS (
      SELECT '2025-01'
      UNION ALL
      SELECT strftime('%Y-%m', date(month || '-01', '+1 month'))
      FROM calendar
      WHERE month < '2025-06'
    ),
    monthly AS (
      SELECT strftime('%Y-%m', order_date) AS month,
             SUM(amount) AS revenue
      FROM orders
      GROUP BY strftime('%Y-%m', order_date)
    )
    SELECT c.month,
           COALESCE(m.revenue, 0) AS revenue,
           ROUND(
             100.0 * (COALESCE(m.revenue, 0)
                      - LAG(COALESCE(m.revenue, 0)) OVER (ORDER BY c.month))
             / NULLIF(LAG(COALESCE(m.revenue, 0)) OVER (ORDER BY c.month), 0),
           1) AS growth_pct
    FROM calendar c
    LEFT JOIN monthly m ON m.month = c.month
    ORDER BY c.month;

Every guard is present and every guard states its reason in a comment, in the style from [how to comment SQL so it teaches](https://michaelnocito.github.io/analyst-prep-kit/guides/sql-teaching-comments/). A reviewer can now disagree with a choice instead of discovering it.

Picture running the after version on your own revenue or signups table right now. Which month would come back with a gap row you did not know about? If you cannot answer, that is precisely the reason to run it. And the pattern only becomes yours once your fingers have produced it, so [type the query yourself](https://michaelnocito.github.io/analyst-prep-kit/drill/) rather than pasting it.

## 7. Edge cases: reading negatives, formatting, MoM against YoY

Before the explanation: revenue fell 30% one month, then rose 30% the next. Is it back where it started?

**No, and that is the negative-growth reading trap.** Down 30% from 100 is 70. Up 30% from 70 is 91. Percent changes compound from wherever they land, so a drop needs a larger rise to undo it. When you present a fall, say the level too: "down 30.6%, from 360 to 250." The level pair keeps readers from mentally reversing the percentage.

**Format at the last moment.** Keep growth as a plain number, like -30.6, all the way through the SQL, and let the report layer add the percent sign. Strings like '-30.6%' cannot be sorted, averaged, or charted, and someone always tries. `ROUND(x, 1)` is enough precision for a business audience; 20.03847% communicates nothing that 20.0% does not.

**A tiny base makes a silly percentage.** Growth from 2 to 10 is 400%. True, and useless. When last month is near zero, report the raw change alongside the rate or suppress the rate below a floor you write down.

**MoM is noisy where the calendar is seasonal.** Ice cream sales fall every September, and no one should get an alarmed email about it. Month over month asks "what just changed," so it amplifies seasonality and one-off spikes. Year over year compares June to last June, so the season cancels out and the trend shows through. Use MoM to detect turns quickly, YoY to state the trend calmly, and both lines on the same chart when the audience can take it. The [Forecasting Kit](https://michaelnocito.github.io/analyst-prep-kit/forecasting/) works through seasonality properly, including when a "drop" is just the calendar breathing.

## Why this works

The grain move in section two is not a style choice. In the relational model a query result is a relation, and each row of a relation states one fact at one grain (Codd, 1970, _Communications of the ACM_ , 13(6), 377–387). "Growth" is a fact about a pair of months, so the query must first manufacture rows whose grain is the month, then relate neighbors. LAG's entire contract, the previous row in a stated order, is only meaningful because the rows beneath it were made to mean one month each. Every trap on this page is a place where the row order or the row grain silently stopped matching the calendar.

This page also kept asking you to answer before it told you. That is deliberate. Attempting an answer before seeing the solution measurably improves memory for the material, even when the attempt is wrong (Bisra, Liu, Nesbit, Salimi, & Winne, 2018, _Educational Psychology Review_ , 30(3), 703–725). And practicing retrieval beats rereading for retention over any interval that matters for a job (Roediger & Karpicke, 2006, _Psychological Science_ , 17(3), 249–255). The cheat sheet at the bottom is built for retrieval, not for rereading.

## Using this on your own project

Retrofitting every growth query you have ever shipped is miserable, and you will not finish it. Do this instead, in order.

  1. **Run the month-count check** on your most-read report first. `SELECT COUNT(DISTINCT strftime('%Y-%m', order_date)) FROM orders`, then compare against the number of calendar months your data should span. A mismatch means at least one LAG comparison is wrong right now.
  2. **Add`prev_revenue` as a visible column** in that report, not just the percentage. A reader who can see 250 and 360 side by side will catch a wrong pairing that a lone -30.6 hides.
  3. **Put`100.0` or a `CAST` in every division**, even where today's column types are decimal. Column types change; the guard is free.
  4. **Build or borrow one calendar table** and join every time series to it from now on. One CTE, written once, pasted forever.
  5. **Write the guards' reasons as comments** in the same pass, while you still remember why.

If you have paper nearby, one drawing is worth five minutes and it is optional. Draw your own last six months as boxes in a column, arrows from each box to the one above, then cross out any month you suspect might be empty in the data and see which arrow just became a lie. Redrawing the figure from memory is a retrieval rep and a self-check in one.

**More detail on this, and more like it.** Every how-to sits in one place on the [guides index](https://michaelnocito.github.io/analyst-prep-kit/guides/): SQL, Excel, Tableau, and the working habits around them.

## The whole thing on one screen

This is the retrieval sheet. Cover the right column, work down the left, and say each answer out loud before you check it.

| Concept                    | What it is                                                                             |
|----------------------------|----------------------------------------------------------------------------------------|
| MoM growth formula         | This month minus last month, divided by last month.                                    |
| The sentence version       | "Grew 20% month over month, from 250 to 300." Rate, then both levels.                  |
| Step one, always           | GROUP BY to one row per month. Growth needs month grain first.                         |
| `LAG(x) OVER (ORDER BY m)` | Sort the rows, then copy the previous row's value onto this row.                       |
| What LAG does not know     | Anything about calendars. It fetches the previous ROW.                                 |
| Integer division trap      | 50 / 250 is 0 when both are integers. Multiply by 100.0 first.                         |
| First month's growth       | NULL, and leave it NULL. Growth from before the data is unknown.                       |
| Missing-month trap         | A gap makes LAG pair non-adjacent months. May vs March, silently.                      |
| The fix                    | Generate a calendar, LEFT JOIN the data to it, COALESCE to 0.                          |
| Calendar tools             | Recursive CTE in SQLite, generate_series in PostgreSQL, date dimension in a warehouse. |
| Growth from zero           | Undefined. NULLIF(prev, 0) makes it print as NULL, not an error.                       |
| Reading a fall             | Down 30% then up 30% is not flat. Always give the levels with the rate.                |
| Formatting                 | Keep it numeric in SQL, ROUND to one decimal, add % in the report layer.               |
| MoM vs YoY                 | MoM detects turns fast but amplifies seasonality. YoY cancels the season.              |

**The one habit to keep.** If you take nothing else from this page, never trust a LAG over dates until you have confirmed every calendar period has a row. The wrong growth number never looks wrong. It looks like a result, with a minus sign and one decimal place. If a growth query breaks in a way this page does not cover, there is a general [diagnosis loop for being stuck](https://michaelnocito.github.io/analyst-prep-kit/guides/technical-tenacity/).

One last thought, and I would genuinely like other people's answers. My fake -30.6% was easy to catch because I built the gap on purpose. In real data the gap is usually a loading failure nobody noticed, which means the growth number was wrong for months before anyone looked. What is the longest a wrong trend number has survived in a report you inherited, and what finally exposed it?

## References

  * Codd, E. F. (1970). A relational model of data for large shared data banks. _Communications of the ACM_ , 13(6), 377–387.
  * Bisra, K., Liu, Q., Nesbit, J. C., Salimi, F., & Winne, P. H. (2018). Inducing self-explanation: A meta-analysis. _Educational Psychology Review_ , 30(3), 703–725.
  * Roediger, H. L., & Karpicke, J. D. (2006). Test-enhanced learning: Taking memory tests improves long-term retention. _Psychological Science_ , 17(3), 249–255.

---

*Originally published on Analyst Prep Kit: [Month-over-Month Growth in SQL: LAG, the Growth Formula, and the Traps](https://michaelnocito.github.io/analyst-prep-kit/guides/sql-month-over-month/)*

*Visit the site for more beginner data analysis guides and free resources: [the full guide archive](https://michaelnocito.github.io/analyst-prep-kit/guides/) covers SQL, Excel, Power BI, Tableau, Python and statistics, and the [practice kits](https://michaelnocito.github.io/analyst-prep-kit/) run in your browser with nothing to install.*

*If it was useful: [Buy Me a Coffee](https://buymeacoffee.com/michaelnocito).*
