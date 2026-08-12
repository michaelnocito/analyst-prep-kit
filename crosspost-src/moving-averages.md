By the end of this page you can build a moving average by hand, choose a window length on purpose rather than by habit, explain the lag it introduces, and spot the one data problem that silently corrupts every moving average you will ever compute. On the sixteen weeks below, the raw series wobbles with a standard deviation of 237. A three-week average brings that to 101, and a five-week to 62.

Here is what to actually do today. Add a moving average to your busiest weekly or daily chart, using a window that matches your cycle: 7 for daily data with a weekday pattern, 4 or 13 for weekly, 12 for monthly. Then plot it on top of the raw series rather than instead of it, so the reader can see both the noise and the trend.

The short version: a moving average replaces each point with the average of it and the points around it. Wobble cancels out, trend survives, and the price is that the smoothed line reacts late.

The effect is easier to see than to describe, so it gets the picture.

> _The original carries a diagram here. In words: A line chart with two lines drawn on the same axes over sixteen evenly spaced points. The first line is thin and violently jagged, swinging from near the top of the chart down to near the bottom and back again several times, with one especially deep trough about a quarter of the way along and one especially tall spike just past the middle. The second line is thicker and starts two points later than the first. It stays in a narrow band through the middle of the chart, rising and falling only gently, and never comes close to either the peaks or the troughs of the jagged line. Where the jagged line spikes to its highest point, the thick line rises only slightly and does so one point later than the spike. The word actual labels the jagged line near its left end, and the phrase three-week average labels the thick line._

