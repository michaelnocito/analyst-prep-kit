SQL has two comment syntaxes and you will use both today. `--` hides the rest of one line. `/*` opens a block that stays hidden until `*/` closes it, however many lines that takes. Nothing inside a comment runs.

The part nobody warns you about is what happens when you comment out a line that was holding the query together. There are exactly two shapes that break, and one small habit prevents both. That habit is the reason to read past the first screen.

**The short version.** `--` for one line, `/* */` for a block. Write your column lists with the comma at the front of each line, and any column becomes safe to comment out.

## The two ways to write a comment

Before the answer: one of these two can hide half a query in a single keystroke, and the other cannot. Guess which, then read on.

**Two dashes hide the rest of the line.** Everything after `--`, up to the line break, is ignored. The next line runs normally.
    
    
    SELECT name, score   -- the two columns the report needs
    FROM players;

**Slash-star opens a block, star-slash closes it.** Everything between them is ignored, including line breaks. This is the one that can hide half a query, because it does not stop at the end of a line. It stops only when it meets `*/`.
    
    
    /* Pulled for the Q3 review.
       Numbers were signed off by Dana on the 14th. */
    SELECT name, score
    FROM players;

Both forms are part of the SQL language rather than any one product, so the same two characters work in SQLite, PostgreSQL, MySQL, SQL Server, BigQuery and Snowflake. You do not have to relearn them when you change databases.

## Where you can put one

A line comment can start anywhere on a line. At the front, hiding the whole line. Or after working code, hiding only the tail.
    
    
    -- the whole line is hidden
    SELECT name FROM players;   -- only this tail is hidden

A block comment can sit in the middle of a line, because it has a closing mark and the database picks the code back up afterwards. This runs and returns 3:
    
    
    SELECT 1 + /* this is skipped */ 2;

Say out loud why that works before reading the next sentence. The reason is the whole difference between the two forms: `--` has no closing mark, so it runs to the end of the line and everything after it on that line is gone. `/* */` has a closing mark, so it takes only what sits between the two.

## The two shapes that break when you comment a line out

Commenting out a line is the most common thing anyone does with a SQL comment. You are testing whether a filter matters, so you hide it and rerun. Two shapes bite, and both leave a query that will not parse.

## Trap 1: the trailing comma in a SELECT list

Columns are separated by commas, and most people put the comma at the end of each line. Hide the last column and the comma above it is left pointing at nothing.
    
    
    SELECT id,
    -- name,
    FROM players;

The database reads `SELECT id, FROM players` and stops. SQLite reports `near "FROM": syntax error`. Other engines word it differently and mean the same thing: a comma promised another column and none arrived.

## Trap 2: the dangling AND in a WHERE

Same mistake, different keyword. Conditions are joined by `AND`, the `AND` usually sits at the end of the line, and hiding the last condition leaves it stranded.
    
    
    SELECT id FROM players
    WHERE score > 5 AND
    -- status = 'active'
    ;

SQLite reports `incomplete input`. The query is not wrong, it is unfinished. `AND` was waiting for a second thing to test and the comment ate it.

Notice what these two have in common. In both cases the line you commented out was fine on its own. What broke was the punctuation on the line _above_ it, which you never touched and did not look at.

## The comma habit that makes it safe

Move the comma and the `AND` to the _front_ of the line they belong to, instead of the end of the line before.
    
    
    SELECT id
         , name
         , status
    FROM players
    WHERE score > 5
      AND status = 'active';

Now every line owns its own punctuation. Comment out `, name` and the comma goes with it. Comment out `AND status = 'active'` and the `AND` goes with it. The query still parses, every time, and you can toggle any line without reading the one above it.
    
    
    SELECT id
    --   , name
         , status
    FROM players
    WHERE score > 5
    --  AND status = 'active'
    ;

Both of those run. The only line you cannot hide this way is the first column, because it is the one with no punctuation in front of it.

Picture your last long query with the commas moved to the front. Which line would you have toggled on and off while you were writing it? That line is the reason for the habit.

## What looks like a comment and is not

Comment marks lose their meaning inside quotes. A database reading a quoted string treats every character in it as text, including `--` and `/*`. This returns the literal text `a -- b`, not `a`:
    
    
    SELECT 'a -- b';

That matters when you are searching text that contains dashes, or storing snippets of code in a table. Nothing you write inside quotes can accidentally comment out the rest of your query.

In most databases block comments also do not nest. The first `*/` closes the block, whatever came before it:
    
    
    /* outer /* inner */ this part is now code */

The block ends at the first `*/`, so `this part is now code */` is handed to the database as SQL and fails. If you need to hide a stretch that already contains a block comment, put `--` at the front of every line instead. Your editor will do that for a whole selection in one keystroke, and the next section has the keys.

## How to comment out multiple lines at once

Typing `--` at the front of thirty lines is not a job for a person. Every SQL editor has a shortcut that does it to whatever you have selected. Highlight the lines, press the keys, and each line gets its own `--`.

Reach for this instead of wrapping the stretch in `/* */`. A line comment on every line still works when the stretch already contains a block comment, and a block comment does not.

| Editor                       | Comment what you selected                            | Undo it                     |
|------------------------------|------------------------------------------------------|-----------------------------|
| SQL Server Management Studio | `Ctrl`+`K`, then `Ctrl`+`C`                          | `Ctrl`+`K`, then `Ctrl`+`U` |
| MySQL Workbench              | `Ctrl`+`/` (`Cmd`+`/` on Mac)                        | The same keys again         |
| DBeaver                      | `Ctrl`+`/` for lines, `Ctrl`+`Shift`+`/` for a block | The same keys again         |
| pgAdmin 4                    | `Ctrl`+`/` (`Cmd`+`/` on Mac)                        | The same keys again         |
| VS Code                      | `Ctrl`+`/` (`Cmd`+`/` on Mac)                        | The same keys again         |

