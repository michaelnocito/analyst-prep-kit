Two comment forms are part of the SQL language itself and work in every database you are likely to open. Everything else is a local dialect. This page is the table of what works where, and then the handful of differences that are worth actually knowing.

**The one-line answer.** `--` hides the rest of a line and `/* */` hides a block, in every major database. `#` also hides the rest of a line, but only in MySQL and MariaDB.

## The table

| Database             | `--` to end of line          | `/* */` block        | `#` to end of line |
|----------------------|------------------------------|----------------------|--------------------|
| MySQL and MariaDB    | Yes, but a space must follow | Yes                  | Yes                |
| PostgreSQL           | Yes                          | Yes, and blocks nest | No                 |
| SQL Server and T-SQL | Yes                          | Yes                  | No                 |
| SQLite               | Yes                          | Yes                  | No                 |
| Oracle               | Yes                          | Yes                  | No                 |

If you write only `--` with a space after it and `/* */` that you always close, your comments will survive every move between these five. That is the whole portability rule.

## Why anyone asks about a single character

There is a question that turns up in MySQL quizzes and practice exams, worded almost exactly like this: _what single character can be used to comment out the rest of a line in MySQL?_

The answer is `#`.
    
    
    SELECT 1+1;   # this runs to the end of the line
    SELECT 1+1;   -- so does this, but that is two characters

The question is testing one thing. MySQL has three comment forms, and only one of them is a single character. `--` is two. `/*` is two and needs a closing pair. `#` is one, so `#` is the answer.

Worth knowing for the quiz and worth ignoring afterwards. `#` is a comment marker in MySQL and MariaDB and nowhere else, so a query full of them stops being a comment the moment it lands in PostgreSQL. Use `--` in anything you might reuse.

## MySQL is stricter about `--` than everyone else

This one costs people real time, because the error makes no sense until you know the rule.

MySQL requires whitespace after the second dash. Its documentation is explicit that the double-dash style needs the second dash followed by at least one whitespace or control character, such as a space or tab. So:
    
    
    -- this is a comment in MySQL
    --this is a syntax error in MySQL

Almost every other database accepts both. That is why a script written in SQL Server or SQLite can fail on its first run in MySQL, on a line that looks obviously like a comment.

The fix is a habit, not a lookup. Always put a space after the two dashes. It reads better anyway, and the question never comes up again.

**Why the rule exists.** MySQL needs to tell a comment apart from the subtraction of a negative number. `SELECT 5--3` is five minus negative three. Requiring the space keeps that arithmetic working.

## PostgreSQL is the only one where blocks nest

Nearly every guide will tell you block comments do not nest, and for nearly every database that is correct. The first `*/` closes the block, whatever came before it, so this leaves stray code behind:
    
    
    /* outer /* inner */ this part is now code */

PostgreSQL does not behave that way. Its documentation states that block comments nest, as specified in the SQL standard but unlike C, so that you can comment out larger blocks of code that might already contain block comments. In Postgres the line above is hidden completely, because the outer `/*` waits for its own matching `*/`.

This is genuinely useful when you want to switch off a chunk of a query that already has block comments in it. It is also a trap, because SQL that depends on it breaks the day someone runs it anywhere else. If the query might move, comment the stretch out with `--` on every line instead, which is one keystroke in every editor.

## SQLite will not tell you the block is open

Forget a `*/` in most databases and you get an error. SQLite gives you nothing.

Its documentation says a C-style comment extends to the next `*/` pair or until the end of input, whichever comes first. An unterminated block is legal. The comment simply runs to the bottom of the file.

The symptom is a script that runs clean and does about a third of what you expected, with no error to explain the rest. If a SQLite script quietly stops doing things partway down, search it for a `/*` with no partner.

## SQL Server, and the shortcut people give up on

Transact-SQL keeps it simple. Two hyphens for a line, `/* */` for a block, no `#`.

The part worth having is the shortcut, which Microsoft documents on the comment reference page itself. Select the lines, then:

| What you want               | Keys                        |
|-----------------------------|-----------------------------|
| Comment the selected text   | `Ctrl`+`K`, then `Ctrl`+`C` |
| Uncomment the selected text | `Ctrl`+`K`, then `Ctrl`+`U` |

It is two presses in a row, not one chord. Hold `Ctrl`, tap `K`, tap `C`. Nothing visibly happens after the `K`, which is exactly where most people conclude the shortcut is broken and go back to typing dashes by hand.

Every other editor on this list uses `Ctrl`+`/` instead. The full list of editor shortcuts is in [how to comment in SQL](https://michaelnocito.github.io/analyst-prep-kit/guides/sql-comments/).

## A comment that is not a comment

There is a second meaning of the word that catches people searching for this, and it is a completely different feature.

`COMMENT ON TABLE` does not hide code. It stores a description inside the database, attached to the table, where anyone querying that database can read it. It survives after your query file is gone. That is covered separately in [how to comment a table in SQL](https://michaelnocito.github.io/analyst-prep-kit/guides/sql-comment-on-table/).

The short way to tell which one you want: if you are trying to stop a line from running, you want `--`. If you are trying to explain to a colleague what a column means, you want `COMMENT ON`.

## Cheat sheet

| Situation                                     | What to write           | Watch for                        |
|-----------------------------------------------|-------------------------|----------------------------------|
| A comment that works anywhere                 | `-- note`               | Keep the space after the dashes  |
| A comment over several lines                  | `/* note */`            | Close it, and do not nest it     |
| A single-character comment in MySQL           | `#`                     | MySQL and MariaDB only           |
| Comment out many lines                        | Select them, `Ctrl`+`/` | SSMS uses `Ctrl`+`K`, `Ctrl`+`C` |
| Hide a stretch that already has `/* */` in it | `--` on every line      | Only PostgreSQL lets blocks nest |
| Describe a table for other people             | `COMMENT ON TABLE`      | A different feature entirely     |

## The rule that covers all of it

Write `--` with a space, write `/* */` and close it, and do not nest. Those three habits are correct in all five databases at once, so you never have to remember which one you are in.

Which database are you actually writing in today, and does the SQL you are writing need to run anywhere else?

**Where these claims come from.** Each behaviour here was checked against the vendor's own documentation, not against other tutorials: the MySQL 8.4 manual for `#` and the whitespace rule, the PostgreSQL manual for nesting, the SQLite comment page for the unterminated block, and Microsoft Learn for the T-SQL shortcut.

---

*The full version of this guide lives on my site: [SQL Comment Syntax by Database: MySQL, PostgreSQL, SQL Server, SQLite, Oracle](https://michaelnocito.github.io/analyst-prep-kit/guides/sql-comment-syntax-by-database/).*

*If it was useful: [Buy Me a Coffee](https://buymeacoffee.com/michaelnocito).*
