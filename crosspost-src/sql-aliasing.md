After this page you can read any query out loud and know what every name in it refers to. You will also name things the way a reviewer expects. That is most of what makes a query look like the work of someone who does this for a living.

Here is what you do. Give every calculated column a name with `AS`. Give every table a one-letter nickname once a query touches two of them. Then put that nickname in front of each column, so a reader never has to guess which table a column came from. Three habits, and they take about a minute to learn.

**The short version.** An alias is a name you invent. `AS` on a column changes the label on the output and nothing else. A nickname on a table lets you say which table a column belongs to.

## What a column alias changes

Before the answer: if you write `SELECT title AS gem FROM gem_page`, has anything in the `gem_page` table changed?

No. Nothing in the stored table moves. An alias is a label on the result you are handed back, and the result is a temporary thing that stops existing when you close the window. The column in the database is still called `title` tomorrow.

The word **alias** means an extra name for something that already exists. That is the whole idea, and it is why the same word covers columns and tables. Here is the column version:
    
    
    SELECT title AS gem
    FROM gem_page;

The result comes back with a column header that reads `gem` instead of `title`. Same values, same row count, different label. If you export that result to a spreadsheet, the spreadsheet's header row says `gem`, because the header row is exactly the thing the alias set.

That is the entire effect of a column alias. It renames the output. It does not rename the column, it does not filter, it does not change a single value.

## Why an unnamed calculated column is a defect

A calculated column is one the database works out on the spot rather than reading from disk. It has no name of its own, because nothing in the table is called that. So the database invents a header for you, and what it invents is not usable.
    
    
    SELECT title,
           ROUND(CAST(up AS REAL) / (up + down) * 100, 1)
    FROM gem_page;

SQLite hands that back with a column header of `ROUND(CAST(up AS REAL) / (up + down) * 100, 1)`. The header is the entire expression, punctuation and all. PostgreSQL takes a different route and heads it `round`, after the outermost function. Neither is a name anybody can use.

That matters for three concrete reasons, and every one of them shows up in a real report:

  * **You cannot sort by it.** `ORDER BY` needs something to refer to, and a punctuation-heavy expression is not it. You end up retyping the whole calculation in the `ORDER BY` line.
  * **Two calculations collide.** Add a second `ROUND` to the same query in PostgreSQL and you have two columns both headed `round`. Whatever reads that result next has to guess which is which.
  * **The export is unreadable.** The header row of the CSV you send a stakeholder contains a SQL expression. That is the version of your work they see.

The fix is one word plus a name you choose:
    
    
    SELECT title,
           ROUND(CAST(up AS REAL) / (up + down) * 100, 1) AS pct_positive
    FROM gem_page
    ORDER BY pct_positive DESC;

Now the header says `pct_positive`, the sort line refers to it by that name, and the spreadsheet you hand over reads like something a person wrote.

**The rule.** Every calculated column gets a name. If the database had to invent the header, the query is not finished.

## Table aliases, and the ambiguity they fix

Before the answer: two tables both have a column called `id`. You join them and ask for `id`. What should the database do?

It refuses, and it is right to. Say your two tables are `gem_page`, one row per music gem, and `gem_vote`, one row per reader vote. Both carry a column named `id`. This query has no answer:
    
    
    SELECT id, title
    FROM gem_page
    JOIN gem_vote ON gem_page.id = gem_vote.page_id;
    
    
    Error: ambiguous column name: id

Ambiguous means the database found the name in more than one place and will not choose for you. The way you answer it is to say which table you meant, by putting the table's name in front of the column with a dot between them. That is a **prefix**.
    
    
    SELECT gem_page.id, gem_page.title
    FROM gem_page
    JOIN gem_vote ON gem_page.id = gem_vote.page_id;

That works, and it gets long fast. A table alias is a short nickname you give the table once, at the point you name it, and then use everywhere else:
    
    
    SELECT g.id, g.title, v.voter
    FROM gem_page AS g
    JOIN gem_vote AS v ON g.id = v.page_id;

`FROM gem_page AS g` says: for the rest of this query, `g` means the `gem_page` table. From that point on `g.title` is the title column of `gem_page`, and `v.voter` is the voter column of `gem_vote`. Two letters replaced twenty.

