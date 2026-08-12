By the end of this page you can check any table for duplicate rows, list every copy, and mark which one to keep, all with queries you understand. You will also know the step that comes before any query: deciding what "duplicate" means for this table, because two rows can match on everything or on one column, and those are different problems with different fixes. It is about twenty minutes.

Here is what to actually do with it. On the next table you are handed, run one comparison before anything else: `COUNT(*)` against `COUNT(DISTINCT key)`. If the two numbers differ, the table has duplicates, and now you know before your first report does.

The short version: group by the columns that define a duplicate, keep the groups where `COUNT(*)` is above one, and mark extras with `ROW_NUMBER` instead of deleting them.

One picture carries the whole method. Rows that share a key collapse into buckets, and the buckets holding more than one row are your duplicates.

> _The original carries a diagram here. In words: A left-to-right picture in three stages. Stage one is a column of eight row boxes. Three of them carry the same small square marker, and two others share a different marker, showing that they hold the same key value. Stage two shows the rows collapsed into five buckets: one bucket holds the three matching rows, one holds the two matching rows, and three buckets hold a single row each. The two buckets holding more than one row are outlined in a warm warning color and labelled with their counts, three and two. Stage three shows only those two flagged buckets passing through to the result. The picture shows that grouping rows by their key makes every duplicate visible as a bucket whose count is above one, while unique rows form buckets of one and drop away._

