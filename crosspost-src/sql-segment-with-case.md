By the end of this page you can turn a table of transactions into named customer groups, count and total each group, cross two segmentations into a matrix, choose between cut-offs you picked and cut-offs the data picked, and prove that every customer landed in exactly one group. It is about twenty-five minutes, and every query and result below was run.

Here is what to do today, on the segmentation you already have. Count the customers in each segment and add them up. If the total is less than your customer count, some rows fell through the conditions and are sitting in a null segment nobody looks at. If any segment has zero customers, the conditions are in the wrong order.

The short version: aggregate to one row per customer, add a `CASE` expression that names the group, then group by that name.

Label first, group second, is the idea, so it gets the picture.

> _The original carries a diagram here. In words: Three panels left to right, joined by arrows. The first panel is a column of twelve horizontal bars of different lengths, standing for twelve customers and how much each spent, in no particular grouping. The second panel repeats the same twelve bars in the same order, but each one now has a small coloured square attached to its left-hand end: three bars carry a dark square, four carry a mid-toned square and five carry a pale square, so every bar has exactly one square and no bar has none. The third panel holds just three stacked blocks, one in each of the three shades, sized in proportion to how many bars carried that shade, and holding the figures 3, 4 and 5. The picture shows that the grouping in the third panel is produced entirely by the squares added in the second, and that the twelve bars are still all accounted for._

**Every result on this page is real.** Twelve customers, nineteen purchases and 2,430 in spend, loaded into DuckDB and queried. Twelve is small enough to check every segment by hand, which is the only way to know a segmentation query is right before it meets a real customer base.

## 1. Get to one row per customer first

Segmentation is about customers, and the transactions table is about purchases, so the first move is always an aggregate. Nothing about the labelling works until the grain is right.
    
    
    SELECT customer_id, COUNT(*) AS purchases, SUM(amount) AS spend,
           MAX(purchase_date) AS last_seen
    FROM purchases GROUP BY 1;
    
    C2  | 3 | 470 | 2026-03-14
    C1  | 3 | 350 | 2026-03-05
    C7  | 2 | 300 | 2026-03-19
    C6  | 2 | 270 | 2026-03-08
    C3  | 2 | 210 | 2026-02-18
    C10 | 1 | 190 | 2026-03-04
    C4  | 1 | 150 | 2026-01-21
    C12 | 1 | 145 | 2026-03-25
    C8  | 1 | 130 | 2026-02-17
    C11 | 1 |  85 | 2026-03-12
    C9  | 1 |  70 | 2026-02-24
    C5  | 1 |  60 | 2026-01-28

Twelve rows, and they sum to 2,430, which is the whole purchases table. Those three columns are the classic ingredients of a customer segmentation: how recently, how often, how much. You do not have to use all three, and you do have to compute them before you can band them.