Say why that is worth doing before reading on. It is not really about typing less. The reason is that a reader can now answer "which table is this column from?" for every column in the query, without scrolling and without knowing the schema. In a three-table query that question comes up on every line.

**Once a table has an alias, the alias is its only name.** After `FROM gem_page AS g`, writing `gem_page.title` lower down is an error in PostgreSQL and MySQL. The nickname replaces the name for the length of the query. Pick it, then use it everywhere.

## The scope rule: ORDER BY yes, WHERE no

This is the part that produces a real error message on a query that looks correct. It is worth the two minutes.
    
    
    SELECT title,
           up + down AS total_votes
    FROM gem_page
    WHERE total_votes > 10;
    
    
    ERROR:  column "total_votes" does not exist

The name is right there, four lines up. PostgreSQL says it does not exist. MySQL says `Unknown column 'total_votes' in 'where clause'`. Both are telling you the truth, and the reason is about order.

A database does not run a query top to bottom the way you read it. It runs the clauses in a fixed order of its own, and `SELECT` comes late in that order:

So the rule falls out on its own. `WHERE` runs before `SELECT`, so when the filter is being applied the name `total_votes` has not been invented yet. `ORDER BY` runs after `SELECT`, so by then the name exists and you can sort by it:
    
    
    SELECT title,
           up + down AS total_votes
    FROM gem_page
    WHERE up + down > 10
    ORDER BY total_votes DESC;

In `WHERE` you repeat the calculation. In `ORDER BY` you use the name. The same reasoning covers `GROUP BY` and `HAVING`, which also run before `SELECT`, so repeat the expression there too and you will be right in every database.

**One thing that will mislead you locally.** SQLite is more relaxed than the standard and does accept an alias in `WHERE`. If you practise on a SQLite file, a query can work on your laptop and fail on the PostgreSQL or MySQL database at work. Write the expression out in `WHERE` and the query runs everywhere.

## How to read each shape out loud

Reading a query aloud is the fastest way to find out whether you actually follow it. These are the literal sentences. Say them exactly, including the boring parts.

| What you see                             | What you say                                                                          |
|------------------------------------------|---------------------------------------------------------------------------------------|
| `SELECT title AS gem`                    | select title, and call it gem in the output                                           |
| `ROUND(AVG(score), 1) AS avg_score`      | the average score, rounded to one decimal place, called avg_score                     |
| `FROM gem_page AS g`                     | from the gem_page table, which I will call g for the rest of this query               |
| `g.artist`                               | the artist column of gem_page                                                         |
| `JOIN gem_vote AS v ON g.id = v.page_id` | bring in gem_vote, call it v, and match where gem_page's id equals gem_vote's page_id |
| `ORDER BY avg_score DESC`                | sort by the column I named avg_score, largest first                                   |

Two of those sentences are doing the work. "which I will call g for the rest of this query" is the one that makes a table alias stop being mysterious. "the artist column of gem_page" is the one that turns a dot into everyday speech.

Now picture running this on a table of your own, one you have actually opened. Say the two sentences for its name and one of its columns out loud. What does the header row of the result look like?
    
    
    SELECT g.artist,
           COUNT(v.id) AS vote_count,
           ROUND(AVG(v.score), 1) AS avg_score
    FROM gem_page AS g
    JOIN gem_vote AS v ON g.id = v.page_id
    GROUP BY g.artist
    ORDER BY avg_score DESC;

Out loud, start to finish: select the artist column of gem_page, a count of gem_vote's id rows called vote_count, and the average score rounded to one decimal called avg_score. From the gem_page table, which I will call g. Bring in gem_vote, call it v, matching where g's id equals v's page_id. Group by the artist column of gem_page. Sort by the column I named avg_score, largest first.

That is a sentence. Nothing in it stops parsing, and none of it needed you to know the schema in advance.

## When to alias and when to leave a name alone

Aliasing everything is its own kind of unreadable. Four working rules cover almost every query you will write.

## One table: no table alias needed

With a single table in the query, no column can be ambiguous, so a prefix carries no information. `SELECT title, up FROM gem_page` is finished. Adding `g.` to it is noise.

## Two or more tables: alias every one of them, with single letters

