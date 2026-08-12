By the end of this page you can compute a weighted average that reflects what actually happened, count and total rows against several conditions at once without a helper column, compare two columns row by row, and recognise the two ways this function breaks. It is about twenty-five minutes, and every number below was run in Excel.

Here is what to do today. Find a report where somebody averaged a price, a rate or a percentage column. Replace it with `=SUMPRODUCT(quantity, price) / SUM(quantity)` and compare the two numbers. On the sixteen-row table used in this set of guides the average of the price column is 132.81 and the price the business actually achieved per unit is 97.92, and only one of those is a fact about the business.

The short version: SUMPRODUCT pairs up the cells of two ranges, multiplies each pair, and adds the results. Everything else it does is that one behaviour applied to something clever.

Pair, multiply, add is the idea, so it gets the picture.

> _The original carries a diagram here. In words: Two narrow columns of numbers stand side by side on the left, four rows deep. The first column holds 4, 10, 3 and then a row of three dots standing for the rest of the data. The second column holds 220, 85, 220 and a matching row of dots. A multiplication sign sits between the two columns on every row, pairing them up. To the right of each pair an arrow leads to a third column holding the result of that row's multiplication: 880, 850, 660, and dots. A tall curly brace gathers the whole third column together and leads to a single large number on the far right, 9,890, with a summation sign beside it. Nothing in the picture is a total of either original column on its own; the single number at the end is reached only by multiplying across each row first and adding afterwards._

**Every result on this page is real.** Run in Excel on the sixteen-row orders table used across this set of guides: sixteen orders, 101 units, 9,890 in revenue.

## 1. What it does, in one line

Before the explanation: you have a Units column and a UnitPrice column and no Revenue column. Say how you would get total revenue without adding one.
    
    
    =SUMPRODUCT(Orders[Units], Orders[UnitPrice])      9890
    =SUM(Orders[Revenue])                              9890

Identical. SUMPRODUCT did what the Revenue column does, in one cell, without the column existing. Row one is 4 × 220 = 880, row two is 10 × 85 = 850, and so on down all sixteen rows, and then it adds the sixteen products together.

The part worth internalising is _multiply first, add second_. Multiplying the two column totals would give 101 × 2,125, which is a number with no meaning at all. The pairing is per row, and that is the whole function.

It also takes more than two ranges. `SUMPRODUCT(a, b, c)` multiplies three values per row. That matters in a moment, because a condition is just another range of numbers.

## 2. The number it exists for: a weighted average

Before the explanation: the UnitPrice column holds sixteen prices. Somebody averages it and reports the average price. Say whether that number describes the business.
    
    
    =AVERAGE(Orders[UnitPrice])                                       132.81
    =SUMPRODUCT(Orders[Units], Orders[UnitPrice]) / SUM(Orders[Units])  97.92

A gap of nearly 35. Both are arithmetically correct and they answer different questions.

`AVERAGE` treats each of the sixteen _orders_ as one thing: seven desk orders at 220, five chair orders at 85, four lamp orders at 40, averaged as sixteen equal items. The weighted version treats each of the 101 _units_ as one thing, which is what "average price" means to anyone reading a sales report. 9,890 of revenue over 101 units is 97.92 per unit, and you can check it: 9,890 ÷ 101 = 97.92.

The reason the simple average runs high here is that the expensive product sells in small orders and the cheap one sells in large ones. Two lamp orders of 12 and 15 units count as two items in an unweighted average, exactly like a single desk order of 2 units counts as one. Weighted, those same lamp orders carry 27 units against the desk order's 2.

This is the single most valuable thing this function does, and the pattern is always the same shape:
    
    
    =SUMPRODUCT(weights, values) / SUM(weights)

Units and price. Headcount and salary. Order value and discount rate. Population and per-capita anything. Whenever you are averaging a rate, a price or a percentage, there is a weight column somewhere, and leaving it out is the commonest quiet error in business reporting.

