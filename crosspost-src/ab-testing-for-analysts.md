By the end of this page you can work out how many visitors a test needs before it starts, read a finished test in absolute and relative terms with an interval, and explain why watching a live test is the fastest way to declare a winner that does not exist. The worked example detects a 20 percent lift on a 4 percent baseline, and it needs 10,317 visitors per arm to do it.

Here is what to actually do today. Before running any test, write down three numbers: your current conversion rate, the smallest improvement that would be worth shipping, and the resulting sample size per arm. If your traffic cannot supply that sample in a reasonable time, you have learned the most valuable thing the test had to offer, and you have learned it for free.

The short version: an A/B test splits traffic randomly, measures a rate in each half, and asks whether the gap is bigger than random splitting produces. The sample size decides what size of gap you are able to see at all.

The failure that costs the most is stopping early, and it is easier to see than to describe, so it gets the picture.

> _The original carries a diagram here. In words: A line chart on a plain horizontal baseline. A single jagged line runs left to right across twenty evenly spaced points, wandering up and down through the upper two thirds of the chart. A horizontal dashed line sits low down, near the bottom of the plotting area, labelled 0.05. For most of its journey the jagged line stays well above that dashed line. Around the middle of the chart the jagged line plunges sharply downward, crossing below the dashed line, and stays below it for three consecutive points, the lowest of which is marked with a hollow ring and labelled stopped here. Immediately after those three points the line climbs steeply back up above the dashed line and wanders in the upper region for the remaining eight points, finishing at the far right at a height similar to where it started, well above the dashed line. That final point is marked with a filled dot and labelled ran to the end._

