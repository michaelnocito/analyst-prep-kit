By the end of this page you can compare two versions of the same table and say exactly what is different: which rows exist on only one side, which rows exist on both but disagree, which columns the disagreements are in, and how much money the whole thing accounts for. It is about twenty-five minutes, and every query and result below was run.

Here is what to do today, on any two tables that are supposed to match. After you compare the row counts, compare a total as well. Pick the most important numeric column and sum it on both sides. Row counts are the check that passes while the data is wrong, and a sum on the same rows is thirty seconds of extra work that catches an entire class of failure the count cannot see.

The short version: match the two tables on their key with a full outer join, then classify every key as matched, changed, source only or target only.

Two stacks of equal height that do not contain the same rows is the idea, so it gets the picture.

> _The original carries a diagram here. In words: Two vertical stacks of small horizontal bars stand facing each other, one on the left and one on the right, and both stacks are exactly the same height because both hold the same number of bars. Most bars are joined across the gap by a plain horizontal connector, showing rows that exist on both sides. Two of those connectors carry a small amber cross in the middle, marking pairs that exist on both sides but whose values disagree. One bar on the left has a connector that runs only halfway and ends in an amber cross with nothing beyond it, meaning that row has no partner on the right. One bar on the right has the mirror image: a stub reaching in from the gap that starts nowhere. Under each stack the same figure, 16, is printed, so the counts agree while the contents do not._

**Every result on this page is real.** The sixteen-row orders table used across this set of guides, and a migrated copy of it, loaded into DuckDB and compared. The copy was damaged in four specific ways, and the point of the page is that you are not told which four until the queries find them.

## 1. The check that passes and proves nothing

Before the explanation: a table has been copied from one system to another. Say what you would check first.

Almost everybody says the row count, and here it is.
    
    
    source_rows | target_rows
             16 |          16

Sixteen against sixteen. On most migrations that is where the checking stops, the ticket gets closed, and the problem surfaces six weeks later in a finance report.

Now one more query, on the same two tables.
    
    
    source_revenue | target_revenue | difference
              9890 |           9490 |        400

Four hundred is missing, from a copy with exactly the right number of rows. Rows and values are two different things, and a count can only ever answer a question about rows.

The reason to lead with this is that the count is not useless, it is just first. A row count catches the biggest failures: nothing loaded, half loaded, everything loaded twice. It cannot catch anything that leaves the count intact, and the rest of this page is about how much that is.

## 2. Match on the key, in both directions

To compare rows you need a key: the column, or set of columns, that identifies the same real thing in both tables. Then a **full outer join** on that key, which keeps rows that fail to match from either side, and one look at where the nulls fall.
    
    
    SELECT COALESCE(s.order_id, t.order_id) AS order_id,
           CASE WHEN t.order_id IS NULL THEN 'source only'
                WHEN s.order_id IS NULL THEN 'target only' END AS where_it_is
    FROM orders s
    FULL OUTER JOIN orders_target t USING (order_id)
    WHERE s.order_id IS NULL OR t.order_id IS NULL;
    
    1008 | source only
    1017 | target only

Order 1008 exists in the source and not in the copy: it was lost. Order 1017 exists in the copy and not in the source: it was invented, which usually means a load ran twice or a test record escaped.

One lost and one gained, so the count came out even. That is not a coincidence dreamed up for this page; it is the ordinary shape of a botched rerun, and it is exactly why the count agreed.