**The worked example is real.** Every number on this page comes from a 14-row customers table I built with three duplicates seeded on purpose, and every query was run against it in SQLite before its output was pasted here. The table is small enough to check by eye, which is the point: you can confirm every result yourself. If `GROUP BY` itself is new, read [GROUP BY and HAVING](https://michaelnocito.github.io/analyst-prep-kit/guides/sql-group-by-having/) first and come back.

Here is the table. Fourteen rows, and the signup system has misbehaved in three different ways.

| customer_id | email              | full_name      | city       | signup_date |
|-------------|--------------------|----------------|------------|-------------|
| 101         | ana@keller.com     | Ana Keller     | Austin     | 2026-01-04  |
| 102         | ben.ortiz@mail.com | Ben Ortiz      | Dallas     | 2026-01-09  |
| 103         | cara.li@mail.com   | Cara Li        | Austin     | 2026-01-15  |
| 104         | dev.p@mail.com     | Dev Patel      | Houston    | 2026-01-20  |
| 105         | ella.r@mail.com    | Ella Reyes     | Dallas     | 2026-02-02  |
| 106         | finn.w@mail.com    | Finn Walsh     | Austin     | 2026-02-11  |
| 103         | cara.li@mail.com   | Cara Li        | Austin     | 2026-01-15  |
| 107         | gus.m@mail.com     | Gus Moran      | Houston    | 2026-02-19  |
| 108         | hana.s@mail.com    | Hana Sato      | Dallas     | 2026-02-25  |
| 105         | ella.r@mail.com    | Ella Reyes     | Fort Worth | 2026-03-01  |
| 109         | ivan.k@mail.com    | Ivan Kova      | Austin     | 2026-03-06  |
| 103         | cara.li@mail.com   | Cara Li        | Austin     | 2026-01-15  |
| 110         | jo.b@mail.com      | Jo Brandt      | Houston    | 2026-03-14  |
| 111         | ben.ortiz@mail.com | Benjamin Ortiz | Dallas     | 2026-03-20  |

## 1. Decide what counts as a duplicate before you write anything

Before the explanation: customer 103 appears three times with every column identical. Customer 105 appears twice with two different cities. Ben Ortiz's email appears under two different ids. Which of those three are duplicates?

That question has no single answer, and that is the real first step of any duplicate hunt. "Duplicate" is not a property of the data. It is a decision you make about which columns have to match before two rows mean the same thing. There are three common answers, and each one leads to a different query and a different cleanup.

  * **Whole row identical.** Every column matches, like customer 103. This is almost always a loading accident: the same file imported twice, a retried insert, a copy-paste. The extra copies carry no information and are safe to remove once marked.
  * **Same natural key, rest differs.** A natural key is the column that identifies the thing in the real world, like `customer_id`. Customer 105 has one id and two cities, so one row is stale and one is current. Removing the wrong one destroys real information, so here the decision is which copy to keep, not just how many to remove.
  * **Same person, different spelling.** Ben Ortiz and Benjamin Ortiz share an email but nothing a `GROUP BY` can match exactly. No query on this page will catch that pair as a name match. That problem is called entity resolution, deciding when two differently-written records are the same real thing, and it gets [its own guide](https://michaelnocito.github.io/analyst-prep-kit/guides/entity-resolution/).

So the fork is: which columns define "the same"? All of them means you are hunting loading accidents. The natural key means you are hunting conflicting versions. Neither means you may be hunting people, and that is a different tool. Everything below works for the first two, and the queries only differ in what you put after `GROUP BY`.

## 2. The ten-second test on any table

Before the explanation: without looking back at the table, how would you get one number that says whether any id appears twice?

Count the rows two ways. `COUNT(*)` counts every row. `COUNT(DISTINCT customer_id)` counts how many different id values exist. If every id appears once, the two numbers match. Any gap between them is the number of extra copies.
    
    
    SELECT COUNT(*)                    AS total_rows,
           COUNT(DISTINCT customer_id) AS distinct_ids
    FROM customers;

| total_rows | distinct_ids |
|------------|--------------|
| 14         | 11           |

Fourteen rows, eleven distinct ids, so three rows are extra copies of something. This is the query I run on every table anyone hands me, before any join and before any report, because it takes about ten seconds and it changes what I trust. It does not tell you which rows are the copies. It tells you whether the hunt is needed at all, and 14 against 11 says yes.

**Run the test on the join key especially.** If you are about to join on `customer_id` and this table has 14 rows for 11 ids, the join will multiply rows and every count downstream will be quietly wrong. Ten seconds here saves an afternoon there.

## 3. List the duplicates with GROUP BY and HAVING

Before the explanation: the test says three extra rows exist. What would you group by to find out which customers they belong to?

Group by the columns from your step-one decision, count each bucket, and keep only the buckets with more than one row. `HAVING` is the clause that filters groups after they are formed, which is exactly the moment the count exists.
    
    
    SELECT customer_id, COUNT(*) AS copies
    FROM customers
    GROUP BY customer_id
    HAVING COUNT(*) > 1
    ORDER BY copies DESC;

| customer_id | copies |
|-------------|--------|
| 103         | 3      |
| 105         | 2      |

Two customers, five rows between them, three of which are extras. That accounts exactly for the gap in step two: 14 rows minus 11 ids is 3, and here they are, two extra copies of 103 plus one extra of 105.

To hunt whole-row duplicates instead, put every column in the `GROUP BY`. Now a bucket only forms when rows match on everything.
    
    
    SELECT customer_id, email, full_name, city, signup_date,
           COUNT(*) AS copies
    FROM customers
    GROUP BY customer_id, email, full_name, city, signup_date
    HAVING COUNT(*) > 1;

| customer_id | email            | full_name | city   | signup_date | copies |
|-------------|------------------|-----------|--------|-------------|--------|
| 103         | cara.li@mail.com | Cara Li   | Austin | 2026-01-15  | 3      |

Notice what changed. Customer 105 vanished from this result, because her two rows differ on city, so they never land in the same bucket. Say why the two queries disagree about 105, in your own words, before reading on. If you can explain it, you have the whole method: the `GROUP BY` list is your definition of duplicate, written as code.

## 4. See the full duplicate rows, not just the summary

Before the explanation: the summary says customer 105 has two copies, but to decide which to keep you need to see both rows side by side. The grouped result cannot show them, because grouping collapsed them. How do you get them back?

Use the summary as a shopping list. First find the ids with duplicates, then pull every row whose id is on that list. `IN` is the plainest way to say it.
    
    
    SELECT *
    FROM customers
    WHERE customer_id IN (
        SELECT customer_id
        FROM customers
        GROUP BY customer_id
        HAVING COUNT(*) > 1
    )
    ORDER BY customer_id, signup_date;

| customer_id | email            | full_name  | city       | signup_date |
|-------------|------------------|------------|------------|-------------|
| 103         | cara.li@mail.com | Cara Li    | Austin     | 2026-01-15  |
| 103         | cara.li@mail.com | Cara Li    | Austin     | 2026-01-15  |
| 103         | cara.li@mail.com | Cara Li    | Austin     | 2026-01-15  |
| 105         | ella.r@mail.com  | Ella Reyes | Dallas     | 2026-02-02  |
| 105         | ella.r@mail.com  | Ella Reyes | Fort Worth | 2026-03-01  |

Five rows, and now the two problems look as different as they are. Customer 103 is three identical rows: a loading accident, nothing to decide. Customer 105 is two versions of one person: Dallas in February, Fort Worth in March, and someone has to say which city is true. A join back to the same summary gives the identical result, and I ran both to confirm: the same five rows either way. Use whichever reads better to you; [SQL joins](https://michaelnocito.github.io/analyst-prep-kit/guides/sql-joins/) covers the join form.

## 5. Mark keepers and extras with ROW_NUMBER

Before the explanation: you can now see all five duplicate rows. What single column, added to the table, would let anyone else act on them without redoing your work?

A copy number. `ROW_NUMBER()` is a window function, which means it computes a value for every row without collapsing anything. `PARTITION BY customer_id` restarts the numbering for each customer, and `ORDER BY signup_date` decides who gets number one. So copy number 1 is your keeper and everything above 1 is an extra, by a rule you wrote down.
    
    
    SELECT customer_id, city, signup_date,
           ROW_NUMBER() OVER (
               PARTITION BY customer_id
               ORDER BY signup_date
           ) AS copy_number
    FROM customers
    ORDER BY customer_id, copy_number;

The duplicated customers come back numbered like this.

| customer_id | city       | signup_date | copy_number |
|-------------|------------|-------------|-------------|
| 103         | Austin     | 2026-01-15  | 1           |
| 103         | Austin     | 2026-01-15  | 2           |
| 103         | Austin     | 2026-01-15  | 3           |
| 105         | Dallas     | 2026-02-02  | 1           |
| 105         | Fort Worth | 2026-03-01  | 2           |

Every other customer simply gets copy number 1. Wrap it in a subquery and keep `copy_number > 1` and you have exactly the three extras, which I ran to confirm: two extra rows for 103 and the Fort Worth row for 105.

Here is the fork on keep-versus-delete, because it is a real decision. Deleting extras makes the table clean but destroys the evidence, and if your keeper rule was wrong, the right row is gone. Marking extras keeps every row and adds a column that says which one the reports should use. Marking costs one column. Deleting costs the ability to change your mind. That is why working analysts mark first and delete rarely: filter reports to `copy_number = 1` and you get every benefit of the delete with none of the risk. Notice the marking rule is visible in the query: for 105, `ORDER BY signup_date` made the newer Fort Worth row the extra. If the business says newest wins, flip the order to `signup_date DESC` and the keeper flips too. The rule is code, so it can be reviewed and argued with.

The window function family goes much further than this one trick, and [window functions](https://michaelnocito.github.io/analyst-prep-kit/guides/sql-window-functions/) walks through it properly. If you want the pattern in your fingers rather than your bookmarks, [type the query yourself](https://michaelnocito.github.io/analyst-prep-kit/drill/) a few times in the SQL Drill.

## 6. The delete pattern, stated once, with the guard rails

Sometimes the answer really is to remove rows, usually for whole-row loading accidents like customer 103. Here is the pattern, once. In SQLite every row has a hidden `rowid`, so keep the smallest `rowid` per customer and delete the rest. Other databases use `ctid`, a system id, or a `ROW_NUMBER` subquery, but the shape is the same.
    
    
    DELETE FROM customers
    WHERE rowid NOT IN (
        SELECT MIN(rowid)
        FROM customers
        GROUP BY customer_id
    );

I ran it on the worked table, and the counts after were 11 rows and 11 distinct ids: the ten-second test now passes. Two guard rails, and they are not optional.

  * **Run it as a SELECT first.** Change `DELETE FROM customers` to `SELECT * FROM customers` with the same `WHERE`, and read the rows that would die. On this table that shows exactly the three extras and nothing else. If the select surprises you, the delete would have too, except the delete does not let you look twice.
  * **Keep the original table.** Do the delete on a copy, or write the deleted rows to a side table first. Note that this delete pattern keeps an arbitrary earliest-loaded row, not a chosen one, so for same-key conflicts like customer 105 it can silently keep the stale city. That is exactly why marking came first.

## 7. The full before and after

Same table, same question: which customers have duplicate rows, and which copy should stand?

### Before
    
    
    SELECT customer_id, COUNT(*)
    FROM customers
    GROUP BY customer_id
    HAVING COUNT(*) > 1;

Correct, and not enough to act on. It names 103 and 105 but shows none of their rows, states no keeper rule, and gives the next person nothing to review.

### After
    
    
    -- ============================================================
    -- STEP 2: Which customer rows are duplicates, and which stands?
    -- WHY: 14 rows but only 11 distinct customer_ids, so 3 rows
    --      are extra copies. Reports must count customers once.
    -- RULE: keeper = earliest signup_date per customer_id.
    --      105's city conflict (Dallas vs Fort Worth) goes to the
    --      data owner; nothing is deleted here.
    -- ============================================================
    --SELECT each customer row with its copy number:
    --   ROW_NUMBER restarts at 1 for every customer_id,
    --   ordered by signup_date, so copy_number 1 = keeper
    SELECT customer_id, email, full_name, city, signup_date,
           ROW_NUMBER() OVER (
               PARTITION BY customer_id
               ORDER BY signup_date
           ) AS copy_number
    FROM customers
    ORDER BY customer_id, copy_number;

Every row is present, the keeper rule is written where a reviewer can disagree with it, the known conflict is named, and downstream queries just filter to `copy_number = 1`. The comment format is the one from [how to comment SQL so it teaches](https://michaelnocito.github.io/analyst-prep-kit/guides/sql-teaching-comments/).

Now picture running the marking query on your own biggest table, partitioned by whatever its natural key is. Which column would you put in the `ORDER BY` to decide the keeper, and could you defend that choice to the person who owns the data?

## 8. Edge cases that make duplicate hunts go wrong

Before the explanation: your duplicate query returns zero rows, but a report downstream still double-counts customers. What are the ways both of those can be true at once?

Five that each cost someone real time.

**You grouped by the wrong definition.** This is the zero-rows answer. Grouping by every column finds no duplicates in a table where the same id appears twice with different cities, exactly like customer 105. When the whole-row query comes back clean, run the natural-key version before declaring the table clean.

**The duplicates are not in this table.** A join can multiply rows even when both tables pass the ten-second test on their own keys, if you join on a column that is not unique in either table. When a report double-counts, test the join key on each side, not just the id.

**Near-matches slip every exact grouping.** Trailing spaces, capital letters, and spelling variants are all different values to `GROUP BY`. My table holds one of these on purpose: Ben Ortiz and Benjamin Ortiz. Grouping by email catches that pair, and I ran it: `ben.ortiz@mail.com` shows 2 copies under 2 different ids. But grouping by name never will, and true fuzzy matching is [entity resolution](https://michaelnocito.github.io/analyst-prep-kit/guides/entity-resolution/), not a bigger GROUP BY.

**NULLs group together.** Two rows with a missing email land in the same bucket, because grouping treats all NULLs as one value. A bucket of blanks with a count of 40 is not 40 duplicates. It is 40 rows missing their key, which is a different finding worth reporting on its own.

**Duplicates found during a migration are a symptom, not a chore.** When profiling a source system before a migration turns up duplicates, the count is evidence about how the old system behaved: retried saves, merged offices, users working around a bug. Log where they came from before anyone cleans them, because the pattern predicts what else is wrong. [Profiling data before a migration](https://michaelnocito.github.io/analyst-prep-kit/guides/migration-profiling/) covers that workflow.

## Why this works

The method leans on one property of grouping. Grouping partitions rows into disjoint sets by value, so two rows land in the same set exactly when they match on every grouped column. That makes the `GROUP BY` list a precise, executable statement of your duplicate definition, rather than a vague intention. The relational model has treated tables as sets of rows this way from the start (Codd, 1970, _Communications of the ACM_ , 13(6), 377–387), which is also why exact matching is all a database gives you natively, and why same-person-different-spelling needs separate tooling.

The marking habit has a plainer justification: it keeps every decision reversible. The keeper rule lives in an `ORDER BY` that a reviewer can read and flip, and the extras stay on disk until someone with authority over the data says otherwise. A delete embeds the same rule invisibly and enforces it permanently.

There is also a reason this page keeps asking you to answer before it explains. Attempting an answer before seeing the solution measurably improves what you retain, even when your attempt is wrong (Bisra, Liu, Nesbit, Salimi, & Winne, 2018, _Educational Psychology Review_ , 30(3), 703–725), and practicing retrieval outperforms rereading the same material (Roediger & Karpicke, 2006, _Psychological Science_ , 17(3), 249–255). Deciding whether customer 105 counts as a duplicate, before I told you it depends, is why the three definitions will come back to you at a keyboard.

## Using this on your own project

Auditing every table you own for duplicates in one sitting is miserable, and you will abandon it around table four. Do this instead, in order.

  1. **Run the ten-second test on the one table your current report depends on most.** `COUNT(*)` against `COUNT(DISTINCT key)`. If they match, stop. You have your answer for today.
  2. **If they differ, write down your duplicate definition in one sentence** before touching the keyboard. "Same customer_id" and "identical row" lead to different queries, and picking one out loud stops you blending them.
  3. **List the offenders with GROUP BY and HAVING,** then pull the full rows back with `IN`. Read them. The rows themselves usually tell you which of the three problems you have.
  4. **Mark keepers with ROW_NUMBER and a written rule.** Filter reports to copy number 1. Do not delete anything this week.
  5. **Take the conflict rows to whoever owns the data.** Ella Reyes's two cities are not a query problem, and pretending otherwise just moves the error into your report.

If you have paper nearby and five minutes, one optional drawing locks the method in. Draw eight rows, give three of them a shared mark, collapse the rows into buckets, and write each bucket's count beside it. Circle the buckets above one. Redrawing that from memory is a fair test of whether you own the idea.

**More detail on this, and more like it.** Every how-to sits in one place on the [guides index](https://michaelnocito.github.io/analyst-prep-kit/guides/): SQL, Tableau, data migration, and the working habits around them.

## The whole thing on one screen

This is the retrieval sheet. Cover the right column, work down the left, and say each answer out loud before you check it.

| Concept                         | What it does                                                                          |
|---------------------------------|---------------------------------------------------------------------------------------|
| First step                      | Decide which columns define "the same". That decision picks the query.                |
| Whole-row duplicate             | Every column matches. Usually a loading accident. Safe to remove once marked.         |
| Natural-key duplicate           | Same real-world id, other columns differ. Someone must pick the true version.         |
| Same person, different spelling | No exact match exists. That is entity resolution, a separate tool.                    |
| The ten-second test             | `COUNT(*)` vs `COUNT(DISTINCT key)`. Any gap is the number of extras.                 |
| List duplicates                 | `GROUP BY key HAVING COUNT(*) > 1`. The GROUP BY list is your definition.             |
| See the full rows               | `WHERE key IN (the summary)`, or join back to it. Same rows either way.               |
| Mark keepers                    | `ROW_NUMBER() OVER (PARTITION BY key ORDER BY rule)`. Copy 1 keeps, above 1 is extra. |
| Why mark, not delete            | Marking is reversible and the keeper rule stays visible. Deleting is neither.         |
| The delete pattern              | Keep `MIN(rowid)` per key, delete the rest. SELECT it first. Keep the original table. |
| Zero duplicates found           | Check the other definition before declaring the table clean.                          |
| Report double-counts anyway     | Test the join key on both sides. Joins multiply rows that each look clean alone.      |
| NULL keys                       | All NULLs share one bucket. That count is missing data, not duplicates.               |
| During a migration              | Duplicates are evidence about the source system. Log them before cleaning them.       |

**The one habit to keep.** If you take nothing else from this page, run `COUNT(*)` against `COUNT(DISTINCT key)` on every table before you trust a number from it. Ten seconds, and it is the difference between finding the duplicates and having your stakeholder find them. If a duplicate hunt breaks in a way this page does not cover, there is a general [diagnosis loop for being stuck](https://michaelnocito.github.io/analyst-prep-kit/guides/technical-tenacity/).

One last thought, and I would genuinely like other people's answers. My favorite duplicate ever found was a customer who existed twice because two offices both swore they had onboarded her first. What is the strangest reason a duplicate has turned up in your data, and did the query find it or did a person?

## References

  * Codd, E. F. (1970). A relational model of data for large shared data banks. _Communications of the ACM_ , 13(6), 377–387.
  * Bisra, K., Liu, Q., Nesbit, J. C., Salimi, F., & Winne, P. H. (2018). Inducing self-explanation: A meta-analysis. _Educational Psychology Review_ , 30(3), 703–725.
  * Roediger, H. L., & Karpicke, J. D. (2006). Test-enhanced learning: Taking memory tests improves long-term retention. _Psychological Science_ , 17(3), 249–255.

---

*Originally published on Analyst Prep Kit: [How to Find Duplicate Rows in SQL (and Decide What Counts as One)](https://michaelnocito.github.io/analyst-prep-kit/guides/sql-find-duplicates/)*

*Visit the site for more beginner data analysis guides and free resources: [the full guide archive](https://michaelnocito.github.io/analyst-prep-kit/guides/) covers SQL, Excel, Power BI, Tableau, Python and statistics, and the [practice kits](https://michaelnocito.github.io/analyst-prep-kit/) run in your browser with nothing to install.*

*If it was useful: [Buy Me a Coffee](https://buymeacoffee.com/michaelnocito).*
