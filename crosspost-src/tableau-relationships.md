By the end of this page you can drag a second table onto the canvas and know exactly what Tableau will do with it. You will know what the flexible line between two tables means, why your grand totals stop being wrong when you use one, when you still want a real join instead, and what the two performance settings underneath actually claim about your data. It is about twenty minutes.

Here is what to actually do with it. Open any workbook where two tables are joined, and check one number: a total from the smaller table, like a target or a quota. If that total is far larger than it should be, the join is duplicating it, and the fix is to rebuild the connection as a relationship.

The short version: a join flattens two tables into one before you start. A relationship leaves them separate and lets Tableau write a different query for every view.

One idea decides everything else here, so it gets the picture. It is the difference between combining the data once, up front, and combining it per question.

> _The original carries a diagram here. In words: The picture is in two halves. The upper half, labelled join, shows two small tables merging through a funnel into a single wide flat table of six rows, in which a value from the smaller table is repeated on every row, shown as the same shaded cell appearing six times. A single arrow leads from that one flat table to a single chart. The lower half, labelled relationship, shows the same two small tables side by side, connected by a curved flexible line and never merged. Three separate arrows lead from that pair to three different charts, indicating that each view generates its own query against the tables. The contrast shows that a join produces one fixed combined table used by everything, while a relationship keeps the tables intact and combines them differently for each view._