The full outer join is doing the work here, and it is worth being clear about why an inner join would not: an inner join keeps only the rows that matched, which is the set that contains neither of your problems. If joins are not yet automatic, [the joins guide](https://michaelnocito.github.io/analyst-prep-kit/guides/sql-joins/) covers which rows each kind keeps.

Some engines lack `FULL OUTER JOIN`. The portable substitute is two anti-joins, one in each direction, combined with `UNION ALL`, using `NOT EXISTS` rather than `NOT IN` for the reason in [the NULL guide](https://michaelnocito.github.io/analyst-prep-kit/guides/sql-null/).

## 3. Compare the values on matched rows

Rows present on both sides can still disagree, so join them and compare every column.
    
    
    SELECT s.order_id, s.region, t.region, s.units, t.units
    FROM orders s JOIN orders_target t USING (order_id)
    WHERE s.region     IS DISTINCT FROM t.region
       OR s.units      IS DISTINCT FROM t.units
       OR s.unit_price IS DISTINCT FROM t.unit_price
       OR s.product    IS DISTINCT FROM t.product
       OR s.rep        IS DISTINCT FROM t.rep
       OR s.order_date IS DISTINCT FROM t.order_date;
    
    1003 | East | east | 3 | 3
    1010 | East | East | 5 | 4

Two rows. Order 1003 has the same numbers and a different spelling of its region. Order 1010 has five units in the source and four in the copy, which is where the missing 400 went: one desk at 220 became four units instead of five, a loss of 220, plus order 1008's 480 lost and order 1017's 300 invented. That arithmetic is worth doing out loud, because being able to explain the 400 exactly is the difference between a finding and a worry: 480 out, 300 in, 220 shaved, which nets to 400.

`IS DISTINCT FROM` is the operator to use rather than `<>`, and the difference matters. A plain `<>` comparison involving a null returns unknown rather than true, so a value that was populated in the source and null in the copy would not be flagged. `IS DISTINCT FROM` treats null as a value like any other and returns true for that case, which is exactly what a reconciliation needs.

## 4. One summary that says everything

The two queries above are what you look at; this is what you report. One row, four numbers, and they have to add up.
    
    
    matched | changed | source_only | target_only | total_keys
         13 |       2 |           1 |           1 |         17

Thirteen rows are identical on both sides. Two exist on both and disagree. One is only in the source and one only in the target. Seventeen distinct keys were involved, which is more than either table has, because the union of two sixteen-row tables that differ by one row each way is seventeen.

Check it in both directions: 13 + 2 + 1 source-only is 16, the source count. 13 + 2 + 1 target-only is 16, the target count. If those two additions do not come out to the two row counts, the key is not unique and section ten is about that.

This table is the deliverable. "The migration is fine" is not a statement anybody can act on; "thirteen rows identical, two changed, one lost, one added, and a net difference of 400 in revenue" is a handover note, and it takes one query.

## 5. Column by column

Once you know two rows disagree, the useful next question is which columns, because that points at the cause rather than the symptom.
    
    
    order_date | rep | region | product | units | unit_price
             0 |   0 |      1 |       0 |     1 |          0

One disagreement in region and one in units, and nothing anywhere else. That shape tells you something a list of bad rows does not: this is not a broken load, because a broken load damages a column across many rows. Two different columns each wrong on one row looks like two separate incidents, probably a manual edit and a transcription.

Contrast it with the shape you would see if, say, every date were shifted by a day: `order_date` would read 16 and everything else 0, and you would go looking at time zones rather than at rows. Same query, completely different conclusion, and it is the column counts rather than the row list that distinguishes them.

Say out loud what you would suspect if `unit_price` came back as 14 out of 16. A rounding or currency difference applied at load, and you would go and read the load code rather than the data.

## 6. The differences an equals sign will not see

Before the explanation: the region on order 1003 is "East" in one table and "east" in the other. Say whether a SQL comparison notices.
    
    
    'East' = 'east'                  false
    LOWER('East') = LOWER('east')    true

In this engine string comparison is case sensitive, so it was caught. Not every engine or column collation behaves that way, and on a case-insensitive collation that row would have been reported as matching. Which is the general lesson: **a reconciliation is only as strict as its comparison.** Test the comparison itself on a known difference before trusting a clean result.

Four kinds of difference routinely slip through a naive comparison. Case, as above. Trailing whitespace, where "North " and "North" differ to a computer and not to a person. Numeric precision, where 10.00 and 10.004 both display as 10.00. And dates carrying a time, where the same day at different hours compares unequal.

There is also a subtler failure worth seeing, because it is what happens when people reconcile by grouping rather than by key. Comparing region counts on the two tables gives this:
    
    
    region | source_rows | target_rows
    East   |           4 |           3
    North  |           5 |           5
    South  |           4 |           4
    West   |           3 |           3
    east   |        NULL |           1

A fifth region has appeared. The grand totals still agree at sixteen, the individual rows are all present, and the report now has a category nobody has ever heard of. That is the same failure mode as any near-duplicate value, and the cleaning routine for it is in [finding the character you cannot see](https://michaelnocito.github.io/analyst-prep-kit/guides/excel-clean-messy-data/).

## 7. Fingerprints: one number per table

Joining two tables row by row is fine at sixteen rows and expensive at two hundred million, especially when they live in different systems and one of them has to be shipped across a network to be compared.

The cheaper move is a fingerprint: hash each row into a number and add the numbers up. Addition does not care about order, so two tables holding the same rows in different orders produce the same total.
    
    
    SELECT SUM(HASH(order_id, order_date, rep, region, product, units, unit_price)) FROM orders;
    
    source  128147106948374048609
    target  136663960016580492445

Different, so the tables differ, and that took one pass over each side with nothing to transfer but a single number. It tells you nothing about where, which is the trade.

You get the where back by fingerprinting groups instead of the whole table. Here, per region:
    
    
    region | same
    East   | false
    North  | true
    South  | true
    West   | false
    east   | false

North and South are provably identical and need no further checking. Everything different is in East, West and the phantom region. On a large table you would fingerprint by month or by key range, find the handful of buckets that differ, and only then do the row-level comparison on those. That is the whole strategy: compare cheaply, narrow, then look closely.

One caution. Hash functions differ between engines, so a fingerprint computed in Postgres will not match one computed in SQL Server, and comparing across systems needs a hash both can compute, usually MD5 of a concatenated, consistently formatted string. Getting the formatting identical on both sides is most of that job.

## 8. What to do with what you find

A reconciliation that ends in a list of differences is half a job. Each category has a different next move.

| Finding                         | Usually means                                                        | Next move                                                           |
|---------------------------------|----------------------------------------------------------------------|---------------------------------------------------------------------|
| Source only                     | Rows dropped by a filter, a failed batch, or a type conversion error | Find the pattern: are they all one date, one region, one product?   |
| Target only                     | A load that ran twice, or test data                                  | Check whether they are duplicates of real keys or entirely new ones |
| Changed, one column, many rows  | A transformation applied at load                                     | Read the load logic. This is a code question, not a data question.  |
| Changed, many columns, few rows | Manual edits after the load                                          | Find out who is allowed to edit the target directly                 |

And write down what you found even when it is small, because the number that matters to the person receiving the system is the money, not the rows. "Four hundred out of 9,890, which is 4.0%, in two rows, both explained" is a sentence somebody can sign off. A migration dry run exists to produce exactly that sentence before anybody depends on the new system, and [the dry run guide](https://michaelnocito.github.io/analyst-prep-kit/guides/migration-dry-run/) is where this fits in the wider process.

## The full before and after

Same two tables, same question: did the copy work?

### Before
    
    
    SELECT COUNT(*) FROM orders;          -- 16
    SELECT COUNT(*) FROM orders_target;   -- 16
    -- "counts match, we are good"

Passed, closed, and wrong. Four hundred of 9,890 is missing, one order has vanished, one order that never existed is now in the system, one order has the wrong quantity, and a fifth region has been created.

### After
    
    
    -- 1. counts and a total, together
    16 rows / 9,890   against   16 rows / 9,490            difference 400
    
    -- 2. keys on one side only
    1008 source only, 1017 target only
    
    -- 3. matched rows that disagree
    1003 region East vs east, 1010 units 5 vs 4
    
    -- 4. the summary, which must add back to both row counts
    matched 13, changed 2, source only 1, target only 1, keys 17
    13 + 2 + 1 = 16 on each side
    
    -- 5. which columns
    region 1, units 1, everything else 0
    
    -- 6. the arithmetic of the difference
    -480 lost, +300 invented, -220 shaved   =   -400

The claim, and it is why the second query is not optional: **a row count of 16 against 16 was true, reassuring, and completely blind to a lost row, an invented row, a changed quantity and an invented region.**

## Edge cases that break a reconciliation

Six worth knowing.

**The key is not unique.** If either side has the key twice, the join multiplies and every count afterwards is wrong. Check both sides first: `COUNT(*)` against `COUNT(DISTINCT key)`, on each table, before joining anything.

**The key is not the same key.** Systems renumber. If the target assigned its own identifiers, you are matching on a natural key, and if there is not one you have crossed into [entity resolution](https://michaelnocito.github.io/analyst-prep-kit/guides/entity-resolution/).

**Legitimate differences.** The target may deliberately exclude cancelled records or hold a different date format. Agree the expected differences in writing before running the comparison, or you will report them as faults.

**Comparing at different moments.** A live source changes while you are checking it, so a difference of a few recent rows may be time rather than error. Snapshot both sides first, which is what [a temp table](https://michaelnocito.github.io/analyst-prep-kit/guides/sql-temp-tables-vs-views/) is for.

**Floating point.** Two systems can compute the same total and disagree in the fifteenth decimal place. Round explicitly to the precision the business cares about before comparing money.

**Nulls compared with the wrong operator.** `<>` silently misses a value-to-null change. Use `IS DISTINCT FROM`, and if your engine lacks it, `COALESCE` both sides to a sentinel value that cannot occur in the data.

## Why this works

The reason the row count feels sufficient and is not is that it measures one dimension of quality and there are several. Frameworks for assessing data quality consistently break it into separate dimensions, completeness, accuracy, consistency and so on, precisely because they fail independently and a measure of one says nothing about the others (Batini, Cappiello, Francalanci, & Maurino, 2009, _ACM Computing Surveys_ , 41(3), 1–52). A row count is a completeness check, and a weak one: it detects missing rows only when nothing arrives to take their place. The four checks on this page each cover a different dimension, which is why they find four different problems, and why running one of them is not most of the job.

The fingerprint strategy in section seven is an old idea with a name. If you hash small pieces of data and then combine those hashes, you can compare two large collections by exchanging almost nothing, and you can then narrow down to the differing part by descending into whichever combined hash disagrees; that hierarchical comparison is the core of Merkle's construction and is why every large-scale synchronisation system uses some version of it (Merkle, 1988, _Advances in Cryptology — CRYPTO '87_ , 369–378). Fingerprinting the whole table, then by region, then by row is that idea done by hand with three queries.

One note on the questions this page asked before each answer. Explaining a step to yourself before being shown the explanation improves what you retain of it, which is why it is worth guessing at the row count before reading the total (Chi, Bassok, Lewis, Reimann, & Glaser, 1989, _Cognitive Science_ , 13(2), 145–182).

## Using this on your own project

A full row-level comparison of a huge table is expensive and usually unnecessary. Do this instead, in order.

  1. **Check the key is unique on both sides** before anything else. Every number after this depends on it.
  2. **Compare counts and a total together.** Never the count alone.
  3. **Fingerprint by a natural bucket** , month or region or key range, and find the buckets that differ.
  4. **Full outer join inside those buckets only** , and classify every key into the four categories.
  5. **Count the disagreements per column** , because the shape names the cause.
  6. **Write the summary as a sentence with money in it** , and list the expected differences separately from the unexpected ones.

If you have paper nearby, one optional sketch is worth five minutes. Draw two boxes and, between them, write the four categories: matched, changed, only left, only right. Then write beside each one what number you would expect it to hold if the copy were perfect. Three of them are zero, and being explicit about that before you run anything is what stops a non-zero being explained away.

**More detail on this, and more like it.** Every how-to sits in one place on the [guides index](https://michaelnocito.github.io/analyst-prep-kit/guides/). If you would rather type queries than read about them, the [SQL Drill](https://michaelnocito.github.io/analyst-prep-kit/drill/) gives you one runnable query at a time against a real database.

## The whole thing on one screen

This is the retrieval sheet. Cover the right column, work down the left, and say each answer out loud before you check it.

| Thing                  | What it does                                                                     |
|------------------------|----------------------------------------------------------------------------------|
| Row count              | Catches nothing loaded, half loaded, doubled. Nothing else.                      |
| Count plus a total     | Catches the whole class the count cannot. Thirty seconds.                        |
| First check of all     | Key uniqueness on both sides: `COUNT(*)` against `COUNT(DISTINCT key)`.          |
| Finding one-sided rows | `FULL OUTER JOIN`, then look at where the nulls are.                             |
| No FULL OUTER JOIN     | Two `NOT EXISTS` anti-joins with `UNION ALL`.                                    |
| Comparing values       | `IS DISTINCT FROM`, never `<>`.                                                  |
| Why                    | `<>` against a null is unknown, so the row is not flagged.                       |
| The four categories    | Matched, changed, source only, target only.                                      |
| The reconciliation     | Matched + changed + one-sided must equal each row count.                         |
| Per-column counts      | One column many rows is a load bug. Many columns few rows is manual edits.       |
| Case and whitespace    | May or may not be caught, depending on collation. Test it.                       |
| Grouped comparison     | Invents a category when a value differs by case. Totals still agree.             |
| Fingerprint            | `SUM(HASH(cols))`. Order independent, one number, no detail.                     |
| Localising             | Fingerprint per bucket, then row-compare only the buckets that differ.           |
| Across systems         | Hash functions differ. Use MD5 of an identically formatted string.               |
| The deliverable        | A sentence with the money in it, and the expected differences listed separately. |

**The one habit to keep.** Never report a row count without a total beside it. The count is the check that agrees while a row is lost and another invented in its place, and the total is the one line of extra work that makes that impossible to miss. If a reconciliation misbehaves in a way this page does not cover, there is a general [diagnosis loop for being stuck](https://michaelnocito.github.io/analyst-prep-kit/guides/technical-tenacity/).

One last thought, and I would genuinely like other people's answers. The one I remember was a migration signed off on matching row counts, where a rerun had dropped one batch and added another, and the two happened to be almost the same size; the difference surfaced four months later as a supplier chasing an invoice that no longer existed in either system. What has a matching row count hidden from you?

## References

  * Batini, C., Cappiello, C., Francalanci, C., & Maurino, A. (2009). Methodologies for data quality assessment and improvement. _ACM Computing Surveys_ , 41(3), 1–52.
  * Merkle, R. C. (1988). A digital signature based on a conventional encryption function. _Advances in Cryptology — CRYPTO '87_ , 369–378.
  * Chi, M. T. H., Bassok, M., Lewis, M. W., Reimann, P., & Glaser, R. (1989). Self-explanations: How students study and use examples in learning to solve problems. _Cognitive Science_ , 13(2), 145–182.

---

*The full version of this guide lives on my site: [How to Reconcile Two Tables in SQL When the Row Counts Match](https://michaelnocito.github.io/analyst-prep-kit/guides/sql-reconciliation/).*

*If it was useful: [Buy Me a Coffee](https://buymeacoffee.com/michaelnocito).*
