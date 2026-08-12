By the end of this page you can choose between a view, a temporary table and a CTE for any intermediate result, say what each one costs in time and in freshness, refresh a temp table in one statement, and explain why one of the two can be indexed and the other cannot. It is about twenty-five minutes, and every timing below was measured on a 400,000-row table.

Here is what to do today, on the query you keep re-running while exploring. If you are reading the same expensive aggregate more than twice, put it in a temporary table once and query that instead. Reading it went from 467.6 ms to effectively nothing in the measurements below, and the only thing you give up is freshness, which during a single analysis session you usually want frozen anyway.

The short version: a view stores a query, so every read runs it again. A temp table stores rows, so every read is just a read.

Saved question against saved answer is the idea, so it gets the picture.

> _The original carries a diagram here. In words: A large base table is drawn at the bottom centre as a stack of four wide bars. Above it to the left sits a hollow rounded rectangle with a dashed outline, labelled view, containing nothing at all. Above it to the right sits a solid filled rounded rectangle, labelled temp table, containing four short rows of numbers. A blue arrow enters the hollow view box from the left, passes straight through it and continues down to the base table, showing that reading the view reaches all the way back to the data every time. A separate amber arrow enters the solid temp table box from the right and stops there, because the numbers it wants are already inside. A single faded amber arrow runs upward from the base table into the solid box, drawn much lighter than the others, standing for the one time the temp table was filled._

**Every number on this page was measured.** A 400,000-row orders table in SQLite, with an aggregate saved once as a view and once as a temporary table, each read five times with the fastest run reported. The behaviour is the same in Postgres, MySQL and SQL Server; the syntax differences are noted where they matter.

## 1. What each one is

Both are created from a `SELECT` and both are then queried like a table, which is exactly why they get confused.
    
    
    CREATE VIEW v_region AS
      SELECT region, COUNT(*) AS orders, SUM(units*unit_price) AS revenue
      FROM orders GROUP BY region;
    
    CREATE TEMP TABLE t_region AS
      SELECT region, COUNT(*) AS orders, SUM(units*unit_price) AS revenue
      FROM orders GROUP BY region;

The difference is what got stored. The view stored the text of the query and nothing else; it holds no rows and takes no space. The temp table ran the query once and stored the rows that came out.

Read either one and you get the same four rows:
    
    
    East  | 100000 | 86499255
    North | 100000 | 33500090
    South | 100000 | 86999300
    West  | 100000 | 68000200

Identical output, and from here on everything about them differs.

## 2. The measurement

Before the explanation: reading four rows from each. Say whether you expect a difference worth caring about.
    
    
    SELECT * FROM v_region      467.6 ms
    SELECT * FROM t_region        0.0 ms

Four rows either way. The view took nearly half a second because reading it means running a `GROUP BY` over 400,000 rows, every time. The temp table took no measurable time because the four rows are already sitting there.

That gap compounds with use. Reading each of them ten times in a row:
    
    
    view        4688.8 ms
    temp table     0.2 ms

The view did the whole aggregate ten times. This is the concrete reason a dashboard built on a stack of views can be slow in a way that looks mysterious: each panel reads a view, each view runs its query, and a view built on another view runs both.

Say out loud what you are actually paying for when you accept that cost. You are paying for the numbers to be current at the moment of reading, which is the next section.

## 3. The freshness trade, shown

One hundred new North orders are inserted into the base table. Neither the view nor the temp table is touched. Then both are read again.
    
    
    the view       North | 100100 | 33600090
    the temp table North | 100000 | 33500090

The view noticed. The temp table did not, and never will, because it is a copy of what the answer was at the moment it was made.

Both behaviours are correct and both are what somebody wants. A view is right when the answer must reflect the data now: an operational dashboard, a definition other people build on, anything where being out of date is the failure. A temp table is right when the answer must not move underneath you: a multi-step analysis where every step has to see the same numbers, a report that has to reconcile across ten queries, anything you will be asked to explain tomorrow.

The second case is underrated. If you run four queries against live data over an hour, they can legitimately disagree with each other, and you will spend the afternoon looking for a bug that is really the data arriving. Freezing the input at the start makes the whole analysis internally consistent, and that is a feature rather than staleness.

## 4. Refreshing a temp table

