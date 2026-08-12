By the end of this page you can tell a real date from text that looks like one in two seconds, convert a whole column of the fake kind into the real kind, group by month without a helper column, and read the two settings that decide whether 05/01/2026 means January or May. It is about twenty-five minutes, and every result below came out of Excel.

Here is what to do right now, on the date column that is not behaving. Put `=N(A2)` beside it. If you get a number in the forty-six thousands, it is a real date and your problem is elsewhere. If you get 0, it is text, and nothing that expects a date will ever work on it.

The short version: a date in Excel is an ordinary number counting days since the start of 1900, and the format decides what you see. Text that looks like a date is not in that system at all.

One number, several faces, is the idea the rest of the page rests on, so it gets the picture.

> _The original carries a diagram here. In words: At the left of the picture a single cell holds the number 46027 in large type, and the cell is drawn with a heavy blue outline to mark it as the real content. Three arrows fan out to the right from that cell, each ending at its own smaller cell. The top cell reads 2026-01-05. The middle cell reads 5 Jan 2026. The bottom cell reads Monday. All three are drawn in the same pale style, none of them emphasised over the others, and none of them holds anything the left cell does not already contain. The picture shows that the three displays are three costumes on one value: change the format and the face changes, while the number on the left never moves._

**Every result on this page is real.** Run in Excel on the sixteen-row orders table used across this set of guides, which runs from 5 January to 25 May 2026.

## 1. A date is a number, and here is the number

Before the explanation: a cell displays 2026-01-05. Say what you think is actually stored in it.
    
    
    =N(A2)                       46027
    =TEXT(A2,"yyyy-mm-dd")  2026-01-05
    =TEXT(1,"yyyy-mm-dd")   1900-01-01

The cell holds 46,027. That is the count of days from the beginning of the system, where day 1 is 1 January 1900. Every date you have ever typed into Excel is a number like that one, and everything convenient about dates follows from it.

Subtraction works, because it is subtraction. The first and last orders in the table are 5 January and 25 May, and the gap between them is not a special date calculation:
    
    
    =B17-B2      140

140 days, straight arithmetic on two integers. Sorting works for the same reason, and so does filtering on "after 1 March", and so does grouping in a pivot. All of it is number handling wearing a date-shaped hat, which is why anything that is not really a number silently loses every one of those abilities.

## 2. The two-second test for text pretending to be a date

A text date and a real date can look identical, and often the text one looks _better_ , because it was typed by a human in a tidy format. Three tests, cheapest first.

**Look at the alignment.** Excel right-aligns numbers and left-aligns text by default, so a column of dates hugging the left edge is a warning. Only a warning, because any explicit alignment overrides it.

**Run`=N(A2)`.** It returns the numeric value of a cell, or 0 if there is no number in it. A real date returns something in the forty-six thousands. Text returns 0. This is the one to actually use.

