By the end of this page you can pull a distinct list out of a column, extract every row matching a condition, sort a result without touching the source, chain all three into one line, and read the two error messages that only exist in this part of Excel. It is about twenty-five minutes, and every output below was produced by running the formula in Excel on a sixteen-row table.

Here is what to do right now, on a column you keep de-duplicating by hand. Click an empty cell to the right of your data and type `=SORT(UNIQUE(A2:A500))`. Press Enter once. A sorted list of every distinct value appears below the cell, it updates itself when the data changes, and you never touch it again.

The short version: a formula can return more than one value, and Excel puts the extra values in the cells underneath. That is called spilling, and it is the whole feature.

One formula filling many cells is the idea, so it gets the picture.

> _The original carries a diagram here. In words: Two columns of five stacked cells stand side by side, each column headed by a short label. The left column is headed five formulas, and every one of its five cells carries a small dark marker in its top-left corner, meaning each cell holds its own formula; the five cells are separate, each with its own light border. The right column is headed one formula. Only its top cell carries the marker, and the four cells beneath it are unmarked. A single heavy border is drawn around the whole right-hand column, enclosing all five cells as one object rather than five. The two columns contain the same values in the same order, so nothing about the result differs; what differs is how many places the logic lives._

**Every result on this page is real.** The sixteen-row orders table used across this set of guides, with every formula run in Excel and its spilled output copied back. These functions need a current version of Excel; if yours refuses them with `#NAME?`, the rest of this set of guides still applies to you and this page does not yet.

## 1. What spilling is

Before the explanation: you type one formula into one cell and press Enter. Say how many cells you expect to change.

As many as the answer needs. Ask for the distinct regions and Excel returns four values, so it fills four cells:
    
    
    =UNIQUE(Orders[Region])
    
    North
    South
    East
    West

Only the top cell holds a formula. The three below it hold the overflow, and they are not editable on their own; click one and the formula bar shows the formula greyed out, because it belongs to the cell above. Excel draws a thin blue border around the whole block to show it is one thing.

Two consequences are worth having straight away. The block resizes itself: add a fifth region to the data and a fifth row appears, with nothing to drag. And you cannot type into the cells it occupies, which is the source of the one new error message this feature has.

Notice the order it came back in: North, South, East, West. That is the order the values first appear in the data, not alphabetical. UNIQUE does not sort, which is why the next function exists.

## 2. UNIQUE, SORT and FILTER

Three functions cover most of what anyone needs.

**UNIQUE** returns the distinct values.
    
    
    =SORT(UNIQUE(Orders[Region]))       East, North, South, West
    =SORT(UNIQUE(Orders[Product]))      Chair, Desk, Lamp
    =COUNTA(UNIQUE(Orders[Region]))     4

That last line is worth adopting as a habit on its own. A distinct count that updates itself is the cheapest early warning there is: four regions that quietly become six means somebody's data has a spelling problem, which is the whole argument of [the cleaning guide](https://michaelnocito.github.io/analyst-prep-kit/guides/excel-clean-messy-data/) in one formula.

**SORT** orders a range without touching it. `SORT(array, column, order)`, where order is 1 for ascending and −1 for descending.
    
    
    =SORT(Orders[Revenue], 1, -1)
    1100, 880, 880, 850, 765, 680, 660, 660, 600, 510, 480, 440, 440, 425, 280, 240
    
    =TAKE(SORT(Orders[Revenue], 1, -1), 3)
    1100, 880, 880

Sorting with a formula rather than with the Sort button matters more than it sounds. The button rearranges your data permanently and takes any formula that referred to a row number with it. A SORT formula produces a sorted copy, leaves the source alone, and re-sorts itself when the numbers change.

**FILTER** returns the rows that meet a condition.
    
    
    =FILTER(Orders[OrderID], Orders[Region]="North")
    1001, 1004, 1007, 1011, 1014
    
    =ROWS(FILTER(Orders[OrderID], Orders[Region]="North"))       5
    =SUM(FILTER(Orders[Revenue], Orders[Region]="North"))     2495

Read the arguments as a sentence: give me _this_ , where _that_ is true. The first argument is what you want back and the second is a test, and the two can be different columns, which is what separates FILTER from the filter button.

And notice that a FILTER can be wrapped in anything. `SUM` of a filtered column is a conditional total, the same answer `SUMIFS` gives, and 2,495 is North's revenue either way. The difference is that the FILTER version can return the rows themselves when you want to look at them.

## 3. Two or more conditions in a FILTER

Before the explanation: FILTER has no place to put AND or OR. Say how you would ask for East orders over 600.

With arithmetic. Multiply the conditions for AND, add them for OR, and wrap each one in brackets.
    
    
    =FILTER(Orders[OrderID], (Orders[Region]="East") * (Orders[Revenue]>600))
    1003, 1006, 1010                                          3 rows
    
    =ROWS(FILTER(Orders[OrderID], (Orders[Region]="East") + (Orders[Region]="West")))
    7 rows

