CASE is SQL's if/else. It is how you clean messy values, sort numbers into bands, build flags, and count several things in one query.

This guide covers the whole of it. How CASE decides. Both forms of the syntax. The two rules that break a CASE with no error message at all, one about order and one about NULL. Everywhere in a query a CASE is allowed to go. And how a real cleaning rule gets built, on real data, mistakes included.

## What CASE is and how it decides

CASE produces **one value per row** by checking a list of tests top to bottom:
    
    
    CASE
      WHEN <test 1> THEN <value 1>
      WHEN <test 2> THEN <value 2>
      ELSE <fallback value>
    END

The **first test that passes wins**. Its THEN value becomes the result, and every test below it is skipped. If nothing passes, you get the ELSE value. If there is no ELSE, you get NULL.

This stacked shape has a name. Officially it is a **searched CASE expression**. Analysts usually call it a **CASE ladder** , because each WHEN/THEN pair is a rung. If you know another language, it is an if / else-if / else chain.

**It is an expression, not a command.** CASE produces a value, the same way a column does. So it can go anywhere a column can go. In a SELECT, to compute a new column. In a WHERE, to filter on the computed value. In an ORDER BY, for a custom sort. Inside `CREATE TABLE … AS`, to save the value into a table. Or inside SUM and COUNT, which is the conditional aggregation below.

## The rule that matters: order is logic

Work out the consequence before you read it. If the first matching rung wins, and two rungs could both match the same row, what does that make the order of the rungs? Answer that and you have the rule.

The first matching rung wins, so **the order of the rungs changes the answer**. Two rungs can both be correct on their own and still produce a wrong result together. That happens when the general rung sits above the specific one. Which gives you the rule:

**Specific patterns go above the general patterns they contain.**

That is abstract until you watch it go wrong on real data:

## A real example: cleaning Billboard artist credits

The Billboard Hot 100's public chart history (a free CSV, back to 1958) prints artist credits like this:
    
    
    2 Chainz Featuring Drake
    Elvis Presley With The Jordanaires
    2Pac Duet With Mopreme
    Patti Austin A Duet With James Ingram

To analyze by artist you need the _primary_ artist, which is the text before the joiner word. The joiner word is whatever links the two names: "Featuring", "With", "Duet With". A CASE ladder makes the cut. The first attempt knew two joiners:
    
    
    CASE
      WHEN INSTR(performer, ' Featuring ') > 0
        THEN SUBSTR(performer, 1, INSTR(performer, ' Featuring ') - 1)
      WHEN INSTR(performer, ' With ') > 0
        THEN SUBSTR(performer, 1, INSTR(performer, ' With ') - 1)
      ELSE performer
    END

`INSTR` finds where a piece of text appears. `SUBSTR` cuts out everything before it.

Previewing the rule on real rows caught a defect straight away. **"2Pac Duet With Mopreme" came out as "2Pac Duet"**. That credit joins with " Duet With ", but the ladder only knew " With ". So it cut in the wrong place and invented an artist who does not exist.

The fix is to add a `' Duet With '` rung _above_ `' With '`. Then re-check the exact rows the fix was meant to catch. That turned up one more: **"Patti Austin A Duet With James Ingram" came out as "Patti Austin A"**. That credit says " A Duet With ", not " Duet With ". So it needs one more rung, one level more specific, placed one rung higher. The finished ladder:
    
    
    CASE
      WHEN INSTR(performer, ' A Duet With ') > 0
        THEN SUBSTR(performer, 1, INSTR(performer, ' A Duet With ') - 1)
      WHEN INSTR(performer, ' Duet With ') > 0
        THEN SUBSTR(performer, 1, INSTR(performer, ' Duet With ') - 1)
      WHEN INSTR(performer, ' Featuring ') > 0
        THEN SUBSTR(performer, 1, INSTR(performer, ' Featuring ') - 1)
      WHEN INSTR(performer, ' With ') > 0
        THEN SUBSTR(performer, 1, INSTR(performer, ' With ') - 1)
      ELSE performer
    END AS primary_artist

Read it top to bottom. Each rung is more general than the one above it, so the specific cases get caught before a general rung can mangle them. On the full dataset this ladder merged 11,275 raw credit strings into 8,896 clean primary artists.

## The second form: CASE with the column at the top

