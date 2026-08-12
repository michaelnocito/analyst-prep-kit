By the end of this page you can turn a flat list of rows into a summary in about thirty seconds, change what it summarizes by dragging one field, show each row as a percentage instead of a total, group dates into months, and say out loud what every number in the result stands for. It takes about twenty-five minutes to read, and every result printed below came out of Excel, on the sixteen-row table shown in full further down.

Here is what to do right now, in your own file. Click any cell inside your data. Insert, then PivotTable, then OK. Drag one text column into **Rows** and one number column into **Values**. You now have a summary. Then do the one thing most people skip: check that the Grand Total matches the total of the original column. If it does not, the pivot is reading a different range than you think.

The short version: whatever field you drop into Rows becomes the list of labels down the left, and whatever you drop into Values becomes the number beside each label. Everything else is a setting on those two choices.

That swap, field into box then box into column, is the idea the whole page rests on, so it gets the picture.

> _The original carries a diagram here. In words: Two drop boxes sit side by side across the top, and the finished pivot table sits below them. The left box is outlined in blue and labelled Rows; inside it is a blue chip carrying the field name Region. The right box is outlined in amber and labelled Values; inside it is an amber chip carrying the field name Revenue. Below each box a short arrow in the box's own colour points straight down into the table. The table beneath has two columns and five rows. Its left column is shaded the same blue as the Rows box and holds the four region names East, North, South and West, with a heavier-bordered Total row at the bottom. Its right column is shaded the same amber as the Values box and holds the matching numbers 3,040, 2,495, 2,670 and 1,685, with the total 9,890 in the bottom row. The colours make the pairing plain: the field dropped in Rows produced the column of labels, and the field dropped in Values produced the column of numbers._

**Every result on this page is real.** One sixteen-row orders table, printed in full below, and every pivot output was produced by building the pivot in Excel and reading what came back. This table is the same one used across the whole Excel set of guides, so a habit you pick up here has somewhere to go next.

Here is the source data. Sixteen orders, five columns you can group by and two you can add up. Revenue is not typed in; it is a calculated column, `Units × UnitPrice`.

| OrderID | OrderDate  | Rep        | Region | Product | Units | UnitPrice | Revenue |
|---------|------------|------------|--------|---------|-------|-----------|---------|
| 1001    | 2026-01-05 | Dana Reyes | North  | Desk    | 4     | 220       | 880     |
| 1002    | 2026-01-12 | Owen Park  | South  | Chair   | 10    | 85        | 850     |
| 1003    | 2026-01-19 | Priya Shah | East   | Desk    | 3     | 220       | 660     |
| 1004    | 2026-01-26 | Dana Reyes | North  | Lamp    | 6     | 40        | 240     |
| 1005    | 2026-02-02 | Owen Park  | South  | Desk    | 3     | 220       | 660     |
| 1006    | 2026-02-09 | Priya Shah | East   | Chair   | 8     | 85        | 680     |
| 1007    | 2026-02-16 | Dana Reyes | North  | Chair   | 5     | 85        | 425     |
| 1008    | 2026-02-23 | Sam Okafor | West   | Lamp    | 12    | 40        | 480     |
| 1009    | 2026-03-02 | Owen Park  | South  | Lamp    | 7     | 40        | 280     |
| 1010    | 2026-03-09 | Priya Shah | East   | Desk    | 5     | 220       | 1100    |
| 1011    | 2026-03-16 | Dana Reyes | North  | Desk    | 2     | 220       | 440     |
| 1012    | 2026-03-23 | Sam Okafor | West   | Chair   | 9     | 85        | 765     |
| 1013    | 2026-05-04 | Priya Shah | East   | Lamp    | 15    | 40        | 600     |
| 1014    | 2026-05-11 | Dana Reyes | North  | Chair   | 6     | 85        | 510     |
| 1015    | 2026-05-18 | Owen Park  | South  | Desk    | 4     | 220       | 880     |
| 1016    | 2026-05-25 | Sam Okafor | West   | Desk    | 2     | 220       | 440     |