Picture the last average you put in front of somebody. What was the weight column, and was it in the formula?

## 3. Conditions are ones and zeros

A comparison like `Region="North"` does not produce a filter, it produces a column of TRUE and FALSE, one per row. Multiply that column by another and TRUE behaves as 1 while FALSE behaves as 0, so every row that fails the test contributes zero.
    
    
    =SUMPRODUCT((Orders[Region]="North") * Orders[Revenue])       2495

North's revenue, with no helper column and no SUMIF. Every non-North row was multiplied by 0 and vanished from the sum.

Stack conditions the same way. Multiplying is AND, adding is OR, exactly as it is in [a FILTER formula](https://michaelnocito.github.io/analyst-prep-kit/guides/excel-dynamic-arrays/), because it is the same arithmetic.
    
    
    =SUMPRODUCT((Orders[Region]="East") * (Orders[Revenue]>600) * Orders[Revenue])
    2440
    
    =SUMPRODUCT(((Orders[Region]="East") + (Orders[Region]="West")) * Orders[Revenue])
    4725

Check the second one: East is 3,040 and West is 1,685, and 3,040 + 1,685 = 4,725. The brackets around the added pair are not optional, and forgetting them is the most common mistake in an OR condition.

One warning about OR built with addition: if a row can satisfy both conditions, its flag becomes 2 and it is counted twice. A region cannot be both East and West, so it is safe here. "Revenue over 500 or units over 5" is not safe, and the fix is to compare against zero: `--(((a)+(b))>0)`.

## 4. Counting with the double minus

To count rather than total, you want the flags themselves added up. But SUMPRODUCT ignores logical values when they arrive on their own, so the flags need converting to numbers first, and the standard way is two minus signs.
    
    
    =SUMPRODUCT(--(Orders[Revenue]>600))                    8
    =SUMPRODUCT(--(Orders[Units]>5), --(Orders[UnitPrice]<100))   8

The double minus, usually called the double unary, is not a trick as much as arithmetic done twice. The first minus turns TRUE into −1, the second turns −1 into 1, and the same happens to FALSE and 0. Multiplying by 1 would work identically, and so would adding 0; the minus signs are just the shortest way to write it.

Eight orders are over 600. Eight orders also have both more than five units and a price under 100, which is a two-condition count with no helper column and no COUNTIFS.

Mixing the two forms is fine and worth knowing: a flag argument makes a count, and putting a value range alongside it makes a conditional total.
    
    
    =SUMPRODUCT(--(Orders[Revenue]>600), Orders[Revenue])     6475

## 5. Comparing two columns row by row

This is the job SUMIFS genuinely cannot do, because its criteria compare a column to a fixed value rather than to another column.
    
    
    =SUMPRODUCT(--(Orders[Revenue] > Orders[UnitPrice] * 3))     12

Twelve orders are worth more than three times their unit price, which is another way of saying twelve orders were for more than three units. The comparison happens once per row, against that row's own values.

The same shape answers the questions that actually come up: how many invoices were paid after their due date, `--(PaidDate > DueDate)`; how many line items were below cost, `--(Price < Cost)`; how many months missed target, `--(Actual < Target)`. Every one of them is a two-column comparison and none of them is a SUMIFS.

## 6. Where it still beats SUMIFS

SUMIFS arrived long after SUMPRODUCT and took over most of the day-to-day work. It is easier to read, it is faster on large ranges, and for a plain conditional total it is the right answer. [Its own guide](https://michaelnocito.github.io/analyst-prep-kit/guides/excel-sumifs/) covers that case properly.

Four situations still belong here.

**Row-by-row comparisons** , as in section five.

**A condition that has to be calculated.** SUMIFS cannot apply a function to the range it is testing, so grouping by month means adding a month column. SUMPRODUCT can compute it in place:
    
    
    =SUMPRODUCT(--(MONTH(Orders[OrderDate])=3), Orders[Revenue])     2585

**A condition that comes from a lookup.** The orders table has no category column; category lives in the products table. SUMPRODUCT can do the lookup for every row inside the condition:
    
    
    =SUMPRODUCT((INDEX(Products[Category],
                 MATCH(Orders[Product], Products[Product], 0)) = "Lighting")
                * Orders[Revenue])
    1600
    
    same shape, "Furniture"                                          8290

1,600 and 8,290 add to 9,890, so every order was categorised. That is a cross-table conditional total in one cell, with no column added to either table, and it composes with [the lookup pattern](https://michaelnocito.github.io/analyst-prep-kit/guides/excel-index-match/) you already know.

**Weighted arithmetic of any kind** , which is section two and the reason the function is worth learning at all. The same shape produces cost of goods from a price list:
    
    
    =SUMPRODUCT(Orders[Units],
                INDEX(Products[Cost], MATCH(Orders[Product], Products[Product], 0)))
    6076

It is also the engine behind any scored model, where a set of weights meets a set of measures. [A risk index that colours itself](https://michaelnocito.github.io/analyst-prep-kit/guides/build-a-risk-index/) is that pattern built out in full.

## 7. The two ways it breaks

Before the explanation: one of your ranges is sixteen rows and the other is fifteen. Predict what happens.
    
    
    =SUMPRODUCT(Orders[Units], G2:G16)      #VALUE!

**Different sizes error.** There is no partial pairing and no silent truncation, which is the best possible behaviour: the mismatch is exactly the kind of thing that would produce a plausible wrong total in a less strict function. When you see this, count the rows in each argument.

**Text behaves differently in the two forms** , and this one genuinely surprises people. With commas between the ranges, text is treated as zero and the formula returns an answer. With asterisks, text cannot be multiplied and the formula errors.
    
    
    =SUMPRODUCT(Orders[Units], Orders[Rep])        0
    =SUMPRODUCT(Orders[Units] * Orders[Rep])       #VALUE!

The comma form's tolerance sounds friendlier and is more dangerous. A column that is mostly numbers with a few text entries returns a total that is short by exactly those rows, with no error, which is the same failure as [numbers stored as text](https://michaelnocito.github.io/analyst-prep-kit/guides/excel-clean-messy-data/) wearing a different hat. If the total looks slightly low, check the types before checking the formula.

The practical rule: use commas when every argument is genuinely numeric, and use asterisks when conditions are involved, which is when you want the strictness anyway.

## 8. When not to use it

Three cases, said plainly, because a page about a function should also say where it stops.

**A plain conditional total.** `SUMIFS` is clearer to read and quicker to check. Reach for SUMPRODUCT when SUMIFS cannot express the condition, not before.

**Whole-column references on a big sheet.** SUMPRODUCT evaluates every row you give it, so `A:A` means a million rows per condition, per formula. On a large model this is the classic cause of a workbook that recalculates for several seconds after every keystroke. Point it at the table column.

**When you need to see the rows.** SUMPRODUCT returns one number and shows nothing about which rows contributed. If the question is "which orders", that is a filter or a `FILTER` formula, not this.

## The full before and after

Same table, same question: what is our average selling price, and how are the large orders doing?

### Before
    
    
    =AVERAGE(UnitPrice)                     132.81
    =COUNTIF(Revenue,">600")                     8
    plus a Month helper column, a Category helper column,
    and a Line cost helper column, to make three other numbers possible

The headline average is 132.81, which is the average of the prices we charge rather than the price we get, and it sits about 36% above it. Three helper columns exist only so that SUMIFS can be used, and each one is a column that can be dragged wrong, sorted out of alignment or left un-filled on a new row.

### After
    
    
    average selling price
    =SUMPRODUCT(Units, UnitPrice) / SUM(Units)                       97.92
    
    March revenue, no month column
    =SUMPRODUCT(--(MONTH(OrderDate)=3), Revenue)                     2585
    
    lighting revenue, no category column
    =SUMPRODUCT((INDEX(Cat, MATCH(Product, Prod, 0))="Lighting") * Revenue)   1600
    
    cost of goods, no line-cost column
    =SUMPRODUCT(Units, INDEX(Cost, MATCH(Product, Prod, 0)))         6076

Four numbers, no helper columns, and each formula states its own logic where it is read. And the reconciliation still holds: lighting 1,600 plus furniture 8,290 is 9,890, and 9,890 minus 6,076 of cost is 3,814 of gross profit.

The claim, and it is the reason this function is worth an afternoon: **the average price in the column is 132.81 and the average price the business actually achieved is 97.92, and the only difference between the two numbers is whether anything was weighted.**

## Edge cases that catch people

Six worth knowing.

**Blank cells.** Treated as zero, so a blank in the weights column removes that row from a weighted average silently. Count the blanks before dividing.

**OR conditions that overlap.** Adding two flags gives 2 for a row matching both, which double-counts it. Wrap in `--(( ... )>0)` whenever both can be true.

**Missing brackets around a condition.** `--Orders[Revenue]>600` is not the same as `--(Orders[Revenue]>600)`, and the first one produces something confidently wrong rather than an error.

**Errors anywhere in the range.** One `#N/A` in a column makes the whole SUMPRODUCT an error. That is correct behaviour, and hiding it turns a visible problem into a quiet undercount.

**Ranges that start on different rows.** `SUMPRODUCT(A2:A17, B3:B18)` is the same size and pairs every row with the wrong partner. It gives a clean, plausible, entirely wrong number. Point both at named table columns and the misalignment becomes impossible.

**Volatile functions inside it.** A SUMPRODUCT containing something that recalculates constantly, such as a function that reads today's date, re-evaluates every row on every change. Compute the volatile part once in its own cell and reference it.

## Why this works

The weighted average is not a refinement of the simple one, it is a different question, and treating them as interchangeable is a known way to reach a wrong conclusion from correct arithmetic. The general phenomenon, where combining groups changes or reverses what the numbers appear to say depending on how the groups are weighted, was set out formally by Simpson and has carried his name since (Simpson, 1951, _Journal of the Royal Statistical Society, Series B_ , 13(2), 238–241). The 132.81 on this page is the mild version: sixteen orders each given equal say, when the thing being priced is a unit and there are 101 of them.

Why the unweighted version gets published anyway is worth naming, because it is not ignorance. It is that `AVERAGE` is the answer that comes to mind, and the number it returns is plausible, and nothing about it feels like a judgement call. People substitute an easier question for a harder one and answer it without noticing the substitution, and the substituted answer arrives with normal confidence attached (Tversky & Kahneman, 1974, _Science_ , 185(4157), 1124–1131). "What is the average of this column" is easy; "what did we actually get per unit" requires knowing there is a weight column, and the formula that asks the second question is the one on this page.

One note on the cheat sheet below. It is built to be covered and recalled rather than reread, because testing yourself on material beats restudying it across a very large body of experiments, including at longer delays where it matters most (Rowland, 2014, _Psychological Bulletin_ , 140(6), 1432–1463).

## Using this on your own project

Rewriting every total in an inherited workbook is miserable and unnecessary. Do this instead, in order.

  1. **Find every AVERAGE over a price, rate or percentage column.** Those are the ones most likely to be answering the wrong question.
  2. **For each one, name the weight.** Units, headcount, order value, population. If you cannot name it, the simple average may genuinely be right, and now you know why.
  3. **Replace with`SUMPRODUCT(weights, values)/SUM(weights)`** and put both numbers side by side once, so the difference is visible to whoever has been reading the old one.
  4. **Delete the helper columns that only exist to feed a SUMIFS** , where the condition can be computed in place instead.
  5. **Point every argument at a named table column** , so two ranges can never drift out of alignment.
  6. **Leave SUMIFS alone where it already works.** This is an addition to the toolkit, not a replacement.

If you have paper nearby, one optional sketch is worth five minutes. Draw two narrow columns, write your own weights down one and your own values down the other, and draw a multiplication sign between each pair. Then draw one arrow from the whole lot to a single number. The picture is the formula, and once you have drawn it once the argument order stops needing to be remembered.

**More detail on this, and more like it.** Every how-to sits in one place on the [guides index](https://michaelnocito.github.io/analyst-prep-kit/guides/): Excel, SQL, Python, and the working habits around them.

## The whole thing on one screen

This is the retrieval sheet. Cover the right column, work down the left, and say each answer out loud before you check it.

| Thing                       | What it does                                                               |
|-----------------------------|----------------------------------------------------------------------------|
| `SUMPRODUCT(a, b)`          | Multiplies each pair of cells, then adds the results.                      |
| Order of operations         | Multiply per row first. Never multiply the two totals.                     |
| Weighted average            | `=SUMPRODUCT(weights, values)/SUM(weights)`                                |
| Why it differs from AVERAGE | AVERAGE gives every row equal say, whatever its size.                      |
| A condition                 | A column of TRUE and FALSE, which behave as 1 and 0.                       |
| AND                         | Multiply the conditions: `(a)*(b)`.                                        |
| OR                          | Add them, in brackets. Wrap in `--(( )>0)` if both can be true.            |
| Counting                    | `=SUMPRODUCT(--(condition))`. The double minus makes numbers of the flags. |
| Conditional total           | `=SUMPRODUCT(--(condition), values)`                                       |
| Two columns compared        | `=SUMPRODUCT(--(A > B))`. SUMIFS cannot do this.                           |
| Computed condition          | `--(MONTH(dates)=3)`. No helper column needed.                             |
| Condition from a lookup     | INDEX MATCH inside the condition, evaluated per row.                       |
| Different sized ranges      | `#VALUE!`. Good behaviour; count the rows.                                 |
| Text, comma form            | Treated as zero. Returns a quietly short total.                            |
| Text, asterisk form         | `#VALUE!`. Stricter, and usually what you want.                            |
| Misaligned ranges           | Same size, wrong partners, plausible wrong answer. Use table columns.      |
| Whole columns               | Evaluates a million rows per condition. Do not.                            |
| When to prefer SUMIFS       | Any plain conditional total. Easier to read and faster.                    |

**The one habit to keep.** Whenever you are about to average a price, a rate or a percentage, say the weight out loud first. If there is one, the simple average is answering a question nobody asked, and the difference is often large enough to change what somebody does next. If a SUMPRODUCT misbehaves in a way this page does not cover, there is a general [diagnosis loop for being stuck](https://michaelnocito.github.io/analyst-prep-kit/guides/technical-tenacity/).

One last thought, and I would genuinely like other people's answers. The one that stuck with me was an average discount rate reported across two thousand orders, unweighted, where a handful of very large deals carried nearly all the money and almost none of the weight, so the reported discount was several points off in the direction that looked better. What has an unweighted average told you that turned out not to be true?

## References

  * Simpson, E. H. (1951). The interpretation of interaction in contingency tables. _Journal of the Royal Statistical Society, Series B_ , 13(2), 238–241.
  * Tversky, A., & Kahneman, D. (1974). Judgment under uncertainty: Heuristics and biases. _Science_ , 185(4157), 1124–1131.
  * Rowland, C. A. (2014). The effect of testing versus restudy on retention: A meta-analytic review of the testing effect. _Psychological Bulletin_ , 140(6), 1432–1463.

---

*The full version of this guide lives on my site: [SUMPRODUCT Explained: Multiply Down, Then Add](https://michaelnocito.github.io/analyst-prep-kit/guides/excel-sumproduct/).*

*If it was useful: [Buy Me a Coffee](https://buymeacoffee.com/michaelnocito).*
