By the end of this page your spreadsheet will pull its numbers straight from a database, so next month's report is one Refresh All instead of an export, a paste, and a silent prayer that you pasted into the right columns. The path is **Data, then Get Data, then From Database** , and the rest of this page is the parts that go wrong after that.

Here is what to actually do today. Connect to one table you currently copy by hand, load it to a worksheet, and press Refresh once to watch it update. Do not rebuild your whole report yet. One connected table teaches you the whole mechanism.

The short version: Excel has a built-in tool called Power Query that holds the connection and the cleaning steps, so both replay on demand. SQL Server, Postgres, MySQL and others are in the menu. SQLite is not, and section 5 is what to do about that.

The difference between a paste and a connection is the one idea worth the page, so it gets the picture.

> _The original carries a diagram here. In words: Two rows. Each row starts on the left with a database drawn as a stack of cylinders and ends on the right with a spreadsheet grid. In the upper row the two are joined by an unbroken pipe with a circular refresh arrow sitting on it, and the spreadsheet grid is drawn crisp and current. In the lower row the pipe between them has been severed, with a clean gap in the middle and a small pair of scissors marks at the break, and the spreadsheet on that row carries a frozen clock face in its corner, meaning its contents stopped changing at the moment of the cut._

**The menu paths here match current Excel for Windows** and were checked against Microsoft's own Power Query documentation on 8 August 2026. Excel for Mac has a smaller set of connectors and the Get Data menu is arranged differently, so treat the Windows paths as the reference and expect to hunt slightly on a Mac.

## 1. Why connecting beats pasting

Before the explanation: think about the last report you rebuilt from an export. How many of those minutes were spent on judgement, and how many on moving data from one window to another?

Pasting is not slow because of the paste. It is slow because the paste is only step four of seven, and the other six get repeated every single time: run the query, export it, open the file, fix the columns that came in as text, paste into the right place, check the formulas still point at the right range, re-apply the formatting.

A connection replaces all seven with one button, because Power Query records the whole sequence as steps and replays them. And it removes an entire class of error rather than just saving time. A paste that lands one column to the left produces a report that is wrong and looks completely normal, which is the worst kind of wrong there is.

## 2. Find Power Query, whatever your Excel looks like

Power Query is built into Excel and has been for years, but it hides under different names depending on how old your version is. On the **Data** tab, look for one of these, in this order:

  * **Get Data** , on the left of the Data tab. This is the current name and what the rest of this page uses.
  * **New Query** , in older versions. Same tool, same menu underneath.
  * A **Get & Transform** group with buttons rather than one menu. Also the same tool.

If you find none of these, you are probably on Excel for Mac or a very old version. Mac Excel has fewer connectors and a different arrangement; older versions may need the Power Query add-in installed separately. Section 5's advice about exporting a file is the route that works everywhere.

## 3. Connect to SQL Server, Postgres or MySQL

The path is **Data, Get Data, From Database** , then your engine. Take SQL Server as the worked example, because it is the one most workplaces have.

A dialog asks for a **Server** and, optionally, a **Database**. Server is the machine name your colleagues use in their own connections, which is the fastest way to get it right: ask for a screenshot of someone's working connection rather than guessing. Leaving Database blank shows you everything on that server you are allowed to see, which is a useful way to look around the first time.

Then it asks how to sign in. **Windows** means your existing network account and needs no password typed anywhere, which is both easier and safer. **Database** means a separate username and password issued for that server. Use Windows unless you were specifically given credentials.

Excel then shows a Navigator listing the tables and views. Click one to preview it, tick it, and you are one dialog from finished. Prefer a **view** over a raw table when one exists with a sensible name, because a view is usually somebody's tidied, agreed version of that data, and using it means your numbers match theirs.

## 4. Load it, and the choice in that dialog

The Navigator offers **Load** and **Transform Data** , and the difference matters more than it looks.

**Load** drops the table onto a worksheet as it is. **Transform Data** opens the Power Query editor first, where you can remove columns, filter rows, rename headers, fix data types and split fields. Every action you take is recorded as a step in a list on the right, and that list replays on every future refresh.

That list is the real prize. Cleaning done in the editor happens again next month automatically; the same cleaning done by hand in cells has to be redone by hand next month, by whoever is holding the file. Choose Transform Data by default, even if the only thing you do is remove three columns you do not need.

When you press Close & Load, you also get a choice of where it lands. A **Table** on a worksheet is right for anything you want to look at. **Only Create Connection** is right when the data is only feeding a PivotTable, and it keeps a million rows out of your worksheet while still being fully usable, which is the trick behind spreadsheets that stay small and quick.

## 5. SQLite, and the ODBC gap

Say why a database might be missing from a menu that lists a dozen others, before reading on.

The menu lists the connectors Microsoft chose to build and maintain. SQLite is not one of them, which surprises people who have just learned SQL on SQLite because a tutorial sensibly started there. Nothing is broken and you have not missed a setting.

