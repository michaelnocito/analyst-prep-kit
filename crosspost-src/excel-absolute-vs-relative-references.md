By the end of this page you can copy a formula anywhere in a sheet and say in advance which parts of it will move. You will be able to pin a rate so a whole column can use it, fill a nine-cell grid from a single formula, and recognize the copied column that is wrong even though its first row is right. It takes about twenty minutes. Every number below is printed next to the arithmetic that produced it, so you can check any of them.

Here is the move. When a formula points at a cell that must not move as the formula is copied, put a dollar sign in front of both halves of that address: `=D2*$G$1`. Click the reference in the formula bar and press F4 to put the signs in. That is the whole mechanic. A dollar sign means "this part stays where it is".

The short version: Excel does not store the address you typed. It stores the distance from your formula to the cell it points at. A dollar sign replaces that distance with a fixed address.

That is the idea everything else on the page rests on, so it gets the picture.

> _The original carries a diagram here. In words: Two diagrams sit side by side. Each one shows a short column of four formula cells on the left and a matching column of four target cells on the right, with arrows running between them. The target cells are drawn identically in both diagrams: the top one is shaded because it holds a value, and the three below it have dashed empty outlines because nothing is stored in them. The only difference between the two diagrams is where the arrows go. Above the left diagram the formula reads equals D2 times G1, with no dollar signs, and its four arrows run straight across in parallel, each one reaching a different target cell, so three of the four land on empty outlines. Above the right diagram the same formula appears with dollar signs, reading equals D2 times dollar G dollar one, and its four arrows all curve upward and meet at the single shaded cell at the top, leaving the three empty ones untouched. Four separate landings on the left, one shared landing on the right._

**Every number on this page is checkable.** The worked example uses the sixteen-row orders table that runs through this set of guides, and every result is printed beside its arithmetic in the form 1,200 × 0.08 = 96.00. If a number here does not match the arithmetic next to it, I got it wrong and you caught it.

## 1. The fork: should this part move, or stay?

Before the explanation, one question worth answering from memory. Think of a formula you have dragged down a column. Say which parts of it needed to point somewhere new on each row, and which parts needed to keep pointing at the same place.

That question is the whole decision, and it gets asked once per reference in the formula. There are two possible answers.

**Answer one: it should move.** The reference points at something that belongs to this row. The amount for this order, the date of this order, the name on this line. If that is true, you want the reference to shift as the formula is copied, and you leave it alone. This is called a **relative** reference, and it is what you get by default.

**Answer two: it should stay.** The reference points at one thing that every row shares. A commission rate, a tax percentage, an exchange rate, the top-left corner of a lookup table. If that is true, you want every copy of the formula to ask the same cell, and you write it as `$G$1`. This is an **absolute** reference.

What decides between them is not the formula and not the cell. It is the sentence you would say out loud about that reference. "The amount on this row" moves. "The rate" stays.

It matters because getting it backwards does not usually produce an error message. It produces a number, and the next section is about why that number is often believable.

## 2. What a relative reference actually stores

Here is the fact that makes the rest of the page obvious rather than memorized. Type `=D2` into cell E2. Excel does not remember "D2". It remembers "one cell to my left".

Copy that formula to E5 and it still means one cell to my left, which is now D5. The formula did not know it said D2. It only ever knew the distance.

Say it out loud, because it is the sentence the whole topic hangs off: a reference is a direction and a distance, not an address.

That is exactly why filling a column works at all. You write one formula for row 2 and copy it to row 17, and each copy quietly points at its own row, because "one cell to my left" is true on every row.

A dollar sign switches off that behavior for the half of the address it sits in front of. `$G` means column G, always, no matter where this formula ends up. `$1` means row 1, always. Put both in and the reference stops being a distance and becomes a place.

## 3. The rate in one cell, and the 513.60 it cost

Here is the failure, worked end to end on real numbers.

The orders table sits in A1:D17. Column D holds the amount. Off to the side is a small block of assumptions, which is where a careful person puts rates so they are visible and editable instead of buried inside formulas.