Being frozen is only a problem if you cannot easily unfreeze it, and you can. Two statements, and it is current again:
    
    
    DELETE FROM t_region;
    INSERT INTO t_region
      SELECT region, COUNT(*), SUM(units*unit_price) FROM orders GROUP BY region;
    
    the temp table after the refresh    North | 100100 | 33600090

Now it matches the view. Which gives you the pattern that solves most of the tension on this page: **refresh deliberately, at a moment you choose, and know when it happened.** A temp table refreshed at the top of your script is a snapshot with a timestamp you can state, which is a much better thing to hand somebody than "it was live at whatever moment each query happened to run".

Keep the defining query in one place rather than typing it twice. In practice that means writing the aggregate once, as a view, and having the temp table load from the view: the view is the definition and the temp table is today's copy of it. That combination is worth more than either alone.

## 5. Only one of them can be indexed

Before the explanation: both behave like tables in a query. Say whether you can put an index on each.
    
    
    CREATE INDEX ix_t ON t_region(region);      index created
    CREATE INDEX ix_v ON v_region(region);      views may not be indexed

The error message is the explanation. An index is a sorted structure over stored rows, and a view has no stored rows to sort. There is nothing to build.

That matters more than it sounds when the intermediate result is large and you are going to join it to something. A temp table of a million rows with an index on the join key behaves like any other table; the same result as a view is re-derived on every join attempt and cannot be indexed at all. If you are doing anything repetitive with an intermediate result, that alone is often the deciding argument, and the rest of what indexes do is in [when to index a table](https://michaelnocito.github.io/analyst-prep-kit/guides/sql-indexing-for-analysts/).

## 6. Scope: who else can see it

A view is a permanent object in the database. It appears in the catalogue, other people can query it, and it survives disconnection. A temporary table is private to your connection and disappears when you disconnect.

Opening a second connection to the same database and asking for each of them:
    
    
    sees the view       : 4 rows
    sees the temp table : no such table: t_region

Both halves of that are useful. The view being shared is the point of a view: it is how a definition gets used consistently by several people instead of being re-typed slightly differently in each of their queries. The temp table being private is also the point: you can create, drop and recreate it freely without affecting anybody, and you cannot leave a mess behind, because it cleans itself up when you disconnect.

The corollary catches people out. If your reporting tool opens a new connection per query, a temp table created in one query will not exist in the next. Where that is the case, the answer is usually a real table in a scratch schema rather than a temporary one.

## 7. CTE, temp table, view: which when

There is a third thing that does a similar-looking job, and choosing between all three is easier than it looks because they live on different timescales.

|                | Lives for     | Stores rows | Can be indexed | Shared |
|----------------|---------------|-------------|----------------|--------|
| **CTE**        |  One query    | Usually not | No             | No     |
| **Temp table** |  Your session | Yes         | Yes            | No     |
| **View**       |  Forever      | No          | No             | Yes    |

The rule of thumb that follows: use a **CTE** when the intermediate result is needed once, inside one statement, which is most of the time and is what [named steps](https://michaelnocito.github.io/analyst-prep-kit/guides/sql-subqueries/) are for. Use a **temp table** when several statements need the same intermediate result, or when it is expensive and you will read it repeatedly, or when you need it to hold still. Use a **view** when other people, or other queries, need the same definition and must always get the current answer.

One case is worth calling out because it is common and slow. A CTE referenced three times inside one query may be computed three times, depending on the engine. If it is expensive and used more than once, that is a temp table, not a CTE.

## 8. Materialised views, which are both

A materialised view is a view that stores its rows: a defined query, kept in the catalogue like a view, with the result written down like a table. It can be indexed, it is shared, and it is stale until refreshed.
    
    
    -- PostgreSQL
    CREATE MATERIALIZED VIEW mv_region AS SELECT ... ;
    REFRESH MATERIALIZED VIEW mv_region;

That is the combination most reporting setups actually want: the definition lives in one place, everybody reads the same object, reads are fast, and a scheduled refresh decides how fresh "fresh" means. The cost is that somebody has to own the refresh, and a materialised view nobody refreshes is the worst of all worlds, because it looks like a live object and is not.

Support varies. PostgreSQL and Oracle have them under that name. SQL Server has indexed views, which update automatically and come with restrictions on what the query may contain. MySQL and SQLite have neither, and the standard workaround is exactly the pattern in section four: a real table plus a scheduled job that reloads it.

Picture the slowest dashboard you have to look at. How many of its panels are reading a view that recomputes an aggregate over the whole table, and how current does each of them genuinely need to be?

## The full before and after

Same job: an analysis that reads a regional aggregate several times.

### Before
    
    
    CREATE VIEW v_region AS SELECT region, COUNT(*), SUM(units*unit_price)
                            FROM orders GROUP BY region;
    
    -- read it ten times over the course of the analysis
    4688.8 ms of aggregation, and the numbers can move between reads

Half a second per read, ten times, plus the risk that step one and step seven of the same analysis disagree because rows arrived in between. Neither problem announces itself.

### After
    
    
    -- the definition, once, shared, always current for anyone who needs that
    CREATE VIEW v_region AS SELECT region, COUNT(*) AS orders,
           SUM(units*unit_price) AS revenue FROM orders GROUP BY region;
    
    -- today's frozen copy, for this session's work
    CREATE TEMP TABLE t_region AS SELECT * FROM v_region;
    CREATE INDEX ix_t ON t_region(region);
    
    -- ten reads
    0.2 ms total, and every step of the analysis sees identical numbers

The definition is still in one place and still shared. The reading is instant. The numbers hold still for the length of the session, and a refresh is two statements when you want them to move.

The claim, and it is why the distinction is worth ten minutes: **the same four rows cost 467.6 ms from a view and nothing from a temp table, and after a hundred rows arrived only one of the two changed, which is the feature you are choosing between rather than a bug in either.**

## Edge cases worth knowing

Six that come up.

**Views built on views.** Each layer re-runs, so a three-deep stack runs three queries per read. This is the commonest cause of an inexplicably slow reporting layer, and it is invisible until you read the definitions.

**A temp table that outlives its usefulness.** It lasts for the session, and a long-lived connection in a notebook can be a session for days. If numbers stop matching production, check when the snapshot was taken before checking anything else.

**Connection pooling.** Tools that hand out a different connection per query will lose your temp table between statements, and the error looks like the table was never created.

**Temp table name collisions.** They are per-session, so two people can each have a `t_region` and neither affects the other. That is convenient and it means a name in a shared script tells you nothing about whose data is in it.

**Views hide their cost.** A query joining two views is a query joining two aggregates over full tables, and its plan will show that, which is another reason to read plans rather than judge queries by their length.

**Disk and memory.** A temp table is real data somewhere, in memory or in a temporary file, so a snapshot of a hundred million rows is not free. When the intermediate result is that big, filter it down first; the rest of that argument is in [handling large datasets](https://michaelnocito.github.io/analyst-prep-kit/guides/handle-large-datasets/).

## Why this works

A view exists for a reason older than performance. The relational model separates how data is stored from how it is presented, so that a query can be written against a stable logical shape while the underlying tables are reorganised beneath it; that separation is what lets a definition be shared and survive change (Codd, 1970, _Communications of the ACM_ , 13(6), 377–387). That is why a view stores a query rather than rows: storing rows would tie it to a moment, and the whole point is to be a name for a derivation rather than for a result. The 467.6 ms is the price of that guarantee, and once you see it as a guarantee rather than an inefficiency, choosing between the two stops being a matter of taste.

The materialised version is the recognition that the guarantee is not always worth paying for on every read. Storing the result of a derived relation and keeping it usable is a well-studied problem precisely because the moment you store it, it can disagree with the tables it came from, and the interesting question becomes how and when to bring it back into line rather than whether to store it at all (Blakeley, Larson, & Tompa, 1986, _Proceedings of the 1986 ACM SIGMOD International Conference on Management of Data_ , 61–71). The two-statement refresh in section four is the hand-rolled version of that, and the reason it is worth doing deliberately is that the alternative is not freshness, it is not knowing.

One note on the cheat sheet below. It is built to be covered and recalled rather than reread, because the advantage of self-testing over restudying holds up in reviews of real classroom use rather than only in controlled experiments (Yang, Luo, Vadillo, Yu, & Shanks, 2021, _Psychological Bulletin_ , 147(4), 399–435).

## Using this on your own project

Rewriting a reporting layer is a project. Do this instead, in order.

  1. **Time the read.** If reading a view takes hundreds of milliseconds, it is doing real work every time, and multiplying that by how often it is read gives you the size of the problem.
  2. **Check for views built on views.** Read the definitions two levels down before optimising anything.
  3. **Snapshot into a temp table for any multi-step analysis** , at the start, so every step sees the same numbers and you can say which moment they are from.
  4. **Index the snapshot** if you are joining to it more than once.
  5. **Keep the definition in a view and load the temp table from it** , so the logic exists once.
  6. **Where the engine supports it, ask for a materialised view** with a scheduled refresh, and make sure somebody owns the schedule.

If you have paper nearby, one optional sketch is worth five minutes. Draw the objects your report reads as boxes, and draw an arrow from each one to whatever it reads from. Then mark every box that stores rows. The chains of boxes with nothing stored in them are the ones re-running on every read, and most people find one chain that is three long.

**More detail on this, and more like it.** Every how-to sits in one place on the [guides index](https://michaelnocito.github.io/analyst-prep-kit/guides/). If you would rather type queries than read about them, the [SQL Drill](https://michaelnocito.github.io/analyst-prep-kit/drill/) gives you one runnable query at a time against a real database.

## The whole thing on one screen

This is the retrieval sheet. Cover the right column, work down the left, and say each answer out loud before you check it.

| Thing                  | What it does                                                            |
|------------------------|-------------------------------------------------------------------------|
| A view                 | Stores the query. No rows, no space.                                    |
| A temp table           | Stores the rows the query returned, once.                               |
| Reading a view         | Runs the whole query again. 467.6 ms here.                              |
| Reading a temp table   | Just a read. Effectively nothing.                                       |
| Ten reads              | 4,688.8 ms against 0.2 ms.                                              |
| After the data changes | The view updates. The temp table does not.                              |
| Which is right         | View for a shared, always-current definition. Temp table to hold still. |
| Refresh                | `DELETE` then `INSERT ... SELECT`. Two statements.                      |
| Indexing               | Temp table yes. View rejected: no rows to sort.                         |
| Scope                  | View is permanent and shared. Temp table is private to the session.     |
| Second connection      | Sees the view. Does not see the temp table.                             |
| A CTE                  | One query only. May be recomputed per reference.                        |
| Pick a CTE             | Needed once, inside one statement.                                      |
| Pick a temp table      | Several statements, expensive, or must not move.                        |
| Pick a view            | A definition other people use and must be current.                      |
| Materialised view      | Both: stored rows, shared, indexable, stale until refreshed.            |
| Views on views         | Every layer re-runs. The usual cause of a slow reporting layer.         |

**The one habit to keep.** Snapshot into a temp table at the start of any analysis with more than two steps, and write down the time you took it. Internal consistency across your own queries is worth more than each of them being individually current, and the timestamp is what turns a frozen copy from staleness into a stated fact. If an intermediate result misbehaves in a way this page does not cover, there is a general [diagnosis loop for being stuck](https://michaelnocito.github.io/analyst-prep-kit/guides/technical-tenacity/).

One last thought, and I would genuinely like other people's answers. The one that taught me this was a reconciliation that never balanced, run over an hour against live tables, where the discrepancy was simply new orders arriving between the first query and the last. What have you chased that turned out to be the data moving rather than the logic being wrong?

## References

  * Codd, E. F. (1970). A relational model of data for large shared data banks. _Communications of the ACM_ , 13(6), 377–387.
  * Blakeley, J. A., Larson, P.-Å., & Tompa, F. W. (1986). Efficiently updating materialized views. _Proceedings of the 1986 ACM SIGMOD International Conference on Management of Data_ , 61–71.
  * Yang, C., Luo, L., Vadillo, M. A., Yu, R., & Shanks, D. R. (2021). Testing (quizzing) boosts classroom learning: A systematic and meta-analytic review. _Psychological Bulletin_ , 147(4), 399–435.

---

*The full version of this guide lives on my site: [Temp Table vs View in SQL: A Saved Answer or a Saved Question](https://michaelnocito.github.io/analyst-prep-kit/guides/sql-temp-tables-vs-views/).*

*If it was useful: [Buy Me a Coffee](https://buymeacoffee.com/michaelnocito).*
