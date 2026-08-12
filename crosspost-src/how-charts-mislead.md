By the end of this page you can spot the eight distortions that do most of the damage in business reporting, put a number on how much each one exaggerates, and check your own charts for them in under a minute. East out-sells West by 1.8 times in our data. Start the bar chart's axis at 1,600 instead of zero and the same two bars claim 16.9 times.

Here is what to actually do today. Open the last chart you made and look at three things in this order: where the value axis starts, what time range it covers, and whether anything is drawn as an area rather than a length. Those three account for most misleading charts, including the accidental ones, and checking them takes about thirty seconds.

The short version: a chart is an argument made out of shapes. Change how the shapes are drawn and you change the argument, without changing a single number.

The most common distortion is the easiest to see, so it gets the picture.

> _The original carries a diagram here. In words: Two bar charts side by side, each showing the same four bars in the same order, tallest on the left down to shortest on the right. The left chart's value axis starts at zero, marked with a small tick and the label zero at the foot of the axis. Its four bars are all clearly tall, and the shortest bar reaches a little over half the height of the tallest, so the four look broadly comparable with one leader. The right chart's axis starts partway up, marked with a tick and the label sixteen hundred at the foot of its axis, and its four bars are drawn from that raised baseline. On the right the tallest bar is nearly full height while the shortest bar has almost vanished, reduced to a thin sliver barely thicker than the baseline itself, and the two middle bars have shrunk unevenly, so the four now look like a runaway leader and a collapsed last place. The underlying numbers are identical in both charts._

