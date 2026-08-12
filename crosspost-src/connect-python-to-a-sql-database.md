By the end of this page you will run a SQL query from Python and get back a pandas DataFrame with real column names, ready to chart or export. It takes three lines, needs nothing installed beyond pandas, and works the same way against Postgres and MySQL once you swap the connection.

Here is what to actually do today. Use `pd.read_sql(query, connection)` rather than a cursor and `fetchall()`. Both work. Only one of them hands you column names, and the other hands you a list of anonymous tuples you then have to label by counting positions.

The short version: `sqlite3.connect()` for a database file, `pd.read_sql()` for the query, and pass values as parameters instead of building the SQL string yourself.

The difference between the two ways of fetching is the one idea worth the page, so it gets the picture.

> _The original carries a diagram here. In words: One database drawn as a stack of cylinders on the left, with two arrows leaving it. The upper arrow ends at a small stack of bare bracketed rows containing only values, with an empty strip above them where headings would sit, left conspicuously blank. The lower arrow ends at a grid whose top row is shaded and filled with heading blocks, and whose body rows align beneath those headings in columns. Both results contain the same number of value blocks; only the labelled strip differs._

**Every output on this page is real.** Each snippet was run on 8 August 2026 against the Chinook sample database with Python 3.11 and pandas 3.0.2. If you want the same file to follow along with, [getting a sample database](https://michaelnocito.github.io/analyst-prep-kit/guides/sample-database-for-sql-practice/) is a one-minute download.

## 1. The three lines

Before the explanation: pandas can already read a CSV. What would connecting straight to a database give you that exporting a CSV first does not?
    
    
    import sqlite3
    import pandas as pd
    
    con = sqlite3.connect('Chinook_Sqlite.sqlite')
    
    df = pd.read_sql("""
        SELECT c.Country,
               COUNT(*)               AS invoices,
               ROUND(SUM(i.Total), 2) AS revenue
        FROM Invoice i
        JOIN Customer c ON c.CustomerId = i.CustomerId
        GROUP BY c.Country
        ORDER BY revenue DESC
        LIMIT 5
    """, con)
    
    print(df)
    
    
    Country  invoices  revenue
        USA        91   523.06
     Canada        56   303.96
     France        35   195.10
     Brazil        35   190.10
    Germany        28   156.48

That is the whole mechanism. The answer to the opening question is two things: there is no export step to repeat or forget, and the column types arrive with the data rather than being guessed from text. Nothing here has to be re-run by hand next month.

## 2. What each line is doing

`import sqlite3` costs nothing and installs nothing, because it is part of Python itself. That is worth knowing on a locked-down machine where installing software needs permission.

`sqlite3.connect('Chinook_Sqlite.sqlite')` opens the file and hands back a **connection** , which is your open line to the database. One warning: if that filename does not exist, SQLite creates a new empty database rather than complaining. So a typo in the path produces zero tables and no error, which is a confusing five minutes the first time.

`pd.read_sql(query, con)` sends the SQL, reads the result, and builds a DataFrame with the column names from your query. Notice that the names came from the `AS` aliases: `invoices` and `revenue` are labels you chose, and naming things in SQL means not renaming them in Python later. [SQL aliases](https://michaelnocito.github.io/analyst-prep-kit/guides/sql-aliasing/) covers that habit.

The triple-quoted string is doing quiet work too. It lets the SQL sit on several lines, indented and readable, exactly as you would write it in a database tool. A long query squeezed onto one line is the main reason people stop formatting their SQL once it moves into Python.

## 3. The cursor, and when you actually want it

The other way to get data out looks like this.
    
    
    cur = con.cursor()
    cur.execute("SELECT COUNT(*) FROM Track")
    print(cur.fetchone())
    
    
    (3503,)

A **cursor** is a pointer into a result set that you step through yourself. `fetchone()` takes one row, `fetchall()` takes them all. Notice what came back: a tuple holding a single number, with no column name attached and a trailing comma that confuses everyone once.

Say when that would be preferable to a DataFrame, before reading on.

Two cases, and both are real. When you want **one value** rather than a table, as above, building a whole DataFrame to hold the number 3503 is silly. And when you are **changing** data rather than reading it, with INSERT, UPDATE, DELETE or CREATE TABLE, a cursor is the correct tool, and you must call `con.commit()` afterwards or your change quietly disappears when the program ends.

For everything else, which as an analyst is nearly everything, read into a DataFrame. The labels are not a convenience; they are what stops you from writing `row[3]` and being wrong about which column that is after somebody adds a field.

## 4. Passing values safely

Sooner or later the query needs a value from a variable: a date, a customer, a threshold. There is an obvious way to do it and it is the wrong one.
    
    
    # Do not do this.
    threshold = 600000
    df = pd.read_sql(f"SELECT Name FROM Track WHERE Milliseconds > {threshold}", con)

Write it with a placeholder instead, and pass the value separately.
    
    
    df = pd.read_sql(
        "SELECT Name, Milliseconds FROM Track WHERE Milliseconds > ? LIMIT 3",
        con,
        params=(600000,),
    )
    print(df)
    
    
                   Name  Milliseconds
       Sleeping Village        644571
        You Shook Me(2)        619467
    How Many More Times        711836

The `?` is a placeholder, and `params` supplies what goes there. The database receives the query and the value as two separate things, so the value can never be read as instructions. With an f-string they arrive as one string, and any text inside it that happens to look like SQL is executed as SQL. That is the whole of what people mean by SQL injection, and it is a real hazard the moment a value comes from anywhere you do not control.

Two smaller reasons to prefer placeholders even on data you trust. Quoting and date formats are handled for you, which removes a persistent source of "why does this work in the database tool and not here". And `params=(600000,)` needs that trailing comma, because without it the brackets are just brackets rather than a tuple of one item.

## 5. Reaching Postgres, MySQL and the rest

Everything above changes by one line when the database is a server rather than a file. The query, the DataFrame and the placeholders stay the same.

The usual route is SQLAlchemy, which gives every engine one consistent way to describe a connection.
    
    
    python -m pip install sqlalchemy psycopg2-binary   # Postgres
    python -m pip install sqlalchemy pymysql            # MySQL
    
    
    from sqlalchemy import create_engine
    import pandas as pd
    
    engine = create_engine('postgresql+psycopg2://user:password@host:5432/dbname')
    df = pd.read_sql("SELECT * FROM sales LIMIT 5", engine)

That string is a connection URL and it reads left to right: which engine, which driver, who you are, which machine, which port, which database. Swap `postgresql+psycopg2` for `mysql+pymysql` and the same line reaches MySQL.

One thing not to do: never type a real password into a file you will commit. Read it from an environment variable with `os.environ['DB_PASSWORD']` instead, and keep the value out of your repository. [Git for analysts](https://michaelnocito.github.io/analyst-prep-kit/guides/git-for-analysts/) covers what else must never be committed.

## 6. Where to draw the line between SQL and pandas

Once both tools are in one script, the same job can be done in either, and the choice affects how long you wait.

The rule that holds up: **filter and aggregate in SQL, then reshape and chart in pandas.** Databases are built to reduce millions of rows to hundreds, and doing that first means only the hundreds travel into memory. Pulling a whole table into pandas and grouping it there works on a small table and stops working on a real one, usually on the day it matters.

So `WHERE`, `JOIN`, `GROUP BY` and `HAVING` belong in the query. Plotting, reshaping, joining to something that is not in the database, and anything iterative belong in pandas. If the grouping half is unfamiliar, [GROUP BY and HAVING](https://michaelnocito.github.io/analyst-prep-kit/guides/sql-group-by-having/) and [pandas GroupBy](https://michaelnocito.github.io/analyst-prep-kit/guides/pandas-groupby/) are the same idea in both languages.

Now picture your own current script. Which line first turns a big thing into a small thing, and how many rows are sitting in memory before it? If the answer is all of them, that line probably belongs in the query.

## The full before and after

Same goal: revenue by country, in a chart.

### Before
    
    
    1. Run the query in DB Browser
    2. Export results to CSV
    3. pd.read_csv('export.csv')
    4. Fix the revenue column, which arrived as text
    5. Chart it
    6. Next month, repeat all six

It works, and every step is a chance to do something slightly differently than last time. Step 4 is the one that hurts, because a thousands separator in the export turns a number column into text and the fix has to be remembered rather than recorded.

### After
    
    
    con = sqlite3.connect('Chinook_Sqlite.sqlite')
    df = pd.read_sql(QUERY, con)
    df.plot(x='Country', y='revenue', kind='bar')

Three lines, and the whole thing re-runs by pressing play. The type problem cannot happen, because the numbers never became text: `invoices` arrives as an integer and `revenue` as a float, carried across from the database rather than parsed out of a file. Re-running it next month is not a procedure, it is the same three lines.

## What goes wrong, and the fix

Six that come up constantly.

**"no such table" on a database you know has tables.** The path was wrong, so SQLite created a new empty file. Check the path, and list what is actually there with `pd.read_sql("SELECT name FROM sqlite_master WHERE type='table'", con)`.

**Your INSERT or UPDATE did nothing.** You did not call `con.commit()`. Reads need no commit; writes do.

**The database is locked.** Another program has it open with unsaved changes, very often DB Browser. Press Write Changes there, or close it.

**Numbers arrive as text.** Rare from a database and common from CSV, which is the point. If it happens, the column is genuinely stored as text in the table, and `CAST(col AS REAL)` in the query is the honest fix.

**The script hangs on a big query.** You asked for more rows than you need. Add a `LIMIT` while developing, then take it off once the query is right.

**The connection is never closed.** Use `with sqlite3.connect(path) as con:` or call `con.close()`. Leaving connections open is what eventually produces the locked-database message above.

## Why this works

The reason one line reaches every database is a specification rather than a coincidence. Python defines a common database interface, so any driver that follows it offers the same `connect`, `cursor`, `execute` and `fetch` vocabulary, which is why swapping SQLite for Postgres changes the connection line and nothing else. `read_sql` sits on top of that shared vocabulary, which is why it works against all of them without knowing which one it is talking to.

Placeholders work for a structural reason worth understanding once. The database receives the query text and the values through separate channels, parses the query first, and only then fills the values into the parsed structure. A value therefore cannot change what the query means, because by the time it arrives the meaning is already fixed. String formatting removes that separation, which is why the advice is a rule rather than a preference.

One note on the way this page is written. It kept asking you to commit to an answer, what a connection buys over a CSV, when a cursor beats a DataFrame, before giving one. Attempting an answer before seeing the correct one reliably improves how well the correct one is retained, even when the attempt is wrong (Bisra, Liu, Nesbit, Salimi, & Winne, 2018, _Educational Psychology Review_ , 30(3), 703–725).

## Using this on your own project

Five habits, in order.

  1. **Use`read_sql` by default**, and a cursor only for single values and for changing data.
  2. **Name every computed column with`AS`** in the query, so the DataFrame arrives labelled and nothing needs renaming.
  3. **Never build SQL with an f-string.** Placeholders and `params`, every time, even on data you trust.
  4. **Filter and group in SQL** , reshape and plot in pandas. Only the small result should travel.
  5. **Keep credentials out of the file** , in environment variables, and out of your repository.

If you have paper nearby, one optional drawing is worth five minutes. Draw your script as a line from database to chart, and mark the point where the data stops being millions of rows and becomes hundreds. Everything to the left of that mark should be happening inside the query.

**More detail on this, and more like it.** Every how-to sits in one place on the [guides index](https://michaelnocito.github.io/analyst-prep-kit/guides/): getting set up, SQL, Excel, Python, and the working habits around them.

## The whole thing on one screen

This is the retrieval sheet. Cover the right column, work down the left, and say each answer out loud before you check it.

| Thing                   | What it is, or what it does                                        |
|-------------------------|--------------------------------------------------------------------|
| `import sqlite3`        | Built into Python. Nothing to install.                             |
| `sqlite3.connect(path)` | Opens the file. A wrong path silently creates an empty database.   |
| `pd.read_sql(q, con)`   | Runs the query, returns a labelled DataFrame. The default choice.  |
| Cursor and `fetchall()` | Bare tuples, no column names. For single values and for writes.    |
| `con.commit()`          | Required after INSERT, UPDATE, DELETE. Reads need none.            |
| `AS` aliases            | Become the DataFrame's column names. Name things in the query.     |
| `?` and `params=`       | Sends value and query separately. The safe way, always.            |
| f-string SQL            | Merges value into instructions. This is SQL injection.             |
| `params=(600000,)`      | The trailing comma is what makes it a tuple.                       |
| `create_engine(url)`    | SQLAlchemy. One line changes to reach Postgres or MySQL.           |
| Connection URL          | engine+driver://user:password@host:port/database                   |
| Credentials             | `os.environ`, never typed into a committed file.                   |
| The dividing line       | Filter and group in SQL. Reshape and plot in pandas.               |
| "database is locked"    | Another program holds it, usually DB Browser with unsaved changes. |
| Listing tables          | `SELECT name FROM sqlite_master WHERE type='table'`                |

**The one habit to keep.** Placeholders instead of f-strings, without exception. It is one character of extra typing, it removes an entire category of security problem, and it fixes the quoting and date bugs that make a query behave differently in Python than it did in your database tool. If something breaks in a way this page does not cover, there is a general [diagnosis loop for being stuck](https://michaelnocito.github.io/analyst-prep-kit/guides/technical-tenacity/).

One last thought, and I would genuinely like other people's answers. The first time I pointed a script at the wrong path, SQLite cheerfully made me an empty database and every query returned nothing at all, with no error to explain why. What silent success cost you the most time?

## References

  * Bisra, K., Liu, Q., Nesbit, J. C., Salimi, F., & Winne, P. H. (2018). Inducing self-explanation: A meta-analysis. _Educational Psychology Review_ , 30(3), 703–725.

---

*The full version of this guide lives on my site: [How to Connect Python to a SQL Database (Straight Into a DataFrame)](https://michaelnocito.github.io/analyst-prep-kit/guides/connect-python-to-a-sql-database/).*

*If it was useful: [Buy Me a Coffee](https://buymeacoffee.com/michaelnocito).*
