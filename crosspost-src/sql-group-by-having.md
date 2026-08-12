By the end of this page you can write a summary query and know its answer is real. You will know exactly what `GROUP BY` does to your rows, which columns you are allowed to select afterwards and why, where `WHERE` goes, where `HAVING` goes, and why swapping them is the difference between a finding and a number that means nothing. It is about twenty-five minutes.

Here is what to actually do with it. On the next summary query you write, add one line setting a minimum group size before you read the ranking. One line, and it removes the most common way a summary query produces a confident wrong answer.

The short version: `WHERE` filters rows before grouping. `HAVING` filters groups after. Without a `HAVING` floor, tiny groups float to the top of every ranking.

One idea decides everything else here, so it gets the picture. Grouping happens in the middle of the query, and the two filters sit on opposite sides of it.

> _The original carries a diagram here. In words: A left-to-right pipeline in four stages. Stage one is a column of eight individual row boxes. Stage two is a gate labelled WHERE, through which six rows pass and two are crossed out and stopped. Stage three shows the surviving six rows collapsing into three group boxes, one holding three rows, one holding two rows, and one holding a single row. Stage four is a second gate labelled HAVING, through which the group of three and the group of two pass, while the group holding only one row is crossed out and stopped. The result at the far right is two groups. The picture shows that WHERE acts on individual rows before any grouping exists, and HAVING acts on whole groups after they have been formed, which is why the two filters cannot be swapped._