Two of those behave differently from the rest, and both catch people out.

SSMS is the odd one. It is not a single chord, it is two presses in a row. Hold `Ctrl`, tap `K`, tap `C`. Nothing appears to happen after the `K`, which is where most people give up and assume the shortcut is wrong.

MySQL Workbench is the other. On several builds the shortcut is wired to the divide key on the number pad rather than the forward slash on the main keyboard. On a laptop with no number pad, hold `Ctrl` and `Fn` together and press the key that doubles as divide. This has been an open bug for years, so it is your keyboard, not your SQL.

## Differences between databases

The two standard forms work everywhere. Two smaller things do not travel.

| Thing                       | Where it works                                       | What to do                                     |
|-----------------------------|------------------------------------------------------|------------------------------------------------|
| `--` line comment           | Every major database                                 | Use it freely                                  |
| `/* */` block comment       | Every major database                                 | Use it freely                                  |
| `#` line comment            | MySQL and MariaDB only                               | Use `--` instead, so the query survives a move |
| `--` with no space after it | Fine nearly everywhere, but MySQL rejects it         | Always put a space after the two dashes        |
| Nested `/* */` blocks       | PostgreSQL only                                      | Do not rely on it if the query might move      |
| An unclosed `/*`            | SQLite runs it to the end of input, others reject it | Always close the block                         |

Two of those are worth a second look, because both are the kind of thing that works on your machine and fails on someone else's.

MySQL is stricter about `--` than everyone else. It wants at least one space or tab after the second dash. `--note` is a syntax error in MySQL and a perfectly good comment almost everywhere else, so get in the habit of the space and the question never comes up.

PostgreSQL is the one database where block comments nest, which its own documentation says is the standard behaviour and the rest of the world's is not. In Postgres the example above hides the whole line, because the outer `/*` waits for its matching `*/`. Write SQL that depends on that and it breaks the day it is run anywhere else.

If you are writing SQL you might reuse somewhere else, stay on `--` with a space, use `/* */` without nesting it, and close every block. That is the portable set.

The full breakdown per engine, including what SQLite does with a block you forgot to close, is in [SQL comment syntax by database](https://michaelnocito.github.io/analyst-prep-kit/guides/sql-comment-syntax-by-database/).

## The other thing called a comment

One more meaning is worth knowing about, because it is a different feature with almost the same name.

`COMMENT ON TABLE` does not hide code. It is a statement you run, and it stores a description inside the database, attached to the table, where a colleague who has never seen your query file can still read it. That is covered in [COMMENT ON TABLE](https://michaelnocito.github.io/analyst-prep-kit/guides/sql-comment-on-table/).

Quick way to tell which one you need. Trying to stop a line from running: `--`. Trying to record what a column means so it outlives your script: `COMMENT ON`.

## What a comment should actually say

Syntax is the easy half. The harder question is what belongs in the comment once you have one.

A comment earns its place only when it carries something the code does not already say. `-- filter to active customers` sitting next to `WHERE status = 'active'` carries nothing, because the code said it first, in fewer words, and the code cannot go stale.

The thing a reader genuinely cannot recover from the code is _why anyone asked this question_. Why 500 and not 50. Why rank on percentage instead of raw count. Those are the judgment calls, and they are usually the part left out. A full format for writing that down, used word for word in three published portfolio projects, is in [how to comment SQL so it teaches](https://michaelnocito.github.io/analyst-prep-kit/guides/sql-teaching-comments/).

## Cheat sheet

| You want to                                 | Write                                            | Watch for                                      |
|---------------------------------------------|--------------------------------------------------|------------------------------------------------|
| Hide the rest of a line                     | `-- your note`                                   | Nothing after it on that line survives         |
| Hide several lines                          | `/* your note */`                                | Close it, and do not nest it                   |
| Add a note to the end of a line             | `SELECT id -- note`                              | Long lines get hard to read                    |
| Comment out one column                      | Front-load the comma, then `-- , name`           | Trailing commas leave a syntax error           |
| Comment out one condition                   | Front-load the `AND`, then `-- AND status = 'x'` | A dangling `AND` leaves the query unfinished   |
| Hide a block that already has `/* */` in it | `--` on every line                               | Blocks do not nest                             |
| Comment out many lines at once              | Select them, then `Ctrl`+`/`                     | SSMS is different: `Ctrl`+`K`, then `Ctrl`+`C` |
| Write a comment other databases will accept | `--` or `/* */`                                  | `#` is MySQL only                              |

## The one habit to keep

Put the comma and the `AND` at the front of the line. It costs nothing, it looks strange for about a day, and it turns commenting a line out from something you have to check into something you can do without thinking.

If you have paper nearby, write out your most-used query with the punctuation moved to the front. Seeing your own query in the shape is worth more than reading about it.

Which line in your current query would you most like to be able to switch on and off?

**Every example here was run before it was published.** The error messages quoted are the real ones SQLite returns, not a description of them. Other engines phrase the same two failures differently.

---

*Originally published on Analyst Prep Kit: [How to Comment in SQL: -- and /* */, and the Two Traps That Break a Query](https://michaelnocito.github.io/analyst-prep-kit/guides/sql-comments/)*

*Visit the site for more beginner data analysis guides and free resources: [the full guide archive](https://michaelnocito.github.io/analyst-prep-kit/guides/) covers SQL, Excel, Power BI, Tableau, Python and statistics, and the [practice kits](https://michaelnocito.github.io/analyst-prep-kit/) run in your browser with nothing to install.*

*If it was useful: [Buy Me a Coffee](https://buymeacoffee.com/michaelnocito).*
