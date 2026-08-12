By the end of this page you can take a DataFrame, summarize it by any column or combination of columns, get several statistics at once with sensible names, and account for every row that went in, including the ones pandas would otherwise drop without telling you. It is about twenty-five minutes, and every output shown was produced by actually running the code on the table printed below.

Here is what to actually do today. In your next `groupby`, add a row count beside whatever statistic you are computing, using `size`, and run it once with `dropna=False`. Those two additions surface the two most common silent problems in grouped results: averages built on almost nothing, and rows that vanished because their key was missing.

The short version: `groupby` splits the table into one mini-table per key value, applies your function to each, and combines the answers into a new table with one row per group. `count` skips missing values, `size` does not, and rows with a missing key are dropped entirely unless you ask otherwise.

The split-apply-combine shape is the one idea everything else on this page hangs from, so it gets the picture.

> _The original carries a diagram here. In words: A left-to-right pipeline in three stages. On the left, one table of seven stacked rows, where three rows share one shading, two rows share a second shading, one row has a third shading, and one row at the bottom is drawn hollow with a dashed border, meaning its key is missing. Arrows split the table into three separate mini-tables in the middle, one per shading: a three-row table, a two-row table, and a one-row table. The hollow dashed row's arrow stops at a dashed cross, showing it was dropped rather than assigned to any group. From each mini-table an arrow passes through a small function box and collapses it into a single summary row. On the right the three summary rows stack into one small result table with one row per group. The dropped dashed row never reaches the result._

