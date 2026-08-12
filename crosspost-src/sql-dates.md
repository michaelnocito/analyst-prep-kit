By the end of this page you can summarise any table by month in one line, pull the year, month or weekday out of a date, filter a period without accidentally excluding the last day of it, do date arithmetic that survives month ends, and make a month with no activity appear in your results instead of silently vanishing. It is about twenty-five minutes, and every query and result below was run.

Here is what to do today. Take your monthly report and count its rows against the number of months in the period. Four rows for a five-month period means one month produced nothing, never became a row, and every comparison after the gap is reaching further back than it claims.

The short version: `DATE_TRUNC('month', d)` snaps every date to the first of its month, so all the dates in one month become the same value and `GROUP BY` can do the rest.

That snapping is the mechanism, so it gets the picture.

> _The original carries a diagram here. In words: A horizontal timeline runs across the picture with three tall tick marks on it, labelled 1 Jan, 1 Feb and 1 Mar. Above the line, scattered at irregular positions, sit twelve small circles standing for individual order dates, four falling between each pair of ticks. From every circle a curved arrow runs down and to the left, ending on the tick that begins its own month, so the four January circles all arrive at the 1 Jan tick, the four February circles all arrive at 1 Feb, and the four March circles all arrive at 1 Mar. At each tick the arrivals are drawn as a small solid stack, showing four separate dates having become one shared value. Nothing is lost and nothing moves to a different month; the only change is that twelve distinct values have become three._

**Every result on this page is real.** The same sixteen orders used across the Excel side of this set of guides, loaded into DuckDB and into SQLite, with every query run and its output pasted back. DuckDB's dialect is close to PostgreSQL, so the main examples transfer to Postgres, Redshift and Snowflake with little or no change. If you have met [the Excel version of dates](https://michaelnocito.github.io/analyst-prep-kit/guides/excel-dates/), this is the same problem in a system that takes it more seriously.

## 1. A date in SQL is a real type

Before the explanation: in Excel a date is a number wearing a format. Say what you think it is in a database.

Its own type, with its own rules.
    
    
    SELECT column_name, data_type
    FROM information_schema.columns
    WHERE table_name = 'orders' AND column_name = 'order_date';
    
    order_date | DATE

That matters more than it sounds. Because the engine knows the column is a date, it can sort it chronologically without being told, compare it to another date, subtract one from another and give you days, and refuse a value that is not a valid date instead of storing it as text. None of that is available on a column of strings that happen to look like dates.

Three types come up, and it is worth being able to name them. `DATE` is a calendar day with no time. `TIMESTAMP` is a day and a time. `TIMESTAMP WITH TIME ZONE` is a day, a time and a position on the globe, and it is the one that turns a Monday report into a Sunday report for somebody in another office. If your source column is a timestamp and your question is about days, cast it early and say so.

## 2. DATE_TRUNC, and grouping by month

`DATE_TRUNC` takes a unit and a date and throws away everything smaller than that unit. Month truncation turns 19 January into 1 January, which makes every January date identical, which is what lets them be grouped.
    
    
    SELECT DATE_TRUNC('month', order_date) AS month,
           SUM(units * unit_price)          AS revenue,
           COUNT(*)                         AS orders
    FROM orders
    GROUP BY 1
    ORDER BY 1;
    
    2026-01-01 | 2630 | 4
    2026-02-01 | 2245 | 4
    2026-03-01 | 2585 | 4
    2026-05-01 | 2430 | 4

Four rows, and the revenue adds to 9,890, which is the table's total, so no rows escaped the grouping. Two things about the output are worth noticing before anything else.

The month is a _date_ , not a label. That is the whole reason to prefer `DATE_TRUNC` to a string: the result still sorts chronologically, can still be compared, and can still be joined to a calendar. Some engines, DuckDB among them, return a timestamp from `DATE_TRUNC` and display it with a zero time on the end; cast it back with `::DATE` if the trailing zeros bother you.

And there are four rows for a period that runs from January to May. Hold that thought until section six.

The string alternative works and gives up the type:
    
    
    SELECT strftime(order_date, '%Y-%m') AS month, SUM(units * unit_price)
    FROM orders GROUP BY 1 ORDER BY 1;
    
    2026-01 | 2630
    2026-02 | 2245
    2026-03 | 2585
    2026-05 | 2430

Same numbers, and `'2026-01'` is now text. It happens to sort correctly because the format puts the year first, which is luck rather than design, and it can no longer be used in date arithmetic. Use it for display at the very end, not for grouping.

