By the end of this page you can find every duplicate in a table, say precisely what you mean by duplicate before anything is deleted, choose which of two matching rows survives, and get a de-duplicated list without touching the original data at all. It is about twenty-five minutes, and every result below was produced by running the dialog in Excel and reading what came back.

Here is what to do today, before you open Remove Duplicates on anything. Add a column with `=COUNTIF($A$2:$A2, $A2)`, filled down, where A is your key. It counts how many times each value has appeared so far, so every 1 is a first sighting and everything above 1 is a repeat. Now you can see and count the duplicates, and you have not deleted anything.

The short version: Remove Duplicates compares only the columns you tick, keeps the first row of each group, deletes the rest permanently, and tells you a count rather than showing you what went.

That first part, the tick boxes being the definition, is the idea the rest hangs from, so it gets the picture.

> _The original carries a diagram here. In words: On the left is a small dialog panel listing four column names, each with a checkbox beside it: OrderID, Rep, Region and Units. Only the OrderID box is ticked; the other three are empty. An arrow runs from the panel to a two-row table on the right. Both rows carry the same order number, 1003, and the same region, East, and both order numbers are outlined in blue to show they are what the tick compared. The rows differ in their last cell: the upper row holds 3 and the lower row holds 5. The upper row is drawn normally. The lower row is greyed out with a line struck through it, and its cell holding 5 is ringed in amber and left legible, so the value that is about to be destroyed is the one thing still standing out. Nothing in the picture compared the last column, because its box was not ticked._

