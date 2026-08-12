By the end of this page you can write a multi-way label without a wall of brackets, put the conditions in an order that cannot mislabel anything, cover the case where nothing matches, get the boundaries right on purpose, and know when to stop writing conditions and use a small table instead. It is about twenty-five minutes, and every result below was run in Excel.

Here is what to do today, on the banding formula you already have. Check the order of its conditions. If it tests the smallest threshold first, every value above the largest threshold is currently getting the smallest label, and nothing anywhere will tell you.

The short version: `IFS` reads its conditions from left to right and stops at the first one that is true. It does not look for the best match, and it does not look at the rest.

That stopping rule is the whole page, so it gets the picture.

> _The original carries a diagram here. In words: Two vertical chains stand side by side, and the same value, 880, enters the top of each. Each chain is three condition boxes stacked one under the other, and each chain has a result chip beside it. In the left chain the boxes read, from the top, greater than or equal to 800, then greater than or equal to 500, then a final catch-all. The arrow from 880 reaches the first box, that box is drawn in full strength with a heavy border, and an arrow leaves it sideways to a result chip reading Large. The two boxes below it are drawn pale and no arrow ever reaches them. In the right chain the first two boxes are in the opposite order, so the top box reads greater than or equal to 500. The same 880 enters, is caught by that first box, which is drawn in full strength, and exits sideways to a result chip reading Medium. Below it the box reading greater than or equal to 800 is pale and unreached, even though 880 satisfies it. The picture shows one value taking two different labels purely from the order the boxes were written in._

**Every result on this page is real.** Run in Excel on the sixteen-row orders table used across this set of guides, banded by revenue into three groups.

The bands, and what is in them, checked first so there is something to be wrong about later.

| Band      | Rule         | Orders | Revenue   |
|-----------|--------------|--------|-----------|
| Small     | under 500    | 6      | 2,305     |
| Medium    | 500 to 799   | 6      | 3,875     |
| Large     | 800 and over | 4      | 3,710     |
| **Total** |              | **16** | **9,890** |

## 1. IF, and what nesting actually costs

`IF(test, value_if_true, value_if_false)`. One test, two outcomes. Three outcomes need a second IF, placed inside the false slot of the first.
    
    
    =IF(A2>=800, "Large", IF(A2>=500, "Medium", "Small"))

Run on 880 that returns `Large`, which is right. It reads badly and works well, and for three bands it is perfectly fine.

What it costs is legibility per band. Each extra outcome adds a whole IF, and the closing brackets pile up at the end where they cannot be matched to anything by eye. Five bands is a formula nobody will check. Excel allows up to 64 nested IFs, which is a limit that exists to be ignored: the practical limit is about three, and it is set by the reader rather than by the software.

