By the end of this page you can turn transactions into a monthly series, add period-on-period change and a cumulative total, get a share-of-total column, smooth a noisy line, and run all of it separately for every group. It is about twenty-five minutes, and every number below came out of running the code.

Here is what to do today, on the series you already have. Count its rows against the number of periods in your date range. If your data covers January to May and the series has four rows, a period produced nothing, it never became a row, and every change figure after the gap is comparing the wrong pair.

The short version: `pct_change()` divides each value by the one in the row above; `cumsum()` adds everything up to and including the current row. Both trust the rows you gave them to be the periods you meant.

What happens when the previous period is zero is the idea, so it gets the picture.

> _The original carries a diagram here. In words: Three bar positions stand on a baseline, labelled Mar, Apr and May. The March position holds a tall bar and the May position holds a slightly shorter tall bar. The April position holds no bar at all; there is only a short flat mark sitting on the baseline where a bar would start, drawn in amber to show a value of zero. An arc runs from the top of the March bar down to the April mark, and the figure minus one hundred percent is printed on it, which is a perfectly ordinary answer. A second arc runs from the April mark up to the top of the May bar, and the symbol printed on that one is not a percentage at all but the sideways figure eight that means infinity. The picture shows that a fall to nothing has an answer and a rise from nothing does not._

**Every number on this page is real.** The sixteen-row orders table used across this whole set of guides, run in pandas 3.0.2. It runs from 5 January to 25 May 2026 and contains no April orders at all, which is not staged for this page; it is the same table every other guide uses.

## 1. Get to a series first, and the two ways

Change and cumulative totals both operate on rows in order, so the first job is one row per period. pandas has two ways to do that and they do not agree.
    
    
    o.groupby(o.order_date.dt.to_period("M"))["revenue"].sum()
    
    2026-01    2630
    2026-02    2245
    2026-03    2585
    2026-05    2430
    
    
    o.set_index("order_date")["revenue"].resample("MS").sum()
    
    2026-01-01    2630
    2026-02-01    2245
    2026-03-01    2585
    2026-04-01       0
    2026-05-01    2430

Four rows against five. `groupby` can only produce a row for a value that exists in the data, so a month with no orders produces nothing. `resample` builds a regular calendar across the whole range first and then fills it, so April appears with a zero.

That is the most useful thing on this page and it is worth stating plainly: **resample gives you the calendar for free, and groupby does not.** The same gap has to be repaired by hand in a spreadsheet and by joining to a generated calendar in SQL; here it is a method name.

`resample` needs a datetime index, which is what `set_index("order_date")` is for, and the string is a frequency: `"MS"` for month start, `"ME"` for month end, `"W"` for weekly, `"D"` for daily, `"QS"` for quarter start. Pick month start unless you have a reason, because a label of 2026-04-01 reads as April and a label of 2026-04-30 gets read as May by somebody in a hurry.

## 2. pct_change

One method, and it compares each row with the one above it.
    
    
    s.pct_change()             a proportion: -0.1464
    (s.pct_change() * 100).round(1)   a percentage: -14.6

On the four-row version:
    
    
    2026-01    2630     NaN
    2026-02    2245   -14.6
    2026-03    2585    15.1
    2026-05    2430    -6.0

Check one by hand: 2,245 divided by 2,630 is 0.8536, minus 1 is −0.1464, which is −14.6%. The first row is `NaN` because there is nothing above it, and that is correct: leave it rather than filling it with a zero, because zero would claim flat growth in a period where growth is not defined.

`periods=` changes how far back it looks. `periods=12` on a monthly series is year over year, which is the comparison you want for anything seasonal, and it only means twelve months if every month is a row.

## 3. The empty period, and which method creates it

Before the explanation: look at the four-row table again. May reads −6.0%. Say which two months that compares.

May and March. `pct_change` looks one _row_ back, and the row above May is March, because April never became a row. The figure is a real comparison between two real months, printed in a column labelled month-on-month change.

Now the same calculation on the resampled series, where April exists:
    
    
    2026-01-01   2630     NaN
    2026-02-01   2245   -14.6
    2026-03-01   2585    15.1
    2026-04-01      0  -100.0
    2026-05-01   2430     inf

Five rows, and three of the numbers changed meaning. April is a visible zero and a true −100.0%. May is no longer −6.0%; it is `inf`, which is section four.

The second version looks messier and is the honest one. The first version is tidy because it is missing a row, and tidiness produced by absent data is the most convincing kind of wrong.