**Try to group it in a pivot.** Right-click a date in the pivot and if _Group_ is greyed out, the column is text. That is often the first symptom people notice: [a pivot that will not group by month](https://michaelnocito.github.io/analyst-prep-kit/guides/excel-pivot-tables/) almost never has a pivot problem.

One nuance worth having, because it is the reason people conclude the column is fine. Excel will coerce a recognisable text date on the fly when a function demands a date:
    
    
    =YEAR("19 Jan 2026")     2026
    =MONTH("banana")       #VALUE!

So a formula can work on text dates and give you the right answer, while sorting, filtering, pivot grouping and subtraction all quietly do the wrong thing on the same column. One working formula is not evidence that the column is real.

## 3. Three ways to convert a text column into real dates

In increasing order of how much mess they cope with.

**DATEVALUE, in a new column.** Takes text and returns the serial number, which you then format as a date.
    
    
    =DATEVALUE("2026-01-19")     formats to  2026-01-19

Fast and clean, and it fails with `#VALUE!` on anything it cannot read, which is useful information rather than a nuisance. Those failures are the rows a person needs to look at.

**Text to Columns.** Select the column, Data, Text to Columns, Next, Next, then on step three choose **Date** and pick the order the text is written in: DMY, MDY, YMD. Finish. This is the one that handles a column written in a different country's order to yours, because you tell it explicitly what the text means instead of letting Excel guess.

**Rebuild it from the pieces.** When the text is genuinely irregular, pull the parts out and hand them to `DATE`:
    
    
    =DATE(LEFT(A2,4), MID(A2,6,2), RIGHT(A2,2))

`DATE` takes a year, a month and a day as three numbers and there is nothing to interpret, so nothing can be interpreted wrongly. It is more typing and it is the only one of the three that cannot surprise you.

Whichever you use, do it in a new column beside the original rather than over the top of it, for the same reason as every other [cleaning pass](https://michaelnocito.github.io/analyst-prep-kit/guides/excel-clean-messy-data/): if the conversion turns out to have read the text the wrong way round, you want the original still there to prove it.

## 4. 05/01/2026 and the two-digit year

Before the explanation: a file arrives with 05/01/2026 in the date column. Say which day that is.

You cannot know, and neither can Excel. It is 5 January to most of the world and 1 May in the United States, and the text carries no information about which convention wrote it. Excel resolves it using the Windows regional settings of whoever opens the file. On the machine this page was written on, the answer was:
    
    
    =DATEVALUE("05/01/2026")     2026-05-01

1 May. The same file opened on a machine set to British English gives 5 January, from identical text, with nothing anywhere to indicate a choice was made. This is why a dataset can be four months out and completely internally consistent.

Two-digit years have a fixed cutoff rather than a regional one, and it is worth knowing exactly where it sits, because it moves a value by a hundred years rather than a few months.
    
    
    =DATEVALUE("1/1/29")     2029-01-01
    =DATEVALUE("1/1/30")     1930-01-01
    =DATEVALUE("1/1/31")     1931-01-01

29 and below become the twenty-first century; 30 and above become the twentieth. A birth date of 1/1/30 in a customer file is 1930, which is probably right, and a contract date of 1/1/30 is 1930, which is certainly wrong. Nothing warns you.

The defence for both problems is the same and it is boring: insist on four-digit years and an unambiguous format at the point the file is produced, and prefer `yyyy-mm-dd`, which sorts correctly as text as well as reading the same way everywhere. When you cannot control the source, use Text to Columns and declare the order yourself.

Picture the last file somebody emailed you as a CSV. If the day and month in it had swapped, would any number in your report look wrong enough for you to notice?

## 5. Time is the part after the decimal point

If a whole number is a day, a fraction is part of a day. Half of one is noon.
    
    
    =TEXT(46027.5,  "yyyy-mm-dd hh:mm")     2026-01-05 12:00
    =TEXT(46027.75, "yyyy-mm-dd hh:mm")     2026-01-05 18:00

This explains the most common date-filter failure there is. A timestamp of 5 January at 09:14 is stored as 46027.385, which is not equal to 46027, so a filter for exactly 5 January finds nothing, and a lookup on the date misses every row. The values are not wrong; they are just not whole days.

Two fixes, depending on what you want. `=INT(A2)` throws the time away and leaves the date. Or filter with a range instead of an equals, `>= 5 Jan AND < 6 Jan`, which keeps the times and still catches the whole day.

It also explains why durations over 24 hours display strangely. A cell holding 1.5 days formatted as `hh:mm` shows 12:00, because the whole day rolled over. The format `[h]:mm`, with the square brackets, tells Excel to keep counting past 24 and shows 36:00.

## 6. Month, end of month, and grouping

Once you know a date is a number, the month functions are small.
    
    
    =YEAR(A2)                          2026
    =MONTH(A2)                            1
    =DAY(A2)                              5
    =TEXT(A2,"yyyy-mm")             2026-01
    =EOMONTH(A2,0)               2026-01-31    last day of this month
    =EOMONTH(A2,-1)+1            2026-01-01    first day of this month
    =EDATE(A2,1)                 2026-02-05    same day, next month
    =A2+30                       2026-02-04    thirty days later
    =TEXT(A2,"dddd")                 Monday
    =WEEKDAY(A2,2)                        1    Monday, when 1 means Monday

Two of those deserve a note. `EOMONTH(date,-1)+1` is the standard way to get the first of the month, and it is worth memorising because there is no FOMONTH. And `EDATE` is not the same as adding 30: a month later from 5 January is 5 February, while thirty days later is 4 February, and on month ends the difference gets larger.

`TEXT(A2,"yyyy-mm")` is the grouping key I reach for most, because it sorts correctly, it is unambiguous, and January 2025 and January 2026 stay apart. Its one catch: the result is text, so it can no longer be used in date arithmetic. That is fine for a grouping column and wrong for anything else.

You often do not need a helper column at all. Filtering by a date range in a formula works directly on the numbers:
    
    
    =SUMIFS(Orders[Revenue],
            Orders[OrderDate], ">="&DATE(2026,3,1),
            Orders[OrderDate], "<="&DATE(2026,3,31))
    
    2585

2,585 is March's revenue, and building the boundaries with `DATE` rather than typing `">=1/3/2026"` removes the regional ambiguity from section four completely. If your next step is comparing that month with the one before it, [the month-over-month arithmetic](https://michaelnocito.github.io/analyst-prep-kit/guides/sql-month-over-month/) is the same in any tool.

## 7. The 29 February that never happened

Before the explanation: 1900 was not a leap year, because century years are only leap years when divisible by 400. Say what Excel does with 29 February 1900.
    
    
    =TEXT(59,"yyyy-mm-dd")     1900-02-28
    =TEXT(60,"yyyy-mm-dd")     1900-02-29
    =TEXT(61,"yyyy-mm-dd")     1900-03-01
    =N(DATE(1900,2,29))               60

Serial 60 is a day that did not exist. Excel accepts it, formats it, and counts it, and you can see the consequence in a subtraction:
    
    
    =DATE(1900,3,1) - DATE(1900,2,28)     2
    =DATE(2026,3,1) - DATE(2026,2,28)     1

The same span of calendar days is two days in 1900 and one day in 2026. This is a compatibility decision from the 1980s that was kept deliberately so that files from earlier spreadsheet programs would keep working, and it has never been fixed because fixing it would move every date in every existing workbook.

How much should you care? Almost not at all, and exactly once. Any calculation entirely after 1 March 1900 is unaffected, which is all business data. It matters if you ever compute an age or a duration that crosses that date, or if you move serial numbers between Excel and another system that gets 1900 right, in which case dates before March 1900 will be one day out. Knowing the reason takes ten seconds and saves an hour of disbelief.

## 8. The setting that moves every date in the file by four years

There is a second date system, counting from 1904 instead of 1900, and it is a per-workbook setting rather than a per-cell one. Switching it does not convert anything; it changes what the existing numbers mean. Run on one cell holding serial 46027:
    
    
    1900 system      2026-01-05
    1904 system      2030-01-06
    serial 1, under the 1904 system     1904-01-02

Four years and a day, on every date in the workbook at once, with no prompt and no highlighting. You will almost never turn this on deliberately. You meet it by copying dates out of a workbook that has it set, usually an old file that started life on a Mac, into one that does not.

The tell is that a whole column is out by roughly four years and the shift is identical on every row. If you see that, check File, Options, Advanced, and look for the "Use 1904 date system" box in the section for the workbook you are in.

## The full before and after

Same sixteen orders, same question: what did March bring in?

### Before
    
    
    OrderDate arrives as text, left aligned, reading 03/09/2026 and so on.
    
    Pivot:      Group is greyed out
    Sort:       10/01 lands before 2/01, because the sort is alphabetical
    =N(A2):     0
    =B17-B2:    #VALUE!

Four separate symptoms, one cause. The alphabetical sort is worth dwelling on, because it looks like a sort: text comparison puts "10/01/2026" before "2/01/2026", which Excel confirms is `TRUE`, so a date column sorted into a confident-looking order can have October before February.

### After
    
    
    # convert once, in a new column, declaring the order rather than guessing
    Data, Text to Columns, step 3, Date: YMD
    
    # then everything is arithmetic
    =N(A2)                                46027
    =B17-B2                                 140
    =TEXT(A2,"yyyy-mm")                 2026-01
    =SUMIFS(Revenue, Date,">="&DATE(2026,3,1), Date,"<="&DATE(2026,3,31))     2585
    Pivot: Group by Month and Year now available

The claim, and it is the reason to run `=N(A2)` before anything else: **a column of text dates loses sorting, filtering, subtraction and pivot grouping all at once, and the only visible symptom is that they sit on the left of the cell.**

## Edge cases that break dates quietly

Six that get past a first pass.

**A hidden time component.** Dates that came from a system usually carry a time, so a filter for one exact day returns nothing. Test with `=A2-INT(A2)`; anything above zero is a time you cannot see.

**Half the column converted.** After a partial import, some rows are real dates and some are text, and every aggregate is computed over the real ones only. Compare `=COUNT(range)` with the row count, exactly as for numbers stored as text.

**A date that is off by one.** One day out on every row usually means a serial number crossed between two systems with different starting points, or a time zone was applied during an export. Check whether the shift is constant before rebuilding anything.

**The pivot that grouped January twice.** Grouping by Months without also ticking Years merges the same month from different years into one row. On multi-year data, tick both.

**A financial year that does not start in January.** `MONTH` knows nothing about your accounting calendar. Build a small calendar table with a period column and look dates up against it, rather than nesting IFs that nobody can audit.

**Dates that autocorrect.** Excel converts things it thinks are dates on entry, and the conversion is not reversible from the converted value. This is not hypothetical or rare; it is the reason a share of published scientific supplementary files contain dates where gene names should be. Declare a column as Text at import if it holds codes that could pass for dates, the same discipline as [keeping the zeros on a zip code](https://michaelnocito.github.io/analyst-prep-kit/guides/excel-csv-import-leading-zeros/).

## Why this works

Everything on this page follows from one design decision: Excel stores a date as a count of days and keeps the presentation separate from the value. That separation is what makes dates arithmetic. Subtracting two dates works because they are integers; sorting works because integers order; pivot grouping works because a month is a range of integers; and none of it can work on text, because a string has no arithmetic. Once you know the storage, you can predict every symptom on this page instead of memorising them, which is why the first section is the number rather than a list of functions.

The cost of the same separation is that the display cannot be trusted as evidence of the value, and this is the source of an entire class of spreadsheet error. Field audits have repeatedly found errors in a large majority of the operational workbooks examined, with the persistent ones being those that produce a plausible display rather than a visible break (Powell, Baker, & Lawson, 2008, _Decision Support Systems_ , 46(1), 128–138). A text date and a real date look identical; a US-order date and a UK-order date look identical; a 1930 contract and a 2030 contract look identical. In each case the display is doing exactly what it is designed to do and telling you nothing about the value underneath.

The most public example of this class is Excel's habit of converting entries it recognises as dates. A follow-up study of published genomics files found that the problem had grown rather than shrunk in the years after it was first reported, with roughly a third of the papers examined carrying at least one supplementary file containing a gene name that a spreadsheet had turned into a date (Abeysooriya, Soria, Kasu, & Ziemann, 2021, _PLOS Computational Biology_ , 17(7), e1008984). Peer review did not catch it, because there is nothing to catch: the converted cell looks like a perfectly ordinary date.

One note on the cheat sheet below. It is laid out to be covered and recalled rather than reread, since spaced retrieval is one of the few study techniques that consistently survives review of the evidence, while rereading and highlighting consistently do not (Dunlosky, Rawson, Marsh, Nathan, & Willingham, 2013, _Psychological Science in the Public Interest_ , 14(1), 4–58).

## Using this on your own project

Auditing every date column in an inherited workbook is miserable and you will stop at the third sheet. Do this instead, in order.

  1. **Run`=N(A2)` on the first cell of every date column.** Forty-six thousand means real, zero means text. Thirty seconds for the whole workbook.
  2. **Compare`=COUNT(range)` with the row count** to catch a column that is half converted.
  3. **Convert with Text to Columns and declare the order** , DMY or MDY or YMD, rather than letting Excel infer it.
  4. **Check for a hidden time** with `=A2-INT(A2)` before writing any filter that uses an equals sign.
  5. **Build date boundaries with`DATE(y,m,d)`** in formulas, never as typed text, so the file behaves the same on every machine.
  6. **Ask the source for`yyyy-mm-dd` with four-digit years**, once, politely. It is the only fix that stops the problem recurring every month.

If you have paper nearby, one optional sketch is worth five minutes. Draw a number line, mark 46027 on it, and write above the mark every way that same point can be displayed: the ISO date, the long date, the day name, the month name, the week number. Then draw a separate box off the line, unattached, and write a text date in it. That gap between the line and the box is the whole page.

**More detail on this, and more like it.** Every how-to sits in one place on the [guides index](https://michaelnocito.github.io/analyst-prep-kit/guides/): Excel, SQL, Python, and the working habits around them.

## The whole thing on one screen

This is the retrieval sheet. Cover the right column, work down the left, and say each answer out loud before you check it.

| Thing                   | What it does                                                       |
|-------------------------|--------------------------------------------------------------------|
| What a date is          | A count of days. 2026-01-05 is 46027. Day 1 is 1900-01-01.         |
| What a format is        | A costume on that number. It never changes the value.              |
| The text test           | `=N(A2)`. A number means real, 0 means text.                       |
| The other tell          | Left-aligned, and Group greyed out in a pivot.                     |
| Convert, simple         | `=DATEVALUE(A2)` in a new column, then format it.                  |
| Convert, controlled     | Data, Text to Columns, step 3, Date, then declare DMY, MDY or YMD. |
| Convert, bulletproof    | `=DATE(year, month, day)` from the pieces. Nothing to interpret.   |
| 05/01/2026              | Ambiguous. Resolved by the reader's regional settings, silently.   |
| Two-digit years         | 29 and below are the 2000s. 30 and above are the 1900s.            |
| Time                    | The fraction. 0.5 is noon, 0.75 is 18:00.                          |
| Filter finds nothing    | There is a time on the value. Use `INT`, or filter a range.        |
| Over 24 hours           | Format as `[h]:mm` so it does not roll over.                       |
| First of the month      | `=EOMONTH(A2,-1)+1`. There is no FOMONTH.                          |
| Same day next month     | `=EDATE(A2,1)`, which is not the same as adding 30.                |
| Grouping key            | `=TEXT(A2,"yyyy-mm")`. Sorts right, keeps years apart, is text.    |
| Date range in a formula | Build the bounds with `DATE(y,m,d)`, never typed text.             |
| 1900-02-29              | Serial 60, a day that never existed. Kept for compatibility.       |
| 1904 date system        | A workbook setting. Shifts every date by four years and a day.     |

**The one habit to keep.** Run `=N(A2)` on a date column before you write anything that depends on it. Every date problem worth having splits at that one number, and the test costs less than the first guess would. If a date behaves in a way this page does not cover, there is a general [diagnosis loop for being stuck](https://michaelnocito.github.io/analyst-prep-kit/guides/technical-tenacity/).

One last thought, and I would genuinely like other people's answers. The one that cost me an afternoon was a monthly extract where the day and month had swapped for the first twelve days of each month and nowhere else, so eleven twelfths of the file was fine and the totals were only slightly wrong. What has a date done to you, and what finally gave it away?

## References

  * Powell, S. G., Baker, K. R., & Lawson, B. (2008). A critical review of the literature on spreadsheet errors. _Decision Support Systems_ , 46(1), 128–138.
  * Abeysooriya, M., Soria, M., Kasu, M. S., & Ziemann, M. (2021). Gene name errors: Lessons not learned. _PLOS Computational Biology_ , 17(7), e1008984.
  * Dunlosky, J., Rawson, K. A., Marsh, E. J., Nathan, M. J., & Willingham, D. T. (2013). Improving students' learning with effective learning techniques. _Psychological Science in the Public Interest_ , 14(1), 4–58.

---

*The full version of this guide lives on my site: [Excel Dates: Serial Numbers, Text That Looks Like a Date, and How to Fix It](https://michaelnocito.github.io/analyst-prep-kit/guides/excel-dates/).*

*If it was useful: [Buy Me a Coffee](https://buymeacoffee.com/michaelnocito).*