Everything above uses the stacked form, where each WHEN carries its own full test. There is a second, shorter form for the common case where every test compares the _same_ column against a different value. Lift the column out and put it directly after CASE:
    
    
    CASE status
      WHEN 'active'  THEN 'yes'
      WHEN 'churned' THEN 'no'
      ELSE 'unknown'
    END

That is the same as writing `WHEN status = 'active'` on every line, with less repetition. Officially it is a **simple CASE expression**. The stacked one used earlier is a **searched CASE expression**. Those two names come up in documentation constantly, and that is the only difference between them.

The short form only does equality. The moment you need `>`, `<`, `LIKE`, `IS NULL`, or two different columns in one test, you have to go back to the stacked form. Which is why most analyst SQL uses the stacked form for everything: it covers both jobs, and you never have to convert a CASE halfway through writing it.

## The NULL trap, which produces no error at all

Before the answer: a column has some empty values in it. You write `WHEN score = NULL THEN 'missing'`. How many rows do you think come back marked missing?

None. Not one, ever, on any database. And nothing warns you.

NULL in SQL does not mean empty. It means _unknown_. So `score = NULL` is not asking "is this blank", it is asking "does this unknown value equal this other unknown value", and the honest answer to that is neither yes nor no. The test never comes back true, the rung never fires, and every row falls through to your ELSE. On a table where a third of the rows are blank, the output looks completely reasonable and is quietly wrong for all of them.
    
    
    -- Never marks anything. Every row falls to the ELSE.
    CASE WHEN score = NULL THEN 'missing' ELSE 'has a score' END
    
    -- Correct. IS NULL is the test that works on unknowns.
    CASE WHEN score IS NULL THEN 'missing' ELSE 'has a score' END

The same applies to the short form. `CASE score WHEN NULL THEN …` is equality underneath, so it fails in exactly the same silent way. A NULL check always has to be written as its own `WHEN … IS NULL` rung in the stacked form.

There is a second, smaller NULL behaviour worth knowing, and it is the useful one. **If no rung matches and you wrote no ELSE, the result is NULL.** That is why conditional counting works without an ELSE at all: `COUNT(CASE WHEN status = 'active' THEN 1 END)` counts the matches, because COUNT skips NULLs and the non-matches all became NULL.

**Put the NULL rung first.** If a column can be blank, make `WHEN <column> IS NULL` the top rung of the ladder. It is the most specific case there is, so by the ordering rule above it belongs at the top, and putting it there means you never have to wonder afterwards which bucket the blanks landed in.

## Where a CASE is allowed to go

CASE produces a value, so it goes anywhere a column can go. That is more places than most people use it, and each one solves a different problem.

| Place                   | What it does there                                        | Example                                                                     |
|-------------------------|-----------------------------------------------------------|-----------------------------------------------------------------------------|
| `SELECT`                | Builds a new column                                       | `CASE WHEN score > 50 THEN 'high' ELSE 'low' END AS band`                   |
| `WHERE`                 | Filters on a computed value                               | `WHERE CASE WHEN score IS NULL THEN 0 ELSE score END > 50`                  |
| `ORDER BY`              | Sorts in an order that is not alphabetical or numeric     | `ORDER BY CASE status WHEN 'urgent' THEN 1 WHEN 'normal' THEN 2 ELSE 3 END` |
| `GROUP BY`              | Groups by a band you invented rather than a stored column | `GROUP BY CASE WHEN score >= 50 THEN 'high' ELSE 'low' END`                 |
| Inside `SUM` or `COUNT` | Counts several different things in one pass               | See conditional aggregation below                                           |
| `UPDATE … SET`          | Writes a different value per row in one statement         | `SET band = CASE WHEN score > 50 THEN 'high' ELSE 'low' END`                |

The custom sort in ORDER BY is the one people miss. Any time you want statuses to come out in a business order rather than alphabetical order, that is a CASE, and there is no other clean way to do it.

**One portability note.** Whether you can reuse the CASE's alias later in the same query, as in `WHERE band = 'high'`, depends on the database. Some allow it and some reject it. The version that works everywhere is to repeat the whole expression, or to compute it once in a [CTE](https://michaelnocito.github.io/analyst-prep-kit/guides/sql-case-expression/../sql-ctes/) and filter the CTE. The CTE is the readable option and it is what most analysts settle on.

## The four jobs analysts use CASE for

### 1. Cleaning and normalizing

Mapping messy source values onto clean ones, which is the Billboard ladder above. Any dataset where one real thing appears under several spellings needs a ladder like it.

