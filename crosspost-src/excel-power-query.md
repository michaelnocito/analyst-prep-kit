By the end of this page you can load a file into Power Query, clean it with clicks rather than formulas, turn a report laid out for humans into a table laid out for analysis, combine several files into one, and then do the whole job again next month by pressing Refresh. It is about twenty-five minutes.

Here is what to do today, on the file you clean by hand every month. Data, Get Data, From File, From Workbook, pick it, and press Transform Data instead of Load. You are now in the Power Query editor, and the pane on the right called **Applied Steps** is going to fill up with everything you do. That list is the actual deliverable. The cleaned table is just this month's output of it.

The short version: Power Query watches you clean the data once and writes down what you did, so next month the same work is one button.

That loop is the idea the rest of the page rests on, so it gets the picture.

> _The original carries a diagram here. In words: A left to right flow in three parts. On the left is a document shape representing the incoming file, with its corner folded. An arrow leads from it into a tall rounded panel in the middle holding five short horizontal bars stacked vertically and numbered one to five, standing for a recorded list of cleaning steps. A second arrow leads from the panel to a finished table on the right, drawn as a heading strip above four data rows. From the bottom of that finished table a long curved arrow sweeps down below the whole picture, travels back to the far left, and rises to re-enter the document shape from underneath, its arrowhead pointing up into the file. The loop shows the direction of reuse: the file is what changes each month, and the panel of steps in the middle is what stays and runs again._

**About the numbers below.** The worked report and every total on this page were verified in Excel against the sixteen-row orders table used across this set of guides. The Power Query part is a sequence of clicks rather than a formula, so what is given for it is the exact sequence and the row-count check that proves it worked on your machine.

## 1. What Power Query actually is

Before the explanation: you already clean this file every month with formulas and copy-paste. Say what Power Query could give you that another twenty formulas could not.

Repeatability, and a record. A formula transforms the data in the sheet it lives in. Power Query sits in front of the sheet: it reads the source, applies a list of transformations, and puts the result somewhere. Change the source file and press Refresh, and the same list runs again from the top.

Three things follow from that shape, and they are the whole reason to learn it.

**The original is never edited.** Every transformation happens on the way in, so the source file stays exactly as it arrived. That answers the "never clean in place" rule permanently rather than by discipline.

**The steps are visible and reorderable.** Anyone can open the query and read what was done, in order, in words. Try getting that from a column of nested formulas.

**It scales past the grid.** The query engine is not limited to a million rows the way a worksheet is. What lands on the sheet has to fit; what passes through the query does not.

