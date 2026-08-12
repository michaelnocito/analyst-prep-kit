By the end of this page you can predict, before you run it, how many rows any join will return. You will know all six join types and what each keeps. You will know the two ways a join goes wrong without ever raising an error, and the two counts that catch each one. That is the whole subject, and it is about a forty-minute read.

Here is what to actually do with it. Go through once end to end for the shape. Then, on the next join you write, run the two counts before you trust any number that comes out of it. Two extra queries, ten seconds, and they catch the class of mistake that ends up in a report.

The short version: a join can drop rows that found no match, and duplicate rows that found several. So count your rows before and after, every time.

One idea decides everything else here, so it gets the picture. A join does not add columns to your table. It builds a new table, and you have to work out its row count yourself.

> _The original carries a diagram here. In words: Three games listed on the left are matched to review rows listed in the middle. The first game, Parabox, connects by a single line to one review of 12 hours, and appears once in the result column on the right. The second game, Maj'Eyal, connects by three lines to three separate reviews of 174, 96 and 310 hours, and appears three times in the result column, its name repeated on each row. The third game, Until Then, has a line that ends in a cross because no review matches it, and it does not appear in the result column at all. The result column therefore holds four rows, while neither of the two original tables had four rows._

**The worked example is real.** Every number on this page comes from a published portfolio project: a list of 175 games joined to a table of 41,154,794 player reviews. The queries run against the full datasets at [Steam Hidden Gems on GitHub](https://github.com/michaelnocito/steam-hidden-gems). If joins are the only thing here that is new, and clauses like `GROUP BY` and `HAVING` are too, start with [SQL foundations](https://michaelnocito.github.io/analyst-prep-kit/guides/sql-foundations/) and come back.

## 1. What a join actually does to your rows

Before the explanation: you join two tables and get a result with more rows than either of them had. Nothing errored. What did the database do to produce extra rows out of nowhere?

The Venn diagram is where most people meet joins, and it is a reasonable start. It just describes the wrong thing. It shows which _keys_ survive. What you need to predict is how many _rows_ come out, and those are different questions.

Here is the rule that answers both. A join walks the left table, and for every row it finds every row on the right whose key matches. Then it writes one output row per pair. That single sentence explains everything on this page.

  * A left row that finds **no** match produces **zero** output rows. It disappears.
  * A left row that finds **three** matches produces **three** output rows. It is duplicated, and every one of its column values is duplicated with it.

So the output row count is not the left count, and it is not the right count. It is the number of matching pairs, which can be smaller than either table or larger than both.

### Grain, the idea that makes joins make sense

The **grain** of a table is what one row means. Say it out loud before you join anything.

  * `games` has a grain of one row per game. 125,855 rows, 125,855 games.
  * `recommendations` has a grain of one row per player review. 41,154,794 rows, and a popular game owns thousands of them.

Joining those two gives you a table whose grain is one row per review, not one row per game. The game columns are still there, but they now repeat once for every review that game received. The moment you forget that, a `SUM` on a game column stops meaning what its name says.

**Name the grain of the result before you write the aggregate.** Almost every wrong number that comes out of a join comes from aggregating a column at the wrong grain. If you can say "one row per review" out loud, you already know that `SUM(price)` is now price times review count.

Every query on this page nicknames its tables. `FROM hidden_gems AS g` means "for the rest of this query, call that table `g`", so `g.Name` is the Name column of `hidden_gems`. Two joined tables almost always need those nicknames, because both can carry a column of the same name. [SQL aliases, and reading a query out loud](https://michaelnocito.github.io/analyst-prep-kit/guides/sql-aliasing/) covers the whole habit if it is new.

## 2. The six join types, and what each one keeps

Before the explanation: five of the six join types below match rows on a key. One of them does not match on anything at all. Which do you think it is, and what could it possibly be for?

Each type keeps a different set of rows. The pair rule from section one still applies to all of them. All they change is what happens to rows that found no partner.

| Type              | What it keeps                                                         | When you want it                                                                                                      |
|-------------------|-----------------------------------------------------------------------|-----------------------------------------------------------------------------------------------------------------------|
| `INNER JOIN`      | Only matched pairs. Unmatched rows from both sides are gone.          | When a row without a partner is genuinely not part of the question                                                    |
| `LEFT JOIN`       | Every left row. Right columns come back `NULL` where nothing matched. | The safe default. You keep your population and can see what did not match.                                            |
| `RIGHT JOIN`      | Every right row, same idea reversed.                                  | Rarely. Most people swap the table order and use `LEFT` instead, because reading two directions in one query is hard. |
| `FULL OUTER JOIN` | Everything from both sides, matched or not.                           | Reconciling two lists that should agree and do not                                                                    |
| `CROSS JOIN`      | Every left row paired with every right row. No key at all.            | Building a complete grid on purpose, such as every month crossed with every region so empty combinations still appear |
| Self join         | Not a keyword. A table joined to itself under two different aliases.  | Rows that relate to other rows in the same table, such as an employee and their manager                               |

`CROSS JOIN` is the answer to the prequestion, and it is worth knowing precisely because of the accident. Two tables of 1,000 rows each cross-joined produce a million rows. If you ever write a join and forget the `ON` clause, some databases give you exactly that, and the first sign is a query that never finishes.

A note on the word "outer". `LEFT`, `RIGHT` and `FULL` are all outer joins, and you will see them written as `LEFT OUTER JOIN`. The word `OUTER` is optional and means the same thing. Similarly, a plain `JOIN` with no word in front of it is an `INNER JOIN`, which is worth remembering because that default is what causes the first failure below.

Two more pieces of syntax show up constantly. `ON` states the matching condition, as in `ON g.AppID = r.app_id`. `USING (app_id)` is a shorthand for when the column has the same name in both tables. And when a join condition is not a plain equals, for example matching a date to a range, that is a non-equi join. It works the same way and it fans out enthusiastically, so count your rows.

## 3. Failure one: the silent delete

Before the explanation: you join two tables and get fewer rows back than you started with. No error, no warning. Where did the missing rows go, and who decided they should go?

A plain `JOIN` is an `INNER JOIN`. It keeps only rows that matched on both sides. Rows that matched nothing are not flagged, not counted, and not mentioned. They are simply absent.

On my two datasets, that mattered enormously. The two tables were collected by different people at different times, so their coverage does not line up. Checking how many games had any matching review at all:
    
    
    SELECT COUNT(DISTINCT g.AppID) AS games_with_reviews
    FROM games_raw AS g
    JOIN recommendations AS r ON g.AppID = r.app_id;

The answer was 36,255 out of 125,855 games, which is about 29%. Roughly seven out of ten games in the left table would vanish from any inner join with the review table. Narrowed to the 175 games I actually cared about, about 57 of them had no reviews. An inner join quietly reduced my population by a third before I calculated anything, and the result set looked finished. The columns were right, the ordering was right, the numbers were plausible.

### The check that catches it

Two lines, run before you trust anything downstream. First, how many rows went in. Second, how many distinct keys came out.
    
    
    SELECT COUNT(*) AS rows_in FROM hidden_gems;
    
    SELECT COUNT(DISTINCT g.AppID) AS keys_out
    FROM hidden_gems AS g
    JOIN recommendations AS r ON g.AppID = r.app_id;

If `keys_out` is smaller than `rows_in`, your join is dropping records, and you now have a decision to make rather than an accident to discover later. Either the drop is fine and you say so in writing, or it is not and you switch to a `LEFT JOIN`.

Write the match rate down either way. "The playtime analysis covers 118 of 175 games, or 67%, because the review dataset does not include the rest" is a sentence that makes a reviewer trust the whole document. Leaving it out is what makes them stop trusting it.

### The anti-join, and why an empty column is a finding

A `LEFT JOIN` keeps every row from the left table whether it matched or not, filling the right side with `NULL`. That gives you a way to ask the question an inner join cannot answer: which rows found nothing? Keep everything, then keep only the ones where the right side came back empty. This pattern is called an **anti-join** , and it shows up in interviews constantly.
    
    
    SELECT g.Name, g.pct_positive
    FROM hidden_gems AS g
    LEFT JOIN recommendations AS r ON g.AppID = r.app_id
    WHERE r.app_id IS NULL
    ORDER BY g.pct_positive DESC;

Read the `WHERE` clause carefully, because it is the part that surprises people. `r.app_id IS NULL` cannot be true for any row that matched, since a matched row has a real value there. It is only true for rows the `LEFT JOIN` invented to keep an unmatched left row alive. So the filter means "keep the rows that found nothing".

When I ran it, the 57 missing games were not noise. They fell into three groups, and every group told me something. Several were mainstream blockbusters that an earlier data-quality pass had already flagged for impossible price and ownership values, and a completely separate method fingering the same rows is strong confirmation those rows are broken. Others were released after the reviews were collected in August 2024, so they could not possibly match, which turned a vague limitation into a nameable list. The rest were genuinely uncovered titles the review dataset never sampled.

None of that would have existed in an inner join. An empty column is not a hole in your work. It is often the most interesting result you have, and it belongs in your write-up: [documenting data limitations](https://michaelnocito.github.io/analyst-prep-kit/guides/documenting-data-limitations/) covers how.

## 4. Failure two: the silent multiply

Before the explanation: one customer has three orders. You join customers to orders, then sum a column that lives on the customer, like their credit limit. What number comes out, and why is it not the credit limit?

When a game with 2,498 reviews is joined to the review table, that one game becomes 2,498 rows. Its name repeats 2,498 times. Its price repeats 2,498 times. This is called **fan-out** , and the trouble starts the moment you aggregate a column that came from the one-row-per-game side.

Here is the wrong query. It looks entirely reasonable.
    
    
    SELECT g.Name, SUM(g.Price) AS total_price
    FROM hidden_gems AS g
    JOIN recommendations AS r ON g.AppID = r.app_id
    GROUP BY g.AppID, g.Name;

For one game in my data, priced at $3.49 with 2,498 matched reviews, that `SUM` returns 8,718.02. The price of the game is still $3.49. The query added it up once per review, because after the join there are 2,498 rows carrying that price. No error, no warning, and a number roughly 2,500 times too big sitting in a column labelled total price.

**Only aggregate columns that came from the many side.** Columns from the one side belong in `GROUP BY`, never in `SUM`. In this join, `hours` and `review_id` are on the many side, so counting and averaging them is correct. `Name` and `Price` are on the one side, so they get grouped.

Averages hide this better than sums, which makes them more dangerous. `AVG(g.Price)` across 2,498 duplicated rows returns $3.49, the right answer, so nothing looks wrong. Then the same pattern meets a game with two rows in a second joined table. The duplication stops being uniform, and the average silently starts weighting some records more than others. Say out loud why uneven duplication breaks an average but even duplication does not, before you read on. That one is the hinge of this whole guide.

### The check that catches it

Compare total rows to distinct keys. If they differ, you have fan-out, and you should know its size before you aggregate.
    
    
    SELECT COUNT(*) AS joined_rows,
           COUNT(DISTINCT g.AppID) AS distinct_games
    FROM hidden_gems AS g
    JOIN recommendations AS r ON g.AppID = r.app_id;

If `joined_rows` is much larger than `distinct_games`, the join expanded your table, which is completely fine as long as you meant it. Fan-out is not a bug. It is what a one-to-many join is for. It only becomes a bug when you aggregate as if it did not happen.

The other half of the fix is `HAVING`. Once you group, a filter on an aggregate has to run after the grouping, which is what `HAVING` does and `WHERE` cannot.
    
    
    SELECT g.Name,
           g.Price,
           COUNT(r.review_id) AS num_reviews,
           ROUND(AVG(r.hours), 1) AS avg_hours
    FROM hidden_gems AS g
    JOIN recommendations AS r ON g.AppID = r.app_id
    GROUP BY g.AppID, g.Name, g.Price
    HAVING COUNT(r.review_id) >= 50
    ORDER BY avg_hours DESC;

That floor of 50 matters more than it looks. Without it, a game with three reviews and one obsessive player outranks everything else. With it, the top of my list became games with hundreds or thousands of reviews behind their averages, which is the difference between a finding and an artifact. There is more on choosing that number honestly in [data-driven thresholds](https://michaelnocito.github.io/analyst-prep-kit/guides/data-driven-thresholds/).

## 5. The full before and after

Same two tables, same question. The first version runs and lies. The second runs, tells the truth, and states its own coverage.

### Before
    
    
    SELECT g.Name,
           SUM(g.Price) AS total_price,
           AVG(r.hours) AS avg_hours
    FROM hidden_gems AS g
    JOIN recommendations AS r ON g.AppID = r.app_id
    GROUP BY g.AppID, g.Name
    ORDER BY avg_hours DESC;

Three problems, none of which produce an error. `SUM(g.Price)` is multiplied by the review count. The inner join has removed every game with no reviews, unmentioned. And with no minimum review count, a game with two reviews can top the ranking.

### After
    
    
    -- ============================================================
    -- STEP 6: Which games do players actually keep playing?
    -- WHY: A high rating says people liked it once. Average hours
    --      says they stayed. Joining the game list to real playtime
    --      is the only way to tell those apart. The 50-review floor
    --      keeps a single obsessive player from topping the chart.
    -- COVERAGE: 118 of 175 games matched the review data (67%).
    --      The 57 unmatched games are listed separately, not dropped.
    -- ============================================================
    --SELECT the game name, its price, how many reviews matched,
    --   and the average hours those reviewers played:
    --   COUNT(r.review_id) = number of matched review rows per game
    --   AVG(r.hours)       = mean hours across those reviews
    --   ROUND(..., 1)      = round to one decimal place
    --FROM the hidden_gems list (g), joined to reviews (r) on the game id
    --GROUP BY the game, so each game collapses to one row
    --HAVING at least 50 matched reviews, so the average is trustworthy
    --ORDER BY average hours, highest first
    SELECT g.Name,
           g.Price,
           COUNT(r.review_id) AS num_reviews,
           ROUND(AVG(r.hours), 1) AS avg_hours
    FROM hidden_gems AS g
    JOIN recommendations AS r ON g.AppID = r.app_id
    GROUP BY g.AppID, g.Name, g.Price
    HAVING COUNT(r.review_id) >= 50
    ORDER BY avg_hours DESC;

The price column is grouped rather than summed, so it stays $3.49. The coverage line names what the join removed, so a reader knows the scope. The floor stops the ranking from being decided by a sample of two. The comment format is the one from [how to comment SQL so it teaches](https://michaelnocito.github.io/analyst-prep-kit/guides/sql-teaching-comments/).

Now picture the last join you wrote against your own data. Which of those three problems is most likely already sitting in it, and what would the row count have told you?

## 6. Edge cases that break joins in real data

Before the explanation: a join returns zero rows. Not few. Zero. The tables are both full and the ids look identical on screen. What would you check first?

Seven things that have each stopped someone for an afternoon.

**The key columns are named differently.** `games_raw.AppID` and `recommendations.app_id` are the same number from the same source, spelled two ways because two people built the datasets. What matters is that they hold the same identifier, not that they share a name.

**The key columns have different types.** This is the answer to the prequestion. An id stored as text in one table and a number in the other matches nothing at all, and the result is an empty table rather than an error. If a join returns zero rows and you expected thousands, check the types before anything else.

**A boolean is stored as text.** In the review table, `is_recommended` holds the lowercase text `'true'` and `'false'`, not 1 and 0. Filtering on `is_recommended = 1` matches nothing and returns a count of zero, which reads as a real answer.

**NULLs in the join key.** A `NULL` key never matches anything, including another `NULL`, because `NULL` means unknown rather than empty. Rows with a missing key drop out of an inner join without a word. Count them first with `SELECT COUNT(*) FROM t WHERE key_column IS NULL`.

**Joining many to many.** If both sides hold several rows per key, the output multiplies both ways: three rows on the left and four on the right produce twelve. This is almost never what anyone wants and it is the classic cause of an inflated total. Aggregate one side down to one row per key first, then join.

**The join is slow because one side is huge.** Matching 125,855 rows against 41 million takes real work. An index on the key column of the large table turns a full scan into a lookup: `CREATE INDEX idx_rec_appid ON recommendations(app_id);`. Build it once and every join afterward is quick. [Handling large datasets](https://michaelnocito.github.io/analyst-prep-kit/guides/handle-large-datasets/) covers the rest of working at this size.

**The two tables describe different moments.** My game list and my review list were collected at different times, so some unmatched rows are not data errors, they are calendar. A join makes it trivially easy to combine sources that were never meant to be combined, which is exactly why the write-up has to say where each source came from.

## Why this works

The behaviour above is not an implementation quirk of one database. It falls out of how the relational model defines the operation. Codd's original formulation defines a join as a derived relation, built from the pairs of rows that satisfy the matching condition (Codd, 1970, _Communications of the ACM_ , 13(6), 377–387). Once the result is defined as the set of matching pairs, both behaviours are forced. A row with no partner contributes no pair, and a row with several partners contributes several. Dropping and multiplying are not edge cases sitting on top of joins. They are what a join is.

That is why the two checks in this guide are counts rather than inspections. You are not hunting for a mistake in the query text. You are measuring how many pairs the operation produced, which is the one thing the syntax will never show you.

There is a second reason this page keeps asking you to say things out loud rather than only read them. Learners who explain a worked example to themselves as they go understand it substantially better, and transfer it to new problems better, than learners who read the same example without explaining it (Chi, Bassok, Lewis, Reimann, & Glaser, 1989, _Cognitive Science_ , 13(2), 145–182). Joins are where that pays off most, because the mistake is never in a keyword. It is in what you believe one row means.

## Using this on your own project

Think of a query you have already written and shipped. Can you say, right now, what one row of its result means, and whether that is the same thing one row meant before the join? If that takes more than a few seconds, that query is the one to check first.

Auditing every join in an existing project at once is grim work and you will stop halfway. Do this instead, in order.

  1. **Say the grain of both tables out loud** before you write the join. "One row per customer" and "one row per order." Ten seconds, and it predicts the shape of the result.
  2. **Run the two counts.** Rows in against distinct keys out for the drop check. Total rows against distinct keys for the multiply check. Two queries.
  3. **Write the match rate into the file** as a comment, in the same pass. Not later. Later never happens, and this is the number a reviewer asks about first.
  4. **Check every aggregate against the grain.** Anything from the one side goes in `GROUP BY`. Anything from the many side can be counted or averaged. Go through them one at a time.
  5. **Run the anti-join once** , even when you plan to use an inner join. If the unmatched rows have a pattern, that pattern is a finding about your data, and you would rather learn it now than in a review.

If you are starting fresh rather than auditing, do step one and step two before writing the real query. A join you have already predicted the row count of is a join that cannot surprise you.

If you have paper nearby and a spare five minutes, there is one drawing worth doing, and it is optional. Draw three rows on the left, four on the right, connect them the way the picture at the top does, and count the output rows yourself. It is the concept everything else here rests on, and drawing it from memory is both a retrieval attempt and a check on whether you actually have it.

**More detail on this, and more like it.** Every how-to sits in one place on the [guides index](https://michaelnocito.github.io/analyst-prep-kit/guides/): SQL, Tableau, data migration, and the working habits around them.

## The whole thing on one screen

This is the retrieval sheet. Cover the right column, work down the left, and say each answer out loud before you check it.

| Concept                  | What it does                                                                                                     |
|--------------------------|------------------------------------------------------------------------------------------------------------------|
| The pair rule            | For every left row, find every matching right row, write one output row per pair.                                |
| Grain                    | What one row means. The grain of a join result is usually the many side.                                         |
| Plain `JOIN`             | An `INNER JOIN`. That default causes the silent delete.                                                          |
| `INNER JOIN`             | Only matched pairs. Unmatched rows from both sides are gone.                                                     |
| `LEFT JOIN`              | Every left row kept. Right columns are `NULL` where nothing matched.                                             |
| `RIGHT JOIN`             | Every right row kept. Usually rewritten as a `LEFT JOIN` with the tables swapped.                                |
| `FULL OUTER JOIN`        | Unmatched rows kept from both sides.                                                                             |
| `CROSS JOIN`             | Every left row paired with every right row. No key. 1,000 by 1,000 is a million rows.                            |
| Self join                | A table joined to itself under two aliases. Employees and managers.                                              |
| Anti-join                | `LEFT JOIN` plus `WHERE right.key IS NULL`. Lists the rows that found nothing.                                   |
| The silent delete        | Unmatched rows vanish from an inner join with no error.                                                          |
| Check for it             | Rows in, against `COUNT(DISTINCT key)` out.                                                                      |
| Fan-out                  | One row matching many becomes many rows, repeating the one side's values.                                        |
| Check for it             | `COUNT(*)` against `COUNT(DISTINCT key)` in the joined result.                                                   |
| The aggregate rule       | Many-side columns can be summed or averaged. One-side columns go in `GROUP BY`.                                  |
| `WHERE` against `HAVING` | `WHERE` filters rows before grouping. `HAVING` filters groups after, and is the only one that sees an aggregate. |
| Join returns zero rows   | Usually a type mismatch on the key. Check the stored type on both sides.                                         |
| `NULL` in the key        | Never matches anything, including another `NULL`. Those rows drop out silently.                                  |
| Many-to-many join        | Three left and four right becomes twelve. Aggregate one side to one row per key first.                           |
| Slow join                | The large side is being scanned in full. Index the key column.                                                   |
| Match rate               | The share of your population that survived the join. Write it into the file, every time.                         |

**The one habit to keep.** If you take nothing else from this page, count your rows before and after every join and write the match rate down. Both failures here are invisible in the query text and obvious in the row count. If a join goes wrong in a way this page does not cover, there is a general [diagnosis loop for being stuck](https://michaelnocito.github.io/analyst-prep-kit/guides/technical-tenacity/).

One last thought, and I would genuinely like other people's answers. The 57 games my join dropped turned out to be the most useful thing in the whole analysis, because the reason they were missing was itself the story. What has an anti-join surfaced in your data that you would not have found any other way?

## References

  * Codd, E. F. (1970). A relational model of data for large shared data banks. _Communications of the ACM_ , 13(6), 377–387.
  * Chi, M. T. H., Bassok, M., Lewis, M. W., Reimann, P., & Glaser, R. (1989). Self-explanations: How students study and use examples in learning to solve problems. _Cognitive Science_ , 13(2), 145–182.

---

*The full version of this guide lives on my site: [SQL JOINs: How to Join Two Tables Without Losing or Doubling Rows](https://michaelnocito.github.io/analyst-prep-kit/guides/sql-joins/).*

*If it was useful: [Buy Me a Coffee](https://buymeacoffee.com/michaelnocito).*
