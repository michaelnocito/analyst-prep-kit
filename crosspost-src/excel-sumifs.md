By the end of this page you can total, count, or average exactly the rows that match your conditions, stack as many conditions as you need, and check the answer against the raw data before anyone else sees it. It is about twenty minutes, and every number here is computed on the 16-row table shown below.

Here is what to actually do with it. The next time you filter a sheet, note a total from the status bar, and then undo the filter, write a SUMIFS instead. It is that whole loop, filter, read, undo, in one formula that stays on the sheet and updates itself.

The short version: `SUMIFS` is a filter and a sum in one move. It takes the column to add first, then pairs of "look in this column, keep rows matching this". And use SUMIFS even for one condition, because SUMIF puts its arguments in a different order and the mix-up produces real wrong numbers.

One picture carries the idea. Rows pass through one gate per condition, and only the survivors get added.

**The worked example is small on purpose.** Sixteen sales rows, four columns, sitting in A1 to D17: Region in column A, Month in B, Rep in C, Amount in D. Every result on this page was computed against this exact table, twice, by different methods. Row 17 has a blank region, and that blank is deliberate: it is the trap in section 6.

| Region | Month | Rep | Amount |
|--------|-------|-----|--------|
| East   | Jan   | Ana | 1,200  |
| East   | Jan   | Ben | 950    |
| East   | Feb   | Ana | 1,480  |
| East   | Feb   | Ben | 720    |
| East   | Mar   | Ana | 1,130  |
| West   | Jan   | Cal | 860    |
| West   | Jan   | Dee | 1,340  |
| West   | Feb   | Cal | 990    |
| West   | Feb   | Dee | 1,610  |
| West   | Mar   | Cal | 1,275  |
| North  | Jan   | Eve | 430    |
| North  | Feb   | Eve | 880    |
| North  | Mar   | Eve | 1,520  |
| South  | Jan   | Fox | 640    |
| South  | Mar   | Fox | 1,055  |
|        | Feb   | Gil | 500    |

## 1. Filtering and summing in one formula

Before the explanation: how would you get February's East total from that table with no formula at all, just menus, and how many steps would it take?

You would filter Region to East, filter Month to Feb, read the sum off the status bar, and undo both filters. Four steps, a number that lives nowhere, and a sheet you have temporarily broken for anyone else looking at it. Conditional aggregation is that same job as one formula: filter the rows and sum them in a single move, with the answer stored in a cell.
    
    
    =SUMIFS(D2:D17, A2:A17, "East", B2:B17, "Feb")   → 2,200

Read it left to right. **D2:D17** is the column to add, and in SUMIFS it always comes first. Then come **criteria pairs**. A criteria pair is two arguments that travel together: a range to look in, and the condition rows must meet there. `A2:A17, "East"` is one pair, keep rows whose region is East. `B2:B17, "Feb"` is another, and rows must pass both. Two rows do, Ana's 1,480 and Ben's 720, and 1,480 + 720 = 2,200.

Pairs stack as far as you need, up to 127 of them. Add `C2:C17, "Ana"` and the answer narrows to 1,480, just her February East sale. Every pair is another gate from the picture above, and the gates always combine as AND: all conditions, not any.

## 2. SUMIF against SUMIFS, and the argument-order trap

Before the explanation: SUMIF is the older, single-condition version. If you had designed it first, and later needed a multi-condition version, why might the sum column end up in a different position?

Here is the trap in one pair of lines. Both of these return East's total, 5,480.
    
    
    =SUMIF(A2:A17, "East", D2:D17)          → 5,480  (sum range LAST)
    =SUMIFS(D2:D17, A2:A17, "East")         → 5,480  (sum range FIRST)

SUMIF puts the sum range at the end, as its third argument. SUMIFS puts it at the beginning. The reason is the design history you just guessed at: SUMIF's shape was range, condition, then an optional "actually sum this other column". When Microsoft built SUMIFS, the sum range could no longer be optional or last, because the criteria pairs need open-ended room to stack behind it. So the two functions read backwards from each other, forever.

Say out loud which argument comes first in each function before reading on. If you just hesitated, that hesitation is the trap: people switch between the two functions and feed ranges in the wrong slots, and Excel often cannot tell, because a region column and an amount column are both just ranges to it.

