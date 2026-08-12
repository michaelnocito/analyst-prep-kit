By the end of this page you can compute both averages by hand, say in one sentence which one your question needs, and show what each does when one number in your data is wrong. On the sixteen orders below, a single mistyped quantity moves the mean by 337.50 and the median by 30. That gap is the whole reason both words exist.

Here is what to actually do today. Next to every average you report, put the median beside it and look at the two numbers together. If they are close, report the mean and move on. If they are far apart, you have found something worth saying out loud, and this page is about what.

The short version: the mean shares the total out equally, so every value pulls on it. The median is the middle value once you sort, so only the position of a value matters, not its size.

That difference is easiest to see rather than read, so it gets the picture.

> _The original carries a diagram here. In words: Two horizontal number lines, one above the other, drawn on the same scale. On the top line, sixteen small filled dots sit in a loose cluster across the left and middle of the line. Two markers sit almost on top of each other just past the centre of that cluster: a solid triangle pointing up, labelled mean, and a short vertical bar, labelled median. On the bottom line the same sixteen dots appear, except one dot from the middle of the cluster has moved far to the right and off the end of the line, shown by an arrow leaving the line through a small break mark at the right edge. The median bar on the bottom line has barely shifted from where it was on the top line, moving only a hair to the right. The mean triangle on the bottom line has slid a long way to the right, roughly ten times further than the median moved, and a horizontal dotted guide connects its old position on the top line to its new position on the bottom line to show the size of the slide._

