By the end of this page you can read a budget vs actual table without being fooled by it, and build one in Excel that does not fool anyone else. You will know the variance formula, why analysts write F and U instead of trusting plus and minus, the two ways percent variance lies, and how to say the whole table in one sentence. It is about twenty minutes.

Here is what to actually do today. Open the last variance table you were sent and find its biggest percentage. Then find its biggest dollar amount. If they are different rows, and they usually are, you now know which row deserved the attention, and it is probably not the one that got it.

The short version: variance is actual minus budget. On a revenue line, positive is good. On a cost line, positive is bad. So analysts label every line F for favorable or U for unfavorable, rank by dollars, and flag by percent.

The sign flip is the trap people fall into first, so it gets the picture.

> _The original carries a diagram here. In words: Two panels, each showing a pair of vertical bars rising from a shared baseline. In the left panel, labeled revenue, a shorter bar marked budget stands next to a taller bar marked actual. The extra height of the actual bar above the budget level is shaded in the accent color and marked with the letter F and a check mark, because collecting more revenue than budgeted is favorable. In the right panel, labeled cost, the bars have the same shapes: a shorter budget bar next to a taller actual bar. But here the extra height above budget is shaded in the warning color and marked with the letter U and a cross, because spending more than budgeted is unfavorable. A dashed horizontal line runs across each panel at the budget height. The two panels are geometrically identical, and only the meaning of the line decides whether the overshoot is good or bad. That is why the sign of a variance cannot be read without knowing the line type._

**Every number on this page is verified.** The worked example is a small department's month, eight lines, shown in full below. Every variance, percentage, subtotal, and walk step was computed in a script before it went on the page, so you can check any cell by hand and it will agree.

## 1. The variance formula, and the sign trap

Before the explanation: two lines both came in over budget, revenue by $12,400 and contractor spend by $11,800. One of those is good news. Say which, and say what told you.

Variance is actual minus budget. Budget is the number you planned, actual is the number that happened, and the variance is the gap between them, with a direction. Revenue budgeted at $250,000 that came in at $262,400 has a variance of positive $12,400. Contractor spend budgeted at $20,000 that came in at $31,800 has a variance of positive $11,800.

Same formula, same plus sign, opposite meanings. More revenue than planned is good. More spending than planned is bad. The sign only tells you the direction of the miss; the line type tells you whether that direction helped. This is why finance teams do not trust the sign. They add a column that states the verdict directly: F for favorable, meaning the miss helped profit, and U for unfavorable, meaning it hurt profit. The rule in one breath: on revenue lines, over budget is F. On cost lines, over budget is U.

Some shops flip the formula to budget minus actual so that positive always means favorable on cost lines. That works until someone merges two workbooks with opposite conventions. The F/U label survives both conventions, which is exactly why it exists. Write the formula you used in a cell comment or a header note, and label F/U regardless.

## 2. The worked table, labeled F and U

Here is the department. Two revenue lines, six cost lines. Variance is actual minus budget throughout, percent is variance divided by budget, and the F/U column applies the rule from section one.

| Line             | Type    | Budget  | Actual  | Variance | Variance % | F/U |
|------------------|---------|---------|---------|----------|------------|-----|
| Product revenue  | Revenue | 250,000 | 262,400 | +12,400  | +5.0%      | F   |
| Services revenue | Revenue | 60,000  | 54,200  | -5,800   | -9.7%      | U   |
| Salaries         | Cost    | 140,000 | 143,500 | +3,500   | +2.5%      | U   |
| Contractors      | Cost    | 20,000  | 31,800  | +11,800  | +59.0%     | U   |
| Software         | Cost    | 12,000  | 11,400  | -600     | -5.0%      | F   |
| Travel           | Cost    | 3,000   | 5,900   | +2,900   | +96.7%     | U   |
| Office supplies  | Cost    | 800     | 1,150   | +350     | +43.8%     | U   |
| Marketing        | Cost    | 25,000  | 24,100  | -900     | -3.6%      | F   |

Check one row by hand to trust the rest. Contractors: 31,800 minus 20,000 is 11,800 over, and 11,800 divided by 20,000 is 0.59, which is 59.0%. It is a cost line, over budget, so U.

The totals: revenue came in at $316,600 against a $310,000 budget, favorable by $6,600. Costs came in at $217,850 against $200,800, unfavorable by $17,050. Net, the department planned to contribute $109,200 and actually contributed $98,750, which is $10,450 short of plan.

Say why the same plus sign produced an F on the first row and a U on the third row, in your own words, before moving on. If you can say it, the rest of this page is bookkeeping.

## 3. Percent variance, and its two traps

Before the explanation: in the table above, Travel is off by 96.7% and Salaries by 2.5%. Which one costs the company more money?

