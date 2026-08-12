By the end of this page you can build a standard deviation from raw numbers without a formula sheet, say what the answer means in a sentence a non-analyst would accept, and explain why the divisor is 15 when you have 16 rows. The sixteen orders below average 618.125 with a standard deviation of 236.81, and that second number is the one that tells you whether the first one is worth anything.

Here is what to actually do today. Next to any average you report, add the standard deviation, then write one sentence in the form "typical orders run between X and Y." Subtract the standard deviation from the mean for X and add it for Y. On our data that sentence is "typical orders run between 381 and 855", and eleven of the sixteen orders fall inside it.

The short version: the standard deviation is roughly the typical distance between a value and the average. Small means the values huddle near the mean. Large means they are scattered.

The idea it delivers is that two sets of numbers can share an average and share nothing else, so that gets the picture.

> _The original carries a diagram here. In words: Two horizontal rows of dots, one above the other, sharing a single vertical line drawn straight down the middle of the picture and labelled mean. On the top row, sixteen dots sit close together in a tight clump either side of that vertical line, and a narrow shaded band runs behind them, extending only a short distance to the left and right of the line. On the bottom row, sixteen dots of the same size are spread out across almost the whole width of the picture, thinning towards the edges, and the shaded band behind them is much wider, reaching roughly three times further from the line in each direction than the band on the top row does. Both rows are centred on the same vertical line, so the average of each row is identical and only the width of the shaded band and the scatter of the dots differ._