My advice is to end the problem instead of managing it. Always write SUMIFS, even for one condition. It costs one extra letter, it handles every case SUMIF handles, and your workbooks end up with exactly one argument order in them. Same for COUNTIFS over COUNTIF and AVERAGEIFS over AVERAGEIF.

## 3. Writing criteria: text, numbers, comparisons, and cell references

Before the explanation: "East" needs quotes, and comparing against 1000 involves quotes too, but in a stranger place. Where do you think the quotes go in "amount is at least 1000"?

Criteria come in three flavours, and the quoting rules are the whole difficulty.

**Text criteria** go in quotes: `"East"`, `"Feb"`, `"Ana"`. Matching ignores upper and lower case, so "east" works too.

**Plain number criteria** need no quotes. `=SUMIFS(D2:D17, D2:D17, 500)` would sum only rows whose amount is exactly 500, and here that is just Gil's row: 500.

**Comparison criteria** put the operator and the number together inside quotes, as one piece of text: `">=1000"`. That reads strangely the first time, but the whole comparison is handed over as a small instruction string.
    
    
    =SUMIFS(D2:D17, D2:D17, ">=1000")   → 10,610

Eight of the sixteen rows are 1,000 or more, and 1200 + 1480 + 1130 + 1340 + 1610 + 1275 + 1520 + 1055 = 10,610. Criteria pairs also mix freely, so East rows of at least 1,000 is `=SUMIFS(D2:D17, A2:A17, "East", D2:D17, ">=1000")`, which is 1200 + 1480 + 1130 = 3,810.

**Referencing a cell inside a comparison** is the one worth memorizing, because it is what makes a report adjustable. If the threshold 1000 sits in cell F1, you cannot write ">=F1", because that would compare against the literal text F1. You glue the operator text to the cell's value with `&`, the join symbol:
    
    
    =SUMIFS(D2:D17, D2:D17, ">="&F1)   → 10,610 when F1 holds 1000

