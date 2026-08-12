By the end of this page you can pull a value out of one table onto every row of another, matching on a shared key, in a way that keeps working when somebody inserts a column, keeps working when the answer sits to the left of the key, and tells you loudly when there is no match instead of quietly handing back the wrong row. It is about twenty-five minutes, and every result printed below was produced by running the formula in Excel.

Here is what to do today, in your own file. Find your most important VLOOKUP and look at its third argument, the number. Replace that number with `MATCH("HeadingName", $A$1:$Z$1, 0)`, so the formula finds its own column by name. That one change removes the entire class of failure where somebody inserts a column and every lookup in the workbook starts returning the neighbouring field.

The short version: **MATCH** turns a name into a position number, and **INDEX** turns a position number into a value. They are two separate jobs, which is exactly why you can point them at different columns.

That handover, name into number into value, is the whole idea, so it gets the picture.

> _The original carries a diagram here. In words: A left to right chain in three moves. On the far left a blue chip holds the word Lamp, the value being looked up. An arrow carries it into the first of two tall column strips standing side by side in the middle. The first strip is headed Product and holds three stacked cells reading Desk, Chair and Lamp; the third cell, Lamp, is outlined in blue. Beside it the second strip is headed Category and holds three stacked cells reading Furniture, Furniture and Lighting; its third cell, Lighting, is outlined in amber. Between and below the two strips sits a circled numeral 3. A blue line leaves the highlighted Lamp cell, drops down and points into that circle. An amber line leaves the circle, runs right and turns up into the highlighted Lighting cell. The label MATCH sits under the first strip, on the blue side of the circle, and the label INDEX sits under the second strip, on the amber side. An arrow leaves the amber cell on the right and ends at an amber chip holding the word Lighting. The picture shows one position number doing all the work: the first strip converts a name into the number 3, and the second strip converts the number 3 back into a value._