Once a second table joins in, alias both and prefix every column, including the ones that are not ambiguous yet. Use the first letter of the table: `g` for `gem_page`, `v` for `gem_vote`. Two tables that start with the same letter get two letters, such as `gp` and `gv`. Prefix even the columns that are safe today. A column that is unique now stops being unique the moment someone adds a third table. Then the query breaks in a way nobody planned for.

## Calculated columns: meaningful names, not letters

A table alias is short on purpose, because it repeats on every line. A column alias goes in the header a stakeholder reads, so it gets a real name. `pct_positive`, `vote_count`, `avg_score`. Lowercase with underscores, no spaces, and it says what the number is. `a`, `col1` and `x` are the same defect as no name at all.

## Never rename a plain column just to rename it

If the column is already called `artist`, leave it called `artist`. Writing `artist AS artist_name` gains nothing and costs something real. The name in your query no longer matches the name in the table. Anyone tracing a number back through your work now has to translate. Rename a plain column only when the output genuinely needs a different word, for example when a report has to say `region` and the table calls it `terr_cd`.

## AS is optional and you should still type it

Every example on this page works without the word `AS`. These two lines do the same thing, and so do these two:
    
    
    SELECT title AS gem FROM gem_page AS g;
    SELECT title    gem FROM gem_page    g;

You will meet the second style constantly, because a lot of production SQL leaves `AS` out. Read it as if the word were there. Type it anyway, for a reason that is not style.

Leaving `AS` out makes one mistake invisible. Drop a comma in a `SELECT` list and the two columns silently become one column with an alias:
    
    
    SELECT title, artist year
    FROM gem_page;

