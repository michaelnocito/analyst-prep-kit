By the end of this page you can build a date table that meets Microsoft's stated requirements, write year-to-date and prior-period measures that work, and explain why a report with no date table reports a 6 percent dip that never happened. Our sixteen orders have no April in them at all, and that single fact breaks or fixes everything below.

Here is what to actually do today. Open your model and check whether it has a real date table, marked as one, with a row for every single day and no gaps. If it does not, every time calculation in that report is either wrong or about to be, and adding the table is a five-minute job that fixes them all at once.

The short version: DAX time intelligence works by taking the dates in the current filter and shifting them. It can only shift onto dates that exist in a date column, so the date table has to contain every day, including the ones with no sales.

Where the periods come from is the whole idea, so it gets the picture.

> _The original carries a diagram here. In words: Two horizontal rows of blocks, one above the other. The upper row, labelled orders, has four solid blocks, and there is a conspicuous empty space between the third and the fourth where a fifth block would sit if it existed, so the row reads as having a hole in it. The lower row, labelled calendar, has five blocks in an unbroken line with no space between them, each the same width as the blocks above. Four short arrows drop from the four solid blocks in the upper row straight down into the lower row, each landing in the block directly beneath it. The fourth block of the lower row, the one sitting under the empty space, receives no arrow and is drawn with a dashed outline and no fill, so it reads as a period that exists but has nothing in it. The lower row remains complete and evenly spaced throughout._

**Every number on this page is real, and every behaviour is documented.** Sixteen orders across five months of 2026, with genuinely no April rows. The DAX rules quoted here come from Microsoft's own reference pages rather than from experience, and they are quoted directly in the "why this works" section. If CALCULATE is still fuzzy, [CALCULATE and filter context](https://michaelnocito.github.io/analyst-prep-kit/guides/powerbi-calculate/) comes first, because every time intelligence function is a CALCULATE with the dates rewritten.

Here is the whole fact table, summarized by month. Sixteen orders, one per week, and a five-week stretch from late March to early May with nothing in it.

| Month         | Orders | Revenue        |
|---------------|--------|----------------|
| January 2026  | 4      | 2,630          |
| February 2026 | 4      | 2,245          |
| March 2026    | 4      | 2,585          |
| April 2026    | 0      | no rows at all |
| May 2026      | 4      | 2,430          |
| **Total**     | **16** | **9,890**      |

## 1. Why a date table is not optional

Before the requirement: you drag OrderDate onto a visual and group by month. Predict how many rows the visual shows, before reading on.