| Cell | Label           | Value |
|------|-----------------|-------|
| G1   | Commission rate | 0.08  |
| G2   | Tax rate        | 0.20  |
| G3   | Uplift factor   | 1.05  |

Now commission per order goes in column E. In E2 you write `=D2*G1` and fill it down to E17.

The first row is right. E2 reads 96.00, and 1,200 × 0.08 = 96.00. So the formula gets a nod and the fill gets trusted.

Here is what the next three rows did.

| Cell   | What it became    | Arithmetic            | Result   |
|--------|-------------------|-----------------------|----------|
| E2     | `=D2*G1`          | 1,200 × 0.08          | 96.00    |
| E3     | `=D3*G2`          | 950 × 0.20            | 190.00   |
| E4     | `=D4*G3`          | 1,480 × 1.05          | 1,554.00 |
| E5     | `=D5*G4`          | 720 × nothing         | 0.00     |
| E6:E17 | `=D6*G5` and down | each amount × nothing | 0.00     |

The column totals **1,840.00**. It should total **1,326.40** , because the sixteen amounts add up to 16,580 and 16,580 × 0.08 = 1,326.40. The sheet is over by 513.60, and 1,840.00 minus 1,326.40 = 513.60.

Before reading on, say why row 2 came out right. Getting this in your own words is worth more than the fix itself.

Row 2 is right because row 2 is the row you wrote the formula for. The distance from E2 to G1 is up one, right two. On row 3 that same distance lands on G2, which is the tax rate. On row 4 it lands on the uplift factor. From row 5 down it lands in empty space, and an empty cell is treated as zero in arithmetic.

Two of those wrong numbers, 190.00 and 1,554.00, look like money. That is the part worth remembering. This mistake does not announce itself, and the one row a reviewer usually checks is the one row that is correct.

The fix is one keystroke. In E2, click on the `G1` and press F4, which turns it into `$G$1`, then fill down again.
    
    
    =D2*$G$1

Now every row asks G1, the column totals 1,326.40, and changing the rate in G1 updates all sixteen rows at once. That second part is the real reward. The rate is in a cell someone can type into, which is what makes the sheet a model instead of a printout.

## 4. F4, and the four states in order

You almost never type dollar signs. You put the cursor on a reference and press F4, which cycles through the four possible states. Microsoft documents the order, and it is worth knowing because it means one extra press gets you where you want rather than starting over.

| Press | Looks like | What is locked | Use it when                                                      |
|-------|------------|----------------|------------------------------------------------------------------|
| 1     | `$A$1`     | Column and row | One cell every copy must ask. Rates, thresholds, a lookup range. |
| 2     | `A$1`      | Row only       | Filling across and down, where the anchor lives in one row.      |
| 3     | `$A1`      | Column only    | Filling across and down, where the anchor lives in one column.   |
| 4     | `A1`       | Nothing        | Back to a plain relative reference.                              |

On a Mac the same toggle is Cmd+T, and F4 also works if your function keys are set up for it.

One thing that confuses people on Windows: F4 only cycles references when the cursor is on a reference inside a formula. Anywhere else it repeats your last action, which is a genuinely useful key for a different job.

## 5. Mixed: lock one half, free the other

Before the explanation, a prediction. If `$G$1` pins both halves and `G1` pins neither, say what you think `G$1` pins.

The row. `G$1` is free to move sideways and stuck on row 1. Its mirror, `$G1`, is stuck in column G and free to move up and down.

These are called mixed references, and they exist for one situation: a formula that gets copied in two directions at once. When you only ever fill down a column, relative and fully absolute cover everything you need. The moment you fill across as well, you usually want one half of the address pinned and the other half loose.

The rule of thumb is short. Pin the part that must not change in the direction you are copying.

  * Your anchors sit in a **row** across the top, and you copy down: lock the row, `G$1`.
  * Your anchors sit in a **column** down the side, and you copy across: lock the column, `$D2`.
  * Both at once is the grid in the next section, and it needs one of each.

## 6. Nine answers from one formula