**Every result on this page is real.** Two small tables, printed in full below, and every formula was run in Excel and its output copied back. These are the same tables used across the whole Excel set of guides, so the habits carry from page to page. If you have not met the argument-by-argument comparison yet, [VLOOKUP vs XLOOKUP](https://michaelnocito.github.io/analyst-prep-kit/guides/vlookup-vs-xlookup/) is the companion piece.

Here are the two tables. The first is a list of orders. The second is the product reference, and notice its shape: the key column, Product, is not the first column. Category sits to its left. That is not a trick; reference tables in real workbooks are laid out by whoever made them, not by whoever has to look things up in them.

**Products**

| Category  | Product | ListPrice | Cost |
|-----------|---------|-----------|------|
| Furniture | Desk    | 220       | 140  |
| Furniture | Chair   | 85        | 52   |
| Lighting  | Lamp    | 40        | 22   |

**Orders** , sixteen rows. Revenue is `Units × UnitPrice`.

| OrderID | OrderDate  | Rep        | Region | Product | Units | UnitPrice | Revenue |
|---------|------------|------------|--------|---------|-------|-----------|---------|
| 1001    | 2026-01-05 | Dana Reyes | North  | Desk    | 4     | 220       | 880     |
| 1002    | 2026-01-12 | Owen Park  | South  | Chair   | 10    | 85        | 850     |
| 1003    | 2026-01-19 | Priya Shah | East   | Desk    | 3     | 220       | 660     |
| 1004    | 2026-01-26 | Dana Reyes | North  | Lamp    | 6     | 40        | 240     |
| 1005    | 2026-02-02 | Owen Park  | South  | Desk    | 3     | 220       | 660     |
| 1006    | 2026-02-09 | Priya Shah | East   | Chair   | 8     | 85        | 680     |
| 1007    | 2026-02-16 | Dana Reyes | North  | Chair   | 5     | 85        | 425     |
| 1008    | 2026-02-23 | Sam Okafor | West   | Lamp    | 12    | 40        | 480     |
| 1009    | 2026-03-02 | Owen Park  | South  | Lamp    | 7     | 40        | 280     |
| 1010    | 2026-03-09 | Priya Shah | East   | Desk    | 5     | 220       | 1100    |
| 1011    | 2026-03-16 | Dana Reyes | North  | Desk    | 2     | 220       | 440     |
| 1012    | 2026-03-23 | Sam Okafor | West   | Chair   | 9     | 85        | 765     |
| 1013    | 2026-05-04 | Priya Shah | East   | Lamp    | 15    | 40        | 600     |
| 1014    | 2026-05-11 | Dana Reyes | North  | Chair   | 6     | 85        | 510     |
| 1015    | 2026-05-18 | Owen Park  | South  | Desk    | 4     | 220       | 880     |
| 1016    | 2026-05-25 | Sam Okafor | West   | Desk    | 2     | 220       | 440     |

Both tables have been named with Ctrl+T, so formulas can say `Products[Product]` instead of `$B$2:$B$4`. If those square brackets are unfamiliar, [naming your data](https://michaelnocito.github.io/analyst-prep-kit/guides/excel-name-your-data/) covers them; everything here works with ordinary cell ranges too.

## 1. MATCH on its own: a name in, a number out

Before the explanation: MATCH is going to look for "Lamp" in a three-row list where Lamp is last. Say what you think it hands back.
    
    
    =MATCH("Lamp", Products[Product], 0)
    
    
    3

Not "Lamp", not "Lighting", not 40. Just **3**. MATCH's entire job is to report _where_ something is, counting from the top of the range you gave it. Lamp is the third entry, so the answer is 3.

Two of its three arguments are obvious: what to find, and where to look. The third one is the important one. `0` means **exact match** , and it is the only setting you should be typing until you have a specific reason not to. Section six is about what the other settings do to you.

A number on its own looks useless, and that impression is the reason people skip MATCH and reach for a lookup that does everything in one go. Hold on to the number. It is the thing that makes the rest flexible.

## 2. INDEX on its own: a number in, a value out

Before the explanation: given the Products table above, say what `INDEX(Products[Category], 3)` returns before you read the output.
    
    
    =INDEX(Products[Category], 3)
    
    
    Lighting

INDEX takes a range and a position and hands back what is sitting at that position. It does no searching at all. Give it 3 and it reads the third cell, whether or not the third cell is the one you wanted.

So INDEX is deliberately dumb and MATCH is deliberately narrow, and neither is much use alone. Each knows exactly one thing: MATCH knows where, INDEX knows what is there.

## 3. Putting them together, and the sentence to say while typing

Feed MATCH's number straight into INDEX's second argument.
    
    
    =INDEX(Products[Category], MATCH("Lamp", Products[Product], 0))
    
    
    Lighting

Read it out loud in the order it runs, from the inside out, and it stops looking like a nest of brackets: _"find Lamp in the Product column, exactly, and give me whatever is in the same position of the Category column."_ That sentence has two column names in it, and so does the formula. Every INDEX MATCH you ever write has that same shape.

The order on the page is the reverse of the order it runs, which is the one genuinely awkward thing about it. So type it inside out. Write the MATCH first, on its own, and confirm it returns a sensible number. Then wrap `INDEX(` around it. Debugging a lookup that was built in two steps takes seconds, because you can always delete the INDEX and see what position MATCH thinks it found.

The same pair works on a real column of the orders table. Order 1001 is a Desk, so pulling its category in:
    
    
    =INDEX(Products[Category], MATCH([@Product], Products[Product], 0))
    
    
    Furniture

## 4. The answer that sits to the left

Before the explanation: try to write a VLOOKUP that starts at Product and returns Category, using the Products table exactly as it is printed above. Give it thirty seconds.

There is no way to write it. VLOOKUP takes a block of columns, searches the **first** column of that block, and counts rightward to the answer. Category is to the left of Product, so it is outside every block that starts at Product. Asking for a column number of 0 or −1 does not reverse the direction; both simply fail, and in my run both returned `#N/A`.
    
    
    =VLOOKUP("Lamp", Products, -1, FALSE)
    
    
    #N/A

INDEX MATCH has no direction, because the searching and the fetching happen in different arguments. `MATCH` gets pointed at Product and `INDEX` gets pointed at Category, and whether Category is to the left, to the right, or on another sheet entirely makes no difference to either of them.

The usual workaround is to rearrange the reference table so the key is first. Sometimes that is fine. Often the table is somebody else's, refreshed from a system, or used by three other workbooks that expect the current layout, and quietly moving its columns is how you break somebody else's Monday.

## 5. The hard-coded number that goes stale

This is the failure that actually costs money, so here it is as a run rather than a warning. Three formulas, all asking the same question, what does a Lamp cost us:
    
    
    =VLOOKUP("Lamp", Products[[Product]:[Cost]], 3, FALSE)      22
    =INDEX(Products[Cost], MATCH("Lamp", Products[Product], 0))   22
    =XLOOKUP("Lamp", Products[Product], Products[Cost])           22

All three agree. Now somebody adds a Supplier column to the reference table, between ListPrice and Cost. Nothing else changes. Same three formulas, untouched:
    
    
    =VLOOKUP("Lamp", Products[[Product]:[Cost]], 3, FALSE)      Northlight
    =INDEX(Products[Cost], MATCH("Lamp", Products[Product], 0))   22
    =XLOOKUP("Lamp", Products[Product], Products[Cost])           22

The VLOOKUP now returns a supplier name where a cost used to be. It did nothing wrong: it was told to count three columns across, it counted three columns across, and the third column is Supplier now. The number 3 was a fact about the layout on the day it was typed, frozen into the formula.

Say out loud what the damage looks like if the inserted column had been numeric instead of text. Text at least stands out; `Northlight` in a cost column is visible. A second price column in the same slot would have produced a wrong number that formats, sums and charts exactly like a right one, and the workbook would have looked perfectly healthy.

INDEX MATCH survives because nothing in it refers to a position that a human chose. `Products[Cost]` means the Cost column wherever the Cost column now is. If you would rather keep VLOOKUP, you can get most of the way there by replacing the number with a MATCH on the header row, `MATCH("Cost", Products[#Headers], 0)`, which is the single highest-value edit in this whole guide.

## 6. The fourth argument that returns a wrong answer with no error

Before the explanation: our Products table lists Desk, Chair, Lamp in that order, which is not alphabetical. Here is a VLOOKUP for the price of a Desk with the last argument set to TRUE. The right answer is 220. Predict what it returns.
    
    
    =VLOOKUP("Desk", Products[[Product]:[Cost]], 2, TRUE)
    
    
    85

85 is the price of a Chair. No error, no warning, no colour. That is what the last argument does when it is TRUE, which is also what it does when you leave it out entirely.

TRUE means **approximate match** , and approximate match makes one assumption: that your lookup column is sorted ascending. Under that assumption it can stop early and take the last value it passed that was not too big, which is genuinely useful for banding, where you want "whatever bracket this number falls into". Point it at an unsorted list and the assumption is false, so it stops in the wrong place and reports whatever was there with complete confidence.

The lesson is not that TRUE is bad. It is that a lookup has two different jobs, and they need different settings. Finding a specific known key is an exact-match job, and needs `FALSE` in VLOOKUP or `0` in MATCH, typed every single time. Finding which band a number falls into is an approximate-match job, and needs a sorted table you built on purpose.

MATCH has the same three-way setting, and the same trap: its third argument defaults to 1, which is approximate. Typing the `0` is not optional politeness. It is the difference between an answer and a guess.

## 7. Two-way lookup: a row and a column at once

INDEX's second argument is a row position. It also takes a third argument, a column position, and both of them can be a MATCH. That turns any grid into something you can query by two labels.
    
    
    =INDEX(Products[[ListPrice]:[Cost]],
           MATCH("Chair", Products[Product], 0),
           MATCH("Cost",  Products[[#Headers],[ListPrice]:[Cost]], 0))
    
    
    52

Read it the same way: find the Chair row, find the Cost column, hand me the cell where they cross. Change either word and the formula follows. Put those two words in cells and let somebody type into them, and you have built a small lookup tool with no macros and nothing to maintain.

This is the case that still belongs to INDEX MATCH, because a two-way lookup is not something VLOOKUP can express at all, and XLOOKUP needs to be nested inside itself to manage it. One INDEX with two MATCHes is easier to read than any of the alternatives.

Picture your own reference tables for a second: a rate card, a shipping matrix, a tax table, a grade boundary sheet. Which one of them do you currently look things up in by scrolling and pointing at the screen? That is the one to convert first.

## 8. What MATCH is fussy about, and what it forgives

Two facts, both worth knowing exactly, both checked rather than assumed.

**Case does not matter.** Searching for `"lamp"` in a list containing `Lamp` returns 3, the same as searching for `"Lamp"`. Excel's text comparison here ignores capitals, so a key that arrives in a different case still finds its row.

**Spaces matter completely.** Searching for `"Lamp "`, with one trailing space, returns `#N/A`.
    
    
    =MATCH("lamp",  Products[Product], 0)      3
    =MATCH("Lamp ", Products[Product], 0)      #N/A

That pair explains most mystery lookup failures. The value on screen looks identical to the value in the reference table, because a trailing space is invisible, and the formula is quite correct that they are different strings. Before rewriting a lookup that "should work", wrap the key in `TRIM()` and see whether the problem disappears.

A third mismatch is just as common and even harder to see: a key that is a number in one table and text in another. `1001` and `"1001"` never match. The tell is that the failing keys are always the numeric-looking ones, and the fix is to make one side agree with the other rather than to keep adjusting the formula. When the keys differ in messier ways than spaces and capitals, that is a bigger job with a name: [entity resolution](https://michaelnocito.github.io/analyst-prep-kit/guides/entity-resolution/).

## 9. XLOOKUP, and when INDEX MATCH still earns its place

XLOOKUP does this job in one function, defaults to exact match, and takes the lookup column and the return column as two separate arguments, which is the same separation that makes INDEX MATCH robust.
    
    
    =XLOOKUP("Lamp", Products[Product], Products[Category])
    
    
    Lighting

If XLOOKUP is available to you and to everyone who opens your file, use it for ordinary one-directional lookups. It is shorter and its defaults are the safe ones.

Three situations still go to INDEX MATCH. A workbook that has to open in an older Excel, or in another spreadsheet program, where XLOOKUP is not there and the formula arrives as `#NAME?`. A two-way lookup, from section seven. And reading somebody else's model, which is the honest reason to learn it even if you never type it: INDEX MATCH is in millions of live workbooks and you will be asked to change one.

None of the three lookups protects you from a key that genuinely is not there. All of them return `#N/A`, which is the correct behaviour, and hiding it is its own mistake. What to wrap around it, and when hiding an error is the wrong move, is a page of its own.

## The full before and after

The orders table can tell you what came in. On its own it cannot tell you what any of it was worth keeping, because cost lives in the other table.

### Before
    
    
    Total revenue     9,890

One number, and no way to act on it. Sixteen orders, three products, and no idea which of them is carrying the business.

### After

One lookup column on the orders table, `=INDEX(Products[Cost], MATCH([@Product], Products[Product], 0))`, and every row can now be costed.
    
    
    Product   Units   Revenue    Cost    Gross profit   Margin
    Desk         23      5,060   3,220          1,840    36.4%
    Chair        38      3,230   1,976          1,254    38.8%
    Lamp         40      1,600     880            720    45.0%
    Total       101      9,890   6,076          3,814    38.6%

Check one line by hand: desks sold 23 units at a cost of 140 each, so 23 × 140 = 3,220, and 5,060 − 3,220 = 1,840. The revenue column still adds to 9,890, so nothing went missing on the way through the lookup.

And now there is a claim instead of a list. **Lamps are the smallest product line by revenue, 1,600 of 9,890, and the most profitable per pound sold, at 45.0% against the desk's 36.4%.** A revenue ranking puts lamps last and a margin ranking puts them first, and the only thing standing between those two sentences is one lookup.

## Edge cases that break a lookup quietly

Six that each cost somebody an afternoon.

**The key appears twice in the reference table.** MATCH, VLOOKUP and XLOOKUP all stop at the first hit and never mention the second. If your reference table can contain duplicates, count them before you trust the lookup: `COUNTIF` on the key column, and anything above 1 is a decision you have to make rather than one Excel should make for you.

**The ranges are different lengths.** INDEX on a 4-row column with MATCH over a 5-row column will happily return the wrong row, or `#REF!` if the position runs off the end. Point both at whole named columns and they cannot drift apart.

**Half-locked references.** Copying `MATCH(A2, B2:B4, 0)` down the sheet slides the lookup range to `B3:B5`, so the last rows search a range that is missing entries. Lock it with `$B$2:$B$4`, or use a named table, where the range cannot slide at all.

**An`#N/A` that got hidden too early.** Wrapping the lookup in something that turns errors into a blank or a zero makes the sheet look clean and makes an unmatched key invisible. Count the misses first, decide what they mean, and only then decide what to display.

**Lookups against a whole column on a large table.** `MATCH(A2, D:D, 0)` scans a million cells per row. On a few hundred rows nobody notices; on fifty thousand the file starts taking seconds to recalculate. Point at the table, not the column letter.

**A reference table that grew.** A fixed range like `$B$2:$B$4` never sees a fourth product, so new items silently return `#N/A` forever. This is the same argument as Ctrl+T everywhere else in this set of guides: a named table grows, a typed range does not.

## Why this works

What this formula is doing has a name older than Excel. Two tables share a key, and you are attaching a fact from one to the rows of the other, which is a join in the relational sense: the key identifies a row uniquely, and the attributes of that row can then be brought alongside any row that references it (Codd, 1970, _Communications of the ACM_ , 13(6), 377–387). Seeing it as a join explains the failures rather than just listing them. A duplicate key breaks the promise of unique identification, so the result depends on row order, which is why Excel returns the first hit and SQL returns two rows. A missing key has no match, so the only honest answer is nothing, which is what `#N/A` means. And a hard-coded column number is not part of the join at all; it is a fact about where the data happens to sit today, which is precisely why it decays.

The wider argument for preferring the version that cannot silently drift is that spreadsheet errors are normal rather than rare. Reviews of the audit literature find errors in a large majority of the operational workbooks examined, and the errors that survive review are the ones that produce plausible numbers rather than visible breakage (Powell, Baker, & Lawson, 2008, _Decision Support Systems_ , 46(1), 128–138). Both failures on this page are exactly that kind: `85` where the answer was `220`, and a supplier name where a cost should be. Neither turns anything red. Choosing a formula shape that cannot fail that way is cheaper than promising to check more carefully.

There is also a reason this page kept asking you to predict an output before showing it. Explaining a step to yourself before being given the explanation measurably improves what you retain from it, across a wide range of subjects and ages (Chi, Bassok, Lewis, Reimann, & Glaser, 1989, _Cognitive Science_ , 13(2), 145–182). The 85 sticks because you committed to 220 first.

## Using this on your own project

Converting every lookup in an inherited workbook is miserable and you will stop at the fourth one. Do this instead, in order.

  1. **Find the hard-coded numbers first.** Search your formulas for `VLOOKUP` and look only at the third argument. Those numbers are the whole risk.
  2. **Replace the number with a MATCH on the header** , `MATCH("Cost", Products[#Headers], 0)`. This is a five-second edit per formula and it removes the inserted-column failure without rewriting anything.
  3. **Make sure every lookup ends in`0` or `FALSE`**, explicitly. An omitted last argument is an approximate match wearing a disguise.
  4. **Ctrl+T both tables** so the ranges cannot slide when copied and cannot go stale when rows are added.
  5. **Count the misses on purpose** before you hide them: `=COUNTIF(range,"#N/A")` on the results, or a quick filter. Unmatched keys are a finding about your data, not a formatting problem.
  6. **Reach for INDEX MATCH when the answer is to the left, or when you need a row and a column** , and use XLOOKUP for everything else if your readers' Excel supports it.

If you have paper nearby, one optional sketch is worth five minutes. Draw two narrow columns side by side, write your own key values down the first and the values you want out down the second, and circle one row across both. Then write the position number in the margin. Everything on this page is that number, and drawing it once is what makes the nested formula stop looking nested.

**More detail on this, and more like it.** Every how-to sits in one place on the [guides index](https://michaelnocito.github.io/analyst-prep-kit/guides/): Excel, SQL, Python, and the working habits around them.

## The whole thing on one screen

This is the retrieval sheet. Cover the right column, work down the left, and say each answer out loud before you check it.

| Thing                     | What it does                                                                                 |
|---------------------------|----------------------------------------------------------------------------------------------|
| `MATCH(what, where, 0)`   | Returns the position of a value in a list. A number, nothing else.                           |
| MATCH's third argument    | `0` exact. `1` largest not over, needs ascending. `-1` smallest not under, needs descending. |
| MATCH's default           | 1, approximate. Always type the `0`.                                                         |
| `INDEX(range, n)`         | Returns the nth item of a range. No searching at all.                                        |
| The pair                  | `INDEX(answer_col, MATCH(key, key_col, 0))`.                                                 |
| How to read it            | Inside out: find the key, then read the same position in the other column.                   |
| How to type it            | MATCH first, on its own. Check the number. Then wrap INDEX around it.                        |
| Answer to the left        | Works, because searching and fetching are separate arguments.                                |
| Inserted column           | No effect. Nothing refers to a position a human chose.                                       |
| VLOOKUP's third argument  | A frozen count of columns. Replace with `MATCH(heading, headers, 0)`.                        |
| VLOOKUP's fourth argument | TRUE or omitted is approximate, and on unsorted data it returns a wrong value with no error. |
| Two-way lookup            | `INDEX(grid, MATCH(row), MATCH(col))`. The case INDEX MATCH still owns.                      |
| Case                      | Ignored. `lamp` finds `Lamp`.                                                                |
| Spaces                    | Not ignored. `"Lamp "` returns `#N/A`. Try TRIM first.                                       |
| Number against text key   | Never matches. Fix the data, not the formula.                                                |
| Duplicate key             | First hit wins, silently. COUNTIF the key column.                                            |
| `#N/A`                    | The key is not there. A finding, not a formatting problem.                                   |
| XLOOKUP                   | Same job in one function, exact by default. Use it when everyone's Excel has it.             |

**The one habit to keep.** No lookup formula should contain a number that describes where a column currently sits. Either the formula names the column, or it finds the column with a MATCH on the heading. That single rule is what makes a workbook survive other people editing the data it reads. If a lookup breaks in a way this page does not cover, there is a general [diagnosis loop for being stuck](https://michaelnocito.github.io/analyst-prep-kit/guides/technical-tenacity/).

One last thought, and I would genuinely like other people's answers. The worst one I have found in the wild was a VLOOKUP pulling column 7 out of a report that had gained a column three months earlier, so every figure in a monthly pack had been one field off since April and every total still balanced. What is the quiet lookup failure you found late, and what finally gave it away?

## References

  * Codd, E. F. (1970). A relational model of data for large shared data banks. _Communications of the ACM_ , 13(6), 377–387.
  * Powell, S. G., Baker, K. R., & Lawson, B. (2008). A critical review of the literature on spreadsheet errors. _Decision Support Systems_ , 46(1), 128–138.
  * Chi, M. T. H., Bassok, M., Lewis, M. W., Reimann, P., & Glaser, R. (1989). Self-explanations: How students study and use examples in learning to solve problems. _Cognitive Science_ , 13(2), 145–182.

---

*The full version of this guide lives on my site: [INDEX MATCH vs VLOOKUP: The Lookup That Survives a New Column](https://michaelnocito.github.io/analyst-prep-kit/guides/excel-index-match/).*

*If it was useful: [Buy Me a Coffee](https://buymeacoffee.com/michaelnocito).*
