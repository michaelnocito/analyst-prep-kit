By the end of this page you can pick the right chart in about five seconds, by asking one question: what comparison must the reader make? The four possible answers each map to one chart, and you will also know the two miscasts that cause most bad charts, the axis rules that keep bars honest, and the escape hatch for when one chart holds too much. It is about twenty minutes.

Here is what to actually do with it today. Open the last chart you made. Say out loud what the reader is supposed to compare in it. If the chart type does not match that comparison in the table below, remake it. It is usually a two-minute fix.

The short version: comparison across categories takes a bar. Change over time takes a line. Relationship between two measures takes a scatter. Part of a whole takes a bar too, once you pass a few slices.

One picture carries the fork, so it comes first.

> _The original carries a diagram here. In words: A decision fork. On the left, a single rounded node contains the question: compare what? Four lines branch from it to four small chart pictures on the right, stacked vertically. The first branch, labelled categories, leads to a miniature bar chart with four vertical bars of different heights. The second branch, labelled time, leads to a miniature line chart with a single rising line over an axis. The third branch, labelled relationship, leads to a miniature scatter plot of dots drifting upward to the right. The fourth branch, labelled parts, leads to a miniature horizontal stacked bar divided into segments, drawn next to a small crossed-out pie, meaning that for part-of-whole comparisons a bar is preferred over a pie. The picture says that the single question of what the reader must compare selects one of four chart types._

**Every number on this page is computed.** The example tables are shown in full, and every total, percentage, and correlation was verified by running the arithmetic in Python before it went on the page.

## 1. The one question, and the decision table

Before the explanation: two analysts get the same table of revenue by region. One makes a bar chart, one makes a pie. What question would decide who is right?

Not "what does the data look like". The deciding question is about the reader: **what comparison must the reader make?** A chart is a machine for making one comparison easy, and the chart type is chosen by that comparison, not by the shape of the table.

Here is the fork laid out fully, because it is the decision the whole page hangs on. The question: what must the reader compare? The four possible answers, and what each one means for you: values across categories, which needs lengths the eye can rank, so a bar. Change over time, which needs slope the eye can follow, so a line. Whether two measures move together, which needs one dot per record, so a scatter. Or shares of a total, which needs parts against a whole, and past a few slices that job also goes to a bar. What decides between them is only which comparison the reader must make first. It matters because the same table drawn with the wrong machine makes the right comparison hard and a wrong one easy.

| The reader must compare  | Chart                               | What the eye uses             | Example question                     |
|--------------------------|-------------------------------------|-------------------------------|--------------------------------------|
| Values across categories | Bar                                 | Length from a shared baseline | Which region sold most?              |
| Change over time         | Line                                | Slope                         | Are signups accelerating?            |
| Two measures, together   | Scatter                             | Position of dots              | Do bigger stores sell more per head? |
| Parts of a whole         | Bar (pie only up to 3 or so slices) | Length, not angle             | Which lines carry most of revenue?   |

If the reader must make two different comparisons, that is two charts, not one clever one. Section 7 covers the honest way to do that.

## 2. Categories: the bar chart, and how to make it readable

Before the explanation: here is quarterly revenue for five sales channels, in thousands. Which two are hardest to tell apart, and what would make that comparison instant?

| Channel | Revenue ($k) |
|---------|--------------|
| North   | 412          |
| South   | 388          |
| East    | 341          |
| West    | 296          |
| Online  | 268          |

The comparison is across categories, so this is a bar chart. The reason bars work is mechanical: every bar starts from the same baseline, so comparing values reduces to comparing lengths, and ranking lengths from a shared start is one of the judgements human eyes make most accurately. North against South is a 24 thousand dollar gap on 388, a 6.2% difference, and side-by-side bars from the same baseline make even that small gap visible.

Three habits turn a default bar chart into a readable one.

  * **Sort by value** , not alphabetically, unless the categories have a real order. Sorted bars answer "which is biggest, which is next" before the reader asks.
  * **Go horizontal when labels are long.** Category names read flat, nobody tilts their head, and ten categories fit without abbreviation.
  * **Put the number at the end of the bar** when there are few bars. The chart carries the ranking, the label carries the value, and the axis can retire.

Total across the five channels is 1,705 thousand. Keep totals like that in the subtitle or a caption, because a bar chart of parts does not show its own sum.

## 3. Time: the line chart, and the first miscast