### 2. Bucketing

Turning a continuous number into named bands:
    
    
    CASE
      WHEN age < 18 THEN 'minor'
      WHEN age < 65 THEN 'adult'
      ELSE 'senior'
    END AS age_band

Revenue tiers, engagement bands and rating groups are all this shape. Notice that order matters here too. `age < 65` would also match a 10-year-old. The more specific `age < 18` sits above it, so it catches them first.

### 3. Flags

A yes/no column worked out from a test, like `CASE WHEN peak_position <= 10 THEN 1 ELSE 0 END AS top10_hit`. A flag makes later filtering, joining and counting simple.

### 4. Conditional aggregation (the pivot trick)

CASE inside SUM or COUNT counts different things in one pass over the table:
    
    
    SELECT
      SUM(CASE WHEN genre = 'Country' THEN 1 ELSE 0 END) AS country_songs,
      SUM(CASE WHEN genre = 'Pop'     THEN 1 ELSE 0 END) AS pop_songs
    FROM songs;

One query, several counts side by side. This is the workhorse behind summary tables and dashboard tiles.

## How to build a CASE rule that's actually correct

Now take a messy column from your own work and picture the ladder for it. What is the first rung, and what falls through to the bottom? The rows that fall through are the ones this method is really about.

| Step        | What you do                                                                                                          |
|-------------|----------------------------------------------------------------------------------------------------------------------|
| 1. Draft   | Write the ladder you believe in.                                                                                     |
| 2. Preview | Run it on real rows BEFORE building anything from it: original value and computed value side by side, and read them. |
| 3. Fix     | When a wrong output appears, add the missing rung above the general rung that mis-handled it.                        |
| 4. Confirm | Re-check the exact rows the fix targets, not just a random sample.                                                   |
| 5. Iterate | Repeat until the exceptions stop appearing. That is genuinely how normalization rules get built in practice.         |

## Cheat sheet

| You want to                          | Write                                                                                                                                | Watch for                                            |
|--------------------------------------|--------------------------------------------------------------------------------------------------------------------------------------|------------------------------------------------------|
| Test different things per rung       | `CASE WHEN a > 1 THEN … WHEN b = 'x' THEN … END`                                                                                     | The first match wins, so order is logic              |
| Compare one column to several values | `CASE status WHEN 'a' THEN … WHEN 'b' THEN … END`                                                                                    | Equality only, no `>` or `LIKE`                      |
| Catch blank values                   | `WHEN col IS NULL THEN …`                                                                                                            | `= NULL` never matches and never errors              |
| Give everything else one value       | `ELSE 'other'`                                                                                                                       | No ELSE means unmatched rows come out NULL           |
| Sort by a business order             | `ORDER BY CASE status WHEN 'urgent' THEN 1 … END`                                                                                    | The numbers are just sort keys, not output           |
| Count two things in one query        | `SUM(CASE WHEN … THEN 1 ELSE 0 END)`                                                                                                 | Use `COUNT(CASE WHEN … THEN 1 END)` to skip the ELSE |
| Reuse the computed column later      | Compute it in a [CTE](https://michaelnocito.github.io/analyst-prep-kit/guides/sql-case-expression/../sql-ctes/), then filter the CTE | Reusing the alias in WHERE is not portable           |
| Put specific above general           | `' A Duet With '` above `' Duet With '` above `' With '`                                                                             | A general rung on top swallows the specific ones     |

## The one habit to keep

Never ship a CASE you have not previewed side by side with the original column. Every defect in this guide, including the artist who does not exist, was found by putting the input and the output next to each other and reading twenty rows. Nothing else catches a ladder that is wrong but not broken.

Which column in your own data would you least like to discover had been quietly bucketed wrong for a month?

**More detail on this, and more like it.** Every how-to sits in one place on the [guides index](https://michaelnocito.github.io/analyst-prep-kit/guides/sql-case-expression/../): SQL, Tableau, data migration, and the working habits around them. If you are still choosing where to run your queries, start with [which SQL database to install](https://michaelnocito.github.io/analyst-prep-kit/guides/sql-case-expression/../which-sql-database-to-install/).

---

*The full version of this guide lives on my site: [The SQL CASE Expression, Explained for Beginners](https://michaelnocito.github.io/analyst-prep-kit/guides/sql-case-expression/).*

*If it was useful: [Buy Me a Coffee](https://buymeacoffee.com/michaelnocito).*
