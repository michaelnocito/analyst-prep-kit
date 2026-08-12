By the end of this page you can look at any DAX aggregation and say which of the two it needs, before you write it. You will also be able to spot the wrong one in somebody else's model, including the version that returns a number close enough to pass. It takes about twenty minutes. Every figure below is printed next to the arithmetic that produced it, so you can check any of them on paper.

Here is the move. If the number you want to add up already sits in a column, use `SUM(Orders[Units])`. If it has to be worked out on each row first, use `SUMX(Orders, Orders[Units] * Orders[UnitPrice])`: a table, then the calculation to run on every row of it.

The short version: SUM adds a column that already exists. SUMX builds a value on each row, then adds those up.

The mistake that follows from missing this is worth seeing as a picture, because the arithmetic explains itself once you have.

> _The original carries a diagram here. In words: Two square grids sit side by side, each one sixteen cells wide and sixteen cells tall, one cell for every possible pairing of an order's quantity with an order's price. The left grid, labeled SUM times SUM, is completely filled in: all two hundred and fifty six cells are solid, because multiplying one total by another total combines every quantity with every price, including the pairs that came off different order lines and never occurred together. The right grid, labeled SUMX, is almost entirely empty outlines, with a single unbroken line of sixteen solid cells running corner to corner from top left to bottom right. Those sixteen are the pairings where the quantity and the price came off the same order line. The left grid is a solid block; the right grid is a thin diagonal stripe on an empty field._

**Every number on this page is checkable.** It runs on the sixteen-order fixture used across these Power BI guides, and every result is printed beside its arithmetic in the form 4 × 220 = 880. Every DAX behavior described is quoted from Microsoft's own reference pages in the "why this works" section rather than inferred. If measures against calculated columns is still fuzzy, [columns vs measures](https://michaelnocito.github.io/analyst-prep-kit/guides/powerbi-measures-vs-columns/) comes first.

**Orders** , the fact table. Sixteen rows. The unit price is stamped on the line, which is what an order table does so that a later price change does not rewrite last year's sales.

| OrderID | Region | Product | Units | UnitPrice |
|---------|--------|---------|-------|-----------|
| 1001    | North  | Desk    | 4     | 220       |
| 1002    | South  | Chair   | 10    | 85        |
| 1003    | East   | Desk    | 3     | 220       |
| 1004    | North  | Lamp    | 6     | 40        |
| 1005    | South  | Desk    | 3     | 220       |
| 1006    | East   | Chair   | 8     | 85        |
| 1007    | North  | Chair   | 5     | 85        |
| 1008    | West   | Lamp    | 12    | 40        |
| 1009    | South  | Lamp    | 7     | 40        |
| 1010    | East   | Desk    | 5     | 220       |
| 1011    | North  | Desk    | 2     | 220       |
| 1012    | West   | Chair   | 9     | 85        |
| 1013    | East   | Lamp    | 15    | 40        |
| 1014    | North  | Chair   | 6     | 85        |
| 1015    | South  | Desk    | 4     | 220       |
| 1016    | West   | Desk    | 2     | 220       |

**Products** , the dimension table, joined one-to-many to Orders on Product.

| Category  | Product | ListPrice | Cost |
|-----------|---------|-----------|------|
| Furniture | Desk    | 220       | 140  |
| Furniture | Chair   | 85        | 52   |
| Lighting  | Lamp    | 40        | 22   |

There are 101 units in total, and no revenue column anywhere. Revenue is the number you have to build.

## 1. The fork: is the number already in a column?

Before the explanation, one question worth answering from memory. Think of the last measure you wrote. Say whether the values it added up were already stored somewhere, or whether the model had to work each one out first.

That question decides which function you reach for, and it has two answers.

**Answer one: the number is already in a column.** Units, Revenue, Amount, Headcount. Somebody stored it, one value per row, and adding it up is the whole job. If that is true you want `SUM`, and you hand it the column.

**Answer two: the number does not exist yet.** Line revenue when the table only has units and a price. Margin when the cost lives on another table. Weighted score, extended amount, anything with an operator in the middle of it. If that is true, something has to visit each row, work the value out there, and only then add them up. That something is `SUMX`.

