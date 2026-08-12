By the end of this page you will have a real database sitting on your own computer, with 11 tables, 3,503 tracks and 412 customer invoices in it, and you will have run a query that proves every table arrived intact. Then you will run a join across two of those tables, which is the thing a single spreadsheet can never teach you. It takes about five minutes and costs nothing.

Here is what to actually do today. Download the Chinook database file, open it in DB Browser for SQLite, and run one query that counts the rows in every table. If the counts match the ones printed below, you have a working practice environment and you can stop shopping for one.

The short version: get `Chinook_Sqlite.sqlite`, open it, count the rows, then join two tables. Northwind and Sakila are the other two names you will see, and there is a table further down saying when each is the right pick.

The reason a sample database beats the CSV you already have is one idea, so it gets the picture.

> _The original carries a diagram here. In words: Two panels side by side. The left panel holds a single grid of rows and columns, standing alone with nothing attached to it. The right panel holds four smaller grids arranged around each other. A highlighted column at the edge of each small grid is joined by a solid line to a matching highlighted column on a neighbouring grid, so all four grids are wired together into a connected shape. The left panel has no lines at all, because there is nothing for a line to reach._

**Every number on this page is real.** I downloaded Chinook v1.4.5 and Northwind on 8 August 2026 and ran each query with SQLite 3.51.1. The counts, the outputs and the row multiplication are what came back, not what should have come back. If you have no database software at all yet, [how to set up a SQL database](https://michaelnocito.github.io/analyst-prep-kit/guides/set-up-a-sql-database/) is the fifteen-minute version of that step, and this page picks up right after it.

## 1. Why one CSV is not enough

Before the explanation: think of the last spreadsheet you worked in. What question about it could you not answer without a second file open beside it?

Almost every SQL exercise you can practise on one file is a filter, a sort, or a total. Those are real skills and you will exhaust them in an afternoon. The skills that get tested in interviews and used every day at work are joins, grains, and reconciliation, and every one of them needs at least two tables that refer to each other.

A **sample database** is a single file containing many tables that already refer to each other correctly. Somebody has done the work of making customer 14 in one table be the same customer 14 in another. That wiring is the practice material. You are not downloading data so much as downloading relationships.

## 2. Get Chinook, the one to start with

Chinook is a made-up digital music store: artists, albums, tracks, customers, invoices, and the staff who sold them. It is the best beginner pick because it arrives as one ready-made SQLite file. There is no server, no script to run, and no import step that can go wrong.

Download this file and put it somewhere you can find again, like your Documents folder.
    
    
    https://github.com/lerocha/chinook-database/releases/download/v1.4.5/Chinook_Sqlite.sqlite

It is about 1 MB. Right-click the link and choose Save link as, or paste it into your browser's address bar. The file extension is `.sqlite`, and you may also see `.db` or `.sqlite3` used elsewhere for the same kind of file. SQLite does not care which of the three you use; they are all just a name.

Ignore the other file in that release, `Chinook_Sqlite.sql`. That one is a script of instructions for building the database rather than the database itself, and running it is a step you do not need today.

## 3. Open it, and the query that proves it loaded

Before the explanation: you are about to run a query that returns 8 rows. What could that result show you that simply seeing the file on disk cannot?

Open [DB Browser for SQLite](https://sqlitebrowser.org/), choose Open Database, and pick the file you just downloaded. You should see a list of tables down the left: Album, Artist, Customer, Employee, Genre, Invoice, InvoiceLine, MediaType, Playlist, PlaylistTrack, Track. Eleven of them.

Seeing table names is not proof that the rows came with them. Go to the Execute SQL tab and run this.
    
    
    SELECT 'Album' AS tbl, COUNT(*) AS rows FROM Album
    UNION ALL SELECT 'Artist',      COUNT(*) FROM Artist
    UNION ALL SELECT 'Customer',    COUNT(*) FROM Customer
    UNION ALL SELECT 'Employee',    COUNT(*) FROM Employee
    UNION ALL SELECT 'Genre',       COUNT(*) FROM Genre
    UNION ALL SELECT 'Invoice',     COUNT(*) FROM Invoice
    UNION ALL SELECT 'InvoiceLine', COUNT(*) FROM InvoiceLine
    UNION ALL SELECT 'Track',       COUNT(*) FROM Track;
    
    
    tbl          rows
    -----------  ----
    Album        347
    Artist       275
    Customer     59
    Employee     8
    Genre        25
    Invoice      412
    InvoiceLine  2240
    Track        3503

If your numbers match, the database is intact and you are done setting up. `UNION ALL` is doing something simple here: it stacks the result of one query underneath another, so eight one-row counts become one eight-row report. Keep this query. It is the same move used to check any database you are handed, and on a real job it is how you prove a load finished before anyone asks.

Two numbers to hold on to, because the rest of the page uses them: **412 invoices** and **2,240 invoice lines**.

## 4. Your first join across two tables

Before the explanation: the Invoice table records what each sale was worth, and the Customer table records where each customer lives. Which of the two questions "what did we sell" and "where do our buyers live" needs both tables at once?

Here is the query that could not exist on a single file. Revenue by country needs the money from one table and the country from another.
    
    
    SELECT c.Country,
           COUNT(*)            AS invoices,
           ROUND(SUM(i.Total), 2) AS revenue
    FROM Invoice i
    JOIN Customer c ON c.CustomerId = i.CustomerId
    GROUP BY c.Country
    ORDER BY revenue DESC
    LIMIT 5;
    
    
    Country  invoices  revenue
    -------  --------  -------
    USA      91        523.06
    Canada   56        303.96
    France   35        195.1
    Brazil   35        190.1
    Germany  28        156.48

The line doing the work is `ON c.CustomerId = i.CustomerId`. It says: an invoice row and a customer row belong together when the customer id written on the invoice matches the customer's own id. That shared column is the key, and it is the line drawn in the picture at the top. If you want the full account of what joins do to your row count, [SQL JOINs](https://michaelnocito.github.io/analyst-prep-kit/guides/sql-joins/) is the guide for it.

Notice that 91 + 56 + 35 + 35 + 28 = 245, not 412, because `LIMIT 5` cut the list at five countries. A total that does not reconcile is usually a filter you forgot you wrote, and `LIMIT` counts as one.

## 5. Northwind, Sakila and the kit's own data: when each is right

Three other names come up constantly. Here is the honest comparison, with the numbers I measured rather than the ones repeated online.

| Database                       | What it holds                                                                                                                               | What it costs you to set up                                                     | Pick it when                                                                                 |
|--------------------------------|---------------------------------------------------------------------------------------------------------------------------------------------|---------------------------------------------------------------------------------|----------------------------------------------------------------------------------------------|
| **Chinook**                    | Music store. 11 tables, 3,503 tracks, 412 invoices, 59 customers.                                                                           | Download one 1 MB file and open it.                                             | You are starting. This is the default.                                                       |
| **Northwind** (SQLite version) | Small-business orders. 13 tables plus views. The prepopulated file I downloaded has 16,282 orders and 609,283 order lines, in a 24 MB file. | Download one file and open it.                                                  | You want enough rows that a missing index is actually slow, or you want practice with views. |
| **Sakila**                     | DVD rental shop. 1,000 films, plus stored procedures and triggers.                                                                          | Needs MySQL installed and running, then two scripts loaded at the command line. | A job asked for MySQL specifically. It does not work on SQLite.                              |
| **The SQL Kit's own data**     | A products and sales pair, 180 sales rows, with missing regions left in on purpose.                                                         | Nothing. It runs in the browser tab.                                            | You want to type a query in the next thirty seconds without downloading anything.            |

The Northwind numbers are worth a second look, because most pages describing it quote the original Microsoft version with a few hundred orders. The SQLite build now ships prepopulated with far more, which is a good thing and a surprise if you were told to expect 830 rows. Always count before you trust a description, including this one.

## 6. The holes in the data are the point

Sample databases are often described as clean. Chinook is not, and that is its best feature. Run this.
    
    
    SELECT COUNT(*)                    AS total,
           COUNT(Composer)             AS has_composer,
           COUNT(*) - COUNT(Composer)  AS missing
    FROM Track;
    
    
    total  has_composer  missing
    -----  ------------  -------
    3503   2525          978

Say why those two counts differ, in one sentence, before reading on.

`COUNT(*)` counts rows. `COUNT(Composer)` counts rows where that column actually holds a value. 978 tracks have no composer recorded, which is 28% of the catalogue. Nothing errored, nothing warned you, and any report you build grouped by composer silently describes the other 72%. That gap is what [NULL in SQL](https://michaelnocito.github.io/analyst-prep-kit/guides/sql-null/) is about, and meeting it here on a toy database is much cheaper than meeting it in front of a client.

The Customer table has the same shape of hole. Of 59 customers, only 10 have a company recorded and only 30 have a state. A blank is a fact about your data collection, not a mistake to paper over.

## 7. Watch 412 rows turn into 2,240

The single most expensive SQL mistake is a join that quietly multiplies rows, and this database will show it to you in one line.
    
    
    SELECT COUNT(*) AS rows_after_join
    FROM Invoice i
    JOIN InvoiceLine l ON l.InvoiceId = i.InvoiceId;
    
    
    rows_after_join
    ---------------
    2240

You started from a table of 412 invoices and got back 2,240 rows. Nothing is broken. Each invoice has several lines on it, one per track bought, so joining lines onto invoices repeats the invoice once for every line. Average it out: 2,240 ÷ 412 = 5.4 tracks per sale.

The danger is what happens next. Write `SUM(i.Total)` against that joined result and every invoice total gets added once per line, so a 5.4-line invoice is counted 5.4 times and your revenue figure comes out several times too high. It will look like a plausible number. Nothing will warn you.

Now picture your own work data instead: orders and order lines, tickets and ticket comments, patients and visits. Which pair in your world is the one that would multiply, and has anyone ever summed money across it? That instinct, checking the row count before and after every join, is the single habit this database is best at teaching.

## The full before and after

Same goal both times: find out what the store's sales look like.

### Before
    
    
    -- One file, one table, exported to a spreadsheet.
    SELECT * FROM Invoice;

412 rows of invoice ids, dates and totals. You can sum it, sort it, and filter it. You cannot say who bought, where they live, what they bought, or whether one country's average order is bigger than another's, because none of those facts are in this table. Every interesting question is one table away.

### After
    
    
    -- Three tables, joined on their keys, one row per country.
    SELECT c.Country,
           COUNT(DISTINCT i.InvoiceId)   AS invoices,
           COUNT(*)                      AS lines_sold,
           ROUND(SUM(l.UnitPrice * l.Quantity), 2) AS revenue
    FROM Invoice i
    JOIN Customer c    ON c.CustomerId = i.CustomerId
    JOIN InvoiceLine l ON l.InvoiceId  = i.InvoiceId
    GROUP BY c.Country
    ORDER BY revenue DESC
    LIMIT 5;
    
    
    Country  invoices  lines_sold  revenue
    -------  --------  ----------  -------
    USA      91        494         523.06
    Canada   56        304         303.96
    France   35        190         195.1
    Brazil   35        190         190.1
    Germany  28        152         156.48

Read what changed. `COUNT(DISTINCT i.InvoiceId)` still says 91 for the USA, matching the earlier two-table result, because DISTINCT undoes the multiplication for that one column. `COUNT(*)` now reports 494 lines, which is the multiplied number and is the correct answer to a different question. And revenue is summed from the line prices rather than the invoice totals, so it cannot double-count. Three columns, three different grains, all correct, because each one was chosen deliberately.

## What goes wrong, and the fix

Five things that stop people on this exact page.

**The download saved as a text file.** Some browsers rename `Chinook_Sqlite.sqlite` to `.txt`, or open it on screen as a wall of symbols. Right-click the link and use Save link as rather than left-clicking it. If it already saved wrongly, rename the file back and it will open fine, because the extension was never what made it a database.

**"File is not a database."** This nearly always means you downloaded the web page instead of the file, and the giveaway is size: a real Chinook file is about 1 MB, and an HTML error page is a few kilobytes. Check the file size first, then download again.

**The table names will not match your query.** Chinook uses singular names, `Invoice` and not `Invoices`. Northwind uses plurals, `Orders` and `Customers`. Tutorials mix the two constantly. If you get "no such table", read the list in the sidebar rather than the tutorial.

**Spaces in a table name.** Northwind has a table literally called `Order Details`. Write it in double quotes, `SELECT * FROM "Order Details"`, or SQL reads the space as the end of the name.

**Your edits are not saved.** DB Browser holds changes in memory until you press Write Changes. Close without it and your new table is gone. This catches everyone once, and only once.

## Why practising on a real database works

Two reasons, and both are studied rather than folklore.

The first is why a database and not a file. The relational model defines data as a set of tables where relationships between them are carried by shared values in ordinary columns, rather than by pointers or by the order rows happen to sit in (Codd, 1970, _Communications of the ACM_ , 13(6), 377–385). That is the whole reason a key works: `CustomerId` in Invoice means something only because it is drawn from the same pool of values as `CustomerId` in Customer. A single CSV has no second pool, so joining, the central operation of the model, has nothing to operate on. You cannot practise the idea on data that does not contain it.

The second is why running the queries beats reading them. Retrieving an answer from memory produces substantially better long-term retention than re-reading the same material, and the gap widens rather than narrows as time passes (Roediger & Karpicke, 2006, _Psychological Science_ , 17(3), 249–255). Typing the join yourself and predicting the row count is retrieval. Watching a tutorial type it is re-reading. That is also why this page kept asking you to commit to an answer before showing one, since attempting first improves retention of the correct answer even when the attempt is wrong (Bisra, Liu, Nesbit, Salimi, & Winne, 2018, _Educational Psychology Review_ , 30(3), 703–725).

## Using this on your own project

Do not try to learn all 11 tables. Nobody holds a schema in their head, and trying is why people quit on day two. Do this instead, in order.

  1. **Run the row-count query first, every time** you open any database, yours or a client's. It takes ten seconds and it is the only proof you have that the thing is complete.
  2. **Learn two tables at a time** , and only the pair you need for one question. Invoice and Customer answers "who is buying". That is a whole evening's work and it is enough.
  3. **Count rows before and after every join.** If the number grew, say out loud why it grew before you write another line. This is the habit that pays for the whole exercise.
  4. **Write one question a day in a sentence first** , in words, then translate it. "Which country spends most per order" beats opening the tool and poking about.
  5. **Keep a scratch file of queries that worked.** In three weeks it becomes the thing you paste from, and it is the beginning of a portfolio.

If you have paper nearby, one optional drawing is worth five minutes. Draw the four tables you have met, Customer, Invoice, InvoiceLine and Track, as four boxes, then draw the line between each pair and write the key column on the line. Getting `InvoiceLine` in the middle, touching both Invoice and Track, is the moment the 412 becoming 2,240 stops being a surprise.

**More detail on this, and more like it.** Every how-to sits in one place on the [guides index](https://michaelnocito.github.io/analyst-prep-kit/guides/): getting set up, SQL, Excel, Python, and the working habits around them.

## The whole thing on one screen

This is the retrieval sheet. Cover the right column, work down the left, and say each answer out loud before you check it.

| Thing                      | What it is, or what it does                                                                |
|----------------------------|--------------------------------------------------------------------------------------------|
| Sample database            | One file holding many tables that already refer to each other correctly.                   |
| Why not one CSV            | Joins, grains and reconciliation all need a second table. A file has no second table.      |
| Chinook                    | The beginner default. One 1 MB SQLite file, 11 tables, no setup.                           |
| Northwind                  | Same ease, far more rows. The SQLite build ships with 16,282 orders.                       |
| Sakila                     | Needs MySQL running. Does not work on SQLite.                                              |
| The proof query            | `SELECT 'T', COUNT(*) FROM T UNION ALL ...` Row counts for every table at once.            |
| Key                        | A column whose values are drawn from the same pool as a column in another table.           |
| `JOIN ... ON a.id = b.id`  | Pairs rows from two tables wherever the key values match.                                  |
| Row multiplication         | 412 invoices joined to 2,240 lines returns 2,240 rows. Each invoice repeats once per line. |
| The money trap             | Summing an invoice total across a joined line table counts it once per line.               |
| `COUNT(DISTINCT id)`       | Counts each invoice once again after a join has repeated it.                               |
| `COUNT(*)` vs `COUNT(col)` | Rows against values present. 3,503 tracks, 2,525 composers, 978 blanks.                    |
| "File is not a database"   | You downloaded the web page. Check the size: 1 MB good, a few KB wrong.                    |
| Table with a space         | Quote it: `FROM "Order Details"`.                                                          |
| Write Changes              | DB Browser holds edits in memory until you press it. Then they are saved.                  |

**The one habit to keep.** Count the rows before the join and after it, every single time, and say out loud why the number changed. That one check catches the multiplied revenue, the missing rows, and the accidental filter, which between them are most of what goes wrong in SQL. If a query breaks in a way this page does not cover, there is a general [diagnosis loop for being stuck](https://michaelnocito.github.io/analyst-prep-kit/guides/technical-tenacity/).

One last thought, and I would genuinely like other people's answers. The first time a join multiplied my rows, the total was wrong by a factor I could not explain, and I spent an hour convinced the data was corrupt rather than that I had asked the wrong question. What was the first number you could not make reconcile, and what turned out to be behind it?

## References

  * Codd, E. F. (1970). A relational model of data for large shared data banks. _Communications of the ACM_ , 13(6), 377–387.
  * Roediger, H. L., & Karpicke, J. D. (2006). Test-enhanced learning: Taking memory tests improves long-term retention. _Psychological Science_ , 17(3), 249–255.
  * Bisra, K., Liu, Q., Nesbit, J. C., Salimi, F., & Winne, P. H. (2018). Inducing self-explanation: A meta-analysis. _Educational Psychology Review_ , 30(3), 703–725.

---

*Originally published on Analyst Prep Kit: [Where to Get a Sample Database to Practice SQL (And How to Check It Loaded)](https://michaelnocito.github.io/analyst-prep-kit/guides/sample-database-for-sql-practice/)*

*Visit the site for more beginner data analysis guides and free resources: [the full guide archive](https://michaelnocito.github.io/analyst-prep-kit/guides/) covers SQL, Excel, Power BI, Tableau, Python and statistics, and the [practice kits](https://michaelnocito.github.io/analyst-prep-kit/) run in your browser with nothing to install.*

*If it was useful: [Buy Me a Coffee](https://buymeacoffee.com/michaelnocito).*
