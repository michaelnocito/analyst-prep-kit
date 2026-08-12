When this workbook is finished, you can change one number and watch the whole thing follow. Move a cut-off from 65 to 70 and every row re-bands, every fill recolors, every count updates, and the legend still matches the map. Nobody can color a cell by hand, because no cell has a color of its own. That is the whole trick, and it takes about twenty minutes to build.

The example here is a security risk index across twenty sites. The same shape works for vendor scoring, lead scoring, incident triage, or any list where a number has to turn into a label and a color.

## The fault, and where it actually comes from

You have met this file. A scored list, colored by hand, that nobody quite trusts any more. Look closely and the same faults turn up every time:

  * Two rows score 61.4. One is amber, one is yellow.
  * The same band is drawn in two shades, because two people picked from the palette on two different days.
  * A row sits below the cut-off and is colored red anyway, because somebody knew that site was a problem.
  * A score lands exactly on 65, which appears in two bands, so the answer depends on who typed it.
  * One row has no band at all. It quietly drops out of every count.

These look like five separate mistakes. They are one mistake, five times. **The rule lives in the formatting instead of in a column.** A color is not a value you can test. You cannot write a formula that asks "is this row the right shade of amber," so nothing checks it, and it drifts.

**The test:** can you sort by band? If the band is only a color, you cannot sort it, count it, or filter it, and neither can anybody else. That is the tell.

## The chain: score, then band, then color

Everything below is one idea applied three times. Each thing is derived from the thing before it, and only the first one is typed.

| Layer           | Where it lives                                 | Who decides it                |
|-----------------|------------------------------------------------|-------------------------------|
| Sub-scores      | Four columns, one per category                 | Your source data. Typed once. |
| Composite score | A formula, from the sub-scores and the weights | The weights row               |
| Band            | A formula, from the score                      | The cut-off table             |
| Color           | A conditional format, from the band            | The band column               |

Read that bottom-up and you get the promise: change the cut-off table, and the colors move. There is no step where a human picks a fill.

## Step 1: weights in one row

Put the four category weights in four cells on a Rules sheet, and nowhere else. Name the sheet Rules so it is obvious which tab holds the decisions.
    
    
    Rules!B7:E7   0.30   0.30   0.20   0.20

Now the composite score on each row is one formula, pointing at that row:
    
    
    =ROUND(SUMPRODUCT(E6:H6, Rules!$B$7:$E$7), 1)

`SUMPRODUCT` multiplies each sub-score by its weight and adds the results. The dollar signs lock the weights row, so you can fill this formula down twenty rows and every one still reads the same weights.

The temptation is to write `=E6*0.3+F6*0.3+G6*0.2+H6*0.2` instead. Do not. That buries the weights in twenty formulas, so changing them means twenty edits, which means it never happens, which means the weights in the file stop matching the weights in the policy.

## Step 2: cut-offs in one table

Five bands, five rows, with a lower bound and an upper bound written down. The bounds must climb in order, and they must touch with no gap and no overlap.

| Band     | Lower | Upper | What it requires                |
|----------|-------|-------|---------------------------------|
| Low      | 0     | 24    | Monitor on the normal cycle     |
| Guarded  | 25    | 44    | Fix inside the annual plan      |
| Elevated | 45    | 64    | Named owner and a dated plan    |
| High     | 65    | 79    | Quarterly review until it drops |
| Severe   | 80    | 100   | Escalate now                    |

An overlap is the fault that produced the 65 problem earlier. If High starts at 65 and Elevated ends at 65, the band depends on which rule got evaluated first, which is not a policy anyone wrote down.