Now the reader changes F1 and every total on the sheet follows. Where that threshold number should come from is its own question, and [choosing thresholds from the data](https://michaelnocito.github.io/analyst-prep-kit/guides/data-driven-thresholds/) is the honest way to answer it.

## 4. COUNTIFS and AVERAGEIFS, same grammar

Before the explanation: knowing SUMIFS, what do you expect COUNTIFS to take as its first argument, given that a count has no column to add?

Nothing, is the answer. Counting needs no sum column, so COUNTIFS is criteria pairs only:
    
    
    =COUNTIFS(A2:A17, "East", B2:B17, "Feb")   → 2
    =COUNTIFS(B2:B17, "Feb")                   → 6

Two East rows in February, six February rows overall, and you can confirm both by eye in the table above. COUNTIFS is also the audit tool for the rest of the family: before trusting any SUMIFS, ask COUNTIFS how many rows it stood on. A total of 2,200 means something different resting on 2 rows than on 200, which is the same small-sample honesty that [GROUP BY and HAVING](https://michaelnocito.github.io/analyst-prep-kit/guides/sql-group-by-having/) teaches on the SQL side.

AVERAGEIFS is one paragraph because it is SUMIFS's grammar exactly: average column first, then criteria pairs. `=AVERAGEIFS(D2:D17, A2:A17, "West")` returns 1,215, which is West's five sales, 860 + 1340 + 990 + 1610 + 1275 = 6,075, divided by 5. The only extra thing to know: if no rows match, AVERAGEIFS shows a divide-by-zero error rather than a zero, and that error is it telling you the truth.

## 5. The full before and after

Same table, same question: what did each region sell in February?

### Before

The manual loop. Filter Region to East, filter Month to Feb, read 2,200 off the status bar, write it in another sheet by hand, undo, repeat for West, North, South. Four totals, sixteen menu actions, and the pasted numbers go stale the moment a row is added. The worst part is not the effort. It is that nothing connects the typed 2,200 back to the data, so nobody can check it later, including you.

### After

A small summary block. Put the region names in F2 to F5, then one formula in G2, written once with dollar signs so it fills down:
    
    
    =SUMIFS($D$2:$D$17, $A$2:$A$17, F2, $B$2:$B$17, "Feb")

| Region | Feb total |
|--------|-----------|
| East   | 2,200     |
| West   | 2,600     |
| North  | 880       |
| South  | 0         |

Every number is live, every number is checkable, and the block updates itself when March lands. Two of these rows are also warnings, and that is the next section, because South's 0 and the missing 500 from Gil's blank-region row are both trying to tell you something. Picture building this exact block on your own sales data before you read on: which column is your region, which is your amount, and what would sit in F2?

## 6. Edge cases: blanks, dates, and mismatched ranges

Before the explanation: add the four February totals above. You get 5,680. But summing every February row in the table gives 6,180. Where did 500 go?

**Blanks fall out of every named group.** That missing 500 is Gil's row, whose region cell is empty. It matches "East" no, "West" no, and so on, so it appears in no region's total, and no error says so. A region summary that silently omits rows is how a report disagrees with the ledger. The check is one formula: `=SUMIFS(D2:D17, A2:A17, "")` returns 500, the total sitting on blank regions. If that is not zero, you have unassigned rows to fix or to report as their own line.

**A zero result has two meanings.** South's February total is 0 because South has no February rows at all. A zero can mean "matched rows adding to zero" or "matched nothing". `=COUNTIFS(A2:A17, "South", B2:B17, "Feb")` returning 0 settles which one you have.

**Dates in criteria work best as brackets.** Our Month column holds text, so "Feb" matches it directly. Real tables usually hold actual dates like 14-Feb-2026, and no single criterion matches "the whole month". The pattern is two criteria on the same column, a floor and a ceiling:
    
    
    =SUMIFS(D2:D17, B2:B17, ">="&DATE(2026,2,1), B2:B17, "<"&DATE(2026,3,1))

That reads: on or after February 1st, and before March 1st. Using `DATE(2026,2,1)` instead of typing "2/1/2026" sidesteps every regional date-format ambiguity. On our table, with the Month column as dates, that bracket would return February's full 6,180.

**All ranges must be the same size.** If the sum range is D2:D17 and a criteria range is A2:A16, Excel shows #VALUE!. Annoying, but honest, and the fix is making every range cover the same rows. The quiet version of this mistake is a criteria range shifted by one row, D2:D17 against A3:A18, which is the same height and errors nowhere. Whole-column references, D:D against A:A, remove both risks on a simple sheet.

## Why this works

SUMIFS earns its keep because it makes a stated claim instead of a performed action. A filtered status-bar total is an action: it happened, you saw it, and no trace remains. A SUMIFS cell is a claim written down: these rows, these conditions, this total, checkable by anyone later. That is the same reason analysts keep SQL queries and [documented limitations](https://michaelnocito.github.io/analyst-prep-kit/guides/documenting-data-limitations/) rather than memories of what they clicked. The formula is the audit trail.

The verify-it-twice habit this page keeps modelling has a statistical backbone too. Cleveland and McGill showed that people misjudge quantities read from visual displays in systematic, measurable ways (Cleveland & McGill, 1984, _Journal of the American Statistical Association_ , 79(387), 531–554). Eyeballing a filtered column is a perceptual judgement, and a formula is not, which is why the two disagreeing is so informative: when they differ, believe neither until you know why.

And this page kept asking you to predict before it explained. Prompting a learner to generate an explanation before receiving one reliably improves understanding compared to reading alone, across more than sixty studies (Bisra, Liu, Nesbit, Salimi, & Winne, 2018, _Educational Psychology Review_ , 30(3), 703–725). Guessing where the quotes go in ">=1000" is why the answer will still be there next week.

## Using this on your own workbook

Rebuilding every hand-typed summary in an old workbook is miserable, and you will stop halfway. Do this instead, in order.

  1. **Pick one summary you already report** , a single number someone actually reads, and rebuild just that one as a SUMIFS.
  2. **Verify it against a filter or a pivot table before you trust it.** Filter the raw data to the same conditions and compare totals, or drop the data in a pivot and read the same cell. This is the answer-checks habit: a SUMIFS is a claim, and a claim gets checked once against an independent method before it ships. If the two disagree, the usual culprits are blanks, a shifted range, or a criterion matching text against numbers.
  3. **Add the two audit formulas next to it.** A COUNTIFS with the same criteria, so readers see how many rows the total stands on, and a blank-criteria SUMIFS, so unassigned rows cannot hide.
  4. **Move thresholds and month choices into cells** , referenced with the `">="&F1` pattern, so the report adjusts without editing formulas.
  5. **Convert the rest only as you touch them.** A hand-typed number nobody reads is not the priority. The one in Friday's meeting is.

If you have paper and five minutes, one optional drawing makes the grammar stick. Draw eight rows flowing through two gates into a sum box, and label the gates with a condition from your own data, your region, your month. Then write the SUMIFS that matches your drawing, sum column first. If the drawing and the formula agree, you own this.

**More detail on this, and more like it.** Every how-to sits in one place on the [guides index](https://michaelnocito.github.io/analyst-prep-kit/guides/): Excel, SQL, Tableau, and the working habits around them.

## The whole thing on one screen

This is the retrieval sheet. Cover the right column, work down the left, and say each answer out loud before you check it.

| Concept              | The answer                                                                                         |
|----------------------|----------------------------------------------------------------------------------------------------|
| What SUMIFS does     | Filters rows by every condition, sums the survivors, in one formula.                               |
| SUMIFS shape         | `=SUMIFS(sum_range, range1, criterion1, range2, criterion2, ...)`                                  |
| The trap             | SUMIF puts the sum range last. SUMIFS puts it first. They read backwards from each other.          |
| The fix              | Always write SUMIFS, even for one condition. One argument order everywhere.                        |
| Criteria pair        | A range to look in plus the condition rows must meet there. Pairs stack, up to 127.                |
| How pairs combine    | Always AND. Every condition must pass for a row to count.                                          |
| Text criterion       | `"East"`, in quotes, case does not matter.                                                         |
| Number criterion     | `500`, no quotes, matches exactly.                                                                 |
| Comparison criterion | `">=1000"`, operator and number together inside quotes.                                            |
| Cell in a criterion  | `">="&F1`, operator text joined to the cell with &.                                                |
| COUNTIFS             | Criteria pairs only, no sum column. The audit tool for every SUMIFS.                               |
| AVERAGEIFS           | Same shape as SUMIFS. No matches gives a divide-by-zero error, on purpose.                         |
| The blank trap       | Rows with a blank criteria cell fall out of every named group silently. Check with criterion `""`. |
| A zero result        | Either rows summing to zero or no rows at all. COUNTIFS tells you which.                           |
| Dates                | Bracket with two criteria on one column: `">="&DATE(...)` and `"<"&DATE(...)`.                     |
| Range sizes          | All ranges the same rows. Same-height-but-shifted is the silent version.                           |
| The habit            | Verify one SUMIFS against a filter or pivot before it ships.                                       |

**The one habit to keep.** If you take nothing else from this page, check every SUMIFS you ship against a filter or a pivot once, and keep a COUNTIFS beside it so readers see how many rows the number stands on. A wrong conditional total never looks wrong. It looks like 5,680 when the truth is 6,180. If a formula breaks in a way this page does not cover, there is a general [diagnosis loop for being stuck](https://michaelnocito.github.io/analyst-prep-kit/guides/technical-tenacity/).

One last thought, and I would genuinely like other people's answers. My blank-region row was worth 500 and hid for one reporting cycle before a totals check caught it. What is the biggest gap you have found between a summary sheet and the raw data underneath it, and which check finally surfaced it?

## References

  * Cleveland, W. S., & McGill, R. (1984). Graphical perception: Theory, experimentation, and application to the development of graphical methods. _Journal of the American Statistical Association_ , 79(387), 531–554.
  * Bisra, K., Liu, Q., Nesbit, J. C., Salimi, F., & Winne, P. H. (2018). Inducing self-explanation: A meta-analysis. _Educational Psychology Review_ , 30(3), 703–725.

---

*The full version of this guide lives on my site: [SUMIFS and COUNTIFS: Add Up Only the Rows That Match](https://michaelnocito.github.io/analyst-prep-kit/guides/excel-sumifs/).*

*If it was useful: [Buy Me a Coffee](https://buymeacoffee.com/michaelnocito).*