What decides between them is not how complicated the formula looks. It is whether you could point at a column in the Fields pane and say "that one". If you can, it is SUM. If you have to describe a calculation instead, it is SUMX.

It matters because picking the wrong one does not always produce an error. Sometimes it produces a number, and the next three sections are about what that number is and why it survives.

## 2. What SUM will and will not accept

Microsoft's reference page for SUM gives it one parameter, and describes it in six words: "The column that contains the numbers to sum." Not an expression. A column.

So this does not work, and it is the single most common thing a new Power BI user types:
    
    
    Revenue = SUM ( Orders[Units] * Orders[UnitPrice] )

Power BI refuses it with a message that is unusually direct for a formula engine: _The SUM function only accepts a column reference as an argument._ Nothing is stored in the model called `Units * UnitPrice`, so there is no column to hand over.

That refusal is the helpful outcome. It stops you at the point of the mistake. The damaging version is the one that compiles, which is what happens when somebody works around the error by summing each column on its own:
    
    
    Revenue = SUM ( Orders[Units] ) * SUM ( Orders[UnitPrice] )

Two columns, two legal SUMs, one multiplication. Power BI accepts it without complaint, because there is nothing wrong with it as DAX. It is only wrong as arithmetic.

## 3. The failure: 2,630 that reads 12,995

Take the first four orders and do it by hand. Four rows is small enough to check every step, and the shape of the error is identical at sixteen rows or sixteen million.

| OrderID | Units | UnitPrice | Line revenue  |
|---------|-------|-----------|---------------|
| 1001    | 4     | 220       | 880 (4 × 220) |
| 1002    | 10    | 85        | 850 (10 × 85) |
| 1003    | 3     | 220       | 660 (3 × 220) |
| 1004    | 6     | 40        | 240 (6 × 40)  |

The right answer is **2,630** , because 880 + 850 + 660 + 240 = 2,630. That is what SUMX returns: it works out each line, then adds the four results.

Now the version that compiles. SUM(Units) is 4 + 10 + 3 + 6 = 23. SUM(UnitPrice) is 220 + 85 + 220 + 40 = 565. Multiply them and you get **12,995** , because 23 × 565 = 12,995.

Before reading on, say why 12,995 is so much bigger than 2,630. It is not rounding and it is not a doubled join. Say what those extra 10,365 are made of.

They are pairings that never happened. Multiplying two totals is the same as adding up every quantity crossed with every price: order 1001's four units at order 1002's price of 85, order 1004's six units at the desk price of 220, and so on through all sixteen combinations. Four rows produce 4 × 4 = 16 pairings. Only four of them are real, the ones where the quantity and the price came off the same line, and those four are the 2,630.

The gap is the other twelve: 12,995 minus 2,630 = 10,365.

Run the same thing on the full sixteen orders and the numbers get louder. SUMX returns **9,890**. SUM(Units) is 101, SUM(UnitPrice) is 2,125, and 101 × 2,125 = **214,625**. Sixteen rows means 16 × 16 = 256 pairings, and 240 of them are fiction.

Here is the working measure.
    
    
    Total Revenue =
    SUMX ( Orders, Orders[Units] * Orders[UnitPrice] )

Read it as two arguments doing two jobs. `Orders` is the table to walk. `Orders[Units] * Orders[UnitPrice]` is the calculation to run while standing on each row of it. SUMX adds the sixteen results.

## 4. Why nobody catches it: slice to one row and both agree

Before the explanation, a prediction. You have a table visual showing revenue, and you drill all the way down to a single order to check the measure. Say whether the broken version and the working version show the same figure in that cell.

They do, exactly, and this is the part worth carrying away from the page.

Filter the visual to order 1001 alone. SUMX walks one row and returns 4 × 220 = 880. The broken measure computes SUM(Units) over that one row, which is 4, and SUM(UnitPrice) over that one row, which is 220, then multiplies: 4 × 220 = 880. Identical.

That is not a coincidence about this fixture. With one row there is only one pairing available, so "every pairing" and "the real pairing" are the same set. The two measures cannot disagree.

