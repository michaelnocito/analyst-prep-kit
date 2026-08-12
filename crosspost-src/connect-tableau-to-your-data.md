By the end of this page your data will be in Tableau with the right column types, and you will understand the thing that makes Tableau feel strange at first: the moment you connect, it sorts every one of your columns into two bins, and which bin a column lands in decides what you are allowed to do with it. Nothing about dragging fields makes sense until that is clear.

Here is what to actually do today. Connect to your file, then stop on the Data Source tab and check the type symbol above every column before you make a single chart. That thirty-second check is the difference between Tableau feeling logical and feeling like it is fighting you.

The short version: Connect, choose your source, check the types, go to Sheet 1, and read the field list, which is now split into dimensions above and measures below.

That split is the one idea everything else follows from, so it gets the picture.

> _The original carries a diagram here. In words: A single row of column headers along the top, drawn as five tiles. Arrows lead down from the tiles into two separate containers below. The left container receives the tiles carrying a letter mark and a calendar mark, and is drawn being divided into slices by vertical cut lines. The right container receives the tiles carrying a hash mark, and is drawn with its contents merged into one solid block with a plus sign on it, showing they are added together rather than kept separate._

**Edition limits here come from Tableau's own comparison documentation** , checked on 8 August 2026. If you have not installed anything yet, [how to install Tableau Public](https://michaelnocito.github.io/analyst-prep-kit/guides/install-tableau-public/) covers which of the two free apps to get, and that choice determines what you can connect to at all.

## 1. What Tableau can connect to, and what your edition can

Before the explanation: you have a database at work and you want a Tableau dashboard from it. What would stop that from being possible?

Your edition, most likely. This surprises people because Tableau's marketing lists dozens of connectors, and those lists describe the paid product.

| Edition                                     | What it connects to                                                                              |
|---------------------------------------------|--------------------------------------------------------------------------------------------------|
| Desktop Public Edition (free, can publish)  | Files only: Excel, text files, JSON, PDF, spatial files, statistical files, Google Drive, OData. |
| Desktop Free Edition (free, cannot publish) | Nearly all sources, including SQL databases.                                                     |
| Desktop Professional (paid)                 | All sources.                                                                                     |

