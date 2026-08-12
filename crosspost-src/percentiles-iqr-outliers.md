By the end of this page you can compute quartiles by hand, build the standard outlier fence from them, and run that fence over any column to get back a short list of rows worth looking at. On the sixteen orders below, one mistyped quantity gets flagged automatically while every honest large order stays inside the fence.

Here is what to actually do today. On the column you care about most, get four numbers: the 25th percentile, the 75th, their difference, and 1.5 times that difference added to the 75th. Anything above that last number is a row to open and read. It is one query, and it turns "is this data clean" into a list of specific rows.

The short version: a percentile is a value with a known share of the data below it. The interquartile range is the width of the middle half. Values more than one and a half of those widths beyond the middle half get flagged.

The fence is easier to see than to read, so it gets the picture.

> _The original carries a diagram here. In words: A horizontal line with a row of small filled dots along it, spaced unevenly and thinning out towards the right. A tall rectangle is drawn around the dots in the middle of the row, covering the central half of them, with a thick vertical bar inside it. The rectangle's left edge is labelled Q1, its right edge Q3, and the bar inside it median. From each edge of the rectangle a horizontal whisker line runs outward to a short vertical cap, reaching the furthest dot on that side that still lies within range. To the right of the right-hand cap stands a tall dashed vertical line labelled fence, drawn one and a half rectangle-widths beyond the rectangle's right edge, with a small double-headed measuring arrow underneath showing that distance against the rectangle's own width. One lone dot sits well to the right of that dashed line, drawn as a hollow ring instead of a filled dot, so it reads as picked out rather than belonging with the rest. Every other dot in the picture sits between the two whisker caps._