**The worked example is real.** Every number on this page comes from a published portfolio project: 82,956 games from the Steam catalogue, with review counts, ratings and genres. The queries run against the full dataset at [Steam Hidden Gems on GitHub](https://github.com/michaelnocito/steam-hidden-gems). If `SELECT` and `WHERE` are also new, start with [SQL foundations](https://michaelnocito.github.io/analyst-prep-kit/guides/sql-foundations/) and come back.

## 1. What GROUP BY actually does to your rows

Before the explanation: your table has 82,956 rows. You group it by genre and get 28 rows back. Where did the other 82,928 rows go, and can you still see any of them?

Here is the rule. `GROUP BY` sorts every row into a bucket, then replaces each bucket with exactly one output row. Nothing is deleted. The rows are still in there, collapsed. What changes is what one row of your result means.

That last sentence is the whole idea. Before grouping, one row was one game. After grouping by genre, one row is one genre. The word for this is **grain** , and saying the new grain out loud before you write anything else prevents most of the mistakes on this page.

An aggregate function is how you get a value back out of a collapsed bucket. `COUNT(*)` asks how many rows are in this bucket. `AVG(PctPositive)` asks for the mean of that column across the bucket. `SUM`, `MIN` and `MAX` work the same way. Each one takes many values and returns one, which is exactly what a single output row needs.
    
    
    SELECT PrimaryGenre,
           COUNT(*) AS games,
           ROUND(AVG(PctPositive), 1) AS avg_rating
    FROM games
    GROUP BY PrimaryGenre;

That returns 28 rows, one per genre. Action has 35,149 games and averages 75.4% positive. Adventure has 17,486 and averages 77.7%. The 82,956 original rows are all still accounted for, because every game landed in exactly one bucket.

**Name the new grain before you write the aggregate.** "One row per genre" tells you immediately that a game's individual rating is no longer available, and that anything you select has to be true of the whole genre.

## 2. Which columns you can select, and the rule behind it

Before the explanation: you group by genre and also select the game's name. The database either errors or hands you one name out of 35,149. Which name should it give you?

There is no sensible answer, which is why the rule exists. After grouping, every column in your `SELECT` must be one of two things.

  * **A column you grouped by.** It is safe because every row in the bucket has the same value for it. All 35,149 Action games have the genre Action.
  * **An aggregate.** It is safe because it turns the whole bucket into one value on purpose.

Anything else is a column with 35,149 different values and one slot to put them in. Most databases refuse. PostgreSQL and SQL Server raise an error naming the column. SQLite and older MySQL settings do something worse: they pick a value arbitrarily and return it without comment, so you get a real-looking name attached to a genre-wide average.
    
    
    -- Errors on PostgreSQL, returns a misleading row on SQLite
    SELECT PrimaryGenre, Name, AVG(PctPositive)
    FROM games
    GROUP BY PrimaryGenre;

Say why that query has no correct answer, in your own words, before reading on. If you can state the reason, the error message will never confuse you again.

The reason is that `Name` is at the wrong grain. It describes one game, and the row now describes a genre. When you genuinely want the top name per group, that is a different tool, and it is the subject of [window functions](https://michaelnocito.github.io/analyst-prep-kit/guides/sql-window-functions/).

Grouping by more than one column works the same way, with a finer bucket. `GROUP BY PrimaryGenre, ReleaseYear` makes one row per genre per year, and both of those columns are then safe to select.

## 3. WHERE against HAVING, and why the order is forced

Before the explanation: you want genres whose average rating is above 80. You try putting that condition in `WHERE` and the database refuses. Why can it not simply work it out?

Because when `WHERE` runs, the average does not exist yet. This is not a style preference. It is the order the database evaluates the clauses in, and that order is fixed.

| Order | Clause     | What it can see                           |
|-------|------------|-------------------------------------------|
| 1     | `FROM`     | The tables                                |
| 2     | `WHERE`    | Individual rows. No aggregates exist yet. |
| 3     | `GROUP BY` | Sorts surviving rows into buckets         |
| 4     | `HAVING`   | Whole groups, and their aggregates        |
| 5     | `SELECT`   | Builds the output row per group           |
| 6     | `ORDER BY` | Sorts the finished output                 |

So `WHERE COUNT(*) >= 500` is asking step two for a number that step four invents. The error is the database telling you the truth about its own sequence.

The practical version is short. If your condition is about one row, it goes in `WHERE`. If it is about a whole group, it goes in `HAVING`.
    
    
    SELECT PrimaryGenre,
           COUNT(*) AS games,
           ROUND(AVG(PctPositive), 1) AS avg_rating
    FROM games
    WHERE TotalReviews >= 500        -- about one game
    GROUP BY PrimaryGenre
    HAVING COUNT(*) >= 500           -- about a whole genre
    ORDER BY avg_rating DESC;

Both filters in one query, and they are doing different jobs. The `WHERE` line says a game needs enough reviews for its own rating to mean anything, which drops the catalogue from 82,956 games to 10,507. The `HAVING` line says a genre needs enough games for its average to mean anything.

**Prefer WHERE when you have the choice.** Filtering early means fewer rows to sort into buckets, so the query is faster. Use `HAVING` for the conditions that genuinely cannot be checked until the group exists.

## 4. The small-group problem, and the line that fixes it

Before the explanation: which genre in a catalogue of 82,956 games do you think has the highest average rating? Commit to a guess before you read the answer.

It is Accounting, at 79.5% positive. Ahead of Adventure, ahead of RPG, ahead of everything. The query is correct, the data is real, and the answer is worthless, because there are eleven accounting games in the entire catalogue.

Here is the ranking without a floor.
    
    
    SELECT PrimaryGenre,
           COUNT(*) AS games,
           ROUND(AVG(PctPositive), 1) AS avg_rating
    FROM games
    GROUP BY PrimaryGenre
    ORDER BY avg_rating DESC;

| Genre            | Games  | Average rating |
|------------------|--------|----------------|
| Accounting       | 11     | 79.5           |
| Game Development | 7      | 79.1           |
| Adventure        | 17,486 | 77.7           |
| Photo Editing    | 21     | 77.2           |
| Casual           | 15,007 | 76.9           |

Three of the top five are categories with fewer than 25 items. This is not bad luck. It is arithmetic: a mean over eleven values moves freely, and a mean over seventeen thousand barely moves at all. So the extremes of any ranking fill up with the smallest groups every time, in both directions.

One line fixes it.
    
    
    SELECT PrimaryGenre,
           COUNT(*) AS games,
           ROUND(AVG(PctPositive), 1) AS avg_rating
    FROM games
    GROUP BY PrimaryGenre
    HAVING COUNT(*) >= 500
    ORDER BY avg_rating DESC;

| Genre     | Games  | Average rating |
|-----------|--------|----------------|
| Adventure | 17,486 | 77.7           |
| Casual    | 15,007 | 76.9           |
| RPG       | 1,326  | 76.2           |
| Strategy  | 1,227  | 75.8           |
| Indie     | 7,982  | 75.6           |
| Action    | 35,149 | 75.4           |

That floor removed 20 of the 28 genres and produced the first ranking anyone could act on. The spread also collapsed, from a top of 79.5 down to 77.7, which is the honest picture: genres are much more alike than the first table suggested.

The number 500 is a judgement, not a fact, and it has to be defensible. Pick it from the data rather than from taste, write down why, and check whether the ranking survives a different choice. [Choosing thresholds from the data](https://michaelnocito.github.io/analyst-prep-kit/guides/data-driven-thresholds/) covers how to do that honestly.

Now picture the last summary query you shipped. If you added `HAVING COUNT(*) >= 30` to it, would the top of the result change? That is the hinge of this guide, and for most real reports the answer is yes.

## 5. The full before and after

Same table, same question: which genres do players rate highest?

### Before
    
    
    SELECT PrimaryGenre, AVG(PctPositive) AS avg_rating
    FROM games
    GROUP BY PrimaryGenre
    ORDER BY avg_rating DESC;

Three problems, none of which produce an error. Games with three reviews count the same as games with thirty thousand. Genres with eleven games count the same as genres with thirty-five thousand. And the reader cannot see either problem, because the group sizes are not on the screen.

### After
    
    
    -- ============================================================
    -- STEP 3: Which genres do players actually rate highest?
    -- WHY: A rating is only meaningful if enough people gave one,
    --      and a genre average is only meaningful if the genre has
    --      enough games. Both floors are here for that reason.
    -- COVERAGE: 10,507 of 82,956 games have 500+ reviews. Eight of
    --      28 genres clear the 500-game floor. The other 20 are
    --      reported separately, not silently dropped.
    -- ============================================================
    --SELECT the genre, how many games are behind the number,
    --   and their average positive rating:
    --   COUNT(*)          = games in this genre that passed WHERE
    --   AVG(PctPositive)  = mean positive rating across them
    --FROM the full game catalogue
    --WHERE the game itself has at least 500 reviews
    --GROUP BY genre, so each genre collapses to one row
    --HAVING at least 500 such games, so the average is stable
    --ORDER BY average rating, highest first
    SELECT PrimaryGenre,
           COUNT(*) AS games,
           ROUND(AVG(PctPositive), 1) AS avg_rating
    FROM games
    WHERE TotalReviews >= 500
    GROUP BY PrimaryGenre
    HAVING COUNT(*) >= 500
    ORDER BY avg_rating DESC;

The group size is now a visible column, so a reader can judge the average for themselves. Both floors are stated with a reason. The coverage line names what was excluded. The comment format is the one from [how to comment SQL so it teaches](https://michaelnocito.github.io/analyst-prep-kit/guides/sql-teaching-comments/).

## 6. Edge cases that break summary queries in real data

Before the explanation: a genre you know exists is missing from your grouped result entirely. Not zero. Absent. What would you check first?

Six things that each cost someone an afternoon.

**A`WHERE` filter emptied the group.** This is the answer to the prequestion. Grouping can only produce a bucket for rows that survived `WHERE`. If every game in a genre had fewer than 500 reviews, that genre has no rows to collapse and no output row at all. A group that should read zero is instead invisible, which is a different and more misleading thing.

**`COUNT(*)` and `COUNT(column)` are not the same.** `COUNT(*)` counts rows. `COUNT(column)` counts rows where that column is not `NULL`. On a column with missing values they return different numbers, and only one of them answers your question. [COUNT in SQL](https://michaelnocito.github.io/analyst-prep-kit/guides/sql-count-function/) goes through the whole family.

**`NULL` becomes its own group.** Rows with a missing genre collapse into a single bucket that usually prints as blank. It looks like a formatting glitch and it is really a count of your missing data, which is worth reading rather than hiding.

**Aggregates skip`NULL`, and that moves your average.** `AVG` divides by the number of non-null values, not by the number of rows. So an average over a column that is 30% empty is an average of the 70% who answered, which is a genuinely different claim.

**You cannot use a`SELECT` alias in `HAVING` everywhere.** `HAVING avg_rating > 80` works in MySQL and SQLite and fails in PostgreSQL and SQL Server, because `SELECT` runs after `HAVING`. Repeating the full `AVG(PctPositive) > 80` works everywhere.

**Grouping after a join counts duplicates.** If a join multiplied your rows, `COUNT(*)` now counts pairs rather than things. `COUNT(DISTINCT id)` is usually what you meant. This is the most common wrong number in real reporting, and [SQL joins](https://michaelnocito.github.io/analyst-prep-kit/guides/sql-joins/) covers why it happens.

## Why this works

The clause order is not a convention that a database chose. Grouping is defined as a partition of the rows into disjoint sets, and an aggregate is a function from a set to a single value. Codd's relational model defines operations that way, over relations rather than over individual records (Codd, 1970, _Communications of the ACM_ , 13(6), 377–387). Once grouping is a partition, a filter on a group cannot possibly run before the partition exists, and a column at row grain cannot survive into a row that represents a set. Both rules on this page fall out of that, rather than being bolted on.

The small-group problem is older than SQL and it is not really a query bug. Any ranking of averages puts the smallest samples at both extremes, because the variance of a mean falls as the sample grows. Gelman and Price show that this makes maps and league tables of rates systematically misleading, and that no simple ranking of estimates escapes it (Gelman & Price, 1999, _Statistics in Medicine_ , 18(23), 3221–3234). The eleven accounting games are that exact effect. A `HAVING` floor is the blunt fix, and it is the right one for a report.

There is a second reason this page keeps asking you to guess before it answers. Being asked a question before you have been given the answer improves memory for that specific information, even when the guess is wrong, and the effect is reliable across a large body of studies (Bisra, Liu, Nesbit, Salimi, & Winne, 2018, _Educational Psychology Review_ , 30(3), 703–725). Guessing which genre ranked highest is why the answer sticks.

## Using this on your own project

Think of a summary you have already sent to someone. Can you say how many records sit behind its top row? If you cannot, that is the one to check first.

Auditing every grouped query at once is miserable work and you will stop halfway. Do this instead, in order.

  1. **Say the new grain out loud** before you write the query. "One row per genre." Five seconds, and it tells you which columns are legal.
  2. **Put`COUNT(*)` in every grouped query**, even when nobody asked for it. It is the column that lets a reader judge the rest, and it costs nothing.
  3. **Add a`HAVING` floor before you read the ranking**, not after. Reading the unfiltered version first anchors you to an answer you will not want to give up.
  4. **Write the floor and its reason into the file** as a comment, in the same pass. This is the first number a reviewer questions.
  5. **Check every non-aggregate column** against the `GROUP BY` list. If a column is in neither place, your database may be quietly choosing a value for you.

If you have paper nearby and five spare minutes, there is one drawing worth doing, and it is optional. Draw eight rows, cross two out, collapse the remaining six into three buckets, then cross out the bucket holding one row. Label the two crossings-out yourself. Redrawing that from memory is both a retrieval attempt and a check on whether you have it.

**More detail on this, and more like it.** Every how-to sits in one place on the [guides index](https://michaelnocito.github.io/analyst-prep-kit/guides/): SQL, Tableau, data migration, and the working habits around them.

## The whole thing on one screen

This is the retrieval sheet. Cover the right column, work down the left, and say each answer out loud before you check it.

| Concept                    | What it does                                                                          |
|----------------------------|---------------------------------------------------------------------------------------|
| `GROUP BY`                 | Sorts rows into buckets, then returns one row per bucket.                             |
| Grain after grouping       | One row per group, not one row per record. Say it out loud.                           |
| Legal columns              | Only grouped columns and aggregates. Everything else is at the wrong grain.           |
| `COUNT(*)`                 | Rows in the bucket, including rows with nulls.                                        |
| `COUNT(col)`               | Rows where that column is not null. Often a different number.                         |
| `COUNT(DISTINCT col)`      | Distinct values. What you usually want after a join.                                  |
| `AVG`, `SUM`, `MIN`, `MAX` | Many values to one value. All of them skip nulls.                                     |
| `WHERE`                    | Filters individual rows, before any group exists.                                     |
| `HAVING`                   | Filters whole groups, after they are formed. The only one that sees an aggregate.     |
| Clause order               | FROM, WHERE, GROUP BY, HAVING, SELECT, ORDER BY.                                      |
| Why they cannot swap       | The aggregate does not exist when `WHERE` runs.                                       |
| Alias in `HAVING`          | Works in MySQL and SQLite, fails in PostgreSQL and SQL Server. Repeat the expression. |
| The small-group problem    | Tiny groups fill both ends of every ranking of averages.                              |
| The fix                    | A `HAVING COUNT(*)` floor, chosen from the data and written down.                     |
| Missing group              | Every one of its rows was removed by `WHERE`, so no bucket formed.                    |
| `NULL` group               | Collapses into one blank-looking bucket. It is a count of your missing data.          |
| Grouping after a join      | `COUNT(*)` counts pairs, not things. Use `COUNT(DISTINCT id)`.                        |

**The one habit to keep.** If you take nothing else from this page, put `COUNT(*)` in every grouped query and set a floor before you read the ranking. The wrong answer here never looks wrong. It looks like a result. If a summary query breaks in a way this page does not cover, there is a general [diagnosis loop for being stuck](https://michaelnocito.github.io/analyst-prep-kit/guides/technical-tenacity/).

One last thought, and I would genuinely like other people's answers. My eleven accounting games were obviously silly once I saw the count, but I only saw the count because I had put it in the query. What is the smallest group that has ever topped one of your charts, and how long did it take you to notice?

## References

  * Codd, E. F. (1970). A relational model of data for large shared data banks. _Communications of the ACM_ , 13(6), 377–387.
  * Gelman, A., & Price, P. N. (1999). All maps of parameter estimates are misleading. _Statistics in Medicine_ , 18(23), 3221–3234.
  * Bisra, K., Liu, Q., Nesbit, J. C., Salimi, F., & Winne, P. H. (2018). Inducing self-explanation: A meta-analysis. _Educational Psychology Review_ , 30(3), 703–725.

---

*The full version of this guide lives on my site: [GROUP BY and HAVING: How to Summarize Rows Without Getting a Fake Answer](https://michaelnocito.github.io/analyst-prep-kit/guides/sql-group-by-having/).*

*If it was useful: [Buy Me a Coffee](https://buymeacoffee.com/michaelnocito).*
