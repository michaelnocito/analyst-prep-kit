By the end of this page you can stop one broken cell from poisoning a whole total, choose deliberately between showing a zero, a blank or a label, and know exactly which errors you just made invisible. It is about twenty-five minutes, and every number and error message below came out of Excel rather than out of memory.

Here is what to do today. Before you wrap anything in IFERROR, count what you are about to hide: put `=SUMPRODUCT(--ISNA(C2:C500))` next to the column and read the number. If it is zero, you did not need IFERROR. If it is not zero, that number is a fact about your data, and it belongs somewhere a reader can see it.

The short version: `IFERROR(something, what_to_show_instead)` runs the something, and if it comes back as any error at all, shows your replacement instead. The catch is in the words "any error at all".

That is the idea the rest of the page hangs from, so it gets the picture.

> _The original carries a diagram here. In words: Six small chips are spread across the top of the picture, each holding one Excel error value: hash N slash A, hash REF exclamation, hash DIV slash zero exclamation, hash VALUE exclamation, hash NAME question mark, and hash NUM exclamation. The first chip is outlined in blue and the other five are outlined in amber, marking the difference between the one error a person usually means to catch and the five they do not. An arrow drops from every chip, blue from the first and amber from the rest, and all six arrows converge on a single solid horizontal bar drawn across the middle of the picture and labelled IFERROR. Nothing passes through the bar. Below the bar a single arrow leads down to one plain grey cell containing the digit zero, with no outline colour and no marking of any kind. The picture shows six different problems entering and one indistinguishable value leaving._

**Every result on this page is real.** Each error value below was produced by writing a formula that causes it, and the worked case at the centre of the page was run in Excel on the sixteen-row orders table used across this whole set of guides.

## 1. What an error is, and the seven you will meet

An Excel error is not a crash and it is not a warning. It is a _value_ , in the same way that 42 and "Tuesday" are values. It sits in the cell, it flows into anything that reads that cell, and one of it in a range is enough to turn a total into an error too.

Each one names a different problem, and reading the name is usually faster than debugging. Here are the seven you will actually meet, each produced by running a formula that causes it.

| Error     | What Excel is telling you                                              | A formula that produces it            |
|-----------|------------------------------------------------------------------------|---------------------------------------|
| `#DIV/0!` | Divided by zero or by an empty cell.                                   | `=1/0`                                |
| `#N/A`    | A lookup found nothing. Not available.                                 | `=MATCH("Sofa",Products[Product],0)`  |
| `#VALUE!` | Wrong type of thing. Text where a number belongs.                      | `="a"+1`                              |
| `#NAME?`  | Excel does not recognise a name. Usually a typo or a missing function. | `=NotAFunction(1)`                    |
| `#NUM!`   | A number the maths cannot produce.                                     | `=SQRT(-1)`                           |
| `#NULL!`  | Two ranges that were asked to overlap and do not.                      | `=SUM(A1:A5 C1:C5)`                   |
| `#REF!`   | The cell this pointed at no longer exists.                             | Delete a column a formula referred to |

Before reading on, pick out which one of those seven is a statement about your _data_ and which are statements about your _formula_. That split is the whole argument of this page.

Only `#N/A` is really about the data: it says a key you looked for is not in the list, which may be perfectly normal. The other six say the formula is asking for something impossible. `#REF!` in particular means the formula is now broken in a way that will never fix itself. Those are not the same kind of news, and a tool that treats them the same is a tool to use carefully.

## 2. The syntax, and where the formula goes

Two arguments. The thing you want, and what to show if the thing you want comes back as an error.
    
    
    =IFERROR( your_formula , what_to_show_instead )

So a lookup that might miss becomes:
    
    
    =IFERROR(INDEX(Costs[Cost], MATCH([@Product], Costs[Product], 0)), 0)

Excel runs the inner formula once. If the answer is any value at all, you get that answer. If the answer is one of the seven errors above, you get your replacement. There is no third case.

One detail worth having straight: IFERROR does not fix anything. The lookup still failed. The division by zero still happened. All that changed is what is printed in the cell, and everything downstream now reads your replacement as if it were a real measurement.

## 3. What to put in the second argument: 0, blank, or a word

