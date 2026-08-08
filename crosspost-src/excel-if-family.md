This article gives you the one distinction that sorts out Excel's whole IF family, and ends the specific confusion where you try to make IF produce a total and cannot work out why it will not.

**IF works on one row and writes an answer into that row.** Give it 82,956 rows and you get 82,956 answers, one each. It is a labelling tool: it builds a column. **COUNTIF, SUMIF and AVERAGEIF look across every row and hand back one number.** They build nothing. They answer a question. They are measuring tools.

**The short version.** Ask one question before typing: am I writing something into every row, or producing one number? Labelling, use IF. Measuring, use the IF family. The names are cousins. The jobs are opposites.

Both examples are the real ones from [the build behind this series](https://michaelnocito.github.io/analyst-prep-kit/guides/excel-if-family/../excel-dashboard-build-order/): the Segment column that labelled 82,956 games, and the KPI row that measured them. Every number was re-run against the file before publishing.

## The confusion, named

Try the broken version yourself, in your head. You want to count how many games have 2,000 or more reviews, so you write `=IF([@TotalReviews]>=2000, 1, 0)` and press Enter. Predict what you get.

You get a column of 82,956 ones and zeros, and no count anywhere. The formula is not wrong. It is answering a different kind of question than the one you asked. IF was built to answer per row, and per row is what it did. The count you wanted is a question about all rows at once, and that job belongs to a different tool.

The names cause the confusion. COUNTIF sounds like "COUNT plus my friend IF," so it feels like the same tool with a hat on. It is not. The IF in COUNTIF is a filter on which rows get counted, not a per-row decision. Once you stop expecting family resemblance, both tools become obvious.

## Labelling: IF, one row at a time

IF asks one yes-or-no question of the row it sits in and writes one of two answers into that cell:
    
    
    =IF([@TotalReviews]>=2000, "Proven", "Unproven")

In [a named Table](https://michaelnocito.github.io/analyst-prep-kit/guides/excel-if-family/../excel-name-your-data/) this fills the whole column in one keystroke: 82,956 rows, each labelled by its own values. Chain IFs into the else seat and you get several groups instead of two, which is exactly the Segment ladder [article 1](https://michaelnocito.github.io/analyst-prep-kit/guides/excel-if-family/../excel-label-rows-before-charting/) built.

Notice what IF cannot see: any row except its own. There is no total, no comparison to neighbors, no aggregate anywhere in its world. That blindness is not a limitation. It is the job description. A labeller that peeked at other rows would not be labelling.

## Measuring: the IF family, one number back

The measuring tools take a range, a condition, and hand back a single number about the rows that pass:

| Formula                                  | Answers                        | From the build                                   |
|------------------------------------------|--------------------------------|--------------------------------------------------|
| `COUNTIF(range, condition)`              | How many rows pass?            | `=COUNTIF(Games[Segment],"Loved, hidden")` → 175 |
| `SUMIF(range, condition, sum_range)`     | What do the passers add up to? | Total reviews across hidden gems                 |
| `AVERAGEIF(range, condition, avg_range)` | What is the passers' average?  | Average owners of a group                        |

One formula, one cell, one number. Nothing filled down, because there is nothing to fill: the answer is a fact about the table, not about a row.

Say the distinction back in your own words before going on. One version: IF writes into the row it lives in; the family reads every row and lives outside the table. If your version has the words "into" and "across" in it somewhere, you have it.

## The S on the end: more conditions

COUNTIFS, SUMIFS and AVERAGEIFS are the same tools accepting several conditions, paired as range-then-condition, all of which must pass. The S is "more conditions," nothing else:
    
    
    =COUNTIFS(Games[PctPositive],">=95", Games[TotalReviews],">=2000")   → 765

That is the build's loved-games check cell from [article 2](https://michaelnocito.github.io/analyst-prep-kit/guides/excel-if-family/../excel-check-your-work/): two conditions, one count. One habit worth stealing: reach for the S versions by default, since a second condition always arrives eventually, and COUNTIFS with one condition works fine.

## The most useful formula in this series, walked through

The build's headline finding, found games reach 21.2x the audience of hidden ones, is one formula: an average divided by an average, each over three conditions. Here it is, then each piece in reading order:
    
    
    =AVERAGEIFS(Games[EstOwnersMid],
         Games[PctPositive],">=95",
         Games[TotalReviews],">=2000",
         Games[IsHiddenGem],0)
     /
     AVERAGEIFS(Games[EstOwnersMid],
         Games[PctPositive],">=95",
         Games[TotalReviews],">=2000",
         Games[IsHiddenGem],1)

| Piece                            | What it says                                                                                                                                                        |
|----------------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `Games[EstOwnersMid]`            | The number being averaged: each game's estimated owners                                                                                                             |
| `Games[PctPositive],">=95"`      | Only loved games count                                                                                                                                              |
| `Games[TotalReviews],">=2000"`   | Only proven games count, the small-base floor from [article 7](https://michaelnocito.github.io/analyst-prep-kit/guides/excel-if-family/../excel-pivot-percentages/) |
| `Games[IsHiddenGem],0` then `,1` | Top average: the found games. Bottom average: the hidden ones                                                                                                       |
| The division                     | 2,458,263 over 116,000, which is 21.1919                                                                                                                            |

Formatted with `0.0"x"` per [article 8](https://michaelnocito.github.io/analyst-prep-kit/guides/excel-if-family/../excel-custom-number-formats/), the cell reads 21.2x. One cell, no helper tables, no pivot, and it recalculates the moment data changes. That is what measuring tools are for.

## Why labelling first makes measuring easy

Here is [article 1's](https://michaelnocito.github.io/analyst-prep-kit/guides/excel-if-family/../excel-label-rows-before-charting/) payoff arriving ten articles later. Compare the condition sets:
    
    
    Without the label:  three conditions, repeated in every measuring formula
    With the label:     =COUNTIF(Games[Segment], "Loved, hidden")

The Segment column did the three-condition work once, per row, in the labelling pass. Every measuring formula after it asks one short question of one clean column. Label first and the measuring formulas get simple, short, and consistent, because they all read the same definition instead of each restating it. When a definition changes, it changes in one place, and [the checks](https://michaelnocito.github.io/analyst-prep-kit/guides/excel-if-family/../excel-check-your-work/) catch anything that disagrees.

## Run it on your own file

  1. **Say your task's shape out loud.** Into every row, or one number back?
  2. **Labelling: write the IF, let the Table fill it.** Check the labels landed, article 1's way.
  3. **Measuring: pick the family member by what you want back.** A count, a total, or an average.
  4. **Use the S versions.** Conditions as range-comma-condition pairs.
  5. **Put the measuring formulas outside the table** , in labelled cells, where they double as checks.
  6. **When conditions repeat across formulas, that is the signal** to go build the label column you skipped.

## A cheat sheet

| You want                  | Use                          | Comes back as                               |
|---------------------------|------------------------------|---------------------------------------------|
| A label on every row      | `IF`, nested for more groups | A column                                    |
| How many rows pass        | `COUNTIF` / `COUNTIFS`       | One number                                  |
| What the passers total    | `SUMIF` / `SUMIFS`           | One number                                  |
| The passers' average      | `AVERAGEIF` / `AVERAGEIFS`   | One number                                  |
| A ratio between groups    | Two AVERAGEIFS divided       | One number, format the unit per article 8   |
| Simple measuring formulas | Build the label column first | Conditions live once, in the labelling pass |

**The one habit to keep.** Before typing any formula with IF in its name, say which shape the answer has: a column, or a number. The shape picks the tool, every time.

Your prediction at the top, the column of ones and zeros: have you written that formula before, expecting a count? Now say which tool you actually wanted, and what its one number would have been.

---

*The full version of this guide lives on my site: [One Row at a Time, or All Rows at Once](https://michaelnocito.github.io/analyst-prep-kit/guides/excel-if-family/).*

*If it was useful: [Buy Me a Coffee](https://buymeacoffee.com/michaelnocito).*