| What the visual is sliced to | Broken measure   | Working measure |
|------------------------------|------------------|-----------------|
| Order 1001 alone             | 880              | 880             |
| Order 1013 alone             | 600 (15 × 40)    | 600 (15 × 40)   |
| Lamps, four orders           | 6,400 (40 × 160) | 1,600           |
| All sixteen orders           | 214,625          | 9,890           |

The lamp row needs its own line, because it is the one that shows where the agreement stops. Lamps are four orders of 6, 12, 7 and 15 units, all at 40. SUMX gives 240 + 480 + 280 + 600 = 1,600. The broken measure gives SUM(Units) = 40 and SUM(UnitPrice) = 160, and 40 × 160 = 6,400. Four times too big, because four rows means sixteen pairings and only four are real.

So the test that proves the measure works is the test that cannot fail. A single-row check passes on a measure that is wrong by a factor of sixteen at the total. This is the same shape as the Excel fill whose first row is right in both the working and the broken version, and it is why the habit at the end of this page is about totals rather than about being careful.

## 5. What SUMX is actually doing on each row

Microsoft calls SUMX an **iterator function** , and defines the category in one sentence: "A DAX function that enumerates all rows of a given table and evaluate a given expression for each row."

The word that matters underneath that is **row context**. Row context is the model knowing which single row it is standing on, which is what makes `Orders[Units]` mean a number rather than a whole column. Microsoft's glossary puts it plainly: row context "represents the 'current row', and is used to evaluate calculated column formulas and expressions used by table iterators."

So the sequence inside `SUMX(Orders, Orders[Units] * Orders[UnitPrice])` is:

  1. Take the rows of Orders that survived the filters on the visual.
  2. Stand on the first one. `Orders[Units]` is 4 and `Orders[UnitPrice]` is 220, so the expression is 880.
  3. Move to the next. Repeat. Sixteen times.
  4. Add up the sixteen results and return one number.