Where these five numbers come from is its own question, and a bigger one than the spreadsheet. If you picked them because they were round, read [how to choose cut-offs from the data](https://michaelnocito.github.io/analyst-prep-kit/guides/data-driven-thresholds/) before you defend them to anyone.

## Step 3: look the band up, never type it

The band column is a formula. It reads the score and finds the last cut-off the score clears.
    
    
    =INDEX(Rules!$B$12:$B$16, MATCH(I6, Rules!$C$12:$C$16, 1))

Read it right to left. `MATCH` with a third argument of `1` means "find the largest value that is less than or equal to mine, and tell me its position." A score of 61.4 clears 0, 25 and 45, but not 65, so it stops at 45, the third row. `INDEX` then returns the third band name, Elevated.

**The one rule this depends on:** the lower bounds must be sorted ascending. `MATCH` with a `1` walks the list assuming order. Out of order, it returns a wrong answer confidently and without an error, which is the worst kind of wrong.

The gain is bigger than saving typing. Once the band is text in a column, you can sort by it, count it, filter it, and pivot on it. It became data.

## Step 4: let the color follow the band

Select the whole data area, columns and all, then add one conditional formatting rule per band using a formula rule:
    
    
    =$J6="Severe"

The single dollar sign is the entire mechanism. `$J` locks the column, so every cell across the row asks the same question. The bare `6` stays relative, so row 7 asks about `$J7`, row 8 about `$J8`, and so on down. One rule colors a whole row, and twenty rows need no extra work.

Repeat for the other four bands. Five rules, five fills, and that is every color in the workbook. There is no sixth place a color can come from, which is exactly why the two-ambers problem cannot happen again.

Anchor the rule to the row that starts your data. Write it while sitting on row 6 and the reference is `$J6`. Write it while sitting somewhere else and every row will be off by the difference, which looks like the colors slipped by one.

## Step 5: two checks that catch the rest

Two formulas on the Rules sheet, in plain sight, doing the checking nobody remembers to do.
    
    
    =IF(ROUND(SUM(B7:E7),4)=1, "Weights balance", "Fix the weights, they must total 100%")

Weights that total 96% still produce a score. It just quietly understates every row, and nothing looks broken.
    
    
    =IF(F17=COUNTA('Risk Index'!$A$6:$A$25), "Every site lands in one band", "Banding gap, check the cut-offs")

Here `F17` totals the per-band counts, each one a `COUNTIF` against the band column. If the two numbers disagree, a row fell through a gap in your cut-offs. That is the row that used to vanish from the report with nobody noticing.

Both checks read as a sentence, not a number. A reader who has never opened this file can tell whether it is healthy without knowing how it works.

## Step 6: the change log

One tab, three columns: what I found, what I changed, why. Every correction gets a row.

This is the tab that turns a rebuild into something a client can approve. Without it, you hand back a file that looks different and they have to take your word for it. With it, they can disagree with any single decision without reopening all of them.

One entry type matters more than the others. When two source files disagree, the change log is where you say so rather than quietly picking a winner. "This site appears on two maps with two scores, flagged for your decision" is a better line than any silent fix, because [which source wins is a policy call, not a spreadsheet one](https://michaelnocito.github.io/analyst-prep-kit/guides/documenting-data-limitations/).

## Choosing the five colors

The palette in the template is the five-class RdYlBu scheme from ColorBrewer, a tool built from map-design research by Cynthia Brewer and Mark Harrower (Harrower & Brewer, 2003). It is listed as colorblind safe, which matters more here than it looks: red and green are the two colors a large minority of readers cannot reliably separate, and risk maps reach for exactly that pair.

| Band     | Fill    | Text  |
|----------|---------|-------|
| Low      | #2C7BB6 | white |
| Guarded  | #ABD9E9 | dark  |
| Elevated | #FFFFBF | dark  |
| High     | #FDAE61 | dark  |
| Severe   | #D7191C | white |

Two rules go with it. Severity must run in one direction, so a reader learns the order once and never re-learns it. And the score stays visible in its own column next to the color, because color is a weak channel for judging how much bigger one value is than another. Position and length beat it decisively, a result Cleveland and McGill measured directly (Cleveland & McGill, 1984). The color is for scanning the map. The number is for answering the question.

## Where else this shape fits

Nothing above is about security. Any time a number becomes a label, the same chain applies: vendor scoring, lead scoring, incident triage, credit tiers, health scores on accounts. Swap the four categories and the five band names and the mechanics are unchanged.

The part worth carrying to all of them is the sentence at the top. The rule belongs in a column. Once it is in a column, it can be sorted, counted, checked, and argued with, and a rule you can argue with is the only kind that survives contact with a second person.

## References

  1. Harrower, M., & Brewer, C. A. (2003). ColorBrewer.org: An online tool for selecting colour schemes for maps. _The Cartographic Journal, 40_(1), 27–37. doi:10.1179/000870403235002042
  2. Cleveland, W. S., & McGill, R. (1984). Graphical perception: Theory, experimentation, and application to the development of graphical methods. _Journal of the American Statistical Association, 79_(387), 531–554. doi:10.1080/01621459.1984.10478080
  3. Brewer, C. A. (1994). Color use guidelines for mapping and visualization. In A. M. MacEachren & D. R. F. Taylor (Eds.), _Visualization in Modern Cartography_ (pp. 123–147). Pergamon. (Where the one-direction rule for ordered data comes from.)

---

*Originally published on Analyst Prep Kit: [Build a Risk Index That Colors Itself](https://michaelnocito.github.io/analyst-prep-kit/guides/build-a-risk-index/)*

*Visit the site for more beginner data analysis guides and free resources: [the full guide archive](https://michaelnocito.github.io/analyst-prep-kit/guides/) covers SQL, Excel, Power BI, Tableau, Python and statistics, and the [practice kits](https://michaelnocito.github.io/analyst-prep-kit/) run in your browser with nothing to install.*

*If it was useful: [Buy Me a Coffee](https://buymeacoffee.com/michaelnocito).*