Everything about grain from [GROUP BY and HAVING](https://michaelnocito.github.io/analyst-prep-kit/guides/sql-group-by-having/) applies here unchanged: after this query one row is one month, and an individual order no longer exists in the result.

## 3. Getting the pieces out

`EXTRACT` pulls a component out as a number, and most engines add friendlier helpers alongside it.
    
    
    SELECT order_date,
           EXTRACT(YEAR  FROM order_date) AS y,
           EXTRACT(MONTH FROM order_date) AS m,
           EXTRACT(DAY   FROM order_date) AS d,
           DAYNAME(order_date)            AS dow
    FROM orders LIMIT 1;
    
    2026-01-05 | 2026 | 1 | 5 | Monday

One warning that costs people a whole report. `EXTRACT(MONTH FROM ...)` returns 1 to 12 with no year attached, so grouping by it merges January 2025 with January 2026 into a single row labelled 1. That is fine for a seasonality question and wrong for a trend, and the two look identical on the page. If you group by month number, group by year as well, or use `DATE_TRUNC` and avoid the choice.

## 4. Filtering a period, the half-open way

Before the explanation: you want March. Say which of these you would write, and whether they differ.
    
    
    WHERE order_date BETWEEN '2026-03-01' AND '2026-03-31'
    WHERE order_date >= DATE '2026-03-01' AND order_date < DATE '2026-04-01'

On a pure `DATE` column they agree, and the second returned 2,585 for March in the run. On a `TIMESTAMP` column they do not agree at all, because an order at 09:14 on 31 March is later than 31 March at midnight, so `BETWEEN` excludes it. A whole day of activity disappears, and only on months whose last day happens to be busy.

So adopt the second form as a habit even where the first would work. **Greater than or equal to the start, strictly less than the start of the next period.** It is correct for dates and for timestamps, it needs no knowledge of how many days the month has, and it never needs a `23:59:59` in it, which is the other common patch and is wrong by a second.

Build the boundary as a real date literal, `DATE '2026-03-01'`, rather than a bare string, so the engine compares dates to dates instead of guessing.

## 5. Date arithmetic, and where two engines disagree

Subtracting two dates gives days, as a number:
    
    
    SELECT DATE '2026-05-25' - DATE '2026-01-05';    140

Adding a period uses `INTERVAL`, and this is where it gets interesting. Ask two different engines for one month after 31 January:
    
    
    DuckDB   SELECT DATE '2026-01-31' + INTERVAL 1 MONTH;      2026-02-28
    SQLite   SELECT date('2026-01-31', '+1 month');            2026-03-03

Both are defensible and they are not the same answer. DuckDB clamps to the last valid day of the target month. SQLite adds one to the month number and then normalises 31 February forward into March. February 2026 has 28 days, so 31 February becomes 3 March.

Say out loud what that does to a report that adds one month to every contract start to get a renewal date. On thirty of the days in a month nothing happens. On the thirty-first, one engine renews at the end of February and the other renews in March, and if the same logic is implemented in two systems they will disagree for exactly those contracts.

The lesson is not that one engine is wrong. It is that month arithmetic at month ends is a genuine ambiguity, so if it matters in your data, test it on a 31st on the engine you are actually using, rather than assuming. That takes one query.

Two more that come up constantly:
    
    
    SELECT DATE_TRUNC('month', DATE '2026-01-19');    2026-01-01    first of the month
    SELECT LAST_DAY(DATE '2026-01-19');               2026-01-31    last of the month

## 6. The month that never becomes a row

Before the explanation: the data runs from 5 January to 25 May and the monthly query returned four rows. Say which month is missing and why.

April, because there are no April orders. `GROUP BY` can only produce a row for a value that exists in the data, so a month with nothing in it produces nothing. Asking for it directly confirms there is genuinely nothing there:
    
    
    SELECT COUNT(*) AS rows_in_april, SUM(units * unit_price) AS april
    FROM orders
    WHERE order_date >= DATE '2026-04-01' AND order_date < DATE '2026-05-01';
    
    0 | NULL

Note the `NULL`. `SUM` over no rows is not zero, it is unknown, which is the correct answer and is another thing to handle rather than to be annoyed by.

Now watch what the gap does to a growth calculation. Here is month over month with `LAG`, run on the four rows the data produced:
    
    
    2026-01-01 | 2630 |   NULL
    2026-02-01 | 2245 |  -14.6
    2026-03-01 | 2585 |   15.1
    2026-05-01 | 2430 |   -6.0

`LAG` means "the previous row", and the previous row for May is March. The −6.0 is a real comparison between two real months, two months apart, presented in a column headed month over month.

The fix is a calendar: generate every month in the period, then left join the data onto it, so a month with no orders arrives as a row with a zero.
    
    
    WITH months AS (
      SELECT UNNEST(generate_series(DATE '2026-01-01', DATE '2026-05-01',
                                    INTERVAL 1 MONTH)) AS month
    ),
    by_month AS (
      SELECT DATE_TRUNC('month', order_date) AS month,
             SUM(units * unit_price)          AS revenue
      FROM orders GROUP BY 1
    ),
    filled AS (
      SELECT m.month, COALESCE(b.revenue, 0) AS revenue
      FROM months m
      LEFT JOIN by_month b ON b.month = m.month
    )
    SELECT month, revenue,
           LAG(revenue) OVER (ORDER BY month) AS prev,
           ROUND(100.0 * revenue
                 / NULLIF(LAG(revenue) OVER (ORDER BY month), 0) - 100, 1) AS pct
    FROM filled
    ORDER BY month;
    
    2026-01-01 | 2630 | NULL |   NULL
    2026-02-01 | 2245 | 2630 |  -14.6
    2026-03-01 | 2585 | 2245 |   15.1
    2026-04-01 |    0 | 2585 | -100.0
    2026-05-01 | 2430 |    0 |   NULL

Five rows now, and three of the numbers changed meaning. April is a visible zero and a true −100.0. May's percentage is `NULL` rather than −6.0, because `NULLIF` turned the zero denominator into a null and the division declined to answer, which is exactly right: growth from nothing has no percentage.

Three parts of that query are worth naming, because they are the pattern rather than the specifics. `generate_series` makes the calendar; the equivalent in Postgres is the same function without the `UNNEST`, and in engines without it you keep a small dates table. `LEFT JOIN` from the calendar to the data, never the other way round, so the calendar decides which rows exist. And `COALESCE(..., 0)` turns the resulting null into the zero you actually mean, deliberately, in one place.

The same arithmetic and the same trap in a spreadsheet is [the Excel version of this page](https://michaelnocito.github.io/analyst-prep-kit/guides/excel-month-over-month/), and the `LAG` mechanics on their own are in [month-over-month with LAG](https://michaelnocito.github.io/analyst-prep-kit/guides/sql-month-over-month/).

## 7. SQLite has no date type

This surprises people who learned SQL on SQLite, which is most beginners, so it is worth stating plainly. SQLite accepts `DATE` in a column definition and then stores whatever you give it. Asking what it actually holds:
    
    
    SELECT typeof(order_date), order_date FROM orders LIMIT 1;
    
    text | 2026-01-05

Text. The column was declared as `DATE` and the value is a string. Everything still works, as long as the strings are written `YYYY-MM-DD`, because that format sorts and compares correctly as text. Step outside it and the functions do not complain, they return nothing:
    
    
    SELECT strftime('%Y-%m', '05/01/2026');    NULL

A null rather than an error, which will flow into a `GROUP BY` as a null group and sit there looking like a data problem rather than a format problem.

The rest of SQLite's date handling follows from having no type. Grouping needs `strftime`, differences need `julianday`, and both worked correctly on the same data:
    
    
    SELECT strftime('%Y-%m', order_date), SUM(units*unit_price)
    FROM orders GROUP BY 1 ORDER BY 1;
    2026-01 | 2630   ...   2026-05 | 2430
    
    SELECT julianday('2026-05-25') - julianday('2026-01-05');    140.0

So: on SQLite, store dates as `YYYY-MM-DD` strings and nothing else, and check the format on import rather than trusting it. On a typed engine, let the column be a date and let the engine enforce it. And when a query behaves oddly on one engine and correctly on another, the type system is the first place to look, not the last.

## 8. Sorting, and the month-name trap

Before the explanation: you format the month as a short name for the report, then order by it. Predict the order.
    
    
    SELECT strftime(order_date, '%b') AS month, SUM(units*unit_price)
    FROM orders GROUP BY 1 ORDER BY 1;
    
    Feb | 2245
    Jan | 2630
    Mar | 2585
    May | 2430

February first. The column is text, so the sort is alphabetical, and February beats January in the alphabet. Anyone reading the chart built on that will see a trend that never happened.

The fix is to keep the real date for ordering and use the label only for display:
    
    
    SELECT strftime(m.month, '%b')  AS label,
           m.revenue
    FROM ( SELECT DATE_TRUNC('month', order_date) AS month,
                  SUM(units*unit_price)            AS revenue
           FROM orders GROUP BY 1 ) m
    ORDER BY m.month;

Group and order by the date, format at the last possible moment. That single rule covers the month-name sort, the year-number merge from section three, and most of what goes wrong between a query and a chart.

## The full before and after

Same sixteen orders, same question: monthly revenue and how it is moving.

### Before
    
    
    SELECT strftime(order_date, '%b') AS month,
           SUM(units*unit_price)      AS revenue
    FROM orders
    WHERE order_date BETWEEN '2026-01-01' AND '2026-05-31'
    GROUP BY 1
    ORDER BY 1;
    
    Feb | 2245
    Jan | 2630
    Mar | 2585
    May | 2430

Four problems and no errors. The rows are in alphabetical order. April is absent with nothing to say so. `BETWEEN` would drop the last day of the period if the column ever became a timestamp. And the month column is text, so nothing downstream can do arithmetic with it.

### After
    
    
    WITH months AS (
      SELECT UNNEST(generate_series(DATE '2026-01-01', DATE '2026-05-01',
                                    INTERVAL 1 MONTH)) AS month
    ),
    by_month AS (
      SELECT DATE_TRUNC('month', order_date) AS month,
             SUM(units * unit_price)          AS revenue
      FROM orders
      WHERE order_date >= DATE '2026-01-01' AND order_date < DATE '2026-06-01'
      GROUP BY 1
    )
    SELECT m.month,
           COALESCE(b.revenue, 0) AS revenue
    FROM months m
    LEFT JOIN by_month b ON b.month = m.month
    ORDER BY m.month;
    
    2026-01-01 | 2630
    2026-02-01 | 2245
    2026-03-01 | 2585
    2026-04-01 |    0
    2026-05-01 | 2430

Five rows, in date order, with the empty month present as a zero and the period boundary written half-open so it cannot lose a day. The revenue still adds to 9,890.

The claim, and it is the reason the calendar goes in before anyone asks for it: **a month with no rows cannot appear in a GROUP BY, so the gap is invisible, and the growth figure printed next to May was really May against March.**

## Edge cases that break a date query

Six that get through.

**Timestamps compared to dates.** A timestamp column compared to `DATE '2026-03-31'` means midnight, so everything later that day is excluded. Half-open ranges make this impossible.

**Time zones.** A timestamp stored in UTC and read by somebody in another zone can move rows between days, which moves them between months at month boundaries. Decide which zone the report is in and convert once, explicitly.

**A function on the filtered column.** `WHERE EXTRACT(YEAR FROM order_date) = 2026` stops most engines using an index on that column, and on a large table it turns a fast query into a slow one. Compare the raw column to a range instead.

**Month number without year.** Covered in section three, and worth repeating because it produces twelve tidy-looking rows out of three years of data.

**Nulls in the date column.** They form their own group and land at one end of the sort, so a report can carry a row with a blank month that nobody notices. Count them on purpose.

**Weeks.** `DATE_TRUNC('week', ...)` has to decide whether a week starts on Sunday or Monday, and engines differ. Check it once against a known date rather than assuming.

## Why this works

Grouping by month works because grouping is a partition: rows go into the same group when they share a value, and an aggregate is a function from each group to a single number (Codd, 1970, _Communications of the ACM_ , 13(6), 377–387). Dates in one month do not share a value, so nothing can group them until you make them share one, which is precisely what `DATE_TRUNC` is for. Seeing it that way also explains the missing April without any special rule: a group exists only if a row falls into it, so a month with no rows is not an empty group, it is not a group at all. The calendar table does not fix a bug; it supplies the values that the data could not.

The wider point is that time is genuinely harder than the other column types, and that is a known result rather than a complaint. Work on temporal databases has spent decades on questions that look trivial from outside, what an interval means, whether a period includes its endpoint, how to compare a moment to a span, and it exists because ordinary query languages handle time by convention rather than by construction (Snodgrass, 1987, _ACM Transactions on Database Systems_ , 12(2), 247–298). The half-open range in section four is one of those conventions, settled by practice rather than by the language, which is why every engine lets you write the wrong one and none of them warns you.

One note on the cheat sheet below. It is built to be covered and recalled rather than reread, because people consistently misjudge which study methods are working, rating the fluent-feeling ones highest while learning more from the ones that feel effortful (Bjork, Dunlosky, & Kornell, 2013, _Annual Review of Psychology_ , 64, 417–444).

## Using this on your own project

Auditing every date query at once is miserable and you will stop at the third. Do this instead, in order.

  1. **Count the rows against the months.** One query, and it finds the whole class of missing-period bug.
  2. **Replace every BETWEEN on a date or timestamp** with greater-or-equal and strictly-less-than. Mechanical, and it can only make things more correct.
  3. **Group with`DATE_TRUNC`, not with a string**, and format the label at the very end.
  4. **Add a calendar** to any report where a period could be empty, and `LEFT JOIN` from the calendar to the data.
  5. **Guard the growth divide** with `NULLIF(prev, 0)`, so a zero base gives no answer rather than a wrong one.
  6. **Test month arithmetic on a 31st** , on your own engine, once. It takes one query and it settles a question you would otherwise assume.

If you have paper nearby, one optional sketch is worth five minutes. Draw a timeline for your reporting period and mark every month boundary on it. Then mark, from memory, the periods where you know activity paused: a shutdown, a migration, a seasonal closure. Every one of those is a row your `GROUP BY` will not produce, and seeing them on a line is faster than discovering them in a chart.

**More detail on this, and more like it.** Every how-to sits in one place on the [guides index](https://michaelnocito.github.io/analyst-prep-kit/guides/): SQL, Excel, Python, and the working habits around them. If you would rather type queries than read about them, the [SQL Drill](https://michaelnocito.github.io/analyst-prep-kit/drill/) hands you one runnable query at a time against a real database.

## The whole thing on one screen

This is the retrieval sheet. Cover the right column, work down the left, and say each answer out loud before you check it.

| Thing                       | What it does                                                |
|-----------------------------|-------------------------------------------------------------|
| The three types             | `DATE`, `TIMESTAMP`, `TIMESTAMP WITH TIME ZONE`.            |
| `DATE_TRUNC('month', d)`    | Snaps to the first of the month. Result is still a date.    |
| Why that groups             | Rows can only group when they share a value.                |
| String months               | Work, sort by luck, and cannot do arithmetic. Display only. |
| `EXTRACT(MONTH FROM d)`     | 1 to 12, no year. Merges the same month across years.       |
| Filtering a period          | `>= start AND < next start`. Never BETWEEN on a timestamp.  |
| Why not BETWEEN             | The end date means midnight, so the last day is lost.       |
| Date minus date             | A number of days. 25 May minus 5 January is 140.            |
| Adding a month              | `+ INTERVAL 1 MONTH`. Engines differ at month ends.         |
| 31 January plus a month     | DuckDB says 28 February. SQLite says 3 March.               |
| First and last of the month | `DATE_TRUNC('month', d)` and `LAST_DAY(d)`.                 |
| A month with no rows        | Produces no group at all. Not a zero.                       |
| SUM over no rows            | `NULL`, not 0.                                              |
| The calendar                | `generate_series`, then LEFT JOIN from calendar to data.    |
| Zero base in growth         | `NULLIF(prev, 0)`. No answer beats a wrong one.             |
| SQLite                      | No date type. `typeof` says text. Use `YYYY-MM-DD` only.    |
| SQLite functions            | `strftime` to group, `julianday` to subtract.               |
| Month names                 | Sort alphabetically. Order by the date, label at the end.   |

**The one habit to keep.** Count the rows your monthly query returns and compare that with the number of months in the period. Everything else on this page is either a consequence of that check or a way of fixing what it finds, and no other symptom announces a missing month. If a date query misbehaves in a way this page does not cover, there is a general [diagnosis loop for being stuck](https://michaelnocito.github.io/analyst-prep-kit/guides/technical-tenacity/).

One last thought, and I would genuinely like other people's answers. The version that caught me was a warehouse where a public holiday shutdown produced a week with no rows, and a weekly report that had been quietly comparing each week with the week before the gap for a month. What period has gone missing from something you queried, and what finally showed it?

## References

  * Codd, E. F. (1970). A relational model of data for large shared data banks. _Communications of the ACM_ , 13(6), 377–387.
  * Snodgrass, R. (1987). The temporal query language TQuel. _ACM Transactions on Database Systems_ , 12(2), 247–298.
  * Bjork, R. A., Dunlosky, J., & Kornell, N. (2013). Self-regulated learning: Beliefs, techniques, and illusions. _Annual Review of Psychology_ , 64, 417–444.

---

*Originally published on Analyst Prep Kit: [SQL Date Functions: How to Group by Month Without Losing One](https://michaelnocito.github.io/analyst-prep-kit/guides/sql-dates/)*

*Visit the site for more beginner data analysis guides and free resources: [the full guide archive](https://michaelnocito.github.io/analyst-prep-kit/guides/) covers SQL, Excel, Power BI, Tableau, Python and statistics, and the [practice kits](https://michaelnocito.github.io/analyst-prep-kit/) run in your browser with nothing to install.*

*If it was useful: [Buy Me a Coffee](https://buymeacoffee.com/michaelnocito).*
