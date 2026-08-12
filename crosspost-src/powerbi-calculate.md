By the end of this page you can predict what CALCULATE will return before you write it, explain why the same measure gives 5,060 on every row of one table and a different number on every row of another, and use KEEPFILTERS on purpose rather than by copying somebody. It rests on one rule, stated in Microsoft's own documentation, and everything else on this page follows from it.

Here is what to actually do today. Take any CALCULATE you have written and ask one question about each of its filter arguments: is the visual already filtering that same column? If yes, your filter replaces the visual's. If no, your filter is added to it. That question is the whole mechanism, and asking it takes five seconds.

The short version: a measure runs inside a set of filters, and CALCULATE changes that set before running it. A filter on a column already in the set overwrites what was there. A filter on any other column joins it.

The replace-against-add difference is the entire page, so it gets the picture.

> _The original carries a diagram here. In words: Two rows of the same three-part arrangement, one above the other. In each row, a rounded box on the left holds a small rounded chip, an arrow runs from that box to a rounded box on the right, and a second chip drops into the arrow from above, so it is arriving as the arrow is followed. In the upper row the left box holds a chip reading Chair, and the arriving chip reads Desk. In the right-hand box of that row there is only one chip, reading Desk, and the Chair chip is shown again faintly behind it with a diagonal line struck through it, so it reads as having been replaced. A small label at the far left of the row reads Product. In the lower row the left box holds a chip reading East and the arriving chip again reads Desk. In the right-hand box of that row there are two chips stacked one above the other, East and Desk, both drawn solid, so it reads as having gained a chip rather than swapped one. A small label at the far left of that row reads Region._

**Every number on this page is real.** Sixteen orders and a three-row product table, the same fixture used across these guides. Every DAX behaviour described here is stated in Microsoft's own reference documentation, quoted in the "why this works" section, rather than inferred. If measures against calculated columns is still fuzzy, [columns vs measures](https://michaelnocito.github.io/analyst-prep-kit/guides/powerbi-measures-vs-columns/) comes first.

**Orders** , the fact table. Sixteen rows.

| OrderID | Region | Product | Units | Revenue |
|---------|--------|---------|-------|---------|
| 1001    | North  | Desk    | 4     | 880     |
| 1002    | South  | Chair   | 10    | 850     |
| 1003    | East   | Desk    | 3     | 660     |
| 1004    | North  | Lamp    | 6     | 240     |
| 1005    | South  | Desk    | 3     | 660     |
| 1006    | East   | Chair   | 8     | 680     |
| 1007    | North  | Chair   | 5     | 425     |
| 1008    | West   | Lamp    | 12    | 480     |
| 1009    | South  | Lamp    | 7     | 280     |
| 1010    | East   | Desk    | 5     | 1,100   |
| 1011    | North  | Desk    | 2     | 440     |
| 1012    | West   | Chair   | 9     | 765     |
| 1013    | East   | Lamp    | 15    | 600     |
| 1014    | North  | Chair   | 6     | 510     |
| 1015    | South  | Desk    | 4     | 880     |
| 1016    | West   | Desk    | 2     | 440     |

**Products** , the dimension table, joined one-to-many to Orders on Product.

| Category  | Product | ListPrice | Cost |
|-----------|---------|-----------|------|
| Furniture | Desk    | 220       | 140  |
| Furniture | Chair   | 85        | 52   |
| Lighting  | Lamp    | 40        | 22   |

Total revenue is 9,890 across 101 units. Desks are 5,060 of it, chairs 3,230 and lamps 1,600.

## 1. What filter context is, in one sentence

Before the definition: you put a measure `Total Revenue = SUM(Orders[Revenue])` into a table sliced by product. It shows 5,060 next to Desk and 3,230 next to Chair. Say what made those two numbers different, given that the measure never mentions Product.

The visual did. **Filter context** is the set of filters in force when a measure is evaluated, and it is assembled from everything on the report: the row the measure is sitting in, the columns, the slicers, the page filters, the cross-highlighting from another visual. The measure does not know or care where they came from. It just runs against whatever rows survive.

