By the end of this page you can look at any calculation you are about to add to a Power BI model and know, before you write a character of DAX, whether it should be a calculated column or a measure. You will also be able to explain the choice to someone else, which is what an interviewer is really testing when they ask. It is about twenty minutes, and every number on the page is small enough to check with the arithmetic shown beside it.

Here is what to actually do today. Open your current model, find any percentage or ratio that lives in a calculated column, and ask one question about it: does the answer depend on what the viewer has filtered? If yes, rebuild it as a measure. That single move fixes the most common wrong number in Power BI reports.

The short version: a calculated column is computed once per row when the data loads, and stored. A measure is computed at query time, inside whatever filters the visual has at that moment. Anything whose answer changes with the filters must be a measure.

The whole fork is a question of when the arithmetic runs, so that is the one idea the picture carries.

**Every number here is hand-checkable.** DAX only runs inside Power BI, so this page uses a four-row table and shows the arithmetic beside every claim, in the style 100 ÷ 600 = 16.7%. If a number on this page does not match the arithmetic printed next to it, I got it wrong and you caught it.

## 1. The fork, and the one question that decides it

Here is the fork laid out fully, because the choice is not obvious the first time. The question is: where should this calculation live? There are two possible answers. A **calculated column** is a new column added to a table. Power BI computes its value once per row, at the moment the data loads, and then stores every one of those values in the model. The values never change again until the next refresh. A **measure** is a stored formula with no stored values at all. Power BI computes it fresh at query time, which means the instant a visual needs it, and it computes it inside whatever filters that visual has right then: the slicer selections, the page filters, the row of the chart it is filling in.

What decides between them is one question. **Does the answer depend on what the viewer has filtered?** If the answer changes when someone clicks a slicer, it must be a measure, because a column's values were frozen before the viewer ever arrived. If the answer is a fixed fact about one row, a fact that stays true no matter who is filtering what, a column is allowed and sometimes right.

Why the question matters: getting it wrong does not produce an error. It produces a clean, formatted, plausible number that is wrong, and nothing on the screen warns anyone. The rest of this page is one worked example of exactly that.

## 2. Row context and filter context in everyday words

Before the explanation: a slicer click changes a card from 21.4% to 16.7%. One of the two tools could have reacted to that click and one could not. Which is which?

These two phrases sound like jargon and they are actually just the two moments from section one, named. **Row context** means the formula is standing on one row and can see that row's values. A calculated column has row context: while computing row 1 it sees row 1's Sales and row 1's Profit, and nothing else. **Filter context** means the formula is standing inside a set of filters and can see every row that survives them. A measure has filter context: when a card is filtered to East, the measure sees all the East rows at once and none of the others.

Here is the table the rest of the page uses. Four rows, two products, two regions.

| Product | Region | Sales | Profit |
|---------|--------|-------|--------|
| A       | East   | 100   | 50     |
| A       | West   | 200   | 90     |
| B       | East   | 500   | 50     |
| B       | West   | 300   | 45     |

A calculated column walks this table one row at a time, at load, and writes one stored value per row. A measure never walks rows on its own. It waits for a visual to hand it a filtered slice, East only, or product B only, or everything, and then computes over that slice. Same table, two completely different moments of arithmetic. That is the entire distinction, and the answer to the prequestion is that only the measure could have moved when the slicer did.

## 3. The classic failure: a margin column, summed

Margin percent is profit divided by sales. It looks like a fact about each row, so the natural first instinct is a calculated column.
    
    
    Margin = Sales[Profit] / Sales[Sales]   -- calculated column, one value per row

At load, Power BI computes and stores four values, and each one is genuinely correct for its row.

| Product | Region | Sales | Profit | Margin (stored) |
|---------|--------|-------|--------|-----------------|
| A       | East   | 100   | 50     | 50 ÷ 100 = 50%  |
| A       | West   | 200   | 90     | 90 ÷ 200 = 45%  |
| B       | East   | 500   | 50     | 50 ÷ 500 = 10%  |
| B       | West   | 300   | 45     | 45 ÷ 300 = 15%  |

Now drag that Margin column into a card. Power BI has to collapse four stored values into one, and its default for a numeric column is to sum them: 50% + 45% + 10% + 15% = 120%. The card says total margin is 120%, which is not just wrong but impossible. Switch the aggregation to average instead and you get (50% + 45% + 10% + 15%) ÷ 4 = 30%, which looks respectable and is still wrong, because it lets product A's tiny 100 in sales count exactly as much as product B's 500.

