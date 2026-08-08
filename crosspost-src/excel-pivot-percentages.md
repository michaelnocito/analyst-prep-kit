This article gives you the two clicks that turn a pivot of raw counts into the thing your reader actually needs: **right-click a value, Show Values As, % of Column Total**. The counts stay available. The story becomes visible.

Here is the same fact both ways. "175 games stayed hidden." Nobody can feel that; is 175 a lot? "22.9% of all genuinely loved games stayed hidden." Now it lands: nearly a quarter of everything great went unnoticed. Same data, same pivot. The second one is a finding.

**The short version.** A count answers "how many." A percentage answers "compared to what," and compared-to-what is where every finding lives. The setting is Show Values As, and the usual right choice is % of Column Total.

The numbers are from [the build behind this series](https://michaelnocito.github.io/analyst-prep-kit/guides/excel-pivot-percentages/../excel-dashboard-build-order/): 82,956 Steam games, four groups from [article 1](https://michaelnocito.github.io/analyst-prep-kit/guides/excel-pivot-percentages/../excel-label-rows-before-charting/), counted by [article 5's pivot](https://michaelnocito.github.io/analyst-prep-kit/guides/excel-pivot-percentages/../excel-pivot-table-question/). All were re-run against the real file before publishing.

## Why counts don't land

Try it on yourself first: 590 loved games got found. Is that good news or bad news? You cannot say, and the reason is worth naming: a raw count has no comparison inside it. Good or bad depends on 590 out of what.

Every count in a pivot has this problem. The reader either does the division in their head, badly, or skips it, and a skipped division is a finding that never happened. The percentage is the division done for them, and choosing its denominator is choosing what question the number answers.

## The two clicks

  1. **Right-click any number in the Values area.**
  2. **Show Values As > % of Column Total.**

The whole column of counts becomes shares that sum to 100%. Nothing is recalculated by you, nothing can be mistyped, and the pivot still refreshes with the data. That is the entire mechanic. The rest of this article is about the one real decision hiding inside it: which total is the denominator.

## Choosing the denominator: the three percent options

Show Values As offers a long menu, and three entries do nearly all analyst work. They differ only in what they divide by, so say your question out loud and match it:

| Your question                                      | Pick              | What each cell becomes            |
|----------------------------------------------------|-------------------|-----------------------------------|
| How does this group compare to everything?         | % of Grand Total  | Cell over the whole table's total |
| How is this column's total split across groups?    | % of Column Total | Cell over its column's total      |
| Within this row, how does it split across columns? | % of Row Total    | Cell over its row's total         |

With only Rows and Values filled, column and grand total are the same thing and % of Column Total is the safe default. The distinction starts mattering the moment a second field lands in Columns, because then every cell has three defensible denominators and only one answers your sentence.

Before the worked example: the build wanted "of all loved games, what share stayed hidden?" Say which denominator that is. Not all 82,956 games. Only the loved ones.

## The build's example: which denominator made the finding

The share that carried the dashboard was 175 of 765: hidden games as a share of loved games. Notice that neither % of Grand Total nor a percent over all four segments gives that number. 175 over 82,956 is 0.2%, true and useless. The question compares within the loved games only.

Two honest routes, both used in real work:

**Filter the pivot to the two loved segments** , then % of Column Total splits 765 into 22.9% hidden and 77.1% found. Quick, and fine for looking.

**Or compute it in check cells** , which is what the build shipped: `=COUNTIF(Games[Segment],"Loved, hidden")/(COUNTIF(Games[Segment],"Loved, hidden")+COUNTIF(Games[Segment],"Loved, found"))`. It reads worse and survives better, because it does not depend on a filter someone can quietly change. Formatted as a percent, it says 22.9%, and it sits beside [the checks from article 2](https://michaelnocito.github.io/analyst-prep-kit/guides/excel-pivot-percentages/../excel-check-your-work/) where the next person can see how it was made.

The general lesson: the denominator is an analytical choice, not a formatting one. Two people can both show percentages from the same pivot and be answering different questions. The number is only right when the denominator matches the sentence.

## Keep the count next to the percent

Drag the same field into Values twice. Leave the first as Count, set the second to % of Column Total. Two columns: 175 and 22.9%.

Each protects the reader from the other. The percent alone hides scale: 50% might be two rows. The count alone hides meaning: 175 of what? Together they answer both questions a reader actually has, and the pairing costs one drag.

## The small-base warning

Percentages amplify small groups into loud claims. "67% of games in this genre stayed hidden" sounds like a finding. If the genre has three games, it is two rows wearing a trend's clothes.

This is why the build put a floor under its data before any shares were computed: only games with 2,000 or more reviews counted as proven, exactly so no percentage would stand on a base too small to mean anything. When a percent surprises you, look at its count first. The count is sitting right next to it, because you just put it there.

## Run it on your own pivot

  1. **Take the pivot from article 5** , or any counts pivot you have.
  2. **Say the share question as a sentence** , including the denominator: "hidden as a share of loved," not just "as a percent."
  3. **Add the field to Values a second time** and set Show Values As to match your sentence.
  4. **Check one cell by hand.** One division in a spare cell, predicted before you look, per [article 2](https://michaelnocito.github.io/analyst-prep-kit/guides/excel-pivot-percentages/../excel-check-your-work/). If your hand says 22.9% and the pivot says something else, the denominator does not match your sentence.
  5. **Read the smallest count in the table.** If a percent stands on fewer than a couple dozen rows, say the count instead of the percent.

## A cheat sheet

| You want                     | Do                                                     | Watch for                                                    |
|------------------------------|--------------------------------------------------------|--------------------------------------------------------------|
| Counts as shares             | Right-click a value, Show Values As, % of Column Total | The counts are still there under the formatting              |
| Both count and percent       | Same field into Values twice, one of each              | Each column protects the reader from the other               |
| Share of everything          | % of Grand Total                                       | Usually true and usually not the question                    |
| Share within a subgroup      | Filter to the subgroup, or compute in a check cell     | The check cell survives; the filter can be changed silently  |
| A percent that shocks you    | Read its count first                                   | Two rows can be 67%                                          |
| Shares that must sum to 100% | % of Column Total                                      | If they don't sum to 100%, the denominator is not the column |

**The one habit to keep.** Never present a count without its denominator, and never pick the denominator by default. Say the sentence, then divide by the thing the sentence compares against.

Take the headline count from your current project and finish this sentence with it: "___ out of ___, which is ___%." Which denominator did you just choose, and would your reader have chosen the same one?

---

*The full version of this guide lives on my site: [Percentages Are the Whole Story and Excel Hides Them](https://michaelnocito.github.io/analyst-prep-kit/guides/excel-pivot-percentages/).*

*If it was useful: [Buy Me a Coffee](https://buymeacoffee.com/michaelnocito).*