Say out loud what you would have concluded from the four-row table. Something like "May was slightly down on April", which is a sentence about a month in which nothing happened at all.

## 4. Dividing by zero gives infinity

April was zero, so May's change is 2,430 divided by 0, and pandas returns `inf` rather than raising.
    
    
    s.pct_change().tolist()
    [nan, -0.1464, 0.1514, -1.0, inf]

That is mathematically the right answer and a terrible thing to leave in a report, because it will format as a blank, an error, or something absurd depending on what reads it next. Growth from nothing has no percentage: any increase from zero is infinite in percentage terms, which is why there is no sensible number to print.

Convert it to a missing value on purpose, so downstream code treats it as unknown rather than as a very large number:
    
    
    import numpy as np
    change = s.pct_change().replace([np.inf, -np.inf], np.nan)
    
    [nan, -0.1464, 0.1514, -1.0, nan]

What not to do is `fillna(0)`, which reports 0% growth for a month that went from nothing to 2,430. That is not a rounding compromise, it is the opposite of what happened.

And whatever you display, put the absolute change beside the percentage. February's −14.6% is also −385; May's rise has no percentage and is plainly +2,430. A count and a rate are read differently, and the pair together is much harder to misread than either alone.

## 5. cumsum, and the check that closes it

`cumsum()` adds each value to everything before it.
    
    
    2026-01-01   2630    2630
    2026-02-01   2245    4875
    2026-03-01   2585    7460
    2026-04-01      0    7460
    2026-05-01   2430    9890

April's row holds the total flat, which is exactly right: nothing happened, so the running total did not move, and the step in the line is visible rather than absent.

The last value is 9,890, which is the total of the whole table. That equality is the check, and it should be an assertion rather than a glance:
    
    
    assert s.cumsum().iloc[-1] == s.sum()

If it fails, either a row was duplicated before the accumulation, usually by a merge, or the series contains a missing value. Both change the last number and neither changes anything visible about the column.

## 6. Share of total

A cumulative total divided by the grand total is the column people actually read, because a percentage of the year is a sentence and 7,460 is a number.
    
    
    (s.cumsum() / s.sum() * 100).round(1)
    
    2026-01-01    26.6
    2026-02-01    49.3
    2026-03-01    75.4
    2026-04-01    75.4
    2026-05-01   100.0

Three quarters of the year's revenue was in by the end of March. And the last value is 100.0, which is the same check as section five wearing a different hat: if the final share is not exactly one hundred, something does not add up.

The same shape gives a plain share rather than a cumulative one, `s / s.sum()`, and both are worth having: one says how big each month was, the other says how much of the year had happened by then.

## 7. rolling and expanding

Two windows, and the difference is whether the start moves.
    
    
    s.rolling(3).mean().round(2)      s.expanding().sum()
    
    2026-01-01       NaN                    2630
    2026-02-01       NaN                    4875
    2026-03-01   2486.67                    7460
    2026-04-01   1610.00                    7460
    2026-05-01   1671.67                    9890

`rolling(3)` is a window of fixed width that slides: each value is the average of that row and the two before it. `expanding()` starts at the beginning and grows, so `expanding().sum()` is exactly `cumsum()` and the two columns above match.

Check one rolling value: the three months ending March are 2,630, 2,245 and 2,585, which average to 2,486.67. The first two rows are `NaN` because there are not three values yet, and that is the right default: `min_periods=1` would fill them with averages of one and two values, which look like three-month averages and are not.

Smoothing is for reading a direction out of a noisy line, and the honest version does it symmetrically or not at all. A trailing average always lags the thing it is smoothing, so a turning point appears later than it happened; use `center=True` when you are describing the past and a trailing window when you are pretending not to know the future.

## 8. Cumulative per group

Everything above works per group with one extra call, and the ordering matters more than usual because the accumulation follows row order.
    
    
    c = o.sort_values("order_date")
    c["running"] = c.groupby("region")["revenue"].cumsum()
    
    last row of each region:
    East    2026-05-04    600    3040
    North   2026-05-11    510    2495
    South   2026-05-18    880    2670
    West    2026-05-25    440    1685

Each region accumulates separately and ends at its own total, and those four totals add to 9,890, so every row is accounted for exactly once.

The `sort_values` in front is not optional. `groupby(...).cumsum()` accumulates in whatever order the rows are in, so an unsorted frame produces a running total that is arithmetically correct and chronologically meaningless. Sort first, every time, and by a column that breaks ties, so the result is the same on every run.

`pct_change` works the same way, `groupby(...)["revenue"].pct_change()`, and it correctly returns `NaN` for the first row of each group rather than carrying across from the previous group.