So if you are on Public Edition, which is the right choice for a portfolio, "connect Tableau to your database" is not a thing you can do directly. The honest route is to run your query, [export the result](https://michaelnocito.github.io/analyst-prep-kit/guides/export-sql-results-to-excel/), and connect to that file. That sounds like a downgrade and mostly is not: you should be summarising in SQL before Tableau anyway, for the reasons in section 5.

## 2. Connect to a file

On the start page, the **Connect** panel runs down the left. Choose **Microsoft Excel** or **Text file** , which is where CSVs live, and pick your file.

Tableau opens the **Data Source** tab. This is a screen most beginners click straight past, and it is the most important screen in the product. It shows your table, the column names, the type Tableau assigned to each one, and a preview of the rows.

Two habits to form here. Check the row count in the bottom corner against what you expected, because a file that loaded partially looks exactly like one that loaded fully. And if the file has several sheets or tables, drag the one you want into the canvas rather than assuming it picked correctly.

## 3. Check the types before anything else

Above each column name is a small symbol. `Abc` means text, `#` means a number, a calendar means a date, and a globe means a geographic role Tableau has recognised, such as a country or a postcode.

Click a symbol to change it. Three fixes are worth making right now, before you build anything.

**A number that arrived as text.** Usually a currency symbol, a thousands separator, or one non-numeric value in the column. Left as text, it will never appear in the measures list and you will not be able to sum it.

**A date that arrived as text.** Same effect, and worse: no date column means no trend line, no month grouping, and no year filter.

**A code that arrived as a number.** Postcodes, account numbers and product codes. Left as numbers, Tableau will offer to add them up, and somebody eventually will. Set them to text, or geographic where that fits.

Say what all three of those have in common, before reading on. Every one is a column in the wrong bin from the picture, and the bin was decided by the type. Fixing the type here fixes the bin, and fixing the bin fixes every chart downstream.

## 4. Dimensions and measures, and why it matters

Click **Sheet 1** at the bottom. Your columns are now listed on the left in two groups. Text and dates sit above as **dimensions**. Numbers sit below as **measures**.

The distinction is simple once named. A dimension is something you _cut the data by_ : region, product, month. A measure is something you _add up_ : revenue, quantity, minutes. Drag a dimension to Rows and a measure to Columns and you have a bar chart, because you have said "split it by this, and add up that".

Watch what Tableau does to a measure when you drag it: the field turns into `SUM(Revenue)`. It aggregated automatically, because a measure with no aggregation has no meaning at the level of a whole chart. If you want an average instead, right-click the field and change the measure.

This is the same idea as SQL's `GROUP BY`, wearing different clothes. Your dimensions are the columns after GROUP BY, and your measures are the aggregate functions in the SELECT. If that mapping is useful to you, [GROUP BY and HAVING](https://michaelnocito.github.io/analyst-prep-kit/guides/sql-group-by-having/) is the same concept in its original home, and the grain discipline transfers directly.

One column type worth knowing: a number that is really a category, like a year written as 2024, arrives as a measure and will be summed into nonsense. Drag it up into dimensions, or convert it, and it behaves.

## 5. Live or extract

On the Data Source tab, when connected to something that supports both, there is a choice between **Live** and **Extract** in the top right.

**Live** queries the source every time the chart redraws, so the dashboard always shows current data and its speed depends on the source. **Extract** takes a snapshot into Tableau's own fast format, so it is quick and it is as old as the last refresh.

For Tableau Public the choice is made for you: publishing creates an extract, which is why Public Edition only accepts file sources in the first place. For a portfolio piece that is exactly right, because the dashboard must keep working for anyone who opens it, with no server involved.

Whichever you use, the same rule applies as everywhere else on this site: summarise before you connect when the source is large. A dashboard built on one row per transaction will be slow for everyone who opens it, and almost no dashboard needs that grain. Group to one row per day per category first and the whole thing becomes quick.

Now picture the dashboard you want to build. What is the smallest grain any single chart on it actually needs? That grain is what you should be connecting to, and anything finer is weight you are carrying for nothing.

## 6. Joining a second table

Drag a second table onto the Data Source canvas and Tableau draws a line between them. That line is a **relationship** , and Tableau will suggest matching fields based on their names.

Check the suggestion rather than accepting it. Matching on a name that happens to be shared, rather than on the key that actually links the tables, produces a result that looks fine and is wrong. [What the noodle actually does](https://michaelnocito.github.io/analyst-prep-kit/guides/tableau-relationships/) covers the difference between relationships and older-style joins in detail.

The check that catches nearly everything is the one from [SQL JOINs](https://michaelnocito.github.io/analyst-prep-kit/guides/sql-joins/): look at your row count before and after. If joining a second table multiplied your rows, any measure you now sum is being counted more than once. Tableau's relationships are designed to reduce that risk compared with a plain join, and they do not remove your responsibility to look.

## The full before and after

Same file, same intended dashboard.

### Before
    
    
    Connect to CSV → straight to Sheet 1
    Revenue is not in the measures list
    Order date has no year, month or quarter options
    Postcode appears as a measure, offering SUM(Postcode)
    Rebuild the sheet twice trying to work out what is wrong

Nothing errored, and every symptom is the same cause: three columns landed in the wrong bin because their types were guessed from the file. The time goes on trying to solve it in the chart, which is the one place it cannot be solved.

### After
    
    
    Connect to CSV → stop on the Data Source tab
    Row count matches the export
    Revenue: text → number.  Order date: text → date.  Postcode: number → text
    Sheet 1: revenue is a measure, date offers year and month, postcode groups
    Drag a dimension to Rows, a measure to Columns

Thirty seconds spent on the screen everyone skips, and the tool stops fighting. The date fix alone unlocks trend lines, month grouping and year filters, none of which are available on a text column no matter how the chart is built.

## What goes wrong, and the fix

Six that stop people early.

**Your database is not in the Connect list.** You are on Public Edition, which is files only. Export a query result and connect to that.

**A number will not appear as a measure.** It is typed as text. Change it on the Data Source tab.

**No date options on a date column.** Same cause, and it removes trends, month grouping and date filters. Fix the type.

**Tableau offers to sum a postcode or an ID.** A code typed as a number. Set it to text or a geographic role. This is the same trap as [summing an ID column in Excel](https://michaelnocito.github.io/analyst-prep-kit/guides/excel-sum-of-id-trap/).

**Numbers changed after joining a second table.** The join multiplied rows. Compare the row count before and after, and check the fields the relationship is matching on.

**Everything is slow.** Too fine a grain. Summarise in SQL before connecting, rather than asking Tableau to aggregate millions of rows on every redraw.

## Why the split exists

The dimension and measure split looks like an odd piece of Tableau vocabulary until you notice it is the grammar of every chart. A chart is a claim about how something varies across something else, so it needs both a thing that varies and something to vary it by. Tableau makes that requirement explicit at connection time rather than letting you discover it halfway through building.

The consequence is that a column's type is not a formatting detail, it is a statement about what questions the column can answer. Text and dates can slice, because they name groups. Numbers can accumulate, because they have magnitudes. A date stored as text can do neither properly: it names groups in an order the tool cannot understand, which is why a text date sorts April before January.

Seen that way, the Data Source tab is not a loading screen. It is where you tell the tool what your data means, and every downstream frustration is a meaning that was never stated.

One note on the way this page is written. It kept asking you to commit to an answer, what would stop a database connection, what three broken columns have in common, before giving one. Attempting an answer before seeing the correct one reliably improves how well the correct one is retained, even when the attempt is wrong (Bisra, Liu, Nesbit, Salimi, & Winne, 2018, _Educational Psychology Review_ , 30(3), 703–725).

## Using this on your own work

Five habits, in order.

  1. **Never skip the Data Source tab.** Check every type symbol and the row count before you open Sheet 1.
  2. **Fix codes to text immediately** , so nothing ever offers to add up an identifier.
  3. **Summarise before connecting** when the source is large. Connect at the grain your smallest chart needs.
  4. **Check row counts around every join** , and look at which fields the relationship matched on.
  5. **Say the sentence before you drag.** "Revenue by region" tells you which field is a measure and which is a dimension, before you touch anything.

If you have paper nearby, one optional drawing is worth two minutes. List your columns and put each into the left bin or the right bin from the picture at the top. Any column you cannot place is a column whose type you should check, and any chart you want that has nothing in one of the bins is a chart that cannot be built from this data.

**More detail on this, and more like it.** Every how-to sits in one place on the [guides index](https://michaelnocito.github.io/analyst-prep-kit/guides/): getting set up, SQL, Excel, Python, and the working habits around them.

## The whole thing on one screen

This is the retrieval sheet. Cover the right column, work down the left, and say each answer out loud before you check it.

| Thing                        | What it is, or what it does                                                    |
|------------------------------|--------------------------------------------------------------------------------|
| Public Edition sources       | Files only: Excel, text, JSON, PDF, spatial, statistical, Google Drive, OData. |
| Free Edition sources         | Nearly everything including databases, but it cannot publish.                  |
| Data Source tab              | The screen everyone skips. Types, row count, and joins live here.              |
| Type symbols                 | `Abc` text, `#` number, calendar date, globe geographic.                       |
| Dimension                    | Something you cut the data by. Text and dates.                                 |
| Measure                      | Something you add up. Numbers.                                                 |
| `SUM(Revenue)`               | Tableau aggregates a measure automatically when you drag it.                   |
| The SQL mapping              | Dimensions are your GROUP BY columns. Measures are the aggregates.             |
| A year as a number           | Arrives as a measure and gets summed. Move it to dimensions.                   |
| Live                         | Queries the source each redraw. Current, and as fast as the source.            |
| Extract                      | A snapshot in Tableau's own format. Fast, and as old as its last refresh.      |
| Publishing to Tableau Public | Always creates an extract. Hence the files-only restriction.                   |
| Relationship                 | The line between two tables. Check the matched fields, do not assume.          |
| Text date                    | No trends, no month grouping, and April sorts before January.                  |
| Slow dashboard               | Grain too fine. Summarise in SQL before connecting.                            |

**The one habit to keep.** Stop on the Data Source tab and read every type symbol before you build anything. Nearly every complaint about Tableau being confusing is a column sitting in the wrong bin, and the bin is decided on that screen and nowhere else. If something breaks in a way this page does not cover, there is a general [diagnosis loop for being stuck](https://michaelnocito.github.io/analyst-prep-kit/guides/technical-tenacity/).

One last thought, and I would genuinely like other people's answers. The one that cost me an evening was a date column that had arrived as text, so my months sorted alphabetically and I kept trying to fix the sort in the chart rather than the type at the source. What did you try to fix in the wrong place?

## References

  * Bisra, K., Liu, Q., Nesbit, J. C., Salimi, F., & Winne, P. H. (2018). Inducing self-explanation: A meta-analysis. _Educational Psychology Review_ , 30(3), 703–725.
  * Tableau. Tableau Desktop Public Edition, Free Edition, and Professional Edition feature comparison. Retrieved 8 August 2026 from help.tableau.com. Cited for the connector limits, which are product terms rather than research findings.

---

*Originally published on Analyst Prep Kit: [How to Connect Tableau to Your Data (And What Happens the Moment You Do)](https://michaelnocito.github.io/analyst-prep-kit/guides/connect-tableau-to-your-data/)*

*Visit the site for more beginner data analysis guides and free resources: [the full guide archive](https://michaelnocito.github.io/analyst-prep-kit/guides/) covers SQL, Excel, Power BI, Tableau, Python and statistics, and the [practice kits](https://michaelnocito.github.io/analyst-prep-kit/) run in your browser with nothing to install.*

*If it was useful: [Buy Me a Coffee](https://buymeacoffee.com/michaelnocito).*
