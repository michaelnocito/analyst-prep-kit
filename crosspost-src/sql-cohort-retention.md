By the end of this page you can put every customer into the month they arrived, measure how many of each arrival group come back in each later month, build the triangle that shows it, and say precisely which of two reasonable definitions of "retained" your number uses. It is about twenty-five minutes, and every query and result below was run.

Here is what to do today, before writing any of it. Write down what one row of your finished table will mean, in a sentence with two dates in it: "of the customers whose first purchase was in month X, this many bought again in month Y." Everything on this page is that sentence turned into SQL, and most retention numbers that turn out to be wrong were wrong in the sentence.

The short version: tag every customer with their first month, tag every event with how many months after that it happened, then count distinct customers per pair.

The shape you are heading for is the idea, so it gets the picture.

> _The original carries a diagram here. In words: A grid three rows deep and three columns wide, with the columns headed 0, 1 and 2 for the number of months since a group arrived, and the rows labelled Jan, Feb and Mar for the month each group arrived in. The top row is complete: three filled cells reading 5, then 3, then 2. The middle row has only two filled cells, reading 4 then 2, and its third position is an empty dashed outline. The bottom row has a single filled cell reading 3, and its second and third positions are empty dashed outlines. The filled cells therefore form a descending staircase, and the empty dashed ones form a triangle of missing information in the lower right. Nothing is missing because of a data problem: the March group has simply not existed for two months yet, so no number can be there._

**Every result on this page is real.** Twelve customers, nineteen purchases, 2,430 in revenue, from 6 January to 25 March 2026, loaded into DuckDB and queried. Small enough to check every number by hand, which is the point: build a cohort query on data you can count on your fingers before pointing it at millions of rows.

## 1. What a cohort is, and the decision that defines it

A cohort is a group of customers who share a starting point, and almost always that starting point is when they arrived. Group by arrival month, then watch each group over time. The reason to do it at all is that a single overall retention number mixes people who joined last week with people who joined three years ago, and those are different populations having different experiences.

Before the explanation: your table has a first-purchase date, a signup date and a first-login date. Say which one defines the cohort.