Nothing is stored. There is no revenue column at the end of it, which is the difference between this and a [calculated column](https://michaelnocito.github.io/analyst-prep-kit/guides/powerbi-measures-vs-columns/). A calculated column would compute 880 once, save it in the file, and use memory forever. SUMX computes it when a visual asks and throws it away.

One thing to know rather than discover: a row context does not filter anything. Standing on row 1001 does not restrict other tables to that order. Referencing a measure inside the iterator changes that, and it changes it silently, which is the trapdoor covered in [CALCULATE and filter context](https://michaelnocito.github.io/analyst-prep-kit/guides/powerbi-calculate/). Read that one before you write `SUMX(Orders, [Some Measure])`.

Now picture this running on a table you actually own. Take your own fact table, find one number on a report that had to be worked out rather than looked up, and say out loud which table SUMX would walk and what the expression on each row would be. Two pieces, that is the whole call.

## 6. The rest of the X family

SUMX is not special. Every aggregation in DAX has an X twin, and they all take the same two arguments in the same order: a table, then an expression to evaluate on each row of it. Learning SUMX teaches you all of them at once.

| Plain version  | Iterator                           | Reach for the iterator when                               |
|----------------|------------------------------------|-----------------------------------------------------------|
| `SUM(col)`     | `SUMX(table, expr)`                | The amount has to be calculated per row first.            |
| `AVERAGE(col)` | `AVERAGEX(table, expr)`            | You want the mean of a per-row calculation.               |
| `MAX(col)`     | `MAXX(table, expr)`                | The biggest calculated value, not the biggest stored one. |
| `MIN(col)`     | `MINX(table, expr)`                | Same, in the other direction.                             |
| `COUNT(col)`   | `COUNTX(table, expr)`              | Counting rows where an expression produces a number.      |
| none           | `RANKX(table, expr)`               | Ranking on something the model works out per row.         |
| none           | `CONCATENATEX(table, expr, delim)` | Turning rows into one readable string for a card.         |

CONCATENATEX is the one worth trying first, because it makes the row-by-row idea visible. It takes an optional third argument, the separator, and it is how a report shows "Desk, Chair, Lamp" in a title instead of a number.

AVERAGEX has one behavior worth knowing before it surprises you in a matrix. Microsoft states it directly: "When there are no rows to aggregate, the function returns a blank. When there are rows, but none of them meet the specified criteria, then the function returns 0." A blank cell and a zero cell mean different things, and only one of them draws a bar.

## 7. The wrong number that looks right: an average of percentages

Before this one: a report needs the overall margin percentage. Somebody writes a margin percent for each order and averages it. Say whether that gives the same answer as total margin divided by total revenue.

It does not, and unlike the revenue example the gap here is small enough to ship.

Cost lives on Products, not on Orders, so margin is a number that exists nowhere and has to be built. `RELATED` is what lets a row of Orders read its own product's row on the other side of the relationship.
    
    
    Total Margin =
    SUMX (
        Orders,
        Orders[Units] * ( Orders[UnitPrice] - RELATED ( Products[Cost] ) )
    )

Per unit that is 220 - 140 = 80 on a desk, 85 - 52 = 33 on a chair, and 40 - 22 = 18 on a lamp. Across the sixteen orders there are 23 desk units, 38 chair units and 40 lamp units, so total margin is 23 × 80 + 38 × 33 + 40 × 18 = 1,840 + 1,254 + 720 = **3,814**.

Revenue is 9,890. So the blended margin is 3,814 / 9,890 = **38.56%**.

Now the version that averages. Every desk order runs at 80 / 220 = 36.36%, every chair at 33 / 85 = 38.82%, every lamp at 18 / 40 = 45.00%, whatever the quantity. There are seven desk orders, five chair orders and four lamp orders, so:
    
    
    Average Margin % =
    AVERAGEX ( Orders, DIVIDE ( [Order Margin], [Order Revenue] ) )

| Product   | Margin %          | Orders | Contribution to the average |
|-----------|-------------------|--------|-----------------------------|
| Desk      | 36.36% (80 / 220) | 7      | 7 × 36.36 = 254.55          |
| Chair     | 38.82% (33 / 85)  | 5      | 5 × 38.82 = 194.12          |
| Lamp      | 45.00% (18 / 40)  | 4      | 4 × 45.00 = 180.00          |
| **Total** |                   | **16** | **628.66 / 16 = 39.29%**    |

39.29% against a true 38.56%. Wrong by 0.73 percentage points, and entirely believable in a card on a dashboard.

The reason is worth saying in one line, because it is the whole class of error. The average gives every order one vote. Lamps are 4 of the 16 orders, so they carry 25% of the vote, but they are only 1,600 of the 9,890 in revenue, which is 16.18%. Lamps also have the highest margin percentage, so overweighting them pulls the average up.

A ratio of totals is not the total of ratios. The fix is to divide once, at the end:
    
    
    Margin % = DIVIDE ( [Total Margin], [Total Revenue] )

The rule that comes out of this: SUMX the numerator, SUMX the denominator, and divide those two. Never average a percentage that was already a ratio, unless somebody has told you in writing that they want each order to count equally.

## 8. When SUM is the correct answer

Nothing above is an argument for using iterators everywhere. Microsoft's own guidance, on the SUMX page itself, is the opposite: "If you do not need to filter the column, use the SUM function."

SUM is right whenever the value is already sitting in the column, which covers most of a normal model. `SUM(Orders[Units])` is 101 and there is nothing an iterator would add to that. A fact table that stores an extended amount per line should be summed, not re-derived.

There is a second case worth naming, because it looks like laziness and is not. If your fact table already has a stored revenue column, using it is more accurate than recomputing units times price, because the stored value is what was actually invoiced. Rounding, discounts and price overrides all live in that stored number and none of them are in the multiplication.

And if you find yourself writing `SUMX(Orders, Orders[Units])`, with a bare column as the expression and no calculation in it, that is a SUM with extra syntax. Write the SUM.

## The full before and after

Same model, same visual, same sixteen rows. One function apart.

|                              | Before: `SUM(Units) * SUM(UnitPrice)` | After: `SUMX(Orders, Units * UnitPrice)` |
|------------------------------|---------------------------------------|------------------------------------------|
| Does it compile              | Yes                                   | Yes                                      |
| One order (1001)             | 880                                   | 880                                      |
| Lamps, four orders           | 6,400 (40 × 160)                      | 1,600                                    |
| Desks, seven orders          | 35,420 (23 × 1,540)                   | 5,060 (23 × 220)                         |
| All sixteen orders           | 214,625 (101 × 2,125)                 | 9,890                                    |
| What it is adding            | All 256 quantity-and-price pairings   | The 16 pairings that happened            |
| What a reviewer checks first | A single row, which matches           | A single row, which matches              |

The last line is the point of the page. Both versions pass the check most people run.

## Edge cases that return a number instead of an error

These are the ones that produce output rather than a red squiggle.

  * **Averaging a percentage.** Section 7 in one line: `AVERAGEX` over a ratio weights every row equally, so the answer drifts by however unbalanced your rows are. Divide two totals instead.
  * **Blanks are not zeros.** The SUMX reference says only numbers are counted and "blanks, logical values, and text are ignored". A row with a blank price contributes nothing rather than erroring, so a partly-loaded column produces a total that is quietly low.
  * **A measure inside the iterator.** `SUMX(Products, [Total Revenue])` does not do what the syntax suggests, because referencing a measure in a row context triggers context transition automatically. That is a whole mechanism, and it is worked through on the [CALCULATE](https://michaelnocito.github.io/analyst-prep-kit/guides/powerbi-calculate/) page.
  * **Iterating the wrong table.** `SUMX(Products, ...)` walks three rows and `SUMX(Orders, ...)` walks sixteen. Both compile. The first argument is a decision, not boilerplate, and if it is a dimension table you are almost always on the wrong one. There is more on which table is which in [star schema in Power BI](https://michaelnocito.github.io/analyst-prep-kit/guides/powerbi-star-schema/).
  * **Nesting an iterator inside an iterator.** Legal, and it multiplies the work: a SUMX over 16 rows containing a SUMX over 16 rows evaluates 256 times. Fine here, and not fine on a fact table with ten million rows.
  * **Using it where a calculated column belongs.** If the per-row value is needed as a slicer or an axis, a measure cannot give you that. That decision has its own page: [calculated column vs measure](https://michaelnocito.github.io/analyst-prep-kit/guides/powerbi-measures-vs-columns/).

## Why this works

The design reason is the useful part. DAX separates the two functions because they answer different questions, and Microsoft's reference pages say so in their opening lines. SUM "adds all the numbers in a column". SUMX "returns the sum of an expression evaluated for each row in a table". One reads storage, the other runs a calculation.

The failure is worth taking seriously because it is a specific case of something general: a calculation done on totals is not the same calculation done on the individual rows and then totalled. That is not a Power BI quirk. W. S. Robinson demonstrated the same thing for correlations in 1950, showing that relationships computed from grouped census data did not match the relationships among the individuals inside those groups, which is the finding that became known as the ecological fallacy (Robinson, 1950, _American Sociological Review_ , 15(3), 351–357). The arithmetic here is simpler than his, but the mistake is the same one: aggregate first and the row-level relationship is gone before you use it.

The reason it survives a code review is arithmetic rather than psychology. Every check on a single row returns identical results from both measures, as shown in section 4. So the reviewer's evidence is real, and it is evidence about nothing. The only test that separates the two measures is one that spans more than one row, which means a total you predicted before you looked at it.

One note on the cheat sheet below. It is built to be covered and recalled rather than read, because testing yourself on material transfers to new situations better than restudying it, which matters here since you will be applying this to models that look nothing like the one above (Butler, 2010, _Journal of Experimental Psychology: Learning, Memory, and Cognition_ , 36(5), 1118–1133).

## Using this on your own model

Auditing every measure in an inherited file is miserable and you will stop on the second table. Do this instead, in order.

  1. **Search the measure list for`) * SUM` and `) / SUM`.** Two aggregations combined with an operator between them is the pattern. Most of the hits will be fine. The ones that are not are all here.
  2. **For each hit, ask whether the two columns come from the same row.** Units and price on the same line are a row-level pair, and multiplying their totals is wrong. Revenue and headcount from different tables usually are not, and dividing their totals is right.
  3. **Check a total, never a row.** Take the filter off, read the grand total, and compare it to something you know. A revenue figure twenty times your annual sales fails in one second.
  4. **Check a group with more than one row in it.** If a single-row slice is all you tested, you tested nothing. Pick the product with the most orders behind it.
  5. **Find every averaged percentage.** Anything named "Average X %" or "Avg Margin" is worth opening. If it averages a ratio, replace it with DIVIDE of two totals and tell whoever owns the report that the number will move.
  6. **Write the intended arithmetic in the measure description.** "Sum of units times unit price, per line" is one sentence, it sits in the model, and it makes the next person's review possible.

If you have paper nearby, one optional sketch fixes this permanently. Draw a four-by-four grid of boxes. Write four quantities down the side and four prices across the top. Shade the four boxes where a quantity meets its own price. What you have shaded is SUMX, and the whole grid is what multiplying two totals gives you. You will not need to look this up again.

**More detail on this, and more like it.** Every how-to sits in one place on the [guides index](https://michaelnocito.github.io/analyst-prep-kit/guides/): Power BI, SQL, Excel, and the working habits around them.

## The whole thing on one screen

This is the retrieval sheet. Cover the right column, work down the left, and say each answer out loud before you check it.

| Thing                 | What it does                                                                                     |
|-----------------------|--------------------------------------------------------------------------------------------------|
| `SUM(col)`            | Adds a column that already exists. One argument, and it must be a column.                        |
| `SUMX(table, expr)`   | Evaluates the expression on every row, then adds the results.                                    |
| The question to ask   | Can I point at a column in the Fields pane? If not, it is SUMX.                                  |
| Iterator              | A function that walks every row of a table and evaluates an expression there.                    |
| Row context           | The model knowing which single row it is standing on.                                            |
| Row context does not  | Filter anything. Referencing a measure is what changes that.                                     |
| `SUM(a) * SUM(b)`     | Adds every pairing of a with b. 16 rows means 256 pairings.                                      |
| Why it passes review  | Sliced to one row, both measures return the same number.                                         |
| The test that works   | A total you predicted before you read it.                                                        |
| The X family          | AVERAGEX, MAXX, MINX, COUNTX, RANKX, CONCATENATEX. Same two arguments.                           |
| Average of a ratio    | Weights every row equally. 39.29% where the truth is 38.56%.                                     |
| Fix for a ratio       | `DIVIDE([Total Margin], [Total Revenue])`. Divide once, at the end.                              |
| Reading another table | `RELATED`, from the many side to the one side.                                                   |
| Blanks in SUMX        | Ignored, not zero. A half-loaded column totals quietly low.                                      |
| `SUMX(t, t[col])`     | A SUM with extra syntax. Write the SUM.                                                          |
| When SUM is right     | The value is stored. Microsoft: "If you do not need to filter the column, use the SUM function." |

**The one habit to keep.** Predict the grand total before you read it. Sixteen orders at these prices is roughly ten thousand, so 214,625 is wrong before you have opened a single measure. A rough number you committed to in advance catches this class of mistake faster than reading DAX will, and it costs about four seconds.

One last thought, and I would genuinely like other people's answers. The worst version I have seen was an average discount percentage on an executive card. It was built as an average of per-order discounts, it ran about two points under the real blended figure, and it had been quoted in board papers for three quarters before anyone divided the two totals. What is the longest one of these has gone unnoticed in a model you inherited?

## References

  * Robinson, W. S. (1950). Ecological correlations and the behavior of individuals. _American Sociological Review_ , 15(3), 351–357.
  * Butler, A. C. (2010). Repeated testing produces superior transfer of learning relative to repeated studying. _Journal of Experimental Psychology: Learning, Memory, and Cognition_ , 36(5), 1118–1133.
  * Microsoft. SUM function (DAX), SUMX function (DAX), AVERAGEX function (DAX), CONCATENATEX function (DAX) and DAX glossary. Microsoft Learn. All quotations above are taken from these reference pages.

---

*The full version of this guide lives on my site: [SUM vs SUMX in DAX: Why a Row-by-Row Calculation Needs an Iterator](https://michaelnocito.github.io/analyst-prep-kit/guides/powerbi-sum-vs-sumx/).*

*If it was useful: [Buy Me a Coffee](https://buymeacoffee.com/michaelnocito).*