Picture your own most-used series for a moment. Is it built with `groupby` or with `resample`, and do you know whether any of its periods are missing?

## The full before and after

Same sixteen orders, same question: how is revenue moving?

### Before
    
    
    s = o.groupby(o.order_date.dt.to_period("M"))["revenue"].sum()
    s.pct_change()
    
    2026-01    2630     NaN
    2026-02    2245   -14.6
    2026-03    2585    15.1
    2026-05    2430    -6.0

Four clean rows and no errors, saying that May fell 6% on the month before it. The month before it had no sales at all and is not on the page.

### After
    
    
    s = o.set_index("order_date")["revenue"].resample("MS").sum()
    
    out = s.to_frame("revenue")
    out["change"]  = s.diff()                                        # absolute, always readable
    out["pct"]     = (s.pct_change().replace([np.inf,-np.inf], np.nan) * 100).round(1)
    out["cumsum"]  = s.cumsum()
    out["share"]   = (s.cumsum() / s.sum() * 100).round(1)
    out["ma3"]     = s.rolling(3).mean().round(2)
    
    assert s.cumsum().iloc[-1] == s.sum()          # 9890
    assert out["share"].iloc[-1] == 100.0
    
               revenue  change    pct  cumsum  share    ma3
    2026-01-01    2630     NaN    NaN    2630   26.6    NaN
    2026-02-01    2245  -385.0  -14.6    4875   49.3    NaN
    2026-03-01    2585   340.0   15.1    7460   75.4 2486.67
    2026-04-01       0 -2585.0 -100.0    7460   75.4 1610.00
    2026-05-01    2430  2430.0    NaN    9890  100.0 1671.67

The claim, and it is why the first decision on the page is a method name: **the same sixteen orders give four rows and a tidy −6.0% or five rows, a −100% and an undefined change, and the only difference is whether you asked pandas for a calendar.**

## Edge cases worth knowing

Six that come up.

**An unsorted series.** Both methods use row order, so a frame that is not in date order produces a change column and a running total that are arithmetically correct and describe nothing. Sort before, always.

**Missing values.** A `NaN` in the middle of a series propagates: `cumsum` marks that position `NaN` and carries on with the rest, and `pct_change` returns `NaN` for two rows rather than one, because both the value and its neighbour are involved. Decide whether the gap is a zero or an unknown before accumulating.

**Negative values.** If a period can be negative, a refund month, `pct_change` gives answers that are arithmetically right and communicate the opposite of what happened. Report the absolute change there and drop the percentage.

**A partial current period.** The last row of a resampled series is nearly always incomplete, so it always looks like a collapse. Exclude it or label it.