**Every number on this page is real.** The same sixteen orders used across these guides, this time read as a weekly series because the orders fall one per week. There is a real five-week gap in the middle where no orders exist, and section five is about what that does. The companion page on judging a forecast once you have made one is [forecast accuracy](https://michaelnocito.github.io/analyst-prep-kit/guides/forecast-accuracy/).

Here is the series. One order per week, from 5 January to 25 May 2026, with nothing at all between 23 March and 4 May.

| Week beginning | Revenue | Week beginning | Revenue |
|----------------|---------|----------------|---------|
| 2026-01-05     | 880     | 2026-03-02     | 280     |
| 2026-01-12     | 850     | 2026-03-09     | 1,100   |
| 2026-01-19     | 660     | 2026-03-16     | 440     |
| 2026-01-26     | 240     | 2026-03-23     | 765     |
| 2026-02-02     | 660     | 2026-05-04     | 600     |
| 2026-02-09     | 680     | 2026-05-11     | 510     |
| 2026-02-16     | 425     | 2026-05-18     | 880     |
| 2026-02-23     | 480     | 2026-05-25     | 440     |

## 1. What a moving average is doing to your numbers

Before the explanation: look at weeks three, four and five in that table: 660, 240, 660. Decide whether the 240 tells you the business dropped, before reading on.

It does not, and that is the problem a moving average solves. Any single period contains two things mixed together: whatever is genuinely going on, and the accident of which orders happened to land in that week. Week four's 240 is one small lamp order. It is not a collapse in demand, it is a Tuesday.

A **moving average** separates them by averaging over a window of consecutive periods. Random ups and downs partly cancel, because the high accidents and the low accidents sit in the same window. Anything sustained does not cancel, because it is present in every period of the window. What comes out is the sustained part, with the accidents damped.

The damping is measurable. Our raw weekly numbers have a standard deviation of 236.81. The three-week average has 100.56, and the five-week average has 61.95. The wider the window, the more cancelling happens, and section three is about what that costs.

## 2. Building a three-week average by hand

Before the arithmetic: you want a three-week average for the week beginning 19 January. Say which three weeks go into it, before reading on. There are two defensible answers and the difference matters.

The common answer is a **trailing** window: this week and the two before it. That is 660, 850 and 880, which average to (660 + 850 + 880) ÷ 3 = **796.67**. Then you slide the window forward one week at a time, dropping the oldest and picking up the newest.

| Week       | Revenue | The three weeks averaged | 3-week average |
|------------|---------|--------------------------|----------------|
| 2026-01-05 | 880     | not enough history       | –              |
| 2026-01-12 | 850     | not enough history       | –              |
| 2026-01-19 | 660     | 880, 850, 660            | 796.67         |
| 2026-01-26 | 240     | 850, 660, 240            | 583.33         |
| 2026-02-02 | 660     | 660, 240, 660            | 520.00         |
| 2026-02-09 | 680     | 240, 660, 680            | 526.67         |
| 2026-02-16 | 425     | 660, 680, 425            | 588.33         |
| 2026-02-23 | 480     | 680, 425, 480            | 528.33         |
| 2026-03-02 | 280     | 425, 480, 280            | 395.00         |
| 2026-03-09 | 1,100   | 480, 280, 1,100          | 620.00         |
| 2026-03-16 | 440     | 280, 1,100, 440          | 606.67         |
| 2026-03-23 | 765     | 1,100, 440, 765          | 768.33         |

Two things to read off that table. The first two weeks have no value at all, because a three-week window needs three weeks, and every moving average starts late by window length minus one. And the 1,100 spike in the week of 9 March never appears in the smooth series; the closest it gets is lifting three consecutive averages to 620, 606.67 and 768.33.
    
    
    # pandas
    s.rolling(3).mean()              # trailing, needs 3 values
    s.rolling(3, min_periods=1).mean()   # starts immediately, first values on fewer rows
    
    
    -- SQL: a window frame is exactly a moving average
    SELECT OrderDate,
           Revenue,
           AVG(Revenue) OVER (ORDER BY OrderDate
                              ROWS BETWEEN 2 PRECEDING AND CURRENT ROW) AS ma3
    FROM Orders
    ORDER BY OrderDate;
    
    
    ' Excel, with revenue in B2:B17 and the formula from B4's row
    =IF(ROW()-ROW($B$2)<2, "", AVERAGE(B2:B4))

The SQL version is worth a second look, because `ROWS BETWEEN 2 PRECEDING AND CURRENT ROW` is the definition written out in words. If window frames are new, [window functions](https://michaelnocito.github.io/analyst-prep-kit/guides/sql-window-functions/) covers the whole family, and [running totals](https://michaelnocito.github.io/analyst-prep-kit/guides/sql-running-total/) is the same machinery with a different frame.

## 3. Choosing the window, and what each length costs

Before the trade: a longer window smooths more. Name what you give up for that, before reading on.

You give up responsiveness and you give up data at the start. Here are the three numbers that make the trade concrete on our series.

| Series         | Standard deviation | Range            | Weeks lost at the start |
|----------------|--------------------|------------------|-------------------------|
| Raw weekly     | 236.81             | 240 to 1,100     | 0                       |
| 3-week average | 100.56             | 395.00 to 796.67 | 2                       |
| 5-week average | 61.95              | 497.00 to 683.00 | 4                       |

The five-week version is beautifully smooth and it has thrown away four of your sixteen weeks and compressed a real 860-wide range into 186. If something genuinely changed in the last fortnight, a five-week average will show you about two fifths of it.

The rule that beats taste: **match the window to the cycle you want removed**.

  * **Daily data with a weekday pattern:** use 7. A seven-day average always contains exactly one of each weekday, so the weekday effect cancels completely rather than partly.
  * **Weekly data:** 4 for a month-ish view, 13 for a quarter.
  * **Monthly data with a seasonal pattern:** use 12, for the same reason as 7 on daily data.
  * **No cycle, just noise:** pick the shortest window that makes the chart readable, and say what it is.

Say out loud why a 6-day average on daily data is worse than a 7-day one, even though it is nearly as smooth. A six-day window contains two of one weekday and none of another, and which ones changes as the window slides. The averaged line then carries a wobble the raw data does not have, which is the worst possible outcome from a smoothing step.

Now picture your own busiest chart. What cycle is in it, and does the window you use, if you use one, actually match that cycle?

## 4. Trailing against centred, and the lag

Before the comparison: our trailing average puts the value 796.67 on the week of 19 January, but it was computed from 5, 12 and 19 January. Say where that number really belongs on the timeline.

In the middle, on 12 January. A trailing average is systematically late, by half the window, because it labels a window with its right-hand edge. That is the **lag** , and it is not an error, it is the direct cost of using only information you would actually have had at the time.

| Week       | Revenue | Trailing 3-week | Centred 3-week |
|------------|---------|-----------------|----------------|
| 2026-01-05 | 880     | –               | –              |
| 2026-01-12 | 850     | –               | 796.67         |
| 2026-01-19 | 660     | 796.67          | 583.33         |
| 2026-01-26 | 240     | 583.33          | 520.00         |
| 2026-02-02 | 660     | 520.00          | 526.67         |

The centred column is the same numbers shifted one row up. Nothing was recomputed, only relabelled, and that relabelling is what removes the lag.

Which one to use comes down to one question: does the value need to be honest about what you knew at the time?

**Use trailing** for anything operational or forward-looking. A dashboard, an alert, a forecast input. A centred average uses future data, so a centred line on a live dashboard is claiming knowledge you do not have, and it will change under you as new data arrives.

**Use centred** for historical description, where all the data already exists and you want the trend line to sit correctly on the timeline. Seasonal decomposition uses centred averages for exactly this reason.

Centred windows also want an odd length, so there is a genuine middle period. With an even window you end up averaging two adjacent centred averages, which is a real technique and a fiddly one, and is the main practical reason to prefer 3, 5, 7 and 13 over 4, 6 and 12.

## 5. The missing weeks that corrupt it silently

Before the trap: our series jumps from 23 March straight to 4 May. Five weeks with no orders. Say what `rolling(3)` will do with that, before reading on.

It will average across the hole and tell you nothing happened. Look at what the trailing three-week average produces for the week of 4 May if the gap is not represented in the data.
    
    
    Week of 2026-05-04, 3-week trailing average = 601.67
      built from: 2026-03-16   440
                  2026-03-23   765
                  2026-05-04   600

Those three "consecutive" weeks span nine weeks of calendar. The number 601.67 looks entirely ordinary sitting in a column, and it is an average of March and May with five weeks of nothing quietly deleted. Nothing errors, nothing warns, and the smooth line glides straight through a two-month hole.

The reason is worth stating plainly: `rolling` in pandas and `ROWS BETWEEN` in SQL both count **rows** , not time. If a period has no rows, it has no row, so it is not in your table, so it cannot be counted. Grouping never invents the periods it did not see.

The fix is the same one every time-based calculation needs. Build the full set of periods, join your data onto it, and decide what the empty ones mean.
    
    
    # reindex onto every Monday in the range
    full = s.asfreq('W-MON')          # missing weeks appear as NaN
    full.rolling(3).mean()            # now NaN through the gap: correct and visible
    full.fillna(0).rolling(3).mean()  # gap treated as zero sales

| Week       | Ignoring the gap | Real calendar, gap as no data | Real calendar, gap as zero |
|------------|------------------|-------------------------------|----------------------------|
| 2026-03-23 | 768.33           | 768.33                        | 768.33                     |
| 2026-03-30 | not drawn        | –                             | 401.67                     |
| 2026-04-13 | not drawn        | –                             | 0.00                       |
| 2026-05-04 | 601.67           | –                             | 200.00                     |
| 2026-05-11 | 625.00           | –                             | 370.00                     |
| 2026-05-18 | 663.33           | 663.33                        | 663.33                     |

Three defensible answers and one indefensible one. Treating the gap as zero says the business made no sales, which is right if the shop was shut and wrong if the data simply did not arrive. Leaving it as no data says you cannot compute an average there, which is right if you do not know. Ignoring the calendar entirely, the first column, says the five weeks never existed, and that is the one nobody chose on purpose.

Deciding which of the first two applies is a data question, not a statistics question, and it is the same decision as in [handling missing values](https://michaelnocito.github.io/analyst-prep-kit/guides/pandas-fillna-dropna/). What matters is that you make it rather than let `rolling` make it for you.

## 6. Weighted and exponential versions

Before the idea: a plain three-week average treats last week and the week before last as equally informative. Say whether you believe that, before reading on.

Usually not. Recent periods are normally more relevant, and there are two standard ways to say so.

A **weighted moving average** assigns explicit weights that add to one. Weights of 0.5, 0.3 and 0.2 on the most recent three weeks give, for the week of 23 March: 0.5 × 765 + 0.3 × 440 + 0.2 × 1,100 = 382.5 + 132 + 220 = **734.50** , against the plain average's 768.33. It is transparent, and it needs you to invent the weights.

An **exponentially weighted average** avoids inventing them. It uses one number, usually called alpha, and blends each new value into the running average by that fraction.
    
    
    new average = alpha × this week + (1 − alpha) × last week's average

With alpha = 0.3 on our series, the first value is 880, then 0.3 × 850 + 0.7 × 880 = 871.00, then 0.3 × 660 + 0.7 × 871 = 807.70, and so on. Every past week still contributes, and its influence shrinks the further back it is. It never fully forgets and it never gives an old week much say.
    
    
    s.ewm(alpha=0.3, adjust=False).mean()
    # 880.00, 871.00, 807.70, 637.39, 644.17, 654.92, ...

Two practical advantages over a plain window. There is no start-up gap, because the first value is simply the first observation. And there is no window length to defend, only alpha, where higher means more responsive and lower means smoother. Alpha around 0.2 to 0.3 is a reasonable starting point for weekly business data.

One caution that applies to all three. Exponential smoothing counts every past value, so a spike never leaves the series entirely, it only fades. On a plain three-week window the 1,100 spike is gone after three weeks, cleanly. Which behaviour you want is a real choice, not a detail.

## 7. What a moving average must not be used for

Before the warning: a smooth line is very persuasive. Name something a moving average cannot tell you, before reading on.

**It is not a forecast.** A trailing average tells you where the recent past sat, and extending it flat into the future is a forecast method, but a weak one that assumes no trend and no seasonality. It is worth computing precisely because it is the baseline anything fancier has to beat, and [forecast accuracy](https://michaelnocito.github.io/analyst-prep-kit/guides/forecast-accuracy/) is how you check whether it did.

**It does not make a trend real.** A moving average will produce a smooth, convincing rising line from data that is pure noise, because averaging adjacent random numbers creates apparent runs. Three rising points on a smoothed line is not evidence of anything.

**It cannot detect a change point in the last few periods.** By construction the most recent value is diluted by older ones, so a genuine shift last week shows up as a small nudge. If detecting recent change is the job, look at the raw series with a control limit, not at the smooth line.

**It should not replace the raw data on a chart.** Plot both. A reader shown only the smooth line has no way to judge how much was smoothed away, and the difference between a wobble of 237 and one of 62 is information they need.

Say in one sentence why the smooth line alone is the version most likely to mislead. It is because smoothness reads as certainty, and the smoothing step is exactly the step that removed the evidence of uncertainty. That is the same argument as in [how charts mislead](https://michaelnocito.github.io/analyst-prep-kit/guides/how-charts-mislead/), applied to a technique rather than an axis.

## The full before and after

Same series, same question: how is revenue trending?

### Before
    
    
    df['ma3'] = df['Revenue'].rolling(3).mean()
    # then chart ma3 alone

Three problems, none of which errors. The five missing weeks are averaged straight across, so the week of 4 May shows 601.67 built partly from March. The raw series is not on the chart, so nobody can see how much wobble was removed. And the window of 3 was chosen because it is the number people type, not because anything in the business has a three-week cycle.

### After
    
    
    # 1. put every week on the calendar, including the empty ones
    full = s.asfreq('W-MON')
    
    # 2. decide what an empty week means, out loud, and record it
    #    no orders were placed, so an empty week is genuinely zero revenue
    full = full.fillna(0)
    
    # 3. window matched to the reporting cycle, not to habit
    full_ma = full.rolling(4).mean()
    
    # 4. chart both lines, and label the window
    

The gap is now visible as a real trough instead of being deleted, the choice to call it zero is written where the next person will read it, the window is a stated decision, and the chart shows the raw series underneath so the reader can see what was smoothed. Same technique, four decisions made rather than defaulted.

## Edge cases that catch people out

Six that each cost somebody an afternoon.

**`min_periods` quietly changes the meaning.** `rolling(3, min_periods=1)` gives you a value from the very first row, but that value is a one-row average sitting in a column labelled three-week. Convenient for charts, misleading in a table.

**Duplicate rows in the same period.** If two orders share a date and you have not aggregated first, a row-based window is averaging orders rather than days, and the window length no longer means what its name says. Aggregate to one row per period before smoothing, always.

**Sorting.** A window function with no `ORDER BY`, or a DataFrame not sorted by date, produces a moving average of whatever order the rows happened to be in. It will not error and it will look plausible.

**Averaging a rate.** A moving average of a conversion rate weights every period equally regardless of traffic. If you want a smoothed rate, smooth the numerator and denominator separately and divide at the end.

**The last point moves.** Yesterday's three-day average changes when today's data arrives if the window is centred, and does not if it is trailing. A dashboard whose historical numbers change overnight is usually a centred average that should have been trailing.

**Comparing two series smoothed differently.** A 7-day average and a 30-day average of the same data will cross each other constantly, and those crossings mean nothing about the business. If you are showing two windows, say what each one is for.

## Why this works

Averaging adjacent periods works because an observation can be thought of as a signal plus an error, and errors from different periods are largely unrelated to each other while the signal is not. Averaging leaves the signal alone and shrinks the error, and the amount it shrinks by is the square root of the window length, which is the same relationship behind the [standard error](https://michaelnocito.github.io/analyst-prep-kit/guides/confidence-intervals/). Our numbers bear that out approximately: 236.81 divided by the square root of 3 is 136.7 against an observed 100.56, and divided by the square root of 5 is 105.9 against an observed 61.95. The observed smoothing is stronger than the simple rule predicts, because the rule assumes the raw values are independent, and consecutive weeks in real business data are not.

The reason to bother with the plainest possible methods first is empirical rather than aesthetic. The M-competitions ran thousands of real series through dozens of forecasting methods and repeatedly found that simple methods, including moving averages and exponential smoothing, match or beat far more elaborate ones on out-of-sample accuracy, and that combining a few simple methods beats picking one (Makridakis, Spiliotis, & Assimakopoulos, 2020, _International Journal of Forecasting_ , 36(1), 54–74). Gardner's review of exponential smoothing covers why the single-parameter version in section six holds up so well across so many series, and where its extensions for trend and seasonality become worth the extra parameters (Gardner, 2006, _International Journal of Forecasting_ , 22(4), 637–666).

One note on why this page kept asking you to answer before showing you the answer. Attempting an answer before seeing the correct one reliably improves how well the correct one is retained, even when the attempt is wrong (Bisra, Liu, Nesbit, Salimi, & Winne, 2018, _Educational Psychology Review_ , 30(3), 703–725). The 601.67 across the gap sticks because you were asked to predict what `rolling` would do first.

## Using this on your own work

Adding smoothing to every chart you own is miserable and unnecessary. Do this instead, in order.

  1. **Check for missing periods first.** Count the distinct periods in your data and compare with the number of periods in the date range. If they differ, fix that before smoothing anything.
  2. **Pick the window from the cycle** , not from habit. 7 for daily, 4 or 13 for weekly, 12 for monthly.
  3. **Use trailing on anything live** , and centred only for finished history.
  4. **Plot both lines** , raw and smoothed, and put the window in the axis label or the legend.
  5. **Say what the smooth line is for** in one sentence. If the answer is "so the chart looks tidier", the chart may not need it.

If you have paper nearby, one optional drawing is worth five minutes. Write your own last twelve periods in a row, then slide a three-wide window along them with a finger, writing each average underneath. Doing it by hand once makes the start-up gap and the lag obvious in a way that no explanation of them does.

**More detail on this, and more like it.** Every how-to sits in one place on the [guides index](https://michaelnocito.github.io/analyst-prep-kit/guides/): SQL, Python, Excel, statistics and the working habits around them.

## The whole thing on one screen

This is the retrieval sheet. Cover the right column, work down the left, and say each answer out loud before you check it.

| Idea                  | What it means                                                                  |
|-----------------------|--------------------------------------------------------------------------------|
| Moving average        | Replace each period with the average of it and its neighbours.                 |
| What it removes       | Wobble that does not repeat. sd 236.81 raw, 100.56 at 3 weeks, 61.95 at 5.     |
| Trailing window       | This period and the ones before it. Uses only what you knew at the time.       |
| Centred window        | Same numbers relabelled to the middle period. Uses future data.                |
| Which to use          | Trailing for anything live. Centred for finished history only.                 |
| The lag               | A trailing average is late by about half the window. Not a bug, the price.     |
| Start-up gap          | You lose window minus one periods at the beginning.                            |
| Choosing the window   | Match the cycle: 7 daily, 4 or 13 weekly, 12 monthly. Odd lengths for centred. |
| Why 6 is worse than 7 | It contains two of one weekday and none of another, adding a wobble.           |
| SQL                   | `AVG(x) OVER (ORDER BY d ROWS BETWEEN 2 PRECEDING AND CURRENT ROW)`.           |
| The gap trap          | rolling counts rows, not time. Our 601.67 spanned nine calendar weeks.         |
| The fix               | Reindex onto every period, then decide what an empty one means.                |
| Weighted              | Explicit weights summing to one. 0.5/0.3/0.2 gave 734.50 against 768.33.       |
| Exponential           | alpha × now + (1 − alpha) × previous average. No start-up gap, one parameter.  |
| Not a forecast        | It is a description of the recent past, and the baseline to beat.              |
| Always plot both      | Smooth alone hides how much was smoothed. Show the raw series underneath.      |

**The one habit to keep.** Before smoothing anything, check that every period exists in your data, and after smoothing, plot the raw series underneath. Those two steps prevent the silent gap and the false certainty, which are the only two ways this technique really goes wrong. If a series breaks in a way this page does not cover, there is a general [diagnosis loop for being stuck](https://michaelnocito.github.io/analyst-prep-kit/guides/technical-tenacity/).

One last thought, and I would genuinely like other people's answers. The first moving average I shipped smoothed straight across a week when our tracking was broken, so the outage looked like a mild dip and nobody investigated for a month. What has your smooth line quietly averaged away?

## References

  * Makridakis, S., Spiliotis, E., & Assimakopoulos, V. (2020). The M4 Competition: 100,000 time series and 61 forecasting methods. _International Journal of Forecasting_ , 36(1), 54–74.
  * Gardner, E. S. (2006). Exponential smoothing: The state of the art, Part II. _International Journal of Forecasting_ , 22(4), 637–666.
  * Makridakis, S., & Hibon, M. (2000). The M3-Competition: Results, conclusions and implications. _International Journal of Forecasting_ , 16(4), 451–476.
  * Bisra, K., Liu, Q., Nesbit, J. C., Salimi, F., & Winne, P. H. (2018). Inducing self-explanation: A meta-analysis. _Educational Psychology Review_ , 30(3), 703–725.

---

*The full version of this guide lives on my site: [Moving Averages: Smoothing a Series Without Smoothing Away the Truth](https://michaelnocito.github.io/analyst-prep-kit/guides/moving-averages/).*

*If it was useful: [Buy Me a Coffee](https://buymeacoffee.com/michaelnocito).*