**Every number on this page is real.** One sixteen-row order table, printed in full below, and every figure was produced by running the arithmetic rather than describing it. The same table runs through the [standard deviation](https://michaelnocito.github.io/analyst-prep-kit/guides/standard-deviation/) and [percentiles and outliers](https://michaelnocito.github.io/analyst-prep-kit/guides/percentiles-iqr-outliers/) guides, so the numbers carry across.

Here is the whole dataset. Sixteen orders across four regions and three products. Revenue is Units times UnitPrice, nothing typed in by hand.

| OrderID | OrderDate  | Rep        | Region | Product | Units | UnitPrice | Revenue |
|---------|------------|------------|--------|---------|-------|-----------|---------|
| 1001    | 2026-01-05 | Dana Reyes | North  | Desk    | 4     | 220       | 880     |
| 1002    | 2026-01-12 | Owen Park  | South  | Chair   | 10    | 85        | 850     |
| 1003    | 2026-01-19 | Priya Shah | East   | Desk    | 3     | 220       | 660     |
| 1004    | 2026-01-26 | Dana Reyes | North  | Lamp    | 6     | 40        | 240     |
| 1005    | 2026-02-02 | Owen Park  | South  | Desk    | 3     | 220       | 660     |
| 1006    | 2026-02-09 | Priya Shah | East   | Chair   | 8     | 85        | 680     |
| 1007    | 2026-02-16 | Dana Reyes | North  | Chair   | 5     | 85        | 425     |
| 1008    | 2026-02-23 | Sam Okafor | West   | Lamp    | 12    | 40        | 480     |
| 1009    | 2026-03-02 | Owen Park  | South  | Lamp    | 7     | 40        | 280     |
| 1010    | 2026-03-09 | Priya Shah | East   | Desk    | 5     | 220       | 1100    |
| 1011    | 2026-03-16 | Dana Reyes | North  | Desk    | 2     | 220       | 440     |
| 1012    | 2026-03-23 | Sam Okafor | West   | Chair   | 9     | 85        | 765     |
| 1013    | 2026-05-04 | Priya Shah | East   | Lamp    | 15    | 40        | 600     |
| 1014    | 2026-05-11 | Dana Reyes | North  | Chair   | 6     | 85        | 510     |
| 1015    | 2026-05-18 | Owen Park  | South  | Desk    | 4     | 220       | 880     |
| 1016    | 2026-05-25 | Sam Okafor | West   | Desk    | 2     | 220       | 440     |

Total revenue is 9,890 across 16 orders. Write that down; it is the check every number below has to pass.

## 1. What each average is, built from the same sixteen numbers

Before the definitions: if I paid every one of these sixteen orders the same amount, and the total still had to come to 9,890, what would each order be worth? Say the number before reading on.

You just computed the mean. The **mean** is the total shared out equally: add everything up, divide by how many there are. 9,890 ÷ 16 = 618.125. It answers "if these were all the same, what would each one be", which is why it is the average that budgets and forecasts use. Multiply it back by the count and you get the total again, exactly.

The **median** is built a completely different way. Sort the values smallest to largest, then take the one in the middle. Half the values are below it and half above. It answers "what does a typical one look like", and it does not care what the extreme values actually are, only that they are on one side or the other.

Both are honest summaries. Neither is a simplified version of the other. They are answers to two different questions, and the whole skill is knowing which question you are being asked.

## 2. Computing both by hand, so the arithmetic is not a black box

Before the walkthrough: the table has sixteen orders, an even number. There is no single middle value. Decide what you would do about that before I say.

Here are the sixteen revenues, sorted smallest to largest.
    
    
    240  280  425  440  440  480  510  600  660  660  680  765  850  880  880  1100

The mean is the easy one. Add them: 240 + 280 + 425 + 440 + 440 + 480 + 510 + 600 + 660 + 660 + 680 + 765 + 850 + 880 + 880 + 1100 = 9,890. Divide by 16: **618.125**.

For the median, count in from both ends. Sixteen values means the middle falls between the 8th and the 9th. The 8th is 600 and the 9th is 660, so the median is their average: (600 + 660) ÷ 2 = **630**. With an odd count you would simply take the one in the middle and there would be no averaging step at all.

Here they are in the three tools an analyst actually has open.
    
    
    -- SQL
    SELECT AVG(Revenue) AS mean_revenue,
           MEDIAN(Revenue) AS median_revenue   -- PERCENTILE_CONT(0.5) on Postgres
    FROM Orders;
    
    
    # pandas
    df['Revenue'].mean()      # 618.125
    df['Revenue'].median()    # 630.0
    
    
    ' Excel
    =AVERAGE(Orders[Revenue])   ' 618.125
    =MEDIAN(Orders[Revenue])    ' 630

On this table the two are 30 apart, about 5 percent. That is close, and closeness is itself a finding: it says the values are spread fairly evenly rather than piled up at one end. If you want the SQL version of the median in more depth, it is one specific percentile, and [percentiles, the IQR and outliers](https://michaelnocito.github.io/analyst-prep-kit/guides/percentiles-iqr-outliers/) covers how percentiles get computed and why two tools can disagree on them.

## 3. One typo, and what it does to each

Before the numbers: order 1013 is 15 lamps at 40 each. Somebody keys it as 150 lamps instead of 15. The revenue on that row goes from 600 to 6,000. Guess how far each average moves before you read on.

Here is what actually happens.

| Statistic     | Clean data | With the typo | Moved by        |
|---------------|------------|---------------|-----------------|
| Total revenue | 9,890      | 15,290        | +5,400          |
| Mean order    | 618.125    | 955.625       | +337.50, or 55% |
| Median order  | 630        | 660           | +30, or 5%      |

The mean moved by 337.50 because it is built from the total, and the total moved by 5,400. Spread that error across 16 orders and each one picks up 5,400 ÷ 16 = 337.50 of it. That is not a coincidence, it is the definition: every value gets an equal say in the mean, so a value that is ten times too big brings ten times too much weight with it.

The median moved by 30, and only because the sorted order changed. Before the typo, positions 8 and 9 held 600 and 660. Moving that 600 up to 6,000 sends it to the end of the queue, so everything after it shuffles up one place. Positions 8 and 9 now hold 660 and 660, and the median becomes 660. The median never asked how big the moved value was. It only asked which side of the middle it landed on.

Say out loud why the median would give exactly the same answer, 660, if that row had been keyed as 6,000 or 600,000. It is the hinge of this whole page: the median counts positions, the mean weighs sizes.

The name for this property is **robustness** , and it has a number attached. You could corrupt up to half the values in this table, any way you liked, and the median would still land somewhere inside the range of the honest half. Corrupt one value in the mean and the mean can be dragged anywhere at all. That is why a median shows up in every summary of house prices and salaries you have ever read.

## 4. The question that picks between them

Before the rule: you are asked "how much does an order bring in?" by two different people. Finance is planning next quarter's revenue. A sales rep wants to know what a normal order looks like. Decide whether they need the same number.

They do not, and the reason is what makes this choosable rather than a matter of taste.

**Use the mean when the total matters.** Anything that gets multiplied back out by a count: revenue forecasts, capacity planning, budgets, cost per unit. If 400 orders are expected next quarter, 400 × 618.125 = 247,250 is a real prediction of the total. Do that with the median and you get 400 × 630 = 252,000, which corresponds to nothing. The mean is the only average that reconstructs the total, and that is its job.

**Use the median when a typical case matters.** Anything a person will compare themselves to, or any figure where a handful of huge values are real but not representative: salaries, house prices, time to resolve a ticket, session length, order value in a business with a few enormous accounts. "Half our orders are under 630" is a sentence a sales rep can use. "Our average order is 618.125" is one they will quietly disbelieve if they have never seen an order that size.

The two-sentence rule I actually use: if the number is going to be multiplied by a count, report the mean. If somebody is going to picture one case, report the median. When you cannot tell which, report both, because the pair is more informative than either alone and costs one extra cell.

Now picture the last summary table you sent to someone. Which of its averages would have been better as a median, and which would have broken a total if you had switched it? That distinction is the whole page.

## 5. The ranking that flips: East against South

Before the table: four regions, and you are asked which one has the strongest orders. Predict whether the mean and the median put the same region on top.

They do not. Here are both, per region, on the clean data.

| Region | Orders | Total | Mean order | Median order |
|--------|--------|-------|------------|--------------|
| East   | 4      | 3,040 | 760.00     | 670          |
| South  | 4      | 2,670 | 667.50     | 755          |
| West   | 3      | 1,685 | 561.67     | 480          |
| North  | 5      | 2,495 | 499.00     | 440          |

By mean order, East wins at 760 and South is second at 667.50. By median order, South wins at 755 and East is second at 670. The top spot changes hands depending on which average you print, and neither table is wrong.

The reason is visible in the rows. East's four orders are 660, 680, 1100 and 600. One of them, the 1,100 desk order, is well above the others, and it lifts the mean without touching the middle. South's four are 850, 660, 280 and 880: three of them are large and one is small, so the middle sits high while the low one drags the mean down. East has one big order. South has one small one. The averages disagree because they are reading different features of the same four numbers.

This is the practical case for shipping both, and for shipping the count beside them. Four orders is not enough to rank anything, and a ranking built on four values will reorder itself the moment a fifth arrives. The same warning applies to any grouped average, which is why [GROUP BY and HAVING](https://michaelnocito.github.io/analyst-prep-kit/guides/sql-group-by-having/) insists on a size column next to every group statistic.

## 6. Mode, the third average, and the one job it has

Before the definition: which single number appears most often anywhere in this table? It is not in the Revenue column.

It is 220, the desk unit price, appearing on 7 of the 16 rows. The **mode** is the most common value, and unlike the other two it works on things that are not numbers at all. The modal region here is North with 5 orders. The modal product is Desk, on 7 rows against Chair's 5 and Lamp's 4. You cannot take a mean of "North", but you can absolutely take a mode of it.

That is the mode's real job: it is the only average that works on categories. For continuous numbers it is close to useless, because with enough decimal places every value is unique and the mode becomes whichever value happened to repeat by accident. On the Revenue column here the mode is 440 and 660 and 880, all tied at two appearances each, which tells you nothing at all.

Report a mode when the question is "which one is most common", and stop there. The rest of the time it is a curiosity.

## 7. The trimmed mean, and the middles in between

Before the idea: the mean uses every value and breaks when one is wrong. The median uses one position and ignores everything else. Ask yourself whether there is something in between, before I show you there is.

There is, and it is called the **trimmed mean**. Cut off a fixed percentage from each end of the sorted list, then take an ordinary mean of what is left. On our sixteen orders, a 10 percent trim drops the lowest value and the highest, so 240 and 1,100 go, and the mean of the remaining fourteen is 8,550 ÷ 14 = **610.71**. Close to the median's 630 and close to the mean's 618.125, because this data has no real extremes to trim.
    
    
    # pandas has no built-in; scipy does
    from scipy import stats
    stats.trim_mean(df['Revenue'], 0.10)     # 610.714...
    
    ' Excel
    =TRIMMEAN(Orders[Revenue], 0.2)          ' 0.2 = 10% off each end

Watch the argument. Excel's `TRIMMEAN` takes the _total_ proportion to remove and splits it across both ends, so 0.2 means 10 percent from each side. scipy's `trim_mean` takes the proportion for _each_ end, so the same trim is 0.10. Two libraries, two conventions, one very easy way to trim twice as much as you meant.

The trimmed mean is what Olympic judging does when it drops the high and low score, and it is a reasonable default when you know the extremes are noise rather than signal. The catch is that trimming is a decision you have to justify, and a number that quietly excludes the top 10 percent of your customers is a number that needs a footnote. My own rule: use it when the extremes are known measurement errors, and use the median when the extremes are real but not representative.

## The full before and after

Same question both times: what does an order bring in? The typo from section three is still in the data, because in real life you do not know yet that it is there.

### Before
    
    
    SELECT AVG(Revenue) AS avg_order FROM Orders;
    -- 955.625

One number, no context. It is arithmetically correct and it describes no order in the table. Fourteen of the sixteen orders are below it. Nothing on the page says how many orders it stands on, and nothing invites the reader to notice that the largest order is ten times the smallest.

### After
    
    
    SELECT COUNT(*)                  AS orders,
           SUM(Revenue)              AS total_revenue,
           AVG(Revenue)              AS mean_order,
           MEDIAN(Revenue)           AS median_order,
           MIN(Revenue)              AS smallest,
           MAX(Revenue)              AS largest
    FROM Orders;
    
    
    orders  total_revenue  mean_order  median_order  smallest  largest
        16         15,290     955.625           660       240     6000

The mean is 45 percent higher than the median, and the largest order is 25 times the smallest. Neither of those facts was visible before, and either one is enough to send you back to row 1013 to check it. The fix costs four extra columns in one query. The mean did not become wrong; it became something you can interrogate.

## Edge cases that catch people out

Six that each cost somebody an afternoon.

**Averaging an average.** The mean of the four regional means is (760 + 667.50 + 561.67 + 499) ÷ 4 = 622.04, and the true mean order is 618.125. They differ because the regions have different order counts, and a plain average treats a 3-order region as equal to a 5-order one. If you must combine group averages, weight them by their counts, or go back to the raw rows.

**Averaging a percentage or a rate.** The same trap with sharper teeth. The average of two conversion rates is not the overall conversion rate unless both had the same traffic. Add the numerators, add the denominators, then divide once.

**Blanks are not zeros.** `AVERAGE` in Excel and `mean()` in pandas skip empty cells, so a column that is a quarter blank is averaging the three quarters that answered. If those blanks mean "no sale", they are zeros and they belong in the denominator, and the answer changes a lot. Deciding which is which is the subject of [handling missing values](https://michaelnocito.github.io/analyst-prep-kit/guides/pandas-fillna-dropna/).

**The median of an even count is not in your data.** Our 630 is not any order's revenue. It is the average of two of them. Nobody is harmed by this until someone tries to look up "the median order" as a row and cannot find it.

**SQL does not agree with itself on`MEDIAN`.** DuckDB, Oracle and Snowflake have a `MEDIAN` function. Postgres and standard SQL do not, and want `PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY Revenue)`. SQL Server wants `PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY Revenue) OVER ()`, which returns one row per input row rather than one row overall. MySQL before version 8 has none of these.

**A mean with no count beside it.** This is the one I would put on a poster. "Average order 618" reads identically whether it rests on 16 orders or 16,000, and the two deserve very different amounts of trust.

## Why this works

The formal name for what the median has and the mean does not is the **breakdown point** : the fraction of your data that has to be corrupted before an estimate can be pushed to an arbitrary value. Hampel introduced it as a way of comparing estimators without assuming anything about the distribution the data came from (Hampel, 1971, _Annals of Mathematical Statistics_ , 42(6), 1887–1896). The mean's breakdown point is 1 divided by n, which on our sixteen orders is a single row, exactly as section three demonstrated. The median's is one half. Huber's earlier work on robust estimation is where the whole programme starts, and it makes the trade explicit: estimators that squeeze the most out of clean data are the ones that fail hardest on dirty data, and you get to choose where on that line to sit (Huber, 1964, _Annals of Mathematical Statistics_ , 35(1), 73–101). The trimmed mean in section seven is literally a dial between the two ends.

Tukey argued that this is not a niche concern but the ordinary condition of real analysis: data arrives contaminated, the contamination is not announced, and procedures should be chosen on how they behave when the assumptions fail rather than on how they behave when everything is perfect (Tukey, 1962, _Annals of Mathematical Statistics_ , 33(1), 1–67). Reporting the mean and the median side by side is the cheapest possible version of that advice. The gap between them is a contamination detector you get for free.

One note on why this page kept asking you to commit to an answer before giving it. Attempting an answer before seeing the correct one reliably improves how well the correct one is retained, even when the attempt is wrong (Bisra, Liu, Nesbit, Salimi, & Winne, 2018, _Educational Psychology Review_ , 30(3), 703–725). The 337.50 figure sticks because you guessed at it first.

## Using this on your own work

Going back through every report you have ever written is miserable and you will stop at the second one. Do this instead, in order.

  1. **Add a median column beside every mean** in the summary you run most often. One extra function, no restructuring.
  2. **Compare the two.** If the mean is more than about 10 percent above the median, something at the top of your data is doing a lot of the work. Go and look at it before you publish.
  3. **Ask the multiplication question** for each figure: will anyone multiply this by a count? If yes it stays a mean. If no, and someone will picture a single case, switch it to a median.
  4. **Put the count next to both.** An average without an n is an assertion.
  5. **Write the sentence, not the number.** "Half our orders are under 630, and the average is 618 because a few large desk orders pull it up" is what the reader needed. Two numbers alone are not that sentence.

If you have paper nearby, one optional drawing is worth five minutes. Draw a number line, mark your own last ten values on it, then mark the mean and the median. Now move your largest value ten times further right and mark both again. Watching your own hand drag one marker and not the other is the fastest way to stop needing this page.

**More detail on this, and more like it.** Every how-to sits in one place on the [guides index](https://michaelnocito.github.io/analyst-prep-kit/guides/): SQL, Python, Excel, statistics and the working habits around them.

## The whole thing on one screen

This is the retrieval sheet. Cover the right column, work down the left, and say each answer out loud before you check it.

| Idea                   | What it means                                                           |
|------------------------|-------------------------------------------------------------------------|
| Mean                   | Total ÷ count. 9,890 ÷ 16 = 618.125. Every value pulls on it.           |
| Median                 | Middle value once sorted. Here the 8th and 9th averaged: 630.           |
| Mode                   | Most common value. The only average that works on categories.           |
| Even count             | No single middle. Average the two middle values.                        |
| The typo test          | One row 10× too big moved the mean 337.50 and the median 30.            |
| Breakdown point        | Mean 1/n, median 1/2. How much bad data it takes to break each.         |
| Report the mean when   | The number gets multiplied by a count: totals, budgets, forecasts.      |
| Report the median when | Someone will picture one case: salary, price, resolution time.          |
| Report both when       | You cannot tell. It costs one cell and doubles what the reader knows.   |
| Mean well above median | A few large values at the top. Go and look at them.                     |
| Trimmed mean           | Drop a fixed percentage from each end, then take the mean. 610.71 here. |
| TRIMMEAN vs trim_mean  | Excel takes the total proportion, scipy takes the per-end proportion.   |
| Averaging averages     | 622.04 against a true 618.125. Weight by count or use the raw rows.     |
| Blanks                 | Skipped, not counted as zero. Decide which they are before averaging.   |
| MEDIAN in SQL          | DuckDB and Snowflake yes, Postgres wants PERCENTILE_CONT(0.5).          |
| The missing column     | An average with no count beside it. Always ship the n.                  |

**The one habit to keep.** Every average ships with its median and its count. Three numbers instead of one, and the gap between the first two tells you whether to trust either. If a summary breaks in a way this page does not cover, there is a general [diagnosis loop for being stuck](https://michaelnocito.github.io/analyst-prep-kit/guides/technical-tenacity/).

One last thought, and I would genuinely like other people's answers. The first mean I ever published was an average handling time that no ticket in the system had ever taken, and nobody questioned it for four months. What is the average in your reporting that nobody has ever checked against a real row?

## References

  * Huber, P. J. (1964). Robust estimation of a location parameter. _Annals of Mathematical Statistics_ , 35(1), 73–101.
  * Hampel, F. R. (1971). A general qualitative definition of robustness. _Annals of Mathematical Statistics_ , 42(6), 1887–1896.
  * Tukey, J. W. (1962). The future of data analysis. _Annals of Mathematical Statistics_ , 33(1), 1–67.
  * Bisra, K., Liu, Q., Nesbit, J. C., Salimi, F., & Winne, P. H. (2018). Inducing self-explanation: A meta-analysis. _Educational Psychology Review_ , 30(3), 703–725.

---

*Originally published on Analyst Prep Kit: [Mean vs Median: When to Use Each, and When the Answer Changes](https://michaelnocito.github.io/analyst-prep-kit/guides/mean-vs-median/)*

*Visit the site for more beginner data analysis guides and free resources: [the full guide archive](https://michaelnocito.github.io/analyst-prep-kit/guides/) covers SQL, Excel, Power BI, Tableau, Python and statistics, and the [practice kits](https://michaelnocito.github.io/analyst-prep-kit/) run in your browser with nothing to install.*

*If it was useful: [Buy Me a Coffee](https://buymeacoffee.com/michaelnocito).*