Before the explanation: twelve cost lookups succeed and four fail. Filling the four failures with 0 and filling them with `""` both look like tidying up. Say whether you would expect the column's average to come out the same either way.

It does not. Both were run on the same twelve values, which total 1,240.
    
    
    =AVERAGE(  filled with 0  )        77.5
    =AVERAGE( filled with "" )        103.3333

Filling with 0 gives Excel sixteen numbers, so it divides 1,240 by 16 and gets 77.5. Filling with `""` gives Excel twelve numbers and four pieces of text, and AVERAGE skips text, so it divides 1,240 by 12 and gets 103.33. Neither is a rounding difference. They are answers to two different questions, and the wrapper you typed chose which question got asked.

There is a further wrinkle in `""` worth knowing, because it catches people who test for emptiness. A cell holding `""` is not empty; it holds a piece of text that happens to have no characters. Run in Excel on such a cell:
    
    
    =ISBLANK(the cell)      FALSE
    =COUNT(the column)      12
    =COUNTA(the column)     16

COUNT counts numbers, so it says 12. COUNTA counts anything that is not empty, and since `""` is not empty it says 16. If a "count of records" on your sheet looks too high by exactly the number of failed lookups, this is why.

So, the three choices and what each one is actually claiming.

| Replacement   | What it says                      | Use it when                                                                                              |
|---------------|-----------------------------------|----------------------------------------------------------------------------------------------------------|
| `0`           | The measured value is zero.       | Zero really is the right answer, for example no sales in a period.                                       |
| `""`          | Nothing to show here.             | Sums must ignore it and the sheet is being read by a person, not fed onward.                             |
| `"Not found"` | We looked and there was no match. | Almost always the best answer during the work, because it is the truth and it is impossible to overlook. |

The rule underneath is short: never replace an error with a number unless that number is a measurement you would defend. A zero that means "we do not know" gets averaged, charted and summed exactly like a zero that means "none", and nobody downstream can tell them apart.

## 4. The four rows that vanished, worked end to end

Here is the whole risk as a single worked case, on the sixteen-row orders table used across this set of guides. Total revenue is 9,890 and there are three products: desks, chairs and lamps.

A cost list arrives from the finance system. It has desks and chairs on it. Lamps are missing, because lamps were set up in a different category last quarter and nobody mentioned it. So the cost lookup succeeds on twelve rows and returns `#N/A` on four. Wrapped the usual way:
    
    
    =IFERROR(INDEX(CostList[Cost], MATCH([@Product], CostList[Product], 0)), 0)

The sheet now looks completely clean. Not one error message anywhere. Here is what it reports, next to what is true.

| Figure             | What the sheet says | What is true |
|--------------------|---------------------|--------------|
| Cost of goods      | 5,196               | 6,076        |
| Gross profit       | 4,694               | 3,814        |
| Gross margin       | 47.5%               | 38.6%        |
| Rows with no cost  | not shown anywhere  | 4 of 16      |
| Units with no cost | not shown anywhere  | 40 of 101    |

Check the gap by hand: the missing lamp cost is 40 units at 22 each, which is 880, and 6,076 − 880 = 5,196. That single unstated 880 moves the reported margin by nearly nine percentage points, and it moves it in the flattering direction, which is the direction nobody questions.

Notice that every individual number on that sheet is arithmetically correct. The sum really is the sum of what is there. Nothing needs to be miscalculated for a report to be wrong; it is enough for something to be missing and for the missingness to be invisible. Without the IFERROR, the total would have shown `#N/A` and somebody would have asked why within a minute.

Now picture your own most-forwarded workbook. If four of its rows silently failed a lookup this month, which number on the summary tab would move, and would anyone be able to tell from looking at it?

## 5. Count the errors before you hide them

The fix is not to leave errors on the page forever. It is to make the count of them a number you deliberately produce and read.
    
    
    =SUMPRODUCT(--ISNA(C2:C17))     4      unmatched lookups
    =COUNT(C2:C17)                  12     rows that got a value
    =SUM(C2:C17)                    #N/A   the whole total, poisoned by one

That last line is worth sitting with. A single error in a range makes SUM return an error. People experience that as Excel being obstructive, and it is the most useful thing Excel does here: it refuses to add up a column it cannot fully see, and it refuses loudly. IFERROR does not solve that problem, it silences the alarm attached to it.

