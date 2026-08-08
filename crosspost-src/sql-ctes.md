By the end of this page you can take a question that needs four decisions and write it as four named steps, each one testable on its own. You will know the `WITH` syntax, how to stack one step on the next, how to check a step's row count before you build on it, and when a CTE is the wrong tool. It is about twenty-five minutes.

Here is what to actually do with it. Next time a query gets long enough that you have to scroll to understand it, stop and give its first step a name. Then run that step alone and look at the row count. Almost every query that produced a wrong number would have been caught right there.

The short version: a CTE is a named temporary result you define before the main query. It turns one query you cannot check into several you can.

One idea decides everything else here, so it gets the picture. Each named step takes the previous step's rows and narrows them, and every arrow has a row count you can read.

**The worked example is real.** Every number on this page comes from a published portfolio project: finding the genuinely overlooked games in a catalogue of 82,956, at [Steam Hidden Gems on GitHub](https://github.com/michaelnocito/steam-hidden-gems). The steps below are the actual definition that produced the 175-game list. If `GROUP BY` is new, read [GROUP BY and HAVING](https://michaelnocito.github.io/analyst-prep-kit/guides/sql-ctes/../sql-group-by-having/) first, because step three here depends on it.

## 1. What a CTE is, in one query

Before the explanation: you write `WITH rated AS (...)` at the top of a query. Is `rated` a real table that now exists in your database, and would a colleague be able to query it tomorrow?

CTE stands for common table expression. Ignore the name. It is a way to say "first work this out and call it X", and then use X in the query below as though it were a table.
    
    
    WITH rated AS (
        SELECT *
        FROM games
        WHERE TotalReviews >= 500
    )
    SELECT COUNT(*) FROM rated;

That returns 10,507. The `WITH` block defines a step and names it. The `SELECT` underneath uses that name. Nothing was created and nothing was saved, which is the answer to the prequestion: `rated` exists only while this one query runs, and a colleague tomorrow would find nothing.

That temporariness is the point. You get the readability of a saved table with none of the cleanup, permissions or staleness that a real table brings.

Two rules of syntax cover almost everything. Each named step is wrapped in brackets after `AS`. Multiple steps are separated by commas, and the word `WITH` appears only once, at the very top.

**A CTE is a name for a step, not a performance feature.** Most databases run the same work either way. What you gain is a query you can read, test in pieces, and hand to someone else.

## 2. Stacking steps, and checking each one

Before the explanation: your query has three stacked steps and the final answer is wrong. How many queries do you have to run to find out which step broke it?

One per step, and that is the whole argument for writing it this way. A later step can refer to any earlier one, so the steps form a chain.
    
    
    WITH rated AS (
        SELECT * FROM games WHERE TotalReviews >= 500
    ),
    well_liked AS (
        SELECT * FROM rated WHERE PctPositive >= 90
    )
    SELECT COUNT(*) FROM well_liked;

Note that `well_liked` reads from `rated`, not from `games`. Each step narrows the one before it. The count comes back 3,454.

Now the habit that makes this worth doing. To test any step, change nothing except the final line.
    
    
    -- Same CTEs above, then one of:
    SELECT COUNT(*) FROM rated;       -- 10,507
    SELECT COUNT(*) FROM well_liked;  -- 3,454
    SELECT * FROM well_liked LIMIT 5; -- eyeball actual rows

Four counts down the chain tell you where a number went wrong, and they take seconds. A step that drops from 10,507 to 12 is a broken filter, and you find it at the step rather than at the end.

Say out loud why testing the third step of a deeply nested subquery is harder than this, before you read on. The answer is that a nested step has no name, so there is nothing to put after `FROM`. You have to cut the inner query out, paste it somewhere else, and hope you grabbed matching brackets. That friction is why people skip the check.

## 3. The real four-step example

Before the explanation: "an overlooked game" is not a column in any dataset. How many separate decisions do you think it takes to turn that phrase into rows?

Four, and naming them is most of the analysis. Here is the actual definition.
    
    
    WITH rated AS (
        -- Step 1: enough reviews that the rating means something
        SELECT * FROM games WHERE TotalReviews >= 500
    ),
    well_liked AS (
        -- Step 2: players actually rate it highly
        SELECT * FROM rated WHERE PctPositive >= 90
    ),
    overlooked AS (
        -- Step 3: not many people own it
        SELECT * FROM well_liked WHERE EstOwnersMid <= 50000
    ),
    genre_avg AS (
        -- Step 4: what "highly rated" means in its own genre
        SELECT PrimaryGenre, AVG(PctPositive) AS genre_rating
        FROM rated
        GROUP BY PrimaryGenre
        HAVING COUNT(*) >= 100
    )
    SELECT o.Name,
           o.PrimaryGenre,
           o.PctPositive,
           ROUND(g.genre_rating, 1) AS genre_avg
    FROM overlooked AS o
    JOIN genre_avg AS g ON o.PrimaryGenre = g.PrimaryGenre
    ORDER BY o.PctPositive DESC;

The counts down the chain are 82,956, then 10,507, then 3,454, then 663. Each drop is a decision someone can argue with, which is the right kind of argument to be able to have.

Step four is doing something different from the first three, and it is worth noticing. It does not narrow the rows. It calculates a genre average from the `rated` step, and then the final query joins it back on. A CTE used this way is a lookup table you build on the spot. That pattern, calculate a summary then join it back to the detail, is one of the most useful things CTEs do.

The results say something the raw ranking could not. Kabuto Park sits at 99.9% positive in Casual, a genre averaging 84.6%. The Werecleaner is at 99.4% in Action, where the average is 80.9%. Both were invisible in a plain top-rated list, because a plain list is full of games with forty reviews.

Picture running that chain against a table you actually work with. What would your four steps be, and which of them would you expect to be the one someone argues about?

## 4. A CTE against a subquery, same answer

Before the explanation: both versions below return identical rows. If the database does the same work either way, does the choice matter at all?

Here is the nested version of just the first two steps.
    
    
    SELECT COUNT(*)
    FROM (
        SELECT * FROM (
            SELECT * FROM games WHERE TotalReviews >= 500
        ) WHERE PctPositive >= 90
    );

Same 3,454. It is correct, and the criticism is not that it is bad style. It is that you read it inside out, from the middle brackets to the edges, which is the opposite of the order the work happens in. Nothing has a name, so nothing can be tested without surgery.

The choice matters for the person reading it in three months, which is usually you. That is the entire argument, and it is enough.

| Situation                                       | Reach for                     |
|-------------------------------------------------|-------------------------------|
| Two or more steps stacked on each other         | A CTE per step                |
| A summary you need to join back to the detail   | A CTE                         |
| A step you want to run and count on its own     | A CTE                         |
| One small condition inside a `WHERE`            | A subquery, inline            |
| A step used in many different queries over time | A view, saved in the database |

That last row is the honest boundary. A CTE vanishes when the query ends. If three people need the same step next week, it belongs in a view or a table, not copied into three files.

## 5. The full before and after

Same question: which highly rated games have very few owners, relative to their own genre?

### Before
    
    
    SELECT Name, PrimaryGenre, PctPositive
    FROM games
    WHERE TotalReviews >= 500
      AND PctPositive >= 90
      AND EstOwnersMid <= 50000
    ORDER BY PctPositive DESC;

It runs and returns 663 rows. Three problems, none of which produce an error. The three thresholds sit in one clause with no stated reason, so nobody can tell which was the judgement call. There is no way to see how many rows each condition removed. And it cannot answer the actual question, because comparing a game to its own genre needs an average that this query never calculates.

### After
    
    
    -- ============================================================
    -- STEP 5: Which well-rated games are overlooked in their genre?
    -- WHY: A plain top-rated list is dominated by games with forty
    --      reviews. Each step below removes one specific problem,
    --      and each has a row count you can check on its own.
    -- COUNTS: 82,956 all games, 10,507 rated, 3,454 well liked,
    --      663 overlooked. Change a threshold and rerun the counts.
    -- ============================================================
    WITH rated AS (
        --Games with enough reviews for the rating to be stable
        SELECT * FROM games WHERE TotalReviews >= 500
    ),
    well_liked AS (
        --Of those, the ones players rate 90% positive or better
        SELECT * FROM rated WHERE PctPositive >= 90
    ),
    overlooked AS (
        --Of those, the ones hardly anyone owns
        SELECT * FROM well_liked WHERE EstOwnersMid <= 50000
    ),
    genre_avg AS (
        --Separately: the average rating within each genre,
        --  built from rated so it is not skewed by tiny samples
        SELECT PrimaryGenre, AVG(PctPositive) AS genre_rating
        FROM rated
        GROUP BY PrimaryGenre
        HAVING COUNT(*) >= 100
    )
    --Finally: the overlooked games, each shown next to its genre average
    SELECT o.Name,
           o.PrimaryGenre,
           o.PctPositive,
           ROUND(g.genre_rating, 1) AS genre_avg
    FROM overlooked AS o
    JOIN genre_avg AS g ON o.PrimaryGenre = g.PrimaryGenre
    ORDER BY o.PctPositive DESC;

Every threshold now sits next to the reason for it. Every step can be counted. The genre comparison the question actually asked for is present. The comment format is the one from [how to comment SQL so it teaches](https://michaelnocito.github.io/analyst-prep-kit/guides/sql-ctes/../sql-teaching-comments/).

## 6. Edge cases and the honest limits

Before the explanation: you split a slow query into six tidy CTEs and it gets slower. What could naming a step possibly have to do with speed?

Six things worth knowing.

**Some databases treat a CTE as a fence.** This is the answer to the prequestion. PostgreSQL before version 12 materialised every CTE, meaning it calculated each one fully instead of folding it into the wider plan, so a filter in the final query could not push down into the step above. Modern PostgreSQL inlines them by default, and you can force either behaviour with `AS MATERIALIZED` or `AS NOT MATERIALIZED`. If a rewrite got slower, that is the first thing to look at.

**A CTE referenced twice may be computed twice.** Where CTEs are inlined, using the same step in two places can run it twice. Usually irrelevant. On a step that scans forty million rows, not irrelevant. [Handling large datasets](https://michaelnocito.github.io/analyst-prep-kit/guides/sql-ctes/../handle-large-datasets/) covers working at that size.

**Only one`WITH`, and commas between steps.** Writing `WITH` again before the second step is the most common syntax error here, and the message rarely points at the real line.

**A trailing comma before the final`SELECT` breaks it.** The last CTE has no comma after its closing bracket. This bites every time you reorder steps.

**Naming a step after a real table shadows it.** If you write `WITH games AS (...)`, every mention of `games` below now means your step, not the table. Occasionally deliberate. More often an afternoon lost.

**Recursive CTEs are a different tool wearing the same word.** `WITH RECURSIVE` lets a step refer to itself, which is how you walk a hierarchy such as an employee reporting chain or a folder tree. It shares the syntax and almost nothing else, and it is worth learning separately once ordinary CTEs feel automatic.

## Why this works

The readability gain is not a matter of taste, and the reason is about the reader rather than the database. Working memory holds only a few items at once, so comprehension collapses when a reader has to keep several unresolved pieces in mind at the same time. Sweller's work on cognitive load shows that material forcing you to hold and integrate separated elements imposes a load that is unrelated to the actual difficulty of the idea, and that removing that split improves both understanding and transfer (Sweller, 1988, _Cognitive Science_ , 12(2), 257–285). A nested subquery is exactly that structure. You hold three open brackets in mind while hunting for the innermost one. Naming the step replaces the held item with a word, and the load goes away.

The testability gain comes from something simpler. Each named step is a relation in its own right, so the same operations apply to it as to any table, including `COUNT`. That closure is built into the relational model rather than added by CTE syntax: every operation returns a relation, so results can be fed into further operations without limit (Codd, 1970, _Communications of the ACM_ , 13(6), 377–387). A CTE only gives that property a name you can type.

There is a second reason this page keeps asking you to answer before it explains. Learners who are asked to explain a worked example to themselves as they go understand it better, and apply it to new problems better, than learners who read the same example straight through (Chi, Bassok, Lewis, Reimann, & Glaser, 1989, _Cognitive Science_ , 13(2), 145–182).

## Using this on your own project

Think of the longest query you have written. Could you say what its middle does without reading the whole thing? If not, that is the one to split first.

Converting a whole project of queries at once is grim and you will stop halfway. Do this instead, in order.

  1. **Write the steps in English first** , before any SQL. "Enough reviews, then well rated, then few owners." If you cannot list the steps, the query is not ready to write.
  2. **Give each step the name you just said.** `rated` and `well_liked` beat `cte1` and `t2`, which are names that carry nothing.
  3. **Count every step as you add it.** Add the CTE, run `SELECT COUNT(*)` against it, look at the number, then write the next step. Catching a bad filter here costs seconds.
  4. **Write the counts into the file** as a comment. Anyone rerunning it later can tell immediately whether the data has shifted underneath them.
  5. **Promote a step to a view** the moment a second query needs it. Copying a CTE between files is how two definitions of the same thing start to drift.

If you have paper nearby and five spare minutes, there is one drawing worth doing, and it is optional. Draw four boxes shrinking left to right, write your own project's step names under them, and put the row count you expect inside each. Then run the counts and compare. Where your guess was furthest off is where your data is not what you think it is.

**More detail on this, and more like it.** Every how-to sits in one place on the [guides index](https://michaelnocito.github.io/analyst-prep-kit/guides/sql-ctes/../): SQL, Tableau, data migration, and the working habits around them.

## The whole thing on one screen

This is the retrieval sheet. Cover the right column, work down the left, and say each answer out loud before you check it.

| Concept               | What it does                                                                   |
|-----------------------|--------------------------------------------------------------------------------|
| CTE                   | A named temporary result, defined before the main query and gone after it.     |
| `WITH name AS (...)`  | The whole syntax. `WITH` appears once, at the top.                             |
| Several steps         | Separated by commas. No comma before the final `SELECT`.                       |
| Stacking              | A later step selects from an earlier one, forming a chain.                     |
| Testing a step        | Change only the last line to `SELECT COUNT(*) FROM step`.                      |
| Summary and join back | Build an average in a CTE, then join it to the detail rows.                    |
| Against a subquery    | Same result. The CTE reads top to bottom and can be tested.                    |
| Against a view        | A view persists for everyone. A CTE lives for one query.                       |
| Performance           | Usually the same plan. Older PostgreSQL fenced CTEs, which can slow a rewrite. |
| `AS MATERIALIZED`     | Forces the step to be computed once and held, in PostgreSQL 12 and later.      |
| Shadowing             | Naming a CTE after a real table hides that table for the rest of the query.    |
| `WITH RECURSIVE`      | A step that refers to itself. For hierarchies. A separate topic.               |
| Naming                | Say the step in English, then use those words. Not `cte1`.                     |
| The habit             | Count every step as you add it, before writing the next one.                   |

**The one habit to keep.** If you take nothing else from this page, run `SELECT COUNT(*)` on each step as you write it. The chain is only worth building because you can check it halfway, and the check takes seconds. If a query breaks in a way this page does not cover, there is a general [diagnosis loop for being stuck](https://michaelnocito.github.io/analyst-prep-kit/guides/sql-ctes/../technical-tenacity/).

One last thought, and I would genuinely like other people's answers. Splitting my query into named steps changed the analysis, not just the formatting: once `rated` had a name, it was obvious that the genre average should be built from it rather than from the whole catalogue, and that one choice moved the results. Has naming a step ever changed what you decided to calculate?

## References

  * Codd, E. F. (1970). A relational model of data for large shared data banks. _Communications of the ACM_ , 13(6), 377–387.
  * Sweller, J. (1988). Cognitive load during problem solving: Effects on learning. _Cognitive Science_ , 12(2), 257–285.
  * Chi, M. T. H., Bassok, M., Lewis, M. W., Reimann, P., & Glaser, R. (1989). Self-explanations: How students study and use examples in learning to solve problems. _Cognitive Science_ , 13(2), 145–182.

---

*The full version of this guide lives on my site: [SQL CTEs: How to Build a Query in Steps You Can Check](https://michaelnocito.github.io/analyst-prep-kit/guides/sql-ctes/).*

*If it was useful: [Buy Me a Coffee](https://buymeacoffee.com/michaelnocito).*