So a measure has no fixed answer. `SUM(Orders[Revenue])` is 9,890 with nothing filtered, 5,060 in the Desk row, 3,040 in the East row, and 1,760 in a cell where Desk and East cross. One formula, one meaning, and a different number in every cell, which is the entire point of a measure and is covered from the other side in [columns vs measures](https://michaelnocito.github.io/analyst-prep-kit/guides/powerbi-measures-vs-columns/).

The useful mental picture is a set of allowed values per column. Before any filtering, every column allows everything. A table sliced by product puts Product into that set with exactly one allowed value in each row. CALCULATE is the function that edits the set.

## 2. The rule: added, or overwritten

Before the rule: you write `CALCULATE([Total Revenue], Products[Product] = "Desk")` and drop it into a table sliced by product. Predict what appears in the Chair row, before reading on.

5,060, the same as the Desk row, and it is not a bug. Microsoft's reference page states the rule in two lines, and it is worth reading slowly:

If the columns or tables aren't in the filter context, new filters are added to the filter context to evaluate the expression. If the columns or tables are already in the filter context, the existing filters are overwritten by the new filters.

In the Chair row, Product is already in the filter context, restricted to Chair. Your filter names the same column, so it overwrites: Product is now restricted to Desk. The measure runs and returns Desk's 5,060, and it does that in every row of the table, because every row's Product filter is overwritten by the same one.

Say out loud why the total row also shows 5,060 rather than 9,890. The total row has no Product filter of its own, so there is nothing to overwrite. The Desk filter is added instead, and the answer is Desk's total. Same rule, and this time the "added" branch of it.
    
    
    Total Revenue = SUM ( Orders[Revenue] )
    
    Desk Revenue =
    CALCULATE ( [Total Revenue], Products[Product] = "Desk" )

| Product   | Total Revenue | Desk Revenue |
|-----------|---------------|--------------|
| Chair     | 3,230         | 5,060        |
| Desk      | 5,060         | 5,060        |
| Lamp      | 1,600         | 5,060        |
| **Total** | **9,890**     | **5,060**    |

## 3. The same measure in two visuals

Before the table: take that identical `Desk Revenue` measure and put it in a table sliced by _region_ instead. Predict whether every row shows 5,060 again.

They do not, and this is the moment the rule stops being a fact and becomes useful.

| Region    | Total Revenue | Desk Revenue |
|-----------|---------------|--------------|
| East      | 3,040         | 1,760        |
| North     | 2,495         | 1,320        |
| South     | 2,670         | 1,540        |
| West      | 1,685         | 440          |
| **Total** | **9,890**     | **5,060**    |

Here the visual filters Region, and the measure filters Product. Different columns, so nothing is overwritten and both filters apply. East's 1,760 is East's two desk orders, 660 plus 1,100. And the four regional figures add to 5,060, which is the check that both filters are really in force.

One measure, written once, behaving two ways. Neither behaviour is special-cased; both come out of the same sentence in the documentation. This is why "CALCULATE overwrites filters" and "CALCULATE adds filters" are both things people say and both are half the rule.

Now picture a measure in your own model that returns the same number in every row of one visual and sensible numbers in another. Which column is it filtering, and is that the column the broken visual is sliced by?

## 4. KEEPFILTERS, for when you wanted both

Before the fix: in the product table, you actually wanted the Chair row to show desk-and-chair revenue, which is nothing, rather than all desks. Say what you need CALCULATE to do differently.

You need it to intersect rather than replace, and there is a function whose entire job is that. Microsoft lists KEEPFILTERS among the filter modifiers with the description "Add filter without removing existing filters on the same columns."
    
    
    Desk Revenue Kept =
    CALCULATE ( [Total Revenue], KEEPFILTERS ( Products[Product] = "Desk" ) )

| Product   | Desk Revenue | Desk Revenue Kept |
|-----------|--------------|-------------------|
| Chair     | 5,060        | (blank)           |
| Desk      | 5,060        | 5,060             |
| Lamp      | 5,060        | (blank)           |
| **Total** | **5,060**    | **5,060**         |

The Chair row now asks for rows that are both Chair and Desk. There are none, the measure has nothing to sum, and DAX returns blank rather than zero. Blank rows are hidden by default in most visuals, which is usually what you wanted.

Which of the two is correct depends entirely on the question. "How much do desks bring in, regardless of what this row is about?" is the first measure, and it is genuinely what you want as the denominator of a share. "How much of this row is desks?" is the second. Deciding which sentence you meant is the work; the function is just the switch.

## 5. Removing filters: percent of total

Before the technique: you want each region's share of total revenue. The numerator is easy. Say what makes the denominator hard, before reading on.

The denominator has to ignore the row it is sitting in. In the East row, the filter context restricts Region to East, and you need a number computed as if it did not. That is what REMOVEFILTERS is for.
    
    
    Revenue % of Total =
    DIVIDE (
        [Total Revenue],
        CALCULATE ( [Total Revenue], REMOVEFILTERS ( Orders[Region] ) )
    )

| Region    | Total Revenue | Denominator | Revenue % of Total |
|-----------|---------------|-------------|--------------------|
| East      | 3,040         | 9,890       | 30.7%              |
| South     | 2,670         | 9,890       | 27.0%              |
| North     | 2,495         | 9,890       | 25.2%              |
| West      | 1,685         | 9,890       | 17.0%              |
| **Total** | **9,890**     | **9,890**   | **100.0%**         |

Three notes that save time later. Use `DIVIDE` rather than the slash, because it returns blank on a zero denominator instead of an error. Remove filters from the specific column you are slicing by, not from the whole table, or a slicer on another column will stop working. And `ALL` does the same job as REMOVEFILTERS in this position; Microsoft's own note says that if your tool supports REMOVEFILTERS, use it, because ALL doubles as a table-returning function and is easier to misread.

The variant worth knowing is `ALLSELECTED`, which removes the filters coming from inside the visual but respects slicers and page filters. Percentages built with REMOVEFILTERS always add to 100 percent of everything; percentages built with ALLSELECTED add to 100 percent of what the user has currently chosen. Both are defensible and they are different reports.

## 6. Context transition, the other job CALCULATE does

Before the second job: CALCULATE with no filter arguments at all looks pointless. Predict what it could possibly be for, before reading on.

It converts **row context** into filter context. Microsoft's page is explicit: "Using the CALCULATE function without filters achieves a specific requirement. It transitions row context to filter context."

Row context is what you have when you are standing on one row: inside a calculated column, or inside an iterator like SUMX. It lets you read that row's values. It does _not_ filter anything, which is the fact that surprises people, because it feels like it should.

Here is the demonstration. Add a calculated column to the three-row Products table.
    
    
    -- calculated column on Products, no CALCULATE
    Revenue Wrong = SUM ( Orders[Revenue] )
    
    -- calculated column on Products, with CALCULATE
    Revenue Right = CALCULATE ( SUM ( Orders[Revenue] ) )

| Product | Revenue Wrong | Revenue Right |
|---------|---------------|---------------|
| Desk    | 9,890         | 5,060         |
| Chair   | 9,890         | 3,230         |
| Lamp    | 9,890         | 1,600         |

Without CALCULATE, you are standing on the Desk row and can see the word "Desk", and nothing is filtered, so the sum is the whole table: 9,890 on every row. With CALCULATE, the row you are standing on becomes a filter on Products, that filter travels down the relationship to Orders, and you get 5,060.

The same thing happens inside SUMX, and there is one shortcut worth memorizing: when you reference a model measure inside a row context, the transition is automatic. Microsoft states it plainly: "When you use a model measure in row context, context transition is automatic." That is why `SUMX(Products, [Total Revenue])` gives 9,890 and not 29,670. The measure reference is doing an invisible CALCULATE.

Say in one sentence why this is the single most common source of confusion in DAX. It is because the same function does two unrelated-looking jobs, and the second one happens silently every time you use a measure inside an iterator.

## 7. What a boolean filter argument may not contain

Before the rules: `Products[Product] = "Desk"` is a boolean filter. Guess what happens if you write `Orders[Revenue] > [Average Order]` instead, where the right side is a measure.

It errors. Microsoft's page lists the constraints on a boolean filter expression and they are strict:

  * It can reference columns from a single table.
  * It can't reference measures.
  * It can't use a nested CALCULATE function.
  * It can't use functions that scan or return a table unless you pass them as arguments to aggregation functions.

Every one of those is fixed the same way: use `FILTER`, which takes a table and a condition and returns the rows that survive, and which has none of those restrictions.
    
    
    Above Average Revenue =
    VAR AvgOrder = AVERAGE ( Orders[Revenue] )       -- 618.125
    RETURN
        CALCULATE (
            [Total Revenue],
            FILTER ( Orders, Orders[Revenue] > AvgOrder )
        )
    -- 6,475, across the 8 orders above the average

Two things worth taking from that. The `VAR` computes the average once, in the outer filter context, before FILTER starts iterating, which is almost always what you meant. And FILTER is a table filter rather than a boolean one, so it replaces the whole table's filters on the columns it touches, which is why `FILTER(Orders, ...)` over a big fact table is slower than a boolean filter and should be aimed at the smallest table that will do.

The rule of thumb: reach for a boolean filter first because it is faster and clearer, and switch to FILTER only when the condition needs a measure, two tables, or a comparison against something computed.

## The full before and after

Same requirement both times: a table by region showing revenue, desk revenue, and each region's share.

### Before
    
    
    Desk Share =
    DIVIDE (
        CALCULATE ( SUM ( Orders[Revenue] ), Orders[Product] = "Desk" ),
        SUM ( Orders[Revenue] )
    )

It works in a region table and breaks the moment somebody adds Product to the visual, because then the numerator's Product filter overwrites the row's and every product row shows desks over its own total. There is also a hidden dependency: it filters `Orders[Product]`, so it silently stops matching the Products dimension if the model is ever tidied.

### After
    
    
    Total Revenue = SUM ( Orders[Revenue] )
    
    Desk Revenue =
    CALCULATE ( [Total Revenue], KEEPFILTERS ( Products[Product] = "Desk" ) )
    
    Revenue % of Total =
    DIVIDE (
        [Total Revenue],
        CALCULATE ( [Total Revenue], REMOVEFILTERS ( Orders[Region] ) )
    )

Three measures instead of one expression. The base measure is defined once and reused, so a change to how revenue is summed happens in one place. KEEPFILTERS makes the desk measure honest in any visual, including one sliced by product. And the share measure names the exact column it ignores, so a slicer on anything else keeps working. Same numbers in the original visual, and none of them fall over when the visual changes.

## Edge cases that catch people out

Six that each cost somebody an afternoon.

**Two filters on the same column in one CALCULATE.** They are combined with AND, so `Products[Product] = "Desk", Products[Product] = "Chair"` returns blank rather than both. For either-or, write one argument with `||`, or use `IN { "Desk", "Chair" }`.

**Filtering the fact table when you meant the dimension.** `Orders[Product] = "Desk"` and `Products[Product] = "Desk"` give the same answer here and behave differently the moment a product exists in the dimension with no orders. Filter the dimension by default; that is what dimensions are for, as [the star schema guide](https://michaelnocito.github.io/analyst-prep-kit/guides/powerbi-star-schema/) covers.

**Expecting blank and zero to behave alike.** A measure with no rows returns blank, blank rows are hidden by most visuals, and `0 + BLANK()` is 0 while `BLANK() + BLANK()` is blank. If you need a visible zero, wrap it: `[Measure] + 0`.

**ALL on a table when you meant one column.** `ALL(Orders)` removes every filter on every column of the fact table, so a slicer the user set is silently ignored. Name the column.

**A measure that works until somebody adds a slicer.** If the measure hard-codes a filter on a column, the slicer on that column stops doing anything, and no error appears. This is the number one cause of "the report is wrong but only for some users".

**FILTER over the fact table on a large model.** Correct and slow. It iterates every row. Filter the dimension, or use a boolean filter, unless the condition genuinely needs the fact rows.

## Why this works

Filter context is set semantics, and reading it that way makes the replace-against-add rule obvious rather than arbitrary. A filter context is a set of allowed values for each column, and a query returns the rows whose values are in every one of those sets. CALCULATE replaces the set for any column it names and leaves the others alone, so a second filter on Product cannot coexist with the first, and a filter on Product alongside one on Region simply intersects. That is the relational algebra of selection over a product of attribute domains, which is the footing SQL and DAX both inherit (Codd, 1970, _Communications of the ACM_ , 13(6), 377–387). KEEPFILTERS opts out of the replacement and asks for the intersection instead, which is why it can produce an empty set and a blank result.

The specific behaviours on this page are product behaviour, not research findings, so the authority for them is the vendor's own reference documentation rather than a journal. Every rule quoted above comes from Microsoft's DAX reference for CALCULATE, which states the add-or-overwrite rule, the context transition behaviour, the automatic transition for model measures, and the constraints on boolean filter expressions. Those pages are listed in the references and are worth reading directly; they are short, precise, and more reliable than any summary of them, including this one.

One note on why this page kept asking you to predict before showing you the answer. Attempting an answer before seeing the correct one reliably improves how well the correct one is retained, even when the attempt is wrong (Bisra, Liu, Nesbit, Salimi, & Winne, 2018, _Educational Psychology Review_ , 30(3), 703–725). The 5,060 in the Chair row sticks because you were asked to guess it first, and most people guess blank.

## Using this on your own model

Auditing every measure in an inherited model is miserable and you will stop at the sixth. Do this instead, in order.

  1. **Define one base measure per number** and build everything else from it. `[Total Revenue]` once, then reference it. Nothing else keeps a model maintainable.
  2. **For each CALCULATE, name the column it filters** and check whether any visual slices by that column. That one check finds most broken measures.
  3. **Add KEEPFILTERS** wherever you meant "of this row" rather than "regardless of this row".
  4. **Use REMOVEFILTERS on named columns** , never on whole tables, for any percent-of-total.
  5. **Test every measure in two visuals** , one sliced by the column it filters and one not. If it behaves the same in both, you have not tested it.

If you have paper nearby, one optional drawing is worth five minutes. Draw a box for the filter context with a chip in it for each filtered column, then draw your own CALCULATE's filter arriving. Deciding by hand whether it lands on an occupied chip or an empty space is the whole skill, and doing it with a pen once makes it automatic.

**More detail on this, and more like it.** Every how-to sits in one place on the [guides index](https://michaelnocito.github.io/analyst-prep-kit/guides/): SQL, Python, Excel, Power BI and the working habits around them.

## The whole thing on one screen

This is the retrieval sheet. Cover the right column, work down the left, and say each answer out loud before you check it.

| Idea                        | What it means                                                                                       |
|-----------------------------|-----------------------------------------------------------------------------------------------------|
| Filter context              | The set of filters a measure runs inside. Rows, columns, slicers, page filters, cross-highlighting. |
| The rule                    | Filter on a column already filtered: overwritten. Filter on any other column: added.                |
| Same measure, product table | 5,060 in every row, because Product is overwritten each time.                                       |
| Same measure, region table  | 1,760 / 1,320 / 1,540 / 440, because Region survives and Product joins.                             |
| The check                   | Those four add to 5,060. If they did not, one of the filters was lost.                              |
| KEEPFILTERS                 | Intersect instead of replace. Chair row becomes blank, not 5,060.                                   |
| Blank vs zero               | No rows gives blank. Blank rows are hidden by most visuals. Add 0 to force a zero.                  |
| REMOVEFILTERS               | Drop filters from a named column. The denominator of any percent of total.                          |
| ALL vs REMOVEFILTERS        | Same job here. Prefer REMOVEFILTERS; ALL is also a table function and reads ambiguously.            |
| ALLSELECTED                 | Ignore the visual's own filters but respect slicers. A different, valid percentage.                 |
| Context transition          | CALCULATE with no filters turns the current row into a filter. 9,890 becomes 5,060.                 |
| Automatic transition        | Referencing a model measure inside a row context transitions for you, invisibly.                    |
| Boolean filter limits       | One table, no measures, no nested CALCULATE, no table functions outside aggregations.               |
| FILTER                      | The escape hatch for all of those. Slower. Aim it at the smallest table that works.                 |
| Two filters, same column    | Combined with AND, so they cancel. Use `                                                            | |` or `IN`. |
| The test                    | Try every measure in two visuals, one sliced by the column it filters and one not.                  |

**The one habit to keep.** For every CALCULATE you write, say out loud which column it filters and whether the visual already filters that column. Added or overwritten is the only question, and answering it before you run the report is faster than debugging it afterwards. If a measure breaks in a way this page does not cover, there is a general [diagnosis loop for being stuck](https://michaelnocito.github.io/analyst-prep-kit/guides/technical-tenacity/).

One last thought, and I would genuinely like other people's answers. The first CALCULATE I shipped returned the same number in every row of a table and I spent an afternoon convinced the data was broken. What is the measure in your model that behaves differently in two visuals, and have you worked out which column it is filtering?

## References

  * Codd, E. F. (1970). A relational model of data for large shared data banks. _Communications of the ACM_ , 13(6), 377–387.
  * Bisra, K., Liu, Q., Nesbit, J. C., Salimi, F., & Winne, P. H. (2018). Inducing self-explanation: A meta-analysis. _Educational Psychology Review_ , 30(3), 703–725.
  * Microsoft. _CALCULATE function (DAX)_ , DAX reference. The source of every quoted rule on this page: add-or-overwrite, context transition, automatic transition for model measures, and the constraints on boolean filter expressions. Product documentation rather than peer-reviewed research, which is the correct authority for how a product behaves.
  * Microsoft. _KEEPFILTERS function (DAX)_ and _REMOVEFILTERS function (DAX)_ , DAX reference.

---

*Originally published on Analyst Prep Kit: [CALCULATE and Filter Context in DAX, Explained on Sixteen Rows](https://michaelnocito.github.io/analyst-prep-kit/guides/powerbi-calculate/)*

*Visit the site for more beginner data analysis guides and free resources: [the full guide archive](https://michaelnocito.github.io/analyst-prep-kit/guides/) covers SQL, Excel, Power BI, Tableau, Python and statistics, and the [practice kits](https://michaelnocito.github.io/analyst-prep-kit/) run in your browser with nothing to install.*

*If it was useful: [Buy Me a Coffee](https://buymeacoffee.com/michaelnocito).*
