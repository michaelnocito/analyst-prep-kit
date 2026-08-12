Every SQL tutorial assumes your data is already "in a database." Nobody explains the step in between. This guide is that step. You'll get a data file, create your first real database on your own computer, load the file into it, and run your first query. It takes two desktop tools and zero server setup.

You do not need to bring your own data. Step 1 gives you a file to download, and every query in this guide runs against it.

If you are still weighing up which engine to put on your machine, the one-question version of that decision is in [which SQL database should you install](https://michaelnocito.github.io/analyst-prep-kit/guides/which-sql-database-to-install/). Everyone else can start at step 1.

## First: what are you actually building?

Say what you think a database is, in one sentence, before you read the next one. Whatever you pictured, the real answer for this guide is smaller and less intimidating than that.

A database sounds like a big scary server in a data center. For learning and portfolio projects, it isn't. With **SQLite** , a database is just **one file on your computer** — like `mygames.db` sitting in your Documents folder. Inside that file live one or more **tables** , and a table is just a grid of rows and columns, like a spreadsheet sheet.

So the whole job is: make the file, put your CSV inside it as a table, confirm nothing got lost. That's it.

**Why SQLite and not MySQL or Postgres?** Those need a server installed and running before you can do anything. SQLite needs nothing — and the SQL you write on it (SELECT, WHERE, JOIN, GROUP BY) is the same SQL you'll use on the job. Start here; switch later if a job requires it.

## Step 1 — Get a CSV file to work with

A CSV is a plain text file holding a table, one row per line, values separated by commas. It is what almost every "download this data" button gives you.

If you already have one, use it and skip ahead. If not, here is the file the rest of this guide uses. Right-click the link, choose **Save link as** , and put it somewhere you can find again.

  1. [seattle-weather.csv](https://raw.githubusercontent.com/vega/vega-datasets/main/data/seattle-weather.csv) — four years of daily Seattle weather. 1,461 rows, about 60 KB, no sign-up.
  2. Open it once in Excel or a text editor before you go further. Six columns: date, precipitation, temp_max, temp_min, wind, weather. Knowing what is in the file is what lets you tell later whether it loaded correctly.

Before you move on, say out loud how many rows you expect to end up in the database. You just read the number. Holding on to it is what makes step 5 mean something.

**Want different data?** Any CSV works, and the steps do not change. Two places that hand you one without an account: [vega-datasets](https://github.com/vega/vega-datasets/tree/main/data) has around twenty small, clean files, and [NYC Open Data](https://data.cityofnewyork.us/) has thousands of large real ones. If you pick your own, use your own table name everywhere this guide says `weather_raw`.

## Step 2 — Install DB Browser for SQLite

**Where you'll type everything in this guide is a free desktop app called DB Browser for SQLite.** It gives SQLite a friendly point-and-click window plus a tab where you can type SQL.

  1. Go to [sqlitebrowser.org/dl](https://sqlitebrowser.org/dl/)
  2. Download the installer for Windows or Mac and run it (all defaults are fine)
  3. Open the app — you'll see a mostly empty window with buttons like _New Database_ and _Open Database_

## Step 3 — Create your database file

  1. Click **New Database** (top-left)
  2. Pick a folder you can find again, name the file something like `portfolio.db`, click Save
  3. A "Create Table" dialog pops up — click **Cancel**. You don't need it; the CSV import in the next step builds the table for you.

That's a real database. It's empty, but it exists — one file, no server.

## Step 4 — Import your CSV as a table

  1. In the menu: **File → Import → Table from CSV file…**
  2. Pick the CSV you downloaded in step 1
  3. In the import dialog: 
     * **Table name:** type `weather_raw`. The `_raw` suffix is an analyst habit: it marks this table as the untouched original. Any cleaning happens later, in a copy — never in the original. Naming rule: **underscores, never hyphens or spaces**. DB Browser auto-fills the name from the filename, so `seattle-weather.csv` arrives as `seattle-weather` — legal, but SQL reads the hyphens as subtraction, forcing you to quote the name in every query forever. Rename it before clicking OK.
     * **Tick "Column names in first line"** — otherwise your header row gets imported as a data row.
  4. Click OK, then press **Ctrl+S** (Cmd+S on Mac) to save the database. DB Browser doesn't write changes to the file until you save.

**Working with a large dataset?** If your file is hundreds of MB, has millions of rows, or won't open in Excel, the import takes longer and needs a couple of extra tricks (unzipping, indexing, sampling). See [How to Handle Large Datasets](https://michaelnocito.github.io/analyst-prep-kit/guides/handle-large-datasets/).

## Step 5 — Verify it with your first query

Before you run it, say what number you expect back. That expectation is the whole point of this step, because a query with nothing to compare it to cannot verify anything.

Click the **Execute SQL** tab. This is where you type SQL from now on. Type this and press the ▶ (play) button:
    
    
    SELECT COUNT(*) FROM weather_raw;

It returns one number: how many rows are in your table. With the Seattle weather file it should be **1461**. If you brought your own CSV, swap `weather_raw` for the table name you typed in step 4, and **compare the number to the row count of the source file** (open it in Excel and check the last row number, minus 1 for the header).

If they match, every row arrived. Then eyeball a few rows:
    
    
    SELECT * FROM weather_raw LIMIT 10;

You should see dates in the first column and numbers in the next four, with words like drizzle and rain in the last. If the columns look right and the count matches — you're done. You have a working SQL database, and every SQL lesson you take from here on applies to your own data.

## The two problems that bite everyone once

Both of these show up as a wrong answer rather than an error message, which is what makes them expensive. Guess what a total would look like if the database thought your prices were words instead of numbers.

### 1. Numbers imported as text

If a price column contains values like `$4.99` or `1,299`, the dollar sign and comma force it to import as TEXT — and `SUM(price)` returns garbage. The fix is to clean those values into a new numeric column (in a new table — never edit the `_raw` one). The SQL Kit's cleaning lessons cover exactly this.

### 2. Row count doesn't match

Off by exactly one? You probably forgot "column names in first line." Off by more? The CSV likely has quoting or delimiter problems (commas inside un-quoted text fields are the classic). Re-check the separator and quote settings in the import dialog.

## Cheat sheet

| Step            | Where           | Action                                                                                |
|-----------------|-----------------|---------------------------------------------------------------------------------------|
| Get data        | Browser         | Save a CSV to disk. `seattle-weather.csv` from vega-datasets if you have none         |
| Create database | DB Browser      | New Database → save a .db file → Cancel the table dialog                              |
| Import CSV      | File menu       | Import → Table from CSV → name it `something_raw` → tick "column names in first line" |
| Save            | DB Browser      | Ctrl+S — changes aren't in the file until you save                                    |
| Verify          | Execute SQL tab | `SELECT COUNT(*)` vs the CSV's row count, then `LIMIT 10` to eyeball                  |

## Same idea, bigger databases

On the job you'll meet MySQL (`LOAD DATA INFILE`) and Postgres (`COPY`). The tools change; the workflow you just learned doesn't: **create → import → verify** , and keep an untouched `_raw` copy.

And if the file itself is huge (millions of rows, gigabytes on disk), the same database still works, you just add a few habits: see [How to Handle Large Datasets](https://michaelnocito.github.io/analyst-prep-kit/guides/handle-large-datasets/).

**More detail on this, and more like it.** Every how-to sits in one place on the [guides index](https://michaelnocito.github.io/analyst-prep-kit/guides/): SQL, Tableau, data migration, and the working habits around them.

---

*Originally published on Analyst Prep Kit: [How to Set Up a SQL Database for Beginners](https://michaelnocito.github.io/analyst-prep-kit/guides/set-up-a-sql-database/)*

*Visit the site for more beginner data analysis guides and free resources: [the full guide archive](https://michaelnocito.github.io/analyst-prep-kit/guides/) covers SQL, Excel, Power BI, Tableau, Python and statistics, and the [practice kits](https://michaelnocito.github.io/analyst-prep-kit/) run in your browser with nothing to install.*

*If it was useful: [Buy Me a Coffee](https://buymeacoffee.com/michaelnocito).*
