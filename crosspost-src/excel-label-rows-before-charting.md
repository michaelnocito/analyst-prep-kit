This article gives you one column that makes every later chart possible: a label column, built with IF, that sorts all your rows into named groups at once. You'll write the formula, check it landed, and walk away with the one distinction that beginners miss.

The distinction is this. A filter hides rows. A label keeps them. If your question compares two groups, and almost every question worth a chart does, a filter destroys the comparison at the moment you apply it. You end up with one group on screen, no way to chart "the rest", and no idea that anything is missing.

**The short version.** Filtering answers "show me these rows." Labelling answers "which group is each row in?" Charts are built on the second one.

Everything here comes from one build: an Excel dashboard over 82,956 Steam games, the same build behind [the eight-step build order](https://michaelnocito.github.io/analyst-prep-kit/guides/excel-label-rows-before-charting/../excel-dashboard-build-order/). This is step 2 of those eight. The counts in this article were run against the real file before publishing, and you can [download the same data](https://github.com/michaelnocito/steam-hidden-gems/tree/main/excel) and follow along.

## The trap: a filter feels like an answer

Predict something first: if you filter 82,956 rows down to the 175 you care about, what happens to the other 82,781 when you build a chart? Hold your answer.

The question in the Steam build was a comparison. Some genuinely loved games found an audience and some equally loved games stayed hidden. How do the two groups differ?

The beginner move is a filter. Filter to the hidden ones, look at them, maybe chart them. It feels like progress because the screen now shows exactly the rows you asked about.

Here's what the filter cost you. The comparison group is gone. The 590 loved games that got found are hidden from view, so "hidden games have lower prices" has nothing to stand next to. Lower than what? The moment you want both groups on one chart, and every comparison chart wants exactly that, the filter has nothing to give you. The rows you need are the ones you removed.

## What a label column is

A label column is one new column that writes a group name into every row. No row is removed. Every row gets an answer to the same question: which group are you in?

In the Steam build the column is called `Segment`, and it puts each of the 82,956 games into one of four groups:

| Label             | Meaning                                                  | Rows   |
|-------------------|----------------------------------------------------------|--------|
| Unproven          | Under 2,000 reviews. Too few for the rating to mean much | 78,064 |
| Proven, not loved | Enough reviews, under 95% positive                       | 4,127  |
| Loved, hidden     | Enough reviews, 95%+ positive, still a small audience    | 175    |
| Loved, found      | Enough reviews, 95%+ positive, broke out                 | 590    |

Those four numbers add up to 82,956, which is the row count of the file. That addition check matters later.

Once this column exists, the chart is nearly free. A pivot table grouped by `Segment` counts all four groups in one move. The comparison you wanted, hidden against found, is two rows of that pivot. Nothing was ever removed, so nothing is missing.

## The formula, one test at a time

IF asks one yes-or-no question about one row and gives one of two answers. That's the whole tool:
    
    
    =IF(test, value_if_yes, value_if_no)

One test gives you two groups. You need four, so the formula asks its questions in a row: each "no" hands the row to the next question. That's all a nested IF is. The next IF sits in the "no" seat of the one before it.

Here's the Segment formula from the build. The data is an Excel Table named `Games`, so a reference like `[@TotalReviews]` means "this row's TotalReviews value." Naming the table is step 1 of the build order and it gets its own article. For now, type the formula in the first cell of a new column called `Segment`:
    
    
    =IF([@TotalReviews]<2000, "Unproven",
      IF([@PctPositive]<95, "Proven, not loved",
        IF([@IsHiddenGem]=1, "Loved, hidden",
          "Loved, found")))

Press Enter. Because the data is a table, Excel fills the whole column down on its own. 82,956 rows, labelled in one keystroke.

Read it as a corridor of doors. Every row walks in at the top.

| Question                  | Yes                                | No                      |
|---------------------------|------------------------------------|-------------------------|
| Fewer than 2,000 reviews? | Labelled `Unproven`, done          | Next question           |
| Under 95% positive?       | Labelled `Proven, not loved`, done | Next question           |
| Flagged as a hidden gem?  | Labelled `Loved, hidden`, done     | Labelled `Loved, found` |

Say out loud why the last group needs no test of its own. A row standing at the third door has already answered two questions with no. If it answers the third with no as well, there's only one label left it could carry. The final value is the everything-else bucket, and every nested IF ends with one.

The order of the questions matters. Each test only sees the rows the earlier tests let through, so put the cheapest disqualifying test first. Here, "under 2,000 reviews" clears out 78,064 rows at door one, and the later tests never have to think about them. If you know SQL, this is the same move as [a CASE expression](https://michaelnocito.github.io/analyst-prep-kit/guides/excel-label-rows-before-charting/../sql-case-expression/), where first match wins and order is logic. Same idea, different spelling.

## Check that the labels landed

This is step 4 of the build order applied to one column: work out what the counts should be, then look. Two COUNTIF cells next to the data settle it:
    
    
    =COUNTIF(Games[Segment], "Loved, hidden")    → 175
    =COUNTIF(Games[Segment], "Loved, found")     → 590

COUNTIF looks down a column and counts the cells matching one value. The two expected numbers came from the source analysis: 765 loved games, of which 175 stayed hidden. If the first cell says 174, the formula is wrong, and it's wrong quietly. Nothing on screen turns red when a label lands on the wrong rows.

Then the addition check. The four group counts have to sum to the row count of the file. 78,064 plus 4,127 plus 175 plus 590 is 82,956. If it isn't, some rows got no label or two labels, and the usual cause is a typo in one of the label strings.

Keep both checks in the file, visibly, labelled `CHECK`. They cost two cells and tell the next person a human looked.

## Before and after, same question

Same file, same question: do the hidden games price differently from the found ones?

|                      | Filter approach                                       | Label approach                                  |
|----------------------|-------------------------------------------------------|-------------------------------------------------|
| What you do          | Filter to hidden gems, read the price column          | Add `Segment`, pivot by it, put price in Values |
| What you see         | 175 rows and their prices. Nothing to compare them to | Both groups side by side, one pivot, one chart  |
| The chart            | Can't be built. The comparison group is filtered out  | Two bars. The whole finding in one look         |
| Adding a group later | Start over with a new filter                          | Add one label to the formula, refresh the pivot |

The filter approach isn't slower. It's incapable. There is no number of extra clicks that gets a filtered sheet to show the group it removed. You have to undo the filter, at which point you're back where you started, minus the time.

Picture your own most-used spreadsheet for a moment. Name the two groups you most often want side by side. The label column for it is one formula shaped exactly like the one you just read.

## When a filter is the right tool

Filters keep a real job. The boundary is one question: are you looking, or are you building?

Looking, filter. You want to eyeball the 175 hidden games, spot-check a row, or answer "is this one game in the group?" A filter is instant and disposable, and that's its whole virtue.

Building, label. Anything that will feed a pivot, a chart, a COUNTIF or another person gets a label column, because all of those need every row present with its group written on it.

The habit that goes wrong is using the looking tool for the building job. If the thing you're making will outlive the next ten minutes, label.

## Why this works

Two reasons, one about charts and one about arithmetic.

The chart reason: a comparison only lands when both values sit in the same picture on the same scale. Cleveland and McGill's experiments on graphical perception found that judging positions against a common scale is the thing people do most accurately, and judging values held apart, from memory or across views, is where accuracy falls off (Cleveland & McGill, 1984, _Journal of the American Statistical Association_ , 79(387), 531-554). A filtered sheet forces exactly that weaker judgment: one group on screen, the other in your memory of a different filter.

The arithmetic reason: spreadsheet errors are normal, not rare. Panko's review of audit studies found errors in a few percent of cells across nearly every spreadsheet examined (Panko, 1998, _Journal of Organizational and End User Computing_ , 10(2), 15-21). A label column is checkable in a way scattered filters never are, because its groups have to sum to the row count. That one addition catches misspelled labels, dropped rows and overlapping tests in a single cell.

## Run it on your own file

  1. **Write the question as a comparison.** "How do X rows differ from Y rows?" If you can't name both X and Y, you're not ready to chart anything yet.
  2. **Name the groups before writing any formula.** Two to five labels, in words a stranger would understand. The labels will end up on a chart axis, so write them for the reader.
  3. **Order the tests, cheapest disqualifier first.** The test that clears out the most rows goes at the top of the corridor.
  4. **Write the nested IF and let the table fill it down.** If your data isn't a named table yet, that's worth fixing first and takes one keystroke: Ctrl+T.
  5. **Predict two counts, then check with COUNTIF.** Write your expected numbers down before you look. A check you read after the fact confirms whatever's on screen.
  6. **Add the sum check.** Group counts must equal the row count. Leave it in the file, labelled.

Retrofitting labels onto a workbook full of old filters is miserable, so don't. Use it on the next question, and let the old workbook retire.

## A cheat sheet

| You want to                    | Do                                                                                                                                  | Watch for                                                                 |
|--------------------------------|-------------------------------------------------------------------------------------------------------------------------------------|---------------------------------------------------------------------------|
| Put every row in a named group | New column, nested IF, labels as text                                                                                               | The last value is the everything-else bucket. Every nested IF needs one   |
| Compare two groups on a chart  | Pivot on the label column                                                                                                           | If a group is missing, a filter is still on somewhere                     |
| Check the labels landed        | COUNTIF per group, predicted first                                                                                                  | Label strings must match the formula exactly, including commas and spaces |
| Prove no row was missed        | Group counts must sum to the row count                                                                                              | A miss means a typo in a label or an overlapping test                     |
| Eyeball a group for a minute   | Filter, freely                                                                                                                      | Undo it before you build anything                                         |
| Same move in SQL               | [CASE expression](https://michaelnocito.github.io/analyst-prep-kit/guides/excel-label-rows-before-charting/../sql-case-expression/) | Same rule: first match wins, order is logic                               |

**The one habit to keep.** When a question compares groups, your first formula is a label column, not a filter. The chart you want at the end needs every row present, with its group written on it.

## References

  * Cleveland, W. S., & McGill, R. (1984). Graphical perception: Theory, experimentation, and application to the development of graphical methods. _Journal of the American Statistical Association_ , 79(387), 531-554.
  * Panko, R. R. (1998). What we know about spreadsheet errors. _Journal of Organizational and End User Computing_ , 10(2), 15-21.

What was your answer at the top, about the 82,781 rows the filter removed? Did you catch that the chart loses them before the chart was ever mentioned?

---

*The full version of this guide lives on my site: [Label Your Rows Before You Chart Them](https://michaelnocito.github.io/analyst-prep-kit/guides/excel-label-rows-before-charting/).*

*If it was useful: [Buy Me a Coffee](https://buymeacoffee.com/michaelnocito).*
