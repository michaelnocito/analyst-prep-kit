Every real analysis runs into the same quiet decision, over and over: **where do you draw the line?** How many reviews before a rating is trustworthy? How many purchases before a customer counts as "active"? How many chart appearances before an artist counts as "known"? These cutoffs shape every result downstream — and the difference between an amateur and a professional is not which number they pick. It's whether they can _defend_ it. This guide covers the method, the classic statistical trap that makes floors mandatory, and worked examples from open projects.

## The two ways to pick a number

Method one: it feels right. "Let's say 100 reviews minimum." Round number, sounds reasonable, took four seconds. Method two: ask the data. Measure how the values actually distribute, count what each candidate cutoff keeps and discards, then choose the one whose meaning, said out loud, matches what you're trying to capture. Method one survives until the first person asks "why 100?" Method two _is_ the answer to that question.

**The test of a good threshold:** you can say it out loud with a reason attached, and the reason references the data. "5+ charted songs, because the measured distribution shows 57% of artists chart exactly once — 5+ means the industry demonstrably came back to this artist across a career." Not "5 felt right."

## The method: measure, price, defend, record

| Step        | What you do                                                                                                                                                                                                                                                                  | The query shape                                                                              |
|-------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|----------------------------------------------------------------------------------------------|
| 1. Measure | Map the distribution before proposing anything: how many entities sit at each value?                                                                                                                                                                                         | GROUP BY the count — a "distribution of a count," built with a GROUP BY on top of a GROUP BY |
| 2. Price   | For each plausible cutoff, count the survivors. A threshold is a decision about how much data to keep; see the bill first.                                                                                                                                                   | One query, several `SUM(value >= candidate)` columns side by side                            |
| 3. Defend  | Choose the cutoff whose everyday meaning matches the concept you're defining. That concept needs a written definition of its own first: [how to turn a fuzzy question into something measurable](https://michaelnocito.github.io/analyst-prep-kit/guides/defining-metrics/). | No query — a sentence you could say to a skeptical stakeholder                               |
| 4. Record  | Keep the rejected candidates' numbers in the file so a reader can disagree intelligently. This is the same habit as [writing down what the data cannot tell you](https://michaelnocito.github.io/analyst-prep-kit/guides/documenting-data-limitations/).                     | A comment block above the query that uses the chosen number                                  |

## A worked example with real numbers

A project analyzing 68 years of Billboard chart history needed to define a "known artist" — someone radio demonstrably knows, as opposed to a one-time visitor. Watch the method run:

**Measure.** Grouping artists by how many songs each charted revealed the distribution's shape: **57% of all charting artists charted exactly one song.** The chart is mostly brief visitors, so "known" clearly sits above 1 — but where?

**Price.** One query put three candidate cutoffs side by side: artists with 3+ charted songs — 2,596 survive; with 5+ — 1,570; with 10+ — 740.

**Defend.** The pick was 5+. That is strict enough to mean the industry returned to this artist repeatedly across a career (3+ can be one lucky album). It is wide enough to leave a meaningful population to analyze (10+ narrows to chart fixtures). There was even an operational reason: the next phase called a web API once per known artist, so the survivor count was also the size of a data pull.

**Record.** All three candidates' numbers stayed in the project's SQL file, in the comment block above the query that builds the roster. Anyone who thinks 10+ was the better call can see exactly what that choice would have cost.

The same pattern runs through the [Steam Hidden Gems](https://github.com/michaelnocito/steam-hidden-gems) and [Streaming Hidden Gems](https://github.com/michaelnocito/streaming-hidden-gems) projects. Each derives its "enough reviews / enough votes" floor from the measured distribution. The rejected alternatives are documented in the README.

## The small-sample trap (the most dangerous equation)

One family of thresholds isn't optional at all: **minimum-denominator floors under any ratio or average.** Here's why. Rank songs by average plays per listener and the top of the list won't be the most beloved songs. It will be tracks with 40 listeners who happen to replay obsessively. Rank schools by test scores and the top performers will be tiny schools. So will the bottom performers. This is not bad luck; it's arithmetic: **the smaller the sample, the wilder its averages swing**. Variability shrinks only with the square root of sample size, a result Abraham de Moivre proved in 1730. Statistician Howard Wainer called it "the most dangerous equation", because ignoring it keeps producing expensive real-world mistakes. His lead example is a foundation that spent billions promoting small schools. It had noticed they dominated the top of performance rankings, without noticing they dominated the _bottom_ too (Wainer, 2007).

The consequence for analysts is blunt: **every ranking built on a ratio or average needs a minimum-denominator floor, chosen from the measured distribution of denominators.** A ratio over 40 people is an anecdote; the same ratio over 100,000 people is a finding. Getting that denominator right is its own small trap: [what COUNT actually counts](https://michaelnocito.github.io/analyst-prep-kit/guides/sql-count-function/). No cleverness in the numerator can rescue a starving denominator.

## Why your gut can't be trusted with this

You might hope intuition could stand in for measurement. The research says the opposite: people — including trained scientists — systematically expect small samples to behave like big ones. Tversky and Kahneman documented the bias in 1971. Even professional researchers made confident judgments from sample sizes that couldn't support them. They named the bias "belief in the law of small numbers" (Tversky & Kahneman, 1971). Your intuition genuinely cannot feel the difference between a ratio resting on 40 people and one resting on 40,000. The fix isn't better intuition; it's the four-step method above, which replaces feel with counting at every point where feel would fail.

## References

  1. Wainer, H. (2007). The most dangerous equation. _American Scientist, 95_(3), 249–256.
  2. Tversky, A., & Kahneman, D. (1971). Belief in the law of small numbers. _Psychological Bulletin, 76_(2), 105–110. doi:10.1037/h0031322
  3. Tukey, J. W. (1977). _Exploratory Data Analysis._ Addison-Wesley. (The look-first tradition the Measure step belongs to.)

---

*The full version of this guide lives on my site: [Data-Driven Thresholds: Picking Cutoffs You Can Defend](https://michaelnocito.github.io/analyst-prep-kit/guides/data-driven-thresholds/).*

*If it was useful: [Buy Me a Coffee](https://buymeacoffee.com/michaelnocito).*