So the working order is: count first, understand what the misses are, decide what they mean, and only then choose what to display. If the four unmatched rows are genuinely nothing, a zero is honest. If they are lamps that cost 880, a zero is a false statement about the business. The formula cannot tell the difference; you can.

When the misses are real and you have to ship anyway, the count belongs in writing beside the result, not just in your head. That is a habit with its own page: [documenting data limitations](https://michaelnocito.github.io/analyst-prep-kit/guides/documenting-data-limitations/) covers how to say "4 of 16 orders have no cost on file, covering 40 units" without turning the report into an apology.

## 6. IFNA: the narrower net

Before the explanation: you wrap a lookup column in IFERROR to hide the unmatched keys. A month later somebody deletes a column and one of those formulas breaks with `#REF!`. Say what appears on your sheet.

Your replacement value. The broken formula looks exactly like an ordinary unmatched key. Here is the run.
    
    
    =IFERROR(#REF! * 2, "hidden")     hidden
    =IFNA(   #REF! * 2, "hidden")     #REF!

`IFNA` takes the same two arguments and catches **only** `#N/A`. Everything else passes straight through and stays visible. On a lookup that is the right instrument almost every time, because `#N/A` is the one error a lookup is entitled to produce. A `#REF!`, a `#VALUE!` or a `#NAME?` coming out of a lookup means something is broken, and you want to be told.

Both still hide the unmatched key itself, which is the case you meant to handle:
    
    
    =IFERROR(MATCH("Sofa", Products[Product], 0), "hidden")     hidden
    =IFNA(   MATCH("Sofa", Products[Product], 0), "hidden")     hidden

So the choice is simple. On anything that is a lookup, reach for IFNA. Keep IFERROR for the cases where the error genuinely is expected and is not `#N/A`, the commonest being a division whose denominator can legitimately be zero.

That division case deserves its own sentence, because zero and unknown are different there too. `=IFERROR(A2/B2, 0)` on a month with no orders reports a conversion rate of 0%, which reads as "we converted nobody" rather than "there was nobody to convert". If that distinction matters to your reader, say so: `=IF(B2=0, "no orders", A2/B2)` costs the same to type and cannot be misread.

## 7. The old ISERROR pattern, and why IFERROR replaced it

You will meet this shape in inherited workbooks, and it is worth being able to read.
    
    
    =IF(ISERROR(VLOOKUP(A2,Costs,2,FALSE)), 0, VLOOKUP(A2,Costs,2,FALSE))

It does the same job the long way round. The lookup is written twice: once to test whether it fails, once to produce the answer when it does not. That is worse on three counts. It is twice as much to read. Excel computes the lookup twice rather than once, which is invisible on a hundred rows and noticeable on fifty thousand. And any future edit has to be made in two places, so the two copies drift apart and the sheet starts testing one formula and returning another.
    
    
    =IFERROR(VLOOKUP(A2,Costs,2,FALSE), 0)

Same behaviour, one copy of the lookup. When you find the old pattern, this replacement is safe and mechanical. The relatives `ISERR`, `ISNA` and `IFERROR` all still have their uses, but `ISNA` earns its keep in a counting formula, as in section five, rather than wrapped around the thing it is testing.

## 8. Where the wrapper goes: at the edge, not in the middle

A wrapper is a decision about presentation, so it belongs where the sheet is presented, not in the middle of a calculation chain.

Put IFERROR around the last step and the intermediate columns stay honest. You can still see which rows failed, you can still count them, and only the final display column is smoothed. Put it around an early step instead and the failure is converted into a plausible number at row level, then carried through every subsequent column, and by the time anyone looks there is nothing left to find.

There is a related habit worth adopting from the same instinct: keep a small check block on any sheet that matters, off to one side, holding the row count, the error count and the total, all as formulas. Then a broken lookup shows up as a number that moved rather than as a colour nobody noticed. [Checking your work before anyone else does](https://michaelnocito.github.io/analyst-prep-kit/guides/excel-check-your-work/) is the fuller version of that idea.

## The full before and after

Same lookup, same missing lamps, same sixteen rows.

### Before
    
    
    =IFERROR(INDEX(CostList[Cost], MATCH([@Product], CostList[Product], 0)), 0)
    
    Cost of goods    5,196
    Gross profit     4,694
    Gross margin     47.5%

A clean sheet with no errors on it, reporting a margin that is 8.9 percentage points too high, with nothing anywhere to indicate that four rows are unpriced.

### After
    
    
    # the lookup column, honest about a miss
    =IFNA(INDEX(CostList[Cost], MATCH([@Product], CostList[Product], 0)), "no cost on file")
    
    # the check block, three cells, always visible
    Rows                =COUNTA(Orders[OrderID])          16
    Rows with no cost   =COUNTIF(D2:D17,"no cost on file")  4
    Units with no cost  =SUMIFS(...)                       40

Now the sheet says what it knows. The lookup still does not crash the page, because the unmatched rows carry a label rather than an error. The count is a number on the sheet rather than a fact in somebody's head. And the margin is not published until the four rows are either priced or explicitly excluded, which is a decision a person makes rather than a side effect of a wrapper.

The claim underneath, and it is the whole reason to care: **hiding four of sixteen rows moved the reported gross margin from 38.6% to 47.5%, and every individual number on the sheet was arithmetically correct the entire time.**

## Edge cases that break error handling quietly

Six that each cost somebody an afternoon.

**IFERROR around the whole formula when only one part can fail.** Wrapping `A2*VLOOKUP(...)` means a text value in A2 also gets hidden. Wrap the part that is allowed to fail, not the sentence it sits in.

**Zero-filled errors inside an average.** A mean over a column where failures became zeros is dragged toward zero by exactly the failures you could not see. This is the same problem NULLs cause in a database, and [the SQL version of it](https://michaelnocito.github.io/analyst-prep-kit/guides/sql-null/) is worth reading because the mechanism is identical.

**`""` counted as a record.** COUNTA and many pivot counts treat an empty string as present. Row counts come out right by luck and wrong by a few whenever the failure rate changes.

**An IFERROR that has outlived its reason.** Somebody wrapped a formula in 2023 because of a one-off import problem. The wrapper is still there and is now hiding a real failure that started in June. If you cannot say what error a wrapper exists to catch, it should not be there.

**Errors inside conditional formatting and charts.** A hidden error becomes a zero-height bar or an uncoloured cell, both of which read as a genuine low value. The chart is the last place you want a silent substitution.

**IFERROR on a spilled array.** Wrapping a dynamic array function returns the replacement for the entire spill rather than cell by cell, so one bad row can blank out the whole result. Check what the wrapper covers before you trust it.

## Why this works

The core distinction on this page is older than Excel and was worked out carefully in database theory: a value that is missing is not a value that is zero, and a system that conflates them will produce arithmetic that is locally correct and globally wrong. Codd's extension of the relational model made the case that missing information needs its own marker, precisely so that aggregates can decline to include what they do not know instead of quietly assuming it away (Codd, 1979, _ACM Transactions on Database Systems_ , 4(4), 397–434). Excel's `#N/A` is that marker, and its habit of poisoning a SUM is the feature, not the bug: it is the aggregate refusing to answer a question it cannot fully answer. IFERROR removes the marker. Everything on this page follows from that one sentence.

The reason it matters more in a spreadsheet than in a database is that spreadsheets are audited by eye. Field studies of operational workbooks have found errors to be common rather than exceptional, and the ones that survive review are consistently the ones that produce plausible output rather than visible breakage (Panko, 1998, _Journal of End User Computing_ , 10(2), 15–21). An error message is the cheapest audit tool a spreadsheet has, because it is the only part of the sheet that draws attention to itself. Trading it for a tidy-looking zero is trading the one thing that was working.

There is also a reason this page kept asking you to commit to an answer before showing one. Prompting a reader to generate something themselves, a prediction, an explanation, a comparison, produces better retention than the same material read straight through, and it is one of a small number of study techniques that survive meta-analysis (Fiorella & Mayer, 2016, _Educational Psychology Review_ , 28(4), 717–741). The 77.5 against 103.33 sticks because you were asked whether they would differ before you saw that they did.

## Using this on your own project

Auditing every wrapper in an inherited workbook is miserable and you will stop at the third sheet. Do this instead, in order.

  1. **Find them.** Ctrl+F, search for `IFERROR`, tick "Look in: Formulas". The list you get back is your work queue.
  2. **For each one, ask what error it exists to catch.** If you cannot name it, that wrapper is hiding something unknown, and it goes to the top of the list.
  3. **Count before you hide.** `=SUMPRODUCT(--ISNA(range))` beside the column. Do this before deciding anything.
  4. **Swap IFERROR for IFNA on every lookup** , so a broken formula stops disguising itself as a missing key.
  5. **Replace zero-fills with a label** while you are working, and only convert to a number at the very end if a number is genuinely the truth.
  6. **Put the error count on the sheet** , in a check block with the row count and the total, so the next surprise is a number that moved rather than a thing nobody saw.

If you have paper nearby, one optional sketch is worth five minutes. Draw your own lookup column as a strip of cells, mark the failures with a cross, and then write next to it the one number your report actually publishes. Draw an arrow from the crosses to that number. If you cannot draw the arrow, the failures are not reaching the summary, and that is the case where hiding them is fine.

**More detail on this, and more like it.** Every how-to sits in one place on the [guides index](https://michaelnocito.github.io/analyst-prep-kit/guides/): Excel, SQL, Python, and the working habits around them.

## The whole thing on one screen

This is the retrieval sheet. Cover the right column, work down the left, and say each answer out loud before you check it.

| Thing                    | What it does                                                        |
|--------------------------|---------------------------------------------------------------------|
| `IFERROR(x, y)`          | Shows y if x returns any error at all. Runs x once.                 |
| `IFNA(x, y)`             | Shows y only for `#N/A`. Everything else stays visible.             |
| Which to use on a lookup | IFNA. `#N/A` is the only error a lookup is entitled to.             |
| `#N/A`                   | A statement about your data: the key is not there.                  |
| `#REF!`                  | A statement about your formula: it is broken and will not recover.  |
| Errors and SUM           | One error in the range makes the total an error. That is the alarm. |
| Fill with `0`            | Claims the value is zero. Drags averages and totals.                |
| Fill with `""`           | Text, not empty. Skipped by AVERAGE and COUNT, counted by COUNTA.   |
| Fill with a word         | Truthful and impossible to overlook. The default while working.     |
| Count the misses         | `=SUMPRODUCT(--ISNA(range))`.                                       |
| Where to wrap            | The final display step, never an intermediate calculation.          |
| What to wrap             | Only the part that is allowed to fail.                              |
| The old pattern          | `IF(ISERROR(x),y,x)` computes x twice. Replace with IFERROR.        |
| Division by zero         | `IF(denominator=0,"no orders",a/b)` beats hiding it as 0%.          |
| The check block          | Row count, error count, total. Three formulas, always visible.      |

**The one habit to keep.** Count the errors before you hide them, and put the count on the sheet. A wrapper you added after reading a number is a presentation choice; a wrapper you added instead of reading the number is a decision you did not know you were making. If a formula breaks in a way this page does not cover, there is a general [diagnosis loop for being stuck](https://michaelnocito.github.io/analyst-prep-kit/guides/technical-tenacity/).

One last thought, and I would genuinely like other people's answers. The worst one I have met was an IFERROR wrapped around a currency conversion, so a missing rate became zero, and a whole region's revenue was reported as nil for two months while every subtotal on the page added up perfectly. What has an IFERROR hidden from you, and what finally made you look?

## References

  * Codd, E. F. (1979). Extending the database relational model to capture more meaning. _ACM Transactions on Database Systems_ , 4(4), 397–434.
  * Panko, R. R. (1998). What we know about spreadsheet errors. _Journal of End User Computing_ , 10(2), 15–21.
  * Fiorella, L., & Mayer, R. E. (2016). Eight ways to promote generative learning. _Educational Psychology Review_ , 28(4), 717–741.

---

*The full version of this guide lives on my site: [How to Use IFERROR in Excel, and What It Quietly Hides](https://michaelnocito.github.io/analyst-prep-kit/guides/excel-iferror/).*

*If it was useful: [Buy Me a Coffee](https://buymeacoffee.com/michaelnocito).*