Finance wants the commission bill at three possible rates, for the first three orders, so they can pick one. That is nine numbers. It is also one formula.

Put the three rates across the top, in J1, K1 and L1: 0.06, 0.08 and 0.10. The amounts are already down column D. In J2 write this, then fill it right to L2 and down to row 4.
    
    
    =$D2*J$1

Read it as two decisions rather than as punctuation. `$D2` is locked to column D and free on the row, because the amount is always in D but changes row by row. `J$1` is locked to row 1 and free on the column, because the rate is always in row 1 but changes column by column.

Here is what the nine cells hold, with the arithmetic.

| Amount | At 0.06              | At 0.08               | At 0.10               |
|--------|----------------------|-----------------------|-----------------------|
| 1,200  | 72.00 (1,200 × 0.06) | 96.00 (1,200 × 0.08)  | 120.00 (1,200 × 0.10) |
| 950    | 57.00 (950 × 0.06)   | 76.00 (950 × 0.08)    | 95.00 (950 × 0.10)    |
| 1,480  | 88.80 (1,480 × 0.06) | 118.40 (1,480 × 0.08) | 148.00 (1,480 × 0.10) |

Nine correct answers, one formula, typed once. If you get a grid like this wrong, the symptom is recognizable: the whole first row or the whole first column is right and everything else is nonsense, because the one copy you checked was the one that needed no shifting.

Now picture this on your own numbers. Take a table you actually use, put two or three scenario values across the top of a blank area, and imagine which half of each address you would pin. You do not have to build it. Just decide, for one formula, which two dollar signs you would place and where.

## 7. Four things the dollar sign does not do

Each of these catches somebody, and three of them are only visible after the damage.

**It does not change the answer where you typed it.** `=D2*G1` and `=D2*$G$1` return exactly the same number in E2. The difference appears only when the formula is copied somewhere else. That is why testing one cell proves nothing about a fill.

**It does not protect the cell from editing.** Locking a reference and locking a cell are unrelated. Stopping people from typing over G1 is sheet protection, which is a different feature in a different menu.

**It does not stop a reference changing when the target physically moves.** This one surprises people who think absolute means permanent. Insert a row above row 1, and every `$G$1` in the workbook quietly rewrites itself to `$G$2`, because Excel is following the value you pointed at. Absolute means "does not shift when the formula is copied", not "never changes".

**It does not survive a cut.** Cutting the anchor cell with Ctrl+X and pasting it elsewhere drags every reference to it along, dollar signs and all. Copying it does not. If a model breaks the day someone tidied the layout, this is usually why.

## 8. When you need no dollar sign at all

There are two ways to get the same protection without any punctuation, and both read better afterwards.

**Name the cell.** Select G1, type `CommissionRate` into the Name Box beside the formula bar, and press Enter. Now the formula is `=D2*CommissionRate`, which is already absolute, and which says what it means to anyone who opens the file next year. Defined names do not shift when a formula is copied.