You meant three columns. You get two: `title`, and the `artist` column labelled `year`. No error, and a header that reads `year` above text values. With `AS` in your habits, the missing comma reads wrong on sight. This is the same class of failure as the joins that [drop or duplicate rows](https://michaelnocito.github.io/analyst-prep-kit/guides/sql-joins/) without erroring, and it gets caught the same way, by making the intent explicit.

One place `AS` is not optional: naming a table in PostgreSQL sometimes needs it, and a name that would otherwise be read as a keyword always does. Typing it every time removes the question.

## The full before and after

Same tables, same question, both versions run. The difference is whether a person can read the result.

### Before
    
    
    SELECT gem_page.artist,
           COUNT(gem_vote.id),
           ROUND(AVG(gem_vote.score), 1)
    FROM gem_page
    JOIN gem_vote ON gem_page.id = gem_vote.page_id
    GROUP BY gem_page.artist
    ORDER BY ROUND(AVG(gem_vote.score), 1) DESC;

Two of the three columns come back with headers nobody can use, so the `ORDER BY` has to repeat the whole calculation. Every line carries a full table name. The query is correct and tiring.

### After
    
    
    SELECT g.artist,
           COUNT(v.id) AS vote_count,
           ROUND(AVG(v.score), 1) AS avg_score
    FROM gem_page AS g
    JOIN gem_vote AS v ON g.id = v.page_id
    GROUP BY g.artist
    HAVING COUNT(v.id) >= 10
    ORDER BY avg_score DESC;

Three named columns, two nicknamed tables, and a sort line that refers to a name instead of repeating a calculation. Note that `HAVING` still spells out `COUNT(v.id)`, because `HAVING` runs before `SELECT` and the name does not exist yet. The comment block that belongs above a query like this is in [How to Comment SQL So It Teaches](https://michaelnocito.github.io/analyst-prep-kit/guides/sql-teaching-comments/).

## Where this came from and why it works

The idea is older than SQL. In the relational model that databases are built on, renaming is one of the basic operations you may perform on a table. It sits alongside selecting rows and picking columns (Codd, 1970, _Communications of the ACM_ , 13(6), 377–387). Being able to give something a second name is part of the theory, not a convenience someone bolted on later.

The specific syntax comes from SEQUEL, the language IBM built in 1974 that became SQL. Donald Chamberlin and Raymond Boyce designed it to be readable by people who were not programmers. The table nickname was there in the first paper (Chamberlin & Boyce, 1974, _Proceedings of the 1974 ACM SIGFIDET Workshop_ , 249–264). They called it a _correlation name_ , and you will still see that phrase in database documentation today. It means exactly what this page calls a table alias.

The reason naming helps a reader is better understood than it used to be. Learners who explain a worked example to themselves as they go understand it substantially better. They also transfer it better than learners who read the same example without explaining it (Chi, Bassok, Lewis, Reimann & Glaser, 1989, _Cognitive Science_ , 13(2), 145–182). A query full of named columns and prefixed tables is a query you can explain to yourself while reading. One without them makes you hold the schema in your head at the same time, which is the working memory you needed for the actual question.

That is also why "I know what my own columns mean" is not a reason to skip the names. The reader who is short of working memory is you, six months from now, opening a file you do not remember writing.

## Using this on your own queries

Bring to mind a query you have already written and shared. Can you say, out loud, what each of its output columns is called and why? If a header on it reads `round` or `COUNT(*)`, that is the one to fix first.

Going through a whole project in one sitting is miserable and you will stop halfway. Do this instead, in order:

  1. **Name every calculated column, in the file you have open right now.** Search for `ROUND`, `SUM`, `COUNT` and `AVG`, and check each one has an `AS` after it. This is ten minutes and it is most of the benefit.
  2. **Alias the tables in any query that touches two of them.** First letter of each table, prefix on every column. Do the multi-table queries only. Single-table queries are already fine.
  3. **Read one query out loud** , using the sentences in the table above. The line where you hesitate is the line whose names are not carrying their weight.
  4. **Move calculations out of`ORDER BY`.** Anywhere the sort line repeats an expression from `SELECT`, replace it with the alias. The query gets shorter and there is now one place to change the calculation instead of two.
  5. **Leave the plain columns alone.** Resist the urge to rename `artist` to `artist_name` while you are in there. Renaming for its own sake is work that makes the file harder to trace.

If you have paper nearby, this one is worth drawing once. Write out a query, then draw an arrow from every alias to the thing it names. The arrows that are hard to draw are the names that are not pulling their weight.

**More detail on this, and more like it.** Every how-to sits in one place on the [guides index](https://michaelnocito.github.io/analyst-prep-kit/guides/): SQL, Tableau, data migration, and the working habits around them.

## A cheat sheet

| Shape                           | What it does                                         | Say it as                                  |
|---------------------------------|------------------------------------------------------|--------------------------------------------|
| `col AS name`                   | Sets the output header. Changes nothing else         | select col, and call it name in the output |
| `CALC(...) AS name`             | Gives a calculated column a usable header            | the calculation, called name               |
| `FROM table AS t`               | Nicknames the table for this query only              | from table, which I will call t            |
| `t.col`                         | Says which table the column came from                | the col column of table                    |
| Alias in `ORDER BY`             | Works. ORDER BY runs after SELECT                    | sort by the column I named                 |
| Alias in `WHERE`                | Fails in PostgreSQL and MySQL. Repeat the expression | filter on the calculation itself           |
| Alias in `GROUP BY` or `HAVING` | Both run before SELECT. Repeat the expression        | group on the calculation itself            |
| No alias on a calculation       | The header becomes the expression, or `round`        | a header nobody can use                    |
| `AS` left out                   | Legal and common. Read it as if it were there        | same sentence, one word quieter            |

**The one habit to keep.** If you take nothing else from this page, put a name on every calculated column. It is one word, it decides what the header of your export says, and it is the difference between a result someone can use and a result they have to decode.

One last thing, and I would like other people's answers. The habit I picked up latest was prefixing columns that were not ambiguous yet, because it felt like clutter until a third table arrived and proved it was not. What is the naming habit you resisted longest before it earned its place?

## References

  * Codd, E. F. (1970). A relational model of data for large shared data banks. _Communications of the ACM_ , 13(6), 377–387.
  * Chamberlin, D. D., & Boyce, R. F. (1974). SEQUEL: A structured English query language. _Proceedings of the 1974 ACM SIGFIDET Workshop on Data Description, Access and Control_ , 249–264.
  * Chi, M. T. H., Bassok, M., Lewis, M. W., Reimann, P., & Glaser, R. (1989). Self-explanations: How students study and use examples in learning to solve problems. _Cognitive Science_ , 13(2), 145–182.

---

*The full version of this guide lives on my site: [SQL Aliases: How to Read a Query Out Loud](https://michaelnocito.github.io/analyst-prep-kit/guides/sql-aliasing/).*

*If it was useful: [Buy Me a Coffee](https://buymeacoffee.com/michaelnocito).*