There is a real distinction hiding here that people trip over separately: `IF` labels one row at a time and builds a column, while `COUNTIF` and its family sweep every row and return one number. [The IF family guide](https://michaelnocito.github.io/analyst-prep-kit/guides/excel-if-family/) is the page for that difference; this one is about what to do when one row needs more than two possible labels.

## 2. IFS: the same logic, flat

`IFS` takes pairs: a condition, then the value to use if it is true, repeated as many times as you like.
    
    
    =IFS(A2>=800, "Large",
         A2>=500, "Medium",
         TRUE,     "Small")

Run on 880 that returns `Large`, the same answer as the nested version. Every pair sits at the same level, so a fourth band is one more pair rather than one more layer, and the brackets do not accumulate.

Read it top to bottom as a set of rules and it says what it does: if it is at least 800 it is Large, otherwise if it is at least 500 it is Medium, otherwise it is Small. That readability is the entire reason to prefer it. The logic is identical.

## 3. The order trap, with the number it moves

Before the explanation: here are the same two conditions with the pairs swapped. The value is 880, which satisfies both. Say what comes out.
    
    
    =IFS(880>=500, "Medium", 880>=800, "Large")
    
    Medium

`Medium`. IFS stopped at the first condition that was true and never looked at the second. It is not choosing the closest band or the most specific rule; it is going down the list and taking the first hit.

On the sixteen-row table, that one swap does this:
    
    
                            correct order        swapped
    Small                   6 orders   2,305     6 orders   2,305
    Medium                  6 orders   3,875    10 orders   7,585
    Large                   4 orders   3,710     0 orders       0

Every large order became a medium one. Four orders and 3,710 of revenue changed category, the total still comes to 9,890, no cell shows an error, and the Large row simply does not appear in any summary because nothing is in it. An empty band is much easier to overlook than a wrong number.

The rule that prevents it is one sentence: **write the conditions in the order you would check them by hand, most restrictive first.** For numeric bands that means starting from the top threshold and working down, or starting from the bottom and using the opposite comparison, but never mixing the two.

Say out loud, before writing any chain of conditions, whether a value could satisfy two of them. If it can, the order is doing real work and it needs a comment beside it. If no value can ever satisfy two, order does not matter and you have a safer formula by construction.

## 4. IFS has no ELSE

Before the explanation: a value of 240 meets neither `>=800` nor `>=500`. Say what the cell shows.
    
    
    =IFS(240>=800, "Large", 240>=500, "Medium")
    
    #N/A

`#N/A`, because IFS ran out of conditions without finding a true one and has nothing to return. That is honest behaviour and it is not what you want in a report.

The catch-all is a final pair whose condition is literally `TRUE`:
    
    
    =IFS(240>=800, "Large", 240>=500, "Medium", TRUE, "Small")
    
    Small

`TRUE` is always true, so the last pair fires whenever nothing above it did. It is IFS's version of the final `else`, and leaving it off is the second most common mistake with this function after the ordering.

One judgement worth making deliberately: what the catch-all should say. `"Small"` claims every unmatched value belongs in the bottom band, which is right for revenue and wrong for a status code, where an unexpected value is news. `"check this"` as the catch-all turns the formula into its own alarm, and it is often the better default while you are still learning what is in the data.

## 5. Boundaries, on purpose

Every band has two edges and someone has to decide which side each edge belongs to. The formula makes that decision whether or not you thought about it, so check it with actual values.
    
    
    =IF(499>=800,"Large",IF(499>=500,"Medium","Small"))     Small
    =IF(500>=800,"Large",IF(500>=500,"Medium","Small"))     Medium
    =IF(800>=800,"Large",IF(800>=500,"Medium","Small"))     Large

499 is Small, 500 is Medium, 800 is Large. That is what `>=` means, and it matches how people describe bands out loud: "500 and over is medium". Using `>` instead would put 500 in the Small band and would look identical in the formula.

Two failures live at these edges. A **gap** , where a band ends at 499 and the next begins at 501, so exactly 500 matches nothing and falls to the catch-all. An **overlap** , where two bands both claim 500, which is invisible because the order silently resolves it, exactly as in section three.

Testing three values per boundary catches both: one below, one exactly on it, one above. That is six values for three bands, it takes two minutes, and it is the only part of this page most people skip.

Where the boundary should sit is a separate and harder question than how to write it. A threshold chosen because it is round is a decision wearing the costume of an observation, and [picking a cut-off from the data](https://michaelnocito.github.io/analyst-prep-kit/guides/data-driven-thresholds/) is the page for that.

## 6. SWITCH, for exact matches

When every branch is "does this equal that", `SWITCH` says it more directly. You give the expression once, then value and result pairs, and optionally a default at the end.
    
    
    =SWITCH("Desk", "Desk","Furniture", "Chair","Furniture", "Lamp","Lighting", "other")
    Furniture
    
    =SWITCH("Sofa", "Desk","Furniture", "Chair","Furniture", "Lamp","Lighting", "other")
    other
    
    =SWITCH("Sofa", "Desk","Furniture", "Chair","Furniture")
    #N/A

The last argument is the default, and it is recognised as a default because it stands alone with no partner. Leave it off and an unmatched value gives `#N/A`, the same as IFS with no catch-all.

SWITCH cannot do ranges, only equality, which is precisely why it is safer where it applies: nothing can match two branches, so nothing depends on the order. Use SWITCH for codes and categories, and IFS for anything involving greater-than.

## 7. The version that scales: a band table

Past about three bands, the right answer is to stop writing conditions and put the bands in cells. Two columns, sorted ascending by the lower bound:
    
    
    Floor    Label
        0    Small
      500    Medium
      800    Large

Then one lookup, using approximate match, which finds the largest floor that is not above your value.
    
    
    =XLOOKUP(A2, Floors, Labels, "none", -1)

Run against the same values it gives the same answers:
    
    
    499   Small
    500   Medium
    880   Large
    1100  Large

The older equivalent, for a workbook that has to open anywhere, is `VLOOKUP` with its last argument left as TRUE against the same sorted table, which returned `Medium` for 680. Both rely on the table being sorted ascending, which is the one thing to protect.

Three things change when the bands live in cells. The thresholds become visible, so anyone can see what "large" means without opening a formula. They become editable by somebody who is not you. And adding a fourth band is a new row rather than a formula edit, which means the change cannot introduce an ordering bug, because the lookup handles the ordering.

Picture the banding formula in your own most-used workbook. Could the person who asked for those bands change one of the numbers without asking you? If not, the thresholds are in the wrong place.

## 8. Testing every branch

A three-band formula has four ways through it: three bands and the catch-all. A five-band formula has six. Every one of those paths is a separate thing that can be wrong, and none of them is exercised until a value goes down it.

So test them on purpose, with a small block of values off to the side:
    
    
    value      expected     formula
      0        Small        =the formula on this value
    499        Small
    500        Medium
    799        Medium
    800        Large
    9999       Large
    ""         catch-all

Seven rows, thirty seconds, and it catches the ordering bug, both boundary bugs and the missing catch-all in one go. Keep the block in the workbook rather than deleting it, because the formula will be edited again and the test is what makes the next edit safe.

Then check the totals as well as the labels. Count by band and sum by band, and confirm that the counts add to your row count and the sums add to your column total:
    
    
    6 + 6 + 4 = 16 rows
    2,305 + 3,875 + 3,710 = 9,890

That reconciliation is what would have caught the swapped order in section three, because the Large band would have come back with zero rows against a total that still balanced.

## The full before and after

Same job: label every order Small, Medium or Large.

### Before
    
    
    =IF(A2>=500,"Medium",IF(A2>=800,"Large","Small"))
    
    Small    6 orders   2,305
    Medium  10 orders   7,585
    Large    0 orders       0

No error, no warning, a total that still reconciles to 9,890, and a band that is empty because the condition above it caught everything first. The thresholds live inside a formula where nobody can see them, and there is no test anywhere that would have failed.

### After
    
    
    # the bands live in cells
    Floor  Label
        0  Small
      500  Medium
      800  Large
    
    # one lookup instead of a chain
    =XLOOKUP([@Revenue], Bands[Floor], Bands[Label], "check this", -1)
    
    # the checks, kept on the sheet
    counts by band   6 + 6 + 4 = 16      equals the row count
    sums by band     2,305 + 3,875 + 3,710 = 9,890    equals the column total
    boundary tests   499 Small, 500 Medium, 800 Large

The claim, and it is why the reconciliation belongs on the sheet: **swapping two conditions moved four orders and 3,710 of revenue into the wrong band, produced no error, and left every total correct.**

## Edge cases that break a banding formula

Six that get through.

**Blank cells.** A blank is treated as 0, so it lands in the bottom band rather than being flagged. Test for it first: `IFS(A2="", "missing", ...)`.

**Text where a number should be.** A comparison between text and a number does not error, it just comes out false, so those rows quietly reach the catch-all. Check the column type before trusting the bands.

**Negative values.** A refund of −200 satisfies none of the greater-than conditions and lands in the catch-all labelled Small, which is arguably wrong. Decide what a negative means before the formula decides for you.

**An unsorted band table.** Approximate-match lookups assume ascending order and return a confident wrong answer if the rows get sorted by label instead. Protect the sort, or note it beside the table.

**Thresholds copied into three different formulas.** Somebody updates one of them. Now the report and the chart disagree and both look fine. One table, referenced everywhere, removes the possibility.

**Bands that changed last quarter.** Old rows keep their old labels if the label was pasted as a value rather than left as a formula, so the same revenue is Medium in March and Large in June. Keep labels as formulas, or record which version of the bands a snapshot used.

## Why this works

A chain of conditions is a program with branches, and branches are what makes code hard to verify. The classic measure counts the independent paths through a piece of logic and argues that this number, rather than its length, predicts how hard it is to test and to keep correct, because every branch is a route that has to be exercised separately before anyone can claim the thing works (McCabe, 1976, _IEEE Transactions on Software Engineering_ , SE-2(4), 308–320). A three-band formula has four routes; a six-band one has seven. That is the honest reason for the test block in section eight, and it is also the argument for the band table, which replaces the branches with data and leaves exactly one route through the formula.

The readability half has a separate footing. A nested IF asks you to hold each unresolved condition in mind while you read the next one, and the number of separate items a person can hold at once is famously small (Miller, 1956, _Psychological Review_ , 63(2), 81–97). Three nested IFs is at the edge of that; five is past it, which is why nobody checks a five-deep formula properly, however carefully it is written. IFS does not make the logic simpler, it makes it flat, so each rule can be read and dismissed rather than held.

One note on the cheat sheet below. It is built to be covered and recalled rather than reread, because retrieving something from memory is one of the most reliable ways to keep it, and it works even though it feels harder at the time than reading (Karpicke & Roediger, 2008, _Science_ , 319(5865), 966–968).

## Using this on your own project

Rewriting every conditional formula in an inherited workbook is miserable and you will stop at the third one. Do this instead, in order.

  1. **Find the banding formulas** and read only the order of their conditions. Most restrictive first, or it is wrong.
  2. **Count by band and compare with the row count.** A band with zero rows is the symptom of an ordering bug, and it takes one COUNTIF to see.
  3. **Add the catch-all** if there is not one, and consider making it say "check this" rather than naming a real band.
  4. **Test the boundaries with three values each** , below, on and above, and leave the test block in the workbook.
  5. **Move the thresholds into a two-column table** as soon as there are four bands, or as soon as anyone other than you needs to change them.
  6. **Use SWITCH where the branches are equality** , because nothing can match twice and the order stops mattering.

If you have paper nearby, one optional sketch is worth five minutes. Draw a number line, mark your thresholds on it, and shade each band a different way. Then put a dot exactly on each threshold and write which band the dot belongs to. Most people discover while doing this that they have never actually decided, which is the entire boundary problem in one pen stroke.

**More detail on this, and more like it.** Every how-to sits in one place on the [guides index](https://michaelnocito.github.io/analyst-prep-kit/guides/): Excel, SQL, Python, and the working habits around them.

## The whole thing on one screen

This is the retrieval sheet. Cover the right column, work down the left, and say each answer out loud before you check it.

| Thing                               | What it does                                                               |
|-------------------------------------|----------------------------------------------------------------------------|
| `IF(test, yes, no)`                 | One test, two outcomes. Nest in the third slot for more.                   |
| Nesting limit                       | 64 allowed. About three readable.                                          |
| `IFS(c1,v1, c2,v2, ...)`            | Pairs of condition and value, all at one level.                            |
| How IFS chooses                     | First condition that is true. Not the best match.                          |
| Order rule                          | Most restrictive first. Highest threshold first for numeric bands.         |
| Wrong order                         | No error. A band ends up empty and the totals still balance.               |
| No match                            | `#N/A`. IFS has no built-in else.                                          |
| The catch-all                       | A final pair whose condition is `TRUE`.                                    |
| Catch-all wording                   | "check this" beats naming a band, while you are still learning the data.   |
| Boundaries                          | `>=500` puts 500 in the upper band. Test 499, 500 and 501.                 |
| Gap                                 | A value between two bands falls to the catch-all.                          |
| Overlap                             | Two bands claim it. Order decides, silently.                               |
| `SWITCH(expr, v1,r1, ..., default)` | Equality only. Order cannot matter. The lone last argument is the default. |
| Band table                          | Floor and Label, sorted ascending, one row per band.                       |
| The lookup                          | `=XLOOKUP(value, Floors, Labels, "none", -1)`                              |
| The reconciliation                  | Counts by band add to the row count; sums add to the total.                |
| Blanks and negatives                | Treated as 0 and as very small. Decide before the formula does.            |

**The one habit to keep.** Count the rows in each band and check they add up to the rows you started with. A banding bug almost never produces an error; it produces one band with nothing in it and another with too much, and the count is the only place that shows. If a conditional formula misbehaves in a way this page does not cover, there is a general [diagnosis loop for being stuck](https://michaelnocito.github.io/analyst-prep-kit/guides/technical-tenacity/).

One last thought, and I would genuinely like other people's answers. The one I found late was a customer-tier formula that tested the loyalty threshold before the enterprise threshold, so the biggest accounts had been sitting in the middle tier for two quarters and the tier report simply had no top row. What has a first-true-wins chain quietly done in something you own?

## References

  * McCabe, T. J. (1976). A complexity measure. _IEEE Transactions on Software Engineering_ , SE-2(4), 308–320.
  * Miller, G. A. (1956). The magical number seven, plus or minus two: Some limits on our capacity for processing information. _Psychological Review_ , 63(2), 81–97.
  * Karpicke, J. D., & Roediger, H. L. (2008). The critical importance of retrieval for learning. _Science_ , 319(5865), 966–968.

---

*Originally published on Analyst Prep Kit: [Nested IF vs IFS in Excel: The Order That Silently Relabels Your Data](https://michaelnocito.github.io/analyst-prep-kit/guides/excel-ifs-vs-nested-if/)*

*Visit the site for more beginner data analysis guides and free resources: [the full guide archive](https://michaelnocito.github.io/analyst-prep-kit/guides/) covers SQL, Excel, Power BI, Tableau, Python and statistics, and the [practice kits](https://michaelnocito.github.io/analyst-prep-kit/) run in your browser with nothing to install.*

*If it was useful: [Buy Me a Coffee](https://buymeacoffee.com/michaelnocito).*
