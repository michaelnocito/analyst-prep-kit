This article gives you the self-audit that catches the most embarrassing class of mistake in analysis, the one where every number is computed correctly and the finding is still worthless. The test is one question: **could this result have come out any other way, given how I defined things?** If the answer is no, it is not a finding. It is your own filter, wearing a chart.

It nearly happened in [the build behind this series](https://michaelnocito.github.io/analyst-prep-kit/guides/excel-dashboard-build-order/), and the near-miss is the best teacher this topic has, because nothing on screen was wrong. The arithmetic was perfect. The reasoning had eaten its own tail.

**The short version.** Before presenting any striking result, ask whether your own definitions guaranteed it. And treat suspiciously clean results, 0% and 100%, as the tell: circular findings come out cleaner than real ones, because nothing in reality is fighting them.

## The near-miss, exactly as it happened

The build cut the loved games by price band, per [article 5's](https://michaelnocito.github.io/analyst-prep-kit/guides/excel-pivot-table-question/) pivot, asking what share of each band stayed hidden. The $20-and-up band came back **0% hidden**. Clean, striking, chartable: expensive games always get found.

Stop and run the test yourself before reading on: the build's hidden-gem flag was defined, back at the data stage, as 2,000+ reviews, 95%+ positive, under roughly 200k owners, **and price at or under $20**. Now say what share of $20+ games could ever have been flagged hidden.

Zero. Not because expensive games get discovered. Because the definition of hidden had a price ceiling in it, so the $20+ band was excluded from hiddenness by construction. The chart would have been the definition, reflected back at its author, dressed as a discovery. It was caught before shipping and dropped. The chart cost nothing. Presenting it would have cost the credibility of every honest chart on the page.

## Why circular results look better than real ones

Here is what makes this class of error dangerous rather than merely silly: circular results are prettier than real ones. Real findings come out messy, 32% against 17%, with exceptions and noise, because reality pushes back. Circular results come out clean, 0% against 21%, because nothing is fighting them. The only force in play is your own definition, and it never disagrees with itself.

So the instinct that says "what a clean result!" is pointing exactly the wrong way. Cleanliness is not a sign of a strong finding. At 0% or 100%, it is the single strongest hint that the result deserves the test, not a chart. A number that perfect has usually been guaranteed by something, and the something is usually you.

## The test, applied in one sentence

The audit costs one sentence per finding. Say the finding, then say your definitions next to it, and listen for overlap:
    
    
    Finding:     "$20+ games are 0% hidden."
    Definition:  "Hidden means loved, small audience, AND under $20."
    Overlap:     the finding's cut (price) appears inside the definition. Circular.

Against an honest finding, the same audit passes visibly: "found games reach 21.2x the audience of hidden ones" cuts on _audience_ , and audience... appears in the definition too, doesn't it? Under 200k owners is part of hidden. That is why the build's headline compares averages across the whole loved population rather than celebrating that hidden games have small audiences, which would be the definition again. The line between the two is exactly this audit, run sentence by sentence.

Notice no formula ran. [Article 2's checks](https://michaelnocito.github.io/analyst-prep-kit/guides/excel-check-your-work/) catch wrong arithmetic. This test catches wrong reasoning, and nothing on the screen will ever flag wrong reasoning, because the screen only knows what you defined.

## The four places circularity hides

| Shape                                                | What it looks like                                                               | The giveaway question                                                    |
|------------------------------------------------------|----------------------------------------------------------------------------------|--------------------------------------------------------------------------|
| Cutting on a column inside your own filter           | The price-band cut above                                                         | Does the group-by column appear in the definition of the thing measured? |
| Filtering on the outcome, then measuring the outcome | "Among churned customers, retention is low"                                      | Did the filter already decide the measurement?                           |
| Survivorship                                         | Studying only the games that got reviews, then concluding reviewed games do well | Who never made it into the data at all?                                  |
| A threshold you set, then discovered                 | Flagging 2,000+ reviews as proven, then finding proven games have many reviews   | Is the finding just the threshold read back aloud?                       |

All four are one mistake with different entrances: some part of the answer was smuggled into the question. Say which of the four your current project is most exposed to. If it has any defined flag, any threshold, or any filtered population, at least one entrance is open.

## What to do when you catch one

**Drop the chart. Keep the note.** The build's working notes record the price cut, the clean result, the audit, and the drop. That paper trail is worth more than the chart ever was, and not just privately: "I ran the price cut, got a suspiciously clean result, worked out it was circular, and dropped it" is a stronger thing to say in an interview than any chart on the page. It demonstrates the rarest skill in the field, auditing your own reasoning, which is the difference between [producing numbers and producing analysis](https://michaelnocito.github.io/analyst-prep-kit/guides/report-vs-analysis/).

Then, if the question underneath was real, re-ask it without the circularity. "Does price affect discovery?" survives, asked of the loved games with the price ceiling removed from the flag, or asked of audience directly. The circular version dies. The curiosity behind it usually deserves to live.

## Why this works

The general failure this guards against is old and well documented: people test ideas in ways that cannot disconfirm them. Wason's selection experiments showed that even in tiny logical tasks, most people check the cases that could confirm their rule and skip the ones that could break it (Wason, 1968, _Quarterly Journal of Experimental Psychology_ , 20(3), 273-281). A circular cut is that bias built into a spreadsheet: the analysis is constructed so no data could ever come back disagreeing.

The audit works because it forces the disconfirming question the bias skips: what would it have taken for this result to come out differently? When the honest answer is "nothing, my definitions forbade it," the analysis was never a test. It was an echo.

## Run it on your own findings

  1. **List your current page's findings as sentences** , each with its number, per [article 12](https://michaelnocito.github.io/analyst-prep-kit/guides/excel-kpi-row/).
  2. **Under each, write the definitions it stands on.** Every flag, threshold and filter in play.
  3. **Look for the overlap.** A column that appears in both the finding's cut and a definition is the alarm.
  4. **Give extra suspicion to 0%, 100%, and anything you caught yourself calling clean.**
  5. **Drop what fails, note what you dropped** , and re-ask the honest version of the question if there is one.

## A cheat sheet

| Signal                                             | Read it as                                      |
|----------------------------------------------------|-------------------------------------------------|
| A result of exactly 0% or 100%                     | Run the test before any chart                   |
| The group-by column appears in a definition        | Circular. Drop the cut or change the definition |
| "Could this have come out differently?" answers no | Not a finding. An echo                          |
| Filtered on the outcome being measured             | The filter already answered the question        |
| Only survivors in the data                         | Name who is missing before concluding anything  |
| A caught circular result                           | Drop the chart, keep the note, re-ask honestly  |

**The one habit to keep.** Before presenting any striking result, say your definitions out loud next to it. The cleaner the number, the more the sentence matters.

## References

  * Wason, P. C. (1968). Reasoning about a rule. _Quarterly Journal of Experimental Psychology_ , 20(3), 273-281.

Your answer from the near-miss section, the share of $20+ games that could ever be flagged hidden: how long did it take you to see the zero was guaranteed? That delay, felt from inside, is why this audit has to be a habit and not an instinct.

---

*The full version of this guide lives on my site: [The Finding That Was Just Your Own Definition](https://michaelnocito.github.io/analyst-prep-kit/guides/excel-circular-findings/).*

*If it was useful: [Buy Me a Coffee](https://buymeacoffee.com/michaelnocito).*
