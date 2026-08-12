By the end of this page you can turn a list of transactions into a monthly series, compute growth between consecutive months, make a month with no activity appear as a zero rather than vanish, decide what to show when last month was zero, and use the right word for the change you are reporting. It is about twenty-five minutes, and every number below was run in Excel.

Here is what to do today, on the monthly table you already have. Count its rows and compare that with the number of months in the period. If your data covers January to May, there should be five rows. Four rows means one month produced nothing, and every growth figure below the gap is comparing the wrong pair of months.

The short version: growth is `this month ÷ last month − 1`, and the only hard part is being sure that the row above really is last month.

That gap is the idea, so it gets the picture.

> _The original carries a diagram here. In words: A bar chart with five slots along a baseline, labelled Jan, Feb, Mar, Apr and May. Four of the slots hold solid bars of different heights. The fourth slot, Apr, holds no bar at all; in its place is an empty dashed outline sitting on the baseline, showing a month with nothing in it. A curved arrow springs from the top of the March bar, arcs over the empty April outline without touching it, and lands on the top of the May bar, with the figure minus six point zero percent printed on the arc. Because the April slot never became a row in the table, the formula reached back one row rather than one month, so the arrow connects two bars that are two months apart while the label claims a month-over-month change._

**Every result on this page is real.** Run in Excel on the sixteen-row orders table used across this set of guides. It runs from 5 January to 25 May 2026, and it contains no April orders at all, which is not a trick set up for this page; it is the same table every other guide in the set uses. If you want the same job in SQL, [month-over-month with LAG](https://michaelnocito.github.io/analyst-prep-kit/guides/sql-month-over-month/) is the companion piece.

## 1. Get to one row per month first

Growth compares two numbers, so before anything else you need one number per month. Two routes.

**A pivot table.** Put the date field in Rows, right-click a date, Group, tick Months and Years, and put revenue in Values. Fast, and covered step by step in [the pivot guide](https://michaelnocito.github.io/analyst-prep-kit/guides/excel-pivot-tables/), including the part that matters here: a month with no rows never appears.

**SUMIFS against a list of month starts** , which is more typing and more control. Build the boundaries with `DATE` and `EOMONTH` rather than typing them, so the sheet behaves the same on every machine:
    
    
    =SUMIFS(Orders[Revenue],
            Orders[OrderDate], ">="&A2,
            Orders[OrderDate], "<="&EOMONTH(A2,0))

With A2 holding 1 January 2026 that returns 2,630. The same formula pointed at 1 April returns 0, which is the whole reason to prefer this route, and section four is about why.

Either way, check the aggregate before going further: the months must add back to the total. Here 2,630 + 2,245 + 2,585 + 2,430 = 9,890, which is the table's full revenue, so nothing was lost in the grouping.

## 2. The growth formula

One row per month, sorted oldest first, and growth is the row above.
    
    
    =B3/B2 - 1

Format the result as a percentage rather than multiplying by 100, because a cell formatted as a percentage still holds the underlying number and can be averaged, charted and compared. Multiplying by 100 turns it into a number that only looks like a percentage.

On the four months present in the data:
    
    
    Month   Revenue    Growth
    Jan       2630         -
    Feb       2245    -14.6%
    Mar       2585    +15.1%
    May       2430     -6.0%

Check one by hand: 2,245 ÷ 2,630 = 0.8536, minus 1 is −0.1464, which is −14.6%. The equivalent form `=(B3-B2)/B2` gives the same answer and reads more like the definition; use whichever you will recognise in six months.

The first row has nothing above it, so leave it blank rather than showing a zero. A zero there claims flat growth in a month where growth is not defined, and somebody will average the column.

## 3. The month that is not there

Before the explanation: the table above has four rows for a period running January to May. Say which month is missing and what that does to the last figure.

April. There are no April orders, so April never became a row, and the formula on the May row divided by the row above it, which is March.
    
    
    What the sheet says      May, -6.0%
    What it computed         2430 / 2585 - 1
    What that measures       May against March
    What April was           0, in a month nobody looked at

Every part of that is arithmetically correct. The −6.0% is a real number about two real months. It is simply not the number the column heading promises, and there is nothing on the sheet to indicate the substitution, because the evidence for April was never a row.

It also quietly changes anything computed from the column. Average monthly revenue over the four rows present is 2,472.50. Over the five months that actually elapsed, with April counted as the zero it was, it is 1,978.00. That is a difference of 494.50 a month, from a row that does not exist.
    
    
    =AVERAGE over the four rows present        2472.50
    =AVERAGE over five months, April as 0      1978.00

Say out loud which of those two numbers you would want on a slide titled "average monthly revenue". Both are defensible and they mean different things, and the sheet as built does not let you choose, because it only offers one of them.

## 4. A calendar table, so a gap becomes a zero

The fix is not a cleverer formula. It is a list of every month in the period, written down independently of the data, with the totals looked up against it.

Build the list once. Put the first month start in a cell and fill the rest with `EDATE`, which steps by whole months and handles year ends without help:
    
    
    A2:  =DATE(2026,1,1)
    A3:  =EDATE(A2,1)        and fill down

Then total against it with SUMIFS, exactly as in section one. Now every month exists as a row whether or not anything happened in it:
    
    
    Month   Revenue    Growth
    Jan       2630         -
    Feb       2245    -14.6%
    Mar       2585    +15.1%
    Apr          0   -100.0%
    May       2430    #DIV/0!

That looks worse and it is much better. The 0 is visible, the −100.0% is a true statement about April, and the error on the May row is Excel refusing to divide by zero, which is the correct response to a question that has no answer. The version without the calendar hid all three behind a tidy −6.0%.

Two details worth having. Base the calendar on the reporting period rather than on the data, so it covers months at the start and end where nothing happened either. And keep it as a proper column of dates, formatted to display as months, rather than as text, so it can still be filtered and compared; that is the same discipline as [everything else involving dates](https://michaelnocito.github.io/analyst-prep-kit/guides/excel-dates/).

## 5. Dividing by zero, and what to show instead

Before the explanation: last month was zero and this month was 2,430. Say what the growth percentage is.

There is not one. Growth is a ratio to a base, and there is no meaningful ratio to nothing: any increase from zero is infinite in percentage terms, which is why Excel returns `#DIV/0!` rather than a large number.

So do not hide it behind a zero. Three honest options, in order of how much I like them.
    
    
    =IF(B2=0, "n/a", B3/B2-1)         says growth is undefined
    =IF(B2=0, "new", B3/B2-1)         says the series restarted
    =IF(B2=0, "", B3/B2-1)            blank, which at least is not a claim

What all three avoid is `=IFERROR(B3/B2-1, 0)`, which reports 0% growth for a month that went from nothing to 2,430. That is not a rounding compromise, it is the opposite of what happened, and it is exactly the trade [wrapping an error](https://michaelnocito.github.io/analyst-prep-kit/guides/excel-iferror/) always offers.

And whichever you choose, report the absolute change beside the percentage. February's −14.6% is also −385, and 2,430 up from 0 has no percentage at all but is plainly 2,430. A number of things and a percentage of things are read differently by people, and the pair together is much harder to misread than either alone.

## 6. Percent against percentage points

Two different words for two different quantities, and mixing them is the most common wording error in a monthly pack.

If a conversion rate goes from 5.12% to 6.85%, the change is **1.73 percentage points**. It is also a **33.8% increase** , because 6.85 ÷ 5.12 − 1 is about 0.338. Both are true; they are answers to different questions, and the numbers are not close.
    
    
    6.85% - 5.12%          1.73 percentage points
    6.85% / 5.12% - 1      33.8%

The rule is simple once said: **subtracting two percentages gives percentage points, dividing them gives a percentage.** Say "points" out loud when you mean the subtraction, and put the word in the column heading, because a column headed "change" containing 1.73 will be read as 1.73% by somebody in a hurry.

This only comes up when the thing you are tracking is itself a percentage: conversion rates, margins, utilisation, market share. Revenue in pounds has no such ambiguity, which is why the confusion tends to arrive later, when somebody adds a margin row to a revenue report.

## 7. Small bases, and the moving average

Month-over-month growth divides by last month, so the smaller last month was, the wilder the percentage. A region that did 40 last month and 120 this month is up 200%, and a region that did 4,000 and went to 4,400 is up 10%, and the second one moved twenty times more money.

Two habits keep that under control.

**Show the base beside the percentage** , always. A growth column with no denominator column next to it invites the reader to rank by percentage, which ranks by smallness.

**Smooth before you compare** , when the series is noisy. A three-month average of the same data flattens the single-month swings and makes the direction readable:
    
    
    =AVERAGE(B2:B4)      three months ending March, calendar included:  1610.00
    =AVERAGE(B3:B5)      three months ending May, calendar included:    1671.67

Note that both of those include April's zero, because they are built on the calendar version. Smoothing over a series with hidden gaps smooths the wrong numbers, which is why the calendar comes first and the moving average second.

## 8. Against last year instead

Month-over-month answers "is this month better than last month", which for anything seasonal is a question about the season rather than the business. December against November tells you it is Christmas.

Year-over-year, comparing each month with the same month a year earlier, removes that. It is the same formula with a different partner:
    
    
    =B14/B2 - 1              twelve rows back, on a monthly series with no gaps

Which is another reason the calendar matters: "twelve rows back" is only "twelve months back" if every month is a row. On a table built from the data alone, twelve rows back can be thirteen or fourteen months, and nothing says so.

The usual answer in a real pack is to show both, with the absolute figures beside them, and to say in the heading which comparison each column is making. Two columns and a clear heading beats one number and an argument in the meeting.

## The full before and after

Same sixteen orders, same question: how is revenue trending?

### Before
    
    
    Pivot: dates grouped by month, revenue in Values, growth column beside it
    
    Jan   2630        -
    Feb   2245   -14.6%
    Mar   2585   +15.1%
    May   2430    -6.0%
    
    average monthly revenue   2472.50

Four clean rows, no errors, and two claims that are not true: that May fell 6% against the month before it, and that the business averages 2,472.50 a month. April is nowhere on the page.

### After
    
    
    # a calendar column, independent of the data
    A2 =DATE(2026,1,1)     A3 =EDATE(A2,1)  filled down
    
    # totals looked up against it
    =SUMIFS(Orders[Revenue], Orders[OrderDate],">="&A2,
                              Orders[OrderDate],"<="&EOMONTH(A2,0))
    
    # growth, honest about a zero base
    =IF(B2=0, "n/a", B3/B2-1)
    
    Month  Revenue   Change    Growth
    Jan       2630        -         -
    Feb       2245     -385    -14.6%
    Mar       2585     +340    +15.1%
    Apr          0    -2585   -100.0%
    May       2430    +2430       n/a
    
    average monthly revenue, five months   1978.00

The claim, and it is why the calendar comes before the formula: **one month with no sales removed itself from the table, turned a total stoppage into a tidy −6.0%, and moved average monthly revenue by 494.50, without producing a single error or an incorrect arithmetic step anywhere.**

## Edge cases that break a growth column

Six that get through.

**A partial current month.** Comparing three weeks of this month with a full last month always shows a fall. Either exclude the current month or scale it and label it clearly as a projection.

**Text dates.** If the date column is text, the pivot will not group and the SUMIFS boundaries will not match, and both fail in ways that look like a formula problem. Run the `=N(A2)` check first.

**Timestamps at the month boundary.** An order at 23:40 on 31 January is a serial number slightly above the end of January, so `<=EOMONTH(...)` excludes it. Use `<` the first of the next month instead, which is safe either way.

**Sorting the months as text.** A column of month names sorts April, August, December. Keep real dates underneath and format them as months, and the sort stays chronological.

**A negative base.** If last month was −200 and this month is 100, the formula returns −150%, which is arithmetically right and communicates the opposite of what happened. Where values can go negative, report the absolute change and skip the percentage.

**Restated history.** If last month's figure changes after the fact, this month's growth changes too, and last month's published growth is now wrong. Keep a note of when each figure was taken, or the pack disagrees with itself across two months.

## Why this works

The whole page turns on one distinction: absent is not the same as zero, and a table built only from the rows that exist cannot tell you which one you have. Statistical work on missing data makes the same point formally, that the pattern of what is missing is itself information and that analysing only the observed cases is a decision with consequences rather than a neutral default (Rubin, 1976, _Biometrika_ , 63(3), 581–592). April is the mild, visible version: a month that generated no rows and therefore no evidence of itself. The calendar table is the repair, and it works precisely because it is built independently of the data, so it can assert that April existed even when the data cannot.

The second half of the page is about how the result gets read. People are markedly better at reasoning about counts than about the ratios computed from them, and presenting the underlying frequencies alongside a rate reliably improves how accurately the rate is understood (Gigerenzer & Hoffrage, 1995, _Psychological Review_ , 102(4), 684–704). That is the argument for the absolute change column beside the growth column, and for showing the base next to any percentage: −14.6% and −385 together are much harder to misread than −14.6% alone, and a 200% rise sitting next to a base of 40 explains itself.

One note on the cheat sheet below. It is built to be covered and recalled rather than reread, and to be worth returning to a few days later rather than in one sitting, because spacing repetitions out produces substantially better long-term retention than massing them together (Cepeda, Pashler, Vul, Wixted, & Rohrer, 2006, _Psychological Bulletin_ , 132(3), 354–380).

## Using this on your own project

Rebuilding every trend report at once is miserable and you will stop at the second one. Do this instead, in order.

  1. **Count the rows against the months.** Twelve months of data and eleven rows is the whole problem, visible in one glance.
  2. **Build a calendar column** with `EDATE`, covering the reporting period rather than the data.
  3. **Total against it with SUMIFS** , using `DATE` and `EOMONTH` for the boundaries rather than typed dates.
  4. **Guard the divide** with `=IF(last=0,"n/a", ...)`, and never with an error wrapper that returns zero.
  5. **Put the absolute change next to the percentage** , and the base next to both.
  6. **Say "percentage points" when you mean subtraction** , in the column heading, not only in the meeting.

If you have paper nearby, one optional sketch is worth five minutes. Draw a row of boxes, one per month of your reporting period, and write your figures into them from memory. The boxes you cannot fill are the ones your table is probably missing, and the exercise takes about a minute per year of data.

**More detail on this, and more like it.** Every how-to sits in one place on the [guides index](https://michaelnocito.github.io/analyst-prep-kit/guides/): Excel, SQL, Python, and the working habits around them.

## The whole thing on one screen

This is the retrieval sheet. Cover the right column, work down the left, and say each answer out loud before you check it.

| Thing                       | What it does                                                   |
|-----------------------------|----------------------------------------------------------------|
| Step one                    | One row per month. Growth needs two numbers.                   |
| The formula                 | `=B3/B2-1`, formatted as a percentage, not multiplied by 100.  |
| Equivalent form             | `=(B3-B2)/B2`. Same answer, reads like the definition.         |
| The first row               | Blank. Not zero.                                               |
| A month with no data        | Never becomes a row. The formula then reaches two months back. |
| The fix                     | A calendar column built with `EDATE`, independent of the data. |
| Totalling against it        | `=SUMIFS(values, dates,">="&A2, dates,"<="&EOMONTH(A2,0))`     |
| A zero base                 | `#DIV/0!`, correctly. Growth from nothing is undefined.        |
| What to show                | `=IF(B2=0,"n/a", B3/B2-1)`. Never zero.                        |
| Subtracting two percentages | Percentage points. Say the word.                               |
| Dividing two percentages    | A percentage change.                                           |
| Small bases                 | Huge percentages. Always show the base.                        |
| Noisy series                | A three-month average, built on the calendar version.          |
| Seasonal series             | Compare with the same month last year, twelve rows back.       |
| Partial current month       | Always looks like a fall. Exclude it or label it.              |
| Month boundary              | Use `<` the first of next month, to survive timestamps.        |
| The check                   | Months must add back to the overall total.                     |

**The one habit to keep.** Count the rows in the monthly table and compare that count with the number of months in the period, before you write a single growth formula. Every other problem on this page is visible from that one comparison, and none of them announces itself any other way. If a trend column misbehaves in a way this page does not cover, there is a general [diagnosis loop for being stuck](https://michaelnocito.github.io/analyst-prep-kit/guides/technical-tenacity/).

One last thought, and I would genuinely like other people's answers. The one that got me was a client who had paused for a month during a systems migration, so the month simply was not in the extract, and the recovery afterwards was reported as a modest decline for two quarters before anyone counted the rows. What has a missing period done to a trend you published?

## References

  * Rubin, D. B. (1976). Inference and missing data. _Biometrika_ , 63(3), 581–592.
  * Gigerenzer, G., & Hoffrage, U. (1995). How to improve Bayesian reasoning without instruction: Frequency formats. _Psychological Review_ , 102(4), 684–704.
  * Cepeda, N. J., Pashler, H., Vul, E., Wixted, J. T., & Rohrer, D. (2006). Distributed practice in verbal recall tasks: A review and quantitative synthesis. _Psychological Bulletin_ , 132(3), 354–380.

---

*Originally published on Analyst Prep Kit: [Month-over-Month Growth in Excel, and the Month That Is Not There](https://michaelnocito.github.io/analyst-prep-kit/guides/excel-month-over-month/)*

*Visit the site for more beginner data analysis guides and free resources: [the full guide archive](https://michaelnocito.github.io/analyst-prep-kit/guides/) covers SQL, Excel, Power BI, Tableau, Python and statistics, and the [practice kits](https://michaelnocito.github.io/analyst-prep-kit/) run in your browser with nothing to install.*

*If it was useful: [Buy Me a Coffee](https://buymeacoffee.com/michaelnocito).*