The true overall margin is total profit over total sales: profit is 50 + 90 + 50 + 45 = 235, sales is 100 + 200 + 500 + 300 = 1,100, and 235 ÷ 1,100 = 21.4%. Neither 120% nor 30% is anywhere near it.

Say why the 120% appeared, in your own words, before reading on. The reason is that percentages of different-sized bases cannot be added. Adding 50-out-of-100 to 10-out-of-500 as if both were out of the same base makes the small product speak five times louder than its sales justify. The column froze each ratio at row level, so every aggregation of it afterwards is an aggregation of ratios, and ratios do not aggregate.

## 4. The measure that gets it right, checked by hand

The fix is to keep the division waiting until after the filters have done their work. That is a measure.
    
    
    Margin % = DIVIDE ( SUM ( Sales[Profit] ), SUM ( Sales[Sales] ) )

`DIVIDE` is division that returns a blank instead of an error when the bottom is zero, which matters the day a filter combination leaves no sales rows. The shape of the formula is the whole lesson: sum first, divide last.

Now every filter the viewer applies produces the honest number, because the sums happen inside the filter context. Check each one by hand:

| Filter         | Measure computes                                | Result | Column summed would say |
|----------------|-------------------------------------------------|--------|-------------------------|
| No filter      | (50+90+50+45) ÷ (100+200+500+300) = 235 ÷ 1,100 | 21.4%  | 120%                    |
| East only      | (50+50) ÷ (100+500) = 100 ÷ 600                 | 16.7%  | 50% + 10% = 60%         |
| West only      | (90+45) ÷ (200+300) = 135 ÷ 500                 | 27.0%  | 45% + 15% = 60%         |
| Product A only | (50+90) ÷ (100+200) = 140 ÷ 300                 | 46.7%  | 50% + 45% = 95%         |

One formula, four filters, four correct answers, and the measure was never told which filter was coming. That is what "computed at query time inside the filter context" buys you. Notice too that the column's wrong answers are not even consistently wrong: East and West both say 60% while the truth is 16.7% against 27.0%, so the column version erases a real regional difference entirely.

Picture running this on your own model for a moment. Take one ratio you report, margin, conversion rate, cost per unit, and imagine a slicer cutting it to one region. If that number is a calculated column today, the sliced version on your screen is some flavour of the 60% row above.

## 5. What columns cost in storage

Correctness is the main reason to prefer measures, but there is a second, quieter cost. A calculated column stores one value for every row of its table. On the four-row table here that is four numbers and nobody cares. On a ten-million-row fact table, one calculated column is ten million stored values, held in memory, refreshed on every load, and compressed worse than the columns that came from the source, because calculated columns are computed after the engine has already chosen its compression. A measure stores exactly one thing regardless of table size: the formula text. Ten characters or ten million rows of difference, per calculation, is a real gap once a model has twenty of them.

## 6. When a column is the right answer

Before the explanation: you want a slicer with the options Budget, Mid-range, and Premium. Could a measure power that slicer?

It could not, and that is the clean rule for when a column is right. **A slicer, an axis, and a legend can only hold real columns.** They need a stored value on every row to group by. So when you want to slice or group _by_ a category that does not exist in the source data, you build it, and a calculated column is the honest home for it. A price band is the classic case: it is a fixed fact about one row, it does not change when the viewer filters, and its whole job is to be filtered by.
    
    
    Price Band =
    SWITCH ( TRUE (),
        Sales[Sales] < 150, "Budget",
        Sales[Sales] < 350, "Mid-range",
        "Premium"
    )

One paragraph on `SWITCH(TRUE())`, because it looks odd the first time. `SWITCH` normally matches one value against a list of exact cases. Handing it `TRUE()` turns it into a ladder of conditions checked top to bottom, and the first condition that comes up true wins. It is DAX's version of a tidy IF-ELSE chain, and it is the standard way to write banding columns without nesting five IFs inside each other. On our table it stores Budget for the 100 row, Mid-range for the 200 and 300 rows, and Premium for the 500 row, and those labels pass the deciding question: no slicer click can change which band a 500-dollar row belongs in.