**Every number on this page is real.** The test result, the sample sizes and the peeking simulation were all computed rather than quoted. This page assumes you have met [p-values](https://michaelnocito.github.io/analyst-prep-kit/guides/p-values/) and [confidence intervals](https://michaelnocito.github.io/analyst-prep-kit/guides/confidence-intervals/); if not, those two come first and this one is where they get used.

## 1. What an A/B test is actually deciding

Before the definition: you change a button and conversions go up. Name the specific reason that is not yet evidence the button did it, before reading on.

Conversions move on their own. Different days, different traffic sources, different weather. An A/B test removes those explanations by splitting traffic **randomly and at the same time** , so the only systematic difference between the two groups is the change you made. Everything else, known and unknown, is distributed evenly between them by the coin flip.

That randomization is the whole engine. It is what turns "the number went up" into "the change caused the number to go up", and it is why an A/B test can support a causal claim when a before-and-after comparison cannot. The general version of that argument is in [correlation vs causation](https://michaelnocito.github.io/analyst-prep-kit/guides/correlation-vs-causation/); a controlled experiment is the tool that resolves it.

The vocabulary, once, so the rest of the page reads cleanly. The **control** is the current version. The **variant** or treatment is the new one. The **metric** is the one number you decided in advance to judge on. And the split should be genuinely random per visitor, held constant so a returning visitor sees the same version, and running over the same period for both.

## 2. The worked test: 4.0 percent against 5.0 percent

Before the arithmetic: here is a finished test. Decide whether you would ship the variant, before any statistics.

| Version | Visitors | Conversions | Rate  |
|---------|----------|-------------|-------|
| Control | 4,000    | 160         | 4.00% |
| Variant | 4,000    | 200         | 5.00% |

The test statistic is built the same way as any other: an observed gap divided by how much gap random splitting produces. For two rates, the standard error uses a pooled rate, because the null hypothesis says both arms come from the same underlying rate.
    
    
    pooled rate = (160 + 200) / (4000 + 4000) = 0.045
    
    standard error = sqrt( 0.045 × 0.955 × (1/4000 + 1/4000) )
                   = sqrt( 0.045 × 0.955 × 0.0005 )
                   = 0.0046355
    
    z = (0.05 − 0.04) / 0.0046355 = 2.157
    p = 0.031
    
    
    import numpy as np
    from scipy import stats
    
    nc, kc, nv, kv = 4000, 160, 4000, 200
    pc, pv = kc/nc, kv/nv
    pool   = (kc + kv) / (nc + nv)
    se     = np.sqrt(pool * (1 - pool) * (1/nc + 1/nv))
    z      = (pv - pc) / se
    p      = 2 * (1 - stats.norm.cdf(abs(z)))
    print(round(z, 3), round(p, 4))     # 2.157 0.0310

So p = 0.031, under the usual threshold. Before you ship it, section five asks a question that changes the answer, and it is the question most tests never get asked.

## 3. Reading the result: absolute, relative, and the interval

Before the numbers: the rate went from 4.0 percent to 5.0 percent. Say how big that improvement is, in a sentence, before reading on. There are two correct answers and they sound very different.

It is **1.0 percentage point** in absolute terms and **25 percent** in relative terms. Both are true, they are the same fact, and the second one sounds roughly twenty-five times more exciting. This is the single most common way test results get oversold, and usually nobody involved intends it.

| How to say it      | The number            | What it is good for                                                   |
|--------------------|-----------------------|-----------------------------------------------------------------------|
| Absolute lift      | +1.0 percentage point | Forecasting. 100,000 visitors gives 1,000 extra conversions.          |
| Relative lift      | +25%                  | Comparing tests to each other, and to the size you set out to detect. |
| Rates side by side | 4.0% → 5.0%           | Everything. Nobody can misread it.                                    |

Report the two rates and both lifts, and say "percentage points" out loud when you mean them. A slide that says "up 25 percent" next to a rate of 5 percent has told the reader nothing about which 25 percent it means.

Then add the interval, which is the number the meeting actually needs.
    
    
    unpooled se = sqrt( 0.04 × 0.96 / 4000 + 0.05 × 0.95 / 4000 ) = 0.004634
    95% interval on the difference = 0.01 ± 1.96 × 0.004634
                                   = 0.0009 to 0.0191
                                   = +0.09 to +1.91 percentage points

So the data is consistent with a gain of a tenth of a percentage point and with a gain of nearly two. In relative terms that is roughly 2 percent to 48 percent, and the width of that range is the honest state of knowledge. If shipping only pays off above a 10 percent relative gain, this test has not answered the question, even though its p-value cleared 0.05.

Say out loud why the interval is more useful here than the p-value. The p-value said "probably not nothing". The interval says "somewhere between barely worth it and excellent", which is the sentence a decision can be built on.

## 4. Sample size, decided before the test starts

Before the calculation: you convert at 4 percent and you would ship anything that improves it by a fifth. Guess how many visitors per arm that needs, before reading on. Almost everybody guesses low.

It needs **10,317 per arm** , or 20,634 in total. At a thousand visitors a day per arm that is a ten-day test, and at a hundred a day it is a hundred-day test that should never be started.

Four inputs decide it, and three of them are choices you make.

  1. **Baseline rate.** What you convert at now. 4 percent here. This one is a measurement, not a choice.
  2. **Minimum detectable effect.** The smallest improvement worth shipping. A fifth of 4 percent is 0.8 percentage points, so the target rate is 4.8 percent.
  3. **Significance level.** How often you will accept a false alarm. Conventionally 5 percent.
  4. **Power.** How often you want to catch a real effect of that size. Conventionally 80 percent, which means one real effect in five goes undetected.

    
    
    from scipy import stats
    import numpy as np
    
    def per_arm(p0, p1, alpha=0.05, power=0.80):
        za, zb = stats.norm.ppf(1 - alpha/2), stats.norm.ppf(power)
        pbar = (p0 + p1) / 2
        num = (za * np.sqrt(2 * pbar * (1 - pbar)) +
               zb * np.sqrt(p0 * (1 - p0) + p1 * (1 - p1))) ** 2
        return np.ceil(num / (p1 - p0) ** 2)
    
    per_arm(0.04, 0.048)      # 10317.0

Here is the table worth pinning somewhere. Visitors needed per arm, at 5 percent significance and 80 percent power.

| Baseline rate | +5% relative | +10% relative | +20% relative | +50% relative |
|---------------|--------------|---------------|---------------|---------------|
| 2%            | 315,206      | 80,682        | 21,109        | 3,826         |
| 4%            | 154,304      | 39,475        | 10,317        | 1,863         |
| 10%           | 57,763       | 14,751        | 3,841         | 686           |
| 30%           | 14,856       | 3,763         | 963           | 163           |

Two patterns are worth reading off it. Smaller effects are dramatically more expensive: halving the effect you want to detect roughly quadruples the traffic you need, which is the same square root relationship as the [margin of error](https://michaelnocito.github.io/analyst-prep-kit/guides/confidence-intervals/). And low baseline rates cost more than high ones, which is why checkout-page tests finish and homepage-signup tests do not.

Now picture your own site's traffic on the page you most want to test. Take your monthly visitors, halve it, and find the nearest cell in that table. What is the smallest improvement you could actually detect in a month?

## 5. What your test can and cannot detect

Before the number: our finished test had 4,000 per arm, and the table says a 20 percent lift needs 10,317. Predict what that mismatch means for the result we already read.

It means the test was underpowered. With 4,000 per arm, the chance of detecting a true 20 percent lift was **41 percent**. If that improvement were genuinely there, this test would have missed it more often than found it.

That does not make our p = 0.031 wrong, and it does change how to read it. An underpowered test that comes back significant has, by construction, observed an effect larger than the truth, because only large observed effects clear the bar at that sample size. Ours observed 25 percent. The true effect, if any, is probably smaller, and the interval already told us so by stretching down to 2 percent.

The name for this is the **winner's curse** , and it is why organizations that run many small tests see their measured wins fail to show up in the quarterly numbers. Each test was analysed correctly. The set of tests that got shipped was selected for having overshot.

The fix is the discipline in section four, and there is no clever analysis that substitutes for it. Decide the sample size, run to it, then look. If the traffic is not there, test something with a bigger expected effect, or test on a page with more traffic, or accept that this particular question is not answerable by experiment at your scale.

## 6. Peeking, and the 24 percent

Before the simulation: you set the test to run for 10 days and you check it every day. Say why that is different from checking once at the end, before reading on.

Checking once means running one test. Checking twenty times and stopping the first time it looks good means running twenty tests and keeping whichever one crossed the line. The p-value threshold was designed for the first situation.

Here is what that costs, measured rather than asserted. I simulated 2,000 tests where both versions convert at exactly 4 percent, so any winner is a false alarm. Each test ran to 4,000 visitors per arm, checked every 200 visitors, twenty checks in total.

| How the test was read                                         | Share declaring a winner |
|---------------------------------------------------------------|--------------------------|
| Checked once, at the planned end                              | 5.2%                     |
| Checked twenty times, stopped at the first significant result | 24.3%                    |

Five percent is exactly what the 0.05 threshold promises. Twenty-four percent is what you get instead when you watch. Nearly one test in four declares a winner that does not exist, and every one of those results will look completely ordinary in the write-up.

The chart at the top of this page is one of those runs. Both versions convert at exactly 4 percent. The p-value dipped under 0.05 at checks eight, nine and ten, bottoming out at 0.022, then climbed back and finished at 0.375. Three consecutive days of "significant" in a test where the two versions are identical.

Three ways to handle it, in order of how much I like them.

**Fix the sample size and do not look.** Free, correct, and the reason section four exists. Look at data quality during the run if you must look at something.

**Use a method built for continuous monitoring.** Sequential testing and always-valid intervals exist precisely so that watching is legitimate. They cost some power in exchange, and several testing platforms implement them.

**Peek but only act at the planned end.** Workable if the organization can tolerate seeing a number without acting on it. In my experience it cannot, which is why the first option is the one I actually recommend.

## 7. The failures that are not statistics

Before the list: the arithmetic on this page is all correct and the test can still be worthless. Name one way, before reading mine.

**The split is not even.** You expected 50/50 and got 4,000 against 3,780. That is a sample ratio mismatch, and it means the randomization or the logging is broken. It invalidates the test, because whatever caused the imbalance may also have caused the difference you are measuring. Check it before you look at the metric, every time, and treat a mismatch as a bug rather than a rounding issue.

**Novelty and primacy.** Regular users react to a change because it is a change. A new design can win in week one because it is unfamiliar and lose in week four when it stops being new. Run for whole weeks, and if you can, check whether the effect is different for new and returning visitors.

**Slicing until something is significant.** Twenty segments at 5 percent gives a 64 percent chance one of them fires by accident. Reporting "no overall effect but a strong win for mobile users in Canada" is the multiple comparison problem in its natural habitat, covered in [the p-values guide](https://michaelnocito.github.io/analyst-prep-kit/guides/p-values/). Decide segments in advance or treat them as ideas for the next test.

**Testing the wrong metric.** Click-through on a button is easy to move and easy to move at the expense of what happens next. If your metric is not the thing you actually want, you will optimize your way somewhere you did not intend, which is why the metric goes in writing before the test starts and why [defining metrics](https://michaelnocito.github.io/analyst-prep-kit/guides/defining-metrics/) is worth reading first.

**Contamination between arms.** If one user can see both versions, on two devices or via a shared account, the difference between the arms shrinks toward nothing and the test understates whatever is there.

## The full before and after

Same test, same data, two write-ups.

### Before
    
    
    New checkout button: conversions up 25%, statistically significant (p = 0.03).
    Recommend shipping.

Every word is true and the reader cannot judge any of it. No rates, no visitor counts, no interval, no statement of what the test was powered to detect, and a percentage that is relative without saying so. It reads as a much stronger result than the data supports.

### After
    
    
    Checkout button test, 4,000 visitors per arm, run 15 to 25 July.
      Control  4.00%  (160 / 4,000)
      Variant  5.00%  (200 / 4,000)
      Absolute lift  +1.0 percentage point
      Relative lift  +25%
      95% interval on the lift  +0.09 to +1.91 percentage points
      z = 2.16, p = 0.031
      Sample ratio  50.0 / 50.0, as planned
      Powered to detect  a 33% relative lift at 80% power; this test was
                         underpowered for the 20% target set beforehand.
    Recommend shipping, with the caveat that the true gain is more likely
    near the bottom of that interval than the top.

Same recommendation, and now it can be argued with. The reader can see the counts, the two ways of stating the lift, how uncertain it is, that the split was clean, and that the test was smaller than planned. The last line is the one that saves the quarterly reconciliation, because it sets the expectation before the money is counted.

## Edge cases that catch people out

Six that each cost somebody a quarter.

**Running until it works.** Extending a test that has not reached significance is the same error as peeking, in slow motion. Extend only if you decide the new sample size in advance and for a stated reason.

**Testing three variants and comparing them all.** Three arms give three pairwise comparisons and the false alarm rate rises accordingly. Compare each variant with the control only, and adjust the threshold for the number of variants.

**Conversion rate on the wrong denominator.** Conversions divided by sessions, visitors, or users are three different metrics that move differently. Pick one, write it down, and make sure both arms use the same one.

**Weekday and weekend traffic.** A test run Monday to Friday is a test on weekday visitors. Run whole weeks so both arms see the same mix, which they will automatically, but so that the result generalizes.

**Very low conversion counts.** Rates built on fewer than about 30 conversions per arm are unstable no matter how many visitors you had, and the normal approximation behind the z-test starts to strain. Check the conversion counts, not just the visitor counts.

**Shipping on a metric that did not move.** If the primary metric came back flat and a secondary one moved, that is a hypothesis for the next test, not a result. Write it down as such and it stays useful.

## Why this works

Randomized assignment is what licenses a causal claim, and the practical machinery around it, including power calculations, sample ratio checks and the treatment of novelty effects, was worked out in industry and published. Kohavi and colleagues' survey remains the clearest single account of running controlled experiments on the web, including the failure modes in section seven that no amount of correct arithmetic prevents (Kohavi, Longbotham, Sommerfield, & Henne, 2009, _Data Mining and Knowledge Discovery_ , 18(1), 140–181). Their later paper at scale documents the same problems recurring across thousands of experiments, which is the best evidence available that these are structural rather than the mistakes of any one team (Kohavi, Deng, Frasca, Walker, Xu, & Pohlmann, 2013, _Proceedings of KDD '13_ , 1168–1176).

The peeking result in section six is not a quirk of my simulation. Johari and colleagues analysed exactly this behaviour on commercial testing platforms, showed the inflation in false positives it produces, and developed always-valid inference procedures that make continuous monitoring legitimate rather than merely tempting (Johari, Koomen, Pekelis, & Walsh, 2017, _Proceedings of KDD '17_ , 1517–1525). My 24.3 percent against a nominal 5 percent is the same effect reproduced on a small scale.

And the underlying point about what a p-value can carry on its own is the American Statistical Association's, which states plainly that a p-value does not measure the size of an effect and should not by itself decide anything (Wasserstein & Lazar, 2016, _The American Statistician_ , 70(2), 129–133). That is the argument for the interval in section three going above the p-value in any write-up.

One note on why this page kept asking you to answer before showing the answer. Attempting an answer before seeing the correct one reliably improves how well the correct one is retained, even when the attempt is wrong (Bisra, Liu, Nesbit, Salimi, & Winne, 2018, _Educational Psychology Review_ , 30(3), 703–725). The 10,317 figure sticks because you guessed at it first, and almost certainly guessed low.

## Using this on your own work

Rebuilding your organization's whole testing practice is not something you can do this afternoon. Do this instead, in order.

  1. **Write the three numbers before the next test:** current rate, smallest worthwhile improvement, required sample per arm. One line, before anything is built.
  2. **Compare that sample to your traffic.** If the test would take more than about a month, change what you are testing rather than starting it.
  3. **Name the metric and the end date in writing** , before the first visitor is split. This is the whole defence against both peeking and slicing.
  4. **Check the sample ratio first** when the test ends, before you look at the result. A broken split ends the analysis there.
  5. **Report rates, both lifts, the interval and the counts.** The p-value goes last, and it is the least informative number in the block.

If you have paper nearby, one optional drawing is worth five minutes. Draw the shape of the peeking chart from memory: a wandering line, a threshold, one dip below it, a recovery. Marking where you would have stopped is the fastest way to make the sample-size discipline feel like protection rather than paperwork.

**More detail on this, and more like it.** Every how-to sits in one place on the [guides index](https://michaelnocito.github.io/analyst-prep-kit/guides/): SQL, Python, Excel, statistics and the working habits around them.

## The whole thing on one screen

This is the retrieval sheet. Cover the right column, work down the left, and say each answer out loud before you check it.

| Idea                  | What it means                                                                    |
|-----------------------|----------------------------------------------------------------------------------|
| Why randomize         | It distributes every other cause evenly, which is what licenses a causal claim.  |
| Two-proportion z-test | Gap ÷ pooled standard error. Ours: 0.01 ÷ 0.004635 = 2.157, p = 0.031.           |
| Absolute lift         | +1.0 percentage point. Use it for forecasting.                                   |
| Relative lift         | +25%. Use it for comparing tests. Never say "percent" when you mean points.      |
| Interval on the lift  | +0.09 to +1.91 points. The number the decision actually needs.                   |
| Sample size inputs    | Baseline rate, minimum detectable effect, significance, power.                   |
| 4% baseline, +20%     | 10,317 visitors per arm. Halving the target effect roughly quadruples that.      |
| Power                 | Chance of catching a real effect. 80% is conventional. Ours had 41%.             |
| Winner's curse        | An underpowered test that wins has overstated the effect, by construction.       |
| Peeking               | Twenty checks turned a 5.2% false alarm rate into 24.3%. Measured, not asserted. |
| Sample ratio mismatch | Split not 50/50 means the test is broken. Check it before the metric.            |
| Novelty effect        | Change wins because it is new. Run whole weeks; split new from returning.        |
| Segment slicing       | Twenty segments gives a 64% chance one fires by accident.                        |
| Contamination         | One user seeing both arms shrinks the measured difference toward zero.           |
| Conversion counts     | Under about 30 conversions per arm, the rate is unstable regardless of visitors. |
| The order to report   | Rates, counts, both lifts, interval, ratio check, then the p-value.              |

**The one habit to keep.** Write the required sample size down before the test starts, and do not read the result before you reach it. That single rule prevents peeking, prevents running until it works, and tells you in advance which questions your traffic cannot answer. If a test breaks in a way this page does not cover, there is a general [diagnosis loop for being stuck](https://michaelnocito.github.io/analyst-prep-kit/guides/technical-tenacity/).

One last thought, and I would genuinely like other people's answers. The first test I ever called was stopped on day three because the line looked good, and the effect was gone by the following month. What is the winner in your history that you would now want to re-run to the planned end?

## References

  * Kohavi, R., Longbotham, R., Sommerfield, D., & Henne, R. M. (2009). Controlled experiments on the web: Survey and practical guide. _Data Mining and Knowledge Discovery_ , 18(1), 140–181.
  * Kohavi, R., Deng, A., Frasca, B., Walker, T., Xu, Y., & Pohlmann, N. (2013). Online controlled experiments at large scale. _Proceedings of the 19th ACM SIGKDD International Conference on Knowledge Discovery and Data Mining_ , 1168–1176.
  * Johari, R., Koomen, P., Pekelis, L., & Walsh, D. (2017). Peeking at A/B tests: Why it matters, and what to do about it. _Proceedings of the 23rd ACM SIGKDD International Conference on Knowledge Discovery and Data Mining_ , 1517–1525.
  * Wasserstein, R. L., & Lazar, N. A. (2016). The ASA statement on p-values: Context, process, and purpose. _The American Statistician_ , 70(2), 129–133.
  * Bisra, K., Liu, Q., Nesbit, J. C., Salimi, F., & Winne, P. H. (2018). Inducing self-explanation: A meta-analysis. _Educational Psychology Review_ , 30(3), 703–725.

---

*Originally published on Analyst Prep Kit: [A/B Testing for Analysts: Sample Size First, Result Second](https://michaelnocito.github.io/analyst-prep-kit/guides/ab-testing-for-analysts/)*

*Visit the site for more beginner data analysis guides and free resources: [the full guide archive](https://michaelnocito.github.io/analyst-prep-kit/guides/) covers SQL, Excel, Power BI, Tableau, Python and statistics, and the [practice kits](https://michaelnocito.github.io/analyst-prep-kit/) run in your browser with nothing to install.*

*If it was useful: [Buy Me a Coffee](https://buymeacoffee.com/michaelnocito).*
