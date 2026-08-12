By the end of this page you can replace any pile of nested IFs with one readable SWITCH, band a numeric column into segments that reconcile, and spot the ordering bug that silently sends twelve orders into a band meant for six. Our sixteen orders split 6, 6 and 4 across three revenue bands. Written in the wrong order the same three conditions give 0, 12 and 4, with no error anywhere.

Here is what to actually do today. Find any nested IF in your model that is more than two levels deep and rewrite it as `SWITCH(TRUE(), ...)`. Then read your conditions top to bottom and check that each one is more restrictive than the one below it. That second step takes ten seconds and is the whole safety check.

The short version: SWITCH tests conditions in the order you wrote them and stops at the first one that is true. Everything below a condition that already matched is unreachable.

First-match-wins is the entire behaviour, so it gets the picture.

> _The original carries a diagram here. In words: A single ball falls down a vertical path through a stack of four horizontal barriers. At the top, a faint outlined circle marks where the ball started. The first barrier is drawn as two short bars with a clear gap in the middle, so the dashed falling path passes straight through it. The second barrier is a single unbroken bar spanning the full width, and a solid filled ball rests on top of it, having been stopped there. Below the second barrier the falling path continues only as a very faint dotted line, and the third and fourth barriers are drawn in a washed-out grey, much lighter than the two above them, so they read as never reached rather than as passed. Nothing appears below the fourth barrier._

**Every number on this page is real, and every rule is documented.** Sixteen orders, the same fixture used across these guides, totalling 9,890. The DAX behaviours quoted here come from Microsoft's SWITCH reference rather than from habit. The SQL twin of this page is [segmenting with CASE](https://michaelnocito.github.io/analyst-prep-kit/guides/sql-segment-with-case/), which has the same first-match-wins rule and the same trap.

Here are the sixteen order revenues, sorted, which is all this page needs.
    
    
    240  280  425  440  440  480  510  600  660  660  680  765  850  880  880  1100

## 1. What nested IF costs you

Before the comparison: here is a three-band segmentation written with IF. Read it and say how confident you are that the thresholds are what you think they are.
    
    
    Order Size =
    IF (
        Orders[Revenue] < 500,
        "Small",
        IF (
            Orders[Revenue] < 800,
            "Medium",
            "Large"
        )
    )

It is correct, and it is already hard to read at three bands. At five bands it is five levels of indentation, the closing brackets pile up, and adding a band in the middle means re-nesting everything below it. The logic is fine; the shape is the problem.

SWITCH exists for this. Microsoft's reference describes it as evaluating "an expression against a list of values" and returning one of several results, and says plainly that it "can be used to avoid having multiple nested IF statements". Same logic, flat.

There is a real cost to the nesting beyond readability. A nested IF hides the ordering of your conditions inside its structure, so the question "which condition is tested first" requires reading inwards. A SWITCH puts them in a list, top to bottom, and the order becomes something you can check by scanning down the left edge. Section four is why that matters.

## 2. SWITCH on a value, the simple form

Before the syntax: you want to turn a month number into a month name. Predict how many arguments that takes, before reading on.

The plain form of SWITCH takes an expression and then pairs of value and result, with an optional final catch-all.
    
    
    SWITCH ( <expression>, <value>, <result> [, <value>, <result> ] … [, <else> ] )
    
    
    Product Line =
    SWITCH (
        Products[Product],
        "Desk",  "Furniture",
        "Chair", "Furniture",
        "Lamp",  "Lighting",
        "Unclassified"
    )

Read it as a lookup: take the product, find it in the list, return what is beside it. The last argument on its own, with no value before it, is the **else** : what to return when nothing matched. Leave it out and Microsoft's reference is specific about what happens: "If none of the values match and else isn't specified, BLANK is returned."

This form only does equality. It compares the expression to each value and looks for an exact match, so it cannot express "greater than 500". For that you need the form in the next section, which is the one you will use most.

