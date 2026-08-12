By the end of this page you can count what is missing and where, choose between dropping rows, filling them and leaving them alone, say out loud what each of those claims about the data, and recognise the missing value that is not stored as missing at all. It is about twenty-five minutes, and every number below came out of running the code.

Here is what to do today, before deciding anything. Run `df.isna().sum()` and write the numbers down. Then run `len(df.dropna())` and compare it with `len(df)`. Those two lines tell you how much is missing and what the laziest fix would cost, and most people reach for the fix without ever knowing either number.

The short version: pandas will happily skip missing values in a summary, drop the rows that contain them, or replace them with something you choose. All three are decisions, and only one of them is honest by default.

What filling with the mean does to the spread is the idea, so it gets the picture.

> _The original carries a diagram here. In words: A horizontal value axis runs across the picture with a tall dashed vertical line standing at the average. Fourteen small solid blue dots are scattered along the axis at their own positions, some well to the left of the dashed line and some well to the right, so the real measurements are spread out. Above the axis sit two hollow circles drawn with dashed outlines, standing for the two values that were never recorded. A short arrow drops from each hollow circle straight down onto the dashed average line, where two solid amber dots now sit, one on top of the other, exactly on the line. Every other dot is somewhere of its own; these two are on the average and nowhere else, so the picture shows that the filled points contribute no spread at all._

**Every number on this page is real.** The sixteen-row orders table used across this whole set of guides, with seven cells removed on purpose, run in pandas 3.0.2. Sixteen rows is small enough to check any of it by hand.

## 1. Find them first, and count them

One line, and it is the only place the whole picture appears.
    
    
    df.isna().sum()
    
    order_id      0
    order_date    0
    rep           0
    region        1
    product       0
    units         2
    unit_price    1
    revenue       3
    
    128 cells in the frame, 7 of them missing

Seven cells out of a hundred and twenty-eight. Notice that `revenue` has three missing where `units` has two and `unit_price` has one: revenue is computed from both, so a hole in either produces a hole in the result. **Missingness spreads through arithmetic** , and a derived column is missing wherever any of its inputs is.

Two more lines are worth running at the same time. `df.isna().mean()` gives the proportion rather than the count, which is what you will quote. And `df.isna().sum(axis=1)` gives the count per row, which tells you whether the holes are concentrated in a few bad rows or scattered across many, and those two situations call for different treatment.

## 2. dropna, and what it takes with it

Before the explanation: seven cells are missing out of sixteen rows. Say how many rows survive `dropna()`.
    
    
    len(df)                          16
    len(df.dropna())                 12
    len(df.dropna(subset=["units"])) 14
    len(df.dropna(how="all"))        16
    df.dropna(axis=1).shape[1]        4 of 8 columns

Plain `dropna()` removed four rows, a quarter of the table, to deal with seven cells. Its default is `how="any"`: a row goes if _any_ column in it is missing, including columns you were not going to use. That is the most common way to throw away data by accident.

The three arguments that make it deliberate:

| Call                       | Drops a row when                  | Use when                                      |
|----------------------------|-----------------------------------|-----------------------------------------------|
| `dropna()`                 | Any column is missing             | Rarely. You are about to use every column.    |
| `dropna(subset=["units"])` | The columns you name are missing  | Usually. Drop on what the analysis needs.     |
| `dropna(how="all")`        | Every column is missing           | Clearing genuinely empty rows from an import. |
| `dropna(thresh=8)`         | Fewer than 8 columns have a value | Removing rows too sparse to be useful.        |

And `axis=1` drops columns rather than rows, which on this frame leaves four of the eight standing. It is occasionally right for a wide import full of empty fields, and it is a very fast way to lose the column your analysis was about, so name the columns instead when you can.

Whichever you use, print the row count before and after. Losing a quarter of the table is a finding; losing it without noticing is the problem.

## 3. The summaries already skip them

Before you decide to fill or drop anything, know what pandas already does, because for a lot of work the answer is that you do not have to do either.
    
    
    units, with two values missing
      count 14   sum 74.0   mean 5.2857   std 2.5246
    
    the same column with nothing missing
      count 16   sum 101    mean 6.3125   std 3.7008

Every summary skipped the missing values rather than erroring or returning nothing. `sum` added the fourteen it had. `mean` divided by fourteen, not sixteen. And `count` reports fourteen, which is the point: **`count` tells you how many values a summary was computed from, and comparing it with the row count is the cheapest missing-data check there is.**

That behaviour is helpful and it is also the quiet part. A mean over a column that is one-eighth missing is a statement about the seven-eighths that answered, and it will be presented as a statement about everybody unless somebody says otherwise. Here the honest sentence is that average units are 5.29 _among the fourteen orders where we know the quantity_.