**Every number on this page is real.** One sixteen-row order table, run rather than described. It is the same table used in [mean vs median](https://michaelnocito.github.io/analyst-prep-kit/guides/mean-vs-median/) and [standard deviation](https://michaelnocito.github.io/analyst-prep-kit/guides/standard-deviation/), where the mean is 618.125, the median is 630 and the standard deviation is 236.81.

Here are the sixteen order revenues, already sorted, because sorting is the first step of everything on this page.
    
    
    position:   1    2    3    4    5    6    7    8    9   10   11   12   13   14   15    16
    value:    240  280  425  440  440  480  510  600  660  660  680  765  850  880  880  1100

## 1. What a percentile is, in counting terms

Before the definition: look at the sorted row above and find the value with a quarter of the data below it. Say which one you picked before reading on.

A **percentile** is a value with a stated share of the data at or below it. The 25th percentile has a quarter of the values below it, the 90th has nine tenths below it, and the 50th is the median. That is the whole idea, and notice what it is built from: positions in a sorted list, not sizes. The 90th percentile does not care whether the top value is 1,100 or 1,100,000. It only cares that it is at the top.

The word **quantile** covers the same thing in other slices. Quartiles cut the data into four parts, deciles into ten, percentiles into a hundred. They are the same operation with different cut counts, and every tool implements them with the same function.

This is the reason percentiles are the natural language for anything with a long tail. "Our average page loads in 400 milliseconds" hides the customers waiting four seconds. "Our 95th percentile page loads in 3.9 seconds" is a statement about those specific customers, and it does not move at all when one absurd 60-second reading arrives, because that reading is still just one position at the top.

## 2. Quartiles by hand on sixteen orders

Before the arithmetic: sixteen values and you want the 25th percentile. A quarter of sixteen is four. Decide whether the answer is the 4th value, and what you would do if you are not sure.

It is not quite the 4th value, and the reason is worth having straight. The commonest method, the one Excel's `PERCENTILE.INC`, pandas and numpy all use by default, puts the 0th percentile on the first value and the 100th on the last, then spreads the rest evenly between them. The position it wants is:
    
    
    position = 1 + p × (n − 1)

With p as a fraction and n = 16, that gives 1 + 0.25 × 15 = **4.75**. There is no 4.75th value, so it takes three quarters of the way from the 4th to the 5th. Both of those are 440, so the answer is **440** with no interpolation needed.

Do the 75th the same way: 1 + 0.75 × 15 = 12.25. The 12th value is 765 and the 13th is 850, and a quarter of the way between them is 765 + 0.25 × 85 = **786.25**. That decimal is the interpolation showing its working. It is a real answer, and it is not any order's revenue.

Here is the whole set, computed the same way.

| Percentile    | Position | Value  | Read it as                                  |
|---------------|----------|--------|---------------------------------------------|
| 10th          | 2.50     | 352.50 | The smallest tenth of orders are below this |
| 25th (Q1)     | 4.75     | 440.00 | A quarter of orders are below this          |
| 50th (median) | 8.50     | 630.00 | Half are below, half above                  |
| 75th (Q3)     | 12.25    | 786.25 | Three quarters are below this               |
| 90th          | 14.50    | 880.00 | The largest tenth of orders are above this  |
| 95th          | 15.25    | 935.00 | The largest twentieth are above this        |

    
    
    -- SQL
    SELECT PERCENTILE_CONT(0.25) WITHIN GROUP (ORDER BY Revenue) AS q1,
           PERCENTILE_CONT(0.50) WITHIN GROUP (ORDER BY Revenue) AS median,
           PERCENTILE_CONT(0.75) WITHIN GROUP (ORDER BY Revenue) AS q3
    FROM Orders;
    
    
    # pandas
    df['Revenue'].quantile([0.25, 0.5, 0.75])
    # 0.25    440.00
    # 0.50    630.00
    # 0.75    786.25
    
    
    ' Excel
    =QUARTILE.INC(Orders[Revenue], 1)    ' 440
    =QUARTILE.INC(Orders[Revenue], 3)    ' 786.25
    =PERCENTILE.INC(Orders[Revenue], 0.9) ' 880

## 3. The IQR, and what the middle half tells you

Before the definition: you have Q1 at 440 and Q3 at 786.25. Say in one sentence what the gap between them describes, before reading on.

It describes the width of the middle half of your orders. The **interquartile range** , or IQR, is simply Q3 minus Q1: 786.25 − 440 = **346.25**. Half of all orders fall inside a 346-wide band, and that band runs from 440 to 786.

Compare that with the standard deviation's answer to the same question. Both describe spread and both are in dollars, but they are built from different things. The standard deviation squares every distance from the mean, so every value votes and the far ones vote loudest. The IQR asks two positions in the sorted list where they are, and ignores everything else entirely.

| Measure of spread  | Value  | Built from                                | Broken by                            |
|--------------------|--------|-------------------------------------------|--------------------------------------|
| Range (max − min)  | 860    | Two values, the extremes                  | Any single bad value                 |
| Standard deviation | 236.81 | Every value, squared distances            | Any single bad value                 |
| IQR                | 346.25 | Two positions, a quarter in from each end | Only if a quarter of the data is bad |

Section five puts a number on that last column. For now, notice that the IQR is larger than the standard deviation here, which surprises people who expect them to be interchangeable. They are not on the same scale and there is no reason they should match. On perfectly bell-shaped data the IQR runs about 1.35 times the standard deviation, and 346.25 ÷ 236.81 = 1.46, which is close enough to say this data is not far from that shape.

## 4. The 1.5 fence, and why clean data flags nothing

Before the rule: you have a middle half that is 346.25 wide. Somebody has to draw a line past which a value counts as unusual. Decide roughly how far beyond the box you would draw it, before you see the standard answer.

The standard answer is one and a half box-widths, and it goes on both sides.
    
    
    lower fence = Q1 − 1.5 × IQR = 440.00   − 1.5 × 346.25 = −79.375
    upper fence = Q3 + 1.5 × IQR = 786.25   + 1.5 × 346.25 = 1305.625

Now run it. Our largest order is 1,100 and the upper fence is 1,305.63, so nothing is flagged. Our smallest is 240 and the lower fence is below zero, so nothing is flagged there either. **This clean table has no outliers** , and that is the correct and useful answer.

Say out loud why a lower fence of −79.375 is not a mistake. Revenue cannot be negative, so the rule is telling you that no order is unusually small, because there is not enough room below the box for one to be. A fence that falls outside the possible range of the data simply never fires, and that is fine.

There is a second, wider fence at 3 × IQR, which on this data sits at 1,825. Values past the 1.5 fence are conventionally called mild outliers and values past the 3 fence extreme ones. In practice I use the 1.5 fence to build a list to read and the 3 fence to decide what to escalate.
    
    
    -- The whole rule as one query
    WITH q AS (
      SELECT PERCENTILE_CONT(0.25) WITHIN GROUP (ORDER BY Revenue) AS q1,
             PERCENTILE_CONT(0.75) WITHIN GROUP (ORDER BY Revenue) AS q3
      FROM Orders
    )
    SELECT o.*
    FROM Orders o CROSS JOIN q
    WHERE o.Revenue < q.q1 - 1.5 * (q.q3 - q.q1)
       OR o.Revenue > q.q3 + 1.5 * (q.q3 - q.q1);
    -- 0 rows

## 5. The typo: what the IQR does that the standard deviation cannot

Before the numbers: somebody keys order 1013 as 150 lamps instead of 15, so its revenue reads 6,000 instead of 600. Predict what happens to the IQR, and separately to the standard deviation.

Here is what actually happens.

| Statistic          | Clean    | With the typo | Moved by  |
|--------------------|----------|---------------|-----------|
| Mean               | 618.13   | 955.63        | +55%      |
| Standard deviation | 236.81   | 1,365.84      | +477%     |
| Median             | 630.00   | 660.00        | +5%       |
| Q1                 | 440.00   | 440.00        | unchanged |
| Q3                 | 786.25   | 857.50        | +9%       |
| IQR                | 346.25   | 417.50        | +21%      |
| Upper fence        | 1,305.63 | 1,483.75      | +14%      |

The standard deviation nearly sextupled. The IQR moved by a fifth, and only because one value shifting to the top pushed everything below it up a position. The fence moved from 1,305.63 to 1,483.75, and 6,000 is comfortably past both, so **the rule flags exactly one row and it is the right one**. The 1,100 desk order stays inside, correctly, because it is a real order.

Here is the failure this avoids. The obvious way to find unusual values is a z-score: how many standard deviations from the mean. Run that on the typo data and 6,000 scores 3.69, which is over the usual threshold but not dramatically. Run it against the clean standard deviation and the same value scores 22.7. The gap between 3.69 and 22.7 is the problem in one line: **the bad row inflated the standard deviation it is then measured against** , so it partly hides itself. The more extreme the error, the more effectively it does this.

The IQR cannot be gamed that way, because a value at the top of the sorted list contributes its position and nothing else. That is the entire reason the standard outlier rule is built from quartiles rather than from the mean and standard deviation.

If you would rather stay in z-score language, there is a robust version. Replace the mean with the median and the standard deviation with the median absolute deviation, the median of every value's distance from the median. Here that is 220, and the modified score for our 6,000 row is 16.4 rather than 3.69. Same idea, same units, but built from positions.

Now picture your own largest table and the one numeric column everything depends on. If a row in it were keyed ten times too large tomorrow, which of these two rules would notice?

## 6. Why Excel, SQL and pandas give different percentiles

Before the problem: you compute the 90th percentile of these sixteen orders in three tools and get 880, 880 and 946. Decide whether one of them is broken, before reading on.

None of them is. There is no single agreed definition of a sample percentile, and the common statistical packages implement several. The differences show up on small data sets and vanish on large ones, which is exactly the wrong way round for catching them, because you develop on small data.

Three families, and what each does on our sixteen orders.

| Method                                   | Where you meet it                                            | Q1  | Q3     | 90th |
|------------------------------------------|--------------------------------------------------------------|-----|--------|------|
| Linear interpolation, endpoints included | Excel `PERCENTILE.INC`, pandas, numpy, SQL `PERCENTILE_CONT` | 440 | 786.25 | 880  |
| Linear interpolation, endpoints excluded | Excel `PERCENTILE.EXC`                                       | 440 | 828.75 | 946  |
| Nearest rank, no interpolation           | SQL `PERCENTILE_DISC`                                        | 440 | 765    | 880  |

The nearest-rank family always returns a value that is actually in your data, which is a real advantage when the number will be shown to somebody as an example row. The interpolating family returns a smoother estimate that usually is not in your data. The excluded-endpoints version assumes your sample came from a larger population and pushes the extremes outward accordingly, which is why its 90th percentile of 946 sits above every value except 1,100.

The practical rule is short. Pick one method, write down which one, and use it everywhere in a piece of work. Do not compute Q1 in Excel and Q3 in SQL. And if a percentile ever has to reconcile against somebody else's number, ask which function they used before assuming anybody made a mistake.

## 7. What to do with an outlier once you have found one

Before the options: the fence has handed you one row. List what you could do about it before reading my list.

There are four honest options and one dishonest one.

**Fix it,** if it is an error you can correct. The 150-lamp row was meant to be 15. Correct the source, not the copy, and note the correction.

**Exclude it and say so,** if it is an error you cannot correct. A row you cannot verify is a row you can drop, but the count and the reason go in the write-up. "Fifteen of sixteen orders, one excluded as an unverifiable quantity" is a complete sentence and it is the whole cost. [Documenting data limitations](https://michaelnocito.github.io/analyst-prep-kit/guides/documenting-data-limitations/) covers how to phrase this so it does not read as hedging.

**Keep it and report the median instead of the mean,** if it is real. A genuinely enormous order is not an error and deleting it is falsifying your data. Switch to statistics that tolerate it, which is the argument in [mean vs median](https://michaelnocito.github.io/analyst-prep-kit/guides/mean-vs-median/).

**Split it out,** if there are several and they share a story. Six orders ten times the size of the rest are not outliers, they are a second population, probably wholesale against retail. Report the two groups separately and the noise disappears.

The dishonest option is deleting it quietly because the chart looks better. It happens most often in the last hour before a deadline, and the reason it is dishonest rather than merely wrong is that the reader cannot tell it happened. An outlier rule is a tool for finding rows to think about, and it never decides anything on its own.

## The full before and after

Same question both times: is there anything wrong with this revenue column? The typo from section five is in the data.

### Before
    
    
    SELECT AVG(Revenue) AS avg_order,
           STDDEV_SAMP(Revenue) AS sd
    FROM Orders;
    -- 955.625   1365.84

Two numbers with nothing to act on. The spread looks large, but large compared with what? There is no row to open, no name for the problem, and nothing that says whether the column has one bad value or forty.

### After
    
    
    WITH q AS (
      SELECT PERCENTILE_CONT(0.25) WITHIN GROUP (ORDER BY Revenue) AS q1,
             PERCENTILE_CONT(0.75) WITHIN GROUP (ORDER BY Revenue) AS q3
      FROM Orders
    )
    SELECT o.OrderID, o.Region, o.Product, o.Units, o.UnitPrice, o.Revenue,
           ROUND(q.q3 + 1.5 * (q.q3 - q.q1), 2) AS upper_fence
    FROM Orders o CROSS JOIN q
    WHERE o.Revenue > q.q3 + 1.5 * (q.q3 - q.q1)
    ORDER BY o.Revenue DESC;
    
    
    OrderID  Region  Product  Units  UnitPrice  Revenue  upper_fence
       1013    East     Lamp    150         40     6000      1483.75

One row, named, with the columns you need to judge it. 150 lamps at 40 each, in a table where every other lamp order is between 6 and 15 units. That is not a statistical finding, it is a keystroke, and the query found it without anyone knowing in advance that it was there.

## Edge cases that catch people out

Six that each cost somebody an afternoon.

**The fence flags nothing and you conclude the data is clean.** It is not the same claim. The rule catches values far from the middle half. A date typed as 2062 instead of 2026, a region spelled two ways, a row duplicated exactly: none of those move a revenue percentile at all.

**The fence flags a tenth of your rows.** That means the shape is skewed rather than that a tenth of your data is broken. On heavily right-tailed columns like income or session length the 1.5 rule fires constantly by design. Either work on the log of the column or accept that the top tail is the data, not an error.

**Quartiles on categories.** A percentile needs an order. It works on numbers and on dates, and it does not work on region names. Sorting alphabetically and taking the 25th percentile of "East, North, South, West" produces a value and no meaning.

**Percentile of a percentile.** The 90th percentile of your ten regional 90th percentiles is not the 90th percentile of the underlying rows, and there is no way to combine them that gets you there. Percentiles must be computed on the raw data every time, which is why they are expensive on large tables and why pre-aggregated dashboards so often quietly get them wrong.

**Two rows either side of the fence.** A value at 1,483.74 and a value at 1,483.76 are treated as completely different by the rule and are identical in reality. The fence is a triage tool, not a verdict, and rows just inside it deserve the same look as rows just outside.

**Percentiles on tiny groups.** A 90th percentile of three values is the second-largest of them with extra decimal places. Print the count next to any percentile computed per group, the same discipline [GROUP BY and HAVING](https://michaelnocito.github.io/analyst-prep-kit/guides/sql-group-by-having/) asks for.

## Why this works

The box plot and the 1.5 fence come from Tukey's programme of exploratory data analysis, which argued that the first job with a new data set is to look at its shape with tools that do not assume what the shape is (Tukey, 1977, _Exploratory Data Analysis_ , Addison-Wesley). The multiplier is a convention rather than a theorem: on perfectly bell-shaped data it flags roughly seven values in a thousand, which is rare enough to be worth reading and common enough to be worth running. Nothing deeper is claimed for it, and knowing that is what stops you treating a flag as a finding.

The case for building the rule from quartiles rather than from the mean and standard deviation is the arithmetic in section five, and it has been tested directly. Leys and colleagues showed that the standard deviation approach systematically hides the very values it is meant to catch, because those values inflate the yardstick, and recommended the median absolute deviation as the default replacement (Leys, Ley, Klein, Bernard, & Licata, 2013, _Journal of Experimental Social Psychology_ , 49(4), 764–766). Our 3.69 against 22.7 is that effect in miniature.

Section six's disagreement between tools is not sloppiness either; it is documented and deliberate. Hyndman and Fan catalogued the definitions of a sample quantile in use across statistical packages, found nine distinct ones, and showed they give materially different answers on small samples (Hyndman & Fan, 1996, _The American Statistician_ , 50(4), 361–365). Their advice is the same as section six's: state which one you used.

One note on why this page kept asking you to commit to an answer first. Attempting an answer before seeing the correct one reliably improves how well the correct one is retained, even when the attempt is wrong (Bisra, Liu, Nesbit, Salimi, & Winne, 2018, _Educational Psychology Review_ , 30(3), 703–725).

## Using this on your own work

Auditing every column of every table is miserable and you will stop at the third table. Do this instead, in order.

  1. **Pick the one numeric column** your reporting depends on most. Usually revenue, duration or count.
  2. **Run the four numbers** on it: Q1, Q3, IQR, and Q3 plus 1.5 IQR. One query.
  3. **Read every row past the fence** , actually read them, with enough columns beside them to judge. Not the count of them, the rows.
  4. **Decide per row using section seven's four options** , and write down which one you chose. The write-down is the part that makes it defensible later.
  5. **Save the query** and run it whenever new data lands. The value of an outlier check is almost entirely in it being routine.

If you have paper nearby, one optional drawing is worth five minutes. Write your own last twenty values in sorted order, draw a box around the middle ten, then measure that box's width and step one and a half of it beyond each side. Doing it with a ruler once is how the rule stops being a formula you look up.

**More detail on this, and more like it.** Every how-to sits in one place on the [guides index](https://michaelnocito.github.io/analyst-prep-kit/guides/): SQL, Python, Excel, statistics and the working habits around them.

## The whole thing on one screen

This is the retrieval sheet. Cover the right column, work down the left, and say each answer out loud before you check it.

| Idea                       | What it means                                                                        |
|----------------------------|--------------------------------------------------------------------------------------|
| Percentile                 | A value with a stated share of the data below it. Built from positions, not sizes.   |
| Position formula           | 1 + p × (n − 1). For Q3 here: 1 + 0.75 × 15 = 12.25.                                 |
| Interpolation              | 12.25 means a quarter of the way from the 12th value to the 13th. 786.25.            |
| Q1 / median / Q3           | 440 / 630 / 786.25 on these sixteen orders.                                          |
| IQR                        | Q3 − Q1 = 346.25. The width of the middle half.                                      |
| Upper fence                | Q3 + 1.5 × IQR = 1,305.63. Lower fence: Q1 − 1.5 × IQR.                              |
| Clean data here            | Flags nothing. The largest real order, 1,100, sits inside the fence.                 |
| One typo                   | sd goes 236.81 → 1,365.84. IQR goes 346.25 → 417.50. The fence still fires.          |
| Why not z-scores           | The bad row inflates the sd it is measured against. 3.69 against a true 22.7.        |
| Robust z                   | Use the median and the median absolute deviation. 16.4 here instead of 3.69.         |
| PERCENTILE.INC vs .EXC     | Endpoints included or excluded. Q3 786.25 against 828.75.                            |
| PERCENTILE_CONT vs _DISC   | Interpolated, or an actual value from your data. 786.25 against 765.                 |
| Long tails                 | Report percentiles, not averages. p95 describes the slowest twentieth.               |
| What a flag is             | A row to read. Never a decision, never a deletion.                                   |
| The four responses         | Fix it, exclude and say so, keep it and switch statistics, or split the populations. |
| Percentiles do not combine | You cannot average group percentiles into an overall one. Recompute from raw rows.   |

**The one habit to keep.** Run the fence on your main numeric column every time new data lands, and read the rows it returns rather than counting them. It is one saved query, and it turns data quality from a worry into a short list. If a check breaks in a way this page does not cover, there is a general [diagnosis loop for being stuck](https://michaelnocito.github.io/analyst-prep-kit/guides/technical-tenacity/).

One last thought, and I would genuinely like other people's answers. The first outlier query I ever saved found a single order with an extra zero that had been sitting in three months of published reports. What has a fence caught in your data that nobody had noticed by eye?

## References

  * Hyndman, R. J., & Fan, Y. (1996). Sample quantiles in statistical packages. _The American Statistician_ , 50(4), 361–365.
  * Leys, C., Ley, C., Klein, O., Bernard, P., & Licata, L. (2013). Detecting outliers: Do not use standard deviation around the mean, use absolute deviation around the median. _Journal of Experimental Social Psychology_ , 49(4), 764–766.
  * Tukey, J. W. (1977). _Exploratory Data Analysis_. Addison-Wesley. (The origin of the box plot and the 1.5 × IQR convention. A monograph rather than a journal article.)
  * Bisra, K., Liu, Q., Nesbit, J. C., Salimi, F., & Winne, P. H. (2018). Inducing self-explanation: A meta-analysis. _Educational Psychology Review_ , 30(3), 703–725.

---

*The full version of this guide lives on my site: [Percentiles, the IQR and the 1.5 Outlier Rule: How to Flag a Bad Row](https://michaelnocito.github.io/analyst-prep-kit/guides/percentiles-iqr-outliers/).*

*If it was useful: [Buy Me a Coffee](https://buymeacoffee.com/michaelnocito).*