The reason is that a condition produces TRUE and FALSE, which behave as 1 and 0 in arithmetic. Multiplying gives 1 only when both are 1, which is AND. Adding gives at least 1 when either is 1, which is OR. Once you have seen that, the syntax stops looking arbitrary.

Do not reach for the `AND` and `OR` functions here. They collapse a whole array down to one TRUE or FALSE, so the filter either keeps every row or none, which is a wrong answer rather than an error message.

## 4. When nothing matches

Before the explanation: you filter for a region that does not exist in the data. Predict what appears in the cell.
    
    
    =FILTER(Orders[OrderID], Orders[Region]="Central")
    
    #CALC!

`#CALC!` is a newer error and it means the formula produced an empty array, which is not something a cell can display. It is not a mistake in your formula; it is Excel telling you the answer is nothing.

FILTER has a third argument for exactly this, and using it is better than wrapping the whole thing in an error handler:
    
    
    =FILTER(Orders[OrderID], Orders[Region]="Central", "no orders")
    
    no orders

The third argument fires only for the empty case, so a genuine problem in the formula still surfaces as its own error. Wrapping in `IFERROR` instead would hide both, which is the same trade [IFERROR always asks you to make](https://michaelnocito.github.io/analyst-prep-kit/guides/excel-iferror/), and here there is no reason to accept it because a purpose-built argument exists.

## 5. The spill reference, A1#

A spilled block changes size, so referring to it by address is a problem waiting for next month. The hash suffix solves it: `C1#` means "whatever C1 spilled into, however big that is now".
    
    
    C1:  =UNIQUE(Orders[Region])        spills into C1:C4
    
    =COUNTA(C1#)                        4
    =TEXTJOIN("/", TRUE, C1#)           North/South/East/West

This is what makes dynamic arrays compose into a small system rather than staying single clever formulas. Spill a distinct list of regions, then point a chart, a dropdown, or a column of SUMIFS at `C1#`, and all of them grow when a region is added. A cell reference like `C1:C4` would not.

It also gives you a much better data-validation list than a fixed range: put `=$C$1#` in the Source box of a dropdown and the options maintain themselves from the data, which pairs directly with [the dropdown guide's](https://michaelnocito.github.io/analyst-prep-kit/guides/excel-data-validation/) argument that a list should live somewhere it can grow.

## 6. #SPILL! and what causes it

Before the explanation: your UNIQUE formula worked yesterday and today shows `#SPILL!`. Say what changed.

Something is in the way. A spill needs every cell it wants to occupy to be empty, and if even one is not, the whole formula refuses rather than overwriting anything. Here is the run: the formula spilled into C1:C4 correctly, then a value was typed into C3.
    
    
    before               North, South, East, West     COUNTA(C1#) = 4
    after typing in C3   #SPILL!                      COUNTA(C1#) = 1

Note the second effect. Anything referring to the spill reference now sees one cell instead of four, so a chart, a dropdown or a total built on `C1#` quietly shrinks to the error cell. The error is loud; the knock-on is not.

Excel is helpful about finding the blockage: click the warning triangle on the error cell and choose Select Obstructing Cells. Four causes cover nearly everything.

**Something is in the range** , including a stray space typed years ago. That is the case above.

**The spill would run off the sheet.** A formula in row 1048000 has nowhere to put twenty rows.

**The spill area is inside a merged cell.** Merged cells cannot receive a spill.

**The formula is inside a table.** Which gets its own section, because it is the one people meet by accident.

## 7. Chaining them, and the rest of the family

The functions nest, and reading them inside out gives you a sentence. This one is the pattern I use most: take the rows that qualify, reduce them to distinct values, and sort the result.
    
    
    =SORT(UNIQUE(FILTER(Orders[Rep], Orders[Revenue]>600)))

UNIQUE can also work across more than one column, which is how you get every combination that actually occurs rather than every combination that could:
    
    
    =ROWS(UNIQUE(CHOOSE({1,2}, Orders[Region], Orders[Product])))     12

Twelve region-and-product pairs out of sixteen orders, which happens to be all four regions times all three products, so every region sold every product. A pivot table would show you the same thing as a grid; this gives it to you as a list a formula can use.

Four more worth knowing by name.
    
    
    =SORTBY(Orders[OrderID], Orders[Region], 1, Orders[Revenue], -1)
    sorts by one column and returns another; here, by region then by revenue descending,
    so the first order out is 1010
    
    =SEQUENCE(3)         1, 2, 3            a column of numbers
    =SEQUENCE(1,4)       1, 2, 3, 4         a row of numbers
    =TAKE(array, 3)                          the first three rows
    =TEXTJOIN(", ", TRUE, SORT(UNIQUE(Orders[Region])))
    East, North, South, West                 a spill flattened into one cell

`SORTBY` is the one people miss. It sorts a result using columns that are not in the result, so you can list order numbers in revenue order without the revenue column being on screen.

Picture your own most-repeated sheet task for a moment: the tab where you copy a column, remove duplicates, sort it, and paste it somewhere. Which single line above replaces the whole of that?

## 8. The one place a spill will not go

Before the explanation: [tables](https://michaelnocito.github.io/analyst-prep-kit/guides/excel-tables/) are the right home for data and dynamic arrays are the modern way to write formulas. Say what happens when you put one inside the other.
    
    
    a cell inside a table:  =UNIQUE(Orders[Region])
    
    #SPILL!

A table cannot contain a spilled result. The reason is structural rather than arbitrary: a table's job is one row per record with every column the same length, and a formula that decides for itself how many rows it needs would break that promise. So the two features that are individually the best practice in Excel do not compose, and the workaround is simply to put spilling formulas on the sheet outside any table.

That is not the same as saying they cannot read a table. Every formula on this page reads `Orders[Region]`, a table column, and spills its answer onto the sheet beside it. Tables in, arrays out.

## The full before and after

Same job: a live list of the regions, and this month's large orders.

### Before
    
    
    Copy column D to a spare sheet.
    Data, Remove Duplicates.
    Sort A to Z.
    Filter the main table to Revenue > 600, copy the visible rows, paste them somewhere.
    Next month, do all of it again, and remember the pasted list is now out of date.

Five manual steps, an unknown number of stale copies scattered through the workbook, and no way to tell by looking whether any of them still matches the data.

### After
    
    
    =SORT(UNIQUE(Orders[Region]))                     East, North, South, West
    =COUNTA(UNIQUE(Orders[Region]))                   4
    =FILTER(Orders[OrderID], Orders[Revenue]>600, "none")
    =SUM(FILTER(Orders[Revenue], Orders[Region]="North"))    2495

Four formulas, no copies, and every one of them updates when a row is added. The distinct count sitting beside the list is the part worth keeping longest: it is a one-cell alarm for the data problems that would otherwise be found weeks later.

The claim, and it is the reason to learn the three function names: **copy, de-duplicate, sort, paste is four manual steps producing a snapshot, and`=SORT(UNIQUE(...))` is one formula producing something that is still correct next month.**

## Edge cases that catch people

Six worth knowing before they happen.

**Deleting the top cell deletes the whole block.** The cells below hold no formula, so they vanish with it. Anything referring to the block by `#` goes with them.

**Inserting a row through a spill area.** The block is one object and does not accept a row through the middle, so the insert either moves the whole block or triggers `#SPILL!`. Leave a clear column for spills rather than parking them among other content.

**A blank cell in the source column.** UNIQUE treats a blank as a value and returns a zero for it, so a distinct list can come back one longer than expected with a stray 0 at the end. Filter it out: `=SORT(UNIQUE(FILTER(range, range<>"")))`.

**Sending the file to an older Excel.** These functions do not exist there, and the formulas arrive as `_xlfn.UNIQUE` and show `#NAME?`. If a workbook has to travel, check the recipient's version before rebuilding it around spills.

**Whole-column references.** `=UNIQUE(A:A)` asks Excel to consider a million rows and usually returns a million-row spill, most of it blank. Point at the table column instead.

**Volume.** A spill of tens of thousands of rows is one formula and a lot of cells, and several of those on one sheet will slow a workbook noticeably. Summarise with a pivot when the answer is a summary; spill when the answer is a list.

## Why this works

The change here is not that Excel gained three functions. It is that a formula is now allowed to return a whole array rather than a single value, and that difference reaches back to some of the oldest thinking in computing about notation. Iverson's argument, made when he collected the Turing Award, was that a notation which lets you operate on whole collections at once does more than save keystrokes: it changes which thoughts are easy to have, because operations that would otherwise require an explicit loop become a single expression you can read and manipulate (Iverson, 1980, _Communications of the ACM_ , 23(8), 444–465). `SORT(UNIQUE(FILTER(...)))` is exactly that. In the old notation each of those three ideas needed its own column of copied formulas, and the shape of the answer had to be decided in advance by how far you dragged.

The practical payoff is fewer places for a mistake to live. Spreadsheet audits consistently find errors in a large majority of the operational workbooks examined, and copied formulas are a well-known contributor: one wrong copy among four hundred looks exactly like the other three hundred and ninety-nine (Panko, 1998, _Journal of End User Computing_ , 10(2), 15–21). A spilled result cannot have an inconsistent row, because there is only one formula. That property is worth more than the brevity.

One note on the cheat sheet below. It is built to be covered and recalled rather than reread, because retrieval practice produces durable retention where rereading produces familiarity, and the two feel similar while you are doing them (Roediger & Butler, 2011, _Trends in Cognitive Sciences_ , 15(1), 20–27).

## Using this on your own project

Rewriting a whole workbook in dynamic arrays is miserable and unnecessary. Do this instead, in order.

  1. **Find the manual de-duplicate.** Every workbook has one column somebody copies, de-duplicates and sorts. Replace it with `=SORT(UNIQUE(...))` and delete the stale copy.
  2. **Put a distinct count beside it** , `=COUNTA(UNIQUE(...))`, and treat any change in that number as news.
  3. **Replace pasted filtered extracts with FILTER** , and give every FILTER its third argument so an empty result says so in words.
  4. **Point dropdowns and charts at the spill reference** , `=$C$1#`, so they grow with the list.
  5. **Keep spills outside tables** , in their own column, with clear space beneath them.
  6. **Check the version** of anyone the file goes to before you build a whole workbook on it.

If you have paper nearby, one optional sketch is worth five minutes. Draw the manual routine you are replacing as a chain of boxes: copy, paste, de-duplicate, sort, paste again. Then write one function name over each box. Most people find three of their five boxes collapse into one formula, and the two that do not are the ones worth thinking about.

**More detail on this, and more like it.** Every how-to sits in one place on the [guides index](https://michaelnocito.github.io/analyst-prep-kit/guides/): Excel, SQL, Python, and the working habits around them.

## The whole thing on one screen

This is the retrieval sheet. Cover the right column, work down the left, and say each answer out loud before you check it.

| Thing                          | What it does                                                    |
|--------------------------------|-----------------------------------------------------------------|
| Spilling                       | One formula returns many values and fills the cells below.      |
| Where the formula lives        | Only the top cell. The rest is output.                          |
| `UNIQUE(range)`                | Distinct values, in the order they first appear. Does not sort. |
| `SORT(array, col, order)`      | A sorted copy. −1 for descending. Source untouched.             |
| `SORTBY`                       | Sort one thing by columns that are not in the result.           |
| `FILTER(what, test, if_empty)` | The rows where the test is true.                                |
| AND in a FILTER                | Multiply the conditions: `(a)*(b)`.                             |
| OR in a FILTER                 | Add them: `(a)+(b)`.                                            |
| Do not use                     | The AND and OR functions. They collapse the array to one value. |
| `#CALC!`                       | The answer is an empty array. Use FILTER's third argument.      |
| `#SPILL!`                      | Something is in the way. Select Obstructing Cells finds it.     |
| Spill reference                | `C1#` means the whole block, whatever size it is now.           |
| Blocked spill knock-on         | `COUNTA(C1#)` drops to 1. Charts and lists shrink silently.     |
| Inside a table                 | `#SPILL!`. Tables in, arrays out.                               |
| Distinct count                 | `=COUNTA(UNIQUE(range))`. The cheapest data alarm there is.     |
| Flatten to one cell            | `=TEXTJOIN(", ", TRUE, spill)`.                                 |
| Older Excel                    | Arrives as `#NAME?`. Check the recipient's version.             |

**The one habit to keep.** Put `=COUNTA(UNIQUE(column))` beside every text column you group or filter by. It is one cell, it costs nothing, and it turns the most common data problem in any workbook, a category that has quietly split in two, into a number that visibly changed. If a spill misbehaves in a way this page does not cover, there is a general [diagnosis loop for being stuck](https://michaelnocito.github.io/analyst-prep-kit/guides/technical-tenacity/).

One last thought, and I would genuinely like other people's answers. The first thing I replaced with a spill was a "reference lists" tab that four other sheets read from, which had last been refreshed by hand eight months earlier and was missing two whole categories. What is the stale pasted list still sitting in something you own?

## References

  * Iverson, K. E. (1980). Notation as a tool of thought. _Communications of the ACM_ , 23(8), 444–465.
  * Panko, R. R. (1998). What we know about spreadsheet errors. _Journal of End User Computing_ , 10(2), 15–21.
  * Roediger, H. L., & Butler, A. C. (2011). The critical role of retrieval practice in long-term retention. _Trends in Cognitive Sciences_ , 15(1), 20–27.

---

*Originally published on Analyst Prep Kit: [Excel Dynamic Arrays: FILTER, UNIQUE and SORT in One Formula](https://michaelnocito.github.io/analyst-prep-kit/guides/excel-dynamic-arrays/)*

*Visit the site for more beginner data analysis guides and free resources: [the full guide archive](https://michaelnocito.github.io/analyst-prep-kit/guides/) covers SQL, Excel, Power BI, Tableau, Python and statistics, and the [practice kits](https://michaelnocito.github.io/analyst-prep-kit/) run in your browser with nothing to install.*

*If it was useful: [Buy Me a Coffee](https://buymeacoffee.com/michaelnocito).*
