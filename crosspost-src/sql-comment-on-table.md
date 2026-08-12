There are two completely different things in SQL called a comment, and searching for one gets you pages about the other.

The one most people mean is `--`, which stops a line of your query from running. If that is what you came for, it is covered in [how to comment in SQL](https://michaelnocito.github.io/analyst-prep-kit/guides/sql-comments/).

This page is about the other one. `COMMENT ON TABLE` is a statement you run, and it writes a description into the database, attached to the table. It is still there next year, for a colleague who has never seen your query file.

**The short version.** `COMMENT ON TABLE orders IS 'One row per order line, not per order.';` in PostgreSQL and Oracle. MySQL and SQL Server each need a different statement, both below.

## Why this is worth doing at all

Every analyst has opened a table called something like `cust_txn_f` with a column called `flag_3` and had nobody left to ask.

The knowledge existed once. It was in a Slack message, or a spreadsheet, or somebody's head. It was not in the database, so it did not survive.

A table comment survives because it travels with the object it describes. Back up the database and the comment comes too. Point a data catalogue or a BI tool at the database and most of them read these descriptions automatically and show them to people who will never write a query.

It takes about twenty seconds per table. It is the cheapest documentation in the job.

## PostgreSQL and Oracle

Both use the standard statement, and the shape is the same for either.
    
    
    COMMENT ON TABLE orders IS 'One row per order line, not per order.';
    
    COMMENT ON COLUMN orders.status IS 'Values: new, paid, shipped, refunded. Set by the billing job, not the web app.';

Three things about how it behaves, all from the PostgreSQL documentation:

  * Only one comment is stored per object. Running it again replaces the text, it does not add a second one.
  * To remove a comment, set it to `NULL`: `COMMENT ON TABLE orders IS NULL;`
  * Comments are dropped automatically when the object is dropped, so you never leave orphans behind.

You have to own the object to comment on it, which is worth knowing before you write thirty of these and find half of them rejected.

## MySQL

MySQL has no `COMMENT ON` statement. The comment is a clause attached to the table or column instead, and it goes inside `CREATE TABLE` or `ALTER TABLE`.
    
    
    CREATE TABLE orders (
      id      INT PRIMARY KEY COMMENT 'Order line ID, not order ID',
      status  VARCHAR(20)     COMMENT 'new, paid, shipped, refunded'
    ) COMMENT = 'One row per order line, not per order.';

On a table that already exists, use `ALTER TABLE`:
    
    
    ALTER TABLE orders COMMENT = 'One row per order line, not per order.';

The limits are documented and worth knowing before you write an essay: a table comment can be 2048 characters, a column comment 1024.

**One trap in the column version.** Changing a column comment in MySQL means restating the column's full definition, because `ALTER TABLE ... MODIFY COLUMN` replaces it. Leave out `NOT NULL` or the default and you have quietly changed the column, not just its description. Copy the definition from `SHOW CREATE TABLE` first.

## SQL Server

SQL Server has no `COMMENT` statement of any kind. It stores this sort of thing as an extended property, which is a name and value bolted onto an object. The convention is to name the property `MS_Description`, because that is the one SSMS and most tools look for.
    
    
    EXEC sp_addextendedproperty
      @name = N'MS_Description',
      @value = N'One row per order line, not per order.',
      @level0type = N'SCHEMA', @level0name = N'dbo',
      @level1type = N'TABLE',  @level1name = N'orders';

It is much more typing than the other databases for the same result. Use `sp_updateextendedproperty` to change one and `sp_dropextendedproperty` to remove it, since `sp_addextendedproperty` errors if the property is already there.

## SQLite, which cannot do this

SQLite has no way to store a table or column description. There is no `COMMENT ON` and no extended properties.

What people do instead is put a `--` comment in the `CREATE TABLE` statement itself. SQLite keeps the original text of the statement in `sqlite_master.sql`, comments and all, so the note is recoverable:
    
    
    SELECT sql FROM sqlite_master WHERE name = 'orders';

It is a workaround, not a feature. No tool will read it as a description. If documentation matters on a SQLite project, keep it in the repository next to the schema file.

## Reading the comments back

Writing them is half the job. Being able to pull them all out is what makes them useful.

| Database   | How to read the comments                                                                                                               |
|------------|----------------------------------------------------------------------------------------------------------------------------------------|
| PostgreSQL | `\d+ tablename` in psql, or the `obj_description()` and `col_description()` functions in a query                                       |
| Oracle     | Query `USER_TAB_COMMENTS` and `USER_COL_COMMENTS`                                                                                      |
| MySQL      | `SHOW CREATE TABLE`, `SHOW FULL COLUMNS`, or `information_schema.TABLES.TABLE_COMMENT` and `information_schema.COLUMNS.COLUMN_COMMENT` |
| SQL Server | `fn_listextendedproperty`, or the `sys.extended_properties` view                                                                       |
| SQLite     | Not supported. Read `sqlite_master.sql` and hope somebody left a note                                                                  |

The MySQL and PostgreSQL routes are the useful ones, because they are ordinary queries. That means you can join them to the column list and produce a data dictionary for the whole schema in one go, which is a genuinely good thing to have in a portfolio project.

## What to actually write in one

The syntax takes a minute to learn. Deciding what goes in the string is the part that matters, and it is the same judgment as any other comment.

A description earns its place only if it says something the name does not already say. `COMMENT ON TABLE orders IS 'The orders table'` is worse than nothing, because it looks like documentation and carries none.

The things a name genuinely cannot tell you are worth the twenty seconds:

  * **What one row is.** The single most useful sentence about any table. One row per order, or per order line, or per order per day.
  * **Where the data comes from and how often.** Loaded nightly from the billing system, or written live by the app.
  * **What the values mean.** For any column holding codes or flags, list them.
  * **What is wrong with it.** Rows before 2023 have no region. That sentence saves someone a full day.

That last one is the one people leave out, and it is the most valuable. The same principle written out at length, with a full format, is in [how to comment SQL so it teaches](https://michaelnocito.github.io/analyst-prep-kit/guides/sql-teaching-comments/).

## Cheat sheet

| Database   | Add a table description                        | Remove it                     |
|------------|------------------------------------------------|-------------------------------|
| PostgreSQL | `COMMENT ON TABLE t IS 'text';`                | `COMMENT ON TABLE t IS NULL;` |
| Oracle     | `COMMENT ON TABLE t IS 'text';`                | `COMMENT ON TABLE t IS '';`   |
| MySQL      | `ALTER TABLE t COMMENT = 'text';`              | `ALTER TABLE t COMMENT = '';` |
| SQL Server | `sp_addextendedproperty` with `MS_Description` | `sp_dropextendedproperty`     |
| SQLite     | Not supported                                  | Not applicable                |

## The one to write first

If you do this for exactly one table today, write the sentence that says what one row is. It is the question every new person asks, it is the one the table name almost never answers, and getting it wrong is how double-counted totals happen.

Pick the table you have explained out loud most often this year. That explanation is the comment.

---

*Originally published on Analyst Prep Kit: [COMMENT ON TABLE: How to Store a Table Description in the Database Itself](https://michaelnocito.github.io/analyst-prep-kit/guides/sql-comment-on-table/)*

*Visit the site for more beginner data analysis guides and free resources: [the full guide archive](https://michaelnocito.github.io/analyst-prep-kit/guides/) covers SQL, Excel, Power BI, Tableau, Python and statistics, and the [practice kits](https://michaelnocito.github.io/analyst-prep-kit/) run in your browser with nothing to install.*

*If it was useful: [Buy Me a Coffee](https://buymeacoffee.com/michaelnocito).*