Before the explanation: monthly signups run 180, 176, 189, 197, 214, 222, 241, 238, 260, 271, 266, 290 from January to December. What is the one thing a reader should take from that series, and which visual feature carries it?

The takeaway is growth: 180 to 290 is a 61.1% rise across the year, climbing steadily with small monthly wobbles. The feature that carries it is slope. A line chart connects the months in order, and the eye reads the tilt of the line as speed of change directly. That is the whole reason time gets a line: the horizontal axis has a true order, so connecting the points draws the trend itself.

Which brings up the first of the two great miscasts. **A line chart across categories implies an order that is not there.** Draw North, South, East, West, Online as points and connect them with a line, and the line manufactures a journey: revenue "falls" from North to Online, as if the regions were stops on a route. The slope the eye reads so well is now reporting a relationship that does not exist, because nothing travels from North to South. Categories are not ordered, so nothing may connect them. The moment the horizontal axis stops being time or another true sequence, the line comes off and the bars go on.

The reverse swap is milder but real: bars across many time periods turn a trend into a picket fence, and the eye compares individual posts instead of following the path. Use bars for time only when the periods are few and the question is "this quarter against last quarter", a single comparison rather than a trajectory.

## 4. Relationship: the scatter plot

Before the explanation: ten stores, two measures each: staff on shift and weekly sales in thousands. Staff of 4, 5, 5, 6, 7, 8, 9, 10, 11, 12 against sales of 21, 24, 26, 27, 33, 34, 40, 42, 46, 49. What question does this table ask that neither a bar nor a line can answer?

The question is whether the two measures move together, and the scatter plot is the only chart in the set built for it. One dot per store, staff on one axis, sales on the other. No baseline, no time, just position. The eye reads the cloud's shape: drifting up and to the right means the measures rise together, and how tightly the dots hug a line is the strength of the relationship. For these ten stores the pattern is very tight: the correlation computes to 0.99, nearly a straight line.

