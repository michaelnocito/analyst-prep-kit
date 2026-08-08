By the end of this page you can answer the question that stops most people the first week they write SQL: which row is the best one in each category. You will know `OVER` and `PARTITION BY`, the three ranking functions and how each treats a tie, a running total, and `LAG` for comparing a row to the one before it. It is about twenty-five minutes.

Here is what to actually do with it. The next time you write `GROUP BY genre` and get back a best rating without the name attached to it, stop rewriting the `GROUP BY`. Add `ROW_NUMBER() OVER (PARTITION BY genre ORDER BY rating DESC)` to the plain query instead, then keep the rows numbered 1. That is the whole move, and it replaces a query most people never get working.

The short version: a window function adds a calculated column to each row while leaving every row in place. Grouping collapses rows. A window looks at them.

One idea decides everything else on this page, so it gets the picture. Both halves do the same arithmetic over the same four rows, and only one of them still has four rows at the end.

**The worked example is real.** Every number on this page comes from a published portfolio project: finding the genuinely overlooked games in a Steam catalogue of 125,855, at [Steam Hidden Gems on GitHub](https://github.com/michaelnocito/steam-hidden-gems). The filters leave 175 games. This page starts from that list and asks questions of it that `GROUP BY` cannot answer. If grouping is still new, read [GROUP BY and HAVING](https://michaelnocito.github.io/analyst-prep-kit/guides/sql-window-functions/../sql-group-by-having/) first, because this page is the sequel to it. 

Every query below reads from `gems`, which is that filtered list: at least 2,000 reviews, 95% positive or better, priced at 20 or under, and in one of the four lowest owner tiers. It holds 175 rows.

## 1. What a window function is, in one query

Before the explanation: you write a query over 175 rows and add `COUNT(*) OVER ()` to the select list. How many rows come back?

All 175, each one showing the number 175. That is the whole idea of a window function in one result. It calculated something across the rows without removing any of them.
    
    
    SELECT Name,
           PctPositive,
           COUNT(*) OVER () AS total_gems
    FROM gems;

`OVER` is the word that makes it a window function. It says "run this calculation over a set of rows, and put the answer on every row". The brackets after `OVER` describe which rows. Empty brackets mean all of them.

Compare that to the version without `OVER`. `SELECT COUNT(*) FROM gems` returns one row holding 175, and the names are gone. The word "window" is the picture to hold onto. Each row gets to look out at a set of other rows and report something about them, and looking does not consume anything.

Three parts can go inside the brackets, and you use one, two, or all three.
    
    
    OVER (
        PARTITION BY PrimaryGenre   -- which rows are in this row's window
        ORDER BY PctPositive DESC   -- in what order to consider them
    )                               -- (a frame can narrow it further, section 6)

`PARTITION BY` splits the rows into separate windows, one per value. It is the same idea as `GROUP BY`, with one difference that matters more than any other: it does not collapse anything.

**Every window function is an ordinary function plus`OVER`.** You already know `COUNT`, `SUM`, `AVG`, `MIN` and `MAX`. Add `OVER (...)` and each one stops collapsing rows and starts annotating them. The ranking functions like `ROW_NUMBER` are the only ones that exist purely for windows.

## 2. The top row in each group

Before the explanation: `SELECT PrimaryGenre, MAX(PctPositive) FROM gems GROUP BY PrimaryGenre` gives you the best rating in each genre. What stops you adding `Name` to that select list to see which game it was?

The row is gone. `MAX` returned a number, not a row, and 75 Adventure games went into producing it. There is no single `Name` left for the database to hand you. Most engines reject the query outright, and the ones that allow it return an arbitrary name, which is worse because it looks like an answer.

Window functions solve it in two moves. Number the rows first, then keep the ones numbered 1.
    
    
    WITH ranked AS (
        SELECT Name,
               PrimaryGenre,
               PctPositive,
               TotalReviews,
               ROW_NUMBER() OVER (
                   PARTITION BY PrimaryGenre
                   ORDER BY PctPositive DESC, TotalReviews DESC
               ) AS rn
        FROM gems
    )
    SELECT PrimaryGenre, Name, PctPositive, TotalReviews
    FROM ranked
    WHERE rn = 1
    ORDER BY PctPositive DESC;

Read the `OVER` brackets out loud as a sentence: within each genre, order the games by rating highest first, and number them from one. Every one of the 175 rows gets a number. The best Adventure game is 1, the second best is 2, and the best Action game is also 1, because `PARTITION BY` restarts the counting for every genre.

Here is the actual result.

| Genre      | Best rated game       | Positive | Reviews |
|------------|-----------------------|----------|---------|
| Adventure  | A Castle Full of Cats | 99.4%    | 4,009   |
| Action     | The Upturned          | 99.3%    | 2,364   |
| Casual     | Patrick's Parabox     | 99.2%    | 4,472   |
| Indie      | Felvidek              | 98.6%    | 4,037   |
| RPG        | Path of Achra         | 98.4%    | 2,578   |
| Simulation | Aviassembly           | 97.1%    | 4,112   |

The `WHERE rn = 1` has to sit outside, in a second step, and the reason is worth knowing because it is the most common error people hit here. Window functions run after `WHERE`, so the column `rn` does not exist yet when `WHERE` is evaluated. Writing `WHERE ROW_NUMBER() OVER (...) = 1` is an error in every engine. Wrap the query in a CTE, then filter the CTE. [Named steps](https://michaelnocito.github.io/analyst-prep-kit/guides/sql-window-functions/../sql-ctes/) are how you get a second place to filter from.

Say out loud why `ORDER BY PctPositive DESC LIMIT 1` could not have produced that table, before you read on. The answer is that `LIMIT` cuts the whole result, so it gives you one game overall, not one game per genre. `PARTITION BY` is a `LIMIT` that restarts for every value, and that is the thing plain SQL has no other way to express.

Change one word and the same query answers a different question. `WHERE rn <= 3` gives the top three per genre. This shape, number inside then filter outside, covers most of what people actually need window functions for.

Picture running that on a table you work with. Partition by customer, order by date, and keep `rn = 1`. What did you just build, and how many rows come back?

## 3. Ties, and the three ranking functions

Before the explanation: two Indie games are both rated exactly 96.6%. If you number the rows, which one gets 7 and which gets 8?

Nobody knows, and that is the honest answer rather than a dodge. `ROW_NUMBER` must produce different numbers, so on a tie it picks one arbitrarily. Run it twice and you can get a different winner. That is the first thing to understand about ties, and the reason the other two ranking functions exist.

All three number rows. They differ only in how they handle equal values.
    
    
    SELECT Name,
           PctPositive,
           ROW_NUMBER()  OVER (ORDER BY PctPositive DESC) AS rn,
           RANK()        OVER (ORDER BY PctPositive DESC) AS rk,
           DENSE_RANK()  OVER (ORDER BY PctPositive DESC) AS dr
    FROM gems
    WHERE PrimaryGenre = 'Indie'
    ORDER BY PctPositive DESC;

The interesting part of that result is the four rows around the tie.

| Game                             | Positive | `ROW_NUMBER` | `RANK` | `DENSE_RANK` |
|----------------------------------|----------|--------------|--------|--------------|
| a new life.                      | 96.6%    | 7            | 7      | 7            |
| Cobalt Core                      | 96.6%    | 8            | 7      | 7            |
| fault - milestone two side:above | 96.3%    | 9            | 9      | 8            |
| Later Alligator                  | 96.3%    | 10           | 9      | 8            |

Three behaviours, and the table is the whole explanation. `ROW_NUMBER` never repeats and never skips, so it splits the tie. `RANK` gives tied rows the same number and then skips, which is why 8 is missing. `DENSE_RANK` gives tied rows the same number and does not skip, so it counts distinct values rather than rows.

Choosing between them is not a style question, it depends on what the number is for.

| You want                    | Use          | Because                                                     |
|-----------------------------|--------------|-------------------------------------------------------------|
| Exactly one row per group   | `ROW_NUMBER` | It never repeats, so `rn = 1` returns one row               |
| Everyone who tied for first | `RANK`       | Both tied rows are 1, so `rk = 1` returns both              |
| The top three rating levels | `DENSE_RANK` | It counts values, so `dr <= 3` means three distinct ratings |

One habit removes the arbitrariness from `ROW_NUMBER` for good. Add a tiebreaker to the `ORDER BY`, so the order is fully decided by the data. That is why section 2 used `ORDER BY PctPositive DESC, TotalReviews DESC`. When two games are rated the same, the one with more reviews wins, and the query returns the same answer every time it runs. A query whose result changes between runs is a bug that has not been noticed yet.

## 4. A running total, and a year over year change

Before the explanation: add `ORDER BY ReleaseYear` inside the `OVER` brackets of a `SUM`. Does that change the sum, or only the order it is displayed in?

It changes the sum, and this is the single most surprising thing about windows. With no `ORDER BY`, the window is the whole partition and every row shows the same total. Adding `ORDER BY` makes the window grow as it goes: each row's window is everything up to and including that row. The sum becomes a running total.
    
    
    SELECT ReleaseYear,
           COUNT(*) AS gems_that_year,
           SUM(COUNT(*)) OVER (ORDER BY ReleaseYear) AS running_total,
           COUNT(*) - LAG(COUNT(*)) OVER (ORDER BY ReleaseYear) AS change_vs_prior
    FROM gems
    GROUP BY ReleaseYear
    ORDER BY ReleaseYear;

Here are the last seven years of that result.

| Release year | Gems that year | Running total | Change on prior year |
|--------------|----------------|---------------|----------------------|
| 2019         | 15             | 60            | +1                   |
| 2020         | 26             | 86            | +11                  |
| 2021         | 17             | 103           | -9                   |
| 2022         | 22             | 125           | +5                   |
| 2023         | 16             | 141           | -6                   |
| 2024         | 24             | 165           | +8                   |
| 2025         | 10             | 175           | -14                  |

The running total reaching exactly 175 on the last row is a free check on your own work. If the final value of a running total does not match the plain `COUNT` of the table, the window is not covering what you think it is.

`LAG` is the other function in that query, and it does one small thing. It reaches back to a previous row in the same window and returns a value from it. `LAG(x)` is one row back, `LAG(x, 3)` is three rows back, and `LEAD(x)` reaches forward instead. Subtract and you have a change. The first row has nothing behind it, so `LAG` returns `NULL` there, and the subtraction gives `NULL` rather than zero. Use `LAG(x, 1, 0)` if you want a default instead.

That query also shows something people find odd the first time, and it is legal on purpose. `SUM(COUNT(*))` is an aggregate inside a window function. It works because the two run at different times. `COUNT(*)` collapses the rows into one per year first, and the window function then runs across those yearly rows. You are windowing over the summary, not the raw table.

The 2025 drop of 14 is the kind of number to be careful with, and it is not a trend. The dataset is a snapshot taken partway through 2025, so a partial year is being compared against full ones. A number that has an explanation this ordinary is exactly the number a reader will quote back at you, so write the reason next to it. [Documenting a limitation like that](https://michaelnocito.github.io/analyst-prep-kit/guides/sql-window-functions/../documenting-data-limitations/) is a habit worth more than the query.

## 5. The full before and after

Same question: which game is the best rated in each genre, and how does each genre compare to the rest of the list?

### Before
    
    
    SELECT PrimaryGenre,
           MAX(PctPositive) AS best_rating,
           COUNT(*) AS games
    FROM gems
    GROUP BY PrimaryGenre
    ORDER BY best_rating DESC;

It runs and returns nine rows. It cannot say which game earned any of those ratings, and adding `Name` to the select list either errors or returns a name that belongs to no particular row. Every game's own rating is gone, so nothing can be compared to the genre it came from.

### After
    
    
    -- ============================================================
    -- STEP 7: The best rated game in each genre, in context.
    -- WHY: MAX() gives the best rating but destroys the row it came
    --      from, so the game's name cannot come with it. Numbering
    --      the rows keeps every row and marks the winner instead.
    -- CHECK: rn = 1 must return one row per genre. Nine genres in,
    --      nine rows out. The tiebreaker on TotalReviews makes that
    --      result stable between runs.
    -- ============================================================
    WITH ranked AS (
        --Number the games within each genre, best rated first.
        --  TotalReviews breaks ties so the order is fully decided.
        SELECT Name,
               PrimaryGenre,
               PctPositive,
               TotalReviews,
               ROW_NUMBER() OVER (
                   PARTITION BY PrimaryGenre
                   ORDER BY PctPositive DESC, TotalReviews DESC
               ) AS rn,
               --How many gems the genre has, on every row of it
               COUNT(*) OVER (PARTITION BY PrimaryGenre) AS genre_size,
               --The genre's average, sitting next to the game's own
               AVG(PctPositive) OVER (PARTITION BY PrimaryGenre) AS genre_avg
        FROM gems
    )
    --Keep the winner of each genre. The context columns came along.
    SELECT PrimaryGenre,
           Name,
           PctPositive,
           genre_size,
           ROUND(genre_avg, 1) AS genre_avg
    FROM ranked
    WHERE rn = 1
    ORDER BY PctPositive DESC;

Three window functions share one partition, and none of them cost an extra pass over the table or an extra join. The name survives, the game's own rating survives, and the comparison to its genre arrives on the same row. Adventure holds 75 of the 175 games and Simulation holds 2, which changes how much any of those genre winners is worth. The comment format is the one from [how to comment SQL so it teaches](https://michaelnocito.github.io/analyst-prep-kit/guides/sql-window-functions/../sql-teaching-comments/).

## 6. Edge cases and the honest limits

Before the explanation: your running total is correct on every row except where two rows share the same date, and there it jumps to the final value early. What did the window include that you did not expect?

Six things worth knowing.

**Ties in the`ORDER BY` pull future rows into the window.** This is the answer to the prequestion, and it is the subtlest bug on this page. By default a window with `ORDER BY` covers everything from the start of the partition through the last row that ties with the current one. Two rows on the same date therefore both show the total including both. Fixing it is one line: `ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW` counts rows rather than tied values. That line is called a frame, and it is the third part of the `OVER` brackets.

**You cannot filter on a window function in`WHERE`.** Windows are calculated after `WHERE` and after `GROUP BY`, so the column does not exist yet. Wrap it in a CTE and filter outside. The error message usually names the function rather than explaining the order, which is why this one costs people an hour.

**`PARTITION BY` is not `GROUP BY`, and mixing them up shows.** Grouping changes how many rows you get back. Partitioning never does. If your row count changed, a `GROUP BY` did it.

**`NULL` in the `ORDER BY` sorts differently by engine.** PostgreSQL puts `NULL` last on an ascending sort, SQLite and MySQL put it first. If a partition can contain `NULL` in the column you rank on, say what you want with `NULLS FIRST` or `NULLS LAST` where your engine supports it, rather than accepting the default and being surprised on the next engine.

**A window cannot see rows that`WHERE` already removed.** Filter to one genre and a `COUNT(*) OVER ()` counts only that genre. That is usually what you want. When it is not, do the windowing first in a CTE, then filter.

**The list itself has a data limitation the ranking will show you.** Portal 2 sits in this list with 155,440 reviews and an owners estimate of 0 to 20,000, which cannot be true. The owner tiers come from an estimate, and it is wrong for some older popular titles. Ranking makes that kind of error easy to spot, because an implausible row rises to the top of its partition where you cannot miss it. Sorting your data is one of the cheapest ways to find out that it is dirty.

## Why this works

The reason a window function can do something no arrangement of `GROUP BY` can is structural rather than a matter of convenience. Grouping is defined to return one row per group, so the individual rows have no representation in the result at all, and any value belonging to a single row is unrecoverable from it. Codd's relational model is built on operations that take relations and return relations, which is what makes results feedable into further operations without limit (Codd, 1970, _Communications of the ACM_ , 13(6), 377–387). Grouping is one of those operations, and it is lossy by design. A window function is the operation that annotates instead of reducing, which is why both exist rather than one being a better version of the other.

The efficiency is not incidental either. Section 5 asks for a ranking, a count and an average over the same partition, and a database can answer all three in a single pass over sorted data. Leis, Kundhikanjana, Kemper and Neumann set out how engines evaluate window functions by sorting once per distinct partition and ordering specification, then sweeping the rows to produce every function that shares it (Leis, Kundhikanjana, Kemper, & Neumann, 2015, _Proceedings of the VLDB Endowment_ , 8(10), 1058–1069). The practical consequence is worth remembering: reusing the same `OVER` clause is close to free, while a fourth window with a different `PARTITION BY` can mean another sort. Writing the same brackets three times is the cheap version, not the lazy one.

There is also a reason this page keeps asking you a question before answering it. Learners who are prompted to explain a worked example to themselves as they read understand it better, and transfer it to new problems better, than learners who read the same example straight through (Chi, Bassok, Lewis, Reimann, & Glaser, 1989, _Cognitive Science_ , 13(2), 145–182). The prequestions are there to make you commit to an answer, because a wrong prediction you noticed is worth more than a correct sentence you read.

## Using this on your own project

Think of a query where you wanted the best, latest or first row in each category and gave up on it. That is the one to rewrite, and it will take about five minutes now.

Do it in this order.

  1. **Write the plain query first** , with no window at all. Get the rows you care about on screen, one per thing.
  2. **Say the window out loud before typing it.** "Within each genre, ordered by rating, highest first." Those words are the `OVER` brackets, in order.
  3. **Add the window function and look at all the rows.** Do not filter yet. Check that the numbering restarts where you expect, because a missing `PARTITION BY` looks fine until you notice the numbers only reach 1 once.
  4. **Add a tiebreaker to the`ORDER BY`** so two runs cannot disagree. Any column with distinct values will do.
  5. **Wrap it in a CTE and filter outside.** `WHERE rn = 1` lives in the outer query, always.
  6. **Count the result against the number of groups.** Nine genres should give nine rows. This one check catches almost every mistake on this page.

If you have paper nearby and five spare minutes, there is one drawing worth doing, and it is optional. Write out eight rows of your own data, draw a bracket around each partition, and hand number them the way you expect the query to. Then run it and compare. The rows where your number and the query's number disagree are the rows that teach you what the `ORDER BY` is really doing.

**More detail on this, and more like it.** Every how-to sits in one place on the [guides index](https://michaelnocito.github.io/analyst-prep-kit/guides/sql-window-functions/../): SQL, Tableau, data migration, and the working habits around them.

## The whole thing on one screen

This is the retrieval sheet. Cover the right column, work down the left, and say each answer out loud before you check it.

| Concept                  | What it does                                                                                |
|--------------------------|---------------------------------------------------------------------------------------------|
| Window function          | Calculates across a set of rows and puts the answer on every row. Removes none of them.     |
| `OVER (...)`             | The word that makes any function a window function. The brackets say which rows.            |
| `OVER ()`                | Empty brackets. The window is every row in the result.                                      |
| `PARTITION BY`           | Splits rows into separate windows, one per value. Never changes the row count.              |
| `ORDER BY` inside `OVER` | Makes the window grow row by row. This is what turns `SUM` into a running total.            |
| `ROW_NUMBER()`           | 1, 2, 3 with no repeats and no gaps. Splits ties arbitrarily.                               |
| `RANK()`                 | Ties share a number, then it skips. 1, 1, 3.                                                |
| `DENSE_RANK()`           | Ties share a number, no skipping. 1, 1, 2. Counts distinct values.                          |
| Top row per group        | Number with `ROW_NUMBER` in a CTE, then `WHERE rn = 1` outside.                             |
| Top three per group      | The same query with `WHERE rn <= 3`.                                                        |
| Running total            | `SUM(x) OVER (ORDER BY date)`. Its last value must equal the plain total.                   |
| `LAG(x)` and `LEAD(x)`   | A value from the previous or next row of the window. `NULL` at the edges.                   |
| Year over year           | `x - LAG(x) OVER (ORDER BY year)`.                                                          |
| Frame                    | `ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW`. Counts rows, so ties stop leaking in.   |
| Filtering a window       | Impossible in `WHERE`. Windows run after it. Use a CTE.                                     |
| Stability                | Always add a tiebreaker to the `ORDER BY`, or two runs can disagree.                        |
| Cost                     | Reusing one `OVER` clause is nearly free. A different `PARTITION BY` can mean another sort. |

**The one habit to keep.** If you take nothing else from this page, count the result of a top-per-group query against the number of groups before you believe it. Nine genres, nine rows. A missing `PARTITION BY` and a tie that returned two winners both show up in that one number, and neither one raises an error. If a query breaks in a way this page does not cover, there is a general [diagnosis loop for being stuck](https://michaelnocito.github.io/analyst-prep-kit/guides/sql-window-functions/../technical-tenacity/).

One last thought, and I would genuinely like other people's answers. The tiebreaker is the part of this I got wrong for a long time. My top-per-genre query looked finished and gave a slightly different winner on a rerun, and I blamed the data before I understood that `ROW_NUMBER` had simply been free to choose. Has an unstable query ever shipped on you, and what tipped you off?

## References

  * Codd, E. F. (1970). A relational model of data for large shared data banks. _Communications of the ACM_ , 13(6), 377–387.
  * Leis, V., Kundhikanjana, K., Kemper, A., & Neumann, T. (2015). Efficient processing of window functions in analytical SQL queries. _Proceedings of the VLDB Endowment_ , 8(10), 1058–1069.
  * Chi, M. T. H., Bassok, M., Lewis, M. W., Reimann, P., & Glaser, R. (1989). Self-explanations: How students study and use examples in learning to solve problems. _Cognitive Science_ , 13(2), 145–182.

---

*The full version of this guide lives on my site: [SQL Window Functions: How to Get the Top Row Per Group](https://michaelnocito.github.io/analyst-prep-kit/guides/sql-window-functions/).*

*If it was useful: [Buy Me a Coffee](https://buymeacoffee.com/michaelnocito).*