It is also already installed. Power Query is the Get & Transform group on the Data tab in current Excel, it is the same engine behind [Power BI's import experience](https://michaelnocito.github.io/analyst-prep-kit/guides/import-a-csv-into-power-bi/), and the M language it writes is the same in both. Learning it once covers both tools.

## 2. Getting data in, and the button you must press

Three routes cover almost everything.

**From a table on this sheet.** Click inside your data, Data, From Table/Range. If the data is not already [a real table](https://michaelnocito.github.io/analyst-prep-kit/guides/excel-tables/), Excel offers to make one, which is the right answer.

**From a file.** Data, Get Data, From File, then From Workbook, From Text/CSV, or From Folder. The folder option is the underrated one: point it at a directory and every file in it is treated as one dataset, which is how twelve monthly extracts become one table.

**From a database.** Data, Get Data, From Database. The same connection ideas as [connecting Excel to a database](https://michaelnocito.github.io/analyst-prep-kit/guides/connect-excel-to-a-database/), with the transformation steps added on top.

Whichever route, the dialog offers a preview with two buttons: **Load** and **Transform Data**. Press Transform Data. Load drops the raw contents onto a sheet and skips the entire point of the tool. If you have already pressed Load, no harm done: Data, Queries & Connections, right-click the query, Edit, and you are in the editor anyway.

## 3. Applied Steps is the product

The editor has a preview grid in the middle and a pane on the right headed Applied Steps. Every click you make adds a line to that list, with a name.
    
    
    Source
    Promoted Headers
    Changed Type
    Removed Columns
    Filtered Rows
    Trimmed Text
    Renamed Columns

Four things you can do to that list, and all four are what makes it a program rather than a history.

**Click any step** to see the data as it looked at that moment. This is the debugger. When the output is wrong, click down the list until it goes wrong, and you have found the step.

**Delete a step** with the cross beside it. Later steps continue from the one before.

**Drag a step** to reorder it. Filtering before a heavy transformation is faster than after.

**Rename a step** by right-clicking it. "Removed Columns" becomes "Dropped the internal-only fields", and the query starts documenting itself.

Underneath, each step is one line of a language called M, which you can see with View, Advanced Editor. You do not need to write M to use Power Query, and being able to read it turns a mysterious step into an obvious one, in the same way reading SQL beats guessing what a report does.

## 4. The transforms you will use every week

Out of a very long ribbon, these are the ones that come up constantly.

| Transform                | Where             | What it fixes                                                                                                                                                   |
|--------------------------|-------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Use First Row as Headers | Home              | A file whose headings arrived as data.                                                                                                                          |
| Remove Top Rows          | Home, Remove Rows | A title and a blank line above the real table.                                                                                                                  |
| Change Type              | Transform         | Numbers and dates arriving as text.                                                                                                                             |
| Remove Columns           | Home              | The twenty fields nobody needs.                                                                                                                                 |
| Filter Rows              | Column dropdown   | Cancelled records, test rows, other regions.                                                                                                                    |
| Trim and Clean           | Transform, Format | The stray spaces from [the cleaning guide](https://michaelnocito.github.io/analyst-prep-kit/guides/excel-clean-messy-data/), applied to a whole column at once. |
| Split Column             | Home              | "Reyes, Dana" into two fields, by a delimiter or a position.                                                                                                    |
| Replace Values           | Transform         | Consistent renaming, recorded rather than done by hand.                                                                                                         |
| Fill Down                | Transform         | A category written once at the top of a block, blank underneath.                                                                                                |
| Group By                 | Transform         | Summarising before the data reaches the sheet.                                                                                                                  |

Two habits are worth adopting from the first query. **Remove columns early** , because everything downstream gets faster and the preview gets readable. And **filter early** for the same reason.

One caution about Change Type, because it causes more broken refreshes than everything else combined. The step records the exact column names it applied to. If next month's file renames a column or drops one, that step fails and takes the whole refresh with it. That is the same fragility as a hard-coded column number in a lookup, and it has the same feel when it breaks.

## 5. Unpivot: the one that changes what you can do

Before the explanation: here is a monthly report as a human would lay it out. Say why a pivot table cannot summarise it by month.

| Region | Jan  | Feb | Mar  | May |
|--------|------|-----|------|-----|
| North  | 1120 | 425 | 440  | 510 |
| South  | 850  | 660 | 280  | 880 |
| East   | 660  | 680 | 1100 | 600 |
| West   | 0    | 480 | 765  | 440 |

Because there is no month column. "Month" is not data here, it is a set of column headings, and a pivot table can only group by a field. Nor can you filter to February, or compare months in a formula, or add June without changing the shape of every formula that reads the table. The layout is fine for reading and useless for analysis.

The fix is one click. Select the Region column, right-click it, **Unpivot Other Columns**. Every month column collapses into two new columns, one holding the old heading and one holding the value.
    
    
    Region   Attribute   Value
    North    Jan          1120
    North    Feb           425
    North    Mar           440
    North    May           510
    South    Jan           850
    South    Feb           660
    South    Mar           280
    South    May           880
    East     Jan           660
    East     Feb           680
    East     Mar          1100
    East     May           600
    West     Jan             0
    West     Feb           480
    West     Mar           765
    West     May           440

Four rows and four month columns became sixteen rows, which is four times four, and that multiplication is your check that nothing went missing. Rename Attribute to Month and Value to Revenue, and now every month question is easy: group by month, filter to March, compare Region and Month in a pivot, add June by dropping in a file rather than editing anything.

Verify by total, not by eye. The wide report's sixteen cells add to 9,890, checked in Excel, and that is the number the unpivoted Revenue column has to come back with. Put both on the sheet and compare them.
    
    
    =SUM(wide report block)      9890
    =SUM(Revenue)                must equal it
    =ROWS(long table)            must equal 4 x 4

Choose Unpivot _Other_ Columns rather than plain Unpivot Columns, because the first one says "keep Region, collapse everything else", which stays correct when a new month arrives. Plain Unpivot names the columns it collapses, and next month there is a column it has never heard of.

Picture the report you get emailed most often. If its column headings are things rather than fields, dates, regions, product names, then it is one right-click away from being a table you can actually use.

## 6. Append and Merge

Two different jobs with names that get mixed up constantly.

**Append** stacks tables with the same columns on top of each other. Twelve monthly files become one twelve-month table. Home, Append Queries, and if you are appending files from a folder the From Folder connector does it for you.

The thing to check afterwards is arithmetic: the appended row count must equal the sum of the parts. If it does not, one file had a different column name and its values landed in a new column full of blanks.

**Merge** brings columns from a second table alongside, matching on a key. Home, Merge Queries, pick the key column in each, choose the join kind. It is the same operation as a lookup and the same operation as a SQL join, and it has the same two failure modes: rows that find no match, and rows that find several and multiply.

Power Query is unusually good here, because the merge dialog tells you how many of your rows matched before you commit. Read that number. If 4,812 of 5,000 rows matched, the 188 are a finding, and the join kind you choose decides whether they vanish or stay visible.

## 7. Close and Load, and the three destinations

Home, Close & Load has a dropdown, and using the dropdown rather than the button is worth the extra click. **Close & Load To** offers three real choices.

**Table.** The result lands on a worksheet as a real Excel table. Use this when people need to look at the rows or build formulas against them. Remember it still has to fit on a sheet.

**Only Create Connection.** The query exists and produces nothing visible. This is right for intermediate queries, the ones that exist to be merged or appended into something else, and it keeps the workbook small and the sheet list short.

**Add to the Data Model.** The result goes into the workbook's internal data model rather than onto a sheet, which is what you want for large results, for relationships between tables, and for pivot tables that need Distinct Count.

A useful default: load the finished thing to a table, and set every intermediate query to Only Create Connection. A workbook with nine queries and one visible table is well organised; a workbook with nine sheets of intermediate output is the thing you were trying to escape.

## 8. Refresh, and the step that breaks it

Data, Refresh All, or right-click the output table and Refresh. The query runs from Source down through every step and rewrites the output.

When it breaks, it is nearly always one of four things, and the Applied Steps pane tells you which because the failure names the step.

**The file moved.** The Source step holds a full path. Fix it in Data, Queries & Connections, or better, Data Source Settings, so the path lives in one place.

**A column was renamed upstream.** Changed Type, Removed Columns and Renamed Columns all record column names and all fail when one changes. This is the most common cause by a distance.

**A column arrived with different content.** A text value in a column typed as a number produces errors in the preview, which are cells rather than a stopped query, so the refresh appears to succeed. Look for the error count in the column header strip.

**Privacy levels.** Combining a local file with a database sometimes triggers a privacy prompt, and in an automated context it fails instead of asking.

The habit that catches all four: put a row count on the sheet next to the loaded table, `=ROWS(QueryOutput)`, and glance at it after refreshing. A query that returns 0 rows because its filter no longer matches anything refreshes perfectly happily.

## The full before and after

Same job: turn a monthly regional report into something you can analyse.

### Before
    
    
    Open the file. Delete the two title rows. Copy the block to the working sheet.
    Add a Month column by hand. Copy North's four numbers, paste, type "Jan" four times.
    Repeat for three more regions. Fix the trailing spaces. Sort. Build the pivot.
    Next month, do all of it again.

About forty minutes, entirely undocumented, and slightly different every time because it is being reconstructed from memory. Nobody else can do it, and nobody can check it.

### After
    
    
    Source
    Removed Top Rows            2
    Promoted Headers
    Unpivoted Other Columns     Region kept; Jan Feb Mar May collapsed
    Renamed Columns             Attribute -> Month, Value -> Revenue
    Changed Type
    Trimmed Text                Region
    Filtered Rows               Revenue is not null
    
    Close & Load To -> Table
    
    check on the sheet:  =ROWS(LongReport)   16     four regions x four months
                         =SUM(Revenue)     9890     matches the wide report

Next month is one Refresh. The eight steps are readable by anyone who opens the query, in order, in words. And the two check formulas mean a refresh that quietly returns the wrong thing is visible rather than assumed.

The claim, and it is the reason to spend an hour learning the editor: **the recurring work is not the cleaning, it is doing the cleaning again, and a query converts that from forty minutes a month into one button.**

## Edge cases that break a query quietly

Six worth knowing before they happen.

**Blanks and zeros through an unpivot.** A blank cell and a zero are not the same input, so a report with gaps in it may produce fewer rows than the rows times columns you expected. Check the count against the multiplication every time; that is what the check is for.

**Auto-detected data types on a partial preview.** Power Query types a column by looking at the first rows, so a column that is numeric for two hundred rows and then holds "n/a" gets typed as a number and errors later. Set important types deliberately.

**The Changed Type step that names every column.** Delete it if you do not need it, or replace it with types on just the columns that matter. It is the single biggest cause of a refresh failing after an upstream change.

**Filters recorded as a list of values.** Clicking checkboxes in a column filter records "keep these specific values", so a new value that appears next month is silently excluded. Use a condition, Text Does Not Contain, Greater Than, instead of a tick list, whenever the values can change.

**Locale on dates and decimals.** A file written with day-first dates or comma decimals needs Using Locale in the Change Type dialog. Without it the conversion either errors or, worse, succeeds with the day and month swapped.

**A query pointed at a file in your Downloads folder.** It works perfectly until somebody else opens the workbook. Put shared sources somewhere shared, and keep the path in Data Source Settings rather than buried in the Source step.

## Why this works

The unpivot is not a formatting convenience, it is a move between two different data structures, only one of which tools can work with. The principle has a name and a paper: data is easiest to analyse when each variable is a column and each observation is a row, and a very large share of practical difficulty comes from data that violates that, most often by having values, months, years, product names, sitting in the column headings where variable names belong (Wickham, 2014, _Journal of Statistical Software_ , 59(10), 1–23). The wide report in section five is exactly that violation, and Unpivot Other Columns is exactly its repair. Once you can name the problem you stop seeing it as "the file is awkward" and start seeing it as one predictable click.

The other half, the recorded step list, is also a researched idea rather than a Microsoft feature. Interactive data cleaning systems were designed around the insight that the expensive part is discovering what needs doing, so the tool should let a person work by direct manipulation while quietly accumulating a reusable transformation program underneath, one that can be inspected, undone and replayed on new data (Raman & Hellerstein, 2001, _Proceedings of the 27th International Conference on Very Large Data Bases_ , 381–390). Applied Steps is that idea shipped. It explains why the pane is on the right of the screen rather than hidden in a menu, and why every step has a name you are allowed to change.

One note on the cheat sheet below. It is built to be covered and recalled rather than reread, because retrieving something from memory produces markedly better retention than studying it again, even when rereading feels more productive at the time (Karpicke & Blunt, 2011, _Science_ , 331(6018), 772–775).

## Using this on your own project

Converting every manual process at once is miserable and you will abandon it. Do this instead, in order.

  1. **Pick the file you clean most often** , not the hardest one. The value is in the repetition, so the monthly one beats the interesting one.
  2. **Press Transform Data, not Load.** Then do the cleaning you would have done anyway, by clicking.
  3. **Rename every step** as you go. Ten seconds each, and the query explains itself to the next person, including you in March.
  4. **Unpivot anything whose headings are values.** Months, years, regions, product names in the header row all mean the same thing.
  5. **Load the final query to a table and everything else to connection only.**
  6. **Put a row count and a total beside the output** , then test the whole thing by refreshing against last month's file and checking both numbers.

If you have paper nearby, one optional sketch is worth five minutes. Write down, in order, every action you take on this month's file, one line each, from opening it to the finished table. That list is your Applied Steps pane before you have opened the editor, and most people find it is between six and ten lines, which is much less frightening than "learn Power Query".

**More detail on this, and more like it.** Every how-to sits in one place on the [guides index](https://michaelnocito.github.io/analyst-prep-kit/guides/): Excel, SQL, Python, and the working habits around them.

## The whole thing on one screen

This is the retrieval sheet. Cover the right column, work down the left, and say each answer out loud before you check it.

| Thing                   | What it does                                                             |
|-------------------------|--------------------------------------------------------------------------|
| What it is              | A recorded list of transformations that runs again on Refresh.           |
| Where it lives          | Data tab, Get & Transform group. Already installed.                      |
| The button to press     | Transform Data, never Load, on the import preview.                       |
| Applied Steps           | The right-hand pane. The actual product. Click a step to time-travel.    |
| Rename a step           | Right-click it. The query becomes its own documentation.                 |
| M                       | The language underneath. View, Advanced Editor. Reading it is enough.    |
| Remove and filter early | Faster, and the preview becomes readable.                                |
| Changed Type            | Records column names. The commonest cause of a broken refresh.           |
| Unpivot Other Columns   | Headings that are values become one column of labels and one of numbers. |
| The unpivot check       | Rows times collapsed columns equals the new row count.                   |
| Append                  | Stack tables with the same columns. Check the row counts add up.         |
| Merge                   | Join on a key. Read the match count before committing.                   |
| From Folder             | A whole directory of files treated as one dataset.                       |
| Close & Load To         | Table, connection only, or the data model.                               |
| Connection only         | The right setting for every intermediate query.                          |
| Refresh check           | `=ROWS(output)` on the sheet. Zero rows refreshes happily.               |
| Filter by tick list     | Records specific values. New values are silently dropped.                |

**The one habit to keep.** Rename every step as you create it. A query with steps called "Removed the cancelled orders" and "Split the name into two fields" can be handed to anyone; a query with eleven steps called Changed Type is a black box you will also not understand in six months. If a refresh fails in a way this page does not cover, there is a general [diagnosis loop for being stuck](https://michaelnocito.github.io/analyst-prep-kit/guides/technical-tenacity/).

One last thought, and I would genuinely like other people's answers. The first thing I ever automated this way was a forty-minute monthly file that I had been doing for over a year, and the query took an afternoon. What is the file you are still cleaning by hand, and what has stopped you turning it into steps?

## References

  * Wickham, H. (2014). Tidy data. _Journal of Statistical Software_ , 59(10), 1–23.
  * Raman, V., & Hellerstein, J. M. (2001). Potter's Wheel: An interactive data cleaning system. _Proceedings of the 27th International Conference on Very Large Data Bases_ , 381–390.
  * Karpicke, J. D., & Blunt, J. R. (2011). Retrieval practice produces more learning than elaborative studying with concept mapping. _Science_ , 331(6018), 772–775.

---

*The full version of this guide lives on my site: [Power Query for Beginners: The Steps That Run Again Next Month](https://michaelnocito.github.io/analyst-prep-kit/guides/excel-power-query/).*

*If it was useful: [Buy Me a Coffee](https://buymeacoffee.com/michaelnocito).*
