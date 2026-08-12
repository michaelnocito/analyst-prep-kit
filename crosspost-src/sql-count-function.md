`COUNT` looks like the simplest function in SQL, and it is the one that quietly trips up the most people in interviews and on the job. The confusion is almost always the same: `COUNT(*)`, `COUNT(column)`, and `COUNT(DISTINCT column)` look nearly identical but count three different things. Once you can say out loud what each one counts, a lot opens up. You can verify a data migration, find duplicates, and measure how complete a column is, all with the same little function. This guide is that explanation, with lots of small examples you can copy.

**The one-sentence version.** `COUNT(*)` counts _rows_. `COUNT(column)` counts _rows where that column is not NULL_. `COUNT(DISTINCT column)` counts _how many different non-NULL values_ that column has. Everything below is just that sentence, slowed down.

## The three forms of COUNT and what each one counts

Picture one small table, `customers`, with a `region` column where two rows were never filled in:

| id  | name   | region  |
|-----|--------|---------|
| 1   | Maya   | North   |
| 2   | Jordan | South   |
| 3   | Alex   | North   |
| 4   | Sam    |  _NULL_ |
| 5   | Taylor |  _NULL_ |

Now run the three forms on it:
    
    
    SELECT
      COUNT(*)                 AS all_rows,
      COUNT(region)            AS rows_with_region,
      COUNT(DISTINCT region)   AS different_regions
    FROM customers;

| all_rows | rows_with_region | different_regions |
|----------|------------------|-------------------|
| 5        | 3                | 2                 |

  * **`COUNT(*)` = 5.** Every row, no exceptions. The `*` means "the row itself," so NULLs never matter.
  * **`COUNT(region)` = 3.** Only the rows where `region` has a value. Sam and Taylor are skipped because their region is NULL.
  * **`COUNT(DISTINCT region)` = 2.** The different values are just `North` and `South`. The two Norths collapse to one, and NULL is not counted.

## The NULL rule that makes them disagree

Predict it first. A table has 100 rows. Twenty of them have no email address. What does counting the email column give you? Say the number before you read on.

Here is the whole trick in one line:

**`COUNT(*)` counts rows. `COUNT(something)` counts non-NULL values of that something.**

So the moment a column has any NULLs, `COUNT(column)` comes back _smaller_ than `COUNT(*)`. That gap is not a bug, it is information: it is exactly how many rows are missing a value in that column.

**Turn the gap into a missing-data check.** The number of blanks in a column is just the difference between the two counts: 
    
    
    SELECT COUNT(*) - COUNT(region) AS missing_regions
    FROM customers;   -- returns 2

One more consequence people forget: because `COUNT(column)` ignores NULLs, `COUNT(1)` and `COUNT(*)` are the same thing (the constant `1` is never NULL), but `COUNT(a_column_full_of_nulls)` can be `0`. When you just want "how many rows," reach for `COUNT(*)` and never think about it again.

## COUNT(*) vs COUNT(DISTINCT): the difference interviewers ask about

This is the classic recall question, and it is worth being able to answer without hesitating. Say your answer out loud now, in one sentence, before you look at the table. Reading the table and nodding is not the same as being able to say it in a room.

| You write                  | You get back                               |
|----------------------------|--------------------------------------------|
| `COUNT(*)`                 | How many rows there are.                   |
| `COUNT(order_id)`          | How many rows have an order_id (non-NULL). |
| `COUNT(DISTINCT order_id)` | How many _different_ order_ids there are.  |

When those numbers differ, you have learned something. If `COUNT(*)` is bigger than `COUNT(DISTINCT order_id)`, some order_id appears more than once, meaning you have **duplicate rows**. That single comparison is the fastest duplicate check in SQL:
    
    
    SELECT
      COUNT(*)                  AS total_rows,
      COUNT(DISTINCT order_id)  AS unique_orders,
      COUNT(*) - COUNT(DISTINCT order_id) AS duplicate_rows
    FROM orders;

If `duplicate_rows` is `0`, every order is listed once. If it is anything above zero, that is how many extra copies are hiding in the table.

## COUNT with GROUP BY: counting per group

On its own, `COUNT` gives one number for the whole table. Add `GROUP BY` and it gives one number _per group_ instead. `GROUP BY` sorts the rows into bins by the column you name, and `COUNT` runs inside each bin:
    
    
    SELECT region, COUNT(*) AS customers
    FROM customers
    GROUP BY region
    ORDER BY customers DESC;

| region | customers |
|--------|-----------|
| North  | 2         |
| South  | 1         |
| _NULL_ |  2        |

**Watch the NULL group.** `GROUP BY` keeps NULL as its own bin, so the two blank-region customers show up as a NULL group of 2. That is different from `COUNT(region)`, which drops them entirely. Same data, two honest answers, because you asked two different questions.