Percent variance is the variance divided by the budget. It answers "how far off the plan was this line, relative to its own size," and it makes lines of different sizes comparable. It also has two reliable failure modes.

**Trap one: a zero or tiny budget makes the percent meaningless.** Divide by a budget of zero and the formula errors, or worse, someone hardcodes it to show a number. Divide by a tiny budget and you get a giant percent from pocket change: Office supplies here is 43.8% over, and the entire miss is $350. A percent with a small denominator is a loud noise about a small thing.

**Trap two: percent and dollars rank the lines in different orders, and the percent order is the wrong one to act on.** Salaries is off by just 2.5%, the second-smallest percent among the misses, yet that 2.5% is $3,500, which is ten times the office supplies miss. Money is spent in dollars, not in percents. So the working habit is: rank by dollars, flag by percent. Dollar order tells you where the money went. The percent flag tells you which lines drifted furthest from their own plan, which is a control question rather than a money question. Both are worth knowing. Only one decides what you investigate first.

Ranked by absolute dollars, this table reads: Product revenue +12,400 F, Contractors +11,800 U, Services revenue -5,800 U, Salaries +3,500 U, Travel +2,900 U, then everything under a thousand. Contractors is the story. It is second in dollars and second in percent, the only line that is loud on both measures.

## 4. Set a materiality floor before you read

Before the explanation: how big does a variance have to be before you say its name in the review meeting? If you do not have a number, the table decides for you.

A materiality floor is a threshold you set before reading the table: below this many dollars, or below this percent, a variance is noise and gets no airtime. The habit that matters is the word "before." Decide the floor first, then read. If you read first, the interesting-looking rows will pull your floor down to wherever they happen to sit, and every month's floor will be different.