The band thresholds themselves, 150 and 350 here, deserve a sentence of justification in your model notes rather than a shrug. [Choosing thresholds from the data](https://michaelnocito.github.io/analyst-prep-kit/guides/data-driven-thresholds/) is its own guide.

## 7. Implicit and explicit measures

Drag a bare numeric column into a visual and Power BI quietly wraps it in an aggregation for you, usually SUM. That auto-created wrapper is called an **implicit measure**. An **explicit measure** is one you wrote yourself with a name and a formula, like the Margin % above.

Analysts write explicit measures, for three reasons that all showed up earlier on this page. First, the implicit default is exactly the machine that turned the margin column into 120%: it sums whatever it is handed, whether or not summing means anything. Second, an explicit measure carries its definition with it, so Margin % means profit over sales in every visual, every page, and every colleague's report, instead of whatever aggregation someone happened to leave selected. A shared, written definition is most of what makes a metric trustworthy, and [defining metrics](https://michaelnocito.github.io/analyst-prep-kit/guides/defining-metrics/) goes deeper on that. Third, only explicit measures can hold real logic: DIVIDE, filters, time comparisons. The habit is simple and cheap: even for a plain total, write `Total Sales = SUM ( Sales[Sales] )` once and reuse it everywhere.

## The full before and after

Same four-row table, same question: what is our margin, overall and by region?

### Before
    
    
    Margin = Sales[Profit] / Sales[Sales]        -- calculated column
    -- then dragged into a card, aggregation left on the default

The card reads 120% (50% + 45% + 10% + 15%). Filtered to East it reads 60% (50% + 10%). Filtered to West it also reads 60% (45% + 15%), so the two regions look identical. Ten million rows would also be carrying a stored decimal each. No error appears at any point.

### After
    
    
    Total Sales  = SUM ( Sales[Sales] )
    Total Profit = SUM ( Sales[Profit] )
    Margin %     = DIVIDE ( [Total Profit], [Total Sales] )

The card reads 21.4% (235 ÷ 1,100). East reads 16.7% (100 ÷ 600), West reads 27.0% (135 ÷ 500), and the regional gap is visible for the first time. Three named formulas are stored, zero values per row, and every future visual reuses the same definitions.

## Edge cases that produce confident wrong numbers

Before the explanation: a colleague averages the margin column instead of summing it and says the problem is fixed. Is it?

**Averaging the ratio column is the same mistake in a milder coat.** This is the prequestion's answer. (50% + 45% + 10% + 15%) ÷ 4 = 30%, against a truth of 21.4%. An unweighted average lets a row with 100 in sales count as much as a row with 500. It is closer than 120%, which is exactly why it survives review.

**A ratio at a subtotal is not the sum of the ratios below it.** Even with a correct measure, people expect the total row of a matrix to be the sum of the rows above. For a ratio it never is: East 16.7% and West 27.0% sit above a total of 21.4%, not 43.7%. That is correct behaviour, and it is worth one sentence in the report notes so nobody "fixes" it.

**A ratio built on unrelated totals ignores the visual.** Wrap the sums in functions that remove filters, or build them on the wrong table, and the measure shows 21.4% in every row of a regional breakdown. The symptom is a measure repeating one value everywhere; the cause is the filter context being thrown away.

**A calculated column does not update until refresh.** Columns are computed at load, so a banding column built on yesterday's prices stays stale until the next refresh, while a measure would have moved with the data underneath. Anything that must track the data live has to be a measure.

**Blank divisions.** Filter to a combination with rows but zero sales and a raw `/` errors or shows infinity. `DIVIDE` returns blank, and a blank card is the honest display for "no base to divide by".

## Why this works

The margin failure is not a Power BI quirk. It is the oldest trap in aggregation: a ratio of sums and a sum (or average) of ratios are different quantities, and only the first one answers "what is our margin". The same structure is behind Simpson's paradox, where relationships that hold in every subgroup reverse in the combined table because group sizes act as hidden weights (Simpson, 1951, _Journal of the Royal Statistical Society, Series B_ , 13(2), 238–241). Our East and West both showing 60% while truly differing by ten points is that machinery running in miniature. A measure works because it keeps the weights: summing profit and sales separately before dividing is precisely the size-weighted calculation the column threw away when it froze each ratio at row grain. If you know SQL, this is the same grain discipline as [GROUP BY](https://michaelnocito.github.io/analyst-prep-kit/guides/sql-group-by-having/): a value computed at one grain cannot be casually re-aggregated at another.

There is also a reason this page kept asking you to answer before it explained. Being prompted to generate an answer before seeing the correct one measurably improves how well the material sticks, even when the first answer is wrong (Bisra, Liu, Nesbit, Salimi, & Winne, 2018, _Educational Psychology Review_ , 30(3), 703–725). Committing to "could a measure power a slicer?" before the answer is why the slicer rule will still be there next month.

## Using this on your own model

Auditing a whole model in one sitting is miserable and you will abandon it around column nine. Do this instead, in order.

  1. **List your calculated columns** , just the names, in the model view. Five minutes.
  2. **Ask the one question of each** : does its answer depend on what the viewer filters? Every percentage, ratio, and running total fails the test on sight.
  3. **Rebuild the failures as explicit measures** , sums inside, DIVIDE outside, starting with the one that appears on the most-viewed page.
  4. **Check one number by hand per rebuild** , the way this page did: pick a small filter, add the raw values yourself, compare. One verified 100 ÷ 600 = 16.7% is worth more than an hour of eyeballing.
  5. **Keep the columns that pass** , the bands and flags and categories you slice by, and delete the ones nothing references. Each deletion is a row-count worth of storage back.

If you have paper nearby, one optional drawing is worth the two minutes: redraw the picture at the top of this page from memory, a table with a locked extra column on the left, a slicer feeding a formula on the right. If you can place the lock and the loop correctly without looking, you own the fork.

**More detail on this, and more like it.** Every how-to sits in one place on the [guides index](https://michaelnocito.github.io/analyst-prep-kit/guides/): SQL, Excel, Power BI, Tableau, and the working habits around them.

## The whole thing on one screen

This is the retrieval sheet. Cover the right column, work down the left, and say each answer out loud before you check it.

| Question                         | Answer                                                                                        |
|----------------------------------|-----------------------------------------------------------------------------------------------|
| Calculated column                | Computed once per row at data load, values stored in the model.                               |
| Measure                          | Formula computed at query time, inside the visual's current filters. Nothing stored per row.  |
| The deciding question            | Does the answer depend on what the viewer has filtered? Yes means measure.                    |
| Row context                      | Standing on one row, seeing that row's values. What a column has.                             |
| Filter context                   | Standing inside the current filters, seeing all surviving rows. What a measure has.           |
| Why summing a ratio column fails | Ratios of different-sized bases cannot be added. 50% + 45% + 10% + 15% = 120%.                |
| Why averaging it also fails      | Unweighted: small rows count as much as big ones. 30% against a truth of 21.4%.               |
| The right shape                  | Sum first, divide last: `DIVIDE(SUM(Profit), SUM(Sales))`.                                    |
| DIVIDE vs /                      | DIVIDE returns blank on a zero base instead of an error.                                      |
| When a column is right           | A stored fact about one row you want to slice, group, or filter by. Bands, flags, categories. |
| SWITCH(TRUE())                   | A ladder of conditions, first true one wins. The standard banding pattern.                    |
| Storage cost                     | Column: one stored value per row, poorly compressed. Measure: the formula text only.          |
| Implicit measure                 | The auto-aggregation Power BI applies to a bare column. Defaults to SUM, meaningful or not.   |
| Explicit measure                 | Named, written by you, one definition reused everywhere. What analysts ship.                  |
| Ratio subtotals                  | Never the sum of the rows above. 16.7% and 27.0% correctly total 21.4%.                       |
| Stale column                     | Columns update at refresh only. Live-tracking logic must be a measure.                        |

**The one habit to keep.** Before writing any calculation, say out loud whether its answer moves when a slicer clicks. Moves means measure, sums inside and the division last. The wrong version never errors. It formats itself nicely and ships.

One last thought, and I would genuinely like other people's answers. My first margin column survived three report reviews, because 30% looked plausible for the business and nobody, including me, added the numbers by hand. What is the longest a wrong ratio has lived in one of your reports, and what finally exposed it?

## References

  * Simpson, E. H. (1951). The interpretation of interaction in contingency tables. _Journal of the Royal Statistical Society, Series B_ , 13(2), 238–241.
  * Bisra, K., Liu, Q., Nesbit, J. C., Salimi, F., & Winne, P. H. (2018). Inducing self-explanation: A meta-analysis. _Educational Psychology Review_ , 30(3), 703–725.
  * Codd, E. F. (1970). A relational model of data for large shared data banks. _Communications of the ACM_ , 13(6), 377–387.

---

*The full version of this guide lives on my site: [Calculated Column vs Measure in Power BI: The Rule That Decides](https://michaelnocito.github.io/analyst-prep-kit/guides/powerbi-measures-vs-columns/).*

*If it was useful: [Buy Me a Coffee](https://buymeacoffee.com/michaelnocito).*