**Put the data in a table.** Inside an [Excel Table created with Ctrl+T](https://michaelnocito.github.io/analyst-prep-kit/guides/excel-tables/), a column reference is written `[@Amount]` and it means "the amount on this row" by name rather than by distance. There is nothing to lock and nothing to get backwards, and the reference keeps working when columns are inserted. This is one of the better reasons to press Ctrl+T on a range you are about to write formulas against.

Neither one removes the need to understand the dollar sign, because you will read other people's workbooks for the rest of your career. But for the sheets you build, a named rate is easier to be right about than a pinned address.

## The full before and after

Same table, same rate, same fill. One character apart.

|                            | Before: `=D2*G1`                  | After: `=D2*$G$1`      |
|----------------------------|-----------------------------------|------------------------|
| Row 2                      | 96.00                             | 96.00                  |
| Row 3                      | 190.00 (used the tax rate)        | 76.00 (950 × 0.08)     |
| Row 4                      | 1,554.00 (used the uplift)        | 118.40 (1,480 × 0.08)  |
| Rows 5 to 17               | 0.00 (pointed at empty cells)     | Each amount × 0.08     |
| Column total               | 1,840.00                          | 1,326.40               |
| Change the rate in G1      | Three rows react, thirteen do not | All sixteen rows react |
| What a reviewer sees first | A correct first row               | A correct first row    |

The last line is the point of the whole page. Both versions pass the check most people run.

## Edge cases that break a copied formula quietly

These are the ones that produce a number rather than an error.

  * **A lookup range with no dollar signs.** `=VLOOKUP(A2,H2:I50,2,FALSE)` filled down becomes `H3:I51`, then `H4:I52`. The range slides off the bottom of your lookup table and the last rows return not-found for no visible reason. Lock it: `$H$2:$I$50`. There is more on this in [VLOOKUP vs XLOOKUP](https://michaelnocito.github.io/analyst-prep-kit/guides/vlookup-vs-xlookup/).
  * **Filling right when you only tested down.** A column-only test passes, then somebody drags the same formula sideways and the row reference was never pinned. Test a fill in both directions if the formula might be copied in both.
  * **A mixed reference on the wrong axis.** `$D2` where you meant `D$2` still returns numbers. They are just the wrong numbers, taken from a plausible neighbor.
  * **Rows inserted inside a locked range.** `$H$2:$I$50` expands to `$H$2:$I$51` when a row is inserted inside it, which is usually what you want. Rows added at the bottom, outside the range, are not picked up at all. A table reference avoids the whole question.
  * **Conditional formatting uses the same mechanism.** A formula rule is written once for the top-left cell of the selection and filled across the rest, which is why [one dollar sign turns a highlighted cell into a highlighted row](https://michaelnocito.github.io/analyst-prep-kit/guides/excel-conditional-formatting/).
  * **The value that never moves anyway.** If a rate appears in exactly one formula and nowhere else, a dollar sign is not the fix for anything. The fix is putting the rate in a cell in the first place, so it is visible and editable.

## Why this works

The mechanism itself is a design decision with an obvious payoff: storing an offset instead of an address is what lets one typed formula serve sixteen rows. Everything in this topic, including the failure, comes out of that single choice.

The failure is worth taking seriously, because reference mistakes are one of the plainest examples of a general finding about spreadsheets. They are common, they produce plausible output, and inspection catches fewer of them than people expect. When undergraduate students inspected a spreadsheet seeded with deliberate errors, working alone for forty-five minutes, they found 63% of them on average, and groups of three working together found 83% (Panko, 1999, _Journal of Management Information Systems_ , 16(2), 159–176). A single reviewer glancing at one row is a long way below either number. The broader review of this literature is worth reading if you build models anybody relies on (Panko, 1998, _Journal of End User Computing_ , 10(2), 15–21).

That is the argument for the habit at the end of this page rather than for being more careful. Care is not a control. A total you predicted before you looked is a control, and it is the reason this page keeps printing the arithmetic beside every number.

One note on the cheat sheet below. It is built to be covered and recalled rather than read, because testing yourself on material transfers to new situations better than restudying it, which matters here since you will be applying this to sheets that look nothing like the one above (Butler, 2010, _Journal of Experimental Psychology: Learning, Memory, and Cognition_ , 36(5), 1118–1133).

## Using this on your own workbook

Auditing every reference in an inherited file is miserable and you will give up on the second sheet. Do this instead, in order.

  1. **Find the numbers typed inside formulas.** Anything like `*0.08` or `*1.2` sitting in a formula is a rate with nowhere to live. Move it to a labeled cell first. The dollar sign question does not even arise until the value has a home.
  2. **Say the sentence out loud for each reference.** "The amount on this row" moves. "The rate" stays. If you cannot say which one it is, that reference is the one to check.
  3. **Use F4 rather than typing the signs.** Fewer keystrokes and no chance of putting one in front of the wrong half.
  4. **Check the last row, not the first.** The first row of a fill is the one that is right in both the working and the broken version. Scroll to the bottom and read one formula there.
  5. **Predict the column total before you look at it.** Sixteen orders at eight percent should land near 1,300. A total of 1,840 fails that test in one second, and there is more on where these checks belong in [checking your work before anyone else does](https://michaelnocito.github.io/analyst-prep-kit/guides/excel-check-your-work/).
  6. **Name the anchors you keep reusing.** A rate used in four formulas is worth a name. A rate used once is not.

If you have paper nearby, one optional sketch locks this in for good. Draw two columns of four boxes. On the left write one formula at the top and draw an arrow from each box to where it points when copied down. Do it once with the arrows fanning out to four different boxes, and once with all four arrows meeting at the top box. Then label which picture needed the dollar signs. You will not need to look this up again.

**More detail on this, and more like it.** Every how-to sits in one place on the [guides index](https://michaelnocito.github.io/analyst-prep-kit/guides/): Excel, SQL, Python, and the working habits around them.

## The whole thing on one screen

This is the retrieval sheet. Cover the right column, work down the left, and say each answer out loud before you check it.

| Thing                   | What it does                                            |
|-------------------------|---------------------------------------------------------|
| What a reference stores | A direction and a distance, not an address.             |
| `A1`                    | Relative. Moves with the copy, both ways.               |
| `$A$1`                  | Absolute. Every copy asks the same cell.                |
| `A$1`                   | Row locked, column free. Anchors sitting in one row.    |
| `$A1`                   | Column locked, row free. Anchors sitting in one column. |
| F4 order                | `$A$1`, `A$1`, `$A1`, `A1`. Mac: Cmd+T.                 |
| The question to ask     | "The amount on this row" moves. "The rate" stays.       |
| Grid, filled both ways  | `=$D2*J$1`. One of each, one formula, nine answers.     |
| Why it survives review  | The first row is correct in the broken version too.     |
| Row 3 reading 190.00    | The reference walked onto the next assumption down.     |
| Rows reading 0.00       | The reference walked into empty cells. Empty is zero.   |
| Inserting a row         | Rewrites `$G$1` to `$G$2`. Absolute is not permanent.   |
| Cutting the anchor      | Drags every reference with it. Copying does not.        |
| Lookup range            | Lock it, or it slides off the bottom of the table.      |
| No dollar sign needed   | A defined name, or `[@Amount]` inside a table.          |
| Which row to check      | The last one. The first one is right either way.        |

**The one habit to keep.** Predict the total before you read it. Sixteen orders at eight percent is roughly thirteen hundred, so 1,840.00 is wrong before you have looked at a single formula. A rough number you committed to in advance catches reference mistakes faster than reading the formulas will, and it costs about four seconds.

One last thought, and I would genuinely like other people's answers. The most expensive version of this I have seen was a forecast where the growth rate was pinned correctly and the base year was not, so every column quietly grew from the wrong starting point and the shape of the chart still looked right. What is the longest one of these has gone unnoticed in a file you inherited?

## References

  * Panko, R. R. (1999). Applying code inspection to spreadsheet testing. _Journal of Management Information Systems_ , 16(2), 159–176.
  * Panko, R. R. (1998). What we know about spreadsheet errors. _Journal of End User Computing_ , 10(2), 15–21.
  * Butler, A. C. (2010). Repeated testing produces superior transfer of learning relative to repeated studying. _Journal of Experimental Psychology: Learning, Memory, and Cognition_ , 36(5), 1118–1133.

---

*Originally published on Analyst Prep Kit: [Absolute vs Relative References in Excel: What the Dollar Sign Locks](https://michaelnocito.github.io/analyst-prep-kit/guides/excel-absolute-vs-relative-references/)*

*Visit the site for more beginner data analysis guides and free resources: [the full guide archive](https://michaelnocito.github.io/analyst-prep-kit/guides/) covers SQL, Excel, Power BI, Tableau, Python and statistics, and the [practice kits](https://michaelnocito.github.io/analyst-prep-kit/) run in your browser with nothing to install.*

*If it was useful: [Buy Me a Coffee](https://buymeacoffee.com/michaelnocito).*