Total revenue is 9,890 and total units are 101. Write those two numbers down. They are the check every pivot on this page has to pass.

## 1. Build one in four clicks

Do this in your own file as you read. It works on any list where row one is headings and every row below is one record.

  1. Click any single cell inside the data. Do not select a range. Excel finds the edges for you, and letting it do that is also a test: if the range it proposes is wrong, you have a blank row or column in the middle of your data.
  2. **Insert** , then **PivotTable**.
  3. Leave _New Worksheet_ selected. Click **OK**.
  4. In the field list on the right, drag **Region** into the **Rows** box and **Revenue** into the **Values** box.

Here is exactly what Excel returns.
    
    
    Row Labels    Sum of Revenue
    East                    3040
    North                   2495
    South                   2670
    West                    1685
    Grand Total             9890

Grand Total is 9,890, which matches the total we wrote down. The pivot is reading every row. Check one region by hand as well: East is orders 1003, 1006, 1010 and 1013, so 660 + 680 + 1100 + 600 = 3,040. That is the whole verification habit, and it costs ten seconds.

One thing already worth noticing. The regions came out East, North, South, West, which is alphabetical order, not an order anyone chose. A pivot sorts its labels alphabetically until you tell it otherwise, and a chart built straight off that pivot inherits the alphabet. [Sorting a ranking by its own number](https://michaelnocito.github.io/analyst-prep-kit/guides/excel-sort-your-bars/) is a separate move you have to make on purpose.

## 2. Rows is the list, Values is the number

Before the explanation: the source has 16 rows and the pivot has 4. Say what one row of that pivot now stands for, and where the other 12 rows went.

A pivot table answers a sentence of the form _"total revenue**per region** "_. The field in Rows is the **per what**. The field in Values is the **how much**. Excel finds every distinct value in the Rows field, gives each one a line, then piles the matching source rows into that line and reduces the pile to one number.

So one pivot row is no longer one order. It is one region. That change is called the **grain** of a table, and it is the single most useful thing to say out loud before you build. Once the grain is one-row-per-region, an individual order no longer exists in the result: you cannot ask this pivot what order 1010 was worth, because 1010 has been folded into East. If you need to see individual orders, the grain you asked for was wrong.

Saying the sentence first also tells you which field goes where. "Revenue per region" puts Region in Rows. "Orders per rep" puts Rep in Rows. There is a longer version of this idea in [a pivot table is a question, not a report](https://michaelnocito.github.io/analyst-prep-kit/guides/excel-pivot-table-question/), and it is the fastest cure for staring at the four empty boxes.

Drag Region out and Product in, and the same pivot answers a different question with no rebuilding.
    
    
    Row Labels    Sum of Revenue
    Chair                   3230
    Desk                    5060
    Lamp                    1600
    Grand Total             9890

Grand Total is still 9,890. It has to be. Changing what you group by re-sorts the same money into different piles; it never creates or destroys any.

## 3. The function Excel picks for you, and when it is wrong

Before the explanation: drop **OrderID** into Values instead of Revenue and Excel offers 16,136 for the grand total. Say in one sentence what that number is measuring.

It is measuring nothing. Excel summed the ID codes. Here is the real output.
    
    
    Row Labels    Sum of OrderID
    East                    4032
    North                   5037
    South                   4031
    West                    3036
    Grand Total            16136

North's 5,037 is 1001 + 1004 + 1007 + 1011 + 1014. Adding order numbers together produces a number, and a number in a report gets read. Nothing errored, nothing turned red.

The rule Excel follows is simple and worth knowing exactly: if the column is entirely numbers, it uses **Sum** ; if the column contains any text or blanks, it uses **Count**. An ID column is entirely numbers, so it gets summed. Excel is not guessing what the column means, because it cannot; it is only looking at what type the values are.

The one-line test before you accept any Values field: _would adding two of these together mean anything?_ Two revenues add to a bigger revenue, so Sum is right. Two order numbers add to nothing, so Sum is wrong. Two zip codes, two employee numbers, two years, two ratings out of five, all fail the test. There is a fuller account in [Excel just summed your ID numbers and said nothing](https://michaelnocito.github.io/analyst-prep-kit/guides/excel-sum-of-id-trap/), including the four times it happened in one real build.

To change it: right-click any number in the pivot, choose **Summarize Values By** , and pick Count, Average, Max, Min or the rest. On an ID column the answer you almost always wanted was Count, because you were asking how many orders, not what the IDs add to.

## 4. A second field: Region down the side, Product across the top

Before the explanation: you have four regions and three products. Before you drag anything, say how many number cells the crossed table will have, and what a single one of them will contain.

Put Region in Rows, Product in **Columns** , Revenue in Values. Twelve number cells, each one the revenue for one region and one product together.
    
    
    Sum of Revenue   Chair    Desk    Lamp   Grand Total
    East               680    1760     600          3040
    North              935    1320     240          2495
    South              850    1540     280          2670
    West               765     440     480          1685
    Grand Total       3230    5060    1600          9890

Read one cell to be sure: East and Desk is 1,760, which is order 1003 at 660 plus order 1010 at 1100. Both edges still total 9,890, across and down.

The grain is now one row per region _per product_. This layout is called a cross-tabulation, and it is the shape a pivot is named after. It is also where a real finding usually turns up, because two dimensions at once show you something one dimension hides. Here it is West: 440 of desks against 1,540 to 1,760 everywhere else, and West is the only region whose desk business is nearly absent.

Two smaller things. If a combination has no rows at all, the pivot shows a blank cell rather than a zero, and blank and zero are different findings. And more than about three fields stacked in Rows produces a table nobody reads; if you need four, you probably need two pivots.

## 5. Show Values As: turning 3,040 into 30.7%

Before the explanation: East is 3,040 out of 9,890. Without a calculator, is that closer to a quarter or closer to a half of the business?

Most people cannot do that division in their head, which is the entire argument for this feature. Right-click any number in the pivot, choose **Show Values As** , then **% of Grand Total**. Same pivot, same source, different question answered.
    
    
    Row Labels    Revenue    Share    Orders
    East             3040    30.7%         4
    North            2495    25.2%         5
    South            2670    27.0%         4
    West             1685    17.0%         3
    Grand Total      9890   100.0%        16

Note what that took: Revenue was dragged into Values twice. The first copy stays a plain total, the second copy gets Show Values As applied to it, and OrderID goes in a third time set to Count. A field can appear in Values as many times as you like, each time summarized differently, and that is how one pivot carries a total, a share and a count side by side.

Now the finding falls out. North placed the most orders of any region, five, and still finished third on revenue. Its revenue per order is 2,495 ÷ 5 = 499, against East's 3,040 ÷ 4 = 760. More orders, smaller orders. Neither the raw total nor the count alone says that; the two columns together do.

The real decision inside Show Values As is which total sits in the denominator. % of Grand Total divides by 9,890. % of Row Total and % of Column Total divide by the edge of your crossed table instead, and on the Region-by-Product layout those give completely different sentences: what share of East's money went on desks, or what share of all desk money came from East. [Choosing the denominator](https://michaelnocito.github.io/analyst-prep-kit/guides/excel-pivot-percentages/) is the whole skill here, and it is a bigger decision than any of the clicks.

Picture your own table for a moment: sales by rep, tickets by team, spend by cost centre. Which single line of it would change meaning most if you showed it as a share of the total instead of a raw number? That line is the one worth converting first.

## 6. Group the dates into months, and the month that is not there

Before the explanation: the orders run from January to May. Group them by month and say how many rows you expect to see.

Put OrderDate in Rows and you get sixteen rows, one per date, which is not a summary at all. Right-click any date in the pivot, choose **Group** , tick **Months** , and click OK. Here is the real output.
    
    
    Row Labels    Sum of Revenue
    Jan                     2630
    Feb                     2245
    Mar                     2585
    May                     2430
    Grand Total             9890

Four rows, not five. There is no April line, because there were no April orders, and a pivot only ever lists values that exist in the data. April did not score zero; April is simply absent, and absent looks exactly like nothing at all on the page.

That matters as soon as anyone reads the column downward. The eye goes Jan, Feb, Mar, May and reads four consecutive months, so May's 2,430 gets compared against March's 2,585 and lands as a modest 6.0% dip. The truthful sentence is different: sales stopped for a month and then came back at roughly the March level. Same four numbers, two different stories, and the pivot cannot tell you which one is right because the evidence for it was never a row.

The fix is not a pivot setting. It is a calendar: a small list of every month in the period, on its own, with the pivot's totals looked up against it. Then a month with no sales appears as a zero you can see instead of a gap you cannot. If a gap is even possible in your data, build the calendar before the chart.

Two useful details about grouping. Ticking Months and Years together keeps 2025 and 2026 apart, and forgetting Years is how January 2025 and January 2026 quietly merge into one "Jan" row. And grouping only offers itself if the column really holds dates; if Group is greyed out, your dates are text that looks like dates, which is a different problem with a different fix.

## 7. Refresh: a pivot is a photograph, not a formula

Before the explanation: you change one number in the source table. What does the pivot show a second later?

The same thing it showed before. A pivot reads the source once, into a private copy called the pivot cache, and every recalculation afterwards runs against that copy. Editing the source does not touch it. Here is the actual sequence, run in Excel.
    
    
    West in the pivot                        1685
    Change order 1016 from 2 units to 20
    Order 1016 revenue in the source          4400
    West in the pivot, immediately            1685
    Right-click, Refresh
    West in the pivot                         5645

Check the final number: West was 1,685 with order 1016 at 440, so 1,685 − 440 + 4,400 = 5,645. The middle line is the dangerous one. For as long as you do not refresh, the pivot shows a correct summary of data you no longer have, and there is no visual difference between a fresh pivot and a stale one.

This is the opposite of how a formula behaves, which is why it catches people. `=SUM(A2:A17)` updates the instant A5 changes. A pivot does not. Right-click and Refresh, or PivotTable Analyze then Refresh All, and make it the reflex you perform before reading, not after being asked a question you got wrong.

One setting removes most of the risk. Right-click the pivot, PivotTable Options, Data tab, tick **Refresh data when opening the file**. Anyone who opens the workbook then sees current numbers without knowing this section exists.

## 8. Count, Sum, and the Distinct Count you have to ask for

Three summaries get confused constantly, and the difference is easiest to see on one column.

Drop **Rep** into Values. Rep is text, so Excel uses Count, and here is what comes back.
    
    
    Row Labels     Count of Rep
    East                      4
    North                     5
    South                     4
    West                      3
    Grand Total              16

Read that carefully. It says 5 for North, and North has exactly one rep. Count counts _rows that have a value_ , not different values. It answered "how many North orders name a rep", which is 5, and it looks precisely like an answer to "how many reps work North", which is 1.

The summary that counts different values is **Distinct Count** , and an ordinary pivot does not offer it. I checked this rather than assuming: setting a value field to Distinct Count on a normal pivot fails outright, with Excel refusing to set the property. It only becomes available when the pivot is built on the Data Model, which means ticking **Add this data to the Data Model** in the dialog at creation time. That box is easy to miss and cannot be ticked afterwards; you rebuild the pivot instead.

So the practical rule. Sum for money and quantities. Count for how many records. Distinct Count for how many different customers, reps or products, and if you know you will need it, tick the Data Model box while you are still in the Create PivotTable dialog.

## The full before and after

Same sixteen rows, same question: how do the regions compare?

### Before
    
    
    Row Labels    Sum of Revenue
    East                    3040
    North                   2495
    South                   2670
    West                    1685
    Grand Total             9890

Correct, and it supports almost no sentence. It is sorted by alphabet, so the ranking has to be worked out by eye. There is no denominator, so 3,040 is a quantity with nothing to be big or small against. There is no count, so a region with five orders and a region with three read as equals. And nothing on the sheet says when it was last refreshed.

### After
    
    
    Row Labels    Revenue    Share    Orders    Per order
    East             3040    30.7%         4        760.00
    South            2670    27.0%         4        667.50
    North            2495    25.2%         5        499.00
    West             1685    17.0%         3        561.67
    Grand Total      9890   100.0%        16        618.13

Sorted by revenue, largest first, so the ranking reads itself. Share gives every number a size you can feel. Orders shows what each average is standing on. Per order is Revenue divided by Orders, and it is the column that produces the actual claim: **North placed the most orders of any region and earned the least per order, 499 against East's 760.** That is a sentence someone can act on, and no single column of the before table contains it.

The counts still add to 16 and the revenue still adds to 9,890, so nothing was lost on the way.

## Edge cases that break a pivot quietly

Six that each cost somebody an afternoon.

**A blank row inside the data.** Excel finds the edges of your table by walking outward from the cell you clicked, and it stops at a fully blank row. The pivot then summarizes everything above the gap and reports a confident, complete-looking total. The Grand Total check catches this immediately, which is why it is the first thing to do, not the last.

**New rows added under the source.** A pivot built on a fixed range like `A1:H17` never sees row 18. Build the pivot on a named table instead, made with Ctrl+T, and the range grows with the data on its own.

**Trailing spaces in the labels.** "North" and "North " are two different labels, so a fifth region appears in a four-region report. If your Rows list has more entries than you expected, look for near-duplicates before looking for anything else.

**Numbers stored as text.** One value entered as text and Sum silently skips it. The total stays plausible and is short by exactly one row. If a total is close but not right, suspect this before suspecting the pivot.

**Merged cells in the header row.** Excel refuses to build the pivot and reports that the field name is not valid. It means a heading cell is blank or merged. Unmerge, give every column a real heading, and try again.

**A copied pivot that shares a cache.** Copy and paste a pivot and the copy usually shares the original's cache, so grouping dates by month in one silently groups the other as well. If two pivots keep changing together, that is why.

## Why this works

The pivot table is not a spreadsheet novelty. It is one operator with a formal definition, and the same operator turns up in every serious data tool under a different name. Gray and colleagues named and generalized it: given a table, choose some columns as grouping dimensions and some as measures, and the result is an aggregate for every combination of dimension values, with the sub-totals and grand totals along the edges as the natural degenerate cases of the same rule (Gray, Chaudhuri, Bosworth, Layman, Reichart, Venkatrao, Pellow, & Pirahesh, 1997, _Data Mining and Knowledge Discovery_ , 1(1), 29–53). That single sentence explains why Rows, Columns and Values are the only three boxes that really matter, why the Grand Total is guaranteed to reconcile, and why a combination with no source rows produces nothing rather than a zero. The relational footing under it is older: aggregation is a function from a set of rows to one value, which is what makes grouping trustworthy in the first place (Codd, 1970, _Communications of the ACM_ , 13(6), 377–387). SQL's `GROUP BY`, a pandas `groupby`, and a Power BI matrix are the same operator with different hands on it, so what you learned here transfers rather than expiring.

There is also a reason this page kept stopping to ask you a question before answering it. Attempting an answer before being shown the correct one improves how well the correct one is retained, and it does so even when your attempt is wrong (Bisra, Liu, Nesbit, Salimi, & Winne, 2018, _Educational Psychology Review_ , 30(3), 703–725). The 16,136 sticks because you were asked what it measured before being told it measured nothing.

## Using this on your own project

Rebuilding every summary in an old workbook is miserable and you will stop at the second sheet. Do this instead, in order, on the next pivot you make.

  1. **Say the sentence before you drag.** "Total revenue per region." The words before "per" go in Values, the word after it goes in Rows.
  2. **Turn the source into a table first.** Click inside it and press Ctrl+T. The pivot then grows with your data instead of ignoring new rows.
  3. **Check the Grand Total against the source column** before you look at anything else. It catches blank rows, text-numbers and wrong ranges in one glance.
  4. **Run the adding test on every Values field.** Would adding two of these together mean anything? If not, change Summarize Values By.
  5. **Add a count column beside every total** , then sort by the number rather than the label. Those two moves turn a list into a ranking that says something.
  6. **Refresh before you read, every time** , and tick "Refresh data when opening the file" so the next person does not have to know that.

If you have paper nearby, one optional sketch is worth five minutes. Draw the four boxes, Filters, Columns, Rows and Values, and write your own column names into them for a question you actually get asked at work. Doing it on paper first is faster than dragging, and it is the step that turns the field list from four boxes of dread into a sentence you already wrote.

**More detail on this, and more like it.** Every how-to sits in one place on the [guides index](https://michaelnocito.github.io/analyst-prep-kit/guides/): Excel, SQL, Python, and the working habits around them.

## The whole thing on one screen

This is the retrieval sheet. Cover the right column, work down the left, and say each answer out loud before you check it.

| Thing                  | What it does                                                                |
|------------------------|-----------------------------------------------------------------------------|
| Make one               | Click inside the data, Insert, PivotTable, OK.                              |
| Rows                   | The "per what". Becomes the labels down the left.                           |
| Values                 | The "how much". Becomes the numbers beside them.                            |
| Columns                | A second grouping field, spread across the top. Makes a cross-tab.          |
| Filters                | A field that hides rows from the whole pivot before anything is summarized. |
| Grain                  | One pivot row is one group, not one record. Say it before you drag.         |
| Default function       | All numbers gives Sum. Any text or blank gives Count.                       |
| The adding test        | Would adding two of these mean anything? If not, Sum is wrong.              |
| Summarize Values By    | Right-click a number. Sum, Count, Average, Max, Min.                        |
| Show Values As         | Right-click a number. % of Grand Total, of Row, of Column.                  |
| A field used twice     | Drag the same field into Values again for a total and a share side by side. |
| Group dates            | Right-click a date, Group, tick Months and Years.                           |
| A missing month        | Never appears as a row. Absent is not zero.                                 |
| Refresh                | A pivot reads a private copy. Source edits do nothing until you refresh.    |
| Distinct Count         | Needs Add this data to the Data Model, ticked at creation.                  |
| Blank cell in the body | No source rows for that combination. Not a zero.                            |
| Sort order             | Alphabetical until you change it. Rankings need sorting by the number.      |
| The check              | Grand Total equals the total of the source column. Every time.              |

**The one habit to keep.** Compare the pivot's Grand Total to the total of the source column before you read anything else. That one comparison catches a blank row cutting your data in half, a range that never grew, numbers stored as text, and a stale cache, and it costs ten seconds. If a pivot breaks in a way this page does not cover, there is a general [diagnosis loop for being stuck](https://michaelnocito.github.io/analyst-prep-kit/guides/technical-tenacity/).

One last thought, and I would genuinely like other people's answers. The first pivot I ever sent to a manager was sorted alphabetically and had no count column, and the region at the top of the page turned out to be third. What is the pivot you sent early on that you would rebuild now, and what would you add to it?

## References

  * Gray, J., Chaudhuri, S., Bosworth, A., Layman, A., Reichart, D., Venkatrao, M., Pellow, F., & Pirahesh, H. (1997). Data cube: A relational aggregation operator generalizing group-by, cross-tab, and sub-totals. _Data Mining and Knowledge Discovery_ , 1(1), 29–53.
  * Codd, E. F. (1970). A relational model of data for large shared data banks. _Communications of the ACM_ , 13(6), 377–387.
  * Bisra, K., Liu, Q., Nesbit, J. C., Salimi, F., & Winne, P. H. (2018). Inducing self-explanation: A meta-analysis. _Educational Psychology Review_ , 30(3), 703–725.

---

*Originally published on Analyst Prep Kit: [How to Make a Pivot Table, and Read the Answer It Gives You](https://michaelnocito.github.io/analyst-prep-kit/guides/excel-pivot-tables/)*

*Visit the site for more beginner data analysis guides and free resources: [the full guide archive](https://michaelnocito.github.io/analyst-prep-kit/guides/) covers SQL, Excel, Power BI, Tableau, Python and statistics, and the [practice kits](https://michaelnocito.github.io/analyst-prep-kit/) run in your browser with nothing to install.*

*If it was useful: [Buy Me a Coffee](https://buymeacoffee.com/michaelnocito).*
