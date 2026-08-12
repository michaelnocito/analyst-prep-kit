By the end of this page you can turn any average into an interval using four numbers you already have, state what the interval claims in a sentence that survives scrutiny, and work out how much more data you need to halve it. The sixteen orders below average 618.13, and the honest version of that answer is 491.94 to 744.31.

Here is what to actually do today. Take the average you report most often and add a margin of error to it. Divide the standard deviation by the square root of the row count, multiply by 2, and put that either side. On our data that is 236.81 ÷ 4 = 59.20, times 2 is about 118, so the answer runs roughly from 500 to 736. Two multiplications, and your average stops pretending to be exact.

The short version: an average computed from a sample is an estimate, and the interval says how far off it could reasonably be. More rows means a narrower interval, and the relationship is the square root of the count.

The 95 percent is the part everybody misstates, and it is easier to see than to define, so it gets the picture.

> _The original carries a diagram here. In words: A single vertical line runs from top to bottom near the left-of-centre of the picture, labelled true average. Twenty short horizontal bars are stacked one above the other across the picture, each with a small vertical cap at both ends and a filled dot at its midpoint. Each bar sits at a different height and starts and ends at a different place, so their left and right ends form ragged edges rather than a straight column. Nineteen of the twenty bars are drawn in blue and every one of them crosses the vertical line, some near their left end, some near their right, and some close to their middle dot. The fourth bar from the top is drawn in a darker orange and is positioned further left than any of the others, so that its right-hand end cap stops just short of the vertical line without reaching it. That one bar is the only bar in the picture that does not touch the line._