There are two honest routes, and for most beginners the second is better.

**Install an ODBC driver.** ODBC is a translation layer: install a small driver for your database, register it once, and it then appears in Excel under Get Data, From Other Sources, From ODBC. It works well and it needs permission to install software, which on a work machine often means a ticket.

**Export the answer and connect to the file.** Run your query in your database tool, save the result as CSV, and use Get Data, From File, From Text/CSV. You keep the refresh mechanism, because re-running the query and overwriting the same file makes Refresh work exactly as before. What you give up is the automatic part.

The second route sounds like a defeat and usually is not, because you should be summarising in SQL anyway. Which is the next section.

## 6. Let the database do the heavy lifting

The most common mistake here is connecting to a raw transaction table with millions of rows and then grouping it in Excel. It works until it does not, and the failure is a spreadsheet that takes two minutes to open and eventually refuses to.

Databases are built for exactly this and Excel is not. Summarise first, then connect. One row per day per product instead of one row per sale usually turns millions of rows into thousands, and every chart you were going to build works identically on the smaller table.

You can write that summary directly into the connection: the SQL Server dialog has a **SQL statement** box for exactly this purpose, and whatever you put there runs on the server before anything travels to your machine.
    
    
    SELECT order_date,
           product_category,
           COUNT(*)     AS orders,
           SUM(amount)  AS revenue
    FROM sales
    WHERE order_date >= '2026-01-01'
    GROUP BY order_date, product_category;