A common shape is a two-part test: flag a line only if it is off by more than a dollar floor AND more than a percent floor. For this department, $2,000 and 5% would flag Contractors, Services revenue, and Travel, while letting Salaries pass as within tolerance and silencing Office supplies entirely. Whether those are the right floors is a judgement about this department, not arithmetic, and the floor itself should come from the data rather than from taste. [Choosing thresholds from the data](https://michaelnocito.github.io/analyst-prep-kit/guides/data-driven-thresholds/) is the full method: pick it, write down why, and check the read survives a nearby choice.

Write the floor into the workbook where readers can see it. "Lines within $2,000 and 5% of plan are not discussed" is one sentence, and it converts your silence about small rows from an omission into a policy.

## 5. Build it in Excel with SUMIFS

Before the explanation: your actuals arrive as hundreds of individual transactions, and your budget is eight tidy lines. What has to happen to the transactions before the two can sit in one table?

They have to be summed per line. That is the whole build: the budget table supplies the rows, and `SUMIFS` pulls each line's actual total out of the transaction pile. `SUMIFS` adds up one column wherever another column matches a condition, and the [SUMIFS guide](https://michaelnocito.github.io/analyst-prep-kit/guides/excel-sumifs/) covers the function itself in depth.

Set up two Excel tables. One named `Actuals` with the raw transactions, columns Line, Month, Amount. One named `Report` with columns Line, Type, Budget, and the formulas. Then, in the Report table:
    
    
    Actual      =SUMIFS(Actuals[Amount], Actuals[Line], [@Line])
    Variance    =[@Actual]-[@Budget]
    Variance %  =IF([@Budget]=0, "", [@Variance]/[@Budget])
    F/U         =IF([@Type]="Revenue",
                   IF([@Variance]>=0, "F", "U"),
                   IF([@Variance]>0, "U", "F"))

The `IF([@Budget]=0, "")` wrapper is trap one from section three, handled at build time: a line with no budget shows a blank percent instead of an error or a fake number. The F/U formula is the sign rule made mechanical, so the verdict column can never disagree with the convention.

Verify the machinery once with a line you can add in your head. The Contractors actuals in this example are three monthly invoices: 9,800 plus 10,400 plus 11,600, which is 31,800, exactly what the SUMIFS returns and what the worked table shows. Salaries is 47,800 plus 47,800 plus 47,900, which is 143,500. One hand-check per build catches a mis-pointed range, and a mis-pointed range is the most common way a variance report is wrong.

Picture running this build on your own cost center's transactions. Which line would you hand-check, and do you already know a month where SUMIFS would surprise you? That suspicion is worth chasing; it is usually a naming mismatch between the transaction labels and the budget lines.

## 6. The full before and after

Same eight lines, same numbers, two tables.

### Before

Budget, actual, variance. Sorted by percent, no F/U, no floor. Travel tops the table at 96.7%, Office supplies sits second at 43.8%, and the reader's eye spends its first ten seconds on $3,250 of combined misses. Salaries, off by more than both of those together, sits sixth of eight. And a director skimming the variance column sees +12,400 and +11,800 as the same kind of number, when one grew the business and the other blew a plan by half.

### After

| Line             | Type    | Budget  | Actual  | Variance | Variance % | F/U | Flag |
|------------------|---------|---------|---------|----------|------------|-----|------|
| Product revenue  | Revenue | 250,000 | 262,400 | +12,400  | +5.0%      | F   | flag |
| Contractors      | Cost    | 20,000  | 31,800  | +11,800  | +59.0%     | U   | flag |
| Services revenue | Revenue | 60,000  | 54,200  | -5,800   | -9.7%      | U   | flag |
| Salaries         | Cost    | 140,000 | 143,500 | +3,500   | +2.5%      | U   |      |
| Travel           | Cost    | 3,000   | 5,900   | +2,900   | +96.7%     | U   | flag |
| Marketing        | Cost    | 25,000  | 24,100  | -900     | -3.6%      | F   |      |
| Software         | Cost    | 12,000  | 11,400  | -600     | -5.0%      | F   |      |
| Office supplies  | Cost    | 800     | 1,150   | +350     | +43.8%     | U   |      |

Sorted by absolute dollars, verdict labeled on every line, and a flag column applying the stated floor: off by more than $2,000 and more than 5%. The same information now reads in the order the money moved. Contractors surfaces immediately as the problem, Product revenue as the offsetting good news, and Office supplies drops to the bottom where its $350 belongs, still visible, no longer shouting.

## 7. Present it: the variance walk and the one-sentence claim

Before the explanation: your director has thirty seconds. What is the one sentence this table earns?

The walk first, because it is how finance audiences expect to travel from plan to result. A variance walk starts at the budgeted total, adds or subtracts the largest variances in order of size, and lands exactly on the actual. In one paragraph, this department's walk: we planned to contribute $109,200; product revenue added 12,400; contractor overruns took back 11,800; the services shortfall took 5,800 more; salaries, travel, and small items netted out another 5,250 against us; and we landed at $98,750. Every step is a labeled cause, the steps sum exactly, and drawn as a chart this paragraph is a waterfall: floating bars stepping from the budget column down or up to the actual column.

Then the claim. A variance report is not eight rows; it is one sentence with a number, backed by eight rows: "We missed plan by $10,450, and contractor spend at 159% of budget is the driver." That is a claim someone can act on, question, or own. Sending the table alone makes the reader do the analysis you were asked to do, and the difference between shipping rows and shipping a claim is the whole subject of [report vs analysis](https://michaelnocito.github.io/analyst-prep-kit/guides/report-vs-analysis/).

## 8. Edge cases that flip meanings in real reports

Before the explanation: a cost line comes in 40% under budget. The F/U formula stamps it favorable. Name a reason it might be the worst news in the table.

**Underspend is not automatically good.** The hiring you budgeted and did not do, the maintenance that got deferred, the campaign that never launched: each prints as F and each may be a plan failing to happen. F and U describe the effect on this period's profit, nothing more. Read big favorable cost variances with the same suspicion as big unfavorable ones.

**Timing masquerades as performance.** An invoice that slipped from June into July makes June favorable and July unfavorable, and both are illusions. Before escalating any single-month variance, check the year-to-date column; timing noise cancels there while real drift accumulates.

**The convention flips between shops.** Actual minus budget here; budget minus actual elsewhere, so that positive means favorable everywhere. Neither is wrong. A workbook that does not state which one it uses is wrong. One header note fixes it forever.

**Mixed signs hide inside totals.** The two revenue lines net to +6,600 F, which quietly contains a $5,800 services shortfall. Every subtotal you present should be openable back into its lines, because someone in the meeting will ask, and because the netted number genuinely conceals a U.

**Zero-budget lines need words, not percents.** Spending that had no budget line at all is a different conversation from an overrun, and it deserves a sentence ("$4,000 of unbudgeted legal fees") rather than a blank or an error in the percent column.

## Why this works

Ranking by dollars and drawing the walk as a waterfall are both bets on how human perception actually performs, and the bet has evidence behind it. Cleveland and McGill measured which visual comparisons people judge accurately, and position along a common scale beat nearly everything else (Cleveland & McGill, 1984, _Journal of the American Statistical Association_ , 79(387), 531–554). A dollar-sorted table puts the decision-relevant quantity in a common column where those accurate judgements can happen, instead of asking readers to mentally rescale eight percentages with eight different denominators.

The prequestions under each heading are not a quirk. Attempting an answer before receiving one improves learning of exactly that material, an effect that holds across dozens of studies of self-explanation prompts (Bisra, Liu, Nesbit, Salimi, & Winne, 2018, _Educational Psychology Review_ , 30(3), 703–725). Guessing whether Travel or Salaries costs more before section three answered it is why the dollars-over-percents rule will still be with you next quarter. The same logic says the cheat sheet below works best covered, as retrieval practice rather than rereading (Roediger & Karpicke, 2006, _Psychological Science_ , 17(3), 249–255).

## Using this on your own project

Rebuilding every variance report you have inherited is miserable, and the older ones have defenders. Do this instead, in order.

  1. **Add the F/U column to the report you own** , using the formula from section five. It is one column and it ends every sign argument in the room.
  2. **State the convention in a header note** : "Variance = actual minus budget." One line, permanent.
  3. **Re-sort by absolute dollar variance.** If the current sort is alphabetical or by percent, this single change re-aims the meeting.
  4. **Write the materiality floor above the table** and add the flag column that applies it. Agree the floor with the report's owner before the next cycle, not during it.
  5. **Hand-check one SUMIFS line per month** against its raw transactions. Rotate which line. This is five minutes and it is your audit trail.
  6. **End every cycle with the one-sentence claim** at the top of the email, above the table, with the driver named.

If you have paper nearby, one optional drawing locks the core idea in. Draw the two-panel figure from this page from memory: two bar pairs, one labeled revenue, one labeled cost, the same overshoot shaded on each, and mark which overshoot is F and which is U. If your labels come out reversed, the page is still open.

**More detail on this, and more like it.** Every how-to sits in one place on the [guides index](https://michaelnocito.github.io/analyst-prep-kit/guides/): Excel, SQL, Tableau, and the working habits around them.

## The whole thing on one screen

This is the retrieval sheet. Cover the right column, work down the left, and say each answer out loud before you check it.

| Concept               | What it is                                                                         |
|-----------------------|------------------------------------------------------------------------------------|
| Variance              | Actual minus budget. Direction and size of the miss.                               |
| The sign trap         | Positive is good on revenue lines and bad on cost lines.                           |
| F / U                 | Favorable or unfavorable to profit. The verdict, stated instead of inferred.       |
| The F/U rule          | Revenue over budget is F. Cost over budget is U. Under budget flips each.          |
| Percent variance      | Variance divided by budget. The miss relative to the line's own size.              |
| Percent trap one      | Zero or tiny budgets make giant, meaningless percents. Guard the division.         |
| Percent trap two      | Percent order and dollar order disagree. 2.5% of Salaries beat 43.8% of supplies.  |
| The working habit     | Rank by dollars, flag by percent.                                                  |
| Materiality floor     | The dollar-and-percent threshold set BEFORE reading, and written on the report.    |
| The Excel core        | SUMIFS pulls each line's actual from transactions into the budget table.           |
| The build check       | Hand-add one line's transactions and match the SUMIFS. Every build, once.          |
| Variance walk         | Budget, then the biggest drivers in order, landing exactly on actual. A waterfall. |
| The deliverable       | One claim sentence with a number and a named driver, above the table.              |
| Favorable underspend  | Sometimes a plan that failed to happen. Read big F costs with suspicion.           |
| Timing vs performance | Slipped invoices fake one bad month and one good one. Check year to date.          |

**The one habit to keep.** If you take nothing else from this page, rank every variance table by dollars and label every line F or U before anyone else reads it. The most expensive miss in the table is routinely hiding behind the smallest percent. If a workbook fights back in a way this page does not cover, there is a general [diagnosis loop for being stuck](https://michaelnocito.github.io/analyst-prep-kit/guides/technical-tenacity/).

One last thought, and I would genuinely like other people's answers. The first variance table I ever presented was sorted by percent, and the meeting spent eight of its ten minutes on a line worth a few hundred dollars. What is the smallest line item that has ever eaten a whole meeting you were in, and did anyone ever say the dollar amount out loud?

## References

  * Cleveland, W. S., & McGill, R. (1984). Graphical perception: Theory, experimentation, and application to the development of graphical methods. _Journal of the American Statistical Association_ , 79(387), 531–554.
  * Bisra, K., Liu, Q., Nesbit, J. C., Salimi, F., & Winne, P. H. (2018). Inducing self-explanation: A meta-analysis. _Educational Psychology Review_ , 30(3), 703–725.
  * Roediger, H. L., & Karpicke, J. D. (2006). Test-enhanced learning: Taking memory tests improves long-term retention. _Psychological Science_ , 17(3), 249–255.

---

*Originally published on Analyst Prep Kit: [Budget vs Actual Variance Analysis: The Sign Trap and the Percent Trap](https://michaelnocito.github.io/analyst-prep-kit/guides/budget-vs-actual-variance/)*

*Visit the site for more beginner data analysis guides and free resources: [the full guide archive](https://michaelnocito.github.io/analyst-prep-kit/guides/) covers SQL, Excel, Power BI, Tableau, Python and statistics, and the [practice kits](https://michaelnocito.github.io/analyst-prep-kit/) run in your browser with nothing to install.*

*If it was useful: [Buy Me a Coffee](https://buymeacoffee.com/michaelnocito).*