**Every number on this page is real.** The same sixteen-row order table used in [mean vs median](https://michaelnocito.github.io/analyst-prep-kit/guides/mean-vs-median/) and [standard deviation](https://michaelnocito.github.io/analyst-prep-kit/guides/standard-deviation/): mean 618.125, standard deviation 236.81, sixteen rows. The twenty intervals in the picture came from twenty samples actually drawn and counted.

## 1. What an interval claims, in words that survive scrutiny

Before the definition: you have sixteen orders averaging 618.13. Somebody asks what the average order is for the business as a whole. Say what is wrong with answering "618.13", before reading on.

What is wrong is that 618.13 is the average of the sixteen orders you happen to have, and nobody asked about those sixteen. They asked about the business, and your sixteen are a sample of it. A different sixteen would have produced a different number, so quoting this one to two decimal places claims a precision you do not have.

A **confidence interval** replaces the single number with a range plus a statement about how often the method gets it right. The careful wording is: if you repeated this whole exercise many times, drawing a fresh sample each time and building an interval the same way, 95 percent of those intervals would contain the true value. The picture at the top of this page is nineteen out of twenty.

Notice what that sentence puts the 95 percent on. It is a property of _the procedure_ , across many samples. It is not a property of the one interval sitting in front of you, which either contains the true value or does not, and you will never know which.

That distinction sounds pedantic and it is the reason the next four sections exist. In practice you can read an interval as "the range of values this data is consistent with", and you will get almost everything right. It is when you start attaching probabilities to the one interval you have that the errors begin.

## 2. Building one from four numbers

Before the arithmetic: you have a mean of 618.125, a standard deviation of 236.81, and sixteen rows. Guess which of those three the interval's width depends on, before reading on.

The last two. The mean sets where the interval sits; the spread and the count set how wide it is. Four steps.

  1. **The standard error.** Divide the standard deviation by the square root of the count: 236.81 ÷ √16 = 236.81 ÷ 4 = **59.20**.
  2. **The multiplier.** For 95 percent confidence with 16 rows, it is **2.131**. Section three explains where it comes from and why it is not 1.96.
  3. **The margin of error.** Multiply: 2.131 × 59.20 = **126.19**.
  4. **The interval.** Put it either side of the mean: 618.125 − 126.19 = 491.94 and 618.125 + 126.19 = **744.31**.

So the answer is **618.13, with a 95 percent interval from 491.94 to 744.31**. Say out loud what that width tells you about the sixteen rows before reading on. It says they are not many. A quarter-of-a-million-row table with the same spread would have produced an interval about two dollars wide.
    
    
    from scipy import stats
    import numpy as np
    
    x  = df['Revenue']
    m  = x.mean()                       # 618.125
    se = x.std(ddof=1) / np.sqrt(len(x)) # 59.2028
    stats.t.interval(0.95, len(x) - 1, loc=m, scale=se)
    # (491.937, 744.313)
    
    
    ' Excel
    =AVERAGE(Orders[Revenue])                                      ' 618.125
    =CONFIDENCE.T(0.05, STDEV.S(Orders[Revenue]), COUNT(Orders[Revenue]))
    ' 126.188  -> the margin of error, add and subtract it yourself
    
    
    -- SQL gives you the ingredients; do the last step in the reporting layer
    SELECT COUNT(*)                                     AS n,
           AVG(Revenue)                                 AS mean_order,
           STDDEV_SAMP(Revenue)                         AS sd,
           STDDEV_SAMP(Revenue) / SQRT(COUNT(*))        AS standard_error
    FROM Orders;

## 3. Why the standard error is not the standard deviation

Before the distinction: our standard deviation is 236.81 and our standard error is 59.20. Both are in dollars and both describe uncertainty. Say what each is uncertain about, before reading on.

The **standard deviation** describes how spread out the individual orders are. Orders vary from 240 to 1,100, and 236.81 is roughly the typical distance from the middle. Collect ten thousand more orders and this number will not shrink, because the orders themselves are not becoming more alike.

The **standard error** describes how precisely you have pinned down the average. It answers a different question: if I ran this whole sampling exercise again, how much would my computed average jump around? Collect ten thousand more orders and this number does shrink, because averages of large samples are stable even when the underlying values are not.

The division by the square root of n is what turns one into the other, and it is the single most useful piece of arithmetic in applied statistics. It is why "we surveyed 1,000 people" gives a margin of error around 3 percentage points whether the population is a city or a country. The population size barely matters; the sample size is what buys precision.

Now the multiplier. If you knew the true spread of the population you would use 1.96, the value that cuts off the middle 95 percent of a bell curve. You do not know it, you estimated it from the same sixteen rows, and that extra uncertainty has to be paid for. The **t distribution** charges you for it by widening the multiplier, and the charge depends on how many rows you had.

| Rows  | Multiplier for 95% | Extra width against 1.96 |
|-------|--------------------|--------------------------|
| 5     | 2.776              | +42%                     |
| 16    | 2.131              | +9%                      |
| 30    | 2.045              | +4%                      |
| 100   | 1.984              | +1%                      |
| 1,000 | 1.962              | +0.1%                    |

On 16 rows the t multiplier costs you 9 percent of width. On 1,000 it is a rounding error, which is why the "multiply by 2" shortcut in the opening paragraph is fine on any real-sized table and slightly optimistic on a tiny one.

## 4. Reading it, and the three readings that are wrong

Before the list: you have an interval of 491.94 to 744.31. Write down what you would say it means, in one sentence, before reading mine. Most people's first sentence is one of the three below.

| The reading                                                                  | What is wrong with it                                                                                                                                                           |
|------------------------------------------------------------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| "There is a 95 percent chance the true average is between 491.94 and 744.31" | The true average is a fixed number. It is either in this interval or it is not. The 95 percent belongs to the method across many samples, not to this one interval.             |
| "95 percent of orders fall between 491.94 and 744.31"                        | Different statistic entirely. Eleven of our sixteen orders are outside it. That question needs the standard deviation or percentiles, not the standard error.                   |
| "The two intervals overlap, so the groups are not different"                 | Not a valid test. Overlapping intervals can still come from a difference that would test as significant, and the correct move is to build an interval on the difference itself. |

The second one is worth dwelling on because it is the most consequential in day-to-day work. Our interval is 252 wide and our data spans 860. An interval on the mean gets narrower as you collect more data; the spread of the actual values does not. Confusing them means telling a warehouse to plan for orders between 492 and 744 when a third of orders fall outside that range.

What I would actually write: "Average order value was 618, with a 95 percent interval from 492 to 744, on 16 orders. Individual orders ranged from 240 to 1,100." Two sentences, and neither of them can be misread.

## 5. The two width dials: confidence level and sample size

Before the numbers: you want a narrower interval. Name the two things you could change, and say which one is honest.

You can lower the confidence level, or you can collect more data. Only the second one buys anything.

| Confidence level | Multiplier (16 rows) | Margin of error | Interval         |
|------------------|----------------------|-----------------|------------------|
| 90%              | 1.753                | 103.79          | 514.34 to 721.91 |
| 95%              | 2.131                | 126.19          | 491.94 to 744.31 |
| 99%              | 2.947                | 174.45          | 443.67 to 792.58 |

Dropping to 90 percent narrows the interval by 22 points either side, and it does so by accepting that the method now misses one time in ten instead of one in twenty. Nothing was learned. The data did not improve. You simply agreed to be wrong more often, which is a legitimate choice when the cost of being wrong is low and a bad one when you did it because the chart looked untidy.

Sample size is the dial that actually works, and it works on a square root.

| Rows  | Margin of error | Interval width |
|-------|-----------------|----------------|
| 16    | 126.19          | 252.38         |
| 64    | 59.15           | 118.30         |
| 256   | 29.15           | 58.30          |
| 1,024 | 14.52           | 29.04          |

Four times the data roughly halves the interval. Not four times narrower, half. That is the single most important planning fact on this page, because it tells you what a data-collection request is worth before you make it. Going from 16 rows to 64 is transformative. Going from 1,024 to 4,096 buys you seven dollars of precision, and it is very unlikely anybody needs that.

Now picture the last estimate you were asked to "firm up". Would four times the data have changed the decision it fed, or was the interval already narrow enough to act on?

## 6. Intervals for a percentage, and where the simple formula breaks

Before the arithmetic: 7 of our 16 orders are for desks, which is 43.75 percent. Predict roughly how wide the interval on that percentage is, before reading on.

Very wide, and the shape of the calculation is the same as before. For a proportion, the standard error is the square root of p times one minus p, divided by n.
    
    
    p  = 7 / 16 = 0.4375
    se = sqrt(0.4375 × 0.5625 / 16) = sqrt(0.015381) = 0.12402
    95% interval = 0.4375 ± 1.96 × 0.12402 = 0.1944 to 0.6806

So the desk share is somewhere between **19 and 68 percent**. On sixteen orders, "roughly 44 percent" carries essentially no information, and the interval is what makes that visible rather than leaving the reader to assume the number is solid.

That simple formula, called the Wald interval, has a specific failure worth knowing. Watch what happens when every order is a desk.
    
    
    p  = 16 / 16 = 1.0
    se = sqrt(1.0 × 0.0 / 16) = 0
    95% interval = 1.0 to 1.0

It claims perfect certainty that 100 percent of all orders, forever, are desks, on the basis of sixteen rows. The formula does not merely become imprecise near 0 and 1; it collapses. The same thing happens more subtly whenever your counts are small, and the usual rule of thumb is that you need at least 5 successes and 5 failures before trusting it. Our 7 and 9 clear that bar by very little.

The fix is a better formula called the Wilson interval, which every statistics library provides and which behaves sensibly at the edges. On our desk share it gives 23.1 to 66.8 percent, a little narrower and shifted toward the middle.
    
    
    from scipy import stats
    stats.binomtest(7, 16).proportion_ci(0.95, method='wilson')
    # ConfidenceInterval(low=0.2310, high=0.6682)

Use Wilson by default. It costs one argument and it removes an entire category of embarrassing output.

## 7. Intervals for a difference, and the zero test

Before the technique: you compare two regions and one is 168.50 ahead. Say what an interval on that gap would need to contain for the gap to be unconvincing.

Zero. If an interval on a difference includes zero, then "no difference at all" is one of the values your data is consistent with, and you cannot claim a direction. Here is the comparison from [the p-values guide](https://michaelnocito.github.io/analyst-prep-kit/guides/p-values/), run as an interval.
    
    
    South: 4 orders, mean 667.50
    North: 5 orders, mean 499.00
    Difference: 168.50 in South's favour
    95% interval on the difference: −256 to +593

The interval spans zero comfortably. The data is consistent with South being ahead by 593 and with North being ahead by 256, and picking the middle of that range as the answer would be an act of imagination. That is the same conclusion the p-value reached, and the interval gets there while also telling you how big the effect could plausibly be, which the p-value never does.

This is why I would put an interval in a report where a p-value is optional. A p-value answers "could this be nothing?" An interval answers that plus "and if it is something, how big?" The second question is almost always the one that was actually asked.

One warning, repeated from section four because it is the most common mistake in reading charts: do not test two separate intervals for overlap. Build the interval on the difference. Two 95 percent intervals can overlap slightly and still correspond to a difference that clears any reasonable bar, because the uncertainty in a difference is not the sum of the two uncertainties.

## The full before and after

Same question both times: what is the average order value?

### Before
    
    
    Average order value: $618.13

Two decimal places on a number built from sixteen rows. It reads as a measurement and it is an estimate. Anyone planning against it will treat 618 and 640 as different, when the data cannot distinguish 500 from 740.

### After
    
    
    Average order value: $618  (95% CI: $492 to $744, n = 16)
    Individual orders ranged from $240 to $1,100.

The estimate, its uncertainty, the row count, and the separate fact about how individual orders vary. Four pieces of information, one line, and no way to read it as more precise than it is. The decimals also went, because reporting cents on a number with a 250-wide interval is false precision, and [defining metrics](https://michaelnocito.github.io/analyst-prep-kit/guides/defining-metrics/) covers how to write the rest of the definition down.

## Edge cases that catch people out

Six that each cost somebody an afternoon.

**An interval on the whole population.** If your table is every order that exists, the average is the average. There is nothing to infer and no interval to compute. Intervals answer "how far off could my sample be", and a census has no sample.

**Non-random samples.** Every formula here assumes your rows are a random draw. Last month's orders are not a random sample of all orders, survey respondents are not a random sample of customers, and no interval width fixes that. The interval measures sampling noise only, and it says nothing about the bias in how the rows were chosen.

**Heavily skewed data on small samples.** The t interval assumes the sample mean behaves roughly like a bell curve, which it does on 30-plus rows for most shapes. On 10 rows of something like income, it will not, and the interval is optimistic. Bootstrap it instead, or report percentiles.

**Reporting the interval and then ignoring it.** If your recommendation would flip somewhere inside your own interval, you do not have a recommendation yet. That is the most useful thing an interval does, and it is the easiest to walk past.

**Confusing it with a prediction interval.** Ours says where the average lies. A prediction interval says where the next single order will lie, and it is much wider because it carries the spread of individual orders as well as the uncertainty in the mean.

**Intervals on tiny groups in a grouped report.** Every group gets its own n, so West's three orders produce an interval so wide it is almost useless. Print the count beside every interval, the same discipline [GROUP BY and HAVING](https://michaelnocito.github.io/analyst-prep-kit/guides/sql-group-by-having/) asks for.

## Why this works

The construction and its careful wording are Neyman's, and the wording was deliberate from the start. He framed the guarantee as a long-run property of the procedure rather than a probability statement about any particular interval, precisely because the latter is not available without assumptions the frequentist framework does not make (Neyman, 1937, _Philosophical Transactions of the Royal Society A_ , 236(767), 333–380). The picture at the top of this page is that definition drawn: the promise is about the collection of intervals, and one of them missing is not a failure of the method but part of what 95 percent means.

The three misreadings in section four are documented failure modes rather than individual carelessness. Greenland and colleagues catalogue them alongside the equivalent p-value errors, including the overlap fallacy and the confusion between an interval on a mean and the spread of the data (Greenland, Senn, Rothman, Carlin, Poole, Goodman, & Altman, 2016, _European Journal of Epidemiology_ , 31(4), 337–350). Cumming and Finch showed the same errors are made when reading intervals off charts, and gave rules for what error bars can and cannot be judged by eye, which is where the advice about not eyeballing overlap comes from (Cumming & Finch, 2005, _American Psychologist_ , 60(2), 170–180).

Section six's collapse at 100 percent is not an edge case somebody forgot about; it is a known and quantified defect. Brown, Cai and DasGupta showed the simple Wald interval's actual coverage is erratic and often far below its stated level even at large n, and recommended the Wilson interval as the default for practical use (Brown, Cai, & DasGupta, 2001, _Statistical Science_ , 16(2), 101–133).

One note on why this page kept asking you to answer before showing the answer. Attempting an answer before seeing the correct one reliably improves how well the correct one is retained, even when the attempt is wrong (Bisra, Liu, Nesbit, Salimi, & Winne, 2018, _Educational Psychology Review_ , 30(3), 703–725).

## Using this on your own work

Adding intervals to every number you have ever published is miserable and you will stop at the third. Do this instead, in order.

  1. **Pick the one estimate a decision rests on.** Not all of them. The one that gets argued about.
  2. **Compute the margin of error:** standard deviation ÷ √n, times 2. Ten seconds in any tool.
  3. **Ask whether the decision flips inside the interval.** If it does, you have found the real finding, and it is "we do not know yet".
  4. **Write it as a sentence with the n in it.** "618, interval 492 to 744, on 16 orders." Never the interval alone.
  5. **Before requesting more data, use the square root rule** to say what it buys. "Four times the rows halves the interval" turns a vague ask into a costed one.

If you have paper nearby, one optional drawing is worth five minutes. Draw a vertical line for a value you believe is true, then draw ten horizontal bars across it at slightly different positions, as if from ten different samples. Deliberately draw one that misses. Doing it by hand once is what makes the difference between the procedure's hit rate and any single interval stop being wordplay.

**More detail on this, and more like it.** Every how-to sits in one place on the [guides index](https://michaelnocito.github.io/analyst-prep-kit/guides/): SQL, Python, Excel, statistics and the working habits around them.

## The whole thing on one screen

This is the retrieval sheet. Cover the right column, work down the left, and say each answer out loud before you check it.

| Idea                     | What it means                                                                         |
|--------------------------|---------------------------------------------------------------------------------------|
| Confidence interval      | The range of values your data is consistent with. Ours: 491.94 to 744.31.             |
| The 95 percent           | The method's hit rate across many samples. Not a probability about your one interval. |
| Standard error           | sd ÷ √n. Here 236.81 ÷ 4 = 59.20. Precision of the mean.                              |
| Standard deviation       | Spread of the individual values. Does not shrink with more data.                      |
| Multiplier               | 2.131 for 95% on 16 rows. Approaches 1.96 as rows grow.                               |
| Margin of error          | Multiplier × standard error = 126.19.                                                 |
| Quick version            | sd ÷ √n, times 2, either side. Good enough on any real table.                         |
| Confidence level         | 90% narrows it, 99% widens it. Neither adds information.                              |
| Sample size              | Four times the rows halves the interval. Square root, not linear.                     |
| Proportion interval      | √(p(1−p)/n). Desk share 43.75% gives 19% to 68% on 16 rows.                           |
| Wald at 100%             | Collapses to zero width. Use the Wilson interval instead.                             |
| Interval on a difference | If it contains zero, you cannot claim a direction.                                    |
| Overlap fallacy          | Do not compare two intervals by eye. Build one on the difference.                     |
| Prediction interval      | Where the next single value lands. Much wider than one on the mean.                   |
| Census                   | No sample, no inference, no interval.                                                 |
| What it cannot fix       | Bias in how the rows were chosen. It measures sampling noise only.                    |

**The one habit to keep.** Every estimate that feeds a decision ships as three things: the number, the interval, and the row count. Then ask whether the decision flips anywhere inside the interval. If a result breaks in a way this page does not cover, there is a general [diagnosis loop for being stuck](https://michaelnocito.github.io/analyst-prep-kit/guides/technical-tenacity/).

One last thought, and I would genuinely like other people's answers. The first interval I ever put in a report made an argument disappear, because both sides' preferred numbers sat comfortably inside it and there was nothing left to argue about. What number in your work would stop being contested the moment somebody drew its interval?

## References

  * Neyman, J. (1937). Outline of a theory of statistical estimation based on the classical theory of probability. _Philosophical Transactions of the Royal Society A_ , 236(767), 333–380.
  * Brown, L. D., Cai, T. T., & DasGupta, A. (2001). Interval estimation for a binomial proportion. _Statistical Science_ , 16(2), 101–133.
  * Cumming, G., & Finch, S. (2005). Inference by eye: Confidence intervals and how to read pictures of data. _American Psychologist_ , 60(2), 170–180.
  * Greenland, S., Senn, S. J., Rothman, K. J., Carlin, J. B., Poole, C., Goodman, S. N., & Altman, D. G. (2016). Statistical tests, P values, confidence intervals, and power: A guide to misinterpretations. _European Journal of Epidemiology_ , 31(4), 337–350.
  * Bisra, K., Liu, Q., Nesbit, J. C., Salimi, F., & Winne, P. H. (2018). Inducing self-explanation: A meta-analysis. _Educational Psychology Review_ , 30(3), 703–725.

---

*Originally published on Analyst Prep Kit: [Confidence Intervals and the Margin of Error: Built From Four Numbers](https://michaelnocito.github.io/analyst-prep-kit/guides/confidence-intervals/)*

*Visit the site for more beginner data analysis guides and free resources: [the full guide archive](https://michaelnocito.github.io/analyst-prep-kit/guides/) covers SQL, Excel, Power BI, Tableau, Python and statistics, and the [practice kits](https://michaelnocito.github.io/analyst-prep-kit/) run in your browser with nothing to install.*

*If it was useful: [Buy Me a Coffee](https://buymeacoffee.com/michaelnocito).*