A subtle but important pairing: `COUNT(*)` counts every row in the group, while `COUNT(column)` counts only the rows in the group where that column is filled in. Grouping customers by region and reading `COUNT(*)` next to `COUNT(email)` tells you, per region, how many customers you have and how many of them you can actually email.

## How analysts use COUNT in a data migration

Data often moves from one place to another: a CSV into a database, an old system into a new one, a raw table into a cleaned one. `COUNT` is the first thing you run on both sides. It is the cheapest way to answer "did everything arrive, and did anything sneak in twice?" Three checks cover most of it.

## 1. Did every row arrive? (row-count reconciliation)

Count the source, count the destination, and compare. They should match exactly.
    
    
    SELECT COUNT(*) FROM customers_raw;   -- the imported original
    SELECT COUNT(*) FROM customers;       -- the cleaned copy

If the cleaned table has fewer rows, a cleaning step dropped records (maybe a filter was too aggressive). If it has more, a join fanned out and multiplied rows. Either way, the two counts not matching is your signal to stop and look before you build anything on top.

## 2. Did the migration create duplicates? (COUNT vs COUNT DISTINCT)

Pick the column that is supposed to be unique (the key, like `customer_id`) and compare the two counts:
    
    
    SELECT
      COUNT(*)                     AS rows,
      COUNT(DISTINCT customer_id)  AS unique_ids
    FROM customers;

If `rows` is larger than `unique_ids`, the same customer landed in the table more than once and every total you compute later will be inflated. This one comparison catches a whole class of migration bugs.

## 3. How complete is each column? (COUNT(*) vs COUNT(column))

For any column you care about, the fill rate is just the two counts side by side:
    
    
    SELECT
      COUNT(*)                                       AS rows,
      COUNT(email)                                   AS has_email,
      ROUND(100.0 * COUNT(email) / COUNT(*), 1)      AS email_pct
    FROM customers;

Now you can say "94% of migrated customers have an email" instead of guessing. Do this for the columns that matter and you have a completeness report before anyone asks for one.

## Using COUNT on your own portfolio project

Picture a dataset you already have, and picture the three numbers this would give you: how many rows, how many distinct values in your main column, and how many rows are missing that value. If those three numbers would surprise you, you do not yet know your data. Every dataset deserves the same opening move. Before you write a single insight, run COUNT to understand what you are holding. On a games dataset, for example:
    
    
    -- How big is it, and how many distinct studios and genres?
    SELECT
      COUNT(*)                  AS games,
      COUNT(DISTINCT developer)  AS studios,
      COUNT(DISTINCT genre)      AS genres
    FROM games;
    
    -- Which columns are patchy? (compare each to the row count)
    SELECT
      COUNT(*)             AS rows,
      COUNT(price)         AS has_price,
      COUNT(release_date)  AS has_date
    FROM games;

Leading a project write-up with "the dataset has 83,201 games across 41 genres, and 6% are missing a release date" reads like an analyst, not a beginner. It also protects you: knowing where the NULLs are stops you from quietly under-counting later. This "count first, then analyze" habit is exactly what the [Exploratory Data Analysis](https://michaelnocito.github.io/analyst-prep-kit/guides/exploratory-data-analysis/) guide leans on, and what the [Documenting Data Limitations](https://michaelnocito.github.io/analyst-prep-kit/guides/documenting-data-limitations/) guide turns into a written record.

## A COUNT cheat sheet

| You want to know…                         | Write                               |
|-------------------------------------------|-------------------------------------|
| How many rows are in this table           | `COUNT(*)`                          |
| How many rows have a value in this column | `COUNT(column)`                     |
| How many rows are missing that value      | `COUNT(*) - COUNT(column)`          |
| How many different values a column has    | `COUNT(DISTINCT column)`            |
| Whether a key column has duplicates       | `COUNT(*)` vs `COUNT(DISTINCT key)` |
| A count for each category                 | `COUNT(*) … GROUP BY category`      |
| What fraction of a column is filled in    | `COUNT(column) * 100.0 / COUNT(*)`  |

**Say it out loud.** Before you run a COUNT, finish this sentence: "This will count the number of ___." If you can fill the blank with _rows_ , _non-NULL values of X_ , or _different values of X_ , you have picked the right form. That sentence is the whole skill.

**More detail on this, and more like it.** Every how-to sits in one place on the [guides index](https://michaelnocito.github.io/analyst-prep-kit/guides/): SQL, Tableau, data migration, and the working habits around them.

---

*Originally published on Analyst Prep Kit: [COUNT in SQL, Explained for Beginners](https://michaelnocito.github.io/analyst-prep-kit/guides/sql-count-function/)*

*Visit the site for more beginner data analysis guides and free resources: [the full guide archive](https://michaelnocito.github.io/analyst-prep-kit/guides/) covers SQL, Excel, Power BI, Tableau, Python and statistics, and the [practice kits](https://michaelnocito.github.io/analyst-prep-kit/) run in your browser with nothing to install.*

*If it was useful: [Buy Me a Coffee](https://buymeacoffee.com/michaelnocito).*