If that query is unfamiliar, [GROUP BY and HAVING](https://michaelnocito.github.io/analyst-prep-kit/guides/sql-group-by-having/) is the guide for it. One caution worth knowing: a query typed into that box is fixed text, so Excel cannot be clever about folding your later filters back into it. That is a fair trade when the query is already doing the summarising, and a poor one if you paste in `SELECT *`.

Now picture the report you rebuild most often. At what grain is one row of its source data, and does anything in the finished report actually need that grain? If the answer is no, the summary belongs in the query.

## 7. Refresh, and what breaks on other people's machines

Refreshing is **Data, then Refresh All** , or right-click the table and choose Refresh. To make it automatic, right-click the table, choose Table Properties or Connection Properties, and tick Refresh data when opening the file.

Then send that file to a colleague and watch it fail, which it will, for a reason worth understanding. The workbook stores the address of the database and the shape of the query. It does not store your permission to read it. Your colleague needs their own access to the same server, and if they are outside the office they may need the company network as well.

So a connected workbook is a tool for people who can reach the source. For everyone else, send them the numbers instead: paste the finished summary as values into a fresh sheet, or export a PDF. That is not a workaround, it is the correct answer to a different question.

## The full before and after

Same monthly report, same numbers.

### Before
    
    
    1. Run the query in the database tool
    2. Export results to CSV
    3. Open the CSV, fix the dates that came in as text
    4. Copy, switch to the report, paste over last month's rows
    5. Check the formulas still cover the new range
    6. Re-apply the formatting
    7. Repeat next month

Forty minutes if nothing goes wrong, and one silent risk that never goes away: if the export ever contains a different number of rows, step 4 either overwrites live formulas or leaves last month's rows below the new ones. Nothing errors. The total is simply wrong.

### After
    
    
    1. Data → Get Data → From Database → From SQL Server Database
    2. Server name, Windows authentication, pick the view
    3. Transform Data: remove three columns, set the date type, filter to this year
    4. Close & Load → Table
    5. Next month: Refresh All

Steps 1 to 4 happen once. Step 5 is the monthly job and it takes seconds. The date fix and the column removals are stored as steps rather than as habits, so they survive you being on holiday, and the row-count risk disappears because the table resizes itself and any formulas written against it follow.

## What goes wrong, and the fix

Six that account for most of the pain.

**"Cannot connect" or a login failure.** Ask a colleague for the exact server name from their working connection. Guessing at server names is how afternoons disappear, and the name often includes an instance or a port that nobody mentions out loud.

**Your database is not in the menu.** Only built-in connectors appear. Use ODBC with a driver, or export to CSV and connect to that. Section 5.

**Refresh is very slow.** You are pulling more rows than you need. Filter and group inside the query rather than after it, so the work happens on the server.

**Leading zeros disappeared from codes.** A column of postcodes or account numbers arrived as numbers. Set the column type to Text in the Power Query editor, not afterwards in cells. The [CSV import fix](https://michaelnocito.github.io/analyst-prep-kit/guides/excel-csv-import-leading-zeros/) covers the same problem coming from files.

**Dates are wrong by a month, or refuse to sort.** Day and month have been swapped, or the column is text that looks like a date. Set the type explicitly in the editor and pick the right locale when it asks.

**It works for you and not for anyone else.** Permissions, not the file. Section 7.

## Why this works

Power Query is worth understanding as one idea: it stores your work as a recipe rather than as a result. Every click in the editor is written down as a step, and refreshing means re-running the whole recipe against whatever the source holds now. That is why cleaning done in the editor is permanent and cleaning done in cells is not, and it is the entire difference between a report you maintain and a report you rebuild.

The second mechanism explains the performance advice. When it can, Power Query pushes your filters and groupings back into the source database and lets the server do them, so only the summarised rows travel. This is called query folding, and it is why filtering in the editor can be dramatically faster than filtering in the worksheet. It also explains why a hand-typed SQL statement can block that optimisation: fixed text cannot be rewritten, so nothing can be folded into it.

One note on the way this page is written. It kept asking you to commit to an answer, where your rebuild time actually goes, why a database might be missing from the menu, before giving one. Attempting an answer before seeing the correct one reliably improves how well the correct one is retained, even when the attempt is wrong (Bisra, Liu, Nesbit, Salimi, & Winne, 2018, _Educational Psychology Review_ , 30(3), 703–725).

## Using this on your own reports

Five steps, in order. The first one keeps the project small enough to finish.

  1. **Connect one table you currently paste.** Not the whole report. One table, this week, so the mechanism is familiar before the stakes rise.
  2. **Do all cleaning in the editor** , never in cells. If you find yourself fixing something by hand twice, it belongs in a step.
  3. **Summarise in the query** when the source has more than a few hundred thousand rows. The database is built for it.
  4. **Use Only Create Connection plus a PivotTable** for anything large, so the rows never sit in a worksheet.
  5. **Write down the server and view names** in a notes tab in the workbook. In six months you will not remember, and neither will the person who inherits it.

If you have paper nearby, one optional drawing is worth five minutes. Draw your report as a chain of boxes from source to finished number, and mark each box as either a step Excel can replay or something you do by hand. Every hand-marked box is a place the report can silently break while you are away.

**More detail on this, and more like it.** Every how-to sits in one place on the [guides index](https://michaelnocito.github.io/analyst-prep-kit/guides/): getting set up, SQL, Excel, Python, and the working habits around them.

## The whole thing on one screen

This is the retrieval sheet. Cover the right column, work down the left, and say each answer out loud before you check it.

| Thing                     | What it is, or what it does                                                   |
|---------------------------|-------------------------------------------------------------------------------|
| Power Query               | Built into Excel. Stores your connection and cleaning as replayable steps.    |
| The path                  | Data → Get Data → From Database → your engine.                                |
| Older names               | New Query, or a Get & Transform group. Same tool.                             |
| Server and Database boxes | Get the exact server name from a colleague's working connection.              |
| Windows authentication    | Your network account. No password typed. Use it unless given credentials.     |
| Navigator                 | Lists tables and views. Prefer a named view: somebody already agreed it.      |
| Load vs Transform Data    | Straight to the sheet, or via the editor. Choose the editor by default.       |
| Steps list                | The recorded recipe. Replays on every refresh. The whole point.               |
| Only Create Connection    | No worksheet rows, feeds a PivotTable. Keeps big files quick.                 |
| SQLite                    | Not a built-in connector. Use ODBC, or export CSV and connect to that.        |
| SQL statement box         | Runs on the server before anything travels. Best place to summarise.          |
| Query folding             | Filters pushed back to the database. Why editor filters can be much faster.   |
| Refresh All               | Data tab. Or refresh on open, via Connection Properties.                      |
| Fails for colleagues      | The file stores the address, not your permission. They need their own access. |
| Type fixes                | Set them in the editor, so they replay. In cells they do not.                 |

**The one habit to keep.** Every fix goes in the editor, never in a cell. That single rule is what turns a spreadsheet you rebuild into a spreadsheet you refresh, and it is the difference between owning a report and being owned by one. If something breaks in a way this page does not cover, there is a general [diagnosis loop for being stuck](https://michaelnocito.github.io/analyst-prep-kit/guides/technical-tenacity/).

One last thought, and I would genuinely like other people's answers. The paste that finally convinced me to connect was one where the export had two extra rows, so the paste pushed a formula range out of alignment and the total was wrong by a rounding-sized amount for a month before anyone noticed. What did a manual step cost you before you automated it?

## References

  * Bisra, K., Liu, Q., Nesbit, J. C., Salimi, F., & Winne, P. H. (2018). Inducing self-explanation: A meta-analysis. _Educational Psychology Review_ , 30(3), 703–725.
  * Microsoft. Import data from external data sources (Power Query), and Import data from a database using Native Database Query. Retrieved 8 August 2026 from support.microsoft.com. Cited for menu paths and dialog options, which are product details rather than research findings.

---

*The full version of this guide lives on my site: [How to Connect Excel to a SQL Database (And Stop Pasting)](https://michaelnocito.github.io/analyst-prep-kit/guides/connect-excel-to-a-database/).*

*If it was useful: [Buy Me a Coffee](https://buymeacoffee.com/michaelnocito).*