Do this as a named step rather than nesting it, so the customer count can be checked on its own; the argument for that is in [subquery against CTE](https://michaelnocito.github.io/analyst-prep-kit/guides/sql-subqueries/), and it matters here because everything downstream is divided by that count.

## 2. CASE: the label is just a column

`CASE` reads a condition list from top to bottom and returns the value attached to the first condition that is true.
    
    
    CASE WHEN spend >= 300 THEN 'High'
         WHEN spend >= 150 THEN 'Mid'
         ELSE 'Low'
    END AS segment

What comes out is an ordinary text column. That is the whole idea and it is the thing worth internalising: the segment is not a special kind of object, it is a value computed per row, which means it can be selected, filtered, joined on, counted and, most usefully, grouped by. The mechanics of the expression itself, including the difference between the simple and searched forms, are in [the CASE guide](https://michaelnocito.github.io/analyst-prep-kit/guides/sql-case-expression/).

Because it is computed rather than stored, the definition lives in the query. That is convenient while exploring and a liability once three reports each contain their own slightly different copy, which is what section eight's reconciliation and the note about materialising it are for.

## 3. Group by the label

Put the `CASE` in the select list and group by it, and the segmentation is done.
    
    
    WITH c AS (SELECT customer_id, SUM(amount) AS spend FROM purchases GROUP BY 1)
    SELECT CASE WHEN spend >= 300 THEN 'High'
                WHEN spend >= 150 THEN 'Mid'
                ELSE 'Low' END AS segment,
           COUNT(*) AS customers, SUM(spend) AS spend
    FROM c GROUP BY 1;
    
    High | 3 | 1120
    Mid  | 4 |  820
    Low  | 5 |  490

Three, four and five customers, adding to twelve. Their spend adds to 2,430. Check one by hand: High is C2 at 470, C1 at 350 and C7 at 300, which is 1,120.

And now the finding, which is the point of doing it at all: **three customers out of twelve, a quarter of them, account for 1,120 of 2,430, which is 46% of all spending.** That is a sentence somebody can act on. "We have twelve customers" is not.

Two syntax notes. `GROUP BY 1` means group by the first selected column, which saves repeating the whole `CASE`; most engines also let you group by the alias. And if yours insists on the full expression in both places, that is the moment to move it into a CTE and group by the resulting column name instead of writing it twice, because two copies drift.

## 4. The order that deletes a segment

Before the explanation: the same three bands, with the first two conditions swapped. Predict the three counts.
    
    
    CASE WHEN spend >= 150 THEN 'Mid'
         WHEN spend >= 300 THEN 'High'
         ELSE 'Low' END
    
    Mid | 7 | 1940
    Low | 5 |  490

Two rows, not three. High has not shrunk, it has ceased to exist: every customer who would have been High satisfied the 150 test first and was labelled Mid. There is no error, no warning, and no empty High row to notice, because a group with no rows produces no row.

That last part is what makes this dangerous rather than merely wrong. A segment reporting zero would at least be visible on the page. A segment that is simply absent looks like a segmentation with two bands, and the totals still come to twelve customers and 2,430.

`CASE` takes the first condition that is true, not the best or most specific one, so overlapping conditions are resolved entirely by the order you wrote them in. The rule: **most restrictive first** , which for numeric bands means starting at the top threshold and working down.

The same stopping rule catches people in every language that has one. If you have met it in a spreadsheet, it is the same mechanism as [nested IF against IFS](https://michaelnocito.github.io/analyst-prep-kit/guides/excel-ifs-vs-nested-if/), and the fix is identical.

## 5. Every row must land somewhere

Before the explanation: here are the bands with no `ELSE`, and with the middle boundary set to 151 rather than 150. Say what happens to the customer who spent exactly 150.
    
    
    CASE WHEN spend >= 300 THEN 'High'
         WHEN spend >= 151 THEN 'Mid' END
    
    High | 3 | 1120
    Mid  | 3 |  670
    NULL | 6 |  640

A third segment appeared, called nothing. `CASE` with no matching condition and no `ELSE` returns `NULL`, and `GROUP BY` gathers all the nulls into one group, so six customers and 640 of spend are now in a bucket with no name.

Two separate mistakes produced that, and both are worth being able to see independently. The missing `ELSE` means anything unmatched becomes null instead of landing in a band. The 151 means there is a gap between the bands, so the customer who spent exactly 150 matches neither, which is the boundary problem that every banding scheme has and most banding schemes have not thought about.

Two rules follow, and they are short. **Always write an ELSE.** And **make the bands touch** : if one ends at 150 the next begins at 150, expressed as `>= 150`, so there is nowhere to fall between them.

A useful habit while the segmentation is still being developed: make the `ELSE` say `'check this'` rather than naming a real band. Then anything you did not anticipate arrives labelled as a question rather than quietly joining the bottom group.

## 6. Two dimensions at once

One `CASE` per dimension, both in the select list, group by both, and you have a matrix.
    
    
    frequency | value | customers | spend
    often     | High  |         2 |   820
    twice     | High  |         1 |   300
    twice     | Mid   |         2 |   480
    once      | Mid   |         2 |   340
    once      | Low   |         5 |   490

Five cells rather than nine, because four of the possible combinations have nobody in them. The customers add to twelve and the spend to 2,430.

Read the shape rather than the individual cells. Everybody who bought once is Mid or Low, and everybody who is High bought at least twice, so on this data value and frequency move together. That is the kind of statement a one-dimensional segmentation cannot make, and it is why the matrix is worth the extra `CASE`.

Two practical notes. Empty combinations do not appear as zero rows, they simply do not appear, so if the matrix is going into a report, join it to a grid of all combinations first. And resist going to three dimensions: twenty-seven cells over twelve customers is not a segmentation, it is a list with extra steps.

## 7. Cut-offs you chose, or cut-offs the data chose

The 300 and the 150 came from nowhere. An alternative is to let the distribution decide, with `NTILE`, which sorts the rows and cuts them into equal-sized groups.
    
    
    NTILE(3) OVER (ORDER BY spend DESC)
    
    third | customers | lowest | highest | spend
        1 |         4 |    270 |     470 |  1390
        2 |         4 |    145 |     210 |   695
        3 |         4 |     60 |     130 |   345

Four, four and four by construction. Now compare the two methods customer by customer:
    
    
    customer | spend | fixed | thirds | agree
    C2       |   470 | High  | High   | yes
    C1       |   350 | High  | High   | yes
    C7       |   300 | High  | High   | yes
    C6       |   270 | Mid   | High   | no
    C3       |   210 | Mid   | Mid    | yes
    C10      |   190 | Mid   | Mid    | yes
    C4       |   150 | Mid   | Mid    | yes
    C12      |   145 | Low   | Mid    | no
    C8       |   130 | Low   | Low    | yes
    C11      |    85 | Low   | Low    | yes
    C9       |    70 | Low   | Low    | yes
    C5       |    60 | Low   | Low    | yes

Ten agree and two do not. C6 at 270 is Mid under fixed cut-offs and High under thirds; C12 at 145 is Low under fixed and Mid under thirds. Neither method is wrong, and if those two customers get different treatment, the choice of method is the reason.

Which to use depends on what the segment is for. **Fixed cut-offs** are right when the number means something outside the data: a spend level at which a discount becomes profitable, a threshold in a contract. They are stable over time and can leave a band empty. **Thirds or quartiles** are right for relative questions like "who are our best customers", they always fill every band, and they move: a customer can change segment because other customers changed, without buying anything differently.

Whichever you pick, pick it on purpose and write down why. A cut-off chosen because it is round is a decision dressed as an observation, and [choosing thresholds from the data](https://michaelnocito.github.io/analyst-prep-kit/guides/data-driven-thresholds/) is the longer version of that argument.

## 8. The reconciliation

One query, run every time, and it catches everything on this page.
    
    
    customers_in | customers_out | spend_in | spend_out
              12 |            12 |     2430 |      2430

Customers going into the segmentation against customers coming out of it, and the same for the money. Equal on both counts means every customer landed in exactly one segment and no spend was created or lost.

Each failure on this page shows up here. A missing `ELSE` does not change the totals, because nulls still group, but it does add a segment named nothing, so check the segment list as well as the sums. A duplicated customer key inflates `customers_out`. A join added before the labelling inflates `spend_out`. And a filter applied inside the segmentation but not to the input makes `customers_out` smaller, which is the one people write on purpose and then forget.

The related check is the one from section four: **every segment you defined should appear in the output.** Compare the number of distinct segments returned against the number of labels in your `CASE`. Fewer means one is unreachable.

Picture your own segmentation for a moment. If a whole tier of it had been unreachable since the day it was written, is there anything on the report that would say so?

## The full before and after

Same twelve customers, same question: who matters most?

### Before
    
    
    SELECT CASE WHEN spend >= 150 THEN 'Mid'
                WHEN spend >= 300 THEN 'High' END AS segment,
           COUNT(*) FROM ... GROUP BY 1;
    
    Mid  | 7
    Low  | 0 rows, because there is no ELSE and no High row either

Conditions in the wrong order, so High is unreachable. No `ELSE`, so anybody below 150 becomes a nameless group. Two of the three segments are broken and the query runs perfectly.

### After
    
    
    WITH c AS (
      SELECT customer_id, COUNT(*) AS purchases, SUM(amount) AS spend
      FROM purchases GROUP BY 1                              -- 12 customers, 2,430
    ), labelled AS (
      SELECT *, CASE WHEN spend >= 300 THEN 'High'
                     WHEN spend >= 150 THEN 'Mid'
                     ELSE 'Low' END AS segment
      FROM c
    )
    SELECT segment, COUNT(*) AS customers, SUM(spend) AS spend,
           ROUND(100.0*SUM(spend)/SUM(SUM(spend)) OVER (), 1) AS pct_of_spend
    FROM labelled GROUP BY 1 ORDER BY spend DESC;
    
    High | 3 | 1120 | 46.1
    Mid  | 4 |  820 | 33.7
    Low  | 5 |  490 | 20.2
    
    -- and the check
    customers 12 in, 12 out;  spend 2,430 in, 2,430 out;  3 segments defined, 3 returned

Most restrictive condition first, an `ELSE` that catches everything, the labelling in a named step so it exists once, a share column so the numbers mean something, and a reconciliation.

The claim, and it is why section four is the longest one: **swapping two lines removed a whole customer tier from the report, and the totals still came to twelve customers and 2,430.**

## Edge cases that break a segmentation

Six worth knowing.

**Nulls in the column being banded.** `NULL >= 300` is unknown, not false, so a customer with no spend falls through every condition to the `ELSE` and is labelled Low as if they had spent a little. Test for it first: `WHEN spend IS NULL THEN 'unknown'`.

**Customers with no transactions at all.** They are not in the purchases table, so they are not in the segmentation. If the question is about all customers, start from the customer table and left join, or the churned ones are invisible.

**The window the spend is measured over.** A segmentation with no date filter uses all history, so a customer who was big three years ago outranks one who is big now. State the window in the segment name if it matters, as in "spend in the last twelve months".

**Segments that move on their own.** With `NTILE`, a customer can drop a tier while spending exactly the same, because others rose. That is correct behaviour and it is a surprise in a monthly report unless the report says so.

**Ties at a boundary.** `NTILE` splits by position, not by value, so two customers with identical spend can land in different tiers. If that is unacceptable, band by value instead, or use a ranking function that treats ties together.

**The definition living in five places.** Once more than one report segments customers, the `CASE` gets copied and the copies drift. Put it in a view, so the definition has one home, and read [temp table against view](https://michaelnocito.github.io/analyst-prep-kit/guides/sql-temp-tables-vs-views/) for the trade that comes with it.

## Why this works

The uncomfortable part of segmentation is that the groups are not in the data waiting to be found; they are imposed, and different reasonable choices produce different groups. Reviews of segmentation practice make this explicit: the number of segments, the variables used and the cut-offs are all decisions by the analyst, the methods will happily return groups from data that has no natural grouping at all, and the resulting scheme has to be justified by whether it supports a decision rather than by the procedure that produced it (Punj & Stewart, 1983, _Journal of Marketing Research_ , 20(2), 134–148). Section seven's two disagreeing customers are that in miniature. Neither method found the truth about C6; each applied a different rule.

There is also a cost to banding at all, and it is worth knowing so you spend it deliberately. Cutting a continuous measure into groups throws away the differences within each group: a customer at 300 and one at 470 become the same thing, while 145 and 150 become different things, and analyses that then use the bands are working with less information than the original numbers held (Altman & Royston, 2006, _BMJ_ , 332(7549), 1080). The reason to do it anyway is human rather than statistical. "High, Mid and Low" can be acted on by a team; a column of twelve numbers cannot. Band for communication and decisions, and keep the underlying value in the table for anything that needs the detail.

One note on the cheat sheet below. It is built to be covered and recalled rather than reread, because self-testing improves retention in genuine course settings and not only in short laboratory studies (McDaniel, Anderson, Derbish, & Morrisette, 2007, _European Journal of Cognitive Psychology_ , 19(4–5), 494–513).

## Using this on your own project

Rewriting every segmentation is unnecessary. Do this instead, in order.

  1. **Count the segments returned against the labels defined.** Fewer means one is unreachable, and that check takes ten seconds.
  2. **Add the reconciliation** : customers in against customers out, and the same for the money.
  3. **Reorder the conditions most restrictive first** , and make the bands touch so nothing can fall between them.
  4. **Give every CASE an ELSE** , and make it say "check this" while the definition is still settling.
  5. **Write down why each cut-off is where it is** , in a comment beside it. If the reason is that it is a round number, that is worth knowing too.
  6. **Move the definition into a view** once a second report needs it, so the labels cannot drift apart.

If you have paper nearby, one optional sketch is worth five minutes. Draw a line for your measure, mark your cut-offs on it, and write beside each cut-off the decision that changes when a customer crosses it. Any cut-off with nothing written beside it is a number somebody made up, and that is fine as long as everyone knows.

**More detail on this, and more like it.** Every how-to sits in one place on the [guides index](https://michaelnocito.github.io/analyst-prep-kit/guides/). If you would rather type queries than read about them, the [SQL Drill](https://michaelnocito.github.io/analyst-prep-kit/drill/) gives you one runnable query at a time against a real database.

## The whole thing on one screen

This is the retrieval sheet. Cover the right column, work down the left, and say each answer out loud before you check it.

| Thing                  | What it does                                                                    |
|------------------------|---------------------------------------------------------------------------------|
| Step one               | Aggregate to one row per customer. The grain has to be right first.             |
| The three ingredients  | How recently, how often, how much.                                              |
| CASE                   | Returns the value for the first true condition. An ordinary column.             |
| Grouping by it         | `GROUP BY 1`, or by the alias, or from a CTE.                                   |
| Order of conditions    | Most restrictive first. Highest threshold first for bands.                      |
| Wrong order            | A segment becomes unreachable and does not appear at all.                       |
| No ELSE                | Unmatched rows become NULL and group into a nameless segment.                   |
| A gap in the bands     | The value on the boundary matches nothing. Make the bands touch.                |
| ELSE while developing  | Make it say "check this" rather than naming a real band.                        |
| Two dimensions         | One CASE each, group by both. Empty combinations do not appear.                 |
| Fixed cut-offs         | Stable, meaningful outside the data, can leave a band empty.                    |
| `NTILE(3)`             | Equal-sized groups, always full, and they move when others move.                |
| Here they disagreed    | On two of twelve customers.                                                     |
| Nulls in the measure   | Fall through to the ELSE and get labelled as low. Test for them first.          |
| Customers with no rows | Absent entirely. Start from the customer table and left join.                   |
| The reconciliation     | Customers in equals out, spend in equals out, segments defined equals returned. |

**The one habit to keep.** Compare the number of segments your query returns against the number of labels your `CASE` defines. A segmentation cannot tell you about a tier that is unreachable, because an empty group produces no row at all, and this is the only check that notices. If a segmentation misbehaves in a way this page does not cover, there is a general [diagnosis loop for being stuck](https://michaelnocito.github.io/analyst-prep-kit/guides/technical-tenacity/).

One last thought, and I would genuinely like other people's answers. The one I remember was a tiering scheme where the enterprise threshold sat below the mid-market one in the CASE, so the biggest accounts had been reported as mid-market for two quarters and the top tier simply never appeared on the slide. What has a condition order quietly done to a report you own?

## References

  * Punj, G., & Stewart, D. W. (1983). Cluster analysis in marketing research: Review and suggestions for application. _Journal of Marketing Research_ , 20(2), 134–148.
  * Altman, D. G., & Royston, P. (2006). The cost of dichotomising continuous variables. _BMJ_ , 332(7549), 1080.
  * McDaniel, M. A., Anderson, J. L., Derbish, M. H., & Morrisette, N. (2007). Testing the testing effect in the classroom. _European Journal of Cognitive Psychology_ , 19(4–5), 494–513.

---

*Originally published on Analyst Prep Kit: [Customer Segmentation in SQL With CASE WHEN](https://michaelnocito.github.io/analyst-prep-kit/guides/sql-segment-with-case/)*

*Visit the site for more beginner data analysis guides and free resources: [the full guide archive](https://michaelnocito.github.io/analyst-prep-kit/guides/) covers SQL, Excel, Power BI, Tableau, Python and statistics, and the [practice kits](https://michaelnocito.github.io/analyst-prep-kit/) run in your browser with nothing to install.*

*If it was useful: [Buy Me a Coffee](https://buymeacoffee.com/michaelnocito).*
