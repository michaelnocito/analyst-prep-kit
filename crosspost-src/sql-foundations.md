By the end of this page you can say, out loud and in your own words, what every core piece of SQL does. What a table and a row really are. The six clauses, and the order they actually run in, which is not the order you type them. `NULL`, and why it breaks comparisons. Filtering, aggregation, `GROUP BY` and `HAVING`. Joins. `CASE`. Subqueries, CTEs and window functions. Keys and indexes. That list is most of what an analyst job, an interview, and a first real dataset will ask of you.

Here is what to actually do with it. Go through once end to end without stopping, just for the shape. Then come back to the retrieval sheet near the bottom, cover the right-hand column, and try to say each answer before you read it. That second pass is where the learning happens, and there is measured evidence for it further down.

The short version: SQL is one sentence with six parts, and every part answers a different question about your rows. Learn what each part does and where it runs, and the rest is vocabulary.

One idea decides more of your SQL experience than any other, so it gets the picture. You write a query in one order. The database runs it in a different order. Almost every confusing SQL error is that gap.

**What this page is, and what it is not.** This is the concept layer: what each piece is and what it does. It is not a typing course. If you want reps, the companion drill hands you thirteen runnable queries that each add one thing to the last. Working through that once alongside this once is the fastest route through both.

## 1. Tables, rows, and the one word that prevents most mistakes

Before the explanation: two tables both have 500 rows. Does that tell you they hold the same amount of information about the same things?

A **table** is a grid. Columns are the fields, and every value in a column is the same kind of thing. Rows are the records. A **database** is a set of tables that know about each other.

Now the word that prevents most SQL mistakes: **grain**. The grain of a table is what one row means. Say it as a sentence starting with "one row per".

  * A customer table has a grain of one row per customer.
  * An order table has a grain of one row per order.
  * An order-lines table has a grain of one row per product within an order.

Those three tables can all have 500 rows and mean completely different things. Grain is the answer to "what am I counting", and every count, sum and average you write is an answer at some grain. When a number comes out wrong, it is usually right at a grain you did not intend.

The other thing to know about a table before you query it is its **data types**. Broadly: integers, decimals, text, dates, and booleans. Types are not decoration. A date stored as text will sort alphabetically, so the first of December lands before the second of January. A number stored as text will not compare or add correctly. When something obvious refuses to work, check the type first.

## 2. The six clauses, and the order they really run in

Before the explanation: you name a column `revenue` in your `SELECT`, then try to filter on `revenue` in your `WHERE`, and the database says no such column. It is right there on the line above. Why does the database not see it?

Here is a query using every clause. This is the whole shape of SQL, and everything else is a variation on it.
    
    
    SELECT   region, COUNT(*) AS orders
    FROM     orders
    WHERE    order_date >= '2026-01-01'
    GROUP BY region
    HAVING   COUNT(*) > 100
    ORDER BY orders DESC
    LIMIT    10;

Read in typing order it is: show me these things, from here, where this is true, grouped like this, keeping only groups like that, sorted this way, and stop after ten.

But the database does not run it in that order. It runs `FROM`, then `WHERE`, then `GROUP BY`, then `HAVING`, then `SELECT`, then `ORDER BY`, then `LIMIT`. That is the order in the picture above, and it explains three things people otherwise memorise as arbitrary rules.

The first is your prequestion. `WHERE` runs before `SELECT`, so at the moment `WHERE` is evaluated the alias `revenue` does not exist yet. That is why you have to repeat the whole expression in the `WHERE`, or wrap the query in another one.

The second is `WHERE` against `HAVING`, which is the single most asked SQL interview question after joins. `WHERE` runs before grouping, so it filters individual rows. `HAVING` runs after grouping, so it filters groups, and it is the only one that can see an aggregate like `COUNT(*)`. "Orders over 500 dollars" is a `WHERE`. "Regions with more than 100 orders" is a `HAVING`.