**Resample on a non-datetime index.** It raises, which is the good outcome; if your dates are strings, this is where you find out, and [the read_csv guide](https://michaelnocito.github.io/analyst-prep-kit/guides/pandas-read-csv/) is where you fix it.

**`diff` against `pct_change`.** They answer different questions and their names encourage the wrong choice. `diff` is the absolute change and is always defined; `pct_change` is the relative change and is undefined on a zero base. Publish both.

## Why this works

The whole page turns on the difference between a series indexed by the values that happened to occur and a series indexed by every period in the range. `groupby` produces the first, because grouping can only create a group where a row exists. `resample` produces the second, because it constructs the index from the range and the frequency before it looks at the data. Everything that follows, the misleading −6.0%, the honest −100%, the infinity, the flat step in the cumulative line, is downstream of which of those two index you chose, and neither method warns you that a choice was made.

Reporting the count beside the rate is not fussiness either. People reason more accurately about frequencies than about the ratios computed from them, and presenting the underlying numbers alongside a percentage reliably improves how well the percentage is understood (Gigerenzer & Hoffrage, 1995, _Psychological Review_ , 102(4), 684–704). That is the argument for the `diff` column sitting next to the `pct` column: −385 and −14.6% together cannot be misread the way −14.6% alone can, and on the row where the percentage is undefined the absolute change is still perfectly informative at +2,430.

The smoothing in section seven is the crude member of a family with a lot of thought behind it. Local fitting methods estimate the value at each point from its neighbours with weights that fall off with distance, precisely because a plain trailing average treats every point in the window equally and lags the series it is describing (Cleveland & Devlin, 1988, _Journal of the American Statistical Association_ , 83(403), 596–610). A three-month rolling mean is fine for reading a direction and is not a model, and the distinction matters as soon as somebody extends the line to the right.

One note on the cheat sheet below. It is built to be covered and recalled rather than reread, because testing yourself beats restudying across a very large body of experiments, with the advantage largest at the delays that matter (Rowland, 2014, _Psychological Bulletin_ , 140(6), 1432–1463).

## Using this on your own project

Rewriting every time series is unnecessary. Do this instead, in order.

  1. **Count the rows against the periods.** One comparison, and it finds the entire class of missing-period bug.
  2. **Switch`groupby` to `resample`** anywhere the period could be empty, which is anywhere real.
  3. **Sort explicitly** before any change or cumulative column, and by something that breaks ties.
  4. **Replace infinities with missing values** , never with zero.
  5. **Put`diff` next to `pct_change`**, so there is always a number that is defined.
  6. **Assert the two closes** : the last cumulative value equals the total, and the last share is 100.

If you have paper nearby, one optional sketch is worth five minutes. Draw a row of boxes, one per period in your reporting range, and fill in the ones you know have data. The empty boxes are the rows `groupby` will not give you, and drawing them takes about a minute per year.

**More detail on this, and more like it.** Every how-to sits in one place on the [guides index](https://michaelnocito.github.io/analyst-prep-kit/guides/). The same arithmetic and the same trap in a spreadsheet is [month-over-month in Excel](https://michaelnocito.github.io/analyst-prep-kit/guides/excel-month-over-month/), and in a database it is [the running total in SQL](https://michaelnocito.github.io/analyst-prep-kit/guides/sql-running-total/).

## The whole thing on one screen

This is the retrieval sheet. Cover the right column, work down the left, and say each answer out loud before you check it.

| Thing                     | What it does                                                    |
|---------------------------|-----------------------------------------------------------------|
| Step one                  | One row per period. Change and cumulation both need order.      |
| `groupby(to_period("M"))` | Only periods that exist in the data. Four rows here.            |
| `resample("MS")`          | Builds the calendar first. Five rows, April at zero.            |
| Frequency strings         | `D`, `W`, `MS`, `ME`, `QS`. Prefer month start for labels.      |
| `pct_change()`            | Each row against the one above. A proportion, not a percentage. |
| First row                 | `NaN`. Leave it; zero would claim flat growth.                  |
| `periods=12`              | Year over year, only if every month is a row.                   |
| A missing period          | Makes pct_change compare two periods apart, silently.           |
| Zero base                 | Returns `inf`, not an error. Replace with `NaN`.                |
| Never                     | `fillna(0)` on a change column.                                 |
| `diff()`                  | Absolute change. Always defined. Publish it too.                |
| `cumsum()`                | Running total. Flat on a zero period, which is correct.         |
| The check                 | Last cumulative equals the total. Assert it.                    |
| Share of total            | `cumsum() / sum()`. Last value must be 100.0.                   |
| `rolling(3).mean()`       | Fixed window that slides. First rows are `NaN`.                 |
| `expanding().sum()`       | Window that grows. Identical to cumsum.                         |
| Per group                 | `groupby(col)["x"].cumsum()`. Sort first, every time.           |

**The one habit to keep.** Use `resample` rather than `groupby` for anything periodic. It is the one line on this page that makes a missing month visible instead of absent, and every other problem here is a consequence of a row that was never created. If a series misbehaves in a way this page does not cover, there is a general [diagnosis loop for being stuck](https://michaelnocito.github.io/analyst-prep-kit/guides/technical-tenacity/).

One last thought, and I would genuinely like other people's answers. Mine was a weekly series built with a groupby, where a shutdown week simply was not a row, so a recovery was reported as a decline for a month and the chart bent the wrong way with every number on it individually correct. What has a missing period done to a trend you published?

## References

  * Gigerenzer, G., & Hoffrage, U. (1995). How to improve Bayesian reasoning without instruction: Frequency formats. _Psychological Review_ , 102(4), 684–704.
  * Cleveland, W. S., & Devlin, S. J. (1988). Locally weighted regression: An approach to regression analysis by local fitting. _Journal of the American Statistical Association_ , 83(403), 596–610.
  * Rowland, C. A. (2014). The effect of testing versus restudy on retention: A meta-analytic review of the testing effect. _Psychological Bulletin_ , 140(6), 1432–1463.

---

*The full version of this guide lives on my site: [pandas pct_change and cumsum: Percent Change and Running Totals](https://michaelnocito.github.io/analyst-prep-kit/guides/pandas-pct-change-cumsum/).*

*If it was useful: [Buy Me a Coffee](https://buymeacoffee.com/michaelnocito).*
