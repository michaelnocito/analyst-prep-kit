By the end of this page you can say what a p-value measures in one sentence, compute one by hand with no distribution theory at all, and name the four things people routinely claim a p-value says that it does not. The worked example is nine real orders where two regions differ by 168.50, and the answer comes out of counting rather than out of a table.

Here is what to actually do today. Any time you are about to report that two groups differ, write down the two group sizes first. If either is under about twenty, a p-value will almost certainly come back large no matter how real the difference is, and the honest report is the difference, the sizes, and an interval, not a verdict.

The short version: a p-value is the share of results at least as extreme as yours that you would get if the thing you are testing had no effect at all. Small means your result would be unusual under nothing-happening. It does not mean the effect is large, and it does not mean the effect is real.

That definition is doing a lot of work in one sentence, so it gets the picture.

> _The original carries a diagram here. In words: A histogram built from small dots, one dot per outcome, arranged in ten vertical columns of different heights standing on a horizontal baseline. The columns rise from one dot at the far left to a peak of twenty-seven dots just right of centre, then fall away to a single dot at the far right, giving the whole shape a rounded hump centred slightly left of the middle of the picture. Two vertical dashed lines cut down through the shape, one on the left of the hump and one on the right, placed symmetrically about the hump's centre. The dots lying in the two tails beyond those lines are drawn in a darker, warmer shade, and the dots in the bulk between them are drawn in a lighter blue, so the tails stand out from the middle. In the two columns the dashed lines pass through, the darker dots are stacked at the bottom of the column and the lighter ones above them. A short arrow points down at a spot just inside the right-hand dashed line and is labelled your result. Roughly a third of all the dots in the picture are in the darker shade, and they sit entirely in the two tails._