**Every number on this page is real.** The same sixteen-row order table used across these guides. Four regions: East 3,040, South 2,670, North 2,495, West 1,685, totalling 9,890. Four months with orders in them: January 2,630, February 2,245, March 2,585, May 2,430, and no April rows at all. If you want the companion page on choosing a chart type in the first place, that is [choose the right chart](https://michaelnocito.github.io/analyst-prep-kit/guides/choose-the-right-chart/).

## 1. The truncated axis, and what it multiplies

Before the arithmetic: East billed 3,040 and West billed 1,685. Work out how many times bigger East is, then look again at the right-hand chart above and say what it appears to claim.

East is 3,040 ÷ 1,685 = **1.80 times** West. That is the fact. Now watch what the drawing does to it.

| Axis starts at | East bar height | West bar height | Apparent ratio       |
|----------------|-----------------|-----------------|----------------------|
| 0              | 3,040           | 1,685           | 1.80 times           |
| 1,600          | 1,440           | 85              | **16.94 times**      |
| 2,400          | 640             | −715            | West points downward |

A bar chart works by making length proportional to value, and that only holds if length is measured from zero. Cut the bottom off and the bar no longer represents the value, it represents the value minus wherever you started, which is a different quantity that nobody labelled.

Say out loud why this matters more for bars than for a line chart. A bar's whole job is to be compared by length against its neighbours, so its length must mean something. A line chart's job is to show change over time, and the reader compares slopes rather than distances from the bottom, so a line chart's axis can start somewhere else without the same damage. That is the honest exception, and it is the only one.

The version that catches people out most often is not deliberate. Every charting tool on the market picks axis limits automatically to fill the space, and several of them truncate by default. Nobody decided to exaggerate; the software optimized for filling a rectangle and the reader saw a claim.

## 2. Percent against percentage point

Before the distinction: a conversion rate goes from 4 percent to 5 percent. Say how much it improved, then notice that you had to pick which of two answers to give.

It rose by **1 percentage point** and by **25 percent**. Both true, same fact, and the second sounds twenty-five times better. Choosing the flattering one and not saying which you chose is the cheapest distortion available, and it needs no chart at all.

The rule is short. "Percentage points" is the difference between two percentages. "Percent" is the relative change from one to the other. A margin going from 38.6 percent to 40.6 percent gained 2 percentage points, or about 5 percent. Say which one you mean, every time, and prefer showing both rates side by side, because two rates cannot be misread.

This one is worth a slightly harder line than the others, because unlike a truncated axis it produces no visual clue at all. The reader has nothing to check.

## 3. The cherry-picked window, and the missing month

Before the numbers: here is our monthly revenue. Pick the two-month window that makes the business look best, then the one that makes it look worst, before reading on.
    
    
    January   2,630
    February  2,245     -14.6% against January
    March     2,585     +15.1% against February
    April         0     no orders at all
    May       2,430      -6.0% against March

February to March is up 15.1 percent. January to February is down 14.6 percent. January to May is down 7.6 percent. Every one of those is a true statement about the same four numbers, and each supports a different story. Nothing in the chart tells the reader which window was chosen or why.

The defence is not complicated: show the whole series you have, and if you must truncate it, say where the data starts and why. A chart that begins at a local low point is making a claim about the choice of start date that it has not stated.

Then there is April, which is the more interesting problem. There are no April orders. If you group by month and chart the result, most tools will draw four bars, January February March May, evenly spaced, with no gap. A reader looking at that chart sees a stable business. A calendar with a real April in it tells a different story.

| Month    | Revenue | Change without a calendar | Change with a calendar      |
|----------|---------|---------------------------|-----------------------------|
| February | 2,245   | −14.6%                    | −14.6%                      |
| March    | 2,585   | +15.1%                    | +15.1%                      |
| April    | none    | not drawn                 | −100%                       |
| May      | 2,430   | −6.0% against March       | undefined, dividing by zero |

A missing period is the one distortion that happens entirely by accident and misleads entirely by omission. Every month with no rows silently vanishes from a grouped result, which is why the fix is a date table joined to your data rather than anything to do with the chart. That mechanic is worked through in [month-over-month in Excel](https://michaelnocito.github.io/analyst-prep-kit/guides/excel-month-over-month/) and [the SQL version](https://michaelnocito.github.io/analyst-prep-kit/guides/sql-month-over-month/).

## 4. Shares that hide the total

Before the example: East is 30.7 percent of revenue and West is 17.0 percent. Say what those two numbers do not tell you, before reading on.

They do not tell you whether the business grew. A share is a ratio, and a ratio can move because its numerator moved, because its denominator moved, or because both did. East's share could rise while East's revenue falls, as long as everyone else falls faster.

Here are our four regions both ways.

| Region    | Revenue   | Share of total |
|-----------|-----------|----------------|
| East      | 3,040     | 30.7%          |
| South     | 2,670     | 27.0%          |
| North     | 2,495     | 25.2%          |
| West      | 1,685     | 17.0%          |
| **Total** | **9,890** | **100%**       |

A chart of the share column alone is not wrong, and it is incomplete in a specific way: it always adds to 100 percent no matter what happened to the business. Put the total somewhere on the chart, in the title if nowhere else. "Revenue by region, 9,890 total" costs seven characters and closes the gap.

## 5. Pie charts, and what angles cost the reader

Before the comparison: picture our four regions as a pie. Now picture them as four bars. Decide which one lets you rank South against North faster, before reading on.

The bars, and it is not close. South is 27.0 percent and North is 25.2 percent, a gap of 1.8 points. As bar lengths that is visible. As pie slices it is a difference of about six degrees of arc, and people cannot read six degrees.

This is not a matter of taste. Judging position along a common scale, which is what a bar chart asks of you, is something people do accurately. Judging angle and area, which is what a pie asks, is measurably worse, and the gap widens as the number of categories grows. That ranking of visual tasks is one of the most reproduced results in the field, and it is in the "why this works" section below.

Where a pie is fine: two or three categories, where the point is that something is roughly half or roughly a quarter, and nobody needs to rank anything. Where it fails: five or more slices, slices of similar size, comparing two pies to each other, or any pie exploded or tilted.

Now picture the last pie chart you saw in a deck. How many slices did it have, and could you have put them in order without reading the labels?

## 6. Area and 3D: doubling a length quadruples the ink

Before the arithmetic: you replace bars with pictures of desks, and you want one desk to represent twice as much as another. You scale the picture to twice the height, keeping it in proportion. Say what the reader sees, before reading on.

They see something four times as big, because scaling both the height and the width by 2 multiplies the area by 2 × 2 = **4**. The same trap catches circles: double the radius and the area goes up four times. A "bubble" chart where the bubble's radius is set to the value overstates every comparison, and correctly built bubble charts scale the area instead.

Three-dimensional bars and pies have the same problem with an extra layer. A 3D pie is tilted, so the slices nearer the front are drawn with visible depth and take up more of the image than their angle deserves. The slice at the front of a tilted pie can look half again as large as an identical slice at the back. There is no reading of a 3D chart that recovers the numbers, which is the reason to have no 3D charts.

The rule that covers all of this: encode value with one dimension, and let the other stay constant. Bars have equal widths for a reason.

## 7. Dual axes, and the correlation you drew yourself

Before the problem: you plot revenue and order count on one chart with two different value axes, one on each side. Say who chose where those two axes start and end.

You did, or your tool did on your behalf. And that choice decides whether the two lines appear to track each other, cross, or diverge. Slide one axis and the same two series can be made to look tightly linked or completely unrelated. Whatever relationship the reader perceives was authored, not measured.

Dual axes are not banned, and they are the wrong default. Three alternatives, in the order I reach for them:

**Two charts stacked** , sharing the same time axis. The reader compares shapes, and no false relationship is manufactured by scaling.

**Index both series to 100** at the start of the period. Now they are on one axis honestly, and the chart shows relative change, which is usually the actual question.

**Chart the ratio itself.** If revenue per order is what you care about, compute it and plot one line.

If you do use a dual axis, say so plainly in the title or subtitle, and never use one to imply causation. The general version of that mistake is in [correlation vs causation](https://michaelnocito.github.io/analyst-prep-kit/guides/correlation-vs-causation/), and a dual-axis chart is where it is most often committed with the best intentions.

## 8. Log scales: honest, and easy to misread

Before the case: your data runs from 100 to 10,000. On a normal axis, the small values are all squashed into a strip at the bottom. Say what a log scale changes, before reading on.

A log scale spaces values by ratio rather than by difference. Equal distances mean equal multiplications, so a tenfold rise always occupies the same height whether it is 100 to 1,000 or 1,000 to 10,000.
    
    
    values:      100    300   1000   3000  10000
    linear gaps:      200    700   2000   7000     <-- wildly uneven
    log10 gaps:     0.477  0.523  0.477  0.523     <-- near enough equal

That makes a log scale the right choice for anything spanning several orders of magnitude, and for anything where a percentage change is the interesting quantity. A constant growth rate is a straight line on a log scale and a curve on a linear one.

The misleading part is that most readers do not notice they are looking at one. On a log axis, a doubling looks modest and a curve that is exploding looks tame. Label it clearly, mark the axis with round multiples like 100, 1,000, 10,000, and say "log scale" in the subtitle. A log scale is honest and it needs a sign on it.

## The full before and after

Same data both times: revenue by region.

### Before
    
    
    Title:  "East is dominating"
    Chart:  3D bar chart, value axis running 1,600 to 3,100,
            bars ordered alphabetically, no total shown,
            y-axis labelled "Revenue" with no units.

Four separate problems, none of them a false number. The truncated axis turns a 1.8 ratio into 16.9. The 3D perspective makes the front bars larger than the back ones. Alphabetical ordering hides the ranking that the chart exists to show. And with no total, the reader cannot tell whether 3,040 is most of the business or a rounding error.

### After
    
    
    Title:     "East billed 3,040 of 9,890 in Q1, 1.8x West"
    Subtitle:  "16 orders, January to May 2026. No April orders."
    Chart:     Flat horizontal bars, axis from 0, sorted longest first,
               value labelled at the end of each bar.

The title makes the claim and puts the number in it. The subtitle says what the data is and flags the gap before anybody finds it. The bars are honest lengths, sorted so the ranking is the shape of the chart, and labelled so nobody has to measure. Same four numbers, and now the reader can disagree with the conclusion on the merits.

## Edge cases and honest exceptions

Six, including the cases where a rule bends.

**Line charts may start above zero.** The reader is judging slope, not length, and forcing zero on a stock price or a temperature series flattens the thing you are trying to show. Label the axis clearly and it is fine.

**Data that cannot be zero.** Body temperature, pH, a year number. Zero is not a meaningful baseline and forcing it produces a chart of nothing. Use a scale that fits the plausible range and say what it is.

**Sorting alphabetically when the question is ranking.** Not a distortion exactly, and it costs the reader the entire finding. Sort by the value being compared unless the categories have a natural order like months.

**Colour doing work it cannot do.** Around one man in twelve has some form of red-green colour deficiency, so a red-versus-green chart is unreadable for a meaningful share of any audience. Use position, labels or lightness for anything essential.

**Averages drawn without spread.** Four bars of group averages look like four facts. If one of them rests on three rows it is not one, and the chart gives no clue. This is the visual version of the problem in [mean vs median](https://michaelnocito.github.io/analyst-prep-kit/guides/mean-vs-median/).

**Precision that is not there.** A chart labelled to two decimal places on data with a wide interval is claiming a measurement it does not have. Round to what you can defend.

## Why this works

The ranking of visual tasks in section five is not opinion. Cleveland and McGill ran controlled experiments on how accurately people extract quantities from different graphical encodings, and produced an ordering: position along a common scale is judged most accurately, then length, then angle and slope, then area, then volume and colour saturation last (Cleveland & McGill, 1984, _Journal of the American Statistical Association_ , 79(387), 531–554). That single ordering explains why bars beat pies, why area encodings overstate, and why 3D makes everything worse. Heer and Bostock reproduced the results at scale with crowdsourced participants and found the ordering held, along with specific measurements of how much accuracy each encoding costs (Heer & Bostock, 2010, _Proceedings of CHI '10_ , 203–212).

The specific distortions on this page have been tested directly on readers. Pandey and colleagues showed people the same data drawn honestly and drawn with a truncated axis, an area-scaled encoding, or an inverted axis, then measured what the readers concluded. The distorted versions changed people's judgements of the message significantly, including for readers who were shown the axis labels (Pandey, Rall, Satterthwaite, Nov, & Bertini, 2015, _Proceedings of CHI '15_ , 1469–1478). Correll and colleagues examined the truncated axis case specifically, and found that while truncation reliably exaggerates perceived differences, the common remedies such as visible axis breaks do not fully undo the effect, which is the argument for starting bars at zero rather than for labelling the truncation well (Correll, Bertini, & Franconeri, 2020, _Proceedings of CHI '20_).

One note on why this page kept asking you to answer before showing you the answer. Attempting an answer before seeing the correct one reliably improves how well the correct one is retained, even when the attempt is wrong (Bisra, Liu, Nesbit, Salimi, & Winne, 2018, _Educational Psychology Review_ , 30(3), 703–725). The 16.94 figure sticks because you worked out the honest 1.80 first.

## Using this on your own work

Auditing every chart your organization has ever produced is miserable and you will stop at the fourth deck. Do this instead, in order.

  1. **Check the axis start** on every bar chart you make. If it is not zero, either fix it or have a reason you would say out loud.
  2. **Put the total in the title** whenever you chart shares. Seven characters, and the chart stops being able to hide a shrinking business.
  3. **Say "percentage points" when you mean them.** This one is a writing habit, not a charting habit, and it prevents the distortion no reader can catch.
  4. **Replace every pie of four or more slices** with a sorted bar chart. It is usually a two-click change and it is the biggest single improvement available.
  5. **Write the claim as the title.** "East billed 3,040 of 9,890" rather than "Revenue by region". A title that states the finding forces you to check that the chart supports it.

If you want to build the charts rather than read about them, the [Viz Drill](https://michaelnocito.github.io/analyst-prep-kit/viz/) gives you the fields and the shelves and asks you to make the chart yourself, which is where the axis question stops being abstract.

If you have paper nearby, one optional drawing is worth five minutes. Sketch our four regions as bars from zero, then sketch them again starting at 1,600. Watching West disappear under your own hand is a more durable memory than the ratio 16.94 will ever be.

**More detail on this, and more like it.** Every how-to sits in one place on the [guides index](https://michaelnocito.github.io/analyst-prep-kit/guides/): SQL, Python, Excel, statistics and the working habits around them.

## The whole thing on one screen

This is the retrieval sheet. Cover the right column, work down the left, and say each answer out loud before you check it.

| Distortion                  | What it does, and the fix                                                              |
|-----------------------------|----------------------------------------------------------------------------------------|
| Truncated bar axis          | 1.8 times became 16.9 times. Start bars at zero, always.                               |
| Line chart baseline         | The honest exception. Slope is the message, so zero is not required.                   |
| Percent vs percentage point | 4% to 5% is 1 point or 25%. Say which. Show both rates.                                |
| Cherry-picked window        | Same four months support +15.1%, −14.6% and −7.6%. Show the whole series.              |
| Missing period              | April has no rows and silently vanishes. Join a date table.                            |
| Shares without totals       | Always adds to 100% however the business went. Put the total in the title.             |
| Pie charts                  | Angles are read badly. Four or more slices: use sorted bars.                           |
| Area encoding               | Double the length, quadruple the area. Scale by area, or use bars.                     |
| 3D anything                 | Perspective enlarges the front. No reading recovers the numbers.                       |
| Dual axes                   | You authored the apparent relationship. Stack two charts or index to 100.              |
| Log scales                  | Honest for wide ranges, and label them. A doubling looks small.                        |
| Alphabetical sorting        | Hides the ranking the chart exists to show. Sort by value.                             |
| Red against green           | Unreadable for around one man in twelve. Use position or lightness.                    |
| Averages with no counts     | A bar built on three rows looks like a bar built on three thousand.                    |
| The thirty-second check     | Where does the axis start, what range is shown, is anything an area.                   |
| The title test              | Write the claim as the title. If the chart does not support it, you found the problem. |

**The one habit to keep.** Before any chart leaves your hands, answer three questions: where does the value axis start, what time range is shown, and is anything encoded as area. Thirty seconds, and it catches most of this page. If a chart misleads in a way this page does not cover, there is a general [diagnosis loop for being stuck](https://michaelnocito.github.io/analyst-prep-kit/guides/technical-tenacity/).

One last thought, and I would genuinely like other people's answers. The first misleading chart I ever shipped had an axis my tool truncated for me, and nobody caught it including me, until somebody quoted the exaggerated gap back to me in a meeting. What is the chart in your own work you would want to redraw from zero before anyone quotes it?

## References

  * Cleveland, W. S., & McGill, R. (1984). Graphical perception: Theory, experimentation, and application to the development of graphical methods. _Journal of the American Statistical Association_ , 79(387), 531–554.
  * Heer, J., & Bostock, M. (2010). Crowdsourcing graphical perception: Using Mechanical Turk to assess visualization design. _Proceedings of the SIGCHI Conference on Human Factors in Computing Systems (CHI '10)_ , 203–212.
  * Pandey, A. V., Rall, K., Satterthwaite, M. L., Nov, O., & Bertini, E. (2015). How deceptive are deceptive visualizations? An empirical analysis of common distortion techniques. _Proceedings of the SIGCHI Conference on Human Factors in Computing Systems (CHI '15)_ , 1469–1478.
  * Correll, M., Bertini, E., & Franconeri, S. (2020). Truncating the Y-axis: Threat or menace? _Proceedings of the SIGCHI Conference on Human Factors in Computing Systems (CHI '20)_.
  * Bisra, K., Liu, Q., Nesbit, J. C., Salimi, F., & Winne, P. H. (2018). Inducing self-explanation: A meta-analysis. _Educational Psychology Review_ , 30(3), 703–725.

---

*The full version of this guide lives on my site: [How Charts Mislead: Eight Distortions, Worked on One Real Table](https://michaelnocito.github.io/analyst-prep-kit/guides/how-charts-mislead/).*

*If it was useful: [Buy Me a Coffee](https://buymeacoffee.com/michaelnocito).*