**Every result on this page is real.** An eight-row table, printed in full below, run through the Remove Duplicates dialog in Excel three different ways, with the surviving rows read back each time. If you want the same job in SQL, where nothing is deleted and the duplicates are listed instead, [finding duplicate rows in SQL](https://michaelnocito.github.io/analyst-prep-kit/guides/sql-find-duplicates/) is the companion.

Here is the table. Eight rows, and three of them repeat an order number.

| Row | OrderID | Rep        | Region | Units | What it is                         |
|-----|---------|------------|--------|-------|------------------------------------|
| 2   | 1001    | Dana Reyes | North  | 4     |                                    |
| 3   | 1002    | Owen Park  | South  | 10    |                                    |
| 4   | 1002    | Owen Park  | South  | 10    | the same row twice                 |
| 5   | 1003    | Priya Shah | East   | 3     |                                    |
| 6   | 1003    | Priya Shah | East   | 5     | same order number, different units |
| 7   | 1004    | Dana Reyes | North  | 6     |                                    |
| 8   | 1004    | Dana Reyes | north  | 6     | differs by one capital letter      |
| 9   | 1005    | Sam Okafor | West   | 12    |                                    |

Total units across all eight rows: 56. Hold on to that number.

## 1. What the dialog actually does

Data, Remove Duplicates. A panel opens listing your columns with a checkbox each, all ticked. Press OK and Excel compares every row against the ones above it using only the ticked columns, deletes any row whose ticked values it has already seen, and reports a message of the form "3 duplicate values found and removed; 5 unique values remain".

Three properties of that are worth stating plainly, because none of them is on the screen.

**It edits the data in place.** The rows are gone from the sheet. Ctrl+Z works, right then, and nothing works tomorrow.

**It never shows you what it removed.** You get a count. Comparing that count against what you expected is the only check available, and it is only available if you formed an expectation first.

**The count is of rows, not of problems.** Three removals could be three copies of one bad import or three different real orders, and the message reads identically either way.

## 2. The columns you tick are the definition

Before the explanation: eight rows go in. Predict how many come out with all four columns ticked, and how many with only OrderID ticked.

Both were run. With **all four columns** ticked, six rows remain:
    
    
    1001 | Dana Reyes | North | 4
    1002 | Owen Park  | South | 10
    1003 | Priya Shah | East  | 3
    1003 | Priya Shah | East  | 5
    1004 | Dana Reyes | North | 6
    1005 | Sam Okafor | West  | 12

With only **OrderID** ticked, five rows remain:
    
    
    1001 | Dana Reyes | North | 4
    1002 | Owen Park  | South | 10
    1003 | Priya Shah | East  | 3
    1004 | Dana Reyes | North | 6
    1005 | Sam Okafor | West  | 12

Same data, same command, one tick different, and one extra row is destroyed. The row that disappeared is order 1003 with 5 units, which was not a copy of anything. It shares an order number with another row and differs in the only column the comparison was told to ignore.

So the tick boxes are not a convenience setting. They are you answering the question _what does it mean for two rows to be the same thing_ , and Excel has no opinion on that. All four ticked means "an exact copy of an entire row". One column ticked means "this column is the identity of the row, and anything else about it can be discarded". Those are wildly different claims about your data and the dialog presents them as the same gesture.

Say out loud, before you tick anything, which of those two you actually mean. If your answer is "I want to remove accidental copies", you want all columns. If it is "each order should appear once", you want the key, and you should look at the disagreements first, because they are the interesting rows in the file.

## 3. The 21 units that left the table

The row counts understate it. Units are what the business cares about, so here is the same operation measured in units.
    
    
    Total units, all eight rows                          56
    Total units, keeping the first row of each OrderID   35

21 units gone. Break it down and the shape of the problem appears: 10 units from the exact duplicate of order 1002, which is correct to remove; 6 units from the capital-letter variant of 1004, which is probably correct; and 5 units from order 1003, which was a real, different row and is now not in the file.

Nothing in the workbook records that. The units column now totals 35, it adds up correctly, and it is 5 short in a way no reconciliation inside this file can detect, because the evidence was deleted along with the row.

## 4. Mark before you delete: two flag formulas

The fix is not to avoid Remove Duplicates. It is to look first, with two formulas that answer two different questions.

**Is this key a repeat?** A running count, using a reference that is locked at the top and open at the bottom, so it grows as it fills down.
    
    
    =COUNTIF($A$2:$A2, $A2)

**Is this whole row a repeat?** The same idea across every column at once.
    
    
    =COUNTIFS($A$2:$A2,$A2, $B$2:$B2,$B2, $C$2:$C2,$C2, $D$2:$D2,$D2)

Fill both down and the table tells you everything the dialog will not.
    
    
    Row  OrderID  Region  Units   Key repeat  Row repeat
     2   1001     North     4          1           1
     3   1002     South    10          1           1
     4   1002     South    10          2           2
     5   1003     East      3          1           1
     6   1003     East      5          2           1
     7   1004     North     6          1           1
     8   1004     north     6          2           2
     9   1005     West     12          1           1
    
    Rows where the key is a repeat:       3
    Rows where the whole row is a repeat: 2

Row 6 is the whole point of doing this. Its key count is 2 and its row count is 1, which means: this order number has been seen before, and this row has not. That single disagreement is a fact about your data worth chasing, and it is exactly the row that a one-column de-duplication silently destroys.

Three and two also give you your expectation before you press anything. If the dialog then reports removing three rows and you were expecting two, you know instantly that a row you cared about went with them.

## 5. Which row survives, and how to choose it

Excel keeps the **first** occurrence of each group, in the sheet's current row order, and deletes everything below it. That is the whole rule, and it is why the surviving 1003 row is the one with 3 units rather than the one with 5: it was higher up.

Which means you choose the survivor by sorting first. Sort by date descending and the newest version of each record is the one that lives. Sort by an amount descending and the largest wins. Sort by a completeness helper column, something like `=COUNTA(B2:F2)`, descending, and the row with the fewest blanks wins, which is usually the one you want when the same customer arrives twice with different amounts of detail filled in.

Do the sort deliberately and write down why. A de-duplication done on whatever order the file happened to arrive in is a coin flip performed on your data.

## 6. Case and spaces: what counts as the same

Before the explanation: rows 7 and 8 are identical except that one region is "North" and the other is "north". Predict whether Remove Duplicates treats them as duplicates.

It does. With all four columns ticked, one of them was deleted, and the survivor is the row that was higher up. Excel's comparison here ignores capitals, and so do the related tools:
    
    
    =COUNTIF(Region, "North")           3    counts "north" as well
    =SUMPRODUCT(--EXACT(Region,"North")) 2    the literal spelling only
    =COUNTA(UNIQUE(Region))              4    "north" folds into "North"

This is usually helpful and occasionally not, and either way it is worth knowing rather than assuming. If capitals genuinely distinguish two values in your data, product codes are the common case, `EXACT` is the function that respects them and none of the ordinary tools do.

Spaces are the opposite story and much more dangerous. A trailing space makes two values different, so "North " and "North" are two separate groups and neither is removed. The rows stay, the report grows a region, and Remove Duplicates reports finding nothing. Clean the key column before de-duplicating, never after: the whole [TRIM and CODE routine](https://michaelnocito.github.io/analyst-prep-kit/guides/excel-clean-messy-data/) is a prerequisite for this page, not an alternative to it.

And when the values differ in ways no function reconciles, "Acme Ltd" against "ACME Limited", you are no longer de-duplicating. That is [entity resolution](https://michaelnocito.github.io/analyst-prep-kit/guides/entity-resolution/), and pressing this button will not do it.

## 7. Filtered rows are not safe

Before the explanation: you filter the table so two rows are hidden, then run Remove Duplicates. Predict whether the hidden rows can be deleted.

They can, and they were. The same table was filtered so that the two 1003 rows were out of view, then Remove Duplicates was run on OrderID alone. The result was identical to running it unfiltered: five rows, and the 1003 row with 5 units gone.
    
    
    unfiltered, OrderID only          5 rows remain
    rows 5 and 6 hidden, OrderID only 5 rows remain, same rows

A filter changes what you can see, not what the command operates on. This matters because filtering is exactly what people do while investigating duplicates: narrow to the suspicious ones, look at them, then run the tool while the filter is still on, assuming it will act on the visible subset. It does not.

If you want to work on a subset, copy it to another sheet and work there. That is slower and it is the only version where what you are looking at and what you are changing are the same rows.

## 8. The versions that do not delete anything

Three alternatives, in increasing order of how much they buy you.

**UNIQUE.** One formula, a live de-duplicated list somewhere else on the sheet, and the original untouched.
    
    
    =UNIQUE(A2:D9)             the distinct whole rows, spilled out
    =ROWS(UNIQUE(A2:D9))       6
    =COUNTA(UNIQUE(A2:A9))     5     distinct OrderIDs

Those two numbers, 6 and 5, are the answers the dialog would have given, obtained without deleting anything, in about ten seconds. That comparison is itself the diagnosis: distinct rows and distinct keys disagreeing by one means exactly one row shares a key with another and is not a copy of it.

**Advanced Filter.** Data, Advanced, choose _Copy to another location_ , tick _Unique records only_. This is the pre-dynamic-array answer and it still works everywhere, including in a workbook that has to open in an older Excel. It produces values rather than a live formula, so it does not update when the source changes.

**Power Query.** Load the table into the query editor, right-click the key column, Remove Duplicates, and load the result to a new sheet. This is the one to use for anything that happens more than once, because the steps are recorded and re-run on next month's file, and the source data is never modified. It also makes the definition of duplicate visible and editable, as a named step in a list, rather than a tick box somebody chose in a dialog that closed.

## The full before and after

Same eight rows, same goal: one row per order.

### Before
    
    
    Data, Remove Duplicates, tick OrderID, OK.
    "3 duplicate values found and removed; 5 unique values remain."
    
    Rows   8 -> 5
    Units 56 -> 35

Twenty-one units left the file, one of the removed rows was a real order, and the only record of any of it is a dialog message that has already closed.

### After
    
    
    # 1. clean the key column first, in a new column
    Region_clean = TRIM(SUBSTITUTE(C2, CHAR(160), " "))
    
    # 2. mark, do not delete
    Key repeat  = COUNTIF($A$2:$A2, $A2)
    Row repeat  = COUNTIFS($A$2:$A2,$A2, $B$2:$B2,$B2, $C$2:$C2,$C2, $D$2:$D2,$D2)
    
    # 3. read the two counts, and the disagreement between them
    keys repeated        3
    whole rows repeated  2
    rows to look at      1     <- key repeat 2, row repeat 1
    
    # 4. decide the survivor by sorting on purpose, then de-duplicate
    Sort by OrderID, then by Units descending. Now the 5 survives, not the 3.

The claim, and it is the reason for the marking column: **ticking one box removed 21 of 56 units, and 5 of them belonged to a row that was not a duplicate of anything, with no trace left in the workbook.**

## Edge cases that survive a de-duplication

Six that get through.

**Numbers stored as text.** `1002` the number and `"1002"` the text are different values, so both survive and the pair looks identical on screen. Fix the types before de-duplicating.

**Dates with a hidden time.** Two rows on the same day are two different values if one carries 09:14 and the other 14:02. Strip the time with `INT` first if the day is your key.

**Rounding differences.** 10.00 and 10.004 are not the same number, and a currency format shows both as 10.00. If a numeric column is part of the key, round it explicitly rather than formatting it.

**Blank cells in the key.** Every blank matches every other blank, so all rows with an empty key collapse into one. On a partly-populated key column that can be most of the file.

**Formulas that de-duplicated themselves.** Removing rows shifts everything below, so anything referring to those cells by address moves or breaks. Do the de-duplication on the source data before formulas are built on top of it.

**The undo you cannot use.** Ctrl+Z restores the rows only in the current session. Once the file is saved and closed, there is no version of the data that includes them unless you kept one, which is the argument for the non-destructive options above rather than for being more careful.

## Why this works

The uncomfortable part of this page is that Excel is not doing anything wrong. It cannot tell whether two rows are the same thing, because sameness is not a property of the data; it is a property of what the data is supposed to represent. In relational terms this is what a key does: some subset of the columns is declared to identify a row uniquely, and everything else follows from that declaration (Codd, 1970, _Communications of the ACM_ , 13(6), 377–387). The tick boxes in the dialog are you declaring the key, in a hurry, without being asked to think about it. Two rows sharing a key and disagreeing on the rest is not a duplicate; it is a violation, and violations are findings.

The harder version of the problem, where the same real thing appears under values that do not match exactly, is a substantial research area in its own right rather than a tick box. Surveys of duplicate record detection describe it as a matching problem with no exact solution, requiring similarity measures, thresholds and human judgement about how much difference still counts as the same entity (Elmagarmid, Ipeirotis, & Verykios, 2007, _IEEE Transactions on Knowledge and Data Engineering_ , 19(1), 1–16). That is the honest reason this page keeps steering you toward marking rather than deleting: exact-match de-duplication is the easy fraction of the job, and treating it as the whole job is what removes rows nobody meant to remove.

One note on the questions this page asked before each answer. Committing to a prediction improves what you take away even when the prediction turns out to be wrong, and a failed attempt at an answer leaves you better prepared to learn the right one than reading it cold (Kornell, Hays, & Bjork, 2009, _Journal of Experimental Psychology: Learning, Memory, and Cognition_ , 35(4), 989–998). If you guessed six for the one-column case, that guess is why five will stay with you.

## Using this on your own project

De-duplicating a whole inherited workbook is miserable and you will stop at the second table. Do this instead, in order.

  1. **Clean the key column first.** TRIM, fix the types, strip times off dates. Duplicates hiding behind a trailing space cannot be found by any of this.
  2. **Add the two flag columns** and read the two totals. Key repeats and whole-row repeats, and the gap between them.
  3. **Look at the disagreement rows individually.** There are usually few of them and they are the only interesting ones in the exercise.
  4. **Write down the number you expect to be removed** before you open the dialog. It is the only check the dialog offers.
  5. **Sort deliberately** so the row that survives is the one you chose, not the one that happened to be higher.
  6. **Prefer UNIQUE or Power Query for anything repeatable** , and keep a copy of the original in every case where the answer matters.

If you have paper nearby, one optional sketch is worth five minutes. Write out your table's column headings in a row, then draw a box around the ones that together identify one real thing. Two customers can share a name; a name and a date of birth might do it; a customer number certainly does. The box you drew is the tick list, and drawing it once is faster than discovering it after the rows are gone.

**More detail on this, and more like it.** Every how-to sits in one place on the [guides index](https://michaelnocito.github.io/analyst-prep-kit/guides/): Excel, SQL, Python, and the working habits around them.

## The whole thing on one screen

This is the retrieval sheet. Cover the right column, work down the left, and say each answer out loud before you check it.

| Thing                  | What it does                                                       |
|------------------------|--------------------------------------------------------------------|
| Where it lives         | Data, Remove Duplicates. Edits in place, permanently.              |
| The tick boxes         | Your definition of duplicate. Excel has no other one.              |
| All columns ticked     | Removes exact copies of whole rows only.                           |
| One key ticked         | Removes anything sharing that key, including real, different rows. |
| Which row survives     | The first one, in current sheet order. Sort first to choose.       |
| What it reports        | A count. Never a list of what went.                                |
| Key repeat flag        | `=COUNTIF($A$2:$A2, $A2)`, filled down. 1 is new.                  |
| Row repeat flag        | The same with COUNTIFS across every column.                        |
| The row that matters   | Key repeat 2, row repeat 1. Same key, different data.              |
| Capitals               | Ignored. "north" is a duplicate of "North".                        |
| Case-sensitive compare | `EXACT`. Nothing else respects capitals.                           |
| Trailing spaces        | Not ignored. Duplicates hide behind them. Clean first.             |
| Filtered rows          | Deleted anyway. A filter hides, it does not protect.               |
| Blank keys             | All blanks match each other and collapse into one row.             |
| Non-destructive        | `=UNIQUE(range)`, Advanced Filter, or Power Query.                 |
| The two counts         | `ROWS(UNIQUE(all))` against `COUNTA(UNIQUE(key))`.                 |

**The one habit to keep.** Mark duplicates with a formula and read the count before you delete anything. The dialog gives you a number after the fact; the flag column gives you the same number beforehand, plus the rows themselves, and it costs one column. If a de-duplication goes wrong in a way this page does not cover, there is a general [diagnosis loop for being stuck](https://michaelnocito.github.io/analyst-prep-kit/guides/technical-tenacity/).

One last thought, and I would genuinely like other people's answers. The one I remember was a contact list de-duplicated on email address, which quietly merged two people who shared a family address and had different order histories. What did a Remove Duplicates take from you, and how long before anyone noticed?

## References

  * Codd, E. F. (1970). A relational model of data for large shared data banks. _Communications of the ACM_ , 13(6), 377–387.
  * Elmagarmid, A. K., Ipeirotis, P. G., & Verykios, V. S. (2007). Duplicate record detection: A survey. _IEEE Transactions on Knowledge and Data Engineering_ , 19(1), 1–16.
  * Kornell, N., Hays, M. J., & Bjork, R. A. (2009). Unsuccessful retrieval attempts enhance subsequent learning. _Journal of Experimental Psychology: Learning, Memory, and Cognition_ , 35(4), 989–998.

---

*The full version of this guide lives on my site: [Remove Duplicates in Excel Without Losing Data](https://michaelnocito.github.io/analyst-prep-kit/guides/excel-remove-duplicates/).*

*If it was useful: [Buy Me a Coffee](https://buymeacoffee.com/michaelnocito).*
