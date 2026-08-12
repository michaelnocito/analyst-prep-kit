By the end of this page you will be running SQL directly against a CSV file on your machine, with no import step, no `CREATE TABLE`, and no schema written by hand. DuckDB reads the file where it lies, works out the column types itself, and gives you a normal SQL result. It takes one command to install and about a minute to prove.

Here is what to actually do today. Run `python -m pip install duckdb`, then write a query with your CSV's filename in quotes where the table name would normally go. That is the entire idea, and everything else on this page is a consequence of it.

The short version: a file is a table. It suits large files and folders of files, it does not replace SQLite for a shared database you keep, and section 6 says which to use when.

The missing import step is the one idea worth the page, so it gets the picture.

> _The original carries a diagram here. In words: Two horizontal sequences. The upper sequence runs through four stages joined by arrows: a file icon, then a box representing a schema being written, then a database cylinder, then a result grid. The lower sequence has only two stages joined by a single long arrow: the same file icon on the left and the same result grid on the right, with the middle two stages absent and the empty space where they used to be left visibly blank._

**Every output on this page is real.** Run on 8 August 2026 with DuckDB 1.5.5 on Windows, against a 412-row CSV exported from the Chinook sample database. The numbers match the ones in [the sample-database guide](https://michaelnocito.github.io/analyst-prep-kit/guides/sample-database-for-sql-practice/) and [the Python guide](https://michaelnocito.github.io/analyst-prep-kit/guides/connect-python-to-a-sql-database/) on purpose, because it is the same data through three different tools.

## 1. Install it

Before the explanation: every database you have met so far needed you to create a table before you could put anything in it. What would have to be true for that step to be unnecessary?
    
    
    python -m pip install duckdb

That is the whole installation. No server, no service running in the background, no configuration file, and no administrator rights. Like SQLite, DuckDB is a library that runs inside your own program rather than a program you start and connect to.

Write it as `python -m pip` rather than bare `pip`, for the reason set out in [installing Python for data analysis](https://michaelnocito.github.io/analyst-prep-kit/guides/install-python-for-data-analysis/): it guarantees the package lands in the Python you are about to run.

There is also a standalone command-line version if you would rather work in a terminal than in Python, and a browser version, but the Python package is the one that fits an analyst's day and it is what this page uses.

## 2. Query a CSV with no import

Here is the whole point of the tool, in six lines.
    
    
    import duckdb
    
    print(duckdb.sql("""
        SELECT Country, COUNT(*) AS invoices, ROUND(SUM(Total), 2) AS revenue
        FROM 'invoices.csv'
        GROUP BY Country
        ORDER BY revenue DESC
        LIMIT 5
    """))
    
    
    ┌─────────┬──────────┬─────────┐
    │ Country │ invoices │ revenue │
    │ varchar │  int64   │ double  │
    ├─────────┼──────────┼─────────┤
    │ USA     │       91 │  523.06 │
    │ Canada  │       56 │  303.96 │
    │ France  │       35 │   195.1 │
    │ Brazil  │       35 │   190.1 │
    │ Germany │       28 │  156.48 │
    └─────────┴──────────┴─────────┘

Read the `FROM` line again, because it is the answer to the opening question. `FROM 'invoices.csv'` is a filename in quotes sitting exactly where a table name goes. There was no `CREATE TABLE`, no import wizard, no column list, and no database file created anywhere. DuckDB opened the file, read what it needed, and answered.

Notice the second header row in the output. Under each column name is its type: `varchar`, `int64`, `double`. Those were worked out from the file, and printing them by default is a small design decision that saves a great deal of confusion.

## 3. What it worked out about your file

You can ask directly what types it decided on, which is the first thing to do with any new file.
    
    
    print(duckdb.sql("DESCRIBE SELECT * FROM 'invoices.csv'"))
    
    
    ┌─────────────┬─────────────┬─────────┬─────────┬─────────┬─────────┐
    │ column_name │ column_type │  null   │   key   │ default │  extra  │
    │   varchar   │   varchar   │ varchar │ varchar │ varchar │ varchar │
    ├─────────────┼─────────────┼─────────┼─────────┼─────────┼─────────┤
    │ InvoiceId   │ BIGINT      │ YES     │ NULL    │ NULL    │ NULL    │
    │ Country     │ VARCHAR     │ YES     │ NULL    │ NULL    │ NULL    │
    │ InvoiceDate │ TIMESTAMP   │ YES     │ NULL    │ NULL    │ NULL    │
    │ Total       │ DOUBLE      │ YES     │ NULL    │ NULL    │ NULL    │
    └─────────────┴─────────────┴─────────┴─────────┴─────────┴─────────┘

Four columns of plain text in a file, and it correctly identified a whole number, some text, a timestamp and a decimal. The date column matters most: dates arriving as text is one of the most common frustrations in every other tool on this site, and here it was handled without being asked.

Say why you should still read this output rather than trust it, before reading on. Because inference is a guess made from the file's contents, and a column that happens to look numeric in every row you sampled can still be a code with meaning. `DESCRIBE` takes two seconds and tells you what the tool decided, which is the only way to notice when it decided something you did not want.

## 4. A whole folder as one table

This is the feature that turns DuckDB from convenient into genuinely useful for analyst work. If your data arrives as one file per month, you can query all of them at once by putting a `*` in the filename.
    
    
    print(duckdb.sql("SELECT COUNT(*) AS rows_across_files FROM 'months/*.csv'"))
    
    
    ┌───────────────────┐
    │ rows_across_files │
    │       int64       │
    ├───────────────────┤
    │               239 │
    └───────────────────┘

Two files in that folder, 119 rows and 120 rows, and 239 came back. There was no loop, no concatenation step, and no list of filenames to maintain. Adding a new month means dropping a file into the folder, and the same query picks it up.

Think about the monthly reporting job you or a colleague runs. If the twelve files for last year sat in one folder, how much of that job is just the work of sticking them together? That part is what a single asterisk removes.

## 5. Into pandas, and back out

DuckDB is built to sit beside pandas rather than replace it. Add `.df()` to get a DataFrame.
    
    
    df = duckdb.sql("""
        SELECT Country, COUNT(*) AS n
        FROM 'invoices.csv'
        GROUP BY Country ORDER BY n DESC LIMIT 3
    """).df()
    print(df)
    
    
    Country  n
        USA 91
     Canada 56
     France 35

That needs pandas installed, which DuckDB does not require on its own. It works the other way too: a DataFrame already in memory can be queried by name, so `SELECT * FROM my_dataframe` works with no conversion step at all.

That two-way street is the sensible division of labour. Use SQL for filtering, joining and grouping, which is what SQL is best at, then hand the small result to pandas for reshaping and charting. It is the same dividing line described in [connecting Python to a SQL database](https://michaelnocito.github.io/analyst-prep-kit/guides/connect-python-to-a-sql-database/), with less ceremony in the middle.

## 6. DuckDB or SQLite: which, when

Both are file-based, both need no server, and they are built for different jobs. Neither is an upgrade of the other.

| Situation                                            | Reach for | Because                                                        |
|------------------------------------------------------|-----------|----------------------------------------------------------------|
| A CSV or Parquet file you want to question right now | DuckDB    | No import step. The file is the table.                         |
| A folder of files with the same shape                | DuckDB    | One asterisk reads all of them.                                |
| Summarising millions of rows                         | DuckDB    | Built for aggregating over columns, which is what analysis is. |
| A database you keep, add to, and hand to someone     | SQLite    | A single stable file that everything can open.                 |
| Practising SQL for interviews                        | SQLite    | Every tutorial and browser tool uses it, so examples match.    |
| Lots of small writes and updates                     | SQLite    | Designed for row-by-row work.                                  |

In practice many analysts use both without thinking about it: DuckDB to explore whatever landed today, SQLite for the tidy database a project keeps. If you are choosing your first one and preparing for interviews, start with SQLite and the [fifteen-minute setup](https://michaelnocito.github.io/analyst-prep-kit/guides/set-up-a-sql-database/), then add DuckDB the first time a file is too big or too plural to be comfortable.

## The full before and after

Same goal: revenue by country from a CSV somebody sent you.

### Before
    
    
    1. Open DB Browser, create a new database file
    2. Import CSV, click through the wizard
    3. Fix the columns it guessed as text
    4. Write the query
    5. Next month, repeat all four for the new file
    6. To combine months, import each one and UNION them

Every step works, and five of the six are handling rather than analysis. Step 6 is the one that scales badly, because the effort grows with the number of files rather than staying flat.

### After
    
    
    import duckdb
    duckdb.sql("SELECT Country, SUM(Total) FROM 'months/*.csv' GROUP BY Country")

The import step is gone, the type fixes are gone, and the number of files stopped mattering. What remains is the query, which was the only part that ever expressed what you wanted to know.

## What goes wrong, and the fix

Six worth knowing.

**The output prints as garbled symbols on Windows.** DuckDB draws its result tables with box-drawing characters, and an older Windows console cannot encode them. Set `PYTHONIOENCODING=utf-8` before running, or use `.df()` and print that instead. Nothing is wrong with the query.

**"No files found that match the pattern".** The path is relative to where you ran Python, not to where the script file sits. Print your working directory, or use a full path.

**A column came out as text when it should be a number.** Something in it is not numeric, often a thousands separator or an "N/A". `DESCRIBE` shows you which column, and `CAST(col AS DOUBLE)` in the query is the deliberate fix.

**Files in a folder have different columns.** The glob assumes one shape. Add `union_by_name=true` to the read function if the columns match by name but not by order.

**`.df()` fails with a missing module.** pandas is not installed in that environment. DuckDB does not install it for you.

**A query on a huge file uses all your memory.** Select only the columns you need rather than `SELECT *`. Reading fewer columns is where most of the speed comes from, and asking for all of them gives that advantage away.

## Why it can do this

Two design choices explain everything on this page.

The first is **where the data is stored**. Most databases you have met store a table row by row, which suits fetching one customer's whole record. DuckDB stores and processes data column by column, which suits the opposite job: reading one column across millions of rows to add it up. Analysis is almost entirely that second shape, so a query that touches three columns of a forty-column file only reads three columns' worth of work. That is also why `SELECT *` throws the advantage away.

The second is that the file **is** the table. Because DuckDB can read CSV and Parquet directly and infer their types, there is nothing to load in advance, and no copy of your data sitting in a second place going stale. The import step in every other tool exists to convert a file into the database's own storage format; remove the need for that conversion and the step disappears with it.

One note on the way this page is written. It kept asking you to commit to an answer, what would make an import unnecessary, why to read the types anyway, before giving one. Attempting an answer before seeing the correct one reliably improves how well the correct one is retained, even when the attempt is wrong (Bisra, Liu, Nesbit, Salimi, & Winne, 2018, _Educational Psychology Review_ , 30(3), 703–725).

## Using this on your own work

Five habits, in order.

  1. **Run`DESCRIBE` on any new file first.** Two seconds, and it tells you what the tool decided before you build on it.
  2. **Name the columns you want** rather than `SELECT *`. That is where the speed lives.
  3. **Put same-shaped files in one folder** and query them with an asterisk, instead of writing code that stitches them together.
  4. **Aggregate in the query, chart in pandas.** Hand pandas the small result, never the whole file.
  5. **Keep SQLite for the database you keep** , and use DuckDB for the files that arrive. They are not competing.

If you have paper nearby, one optional drawing is worth two minutes. Draw the four boxes from the top of this page for a job you actually run, then cross out any box that exists only to move data rather than to answer something. What is left is the work, and the crossed-out boxes are what this tool is for.

**More detail on this, and more like it.** Every how-to sits in one place on the [guides index](https://michaelnocito.github.io/analyst-prep-kit/guides/): getting set up, SQL, Excel, Python, and the working habits around them.

## The whole thing on one screen

This is the retrieval sheet. Cover the right column, work down the left, and say each answer out loud before you check it.

| Thing                            | What it is, or what it does                                    |
|----------------------------------|----------------------------------------------------------------|
| Install                          | `python -m pip install duckdb`. No server, no admin rights.    |
| The core idea                    | A filename in quotes goes where a table name goes.             |
| `FROM 'data.csv'`                | Queries the file in place. No import, no CREATE TABLE.         |
| Types                            | Inferred from the file, including dates as TIMESTAMP.          |
| `DESCRIBE SELECT * FROM 'f.csv'` | Shows what it decided each column is. Run it first, always.    |
| Type row in the output           | Printed under the column names by default.                     |
| `FROM 'months/*.csv'`            | Every matching file as one table. No loop, no concatenation.   |
| `.df()`                          | Returns a pandas DataFrame. Needs pandas installed.            |
| Querying a DataFrame             | `SELECT * FROM my_df` works with no conversion.                |
| Column storage                   | Reads only the columns you name. Why `SELECT *` is expensive.  |
| Garbled Windows output           | Box-drawing characters. Set `PYTHONIOENCODING=utf-8`.          |
| "No files found"                 | Paths are relative to where you ran Python, not to the script. |
| Mismatched folder files          | `union_by_name=true` when columns match by name, not order.    |
| Use DuckDB for                   | Files that arrive, folders of files, big summaries.            |
| Use SQLite for                   | A database you keep and share, and interview practice.         |

**The one habit to keep.** `DESCRIBE` before you analyse, every new file. It costs two seconds and it is the only moment where a wrong type is cheap to notice, rather than being discovered later through a total that will not add up. If something breaks in a way this page does not cover, there is a general [diagnosis loop for being stuck](https://michaelnocito.github.io/analyst-prep-kit/guides/technical-tenacity/).

One last thought, and I would genuinely like other people's answers. The job that made this click for me was a folder of monthly exports I had been stitching together by hand, which turned out to be one asterisk. What repetitive step in your week is secretly one line?

## References

  * Bisra, K., Liu, Q., Nesbit, J. C., Salimi, F., & Winne, P. H. (2018). Inducing self-explanation: A meta-analysis. _Educational Psychology Review_ , 30(3), 703–725.

---

*Originally published on Analyst Prep Kit: [How to Set Up DuckDB (Run SQL on a CSV With No Import Step)](https://michaelnocito.github.io/analyst-prep-kit/guides/set-up-duckdb/)*

*Visit the site for more beginner data analysis guides and free resources: [the full guide archive](https://michaelnocito.github.io/analyst-prep-kit/guides/) covers SQL, Excel, Power BI, Tableau, Python and statistics, and the [practice kits](https://michaelnocito.github.io/analyst-prep-kit/) run in your browser with nothing to install.*

*If it was useful: [Buy Me a Coffee](https://buymeacoffee.com/michaelnocito).*
