This article gives you the KPI row: a handful of big numbers across the top of a dashboard that tell the whole story before any chart is read. Four cells, four labels, and a reader who arrives cold knows in five seconds what the page found.

Here is the build's row, and read it as a sentence: **82,956** games with reviews. **765** genuinely loved. **175** stayed hidden. **21.2x** the audience for the ones that got found. That is the entire argument of the dashboard, in one line of cells.

**The short version.** A KPI row is the dashboard's claim told in numbers, left to right. A number earns a spot by being load-bearing for the claim. And every spot is a formula, never a typed value.

## What a KPI row is for

Answer this about the last dashboard you saw: what did you read first? Almost nobody says a chart. The eye goes to big numbers, then labels, then, maybe, the charts. A KPI row is that instinct designed for, instead of fought.

Its job is orientation. Charts carry the evidence, but each one takes real reading: axes, bars, a title. The row gives the reader the shape of the story first, so every chart below lands as support for something already understood, rather than a puzzle to decode from scratch. Four numbers do more than four charts because they are read before any chart, and they decide how everything after them is read.

## What earns a spot, and what does not

The test: **is this number load-bearing for the page's claim?** Take the claim from the build: loved-but-hidden games are real, numerous, and just as good, with a fraction of the audience. Now audit the four:

| KPI                                                                                                                                                      | What it carries                                                   |
|----------------------------------------------------------------------------------------------------------------------------------------------------------|-------------------------------------------------------------------|
| 82,956 games with reviews                                                                                                                                | The scale of the search. The claim means more against a big field |
| 765 genuinely loved                                                                                                                                      | The bar was high: 95%+ positive, 2,000+ reviews                   |
| 175 stayed hidden                                                                                                                                        | The subject of the whole page exists, and here is how many        |
| 21.2x audience gap                                                                                                                                       | The stakes: the cost of staying hidden, in one ratio              |
| _Rejected: average price, median playtime, count of genres. All true, all computable, none load-bearing for this claim. They live in charts or nowhere._ |

