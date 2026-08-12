By the end of this page you can score a forecast five different ways, say what each measure rewards and punishes, and answer the only question that makes any of them meaningful: is this forecast better than doing nothing. On the five months below, the same forecast scores an average miss of 600, a root-mean-square miss of 1,084, and a percentage error of infinity.

Here is what to actually do today. Take your current forecast and compare it to the laziest possible alternative: last period's actual, repeated. If your forecast is not beating that, the sophistication is not earning its keep, and that comparison takes about two minutes to run.

The short version: measure the error each period, then decide how to average them. Averaging the sizes gives MAE. Averaging the squares and taking the root gives RMSE, which punishes one big miss much harder. Averaging the percentages gives MAPE, which breaks whenever an actual is zero.

The difference between the first two is the whole reason both exist, and it is easier to see than to define, so it gets the picture.

> _The original carries a diagram here. In words: Two arrangements side by side, each built from a horizontal bar on top and shaded squares standing on a common baseline below. On the left, the horizontal bar is divided by three tick marks into four equal short pieces, and beneath it four small identical squares stand in a row, each one as wide as one piece of the bar. On the right, the horizontal bar is exactly the same total length as the left one but is a single unbroken piece, and beneath it stands one large square whose side equals that whole length. The large square on the right is visibly far bigger than the four small squares on the left put together, taking up roughly four times as much shaded area, even though the two bars above them are the same length. The left row is labelled error at the bar and error squared at the squares._