A note on where this particular example belongs. Mapping products to categories is better done as a column on the Products table than as DAX at all, for the reasons in [the star schema guide](https://michaelnocito.github.io/analyst-prep-kit/guides/powerbi-star-schema/). SWITCH is for logic that genuinely belongs in the model, not for a lookup table someone has not built yet.

## 3. SWITCH TRUE, for conditions instead of values

Before the trick: you want bands based on ranges, not exact matches. The first argument is an expression to compare against. Guess what you could put there to make comparisons work, before reading on.

Put `TRUE()`. Then each "value" position holds a condition, which evaluates to true or false, and SWITCH compares that to TRUE. The first condition that is true wins. Microsoft's reference names this pattern directly: "A common use of this function is to set the first parameter to TRUE."
    
    
    Order Size =
    SWITCH (
        TRUE (),
        Orders[Revenue] < 500, "Small",
        Orders[Revenue] < 800, "Medium",
        "Large"
    )

Flat, readable top to bottom, and each line says its own condition and its own answer. Adding a fourth band is one more line in the right place rather than another level of nesting.

Here is what it produces on our sixteen orders, as a calculated column, grouped up.

| Order Size          | Orders | Revenue   | Share    |
|---------------------|--------|-----------|----------|
| Small, under 500    | 6      | 2,305     | 23.3%    |
| Medium, 500 to 799  | 6      | 3,875     | 39.2%    |
| Large, 800 and over | 4      | 3,710     | 37.5%    |
| **Total**           | **16** | **9,890** | **100%** |

Two checks worth running on any segmentation, and they take one glance. The counts add to 16, the row count you started with, so no order was dropped. And the revenue adds to 9,890, so no order was counted twice. A segmentation that fails either check has a gap or an overlap in its conditions.

Say out loud why the "Medium" band's condition is written as `< 800` rather than `>= 500 && < 800`. It is because anything under 500 was already caught by the line above and never reaches this one. That is the whole economy of the pattern, and it is also exactly what makes the next section possible.

## 4. The ordering bug, on real numbers

Before the bug: swap the first two lines of that measure, so `< 800` is tested before `< 500`. Predict what happens to the Small band, before reading on.

It gets nothing. Not an error, not a warning: zero rows, forever.
    
    
    Order Size Broken =
    SWITCH (
        TRUE (),
        Orders[Revenue] < 800, "Medium",     -- catches everything under 800
        Orders[Revenue] < 500, "Small",      -- unreachable
        "Large"
    )

| Order Size | Correct order        | Swapped order        |
|------------|----------------------|----------------------|
| Small      | 6 orders, 2,305      | 0 orders, 0          |
| Medium     | 6 orders, 3,875      | 12 orders, 6,180     |
| Large      | 4 orders, 3,710      | 4 orders, 3,710      |
| **Total**  | **16 orders, 9,890** | **16 orders, 9,890** |

Look at the bottom row of the broken column. Sixteen orders, 9,890 in revenue. **The reconciliation still passes.** Nothing is missing and nothing is double-counted; the orders are simply in the wrong buckets. Both of the checks from the last section are satisfied by a segmentation that is completely wrong, which is exactly why this bug survives review.

Microsoft's reference states the rule and gives the same warning: "The order of conditions matters. As soon as one value matches, the corresponding result is returned, and other subsequent values aren't evaluated. Make sure the most restrictive values to be evaluated are specified before less restrictive values." The documentation's own example is the same shape as ours, with a note that its second result "is never returned".

The check that catches it is not a reconciliation. It is one extra column: the smallest and largest actual value in each band.

| Order Size | Orders | Smallest | Largest |
|------------|--------|----------|---------|
| Small      | 6      | 240      | 480     |
| Medium     | 6      | 510      | 765     |
| Large      | 4      | 850      | 1,100   |

Now the bands can be read against their own definitions. Small tops out at 480, under the 500 threshold. Medium runs 510 to 765, inside its window. Large starts at 850. Run this once when you write a segmentation and the ordering bug cannot survive it.

Now picture your own longest SWITCH or nested IF. Scan its conditions from the top. Is each one narrower than the one below it, or did somebody add a band later without moving it?

## 5. Column or measure: where a segment lives

Before the decision: you want to slice a report by order size. Predict whether the SWITCH should be a calculated column or a measure, before reading on.

A calculated column, and the reason is structural rather than a preference. Only a column can go on an axis, in a slicer, or on a legend, because those places need actual values stored in the model to build a list from. A measure produces one number inside whatever filters are already applied; it cannot supply the categories that would do the filtering.

| You want to                                   | Use               | Why                                           |
|-----------------------------------------------|-------------------|-----------------------------------------------|
| Slice or group by the segment                 | Calculated column | Slicers and axes need stored values.          |
| Show a label that depends on a filtered total | Measure           | The answer changes with the visual's filters. |
| Colour a card by performance                  | Measure           | Conditional formatting takes a measure.       |
| Band a raw value that never changes           | Calculated column | Computed once at refresh, cheap to filter on. |

The distinction is the same one covered from the other side in [columns vs measures](https://michaelnocito.github.io/analyst-prep-kit/guides/powerbi-measures-vs-columns/), and it decides itself with one question: does the answer depend on what the viewer has filtered? Our order size does not. An order of 440 is small whatever the viewer clicks, so it is a column.

Here is a segment that genuinely has to be a measure, because it depends on a filtered total rather than on one row.
    
    
    Rep Tier =
    SWITCH (
        TRUE (),
        [Total Revenue] >= 3000, "Top",
        [Total Revenue] >= 2000, "Middle",
        "Building"
    )

| Rep          | Total Revenue | Rep Tier |
|--------------|---------------|----------|
| Priya Shah   | 3,040         | Top      |
| Owen Park    | 2,670         | Middle   |
| Dana Reyes   | 2,495         | Middle   |
| Sam Okafor   | 1,685         | Building |
| **All reps** | **9,890**     | **Top**  |

Read the total row, because it is the thing that catches people. With no rep filter, `[Total Revenue]` is 9,890, which is over 3,000, so the measure says "Top". That is arithmetically correct and it is meaningless as a label for the whole company. Any measure that returns a category needs its total row thought about, and often suppressed with a check like `IF ( HASONEVALUE ( Reps[Rep] ), <the switch> )`.

## 6. Banding on a measure, and the disconnected table

Before the problem: you want a bar chart with order-size bands on the axis, where the bands are based on a measure rather than a stored column. Say why the measure from the last section will not go on the axis.

Because a measure has nothing to put there. The axis needs a list of values, and a measure returns one value per cell, after the axis already exists. This is the standard wall people hit, and the standard solution has a name.

Build a small table of the bands themselves, with no relationship to anything. It is usually called a **disconnected table** , and it exists purely to supply values to an axis or a slicer.
    
    
    Bands =
    DATATABLE (
        "Band",  STRING,
        "Sort",  INTEGER,
        "Min",   INTEGER,
        "Max",   INTEGER,
        {
            { "Small",  1,   0,  499 },
            { "Medium", 2, 500,  799 },
            { "Large",  3, 800, 99999 }
        }
    )

Put `Bands[Band]` on the axis, sorted by `Bands[Sort]`, then write a measure that counts the orders falling inside whichever band's row it is currently sitting in.
    
    
    Orders in Band =
    VAR Lo = MIN ( Bands[Min] )
    VAR Hi = MAX ( Bands[Max] )
    RETURN
        CALCULATE (
            COUNTROWS ( Orders ),
            FILTER ( ALL ( Orders[Revenue] ),
                     Orders[Revenue] >= Lo && Orders[Revenue] <= Hi )
        )
    -- 6, 6, 4

Two things make that work. The band table has no relationship, so its rows do not filter Orders on their own, and `MIN` and `MAX` read the current row's thresholds out of it. And `ALL(Orders[Revenue])` clears any existing revenue filter first, so each band counts against the whole column rather than against whatever the axis already restricted. That is the CALCULATE machinery from [the filter context guide](https://michaelnocito.github.io/analyst-prep-kit/guides/powerbi-calculate/) doing exactly what it was built for.

The payoff is that the thresholds now live in a table rather than in code. Change 500 to 600 in the band table and every visual updates, with no measure edited. Put the band table's rows in a slicer and the user can even pick their own.

Do not reach for this unless you need it. If the value being banded is a stored column that never changes, a calculated column is simpler, faster and easier for the next person to read.

## 7. Data types, blanks, and the else branch

Before the rules: you write a SWITCH where one result is a string and another is a number. Predict whether it runs.

It does not. Microsoft's reference is unambiguous: "All result expressions and the else expression must be of the same data type", and the page shows exactly this error, a SWITCH returning "Large" in one branch and 0.1 in another. It is a common accident when somebody adds a numeric fallback to a text segmentation.

Three more behaviours worth knowing before they cost you an afternoon.

**No match and no else gives BLANK.** Usually not what you want on a segmentation, because blank-labelled rows are hidden by many visuals and the orders inside them disappear from the report while still counting in the grand total. Always write an else, even if it says "Unclassified", because an explicit bucket you can see beats a silent one you cannot.

**A blank input matches the wrong band.** In DAX a blank compares as zero in a numeric comparison, so an order with no revenue satisfies `< 500` and lands in Small. If blank means "unknown" rather than "zero", test for it first: put `ISBLANK(Orders[Revenue]), "Unknown"` as the very first condition, where its narrowness earns it the top spot.

**Conditions can combine.** Each condition is an ordinary boolean expression, so `&&` and `||` work: `Orders[Revenue] >= 800 && RELATED ( Products[Category] ) = "Furniture", "Large furniture"`. Just remember that a compound condition is usually more restrictive, so it belongs above the simpler ones.

## The full before and after

Same requirement both times: band orders by size and report revenue by band.

### Before
    
    
    Order Size =
    IF ( Orders[Revenue] < 800, "Medium",
         IF ( Orders[Revenue] < 500, "Small", "Large" ) )
    
    
    Small     0 orders          0
    Medium   12 orders      6,180
    Large     4 orders      3,710
    Total    16 orders      9,890

It runs, it reconciles, and it is wrong. Twelve orders are in a band meant for six, the Small band is empty and will stay empty however much data arrives, and the nesting makes the ordering hard to see. Nobody reviewing the totals would catch it.

### After
    
    
    Order Size =
    SWITCH (
        TRUE (),
        ISBLANK ( Orders[Revenue] ),  "Unknown",
        Orders[Revenue] < 500,        "Small",
        Orders[Revenue] < 800,        "Medium",
        "Large"
    )
    
    
    Band      Orders   Revenue   Smallest   Largest
    Small          6     2,305        240       480
    Medium         6     3,875        510       765
    Large          4     3,710        850     1,100
    Total         16     9,890        240     1,100

Flat, ordered narrowest first, with an explicit bucket for missing values and a catch-all at the bottom. The two extra columns are the review: every band's actual range sits inside its own definition, so the ordering is verified rather than assumed. Adding a fourth band is one line, in the right place.

## Edge cases that catch people out

Six that each cost somebody an afternoon.

**Adding a band later without moving it.** This is how the ordering bug actually happens in real models. Nobody writes the conditions backwards; somebody appends a narrower band at the bottom six months later. Re-read the whole list every time you add to it.

**Overlapping thresholds.** `<= 500` then `>= 500` puts 500 in the first band only, which is defensible and often not what was meant. Write bands as "under X" all the way down, so the boundaries cannot overlap by construction.

**Bands sorting alphabetically.** Large, Medium, Small on the axis. Add a numeric sort column and set Sort by column, exactly as with month names.

**Hard-coded thresholds in several measures.** When 500 appears in four measures, changing it means finding all four. Either put it in the band table from section six, or in a single variable, and never in more than one place.

**SWITCH over a measure with no HASONEVALUE guard.** The total row evaluates the measure with no filter, which almost always lands in the top band and labels the whole company "Top".

**Thresholds picked out of the air.** 500 and 800 are round numbers, not findings. If the bands are meant to mean something, derive them from the distribution, which is what [choosing thresholds from the data](https://michaelnocito.github.io/analyst-prep-kit/guides/data-driven-thresholds/) and [percentiles](https://michaelnocito.github.io/analyst-prep-kit/guides/percentiles-iqr-outliers/) are for.

## Why this works

First-match-wins is not a quirk of DAX. It is the standard semantics of a guarded conditional, shared by SQL's searched `CASE`, by `if/elif` chains in Python, and by pattern matching in most languages: conditions are ordered, evaluation stops at the first success, and everything below is unreachable. That shared behaviour is why [the SQL version of this page](https://michaelnocito.github.io/analyst-prep-kit/guides/sql-segment-with-case/) describes the identical bug with identical numbers, and why the habit of reading conditions narrowest-first transfers between every tool you will use.

The reason the bug survives review is worth naming separately, because it is about verification rather than syntax. The obvious checks on a segmentation are that the counts add up and the totals reconcile, and a mis-ordered SWITCH passes both. Reconciliation confirms that nothing was lost or duplicated; it says nothing about whether rows were assigned correctly. The check that does work is the one in section four: report each band's actual minimum and maximum and compare them to the band's own definition. That is a general principle worth carrying, since the same reasoning applies to any classification.

Everything specific to DAX on this page is product behaviour, so the authority is Microsoft's own reference. The order-matters rule, the blank return when no value matches and no else is given, the same-data-type requirement, and the `SWITCH(TRUE())` pattern itself are all quoted above from the SWITCH page in the DAX reference.

One note on why this page kept asking you to predict before showing you the answer. Attempting an answer before seeing the correct one reliably improves how well the correct one is retained, even when the attempt is wrong (Bisra, Liu, Nesbit, Salimi, & Winne, 2018, _Educational Psychology Review_ , 30(3), 703–725). The empty Small band sticks because you were asked to predict it before seeing that the totals still reconcile.

## Using this on your own model

Rewriting every conditional in an inherited model is miserable and you will stop at the fourth. Do this instead, in order.

  1. **Find the deepest nested IF** in your model and rewrite that one as `SWITCH(TRUE(), ...)`. It is the one most likely to be hiding a mis-ordered condition.
  2. **Read the conditions top to bottom** and check that each is narrower than the one below. This is the whole review.
  3. **Add the min and max columns** to any banded report once, and look at them. Then delete them if you like; you have already got what they were for.
  4. **Write an explicit else** , always, even if it says "Unclassified". A visible bucket beats a blank one.
  5. **Add a sort column** to any band that will appear on an axis, before somebody sees Large, Medium, Small.

If you have paper nearby, one optional drawing is worth five minutes. Draw your own bands as a number line with the thresholds marked, then write your SWITCH conditions beside it in the order you wrote them. Anywhere the line is covered twice is an unreachable band, and it is much more obvious on paper than in code.

**More detail on this, and more like it.** Every how-to sits in one place on the [guides index](https://michaelnocito.github.io/analyst-prep-kit/guides/): SQL, Python, Excel, Power BI and the working habits around them.

## The whole thing on one screen

This is the retrieval sheet. Cover the right column, work down the left, and say each answer out loud before you check it.

| Idea                          | What it means                                                                   |
|-------------------------------|---------------------------------------------------------------------------------|
| SWITCH, plain form            | Expression, then value and result pairs, then an optional else. Equality only.  |
| SWITCH(TRUE())                | Each value slot holds a condition. The documented way to replace nested IFs.    |
| First match wins              | Evaluation stops at the first true condition. Everything below is never tested. |
| Order the conditions          | Most restrictive first. Documented, and the source of the bug.                  |
| The bug, on our data          | Correct: 6 / 6 / 4. Swapped: 0 / 12 / 4. Both reconcile to 16 orders, 9,890.    |
| The check that works          | Report each band's smallest and largest value against its own definition.       |
| The check that does not       | Reconciling the totals. A mis-ordered SWITCH passes it.                         |
| Column or measure             | Slicing or grouping needs a column. A filtered total needs a measure.           |
| Measure on the total row      | Unfiltered, so it usually lands in the top band. Guard with HASONEVALUE.        |
| Disconnected table            | A band table with no relationship, to put band names on an axis.                |
| MIN and MAX in a band measure | Read the current band row's thresholds out of the disconnected table.           |
| Same data type                | All results and the else must match. Text and number together errors.           |
| No else                       | Returns BLANK. Blank rows hide in visuals. Always write an else.                |
| Blank input                   | Compares as zero, so it lands in the lowest band. Test ISBLANK first.           |
| Combining conditions          | `&&` and `                                                                      | |` work. Compound conditions are narrower, so put them higher. |
| Sort order                    | Bands sort alphabetically without a numeric sort column.                        |

**The one habit to keep.** Every time you write or edit a SWITCH, read the conditions from the top and check each is narrower than the one below, then print each band's actual minimum and maximum once. Reconciling the totals will not catch a mis-ordered band, and those two checks will. If a segmentation breaks in a way this page does not cover, there is a general [diagnosis loop for being stuck](https://michaelnocito.github.io/analyst-prep-kit/guides/technical-tenacity/).

One last thought, and I would genuinely like other people's answers. The first segmentation I shipped had an empty band for two months and nobody noticed, because the totals were right and an empty band just looks like a category nobody falls into. What is the segment in your reporting that has never had a row in it, and is that the data or the ordering?

## References

  * Bisra, K., Liu, Q., Nesbit, J. C., Salimi, F., & Winne, P. H. (2018). Inducing self-explanation: A meta-analysis. _Educational Psychology Review_ , 30(3), 703–725.
  * Codd, E. F. (1970). A relational model of data for large shared data banks. _Communications of the ACM_ , 13(6), 377–387.
  * Microsoft. _SWITCH function (DAX)_ , DAX reference. The source of every quoted rule on this page: the order-of-conditions rule, the BLANK return when no value matches, the same-data-type requirement, and the SWITCH(TRUE()) pattern. Product documentation rather than peer-reviewed research, which is the correct authority for how a product behaves.

---

*The full version of this guide lives on my site: [SWITCH TRUE in DAX: Segmentation, and the Band That Never Appears](https://michaelnocito.github.io/analyst-prep-kit/guides/powerbi-switch-true/).*

*If it was useful: [Buy Me a Coffee](https://buymeacoffee.com/michaelnocito).*
