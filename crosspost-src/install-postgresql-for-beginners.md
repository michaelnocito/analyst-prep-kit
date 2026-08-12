By the end of this page you will have PostgreSQL running, a database of your own, and a working connection from a tool. You will also understand the shift that makes this feel harder than SQLite did: you are no longer opening a file, you are connecting to a program that is always running. Every unfamiliar thing here, the port, the password, the service, follows from that one change.

Here is what to actually do today, and it comes with a caveat. If you are learning SQL for interviews, **you probably do not need this yet** , and section 1 says so plainly. If a job posting names Postgres or you have been given real credentials, download the interactive installer from EDB, write the password down, and keep port 5432 as the default.

The short version: install, set a password you record, connect on `localhost:5432` as user `postgres`, and make your own database rather than working in the default one.

The move from a file to a service is the one idea everything else here follows from, so it gets the picture.

> _The original carries a diagram here. In words: Two panels. In the left panel a hand-drawn arrow runs straight from a small application window directly into a file icon, touching it, with nothing in between. In the right panel the same application window connects instead to a large rounded box representing a running service, and the connection must pass through a narrow doorway in the wall of that box. Four small key shapes hang beside the doorway in a row, indicating four separate pieces of information required to pass through it. Inside the service box sit several small database cylinders, showing that one running service holds many databases._

**Version and installer details were checked on 8 August 2026** against postgresql.org. PostgreSQL 18 is the current major version offered for Windows; 19 was in beta and is not what you want on a learning machine. Take the newest stable release the page offers you.

## 1. First: do you need this?

Before the explanation: you have been learning SQL on SQLite. Which parts of what you have learned do you think would stop working on Postgres?

Almost none of it. `SELECT`, `WHERE`, `JOIN`, `GROUP BY`, `HAVING`, CTEs and window functions behave the same way. What differs is date arithmetic, some string functions, and stricter typing. That is a genuinely small surface, and it is why the honest answer to "should I install Postgres to learn SQL" is usually no.

Install it when one of these is true.

  * A job posting or a take-home test names PostgreSQL specifically.
  * You have been given credentials to a real Postgres database and need a tool that reaches it.
  * You are building something with more than one program talking to the same data at once.
  * You specifically want practice with server-shaped things: users, permissions, ports.