The third is that `ORDER BY` runs after `SELECT`, which is why it _can_ use your alias. `ORDER BY orders DESC` works in the query above, on a name that `WHERE` could not see. Same query, same alias, different answer, purely because of when each clause runs.

Say this one out loud before you read on: why can `ORDER BY` use an alias that `WHERE` cannot?

## 3. Filtering, and what NULL does to it

Before the explanation: a table has 100 rows. You run one filter and get 60 rows, then run the exact opposite filter and get 30. Where are the other 10?

`WHERE` keeps rows that make a condition true. The building blocks are small.

| Operator                   | What it does                                                                         |
|----------------------------|--------------------------------------------------------------------------------------|
| `=` `<>` `<` `>` `<=` `>=` | Compare one value to another                                                         |
| `AND` `OR` `NOT`           | Combine conditions. `AND` is applied before `OR`, so use brackets when you mix them. |
| `IN (a, b, c)`             | Matches any value in a list. Shorter than a chain of `OR`.                           |
| `BETWEEN x AND y`          | A range, and both ends are included                                                  |
| `LIKE 'north%'`            | Text pattern. `%` means any run of characters, `_` means exactly one.                |
| `IS NULL` / `IS NOT NULL`  | The only correct way to test for a missing value                                     |

Which brings us to the answer to the prequestion. `NULL` does not mean zero and it does not mean empty text. It means unknown. And a comparison against an unknown does not come back false, it comes back unknown, which is a third state. A row whose value is unknown fails both `region = 'North'` and `region <> 'North'`, because SQL cannot say either is true. Those ten rows are not in either result.

This is why `= NULL` never works and `IS NULL` is a separate piece of syntax. It is also why `NOT IN` against a list containing a `NULL` returns nothing at all, which is a genuinely nasty afternoon the first time it happens.

The everyday habit that saves you: whenever you write a filter that excludes something, ask what happens to the rows where the column is unknown, and decide on purpose. Often you want `WHERE region <> 'North' OR region IS NULL`.

## 4. Aggregation, GROUP BY and HAVING

Before the explanation: `COUNT(*)` and `COUNT(customer_id)` on the same table can return different numbers. What is the difference between what those two questions are asking?

An **aggregate function** takes many rows and returns one value. There are five you will use constantly: `COUNT`, `SUM`, `AVG`, `MIN`, `MAX`.

