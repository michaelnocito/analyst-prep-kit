If you want to write SQL against your own data today, install a file-based engine: **SQLite** if you are learning, **DuckDB** if your data is already in CSV files. Both give you the whole SQL language. Neither has a server to start, a port to open, or a password to set.

Install a server such as PostgreSQL, MySQL or SQL Server when, and only when, more than one person or program needs to read and write the same data at the same time. That is the whole decision. The rest of this page shows you how to check which side of it you are on, so you can stop reading in two minutes and go write a query.

**The short version.** A file-based database is a file you open. A server database is a program you run. If nobody else is connecting to your data, you do not need the program.

## The question that decides it

Before the answer: think about the data you want to query right now. How many people, other than you, need to change it while you are looking at it?

Here is the fork, laid out.

**The question.** Does anything other than you need to read and write this data at the same time as you?

**Answer one: no.** It is your data, on your machine, and you are the only one touching it. If that is true, a database that is a single file does everything you need. You skip accounts, ports, services and permissions, because there is nobody to keep out and nothing to coordinate.

**Answer two: yes.** An application writes to it, or a team queries it, or it has to be reachable from another machine. If that is true, you need a server, because something has to sit in the middle and decide what happens when two callers arrive at once.

**What decides between them** is not the size of your data and not how serious the work is. It is only whether there is a second caller.

**Why it matters** is that installing a server first is where most people stall. Setting up PostgreSQL means a service, a superuser, a port, a client, and a connection string, and none of that teaches you any SQL. People spend an evening on it, hit an authentication error, and never get to the query. Starting with a file means your first `SELECT` runs in about fifteen minutes.

## What "a file" and "a server" actually mean

These two words do a lot of work, so here is what each one is.

**A file-based database is a library your program loads.** The engine runs inside whatever you are already running, and the whole database, tables and rows and indexes, is one file on disk. You can copy that file to a USB stick, email it, or put it in a folder. Nothing is running when you are not using it.

**A server database is a separate program that stays running.** It starts when your computer starts and waits for connections. Your query does not read the data itself. It sends a request to that program, over a network connection, and the program reads the data and sends rows back.

Every difference people list between the two comes out of that one structural fact. Say why a server needs user accounts before reading on. It needs them because it accepts connections from callers it cannot see, so it has to be able to tell them apart. A file has no callers to tell apart. The file's permissions are the folder's permissions, and that is the end of it.

## SQLite, and why you may already have it

SQLite is the file-based engine to reach for while you are learning. It is the most widely deployed database in the world, mostly because it is inside things rather than installed next to them: phones, browsers, desktop apps.

That includes Python. SQLite ships in Python's standard library, so if you have Python you already have a working SQL engine and did not install one. Two lines proves it:
    
    
    import sqlite3
    print(sqlite3.sqlite_version)

On the machine this guide was written on, that prints `3.38.4`. Yours will differ, and any version will do.

For a window you can click around in rather than a script, DB Browser for SQLite is an open-source desktop app that opens the file, shows the tables, imports a CSV and runs queries. That combination, DB Browser plus one `.db` file, is the fastest route from nothing to a real query, and it is the one walked step by step in [how to set up a SQL database](https://michaelnocito.github.io/analyst-prep-kit/guides/which-sql-database-to-install/../set-up-a-sql-database/).

## DuckDB, if your data is CSV files

DuckDB is file-based like SQLite, and built for the shape of work analysts actually do: reading a lot of rows and summarizing them. The practical difference you will feel on day one is that it queries a CSV directly. There is no import step.
    
    
    import duckdb
    duckdb.sql("SELECT name, score FROM 'players.csv' WHERE score > 50")

That runs against the file as it sits on disk. No table to create, no columns to declare, no load. For anyone who has been doing this in a spreadsheet and has a folder of exports, that is the shortest path from a CSV to a `GROUP BY` that exists.

Picture your own downloads folder. If the answer you want lives across three of those CSVs, this is the engine that gets you there without building anything first.

## When you genuinely do need a server

Four situations, and they are all the same situation.

  * **An application writes to the data while you read it.** A web app, a scheduled job, anything with its own connection.
  * **Other people need to query it.** Colleagues on their own machines, hitting the same data.
  * **It has to be reachable from somewhere else.** Another server, a hosted tool, a dashboard product.
  * **The work requires a specific product.** The job runs on SQL Server, so you practice on SQL Server. That is a real reason and it outranks everything above.

When one of those is true, PostgreSQL is the usual choice for analysis work and MySQL is the usual choice behind web applications. If your workplace runs Microsoft, SQL Server with SQL Server Management Studio is what you will meet. Match the tool to the job you are aiming at, rather than to a general ranking.

## Does the SQL you learn transfer?

Mostly, yes, and this is the part worth being precise about because it decides whether starting small costs you anything.

**What transfers unchanged:** `SELECT`, `WHERE`, `JOIN`, `GROUP BY`, `HAVING`, `ORDER BY`, subqueries, [CTEs](https://michaelnocito.github.io/analyst-prep-kit/guides/which-sql-database-to-install/../sql-ctes/), [window functions](https://michaelnocito.github.io/analyst-prep-kit/guides/which-sql-database-to-install/../sql-window-functions/), [CASE](https://michaelnocito.github.io/analyst-prep-kit/guides/which-sql-database-to-install/../sql-case-expression/), and [both comment syntaxes](https://michaelnocito.github.io/analyst-prep-kit/guides/which-sql-database-to-install/../sql-comments/). That is the whole of analyst SQL and effectively all of what an interview will ask you.

**What does not transfer:** function names around the edges. String handling, date maths and type conversion are named differently in each product. SQLite uses `INSTR` and `SUBSTR` where SQL Server uses `CHARINDEX` and `SUBSTRING`. You look those up when you meet them, and looking them up is what practitioners do anyway.

So the cost of learning on a file and moving to a server later is a handful of function names. The cost of trying to install a server first is often the whole first evening.

## Cheat sheet

| Your situation                           | Install                 | Why                                                               |
|------------------------------------------|-------------------------|-------------------------------------------------------------------|
| Learning SQL, data is yours alone        | SQLite, with DB Browser | One file, no setup between you and the first query                |
| Already have Python                      | Nothing                 | SQLite is in the standard library                                 |
| Data is a folder of CSVs                 | DuckDB                  | Queries the CSV directly, no import step                          |
| Building a portfolio project             | SQLite or DuckDB        | The database file goes in the repo, so anyone can rerun your work |
| An app or a team writes to the data      | PostgreSQL or MySQL     | Something has to arbitrate concurrent writers                     |
| Preparing for a job that names a product | That product            | The job's tools outrank any general ranking                       |

## The one habit to keep

Choose the smallest thing that answers your question, and add machinery only when something breaks. Most analysis work never outgrows a file, and the evening you did not spend on a server install is an evening of writing queries.

What is stopping you from running a query on your own data right now: the tool, or not knowing which question to ask it?

---

*The full version of this guide lives on my site: [Which SQL Database Should You Install?](https://michaelnocito.github.io/analyst-prep-kit/guides/which-sql-database-to-install/).*

*If it was useful: [Buy Me a Coffee](https://buymeacoffee.com/michaelnocito).*