The scatter is also the chart most likely to be over-read, because a clean rising cloud whispers "staff cause sales". A scatter shows association only. Busy stores may get more staff precisely because they sell more, or a third thing, like location, may drive both. The chart cannot pick between those stories, and [correlation vs causation](https://michaelnocito.github.io/analyst-prep-kit/guides/correlation-vs-causation/) is the page for telling them apart before anyone acts on the cloud.

Picture your own data for a second: two numeric columns you have quietly wondered about, one dot per row. That mental image, and whether a shape appears in it, is the fastest analysis step you own.

## 5. Parts of a whole: why the bar beats the pie past a few slices

Before the explanation: nine product lines share revenue as 14, 13, 12, 11, 11, 10, 10, 10, and 9 percent, which sums to 100. On a pie, could you rank the top four slices by eye?

Almost nobody can, and the reason is worth owning because it explains half of chart design. A pie encodes each value as an **angle** , the width of the wedge at the centre. A bar encodes the same value as a **length** from a shared baseline. Human vision judges lengths against a common baseline far more accurately than it judges angles: in Cleveland and McGill's experiments, position and length judgements produced markedly smaller errors than angle judgements of the same values (Cleveland & McGill, 1984, _Journal of the American Statistical Association_ , 79(387), 531–554). The pie is not ugly. It is asking the eye to do the measurement it is worst at.

Say in your own words why nine near-equal wedges are the worst case for angles before reading on. If you can say it, the pie rule stops being a rule and becomes a consequence.

Here is my version. Ranking wedges means comparing 14% of a circle with 13% of a circle, a difference of 3.6 degrees of arc, between wedges that start at different rotations. The same values as bars differ by a visible step in length from the same starting line. The comparison the reader must make, ranking parts, is a length job.

The honest scope of the pie: two or three slices, where the question is only "is this half, more than half, or less". "Support is about a third of tickets" survives as a pie. Nine slices never does.

## 6. The axis rules: when zero is mandatory and when zooming is fine

Before the explanation: two bars, 62 and 68. The chart's axis starts at 60 instead of 0. How big does the difference look, and how big is it?

Drawn from a baseline of 60, the first bar has length 2 and the second has length 8, so the second bar is four times as long. The real difference is 68 against 62: 9.7%. The chart shows 4x where the data says under 10%, and the reader's eye believes the chart, because in a bar chart **length encodes value**. Cut the bottom off the bars and you have cut the values themselves. So the rule is absolute for bars: the value axis starts at zero, every time, no exceptions for tight ranges. If the differences vanish at zero, that is the finding, or the wrong chart type is on duty.

A line chart lives under a different rule, and the reason is the encoding. A line encodes change as **slope** , not as distance from the floor. Zooming the axis of a line chart stretches the slopes so real movement becomes visible, and no length is being lied about because no length is being read. A line of daily temperatures plotted from zero kelvin would be perfectly honest and perfectly useless. Zoom the line, label the axis clearly, and keep zero for the bars.

Name the fork when you feel the urge to truncate: the question is which visual feature the reader is measuring. If it is length, zero is mandatory. If it is slope, zooming is legitimate. What decides is the chart type already on the page, and it matters because a truncated bar is the single most common way an honest analyst publishes a misleading chart.

## 7. The escape hatch: small multiples

Before the explanation: monthly trend lines for five regions on one chart is readable. For twelve regions it is a tangle. What could you change without dropping a single region?

Split one crowded chart into a grid of small identical ones: same chart type, same axes, same scale, one panel per region. The technique is called **small multiples** , and it is the standing answer whenever one chart is asked to hold too much. The reader learns to read one panel, then reads the other eleven for nothing, because every panel works identically. Comparison across panels stays honest because the scales match.

The trigger signs: more than about five lines on one line chart, a grouped bar chart three groups deep, or any legend you have to keep re-checking. Each of those is one chart trying to answer "compare across categories" and "compare over time" at once. Small multiples give each comparison its own chart and tile them.

The one discipline that makes them work: identical scales on every panel. The moment each panel scales itself, cross-panel comparison quietly breaks, and that comparison was the reason for the grid.

## 8. The full before and after

Same data both times: the nine product lines from section 5.

### Before
    
    
    Chart:  pie, nine slices, one colour per line
    Order:  as the rows came out of the query
    Title:  "Revenue Share by Product Line"
    Legend: nine entries, matched to slices by colour

The reader's task: match nine colours between legend and wedges, then rank nine angles between 9% and 14% by eye. Nobody completes that task. They read the title, look at the circle, and leave with "revenue is split up", which was true before the chart existed.

### After
    
    
    Chart:  horizontal bar, sorted largest first, axis at zero
    Labels: value at the end of each bar, no legend
    Title:  "Top three lines hold 39% of revenue"
    
    Licences      14
    Support       13
    Training      12
    Consulting    11
    Hosting       11
    Hardware      10
    Integrations  10
    Templates     10
    Other          9

Same nine numbers. The ranking is now instant because it is a length comparison from a shared baseline, the legend is gone because the labels sit on the bars, and the title states the finding: the top three lines, 14 plus 13 plus 12, hold 39% of revenue. Titling the claim instead of the column names is its own habit with its own page, [label the claim, not the data](https://michaelnocito.github.io/analyst-prep-kit/guides/excel-label-rows-before-charting/). A chart titled with its finding gets that finding remembered. A chart titled with its column names gets skimmed.

## 9. Edge cases: the miscasts, named

Before the explanation: most bad charts are not exotic. They are one of about five repeat offenders. How many can you name before the list?

**The line across categories.** The first great miscast, from section 3. Connecting unordered categories manufactures a trend out of nothing. If the horizontal axis is not a true sequence, no line.

**The nine-slice pie.** The second great miscast, from section 5. Part-of-whole with more than about three parts is a length job, so it is a sorted bar.

**The truncated bar axis.** A 9.7% difference drawn as 4x. Bars start at zero because length encodes value.

**The double axis.** Two measures, two vertical scales, one chart. The crossing points and gaps between the lines are artifacts of two arbitrary scale choices, and the reader cannot help reading them as events. If the two measures are related, that is a scatter. If they share units, share one axis. Otherwise, two panels.

**The spaghetti line chart.** Eight or more lines, one chart, one legend doing all the work. This is the small-multiples trigger from section 7. Alternatively, grey out every line but the one or two the claim is about.

**The decorated third dimension.** Tilted 3D bars and pies change the drawn lengths and angles the reader is trying to measure, for zero information. Depth that does not encode data only distorts the encodings that do.

## Why this works

The one-question method is a compression of a real result, not a style preference. Cleveland and McGill ranked the basic visual encodings by how accurately people extract numbers from them, in controlled experiments: position along a common scale came first, then length, with angle, area, and shading well behind (Cleveland & McGill, 1984, _Journal of the American Statistical Association_ , 79(387), 531–554). Every recommendation on this page is that ranking applied: bars win categories because they use length from a shared baseline, pies lose past a few slices because they use angle, bar axes must include zero because truncation falsifies the length, and lines may zoom because slope, not length, carries their meaning.

The reason this page keeps asking you to answer before it explains is also a measured effect. Prompting a learner to generate an explanation before receiving one reliably improves understanding and retention, across a large body of controlled studies (Bisra, Liu, Nesbit, Salimi, & Winne, 2018, _Educational Psychology Review_ , 30(3), 703–725). Committing to "which two channels are hardest to tell apart" before the answer is why the sorted-bar habit will surface the next time you chart real data.

## Using this on your own project

Reworking every chart in an old dashboard in one sitting is miserable, and you will stop at the third one. Do this instead, in order.

  1. **Take one chart you have already shipped** and say out loud what the reader must compare in it. If you cannot say it in one sentence, that is the finding: the chart has no job yet.
  2. **Check it against the decision table.** Comparison and chart type match: leave it alone. Mismatch: remake it, which is usually one dropdown in Excel or Tableau.
  3. **Run the axis check.** Bars: does the value axis start at zero? Lines: is the zoom showing real change, and is the axis labelled so nobody mistakes the zoom?
  4. **Retitle it with the claim** , a sentence with a number in it, and sort bars by value while you are there.
  5. **Only then move to the next chart.** One chart per day fixes a dashboard in two weeks without the misery.

If you have paper nearby, one optional drawing is worth five minutes. Draw the fork from the figure yourself, from memory: the question in the middle, four branches, a tiny chart sketched at the end of each. The point is not the drawing. Reproducing the fork without looking is the test of whether you own it, and the version in your handwriting is the one you will actually recall in a meeting. Reading charts fast is its own trainable skill, and [Viz Drill](https://michaelnocito.github.io/analyst-prep-kit/viz/) is built for exactly those reps.

**More detail on this, and more like it.** Every how-to sits in one place on the [guides index](https://michaelnocito.github.io/analyst-prep-kit/guides/): SQL, charts, statistics, Tableau, and the working habits around them.

## The whole thing on one screen

This is the retrieval sheet. Cover the right column, work down the left, and say each answer out loud before you check it.

| Situation                      | The move                                                     |
|--------------------------------|--------------------------------------------------------------|
| The one question               | What comparison must the reader make?                        |
| Values across categories       | Bar, sorted by value, from a zero baseline.                  |
| Change over time               | Line. Slope carries the meaning.                             |
| Two measures, together         | Scatter, one dot per record. Association only, never cause.  |
| Parts of a whole, 2 or 3 parts | Pie is acceptable. "About a third" survives.                 |
| Parts of a whole, more parts   | Sorted bar. Ranking parts is a length job, not an angle job. |
| Long category labels           | Horizontal bars. Labels read flat.                           |
| Bar chart axis                 | Starts at zero, always. Length encodes value.                |
| Line chart axis                | May zoom. Slope encodes change, and no length is being read. |
| Line across categories         | Miscast. It implies an order that is not there. Use bars.    |
| Nine-slice pie                 | Miscast. Use a sorted bar.                                   |
| Two vertical scales, one chart | Split into two panels, or use a scatter.                     |
| Too many lines or bars         | Small multiples: identical panels, identical scales.         |
| Chart title                    | The claim, with a number in it, not the column names.        |

**The one habit to keep.** If you take nothing else from this page, ask "what must the reader compare?" out loud before the chart menu opens, and let the answer pick the chart. The expensive charting mistakes are never in the software. They are in skipping the question.

One last thought, and I would genuinely like other people's answers. The chart that taught me this was a line chart of survey scores across nine departments, and I stared at its "trend" for a full minute before noticing the axis was alphabetical. What is the longest a miscast chart has survived in something you inherited, and who finally caught it?

## References

  * Cleveland, W. S., & McGill, R. (1984). Graphical perception: Theory, experimentation, and application to the development of graphical methods. _Journal of the American Statistical Association_ , 79(387), 531–554.
  * Bisra, K., Liu, Q., Nesbit, J. C., Salimi, F., & Winne, P. H. (2018). Inducing self-explanation: A meta-analysis. _Educational Psychology Review_ , 30(3), 703–725.

---

*The full version of this guide lives on my site: [How to Choose the Right Chart: One Question About Your Data](https://michaelnocito.github.io/analyst-prep-kit/guides/choose-the-right-chart/).*

*If it was useful: [Buy Me a Coffee](https://buymeacoffee.com/michaelnocito).*