The knock-on for derived columns is worth seeing too. Revenue needed both units and price, so it exists on thirteen of the sixteen rows, and its total is 8,150 against a true 9,890. That 1,740 gap is not an error in the arithmetic; it is three rows that could not be computed.

## 4. Filling with zero

`fillna(0)` is the reflex, and it is a specific claim: that the missing quantity was none.
    
    
    leave as NaN   count 14   sum 74.0   mean 5.2857   std 2.5246
    fillna(0)      count 16   sum 74.0   mean 4.6250   std 2.9637

The sum did not move, because adding zero adds nothing. The mean fell from 5.29 to 4.63, because the denominator went from fourteen to sixteen. And the spread went _up_ , from 2.52 to 2.96, because two values were placed at the bottom of the range.

So the rule is narrow: **fill with zero only when zero is what happened.** No sales that month, no returns that day, no clicks on that link. Those are real measurements that happen to be zero, and a database that stores them as missing is the thing that is wrong.

When the value is unknown rather than none, a zero is a false measurement that will be averaged, charted and summed exactly like a real one. This is the same trade as [hiding an error behind a zero in a spreadsheet](https://michaelnocito.github.io/analyst-prep-kit/guides/excel-iferror/), and it goes wrong for the same reason.

## 5. Filling with the mean

Before the explanation: filling the two holes with the column's own mean cannot change the mean. Say what it does change.
    
    
    leave as NaN     count 14   mean 5.2857   std 2.5246
    fillna(mean)     count 16   mean 5.2857   std 2.3503

The mean is identical, to four decimal places, which is exactly why the method feels safe. The standard deviation fell from 2.52 to 2.35, and it had to: two values were placed precisely at the average, so they contribute nothing to the spread while still counting toward the divisor.

That is the picture at the top of the page. The filled points are not measurements, they are the average repeated, and the data now looks more consistent than it was ever observed to be. Anything downstream that reads the spread, an error bar, a confidence interval, a control limit, a correlation, is now reading a number that is too small, and nothing indicates it.

Mean filling has a place: a single missing value in a large, well-behaved column, where you need a complete column for a tool that will not accept holes, and where nobody will use the spread. Outside that, prefer to leave the hole, or to fill from something that actually knows: the same customer's other orders, the same product's usual quantity, the group median rather than the overall mean.

Say out loud which of your reports would change if the spread of one column were understated by seven percent. If none of them would, mean filling costs you nothing. If one of them is a control chart, it costs you the chart.

## 6. Forward fill, and the value it invents

`ffill` carries the previous value forward. On a genuine time series of something that persists, a price, a status, a meter reading, that is often exactly right: the value did not change, it simply was not re-recorded.

On anything else it invents data. Sorted by date, with one region missing:
    
    
    order_date   region   region_ffill
    2026-05-04   East     East
    2026-05-11   NaN      East      <- the real answer was North
    2026-05-18   South    South
    2026-05-25   West     West

The filled value is confidently wrong. Nothing about the previous row's region tells you anything about this one, because region is a property of the order rather than a state that persists between orders.

Two guards make it safer where it does apply. `limit=1` stops a single known value being carried across a long gap, which is what turns one missing reading into a week of flat line. And sorting explicitly before filling is not optional: `ffill` uses row order, so a frame that is not in time order fills from whatever happened to be above.

`bfill` is the same thing backwards and carries a stronger warning: it fills a value from the future, which in anything you will model or forecast is leakage.

## 7. The missing value that is not stored as missing

Before the explanation: a source system writes `-1` where the quantity is unknown. Say what `isna()` reports.

Zero. It is a number, so nothing is missing as far as pandas is concerned.
    
    
    with -1 as the marker   mean 4.5000   count 16   min -1
    stored as missing       mean 5.2857   count 14

The mean is wrong by nearly one whole unit, the count says every row has a value, and the only visible clue is that the minimum is negative. Change the marker to `0` or `999` and even that clue disappears.

This is the worst case on the page precisely because none of the tools on the page apply: `isna` finds nothing, `dropna` drops nothing, and `fillna` has nothing to fill. The only defence is to look, once, at the values themselves.
    
    
    df["units"].min(), df["units"].max()      absurd extremes
    df["units"].value_counts().head()         one value appearing far too often
    df.describe()                             a min or max that cannot be real

The habit that catches it: on any new numeric column, look at the minimum and the maximum, and ask whether both are possible. A quantity of −1, an age of 999, a date of 1900-01-01 and a price of 0.01 are all the same thing, and all of them are best converted to a real missing value at load time with `na_values`, which is [the read_csv argument for exactly this](https://michaelnocito.github.io/analyst-prep-kit/guides/pandas-read-csv/).

## 8. groupby quietly drops the missing key

One row has no region. Grouping by region:
    
    
    East   4
    North  4
    South  4
    West   3
            rows accounted for: 15 of 16

Fifteen of sixteen. The row with no region is not a group, it is not an empty group, it is simply gone from the result, and no warning is printed. On a real table that can be a fifth of your revenue absent from every regional report with every printed number individually correct.
    
    
    df.groupby("region", dropna=False)
    
    East   4
    North  4
    South  4
    West   3
    NaN    1
            rows accounted for: 16 of 16

One argument, and the missing group appears. Run it that way once for every key you group by, read the `NaN` row, and then decide what to do about it rather than letting the default decide. That is the same habit and the same argument as in [the groupby guide](https://michaelnocito.github.io/analyst-prep-kit/guides/pandas-groupby/), and the check is arithmetic: group sizes must add back to the row count you started with.

## The full before and after

Same sixteen orders, same question: what is the average order quantity?

### Before
    
    
    df["units"] = df["units"].fillna(0)
    df.groupby("region")["units"].mean()
    
    mean units 4.63, spread 2.96, sixteen values, no missing data anywhere

A complete-looking column, a mean that is 0.66 too low, a spread that is too high, one region silently missing from the grouping, and nothing on the page recording that anything was ever absent.

### After
    
    
    # 1. count first
    df.isna().sum()                      units 2, unit_price 1, region 1
    len(df), len(df.dropna())            16, 12
    
    # 2. leave the holes, and say what the summary is over
    df["units"].count()                  14 of 16
    df["units"].mean()                   5.2857
    
    # 3. group without losing the missing key
    df.groupby("region", dropna=False)["units"].count().sum()    16 of 16
    
    # 4. the sentence that goes with the number
    "Average order quantity is 5.29 units, over the 14 of 16 orders
     where the quantity was recorded. Two orders have no quantity."

The claim, and it is why the choice deserves a paragraph rather than a reflex: **the same two missing quantities give an average of 5.29, 4.63 or 5.29-with-less-spread depending on which one-line fix you reach for, and only one of the three tells the reader that anything was missing at all.**

## Edge cases worth knowing

Six that come up.

**NaN is not equal to itself.** `np.nan == np.nan` is `False`, so `df[df["region"] == np.nan]` returns nothing while `df["region"].isna().sum()` returns one. Always use `isna` and `notna`, never an equality test.

**An integer column becomes a float.** Whole numbers plus a missing value cannot all be integers, so pandas widens the column and your quantities become 4.0 and 10.0. That is a signal rather than a fault, and the nullable integer type `"Int64"`, with a capital I, keeps them whole if it matters.

**Missing text is not an empty string.** `NaN` and `""` behave differently: one is skipped by counts and the other is counted. A column cleaned by filling text holes with `""` will report more values than it has.

**Filling in place, invisibly.** A `fillna` early in a notebook affects everything after it, including cells you wrote before. Fill into a new column while exploring, so the original is still there to compare against.

**Missing values in a merge key.** They match each other, which multiplies rows. Remove or fill them before joining, not after.

**Why it is missing matters.** A quantity missing at random is a different problem from a quantity missing because the order was cancelled. The second one is information, and dropping those rows deletes a pattern rather than a nuisance.

## Why this works

The reason there is no default right answer is that the correct treatment depends on _why_ a value is absent, and that is not something the data can tell you. The standard framing distinguishes values missing completely at random from values whose absence is related to something else, and the point of the distinction is practical: analysing only the complete cases is safe in the first situation and biased in the second, and you cannot tell which you are in from the file alone (Rubin, 1976, _Biometrika_ , 63(3), 581–592). A quantity missing because the field was skipped is one thing; a quantity missing because those orders were cancelled is another, and `dropna()` treats them identically.

The specific harm in section five is well documented rather than a matter of taste. Replacing missing values with the mean of the observed ones is criticised precisely because it preserves the mean while artificially reducing variability, so standard deviations, standard errors and any interval built from them come out too small, and the analysis looks more precise than the data supports (Schafer & Graham, 2002, _Psychological Methods_ , 7(2), 147–177). The drop from 2.52 to 2.35 on two values in sixteen is the small version of that; on a column that is a fifth missing it is not small.

One note on the cheat sheet below. It is built to be covered and recalled rather than reread, because reviews of study techniques put practice testing and spacing near the top of what works and rereading and highlighting near the bottom, despite rereading feeling much more productive (Dunlosky, Rawson, Marsh, Nathan, & Willingham, 2013, _Psychological Science in the Public Interest_ , 14(1), 4–58).

## Using this on your own project

There is no cleanup to do in bulk here, only a decision to make properly once per column. Do this, in order.

  1. **Count before you decide.** `isna().sum()`, and `isna().mean()` for the proportion you will quote.
  2. **Check for sentinels.** Look at the min and max of every numeric column and ask whether both are possible.
  3. **Ask why each column is missing** , once, of whoever owns the data. That answer decides everything that follows.
  4. **Prefer leaving the hole** and reporting the count it was computed over. It is the only option that is honest by default.
  5. **Drop on the subset you actually use** , never with a bare `dropna()`, and print the row count either side.
  6. **Group with`dropna=False`** at least once per key, and check the group sizes add back to the row count.

If you have paper nearby, one optional sketch is worth five minutes. Draw a column of your data as a strip of boxes, cross out the ones that are missing, and write beside each cross what you think the real value would have been and how you know. The ones where you can write something are candidates for filling. The ones where you cannot are the ones to leave alone and report.

**More detail on this, and more like it.** Every how-to sits in one place on the [guides index](https://michaelnocito.github.io/analyst-prep-kit/guides/). The same problem in a database, where a missing value has its own logic, is [NULL in SQL](https://michaelnocito.github.io/analyst-prep-kit/guides/sql-null/).

## The whole thing on one screen

This is the retrieval sheet. Cover the right column, work down the left, and say each answer out loud before you check it.

| Thing                  | What it does                                                    |
|------------------------|-----------------------------------------------------------------|
| Find them              | `df.isna().sum()`, and `.mean()` for the proportion.            |
| Per row                | `df.isna().sum(axis=1)`. Concentrated or scattered?             |
| Derived columns        | Missing wherever any input is. Holes spread through arithmetic. |
| `dropna()`             | Drops a row if _any_ column is missing. Took 16 rows to 12.     |
| `dropna(subset=[...])` | Only on the columns you name. Usually what you meant.           |
| `dropna(axis=1)`       | Drops columns. Left 4 of 8 here.                                |
| Summaries              | Skip missing values by default. No error, no warning.           |
| `count()`              | How many values the summary used. Compare with the row count.   |
| `fillna(0)`            | Claims the value was none. Mean fell 5.29 to 4.63.              |
| When zero is right     | No sales, no returns, no clicks. A real measurement of nothing. |
| `fillna(mean)`         | Mean unchanged, spread shrank 2.52 to 2.35.                     |
| Why that matters       | Filled points sit on the average and add no variation.          |
| `ffill`                | Carries the previous value. Right for states, wrong for events. |
| `ffill(limit=1)`       | Stops one value being carried across a long gap.                |
| `bfill`                | Fills from the future. Leakage in anything you model.           |
| Sentinels              | -1, 999, 1900-01-01. `isna` finds nothing. Check min and max.   |
| `NaN == NaN`           | False. Use `isna`, never an equality test.                      |
| `groupby`              | Drops the missing key silently. Use `dropna=False`.             |

**The one habit to keep.** Report the count a summary was computed over, beside the summary. "Average 5.29 over 14 of 16 orders" is a sentence nobody can misread; "average 5.29" is the same number with the important part removed, and every option on this page except leaving the hole alone makes that removal permanent. If missing data behaves in a way this page does not cover, there is a general [diagnosis loop for being stuck](https://michaelnocito.github.io/analyst-prep-kit/guides/technical-tenacity/).

One last thought, and I would genuinely like other people's answers. Mine was a survey export where unanswered numeric questions came through as zero, so satisfaction scores looked catastrophic for one region and the real story was that a form had been broken for a fortnight. What has a missing value pretended to be in your data?

## References

  * Rubin, D. B. (1976). Inference and missing data. _Biometrika_ , 63(3), 581–592.
  * Schafer, J. L., & Graham, J. W. (2002). Missing data: Our view of the state of the art. _Psychological Methods_ , 7(2), 147–177.
  * Dunlosky, J., Rawson, K. A., Marsh, E. J., Nathan, M. J., & Willingham, D. T. (2013). Improving students' learning with effective learning techniques. _Psychological Science in the Public Interest_ , 14(1), 4–58.

---

*Originally published on Analyst Prep Kit: [Handling Missing Values in pandas: dropna, fillna and What Each One Claims](https://michaelnocito.github.io/analyst-prep-kit/guides/pandas-fillna-dropna/)*

*Visit the site for more beginner data analysis guides and free resources: [the full guide archive](https://michaelnocito.github.io/analyst-prep-kit/guides/) covers SQL, Excel, Power BI, Tableau, Python and statistics, and the [practice kits](https://michaelnocito.github.io/analyst-prep-kit/) run in your browser with nothing to install.*

*If it was useful: [Buy Me a Coffee](https://buymeacoffee.com/michaelnocito).*