`GROUP BY` decides what "many rows" means. Without it, an aggregate collapses the entire table to a single row. With `GROUP BY region`, it collapses to one row per region, and the aggregate is recalculated inside each one. This is the same idea as the level of detail of a view in Tableau, and if you have met that, it is exactly the same mechanic wearing different clothes. There is a walkthrough of it in the [Tableau concepts guide](https://michaelnocito.github.io/analyst-prep-kit/guides/sql-foundations/../tableau-concepts/).

The rule that follows: every column in your `SELECT` must either be in the `GROUP BY` or be wrapped in an aggregate. There is no third option, because there is no sensible answer to "give me the customer name for this group of 400 customers."

Now the three counts, which is the prequestion.

| Written as                    | Counts                                                               |
|-------------------------------|----------------------------------------------------------------------|
| `COUNT(*)`                    | Rows. Every row, including ones full of `NULL`.                      |
| `COUNT(customer_id)`          | Rows where that column is not `NULL`. Missing values are skipped.    |
| `COUNT(DISTINCT customer_id)` | How many different customers, no matter how many rows each occupies. |

Those are three genuinely different questions: how many rows, how many rows have this, and how many distinct things. The gap between the first and the third is the fastest way to detect duplicate rows, which is why it comes back in the joins guide.

`AVG` skips `NULL` too, which matters more than it sounds. If 40 of 100 rows have no value, `AVG` divides by 60, not 100. When a missing value really means zero, replace it first with `COALESCE(column, 0)`, which returns the first thing in its list that is not `NULL`.

Now picture your own data. If you grouped it by its most obvious category column and counted rows, which group would be biggest, and would that be a finding or just a reflection of how the data was collected?

## 5. Joining two tables

Before the explanation: you join a customer table to an order table. Neither table changed. Why can the result have more rows than both of them?

A **join** combines two tables by matching rows on a shared value, called the key. The mechanic is one sentence, and it is worth holding onto: for every row on the left, the database finds every row on the right whose key matches, and writes one output row per pair.

That sentence answers the prequestion. A customer with three orders produces three pairs, so three output rows, with the customer's details repeated on each. Multiply that across a table and the result is bigger than either input.

The same sentence explains the opposite failure. A customer with no orders produces no pairs, so no output rows, and they vanish from the result with no error and no warning.

The types, briefly. `INNER JOIN` keeps only matched pairs. `LEFT JOIN` keeps every row from the left table, filling the right side with `NULL` where nothing matched. `RIGHT JOIN` does the same the other way round. `FULL OUTER JOIN` keeps unmatched rows from both sides. `CROSS JOIN` pairs everything with everything and is almost never what you want by accident.

Joins are where the largest share of real analyst errors live, and both failure modes are invisible in the query text and obvious in the row count. That is a whole guide on its own: [how to join two tables without losing or doubling rows](https://michaelnocito.github.io/analyst-prep-kit/guides/sql-foundations/../sql-joins/) works through both on 41 million real rows, with the two counts that catch each one.

## 6. Shaping the output: DISTINCT, ORDER BY, CASE, aliases

Before the explanation: your result has the same customer listed nine times. Is `DISTINCT` the fix, or is it a way of hiding the question you should be asking?

`DISTINCT` removes duplicate rows from the result. It is useful for a genuine question like "which regions appear in this table". It is dangerous as a reflex, because duplicate rows usually mean a join multiplied your data, and removing them by hand hides that rather than fixing it. Ask where the duplicates came from first, then decide.

`ORDER BY` sorts. Ascending by default, `DESC` for descending, and you can sort by several columns in priority order. `LIMIT` takes the first n rows and is your best friend on a table you have never opened before, because `SELECT * FROM big_table LIMIT 10` shows you what you are dealing with in a second.

**Aliases** rename things. `AS avg_hours` names an output column, and `FROM customers AS c` nicknames a table so you can write `c.name`. Two joined tables almost always need those nicknames, because both can carry a column of the same name. The whole habit is covered in [SQL aliases, and reading a query out loud](https://michaelnocito.github.io/analyst-prep-kit/guides/sql-foundations/../sql-aliasing/).

`CASE` is the if-then of SQL, and it turns a column into categories.
    
    
    SELECT name,
           CASE WHEN tenure_months < 12 THEN 'First year'
                WHEN tenure_months < 36 THEN 'Established'
                ELSE 'Loyal'
           END AS segment
    FROM customers;

It reads top to bottom and stops at the first match, which is why the ranges above do not need an upper bound each. Anything not matched falls to `ELSE`, and with no `ELSE` it becomes `NULL`. `CASE` also works inside an aggregate, which is how you count a subset in the same query: `SUM(CASE WHEN churned = 1 THEN 1 ELSE 0 END)`.

## 7. Subqueries, CTEs and window functions

Before the explanation: you want each customer's spend compared to their region's average. That needs two different groupings in one result. How can one query have two grains at once?

Three tools, and they are the step from writing queries to structuring them.

A **subquery** is a query inside another query. It can sit in `FROM`, where it acts as a temporary table, or in `WHERE`, where it supplies a value or a list to compare against.

A **CTE** , a common table expression, is the same idea written so a human can read it. You name a result up front with `WITH`, then use that name below.
    
    
    WITH regional AS (
      SELECT region, AVG(spend) AS region_avg
      FROM customers
      GROUP BY region
    )
    SELECT c.name, c.spend, r.region_avg
    FROM customers AS c
    JOIN regional AS r ON c.region = r.region;

That is the answer to the prequestion, done the explicit way. Compute the region-level answer once, name it, then join it back to the customer-level rows. Reading it top to bottom is the same order the work happens in, which is why CTEs are worth reaching for even when a nested subquery would do. A query someone else can follow is a query someone else will trust.

A **window function** gets you the same result without the join. It computes across a set of related rows while keeping every row.
    
    
    SELECT name, spend,
           AVG(spend) OVER (PARTITION BY region) AS region_avg
    FROM customers;

That is the whole idea: `OVER` says "look across a window of rows", and `PARTITION BY` says which rows belong to the same window. An ordinary `GROUP BY` collapses your rows. A window function does the same math and keeps them. The other common ones are `ROW_NUMBER`, `RANK` and `DENSE_RANK` for numbering rows inside each group, and `LAG` and `LEAD` for reaching at the previous or next row, which is how you calculate month-over-month change.

## 8. Keys, indexes, and what relational means

Before the explanation: why is the same customer's address stored in one table rather than repeated on every one of their orders?

A **primary key** is the column that uniquely identifies a row. One customer id, one customer, never repeated, never `NULL`. A **foreign key** is that same id appearing in another table to point back, so an order carries the customer id of whoever placed it.

That pair is the whole answer to the prequestion. The address lives in one place, so changing it changes it everywhere, and there is no way for two copies to disagree. Splitting data into tables that reference each other by key is called normalisation, and it is what relational means in practice.

An **index** is a lookup structure the database keeps on a column so it does not have to read every row to find a value. The cost is a little space and slightly slower writes. The benefit on a large table is dramatic: matching 125,855 rows against 41 million goes from a full scan to a lookup. Index the columns you join and filter on. The [guide to handling large datasets](https://michaelnocito.github.io/analyst-prep-kit/guides/sql-foundations/../handle-large-datasets/) covers the rest of working at that size.

One last thing worth knowing before you meet it. SQL is a standard, but every database extends it. Date functions, string functions, and how you limit rows all differ between PostgreSQL, MySQL, SQLite, SQL Server and BigQuery. The core in this guide is the same everywhere. When a function does not exist, you are usually in a different dialect rather than wrong.

## How to study this so it sticks

Reading this page again will feel like learning and mostly will not be. Three findings change what an hour of study is worth, and all three are cheap to act on.

The first is that retrieving something from memory stores it better than reviewing it does. Students who read a passage once and then took recall tests remembered far more a week later than students who read the same passage four times, even though the re-readers felt more confident (Roediger & Karpicke, 2006, _Psychological Science_ , 17(3), 249–255). Applied here: cover the right-hand column of the retrieval sheet below and say each answer before you look. The struggle is the mechanism, not a sign you are doing it badly.

The second is spacing. The same total study time, spread across days rather than packed into one sitting, produces substantially better retention, and the effect holds across hundreds of experiments (Cepeda, Pashler, Vul, Wixted, & Rohrer, 2006, _Psychological Bulletin_ , 132(3), 354–380). Three twenty-minute passes on three days beats one hour tonight.

The third is why this guide keeps asking you to say things out loud. Learners who explain a worked example to themselves as they go understand it substantially better, and transfer it to new problems better, than learners who read the same example without explaining it (Chi, Bassok, Lewis, Reimann, & Glaser, 1989, _Cognitive Science_ , 13(2), 145–182). SQL is where that pays off most, because the mistake is almost never in a keyword. It is in what you believe one row means.

If you have paper nearby and a spare five minutes, there is one drawing worth doing, and it is optional. Draw the two columns from the picture at the top from memory, typing order on the left, running order on the right, and join them up. It is the concept with the most downstream consequences, and drawing it from memory is both a retrieval attempt and a check on whether you actually have it.

## The whole thing on one screen

This is the retrieval sheet. Cover the right column, work down the left, and say each answer out loud before you check it.

| Concept                       | What it does                                                                                   |
|-------------------------------|------------------------------------------------------------------------------------------------|
| Grain                         | What one row means. Say it as "one row per something".                                         |
| Execution order               | FROM, WHERE, GROUP BY, HAVING, SELECT, ORDER BY, LIMIT.                                        |
| Why WHERE cannot use an alias | WHERE runs before SELECT, so the alias does not exist yet.                                     |
| Why ORDER BY can              | ORDER BY runs after SELECT.                                                                    |
| WHERE                         | Filters individual rows, before grouping.                                                      |
| HAVING                        | Filters groups, after grouping. The only one that sees an aggregate.                           |
| NULL                          | Unknown, not zero and not empty. Comparisons against it are neither true nor false.            |
| IS NULL                       | The only correct test for a missing value. `= NULL` never works.                               |
| COALESCE                      | Returns the first value in its list that is not NULL.                                          |
| COUNT(*)                      | Counts rows, including rows full of NULL.                                                      |
| COUNT(column)                 | Counts rows where that column is not NULL.                                                     |
| COUNT(DISTINCT column)        | Counts how many different values, ignoring repeats.                                            |
| GROUP BY                      | Decides which rows an aggregate is calculated inside.                                          |
| The GROUP BY rule             | Every selected column is either grouped or aggregated. No third option.                        |
| INNER JOIN                    | Keeps only matched pairs. Unmatched rows vanish silently.                                      |
| LEFT JOIN                     | Keeps every left row, filling the right side with NULL where nothing matched.                  |
| Fan-out                       | One row matching many produces many rows, repeating the one side's values.                     |
| DISTINCT                      | Removes duplicate rows. Ask where they came from before using it.                              |
| LIMIT                         | Returns the first n rows. The fastest way to look at an unfamiliar table.                      |
| Alias                         | A nickname for a column or table. `AS` is optional but clearer.                                |
| CASE                          | If-then. Reads top to bottom, stops at the first match, unmatched falls to ELSE.               |
| Subquery                      | A query inside a query, in FROM as a temporary table or in WHERE as a value.                   |
| CTE (WITH)                    | A named result defined up front, so the query reads in the order it works.                     |
| Window function               | Math across related rows that keeps every row. GROUP BY collapses, OVER does not.              |
| PARTITION BY                  | Says which rows belong to the same window.                                                     |
| LAG and LEAD                  | Reach at the previous or next row. How period-over-period change is built.                     |
| Primary key                   | Uniquely identifies a row. Never repeated, never NULL.                                         |
| Foreign key                   | That id appearing in another table to point back at it.                                        |
| Index                         | A lookup structure so the database does not read every row. Index what you join and filter on. |

**The one habit to keep.** Before you write an aggregate, say the grain of what you are aggregating out loud. "One row per order" or "one row per review". Nearly every wrong number in SQL is a correct calculation performed at a grain you did not intend, and that one sentence catches it before the query runs. If it does not catch yours, there is a general [diagnosis loop for being stuck](https://michaelnocito.github.io/analyst-prep-kit/guides/sql-foundations/../technical-tenacity/).

One genuine question, and I would like other people's answers. The concept that took me longest was `NULL`, because I kept treating it as a value rather than as an absence of one, and it kept nearly working. Which SQL idea did you understand wrongly for the longest, and what finally fixed it?

## References

  * Codd, E. F. (1970). A relational model of data for large shared data banks. _Communications of the ACM_ , 13(6), 377–387.
  * Roediger, H. L., & Karpicke, J. D. (2006). Test-enhanced learning: Taking memory tests improves long-term retention. _Psychological Science_ , 17(3), 249–255.
  * Cepeda, N. J., Pashler, H., Vul, E., Wixted, J. T., & Rohrer, D. (2006). Distributed practice in verbal recall tasks: A review and quantitative synthesis. _Psychological Bulletin_ , 132(3), 354–380.
  * Chi, M. T. H., Bassok, M., Lewis, M. W., Reimann, P., & Glaser, R. (1989). Self-explanations: How students study and use examples in learning to solve problems. _Cognitive Science_ , 13(2), 145–182.

---

*The full version of this guide lives on my site: [SQL Foundations, Start to Finish](https://michaelnocito.github.io/analyst-prep-kit/guides/sql-foundations/).*

*If it was useful: [Buy Me a Coffee](https://buymeacoffee.com/michaelnocito).*