Whichever one you can defend in the meeting, and you have to pick before writing SQL, because the answer changes every number afterwards. First purchase is right for a retention question about paying behaviour. Signup is right if you are measuring whether the product converts people. They are not the same customers and they are not the same months, and a table that says "cohort" without saying which is not a finding. Getting that written down is the whole of [defining a metric](https://michaelnocito.github.io/analyst-prep-kit/guides/defining-metrics/), applied here.

This page uses first purchase, on a purchases table with three columns: customer, date, amount. Nineteen rows, twelve customers.

## 2. Step one: everyone's first month

One aggregate gives every customer a cohort, and it is the only place the word `MIN` appears.
    
    
    SELECT customer_id,
           MIN(purchase_date)                              AS first_purchase,
           DATE_TRUNC('month', MIN(purchase_date))::DATE   AS cohort
    FROM purchases
    GROUP BY 1;
    
    C1  | 2026-01-06 | 2026-01-01
    C2  | 2026-01-09 | 2026-01-01
    C3  | 2026-01-14 | 2026-01-01
    C4  | 2026-01-21 | 2026-01-01
    C5  | 2026-01-28 | 2026-01-01
    C6  | 2026-02-03 | 2026-02-01
    ...

Two things worth noticing. The cohort is a _date_ , the first of the month, not a string, for all the reasons in [the date guide](https://michaelnocito.github.io/analyst-prep-kit/guides/sql-dates/): it sorts chronologically, it can be subtracted from, and it can be joined to a calendar. And every customer appears exactly once, which makes this a table you can safely join back to the purchases without multiplying anything.

Counting it gives the denominators for the whole analysis:
    
    
    2026-01-01 | 5
    2026-02-01 | 4
    2026-03-01 | 3

Five, four and three, which adds to twelve, the number of customers. Check that sum every time. If cohort sizes do not add up to your customer count, somebody has two first purchases, which means the customer key is not unique.

## 3. Step two: how many months later

Join the first-month table back onto every purchase and subtract, in months.
    
    
    SELECT p.customer_id,
           f.cohort,
           DATE_TRUNC('month', p.purchase_date)::DATE AS activity_month,
           DATEDIFF('month', f.cohort, DATE_TRUNC('month', p.purchase_date)) AS month_no
    FROM purchases p
    JOIN first_p f USING (customer_id);
    
    C1 | 2026-01-01 | 2026-01-01 | 0
    C1 | 2026-01-01 | 2026-02-01 | 1
    C1 | 2026-01-01 | 2026-03-01 | 2
    C3 | 2026-01-01 | 2026-01-01 | 0
    C3 | 2026-01-01 | 2026-02-01 | 1
    C6 | 2026-02-01 | 2026-02-01 | 0
    C6 | 2026-02-01 | 2026-03-01 | 1
    ...

That `month_no` column is the whole trick. It converts calendar time into time-since-arrival, so a customer who joined in January and one who joined in March can be compared at the same age. Without it you can only compare calendar months, which mixes ages together and is the reason a plain monthly active count never answers a retention question.

Two details. Truncate both sides to the month before subtracting, or a purchase on the 2nd of the next month and one on the 30th of the same month will land in different buckets by a day. And month 0 exists by construction: everybody is active in the month they arrived, so the first column of a cohort table is always the cohort size.

## 4. Step three: the triangle

Now count distinct customers per cohort per month number. Here it is laid out the way people read it, with the month numbers across the top:
    
    
    cohort     |  m0 |  m1 |  m2
    2026-01-01 |   5 |   3 |   2
    2026-02-01 |   4 |   2 |   .
    2026-03-01 |   3 |   . |   .

Read the first row: five customers arrived in January, three of them bought again in February, two bought in March. Check it by hand against the list in step three and you will find C1, C2 and C3 in month 1, and C1 and C2 in month 2.

The gaps in the lower right are not missing data. February's cohort has only existed for two months, so it has no month 2 yet, and March's has no month 1. That is the single most important thing to get right when presenting one of these, because filling those cells with zeros turns "we do not know yet" into "nobody came back", and the average down a column then falls for a reason that has nothing to do with the product.

The query is one `CASE` per column, which is fine for three and unwieldy for twelve. The version that scales returns one row per cell instead and lets the reporting tool lay it out:
    
    
    SELECT cohort, month_no, COUNT(DISTINCT customer_id) AS active
    FROM act
    GROUP BY 1, 2
    ORDER BY 1, 2;

## 5. Counts against rates

Counts are what you check; rates are what you compare. Joining the cohort sizes back gives both.
    
    
    cohort     | size | month_no | active | retention_pct
    2026-01-01 |    5 |        0 |      5 |         100.0
    2026-01-01 |    5 |        1 |      3 |          60.0
    2026-01-01 |    5 |        2 |      2 |          40.0
    2026-02-01 |    4 |        0 |      4 |         100.0
    2026-02-01 |    4 |        1 |      2 |          50.0
    2026-03-01 |    3 |        0 |      3 |         100.0

Month 0 is 100% in every row by definition, which is a useful check rather than a finding: if it is not 100%, the join lost rows.

Now the comparison the table exists for. January retained 60% at month 1 and February retained 50%. Say out loud whether that is a real decline before reading on.

It is three customers against two, on cohorts of five and four. A single customer moving changes January by 20 points and February by 25. On this data the honest sentence is that the cohorts are too small to compare, and the way you say that is by publishing the counts next to the rates, which is why the table above has both. Percentages on tiny denominators are the most confidently wrong numbers in analytics.

## 6. Customers, not purchases

Before the explanation: one January customer buys twice in January. Say what that does to the month 0 cell if you count with `COUNT(*)`.

Adding exactly that customer to the data and running both counts side by side:
    
    
    cohort     | month_no | purchases | customers
    2026-01-01 |        0 |         7 |         6
    2026-01-01 |        1 |         3 |         3
    2026-01-01 |        2 |         2 |         2

Seven purchases, six customers. The cohort has six people in it and `COUNT(*)` claims seven, so month 0 comes out at 116.7% and everything below it is divided by the wrong denominator.

Retention is a question about people, so every count in a cohort table is `COUNT(DISTINCT customer_id)`. The only exception is when you genuinely mean order frequency, and then the column should be called something other than retention.

## 7. Two definitions of retained

This is the part that decides whether two teams agree, and it is invisible in the SQL unless you look for it.

Add one customer to the January cohort who buys in January, buys nothing in February, and comes back in March. The cohort goes from five to six, and the triangle now reads:
    
    
    cohort     | size | month_no | active | retention_pct
    2026-01-01 |    6 |        0 |      6 |         100.0
    2026-01-01 |    6 |        1 |      3 |          50.0
    2026-01-01 |    6 |        2 |      3 |          50.0

Retention did not fall between month 1 and month 2. Under this definition it cannot be read as a survival curve at all, because a customer who lapses and returns is counted again. That definition has a name worth using: **active in month N**.

The other definition asks who has been active in every month since arriving. On the same six customers:
    
    
    cohort_size | active in m2 | active every month
              6 |            3 |                  2

Three against two, which is 50% against 33.3% for the same cohort in the same month. Neither query is wrong. They answer different questions, and the difference is one customer who took a month off.

Which to use depends on the business. For a subscription, where lapsing means cancelling, "active every month since" is closer to the truth. For a shop, where people buy when they need something, "active in month N" is the sensible one and a gap is not a loss. Write the choice into the column heading, not into a comment, because the column heading is the only part that travels.

## 8. Revenue retention

The same skeleton with `SUM(amount)` instead of a count answers a different and often more useful question: not how many came back, but how much.
    
    
    cohort     | month_no | revenue
    2026-01-01 |        0 |     610
    2026-01-01 |        1 |     380
    2026-01-01 |        2 |     250
    2026-02-01 |        0 |     460
    2026-02-01 |        1 |     310
    2026-03-01 |        0 |     420

Those six cells add to 2,430, which is the total of the purchases table, so no money has been lost or double counted on the way through the join. That reconciliation is the check to keep: **every cell of a cohort revenue table, added together, must equal the source total.**

Reading it alongside the customer table is where it earns its place. January kept 60% of its customers into month 1 and 62.3% of its revenue, 380 out of 610, so the ones who stayed were spending at about the same rate. When the two percentages diverge sharply, that is the finding: keeping half your customers and 90% of your money is a very different business from keeping half of each.

Picture your own customer table for a moment. If you built this today, which would you expect to fall faster, the count or the revenue? That expectation is worth writing down before you run it.

## The full before and after

Same question: are we keeping the customers we get?

### Before
    
    
    SELECT DATE_TRUNC('month', purchase_date) AS month,
           COUNT(DISTINCT customer_id) AS active
    FROM purchases GROUP BY 1 ORDER BY 1;
    
    2026-01-01 | 5
    2026-02-01 | 7
    2026-03-01 | 7

Monthly active customers, which looks like growth and says nothing about retention. It mixes brand new customers with returning ones, so a month can hold flat while every existing customer leaves and is replaced. There is no denominator, no age, and no way to tell those two stories apart.

### After
    
    
    WITH first_p AS (
      SELECT customer_id, DATE_TRUNC('month', MIN(purchase_date))::DATE AS cohort
      FROM purchases GROUP BY 1                        -- 12 customers
    ), sizes AS (
      SELECT cohort, COUNT(*) AS n FROM first_p GROUP BY 1     -- 5, 4, 3
    ), act AS (
      SELECT f.cohort,
             DATEDIFF('month', f.cohort, DATE_TRUNC('month', p.purchase_date)) AS month_no,
             p.customer_id
      FROM purchases p JOIN first_p f USING (customer_id)      -- 19 rows, unchanged
    ), grid AS (
      SELECT cohort, month_no, COUNT(DISTINCT customer_id) AS active
      FROM act GROUP BY 1, 2
    )
    SELECT g.cohort, s.n AS cohort_size, g.month_no, g.active,
           ROUND(100.0 * g.active / s.n, 1) AS retention_pct
    FROM grid g JOIN sizes s USING (cohort)
    ORDER BY g.cohort, g.month_no;

Four named steps with a row count each, a denominator on every rate, and the month 0 column sitting at 100% as a built-in check. The triangle is honest about what has not happened yet.

The claim, and it is the reason section seven exists: **the same January cohort in the same month is 50% retained or 33.3% retained depending on which definition of the word you used, and the SQL for both is four lines long.**

## Edge cases that break a cohort table

Six that get through.

**Zeros in the future cells.** A `LEFT JOIN` onto a full grid of cohort-by-month pairs will helpfully fill every gap with zero, including the months that have not happened. Filter to `cohort + month_no <= the last complete month` before anyone averages a column.

**An incomplete current month.** The most recent column is always partial, so it always looks like a collapse. Either exclude it or label it, the same discipline as [a partial month in a trend](https://michaelnocito.github.io/analyst-prep-kit/guides/excel-month-over-month/).

**The customer key is not one customer.** If people can create two accounts, their second one starts a new cohort and their first one appears to churn. That is [entity resolution](https://michaelnocito.github.io/analyst-prep-kit/guides/entity-resolution/), and it flatters churn and depresses retention at the same time.

**Refunds and cancellations counted as activity.** A refund row is a purchase row in most schemas. Decide whether a customer who only returned something counts as retained, and filter before the cohort step, not after.

**Backfilled history.** If old data was migrated with a load date rather than an event date, every migrated customer joins the same fake cohort, which appears as one enormous group with strange retention. Check the cohort sizes for a suspicious spike before believing anything.

**Tiny cohorts.** A cohort of four cannot produce a percentage worth comparing. Publish the counts, and set a floor below which you show the count only, the same argument as the small-group floor in [GROUP BY and HAVING](https://michaelnocito.github.io/analyst-prep-kit/guides/sql-group-by-having/).

## Why this works

A cohort table is a survival analysis with the statistics taken out. The reason it has to be a triangle is the same reason survival studies exist as a separate field: the newest subjects have not been observed for as long as the oldest ones, so their later outcomes are unknown rather than negative. The standard treatment of that situation, estimating survival from records where some subjects have simply not been followed long enough, is what Kaplan and Meier set out, and the key move is that an unobserved period must be excluded rather than counted as a failure (Kaplan & Meier, 1958, _Journal of the American Statistical Association_ , 53(282), 457–481). Filling the lower-right cells with zeros is precisely the error their method exists to avoid, and it is the commonest mistake in a retention deck.

The other half of the page, the two definitions, is not a SQL problem at all. Customer-base analysis treats "still a customer" as something that has to be modelled rather than observed, because in a non-contractual setting nobody tells you they have left; a gap in purchasing is consistent both with churn and with a customer who buys twice a year (Fader & Hardie, 2009, _Journal of Interactive Marketing_ , 23(1), 61–69). That is exactly the customer in section seven who skipped February. Whether they count as retained in March is a modelling choice, and the honest thing to do in a report is to name the choice in the column heading.

One note on the cheat sheet below. It is built to be covered and recalled rather than reread, because the act of testing yourself is itself a learning event rather than merely a measurement of one (Roediger & Karpicke, 2006, _Perspectives on Psychological Science_ , 1(3), 181–210).

## Using this on your own project

Building the full thing in one go is how cohort queries end up unverifiable. Do this instead, in order.

  1. **Write the sentence first.** "Of the customers whose first X was in month A, this many did Y in month B." Both halves need a definition.
  2. **Build step one on its own** and check that the cohort sizes add to your customer count.
  3. **Build step two on its own** and check that the row count still equals the number of events you started with. A join that changes it has multiplied something.
  4. **Check the month 0 column is 100%** before looking at anything else.
  5. **Publish counts beside rates** , and hide the percentage where the cohort is too small to support one.
  6. **Mark the incomplete cells as unknown** , never as zero, and exclude the current partial month.

If you have paper nearby, one optional sketch is worth five minutes. Draw the triangle empty, with your own months down the side and month numbers across the top, then shade the cells that could possibly contain a number today. The unshaded region is what your query must not fill in, and drawing it is faster than arguing about it after the deck is built.

**More detail on this, and more like it.** Every how-to sits in one place on the [guides index](https://michaelnocito.github.io/analyst-prep-kit/guides/). If you would rather type queries than read about them, the [SQL Drill](https://michaelnocito.github.io/analyst-prep-kit/drill/) gives you one runnable query at a time against a real database.

## The whole thing on one screen

This is the retrieval sheet. Cover the right column, work down the left, and say each answer out loud before you check it.

| Thing                 | What it does                                                                   |
|-----------------------|--------------------------------------------------------------------------------|
| A cohort              | Customers who share a starting month.                                          |
| The first decision    | Which event starts the clock: signup, first purchase, first login.             |
| Step one              | `MIN(date)` per customer, truncated to the month.                              |
| Cohort sizes          | Must add up to your customer count.                                            |
| Step two              | `DATEDIFF('month', cohort, activity_month)`.                                   |
| Truncate both sides   | Or a purchase a day apart lands in a different bucket.                         |
| Month 0               | Always the cohort size. Always 100%. A check, not a finding.                   |
| Step three            | `COUNT(DISTINCT customer_id)` per cohort per month number.                     |
| Never COUNT(*)        | Two purchases in one month becomes 117% retention.                             |
| The empty cells       | Months that have not happened. Not zeros.                                      |
| Active in month N     | Counts a returning lapsed customer. Can go up.                                 |
| Active every month    | A survival curve. Can only go down.                                            |
| The gap between them  | On the same cohort here, 50% against 33.3%.                                    |
| Revenue retention     | Same skeleton, `SUM(amount)`. Cells must add to the source total.              |
| Reading them together | Customers down 40% and revenue down 38% is a different story from 40% and 10%. |
| Small cohorts         | One customer moves the rate by twenty points. Show the count.                  |
| The current month     | Partial, so it always looks like a collapse. Exclude or label.                 |

**The one habit to keep.** Put the cohort size next to every percentage, in the table itself. Retention is a ratio with a tiny denominator far more often than anyone admits, and the count is the only thing on the page that stops 50% and 33% being argued about as if they were measurements rather than two customers. If a cohort query misbehaves in a way this page does not cover, there is a general [diagnosis loop for being stuck](https://michaelnocito.github.io/analyst-prep-kit/guides/technical-tenacity/).

One last thought, and I would genuinely like other people's answers. The one I remember was a retention deck where the newest three cohorts had been filled in with zeros for months they had not lived through, so every chart bent downwards at the right and the whole company spent a quarter explaining a decline that was an artefact of the query. What has a cohort table told you that turned out to be about the query?

## References

  * Kaplan, E. L., & Meier, P. (1958). Nonparametric estimation from incomplete observations. _Journal of the American Statistical Association_ , 53(282), 457–481.
  * Fader, P. S., & Hardie, B. G. S. (2009). Probability models for customer-base analysis. _Journal of Interactive Marketing_ , 23(1), 61–69.
  * Roediger, H. L., & Karpicke, J. D. (2006). The power of testing memory: Basic research and implications for educational practice. _Perspectives on Psychological Science_ , 1(3), 181–210.

---

*Originally published on Analyst Prep Kit: [Cohort Retention Analysis in SQL, Step by Step](https://michaelnocito.github.io/analyst-prep-kit/guides/sql-cohort-retention/)*

*Visit the site for more beginner data analysis guides and free resources: [the full guide archive](https://michaelnocito.github.io/analyst-prep-kit/guides/) covers SQL, Excel, Power BI, Tableau, Python and statistics, and the [practice kits](https://michaelnocito.github.io/analyst-prep-kit/) run in your browser with nothing to install.*

*If it was useful: [Buy Me a Coffee](https://buymeacoffee.com/michaelnocito).*