**Every output on this page is real.** One 14-row sales table, printed in full below, and every result was produced by running the code with pandas. If you already group in SQL, this page is the pandas half of a pair: [GROUP BY and HAVING](https://michaelnocito.github.io/analyst-prep-kit/guides/sql-group-by-having/) is the same idea in its original home, and I will point at the twin moves as they come up.

Here is the whole dataset. Fourteen orders, a region, a category, and an amount. Two things are deliberately imperfect, because real data always is: order 1008 has a missing amount, and orders 1013 and 1014 have a missing region.
    
    
    import pandas as pd
    import numpy as np
    
    df = pd.DataFrame({
        'order_id': [1001,1002,1003,1004,1005,1006,1007,1008,1009,1010,1011,1012,1013,1014],
        'region':   ['East','East','East','East','East','West','West','West','West',
                     'South','South','South',np.nan,np.nan],
        'category': ['Chairs','Chairs','Desks','Desks','Lamps','Chairs','Desks','Desks','Lamps',
                     'Chairs','Chairs','Lamps','Desks','Lamps'],
        'amount':   [120.0, 80.0, 300.0, 250.0, 40.0, 100.0, 400.0, np.nan, 60.0,
                     90.0, 110.0, 50.0, 260.0, 45.0],
    })

| order_id | region | category | amount |
|----------|--------|----------|--------|
| 1001     | East   | Chairs   | 120    |
| 1002     | East   | Chairs   | 80     |
| 1003     | East   | Desks    | 300    |
| 1004     | East   | Desks    | 250    |
| 1005     | East   | Lamps    | 40     |
| 1006     | West   | Chairs   | 100    |
| 1007     | West   | Desks    | 400    |
| 1008     | West   | Desks    | NaN    |
| 1009     | West   | Lamps    | 60     |
| 1010     | South  | Chairs   | 90     |
| 1011     | South  | Chairs   | 110    |
| 1012     | South  | Lamps    | 50     |
| 1013     | NaN    | Desks    | 260    |
| 1014     | NaN    | Lamps    | 45     |

## 1. What groupby actually does: split, apply, combine

Before the explanation: the table has 14 rows. You group by region and get 3 rows back. In your own head, where are the other 11 rows, and what does one row of the result now mean?

The name for the mechanism is **split-apply-combine**. _Split_ : pandas sorts the rows into one mini-table per distinct key value, every East row together, every West row together, every South row together. _Apply_ : it runs your function, say a mean, on each mini-table separately. _Combine_ : it stacks the answers into a new table with one row per group. Nothing is averaged across groups by accident, because each function call only ever saw one group's rows.

The part worth saying out loud is what one row means afterwards. Before grouping, one row was one order. After grouping by region, one row is one region. That change of meaning is called the **grain** of the table, and it is exactly the discipline SQL forces with `GROUP BY`: once the grain is one-row-per-region, an individual order's amount no longer exists in the result, and any column you want to see must be a group key or a summary. pandas will not error the way SQL does if you confuse grains; it will just hand you something you did not mean. Naming the new grain before you type is the cheap defence.

## 2. The basic move: one column, one statistic

The workhorse line reads almost like the sentence you would say: group by region, take the amount column, take the mean.
    
    
    df.groupby('region')['amount'].mean()
    
    
    region
    East     158.000000
    South     83.333333
    West     186.666667
    Name: amount, dtype: float64

Check East by hand: (120 + 80 + 300 + 250 + 40) ÷ 5 = 790 ÷ 5 = 158. South: (90 + 110 + 50) ÷ 3 = 250 ÷ 3 = 83.33. West has four rows but one amount is missing, and `mean` skips missing values: (100 + 400 + 60) ÷ 3 = 560 ÷ 3 = 186.67. Divided by three, not four. Keep that skip in mind; it becomes a whole section shortly.

Two smaller things before moving on. Swap `mean` for `sum`, `median`, `min`, `max`, or `std` and the shape is identical. And the result here is a Series whose index is the group key, which is fine for a quick look and awkward for anything downstream; section five shows the flat-table version.

## 3. Several statistics at once: agg and named aggregation

A single mean is rarely the deliverable. `agg` takes a list of functions and computes them per group in one pass.
    
    
    df.groupby('region')['amount'].agg(['mean', 'sum', 'size', 'count'])
    
    
                  mean    sum  size  count
    region
    East    158.000000  790.0     5      5
    South    83.333333  250.0     3      3
    West    186.666667  560.0     4      3

The version I actually ship is **named aggregation** , where you name each output column yourself and say which input column and which function feed it. The pattern is `new_name=('column', 'function')`.
    
    
    df.groupby('region').agg(
        avg_amount=('amount', 'mean'),
        orders=('amount', 'size'),
    )
    
    
            avg_amount  orders
    region
    East    158.000000       5
    South    83.333333       3
    West    186.666667       4

The named form costs a few more characters and pays twice. The output columns are called `avg_amount` and `orders` instead of `mean` and `size`, so the result is readable without the code beside it. And each statistic states its input column explicitly, so adding a second value column to the table later cannot silently change what gets aggregated.

## 4. size against count, and which one answers your question

Before the explanation: in the table two sections back, West shows size 4 and count 3. Both claim to be counting. Decide what each one counted before reading the answer.

`size` counts rows in the group, missing or not. West has four order rows, so size says 4. `count` counts non-missing values in the chosen column. West's four rows include order 1008 with a missing amount, so count says 3. One missing value is the entire gap between the two answers.

This is exactly SQL's split between `COUNT(*)` and `COUNT(col)`: `size` is `COUNT(*)`, rows in the bucket, and `count` is `COUNT(col)`, values present in one column. Neither is the correct one in general; they answer different questions. "How many orders did West place?" is a size question: 4. "How many West orders have an amount I can add up?" is a count question: 3. The mistake is not picking the wrong function so much as not noticing they can differ, because on clean columns they agree and the habit forms that they always will.

Say in one sentence why West's mean divided by 3 and not 4, before reading on. It is the same fact wearing a different hat: aggregations skip missing values, so the mean's denominator is count, not size. A mean over a column that is one-quarter missing is a statement about the three-quarters that answered.

## 5. Two grouping columns, the MultiIndex, and getting a flat table back

Pass a list of columns and the grain gets finer: one row per region per category.
    
    
    df.groupby(['region', 'category'])['amount'].mean()
    
    
    region  category
    East    Chairs      100.0
            Desks       275.0
            Lamps        40.0
    South   Chairs      100.0
            Lamps        50.0
    West    Chairs      100.0
            Desks       400.0
            Lamps        60.0
    Name: amount, dtype: float64

East Chairs by hand: (120 + 80) ÷ 2 = 100. East Desks: (300 + 250) ÷ 2 = 275. The staircase layout on the left is a **MultiIndex** : the group keys have become a two-level row index rather than ordinary columns. It prints nicely and then fights you the moment you try to merge, filter, plot, or export, because `region` is no longer a column you can just refer to.

Two ways to get a plain flat table, and they end in the same place. Ask for it up front with `as_index=False`, which keeps the keys as regular columns, or repair it afterwards with `.reset_index()`, which moves index levels back into columns.
    
    
    df.groupby(['region', 'category'], as_index=False)['amount'].mean()
    
    
    region category  amount
      East   Chairs   100.0
      East    Desks   275.0
      East    Lamps    40.0
     South   Chairs   100.0
     South    Lamps    50.0
      West   Chairs   100.0
      West    Desks   400.0
      West    Lamps    60.0

Also worth noticing: South has no Desks row at all, not a zero. Combinations with no rows simply never form a group, the same way a filtered-out group goes missing in SQL. If a category you know exists is absent from a grouped result, the rows behind it never made it into the split.

## 6. The small-group problem, carried over from SQL

Rankings of group averages have a structural bias: the smallest groups float to the extremes, because a mean over three values swings much more freely than a mean over three thousand. The SQL guide's fix carries straight over: always compute the group size beside the statistic, and set a floor before you read the ranking.
    
    
    summary = df.groupby('region').agg(
        avg_amount=('amount', 'mean'),
        orders=('order_id', 'size'),
    )
    summary[summary['orders'] >= 4]
    
    
            avg_amount  orders
    region
    East    158.000000       5
    West    186.666667       4

South, with its 3 orders averaging 83.33, is excluded from the comparison rather than allowed to look like a stable finding. The boolean filter line is pandas's `HAVING`: it runs on the combined result, after the groups exist, which is the only time a per-group condition can be checked. On fourteen rows the floor of 4 is obviously a demonstration; on real data the floor is a judgement you should pick from the data and write down, and [choosing thresholds from the data](https://michaelnocito.github.io/analyst-prep-kit/guides/data-driven-thresholds/) covers how.

Now picture running the named-aggregation line on your own table, whatever it is: tickets by assignee, revenue by client, scores by school. Which group do you already suspect has single-digit rows behind a confident-looking average? That suspicion is the reason `orders=` goes in every grouped result I ship.

## 7. transform: a group statistic on every row

Everything so far collapsed the table. Sometimes you want the opposite: keep all the original rows and attach a group-level number to each, so you can compute each row's share of its group. `transform` applies the function per group and then broadcasts the answer back to every row of that group, so the result is the same length as the input.
    
    
    d2 = df.dropna(subset=['region', 'amount']).copy()
    d2['region_total'] = d2.groupby('region')['amount'].transform('sum')
    d2['share'] = d2['amount'] / d2['region_total']
    
    
     order_id region category  amount  region_total  share
         1001   East   Chairs   120.0         790.0  0.152
         1002   East   Chairs    80.0         790.0  0.101
         1003   East    Desks   300.0         790.0  0.380
         1004   East    Desks   250.0         790.0  0.316
         1005   East    Lamps    40.0         790.0  0.051
         1006   West   Chairs   100.0         560.0  0.179
         1007   West    Desks   400.0         560.0  0.714
         1009   West    Lamps    60.0         560.0  0.107
         1010  South   Chairs    90.0         250.0  0.360
         1011  South   Chairs   110.0         250.0  0.440
         1012  South    Lamps    50.0         250.0  0.200

Every East row carries East's total of 790, every West row 560, every South row 250. Order 1007's share checks by hand: 400 ÷ 560 = 0.714, so one desk order is 71% of West's spend. The rule of thumb: `agg` when the deliverable is one row per group, `transform` when the deliverable is the original rows with a group fact attached. In SQL this same keep-the-rows move is a window function.

The first line dropped the rows with a missing region or amount on purpose, and out loud, before dividing. Which is the perfect segue.

## 8. The rows that vanish: dropna

Before the explanation: our table has 14 rows, and the region sizes in section three were 5 + 3 + 4 = 12. Two rows have been missing from every grouped result on this page so far. Which two?

Orders 1013 and 1014, the ones with a missing region. By default `groupby` runs with `dropna=True`, which means rows whose group key is missing are excluded before the split even happens. They are not a group that shows up blank; they are simply not there, and no warning is printed. On this page that is 2 rows of 14, holding 260 + 45 = 305 in sales. On a real table it can be a fifth of your revenue, absent from every regional report, with every printed number still individually correct.

One argument surfaces them as their own group.
    
    
    df.groupby('region', dropna=False)['amount'].mean()
    
    
    region
    East     158.000000
    South     83.333333
    West     186.666667
    NaN      152.500000
    Name: amount, dtype: float64

The NaN group's mean checks by hand: (260 + 45) ÷ 2 = 305 ÷ 2 = 152.5. That row is not an error to hide. It is a measurement of your missing data, and the honest move is to report it: "two orders, 305 in sales, have no region recorded." Silent exclusions are exactly the kind of thing that belongs in writing next to a result, and [documenting data limitations](https://michaelnocito.github.io/analyst-prep-kit/guides/documenting-data-limitations/) is the guide for how to say it. My habit is to run the `dropna=False` version once for every key I group by, read the NaN row, then decide what to do about it, rather than letting the default decide for me.

## The full before and after

Same 14-row table, same question: how do the regions compare on order value?

### Before
    
    
    df.groupby('region')['amount'].mean()

Three problems, none of which raise an error. There is no group size, so South's 83.33 on three orders reads as confidently as East's 158 on five. Two whole rows are missing because their region is blank, and nothing says so. And the result is an index-keyed Series that the next step will trip over.

### After
    
    
    # One row per region, sizes shown, missing keys surfaced, flat table, sorted.
    result = (
        df.groupby('region', dropna=False, as_index=False)
          .agg(avg_amount=('amount', 'mean'),
               orders=('amount', 'size'))
          .sort_values('avg_amount', ascending=False)
    )
    
    
    region  avg_amount  orders
      West  186.666667       4
      East  158.000000       5
     South   83.333333       3
       NaN  152.500000       2

(The NaN row appears because of `dropna=False`; pandas keeps it at the end of the sort.) Every one of the 14 input rows is now accounted for: 4 + 5 + 3 + 2 = 14. The reader can see that South's average stands on 3 orders, and that 2 orders have no region at all. `sort_values('avg_amount', ascending=False)` orders the result by the statistic, highest first, because a comparison table should be sorted by the thing being compared, not by alphabet.

## Edge cases that break grouped results in real data

Five that each cost someone an afternoon.

**The key column has near-duplicate values.** `'East'` and `'East '` with a trailing space are two different groups, and your regional report quietly grows a fourth region. Normalize keys before grouping, `df['region'].str.strip()` at minimum. When the duplicates are messier than whitespace, that is [entity resolution](https://michaelnocito.github.io/analyst-prep-kit/guides/entity-resolution/).

**A group whose values are all missing returns NaN, not zero.** If every amount in a group is missing, `sum` returns 0 but `mean` returns NaN, and a NaN in a report column tends to get "fixed" to zero by whoever formats it. A group with no measurable values and a group averaging zero are different findings.

**Grouping after a merge counts duplicates.** If an upstream join multiplied rows, `size` now counts pairs, not orders. The check is the one this page keeps using: do the group sizes still add to the row count you expected?

**The MultiIndex survives into your export.** Write a two-key grouped result straight to CSV and the staircase index becomes blank cells under `region`, which Excel users will read as missing data. Flatten with `as_index=False` or `reset_index()` before anything leaves Python.

**Sorting by the index when you meant the values.** `sort_index()` orders by group name, alphabetically. `sort_values('avg_amount')` orders by the number. A ranking sorted alphabetically still looks sorted, which is what makes it easy to miss.

## Why this works

Split-apply-combine is not just how pandas happens to be built; it is a named, general strategy for data analysis. Wickham's account of it, written for the R world, argues that an enormous share of practical analysis is exactly this pattern, break a problem into pieces along a key, operate on each piece independently, put the pieces back together, and that naming the pattern is what lets you recognize it across tools (Wickham, 2011, _Journal of Statistical Software_ , 40(1), 1–29). That is why this page kept pointing at SQL: `groupby`, `GROUP BY`, Excel pivot tables, and window functions are one strategy wearing four syntaxes, and the grain discipline transfers with it. The theory underneath is older still: grouping is a partition of rows into disjoint sets, and an aggregate is a function from a set to a single value, which is the relational footing SQL formalized from the start (Codd, 1970, _Communications of the ACM_ , 13(6), 377–387). Once you see a grouped result as a partition, the page's oddities stop being quirks: a dropped NaN key is a row assigned to no set, and size against count is the size of the set against the values present in one attribute of it.

And there is a reason this page kept asking you to commit to an answer, where are the missing rows, what did size count, before giving it. Attempting an answer before seeing the correct one reliably improves how well the correct one is retained, even when the attempt is wrong (Bisra, Liu, Nesbit, Salimi, & Winne, 2018, _Educational Psychology Review_ , 30(3), 703–725). The 5 + 3 + 4 = 12 arithmetic sticks because you were asked to find the gap before it was named.

## Using this on your own project

Retrofitting every grouped line in an old notebook is miserable and you will stop at the third cell. Do this instead, in order.

  1. **Say the new grain out loud** before you type: "one row per region per month." It decides the key list and warns you what stops existing.
  2. **Use named aggregation by default** , even for one statistic. Future-you gets column names that explain themselves.
  3. **Put a`size` beside every statistic**, and check the sizes add up to the row count you started with. The 5 + 3 + 4 = 12 check on this page is the whole method.
  4. **Run each key once with`dropna=False`** and read the NaN row before deciding whether to exclude it, fill it, or report it.
  5. **Flatten before anything leaves Python** : `as_index=False` or `reset_index()`, then `sort_values` by the statistic.

If you have paper nearby, one optional drawing is worth five minutes: redraw the split-apply-combine picture from memory for your own table, seven rows, three shadings, one dashed row with a missing key, and mark where that dashed row goes. Placing the dropped row correctly, before the split rather than after, is the whole dropna lesson in one pen stroke.

**More detail on this, and more like it.** Every how-to sits in one place on the [guides index](https://michaelnocito.github.io/analyst-prep-kit/guides/): SQL, Python, Excel, and the working habits around them.

## The whole thing on one screen

This is the retrieval sheet. Cover the right column, work down the left, and say each answer out loud before you check it.

| Concept                       | What it does                                                                                      |
|-------------------------------|---------------------------------------------------------------------------------------------------|
| Split-apply-combine           | One mini-table per key, one function call per mini-table, answers stacked into one row per group. |
| Grain after grouping          | One row per group, not one row per record. Say it before typing.                                  |
| `df.groupby('k')['v'].mean()` | The basic move: key, value column, statistic.                                                     |
| `agg(['mean','sum'])`         | Several statistics per group in one pass.                                                         |
| Named aggregation             | `agg(avg=('v','mean'), n=('v','size'))`. Your names, explicit inputs.                             |
| `size`                        | Rows in the group, missing included. SQL's `COUNT(*)`.                                            |
| `count`                       | Non-missing values in one column. SQL's `COUNT(col)`. Can be smaller.                             |
| Aggregations and NaN          | mean, sum and friends skip missing values. The denominator is count, not size.                    |
| Several keys                  | `groupby(['a','b'])`: finer grain, result carries a MultiIndex.                                   |
| Flat table back               | `as_index=False` up front, or `.reset_index()` after.                                             |
| Small groups                  | Ship a size column, filter `summary[summary['n'] >= floor]`. pandas's HAVING.                     |
| `transform`                   | Group statistic broadcast back onto every original row. For shares and comparisons to the group.  |
| `agg` vs `transform`          | agg collapses to one row per group; transform keeps every row.                                    |
| Missing keys                  | Dropped before the split by default. `dropna=False` keeps them as a NaN group.                    |
| Missing combination           | No rows means no group at all, not a zero row.                                                    |
| The reconciliation check      | Group sizes must add back to the input row count. Here: 5 + 3 + 4 + 2 = 14.                       |
| `sort_values`                 | Order the result by the statistic, not the alphabet.                                              |

**The one habit to keep.** Every grouped result ships with a size column, and the sizes must add back to the rows you started with. That single reconciliation catches missing keys, join blowups, and hollow averages in one move. If a grouped result breaks in a way this page does not cover, there is a general [diagnosis loop for being stuck](https://michaelnocito.github.io/analyst-prep-kit/guides/technical-tenacity/).

One last thought, and I would genuinely like other people's answers. The first time I ran a regional report, the rows with no region were simply not in it, and I only found them weeks later reconciling against a finance total that would not match. What have you found living in your NaN group, and how long had it been there?

## References

  * Wickham, H. (2011). The split-apply-combine strategy for data analysis. _Journal of Statistical Software_ , 40(1), 1–29.
  * Codd, E. F. (1970). A relational model of data for large shared data banks. _Communications of the ACM_ , 13(6), 377–387.
  * Bisra, K., Liu, Q., Nesbit, J. C., Salimi, F., & Winne, P. H. (2018). Inducing self-explanation: A meta-analysis. _Educational Psychology Review_ , 30(3), 703–725.

---

*The full version of this guide lives on my site: [pandas GroupBy: How to Summarize a DataFrame Without Losing Track of Your Rows](https://michaelnocito.github.io/analyst-prep-kit/guides/pandas-groupby/).*

*If it was useful: [Buy Me a Coffee](https://buymeacoffee.com/michaelnocito).*