**Every number on this page is real.** The same order table used across these guides, aggregated to five months. There are genuinely no April orders, and that is not a contrivance: it is the ordinary case of a period with no activity, and section four is about what it does. The companion page on building the forecast in the first place is [moving averages](https://michaelnocito.github.io/analyst-prep-kit/guides/moving-averages/).

Here is the setup. The plan for the year was a flat 2,400 a month, set in advance. Here is what actually happened.

| Month    | Actual | Forecast | Error (actual − forecast) | Absolute error |
|----------|--------|----------|---------------------------|----------------|
| January  | 2,630  | 2,400    | +230                      | 230            |
| February | 2,245  | 2,400    | −155                      | 155            |
| March    | 2,585  | 2,400    | +185                      | 185            |
| April    | 0      | 2,400    | −2,400                    | 2,400          |
| May      | 2,430  | 2,400    | +30                       | 30             |

## 1. The error, and the one that cancels itself out

Before the arithmetic: add up the five errors in that last-but-one column, with their signs. Predict roughly what you will get, before reading on.

You get −2,110, which divided by five is −422. That is the **bias** , or mean error, and it is a genuinely useful number that answers a different question from the rest of this page. It says whether you are systematically forecasting too high or too low. Ours is negative, so the plan ran above reality on average, mostly because of April.

What it cannot do is measure accuracy, because positive and negative errors cancel. A forecast that is 5,000 too high one month and 5,000 too low the next has a bias of zero and is not accurate. Every other measure on this page exists because of that cancellation, and each one deals with it differently: MAE takes the absolute value, RMSE squares.

Report bias alongside accuracy, never instead of it. A forecast with low error and no bias is good. Low error with a consistent bias means you have a correctable offset, which is the cheapest improvement available to any forecast.

## 2. MAE: the average miss, in your own units

Before the calculation: take the five absolute errors, 230, 155, 185, 2,400 and 30, and average them in your head to the nearest hundred.

(230 + 155 + 185 + 2,400 + 30) ÷ 5 = 3,000 ÷ 5 = **600**. The **mean absolute error** is the average size of a miss, ignoring direction. It is in dollars, so it can be read straight out: this forecast is off by about 600 a month.

Say out loud what is misleading about that sentence, given the table above it. The forecast was off by 230, 155, 185 and 30 in four of the five months, and by 2,400 in one. Nothing was "off by 600" in any month. The average is being dragged by one period, exactly as the [mean is dragged by an outlier](https://michaelnocito.github.io/analyst-prep-kit/guides/mean-vs-median/), and for the same reason.

MAE's advantages are real anyway. It is in the units people care about, every period counts equally, and it is the easiest measure to explain to somebody who does not want a statistics lesson. Its disadvantage is that you cannot compare it across products, regions or time periods with different scales. An MAE of 600 is excellent on a million-dollar line and catastrophic on a two-thousand-dollar one.
    
    
    import numpy as np
    actual   = np.array([2630, 2245, 2585, 0, 2430], float)
    forecast = np.array([2400, 2400, 2400, 2400, 2400], float)
    error    = actual - forecast
    
    mae  = np.abs(error).mean()          # 600.0
    bias = error.mean()                  # -422.0

## 3. RMSE: the one that hates a single big miss

Before the number: same five errors. Square each, average the squares, take the square root. Predict whether the answer is above or below 600.

Well above: **1,083.70**. Squaring makes a 2,400 miss 256 times more expensive than a 150 miss, rather than 16 times, so the one bad month dominates completely.
    
    
    rmse = np.sqrt((error ** 2).mean())  # 1083.70

The picture at the top of this page is that fact with the numbers removed. Two forecasts, each 400 off in total across four periods. Four misses of 100 give MAE 100 and RMSE 100. One miss of 400 gives MAE 100 and RMSE 200. Identical by one measure, double by the other, and the difference is entirely about how the error was distributed.

| Error pattern      | Total error | MAE | RMSE |
|--------------------|-------------|-----|------|
| 100, 100, 100, 100 | 400         | 100 | 100  |
| 0, 0, 0, 400       | 400         | 100 | 200  |

Which behaviour is correct depends entirely on what a miss costs you. If being 400 wrong once is much worse than being 100 wrong four times, because it empties a warehouse or blows a budget, then RMSE is measuring what you care about and you should use it. If a miss costs proportionally, so four small misses hurt exactly as much as one big one, MAE is the honest measure and RMSE will make you over-fit to your worst month.

RMSE is always at least as large as MAE, and the gap between them tells you how uneven your errors are. Ours are 600 and 1,083.70, a ratio of 1.8, which is a loud signal that one period is doing most of the damage. When MAE and RMSE are close, your errors are evenly spread.

## 4. MAPE, and the month that returns infinity

Before the problem: MAPE divides each error by the actual value to get a percentage, then averages those. Look at the April row and say what happens, before reading on.

April's actual is zero. 2,400 divided by 0 is not a number, so the average of the five percentages is not a number either. **MAPE is infinite** , and depending on your tool you will get `inf`, a division-by-zero error, or, worst of all, a silently skipped row and a plausible-looking answer.
    
    
    ape = np.abs(error / actual)
    # array([0.0875, 0.0690, 0.0716, inf, 0.0123])
    ape.mean()     # inf

This is not an edge case you can dismiss. Any period with no activity gives an actual of zero: a closed store, a product before launch, a channel that went quiet, a week the tracking broke. **MAPE is undefined for exactly the periods you most want to understand.**

Excluding April, MAPE is 6.01 percent, and the four monthly percentage errors are 8.75, 6.90, 7.16 and 1.23. That number is genuinely informative about the four normal months, and reporting it as "MAPE 6 percent" without saying that a month was dropped is the kind of omission that gets found later.

MAPE has a second, quieter problem: it is asymmetric. Forecasting 200 when the actual is 100 gives an error of 100 percent. Forecasting 100 when the actual is 200 gives 50 percent. The same absolute miss, scored twice as harshly in one direction, which means optimizing for MAPE quietly pushes your forecasts low.

None of that makes MAPE useless. It is unitless, so it compares across products and regions, and non-technical readers understand a percentage immediately. Use it when your actuals are comfortably away from zero, and reach for section five when they are not.

## 5. WAPE and sMAPE, the two usual repairs

Before the fix: the problem with MAPE is dividing by each individual actual. Say what you would divide by instead, before reading on.

The total. **WAPE** , the weighted absolute percentage error, adds up all the absolute errors and divides by the sum of the actuals, dividing once instead of five times.
    
    
    wape = np.abs(error).sum() / actual.sum()
    # 3000 / 9890 = 0.3033  ->  30.33%

April no longer breaks anything, because its zero contributes zero to the denominator rather than being a denominator of its own. And the result is naturally weighted by size, so a miss in a big month counts more than a miss in a small one, which is usually what you want. WAPE is my default whenever a percentage is required.

Compare the two on the four normal months, where both work: MAPE 6.01 percent and WAPE 6.07 percent. Almost identical, because those months are all about the same size. The gap only opens when period sizes differ, and then WAPE is the one that reflects the business.

**sMAPE** , the symmetric version, divides by the average of the actual and the forecast rather than by the actual alone. That fixes the asymmetry and it does not really fix the zero problem: on our data it gives 44.90 percent, which is a strange-looking number driven by April scoring 200 percent, its maximum. sMAPE is common in forecasting competitions and I would not put it in front of a business reader without explaining it, which is usually a sign to use something else.

| Measure | All five months | Four months, April removed |
|---------|-----------------|----------------------------|
| MAE     | 600.00          | 150.00                     |
| RMSE    | 1,083.70        | 167.37                     |
| Bias    | −422.00         | +72.50                     |
| MAPE    | undefined       | 6.01%                      |
| WAPE    | 30.33%          | 6.07%                      |
| sMAPE   | 44.90%          | 6.12%                      |

Read the two columns side by side and the point of this page appears. Removing one month of five turns an average miss of 600 into 150, and turns a positive bias into a negative one. Neither column is dishonest. The one you publish is a decision about whether April is part of the thing you are forecasting, and it belongs in writing next to the number.

## 6. MASE: better than doing nothing, or not

Before the idea: an MAE of 600 is good or bad compared with what? Name the comparison you would want, before reading on.

The comparison you want is against the effort-free alternative. The standard one is the **naive forecast** : predict that next month equals this month. Compute its error the same way, then divide.
    
    
    naive_mae = np.abs(np.diff(actual)).mean()   # 1435.0
    mase      = np.abs(error).mean() / naive_mae # 600 / 1435 = 0.418

A **MASE** below 1 means you beat the naive forecast; above 1 means you did not. Ours is **0.418** , so the flat plan of 2,400 was about twice as accurate as guessing that each month repeats the last one. Here are both, scored the same way.

| Forecast                   | MAE      | RMSE     | Bias    | MASE  |
|----------------------------|----------|----------|---------|-------|
| Flat plan of 2,400         | 600.00   | 1,083.70 | −422.00 | 0.418 |
| Naive, last month repeated | 1,174.00 | 1,604.24 | −14.00  | 0.818 |

Both beat the in-sample naive baseline, and the flat plan beats it by more. Notice the naive forecast's bias of −14, nearly zero, which is a good illustration of why bias alone proves nothing: a forecast can be unbiased and still be wrong by 1,174 a month, because its errors cancel rather than being small.

MASE is unitless, works when actuals are zero, and is symmetric, which is why forecasting researchers reach for it. Its cost is that it is not intuitive: nobody in a business meeting knows what 0.418 means without the sentence attached. So report it as the sentence. "About twice as accurate as assuming next month repeats this one" is what it says.

Now picture your own forecast, whatever produces it. If you scored it against last period repeated, would it win? That single comparison is worth more than any refinement to the model.

## 7. Which one to report, and to whom

Before the recommendation: you have six numbers describing one forecast. Decide which you would put on a slide, before reading mine.

| Audience or purpose                      | Report                  | Because                                             |
|------------------------------------------|-------------------------|-----------------------------------------------------|
| An operations team acting on the number  | MAE, plus bias          | In their units, and it says which way you lean.     |
| Big misses are disproportionately costly | RMSE                    | It prices one large miss the way the business does. |
| Comparing across products or regions     | WAPE                    | Unitless, weighted by size, survives zeros.         |
| Choosing between forecasting methods     | MASE                    | Scale-free and anchored to the do-nothing baseline. |
| A non-technical summary                  | WAPE and bias, in words | "Off by about 6 percent, running slightly high."    |

My own default block is four numbers: MAE, bias, WAPE and MASE, with the period count and any excluded periods named. It takes one line, it covers the size of the error, its direction, its relative scale and whether the forecast is earning its keep.

The one thing to avoid is picking the measure after seeing the results. If MAPE looks bad and you switch to RMSE without saying so, you have chosen your grade. Decide the measure when you build the forecast, and write it down, for the same reason you decide an A/B test's metric in advance in [A/B testing](https://michaelnocito.github.io/analyst-prep-kit/guides/ab-testing-for-analysts/).

## The full before and after

Same forecast, same five months, two write-ups.

### Before
    
    
    Forecast accuracy: 94%.

One number with no definition. It is presumably 100 minus a MAPE, computed on the four months where MAPE is defined, with April silently dropped by whichever tool produced it. Nobody can reproduce it, nobody knows how many periods it covers, and nothing says whether 94 percent is better than repeating last month's number.

### After
    
    
    Flat plan of 2,400, scored on 5 months (Jan to May 2026).
      MAE      600      average miss, in dollars
      Bias    -422      plan ran above actual on average
      WAPE   30.3%      total miss as a share of total actual
      MASE    0.418     about twice as accurate as repeating last month
      MAPE    undefined April has zero actual revenue
    
      April had no orders at all. Excluding it, MAE is 150 and WAPE 6.1%.
      Both figures are shown because whether April belongs in the forecast
      period is a business question, not a statistical one.

Six lines, and every number is reproducible. The reader can see the size of the error, its direction, its scale, whether the forecast beat doing nothing, and precisely what April did to the arithmetic. The last sentence is the one that matters most, because it hands the judgement back to the person who can actually make it.

## Edge cases that catch people out

Six that each cost somebody a quarter.

**Zeros in the actuals.** The headline case on this page. MAPE is undefined, and several tools will drop the row without telling you, producing a confident number computed on fewer periods than you think.

**Scoring on the data you fitted.** A model tuned on the same months you then score it against will look excellent and will not be. Hold out periods the model never saw, or score forward as new actuals arrive.

**Restated actuals.** If last month's actual changes after a data correction, your recorded accuracy changes too. Store the forecast and the actual as they stood when the forecast was scored, with the date, or your accuracy history will quietly rewrite itself.

**Comparing MAPE across series with different sizes.** A small-volume product will show a terrible MAPE for a tiny absolute miss. That is arithmetic, not performance, and it is why WAPE weighted by size is the fairer comparison.

**Aggregating errors before measuring them.** Forecast accuracy computed on a total is always better than accuracy computed per product and then combined, because errors cancel in the sum. Both numbers are real, and they answer different questions. Say which one you computed.

**One-period-ahead against many.** A forecast scored one month ahead is a different task from one scored twelve months ahead, and comparing them is meaningless. State the horizon with the score, always.

## Why this works

The failures in sections four and five are not folklore. Hyndman and Koehler examined the standard accuracy measures against a set of properties any general-purpose measure ought to have, showed that percentage errors are undefined or infinite whenever an actual is zero and asymmetric otherwise, and that symmetric MAPE does not actually fix the asymmetry it is named for. They proposed the scaled error in section six as a measure that is defined in every case, unitless, and anchored to a naive baseline (Hyndman & Koehler, 2006, _International Journal of Forecasting_ , 22(4), 679–688). Our infinite MAPE is that argument reproduced on five months of real data.

Armstrong and Collopy compared error measures empirically across large collections of series and reached a similar conclusion from the other direction: measures based on relative or scaled errors are more reliable for choosing between methods than percentage errors, particularly on series with low or intermittent values (Armstrong & Collopy, 1992, _International Journal of Forecasting_ , 8(1), 69–80).

The habit of scoring against a naive baseline comes from the forecasting competitions, where it is standard practice and where the results have been consistently humbling. Across thousands of real series, elaborate methods frequently fail to beat simple ones out of sample, which is why "did it beat the naive forecast" is the first question rather than a footnote (Makridakis, Spiliotis, & Assimakopoulos, 2020, _International Journal of Forecasting_ , 36(1), 54–74).

One note on why this page kept asking you to answer before showing you the answer. Attempting an answer before seeing the correct one reliably improves how well the correct one is retained, even when the attempt is wrong (Bisra, Liu, Nesbit, Salimi, & Winne, 2018, _Educational Psychology Review_ , 30(3), 703–725). The infinite MAPE sticks because you were asked to look at the April row and work out what would happen.

## Using this on your own work

Rebuilding your forecasting process is not an afternoon's work. Do this instead, in order.

  1. **Save the forecast.** You cannot score what you did not record. A two-column table of period, forecast, and later the actual, is the whole infrastructure.
  2. **Compute the naive baseline.** Last period repeated. Score it the same way you score yours. This is the two-minute job that tells you whether anything else is worth doing.
  3. **Check for zeros and near-zeros** in the actuals before choosing a percentage measure. If any exist, use WAPE.
  4. **Report four numbers:** MAE, bias, WAPE and MASE, with the period count and the horizon.
  5. **Write down excluded periods and why.** Every exclusion is defensible and none of them is defensible silently.

If you have paper nearby, one optional drawing is worth five minutes. Draw your last few forecast errors as bars along a line, then draw a square on each one with the bar's length as its side. Seeing your worst period's square swallow all the others is what makes the MAE against RMSE choice a decision rather than a default.

**More detail on this, and more like it.** Every how-to sits in one place on the [guides index](https://michaelnocito.github.io/analyst-prep-kit/guides/): SQL, Python, Excel, statistics and the working habits around them.

## The whole thing on one screen

This is the retrieval sheet. Cover the right column, work down the left, and say each answer out loud before you check it.

| Measure           | What it is, and what it does                                                      |
|-------------------|-----------------------------------------------------------------------------------|
| Error             | Actual minus forecast, with its sign. Ours: +230, −155, +185, −2,400, +30.        |
| Bias (mean error) | −422 here. Says which way you lean. Cannot measure accuracy: errors cancel.       |
| MAE               | Average size of a miss. 600. In your units, every period equal.                   |
| RMSE              | Root of the average squared error. 1,083.70. One big miss dominates.              |
| MAE vs RMSE       | Four misses of 100: both 100. One miss of 400: MAE 100, RMSE 200.                 |
| The ratio         | RMSE ÷ MAE = 1.8 here. Far above 1 means one period is doing the damage.          |
| MAPE              | Average of per-period percentage errors. Undefined here: April's actual is zero.  |
| MAPE's other flaw | Asymmetric. Over-forecasting is punished harder, so it pushes forecasts low.      |
| WAPE              | Total absolute error ÷ total actual. 30.3%. Survives zeros, weights by size.      |
| sMAPE             | Divides by the average of actual and forecast. 44.9%. Does not fix zeros.         |
| MASE              | Your MAE ÷ the naive forecast's MAE. 0.418. Below 1 means you beat doing nothing. |
| Naive forecast    | Next period equals this period. The baseline everything must beat.                |
| April removed     | MAE 600 → 150, WAPE 30.3% → 6.1%, bias −422 → +72.5. Say which you published.     |
| Holdout           | Never score on the periods you fitted. Hold out, or score forward.                |
| Horizon           | One month ahead and twelve months ahead are different tasks. State it.            |
| The default block | MAE, bias, WAPE, MASE, period count, exclusions. One line each.                   |

**The one habit to keep.** Score every forecast against the naive baseline before you score it any other way. If it is not beating last period repeated, no accuracy measure will make it worth having. If a score breaks in a way this page does not cover, there is a general [diagnosis loop for being stuck](https://michaelnocito.github.io/analyst-prep-kit/guides/technical-tenacity/).

One last thought, and I would genuinely like other people's answers. The first accuracy number I ever reported was a MAPE with the zero months silently dropped by the tool, and it made a mediocre forecast look excellent for two quarters. What is the accuracy figure in your reporting that nobody has ever recomputed by hand?

## References

  * Hyndman, R. J., & Koehler, A. B. (2006). Another look at measures of forecast accuracy. _International Journal of Forecasting_ , 22(4), 679–688.
  * Armstrong, J. S., & Collopy, F. (1992). Error measures for generalizing about forecasting methods: Empirical comparisons. _International Journal of Forecasting_ , 8(1), 69–80.
  * Makridakis, S., Spiliotis, E., & Assimakopoulos, V. (2020). The M4 Competition: 100,000 time series and 61 forecasting methods. _International Journal of Forecasting_ , 36(1), 54–74.
  * Bisra, K., Liu, Q., Nesbit, J. C., Salimi, F., & Winne, P. H. (2018). Inducing self-explanation: A meta-analysis. _Educational Psychology Review_ , 30(3), 703–725.

---

*The full version of this guide lives on my site: [Forecast Accuracy: MAE, RMSE, MAPE and the Month That Broke One of Them](https://michaelnocito.github.io/analyst-prep-kit/guides/forecast-accuracy/).*

*If it was useful: [Buy Me a Coffee](https://buymeacoffee.com/michaelnocito).*