**Every number on this page is real.** One sixteen-row order table, printed below, with the arithmetic run rather than described. It is the same table used in [mean vs median](https://michaelnocito.github.io/analyst-prep-kit/guides/mean-vs-median/), so the centre is already known: the mean order is 618.125 and the median is 630.

| OrderID | Region | Product | Units | UnitPrice | Revenue |
|---------|--------|---------|-------|-----------|---------|
| 1001    | North  | Desk    | 4     | 220       | 880     |
| 1002    | South  | Chair   | 10    | 85        | 850     |
| 1003    | East   | Desk    | 3     | 220       | 660     |
| 1004    | North  | Lamp    | 6     | 40        | 240     |
| 1005    | South  | Desk    | 3     | 220       | 660     |
| 1006    | East   | Chair   | 8     | 85        | 680     |
| 1007    | North  | Chair   | 5     | 85        | 425     |
| 1008    | West   | Lamp    | 12    | 40        | 480     |
| 1009    | South  | Lamp    | 7     | 40        | 280     |
| 1010    | East   | Desk    | 5     | 220       | 1100    |
| 1011    | North  | Desk    | 2     | 220       | 440     |
| 1012    | West   | Chair   | 9     | 85        | 765     |
| 1013    | East   | Lamp    | 15    | 40        | 600     |
| 1014    | North  | Chair   | 6     | 85        | 510     |
| 1015    | South  | Desk    | 4     | 220       | 880     |
| 1016    | West   | Desk    | 2     | 220       | 440     |

## 1. What the standard deviation actually measures

Before the definition: our sixteen orders average 618.125, and the smallest is 240 while the largest is 1,100. Come up with your own single number for "how far a typical order sits from 618" before reading on. Any reasonable guess will land close.

The honest answer is 236.81, and if you guessed somewhere between 180 and 280 you already understand what the statistic is for. The **standard deviation** is a single number summarizing how far the values sit from their own average. It is in the same units as the data, so on a revenue column it is measured in dollars, and on the Units column it is measured in units.

That last point is worth pausing on because it is what makes the number usable. An average order of 618 and a standard deviation of 237 can be read as one sentence: orders are typically around 618, give or take a couple of hundred. Nobody needs a statistics background to act on that. What they cannot act on is 618 alone, because 618 alone is equally consistent with every order being 615 and with half the orders being 100 and half being 1,100.

There is a close relative called the **variance** , which is the standard deviation squared: 56,079.58 here. Variance is the version the mathematics prefers, because squared quantities add up neatly. Standard deviation is the version people can read, because it is back in dollars. Report the standard deviation; the variance is a step on the way to it.

## 2. Building it by hand from sixteen orders

Before the walkthrough: the obvious way to measure typical distance from the mean is to take each value's distance and average those distances. Try that in your head, adding the distances with their signs, and predict the total before I show it.

The total is exactly zero, and it always will be. That is not a coincidence of this data; it is what the mean _is_. The mean is the balance point, so everything above it cancels everything below it exactly. Averaging signed distances tells you nothing, ever.

Here is the table, sorted, with each order's distance from 618.125 and that distance squared. Squaring is the standard fix: it throws away the sign, and it does so in a way that keeps big misses expensive.

| Revenue    | Distance from 618.125 | Distance squared |
|------------|-----------------------|------------------|
| 240        | −378.125              | 142,978.52       |
| 280        | −338.125              | 114,328.52       |
| 425        | −193.125              | 37,297.27        |
| 440        | −178.125              | 31,728.52        |
| 440        | −178.125              | 31,728.52        |
| 480        | −138.125              | 19,078.52        |
| 510        | −108.125              | 11,691.02        |
| 600        | −18.125               | 328.52           |
| 660        | +41.875               | 1,753.52         |
| 660        | +41.875               | 1,753.52         |
| 680        | +61.875               | 3,828.52         |
| 765        | +146.875              | 21,572.27        |
| 850        | +231.875              | 53,766.02        |
| 880        | +261.875              | 68,578.52        |
| 880        | +261.875              | 68,578.52        |
| 1100       | +481.875              | 232,203.52       |
| **Totals** | **0**                 | **841,193.75**   |

Four steps, and you have just done three of them.

  1. Take each value's distance from the mean. They sum to zero.
  2. Square each distance. Now everything is positive. Total: 841,193.75.
  3. Divide by 15, one less than the count: 841,193.75 ÷ 15 = 56,079.58. That is the variance.
  4. Take the square root, to get back into dollars: √56,079.58 = **236.81**.

Step four is the step people forget the reason for. You squared everything in step two, so the units squared too: 56,079.58 is measured in dollars-squared, which is not a thing anybody can picture. The square root undoes the squaring and puts the answer back in dollars.

Every tool does this in one call.
    
    
    -- SQL
    SELECT STDDEV_SAMP(Revenue) AS sd,       -- 236.81, the n-1 version
           STDDEV_POP(Revenue)  AS sd_pop,   -- 229.29, the n version
           VAR_SAMP(Revenue)    AS variance  -- 56,079.58
    FROM Orders;
    
    
    # pandas defaults to n-1
    df['Revenue'].std()          # 236.811...
    df['Revenue'].std(ddof=0)    # 229.291...
    
    # numpy defaults to n. This catches people out constantly.
    np.std(df['Revenue'])            # 229.291...
    np.std(df['Revenue'], ddof=1)    # 236.811...
    
    
    ' Excel
    =STDEV.S(Orders[Revenue])    ' 236.81, the one you almost always want
    =STDEV.P(Orders[Revenue])    ' 229.29

## 3. Why the divisor is 15 and not 16

Before the explanation: you have sixteen values and you are averaging sixteen squared distances. Say why dividing by sixteen would be the wrong move, before reading on. The clue is in step one of the last section.

The distances were measured from the mean of these same sixteen numbers, not from some outside truth. That mean was itself computed from the data, and it sits exactly where the squared distances come out smallest. Any other number you measured from would give a larger total. So the total of 841,193.75 is the smallest it could possibly be for this data, which means dividing by 16 gives a spread estimate that runs slightly small.

Dividing by 15 corrects for it. The general rule is that you subtract one for each quantity you estimated from the data on the way, and here that is one: the mean. The number of independent pieces of information left over is called the **degrees of freedom** , and the arithmetic behind the name is simple. Once you know the mean and any fifteen of the values, the sixteenth is forced. Only fifteen of them were free to vary.

On our data the correction is worth 236.81 against 229.29, about three percent. On 16 rows that is small; on 5 rows it is a tenth of the answer; on 5,000 rows it is invisible. Which gives the practical rule:

  * **Use the n−1 version** when your rows are a sample of something larger, which is nearly always. These sixteen orders are some of the orders, not all the orders that will ever exist.
  * **Use the n version** only when your rows genuinely are the entire population and you are describing it rather than inferring from it. Every student in one class, every store you own, this quarter's twelve months exactly.
  * **When in doubt use n−1** , because it is the conservative choice and because on any decent row count the two agree anyway.

The reason this matters more than it should is that the defaults disagree. Excel's `STDEV.S`, pandas's `.std()` and SQL's `STDDEV_SAMP` all use n−1. numpy's `np.std()` uses n unless you pass `ddof=1`. Two tools, same data, two different answers, no error message anywhere.

## 4. Reading the answer: the band, and the z-score

Before the technique: you have a mean of 618.125 and a standard deviation of 236.81. Turn those two numbers into a range you would actually say out loud, then read on.

The move is to add and subtract. 618.125 − 236.81 = 381.31, and 618.125 + 236.81 = 854.94. So **one standard deviation** spans roughly 381 to 855, and eleven of our sixteen orders sit inside it. That band is the sentence: typical orders run from about 380 to about 855. Two standard deviations spans 144.50 to 1,091.75, and fifteen of sixteen orders fall inside that.

The second move turns a single value into a comparable number. A **z-score** is how many standard deviations a value sits from the mean: subtract the mean, divide by the standard deviation.
    
    
    Order 1010, revenue 1100:  (1100 − 618.125) ÷ 236.81 = +2.03
    Order 1004, revenue  240:  ( 240 − 618.125) ÷ 236.81 = −1.60

The biggest order is two standard deviations above average and the smallest is one and a half below. Now say what a z-score buys you that the raw numbers do not. It is that a z-score has no units, so it is comparable across columns: an order two standard deviations above average and a delivery time two standard deviations above average are equally unusual for their own columns, even though one is in dollars and the other in days.

That is the whole reason z-scores exist, and it is also the honest limit of them. A z-score says how unusual a value is _relative to the spread of its own column_. It says nothing about whether the value is wrong, or important, or worth acting on.

## 5. 68, 95, 99.7, and when that rule does not hold

Before the caveat: you have probably heard that about 68 percent of values fall within one standard deviation. Our data put 11 of 16 inside, which is 68.75 percent. Decide whether that agreement is evidence of anything before reading on.

It is a coincidence, and a useful one to have met. The 68–95–99.7 rule describes the **normal distribution** , the symmetrical bell-shaped one. Real data is often close enough for the rule to be a fair guide, and our sixteen orders happen to be. But nothing forces it. Revenue, salaries, response times and session lengths are usually piled up at the low end with a long tail to the right, and on that shape a one-standard-deviation band can hold far more or far less than 68 percent.

There is a version of the rule that always holds, with no assumption about shape at all. Chebyshev's inequality says at least 75 percent of any data set is within two standard deviations of its mean, and at least 89 percent within three. It is a guarantee rather than an estimate, which is why the numbers are so much weaker: it has to be true for every possible shape, including the nastiest.

The practical version. Use the 68–95–99.7 rule as a rough sanity check, not as a claim. If you need to state what fraction of your data falls in a range, do not estimate it from the standard deviation at all. Count it, or use [percentiles](https://michaelnocito.github.io/analyst-prep-kit/guides/percentiles-iqr-outliers/), which describe the data you actually have rather than the shape you assumed it had.

## 6. Comparing spreads on different scales

Before the problem: the Revenue column has a standard deviation of 236.81 and the Units column has one of 3.70. Which column is more variable? Commit to an answer before reading on, and notice what makes the question awkward.

The question as asked has no answer, because 236.81 dollars and 3.70 units cannot be compared. A standard deviation carries the units of its column, which makes it readable and makes it uncomparable across columns. The same problem shows up between two companies where one reports in dollars and the other in thousands of dollars.

The fix is to divide the standard deviation by the mean, giving the **coefficient of variation**. It is a ratio, so the units cancel and what is left is spread expressed as a fraction of the average.

| Column  | Mean   | Standard deviation | Coefficient of variation |
|---------|--------|--------------------|--------------------------|
| Revenue | 618.13 | 236.81             | 0.383                    |
| Units   | 6.31   | 3.70               | 0.586                    |

Units is the more variable column, and by a clear margin: its spread is 59 percent of its own average against Revenue's 38 percent. That was not visible in the raw standard deviations, and it is the kind of finding that changes what you investigate first.

The same comparison across regions is worth running on any grouped data.

| Region | Orders | Mean order | Standard deviation |
|--------|--------|------------|--------------------|
| East   | 4      | 760.00     | 229.20             |
| South  | 4      | 667.50     | 276.09             |
| North  | 5      | 499.00     | 235.22             |
| West   | 3      | 561.67     | 177.22             |

South's orders are the least predictable and West's the most, and neither fact was available from the means. Read the counts, though. A standard deviation computed on three values is barely a measurement, and the caution is the same one that applies to any small group, covered in [GROUP BY and HAVING](https://michaelnocito.github.io/analyst-prep-kit/guides/sql-group-by-having/). Two decimal places on a number built from three rows is false precision.

Now picture your own most-used table. Which column would you guess has the highest coefficient of variation, and would you have predicted that from its average alone?

## 7. What one typo does to it

Before the number: somebody keys order 1013 as 150 lamps instead of 15, so that row's revenue becomes 6,000 instead of 600. The mean goes from 618.125 to 955.625. Predict what happens to the standard deviation.

It goes from 236.81 to **1,365.84** , which is nearly six times larger. The reason is step two of the hand calculation: distances get squared, so a value that is ten times too far away contributes a hundred times too much. The squaring that made the arithmetic work is the same squaring that makes the result fragile.

Two consequences follow. First, the standard deviation is even easier to break with one bad row than the mean is, so anything you compute from it inherits that fragility, including z-scores and confidence intervals. Second, and more useful, a standard deviation that jumps when new data arrives is a genuinely good alarm. If last month's spread was 240 and this month's is 1,400 on similar volume, look at the largest few rows before you look at anything else.

If your data has real extremes that are not errors, the standard deviation is the wrong summary of spread and the interquartile range is the right one, because it is built from positions rather than sizes. That is [the percentiles and IQR guide](https://michaelnocito.github.io/analyst-prep-kit/guides/percentiles-iqr-outliers/), and it is the natural companion to this one.

## The full before and after

Same table, same question: what does an order look like?

### Before
    
    
    SELECT AVG(Revenue) AS avg_order FROM Orders;
    -- 618.125

A centre with no width. It is consistent with orders that are all within a few dollars of each other and with orders that range from 240 to 1,100, and the reader has no way to tell which. Any plan built on it is a plan built on one number pretending to be a description.

### After
    
    
    SELECT COUNT(*)                        AS orders,
           ROUND(AVG(Revenue), 2)          AS mean_order,
           ROUND(STDDEV_SAMP(Revenue), 2)  AS sd,
           ROUND(AVG(Revenue) - STDDEV_SAMP(Revenue), 2) AS typical_low,
           ROUND(AVG(Revenue) + STDDEV_SAMP(Revenue), 2) AS typical_high,
           MIN(Revenue) AS smallest,
           MAX(Revenue) AS largest
    FROM Orders;
    
    
    orders  mean_order      sd  typical_low  typical_high  smallest  largest
        16      618.13  236.81       381.31        854.94       240     1100

The same query now says: sixteen orders, typically between 381 and 855, with the extremes running from 240 to 1,100. That is a description somebody can plan against. It took three extra expressions and no new concepts.

## Edge cases that catch people out

Six that each cost somebody an afternoon.

**numpy and pandas disagree by default.** `np.std(x)` divides by n and `Series.std()` divides by n−1. On 16 rows that is a 3 percent gap between two lines of the same notebook, with nothing to warn you.

**The standard deviation of a percentage column is usually meaningless.** Averaging rates has the same problem as averaging averages: a 100 percent conversion on 1 visitor and a 5 percent conversion on 10,000 are not two comparable numbers. Compute the spread on the raw counts, not on the derived rate.

**A standard deviation on three rows.** West's 177.22 above is arithmetically correct and practically noise. Below about 20 rows treat a standard deviation as a hint, and always print the count beside it.

**Blanks are skipped, not zeroed.** Every tool on this page ignores empty cells, so a column that is one quarter blank reports the spread of the three quarters that answered. Whether the blanks are zeros is a decision, not a default, and [handling missing values](https://michaelnocito.github.io/analyst-prep-kit/guides/pandas-fillna-dropna/) is where to make it.

**Reporting sd on obviously skewed data.** If your mean is well above your median, the band goes negative or reaches into territory with no data in it. On house prices you will regularly see mean minus one standard deviation land below zero, which is a signal to switch to percentiles rather than to print it.

**Confusing it with standard error.** They differ by a division: standard error is the standard deviation divided by the square root of n. The standard deviation describes how spread out your values are, and it does not shrink as you collect more data. The standard error describes how precisely you have pinned down the mean, and it does shrink. [Confidence intervals](https://michaelnocito.github.io/analyst-prep-kit/guides/confidence-intervals/) are built on the second one.

## Why this works

The choice to square the distances rather than take their absolute values is not arbitrary, and it is not only about removing the sign. Squared deviations have a property nothing else has: they add up across independent parts, so the variance of a total is the sum of the variances, and every technique built on that fact, including regression, analysis of variance and the standard error, depends on it. Fisher's framing of estimation set out why an estimator should be judged on how much of the information in a sample it actually uses, and the sum of squares is what makes that accounting possible (Fisher, 1922, _Philosophical Transactions of the Royal Society A_ , 222, 309–368). The n−1 divisor comes from the same accounting: one degree of freedom was spent locating the mean, so fifteen remain.

The cost of squaring is section seven. An estimator that weights large deviations heavily is an estimator that a single wrong row can dominate. Huber made the trade explicit and gave it a shape: procedures tuned for perfectly clean, bell-shaped data lose very little by being made resistant, and gain a great deal when the data is not clean, which it usually is not (Huber, 1964, _Annals of Mathematical Statistics_ , 35(1), 73–101). That is the argument for putting an interquartile range next to a standard deviation rather than choosing between them.

One note on why this page kept asking you to answer before showing you the answer. Attempting an answer before seeing the correct one reliably improves how well the correct one is retained, even when the attempt is wrong (Bisra, Liu, Nesbit, Salimi, & Winne, 2018, _Educational Psychology Review_ , 30(3), 703–725). The zero-sum-of-deviations fact sticks because you tried to add them first.

## Using this on your own work

Retrofitting every summary you have ever built is miserable and you will stop at the second one. Do this instead, in order.

  1. **Add a standard deviation column** beside the average in the one report you run most often. One function, no restructuring.
  2. **Write the band as a sentence.** Mean minus sd, mean plus sd, and the words "typically between". If that sentence looks absurd, that is information about your data, not about the sentence.
  3. **Check your tool's default** once, in writing. Note whether the thing computing your number divides by n or by n−1, so you never have to re-derive which line disagreed.
  4. **Put the count beside it always.** A spread on 3 rows and a spread on 3,000 look identical on a slide.
  5. **Watch it over time.** A standard deviation that jumps between runs on similar volume is the cheapest data-quality alarm you will ever install.

If you have paper nearby, one optional drawing is worth five minutes. Draw a horizontal line, mark your own last dozen values on it, mark the mean, then shade the band one standard deviation either side. Counting how many of your own dots fall inside the shading is the fastest way to learn whether the 68 percent rule fits your data or not.

**More detail on this, and more like it.** Every how-to sits in one place on the [guides index](https://michaelnocito.github.io/analyst-prep-kit/guides/): SQL, Python, Excel, statistics and the working habits around them.

## The whole thing on one screen

This is the retrieval sheet. Cover the right column, work down the left, and say each answer out loud before you check it.

| Idea                     | What it means                                                                     |
|--------------------------|-----------------------------------------------------------------------------------|
| Standard deviation       | Roughly the typical distance from the mean. Same units as the data.               |
| The four steps           | Distances, square them, average with n−1, square root.                            |
| Sum of the distances     | Always exactly zero. That is why you square.                                      |
| Variance                 | The standard deviation squared. 56,079.58 here. Units are squared, so unreadable. |
| Why n−1                  | The mean was estimated from the same data. One degree of freedom spent.           |
| n−1 vs n here            | 236.81 against 229.29. About 3 percent on 16 rows, invisible on 1,600.            |
| Tool defaults            | Excel STDEV.S, pandas .std(), SQL STDDEV_SAMP all use n−1. numpy uses n.          |
| The band                 | Mean ± sd. Here 381.31 to 854.94, holding 11 of 16 orders.                        |
| z-score                  | (value − mean) ÷ sd. Unitless, so comparable across columns.                      |
| 68–95–99.7               | True for a bell shape, a rough guide otherwise, never a claim to publish.         |
| Chebyshev                | At least 75% within 2 sd for any shape at all. Weaker, but guaranteed.            |
| Coefficient of variation | sd ÷ mean. Unitless, so it compares spread across columns. 0.383 vs 0.586 here.   |
| One typo                 | Sent the sd from 236.81 to 1,365.84. Squaring makes it fragile.                   |
| Standard error           | sd ÷ √n. Precision of the mean, not spread of the data. Shrinks with n.           |
| When to switch           | Real extremes that are not errors? Report the IQR instead.                        |
| The missing column       | A spread with no count beside it. Always ship the n.                              |

**The one habit to keep.** Every average ships with its standard deviation and its count, turned into a sentence: "typically between X and Y, on n rows." If the sentence sounds wrong, the data is telling you something before you have done any work. If a summary breaks in a way this page does not cover, there is a general [diagnosis loop for being stuck](https://michaelnocito.github.io/analyst-prep-kit/guides/technical-tenacity/).

One last thought, and I would genuinely like other people's answers. The first time a standard deviation earned its place for me, it tripled between two weekly runs and led straight to a duplicated import nobody had noticed. What has a jump in spread caught for you, and how long would the average alone have hidden it?

## References

  * Fisher, R. A. (1922). On the mathematical foundations of theoretical statistics. _Philosophical Transactions of the Royal Society A_ , 222, 309–368.
  * Huber, P. J. (1964). Robust estimation of a location parameter. _Annals of Mathematical Statistics_ , 35(1), 73–101.
  * Bisra, K., Liu, Q., Nesbit, J. C., Salimi, F., & Winne, P. H. (2018). Inducing self-explanation: A meta-analysis. _Educational Psychology Review_ , 30(3), 703–725.

---

*The full version of this guide lives on my site: [Standard Deviation in Everyday Words: What It Measures and How to Read It](https://michaelnocito.github.io/analyst-prep-kit/guides/standard-deviation/).*

*If it was useful: [Buy Me a Coffee](https://buymeacoffee.com/michaelnocito).*