**This is on the certification.** Relationships arrived in Tableau 2020.2 and are the default today. The Salesforce Certified Tableau Desktop Foundations exam currently tests on Tableau 2022.3, so the relationship model is in scope, not optional history. The [Tableau Desktop Foundations kit](https://michaelnocito.github.io/analyst-prep-kit/tableau-cert/) has practice questions on it.

## 1. What the noodle is

Before the explanation: you drag a second table onto the canvas and a curved line appears between the two. At that moment, has Tableau combined your data yet?

No, and that is the entire idea. Tableau's documentation calls a relationship "a contract between two tables." You are describing how the tables relate, using a shared field. You are not telling Tableau to merge them.

People call that curved line the noodle, and its flexibility is a good visual joke. A join line is a rigid statement about what the combined data looks like. The noodle is a looser promise: these two tables can be matched on this field when a view needs them matched.

The combining happens later, one view at a time. When you build a chart, Tableau looks at which fields you actually used, then writes a query for that specific question. Drag different fields out and it writes a different query. The documentation puts it plainly: Tableau "adjusts join types intelligently and preserves the native level of detail in your data."

**Native level of detail** is the important phrase, and it means what one row of a table represents. One row of an orders table is one order line. One row of a targets table is one month for one region. Those are different things, and a relationship keeps them different instead of forcing them into one shape.

**The noodle is a description, not an instruction.** You are telling Tableau how the tables _could_ be matched. It decides how they actually get matched each time you build a view.

## 2. The inflated total, and why a relationship fixes it

Before the explanation: your region has a sales target of $50,000 for January. You join targets to orders, put the target on a chart, and it reads $4,150,000. Where did that number come from?

From the join repeating it. The targets table has one row per region per month. The orders table has thousands of rows per region per month. Joining them writes the January target onto every single order line, and there were 83 of them. Then `SUM` adds up all 83 copies.

Nothing errored. The chart drew. The number is off by a factor of 83, and only someone who knows the real target will spot it. This is the same duplication covered in [SQL joins](https://michaelnocito.github.io/analyst-prep-kit/guides/sql-joins/), and it is the single most common wrong number in business intelligence work.

A relationship removes it, and the mechanism is worth understanding rather than trusting. Because the tables were never merged, Tableau aggregates each one at its own level of detail first, then brings the results together. It totals the targets among the targets, where each month appears once. It totals the sales among the orders. Then it lines the two answers up.

Say out loud why aggregating first and combining second gives a different answer from combining first and aggregating second, before you read on. That order is the hinge of this whole guide.

The reason is that duplication is created by the combining step. If you aggregate before that step, you are summing the original rows, and there is only one January target to sum. If you aggregate after, you are summing whatever the combining step produced, copies included. Same data, same `SUM`, different answer, and only one of them is the target.

There is a second gain in the same mechanism. With a join, a row that matches nothing can vanish from your analysis. With a relationship, Tableau's documentation states that "unmatched measure values aren't dropped," so a region with no target still shows its sales rather than quietly disappearing.

## 3. The two layers, and how to reach the join one

Before the explanation: relationships are the default now. Does that mean joins are gone from Tableau?

They are not. They moved down a level, and knowing where they went is most of what confuses people returning to Tableau after a few years.

The data source canvas has two layers.

| Layer                                            | What you see              | What it does                                                   |
|--------------------------------------------------|---------------------------|----------------------------------------------------------------|
| **Logical** , the top canvas                     | Tables joined by noodles  | Describes relationships. Tables stay separate.                 |
| **Physical** , opened by double-clicking a table | The familiar Venn circles | Real joins and unions. Merges tables into one before analysis. |

So the answer to the prequestion is that a logical table can itself be built from several physically joined tables. Double-click any table on the top canvas and you drop into its physical layer, where you can join or union as before. Close it, and the result behaves as one logical table that other tables can relate to.

That is also where **unions** live, and unions answer a different question from either. A join or a relationship adds columns by matching on a key. A union stacks rows. If you have a January sales table and a February sales table with identical columns, and you want one table containing all of it, that is a union every time. No matching, no key, just more rows.

## 4. When you still want a join

Before the explanation: if relationships avoid duplication and avoid dropping rows, why would anyone deliberately choose a join?

Because sometimes you want the flattened table, and stating so up front is clearer than leaving it flexible. Three cases where a join is the right call.

**You genuinely want rows removed.** A relationship's habit of keeping unmatched rows is usually a feature and occasionally not what you want. If your analysis is defined as "only orders that were returned," an inner join in the physical layer says that once, permanently, rather than relying on every view to filter correctly.

**The tables are at the same level of detail.** If both tables have one row per order, no duplication is possible, and a join is simple and predictable. The relationship model is solving a problem you do not have.

**You are building a deliberately flat extract.** Sometimes you want one wide table, materialised and fast, for a dashboard that many people open. Making that explicit is reasonable engineering.

Here is the short decision.

| You want                                                   | Use                                         |
|------------------------------------------------------------|---------------------------------------------|
| To add columns from a table at a different level of detail | A relationship                              |
| To add columns from a table at the same level of detail    | Either. A join is predictable.              |
| To stack more rows of the same shape                       | A union                                     |
| To permanently exclude rows that do not match              | An inner join, in the physical layer        |
| To combine data from two separate data sources             | A blend, which is a different feature again |

That last row is worth naming so it does not ambush you. Relationships, joins and unions all combine tables _inside one data source_. Blending combines _two different data sources_ , aggregates each separately, and matches the results on a linking field. Different tool, different canvas, and the one most likely to be confused with a relationship because the outcome sounds similar.

## 5. The performance settings, and what they promise

Before the explanation: Tableau asks you to describe your data's cardinality and referential integrity. If you get one of those answers wrong, what happens?

Click a noodle and you get Performance Options. Both settings default to the cautious answer, and both are promises you are making to Tableau about your data.

**Cardinality** asks how many rows match. One region has many orders, so that side is many. Telling Tableau a side is "one" lets it skip the work of removing duplicates it would otherwise have to guard against.

**Referential integrity** asks whether every record on one side always has a match on the other. If every order always has a valid region, Tableau can use a simpler and faster join internally instead of carefully preserving unmatched rows.

So the answer to the prequestion is that a wrong setting does not throw an error. It changes your numbers. Promise that every order has a region when 400 orders have a blank one, and those 400 can silently drop out of your totals. The default settings are slower and safe, which is the right default.

**Leave these alone until you have a reason.** Change them when a dashboard is genuinely too slow and you can prove the promise is true, not while first building the data source. A performance setting that changes an answer is not a performance setting any more.

## 6. Edge cases and things that surprise people

Before the explanation: you build a view using fields from only one of your two related tables. Does Tableau query the other one?

Six things worth knowing.

**Unused tables are not queried.** This is the answer to the prequestion, and it surprises people who expect the whole model to load. If a view only uses order fields, Tableau does not touch the targets table at all. That is why a large relationship model can still be fast.

**The same measure can total differently in two views.** Once you accept that each view gets its own query, this stops being alarming and starts being the point. It does mean you cannot assume a number matches another sheet just because the field name is the same.

**Grand totals can look wrong when they are right.** With unmatched values preserved, a total may include records that no row in your table displays. Usually that is honest, and it is worth a note on the dashboard rather than a fix.

**Relationships need a shared field, and it has to actually match.** Same values, compatible types. An id stored as text in one table and a number in the other matches nothing, exactly as in SQL.

**You can relate on more than one field.** If a row is only identified by region plus month together, add both to the relationship. A single-field relationship there would match far too much.

**Workbooks built before 2020.2 still use the old model.** Opening one shows a single physical-layer table, not a noodle. Nothing breaks, and nothing upgrades itself. Rebuilding the data source is a deliberate act.

## Why this works

The behaviour here is not a Tableau quirk. It is a direct consequence of what aggregation does, and the same rule governs any tool that combines tables at different levels of detail. Combining first and aggregating second sums duplicated values. Aggregating first and combining second sums original values. The relational model defines a join as the set of matching pairs of rows, which is precisely why a one-row target paired with 83 order lines becomes 83 rows carrying that target (Codd, 1970, _Communications of the ACM_ , 13(6), 377–387). Tableau's relationship model does not repeal that. It reorders the two operations so the duplication never reaches your `SUM`.

The product behaviour described on this page comes from Tableau's own documentation, which is the authority on it. Relate your data (Tableau Help, current version) states that relationships are "a dynamic, flexible way to combine data from multiple tables for analysis," that they "don't merge the tables together," and that unmatched measure values are not dropped. Where a secondary write-up disagrees with that page, the page wins.

There is a second reason this guide keeps asking you to answer before it explains. Learners who explain a worked example to themselves as they go understand it better, and apply it to new problems better, than learners who read the same example straight through (Chi, Bassok, Lewis, Reimann, & Glaser, 1989, _Cognitive Science_ , 13(2), 145–182). Relationships reward that, because the mistake is never in a button. It is in what you believe one row means.

## Using this on your own workbook

Think of a dashboard you have already shared. Does any number on it come from a smaller table, like a target, a budget, a quota or a rate? If so, that is the number to check first.

Rebuilding every data source at once is grim work and you will stop halfway. Do this instead, in order.

  1. **Say the level of detail of each table out loud** before you connect anything. "One row per order line." "One row per region per month." If those differ, you want a relationship.
  2. **Check one known total.** Put a measure from the smaller table on a sheet on its own and compare it to a figure you already know. This is a ten-second test that catches the whole problem.
  3. **Relate on every field the match actually needs.** Region alone is not enough when the real key is region and month.
  4. **Leave the performance settings on their defaults** until a dashboard is measurably slow and you can prove the promise holds.
  5. **Write down which tables are related and on what** , in the workbook or alongside it. The next person cannot see your reasoning in a curved line.

If you have paper nearby and five spare minutes, there is one drawing worth doing, and it is optional. Draw your two tables as boxes, write what one row of each means underneath, and draw the line. Then write the number you expect a total from the small table to be. Checking that guess against Tableau is the fastest audit of a data model there is.

## The whole thing on one screen

This is the retrieval sheet. Cover the right column, work down the left, and say each answer out loud before you check it.

| Concept                     | What it does                                                                                |
|-----------------------------|---------------------------------------------------------------------------------------------|
| Relationship                | A contract describing how two tables can be matched. Does not merge them.                   |
| The noodle                  | The flexible line showing that contract on the logical canvas.                              |
| Logical layer               | The top canvas. Relationships live here. Tables stay separate.                              |
| Physical layer              | Double-click a table. Joins and unions live here. Tables get merged.                        |
| Level of detail             | What one row of a table means. Relationships preserve it.                                   |
| The inflated total          | A join repeats the small table's value on every matching row, then `SUM` counts every copy. |
| Why a relationship fixes it | It aggregates each table first, then combines the results.                                  |
| Unmatched values            | Kept, not dropped, unlike an inner join.                                                    |
| Join                        | Adds columns by matching a key, and merges the tables permanently.                          |
| Union                       | Stacks rows of the same shape. No key involved.                                             |
| Blend                       | Combines two separate data sources, aggregating each first. Different feature.              |
| Cardinality                 | How many rows match on each side. One or many.                                              |
| Referential integrity       | Whether every record always has a match. Getting it wrong changes numbers, not just speed.  |
| Unused tables               | Not queried at all if no field from them is in the view.                                    |
| Introduced                  | Tableau 2020.2. The default since. Older workbooks keep the old model.                      |

**The one habit to keep.** If you take nothing else from this page, say the level of detail of both tables out loud before you connect them. Different levels of detail is the whole reason relationships exist, and hearing yourself say "one row per order" and "one row per month" tells you which tool you need before you touch anything.

One last thought, and I would genuinely like other people's answers. The inflated target is the version of this everyone eventually meets, because a target is a number people already know by heart. What is the number that finally made you check your data model, and how far off was it?

## References

  * Tableau. Relate your data. _Tableau Desktop and Web Authoring Help_ , current version. help.tableau.com. The authority for the product behaviour described here.
  * Codd, E. F. (1970). A relational model of data for large shared data banks. _Communications of the ACM_ , 13(6), 377–387.
  * Chi, M. T. H., Bassok, M., Lewis, M. W., Reimann, P., & Glaser, R. (1989). Self-explanations: How students study and use examples in learning to solve problems. _Cognitive Science_ , 13(2), 145–182.

---

*The full version of this guide lives on my site: [Tableau Relationships: What the Noodle Actually Does](https://michaelnocito.github.io/analyst-prep-kit/guides/tableau-relationships/).*

*If it was useful: [Buy Me a Coffee](https://buymeacoffee.com/michaelnocito).*
