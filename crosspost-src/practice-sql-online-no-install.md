By the end of this page you will be running real SQL against a real database with nothing installed, and you will know which of the free browser tools suits which job. You will also know the thing none of them puts on the front page: some of them run entirely inside your browser, and some upload whatever you paste to a stranger's server. That difference decides what you are allowed to practise on.

Here is what to actually do today. If you want a database already loaded and questions already written, open [sql-practice.com](https://sql-practice.com/). If you want to create your own tables and share the result with someone, open [DB Fiddle](https://www.db-fiddle.com/). Both start working immediately with no account.

The short version: browser-only tools keep your data on your machine, server-backed tools do not, and neither kind is the right place for anything from work.

Where the data goes is the one idea that should drive your choice, so it gets the picture.

> _The original carries a diagram here. In words: Two panels side by side, each drawn as a laptop outline containing a browser window. In the left panel a small data box sits inside the browser window, with a short circular arrow looping back into itself, showing the data never leaves the laptop. In the right panel the same data box has a long arrow leading out of the laptop, across a gap, and into a separate server rack drawn beyond the laptop's edge, with a copy of the data box now sitting in the rack as well. The original box remains, showing the data has been copied out rather than moved._

**Every tool below was opened and checked on 8 August 2026.** These sites change often, so the descriptions describe what was actually on screen, and anything I could not confirm by looking is not claimed here.

## 1. Run your first query, right now

Before the explanation: what do you think has to exist on your computer for a SELECT statement to return rows?

The honest answer is nothing at all, and that surprises people who have spent a weekend fighting an installer. A database engine can be compiled to run inside a web page, so the browser tab you already have open is enough to hold a working database, execute real SQL against it, and hand you real rows back.

Open the [SQL Drill](https://michaelnocito.github.io/analyst-prep-kit/drill/) in another tab and type this:
    
    
    SELECT * FROM gem_page LIMIT 5;

Rows come back: tracks, listener counts and play counts from a real music dataset. No install, no account, no server. That query is the smallest complete thing SQL can do: name the columns you want, name the table, limit how many rows come back. Everything else you will learn is a refinement of those three decisions.

## 2. The five tools, and what each is for

They look interchangeable and are not. The useful question is what each one already has loaded, because that decides whether you spend your evening writing queries or writing CREATE TABLE statements.

| Tool                                                                                    | What is already there                                                                                                                  | Account             | Best for                                                                                               |
|-----------------------------------------------------------------------------------------|----------------------------------------------------------------------------------------------------------------------------------------|---------------------|--------------------------------------------------------------------------------------------------------|
| [sql-practice.com](https://sql-practice.com/)                                           | A hospital database (patients, admissions, doctors, provinces) and a Northwind copy, with a schema viewer and exercises down the side. | Not needed to start | Practising against questions somebody else wrote. The closest thing to a course.                       |
| [DB Fiddle](https://www.db-fiddle.com/)                                                 | Nothing. Two panes: one for your schema, one for your query. You pick the engine and version at the top.                               | Not needed to run   | Reproducing a problem and sending someone a link to it. The standard way to ask a SQL question online. |
| [SQLite Online](https://sqliteonline.com/)                                              | An empty database, plus the ability to open a file from your machine.                                                                  | Not needed          | Poking at a `.db` or CSV file you already have, without installing anything.                           |
| [W3Schools Try It](https://www.w3schools.com/sql/trysql.asp?filename=trysql_select_all) | A small fixed sample database, attached to their SQL tutorial pages.                                                                   | Not needed          | Testing one clause you just read about, in the same tab as the explanation.                            |
| [SQL Drill](https://michaelnocito.github.io/analyst-prep-kit/drill/)                    | A loaded database and thirteen queries in order, each one the previous query plus one new idea.                                        | Not needed          | Building typing fluency, when you want the next query chosen for you.                                  |

Two of those solve a problem worth naming. When you ask a SQL question anywhere online, the first reply is usually a request for a runnable example, because nobody can debug a query without the tables. A DB Fiddle link containing your schema and your query is that example, and providing one is the difference between a question that gets answered and one that does not.

## 3. Where your data goes, and the rule that follows

Before the explanation: you paste a table from a work spreadsheet into an online SQL tool to test a query. Who can now read that table?

It depends entirely on which kind of tool you opened, and the page rarely tells you. Some of these run the database engine inside your browser, so your rows never travel anywhere. Others send your schema and query to their server, run it there, and send results back, which means a copy of everything you pasted now exists on somebody else's machine.

The tools themselves are clear about this when you read far enough. SQLite Online's own disclaimer states that the service is not intended for processing personal data and that the user assumes all risk and liability for uploaded content. DB Fiddle saves fiddles publicly unless you pay for the private option, which is a reasonable business model and a serious hazard if you assumed a saved link was yours alone.

So the rule is short and it has no exceptions worth arguing about. **Never paste real customer, patient, employee or financial data into an online SQL tool.** Not to test a query, not with the names removed, not for two minutes. Anonymising a table properly is harder than it looks, and a table of "anonymous" hospital admissions with dates and postcodes in it is frequently not anonymous at all.

The practical workaround costs thirty seconds. Retype five made-up rows with the same column names and types as your real table, and test the query against those. The query does not care whether the names are real, and a bug in your JOIN will show up on five rows exactly as it would on five million. When you need to work on the real thing, work locally, which is what [setting up a SQL database](https://michaelnocito.github.io/analyst-prep-kit/guides/set-up-a-sql-database/) is for.

## 4. Which SQL dialect you are learning

SQL is a standard that every database interprets slightly differently. The differences are small in the parts you are learning first and become real later, particularly around dates and text functions.

Most browser tools run **SQLite** , because it is small enough to compile into a web page. DB Fiddle is the exception worth knowing about, since it lets you choose the engine and version, and it opened on MySQL when I checked it. That matters when you are preparing for a specific job: if the posting says PostgreSQL, practising date functions in SQLite will teach you the wrong syntax for the interview.

Do not let this worry you at the start. `SELECT`, `WHERE`, `GROUP BY`, `JOIN`, `HAVING` and window functions behave the same way across all of them, and that is the material of your first several months. The places to expect differences are date arithmetic, string concatenation, and the exact spelling of "give me the top ten". When you meet one, the fix is to search the function name plus your engine's name, not to conclude you have misunderstood SQL.

## 5. What a browser tab cannot teach you

These tools are excellent at the part they cover, and it is worth being clear about where the ceiling sits, so you know when to move.

They cannot teach you to **load data** , which is a real skill with real failure modes: a CSV whose numbers arrive as text, leading zeros stripped from postcodes, a date format that means one thing in the UK and another in the US. They cannot teach you **performance** , because the toy tables are too small for an index to matter. They cannot teach you to **connect a tool to a database** , which is what every job actually asks for. And nothing you build in most of them survives closing the tab, so there is no such thing as returning to yesterday's work.

Say what that list has in common before reading on. Every item is about the world around the query rather than the query itself. That is the honest boundary: a browser tab teaches you SQL, and a local install teaches you the job. Start in the tab today, and move when the tab starts refusing to hold your work, which usually takes a few weeks.

## The full before and after

Same intent both times: learn enough SQL this month to answer interview questions.

### Before
    
    
    Day 1  Searched for how to install a database
    Day 2  Chose between five engines, picked one
    Day 3  Installer failed on a permissions error
    Day 4  Fixed the permissions error
    Day 5  Wrote first SELECT

Four days spent on the part that teaches nothing about SQL. This is not a personal failing and it is extremely common, because the setup step sits in front of the learning step and looks compulsory. Motivation is finite, and this is where most of it gets spent.

### After
    
    
    Minute 1   Opened a browser tool with a database already loaded
    Minute 2   SELECT * FROM patients LIMIT 5
    Day 1      WHERE, ORDER BY, COUNT
    Day 3      GROUP BY and the first JOIN
    Week 2     Installed locally, because saving work now matters

The install still happens, and it happens for a reason you can feel rather than because a tutorial said so. By then you know what a database is for, which makes the setup questions answerable instead of arbitrary. The order is what changed, not the destination.

## What goes wrong, and the fix

Six that come up constantly.

**"no such table".** Table names differ between tools, and tutorials are written against whichever one the author used. Read the schema panel on the left rather than the tutorial. On sql-practice.com the tables are `patients`, `admissions`, `doctors` and `province_names`.

**Your work vanished when you closed the tab.** Most of these keep nothing. Paste anything you want to keep into a text file on your own machine as you go. A file of queries that worked becomes the thing you paste from later.

**A date function that works everywhere else fails here.** Dialect. `DATEADD`, `DATE_ADD` and `date(...,'+1 day')` are three engines' spellings of one idea. Check which engine the tool is running before you conclude the query is wrong.

**The query runs but returns nothing.** Usually a `WHERE` comparing against a value that does not exist, often because of capitalisation or a trailing space. Take the WHERE clause off and look at the raw values first.

**You expected an error and got a wrong answer instead.** SQLite is unusually permissive about types, so comparing a number to text can quietly yield nothing rather than complaining. That flexibility is convenient and it hides mistakes, which is one more reason to move to a real engine eventually.

**A shared fiddle is public.** Saved fiddles are visible unless privacy is a paid feature you have paid for. Assume anything you save can be read.

## Why starting in a browser works

The mechanism first, because it explains why this is possible at all. SQLite is a complete database engine in a single small library, with no server process and no configuration, and it has been compiled to run inside web pages. That is why a tab can hold a real database rather than a simulation of one: the same engine that ships inside phones and browsers is doing the work, and the SQL you write against it is the SQL you would write anywhere.

The learning argument is separate and stronger. Setup is not a first step, it is a filter, and it takes its toll before any learning has happened. Removing it means the first thing you meet is a query returning rows, which is the thing that makes SQL feel worth learning. There is also decent evidence for the way these tools ask you to work: retrieving an answer from memory produces substantially better long-term retention than re-reading the same material, and the advantage grows with time (Roediger & Karpicke, 2006, _Psychological Science_ , 17(3), 249–255). Typing a query yourself is retrieval. Reading a finished one is not, which is the entire argument for a tool that makes you type.

One note on the way this page is written. It kept asking you to commit to an answer, what must exist for a SELECT to work, who can read your pasted table, before giving one. Attempting an answer before seeing the correct one reliably improves how well the correct one is retained, even when the attempt is wrong (Bisra, Liu, Nesbit, Salimi, & Winne, 2018, _Educational Psychology Review_ , 30(3), 703–725).

## Using this on your own learning

Five steps, in order.

  1. **Start today in a tool with data already loaded.** Choosing an engine is a question you are not yet equipped to answer, and it does not need answering yet.
  2. **Keep a text file of queries that worked** , on your own machine, from the first day. It survives the tab closing and becomes your reference.
  3. **Never paste anything real.** Five made-up rows with the same column names test a query exactly as well.
  4. **Check which engine you are on** before learning any date or text function, and match it to the job you want.
  5. **Install locally when saving work starts to matter** , usually week two or three. By then the setup questions have obvious answers.

If you have paper nearby, one optional drawing is worth two minutes. Draw a laptop, and for each tool you use, draw either a loop inside it or an arrow leaving it. Any tool you cannot confidently draw is one you should not paste anything sensitive into.

**More detail on this, and more like it.** Every how-to sits in one place on the [guides index](https://michaelnocito.github.io/analyst-prep-kit/guides/): getting set up, SQL, Excel, Python, and the working habits around them.

## The whole thing on one screen

This is the retrieval sheet. Cover the right column, work down the left, and say each answer out loud before you check it.

| Thing                     | What it is, or what it does                                                      |
|---------------------------|----------------------------------------------------------------------------------|
| Browser SQL               | A real database engine compiled to run inside a web page. Real rows, no install. |
| sql-practice.com          | Hospital and Northwind databases loaded, with exercises. No account needed.      |
| DB Fiddle                 | Empty. You write the schema, pick the engine, and share a link.                  |
| SQLite Online             | Empty, but can open a file from your machine.                                    |
| Runs in the browser       | Your data never leaves the laptop.                                               |
| Runs on a server          | A copy of everything you paste lives on somebody else's machine.                 |
| The pasting rule          | Nothing real. Five made-up rows test the query just as well.                     |
| Saved fiddles             | Public unless privacy is a paid feature you bought.                              |
| Dialect                   | Most browser tools run SQLite. DB Fiddle lets you choose.                        |
| What transfers everywhere | SELECT, WHERE, GROUP BY, JOIN, HAVING, window functions.                         |
| What differs by engine    | Date arithmetic, string joining, the top-N syntax.                               |
| What a tab cannot teach   | Loading data, performance, connecting a tool, keeping work.                      |
| "no such table"           | Read the schema panel, not the tutorial. Names differ per tool.                  |
| When to install locally   | When keeping yesterday's work starts to matter. Usually week two.                |

**The one habit to keep.** Before you paste anything into an online tool, ask whether you would be comfortable with that text on a public page, because with several of these tools it effectively is. Made-up rows cost thirty seconds and remove the question entirely. If something breaks in a way this page does not cover, there is a general [diagnosis loop for being stuck](https://michaelnocito.github.io/analyst-prep-kit/guides/technical-tenacity/).

One last thought, and I would genuinely like other people's answers. The thing that finally moved me off browser tools was losing an evening's queries to a closed tab, which is a small loss that teaches a large lesson. What made you install something locally, and how long had you been putting it off?

## References

  * Roediger, H. L., & Karpicke, J. D. (2006). Test-enhanced learning: Taking memory tests improves long-term retention. _Psychological Science_ , 17(3), 249–255.
  * Bisra, K., Liu, Q., Nesbit, J. C., Salimi, F., & Winne, P. H. (2018). Inducing self-explanation: A meta-analysis. _Educational Psychology Review_ , 30(3), 703–725.

---

*The full version of this guide lives on my site: [How to Practice SQL Online With Nothing Installed (And Where Your Data Goes)](https://michaelnocito.github.io/analyst-prep-kit/guides/practice-sql-online-no-install/).*

*If it was useful: [Buy Me a Coffee](https://buymeacoffee.com/michaelnocito).*
