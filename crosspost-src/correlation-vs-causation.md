By the end of this page you will have one habit: every time two things move together, you say the three candidate explanations out loud before acting. X causes Y. Y causes X. A third thing drives both. You will also know the quiet fourth, coincidence in a small sample, and one cheap test that separates the explanations without running an experiment. It is about twenty minutes.

Here is what to actually do with it today. Take the last chart you saw where two lines moved together, and say the three explanations for it, in order, in one breath each. If any of them survives out loud, the finding is not ready to ship as a cause.

The short version: a correlation is one fact with four possible stories behind it. Only one of those stories is "X causes Y", and the correlation itself cannot tell you which story is true.

One picture carries the whole idea, so it comes first. The same observed link between X and Y, and the four stories that could each have produced it.

**Every number on this page is computed.** The worked example is a 12-row table you can see in full, and every correlation on the page was produced by running the shown code on that table. If reading data with pandas is new, [SQL and Python for analysts](https://michaelnocito.github.io/analyst-prep-kit/guides/sql-and-python/) covers the setup and comes back here in ten minutes.

## 1. The three explanations, and the quiet fourth

Before the explanation: a dashboard shows that customers who open your emails spend more. Marketing wants to double the email volume. What are the other ways that pattern could have happened, without email causing anything?

A correlation means two things move together. When X is high, Y tends to be high, or tends to be low. That is the whole fact. The question that matters is why, and there are exactly four candidate stories.

  * **X causes Y.** Opening emails makes people spend more. This is the story everyone wants.
  * **Y causes X.** People who already spend a lot are more interested, so they open more emails. Same data, arrow reversed, completely different action.
  * **A third thing drives both.** Loyal customers both open emails and spend. Loyalty is the engine, and email opening is just along for the ride. The third thing has a name: a **confounder** , which in everyday words is the hidden common cause that makes two innocent things look connected.
  * **Coincidence.** In a small sample, unrelated things line up by luck alone. This one is quiet because nobody proposes it in a meeting, and it is the most common story of all when the sample is small. Section 7 puts a number on it.

The habit this page is selling costs about ten seconds. Before acting on any pattern, say all four stories out loud, in order, and notice which ones you cannot rule out. Most patterns die at story three, and the ones that survive all four are the ones worth an experiment.

**Why out loud?** Because in your head, the story you want wins by default. Spoken, "or maybe big spenders just open more email" is hard to unhear.

## 2. The worked example: a real correlation you can compute

Before the explanation: ice cream sales and drownings rise and fall together, month by month, in almost every summary of this classic. Nobody believes ice cream drowns people. So what is the third thing?

Here is a full year for one lake town. Twelve rows, three columns: average temperature, ice cream sales in thousands of dollars, and drownings.

| Month | Avg temp (°F) | Ice cream sales ($k) | Drownings |
|-------|---------------|----------------------|-----------|
| Jan   | 36            | 8                    | 1         |
| Feb   | 38            | 9                    | 0         |
| Mar   | 46            | 14                   | 0         |
| Apr   | 55            | 19                   | 1         |
| May   | 65            | 27                   | 4         |
| Jun   | 74            | 35                   | 3         |
| Jul   | 81            | 42                   | 5         |
| Aug   | 79            | 40                   | 4         |
| Sep   | 70            | 30                   | 5         |
| Oct   | 58            | 21                   | 0         |
| Nov   | 47            | 14                   | 1         |
| Dec   | 39            | 10                   | 0         |

Read the sales column and the drownings column together. July: highest sales, most drownings. January and December: lowest sales, almost none. The two columns clearly move together, and the correlation between them computes to **0.86**. Here is the code that produces every correlation on this page, so you can rerun it yourself.
    
    
    import pandas as pd
    
    df = pd.DataFrame({
        "month": ["Jan","Feb","Mar","Apr","May","Jun",
                  "Jul","Aug","Sep","Oct","Nov","Dec"],
        "avg_temp_f":  [36,38,46,55,65,74,81,79,70,58,47,39],
        "ice_cream_k": [8,9,14,19,27,35,42,40,30,21,14,10],
        "drownings":   [1,0,0,1,4,3,5,4,5,0,1,0],
    })
    
    print(df[["avg_temp_f","ice_cream_k","drownings"]].corr().round(2))
    
    
                 avg_temp_f  ice_cream_k  drownings
    avg_temp_f         1.00         0.99       0.86
    ice_cream_k        0.99         1.00       0.86
    drownings          0.86         0.86       1.00

Now read the whole grid, not just the one cell. Ice cream and drownings sit at 0.86. But temperature correlates with ice cream at **0.99** and with drownings at **0.86**. The third thing did not need hunting. It is right there in the output, correlated with both suspects more strongly than they need to be correlated with each other. Heat sends people to the ice cream stand and heat sends people into the lake, and the two crowds never have to meet.

Picture running that three-column grid on your own data: your metric, the thing it moves with, and the one variable you quietly suspect is behind both. The confounder usually announces itself in exactly this way, as the row with the biggest numbers in it.

## 3. What a correlation coefficient actually measures

Before the explanation: the number 0.86 came out of the machine. What is it a measurement of, and what would 1.0, 0, and negative 0.86 each look like?

The correlation coefficient, written **r** , measures linear co-movement: how tightly two columns track a straight line together. It runs from −1 to 1. At 1, knowing one value tells you the other exactly, and both rise together. At −1, the same, but one falls as the other rises. At 0, knowing one tells you nothing linear about the other. Our 0.86 means the monthly pairs sit close to a rising line, with some scatter.

Three limits on what r says, each of which matters in real work.

  * **It is direction-blind.** r(sales, drownings) and r(drownings, sales) are the same number. The statistic has no idea which column you think is the cause. Any arrow you see in it, you drew yourself.
  * **It only sees straight lines.** A perfect U-shaped relationship, where Y is high at both extremes of X, can produce an r near zero. A near-zero r means "no linear pattern", not "no pattern". This is one reason to plot the points before trusting the number.
  * **It says nothing about size.** An r of 0.9 can describe an effect too small to matter, because r measures tightness of tracking, not steepness. A tight pattern of tiny changes still scores high.

The word for a variable's r with a business outcome is often spoken as if it were a strength-of-cause score. It is a tightness-of-tracking score, computed with no knowledge of cause at all. Keeping those two ideas separate is most of this page.

## 4. The cheap test: hold the third thing still

Before the explanation: if temperature really is the engine behind both columns, what should happen to the ice cream and drownings correlation among months that all have roughly the same temperature?

It should shrink toward zero. If heat is doing all the driving, then among equally hot months there is no driver left, and sales and drownings should wander independently. That prediction is testable on the data you already have, and this is the cheapest causal check an analyst owns: **segment by the suspected confounder and see whether the pattern survives**.
    
    
    warm = df[df.avg_temp_f >= 65]   # May through Sep, 5 months
    cool = df[df.avg_temp_f < 65]    # the other 7 months
    
    print(round(warm.ice_cream_k.corr(warm.drownings), 2))
    print(round(cool.ice_cream_k.corr(cool.drownings), 2))
    
    
    0.1
    0.02

The correlation was 0.86 across the whole year. Inside the warm months it is **0.10**. Inside the cool months it is **0.02**. Once temperature is held roughly still, the relationship between ice cream and drownings is gone. The pattern did not survive the split, which is exactly what "a third thing drives both" predicts and what "X causes Y" does not.

Say in your own words why the correlation vanishing inside each band clears ice cream, before reading on. If you can say it, you own the method.

Here is the version I would say. The yearly correlation was built out of one contrast: warm months have high sales and high drownings, cool months have low sales and low drownings. Warm months average 4.2 drownings against 0.43 in cool months. Remove that contrast by comparing only like with like, and there is nothing left, so the contrast, meaning temperature, was the whole relationship.

**What survival would have meant.** If the within-band correlations had stayed near 0.86, temperature would be cleared instead, and the causal stories would still be live. Segmenting cannot prove cause. It can only eliminate a named suspect, one suspect per split. That is still a bargain, because it runs in one line on data you already have.

## 5. Reverse causation, and why timing settles it

Before the explanation: story two was "Y causes X". What is the one thing a cause must always do that its effect cannot?

Come first. An effect cannot happen before its cause. So the standard check on reverse causation is timing: line the two series up in time and ask which one moves first.

Take the email example from section 1. If opening emails causes spending, the open should come before the purchase, and this month's opens should predict next month's spending better than the reverse. If the data shows spending rising before open rates rise, the arrow you wanted is dead on arrival. In practice this means computing the correlation at a lag: shift one column by a month and recompute. It is the same `corr()` call on a shifted column, so it costs nothing.

Two honest cautions. First, timing can eliminate an arrow but cannot confirm one, because a confounder can also move both series in sequence. Cold snaps end, then ice cream recovers, then swimming recovers. Second, some pairs feed each other in both directions, like practice and confidence, and a lagged correlation will show both arrows at once. When that happens, write down both, because that is the true shape.

## 6. The full before and after

Same data, same finding, written up twice. The difference is what a reader is licensed to do after reading it.

### Before
    
    
    Ice cream sales are strongly correlated with drownings
    (r = 0.86). Reducing summer ice cream promotions should
    be considered as a drowning-prevention measure.

Every word before the parenthesis is defensible, and the sentence after it is fiction. The number is real. The leap from "correlated" to "reducing X will change Y" is the entire mistake, and nothing in the data supports it.

### After
    
    
    Monthly ice cream sales are associated with drownings
    (r = 0.86, n = 12 months).
    
    Checked: temperature is a confounder. It correlates with
    both series (0.99 with sales, 0.86 with drownings), and
    within temperature bands the association disappears
    (r = 0.10 warm months, r = 0.02 cool months).
    
    Read: both rise in hot months because heat drives both.
    No causal claim. If prevention budget depends on this,
    the variable to act on is warm-month lake supervision,
    not sales.

Three habits are visible in the after version. It says **"associated with"** , which claims co-movement and nothing more. It names the confounder it checked and shows the check, which is what makes the write-up trustworthy rather than merely cautious. And it states the sample size, so the reader can weigh the coincidence story for themselves. Naming what you checked and what you could not check is the same discipline as [documenting data limitations](https://michaelnocito.github.io/analyst-prep-kit/guides/documenting-data-limitations/), applied to one sentence.

## 7. Edge cases that make correlations lie

Before the explanation: with only 12 rows, how often would two completely unrelated columns show a correlation as strong as 0.5, just by luck?

More often than feels possible. I generated 1,000 pairs of random 12-value columns, pure noise with no relationship at all, and counted: **106 of the 1,000 pairs** hit an r of 0.5 or stronger, and 10 of them hit 0.7 or stronger. Roughly one random pair in ten looks moderately correlated at this sample size. That is the coincidence story with a number on it, and it is why an exciting correlation in a 12-row summary deserves suspicion before celebration.
    
    
    import random
    random.seed(11)
    hits = 0
    for _ in range(1000):
        x = pd.Series(random.random() for _ in range(12))
        y = pd.Series(random.random() for _ in range(12))
        if abs(x.corr(y)) >= 0.5:
            hits += 1
    print(hits)   # 106

Four more ways a real correlation misleads, each named.

**Both series just trend.** Anything that grows over time correlates with anything else that grows over time: revenue, headcount, and the number of guides on this site would all inter-correlate beautifully. A correlation between two trending series is mostly a correlation with the calendar. Compare month-to-month changes instead of levels before believing it.

**The pattern flips when you split it.** A relationship can point one way in every subgroup and the opposite way overall, because group sizes differ. This is Simpson's paradox, and it is the same segmenting move from section 4 delivering a nastier surprise: the aggregate answer and every subgroup answer can genuinely disagree. It is why segmenting by the variables you know matter is not optional.

**You only kept the survivors.** Correlations computed on a filtered group, like top customers or games with many reviews, can be created or destroyed by the filter itself. If both variables helped a row pass the filter, the survivors will show a link the full population does not have.

**One outlier is holding the whole number up.** With few rows, a single extreme pair can manufacture a strong r on its own. Plot the points once before quoting the number. If the story collapses when one dot is covered with your thumb, it was never a story. Plotting before computing is the core move of [exploratory data analysis](https://michaelnocito.github.io/analyst-prep-kit/guides/exploratory-data-analysis/).

## Why this works

The segmenting test in section 4 is the working analyst's version of a very old result. Simpson showed formally that the association between two variables can change size, vanish, or reverse when a third variable is brought into the table, and that the aggregate table alone cannot tell you which reading is right (Simpson, 1951, _Journal of the Royal Statistical Society, Series B_ , 13(2), 238–241). The practical consequence is the habit this page teaches: no association is safe to interpret until the candidate third variables have been held still and the pattern re-checked.

The coincidence story is also not a vague worry. Small samples produce extreme statistics as a matter of arithmetic, because estimates computed on few values swing widely, and any process that surfaces the strongest patterns, like a dashboard sorted by correlation, will surface the small-sample flukes first (Gelman & Price, 1999, _Statistics in Medicine_ , 18(23), 3221–3234). The 106-in-1,000 simulation above is that effect made visible at n = 12.

And the reason this page keeps asking you to answer before it explains: being prompted to generate an explanation yourself, before receiving one, reliably improves understanding and retention of that material, across a large body of controlled studies (Bisra, Liu, Nesbit, Salimi, & Winne, 2018, _Educational Psychology Review_ , 30(3), 703–725). Guessing the third thing before the correlation grid showed it is why temperature will come to mind the next time two of your own columns move together.

## Using this on your own project

Think of one claim in a report you have shipped that quietly leans on "X drives Y". Auditing every such claim at once is miserable and you will not finish it. Do this instead, in order.

  1. **Say the four stories out loud** for that one claim: X causes Y, Y causes X, a third thing drives both, coincidence. Ten seconds. Note which ones you cannot rule out.
  2. **Run the three-column correlation grid** : X, Y, and your best confounder candidate. If the candidate correlates strongly with both, it is promoted to prime suspect.
  3. **Segment by the suspect** and recompute the X and Y correlation inside each band. Vanished: the suspect owns the pattern. Survived: the suspect is cleared, and the causal stories are still live.
  4. **Check timing** if reverse causation is plausible: shift one series and see which direction predicts better.
  5. **Rewrite the sentence** as "associated with", name the confounders you checked, state n. If the claim still needs a causal verb after all that, the honest next step is an experiment: split subjects randomly, change X for one group only, and compare. Randomizing is the only move that silences all confounders at once, known and unknown, and it is exactly what an A/B test is. The [Stats Kit](https://michaelnocito.github.io/analyst-prep-kit/stats/) has a lesson on running one properly.

If you have paper nearby, one optional drawing is worth five minutes. Draw the four panels from the figure yourself, from memory: X to Y, Y to X, Z down to both, and the dots of chance. Then write your own X, Y, and Z from a live project on the third panel. Redrawing it is a retrieval attempt, and filling in your own variables is the transfer step.

**More detail on this, and more like it.** Every how-to sits in one place on the [guides index](https://michaelnocito.github.io/analyst-prep-kit/guides/): SQL, statistics, charts, data migration, and the working habits around them.

## The whole thing on one screen

This is the retrieval sheet. Cover the right column, work down the left, and say each answer out loud before you check it.

| Concept                 | What it means                                                                             |
|-------------------------|-------------------------------------------------------------------------------------------|
| Correlation             | Two things move together. One fact, four possible stories.                                |
| The four stories        | X causes Y. Y causes X. A third thing drives both. Coincidence.                           |
| Confounder              | A hidden common cause that makes two innocent things look connected.                      |
| r                       | Linear co-movement, −1 to 1. Tightness of tracking, not strength of cause.                |
| What r cannot see       | Direction, curves, and the size of the effect.                                            |
| Finding the confounder  | Correlation grid with the candidate: it should correlate with both.                       |
| The cheap test          | Segment by the suspect. Pattern vanishes: suspect owns it. Survives: suspect cleared.     |
| What segmenting proves  | Eliminates one named suspect per split. Never proves cause.                               |
| Reverse causation check | Timing. The cause has to move first. Recompute r at a lag.                                |
| Coincidence at n = 12   | About 1 in 10 random pairs shows                                                          |r | ≥ 0.5. State n in every write-up. |
| Trending series         | Everything that grows correlates with everything that grows. Compare changes, not levels. |
| Simpson's paradox       | Subgroups and the total can genuinely disagree. Segment before interpreting.              |
| What settles it         | An experiment. Random assignment silences known and unknown confounders at once.          |
| The reporting habit     | "Associated with", name the confounders you checked, state n.                             |

**The one habit to keep.** If you take nothing else from this page, say the four stories out loud before acting on any pattern: X causes Y, Y causes X, a third thing drives both, chance. It costs ten seconds, and the expensive mistakes in analysis are almost never in the arithmetic. They are in the arrow.

One last thought, and I would genuinely like other people's answers. My temperature column confessed the moment I printed the full correlation grid instead of the one cell I was asked about. What is a correlation your team currently treats as a cause, and which of the four stories has nobody said out loud yet?

## References

  * Simpson, E. H. (1951). The interpretation of interaction in contingency tables. _Journal of the Royal Statistical Society, Series B_ , 13(2), 238–241.
  * Gelman, A., & Price, P. N. (1999). All maps of parameter estimates are misleading. _Statistics in Medicine_ , 18(23), 3221–3234.
  * Bisra, K., Liu, Q., Nesbit, J. C., Salimi, F., & Winne, P. H. (2018). Inducing self-explanation: A meta-analysis. _Educational Psychology Review_ , 30(3), 703–725.

---

*The full version of this guide lives on my site: [Correlation vs Causation: The Three Explanations for Any Pattern](https://michaelnocito.github.io/analyst-prep-kit/guides/correlation-vs-causation/).*

*If it was useful: [Buy Me a Coffee](https://buymeacoffee.com/michaelnocito).*