That rejected line is the discipline. Every dashboard has a dozen numbers that could sit up top, and a row of twelve is a row of none. Three to five spots, each earning its place against the claim, per the one-claim rule that [separates an analysis from a report](https://michaelnocito.github.io/analyst-prep-kit/guides/report-vs-analysis/).

## The row is a sentence: order matters

Read the build's four again, left to right: field, quality bar, subject, stakes. That is not alphabetical and not by size. It is narrative order: each number sets up the next, and the last one is the punch. The reader walks the row like a sentence and arrives at 21.2x with the full context loaded.

Say your own dashboard's claim out loud, then say which number a stranger needs first, and which lands hardest last. That ordering exercise is most of the design work, and it costs nothing.

## Formulas, never typed values

Every KPI cell is a live formula against [the named table](https://michaelnocito.github.io/analyst-prep-kit/guides/excel-name-your-data/). The build's four:
    
    
    =COUNT(Games[AppID])
    =COUNTIFS(Games[PctPositive],">=95", Games[TotalReviews],">=2000")
    =COUNTIFS(Games[PctPositive],">=95", Games[TotalReviews],">=2000", Games[IsHiddenGem],1)
    =AVERAGEIFS(Games[EstOwnersMid], ..., Games[IsHiddenGem],0) / AVERAGEIFS(..., Games[IsHiddenGem],1)

The fourth is [article 11's formula](https://michaelnocito.github.io/analyst-prep-kit/guides/excel-if-family/) in its home. Two reasons the typed-value shortcut is a trap, and the second one is the one that bites:

**Typed values freeze.** New rows arrive, every chart updates, and the big number at the top quietly keeps saying what was true in March. The most-read number on the page is now the stalest.

**Typed values cannot disagree with anything.** A formula recomputes from the data, which means it can catch a break: if the label column changes and 175 becomes 174, the row shows it, and [a check](https://michaelnocito.github.io/analyst-prep-kit/guides/excel-check-your-work/) can flag it. A typed 175 agrees with everything forever, which is not loyalty. It is deafness.

Click any KPI on the finished dashboard and the formula bar should show a formula. That is the audit, and it takes four clicks. If the bar shows a number, per [article 8's](https://michaelnocito.github.io/analyst-prep-kit/guides/excel-custom-number-formats/) same rule for units, someone typed what should have been computed.

## Making it look like a KPI row

The look is three settings, not a design project. Big number, small label, quiet background:

  1. **The number is large.** Two to three times body size. It is the thing being read.
  2. **The label sits under it, small and grey.** "Stayed hidden," not "COUNTIFS of segment where." The label says what the number means to the reader, in the reader's words, per the same rule as [chart titles](https://michaelnocito.github.io/analyst-prep-kit/guides/excel-chart-design-basics/).
  3. **Formats carry the units.** 21.2x is `0.0"x"`, big counts get thousands separators, all from [article 8](https://michaelnocito.github.io/analyst-prep-kit/guides/excel-custom-number-formats/), so every cell stays arithmetic underneath.
  4. **Turn off gridlines on the dashboard sheet.** View, untick Gridlines. One tick box, and the sheet reads as a page instead of a grid.

## The row doubles as your check row

A quiet bonus of formula-built KPIs: the row is [article 2's check cells](https://michaelnocito.github.io/analyst-prep-kit/guides/excel-check-your-work/), promoted to the top of the page. 765 in the row and 175 in the row are the same two numbers the checks predicted before the pivot was built. If a refresh ever moves one unexpectedly, the most visible cells on the dashboard are the ones that changed. The dashboard watches itself, in public.

The addition check belongs here too, off to the side or on the data sheet: groups summing to the row count. When the KPI row and the checks are the same cells, keeping the dashboard honest stops being a separate chore.

## Run it on your own dashboard

  1. **Write the page's claim as one sentence with a number in it.** No claim, no row. That problem comes first and it is article 17's whole subject.
  2. **List candidate numbers, then strike every one that is not load-bearing.** Aim for three to five survivors.
  3. **Order them as a sentence.** Context first, punch last.
  4. **Build each as a formula** against the named table. COUNTIFS and AVERAGEIFS do most of it.
  5. **Format big, label small, units in the format.**
  6. **Audit with four clicks.** Formula bar shows a formula under every number.

## A cheat sheet

| Question                 | Answer                                                   |
|--------------------------|----------------------------------------------------------|
| How many KPIs?           | Three to five. Twelve is none                            |
| What earns a spot?       | Load-bearing for the page's one claim                    |
| What order?              | Narrative: context, subject, stakes. Punch last          |
| Formula or typed?        | Formula, always. Typed values freeze and cannot disagree |
| Where do units go?       | In the number format, never typed into the cell          |
| What does the label say? | What the number means to the reader, in plain words      |
| How to audit a row?      | Click each number, read the formula bar                  |

**The one habit to keep.** Before adding any number to the top of a page, ask what part of the claim it carries. No part, no spot, however interesting the number is.

Try the audit on the last dashboard you shipped: click its biggest number. Formula, or typed? And if it is typed, what has the data done since?

---

*Originally published on Analyst Prep Kit: [Four Numbers Across the Top Do More Than Four Charts](https://michaelnocito.github.io/analyst-prep-kit/guides/excel-kpi-row/)*

*Visit the site for more beginner data analysis guides and free resources: [the full guide archive](https://michaelnocito.github.io/analyst-prep-kit/guides/) covers SQL, Excel, Power BI, Tableau, Python and statistics, and the [practice kits](https://michaelnocito.github.io/analyst-prep-kit/) run in your browser with nothing to install.*

*If it was useful: [Buy Me a Coffee](https://buymeacoffee.com/michaelnocito).*
