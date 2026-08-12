This article gives you the last step of the build order, and the test that tells you whether the other sixteen articles added up to anything: write the page's claim as **one sentence with a number in it** , and put that sentence on the page where a reader meets it first.

The build's sentence: _175 games are loved just as much as the famous ones and reach a twentieth of the audience._ Everything on that dashboard exists to back those words. Anything that does not back them came off.

**The short version.** A claim, not a list. "Here are 175 good games" is a list. "175 games are just as good as the famous ones with a twentieth of the audience" is a finding. If you cannot write the claim as one sentence with a number in it, you are not finished.

## A claim, not a list

Try your own current project first: say what the page shows, in one sentence, without the word "and" doing heavy lifting. If what comes out is "it shows sales by region, and trends over time, and the top products," that is a list. A list is what you have _before_ you have found anything.

A claim is a sentence somebody could disagree with. "West region's growth is entirely two customers" is a claim: it could be wrong, it could be argued, and a decision hangs on it. Nobody can disagree with a list, which is exactly why lists feel safe to ship and why [they change nothing when they land](https://michaelnocito.github.io/analyst-prep-kit/guides/report-vs-analysis/). The disagreeability is the value.

## What the sentence must contain

| Ingredient            | Why                                                                                                                                                                | In the build's sentence                    |
|-----------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------|--------------------------------------------|
| A number              | Numbers are checkable. "Many games" is weather; "175 games" is a fact someone can audit                                                                            | 175                                        |
| A comparison          | Findings live in compared-to-what, per [article 7](https://michaelnocito.github.io/analyst-prep-kit/guides/excel-pivot-percentages/)                               | loved just as much as the famous ones      |
| The comparator, named | [Article 10's](https://michaelnocito.github.io/analyst-prep-kit/guides/excel-chart-design-basics/) title rule at page scale: a reader arriving cold has no context | a twentieth of _the famous ones'_ audience |
| Plain words           | The sentence gets repeated in meetings by people who did not build the page. Jargon dies in transit                                                                | loved, famous, audience                    |

Length check, the same one this series uses for everything: say it aloud in one breath. The sentence will be quoted, forwarded and misremembered, and short sentences survive all three.

## The claim is a fork: what would change someone's mind?

The strongest test of a claim is whether it settles a real either-or. The build's dashboard was built to answer one question with two possible answers, and it is worth seeing the fork plainly, because your page has one too.

**The question:** is there a reason these games stayed unknown?

**Answer one: they are worse.** Cheaper, shorter, lower rated. If true, the market did its job, being unknown makes sense, and the page's finding is "nothing to see."

**Answer two: they are the same.** Same ratings, same prices, same playtime as the found games. If true, quality does not explain anything, and being unknown is mostly luck.

**What decides it:** the comparison table, hidden against found, side by side on the same measures. If the rows look alike, answer two.

The rows looked alike, so the sentence claims answer two, with the 21.2x audience gap as the stakes. Now say your own page's fork: what are the two answers your data could have given, and which did it give? A page that cannot name its fork is usually a list with formatting.

## Where the sentence goes on the page

At the top, as the title or directly under it, before [the KPI row](https://michaelnocito.github.io/analyst-prep-kit/guides/excel-kpi-row/). Not the file name, not "Sales Dashboard Q3," not saved for a closing text box nobody scrolls to. The reading order of the finished page is the argument in miniature:
    
    
    The sentence        the claim, in words
    The KPI row         the claim, in numbers
    The hero chart      the claim, drawn
    Everything else     support, for whoever wants to check

A reader who leaves after five seconds leaves with the finding. That is the payoff-first rule this entire series is written by, applied to your own work: the reader gets the result before the method, because the result is what they came for.

## The sentence as the editor of everything else

Written early, a draft claim becomes the cheapest editorial tool you own. Hold each element of the page against it and ask one question: does this back the sentence?

**Charts that back it stay.** The comparison table backs it. The audience-gap chart backs it. **Interesting-but-unrelated work comes off** , however long it took to make. A genre breakdown that neither supports nor challenges the claim is decoration wearing analysis's clothes. **And anything that challenges the sentence gets dealt with honestly** : either the claim narrows, or the challenge earns a spot on the page as a stated limitation, per [documenting what your data cannot tell you](https://michaelnocito.github.io/analyst-prep-kit/guides/documenting-data-limitations/). A claim that survived its own counter-evidence is the only kind worth shipping.

This is also [article 14's audit](https://michaelnocito.github.io/analyst-prep-kit/guides/excel-circular-findings/) from the constructive side: the same sentence you test for circularity is the one you build the page around. Write it, audit it, then let it edit.

## When you cannot write it

Sometimes the sentence will not come, and that is diagnostic, not failure. Three honest cases:

**The analysis is not done.** You have distributions and cuts, no fork settled. The fix is more step 3 through 5 of [the build order](https://michaelnocito.github.io/analyst-prep-kit/guides/excel-dashboard-build-order/), not more formatting. The page is not late. It is early.

**The finding is "no difference."** Write that sentence, with its number: "the two groups differ by under 2% on every measure." Null findings kill wrong plans, which makes them findings. The build's whole claim is half a null: same quality, so quality is not the explanation.

**The page is genuinely a monitoring tool** , built to watch numbers rather than argue one. Then say so in its one line: "daily volumes by region, updated each morning." That is a purpose sentence instead of a claim sentence, and choosing which kind your page is, on purpose, is the decision this article exists to force.

## Run it on your own page

  1. **Write the sentence now, before the page is done.** One sentence, one number, comparator named. Draft is fine.
  2. **Say the fork it settles.** Two possible answers, which one the data gave.
  3. **Audit it** against [article 14](https://michaelnocito.github.io/analyst-prep-kit/guides/excel-circular-findings/): could it have come out differently?
  4. **Put it at the top** and order the page as claim, numbers, hero, support.
  5. **Hold every element against it.** Backs it, stays. Neither backs nor challenges, comes off. Challenges it, narrows the claim or ships as a limitation.
  6. **Read it aloud once more before sending.** One breath, plain words, a number. That sentence is what your work becomes in other people's mouths.

## A cheat sheet

| Test             | Pass                                                   | Fail                                               |
|------------------|--------------------------------------------------------|----------------------------------------------------|
| Claim or list?   | Someone could disagree with it                         | "Shows X by Y and Z over time"                     |
| The number       | 175, 21.2x, under 2%                                   | "Many," "significant," "a lot"                     |
| The comparator   | Named in the sentence                                  | "21x the audience" of unstated what                |
| The fork         | Two possible answers, one settled                      | No version of the data would have changed the page |
| Placement        | Top of page, before the KPIs                           | File name as title, finding in a footnote          |
| The edit         | Every element backs the sentence                       | Charts kept because they took effort               |
| Cannot write it? | Diagnose: unfinished, null finding, or monitoring page | Ship the pile and hope                             |

**The one habit to keep.** Before any page ships, write its one sentence, with its number, and put it where the reader lands. If the sentence will not come, the page is telling you it is not done, and it is right.

So: the sentence you tried to write at the top of this page. Was it a claim, or was it a list? Write the claim version now, number and all, and pin it above your dashboard before you touch another cell.

---

*Originally published on Analyst Prep Kit: [Write the Sentence Your Dashboard Is Arguing](https://michaelnocito.github.io/analyst-prep-kit/guides/excel-dashboard-claim/)*

*Visit the site for more beginner data analysis guides and free resources: [the full guide archive](https://michaelnocito.github.io/analyst-prep-kit/guides/) covers SQL, Excel, Power BI, Tableau, Python and statistics, and the [practice kits](https://michaelnocito.github.io/analyst-prep-kit/) run in your browser with nothing to install.*

*If it was useful: [Buy Me a Coffee](https://buymeacoffee.com/michaelnocito).*