**Every number on this page is real.** Nine orders from the sixteen-row table used across these guides, with the permutation test run exhaustively rather than sampled. The same table appears in [mean vs median](https://michaelnocito.github.io/analyst-prep-kit/guides/mean-vs-median/) and [standard deviation](https://michaelnocito.github.io/analyst-prep-kit/guides/standard-deviation/).

## 1. The question a p-value answers

Before the definition: you compare two regions and one is ahead by 168.50. Name the specific doubt that number leaves you with, in your own words, before reading on.

The doubt is that the gap might be nothing but which orders happened to land where. Split any nine orders into two groups at random and the two group averages will differ, always, by something. So the useful question is not "do they differ" but "is this gap bigger than the gaps random splitting produces?"

A **p-value** answers exactly that question and nothing beyond it. Formally: assuming there is genuinely no difference between the groups, the p-value is the probability of seeing a gap at least as large as the one you saw. Everything else people say about p-values is a paraphrase that has drifted.

The assumption in the middle of that sentence has a name, the **null hypothesis**. It is the boring explanation: the regions are the same, the button colour makes no difference, the drug does nothing. The p-value never evaluates your interesting hypothesis. It only measures how uncomfortable your data would be for the boring one.

## 2. The data: two regions, 168.50 apart

Before the arithmetic: here are nine orders. Look at them and decide, by eye, whether you think South genuinely sells bigger than North, before any statistics.
    
    
    North (5 orders):  880  240  425  440  510      mean 499.00
    South (4 orders):  850  660  280  880           mean 667.50
    
    Difference in means: 667.50 − 499.00 = 168.50

South's average order is 168.50 higher, which is a 34 percent gap and would be a real finding if it held up. Look at the raw values though. North has an 880 and South has a 280, and if you swapped just those two rows between the regions the gap would nearly close. Nine numbers is not many, and that intuition is precisely what the next section makes exact.

## 3. The shuffle test, all 126 of them

Before the method: if the region label made no difference at all, then any four of these nine orders could equally well have been the South ones. Say how you would use that fact to test the gap, before reading on.

You take the nine order values, forget which region they came from, and deal four of them into a pretend South and five into a pretend North. Compute that split's gap. Do it again for a different split. The gaps you get are what pure chance produces when the label means nothing.

There are exactly 126 ways to choose 4 items from 9, so we do not have to sample. We can do every single one.
    
    
    import itertools, numpy as np
    
    vals = np.array([880, 240, 425, 440, 510, 850, 660, 280, 880], float)
    observed = 667.50 - 499.00        # 168.50
    
    gaps = []
    for pick in itertools.combinations(range(9), 4):      # 126 of them
        south = vals[list(pick)]
        north = vals[[i for i in range(9) if i not in pick]]
        gaps.append(south.mean() - north.mean())
    
    gaps = np.array(gaps)
    extreme = (np.abs(gaps) >= abs(observed)).sum()
    print(len(gaps), extreme, extreme / len(gaps))
    
    
    126 45 0.35714285714285715

Forty-five of the 126 possible splits produce a gap at least as large as 168.50, in one direction or the other. That is **p = 45 ÷ 126 = 0.357** , and it is the picture at the top of this page: the darker dots are those 45.

Read the sentence carefully, because it is the whole concept. If the region label meant nothing, we would see a gap this big or bigger about 36 percent of the time. A thing that happens 36 percent of the time by accident is not evidence of anything. It is an ordinary Tuesday.

Note what this calculation did not need. No bell curve, no assumption about the shape of order revenue, no degrees of freedom, no table in the back of a textbook. Just counting. This is called a **permutation test** , and when the group sizes are small enough to enumerate, it is the most honest version of the idea there is.

Say out loud why the test uses "at least as large" rather than "exactly this large". The reason is that any exact gap is rare; there are 126 splits and most gaps appear only a handful of times. Asking "how often is chance at least this impressive" is the only version of the question that has a stable answer.

## 4. The t-test: the same answer without the shuffling

Before the comparison: the shuffle needed 126 calculations for nine values. Predict roughly how many it would need for a hundred values per group, and you will see why the classical test exists.

Choosing 100 from 200 gives a number with 59 digits in it. Enumeration stops being possible almost immediately, and the classical tests are shortcuts that get to the same answer using mathematics instead of brute force.
    
    
    from scipy import stats
    stats.ttest_ind(south, north, equal_var=False)
    # statistic = 0.9709, pvalue = 0.3692

The **t-test** gives p = 0.369 against the shuffle's 0.357. The two agree, which is the point: the t-test is not a different concept, it is the same question answered by assuming a shape for the data rather than generating it. When that assumption is reasonable, it is faster and it works on any sample size. When the data is heavily skewed or tiny, the shuffle is the one to trust.

Two practical notes on the function. `equal_var=False` asks for Welch's version, which does not assume the two groups have the same spread. Make it your default, because it costs almost nothing when the spreads do match and it is the correct answer when they do not. And the test is two-sided by default, meaning it counts gaps in both directions, which matches the `abs()` in our shuffle code.

Here is the same test in SQL-adjacent form, for when your data lives in a warehouse and you want the ingredients rather than the verdict.
    
    
    SELECT Region,
           COUNT(*)                       AS n,
           ROUND(AVG(Revenue), 2)         AS mean_order,
           ROUND(STDDEV_SAMP(Revenue), 2) AS sd
    FROM Orders
    WHERE Region IN ('North', 'South')
    GROUP BY Region;
    
    -- North   5   499.00   235.22
    -- South   4   667.50   276.09

## 5. What 0.05 is, and what it is not

Before the section: you have p = 0.36 and the convention says 0.05. Decide what you would write in a report, in one sentence, before reading mine.

The 0.05 threshold is a convention, chosen for convenience, with no mathematical claim behind it. Nothing changes in the world between p = 0.049 and p = 0.051. Treating the first as a discovery and the second as nothing is the single most common error in applied statistics, and it is an error of habit rather than of arithmetic.

Here are the four things a p-value is regularly claimed to mean, and what it actually means instead. These are worth learning as a set, because each one shows up in real meetings.

| The claim                                                            | What is wrong with it                                                                                                           |
|----------------------------------------------------------------------|---------------------------------------------------------------------------------------------------------------------------------|
| "p = 0.36, so there is a 36 percent chance the regions are the same" | Backwards. The p-value assumes they are the same and asks about the data. It cannot tell you the probability of the assumption. |
| "p = 0.03, so the effect is important"                               | Different question. A tiny, useless difference gets a small p on enough rows. Size and significance are separate.               |
| "p = 0.36, so there is no difference"                                | Not tested. Failing to detect a difference on nine orders is not evidence that none exists.                                     |
| "p = 0.04, so it will replicate"                                     | Not implied. A p-value describes this one data set under one assumption. Repeat the study and it can land anywhere.             |

What I would actually write for our example: "South's average order was 168.50 higher than North's, on 4 orders against 5. A gap that size arises by chance about a third of the time at these sample sizes, so this data cannot tell us whether the regions really differ. The 95 percent interval on the gap runs from −256 to +593."

That sentence has the effect, the sizes, the test result and the uncertainty, and it never uses the word significant. The interval is doing most of the work, and [confidence intervals](https://michaelnocito.github.io/analyst-prep-kit/guides/confidence-intervals/) is where that half of the story lives.

## 6. Same difference, more rows

Before the table: hold the gap at exactly 168.50 and hold both spreads exactly where they are. Now imagine the same result on bigger groups. Predict what happens to the p-value.

It falls, steeply, and nothing about the finding itself has changed.

| Orders per region | Gap    | Standard error of the gap | p-value |
|-------------------|--------|---------------------------|---------|
| 4                 | 168.50 | 181.35                    | 0.389   |
| 10                | 168.50 | 114.70                    | 0.159   |
| 20                | 168.50 | 81.10                     | 0.045   |
| 40                | 168.50 | 57.35                     | 0.004   |
| 80                | 168.50 | 40.55                     | 0.0001  |

This is the fact that makes p-values dangerous when read alone. The same 168.50 gap is "not significant" at 10 orders per region and "highly significant" at 40. The world did not change; only the amount of data did. A p-value is a statement about how much evidence you gathered at least as much as about how big the effect is.

It runs the other way too. Collect a million rows and a difference of 0.3 percent will come back with a p-value of essentially zero, and it will still be a difference nobody should act on. This is why the effect size goes in the report next to the p-value, always, and usually first.

Now picture the last test result you saw quoted in a meeting. Do you know how many rows were behind it? If not, you did not know what the p-value meant, and neither did anyone else in the room.

## 7. Testing six things at once

Before the arithmetic: you have four regions, so there are six possible pairs to compare. If every region were genuinely identical, and you tested all six pairs at the 0.05 threshold, what is the chance at least one comes back "significant"? Guess before reading on.

Each single test has a 95 percent chance of behaving. Six independent tests all behaving is 0.95 to the sixth power, which is 0.735. So the chance that **at least one of the six fires by pure accident is 26.5 percent**. Do twenty tests and it is 64 percent.

This is why exploring a data set by running every comparison you can think of, then reporting the ones that came back small, produces findings that evaporate on the next data set. The tests are not wrong individually. The selection afterwards is what breaks them.

Two fixes, and the cheap one is better than most people expect.

**Decide the comparison before you look.** One planned test at 0.05 is one test. Free, and it is the fix that actually works.

**Adjust the threshold if you must run many.** The Bonferroni correction divides the threshold by the number of tests: 0.05 ÷ 6 = 0.0083 for our four regions. It is blunt and conservative, and its blunt conservatism is the honest price of having gone fishing.

And if you are exploring rather than testing, say so in the write-up. Exploration is a legitimate and necessary activity. Exploration dressed as confirmation is what produces a chart nobody can reproduce next quarter.

## The full before and after

Same comparison both times: does South out-sell North per order?

### Before
    
    
    South averages 667.50 per order and North averages 499.00.
    South is 34% ahead. We should move headcount south.

Two true numbers and a decision that does not follow from them. There is no count, no measure of how variable the orders are, and no acknowledgement that nine orders is nine orders. The 34 percent is arithmetically correct and carries no information about whether it will still be there next quarter.

### After
    
    
    South: 4 orders, mean 667.50, sd 276.09
    North: 5 orders, mean 499.00, sd 235.22
    Gap: 168.50 (South ahead)
    Welch t-test: t = 0.97, p = 0.37
    Exact permutation test over all 126 splits: p = 0.36
    95% interval on the gap: −256 to +593

The same 168.50 is now reported with everything needed to judge it. The interval crossing zero says the data is consistent with South being ahead by 593 and with North being ahead by 256. That is the honest state of knowledge, and the recommendation it supports is "collect another quarter", not "move headcount".

## Edge cases that catch people out

Six that each cost somebody a quarter.

**Peeking at the p-value as data arrives.** Checking a running test every day and stopping when it goes below 0.05 will get you below 0.05 eventually even when nothing is happening, because you are running a new test every day and keeping the best one. Fix the sample size in advance, which is what [A/B testing](https://michaelnocito.github.io/analyst-prep-kit/guides/ab-testing-for-analysts/) is largely about.

**A p-value on the whole population.** If your table contains every order that exists, there is nothing to infer. The regions differ by 168.50, full stop. A p-value asks whether a sample generalizes, and there is no sample.

**Reporting p without n.** Section six is the reason. The two numbers only mean something together.

**Treating 0.049 and 0.051 differently.** They are the same result. If your decision flips between them, the decision was never resting on the data.

**Assuming rows are independent when they are not.** Four orders from the same customer are not four independent pieces of evidence, and every test on this page assumes they are. Repeated measures from the same person, sessions from the same account, days from the same store: all of these inflate your apparent sample size and shrink your p-values wrongly.

**Confusing a small p with a strong effect.** It is worth saying twice. Report the difference, the interval, and the counts. The p-value goes last, and on its own it tells the reader almost nothing.

## Why this works

The permutation logic in section three predates the t-test's popularity and needs none of its assumptions: if the labels are meaningless, then every relabelling is equally likely, and you can compute the distribution of any statistic you like by enumerating them. That is the whole argument, and it is why a shuffle test is the right way to learn what a p-value is before meeting a formula for one.

The misinterpretations in section five are common enough that the American Statistical Association issued a formal statement about them, its first ever on a specific matter of practice. It sets out six principles, including that a p-value does not measure the probability that a hypothesis is true, does not measure the size of an effect, and should not by itself decide anything (Wasserstein & Lazar, 2016, _The American Statistician_ , 70(2), 129–133). Greenland and colleagues catalogue twenty-five specific misinterpretations of p-values, intervals and power, with the correction for each, and it is the single most useful reference to keep open while writing up a test (Greenland, Senn, Rothman, Carlin, Poole, Goodman, & Altman, 2016, _European Journal of Epidemiology_ , 31(4), 337–350). Cohen made the same argument earlier and more bluntly, pointing out that the thing analysts actually want to know, the probability their hypothesis is true given the data, is not what a p-value provides and cannot be obtained from one (Cohen, 1994, _American Psychologist_ , 49(12), 997–1003).

One note on why this page kept asking you to commit before showing you the answer. Attempting an answer before seeing the correct one reliably improves how well the correct one is retained, even when the attempt is wrong (Bisra, Liu, Nesbit, Salimi, & Winne, 2018, _Educational Psychology Review_ , 30(3), 703–725). The 45-out-of-126 result sticks because you looked at the nine numbers and formed an opinion first.

## Using this on your own work

Adding formal tests to everything you produce is miserable and unnecessary. Do this instead, in order.

  1. **Write the comparison down before you run it.** One sentence: which two groups, which measure, which direction you expect. This alone fixes the multiple-comparison problem.
  2. **Report the effect first.** The difference in the units people care about, with both group sizes beside it.
  3. **Add an interval.** It carries everything a p-value carries and answers "how big could it be", which is the question that was actually asked.
  4. **Put the p-value last** , with its n, and never as the only number.
  5. **If either group is under twenty, say so explicitly** and expect the test to be uninformative. That is not a failure of the analysis, it is the analysis telling you it needs more data.

If you have paper nearby, one optional drawing is worth five minutes. Write your own two groups' values on separate slips, shuffle them, deal them back into two piles of the original sizes, and write down the gap. Do it ten times by hand. Watching gaps as big as your real one come out of a shuffle is the moment the concept stops being abstract.

**More detail on this, and more like it.** Every how-to sits in one place on the [guides index](https://michaelnocito.github.io/analyst-prep-kit/guides/): SQL, Python, Excel, statistics and the working habits around them.

## The whole thing on one screen

This is the retrieval sheet. Cover the right column, work down the left, and say each answer out loud before you check it.

| Idea             | What it means                                                                                  |
|------------------|------------------------------------------------------------------------------------------------|
| P-value          | If there were no real difference, how often would chance produce a gap this big or bigger.     |
| Null hypothesis  | The boring explanation the p-value assumes: no difference, no effect.                          |
| Permutation test | Shuffle the labels, recompute, count. Ours: 126 splits, 45 as extreme, p = 0.36.               |
| t-test           | The same question with a shape assumed instead of enumerated. Here p = 0.37.                   |
| Welch's version  | `equal_var=False`. Does not assume equal spreads. Make it the default.                         |
| Two-sided        | Counts gaps in both directions. The default, and usually right.                                |
| 0.05             | A convention, not a fact. 0.049 and 0.051 are the same result.                                 |
| What p is not    | Not the chance the null is true, not the effect size, not proof of no effect, not replication. |
| Sample size      | Same 168.50 gap: p = 0.39 at n = 4, p = 0.045 at n = 20, p = 0.0001 at n = 80.                 |
| Large data       | Everything becomes significant. Read the effect size, not the p-value.                         |
| Six comparisons  | 26.5% chance one fires by accident at 0.05. Twenty comparisons: 64%.                           |
| Bonferroni       | Divide the threshold by the number of tests. 0.05 ÷ 6 = 0.0083.                                |
| Peeking          | Stopping when it dips below 0.05 guarantees you eventually get there. Fix n up front.          |
| Whole population | No sample, nothing to infer, no p-value needed.                                                |
| Independence     | Repeated rows from one customer are not independent evidence.                                  |
| What to report   | Effect, both counts, an interval, then the p-value. In that order.                             |

**The one habit to keep.** Write the comparison down before you run it, and report the difference and both counts before the p-value. Those two habits between them prevent most of what goes wrong with testing. If a result breaks in a way this page does not cover, there is a general [diagnosis loop for being stuck](https://michaelnocito.github.io/analyst-prep-kit/guides/technical-tenacity/).

One last thought, and I would genuinely like other people's answers. The first significant result I ever reported came from a comparison I picked after seeing the chart, and it did not survive the next month's data. What is the finding in your work that you would want to re-run before defending it?

## References

  * Wasserstein, R. L., & Lazar, N. A. (2016). The ASA statement on p-values: Context, process, and purpose. _The American Statistician_ , 70(2), 129–133.
  * Greenland, S., Senn, S. J., Rothman, K. J., Carlin, J. B., Poole, C., Goodman, S. N., & Altman, D. G. (2016). Statistical tests, P values, confidence intervals, and power: A guide to misinterpretations. _European Journal of Epidemiology_ , 31(4), 337–350.
  * Cohen, J. (1994). The earth is round (p < .05). _American Psychologist_ , 49(12), 997–1003.
  * Bisra, K., Liu, Q., Nesbit, J. C., Salimi, F., & Winne, P. H. (2018). Inducing self-explanation: A meta-analysis. _Educational Psychology Review_ , 30(3), 703–725.

---

*The full version of this guide lives on my site: [What Is a P-Value? Worked by Shuffling Nine Real Orders 126 Ways](https://michaelnocito.github.io/analyst-prep-kit/guides/p-values/).*

*If it was useful: [Buy Me a Coffee](https://buymeacoffee.com/michaelnocito).*