Four, not five. April has no orders, so it has no rows, so it has no month value, so it never appears. That is not a Power BI quirk, it is what grouping does in every tool, and it is the same silent gap covered in [month-over-month in SQL](https://michaelnocito.github.io/analyst-prep-kit/guides/sql-month-over-month/) and [in Excel](https://michaelnocito.github.io/analyst-prep-kit/guides/excel-month-over-month/).

A **date table** fixes it by being a list of periods rather than a list of events. It has one row per day whether or not anything happened, so grouping by its month column always produces twelve rows a year. Microsoft's guidance is specific about what qualifies, and the list is short enough to check by hand:

  * It must have a column of data type date or date/time.
  * The date column must contain unique values.
  * The date column must not contain BLANKs.
  * The date column must not have any missing dates.
  * The date column must span full years. A year isn't necessarily a calendar year.
  * For classic time intelligence, the table must be marked as a date table.

Read the fourth and fifth of those together and the reason becomes obvious. Time intelligence works by shifting a set of dates backwards or forwards. If the date it wants to shift onto is not in the table, it cannot land, and if the table stops halfway through a year, a year-to-date calculation has nothing to accumulate over.

Say out loud why "span full years" is a requirement rather than a suggestion. A year-to-date measure for March needs January and February to exist even if nothing sold in them, and a prior-year comparison for January 2026 needs all of 2025 present even if the business started in June.

## 2. Building one, and marking it

Before the code: you need every date from the start of your data to the end. Say where those two dates should come from, before reading on.

From the data, so the table extends itself when new rows arrive. Two DAX functions do it, and the second one is the one I use.
    
    
    -- Option 1: you control the range
    Date =
    CALENDAR ( DATE ( 2026, 1, 1 ), DATE ( 2026, 12, 31 ) )
    
    -- Option 2: the range follows the model, and always covers full years
    Date = CALENDARAUTO ()

`CALENDARAUTO` is the safer default for exactly the reason section one gave: Microsoft's guidance notes that it "ensures that full years of dates are returned and so meets the requirement for a marked date table", and that a refresh recalculates it, so the range extends itself as new years of data arrive. You do not have to remember to widen it next January.

Then add the columns you will actually group by. These are calculated columns on the date table, computed once at refresh.
    
    
    Year        = YEAR ( 'Date'[Date] )
    Month       = FORMAT ( 'Date'[Date], "mmm yyyy" )
    Month Sort  = YEAR ( 'Date'[Date] ) * 100 + MONTH ( 'Date'[Date] )
    Quarter     = "Q" & ROUNDUP ( MONTH ( 'Date'[Date] ) / 3, 0 )

Three finishing steps that people skip, and each one causes a specific bug.

  1. **Sort Month by Month Sort.** Select the Month column, then Column tools, Sort by column. Without it your axis reads Apr, Feb, Jan, Mar, May, alphabetically, and it will happen on the first chart you build.
  2. **Relate it to the fact table.** One-to-many from `'Date'[Date]` to `Orders[OrderDate]`, single direction, from date to orders. The date table is a dimension and the orders table is a fact, which is the shape [the star schema guide](https://michaelnocito.github.io/analyst-prep-kit/guides/powerbi-star-schema/) is about.
  3. **Mark as a date table.** Right-click the table, Mark as date table, pick the date column. Required for classic time intelligence, and free to do.

One thing to turn off while you are there. Power BI's Auto date/time option quietly builds a hidden date table behind every date column in your model. It is convenient for a quick look and it is not a single shared calendar, so filters from it do not propagate to your other tables. With a real date table in place it is redundant, and it inflates the model.

## 3. Year to date with TOTALYTD

Before the measure: you want revenue accumulated from the start of the year. Predict what it shows for March, given the monthly figures above.

2,630 plus 2,245 plus 2,585, which is 7,460. Here is the measure and the whole column.
    
    
    Total Revenue = SUM ( Orders[Revenue] )
    
    Revenue YTD = TOTALYTD ( [Total Revenue], 'Date'[Date] )

| Month    | Total Revenue | Revenue YTD |
|----------|---------------|-------------|
| Jan 2026 | 2,630         | 2,630       |
| Feb 2026 | 2,245         | 4,875       |
| Mar 2026 | 2,585         | 7,460       |
| Apr 2026 | (blank)       | 7,460       |
| May 2026 | 2,430         | 9,890       |

April is the row worth looking at. Revenue is blank because there are no orders, and the running total holds at 7,460 rather than dropping or disappearing, because year-to-date means everything from 1 January to the end of April and that is still 7,460. A report without a date table shows no April row at all, and the reader never learns that a month went by with nothing in it.

The equivalent written out longhand is worth seeing once, because it shows there is no magic in the function.
    
    
    Revenue YTD Long =
    CALCULATE (
        [Total Revenue],
        DATESYTD ( 'Date'[Date] )
    )

Every time intelligence function is this shape: a CALCULATE whose filter is a table of dates produced by a date function. That is why [the CALCULATE rules](https://michaelnocito.github.io/analyst-prep-kit/guides/powerbi-calculate/) apply unchanged here, and why a filter on the date table replaces whatever date filter the visual had.

## 4. Prior period with DATEADD, and the error it throws

Before the function: you want last month's revenue beside this month's. Predict what happens when the measure is asked for May's previous month, given that April has no orders.

With a proper date table, it correctly returns blank, because April exists and has nothing in it. Without a date table it can return March's number labelled as April's, or throw an error, and which of those you get depends on the shape of the dates in context.
    
    
    Revenue Prior Month =
    CALCULATE (
        [Total Revenue],
        DATEADD ( 'Date'[Date], -1, MONTH )
    )

| Month    | Total Revenue | Revenue Prior Month |
|----------|---------------|---------------------|
| Jan 2026 | 2,630         | (blank)             |
| Feb 2026 | 2,245         | 2,630               |
| Mar 2026 | 2,585         | 2,245               |
| Apr 2026 | (blank)       | 2,585               |
| May 2026 | 2,430         | (blank)             |

Read the last two rows carefully, because that pair is the entire value of a date table. April's prior month is March, 2,585, so the report shows a month that went from 2,585 to nothing. May's prior month is April, which is blank, so the report correctly declines to compute a change. Neither of those sentences is available to a report that skips April.

Two documented facts about DATEADD are worth committing to memory, because they explain most of the errors people hit with it.

**It only returns dates that exist.** Microsoft's reference states: "The result table includes only dates that exist in the dates column." Shift onto a date your calendar does not contain and you get nothing back, silently.

**The dates in context must be contiguous.** The same page states: "If the date column syntax is used and the dates in the current context do not form a contiguous interval, the function returns an error." This is the specific reason DATEADD fails on a model with no date table: the OrderDate values in context are the actual order dates, which have a five-week hole in them, and a hole is not a contiguous interval.

There is a shorter function for the common case. `PREVIOUSMONTH('Date'[Date])` does the same job as `DATEADD(..., -1, MONTH)` with less to type, and DATEADD is the one to keep because it takes any interval and any number: minus 3 quarters, minus 1 year, plus 2 weeks.

## 5. Same period last year, and what blank means

Before the result: our data runs January to May 2026 and nothing else. Predict what a prior-year comparison returns.

Blank, in every row, and that is the correct answer rather than a failure.
    
    
    Revenue LY =
    CALCULATE ( [Total Revenue], SAMEPERIODLASTYEAR ( 'Date'[Date] ) )
    
    Revenue YoY % =
    DIVIDE ( [Total Revenue] - [Revenue LY], [Revenue LY] )

There are no 2025 orders, so every prior-year figure is blank and every growth percentage is blank with it. `DIVIDE` earns its place here: written with a slash the whole column would be division-by-zero errors, and errors in a visual look like a broken report rather than like missing history.

This is worth stating because a blank prior-year column is the single most common "the measure does not work" report, and roughly half the time the measure is right and the history simply is not there. Two questions settle it in ten seconds. Does the date table cover last year at all? And are there any fact rows in last year?

If your date table was built with `CALENDAR(MIN(...), MAX(...))` over the fact table, the answer to the first is no, and that is the bug. This is the practical reason to prefer `CALENDARAUTO` or an explicitly widened range: a prior-year measure needs a prior year of calendar even when there is no prior year of data.

Now picture your own model. If somebody asked for year-on-year growth tomorrow, does your date table already contain the year before your earliest transaction?

## 6. Month over month, and the month that is not there

Before the comparison: here are the two versions of the same report, one built on OrderDate directly and one on a date table. Look at the May row of each and decide which is telling the truth.
    
    
    Revenue MoM % =
    DIVIDE ( [Total Revenue] - [Revenue Prior Month], [Revenue Prior Month] )

| Month | Revenue | No date table | With a date table |
|-------|---------|---------------|-------------------|
| Jan   | 2,630   | (blank)       | (blank)           |
| Feb   | 2,245   | −14.6%        | −14.6%            |
| Mar   | 2,585   | +15.1%        | +15.1%            |
| Apr   | none    | row not shown | −100.0%           |
| May   | 2,430   | −6.0%         | (blank)           |

The left-hand version has four rows, all of which look plausible, and it is wrong in two distinct ways. April is absent, so a month in which the business sold nothing is invisible. And May's −6.0 percent is computed against March, because March is the row above it, so a label saying "against last month" is attached to a two-month comparison.

The right-hand version has five rows, reports April as the total collapse it was, and refuses to compute a change for May because the month before it was empty. That blank is not a gap in the report; it is the report saying a percentage change from zero has no value. The arithmetic is the same as in [month-over-month in Excel](https://michaelnocito.github.io/analyst-prep-kit/guides/excel-month-over-month/), where the same fixture produces the same two answers.

Neither column required a different measure. The measure is identical in both. The only difference is whether the model contains a table of every month.

## 7. Fiscal years, and the one argument that changes everything

Before the change: your organization's year ends on 30 June. Predict what happens to the year-to-date column, before reading on.

Nothing at all, on this data, and understanding why is the point. TOTALYTD takes an optional final argument for the year end.
    
    
    Revenue FYTD =
    TOTALYTD ( [Total Revenue], 'Date'[Date], , "6/30" )

Microsoft's reference is precise about the format: it is "a literal string with a date that defines the year-end date. The default is December 31", the year portion is ignored, and month/day is the recommended way to write it. Note the empty third argument; that slot is the optional filter, and it has to be held open with a comma.

On our data the fiscal year running 1 July 2025 to 30 June 2026 contains all five of our months, so the fiscal year-to-date column is identical to the calendar one, ending at 9,890. The moment a December 2025 order appeared, the two columns would diverge: the calendar version would restart at January and the fiscal one would carry December forward.

Two practical notes. If you use the fiscal calendar for anything, put fiscal year, fiscal quarter and fiscal month columns on the date table rather than computing them in measures, so every visual can group by them directly. And check where your fiscal year starts before writing the string: a year ending 30 June starts on 1 July, and getting that off by a month shifts every comparison in the report by one period, invisibly.

## The full before and after

Same requirement both times: revenue by month with a running total and a month-over-month change.

### Before
    
    
    Model:    Orders table only. Month axis built from Orders[OrderDate].
    Measure:  Revenue MTD = TOTALYTD ( SUM ( Orders[Revenue] ), Orders[OrderDate] )
    Result:   Four rows. May shows -6.0% "against last month".

Four failures with one cause. April is missing from the axis. The May change compares to March. DATEADD against `Orders[OrderDate]` can error outright, because the dates in context are not contiguous. And the whole thing will break differently next month depending on which months happen to have orders in them.

### After
    
    
    Model:    'Date' table from CALENDARAUTO(), Year / Month / Month Sort columns,
              Month sorted by Month Sort, one-to-many to Orders[OrderDate],
              marked as a date table. Auto date/time turned off.
    
    Total Revenue       = SUM ( Orders[Revenue] )
    Revenue YTD         = TOTALYTD ( [Total Revenue], 'Date'[Date] )
    Revenue Prior Month = CALCULATE ( [Total Revenue], DATEADD ( 'Date'[Date], -1, MONTH ) )
    Revenue MoM %       = DIVIDE ( [Total Revenue] - [Revenue Prior Month],
                                   [Revenue Prior Month] )

Five rows, April included and blank, YTD holding at 7,460 across it and reaching 9,890, and May correctly declining to report a change against an empty month. Every measure names the date table rather than the fact table, which is what makes the time functions legal. Nothing here is clever; it is the same four lines every model needs, resting on a table that has no holes in it.

## Edge cases that catch people out

Six that each cost somebody an afternoon.

**Time intelligence against the fact table's date column.** It sometimes works, which is worse than never working, because it fails only when a period happens to be empty. Always pass the date table's column.

**A date column with times in it.** If OrderDate carries a time component, the relationship to a date-only calendar matches nothing, and every measure returns blank. Strip the time in Power Query.

**The month axis sorted alphabetically.** Apr, Feb, Jan, Mar, May. Fixed by Sort by column, and it is invisible until somebody reads the chart.

**A date table that stops at today.** A range built from the fact table's max date means next year's dates do not exist, so a forward-looking measure or an early January refresh finds nothing. `CALENDARAUTO` avoids it.

**Two date columns, one relationship.** Order date and ship date cannot both be actively related to one calendar. Either use `USERELATIONSHIP` in specific measures, or build a second date table, which is the approach Microsoft recommends for role-playing dimensions.

**Auto date/time left on.** It creates a hidden calendar per date column, inflates the model, and gives you month grouping that does not propagate to other tables. Turn it off once a real date table exists.

## Why this works

Every function on this page is a filter over a dimension table, which is why they all fail the same way when the dimension is incomplete. A date table is a dimension in the ordinary relational sense: a set of the periods you want to analyse by, joined to the facts. Grouping the facts alone can only ever return the periods that facts occurred in, because grouping partitions the rows you have rather than the rows you expected, which is the relational algebra underneath every tool that does this (Codd, 1970, _Communications of the ACM_ , 13(6), 377–387). The date table restores the missing periods by being the thing you group by, and the facts join onto it. Kimball's dimensional modelling makes the date dimension the canonical example, and Microsoft's own guidance calls it "the most consistent table you'll find in a star schema" (Kimball & Ross, 2013, _The Data Warehouse Toolkit_ , 3rd edition, Wiley; a monograph rather than a journal article).

The specific behaviours are product behaviour, so the authority is Microsoft's reference documentation rather than research. The date table requirements in section one are quoted from the Power BI date table guidance. The two DATEADD rules in section four, that only existing dates are returned and that non-contiguous dates in context cause an error, are quoted from the DATEADD reference. The TOTALYTD year-end string format in section seven is quoted from the TOTALYTD reference. Those pages are listed below and worth reading directly.

One note on why this page kept asking you to predict before showing the answer. Attempting an answer before seeing the correct one reliably improves how well the correct one is retained, even when the attempt is wrong (Bisra, Liu, Nesbit, Salimi, & Winne, 2018, _Educational Psychology Review_ , 30(3), 703–725). The −6.0 percent that is really a two-month comparison sticks because you were asked which column was telling the truth first.

## Using this on your own model

Retrofitting a date table into a large report is real work, and it is bounded. Do this, in order.

  1. **Add the date table first** , with `CALENDARAUTO()`, before touching any measure. Year, Month, Month Sort, Quarter.
  2. **Sort the month column and mark the table.** Two clicks each, and both are invisible until they bite.
  3. **Relate it once** , one-to-many, single direction, to your main fact date. Then turn off Auto date/time.
  4. **Rewrite time measures to name the date table.** Search your measures for the fact table's date column; every occurrence inside a time function is a bug waiting for an empty period.
  5. **Rebuild the month axis from the date table** and count the rows. If a period with no activity now appears, blank, the retrofit worked.

If you have paper nearby, one optional drawing is worth five minutes. Draw your own last twelve months as a row of boxes, then mark which ones actually contain rows in your fact table. Any empty box is a row your current report is not showing, and seeing them in your own data is more convincing than any example of mine.

**More detail on this, and more like it.** Every how-to sits in one place on the [guides index](https://michaelnocito.github.io/analyst-prep-kit/guides/): SQL, Python, Excel, Power BI and the working habits around them.

## The whole thing on one screen

This is the retrieval sheet. Cover the right column, work down the left, and say each answer out loud before you check it.

| Idea                   | What it means                                                                       |
|------------------------|-------------------------------------------------------------------------------------|
| Why a date table       | Grouping the facts returns only the periods that had facts. April vanishes.         |
| The six requirements   | Date type, unique, no blanks, no missing dates, full years, marked as a date table. |
| CALENDARAUTO           | Range follows the model and always covers full years. The safer default.            |
| Three setup steps      | Sort month by a numeric key, relate one-to-many, mark as date table.                |
| Auto date/time         | Hidden calendar per date column. Turn it off once you have a real one.              |
| TOTALYTD               | Running total within the year. Holds at 7,460 across an empty April.                |
| Every time function    | A CALCULATE whose filter is a table of dates. The CALCULATE rules all apply.        |
| DATEADD                | Shift the dates in context. Returns only dates that exist in the column.            |
| DATEADD's error        | Non-contiguous dates in context return an error. That is the fact-table-date bug.   |
| PREVIOUSMONTH          | Shorthand for DATEADD(-1, MONTH). DATEADD takes any interval.                       |
| SAMEPERIODLASTYEAR     | Blank when there is no prior year. Usually the data, not the measure.               |
| DIVIDE                 | Blank instead of an error on a zero denominator. Use it everywhere.                 |
| No date table, May     | −6.0% labelled "last month", actually against March.                                |
| With a date table, May | Blank, because April was empty. April itself shows −100%.                           |
| Fiscal year            | TOTALYTD's fourth argument, a "month/day" string. Default is 12/31.                 |
| Two date roles         | Only one active relationship. USERELATIONSHIP, or a second date table.              |

**The one habit to keep.** Every time function names the date table's date column, never the fact table's. If you find a time measure pointing at a fact column, it is not a style problem, it is a bug that will surface the first month nothing happens. If a measure breaks in a way this page does not cover, there is a general [diagnosis loop for being stuck](https://michaelnocito.github.io/analyst-prep-kit/guides/technical-tenacity/).

One last thought, and I would genuinely like other people's answers. The first month-over-month report I built skipped a month with no sales and quietly compared across the gap, and it took a finance reconciliation to find it. What is the period missing from your own reporting, and would anybody notice?

## References

  * Codd, E. F. (1970). A relational model of data for large shared data banks. _Communications of the ACM_ , 13(6), 377–387.
  * Kimball, R., & Ross, M. (2013). _The Data Warehouse Toolkit: The Definitive Guide to Dimensional Modeling_ (3rd ed.). Wiley. (The canonical treatment of the date dimension. A monograph rather than a journal article.)
  * Bisra, K., Liu, Q., Nesbit, J. C., Salimi, F., & Winne, P. H. (2018). Inducing self-explanation: A meta-analysis. _Educational Psychology Review_ , 30(3), 703–725.
  * Microsoft. _Design guidance for date tables in Power BI Desktop_. The source of the six date table requirements quoted in section one.
  * Microsoft. _DATEADD function (DAX)_ and _TOTALYTD function (DAX)_ , DAX reference. The source of the contiguous-interval rule, the existing-dates-only rule and the year-end string format. Product documentation rather than peer-reviewed research, which is the correct authority for how a product behaves.

---

*The full version of this guide lives on my site: [DAX Time Intelligence: DATEADD, TOTALYTD and the Month That Is Not There](https://michaelnocito.github.io/analyst-prep-kit/guides/powerbi-time-intelligence/).*

*If it was useful: [Buy Me a Coffee](https://buymeacoffee.com/michaelnocito).*
