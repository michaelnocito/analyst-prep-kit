You double-click a data file and Excel spins, freezes, or tells you it cannot open it. Real-world datasets are often far bigger than a spreadsheet can hold, and every beginner hits this wall the first time they grab a serious dataset. This guide is what to do next. It covers how to recognize a "large" dataset, and why you move it into a database. It then lists the handful of real-world quirks that trip everyone up on the way.

**New to databases?** This guide assumes you can create a SQLite database and import a CSV. If you have not done that yet, start with [How to Set Up a SQL Database](https://michaelnocito.github.io/analyst-prep-kit/guides/handle-large-datasets/../set-up-a-sql-database/) (about 15 minutes), then come back here.

## First: what counts as "large"?

Put a number on it before you read the list. How many rows does a file need before a spreadsheet stops being the right tool? Your guess is probably too high, and knowing which direction you were wrong in is the useful part.

"Large" is not a vibe, it has real thresholds. A dataset is large enough to need this guide when any of these are true:

  * **It has more than about a million rows.** Excel and Google Sheets stop at **1,048,576 rows**. Past that, the file physically cannot fully open. Rows beyond the limit are silently dropped.
  * **It is hundreds of megabytes to several gigabytes on disk.**
  * **Your spreadsheet freezes, crashes, or says "not enough memory"** when you try to open it.

The running example in this guide is a real one: a public dataset of Steam game reviews, `recommendations.csv`, at about **2 GB and 41 million rows**. Excel will not open it. A database will handle it without blinking.

## Step 1 — Move it into a database, not a spreadsheet

The single most important move: stop trying to open large data in a spreadsheet. Put it in a database instead. **SQLite** (via the free DB Browser app) has no practical row limit. The same file that crashed Excel becomes a table you can query in seconds.

This is exactly the _create, import, verify_ workflow from the [SQL database guide](https://michaelnocito.github.io/analyst-prep-kit/guides/handle-large-datasets/../set-up-a-sql-database/). The steps are identical for a big file. It just takes longer, which is what the rest of this guide prepares you for.

## Step 2 — Expect the download to be zipped (with extras you don't need)

Large public datasets almost never download as a single clean CSV. They arrive as a `.zip` (often named something generic like `archive.zip`) that contains several files bundled together. In our example the zip held four files, and we only needed one.

  1. Right-click the downloaded zip and choose **Extract All**.
  2. Open the extracted folder and use **only the file you actually need** (for us, `recommendations.csv`). Ignore the rest.

**Why this matters:** if you import the whole bundle blindly, you waste a lot of disk space and import time on files your analysis never touches. Extract, then pick.

## Step 3 — Import is slow, and the file grows. That's normal.

A 2 GB CSV does not import instantly. Give it time. Two things surprise people, and both are expected:

  * **The import takes minutes, not seconds.** DB Browser may look frozen while it works. Let it finish.
  * **Your`.db` file grows to several gigabytes.** A 2 GB CSV can produce a multi-GB database. Make sure you have the free disk space before you start: the original CSV plus the database can easily total 4 to 6 GB.

Import the file exactly as in the SQL guide (name the table something ending in `_raw`, tick "column names in first line"), then press **Ctrl+S** to save.

## Step 4 — Build an index (the step that makes big queries fast)

Picture a phone book, and picture the same names in the order people moved into town. Both hold the same information. Only one lets you find a name without reading every page. Hold that picture, because it is exactly what the next paragraph describes.

An **index** is a lookup shortcut on a column. Without one, every time you search or join on that column, the database reads all 41 million rows from top to bottom. With one, it jumps straight to the rows it needs. On a small table you never notice. On a big one, it is the difference between instant and unusable.

Build the index once, on the column you will join or filter on most (usually an id):
    
    
    CREATE INDEX IF NOT EXISTS idx_rec_appid ON recommendations(app_id);

**Real numbers:** on our 41-million-row table, building this index took about 3 minutes once. After that, joins that would have crawled ran instantly. Build it, press Ctrl+S, and you only ever pay that cost one time.

### The trap: a function on the join key turns the index off

One refinement that bites even people who know about indexes. An index on `title` helps a join `ON a.title = b.title` — but the moment you wrap the key in a function, like `ON LOWER(a.title) = LOWER(b.title)`, the plain index goes unused. That wrapping is the standard move for case-insensitive matching of names. The index sorted the original values, not the lowercased ones. The database silently falls back to comparing every row against every row. Real numbers again: a join of 13,000 rows against 33,000 — small tables by this guide's standards! — is 427 million comparisons without an index, and ran over 30 minutes. The fix is an **expression index** , built on exactly the expression the join uses:
    
    
    CREATE INDEX IF NOT EXISTS idx_songs_lower
      ON artist_songs (LOWER(primary_artist), LOWER(title));

Same query afterward: seconds. The rule of thumb, upgraded: index not just the column your joins search by, but the _exact expression_ they search by.

## Step 5 — Write your query against a sample first

You do not want to wait on 41 million rows every time you fix a typo in your query. Develop against a small slice, then run the finished query on everything.

  * Add `LIMIT 1000` while you are writing and testing, so results come back instantly.
  * Or keep a small **sample CSV** (a few thousand rows) as a separate table for building queries.

Once the query is correct on the sample, remove the `LIMIT` and run it for real.

## Step 6 — Aggregate early, and never dump millions of raw rows to the screen

Asking a tool to display 41 million rows is what freezes it. You almost never want the raw rows anyway, you want a **summary**. Use `GROUP BY` to collapse the data to one row per thing you care about:
    
    
    SELECT app_id, COUNT(*) AS num_reviews, AVG(hours) AS avg_hours
    FROM recommendations
    GROUP BY app_id;

That turns 41 million review rows into one tidy row per game. Reach for `COUNT`, `AVG`, `SUM`, and `GROUP BY` before you ever reach for `SELECT *`.

## The quirk that quietly breaks a filter: data types

This one returns no error and no rows. Before reading on, ask yourself what you would do if a filter you were sure about came back empty. If the answer is "check the filter again", the next section is going to save you an afternoon, because the filter is fine.

Before you trust any filter on a big table, look at the actual values first (`SELECT * FROM recommendations LIMIT 10;`). Large real-world files love to store things in surprising ways. The classic: a true/false column stored as the **text** `'true'` and `'false'`, not the numbers `1` and `0`.

If you assume it is a number and write `WHERE is_recommended = 1`, it silently matches **nothing** , and you get a confidently wrong answer with no error message. The fix is simply to match how the data is really stored:
    
    
    WHERE is_recommended = 'true'

**Rule of thumb:** a query that returns zero rows or an impossible number is usually a data problem, not a logic problem. Peek at the real values before you blame your SQL.

## One more honest habit: mind the snapshot

Large datasets are point-in-time snapshots. If you join two big datasets, they may have been collected on different dates (ours were), so they describe the same things at slightly different moments. That is fine, but say so in your write-up. Being upfront about where your data came from and where two sources do not perfectly line up is part of doing the analysis honestly.

## Cheat sheet

| Situation                             | What to do                                                               |
|---------------------------------------|--------------------------------------------------------------------------|
| File will not open in Excel           | It is over ~1M rows. Move it into a SQLite database.                     |
| Download is a zip with extra files    | Extract, use only the one file you need.                                 |
| Import seems frozen                   | A multi-GB file takes minutes. Let it finish. Check you have disk space. |
| Joins or filters are slow             | `CREATE INDEX` on the id column, once.                                   |
| Query is slow to iterate on           | Develop with `LIMIT 1000`, then remove it.                               |
| Tool freezes on results               | Do not `SELECT *` millions of rows. `GROUP BY` to a summary.             |
| Filter returns nothing / weird totals | Check data types. A boolean may be text `'true'`, not `1`.               |

## When SQLite is not enough

SQLite comfortably handles many-gigabyte files, which covers almost everything you will meet while learning and building a portfolio. If you ever outgrow it, the next tools are **DuckDB** (built for fast analytics on big files) and **pandas with`chunksize`** in Python (read a huge file in pieces). The mindset you just learned carries straight over: put it in a database, index the key, sample while you build, aggregate before you display.

---

*The full version of this guide lives on my site: [How to Handle Large Datasets](https://michaelnocito.github.io/analyst-prep-kit/guides/handle-large-datasets/).*

*If it was useful: [Buy Me a Coffee](https://buymeacoffee.com/michaelnocito).*