If none of those apply, [the fifteen-minute SQLite setup](https://michaelnocito.github.io/analyst-prep-kit/guides/set-up-a-sql-database/) teaches you more SQL per hour, because none of the hours go on service configuration. The comparison in [which SQL database should you install](https://michaelnocito.github.io/analyst-prep-kit/guides/which-sql-database-to-install/) is the longer version of this decision.

## 2. Install it

Go to postgresql.org, choose Download, and pick your operating system. On Windows the recommended route is the **interactive installer by EDB**. Two things worth knowing about it: it is hosted on EDB's servers rather than the PostgreSQL community's, and it bundles more than the database.

What arrives with it:

  * **The PostgreSQL server** , which is the database itself, installed as a service that starts with your computer.
  * **pgAdmin** , a graphical tool for browsing tables and running queries. This is your DB Browser equivalent.
  * **psql** , the command-line client, which comes with the server.
  * **StackBuilder** , an add-on installer for drivers and extras. You can skip it, and at the end of the install you should.

During setup you are asked for two things that matter. **A password for the`postgres` user.** Write it down somewhere you will still have in three months, because there is no convenient reset and re-installing to escape a forgotten password is a genuinely common waste of an evening. And **a port** , offered as 5432. Keep it. Every tutorial, tool default and example connection string assumes 5432, and changing it buys you nothing but mismatches.

## 3. The four things every connection needs

This is the section that saves you the most time later. Any tool connecting to Postgres, pgAdmin, Excel, Tableau, Python, asks for the same four facts. They are the four keys in the picture.

| What it is called | What it means                                              | Yours, locally                      |
|-------------------|------------------------------------------------------------|-------------------------------------|
| Host              | Which machine the service is running on.                   | `localhost`                         |
| Port              | Which door on that machine to knock at.                    | `5432`                              |
| Database          | Which database inside the service. One service holds many. | `postgres` at first                 |
| User and password | Who you are.                                               | `postgres` and the password you set |

Those same four are what a connection string packs into one line, in this order:
    
    
    postgresql://postgres:yourpassword@localhost:5432/postgres

Read it left to right and it is exactly the table above: which kind of database, who you are, your password, which machine, which door, which database. Once that sentence makes sense, connecting from [Python](https://michaelnocito.github.io/analyst-prep-kit/guides/connect-python-to-a-sql-database/), Excel or Tableau stops being four different procedures and becomes one form filled in four times.

Say why a file-based database needs none of these, before reading on. Because there is no doorway: the file is right there and the tool reads it directly. Every one of the four exists only because something else is holding the data on your behalf.

## 4. Make your own database

A fresh install includes a database called `postgres`. It is the service's own housekeeping database, and putting your work in it is like saving documents into a program's installation folder. It works and it is a habit worth not forming.

Open pgAdmin, connect using the password you set, then run:
    
    
    CREATE DATABASE analytics;

Or from a terminal:
    
    
    psql -U postgres -c "CREATE DATABASE analytics;"

From now on, connect with `analytics` as the database rather than `postgres`. One more piece of vocabulary you will meet immediately: inside a database, tables live in a **schema** , and the default one is called `public`. That is why table names sometimes appear as `public.customers`. It is the same table, written with its full address.

## 5. Connect from a tool

pgAdmin comes with the installer and is the natural first stop, but it is a heavier tool than DB Browser and it is worth knowing you are not stuck with it. Any tool that asks for those four facts will connect.

From Python, using the pattern from [connecting Python to a SQL database](https://michaelnocito.github.io/analyst-prep-kit/guides/connect-python-to-a-sql-database/):
    
    
    python -m pip install sqlalchemy psycopg2-binary
    
    
    from sqlalchemy import create_engine
    import pandas as pd
    
    engine = create_engine('postgresql+psycopg2://postgres:yourpassword@localhost:5432/analytics')
    df = pd.read_sql("SELECT version()", engine)
    print(df)

`SELECT version()` is a good first query precisely because it needs no tables. If it returns a row, all four facts are correct and your problem, if you have one later, is with your data rather than your connection.

Do not leave that password sitting in a file you will commit. Read it from an environment variable instead, as [Git for analysts](https://michaelnocito.github.io/analyst-prep-kit/guides/git-for-analysts/) describes.

## 6. Load a CSV into it

Unlike SQLite tools, Postgres will not invent a table for you from a file. You create the table, then fill it. That is two steps rather than one, and the extra step is where the strictness lives.
    
    
    CREATE TABLE sales (
        order_id    INTEGER,
        order_date  DATE,
        region      TEXT,
        amount      NUMERIC(10,2)
    );
    
    
    \copy sales FROM 'sales.csv' WITH (FORMAT csv, HEADER true);

The backslash matters. `\copy` is a psql command that reads a file from _your_ machine, while plain `COPY` is a server command that reads from the server's machine. On a local install they are the same computer, which hides the difference until the day you connect to a server elsewhere and plain `COPY` cannot find your file. Use `\copy` and the habit is already right.

Postgres will reject a row whose values do not match the column types, rather than quietly storing them anyway. That is stricter than SQLite and it is a feature: the error names the row and the problem, which is a much better outcome than discovering months later that a numeric column contains the text "N/A".

Now picture a file you have loaded somewhere before. If the tool had refused it outright instead of accepting it quietly, would you have found out sooner or later than you actually did?

## The full before and after

Same goal: a working Postgres you can query.

### Before
    
    
    Installed, clicked through, chose a password
    Changed the port because 5432 "looked taken"
    Worked inside the default postgres database
    Two weeks later: cannot remember the password, cannot remember the port

Nothing failed at the time, which is what makes it costly. The custom port means every example connection string is wrong for you, the forgotten password has no easy reset, and the work in the default database is mixed in with the service's own.

### After
    
    
    Installed, kept port 5432, wrote the password in a password manager
    CREATE DATABASE analytics;
    Tested with SELECT version() before doing anything else
    Connection facts noted: localhost / 5432 / analytics / postgres
    Loaded data with \copy after CREATE TABLE

The four facts are written down, the port matches every tutorial you will read, and your work is in its own database. Testing with `version()` first means that when something breaks later, you already know the connection is not the problem.

## What goes wrong, and the fix

Six that account for most first days.

**"Connection refused."** The service is not running. On Windows, open Services and start the PostgreSQL service. This is the error that has no equivalent in SQLite, because there is nothing to be running.

**"password authentication failed for user postgres".** Wrong password, or a different user than you think. There is no simple reset, which is why writing it down at install time matters so much.

**"database does not exist".** You named a database that has not been created. Connect to `postgres` first, run `CREATE DATABASE`, then reconnect.

**"relation does not exist" for a table you just made.** Usually the wrong database, or a case problem. Postgres folds unquoted names to lower case, so a table created as `"Sales"` with quotes must always be written with quotes afterwards. Stick to lower case names and the problem never arises.

**`psql` is not recognised.** The installer's `bin` folder is not on your PATH. Add it, or use the SQL Shell shortcut the installer created.

**Port 5432 already in use.** An older Postgres is still installed. Uninstall it rather than moving to 5433, or you will be explaining the odd port to every tool for years.

## Why a server exists at all

SQLite reads and writes a file directly, which works beautifully until two programs want to write at the same moment. There is nobody to decide who goes first, so the design instead limits what can safely happen at once. That is a completely reasonable trade for one analyst on one laptop.

A server exists to be that somebody. Because one program owns the data, it can let many clients connect at once, decide the order of conflicting writes, hold half-finished work until it either completes or is undone, and enforce who is allowed to see what. The port, the user, the password and the service are not ceremony; each one is a piece of machinery that only makes sense once more than one client exists.

That is also the honest reason a beginner rarely needs it. Alone on your own machine, you are paying the full cost of the machinery for none of the benefit. The moment a second person or a second program appears, the same machinery is exactly what you want.

One note on the way this page is written. It kept asking you to commit to an answer, what would stop working, why a file needs none of the four keys, before giving one. Attempting an answer before seeing the correct one reliably improves how well the correct one is retained, even when the attempt is wrong (Bisra, Liu, Nesbit, Salimi, & Winne, 2018, _Educational Psychology Review_ , 30(3), 703–725).

## Using this on your own machine

Five steps, in order.

  1. **Decide whether you need it** using section 1. Installing a server to learn SELECT statements costs hours you could spend writing them.
  2. **Keep port 5432** and record the password the moment you set it. Both are cheap now and expensive later.
  3. **Create your own database** rather than working in the default one.
  4. **Write down the four connection facts** somewhere you keep notes. Every tool will ask for the same four.
  5. **Test with`SELECT version()`** before loading anything, so you know the connection is proven before the data can be blamed.

If you have paper nearby, one optional drawing is worth two minutes. Draw the doorway from the top of this page and label the four keys with your own values. That drawing is the thing you will reach for every time a new tool asks you to connect, and it turns four separate learning experiences into one.

**More detail on this, and more like it.** Every how-to sits in one place on the [guides index](https://michaelnocito.github.io/analyst-prep-kit/guides/): getting set up, SQL, Excel, Python, and the working habits around them.

## The whole thing on one screen

This is the retrieval sheet. Cover the right column, work down the left, and say each answer out loud before you check it.

| Thing                | What it is, or what it does                                                       |
|----------------------|-----------------------------------------------------------------------------------|
| The core shift       | Not a file you open. A service you connect to.                                    |
| Do you need it       | Only if a job names it, you have credentials, or several programs share the data. |
| Windows installer    | Interactive installer by EDB. Hosted by EDB, not the community.                   |
| What comes with it   | Server, pgAdmin, psql, StackBuilder. Skip StackBuilder.                           |
| Current version      | 18 stable as of August 2026. Do not install a beta to learn on.                   |
| Port                 | 5432. Keep it. Every example assumes it.                                         |
| The four facts       | Host, port, database, user and password.                                          |
| Connection string    | `postgresql://user:pass@host:port/database`                                       |
| Default database     | `postgres`, the service's own. Make your own instead.                             |
| Schema               | A grouping inside a database. Default is `public`, as in `public.sales`.          |
| `\copy` vs `COPY`    | Your machine vs the server's machine. Use `\copy`.                                |
| Loading a CSV        | CREATE TABLE first. Postgres will not invent one.                                 |
| Case folding         | Unquoted names become lower case. Stick to lower case.                            |
| "Connection refused" | The service is not running. Start it.                                             |
| Forgotten password   | No easy reset. Record it at install time.                                         |
| First test query     | `SELECT version()`. Needs no tables.                                              |

**The one habit to keep.** Write the four connection facts down the day you install, and test with `SELECT version()` before anything else. Every future connection problem is then a question of which of four known values is wrong, rather than an open-ended mystery. If something breaks in a way this page does not cover, there is a general [diagnosis loop for being stuck](https://michaelnocito.github.io/analyst-prep-kit/guides/technical-tenacity/).

One last thought, and I would genuinely like other people's answers. The install I regret most is the one where I changed the port for no good reason and then spent two years explaining the odd number to every tool I connected. What default did you change early on and wish you had left alone?

## References

  * Bisra, K., Liu, Q., Nesbit, J. C., Salimi, F., & Winne, P. H. (2018). Inducing self-explanation: A meta-analysis. _Educational Psychology Review_ , 30(3), 703–725.
  * The PostgreSQL Global Development Group. Downloads, and Windows installers. Retrieved 8 August 2026 from postgresql.org/download. Cited for version and installer contents, which are product details rather than research findings.

---

*Originally published on Analyst Prep Kit: [How to Install PostgreSQL for Beginners (And Whether You Need To)](https://michaelnocito.github.io/analyst-prep-kit/guides/install-postgresql-for-beginners/)*

*Visit the site for more beginner data analysis guides and free resources: [the full guide archive](https://michaelnocito.github.io/analyst-prep-kit/guides/) covers SQL, Excel, Power BI, Tableau, Python and statistics, and the [practice kits](https://michaelnocito.github.io/analyst-prep-kit/) run in your browser with nothing to install.*

*If it was useful: [Buy Me a Coffee](https://buymeacoffee.com/michaelnocito).*
